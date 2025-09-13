import React, { useState, useEffect, useCallback } from 'react';

import Button from '../../components/ui/Button';
import FilterToolbar from './components/FilterToolbar';
import RequestDataGrid from './components/RequestDataGrid';
import RequestDetailPanel from './components/RequestDetailPanel';
import BulkActionPanel from './components/BulkActionPanel';
import QueueStats from './components/QueueStats';
import KeyboardShortcuts from './components/KeyboardShortcuts';

const ApprovalQueueDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
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
  const [savedPresets, setSavedPresets] = useState([
    { name: 'Urgent Only', filters: { priority: 'urgent', status: 'pending' } },
    { name: 'High Value', filters: { amountMin: '10000', currency: 'USD' } },
    { name: 'SLA Risk', filters: { status: 'pending' } }
  ]);
  const [stats, setStats] = useState({});
  const [currentUser] = useState({
    id: 'USR001',
    name: 'Sarah Chen',
    role: 'Branch Manager',
    department: 'Phnom Penh Main',
    permissions: ['approve', 'reject', 'delegate']
  });

  // Mock data
  const mockRequests = [
    {
      id: 'CTR-2024-001234',
      type: 'Branch to CMC',
      submitter: 'John Doe',
      submitterRole: 'Teller Supervisor',
      submitterContact: 'john.doe@wingbank.com',
      branch: 'Phnom Penh Main',
      amount: 50000,
      currency: 'USD',
      priority: 'urgent',
      status: 'pending',
      currentStage: 'Branch Manager Review',
      submittedDate: '13/09/2024',
      slaMinutes: 15,
      isUrgent: true,
      isNew: true,
      description: `Urgent cash transfer request for ATM replenishment at Phnom Penh Main branch.\nRequired for weekend operations due to high customer demand.`,
      approvalStages: [
        { role: 'Teller Supervisor', approver: 'John Doe', status: 'completed', completedAt: '13/09/2024 08:30', comment: 'Verified cash count and ATM status' },
        { role: 'Branch Manager', approver: 'Sarah Chen', status: 'current' },
        { role: 'CMC Supervisor', status: 'pending' }
      ],
      attachments: [
        { name: 'ATM_Status_Report.pdf', size: '245 KB', type: 'PDF' },
        { name: 'Cash_Count_Sheet.jpg', size: '1.2 MB', type: 'Image' }
      ]
    },
    {
      id: 'CTR-2024-001235',
      type: 'Over Limit',
      submitter: 'Maria Santos',
      submitterRole: 'Senior Teller',
      submitterContact: 'maria.santos@wingbank.com',
      branch: 'Siem Reap',
      amount: 75000,
      currency: 'USD',
      priority: 'high',
      status: 'in-review',
      currentStage: 'CMC Review',
      submittedDate: '13/09/2024',
      slaMinutes: 120,
      isUrgent: false,
      isNew: false,
      description: `Over-limit approval request for large corporate withdrawal.\nCustomer: ABC Trading Company\nPurpose: Supplier payment`,
      approvalStages: [
        { role: 'Teller Supervisor', approver: 'David Kim', status: 'completed', completedAt: '13/09/2024 09:15', comment: 'Customer documentation verified' },
        { role: 'Branch Manager', approver: 'Lisa Wong', status: 'completed', completedAt: '13/09/2024 10:30', comment: 'Approved within branch authority' },
        { role: 'CMC Supervisor', status: 'current' }
      ],
      attachments: [
        { name: 'Customer_ID.pdf', size: '180 KB', type: 'PDF' },
        { name: 'Withdrawal_Form.pdf', size: '320 KB', type: 'PDF' }
      ]
    },
    {
      id: 'CTR-2024-001236',
      type: 'Branch to Branch',
      submitter: 'Robert Johnson',
      submitterRole: 'Branch Manager',
      submitterContact: 'robert.johnson@wingbank.com',
      branch: 'Battambang',
      amount: 25000,
      currency: 'USD',
      priority: 'normal',
      status: 'pending',
      currentStage: 'CMC Approval',
      submittedDate: '12/09/2024',
      slaMinutes: 180,
      isUrgent: false,
      isNew: false,
      description: `Inter-branch cash transfer for operational balance.\nFrom: Battambang Branch\nTo: Kampong Cham Branch`,
      approvalStages: [
        { role: 'Branch Manager', approver: 'Robert Johnson', status: 'completed', completedAt: '12/09/2024 14:20', comment: 'Branch cash position verified' },
        { role: 'CMC Supervisor', status: 'current' }
      ],
      attachments: []
    },
    {
      id: 'CTR-2024-001237',
      type: 'CMC to Branch',
      submitter: 'Emily Zhang',
      submitterRole: 'CMC Supervisor',
      submitterContact: 'emily.zhang@wingbank.com',
      branch: 'CMC',
      amount: 100000,
      currency: 'USD',
      priority: 'high',
      status: 'escalated',
      currentStage: 'CBSO Review',
      submittedDate: '12/09/2024',
      slaMinutes: -30,
      isUrgent: true,
      isNew: false,
      description: `Emergency cash distribution to multiple branches.\nBranches: Preah Sihanouk, Kampong Cham\nReason: Holiday weekend preparation`,
      approvalStages: [
        { role: 'CMC Supervisor', approver: 'Emily Zhang', status: 'completed', completedAt: '12/09/2024 11:00', comment: 'Emergency distribution approved' },
        { role: 'Head of Banking Operations', status: 'current' }
      ],
      attachments: [
        { name: 'Branch_Cash_Forecast.xlsx', size: '450 KB', type: 'Excel' }
      ]
    },
    {
      id: 'CTR-2024-001238',
      type: 'Branch to CMC',
      submitter: 'Michael Brown',
      submitterRole: 'Teller Supervisor',
      submitterContact: 'michael.brown@wingbank.com',
      branch: 'Preah Sihanouk',
      amount: 30000,
      currency: 'USD',
      priority: 'normal',
      status: 'approved',
      currentStage: 'Completed',
      submittedDate: '11/09/2024',
      slaMinutes: 0,
      isUrgent: false,
      isNew: false,
      description: `Regular end-of-day cash deposit to CMC.\nDaily operational surplus transfer.`,
      approvalStages: [
        { role: 'Teller Supervisor', approver: 'Michael Brown', status: 'completed', completedAt: '11/09/2024 16:30', comment: 'EOD cash count completed' },
        { role: 'Branch Manager', approver: 'Jennifer Lee', status: 'completed', completedAt: '11/09/2024 17:00', comment: 'Approved for transfer' },
        { role: 'CMC Supervisor', approver: 'Tom Wilson', status: 'completed', completedAt: '12/09/2024 08:15', comment: 'Transfer completed successfully' }
      ],
      attachments: [
        { name: 'EOD_Report.pdf', size: '280 KB', type: 'PDF' }
      ]
    }
  ];

  const mockStats = {
    totalPending: 15,
    urgentRequests: 3,
    slaBreaches: 2,
    processedToday: 8,
    avgProcessingTime: 2.5,
    myQueue: 5,
    pendingTrend: 12,
    urgentTrend: -8,
    slaTrend: 15,
    processedTrend: 25,
    timeTrend: -10,
    myQueueTrend: 5
  };

  const availableDelegates = [
    { id: 'USR002', name: 'David Kim', role: 'Deputy Branch Manager', department: 'Phnom Penh Main' },
    { id: 'USR003', name: 'Lisa Wong', role: 'Branch Manager', department: 'Siem Reap' },
    { id: 'USR004', name: 'Tom Wilson', role: 'CMC Supervisor', department: 'Cash Management' }
  ];

  // Initialize data
  useEffect(() => {
    setRequests(mockRequests);
    setStats(mockStats);
  }, []);

  // Filter and sort requests
  useEffect(() => {
    let filtered = [...requests];

    // Apply filters
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(request =>
        request?.id?.toLowerCase()?.includes(searchTerm) ||
        request?.submitter?.toLowerCase()?.includes(searchTerm) ||
        request?.description?.toLowerCase()?.includes(searchTerm)
      );
    }

    if (filters?.requestType !== 'all') {
      filtered = filtered?.filter(request => 
        request?.type?.toLowerCase()?.replace(/\s+/g, '-') === filters?.requestType
      );
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(request => request?.status === filters?.status);
    }

    if (filters?.priority !== 'all') {
      filtered = filtered?.filter(request => request?.priority === filters?.priority);
    }

    if (filters?.currency !== 'all') {
      filtered = filtered?.filter(request => request?.currency === filters?.currency);
    }

    if (filters?.branch !== 'all') {
      filtered = filtered?.filter(request => request?.branch === filters?.branch);
    }

    if (filters?.amountMin) {
      filtered = filtered?.filter(request => request?.amount >= parseFloat(filters?.amountMin));
    }

    if (filters?.amountMax) {
      filtered = filtered?.filter(request => request?.amount <= parseFloat(filters?.amountMax));
    }

    // Apply sorting
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (sortConfig?.key === 'amount') {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredRequests(filtered);
  }, [requests, filters, sortConfig]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if typing in input fields
      if (event?.target?.tagName === 'INPUT' || event?.target?.tagName === 'TEXTAREA') {
        return;
      }

      switch (event?.key) {
        case '?':
          setShowKeyboardShortcuts(!showKeyboardShortcuts);
          break;
        case 'Escape':
          setShowDetailPanel(false);
          setSelectedRequest(null);
          break;
        case '/':
          event?.preventDefault();
          document.querySelector('input[type="search"]')?.focus();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardShortcuts]);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setRequests(prevRequests => 
        prevRequests?.map(request => ({
          ...request,
          slaMinutes: Math.max(0, request?.slaMinutes - 1),
          isNew: false
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
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
    // Implement approval logic
    setShowDetailPanel(false);
    setSelectedRequest(null);
  };

  const handleReject = (actionData) => {
    console.log('Rejecting request:', actionData);
    // Implement rejection logic
    setShowDetailPanel(false);
    setSelectedRequest(null);
  };

  const handleDelegate = (actionData) => {
    console.log('Delegating request:', actionData);
    // Implement delegation logic
    setShowDetailPanel(false);
    setSelectedRequest(null);
  };

  const handleBulkApprove = (actionData) => {
    console.log('Bulk approving requests:', actionData);
    // Implement bulk approval logic
    setSelectedRequests([]);
  };

  const handleBulkReject = (actionData) => {
    console.log('Bulk rejecting requests:', actionData);
    // Implement bulk rejection logic
    setSelectedRequests([]);
  };

  const handleBulkDelegate = (actionData) => {
    console.log('Bulk delegating requests:', actionData);
    // Implement bulk delegation logic
    setSelectedRequests([]);
  };

  return (
    <div className="min-h-screen bg-background">
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
    </div>
  );
};

export default ApprovalQueueDashboard;