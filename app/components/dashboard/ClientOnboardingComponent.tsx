// app/components/dashboard/ClientOnboardingComponent.tsx

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Building2, 
  Globe, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Mail,
  Phone,
  MapPin,
  Lock,
  Users,
  Zap,
  Search,
  Server,
  Copy,
  ExternalLink
} from 'lucide-react';
import ClientOnboardingService, { AlaCartePlan, ClientOnboardingData, OnboardingProgress, OnboardingStep, SYNOPSIS_MSP_CONFIG } from '@/app/services/clientOnboardingService';

interface ClientOnboardingComponentProps {
  isDarkMode: boolean;
  onBack: () => void;
  userRole?: string;
}

type CustomerType = 'new' | 'existing';
type ServiceType = 'appsec' | 'zerotrust' | 'both';

interface ExistingAccount {
  id: string;
  name: string;
  status: string;
  zones: number;
  plan: string;
}

const ClientOnboardingComponent: React.FC<ClientOnboardingComponentProps> = ({
  isDarkMode,
  onBack,
  userRole
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [customerType, setCustomerType] = useState<CustomerType>('new');
  const [serviceType, setServiceType] = useState<ServiceType>('appsec');
  const [existingAccounts, setExistingAccounts] = useState<ExistingAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  
  const [formData, setFormData] = useState<ClientOnboardingData>({
    accountName: '',
    accountType: 'enterprise',
    businessName: '',
    businessEmail: '',
    businessAddress: '',
    businessPhone: '',
    customerEmail: '',
    customerRole: 'Administrator',
    domainName: '',
    zeroTrustPlan: 'none',
    zeroTrustSeats: 10,
    alaCarteServices: [],
    addOns: {
      browserIsolation: 0,
      casb: false,
      dlp: false
    }
  });
  
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Check if user has MSSP partner permissions
  const isMSSPPartner = userRole === 'cloudflare-global' || userRole === 'MSSP_ADMIN' || userRole === 'MSSP_PARTNER';

  const onboardingSteps = [
    { title: 'Customer Type', icon: Users },
    { title: 'Account Setup', icon: Building2 },
    { title: 'Service Selection', icon: Shield },
    { title: 'Configuration', icon: Zap },
    { title: 'Complete Setup', icon: CheckCircle }
  ];

  const zeroTrustBundles = [
    { 
      id: 'zt-essential', 
      name: 'Zero Trust Essential', 
      description: 'Gateway + Access with basic features',
      services: ['Gateway', 'Access', 'DNS Filtering'],
      pricePerSeat: '$7/month'
    },
    { 
      id: 'zt-advanced', 
      name: 'Zero Trust Advanced', 
      description: 'Essential + DLP + CASB',
      services: ['Gateway', 'Access', 'DLP', 'CASB', 'DNS Filtering'],
      pricePerSeat: '$10/month'
    },
    { 
      id: 'zt-premier', 
      name: 'Zero Trust Premier', 
      description: 'Advanced + Remote Browser Isolation',
      services: ['Gateway', 'Access', 'DLP', 'CASB', 'RBI', 'DNS Filtering'],
      pricePerSeat: '$15/month'
    }
  ];

  const alaCarteServices = [
    { 
      id: 'access', 
      name: 'Access Enterprise', 
      description: 'Zero Trust Network Access',
      price: '$3/seat/month',
      canCombineWith: []
    },
    { 
      id: 'gateway', 
      name: 'Gateway Enterprise', 
      description: 'Secure Web Gateway + DNS Filtering',
      price: '$3/seat/month',
      canCombineWith: []
    },
    { 
      id: 'browser-isolation', 
      name: 'Remote Browser Isolation', 
      description: 'Advanced browser isolation',
      price: '$7/seat/month',
      canCombineWith: ['gateway']
    },
    { 
      id: 'email-security', 
      name: 'Email Security', 
      description: 'Advanced email threat protection',
      price: '$2.5/inbox/month',
      canCombineWith: ['access', 'gateway', 'browser-isolation']
    }
  ];

  // Load existing accounts when customer type is set to existing
  useEffect(() => {
    if (customerType === 'existing') {
      loadExistingAccounts();
    }
  }, [customerType]);

  const loadExistingAccounts = async () => {
    setLoadingAccounts(true);
    setError(null);
    
    try {
      const service = new ClientOnboardingService(SYNOPSIS_MSP_CONFIG);
      const response = await service.makeRequest('/accounts', 'GET');
      
      if (response.success && response.result) {
        const accounts = response.result.map((account: any) => ({
          id: account.id,
          name: account.name,
          status: account.status || 'active',
          zones: 0, // We could fetch zones count separately if needed
          plan: account.settings?.plan || 'Unknown'
        }));
        setExistingAccounts(accounts);
      }
    } catch (err) {
      setError(`Failed to load existing accounts: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 0: // Customer Type
        if (customerType === 'existing' && !selectedAccount) {
          errors.selectedAccount = 'Please select an existing account';
        }
        break;
      case 1: // Account Setup (for new customers)
        if (customerType === 'new') {
          if (!formData.accountName.trim()) errors.accountName = 'Account name is required';
          if (!formData.customerEmail.trim()) errors.customerEmail = 'Customer email is required';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            errors.customerEmail = 'Please enter a valid email address';
          }
          if (!formData.businessName?.trim()) errors.businessName = 'Business name is required';
        }
        break;
      case 2: // Service Selection
        // No validation needed, defaults are fine
        break;
      case 3: // Configuration
        if (serviceType === 'appsec' || serviceType === 'both') {
          if (!formData.domainName.trim()) errors.domainName = 'Domain name is required';
          if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(formData.domainName)) {
            errors.domainName = 'Please enter a valid domain name (e.g., example.com)';
          }
        }
        
        if (serviceType === 'zerotrust' || serviceType === 'both') {
          if (!formData.zeroTrustSeats || formData.zeroTrustSeats < 1) {
            errors.zeroTrustSeats = 'Zero Trust seats must be at least 1';
          }
          
          if (formData.zeroTrustPlan === 'alacarte') {
            if (!formData.alaCarteServices || formData.alaCarteServices.length === 0) {
              errors.alaCarteServices = 'Please select at least one a la carte service';
            }
            
            // Validate a la carte rules
            const hasAccess = formData.alaCarteServices?.includes('access');
            const hasGateway = formData.alaCarteServices?.includes('gateway');
            
            if (hasAccess && hasGateway) {
              errors.alaCarteServices = 'Access and Gateway cannot be combined in a la carte. Use a bundle instead.';
            }
          }
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Skip account setup step if existing customer
      if (currentStep === 0 && customerType === 'existing') {
        setCurrentStep(2); // Skip to service selection
      } else {
        setCurrentStep(prev => Math.min(prev + 1, onboardingSteps.length - 1));
      }
    }
  };

  const handlePrevious = () => {
    // Handle skip back for existing customers
    if (currentStep === 2 && customerType === 'existing') {
      setCurrentStep(0); // Skip back to customer type
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleInputChange = (field: keyof ClientOnboardingData, value: any) => {
    setFormData((prev: ClientOnboardingData) => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field as string]) {
      setValidationErrors((prev: Record<string, string>) => {
        const { [field as string]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleAlaCarteChange = (service: AlaCartePlan, checked: boolean) => {
    setFormData((prev: ClientOnboardingData) => {
      const newServices = checked
        ? [...(prev.alaCarteServices || []), service]
        : (prev.alaCarteServices || []).filter((s: AlaCartePlan) => s !== service);
      
      return {
        ...prev,
        alaCarteServices: newServices
      };
    });
  };

  const startOnboarding = useCallback(async () => {
    if (!validateStep(currentStep)) return;
    
    setIsOnboarding(true);
    setError(null);
    
    try {
      const service = new ClientOnboardingService(SYNOPSIS_MSP_CONFIG);
      
      if (customerType === 'existing') {
        // Handle existing customer updates
        await handleExistingCustomerUpdate(service);
      } else {
        // Handle new customer onboarding
        await service.onboardClient(formData, (progress) => {
          setOnboardingProgress(progress);
        });
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during onboarding');
    } finally {
      setIsOnboarding(false);
    }
  }, [formData, currentStep, customerType, selectedAccount, serviceType]);

  const handleExistingCustomerUpdate = async (service: ClientOnboardingService) => {
    // Implementation for updating existing customer
    // This would involve updating subscriptions, adding zones, etc.
    console.log('Updating existing customer:', selectedAccount);
    // TODO: Implement existing customer update logic
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isMSSPPartner) {
    return (
      <div className="space-y-6">
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Access Restricted
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Only MSSP partners are allowed to onboard customer zones. Please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (onboardingProgress && isOnboarding) {
    return (
      <div className="space-y-6">
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Customer Onboarding</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Step {onboardingProgress.currentStep + 1} of {onboardingProgress.steps.length}
                  </span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {Math.round(((onboardingProgress.currentStep + 1) / onboardingProgress.steps.length) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={((onboardingProgress.currentStep + 1) / onboardingProgress.steps.length) * 100} 
                  className="w-full"
                />
              </div>
              
              <div className="space-y-3">
                {onboardingProgress.steps.map((step: OnboardingStep, index: number) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    {step.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {step.status === 'in-progress' && (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    )}
                    {step.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    {step.status === 'pending' && (
                      <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                    )}
                    
                    <div className="flex-1">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {step.name}
                      </p>
                      {step.error && (
                        <p className="text-sm text-red-500">{step.error}</p>
                      )}
                    </div>
                    
                    <Badge variant={
                      step.status === 'completed' ? 'default' :
                      step.status === 'in-progress' ? 'secondary' :
                      step.status === 'error' ? 'destructive' : 'outline'
                    }>
                      {step.status}
                    </Badge>
                  </div>
                ))}
              </div>
              
              {onboardingProgress.isCompleted && (onboardingProgress as OnboardingProgress).nameServers && (
                <Alert>
                  <Server className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p><strong>Setup Complete!</strong> Please update your domain's nameservers:</p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span>{(onboardingProgress as OnboardingProgress).nameServers!.nameServer1}</span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard((onboardingProgress as OnboardingProgress).nameServers!.nameServer1)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{(onboardingProgress as OnboardingProgress).nameServers!.nameServer2}</span>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard((onboardingProgress as OnboardingProgress).nameServers!.nameServer2)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (onboardingProgress?.isCompleted) {
    return (
      <div className="space-y-6">
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Customer Onboarding Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully onboarded customer: {formData.accountName}
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Account Details
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Account ID: {onboardingProgress.accountId}
                  </p>
                  {onboardingProgress.zoneId && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Zone ID: {onboardingProgress.zoneId}
                    </p>
                  )}
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Services Enabled
                  </h4>
                  {(serviceType === 'appsec' || serviceType === 'both') && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      ✅ App Security: partners_biz plan
                    </p>
                  )}
                  {(serviceType === 'zerotrust' || serviceType === 'both') && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      ✅ Zero Trust: {formData.zeroTrustSeats} seats
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={onBack} variant="outline">
                  Return to Dashboard
                </Button>
                <Button onClick={() => {
                  setOnboardingProgress(null);
                  setCurrentStep(0);
                  setCustomerType('new');
                  setServiceType('appsec');
                  setFormData({
                    accountName: '',
                    accountType: 'enterprise',
                    businessName: '',
                    businessEmail: '',
                    businessAddress: '',
                    businessPhone: '',
                    customerEmail: '',
                    customerRole: 'Administrator',
                    domainName: '',
                    zeroTrustPlan: 'none',
                    zeroTrustSeats: 10,
                    alaCarteServices: [],
                    addOns: {
                      browserIsolation: 0,
                      casb: false,
                      dlp: false
                    }
                  });
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Onboard Another Customer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              MSSP Customer Onboarding
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Onboard new customers or update existing customer services
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              let isActive = index === currentStep;
              let isCompleted = index < currentStep;
              
              // Handle skip logic for existing customers
              if (customerType === 'existing' && index === 1) {
                isActive = false;
                isCompleted = currentStep > 1;
              }
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isActive ? (isDarkMode ? 'border-blue-400 text-blue-400' : 'border-blue-600 text-blue-600') :
                    (isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-400')
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') :
                    isCompleted ? 'text-green-500' :
                    (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                  }`}>
                    {step.title}
                  </span>
                  {index < onboardingSteps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="pt-6">
          {/* Step 0: Customer Type */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Customer Type
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      customerType === 'new' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-Gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setCustomerType('new')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          customerType === 'new' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {customerType === 'new' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            New Customer
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Create a new account and configure services
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${
                      customerType === 'existing' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setCustomerType('existing')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          customerType === 'existing' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {customerType === 'existing' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Existing Customer
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Update services for an existing account
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {customerType === 'existing' && (
                  <div className="space-y-4">
                    <Label>Select Existing Account</Label>
                    {loadingAccounts ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading existing accounts...</span>
                      </div>
                    ) : (
                      <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger className={validationErrors.selectedAccount ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Choose an existing account" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingAccounts.map(account => (
                            <SelectItem key={account.id} value={account.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{account.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {account.status}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {validationErrors.selectedAccount && (
                      <p className="text-sm text-red-500">{validationErrors.selectedAccount}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Account Setup (only for new customers) */}
          {currentStep === 1 && customerType === 'new' && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Account Setup
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                    placeholder="Enter customer account name"
                    className={validationErrors.accountName ? 'border-red-500' : ''}
                  />
                  {validationErrors.accountName && (
                    <p className="text-sm text-red-500">{validationErrors.accountName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="customer@company.com"
                    className={validationErrors.customerEmail ? 'border-red-500' : ''}
                  />
                  {validationErrors.customerEmail && (
                    <p className="text-sm text-red-500">{validationErrors.customerEmail}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName || ''}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Company Ltd."
                    className={validationErrors.businessName ? 'border-red-500' : ''}
                  />
                  {validationErrors.businessName && (
                    <p className="text-sm text-red-500">{validationErrors.businessName}</p>
                  )}
                </div>
                
                {/* <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail || ''}
                    onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                    placeholder="contact@company.com"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    value={formData.businessAddress || ''}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    placeholder="123 Business St, City, State, ZIP"
                  />
                </div> */}
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Service Selection
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      serviceType === 'appsec' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setServiceType('appsec')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          serviceType === 'appsec' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {serviceType === 'appsec' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            App Security Only
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            WAF, DDoS, CDN, DNS
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${
                      serviceType === 'zerotrust' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setServiceType('zerotrust')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          serviceType === 'zerotrust' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {serviceType === 'zerotrust' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Zero Trust Only
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Access, Gateway, etc.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${
                      serviceType === 'both' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setServiceType('both')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          serviceType === 'both' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {serviceType === 'both' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Both Services
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            App Security + Zero Trust
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Configuration */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Configuration
              </h3>
              
              <div className="space-y-6">
                {/* App Security Configuration */}
                {(serviceType === 'appsec' || serviceType === 'both') && (
                  <div className="space-y-4">
                    <h4 className={`text-md font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Application Security
                    </h4>
                    <div className="space-y-2">
                      <Label htmlFor="domainName">Domain Name *</Label>
                      <Input
                        id="domainName"
                        value={formData.domainName}
                        onChange={(e) => handleInputChange('domainName', e.target.value)}
                        placeholder="example.com"
                        className={validationErrors.domainName ? 'border-red-500' : ''}
                      />
                      {validationErrors.domainName && (
                        <p className="text-sm text-red-500">{validationErrors.domainName}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Partners Business rate plan will be automatically applied
                      </p>
                    </div>
                  </div>
                )}

                {/* Zero Trust Configuration */}
                {(serviceType === 'zerotrust' || serviceType === 'both') && (
                  <div className="space-y-4">
                    <h4 className={`text-md font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Zero Trust Services
                    </h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zeroTrustSeats">Number of Seats *</Label>
                      <Input
                        id="zeroTrustSeats"
                        type="number"
                        min="1"
                        value={formData.zeroTrustSeats || ''}
                        onChange={(e) => handleInputChange('zeroTrustSeats', parseInt(e.target.value) || 0)}
                        className={validationErrors.zeroTrustSeats ? 'border-red-500' : ''}
                      />
                      {validationErrors.zeroTrustSeats && (
                        <p className="text-sm text-red-500">{validationErrors.zeroTrustSeats}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>Service Selection</Label>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h5 className="font-medium mb-3">Bundles (Recommended)</h5>
                          <div className="space-y-2">
                            {zeroTrustBundles.map(bundle => (
                              <Card 
                                key={bundle.id}
                                className={`cursor-pointer transition-all ${
                                  formData.zeroTrustPlan === bundle.id 
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                }`}
                                onClick={() => handleInputChange('zeroTrustPlan', bundle.id)}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-start space-x-3">
                                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                                      formData.zeroTrustPlan === bundle.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                    }`}>
                                      {formData.zeroTrustPlan === bundle.id && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                        <h6 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                          {bundle.name}
                                        </h6>
                                        {/* <span className="text-sm font-medium text-green-600">
                                          {bundle.pricePerSeat}
                                        </span> */}
                                      </div>
                                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {bundle.description}
                                      </p>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {bundle.services.map(service => (
                                          <Badge key={service} variant="secondary" className="text-xs">
                                            {service}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">A la Carte</h5>
                          <Card 
                            className={`cursor-pointer transition-all ${
                              formData.zeroTrustPlan === 'alacarte' 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => handleInputChange('zeroTrustPlan', 'alacarte')}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start space-x-3">
                                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                                  formData.zeroTrustPlan === 'alacarte' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                }`}>
                                  {formData.zeroTrustPlan === 'alacarte' && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                </div>
                                <div className="flex-1">
                                  <h6 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    A la Carte Services
                                  </h6>
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Choose individual services
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {formData.zeroTrustPlan === 'alacarte' && (
                            <div className="mt-3 pl-6 space-y-2">
                              {alaCarteServices.map((service: any) => (
                                <div key={service.id} className="flex items-start space-x-2">
                                  <Checkbox
                                    id={service.id}
                                    checked={formData.alaCarteServices?.includes(service.id as AlaCartePlan) || false}
                                    onCheckedChange={(checked) => handleAlaCarteChange(service.id as AlaCartePlan, checked as boolean)}
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <Label htmlFor={service.id} className="font-medium text-sm">
                                        {service.name}
                                      </Label>
                                      {/* <span className="text-xs text-green-600 font-medium">
                                        {service.price}
                                      </span> */}
                                    </div>
                                    <p className="text-xs text-gray-500">{service.description}</p>
                                  </div>
                                </div>
                              ))}
                              {validationErrors.alaCarteServices && (
                                <p className="text-sm text-red-500">{validationErrors.alaCarteServices}</p>
                              )}
                              
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                  <strong>Rules:</strong> Access and Gateway cannot be combined in a la carte. 
                                  Remote Browser Isolation can only be combined with Gateway. 
                                  Email Security can be added to any selection.
                                </AlertDescription>
                              </Alert>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review & Complete */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Review & Complete Setup
              </h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {customerType === 'existing' ? 'Account Updates' : 'New Account'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {customerType === 'new' ? (
                      <>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Account Name:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.accountName}</span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Customer Email:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.customerEmail}</span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Business Name:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.businessName}</span>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Selected Account:</span>
                        <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {existingAccounts.find(acc => acc.id === selectedAccount)?.name || 'Unknown'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Services Configuration
                  </h4>
                  <div className="space-y-2 text-sm">
                    {(serviceType === 'appsec' || serviceType === 'both') && (
                      <>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Domain:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.domainName}</span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>App Security Plan:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>partners_biz (Auto-applied)</span>
                        </div>
                      </>
                    )}
                    {(serviceType === 'zerotrust' || serviceType === 'both') && (
                      <>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Zero Trust Plan:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formData.zeroTrustPlan === 'alacarte' 
                              ? 'A la Carte' 
                              : zeroTrustBundles.find(b => b.id === formData.zeroTrustPlan)?.name || 'Unknown'
                            }
                          </span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Seats:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formData.zeroTrustSeats}</span>
                        </div>
                        {formData.zeroTrustPlan === 'alacarte' && formData.alaCarteServices && formData.alaCarteServices.length > 0 && (
                          <div>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Services:</span>
                            <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {formData.alaCarteServices.map(service => 
                                alaCarteServices.find(s => s.id === service)?.name
                              ).join(', ')}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < onboardingSteps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={startOnboarding} disabled={isOnboarding}>
                {isOnboarding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {customerType === 'existing' ? 'Update Services' : 'Complete Onboarding'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOnboardingComponent;