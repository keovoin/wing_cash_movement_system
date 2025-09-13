import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './components/DashboardHeader';
import FilterPanel from './components/FilterPanel';
import KPICards from './components/KPICards';
import TransactionVolumeChart from './components/TransactionVolumeChart';
import ApprovalMetricsChart from './components/ApprovalMetricsChart';
import BranchPerformanceTable from './components/BranchPerformanceTable';
import ComplianceStatusPanel from './components/ComplianceStatusPanel';
import SystemHealthIndicators from './components/SystemHealthIndicators';

const ReportingAndAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date()?.toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    dateRange: 'last_7_days',
    branches: 'all',
    currency: 'all',
    requestType: 'all',
    status: 'all',
    amountMin: '',
    amountMax: '',
    dateFrom: '',
    dateTo: ''
  });

  const [dashboardData, setDashboardData] = useState({
    kpis: null,
    transactionVolume: null,
    approvalMetrics: null,
    branchPerformance: null,
    complianceStatus: null,
    systemHealth: null
  });

  // Mock user data
  const currentUser = {
    name: 'Sarah Chen',
    role: 'Banking Operations Manager',
    email: 'sarah.chen@wingbank.com',
    permissions: ['view_all_branches', 'export_reports', 'system_admin']
  };

  useEffect(() => {
    // Simulate initial data load
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date()?.toLocaleTimeString());
    }, 1500);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date()?.toLocaleTimeString());
    }, 2000);
  };

  const handleExport = (format) => {
    console.log(`Exporting dashboard data in ${format} format`);
    // Simulate export process
    const exportData = {
      format,
      filters,
      timestamp: new Date()?.toISOString(),
      user: currentUser?.name
    };
    
    // In real implementation, this would trigger file download
    alert(`Export initiated: ${format?.toUpperCase()} report will be generated and emailed to ${currentUser?.email}`);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Simulate data refresh based on new filters
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date()?.toLocaleTimeString());
    }, 1000);
  };

  const handleSavePreset = (name, filterData) => {
    console.log(`Saving preset: ${name}`, filterData);
    // In real implementation, save to user preferences
    alert(`Filter preset "${name}" saved successfully`);
  };

  const handleLoadPreset = (preset) => {
    console.log(`Loading preset: ${preset?.name}`);
    // In real implementation, load preset filters
    setFilters({
      dateRange: 'last_30_days',
      branches: 'all',
      currency: 'all',
      requestType: 'all',
      status: 'all',
      amountMin: '',
      amountMax: ''
    });
    alert(`Loaded preset: ${preset?.name}`);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event?.ctrlKey || event?.metaKey) {
        switch (event?.key) {
          case 'r':
            event?.preventDefault();
            handleRefresh();
            break;
          case 'f':
            event?.preventDefault();
            setIsFilterOpen(!isFilterOpen);
            break;
          case 'e':
            event?.preventDefault();
            handleExport('pdf');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFilterOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader
        onRefresh={handleRefresh}
        onExport={handleExport}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        isFilterOpen={isFilterOpen}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
      />
      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSavePreset={handleSavePreset}
        onLoadPreset={handleLoadPreset}
      />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* KPI Cards */}
        <KPICards
          data={dashboardData?.kpis}
          isLoading={isLoading}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransactionVolumeChart
            data={dashboardData?.transactionVolume}
            isLoading={isLoading}
          />
          <ApprovalMetricsChart
            data={dashboardData?.approvalMetrics}
            isLoading={isLoading}
          />
        </div>

        {/* Branch Performance Table */}
        <BranchPerformanceTable
          data={dashboardData?.branchPerformance}
          isLoading={isLoading}
        />

        {/* Bottom Row - Compliance and System Health */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ComplianceStatusPanel
            data={dashboardData?.complianceStatus}
            isLoading={isLoading}
          />
          <SystemHealthIndicators
            data={dashboardData?.systemHealth}
            isLoading={isLoading}
          />
        </div>
      </div>
      {/* Quick Navigation Shortcuts */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-40">
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="text-xs text-muted-foreground mb-2">Quick Actions</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span>Refresh</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+R</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Filters</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+F</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Export</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+E</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingAndAnalyticsDashboard;