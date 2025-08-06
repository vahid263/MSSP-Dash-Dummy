'use client';

import React, { useState, useMemo, ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Globe, 
  Building2, 
  Shield, 
  Cloud, 
  Mail,
  Search,
  Download,
  RefreshCw,
  Settings,
  Bell,
  ChevronDown,
  BarChart3,
  Activity,
  Zap,
  AlertTriangle,
  FileText,
  Plus,
  LucideIcon,
  Upload,
  Network
} from 'lucide-react';

// Import types and data
import {
  PartnerType,
  UsageCategory,
  Region,
  DistributorPartner,
  DirectMSSPPartner,
  SystemIntegratorPartner,
  DistributorManagedMSSP,
  CustomerAccount,
  UserRole
} from './types';
import ClientOnboardingComponent from './ClientOnboardingComponent';

// Define ViewType locally to include the new drill-down view
type ViewType = 'dashboard' | 'partnerList' | 'monthlyDetails' | 'usage' | 'partnerUsageDetails' | 'customerDetails' | 'partnerDrillDown' | 'clientOnboarding' | 'commercials' | 'magicTransit' | 'msspPartnerView'| 'kocSistemView';


// Add Synopsis Tier 2 filtering functionality
const SYNOPSIS_DISTRIBUTOR_ID = 'dist-002';
const SYNOPSIS_MANAGED_MSSPS = ['mssp-005', 'mssp-006', 'mssp-007', 'mssp-008', 'mssp-021', 'mssp-022', 'mssp-023'];

import mockData from './mockData';

const kocSistemData = {
  id: 'mssp-005',
  name: 'Koc SISTEM',
  region: 'EMEA',
  country: ['Turkey'],
  totalCustomers: 48,
  totalRevenue: 42000,
  monthlyGrowth: 19,
  ytdRevenue: 252000, // Estimated YTD from monthly data
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
  }
};

const kocRevenueGrowth = [
  { month: 'Jan', revenue: 38000, growth: 12 },
  { month: 'Feb', revenue: 39500, growth: 15 },
  { month: 'Mar', revenue: 40200, growth: 16 },
  { month: 'Apr', revenue: 41000, growth: 18 },
  { month: 'May', revenue: 41800, growth: 19 },
  { month: 'Jun', revenue: 42000, growth: 19 }
];

// Mock top 5 customers for Koc SISTEM
const kocTopCustomers = [
  { name: 'Turkish Airlines', revenue: 8400, appSecUsage: 15.2, ztSeats: 245, rank: 1 },
  { name: 'Garanti BBVA', revenue: 7200, appSecUsage: 12.8, ztSeats: 198, rank: 2 },
  { name: 'Turk Telekom', revenue: 6800, appSecUsage: 11.5, ztSeats: 176, rank: 3 },
  { name: 'Sabanci Holding', revenue: 5900, appSecUsage: 9.8, ztSeats: 158, rank: 4 },
  { name: 'Koc Holding', revenue: 5200, appSecUsage: 8.9, ztSeats: 142, rank: 5 }
];

// Product distribution for Koc SISTEM
const kocProductDistribution = [
  { name: 'App Security', value: 40, color: '#3B82F6' },
  { name: 'Zero Trust', value: 50, color: '#10B981' },
  { name: 'Email Security', value: 10, color: '#F59E0B' }
];


const usageAlertsData = {
  appSecAlerts: {
    threshold80: 46.1,
    threshold90: 51.8,
    threshold100: 58.0, // Calculated
    unit: 'TB'
  },
  ztnaAlerts: {
    threshold80: 794,
    threshold90: 894,
    threshold100: 993, // Calculated
    unit: 'seats'
  },
  emailAlerts: {
    currentUsage: 2340,
    monthlyConfirm: 'N',
    unit: 'inboxes'
  }
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  suffix?: string;
  onClick?: () => void;
  isClickable?: boolean;
}

