// app/utils/apiConfig.ts

import { SYNOPSIS_MSP_CONFIG } from '@/app/services/clientOnboardingService';

export interface APIValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates Synopsis MSP API configuration
 * @returns Validation result with errors and warnings
 */
export function validateSynopsisMSPConfig(): APIValidationResult {
  const result: APIValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check for required environment variables
  if (!SYNOPSIS_MSP_CONFIG.authEmail) {
    result.errors.push('NEXT_PUBLIC_SYNOPSIS_AUTH_EMAIL is not configured');
    result.isValid = false;
  }

  if (!SYNOPSIS_MSP_CONFIG.authKey) {
    result.errors.push('NEXT_PUBLIC_SYNOPSIS_AUTH_KEY is not configured');
    result.isValid = false;
  }

  if (!SYNOPSIS_MSP_CONFIG.tenantUnitId) {
    result.errors.push('NEXT_PUBLIC_SYNOPSIS_TENANT_UNIT_ID is not configured');
    result.isValid = false;
  }

  // Validate email format
  if (SYNOPSIS_MSP_CONFIG.authEmail && 
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SYNOPSIS_MSP_CONFIG.authEmail)) {
    result.errors.push('Synopsis auth email format is invalid');
    result.isValid = false;
  }

  // Check for placeholder values
  if (SYNOPSIS_MSP_CONFIG.authEmail === 'cloudflare_admin@synopsis.com') {
    result.warnings.push('Using example auth email - replace with actual Synopsis MSP email');
  }

  if (SYNOPSIS_MSP_CONFIG.authKey === 'your_global_api_key_here') {
    result.errors.push('Using placeholder API key - replace with actual Synopsis MSP API key');
    result.isValid = false;
  }

  if (SYNOPSIS_MSP_CONFIG.tenantUnitId === 'your_tenant_unit_id_here') {
    result.errors.push('Using placeholder tenant unit ID - replace with actual Synopsis MSP tenant unit ID');
    result.isValid = false;
  }

  // Check API key format (basic validation)
  if (SYNOPSIS_MSP_CONFIG.authKey && 
      SYNOPSIS_MSP_CONFIG.authKey !== 'your_global_api_key_here' &&
      SYNOPSIS_MSP_CONFIG.authKey.length < 32) {
    result.warnings.push('API key appears to be too short - verify it is the Global API Key');
  }

  return result;
}

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

interface TenantInfo {
  id: string;
  name: string;
  units?: Array<{
    id: string;
    name: string;
  }>;
}

/**
 * Tests connection to Cloudflare API with Synopsis MSP credentials
 * @returns Promise with connection test result
 */
export async function testSynopsisMSPConnection(): Promise<{
  success: boolean;
  error?: string;
  tenantInfo?: TenantInfo[];
}> {
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/user/tenants', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': SYNOPSIS_MSP_CONFIG.authEmail,
        'X-Auth-Key': SYNOPSIS_MSP_CONFIG.authKey,
      },
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
      
      return {
        success: false,
        error: errorMessage
      };
    }

    const data = await response.json() as CloudflareApiResponse<TenantInfo[]>;
    return {
      success: true,
      tenantInfo: data.result
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
}

/**
 * Gets Synopsis MSP tenant information
 * @returns Formatted tenant information for display
 */
export function getSynopsisMSPInfo() {
  const validation = validateSynopsisMSPConfig();
  
  return {
    isConfigured: validation.isValid,
    authEmail: SYNOPSIS_MSP_CONFIG.authEmail || 'Not configured',
    tenantUnitId: SYNOPSIS_MSP_CONFIG.tenantUnitId || 'Not configured',
    hasApiKey: !!SYNOPSIS_MSP_CONFIG.authKey && SYNOPSIS_MSP_CONFIG.authKey !== 'your_global_api_key_here',
    validation
  };
}

/**
 * Formats validation errors and warnings for display
 * @param validation Validation result from validateSynopsisMSPConfig
 * @returns Formatted message string
 */
export function formatValidationMessage(validation: APIValidationResult): string {
  const messages: string[] = [];
  
  if (validation.errors.length > 0) {
    messages.push('Errors:');
    validation.errors.forEach(error => messages.push(`• ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    messages.push('Warnings:');
    validation.warnings.forEach(warning => messages.push(`• ${warning}`));
  }
  
  return messages.join('\n');
}

export default {
  validateSynopsisMSPConfig,
  testSynopsisMSPConnection,
  getSynopsisMSPInfo,
  formatValidationMessage
};