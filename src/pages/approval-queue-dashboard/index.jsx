import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import FilterToolbar from './components/FilterToolbar';
import RequestDataGrid from './components/RequestDataGrid';
import RequestDetailPanel from './components/RequestDetailPanel';
import BulkActionPanel from './components/BulkActionPanel';
import QueueStats from './components/QueueStats';
import KeyboardShortcuts from './components/KeyboardShortcuts';
const ApprovalQueueDashboard = () => {
 const navigate = useNavigate();
 const [requests, setRequests] = useState([]);
 const [filteredRequests, setFilteredRequests] = useState([]);
 const [selectedRequests, setSelectedRequests] = useState([]);
 const [selectedRequest, setSelectedRequest] = useState(null);
 const [showDetailPanel, setShowDetailPanel] = useState(false);
 const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
 const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
 const [filters, setFilters] = useState({
   search: '',
   requestType: 'all',
   status: 'all',
   priority: 'all',
   currency: 'all',
   branch: 'all',
   dateFrom: '',
   dateTo: '',
   amountMin: '',
   amountMax: ''
 });
 const [sortConfig, setSortConfig] = useState({ key: 'submitted', direction: 'desc' });
 const [savedPresets, setSavedPresets] = useState([]);
 const [stats, setStats] = useState({});
 const [currentUser] = useState({
   id: 'USR001',
   name: 'Sarah Chen',
   role: 'Branch Manager',
   department: 'Phnom Penh Main',
   permissions: ['approve', 'reject', 'delegate']
 });
 const [availableDelegates, setAvailableDelegates] = useState([]);
 // Filter and sort requests
 useEffect(() => {
   let filtered = [...requests];
   // Apply filters
   if (filters.search) {
     const searchTerm = filters.search.toLowerCase();
     filtered = filtered.filter(request =>
       request.id.toLowerCase().includes(searchTerm) ||
       request.submitter.toLowerCase().includes(searchTerm) ||
       request.description.toLowerCase().includes(searchTerm)
     );
   }
   // ... add other filters ...
   // Apply sorting
   if (sortConfig.key) {
     filtered.sort((a, b) => {
       let aValue = a[sortConfig.key];
       let bValue = b[sortConfig.key];
       if (sortConfig.key === 'amount') {
         aValue = parseFloat(aValue);
         bValue = parseFloat(bValue);
       }
       if (aValue < bValue) {
         return sortConfig.direction === 'asc' ? -1 : 1;
       }
       if (aValue > bValue) {
         return sortConfig.direction === 'asc' ? 1 : -1;
       }
       return 0;
     });
   }
   setFilteredRequests(filtered);
 }, [requests, filters, sortConfig]);
 const handleSort = (key) => {
   setSortConfig(prevConfig => ({
     key,
     direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
   }));
 };
 const handleRequestClick = (request) => {
   setSelectedRequest(request);
   setShowDetailPanel(true);
 };
 const handleSavePreset = (name, filterConfig) => {
   setSavedPresets(prev => [...prev, { name, filters: filterConfig }]);
 };
 const handleApprove = (actionData) => {
   console.log('Approving request:', actionData);
   setShowDetailPanel(false);
   setSelectedRequest(null);
 };
 const handleReject = (actionData) => {
   console.log('Rejecting request:', actionData);
   setShowDetailPanel(false);
   setSelectedRequest(null);
 };
 const handleDelegate = (actionData) => {
   console.log('Delegating request:', actionData);
   setShowDetailPanel(false);
   setSelectedRequest(null);
 };
 const handleBulkApprove = (actionData) => {
   console.log('Bulk approving requests:', actionData);
   setSelectedRequests([]);
 };
 const handleBulkReject = (actionData) => {
   console.log('Bulk rejecting requests:', actionData);
   setSelectedRequests([]);
 };
 const handleBulkDelegate = (actionData) => {
   console.log('Bulk delegating requests:', actionData);
   setSelectedRequests([]);
 };
 return (
<div className="min-h-screen bg-background">
<Header
       user={currentUser}
       onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
     />
<Sidebar
       isCollapsed={isSidebarCollapsed}
       onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
       user={currentUser}
     />
<main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
       {/* Header */}
<div className="bg-card border-b border-border p-6">
<div className="flex items-center justify-between">
<div>
<h1 className="text-2xl font-bold text-foreground">Approval Queue Dashboard</h1>
<p className="text-muted-foreground mt-1">
               Manage and process pending cash transfer and over-limit requests
</p>
</div>
<div className="flex items-center space-x-3">
<Button
               variant="outline"
               iconName="Keyboard"
               iconPosition="left"
               onClick={() => setShowKeyboardShortcuts(true)}
>
               Shortcuts
</Button>
<Button
               variant="outline"
               iconName="RefreshCw"
               iconPosition="left"
>
               Refresh
</Button>
<Button
               variant="outline"
               iconName="Download"
               iconPosition="left"
>
               Export
</Button>
</div>
</div>
</div>
       {/* Stats */}
<div className="p-6">
<QueueStats stats={stats} />
</div>
       {/* Filter Toolbar */}
<FilterToolbar
         filters={filters}
         onFiltersChange={setFilters}
         onSavePreset={handleSavePreset}
         savedPresets={savedPresets}
       />
       {/* Main Content */}
<div className="flex h-[calc(100vh-400px)]">
         {/* Left Panel - Request List */}
<div className={`${showDetailPanel ? 'w-2/3' : 'w-full'} p-6 space-y-4 transition-all duration-300`}>
<BulkActionPanel
             selectedRequests={selectedRequests}
             onBulkApprove={handleBulkApprove}
             onBulkReject={handleBulkReject}
             onBulkDelegate={handleBulkDelegate}
             onClearSelection={() => setSelectedRequests([])}
             availableDelegates={availableDelegates}
           />
<RequestDataGrid
             requests={filteredRequests}
             selectedRequests={selectedRequests}
             onSelectionChange={setSelectedRequests}
             onRequestClick={handleRequestClick}
             sortConfig={sortConfig}
             onSort={handleSort}
             currentUser={currentUser}
           />
</div>
         {/* Right Panel - Request Details */}
         {showDetailPanel && (
<div className="w-1/3 transition-all duration-300">
<RequestDetailPanel
               request={selectedRequest}
               onApprove={handleApprove}
               onReject={handleReject}
               onDelegate={handleDelegate}
               onClose={() => {
                 setShowDetailPanel(false);
                 setSelectedRequest(null);
               }}
             />
</div>
         )}
</div>
       {/* Keyboard Shortcuts Modal */}
       {showKeyboardShortcuts && (
<KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />
       )}
</main>
</div>
 );
};
export default ApprovalQueueDashboard;
