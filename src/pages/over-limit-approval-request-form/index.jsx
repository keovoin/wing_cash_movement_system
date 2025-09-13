import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ApprovalHierarchyPanel from './components/ApprovalHierarchyPanel';
import RequestDetailsForm from './components/RequestDetailsForm';
import DocumentAttachmentSection from './components/DocumentAttachmentSection';
import IntegrationStatusPanel from './components/IntegrationStatusPanel';

const OverLimitApprovalRequestForm = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('request');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requestType: '',
    branch: '',
    currency: 'USD',
    amount: '',
    priority: 'normal',
    customerName: '',
    accountNumber: '',
    customerId: '',
    phoneNumber: '',
    transactionRef: '',
    effectiveDate: new Date()?.toISOString()?.split('T')?.[0],
    justification: '',
    riskChecks: {
      identityVerified: false,
      purposeDocumented: false,
      fundsVerified: false,
      noSuspiciousActivity: false,
      complianceMet: false
    },
    delegationAuthority: '',
    externalRef: '',
    internalNotes: '',
    rushProcessing: false,
    notifyCustomer: true
  });
  const [attachments, setAttachments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock user data
  const user = {
    name: "Sarah Chen",
    email: "sarah.chen@wingbank.com",
    role: "Teller Supervisor",
    department: "Branch Operations",
    status: "online"
  };

  // Mock notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Approval Request Pending",
        message: "Cash transfer request #CT-2024-1234 requires your approval",
        type: "approval",
        timestamp: new Date(Date.now() - 300000),
        read: false,
        metadata: {
          requestId: "CT-2024-1234",
          amount: "75,000",
          currency: "USD",
          priority: "high"
        }
      },
      {
        id: 2,
        title: "System Maintenance Notice",
        message: "Scheduled maintenance window tonight from 11 PM to 2 AM",
        type: "warning",
        timestamp: new Date(Date.now() - 1800000),
        read: false
      },
      {
        id: 3,
        title: "Request Approved",
        message: "Over-limit approval request #OLA-2024-5678 has been approved",
        type: "success",
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        metadata: {
          requestId: "OLA-2024-5678",
          amount: "150,000",
          currency: "USD"
        }
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const tabs = [
    {
      id: 'request',
      label: 'Request Details',
      icon: 'FileText',
      description: 'Enter transaction and customer information'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: 'Upload',
      description: 'Upload required supporting documents'
    },
    {
      id: 'hierarchy',
      label: 'Approval Chain',
      icon: 'GitBranch',
      description: 'View approval workflow and thresholds'
    },
    {
      id: 'integration',
      label: 'System Status',
      icon: 'Activity',
      description: 'Check integration and system health'
    }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Handle notification click - could navigate to specific page
    if (notification?.metadata?.requestId) {
      // Navigate to request details
      navigate('/request-status-tracking');
    }
  };

  const handleProfileClick = (action) => {
    console.log('Profile action:', action);
    switch (action) {
      case 'profile':
        // Navigate to profile settings
        break;
      case 'preferences':
        // Navigate to preferences
        break;
      case 'help':
        // Navigate to help center
        break;
      case 'logout':
        // Handle logout
        navigate('/');
        break;
      default:
        break;
    }
  };

  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleAttachmentsChange = (newAttachments) => {
    setAttachments(newAttachments);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData?.requestType) errors?.push('Request type is required');
    if (!formData?.branch) errors?.push('Branch selection is required');
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) errors?.push('Valid amount is required');
    if (!formData?.customerName) errors?.push('Customer name is required');
    if (!formData?.accountNumber) errors?.push('Account number is required');
    if (!formData?.customerId) errors?.push('Customer ID is required');
    if (!formData?.phoneNumber) errors?.push('Phone number is required');
    if (!formData?.justification || formData?.justification?.length < 50) {
      errors?.push('Business justification must be at least 50 characters');
    }
    
    // High-value transaction checks
    if (parseFloat(formData?.amount) > 200000) {
      const riskChecks = formData?.riskChecks;
      if (!riskChecks?.identityVerified) errors?.push('Identity verification required for high-value transactions');
      if (!riskChecks?.purposeDocumented) errors?.push('Transaction purpose documentation required');
      if (!riskChecks?.fundsVerified) errors?.push('Source of funds verification required');
      if (!riskChecks?.noSuspiciousActivity) errors?.push('Suspicious activity check required');
      if (!riskChecks?.complianceMet) errors?.push('Regulatory compliance confirmation required');
    }
    
    // Document requirements
    const requiredDocs = ['customer_id', 'transaction_form', 'compliance_cert'];
    const uploadedCategories = attachments?.map(att => att?.category);
    const missingDocs = requiredDocs?.filter(doc => !uploadedCategories?.includes(doc));
    
    if (missingDocs?.length > 0) {
      errors?.push(`Missing required documents: ${missingDocs?.join(', ')}`);
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    
    if (errors?.length > 0) {
      alert('Please fix the following errors:\n\n' + errors?.join('\n'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate request ID
      const requestId = `OLA-${new Date()?.getFullYear()}-${Date.now()?.toString()?.slice(-6)}`;
      
      console.log('Submitting over-limit approval request:', {
        requestId,
        formData,
        attachments: attachments?.length,
        submittedAt: new Date()?.toISOString()
      });
      
      // Show success message
      alert(`Over-limit approval request submitted successfully!\n\nRequest ID: ${requestId}\n\nYou will receive email notifications as your request progresses through the approval chain.`);
      
      // Navigate to status tracking
      navigate('/request-status-tracking');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'request':
        return (
          <RequestDetailsForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 'documents':
        return (
          <DocumentAttachmentSection
            attachments={attachments}
            onAttachmentsChange={handleAttachmentsChange}
          />
        );
      case 'hierarchy':
        return (
          <ApprovalHierarchyPanel
            selectedAmount={formData?.amount}
            currency={formData?.currency}
            requestType={formData?.requestType}
          />
        );
      case 'integration':
        return <IntegrationStatusPanel />;
      default:
        return null;
    }
  };

  const getCompletionStatus = () => {
    const totalSteps = 4;
    let completedSteps = 0;
    
    // Request details completion
    if (formData?.requestType && formData?.branch && formData?.amount && 
        formData?.customerName && formData?.accountNumber && formData?.justification) {
      completedSteps++;
    }
    
    // Documents completion
    const requiredDocs = ['customer_id', 'transaction_form', 'compliance_cert'];
    const uploadedCategories = attachments?.map(att => att?.category);
    if (requiredDocs?.every(doc => uploadedCategories?.includes(doc))) {
      completedSteps++;
    }
    
    // High-value risk checks (if applicable)
    if (parseFloat(formData?.amount) <= 200000 || 
        (formData?.riskChecks?.identityVerified && formData?.riskChecks?.purposeDocumented && 
         formData?.riskChecks?.fundsVerified && formData?.riskChecks?.noSuspiciousActivity && 
         formData?.riskChecks?.complianceMet)) {
      completedSteps++;
    }
    
    // Final review
    if (completedSteps >= 3) {
      completedSteps++;
    }
    
    return { completed: completedSteps, total: totalSteps };
  };

  const completionStatus = getCompletionStatus();
  const isFormComplete = completionStatus?.completed === completionStatus?.total;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        user={user}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        onMenuToggle={handleMobileMenuToggle}
      />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        user={user}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center">
                  <Icon name="AlertTriangle" size={28} className="mr-3 text-warning" />
                  Over-Limit Approval Request
                </h1>
                <p className="text-muted-foreground mt-1">
                  Submit requests for transactions exceeding predetermined limits
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    Progress: {completionStatus?.completed}/{completionStatus?.total}
                  </div>
                  <div className="w-32 bg-muted rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completionStatus?.completed / completionStatus?.total) * 100}%` }}
                    />
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/approval-queue-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Queue
                </Button>
              </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <a href="/approval-queue-dashboard" className="hover:text-foreground">
                Approval Queue
              </a>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Over-Limit Request</span>
            </nav>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Description */}
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                {tabs?.find(tab => tab?.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {getTabContent()}
            </div>

            {/* Right Sidebar - Context Panel */}
            <div className="xl:col-span-1">
              {activeTab === 'request' && (
                <ApprovalHierarchyPanel
                  selectedAmount={formData?.amount}
                  currency={formData?.currency}
                  requestType={formData?.requestType}
                />
              )}
              
              {activeTab === 'documents' && (
                <div className="bg-card rounded-lg border p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="Info" size={20} className="mr-2" />
                    Upload Guidelines
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground">File Requirements:</h4>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        <li>• Maximum 10MB per file</li>
                        <li>• PDF, JPG, PNG, DOC formats</li>
                        <li>• Clear, legible documents</li>
                        <li>• No password-protected files</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground">Security:</h4>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        <li>• Files are encrypted at rest</li>
                        <li>• Automatic virus scanning</li>
                        <li>• Audit trail maintained</li>
                        <li>• Secure deletion after retention</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {(activeTab === 'hierarchy' || activeTab === 'integration') && (
                <div className="bg-card rounded-lg border p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="HelpCircle" size={20} className="mr-2" />
                    Quick Help
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground">Need Assistance?</h4>
                      <p className="text-muted-foreground mt-1">
                        Contact the Banking Operations team for help with over-limit requests.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Icon name="Phone" size={16} className="mr-2" />
                        Call Support: +855 23 123 456
                      </Button>
                      
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Icon name="Mail" size={16} className="mr-2" />
                        Email: support@wingbank.com
                      </Button>
                      
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Icon name="MessageSquare" size={16} className="mr-2" />
                        Live Chat
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Action Bar */}
          {activeTab === 'request' && (
            <div className="fixed bottom-6 right-6 bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">Ready to Submit?</h4>
                <div className={`w-3 h-3 rounded-full ${
                  isFormComplete ? 'bg-success' : 'bg-warning'
                }`} />
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {isFormComplete 
                  ? 'All requirements met. You can submit your request.' :'Complete all required fields and upload documents to submit.'
                }
              </p>
              
              <Button
                onClick={handleSubmit}
                disabled={!isFormComplete || isSubmitting}
                loading={isSubmitting}
                className="w-full"
                iconName="Send"
                iconPosition="right"
              >
                Submit Request
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OverLimitApprovalRequestForm;