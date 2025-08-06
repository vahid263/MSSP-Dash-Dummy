import {
  DistributorPartner,
  DirectMSSPPartner,
  SystemIntegratorPartner,
  DistributorManagedMSSP,
  CustomerAccount,
  RevenueData,
  MonthlyRegistrations,
  PricingTier,
  AppSecUsage,
  ZTNAUsage,
  EmailSecurityUsage,
  Region
} from './types';

// Pricing Tiers based on Synopsis MSSP pricing
export const pricingTiers: Record<string, PricingTier> = {
  standard: {
    appSecRate: 120, // per TB
    ztnaRate: 8,     // per seat
    emailRate: 2.5,  // per inbox
    currency: 'USD',
    effectiveDate: '2025-01-01',
    priceListVersion: 'v3.2'
  },
  premium: {
    appSecRate: 100,
    ztnaRate: 7,
    emailRate: 2.2,
    currency: 'USD',
    effectiveDate: '2025-01-01',
    priceListVersion: 'v3.2'
  },
  enterprise: {
    appSecRate: 85,
    ztnaRate: 6,
    emailRate: 2.0,
    currency: 'USD',
    effectiveDate: '2025-01-01',
    priceListVersion: 'v3.2'
  }
};

// Complete Distributor Partners - Updated Synopsis with all MSSP partners
export const distributorPartners: DistributorPartner[] = [
  {
    id: 'dist-001',
    name: 'Cloudhop',
    region: 'EMEA',
    country: ['United Kingdom', 'Ireland'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: ['si-001', 'si-002'], // Copy Cat, Forefront
    managedMSSPs: ['mssp-001', 'mssp-002', 'mssp-003', 'mssp-004'], // Safaricom, MTN, Seacom, Liquid C2
    totalPartners: 6,
    totalRevenue: 385000,
    totalCustomers: 520,
    monthlyGrowth: 22,
    registrationDate: '2023-06-15',
    status: 'active',
    contactEmail: 'partners@cloudhop.com',
    accountManager: 'Sarah Johnson',
    appSecUsage: {
      cdn: 210.5,
      waf: 185.2,
      ddosProtection: 125.8,
      loadBalancing: 35.4,
      spectrum: 22.6,
      argo: 18.3,
      total: 597.8
    },
    ztnaUsage: {
      gateway: 3250,
      access: 2180,
      dlp: 1290,
      casb: 720,
      browserIsolation: 480,
      essential: 1800,
      advanced: 1200,
      premier: 650,
      total: 11570
    },
    emailUsage: {
      area1: 18500,
      advancedThreatProtection: 7200,
      total: 25700
    },
    pricing: pricingTiers.premium
  },
  {
    id: 'dist-002',
    name: 'Synopsis',
    region: 'EMEA',
    country: ['Germany', 'Austria', 'Switzerland', 'Turkey', 'UAE', 'Saudi Arabia', 'South Africa', 'Kenya'], // Updated coverage
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: ['mssp-005', 'mssp-006', 'mssp-007', 'mssp-008', 'mssp-021', 'mssp-022', 'mssp-023'], // Updated with all 7 Synopsis MSSP partners
    totalPartners: 7, // Updated count
    totalRevenue: 465000, // Increased revenue
    totalCustomers: 620, // Increased customer count
    monthlyGrowth: 24, // Increased growth
    registrationDate: '2023-04-20',
    status: 'active',
    contactEmail: 'partners@synopsis.de',
    accountManager: 'Klaus Weber',
    appSecUsage: {
      cdn: 286.8,
      waf: 258.4,
      ddosProtection: 168.2,
      loadBalancing: 48.6,
      spectrum: 31.4,
      argo: 24.8,
      total: 818.2
    },
    ztnaUsage: {
      gateway: 4200,
      access: 2920,
      dlp: 1650,
      casb: 920,
      browserIsolation: 610,
      essential: 2350,
      advanced: 1530,
      premier: 870,
      total: 15050
    },
    emailUsage: {
      area1: 22800,
      advancedThreatProtection: 9500,
      total: 32300
    },
    pricing: pricingTiers.premium
  },
  {
    id: 'dist-003',
    name: 'e92plus',
    region: 'EMEA',
    country: ['France', 'Belgium', 'Netherlands'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: ['mssp-008', 'mssp-009', 'mssp-010', 'mssp-011'], // ANS Group, Teamblue, Abtec, Telefonica
    totalPartners: 4,
    totalRevenue: 325000,
    totalCustomers: 480,
    monthlyGrowth: 20,
    registrationDate: '2023-05-10',
    status: 'active',
    contactEmail: 'partners@e92plus.com',
    accountManager: 'Marie Dubois',
    appSecUsage: {
      cdn: 198.4,
      waf: 166.2,
      ddosProtection: 108.8,
      loadBalancing: 31.8,
      spectrum: 20.2,
      argo: 16.4,
      total: 541.8
    },
    ztnaUsage: {
      gateway: 2980,
      access: 2040,
      dlp: 1120,
      casb: 660,
      browserIsolation: 440,
      essential: 1650,
      advanced: 1100,
      premier: 610,
      total: 10600
    },
    emailUsage: {
      area1: 16800,
      advancedThreatProtection: 6950,
      total: 23750
    },
    pricing: pricingTiers.premium
  },
  {
    id: 'dist-004',
    name: 'Infinigate Germany',
    region: 'EMEA',
    country: ['Germany'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: [],
    totalPartners: 0,
    totalRevenue: 145000,
    totalCustomers: 240,
    monthlyGrowth: 12,
    registrationDate: '2023-07-18',
    status: 'active',
    contactEmail: 'partners@infinigate.de',
    accountManager: 'Hans Mueller',
    appSecUsage: {
      cdn: 125.4,
      waf: 108.8,
      ddosProtection: 68.2,
      loadBalancing: 19.6,
      spectrum: 12.4,
      argo: 9.8,
      total: 344.2
    },
    ztnaUsage: {
      gateway: 1850,
      access: 1260,
      dlp: 690,
      casb: 410,
      browserIsolation: 270,
      essential: 1020,
      advanced: 680,
      premier: 380,
      total: 6560
    },
    emailUsage: {
      area1: 10500,
      advancedThreatProtection: 4200,
      total: 14700
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'dist-005',
    name: 'V-Valley Spain',
    region: 'EMEA',
    country: ['Spain'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: ['mssp-012'], // Telefonica
    totalPartners: 1,
    totalRevenue: 95000,
    totalCustomers: 185,
    monthlyGrowth: 14,
    registrationDate: '2023-08-05',
    status: 'active',
    contactEmail: 'partners@v-valley.es',
    accountManager: 'Carlos Fernandez',
    appSecUsage: {
      cdn: 85.4,
      waf: 72.8,
      ddosProtection: 45.2,
      loadBalancing: 13.6,
      spectrum: 8.4,
      argo: 6.8,
      total: 232.2
    },
    ztnaUsage: {
      gateway: 1320,
      access: 890,
      dlp: 480,
      casb: 280,
      browserIsolation: 190,
      essential: 720,
      advanced: 480,
      premier: 270,
      total: 4630
    },
    emailUsage: {
      area1: 7800,
      advancedThreatProtection: 3200,
      total: 11000
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'dist-006',
    name: 'V-Valley Portugal',
    region: 'EMEA',
    country: ['Portugal'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: [],
    totalPartners: 0,
    totalRevenue: 75000,
    totalCustomers: 150,
    monthlyGrowth: 10,
    registrationDate: '2023-09-12',
    status: 'active',
    contactEmail: 'partners@v-valley.pt',
    accountManager: 'Ana Silva',
    appSecUsage: {
      cdn: 68.4,
      waf: 58.8,
      ddosProtection: 36.2,
      loadBalancing: 10.6,
      spectrum: 6.4,
      argo: 5.2,
      total: 185.6
    },
    ztnaUsage: {
      gateway: 1050,
      access: 720,
      dlp: 390,
      casb: 230,
      browserIsolation: 150,
      essential: 580,
      advanced: 380,
      premier: 210,
      total: 3710
    },
    emailUsage: {
      area1: 6200,
      advancedThreatProtection: 2500,
      total: 8700
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'dist-007',
    name: 'Radius Channels',
    region: 'AMER',
    country: ['United States', 'Canada'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: [],
    totalPartners: 0,
    totalRevenue: 420000,
    totalCustomers: 680,
    monthlyGrowth: 16,
    registrationDate: '2023-03-15',
    status: 'active',
    contactEmail: 'partners@radiuschannels.com',
    accountManager: 'Michael Chen',
    appSecUsage: {
      cdn: 245.6,
      waf: 208.2,
      ddosProtection: 135.4,
      loadBalancing: 38.2,
      spectrum: 24.8,
      argo: 19.2,
      total: 671.4
    },
    ztnaUsage: {
      gateway: 3650,
      access: 2490,
      dlp: 1350,
      casb: 800,
      browserIsolation: 530,
      essential: 2020,
      advanced: 1340,
      premier: 750,
      total: 12930
    },
    emailUsage: {
      area1: 20500,
      advancedThreatProtection: 8600,
      total: 29100
    },
    pricing: pricingTiers.enterprise
  },
  {
    id: 'dist-008',
    name: 'Dicker Data AUS',
    region: 'APAC',
    country: ['Australia'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: ['mssp-013', 'mssp-014'], // CyberPulse, Insicon
    totalPartners: 2,
    totalRevenue: 215000,
    totalCustomers: 340,
    monthlyGrowth: 14,
    registrationDate: '2023-07-08',
    status: 'active',
    contactEmail: 'partners@dickerdata.com.au',
    accountManager: 'James Mitchell',
    appSecUsage: {
      cdn: 155.4,
      waf: 131.8,
      ddosProtection: 85.2,
      loadBalancing: 24.6,
      spectrum: 15.8,
      argo: 12.4,
      total: 425.2
    },
    ztnaUsage: {
      gateway: 2320,
      access: 1580,
      dlp: 860,
      casb: 510,
      browserIsolation: 340,
      essential: 1280,
      advanced: 850,
      premier: 470,
      total: 8210
    },
    emailUsage: {
      area1: 13200,
      advancedThreatProtection: 5500,
      total: 18700
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'dist-009',
    name: 'Dicker Data NZ',
    region: 'APAC',
    country: ['New Zealand'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: ['mssp-015', 'mssp-016', 'mssp-017'], // Advantage, ASI Solutions, NETQ
    totalPartners: 3,
    totalRevenue: 185000,
    totalCustomers: 290,
    monthlyGrowth: 12,
    registrationDate: '2023-08-22',
    status: 'active',
    contactEmail: 'partners@dickerdata.co.nz',
    accountManager: 'Emma Thompson',
    appSecUsage: {
      cdn: 135.4,
      waf: 115.8,
      ddosProtection: 72.2,
      loadBalancing: 20.6,
      spectrum: 13.4,
      argo: 10.8,
      total: 368.2
    },
    ztnaUsage: {
      gateway: 1950,
      access: 1320,
      dlp: 720,
      casb: 420,
      browserIsolation: 280,
      essential: 1080,
      advanced: 720,
      premier: 400,
      total: 6890
    },
    emailUsage: {
      area1: 11200,
      advancedThreatProtection: 4650,
      total: 15850
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'dist-010',
    name: 'TDSynnex',
    region: 'LATAM',
    country: ['Brazil', 'Mexico', 'Argentina'],
    tier: 2,
    type: 'distributor',
    managedSIPartners: [],
    managedMSSPs: ['mssp-018', 'mssp-019', 'mssp-020'], // Brava Solutions, DigitalEra Group LLC, ePerform Solutions
    totalPartners: 3,
    totalRevenue: 250000,
    totalCustomers: 380,
    monthlyGrowth: 15,
    registrationDate: '2023-06-30',
    status: 'active',
    contactEmail: 'partners@tdsynnex.com',
    accountManager: 'Carlos Rodriguez',
    appSecUsage: {
      cdn: 172.8,
      waf: 145.6,
      ddosProtection: 94.4,
      loadBalancing: 26.6,
      spectrum: 17.2,
      argo: 13.6,
      total: 470.2
    },
    ztnaUsage: {
      gateway: 2450,
      access: 1670,
      dlp: 910,
      casb: 540,
      browserIsolation: 360,
      essential: 1350,
      advanced: 900,
      premier: 500,
      total: 8680
    },
    emailUsage: {
      area1: 14200,
      advancedThreatProtection: 5900,
      total: 20100
    },
    pricing: pricingTiers.standard
  }
];

// Complete Direct MSSP Partners - From SOW
export const directMSSPPartners: DirectMSSPPartner[] = [
  {
    id: 'direct-001',
    name: 'Orange',
    region: 'EMEA',
    country: ['France', 'Spain', 'Poland'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-001', 'cust-002', 'cust-003', 'cust-004', 'cust-005'],
    totalCustomers: 180,
    totalRevenue: 185000,
    monthlyGrowth: 15,
    registrationDate: '2023-01-15',
    status: 'active',
    contactEmail: 'cybersecurity@orange.com',
    accountManager: 'Philippe Martin',
    appSecUsage: {
      cdn: 118.4,
      waf: 95.6,
      ddosProtection: 62.2,
      loadBalancing: 17.2,
      spectrum: 11.8,
      argo: 9.2,
      total: 314.4
    },
    ztnaUsage: {
      gateway: 1540,
      access: 1040,
      dlp: 570,
      casb: 340,
      browserIsolation: 220,
      essential: 850,
      advanced: 570,
      premier: 320,
      total: 5450
    },
    emailUsage: {
      area1: 8800,
      advancedThreatProtection: 3650,
      total: 12450
    },
    pricing: pricingTiers.premium
  },
  {
    id: 'direct-002',
    name: 'Nanosek',
    region: 'EMEA',
    country: ['United Kingdom'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-006', 'cust-007', 'cust-008'],
    totalCustomers: 145,
    totalRevenue: 142000,
    monthlyGrowth: 13,
    registrationDate: '2023-02-20',
    status: 'active',
    contactEmail: 'security@nanosek.co.uk',
    accountManager: 'Emma Wilson',
    appSecUsage: {
      cdn: 95.8,
      waf: 78.4,
      ddosProtection: 48.6,
      loadBalancing: 13.8,
      spectrum: 9.2,
      argo: 7.4,
      total: 253.2
    },
    ztnaUsage: {
      gateway: 1240,
      access: 840,
      dlp: 460,
      casb: 270,
      browserIsolation: 180,
      essential: 690,
      advanced: 460,
      premier: 250,
      total: 4390
    },
    emailUsage: {
      area1: 7100,
      advancedThreatProtection: 2950,
      total: 10050
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'direct-003',
    name: 'Swisscom',
    region: 'EMEA',
    country: ['Switzerland'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-009', 'cust-010'],
    totalCustomers: 95,
    totalRevenue: 128000,
    monthlyGrowth: 11,
    registrationDate: '2023-03-10',
    status: 'active',
    contactEmail: 'security@swisscom.ch',
    accountManager: 'Hans Muller',
    appSecUsage: {
      cdn: 78.6,
      waf: 63.8,
      ddosProtection: 39.4,
      loadBalancing: 11.2,
      spectrum: 7.4,
      argo: 5.8,
      total: 206.2
    },
    ztnaUsage: {
      gateway: 1010,
      access: 680,
      dlp: 370,
      casb: 220,
      browserIsolation: 140,
      essential: 560,
      advanced: 370,
      premier: 210,
      total: 3560
    },
    emailUsage: {
      area1: 5700,
      advancedThreatProtection: 2380,
      total: 8080
    },
    pricing: pricingTiers.premium
  },
  {
    id: 'direct-004',
    name: 'Netnordic',
    region: 'EMEA',
    country: ['Norway', 'Sweden', 'Denmark'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-011', 'cust-012'],
    totalCustomers: 78,
    totalRevenue: 98000,
    monthlyGrowth: 10,
    registrationDate: '2023-04-15',
    status: 'active',
    contactEmail: 'security@netnordic.com',
    accountManager: 'Lars Andersen',
    appSecUsage: {
      cdn: 64.8,
      waf: 52.6,
      ddosProtection: 32.4,
      loadBalancing: 9.2,
      spectrum: 6.1,
      argo: 4.8,
      total: 169.9
    },
    ztnaUsage: {
      gateway: 830,
      access: 560,
      dlp: 305,
      casb: 180,
      browserIsolation: 120,
      essential: 460,
      advanced: 310,
      premier: 170,
      total: 2935
    },
    emailUsage: {
      area1: 4700,
      advancedThreatProtection: 1950,
      total: 6650
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'direct-005',
    name: 'Kaemi',
    region: 'EMEA',
    country: ['Finland'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-013', 'cust-014'],
    totalCustomers: 42,
    totalRevenue: 65000,
    monthlyGrowth: 12,
    registrationDate: '2023-05-20',
    status: 'active',
    contactEmail: 'security@kaemi.fi',
    accountManager: 'Aino Virtanen',
    appSecUsage: {
      cdn: 42.8,
      waf: 34.6,
      ddosProtection: 21.4,
      loadBalancing: 6.1,
      spectrum: 4.0,
      argo: 3.2,
      total: 112.1
    },
    ztnaUsage: {
      gateway: 550,
      access: 370,
      dlp: 200,
      casb: 120,
      browserIsolation: 80,
      essential: 305,
      advanced: 200,
      premier: 110,
      total: 1935
    },
    emailUsage: {
      area1: 3100,
      advancedThreatProtection: 1290,
      total: 4390
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'direct-006',
    name: 'Rackspace',
    region: 'GLOBAL',
    country: ['United States', 'United Kingdom', 'Australia', 'Netherlands'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-015', 'cust-016', 'cust-017', 'cust-018', 'cust-019'],
    totalCustomers: 220,
    totalRevenue: 285000,
    monthlyGrowth: 18,
    registrationDate: '2022-11-20',
    status: 'active',
    contactEmail: 'security@rackspace.com',
    accountManager: 'David Thompson',
    appSecUsage: {
      cdn: 158.8,
      waf: 128.4,
      ddosProtection: 82.6,
      loadBalancing: 23.8,
      spectrum: 15.9,
      argo: 12.7,
      total: 422.2
    },
    ztnaUsage: {
      gateway: 2050,
      access: 1380,
      dlp: 750,
      casb: 440,
      browserIsolation: 290,
      essential: 1135,
      advanced: 760,
      premier: 420,
      total: 7225
    },
    emailUsage: {
      area1: 11500,
      advancedThreatProtection: 4800,
      total: 16300
    },
    pricing: pricingTiers.enterprise
  },
  {
    id: 'direct-007',
    name: 'Nocwing',
    region: 'AMER',
    country: ['United States'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-020', 'cust-021'],
    totalCustomers: 65,
    totalRevenue: 89000,
    monthlyGrowth: 14,
    registrationDate: '2023-03-25',
    status: 'active',
    contactEmail: 'security@nocwing.com',
    accountManager: 'Sarah Martinez',
    appSecUsage: {
      cdn: 54.8,
      waf: 44.4,
      ddosProtection: 27.6,
      loadBalancing: 7.8,
      spectrum: 5.2,
      argo: 4.1,
      total: 143.9
    },
    ztnaUsage: {
      gateway: 700,
      access: 470,
      dlp: 260,
      casb: 150,
      browserIsolation: 100,
      essential: 390,
      advanced: 260,
      premier: 140,
      total: 2470
    },
    emailUsage: {
      area1: 3900,
      advancedThreatProtection: 1630,
      total: 5530
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'direct-008',
    name: 'SolCyber',
    region: 'AMER',
    country: ['United States'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-022', 'cust-023', 'cust-024'],
    totalCustomers: 120,
    totalRevenue: 145000,
    monthlyGrowth: 16,
    registrationDate: '2023-02-10',
    status: 'active',
    contactEmail: 'partners@solcyber.com',
    accountManager: 'Jennifer Lee',
    appSecUsage: {
      cdn: 88.2,
      waf: 71.4,
      ddosProtection: 44.8,
      loadBalancing: 12.5,
      spectrum: 8.4,
      argo: 6.7,
      total: 232.0
    },
    ztnaUsage: {
      gateway: 1130,
      access: 760,
      dlp: 410,
      casb: 240,
      browserIsolation: 160,
      essential: 630,
      advanced: 420,
      premier: 230,
      total: 3980
    },
    emailUsage: {
      area1: 6400,
      advancedThreatProtection: 2670,
      total: 9070
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'direct-009',
    name: 'Syntax',
    region: 'AMER',
    country: ['United States'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-025', 'cust-026'],
    totalCustomers: 52,
    totalRevenue: 72000,
    monthlyGrowth: 11,
    registrationDate: '2023-04-05',
    status: 'active',
    contactEmail: 'security@syntax.com',
    accountManager: 'Michael Johnson',
    appSecUsage: {
      cdn: 43.8,
      waf: 35.4,
      ddosProtection: 22.1,
      loadBalancing: 6.3,
      spectrum: 4.2,
      argo: 3.3,
      total: 115.1
    },
    ztnaUsage: {
      gateway: 560,
      access: 380,
      dlp: 205,
      casb: 120,
      browserIsolation: 80,
      essential: 310,
      advanced: 210,
      premier: 115,
      total: 1980
    },
    emailUsage: {
      area1: 3100,
      advancedThreatProtection: 1290,
      total: 4390
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'direct-010',
    name: 'Revolt',
    region: 'AMER',
    country: ['United States'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-027', 'cust-028'],
    totalCustomers: 48,
    totalRevenue: 68000,
    monthlyGrowth: 9,
    registrationDate: '2023-05-15',
    status: 'active',
    contactEmail: 'security@revolt.com',
    accountManager: 'Lisa Chen',
    appSecUsage: {
      cdn: 40.8,
      waf: 33.0,
      ddosProtection: 20.6,
      loadBalancing: 5.8,
      spectrum: 3.9,
      argo: 3.1,
      total: 107.2
    },
    ztnaUsage: {
      gateway: 520,
      access: 350,
      dlp: 190,
      casb: 110,
      browserIsolation: 75,
      essential: 290,
      advanced: 190,
      premier: 105,
      total: 1830
    },
    emailUsage: {
      area1: 2900,
      advancedThreatProtection: 1210,
      total: 4110
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'direct-011',
    name: 'Rakuten Japan',
    region: 'APAC',
    country: ['Japan'],
    tier: 2,
    type: 'direct-mssp',
    customers: ['cust-029', 'cust-030', 'cust-031'],
    totalCustomers: 85,
    totalRevenue: 165000,
    monthlyGrowth: 17,
    registrationDate: '2023-03-05',
    status: 'active',
    contactEmail: 'security@rakuten.co.jp',
    accountManager: 'Yuki Tanaka',
    appSecUsage: {
      cdn: 108.6,
      waf: 88.8,
      ddosProtection: 55.9,
      loadBalancing: 15.8,
      spectrum: 10.8,
      argo: 8.4,
      total: 288.3
    },
    ztnaUsage: {
      gateway: 1400,
      access: 950,
      dlp: 520,
      casb: 300,
      browserIsolation: 200,
      essential: 780,
      advanced: 520,
      premier: 290,
      total: 4960
    },
    emailUsage: {
      area1: 7900,
      advancedThreatProtection: 3300,
      total: 11200
    },
    pricing: pricingTiers.premium
  }
];

// System Integrator Partners - Exact from SOW hierarchy
export const systemIntegratorPartners: SystemIntegratorPartner[] = [
  {
    id: 'si-001',
    name: 'Copy Cat',
    region: 'EMEA',
    country: ['United Kingdom'],
    tier: 3,
    type: 'si-partner',
    parentDistributor: 'Cloudhop',
    managedMSSPs: ['mssp-001', 'mssp-002'], // Safaricom, MTN
    customers: ['cust-032', 'cust-033'],
    totalCustomers: 125,
    totalRevenue: 68000,
    monthlyGrowth: 14,
    registrationDate: '2023-08-15',
    status: 'active',
    contactEmail: 'partners@copycat.co.uk',
    accountManager: 'Emma Wilson',
    appSecUsage: {
      cdn: 45.4,
      waf: 37.2,
      ddosProtection: 23.1,
      loadBalancing: 6.6,
      spectrum: 4.5,
      argo: 3.6,
      total: 120.4
    },
    ztnaUsage: {
      gateway: 590,
      access: 400,
      dlp: 220,
      casb: 130,
      browserIsolation: 85,
      essential: 330,
      advanced: 220,
      premier: 120,
      total: 2095
    },
    emailUsage: {
      area1: 3700,
      advancedThreatProtection: 1540,
      total: 5240
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'si-002',
    name: 'Forefront',
    region: 'EMEA',
    country: ['United Kingdom'],
    tier: 3,
    type: 'si-partner',
    parentDistributor: 'Cloudhop',
    managedMSSPs: ['mssp-003'], // Seacom
    customers: ['cust-034', 'cust-035'],
    totalCustomers: 98,
    totalRevenue: 54000,
    monthlyGrowth: 16,
    registrationDate: '2023-09-10',
    status: 'active',
    contactEmail: 'security@forefront.co.uk',
    accountManager: 'Robert Davies',
    appSecUsage: {
      cdn: 36.6,
      waf: 29.4,
      ddosProtection: 18.1,
      loadBalancing: 5.1,
      spectrum: 3.4,
      argo: 2.7,
      total: 95.3
    },
    ztnaUsage: {
      gateway: 465,
      access: 315,
      dlp: 170,
      casb: 100,
      browserIsolation: 65,
      essential: 260,
      advanced: 170,
      premier: 95,
      total: 1640
    },
    emailUsage: {
      area1: 2900,
      advancedThreatProtection: 1210,
      total: 4110
    },
    pricing: pricingTiers.standard
  }
];

// Distributor Managed MSSP Partners - Updated with Synopsis partners
export const distributorManagedMSSPs: DistributorManagedMSSP[] = [
  // Under Cloudhop -> Copy Cat
  {
    id: 'mssp-001',
    name: 'Safaricom',
    region: 'EMEA',
    country: ['Kenya'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Cloudhop',
    parentSI: 'Copy Cat',
    customers: ['cust-036', 'cust-037'],
    totalCustomers: 45,
    totalRevenue: 32000,
    monthlyGrowth: 18,
    registrationDate: '2023-10-05',
    status: 'active',
    contactEmail: 'cyber@safaricom.co.ke',
    accountManager: 'Grace Mwangi',
    appSecUsage: {
      cdn: 21.8,
      waf: 17.8,
      ddosProtection: 11.1,
      loadBalancing: 3.1,
      spectrum: 2.1,
      argo: 1.7,
      total: 57.6
    },
    ztnaUsage: {
      gateway: 280,
      access: 190,
      dlp: 105,
      casb: 60,
      browserIsolation: 40,
      essential: 155,
      advanced: 105,
      premier: 58,
      total: 993
    },
    emailUsage: {
      area1: 1650,
      advancedThreatProtection: 690,
      total: 2340
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-002',
    name: 'MTN',
    region: 'EMEA',
    country: ['South Africa'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Cloudhop',
    parentSI: 'Copy Cat',
    customers: ['cust-038', 'cust-039'],
    totalCustomers: 52,
    totalRevenue: 38000,
    monthlyGrowth: 16,
    registrationDate: '2023-09-20',
    status: 'active',
    contactEmail: 'security@mtn.co.za',
    accountManager: 'Thabo Mthembu',
    appSecUsage: {
      cdn: 25.6,
      waf: 20.8,
      ddosProtection: 13.0,
      loadBalancing: 3.7,
      spectrum: 2.5,
      argo: 2.0,
      total: 67.6
    },
    ztnaUsage: {
      gateway: 330,
      access: 220,
      dlp: 120,
      casb: 70,
      browserIsolation: 47,
      essential: 183,
      advanced: 122,
      premier: 68,
      total: 1160
    },
    emailUsage: {
      area1: 1950,
      advancedThreatProtection: 810,
      total: 2760
    },
    pricing: pricingTiers.standard
  },
  // Under Cloudhop -> Forefront
  {
    id: 'mssp-003',
    name: 'Seacom',
    region: 'EMEA',
    country: ['Kenya', 'Tanzania'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Cloudhop',
    parentSI: 'Forefront',
    customers: ['cust-040', 'cust-041'],
    totalCustomers: 38,
    totalRevenue: 28000,
    monthlyGrowth: 12,
    registrationDate: '2023-11-12',
    status: 'active',
    contactEmail: 'cyber@seacom.mu',
    accountManager: 'Ahmed Hassan',
    appSecUsage: {
      cdn: 18.2,
      waf: 14.7,
      ddosProtection: 9.2,
      loadBalancing: 2.6,
      spectrum: 1.8,
      argo: 1.4,
      total: 47.9
    },
    ztnaUsage: {
      gateway: 235,
      access: 158,
      dlp: 86,
      casb: 50,
      browserIsolation: 33,
      essential: 130,
      advanced: 87,
      premier: 48,
      total: 827
    },
    emailUsage: {
      area1: 1380,
      advancedThreatProtection: 575,
      total: 1955
    },
    pricing: pricingTiers.standard
  },
  // Under Cloudhop (Direct)
  {
    id: 'mssp-004',
    name: 'Liquid C2',
    region: 'EMEA',
    country: ['Zambia', 'Zimbabwe'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Cloudhop',
    customers: ['cust-042', 'cust-043'],
    totalCustomers: 42,
    totalRevenue: 35000,
    monthlyGrowth: 15,
    registrationDate: '2023-10-28',
    status: 'active',
    contactEmail: 'security@liquid.tech',
    accountManager: 'Chipo Mukamuri',
    appSecUsage: {
      cdn: 22.4,
      waf: 18.3,
      ddosProtection: 11.4,
      loadBalancing: 3.2,
      spectrum: 2.2,
      argo: 1.7,
      total: 59.2
    },
    ztnaUsage: {
      gateway: 290,
      access: 195,
      dlp: 106,
      casb: 62,
      browserIsolation: 41,
      essential: 161,
      advanced: 107,
      premier: 59,
      total: 1021
    },
    emailUsage: {
      area1: 1700,
      advancedThreatProtection: 710,
      total: 2410
    },
    pricing: pricingTiers.standard
  },
  
  // UPDATED SYNOPSIS MANAGED MSSP PARTNERS - All 7 requested partners
  // 1. Koc SISTEM
  {
    id: 'mssp-005',
    name: 'Koc SISTEM',
    region: 'EMEA',
    country: ['Turkey'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Synopsis',
    customers: ['cust-044', 'cust-045'],
    totalCustomers: 48,
    totalRevenue: 42000,
    monthlyGrowth: 19,
    registrationDate: '2024-02-01',
    status: 'active',
    contactEmail: 'security@kocsistem.com.tr',
    accountManager: 'Ayse Demir',
    appSecUsage: {
      cdn: 28.2,
      waf: 22.9,
      ddosProtection: 14.3,
      loadBalancing: 4.1,
      spectrum: 2.8,
      argo: 2.2,
      total: 74.5
    },
    ztnaUsage: {
      gateway: 375,
      access: 253,
      dlp: 139,
      casb: 81,
      browserIsolation: 54,
      essential: 208,
      advanced: 139,
      premier: 77,
      total: 1326
    },
    emailUsage: {
      area1: 2120,
      advancedThreatProtection: 883,
      total: 3003
    },
    pricing: pricingTiers.standard
  },
  // 2. DAMAMAX
  {
    id: 'mssp-006',
    name: 'DAMAMAX',
    region: 'EMEA',
    country: ['Saudi Arabia'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Synopsis',
    customers: ['cust-046', 'cust-047'],
    totalCustomers: 58,
    totalRevenue: 48000,
    monthlyGrowth: 18,
    registrationDate: '2023-10-20',
    status: 'active',
    contactEmail: 'security@damamax.com',
    accountManager: 'Ahmed Al-Rashid',
    appSecUsage: {
      cdn: 30.8,
      waf: 25.0,
      ddosProtection: 15.6,
      loadBalancing: 4.4,
      spectrum: 3.0,
      argo: 2.4,
      total: 81.2
    },
    ztnaUsage: {
      gateway: 395,
      access: 268,
      dlp: 147,
      casb: 86,
      browserIsolation: 57,
      essential: 220,
      advanced: 147,
      premier: 81,
      total: 1401
    },
    emailUsage: {
      area1: 2310,
      advancedThreatProtection: 963,
      total: 3273
    },
    pricing: pricingTiers.standard
  },
  // 3. GBM
  {
    id: 'mssp-007',
    name: 'GBM',
    region: 'EMEA',
    country: ['UAE', 'Saudi Arabia'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Synopsis',
    customers: ['cust-048', 'cust-049'],
    totalCustomers: 95,
    totalRevenue: 78000,
    monthlyGrowth: 25,
    registrationDate: '2023-08-12',
    status: 'active',
    contactEmail: 'security@gbm.me',
    accountManager: 'Omar Al-Maktoum',
    appSecUsage: {
      cdn: 50.5,
      waf: 41.0,
      ddosProtection: 25.6,
      loadBalancing: 7.3,
      spectrum: 4.9,
      argo: 3.9,
      total: 133.2
    },
    ztnaUsage: {
      gateway: 650,
      access: 439,
      dlp: 241,
      casb: 140,
      browserIsolation: 93,
      essential: 361,
      advanced: 241,
      premier: 133,
      total: 2298
    },
    emailUsage: {
      area1: 3800,
      advancedThreatProtection: 1583,
      total: 5383
    },
    pricing: pricingTiers.premium
  },
  // 4. KALAM
  {
    id: 'mssp-008',
    name: 'KALAM',
    region: 'EMEA',
    country: ['UAE'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Synopsis',
    customers: ['cust-050', 'cust-051'],
    totalCustomers: 65,
    totalRevenue: 52000,
    monthlyGrowth: 20,
    registrationDate: '2023-09-25',
    status: 'active',
    contactEmail: 'cyber@kalam.ae',
    accountManager: 'Fatima Al-Zahra',
    appSecUsage: {
      cdn: 34.5,
      waf: 28.0,
      ddosProtection: 17.5,
      loadBalancing: 5.0,
      spectrum: 3.4,
      argo: 2.7,
      total: 91.1
    },
    ztnaUsage: {
      gateway: 445,
      access: 300,
      dlp: 165,
      casb: 95,
      browserIsolation: 63,
      essential: 247,
      advanced: 165,
      premier: 91,
      total: 1571
    },
    emailUsage: {
      area1: 2600,
      advancedThreatProtection: 1080,
      total: 3680
    },
    pricing: pricingTiers.standard
  },
  // 5. Liquid
  {
    id: 'mssp-021',
    name: 'Liquid',
    region: 'EMEA',
    country: ['South Africa', 'Kenya'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Synopsis',
    customers: ['cust-052', 'cust-053'],
    totalCustomers: 72,
    totalRevenue: 62000,
    monthlyGrowth: 22,
    registrationDate: '2023-11-05',
    status: 'active',
    contactEmail: 'security@liquid.tech',
    accountManager: 'Ndumiso Sibanda',
    appSecUsage: {
      cdn: 38.8,
      waf: 31.5,
      ddosProtection: 19.7,
      loadBalancing: 5.6,
      spectrum: 3.8,
      argo: 3.0,
      total: 102.4
    },
    ztnaUsage: {
      gateway: 500,
      access: 338,
      dlp: 185,
      casb: 108,
      browserIsolation: 72,
      essential: 278,
      advanced: 185,
      premier: 102,
      total: 1768
    },
    emailUsage: {
      area1: 2880,
      advancedThreatProtection: 1200,
      total: 4080
    },
    pricing: pricingTiers.standard
  },
  // 6. Shabakati
  {
    id: 'mssp-022',
    name: 'Shabakati',
    region: 'EMEA',
    country: ['Saudi Arabia', 'UAE'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Synopsis',
    customers: ['cust-054', 'cust-055'],
    totalCustomers: 45,
    totalRevenue: 38000,
    monthlyGrowth: 16,
    registrationDate: '2023-12-10',
    status: 'active',
    contactEmail: 'security@shabakati.com',
    accountManager: 'Nasser Al-Otaibi',
    appSecUsage: {
      cdn: 25.8,
      waf: 21.0,
      ddosProtection: 13.1,
      loadBalancing: 3.7,
      spectrum: 2.5,
      argo: 2.0,
      total: 68.1
    },
    ztnaUsage: {
      gateway: 332,
      access: 224,
      dlp: 123,
      casb: 72,
      browserIsolation: 48,
      essential: 184,
      advanced: 123,
      premier: 68,
      total: 1174
    },
    emailUsage: {
      area1: 1920,
      advancedThreatProtection: 800,
      total: 2720
    },
    pricing: pricingTiers.standard
  },
  // 7. Exeo
  {
    id: 'mssp-023',
    name: 'Exeo',
    region: 'EMEA',
    country: ['Turkey', 'Germany'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Synopsis',
    customers: ['cust-056', 'cust-057'],
    totalCustomers: 38,
    totalRevenue: 32000,
    monthlyGrowth: 14,
    registrationDate: '2024-01-15',
    status: 'active',
    contactEmail: 'security@exeo.com.tr',
    accountManager: 'Mehmet Ozturk',
    appSecUsage: {
      cdn: 21.5,
      waf: 17.5,
      ddosProtection: 10.9,
      loadBalancing: 3.1,
      spectrum: 2.1,
      argo: 1.7,
      total: 56.8
    },
    ztnaUsage: {
      gateway: 285,
      access: 193,
      dlp: 105,
      casb: 62,
      browserIsolation: 41,
      essential: 158,
      advanced: 105,
      premier: 58,
      total: 1007
    },
    emailUsage: {
      area1: 1600,
      advancedThreatProtection: 667,
      total: 2267
    },
    pricing: pricingTiers.standard
  },
  
  // Continue with other distributor managed MSSPs (renumbered to avoid conflicts)...
  // Under e92plus
  {
    id: 'mssp-009',
    name: 'ANS Group',
    region: 'EMEA',
    country: ['United Kingdom'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'e92plus',
    customers: ['cust-058', 'cust-059'],
    totalCustomers: 72,
    totalRevenue: 62000,
    monthlyGrowth: 22,
    registrationDate: '2023-08-25',
    status: 'active',
    contactEmail: 'security@ansgroup.co.uk',
    accountManager: 'James Robertson',
    appSecUsage: {
      cdn: 38.8,
      waf: 31.5,
      ddosProtection: 19.7,
      loadBalancing: 5.6,
      spectrum: 3.8,
      argo: 3.0,
      total: 102.4
    },
    ztnaUsage: {
      gateway: 500,
      access: 338,
      dlp: 185,
      casb: 108,
      browserIsolation: 72,
      essential: 278,
      advanced: 185,
      premier: 102,
      total: 1768
    },
    emailUsage: {
      area1: 2880,
      advancedThreatProtection: 1200,
      total: 4080
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-010',
    name: 'Teamblue',
    region: 'EMEA',
    country: ['Netherlands'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'e92plus',
    customers: ['cust-060', 'cust-061'],
    totalCustomers: 55,
    totalRevenue: 45000,
    monthlyGrowth: 16,
    registrationDate: '2023-09-30',
    status: 'active',
    contactEmail: 'security@teamblue.nl',
    accountManager: 'Nina van der Berg',
    appSecUsage: {
      cdn: 29.5,
      waf: 24.0,
      ddosProtection: 15.0,
      loadBalancing: 4.3,
      spectrum: 2.9,
      argo: 2.3,
      total: 78.0
    },
    ztnaUsage: {
      gateway: 380,
      access: 257,
      dlp: 141,
      casb: 82,
      browserIsolation: 55,
      essential: 211,
      advanced: 141,
      premier: 78,
      total: 1345
    },
    emailUsage: {
      area1: 2200,
      advancedThreatProtection: 917,
      total: 3117
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-011',
    name: 'Abtec',
    region: 'EMEA',
    country: ['Belgium'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'e92plus',
    customers: ['cust-062', 'cust-063'],
    totalCustomers: 48,
    totalRevenue: 41000,
    monthlyGrowth: 14,
    registrationDate: '2023-11-05',
    status: 'active',
    contactEmail: 'security@abtec.be',
    accountManager: 'Pierre Dubois',
    appSecUsage: {
      cdn: 25.8,
      waf: 21.0,
      ddosProtection: 13.1,
      loadBalancing: 3.7,
      spectrum: 2.5,
      argo: 2.0,
      total: 68.1
    },
    ztnaUsage: {
      gateway: 332,
      access: 224,
      dlp: 123,
      casb: 72,
      browserIsolation: 48,
      essential: 184,
      advanced: 123,
      premier: 68,
      total: 1174
    },
    emailUsage: {
      area1: 1920,
      advancedThreatProtection: 800,
      total: 2720
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-012',
    name: 'Telefonica',
    region: 'EMEA',
    country: ['Spain'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'V-Valley Spain',
    customers: ['cust-064', 'cust-065'],
    totalCustomers: 32,
    totalRevenue: 28000,
    monthlyGrowth: 13,
    registrationDate: '2023-12-10',
    status: 'active',
    contactEmail: 'cyber@telefonica.es',
    accountManager: 'Carlos Ruiz',
    appSecUsage: {
      cdn: 17.8,
      waf: 14.5,
      ddosProtection: 9.1,
      loadBalancing: 2.6,
      spectrum: 1.7,
      argo: 1.4,
      total: 47.1
    },
    ztnaUsage: {
      gateway: 230,
      access: 155,
      dlp: 85,
      casb: 50,
      browserIsolation: 33,
      essential: 128,
      advanced: 85,
      premier: 47,
      total: 813
    },
    emailUsage: {
      area1: 1280,
      advancedThreatProtection: 533,
      total: 1813
    },
    pricing: pricingTiers.standard
  },
  // Under Dicker Data AUS
  {
    id: 'mssp-013',
    name: 'CyberPulse',
    region: 'APAC',
    country: ['Australia'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Dicker Data AUS',
    customers: ['cust-066', 'cust-067'],
    totalCustomers: 58,
    totalRevenue: 52000,
    monthlyGrowth: 16,
    registrationDate: '2023-08-12',
    status: 'active',
    contactEmail: 'security@cyberpulse.com.au',
    accountManager: 'David Miller',
    appSecUsage: {
      cdn: 32.8,
      waf: 26.6,
      ddosProtection: 16.6,
      loadBalancing: 4.7,
      spectrum: 3.2,
      argo: 2.5,
      total: 86.4
    },
    ztnaUsage: {
      gateway: 420,
      access: 284,
      dlp: 156,
      casb: 91,
      browserIsolation: 61,
      essential: 233,
      advanced: 156,
      premier: 86,
      total: 1487
    },
    emailUsage: {
      area1: 2320,
      advancedThreatProtection: 967,
      total: 3287
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-014',
    name: 'Insicon',
    region: 'APAC',
    country: ['Australia'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Dicker Data AUS',
    customers: ['cust-068', 'cust-069'],
    totalCustomers: 42,
    totalRevenue: 38000,
    monthlyGrowth: 12,
    registrationDate: '2023-09-25',
    status: 'active',
    contactEmail: 'security@insicon.com.au',
    accountManager: 'Sarah Thompson',
    appSecUsage: {
      cdn: 23.8,
      waf: 19.3,
      ddosProtection: 12.1,
      loadBalancing: 3.4,
      spectrum: 2.3,
      argo: 1.8,
      total: 62.7
    },
    ztnaUsage: {
      gateway: 305,
      access: 206,
      dlp: 113,
      casb: 66,
      browserIsolation: 44,
      essential: 169,
      advanced: 113,
      premier: 62,
      total: 1078
    },
    emailUsage: {
      area1: 1680,
      advancedThreatProtection: 700,
      total: 2380
    },
    pricing: pricingTiers.standard
  },
  // Under Dicker Data NZ
  {
    id: 'mssp-015',
    name: 'Advantage',
    region: 'APAC',
    country: ['New Zealand'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Dicker Data NZ',
    customers: ['cust-070', 'cust-071'],
    totalCustomers: 35,
    totalRevenue: 32000,
    monthlyGrowth: 14,
    registrationDate: '2023-10-08',
    status: 'active',
    contactEmail: 'security@advantage.co.nz',
    accountManager: 'Mark Wilson',
    appSecUsage: {
      cdn: 20.5,
      waf: 16.6,
      ddosProtection: 10.4,
      loadBalancing: 3.0,
      spectrum: 2.0,
      argo: 1.6,
      total: 54.1
    },
    ztnaUsage: {
      gateway: 264,
      access: 178,
      dlp: 98,
      casb: 57,
      browserIsolation: 38,
      essential: 146,
      advanced: 98,
      premier: 54,
      total: 933
    },
    emailUsage: {
      area1: 1400,
      advancedThreatProtection: 583,
      total: 1983
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-016',
    name: 'ASI Solutions',
    region: 'APAC',
    country: ['New Zealand'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Dicker Data NZ',
    customers: ['cust-072', 'cust-073'],
    totalCustomers: 28,
    totalRevenue: 26000,
    monthlyGrowth: 11,
    registrationDate: '2023-11-20',
    status: 'active',
    contactEmail: 'security@asi.co.nz',
    accountManager: 'Lisa Brown',
    appSecUsage: {
      cdn: 16.8,
      waf: 13.6,
      ddosProtection: 8.5,
      loadBalancing: 2.4,
      spectrum: 1.6,
      argo: 1.3,
      total: 44.2
    },
    ztnaUsage: {
      gateway: 215,
      access: 145,
      dlp: 80,
      casb: 46,
      browserIsolation: 31,
      essential: 119,
      advanced: 80,
      premier: 44,
      total: 760
    },
    emailUsage: {
      area1: 1120,
      advancedThreatProtection: 467,
      total: 1587
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-017',
    name: 'NETQ',
    region: 'APAC',
    country: ['New Zealand'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'Dicker Data NZ',
    customers: ['cust-074', 'cust-075'],
    totalCustomers: 22,
    totalRevenue: 21000,
    monthlyGrowth: 9,
    registrationDate: '2023-12-15',
    status: 'active',
    contactEmail: 'security@netq.co.nz',
    accountManager: 'Peter Davis',
    appSecUsage: {
      cdn: 13.2,
      waf: 10.7,
      ddosProtection: 6.7,
      loadBalancing: 1.9,
      spectrum: 1.3,
      argo: 1.0,
      total: 34.8
    },
    ztnaUsage: {
      gateway: 170,
      access: 115,
      dlp: 63,
      casb: 37,
      browserIsolation: 25,
      essential: 94,
      advanced: 63,
      premier: 35,
      total: 602
    },
    emailUsage: {
      area1: 880,
      advancedThreatProtection: 367,
      total: 1247
    },
    pricing: pricingTiers.standard
  },
  // Under TDSynnex
  {
    id: 'mssp-018',
    name: 'Brava Solutions',
    region: 'LATAM',
    country: ['Brazil'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'TDSynnex',
    customers: ['cust-076', 'cust-077'],
    totalCustomers: 68,
    totalRevenue: 58000,
    monthlyGrowth: 17,
    registrationDate: '2023-07-22',
    status: 'active',
    contactEmail: 'security@brava.com.br',
    accountManager: 'Ana Costa',
    appSecUsage: {
      cdn: 38.8,
      waf: 31.5,
      ddosProtection: 19.7,
      loadBalancing: 5.6,
      spectrum: 3.8,
      argo: 3.0,
      total: 102.4
    },
    ztnaUsage: {
      gateway: 500,
      access: 338,
      dlp: 185,
      casb: 108,
      browserIsolation: 72,
      essential: 278,
      advanced: 185,
      premier: 102,
      total: 1768
    },
    emailUsage: {
      area1: 2720,
      advancedThreatProtection: 1133,
      total: 3853
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-019',
    name: 'DigitalEra Group LLC',
    region: 'LATAM',
    country: ['Mexico'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'TDSynnex',
    customers: ['cust-078', 'cust-079'],
    totalCustomers: 52,
    totalRevenue: 45000,
    monthlyGrowth: 15,
    registrationDate: '2023-08-30',
    status: 'active',
    contactEmail: 'security@digitalera.mx',
    accountManager: 'Miguel Rodriguez',
    appSecUsage: {
      cdn: 29.8,
      waf: 24.2,
      ddosProtection: 15.1,
      loadBalancing: 4.3,
      spectrum: 2.9,
      argo: 2.3,
      total: 78.6
    },
    ztnaUsage: {
      gateway: 383,
      access: 259,
      dlp: 142,
      casb: 83,
      browserIsolation: 55,
      essential: 213,
      advanced: 142,
      premier: 79,
      total: 1356
    },
    emailUsage: {
      area1: 2080,
      advancedThreatProtection: 867,
      total: 2947
    },
    pricing: pricingTiers.standard
  },
  {
    id: 'mssp-020',
    name: 'ePerform Solutions',
    region: 'LATAM',
    country: ['Argentina'],
    tier: 4,
    type: 'distributor-managed-mssp',
    parentDistributor: 'TDSynnex',
    customers: ['cust-080', 'cust-081'],
    totalCustomers: 38,
    totalRevenue: 34000,
    monthlyGrowth: 13,
    registrationDate: '2023-10-18',
    status: 'active',
    contactEmail: 'security@eperform.com.ar',
    accountManager: 'Sofia Martinez',
    appSecUsage: {
      cdn: 21.8,
      waf: 17.7,
      ddosProtection: 11.1,
      loadBalancing: 3.2,
      spectrum: 2.1,
      argo: 1.7,
      total: 57.6
    },
    ztnaUsage: {
      gateway: 280,
      access: 189,
      dlp: 104,
      casb: 60,
      browserIsolation: 40,
      essential: 155,
      advanced: 104,
      premier: 58,
      total: 990
    },
    emailUsage: {
      area1: 1520,
      advancedThreatProtection: 633,
      total: 2153
    },
    pricing: pricingTiers.standard
  }
];

// Customer accounts with realistic data (keeping existing structure)
export const customerAccounts: CustomerAccount[] = [
  {
    id: 'cust-001',
    name: 'TechCorp France',
    accountId: 'ACC-TECH001',
    parentPartner: 'Orange',
    parentPartnerType: 'direct-mssp',
    region: 'EMEA',
    country: 'France',
    zones: [
      { id: 'zone-001', domain: 'techcorp.fr', plan: 'Enterprise', appSecUsage: 12.5, monthlyRequests: 45000000, bandwidthUsage: 2500 },
      { id: 'zone-002', domain: 'api.techcorp.fr', plan: 'Business', appSecUsage: 8.2, monthlyRequests: 28000000, bandwidthUsage: 1800 }
    ],
    totalZones: 2,
    monthlySpend: 8500,
    registrationDate: '2023-04-15',
    industry: 'Technology',
    size: 'Enterprise',
    appSecUsage: {
      cdn: 8.5,
      waf: 6.8,
      ddosProtection: 4.2,
      loadBalancing: 1.0,
      spectrum: 0.7,
      argo: 0.5,
      total: 21.7
    },
    ztnaUsage: {
      gateway: 150,
      access: 100,
      dlp: 55,
      casb: 32,
      browserIsolation: 20,
      essential: 75,
      advanced: 50,
      premier: 28,
      total: 510
    },
    emailUsage: {
      area1: 850,
      advancedThreatProtection: 350,
      total: 1200
    }
  }
];

// Revenue data for 12 months
export const revenueData: RevenueData[] = [
  {
    month: 'Jan',
    year: 2025,
    totalRevenue: 2850000,
    appSecRevenue: 1710000,
    ztnaRevenue: 798000,
    emailRevenue: 342000,
    newPartners: 6,
    newCustomers: 125,
    churnRate: 2.1
  },
  {
    month: 'Feb',
    year: 2025,
    totalRevenue: 3125000,
    appSecRevenue: 1875000,
    ztnaRevenue: 875000,
    emailRevenue: 375000,
    newPartners: 5,
    newCustomers: 142,
    churnRate: 1.8
  },
  {
    month: 'Mar',
    year: 2025,
    totalRevenue: 3385000,
    appSecRevenue: 2031000,
    ztnaRevenue: 947200,
    emailRevenue: 406800,
    newPartners: 8,
    newCustomers: 165,
    churnRate: 2.3
  },
  {
    month: 'Apr',
    year: 2025,
    totalRevenue: 3180000,
    appSecRevenue: 1908000,
    ztnaRevenue: 890400,
    emailRevenue: 381600,
    newPartners: 2,
    newCustomers: 98,
    churnRate: 3.2
  },
  {
    month: 'May',
    year: 2025,
    totalRevenue: 3920000,
    appSecRevenue: 2352000,
    ztnaRevenue: 1097600,
    emailRevenue: 470400,
    newPartners: 9,
    newCustomers: 178,
    churnRate: 2.0
  },
  {
    month: 'Jun',
    year: 2025,
    totalRevenue: 4195000,
    appSecRevenue: 2517000,
    ztnaRevenue: 1174600,
    emailRevenue: 503400,
    newPartners: 6,
    newCustomers: 168,
    churnRate: 1.7
  }
];

// Monthly registrations with real partner names from SOW - Updated for Synopsis partners
// export const monthlyRegistrations: MonthlyRegistrations = {
//   'Jan': {
//     distributors: ['Cloudhop', 'Synopsis'],
//     directMSSPs: ['Orange', 'SolCyber'],
//     siPartners: ['Copy Cat'],
//     distributorManagedMSSPs: ['Safaricom', 'Koc SISTEM'] // Added Koc SISTEM
//   },
//   'Feb': {
//     distributors: ['e92plus'],
//     directMSSPs: ['Nanosek', 'Swisscom'],
//     siPartners: [],
//     distributorManagedMSSPs: ['MTN', 'CyberPulse', 'DAMAMAX'] // Added DAMAMAX
//   },
//   'Mar': {
//     distributors: ['Radius Channels'],
//     directMSSPs: ['Nocwing', 'Syntax', 'Rakuten Japan'],
//     siPartners: ['Forefront'],
//     distributorManagedMSSPs: ['Seacom', 'ANS Group', 'GBM'] // Added GBM
//   },
//   'Apr': {
//     distributors: ['Infinigate Germany'],
//     directMSSPs: ['Revolt', 'Netnordic'],
//     siPartners: [],
//     distributorManagedMSSPs: ['Liquid C2', 'Advantage', 'KALAM'] // Added KALAM
//   },
//   'May': {
//     distributors: ['V-Valley Spain', 'Dicker Data AUS'],
//     directMSSPs: ['Kaemi'],
//     siPartners: [],
//     distributorManagedMSSPs: ['ASI Solutions', 'Liquid'] // Added Liquid
//   },
//   'Jun': {
//     distributors: ['V-Valley Portugal', 'Dicker Data NZ', 'TDSynnex'],
//     directMSSPs: [],
//     siPartners: [],
//     distributorManagedMSSPs: ['Brava Solutions', 'ePerform Solutions', 'Teamblue', 'Shabakati', 'Exeo'] // Added Shabakati and Exeo
//   }
// };

// Monthly registrations with real partner names from SOW - Updated for Synopsis partners
export const monthlyRegistrations: MonthlyRegistrations = {
  'Jan': {
    distributors: ['Cloudhop'],
    directMSSPs: ['Orange', 'SolCyber'], // 2 MSSP Direct
    siPartners: ['Copy Cat'],
    distributorManagedMSSPs: ['Safaricom', 'Koc SISTEM', 'MTN'] // 3 Distributor Managed
  },
  'Feb': {
    distributors: ['e92plus'],
    directMSSPs: ['Nanosek'], // 1 MSSP Direct
    siPartners: [],
    distributorManagedMSSPs: ['CyberPulse', 'DAMAMAX'] // 2 Distributor Managed
  },
  'Mar': {
    distributors: ['Radius Channels'],
    directMSSPs: ['Nocwing', 'Syntax', 'Rakuten Japan'], // 3 MSSP Direct
    siPartners: ['Forefront'],
    distributorManagedMSSPs: ['Seacom', 'ANS Group'] // 2 Distributor Managed
  },
  'Apr': {
    distributors: ['Infinigate Germany'],
    directMSSPs: ['Revolt', 'Netnordic'], // 2 MSSP Direct
    siPartners: [],
    distributorManagedMSSPs: ['Liquid C2'] // 1 Distributor Managed
  },
  'May': {
    distributors: ['V-Valley Spain', 'Dicker Data AUS'],
    directMSSPs: ['Kaemi', 'Swisscom'], // 2 MSSP Direct
    siPartners: [],
    distributorManagedMSSPs: ['ASI Solutions', 'Liquid', 'GBM'] // 3 Distributor Managed
  },
  'Jun': {
    distributors: ['V-Valley Portugal', 'Dicker Data NZ', 'TDSynnex'],
    directMSSPs: ['Rackspace'], // 1 MSSP Direct
    siPartners: [],
    distributorManagedMSSPs: ['Brava Solutions', 'ePerform Solutions', 'Teamblue'] // 3 Distributor Managed
  }
};

// Industry breakdown for customers
export const industryData = [
  { name: 'Technology', percentage: 28, customers: 485 },
  { name: 'Financial Services', percentage: 22, customers: 382 },
  { name: 'Healthcare', percentage: 18, customers: 347 },
  { name: 'Manufacturing', percentage: 15, customers: 306 },
  { name: 'Retail', percentage: 12, customers: 265 },
  { name: 'Government', percentage: 5, customers: 89 }
];

// Service usage distribution with detailed breakdown
export const serviceUsageDistribution = {
  'Application Security': {
    percentage: 30,
    totalUsage: '2,123 TB',
    breakdown: [
      { name: 'CDN', percentage: 12.5, usage: '925 TB', revenue: 111000 },
      { name: 'WAF', percentage: 10, usage: '638 TB', revenue: 76500 },
      { name: 'DDoS Protection', percentage: 5, usage: '325 TB', revenue: 39000 },
      { name: 'Load Balancing', percentage: 1.5, usage: '93 TB', revenue: 11100 },
      { name: 'Spectrum', percentage: 0.75, usage: '51 TB', revenue: 6120 },
      { name: 'Argo Smart Routing', percentage: 0.25, usage: '53 TB', revenue: 6300 }
    ]
  },
  'Zero Trust': {
    percentage: 60,
    totalUsage: '125,700 Seats',
    breakdown: [
      { name: 'Gateway', percentage: 24, usage: '36,900 Seats', revenue: 295200 },
      { name: 'Access', percentage: 16, usage: '25,360 Seats', revenue: 202880 },
      { name: 'DLP', percentage: 10, usage: '15,780 Seats', revenue: 126240 },
      { name: 'CASB', percentage: 6, usage: '9,040 Seats', revenue: 72320 },
      { name: 'Browser Isolation', percentage: 4, usage: '5,680 Seats', revenue: 45440 }
    ]
  },
  'Email Security': {
    percentage: 10,
    totalUsage: '185,800 Inboxes',
    breakdown: [
      { name: 'Area 1', percentage: 7, usage: '127,500 Inboxes', revenue: 318750 },
      { name: 'Advanced Threat Protection', percentage: 3, usage: '58,300 Inboxes', revenue: 145750 }
    ]
  }
};

export default {
  distributorPartners,
  directMSSPPartners,
  systemIntegratorPartners,
  distributorManagedMSSPs,
  customerAccounts,
  revenueData,
  monthlyRegistrations,
  pricingTiers,
  industryData,
  serviceUsageDistribution
};