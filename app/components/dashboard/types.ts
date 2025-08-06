// Core Partner Types
export type UserRole = 'cloudflare-global' | 'mssp-distributor' | 'mssp-direct' | 'distributor-managed' | 'si-partner' | 'end-customer'  | 'MSSP_ADMIN' | 'MSSP_PARTNER';
export type PartnerType = 'distributor' | 'direct-mssp' | 'si-partner' | 'distributor-managed-mssp';
export type ViewType = 'dashboard' | 'partnerList' | 'monthlyDetails' | 'usage' | 'partnerUsageDetails' | 'customerDetails'| 'kocSistemView';
export type UsageCategory = 'all' | 'distributor' | 'direct' | 'si' | 'distributor-managed';
export type Region = 'AMER' | 'EMEA' | 'APAC' | 'LATAM' | 'JAPAN' | 'GLOBAL';

// Product Usage Types
export interface AppSecUsage {
  cdn: number;
  waf: number;
  ddosProtection: number;
  loadBalancing: number;
  spectrum: number;
  argo: number;
  total: number;
}

export interface ZTNAUsage {
  gateway: number;
  access: number;
  dlp: number;
  casb: number;
  browserIsolation: number;
  essential: number;
  advanced: number;
  premier: number;
  total: number;
}

export interface EmailSecurityUsage {
  area1: number;
  advancedThreatProtection: number;
  total: number;
}

// Pricing Structure
export interface PricingTier {
  appSecRate: number; // per TB
  ztnaRate: number;   // per seat
  emailRate: number;  // per inbox
  currency: string;
  effectiveDate: string;
  priceListVersion: string;
}

// Partner Hierarchy Types
export interface BasePartner {
  id: string;
  name: string;
  region: Region;
  country: string[];
  tier: number;
  monthlyGrowth: number;
  registrationDate: string;
  status: 'active' | 'inactive' | 'suspended';
  contactEmail: string;
  accountManager: string;
}

export interface DistributorPartner extends BasePartner {
  type: 'distributor';
  managedSIPartners: string[];
  managedMSSPs: string[];
  totalPartners: number;
  totalRevenue: number;
  totalCustomers: number;
  appSecUsage: AppSecUsage;
  ztnaUsage: ZTNAUsage;
  emailUsage: EmailSecurityUsage;
  pricing: PricingTier;
}

export interface DirectMSSPPartner extends BasePartner {
  type: 'direct-mssp';
  customers: string[];
  totalCustomers: number;
  totalRevenue: number;
  appSecUsage: AppSecUsage;
  ztnaUsage: ZTNAUsage;
  emailUsage: EmailSecurityUsage;
  pricing: PricingTier;
}

export interface SystemIntegratorPartner extends BasePartner {
  type: 'si-partner';
  parentDistributor: string;
  managedMSSPs: string[];
  customers: string[];
  totalCustomers: number;
  totalRevenue: number;
  appSecUsage: AppSecUsage;
  ztnaUsage: ZTNAUsage;
  emailUsage: EmailSecurityUsage;
  pricing: PricingTier;
}

export interface DistributorManagedMSSP extends BasePartner {
  type: 'distributor-managed-mssp';
  parentDistributor: string;
  parentSI?: string;
  customers: string[];
  totalCustomers: number;
  totalRevenue: number;
  appSecUsage: AppSecUsage;
  ztnaUsage: ZTNAUsage;
  emailUsage: EmailSecurityUsage;
  pricing: PricingTier;
}

// Customer Types
export interface CustomerAccount {
  id: string;
  name: string;
  accountId: string;
  parentPartner: string;
  parentPartnerType: PartnerType;
  region: Region;
  country: string;
  zones: ZoneData[];
  totalZones: number;
  monthlySpend: number;
  registrationDate: string;
  industry: string;
  size: 'SMB' | 'Mid-Market' | 'Enterprise' | 'Large Enterprise';
  appSecUsage: AppSecUsage;
  ztnaUsage: ZTNAUsage;
  emailUsage: EmailSecurityUsage;
}

export interface ZoneData {
  id: string;
  domain: string;
  plan: 'Free' | 'Pro' | 'Business' | 'Enterprise';
  appSecUsage: number;
  monthlyRequests: number;
  bandwidthUsage: number;
}

// Revenue and Financial Types
export interface RevenueData {
  month: string;
  year: number;
  totalRevenue: number;
  appSecRevenue: number;
  ztnaRevenue: number;
  emailRevenue: number;
  newPartners: number;
  newCustomers: number;
  churnRate: number;
}

export interface MonthlyRegistrations {
  [month: string]: {
    distributors: string[];
    directMSSPs: string[];
    siPartners: string[];
    distributorManagedMSSPs: string[];
  };
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalDistributors: number;
  totalDirectMSSPs: number;
  totalSIPartners: number;
  totalDistributorManagedMSSPs: number;
  totalCustomers: number;
  totalRevenue: number;
  totalAppSecUsage: number;
  totalZTNASeats: number;
  totalEmailInboxes: number;
  monthlyGrowthRate: number;
  churnRate: number;
}

// Usage Analytics Types
export interface UsageAlert {
  id: string;
  partnerId: string;
  partnerName: string;
  type: 'appsec' | 'ztna' | 'email';
  threshold: number;
  currentUsage: number;
  percentage: number;
  alertLevel: 'warning' | 'critical';
  notificationSent: boolean;
  createdAt: string;
}

export interface CommercialReport {
  partnerId: string;
  partnerName: string;
  partnerType: PartnerType;
  region: Region;
  reportMonth: string;
  appSecUsage: AppSecUsage;
  ztnaUsage: ZTNAUsage;
  emailUsage: EmailSecurityUsage;
  pricing: PricingTier;
  totalCost: number;
  totalRevenue: number;
  margin: number;
  priceListApplied: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
}

// Filter and Search Types
export interface FilterOptions {
  regions: Region[];
  partnerTypes: PartnerType[];
  dateRange: {
    start: string;
    end: string;
  };
  revenueRange: {
    min: number;
    max: number;
  };
  usageRange: {
    min: number;
    max: number;
  };
}

export interface SearchParams {
  query: string;
  filters: FilterOptions;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}