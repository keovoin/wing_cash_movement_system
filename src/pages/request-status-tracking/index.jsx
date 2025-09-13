import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchFilterPanel from './components/SearchFilterPanel';
import RequestListPanel from './components/RequestListPanel';
import TimelineDetailPanel from './components/TimelineDetailPanel';

import IntegrationStatusPanel from './components/IntegrationStatusPanel';

const RequestStatusTracking = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock user data
  const user = {
    name: "Sarah Chen",
    email: "sarah.chen@wingbank.com",
    role: "Branch Manager",
    department: "Phnom Penh Main Branch",
    status: "online"
  };

  // Mock requests data
  const mockRequests = [
    {
      id: "CTR-2025-001234",
      type: "branch_to_cmc",
      status: "in_progress",
      priority: "high",
      amount: 50000,
      currency: "USD",
      fromBranch: "Phnom Penh Main Branch",
      toBranch: "Cash Management Center",
      createdAt: "2025-01-13T06:30:00Z",
      progress: 75,
      lastActivity: "Approved by Branch Manager",
      nextAction: "Awaiting CMC Supervisor approval",
      hasUnreadUpdates: true,
      timeline: [
        {
          id: "evt_001",
          type: "created",
          title: "Request Created",
          description: "Cash transfer request submitted by Teller Supervisor",
          timestamp: "2025-01-13T06:30:00Z",
          user: "John Doe",
          details: {
            amount: "$50,000.00",
            reason: "Daily cash shortage - high customer withdrawal demand",
            denomination_breakdown: "50x$1000, 100x$500"
          }
        },
        {
          id: "evt_002",
          type: "approved",
          title: "Branch Manager Approval",
          description: "Request approved by Branch Manager",
          timestamp: "2025-01-13T07:15:00Z",
          user: "Sarah Chen",
          details: "Approved with standard processing. EOD report attached for verification."
        },
        {
          id: "evt_003",
          type: "status_change",
          title: "Forwarded to CMC",
          description: "Request forwarded to Cash Management Center for final approval",
          timestamp: "2025-01-13T07:20:00Z",
          user: "System",
          details: {
            assigned_to: "Michael Rodriguez - CMC Supervisor",
            expected_completion: "2025-01-13T10:00:00Z"
          }
        }
      ]
    },
    {
      id: "OLA-2025-000567",
      type: "over_limit",
      status: "pending",
      priority: "urgent",
      amount: 150000,
      currency: "USD",
      fromBranch: "Siem Reap Branch",
      toBranch: null,
      createdAt: "2025-01-13T08:00:00Z",
      progress: 25,
      lastActivity: "Submitted for approval",
      nextAction: "Awaiting Deputy Branch Manager review",
      hasUnreadUpdates: false,
      timeline: [
        {
          id: "evt_004",
          type: "created",
          title: "Over-Limit Request Created",
          description: "Over-limit approval request for large corporate withdrawal",
          timestamp: "2025-01-13T08:00:00Z",
          user: "Lisa Wang",
          details: {
            customer: "Angkor Tourism Ltd.",
            account: "****-1234",
            limit_exceeded_by: "$50,000.00",
            justification: "Emergency payroll processing for 200+ employees"
          },
          attachments: [
            { id: "att_001", name: "corporate_authorization.pdf", size: "245 KB" },
            { id: "att_002", name: "payroll_schedule.xlsx", size: "89 KB" }
          ]
        }
      ]
    },
    {
      id: "CTR-2025-001189",
      type: "branch_to_branch",
      status: "completed",
      priority: "medium",
      amount: 25000,
      currency: "USD",
      fromBranch: "Battambang Branch",
      toBranch: "Kampong Cham Branch",
      createdAt: "2025-01-12T14:30:00Z",
      progress: 100,
      lastActivity: "Transfer completed successfully",
      nextAction: null,
      hasUnreadUpdates: false,
      timeline: [
        {
          id: "evt_005",
          type: "created",
          title: "Inter-Branch Transfer Request",
          description: "Cash transfer between branches for operational needs",
          timestamp: "2025-01-12T14:30:00Z",
          user: "David Kim"
        },
        {
          id: "evt_006",
          type: "approved",
          title: "Multi-Level Approval Complete",
          description: "All required approvals obtained",
          timestamp: "2025-01-12T16:45:00Z",
          user: "Regional Manager"
        },
        {
          id: "evt_007",
          type: "completed",
          title: "Transfer Executed",
          description: "Cash transfer completed and confirmed by receiving branch",
          timestamp: "2025-01-13T09:15:00Z",
          user: "System"
        }
      ]
    },
    {
      id: "CTR-2025-001298",
      type: "cmc_to_branch",
      status: "rejected",
      priority: "low",
      amount: 75000,
      currency: "USD",
      fromBranch: "Cash Management Center",
      toBranch: "Sihanoukville Branch",
      createdAt: "2025-01-12T10:00:00Z",
      progress: 0,
      lastActivity: "Rejected due to insufficient documentation",
      nextAction: "Resubmit with complete documentation",
      hasUnreadUpdates: true,
      timeline: [
        {
          id: "evt_008",
          type: "created",
          title: "CMC Distribution Request",
          description: "Request for cash distribution from CMC to branch",
          timestamp: "2025-01-12T10:00:00Z",
          user: "Branch Operations"
        },
        {
          id: "evt_009",
          type: "rejected",
          title: "Request Rejected",
          description: "Insufficient supporting documentation provided",
          timestamp: "2025-01-12T15:30:00Z",
          user: "CMC Supervisor",
          details: "Missing: Updated EOD report, denomination request form, and branch manager authorization. Please resubmit with complete documentation package."
        }
      ]
    }
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'approval',
      title: 'Approval Required',
      message: 'Over-limit request OLA-2025-000567 requires your approval',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      metadata: {
        requestId: 'OLA-2025-000567',
        amount: '150,000',
        currency: 'USD',
        priority: 'urgent'
      }
    },
    {
      id: 2,
      type: 'success',
      title: 'Transfer Completed',
      message: 'Cash transfer CTR-2025-001189 has been completed successfully',
      timestamp: new Date(Date.now() - 900000),
      read: false,
      metadata: {
        requestId: 'CTR-2025-001189',
        amount: '25,000',
        currency: 'USD'
      }
    }
  ];

  useEffect(() => {
    setFilteredRequests(mockRequests);
    setNotifications(mockNotifications);
    
    // Auto-select first request if none selected
    if (mockRequests?.length > 0 && !selectedRequest) {
      setSelectedRequest(mockRequests?.[0]);
    }
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...mockRequests];

    // Apply search text filter
    if (filters?.searchText) {
      const searchLower = filters?.searchText?.toLowerCase();
      filtered = filtered?.filter(request => 
        request?.id?.toLowerCase()?.includes(searchLower) ||
        request?.fromBranch?.toLowerCase()?.includes(searchLower) ||
        request?.toBranch?.toLowerCase()?.includes(searchLower) ||
        request?.lastActivity?.toLowerCase()?.includes(searchLower) ||
        request?.timeline?.some(event => 
          event?.title?.toLowerCase()?.includes(searchLower) ||
          event?.description?.toLowerCase()?.includes(searchLower)
        )
      );
    }

    // Apply date range filter
    if (filters?.dateRange?.start || filters?.dateRange?.end) {
      filtered = filtered?.filter(request => {
        const requestDate = new Date(request.createdAt);
        const startDate = filters?.dateRange?.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters?.dateRange?.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && requestDate < startDate) return false;
        if (endDate && requestDate > endDate) return false;
        return true;
      });
    }

    // Apply status filter
    if (filters?.statuses?.length > 0) {
      filtered = filtered?.filter(request => filters?.statuses?.includes(request?.status));
    }

    // Apply type filter
    if (filters?.types?.length > 0) {
      filtered = filtered?.filter(request => filters?.types?.includes(request?.type));
    }

    // Apply currency filter
    if (filters?.currencies?.length > 0) {
      filtered = filtered?.filter(request => filters?.currencies?.includes(request?.currency));
    }

    // Apply amount range filter
    if (filters?.amountRange?.min || filters?.amountRange?.max) {
      filtered = filtered?.filter(request => {
        const amount = request?.amount;
        const min = filters?.amountRange?.min ? parseFloat(filters?.amountRange?.min) : 0;
        const max = filters?.amountRange?.max ? parseFloat(filters?.amountRange?.max) : Infinity;
        return amount >= min && amount <= max;
      });
    }

    // Apply priority filter
    if (filters?.priority) {
      filtered = filtered?.filter(request => request?.priority === filters?.priority);
    }

    setFilteredRequests(filtered);
  };

  const handleSaveSearch = (searchConfig) => {
    const newSearch = {
      ...searchConfig,
      id: `search_${Date.now()}`
    };
    setSavedSearches(prev => [...prev, newSearch]);
  };

  const handleLoadSearch = (searchId) => {
    const search = savedSearches?.find(s => s?.id === searchId);
    if (search) {
      handleFilterChange(search?.filters);
    }
  };

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
  };

  const handleBulkAction = (action, requestIds) => {
    console.log(`Bulk action: ${action} on requests:`, requestIds);
    // Implement bulk actions like export, notify, etc.
  };

  const handleAddComment = (requestId, comment) => {
    console.log(`Adding comment to ${requestId}:`, comment);
    // Implement comment addition logic
  };

  const handleDownloadDocument = (documentId) => {
    console.log(`Downloading document:`, documentId);
    // Implement document download logic
  };

  const handleNotificationClick = (notification) => {
    if (notification?.metadata?.requestId) {
      const request = mockRequests?.find(r => r?.id === notification?.metadata?.requestId);
      if (request) {
        setSelectedRequest(request);
      }
    }
  };

  const handleProfileClick = (action) => {
    console.log('Profile action:', action);
    if (action === 'logout') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        user={user}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          {/* Page Header */}
          <div className="p-6 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Request Status Tracking</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor and track cash transfer requests and approval workflows in real-time
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/cash-transfer-request-form')}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  New Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location?.reload()}
                >
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold text-foreground">{mockRequests?.length}</p>
                  </div>
                  <Icon name="FileText" size={24} className="text-accent" />
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-warning">
                      {mockRequests?.filter(r => r?.status === 'pending' || r?.status === 'in_progress')?.length}
                    </p>
                  </div>
                  <Icon name="Clock" size={24} className="text-warning" />
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-success">
                      {mockRequests?.filter(r => r?.status === 'completed' || r?.status === 'approved')?.length}
                    </p>
                  </div>
                  <Icon name="CheckCircle" size={24} className="text-success" />
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Urgent</p>
                    <p className="text-2xl font-bold text-error">
                      {mockRequests?.filter(r => r?.priority === 'urgent' || r?.priority === 'high')?.length}
                    </p>
                  </div>
                  <Icon name="AlertTriangle" size={24} className="text-error" />
                </div>
              </div>
            </div>
          </div>

          {/* Three-Panel Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Search & Filter Panel (25%) */}
            <div className="w-1/4 min-w-80 border-r border-border">
              <SearchFilterPanel
                onFilterChange={handleFilterChange}
                savedSearches={savedSearches}
                onSaveSearch={handleSaveSearch}
                onLoadSearch={handleLoadSearch}
              />
            </div>

            {/* Request List Panel (45%) */}
            <div className="w-2/5 border-r border-border">
              <RequestListPanel
                requests={filteredRequests}
                selectedRequest={selectedRequest}
                onRequestSelect={handleRequestSelect}
                onBulkAction={handleBulkAction}
                userRole={user?.role?.toLowerCase()?.replace(' ', '_')}
              />
            </div>

            {/* Timeline Detail Panel (30%) */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <TimelineDetailPanel
                  request={selectedRequest}
                  onAddComment={handleAddComment}
                  onDownloadDocument={handleDownloadDocument}
                  userRole={user?.role?.toLowerCase()?.replace(' ', '_')}
                />
              </div>
              
              {/* Integration Status Panel */}
              <div className="p-4 border-t border-border">
                <IntegrationStatusPanel
                  onRefresh={() => window.location?.reload()}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestStatusTracking;