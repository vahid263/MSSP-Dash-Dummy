// app/services/clientOnboardingService.ts

// Synopsis MSP Tenant Configuration
export const SYNOPSIS_MSP_CONFIG = {
  authEmail: process.env.NEXT_PUBLIC_SYNOPSIS_AUTH_EMAIL || 'cloudflaremsp@synopsis-tech.net',
  authKey: process.env.NEXT_PUBLIC_SYNOPSIS_AUTH_KEY || '',
  tenantUnitId: process.env.NEXT_PUBLIC_SYNOPSIS_TENANT_UNIT_ID || '',
};

// Type definitions for Cloudflare API responses
interface CloudflareError {
  code: number;
  message: string;
}

interface CloudflareApiResponse<T = any> {
  success: boolean;
  errors?: CloudflareError[];
  messages?: string[];
  result?: T;
}

interface AccountResult {
  id: string;
  name: string;
  type: string;
  settings: {
    enforce_twofactor: boolean;
  };
}

interface ZoneResult {
  id: string;
  name: string;
  status: string;
  account: {
    id: string;
    name: string;
  };
}

interface SubscriptionResult {
  id: string;
  rate_plan: {
    id: string;
    name: string;
  };
  component_values?: Array<{
    name: string;
    value: number;
  }>;
}

interface UserResult {
  id: string;
  email: string;
  roles: string[];
}

export interface OnboardingCredentials {
  authEmail: string;
  authKey: string;
  tenantUnitId: string;
}

// Zero Trust Plan Types
export type ZeroTrustPlanType = 'none' | 'essential' | 'advanced' | 'premier' | 'essential-plus' | 'advanced-plus' | 'premier-plus' | 'alacarte';

export type AlaCartePlan = 'access' | 'gateway' | 'browser-isolation' | 'area1' | 'casb' | 'dlp';

export interface ClientOnboardingData {
  // Account Details
  accountName: string;
  accountType: 'standard' | 'enterprise';
  
  // Business Information (KYC)
  businessName?: string;
  businessEmail?: string;
  businessAddress?: string;
  businessPhone?: string;
  externalMetadata?: string;
  
  // Customer User Details
  customerEmail: string;
  customerRole: string;
  
  // Zone Information
  domainName: string;
  
  // Zero Trust Configuration
  zeroTrustPlan: ZeroTrustPlanType;
  zeroTrustSeats?: number;
  
  // A la Carte Configuration (if zeroTrustPlan === 'alacarte')
  alaCarteServices?: AlaCartePlan[];
  
  // Add-on Configuration
  addOns?: {
    browserIsolation?: number; // Number of seats for RBI add-on
    casb?: boolean; // 0 or 1 (enabled/disabled)
    dlp?: boolean; // 0 or 1 (enabled/disabled)
  };
}

export interface OnboardingStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  result?: any;
  error?: string;
}

export interface OnboardingProgress {
  steps: OnboardingStep[];
  currentStep: number;
  isCompleted: boolean;
  accountId?: string;
  zoneId?: string;
  nameServers?: {
    nameServer1: string;
    nameServer2: string;
  };
}

class ClientOnboardingService {
  private baseUrl = 'https://api.cloudflare.com/client/v4';
  private credentials: OnboardingCredentials;

  constructor(credentials: OnboardingCredentials) {
    this.credentials = credentials;
  }

  public async makeRequest<T = any>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<CloudflareApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-auth-email': this.credentials.authEmail,
        'x-auth-key': this.credentials.authKey,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json() as CloudflareApiResponse;
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].message;
        }
      } catch {
        // If JSON parsing fails, use the default error message
      }
      
      throw new Error(errorMessage);
    }

    return response.json() as Promise<CloudflareApiResponse<T>>;
  }

  async getTenantDetails() {
    return this.makeRequest('/user/tenants', 'GET');
  }

  async createCustomerAccount(data: ClientOnboardingData): Promise<CloudflareApiResponse<AccountResult>> {
    const accountPayload: any = {
      name: data.accountName,
      type: data.accountType,
      unit: {
        id: this.credentials.tenantUnitId
      }
    };

    // Add KYC information if provided
    if (data.businessName) accountPayload.business_name = data.businessName;
    if (data.businessEmail) accountPayload.business_email = data.businessEmail;
    if (data.businessAddress) accountPayload.business_address = data.businessAddress;
    if (data.businessPhone) accountPayload.business_phone = data.businessPhone;
    if (data.externalMetadata) accountPayload.external_metadata = data.externalMetadata;

    return this.makeRequest<AccountResult>('/accounts', 'POST', accountPayload);
  }

  async addUserToAccount(accountId: string, customerEmail: string, role: string = 'Administrator'): Promise<CloudflareApiResponse<UserResult>> {
    const userPayload = {
      email: customerEmail,
      roles: [role]
    };

    return this.makeRequest<UserResult>(`/accounts/${accountId}/members`, 'POST', userPayload);
  }

  async createZone(accountId: string, domainName: string): Promise<CloudflareApiResponse<ZoneResult>> {
    const zonePayload = {
      name: domainName,
      account: {
        id: accountId
      }
    };

    return this.makeRequest<ZoneResult>('/zones', 'POST', zonePayload);
  }

  async getZoneSubscription(zoneId: string): Promise<CloudflareApiResponse<SubscriptionResult>> {
    return this.makeRequest<SubscriptionResult>(`/zones/${zoneId}/subscription`, 'GET');
  }

  async createOrUpdateZoneSubscription(zoneId: string): Promise<CloudflareApiResponse<SubscriptionResult>> {
    const subscriptionPayload = {
      rate_plan: {
        id: "partners_biz"
      }
    };

    try {
      // Try to get existing subscription first
      const existingSubscription = await this.getZoneSubscription(zoneId);
      
      if (existingSubscription.success && existingSubscription.result) {
        // Update existing subscription
        return this.makeRequest<SubscriptionResult>(`/zones/${zoneId}/subscription`, 'PUT', subscriptionPayload);
      }
    } catch (error) {
      // If getting subscription fails, proceed with creating new one
    }

    // Create new subscription
    return this.makeRequest<SubscriptionResult>(`/zones/${zoneId}/subscription`, 'POST', subscriptionPayload);
  }

  private getZeroTrustComponentValues(data: ClientOnboardingData): Array<{ name: string; value: number }> {
    const components = [
      { name: 'users', value: data.zeroTrustSeats || 10 }
    ];

    switch (data.zeroTrustPlan) {
      case 'essential':
      case 'essential-plus':
        components.push(
          { name: 'browser_isolation_adv', value: 0 },
          { name: 'casb', value: 0 },
          { name: 'dlp', value: 0 }
        );
        break;

      case 'advanced':
      case 'advanced-plus':
        components.push(
          { name: 'browser_isolation_adv', value: 0 },
          { name: 'casb', value: 1 },
          { name: 'dlp', value: 1 }
        );
        break;

      case 'premier':
      case 'premier-plus':
        components.push(
          { name: 'browser_isolation_adv', value: data.addOns?.browserIsolation || 0 },
          { name: 'casb', value: 1 },
          { name: 'dlp', value: 1 }
        );
        break;

      case 'alacarte':
        // For a la carte, we'll handle specific services
        components.push(
          { name: 'browser_isolation_adv', value: data.alaCarteServices?.includes('browser-isolation') ? (data.zeroTrustSeats || 10) : 0 },
          { name: 'casb', value: data.alaCarteServices?.includes('casb') ? 1 : 0 },
          { name: 'dlp', value: data.alaCarteServices?.includes('dlp') ? 1 : 0 }
        );
        break;

      default:
        components.push(
          { name: 'browser_isolation_adv', value: 0 },
          { name: 'casb', value: 0 },
          { name: 'dlp', value: 0 }
        );
    }

    // Apply add-on overrides for bundled plans
    if (['essential', 'advanced', 'premier', 'essential-plus', 'advanced-plus', 'premier-plus'].includes(data.zeroTrustPlan)) {
      if (data.addOns?.browserIsolation !== undefined) {
        const browserIsolationIndex = components.findIndex(c => c.name === 'browser_isolation_adv');
        if (browserIsolationIndex >= 0) {
          components[browserIsolationIndex].value = data.addOns.browserIsolation;
        }
      }
      
      if (data.addOns?.casb !== undefined) {
        const casbIndex = components.findIndex(c => c.name === 'casb');
        if (casbIndex >= 0) {
          components[casbIndex].value = data.addOns.casb ? 1 : 0;
        }
      }
      
      if (data.addOns?.dlp !== undefined) {
        const dlpIndex = components.findIndex(c => c.name === 'dlp');
        if (dlpIndex >= 0) {
          components[dlpIndex].value = data.addOns.dlp ? 1 : 0;
        }
      }
    }

    return components;
  }

  async createZeroTrustSubscription(accountId: string, data: ClientOnboardingData): Promise<CloudflareApiResponse<SubscriptionResult>> {
    if (data.zeroTrustPlan === 'none') {
      throw new Error('No Zero Trust plan selected');
    }

    const componentValues = this.getZeroTrustComponentValues(data);

    const subscriptionPayload = {
      rate_plan: {
        id: 'TEAMS_ENT'
      },
      component_values: componentValues
    };

    return this.makeRequest<SubscriptionResult>(`/accounts/${accountId}/subscriptions`, 'POST', subscriptionPayload);
  }

  async onboardClient(data: ClientOnboardingData, progressCallback?: (progress: OnboardingProgress) => void): Promise<OnboardingProgress> {
    const progress: OnboardingProgress = {
      steps: [
        { id: 'create-account', name: 'Create Customer Account', status: 'pending' },
        { id: 'add-user', name: 'Add Customer User', status: 'pending' },
        { id: 'create-zone', name: 'Create Domain Zone', status: 'pending' },
        { id: 'apply-plan', name: 'Apply MSSP Rate Plan', status: 'pending' },
        ...(data.zeroTrustPlan !== 'none' ? [{ id: 'zero-trust', name: 'Configure Zero Trust', status: 'pending' as const }] : [])
      ],
      currentStep: 0,
      isCompleted: false
    };

    try {
      // Step 1: Create Customer Account
      progress.steps[0].status = 'in-progress';
      progressCallback?.(progress);

      const accountResult = await this.createCustomerAccount(data);
      progress.steps[0].status = 'completed';
      progress.steps[0].result = accountResult;
      progress.accountId = accountResult.result?.id;
      progress.currentStep = 1;
      progressCallback?.(progress);

      // Step 2: Add User to Account
      progress.steps[1].status = 'in-progress';
      progressCallback?.(progress);

      const userResult = await this.addUserToAccount(
        progress.accountId!,
        data.customerEmail,
        data.customerRole
      );
      progress.steps[1].status = 'completed';
      progress.steps[1].result = userResult;
      progress.currentStep = 2;
      progressCallback?.(progress);

      // Step 3: Create Zone
      progress.steps[2].status = 'in-progress';
      progressCallback?.(progress);

      const zoneResult = await this.createZone(progress.accountId!, data.domainName);
      progress.steps[2].status = 'completed';
      progress.steps[2].result = zoneResult;
      progress.zoneId = zoneResult.result?.id;
      progress.currentStep = 3;
      progressCallback?.(progress);

      // Step 4: Apply MSSP Rate Plan (partners_biz)
      progress.steps[3].status = 'in-progress';
      progressCallback?.(progress);

      const planResult = await this.createOrUpdateZoneSubscription(progress.zoneId!);
      progress.steps[3].status = 'completed';
      progress.steps[3].result = planResult;
      progress.currentStep = 4;
      progressCallback?.(progress);

      // Step 5: Zero Trust (if enabled)
      if (data.zeroTrustPlan !== 'none') {
        progress.steps[4].status = 'in-progress';
        progressCallback?.(progress);

        const ztResult = await this.createZeroTrustSubscription(progress.accountId!, data);
        progress.steps[4].status = 'completed';
        progress.steps[4].result = ztResult;
        progress.currentStep = 5;
        progressCallback?.(progress);
      }

      progress.isCompleted = true;
      progressCallback?.(progress);

      return progress;

    } catch (error) {
      const currentStep = progress.steps[progress.currentStep];
      if (currentStep) {
        currentStep.status = 'error';
        currentStep.error = error instanceof Error ? error.message : 'Unknown error';
      }
      progressCallback?.(progress);
      throw error;
    }
  }

  // Helper method to validate Zero Trust configuration
  validateZeroTrustConfig(data: ClientOnboardingData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.zeroTrustPlan === 'alacarte') {
      if (!data.alaCarteServices || data.alaCarteServices.length === 0) {
        errors.push('Please select at least one a la carte service');
      }

      // Check for invalid combinations
      if (data.alaCarteServices?.includes('access') && data.alaCarteServices?.includes('gateway')) {
        errors.push('Cannot combine Access and Gateway a la carte. Use bundled Zero Trust plan instead.');
      }

      if (data.alaCarteServices && data.alaCarteServices.length > 1) {
        const invalidCombinations = data.alaCarteServices.filter(service => 
          ['access', 'gateway'].includes(service)
        );
        if (invalidCombinations.length > 0) {
          errors.push('A la carte plans cannot be combined. Choose bundled plan for multiple services.');
        }
      }
    }

    // Validate add-ons
    if (data.addOns?.browserIsolation && data.addOns.browserIsolation > (data.zeroTrustSeats || 0)) {
      errors.push('Browser Isolation seats cannot exceed Zero Trust seats');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default ClientOnboardingService;