const CloudPulseDashboard: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | 'ALL'>('ALL');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedPartnerType, setSelectedPartnerType] = useState<PartnerType | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [usageCategory, setUsageCategory] = useState<UsageCategory>('all');
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [userRole] = useState<UserRole>('cloudflare-global');

  // Magic Transit state management
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showSubnetCalculator, setShowSubnetCalculator] = useState(false);
  const [showNewAllocation, setShowNewAllocation] = useState(false);
  const [newAllocation, setNewAllocation] = useState({
    customer: '',
    region: '',
    subnet: '',
    allocated: 32,
    status: 'Active',
    monthlyBilling: 6400,
    notes: ''
  });
  const [subnetCalcInput, setSubnetCalcInput] = useState({
    network: '',
    mask: '',
    divisions: 2
  });

  // Magic Transit sample data
  const subnetAllocationData = [
    { 
      customer: 'Standard Bank', 
      subnet: '192.168.1.0/26', 
      allocated: 64,
      used: 48,
      status: 'Active',
      tunnelHealth: 'Healthy',
      monthlyBilling: 12800,
      dataTransfer: 45.2,
      region: 'South Africa'
    },
    { 
      customer: 'Mukuru', 
      subnet: '192.168.1.64/26', 
      allocated: 64,
      used: 52,
      status: 'Active',
      tunnelHealth: 'Degraded',
      monthlyBilling: 12800,
      dataTransfer: 38.7,
      region: 'Zimbabwe'
    },
    { 
      customer: 'First National Bank', 
      subnet: '192.168.1.128/26', 
      allocated: 64,
      used: 60,
      status: 'Active',
      tunnelHealth: 'Healthy',
      monthlyBilling: 12800,
      dataTransfer: 52.3,
      region: 'South Africa'
    },
    { 
      customer: 'Absa Group', 
      subnet: '192.168.1.192/27', 
      allocated: 32,
      used: 28,
      status: 'Active',
      tunnelHealth: 'Healthy',
      monthlyBilling: 6400,
      dataTransfer: 28.9,
      region: 'Kenya'
    },
    { 
      customer: 'i-PAY', 
      subnet: '192.168.1.224/27', 
      allocated: 32,
      used: 25,
      status: 'Active',
      tunnelHealth: 'Healthy',
      monthlyBilling: 6400,
      dataTransfer: 22.1,
      region: 'South Africa'
    },
  ];

  const bandwidthData = [
    { time: '00:00', Standard_Bank: 420, Mukuru: 380, FNB: 450, Absa: 280, iPay: 220 },
    { time: '04:00', Standard_Bank: 380, Mukuru: 420, FNB: 480, Absa: 300, iPay: 240 },
    { time: '08:00', Standard_Bank: 520, Mukuru: 480, FNB: 520, Absa: 350, iPay: 280 },
    { time: '12:00', Standard_Bank: 580, Mukuru: 520, FNB: 580, Absa: 420, iPay: 320 },
    { time: '16:00', Standard_Bank: 620, Mukuru: 580, FNB: 620, Absa: 380, iPay: 290 },
    { time: '20:00', Standard_Bank: 480, Mukuru: 420, FNB: 480, Absa: 320, iPay: 260 },
  ];

  const billingHistory = [
    { month: 'Jan', revenue: 51200, dataTransfer: 187.2 },
    { month: 'Feb', revenue: 51200, dataTransfer: 192.5 },
    { month: 'Mar', revenue: 51200, dataTransfer: 185.8 },
    { month: 'Apr', revenue: 51200, dataTransfer: 190.1 },
    { month: 'May', revenue: 51200, dataTransfer: 188.9 },
    { month: 'Jun', revenue: 51200, dataTransfer: 191.2 },
  ];

  const tunnelHealthHistory = [
    { date: '2024-01-01', healthy: 4, degraded: 1, down: 0 },
    { date: '2024-01-02', healthy: 5, degraded: 0, down: 0 },
    { date: '2024-01-03', healthy: 3, degraded: 2, down: 0 },
    { date: '2024-01-04', healthy: 4, degraded: 1, down: 0 },
    { date: '2024-01-05', healthy: 5, degraded: 0, down: 0 },
  ];

  // Get data from mock data
  const {
    distributorPartners,
    directMSSPPartners,
    systemIntegratorPartners,
    distributorManagedMSSPs,
    customerAccounts,
    revenueData,
    monthlyRegistrations,
    industryData,
    serviceUsageDistribution
  } = mockData;

  // Calculate current metrics
  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];

  // Filter data based on region and search
  const allPartners = useMemo(() => [
    ...distributorPartners.map(p => ({ ...p, partnerType: 'distributor' as const })),
    ...directMSSPPartners.map(p => ({ ...p, partnerType: 'direct-mssp' as const })),
    ...systemIntegratorPartners.map(p => ({ ...p, partnerType: 'si-partner' as const })),
    ...distributorManagedMSSPs.map(p => ({ ...p, partnerType: 'distributor-managed-mssp' as const }))
  ], [distributorPartners, directMSSPPartners, systemIntegratorPartners, distributorManagedMSSPs]);

  const regionFilteredPartners = useMemo(() => 
    allPartners.filter(partner => selectedRegion === 'ALL' || partner.region === selectedRegion),
    [allPartners, selectedRegion]
  );

  const filteredPartners = useMemo(() => 
    regionFilteredPartners.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = usageCategory === 'all' || 
        (usageCategory === 'distributor' && partner.partnerType === 'distributor') ||
        (usageCategory === 'direct' && partner.partnerType === 'direct-mssp') ||
        (usageCategory === 'si' && partner.partnerType === 'si-partner') ||
        (usageCategory === 'distributor-managed' && partner.partnerType === 'distributor-managed-mssp');
      return matchesSearch && matchesCategory;
    }),
    [regionFilteredPartners, searchQuery, usageCategory]
  );

  // Usage dashboard specific filtering (includes all filters)
  const usageFilteredData = useMemo(() => {
    let data = allPartners;
    
    // Apply region filter
    if (selectedRegion !== 'ALL') {
      data = data.filter(partner => partner.region === selectedRegion);
    }
    
    // Apply category filter
    if (usageCategory !== 'all') {
      data = data.filter(partner => {
        switch(usageCategory) {
          case 'distributor': return partner.partnerType === 'distributor';
          case 'direct': return partner.partnerType === 'direct-mssp';
          case 'si': return partner.partnerType === 'si-partner';
          case 'distributor-managed': return partner.partnerType === 'distributor-managed-mssp';
          default: return true;
        }
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      data = data.filter(partner => 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return data;
  }, [allPartners, selectedRegion, usageCategory, searchQuery]);

  // Calculate metrics based on filtered data
  const totalDistributors = regionFilteredPartners.filter(p => p.partnerType === 'distributor').length;
  const totalDirectMSSPs = regionFilteredPartners.filter(p => p.partnerType === 'direct-mssp').length;
  const totalSIPartners = regionFilteredPartners.filter(p => p.partnerType === 'si-partner').length;
  const totalDistributorManagedMSSPs = regionFilteredPartners.filter(p => p.partnerType === 'distributor-managed-mssp').length;
  
  const totalCustomers = regionFilteredPartners.reduce((sum: number, partner) => sum + partner.totalCustomers, 0);
  const totalAppSecUsage = regionFilteredPartners.reduce((sum: number, partner) => sum + partner.appSecUsage.total, 0);
  const totalZTNASeats = regionFilteredPartners.reduce((sum: number, partner) => sum + partner.ztnaUsage.total, 0);
  const totalEmailInboxes = regionFilteredPartners.reduce((sum: number, partner) => sum + partner.emailUsage.total, 0);
  const totalRegionRevenue = regionFilteredPartners.reduce((sum: number, partner) => sum + partner.totalRevenue, 0);

  // Revenue calculations
  const revenueChange = previousMonth ? Math.round((currentMonth.totalRevenue - previousMonth.totalRevenue) / 1000) : 275;
  const customerChange = previousMonth ? Math.round(currentMonth.newCustomers - previousMonth.newCustomers) : 85;

  // Generate performance data for charts - filter by region
  const partnerPerformanceData = regionFilteredPartners
    .filter(p => p.partnerType === 'distributor')
    .slice(0, 6)
    .map(partner => ({
      name: partner.name.length > 10 ? partner.name.substring(0, 10) + '...' : partner.name,
      revenue: partner.totalRevenue,
      customers: partner.totalCustomers,
      partners: (partner as any).totalPartners || 0
    }));

  const monthlyGrowthData = revenueData.map(data => ({
    month: data.month,
    revenue: data.totalRevenue / 1000000,
    partners: data.newPartners,
    customers: data.newCustomers
  }));

  const partnerRegistrationData = Object.entries(monthlyRegistrations).map(([month, data]) => ({
    month,
    'MSSP Direct': data.directMSSPs.length,
    'Distributor Managed': data.distributorManagedMSSPs.length,
    total: data.directMSSPs.length + data.distributorManagedMSSPs.length
  }));

  // Magic Transit helper functions
  const getTunnelHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Degraded': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Down': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Magic Transit Render Function
  const renderMagicTransit = (): ReactElement => (
    <div className="space-y-6">
      {/* SEACOM Branding Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            SEACOM Magic WAN Management
          </h2>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-sm text-gray-500">Telco Partner ID: SEACOM-EA-001</p>
            <p className="text-sm text-gray-500">Primary Region: East Africa</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowSubnetCalculator(true)}>
            Subnet Calculator
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subnet">Subnet Management</TabsTrigger>
          <TabsTrigger value="billing">Billing & Usage</TabsTrigger>
          <TabsTrigger value="health">Health Monitoring</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total IP Addresses
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    256
                  </p>
                  <p className="text-sm text-blue-400">/24 Prefix</p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Allocated IPs
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalAllocated}
                  </p>
                  <p className="text-sm text-green-400">
                    {((totalAllocated / 256) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Monthly Revenue
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${totalMonthlyBilling.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-400">$200 per IP block/64</p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Data Transfer
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalDataTransfer.toFixed(1)} TB
                  </p>
                  <p className="text-sm text-amber-400">This Month</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bandwidth Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bandwidthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis dataKey="time" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                    <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Standard_Bank" stroke="#8884d8" name="Standard Bank" />
                    <Line type="monotone" dataKey="Mukuru" stroke="#82ca9d" name="Mukuru" />
                    <Line type="monotone" dataKey="FNB" stroke="#ffc658" name="FNB" />
                    <Line type="monotone" dataKey="Absa" stroke="#ff7300" name="Absa" />
                    <Line type="monotone" dataKey="iPay" stroke="#ff1744" name="i-PAY" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tunnel Health History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tunnelHealthHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis dataKey="date" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                    <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="healthy" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Healthy" />
                    <Area type="monotone" dataKey="degraded" stackId="1" stroke="#ffc658" fill="#ffc658" name="Degraded" />
                    <Area type="monotone" dataKey="down" stackId="1" stroke="#ff1744" fill="#ff1744" name="Down" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subnet Management Tab */}
        <TabsContent value="subnet" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Customer Subnet Allocations
            </h3>
            <Button onClick={() => setShowNewAllocation(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Allocation
            </Button>
          </div>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                  <span>CUSTOMER</span>
                  <span>REGION</span>
                  <span>SUBNET</span>
                  <span>ALLOCATED IPS</span>
                  <span>USED IPS</span>
                  <span>TUNNEL HEALTH</span>
                  <span>MONTHLY BILLING</span>
                  <span>ACTIONS</span>
                </div>
                {subnetAllocationData.map((allocation) => (
                  <div key={allocation.customer} className={`grid grid-cols-8 gap-4 text-sm p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {allocation.customer}
                    </span>
                    <Badge variant="outline" className="w-fit">
                      {allocation.region}
                    </Badge>
                    <span className={`font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {allocation.subnet}
                    </span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {allocation.allocated}
                    </span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {allocation.used}
                    </span>
                    <Badge variant="secondary" className={getTunnelHealthColor(allocation.tunnelHealth)}>
                      {allocation.tunnelHealth}
                    </Badge>
                    <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ${allocation.monthlyBilling.toLocaleString()}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(allocation);
                        setShowCustomerDetails(true);
                      }}
                    >
                      Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing & Usage Tab */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Billing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Month Revenue</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${totalMonthlyBilling.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Data Transfer</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalDataTransfer.toFixed(1)} TB
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">IP Utilization</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {((totalUsed / totalAllocated) * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Billing Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">/26 Subnet (64 IPs)</p>
                  <p className="text-sm text-gray-500">$12,800/month</p>
                </div>
                <div>
                  <p className="font-semibold">/27 Subnet (32 IPs)</p>
                  <p className="text-sm text-gray-500">$6,400/month</p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold">Data Transfer</p>
                  <p className="text-sm text-gray-500">Included up to 100TB/month</p>
                  <p className="text-xs text-gray-400">$0.08/GB overage</p>
                </div>
                <div>
                  <p className="font-semibold">SLA Terms</p>
                  <p className="text-sm text-gray-500">99.99% uptime guaranteed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Monthly Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={billingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="month" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="dataTransfer" stroke="#82ca9d" name="Data Transfer (TB)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Monitoring Tab */}
        <TabsContent value="health" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tunnel Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Healthy Tunnels</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>4</p>
                    <p className="text-xs text-gray-400">80% of total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Degraded Tunnels</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1</p>
                    <p className="text-xs text-gray-400">20% of total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Network Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Average Latency</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>23ms</p>
                  </div>
                  <div>
                    <p className="font-semibold">Packet Loss</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>0.02%</p>
                  </div>
                  <div>
                    <p className="font-semibold">Jitter</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2.1ms</p>
                  </div>
                  <div>
                    <p className="font-semibold">MTU</p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Health Metrics Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={tunnelHealthHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="date" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="healthy" stroke="#82ca9d" name="Healthy Tunnels" />
                  <Line type="monotone" dataKey="degraded" stroke="#ffc658" name="Degraded Tunnels" />
                  <Line type="monotone" dataKey="down" stroke="#ff1744" name="Down Tunnels" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-4xl mx-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedCustomer.customer} - Subnet Details
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCustomerDetails(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Subnet</label>
                  <input 
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    value={selectedCustomer.subnet} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Region</label>
                  <input 
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    value={selectedCustomer.region} 
                    readOnly 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Monthly Billing</label>
                  <input 
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    value={`${selectedCustomer.monthlyBilling?.toLocaleString()}`} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Data Transfer</label>
                  <input 
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    value={`${selectedCustomer.dataTransfer} TB`} 
                    readOnly 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Current Bandwidth</p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>450 Mbps</p>
                  <p className="text-xs text-gray-400">Peak: 580 Mbps</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Packet Loss</p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>0.02%</p>
                  <p className="text-xs text-gray-400">Last 24h</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                Close
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      {/* Subnet Calculator Modal */}
      {showSubnetCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl mx-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Magic WAN Subnet Calculator
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSubnetCalculator(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">Calculate subnet divisions for customer allocation</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Network Address</label>
                <input
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="e.g., 192.168.1.0"
                  value={subnetCalcInput.network}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubnetCalcInput({...subnetCalcInput, network: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Current Subnet Mask</label>
                <input
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="e.g., 24"
                  value={subnetCalcInput.mask}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubnetCalcInput({...subnetCalcInput, mask: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Number of Divisions</label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  value={subnetCalcInput.divisions}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubnetCalcInput({...subnetCalcInput, divisions: parseInt(e.target.value)})}
                >
                  <option value={2}>2 subnets</option>
                  <option value={4}>4 subnets</option>
                  <option value={8}>8 subnets</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Calculated Subnets</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-500">
                    <span>Subnet Address</span>
                    <span>Available Hosts</span>
                  </div>
                  {calculateSubnets().map((subnet, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 text-sm p-2 rounded bg-gray-50 dark:bg-gray-700">
                      <span className="font-mono">{subnet.subnet}</span>
                      <span>{subnet.hosts}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSubnetCalculator(false)}>
                Close
              </Button>
              <Button>Export Results</Button>
            </div>
          </div>
        </div>
      )}

      {/* New Allocation Modal */}
      {showNewAllocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl mx-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Create New Subnet Allocation
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowNewAllocation(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name *</label>
                  <input
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="Enter customer name"
                    value={newAllocation.customer}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAllocation({...newAllocation, customer: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Region *</label>
                  <select
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    value={newAllocation.region}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewAllocation({...newAllocation, region: e.target.value})}
                  >
                    <option value="">Select region</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                    <option value="Mozambique">Mozambique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Subnet Size *</label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  value={newAllocation.allocated}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const allocated = parseInt(e.target.value);
                    setNewAllocation({
                      ...newAllocation,
                      allocated,
                      monthlyBilling: allocated === 64 ? 12800 : 6400
                    });
                  }}
                >
                  <option value={32}>/27 - 32 IPs ($6,400/month)</option>
                  <option value={64}>/26 - 64 IPs ($12,800/month)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Additional Notes</label>
                <textarea
                  className={`w-full h-20 px-3 py-2 border rounded-lg resize-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="Add any special requirements or notes"
                  value={newAllocation.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewAllocation({...newAllocation, notes: e.target.value})}
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Allocation Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly Billing:</span>
                    <span className="font-medium">${newAllocation.monthlyBilling.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available IPs:</span>
                    <span className="font-medium">{newAllocation.allocated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Included Data Transfer:</span>
                    <span className="font-medium">{newAllocation.allocated === 64 ? '100' : '50'} TB/month</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewAllocation(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (!newAllocation.customer || !newAllocation.region) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  setShowNewAllocation(false);
                  setNewAllocation({
                    customer: '',
                    region: '',
                    subnet: '',
                    allocated: 32,
                    status: 'Active',
                    monthlyBilling: 6400,
                    notes: ''
                  });
                }}
              >
                Create Allocation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const calculateSubnets = () => {
    const divisions = parseInt(subnetCalcInput.divisions.toString());
    let results = [];
    
    if (divisions && divisions > 0 && divisions <= 8) {
      const newMask = parseInt(subnetCalcInput.mask) + Math.log2(divisions);
      const baseIP = subnetCalcInput.network.split('/')[0];
      const ipParts = baseIP.split('.');
      
      for (let i = 0; i < divisions; i++) {
        results.push({
          subnet: `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${i * (256/divisions)}/${newMask}`,
          hosts: Math.pow(2, 32-newMask) - 2
        });
      }
    }
    
    return results;
  };

  const totalAllocated = subnetAllocationData.reduce((sum, item) => sum + item.allocated, 0);
  const totalUsed = subnetAllocationData.reduce((sum, item) => sum + item.used, 0);
  const totalMonthlyBilling = subnetAllocationData.reduce((sum, item) => sum + item.monthlyBilling, 0);
  const totalDataTransfer = subnetAllocationData.reduce((sum, item) => sum + item.dataTransfer, 0);

  // Metric Card Component
  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, suffix = "", onClick, isClickable = false }) => (
    <Card 
      className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${
        isClickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {typeof value === 'number' && value > 1000 ? (value / 1000).toFixed(1) + 'K' : value}{suffix}
            </p>
            {change !== undefined && change !== null && !isNaN(change) ? (
              <p className={`text-sm flex items-center ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {suffix === 'K' ? '$' : ''}{Math.abs(change)}{suffix} this month
              </p>
            ) : null}
          </div>
          <Icon className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        {isClickable ? (
          <div className="mt-2">
            <span className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Click to view details →
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  // Dashboard Render Function
  const renderDashboard = (): ReactElement => (
    <div className="space-y-6">
      {/* Region Header */}
      {selectedRegion !== 'ALL' ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedRegion} Region Overview
            </h2>
            <Badge className="bg-blue-100 text-blue-800">
              {regionFilteredPartners.length} Partners
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedRegion('ALL')}
          >
            View All Regions
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Global Overview
          </h2>
          <Badge className="bg-green-100 text-green-800">
            All Regions ({regionFilteredPartners.length} Partners)
          </Badge>
        </div>
      )}

      {/* Executive Metrics - As per SOW requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={`${selectedRegion === 'ALL' ? 'Total' : selectedRegion} MSSP Distributors`}
          value={totalDistributors}
          change={3}
          icon={Globe}
          isClickable={true}
          onClick={() => {
            setSelectedPartnerType('distributor');
            setCurrentView('partnerList');
          }}
        />
        <MetricCard
          title={`${selectedRegion === 'ALL' ? 'Total' : selectedRegion} Direct MSSP Partners`}
          value={totalDirectMSSPs}
          change={4}
          icon={Building2}
          isClickable={true}
          onClick={() => {
            setSelectedPartnerType('direct-mssp');
            setCurrentView('partnerList');
          }}
        />
        <MetricCard
          title={`${selectedRegion === 'ALL' ? 'Total' : selectedRegion} Revenue`}
          value={`${(totalRegionRevenue / 1000000).toFixed(1)}M`}
          change={revenueChange}
          icon={DollarSign}
        />
        <MetricCard
          title={`${selectedRegion === 'ALL' ? 'Total' : selectedRegion} Customers`}
          value={totalCustomers}
          change={customerChange}
          icon={Users}
        />
      </div>

      {/* Additional Metrics Row - SOW Tier structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={`${selectedRegion === 'ALL' ? 'Total' : selectedRegion} System Integrators`}
          value={totalSIPartners}
          change={2}
          icon={Settings}
          isClickable={true}
          onClick={() => {
            setSelectedPartnerType('si-partner');
            setCurrentView('partnerList');
          }}
        />
        <MetricCard
          title={`${selectedRegion === 'ALL' ? 'Total' : selectedRegion} Distributor Managed MSSPs`}
          value={totalDistributorManagedMSSPs}
          change={6}
          icon={Building2}
          isClickable={true}
          onClick={() => {
            setSelectedPartnerType('distributor-managed-mssp');
            setCurrentView('partnerList');
          }}
        />
        <MetricCard
          title={`${selectedRegion === 'ALL' ? 'Total' : selectedRegion} AppSec Usage`}
          value={`${totalAppSecUsage.toFixed(1)} TB`}
          change={15}
          icon={Shield}
        />
        <MetricCard
          title={`${selectedRegion === 'ALL' ? 'Total' : selectedRegion} ZTNA Seats`}
          value={totalZTNASeats.toLocaleString()}
          change={22}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Chart - 6 months as per SOW */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              6-Month Revenue Growth {selectedRegion !== 'ALL' ? `(${selectedRegion})` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  name="Revenue ($M)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Partner Registrations Chart */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Monthly Partner Registrations - MSSP Direct vs Distributor Managed
            </CardTitle>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              New partner onboarding by category per month
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={partnerRegistrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                />
                <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="MSSP Direct" 
                  fill="#10B981" 
                  name="MSSP Direct Partners"
                  stackId="partners"
                />
                <Bar 
                  dataKey="Distributor Managed" 
                  fill="#3B82F6" 
                  name="Distributor Managed MSSPs"
                  stackId="partners"
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Summary Statistics */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {partnerRegistrationData.reduce((sum, month) => sum + month['MSSP Direct'], 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total MSSP Direct</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {partnerRegistrationData.reduce((sum, month) => sum + month['Distributor Managed'], 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total Distributor Managed</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {partnerRegistrationData.reduce((sum, month) => sum + month.total, 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total New Partners</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Usage Distribution - As per SOW: Zero Trust 30%, App Security 60%, Email 10% */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Service Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Zero Trust', value: 60, color: '#10B981' },
                    { name: 'Application Security', value: 30, color: '#3B82F6' },
                    { name: 'Email Security', value: 10, color: '#F59E0B' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Zero Trust', value: 60, color: '#10B981' },
                    { name: 'Application Security', value: 30, color: '#3B82F6' },
                    { name: 'Email Security', value: 10, color: '#F59E0B' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Categories Breakdown - SOW Detailed breakdown */}
        <Card className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Product Categories Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Zero Trust" className="w-full">
              <TabsList className={`grid w-full grid-cols-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <TabsTrigger value="Zero Trust" className={`${isDarkMode ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300' : 'data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600'}`}>Zero Trust (60%)</TabsTrigger>
                <TabsTrigger value="Application Security" className={`${isDarkMode ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300' : 'data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600'}`}>App Security (30%)</TabsTrigger>
                <TabsTrigger value="Email Security" className={`${isDarkMode ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300' : 'data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600'}`}>Email Security (10%)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="Application Security" className="mt-4">
                <div className="space-y-3">
                  {serviceUsageDistribution['Application Security'].breakdown.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: '#3B82F6' }}
                        />
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {service.usage}
                        </span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="Zero Trust" className="mt-4">
                <div className="space-y-3">
                  {serviceUsageDistribution['Zero Trust'].breakdown.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: '#10B981' }}
                        />
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {service.name === 'DLP' || service.name === 'CASB' 
                            ? `${Math.round(parseInt(service.usage.replace(/[^\d]/g, '')) / 25)} customers`
                            : service.usage
                          }
                        </span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="Email Security" className="mt-4">
                <div className="space-y-3">
                  {serviceUsageDistribution['Email Security'].breakdown.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: '#F59E0B' }}
                        />
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {service.usage}
                        </span>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {service.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Partner List Render Function
  const renderPartnerList = (): ReactElement => {
    const getPartnersData = (): (DistributorPartner | DirectMSSPPartner | SystemIntegratorPartner | DistributorManagedMSSP)[] => {
      let baseData: (DistributorPartner | DirectMSSPPartner | SystemIntegratorPartner | DistributorManagedMSSP)[];
      switch(selectedPartnerType) {
        case 'distributor': baseData = distributorPartners; break;
        case 'direct-mssp': baseData = directMSSPPartners; break;
        case 'si-partner': baseData = systemIntegratorPartners; break;
        case 'distributor-managed-mssp': baseData = distributorManagedMSSPs; break;
        default: baseData = [];
      }
      
      // Apply region filter if not showing all regions
      if (selectedRegion === 'ALL') {
        return baseData;
      } else {
        return baseData.filter(partner => partner.region === selectedRegion);
      }
    };

    const partnersData = getPartnersData();
    const getTitle = () => {
      const baseTitle = (() => {
        switch(selectedPartnerType) {
          case 'distributor': return 'MSSP Distributors';
          case 'direct-mssp': return 'Direct MSSP Partners';
          case 'si-partner': return 'System Integrator Partners';
          case 'distributor-managed-mssp': return 'Distributor Managed MSSPs';
          default: return 'Partners';
        }
      })();
      
      if (selectedRegion === 'ALL') {
        return `${baseTitle} - All Regions`;
      } else {
        return `${baseTitle} - ${selectedRegion} Region`;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-2"
            >
              ← Back to Dashboard
            </Button>
            <div className="flex flex-col">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {getTitle()} ({partnersData.length})
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {selectedRegion === 'ALL' ? 'Global View' : `${selectedRegion} Region`}
                </Badge>
                {partnersData.length > 0 ? (
                  <Badge variant="secondary" className="text-xs">
                    YTD Revenue: ${(partnersData.reduce((sum: number, p) => sum + p.totalRevenue, 0) * 12).toLocaleString()}
                  </Badge>
                ) : null}
                {partnersData.length > 0 ? (
                  <Badge variant="secondary" className="text-xs">
                    Total Customers: {partnersData.reduce((sum: number, p) => sum + p.totalCustomers, 0).toLocaleString()}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>

        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardContent className="p-6">
            {partnersData.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Building2 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No {getTitle().toLowerCase()} found
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {selectedRegion === 'ALL' 
                      ? 'No partners of this type exist in the system'
                      : `No partners of this type found in ${selectedRegion} region`
                    }
                  </p>
                  {selectedRegion !== 'ALL' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setSelectedRegion('ALL')}
                    >
                      View All Regions
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                  <span>PARTNER</span>
                  <span>REGION</span>
                  <span>MSSP PARTNERS</span>
                  <span>CUSTOMERS</span>
                  <span>YTD REVENUE</span>
                  <span>GROWTH</span>
                  <span>ACTIONS</span>
                </div>
                {partnersData.map((partner) => (
                  <div key={partner.id} className={`grid grid-cols-7 gap-4 text-sm p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {partner.name}
                    </span>
                    <Badge variant="outline" className="w-fit">
                      {partner.region}
                    </Badge>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {(partner as any).totalPartners || 0}
                    </span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {partner.totalCustomers}
                    </span>
                    <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ${((partner.totalRevenue || 0) * 12).toLocaleString()}
                    </span>
                    <span className={`flex items-center ${partner.monthlyGrowth >= 15 ? 'text-green-400' : 'text-yellow-400'}`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{partner.monthlyGrowth}%
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedPartner({...partner, partnerType: selectedPartnerType});
                          setCurrentView('partnerDrillDown');
                        }}
                        title="View sub-partners and customers"
                      >
                        <Building2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedPartner({...partner, partnerType: selectedPartnerType});
                          setCurrentView('partnerUsageDetails');
                        }}
                        title="View detailed usage analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" title="Partner settings">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Partner Drill Down Render Function
  const renderPartnerDrillDown = (): ReactElement => {
    if (!selectedPartner) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No partner selected
          </p>
        </div>
      );
    }

    const getPartnerTypeDisplay = (type: string) => {
      switch(type) {
        case 'distributor': return 'MSSP Distributor';
        case 'direct-mssp': return 'Direct MSSP Partner';
        case 'si-partner': return 'System Integrator Partner';
        case 'distributor-managed-mssp': return 'Distributor Managed MSSP';
        default: return type;
      }
    };

    // Get sub-partners based on partner type
    const getSubPartners = () => {
      switch(selectedPartner.partnerType) {
        case 'distributor':
          // Show managed MSSPs and SI partners
          const managedMSSPs = distributorManagedMSSPs.filter(mssp => 
            selectedPartner.managedMSSPs?.includes(mssp.id)
          );
          const managedSIs = systemIntegratorPartners.filter(si => 
            selectedPartner.managedSIPartners?.includes(si.id)
          );
          return { managedMSSPs, managedSIs, customers: [] };
        
        case 'si-partner':
          // Show managed MSSPs and customers
          const siManagedMSSPs = distributorManagedMSSPs.filter(mssp => 
            selectedPartner.managedMSSPs?.includes(mssp.id)
          );
          return { managedMSSPs: siManagedMSSPs, managedSIs: [], customers: selectedPartner.customers || [] };
        
        case 'direct-mssp':
        case 'distributor-managed-mssp':
          // Show customers only
          return { managedMSSPs: [], managedSIs: [], customers: selectedPartner.customers || [] };
        
        default:
          return { managedMSSPs: [], managedSIs: [], customers: [] };
      }
    };

    const { managedMSSPs, managedSIs, customers } = getSubPartners();
    const totalSubEntities = managedMSSPs.length + managedSIs.length + customers.length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('partnerList')}
              className="flex items-center space-x-2"
            >
              ← Back to Partner List
            </Button>
            <div className="flex flex-col">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedPartner.name} - Partner Hierarchy
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {getPartnerTypeDisplay(selectedPartner.partnerType)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {selectedPartner.region} Region
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {totalSubEntities} Sub-entities
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  ${selectedPartner.totalRevenue.toLocaleString()} Revenue
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setCurrentView('partnerUsageDetails');
              }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Usage Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Partner Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Partner Type
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getPartnerTypeDisplay(selectedPartner.partnerType)}
                  </p>
                  <p className="text-sm text-blue-400">
                    Tier {selectedPartner.tier}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Revenue
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${selectedPartner.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-400">
                    +{selectedPartner.monthlyGrowth}% growth
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Customers
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPartner.totalCustomers}
                  </p>
                  <p className="text-sm text-purple-400">
                    Active accounts
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Partner Status
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPartner.status}
                  </p>
                  <p className="text-sm text-amber-400">
                    Registration: {new Date(selectedPartner.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                <Settings className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Managed Partners Section */}
        {(managedSIs.length > 0 || managedMSSPs.length > 0) ? (
          <div className="space-y-6">
            {/* Managed System Integrators - Show first */}
            {managedSIs.length > 0 ? (
              <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Managed System Integrator Partners ({managedSIs.length})
                  </CardTitle>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    System Integrator partners managed under this distributor
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                      <span>PARTNER NAME</span>
                      <span>REGION</span>
                      <span>CUSTOMERS</span>
                      <span>GROWTH</span>
                      <span>ACTIONS</span>
                    </div>
                    {managedSIs.map((si) => (
                      <div key={si.id} className={`grid grid-cols-5 gap-4 text-sm p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {si.name}
                        </span>
                        <Badge variant="outline" className="w-fit">
                          {si.region}
                        </Badge>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {si.totalCustomers}
                        </span>
                        <span className={`flex items-center ${si.monthlyGrowth >= 15 ? 'text-green-400' : 'text-yellow-400'}`}>
                          <TrendingUp className="w-4 h-4 mr-1" />
                          +{si.monthlyGrowth}%
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPartner({...si, partnerType: 'si-partner'});
                              setCurrentView('partnerDrillDown');
                            }}
                            title="View partner details"
                          >
                            <Building2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPartner({...si, partnerType: 'si-partner'});
                              setCurrentView('partnerUsageDetails');
                            }}
                            title="View usage analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Managed MSSPs - Show second */}
            {managedMSSPs.length > 0 ? (
              <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Managed MSSP Partners ({managedMSSPs.length})
                  </CardTitle>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    MSSP partners managed under this {selectedPartner.partnerType === 'distributor' ? 'distributor' : 'system integrator'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                      <span>PARTNER NAME</span>
                      <span>REGION</span>
                      <span>CUSTOMERS</span>
                      <span>GROWTH</span>
                      <span>ACTIONS</span>
                    </div>
                    {managedMSSPs.map((mssp) => (
                      <div key={mssp.id} className={`grid grid-cols-5 gap-4 text-sm p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {mssp.name}
                        </span>
                        <Badge variant="outline" className="w-fit">
                          {mssp.region}
                        </Badge>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {mssp.totalCustomers}
                        </span>
                        <span className={`flex items-center ${mssp.monthlyGrowth >= 15 ? 'text-green-400' : 'text-yellow-400'}`}>
                          <TrendingUp className="w-4 h-4 mr-1" />
                          +{mssp.monthlyGrowth}%
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPartner({...mssp, partnerType: 'distributor-managed-mssp'});
                              setCurrentView('partnerDrillDown');
                            }}
                            title="View partner details"
                          >
                            <Building2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPartner({...mssp, partnerType: 'distributor-managed-mssp'});
                              setCurrentView('partnerUsageDetails');
                            }}
                            title="View usage analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        ) : null}

        {/* Customers Section */}
        {customers.length > 0 ? (
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Customer Accounts ({customers.length})
              </CardTitle>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                End customer accounts managed by this partner
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((customerId: string, index: number) => (
                  <div key={customerId} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Customer {index + 1}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {customerId}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Industry:</span>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {['Technology', 'Healthcare', 'Financial', 'Manufacturing', 'Retail'][index % 5]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Size:</span>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {['Enterprise', 'Mid-Market', 'SMB'][index % 3]}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2" title="View customer details">
                      <Users className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Empty State */}
        {totalSubEntities === 0 ? (
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-12">
              <div className="text-center">
                <Building2 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No Sub-entities Found
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  This partner doesn't have any managed partners or customers in the system.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    );
  };

  // Partner Usage Details Render Function
  const renderPartnerUsageDetails = (): ReactElement => {
    if (!selectedPartner) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No partner selected
          </p>
        </div>
      );
    }

    const monthlyRevenue = 
      (selectedPartner.appSecUsage.total * selectedPartner.pricing.appSecRate) +
      (selectedPartner.ztnaUsage.total * selectedPartner.pricing.ztnaRate) +
      (selectedPartner.emailUsage.total * selectedPartner.pricing.emailRate);

    const getPartnerTypeDisplay = (type: string) => {
      switch(type) {
        case 'distributor': return 'MSSP Distributor';
        case 'direct-mssp': return 'Direct MSSP Partner';
        case 'si-partner': return 'System Integrator Partner';
        case 'distributor-managed-mssp': return 'Distributor Managed MSSP';
        default: return type;
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('usage')}
              className="flex items-center space-x-2"
            >
              ← Back to Usage Dashboard
            </Button>
            <div className="flex flex-col">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedPartner.name} - Detailed Usage Analytics
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {getPartnerTypeDisplay(selectedPartner.partnerType)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {selectedPartner.region} Region
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {selectedPartner.totalCustomers} Customers
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  ${monthlyRevenue.toLocaleString()} Monthly Revenue
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Partner Report
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Set Usage Alerts
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure Pricing
            </Button>
          </div>
        </div>

        {/* Partner Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    AppSec Usage
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPartner.appSecUsage.total.toFixed(1)} TB
                  </p>
                  <p className="text-sm text-blue-400">
                    ${(selectedPartner.appSecUsage.total * selectedPartner.pricing.appSecRate).toLocaleString()} revenue
                  </p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ZTNA Seats
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPartner.ztnaUsage.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-400">
                    ${(selectedPartner.ztnaUsage.total * selectedPartner.pricing.ztnaRate).toLocaleString()} revenue
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Email Inboxes
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedPartner.emailUsage.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-amber-400">
                    ${(selectedPartner.emailUsage.total * selectedPartner.pricing.emailRate).toLocaleString()} revenue
                  </p>
                </div>
                <Mail className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Monthly Growth
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    +{selectedPartner.monthlyGrowth}%
                  </p>
                  <p className="text-sm text-purple-400">
                    Trending upward
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Usage Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AppSec Breakdown */}
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Application Security Breakdown
              </CardTitle>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                CDN, WAF, DDoS Protection, Load Balancing, Spectrum, Argo
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'CDN', value: selectedPartner.appSecUsage.cdn, color: '#3B82F6' },
                  { name: 'WAF', value: selectedPartner.appSecUsage.waf, color: '#10B981' },
                  { name: 'DDoS Protection', value: selectedPartner.appSecUsage.ddosProtection, color: '#F59E0B' },
                  { name: 'Load Balancing', value: selectedPartner.appSecUsage.loadBalancing, color: '#EF4444' },
                  { name: 'Spectrum', value: selectedPartner.appSecUsage.spectrum, color: '#8B5CF6' },
                  { name: 'Argo Smart Routing', value: selectedPartner.appSecUsage.argo, color: '#06B6D4' }
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.value.toFixed(1)} TB
                      </div>
                      <div className="text-xs text-gray-500">
                        ${(service.value * selectedPartner.pricing.appSecRate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ZTNA Breakdown */}
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Zero Trust Network Access Breakdown
              </CardTitle>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Gateway, Access, DLP, CASB, Browser Isolation, Service Tiers
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Gateway', value: selectedPartner.ztnaUsage.gateway, color: '#3B82F6' },
                  { name: 'Access', value: selectedPartner.ztnaUsage.access, color: '#10B981' },
                  { name: 'DLP', value: selectedPartner.ztnaUsage.dlp, color: '#F59E0B' },
                  { name: 'CASB', value: selectedPartner.ztnaUsage.casb, color: '#EF4444' },
                  { name: 'Browser Isolation', value: selectedPartner.ztnaUsage.browserIsolation, color: '#8B5CF6' },
                  { name: 'Essential Tier', value: selectedPartner.ztnaUsage.essential, color: '#06B6D4' },
                  { name: 'Advanced Tier', value: selectedPartner.ztnaUsage.advanced, color: '#84CC16' },
                  { name: 'Premier Tier', value: selectedPartner.ztnaUsage.premier, color: '#F97316' }
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {service.value.toLocaleString()} seats
                      </div>
                      <div className="text-xs text-gray-500">
                        ${(service.value * selectedPartner.pricing.ztnaRate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Security Details */}
        <div className="grid grid-cols-1 gap-6">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Email Security Details
              </CardTitle>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Area 1 and Advanced Threat Protection usage
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-amber-100' : 'text-amber-900'}`}>
                      Area 1 Email Security
                    </span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {selectedPartner.emailUsage.area1.toLocaleString()} inboxes
                    </Badge>
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Revenue: ${(selectedPartner.emailUsage.area1 * selectedPartner.pricing.emailRate).toLocaleString()}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                      Advanced Threat Protection
                    </span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {selectedPartner.emailUsage.advancedThreatProtection.toLocaleString()} inboxes
                    </Badge>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Revenue: ${(selectedPartner.emailUsage.advancedThreatProtection * selectedPartner.pricing.emailRate).toLocaleString()}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <Button variant="outline" size="sm" className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Send Monthly Confirmation Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Usage Dashboard Render Function
  const renderUsageDashboard = (): ReactElement => {
    const filteredUsageData = usageFilteredData;
    const totalAppSec = filteredUsageData.reduce((sum: number, partner) => sum + partner.appSecUsage.total, 0);
    const totalZTNA = filteredUsageData.reduce((sum: number, partner) => sum + partner.ztnaUsage.total, 0);
    const totalEmail = filteredUsageData.reduce((sum: number, partner) => sum + partner.emailUsage.total, 0);
    const totalRevenue = filteredUsageData.reduce((sum: number, partner) => 
      sum + (partner.appSecUsage.total * partner.pricing.appSecRate) + 
      (partner.ztnaUsage.total * partner.pricing.ztnaRate) + 
      (partner.emailUsage.total * partner.pricing.emailRate), 0
    );

    // Get category display name
    const getCategoryDisplayName = () => {
      switch(usageCategory) {
        case 'all': return selectedRegion === 'ALL' ? 'All Partners (Global)' : `All Partners (${selectedRegion})`;
        case 'distributor': return selectedRegion === 'ALL' ? 'MSSP Distributors (Global)' : `MSSP Distributors (${selectedRegion})`;
        case 'direct': return selectedRegion === 'ALL' ? 'Direct MSSP Partners (Global)' : `Direct MSSP Partners (${selectedRegion})`;
        case 'si': return selectedRegion === 'ALL' ? 'System Integrators (Global)' : `System Integrators (${selectedRegion})`;
        case 'distributor-managed': return selectedRegion === 'ALL' ? 'Distributor Managed MSSPs (Global)' : `Distributor Managed MSSPs (${selectedRegion})`;
        default: return 'Partners';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Usage Dashboard & Analytics
            </h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {getCategoryDisplayName()}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {filteredUsageData.length} Partners
              </Badge>
              {searchQuery ? (
                <Badge variant="destructive" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={usageCategory} onValueChange={(value: UsageCategory) => setUsageCategory(value)}>
              <SelectTrigger className={`w-48 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                <SelectItem value="all" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>Total (All Partners)</SelectItem>
                <SelectItem value="distributor" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>MSSP Distributors</SelectItem>
                <SelectItem value="direct" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>Direct MSSP Partners</SelectItem>
                <SelectItem value="si" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>System Integrators</SelectItem>
                <SelectItem value="distributor-managed" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>Distributor Managed MSSPs</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              ) : null}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setUsageCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>



        {/* Usage Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total AppSec Usage
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalAppSec.toFixed(1)} TB
                  </p>
                  <p className="text-sm text-blue-400">
                    ${(totalAppSec * 120).toLocaleString()} revenue
                  </p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total ZTNA Seats
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalZTNA.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-400">
                    ${(totalZTNA * 8).toLocaleString()} revenue
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Email Inboxes
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {totalEmail.toLocaleString()}
                  </p>
                  <p className="text-sm text-amber-400">
                    ${(totalEmail * 2.5).toLocaleString()} revenue
                  </p>
                </div>
                <Mail className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Revenue
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${(totalRevenue / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-sm text-purple-400">
                    Monthly recurring
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partners Usage Table with drill-down capability as per SOW */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Partner Usage Analytics ({filteredUsageData.length} partners)
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Usage Report
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Non-MSSP Leakage Report
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Usage Data
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsageData.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No usage data found
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {searchQuery 
                      ? `No partners match "${searchQuery}" in ${getCategoryDisplayName()}`
                      : `No partners found for ${getCategoryDisplayName()}`
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSearchQuery('');
                        setUsageCategory('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                    {selectedRegion !== 'ALL' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedRegion('ALL')}
                      >
                        View All Regions
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-10 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                  <span>PARTNER</span>
                  <span>TYPE</span>
                  <span>REGION</span>
                  <span>APPSEC (TB)</span>
                  <span>ZTNA SEATS</span>
                  <span>EMAIL INBOXES</span>
                  <span>CUSTOMERS</span>
                  <span>MONTHLY REVENUE</span>
                  <span>PRICE LIST</span>
                  <span>ACTIONS</span>
                </div>
                {filteredUsageData.map((partner) => {
                  const monthlyRevenue = 
                    (partner.appSecUsage.total * partner.pricing.appSecRate) +
                    (partner.ztnaUsage.total * partner.pricing.ztnaRate) +
                    (partner.emailUsage.total * partner.pricing.emailRate);

                  const getPartnerTypeDisplay = (type: string) => {
                    switch(type) {
                      case 'distributor': return 'Distributor';
                      case 'direct-mssp': return 'Direct MSSP';
                      case 'si-partner': return 'SI Partner';
                      case 'distributor-managed-mssp': return 'Dist. Managed';
                      default: return type;
                    }
                  };

                  const getPartnerTypeBadge = (type: string) => {
                    switch(type) {
                      case 'distributor': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
                      case 'direct-mssp': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                      case 'si-partner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                      case 'distributor-managed-mssp': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
                      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
                    }
                  };

                  // Calculate usage percentages for alerts
                  const appSecUsagePercentage = (partner.appSecUsage.total / (totalAppSec || 1)) * 100;
                  const ztnaUsagePercentage = (partner.ztnaUsage.total / (totalZTNA || 1)) * 100;

                  return (
                    <div key={partner.id} className={`grid grid-cols-10 gap-4 text-sm p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      monthlyRevenue > 50000 ? 'border-l-4 border-green-500' : ''
                    }`}>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {partner.name}
                      </span>
                      <Badge className={getPartnerTypeBadge(partner.partnerType)} variant="secondary">
                        {getPartnerTypeDisplay(partner.partnerType)}
                      </Badge>
                      <Badge variant="outline" className="w-fit">
                        {partner.region}
                      </Badge>
                      <div className="flex flex-col">
                        <span className={`font-mono font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {partner.appSecUsage.total.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {appSecUsagePercentage.toFixed(1)}% of total
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-mono font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {partner.ztnaUsage.total.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {ztnaUsagePercentage.toFixed(1)}% of total
                        </span>
                      </div>
                      <span className={`font-mono font-medium ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        {partner.emailUsage.total.toLocaleString()}
                      </span>
                      <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {partner.totalCustomers}
                      </span>
                      <div className="flex flex-col">
                        <span className={`font-mono font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${monthlyRevenue.toLocaleString()}
                        </span>
                        {monthlyRevenue > 50000 ? (
                          <Badge variant="secondary" className="text-xs w-fit">High Value</Badge>
                        ) : null}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          {partner.pricing.priceListVersion}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(partner.pricing.effectiveDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setCurrentView('partnerUsageDetails');
                          }}
                          title="Drill down to partner details"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Download partner report">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Set usage alerts">
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zero Trust & Email Security Tracking - SOW Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Zero Trust Detailed Tracking
              </CardTitle>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                CASB, Gateway, DLP, Access, Area 1, Browser Isolation, Essential, Advanced, Premier
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsageData.slice(0, 5).map((partner) => (
                  <div key={partner.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {partner.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {partner.ztnaUsage.total.toLocaleString()} seats
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>Gateway: {partner.ztnaUsage.gateway}</div>
                      <div>Access: {partner.ztnaUsage.access}</div>
                      <div>DLP: {partner.ztnaUsage.dlp}</div>
                      <div>CASB: {partner.ztnaUsage.casb}</div>
                      <div>Essential: {partner.ztnaUsage.essential}</div>
                      <div>Advanced: {partner.ztnaUsage.advanced}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Email Security Tracking
              </CardTitle>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Monthly confirmation for Zero Trust Plus zones
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsageData.slice(0, 5).map((partner) => (
                  <div key={partner.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {partner.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {partner.emailUsage.total.toLocaleString()} inboxes
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Area 1: {partner.emailUsage.area1.toLocaleString()}</div>
                      <div>Advanced: {partner.emailUsage.advancedThreatProtection.toLocaleString()}</div>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Confirm Monthly Usage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Closing Time & Manual Input - SOW Requirement */}
        <Card className={`${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>
              Usage Closing & Manual Entry
            </CardTitle>
            <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              UK Local Time (GMT/BST) - Usage closes at 11:59 PM last day of month
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-800' : 'bg-white'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>Current Time Zone</h4>
                <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                  BST (UTC+1) - Summer Time
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  Next close: 31st at 11:59 PM BST
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-800' : 'bg-white'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>Manual Email Entry</h4>
                <Button variant="outline" size="sm">
                  Enter Email Security Usage
                </Button>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-800' : 'bg-white'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>Usage Notification</h4>
                <Button variant="outline" size="sm">
                  Send Monthly Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

   // MSSP Partner View Render Function
  const renderMSSPPartnerView = (): ReactElement => {
    // Mock data for MSSP Partner view - this would come from the specific partner's data
    const partnerData = {
      partnerName: "SecureTech MSSP",
      region: "AMER",
      totalCustomers: 24,
      totalRevenue: 485000,
      lastMonthRevenue: 422000,
      appSecUsage: 45.2,
      lastMonthAppSec: 38.7,
      ztnaSeats: 2840,
      lastMonthZTNA: 2650,
      emailInboxes: 1250,
      buyCostFromCloudflare: 325000,
      customerRevenue: 485000
    };

    // Mock customer data
    const customerData = [
      { name: "TechCorp Inc", region: "AMER", revenue: 125000, appSec: 12.5, ztna: 850, email: 400 },
      { name: "Global Finance", region: "AMER", revenue: 98000, appSec: 8.9, ztna: 620, email: 280 },
      { name: "Healthcare Plus", region: "AMER", revenue: 87000, appSec: 9.2, ztna: 580, email: 200 },
      { name: "Manufacturing Co", region: "AMER", revenue: 65000, appSec: 6.8, ztna: 420, email: 150 },
      { name: "Retail Solutions", region: "AMER", revenue: 54000, appSec: 4.2, ztna: 280, email: 120 }
    ];

    // 6-month growth data
    const growthData = [
      { month: 'Month 1', revenue: 320000 },
      { month: 'Month 2', revenue: 365000 },
      { month: 'Month 3', revenue: 398000 },
      { month: 'Month 4', revenue: 422000 },
      { month: 'Month 5', revenue: 455000 },
      { month: 'Month 6', revenue: 485000 }
    ];

    const revenueChange = ((partnerData.totalRevenue - partnerData.lastMonthRevenue) / partnerData.lastMonthRevenue * 100).toFixed(1);
    const appSecChange = ((partnerData.appSecUsage - partnerData.lastMonthAppSec) / partnerData.lastMonthAppSec * 100).toFixed(1);
    const ztnaChange = ((partnerData.ztnaSeats - partnerData.lastMonthZTNA) / partnerData.lastMonthZTNA * 100).toFixed(1);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              MSSP Partner Dashboard
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {partnerData.partnerName}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {partnerData.region} Region
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {partnerData.totalCustomers} Customers
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Set Alerts
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Price List
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Reports
            </Button>
          </div>
        </div>

        {/* Executive Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    Total Customers & Revenue
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    {partnerData.totalCustomers}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    ${partnerData.totalRevenue.toLocaleString()} (+{revenueChange}%)
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-700' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                    App Security Usage
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                    {partnerData.appSecUsage} TB
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                    +{appSecChange}% vs last month
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                    ZTNA Seats
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
                    {partnerData.ztnaSeats.toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                    +{ztnaChange}% vs last month
                  </p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gradient-to-br from-amber-900 to-amber-800 border-amber-700' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                    Email Inboxes
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>
                    {partnerData.emailInboxes.toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                    Active mailboxes
                  </p>
                </div>
                <Mail className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 6-Month Growth Chart */}
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                6-Month Revenue Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="month" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3} 
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Product Distribution Pie Chart */}
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Product Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'App Security', value: 60, color: '#3B82F6' },
                      { name: 'ZTNA', value: 30, color: '#10B981' },
                      { name: 'Email Security', value: 10, color: '#F59E0B' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }: { name?: string; value?: number }) => 
                      `${name || ''}: ${value || 0}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'App Security', value: 60, color: '#3B82F6' },
                      { name: 'ZTNA', value: 30, color: '#10B981' },
                      { name: 'Email Security', value: 10, color: '#F59E0B' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Usage Dashboard */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Usage Dashboard & Customer Revenue
            </CardTitle>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Monthly costs and customer revenue breakdown
            </p>
          </CardHeader>
          <CardContent>
            {/* Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>
                  Total Buy Cost from Cloudflare
                </h4>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-red-900'}`}>
                  ${partnerData.buyCostFromCloudflare.toLocaleString()}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>Current month</p>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>
                  Total Customer Revenue
                </h4>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                  ${partnerData.customerRevenue.toLocaleString()}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                  Profit: ${(partnerData.customerRevenue - partnerData.buyCostFromCloudflare).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Customer List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Top 5 Customer Performers
                </h4>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Apply Price List
                </Button>
              </div>
              
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <span>CUSTOMER</span>
                <span>REGION</span>
                <span>REVENUE</span>
                <span>APP SEC (TB)</span>
                <span>ZTNA SEATS</span>
                <span>ACTIONS</span>
              </div>
              
              {customerData.map((customer, index) => (
                <div key={index} className={`grid grid-cols-6 gap-4 text-sm p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {customer.name}
                  </span>
                  <Badge variant="outline" className="w-fit">
                    {customer.region}
                  </Badge>
                  <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    ${customer.revenue.toLocaleString()}
                  </span>
                  <span className={`font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {customer.appSec} TB
                  </span>
                  <span className={`font-mono ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {customer.ztna}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button variant="outline" size="sm" title="Set usage alerts">
                      <Bell className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" title="View analytics">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Configuration */}
        <Card className={`${isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-yellow-200' : 'text-yellow-900'}`}>
              Usage Alerts Configuration
            </CardTitle>
            <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
              Set thresholds for App Security and ZTNA usage alerts
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-900'}`}>
                  App Security Alerts
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Alert at 80% TB usage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Alert at 90% TB usage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Alert at 100% TB usage</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-900'}`}>
                  ZTNA Alerts
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Alert at 80% seat usage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Alert at 90% seat usage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Alert at 100% seat usage</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
              <Button>
                Save Alert Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance, Traffic, Security */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Performance, Traffic & Security Analytics
            </CardTitle>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select a customer to view detailed Cloudflare analytics
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Select>
                <SelectTrigger className={`w-64 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent className={`${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                  {customerData.map((customer, index) => (
                    <SelectItem key={index} value={customer.name} className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>
                Load Analytics
              </Button>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <p>Select a customer to view their performance analytics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };


  // Commercials Render Function
  const renderCommercials = (): ReactElement => {
    // Get commercial partners data (Distributors + Direct MSSPs only as per requirements)
    const commercialPartners = [
      ...distributorPartners.map(p => ({ ...p, partnerType: 'distributor' as const })),
      ...directMSSPPartners.map(p => ({ ...p, partnerType: 'direct-mssp' as const }))
    ];

    // Calculate enhanced sales metrics from real data
    const totalGlobalRevenue = commercialPartners.reduce((sum: number, partner: any) => sum + partner.totalRevenue, 0);
    const totalYTDRevenue = totalGlobalRevenue * 12;
    const totalCustomers = commercialPartners.reduce((sum: number, partner: any) => sum + partner.totalCustomers, 0);
    const avgRevenuePerCustomer = totalGlobalRevenue / (totalCustomers || 1);

    // Generate 3-month growth data for each partner
    const getPartnerGrowthData = (partner: any) => {
      const baseRevenue = partner.totalRevenue;
      const growth = partner.monthlyGrowth / 100;
      return [
        { month: 'Month 1', revenue: Math.round(baseRevenue * (1 - growth * 2)) },
        { month: 'Month 2', revenue: Math.round(baseRevenue * (1 - growth)) },
        { month: 'Month 3', revenue: baseRevenue }
      ];
    };

    // Revenue by partner type from real data
    const distributorRevenue = distributorPartners.reduce((sum: number, p) => sum + p.totalRevenue, 0);
    const directMSSPRevenue = directMSSPPartners.reduce((sum: number, p) => sum + p.totalRevenue, 0);

    const revenueByPartnerType = [
      {
        name: 'MSSP Distributors',
        value: distributorRevenue,
        count: distributorPartners.length,
        color: '#8B5CF6'
      },
      {
        name: 'Direct MSSP Partners',
        value: directMSSPRevenue,
        count: directMSSPPartners.length,
        color: '#10B981'
      }
    ];

    // Non-MSSP Leakage Report with specified services (no numbers)
    const nonMSSPLeakageData = [
      { 
        customer: 'TechStartup Inc', 
        services: ['advanced_cert_manager', 'api_shield_zone'],
        region: 'AMER', 
        risk: 'High',
        potentialMSSP: 'SolCyber'
      },
      { 
        customer: 'Global Finance Corp', 
        services: ['load_balancing', 'bot_zone_ent', 'argo_zone_ent'],
        region: 'EMEA', 
        risk: 'High',
        potentialMSSP: 'Orange'
      },
      { 
        customer: 'E-commerce Platform', 
        services: ['cf_pro_20_20', 'images_basic'],
        region: 'APAC', 
        risk: 'Medium',
        potentialMSSP: 'Rakuten Japan'
      },
      { 
        customer: 'Media Streaming Co', 
        services: ['argo_zone_ent', 'load_balancing', 'advanced_cert_manager'],
        region: 'AMER', 
        risk: 'High',
        potentialMSSP: 'Nocwing'
      },
      { 
        customer: 'Manufacturing Giant', 
        services: ['api_shield_zone', 'bot_zone_ent'],
        region: 'EMEA', 
        risk: 'Medium',
        potentialMSSP: 'Swisscom'
      },
      { 
        customer: 'Gaming Platform', 
        services: ['bot_zone_ent', 'cf_pro_20_20', 'images_basic'],
        region: 'APAC', 
        risk: 'Low',
        potentialMSSP: 'Rakuten Japan'
      },
      { 
        customer: 'Social Media App', 
        services: ['images_basic', 'api_shield_zone'],
        region: 'LATAM', 
        risk: 'Medium',
        potentialMSSP: 'Brava Solutions (via TDSynnex)'
      },
      { 
        customer: 'Healthcare Systems Ltd', 
        services: ['advanced_cert_manager', 'load_balancing'],
        region: 'EMEA', 
        risk: 'High',
        potentialMSSP: 'Nanosek'
      },
      { 
        customer: 'Financial Services Co', 
        services: ['cf_pro_20_20', 'argo_zone_ent', 'bot_zone_ent'],
        region: 'AMER', 
        risk: 'High',
        potentialMSSP: 'Syntax'
      },
      { 
        customer: 'Education Platform', 
        services: ['images_basic', 'advanced_cert_manager'],
        region: 'APAC', 
        risk: 'Low',
        potentialMSSP: 'Rakuten Japan'
      }
    ];

    const totalLeakageCustomers = nonMSSPLeakageData.length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Commercial Dashboard & Revenue Analytics
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                Global Commercial View
              </Badge>
              <Badge variant="secondary" className="text-xs">
                YTD Revenue: ${(totalYTDRevenue / 1000000).toFixed(1)}M
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {commercialPartners.length} Partners
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {totalCustomers.toLocaleString()} Customers
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Commercial Report
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Generate Executive Summary
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure Pricing
            </Button>
          </div>
        </div>

        {/* Commercial View & Price List Management Panel */}
        <Card className={`${isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>Commercial View & Price List Management</CardTitle>
            <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              Manage pricing templates, upload price lists, and generate commercial reports
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Price List</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Template</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Generate Commercial Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    Total Last Month Revenue
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                    ${(totalGlobalRevenue / 1000000).toFixed(2)}M
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    ${avgRevenuePerCustomer.toLocaleString()} per customer
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-700' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                    YTD Revenue
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-green-900'}`}>
                    ${(totalYTDRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                    Year to date performance
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gradient-to-br from-amber-900 to-amber-800 border-amber-700' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                    Total Customers
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-amber-900'}`}>
                    {(totalCustomers / 1000).toFixed(1)}K
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
                    Across all partners
                  </p>
                </div>
                <Users className="w-10 h-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commercial Partners Dashboard - Main Table */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Commercial Partners Dashboard
                </CardTitle>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  MSSP Distributors & Direct MSSP Partners - Revenue & Growth Analysis
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Commercial Report
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Executive Summary
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <span>PARTNER NAME</span>
                <span>TYPE</span>
                <span>REGION</span>
                <span>CUSTOMERS</span>
                <span>LAST MONTH REVENUE</span>
                <span>YTD REVENUE</span>
                <span>PRICE LIST VERSION</span>
                <span>ACTIONS</span>
              </div>
              {commercialPartners.length > 0 ? commercialPartners.map((partner) => {
                const partnerType = partner.partnerType === 'distributor' ? 'MSSP Distributor' : 'Direct MSSP';
                const partnerTypeColor = partner.partnerType === 'distributor' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';

                return (
                  <div key={partner.id} className={`grid grid-cols-8 gap-4 text-sm p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-4 ${
                    partner.totalRevenue > 200000 ? 'border-green-500' : partner.totalRevenue > 100000 ? 'border-yellow-500' : 'border-gray-300'
                  }`}>
                    <div className="flex flex-col">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {partner.name}
                      </span>
                      {/* <span className="text-xs text-gray-500">
                        {partner.country.slice(0, 2).join(', ')}{partner.country.length > 2 ? '...' : ''}
                      </span> */}
                    </div>
                    
                    <Badge className={partnerTypeColor} variant="secondary">
                      {partnerType}
                    </Badge>
                    
                    <Badge variant="outline" className="w-fit">
                      {partner.region}
                    </Badge>
                    
                    <div className="flex flex-col">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {partner.totalCustomers.toLocaleString()}
                      </span>
                      {/* <span className="text-xs text-gray-500">Active</span> */}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ${partner.totalRevenue.toLocaleString()}
                      </span>
                      <span className={`text-xs ${partner.monthlyGrowth >= 15 ? 'text-green-500' : 'text-gray-500'}`}>
                        +{partner.monthlyGrowth}% growth
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        ${(partner.totalRevenue * 12).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {partner.pricing.priceListVersion}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(partner.pricing.effectiveDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        title="Download Last Month Usage Report"
                        className="text-xs px-2"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Usage
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        title="View 3-month growth chart"
                        onClick={() => {
                          // Mock chart view - in real implementation would show modal with chart
                          console.log('Growth chart for', partner.name, getPartnerGrowthData(partner));
                        }}
                        className="text-xs px-2"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Chart
                      </Button>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-8 text-center py-8">
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No commercial partners found
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Revenue by Partner Type
              </CardTitle>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Monthly revenue distribution across commercial partners
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByPartnerType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }: { name?: string; value?: number }) => 
                      `${name || ''}: ${((value || 0) / 1000000).toFixed(1)}M$`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByPartnerType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${(value / 1000000).toFixed(2)}M`, 'Revenue']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-1 gap-4 text-sm">
                {revenueByPartnerType.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{type.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {type.count} partners
                      </div>
                      {/* <div className="text-xs text-gray-500">
                        ${(type.value / type.count).toLocaleString()} avg
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Top Revenue Partners
              </CardTitle>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Highest performing commercial partners
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commercialPartners
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .slice(0, 8)
                  .map((partner, index) => (
                    <div key={partner.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                          index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {partner.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {partner.partnerType === 'distributor' ? 'MSSP Distributor' : 'Direct MSSP'} • {partner.region}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          ${partner.totalRevenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {partner.totalCustomers} customers
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
         {/* Regional Revenue Analysis */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Regional Revenue Analysis
            </CardTitle>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Revenue performance across global regions
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <th className={`text-left py-3 px-4 font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      REGION
                    </th>
                    <th className={`text-left py-3 px-4 font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      MONTHLY REVENUE
                    </th>
                    <th className={`text-left py-3 px-4 font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      YTD 
                    </th>
                    <th className={`text-left py-3 px-4 font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      PARTNERS
                    </th>
                    <th className={`text-left py-3 px-4 font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      CUSTOMERS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {['AMER', 'EMEA', 'APAC', 'LATAM', 'JAPAN'].map((region) => {
                    const regionPartners = commercialPartners.filter(p => p.region === region);
                    const regionRevenue = regionPartners.reduce((sum, p) => sum + p.totalRevenue, 0);
                    const regionCustomers = regionPartners.reduce((sum, p) => sum + p.totalCustomers, 0);

                    return (
                      <tr key={region} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                        <td className="py-4 px-4">
                          <Badge 
                            variant="outline" 
                            className={`font-medium ${isDarkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}`}
                          >
                            {region}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-green-500 font-semibold text-lg">
                            ${(regionRevenue / 1000000).toFixed(2)}M
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-blue-500 font-semibold text-lg">
                            ${((regionRevenue * 12) / 1000000).toFixed(1)}M
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {regionPartners.length}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {regionCustomers.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

 {/* Non-MSSP Leakage Report - Simplified */}
        <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Non-MSSP Product Usage
            </CardTitle>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Partners using products directly instead of through MSSP channels
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                {totalLeakageCustomers} Partners Found
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Using non-MSSP supported products
              </p>
            </div>

            <div className="space-y-2">
              {nonMSSPLeakageData.map((item, index) => (
                <div key={index} className={`p-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-l-3 border-orange-400`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.customer}
                      </span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {item.potentialMSSP}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {item.region}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.services.map((service, idx) => (
                      <span key={idx} className={`font-mono text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} bg-gray-100 dark:bg-gray-600 px-1 py-0.5 rounded text-xs`}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderKocSistemView = (): ReactElement => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {kocSistemData.name} - Executive Dashboard
        </h2>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant="outline" className="text-xs">Partner View</Badge>
          <Badge variant="secondary" className="text-xs">{kocSistemData.region} Region</Badge>
          <Badge variant="secondary" className="text-xs">{kocSistemData.totalCustomers} Customers</Badge>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentView('dashboard')}
        >
          ← Back to Master View
        </Button>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 mr-2" />
          Set Alerts
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>

    {/* Executive Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Customers"
        value={kocSistemData.totalCustomers}
        change={19}
        icon={Users}
      />
      <MetricCard
        title="YTD Revenue"
        value={`$${(kocSistemData.ytdRevenue / 1000).toFixed(0)}K`}
        change={24}
        icon={DollarSign}
      />
      <MetricCard
        title="App Sec YTD Usage"
        value={kocSistemData.appSecUsage.total}
        change={16}
        icon={Shield}
        suffix=" TB"
      />
      <MetricCard
        title="ZT YTD Seats"
        value={kocSistemData.ztnaUsage.total}
        change={22}
        icon={Network}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricCard
        title="Email Security"
        value={kocSistemData.emailUsage.total}
        change={18}
        icon={Mail}
        suffix=" Inboxes"
      />
      <MetricCard
        title="ZTNA Seats (Last Month)"
        value={kocSistemData.ztnaUsage.gateway}
        change={15}
        icon={Zap}
        suffix=" Seats"
      />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 6-Month Revenue Growth Chart */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            6-Month Revenue Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={kocRevenueGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : `${value}%`,
                  name === 'revenue' ? 'Revenue' : 'Growth %'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Product Distribution Pie Chart */}
      <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Total Product Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={kocProductDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {kocProductDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Distribution']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    {/* Top Customer Performers */}
    <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader>
        <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Top 5 Customer Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {kocTopCustomers.map((customer, index) => (
            <div 
              key={customer.name}
              className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                } text-white font-bold`}>
                  {customer.rank}
                </div>
                <div>
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {customer.name}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Revenue: ${customer.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {customer.appSecUsage} TB Usage
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {customer.ztSeats} ZT Seats
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

  // Main Component Return
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Cloud className="w-8 h-8 text-orange-500" />
              <h1 className="text-xl font-bold">CloudPulse MSSP Interface</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Cloudflare Master View - Tier 1 {selectedRegion !== 'ALL' ? `(${selectedRegion})` : ''}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            {/* Client Onboarding Button for MSSP Partners */}
            {(userRole === 'MSSP_PARTNER' || userRole === 'MSSP_ADMIN' || userRole === 'cloudflare-global') ? (
              <Button
                onClick={() => setCurrentView('clientOnboarding')}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Customer</span>
              </Button>
            ) : null}
            
            <Select value={selectedRegion} onValueChange={(value: Region | 'ALL') => setSelectedRegion(value)}>
              <SelectTrigger className={`w-40 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                <SelectItem value="ALL" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>All Regions</SelectItem>
                <SelectItem value="AMER" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>AMER</SelectItem>
                <SelectItem value="EMEA" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>EMEA</SelectItem>
                <SelectItem value="APAC" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>APAC</SelectItem>
                <SelectItem value="LATAM" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>LATAM</SelectItem>
                <SelectItem value="JAPAN" className={`${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>JAPAN</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Updated based on SOW requirements */}
        <div className={`w-64 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4`}>
          <nav className="space-y-2">
            <a 
              href="#" 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                currentView === 'dashboard' 
                  ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900')
                  : (isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
              }`}
              onClick={() => setCurrentView('dashboard')}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Executive Dashboard</span>
            </a>
            <a 
              href="#" 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                currentView === 'usage' || currentView === 'partnerUsageDetails'
                  ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900')
                  : (isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
              }`}
              onClick={() => setCurrentView('usage')}
            >
              <Zap className="w-5 h-5" />
              <span>Usage Dashboard</span>
            </a>
            <a 
              href="#" 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                (currentView === 'partnerList' || currentView === 'partnerDrillDown')
                  ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900')
                  : (isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
              }`}
              onClick={() => setCurrentView('dashboard')}
            >
              <Building2 className="w-5 h-5" />
              <span>Partner Management</span>
            </a>
            <a href="#" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Bell className="w-5 h-5" />
              <span>Usage Alerts</span>
            </a>
            <a href="#" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Users className="w-5 h-5" />
              <span>Client Onboarding</span>
            </a>
            <a href="#" className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Settings className="w-5 h-5" />
              <span>Tenant Staging</span>
            </a>
            <a 
              href="#" 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                currentView === 'commercials'
                  ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900')
                  : (isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
              }`}
              onClick={() => setCurrentView('commercials')}
            >
              <FileText className="w-5 h-5" />
              <span>Commercials</span>
            </a>

            <a 
              href="#" 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                currentView === 'magicTransit'
                  ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900')
                  : (isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
              }`}
              onClick={() => setCurrentView('magicTransit')}
            >
              <Network className="w-5 h-5" />
              <span>Magic Transit</span>
            </a>

<a 
  href="#" 
  className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
    currentView === 'kocSistemView'
      ? (isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900')
      : (isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
  }`}
  onClick={() => setCurrentView('kocSistemView')}
>
  <Building2 className="w-5 h-5" />
  <span>Koc SISTEM Dashboard</span>
</a>
          </nav>

          {/* User Info Panel - Updated based on SOW access structure */}
          <div className="mt-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">
                Cloudflare Admin
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Global Access
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Tier 1 Master View
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {selectedRegion === 'ALL' ? 'All Regions' : `${selectedRegion} Region`}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentView === 'dashboard' ? renderDashboard() : null}
          {currentView === 'partnerList' ? renderPartnerList() : null}
          {currentView === 'partnerDrillDown' ? renderPartnerDrillDown() : null}
          {currentView === 'usage' ? renderUsageDashboard() : null}
          {currentView === 'partnerUsageDetails' ? renderPartnerUsageDetails() : null}
          {currentView === 'commercials' ? renderCommercials() : null}
          {currentView === 'magicTransit' ? renderMagicTransit() : null}
          {currentView === 'msspPartnerView' ? renderMSSPPartnerView() : null}
          {currentView === 'kocSistemView' ? renderKocSistemView() : null}

          {currentView === 'clientOnboarding' ? (
            <ClientOnboardingComponent
              isDarkMode={isDarkMode}
              onBack={() => setCurrentView('dashboard')}
              userRole={userRole}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CloudPulseDashboard;