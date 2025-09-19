import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header'; // <-- Import main Header
import Sidebar from '../../components/ui/Sidebar'; // <-- Import main Sidebar
import KPICards from './components/KPICards';
import TransactionVolumeChart from './components/TransactionVolumeChart';
import ApprovalMetricsChart from './components/ApprovalMetricsChart';
import BranchPerformanceTable from './components/BranchPerformanceTable';
import ComplianceStatusPanel from './components/ComplianceStatusPanel';
import SystemHealthIndicators from './components/SystemHealthIndicators';
import FilterPanel from './components/FilterPanel';
import Button from '../../components/ui/Button';

const ReportingAndAnalyticsDashboard = () => {
 const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(false);
 const [isFilterOpen, setIsFilterOpen] = useState(false);
 const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
     setLastUpdated(new Date().toLocaleTimeString());
   }, 1500);
 }, []);

 const handleRefresh = async () => {
   setIsRefreshing(true);
   // Simulate API call
   setTimeout(() => {
     setIsRefreshing(false);
     setLastUpdated(new Date().toLocaleTimeString());
   }, 2000);
 };

 const handleExport = (format) => {
   console.log(`Exporting dashboard data in ${format} format`);
   alert(`Export initiated: ${format.toUpperCase()} report will be generated and emailed to ${currentUser.email}`);
 };

 const handleFiltersChange = (newFilters) => {
   setFilters(newFilters);
   setIsLoading(true);
   setTimeout(() => {
     setIsLoading(false);
     setLastUpdated(new Date().toLocaleTimeString());
   }, 1000);
 };
 
 return (
   <div className="min-h-screen bg-background">
     {/* --- ADDED STANDARD HEADER AND SIDEBAR --- */}
     <Header 
       user={currentUser} 
       onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
     />
     <Sidebar 
       isCollapsed={isSidebarCollapsed} 
       onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
       user={currentUser} 
     />

     {/* --- WRAPPED CONTENT IN MAIN TAG WITH CORRECT LAYOUT --- */}
     <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
       
       {/* Page Header */}
       <div className="bg-card border-b border-border p-6">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-semibold text-foreground">
               Reporting & Analytics Dashboard
             </h1>
             <p className="text-sm text-muted-foreground">
               Comprehensive cash transfer operations analytics and performance metrics
             </p>
           </div>
           <div className="flex items-center space-x-2">
             <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)}>
               {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
             </Button>
             <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
               {isRefreshing ? 'Refreshing...' : 'Refresh'}
             </Button>
           </div>
         </div>
       </div>

       {/* Filter Panel */}
       <FilterPanel
         isOpen={isFilterOpen}
         filters={filters}
         onFiltersChange={handleFiltersChange}
       />

       {/* Main Content */}
       <div className="p-6 space-y-8">
         {/* KPI Cards */}
         <KPICards
           data={dashboardData.kpis}
           isLoading={isLoading}
         />

         {/* Charts Row */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <TransactionVolumeChart
             data={dashboardData.transactionVolume}
             isLoading={isLoading}
           />
           <ApprovalMetricsChart
             data={dashboardData.approvalMetrics}
             isLoading={isLoading}
           />
         </div>

         {/* Branch Performance Table */}
         <BranchPerformanceTable
           data={dashboardData.branchPerformance}
           isLoading={isLoading}
         />

         {/* Bottom Row - Compliance and System Health */}
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           <ComplianceStatusPanel
             data={dashboardData.complianceStatus}
             isLoading={isLoading}
           />
           <SystemHealthIndicators
             data={dashboardData.systemHealth}
             isLoading={isLoading}
           />
         </div>
       </div>
     </main>
   </div>
 );
};

export default ReportingAndAnalyticsDashboard;
