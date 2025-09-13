import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

// Import components
import RequestTypeSelector from './components/RequestTypeSelector';
import ProgressIndicator from './components/ProgressIndicator';
import BranchSelector from './components/BranchSelector';
import CurrencyAmountForm from './components/CurrencyAmountForm';
import ReasonDateForm from './components/ReasonDateForm';
import FileAttachmentSection from './components/FileAttachmentSection';
import ReviewSubmitSection from './components/ReviewSubmitSection';

const CashTransferRequestForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    requestType: '',
    branchCode: '',
    branchName: '',
    destinationBranch: '',
    currency: '',
    amount: '',
    denominations: {},
    reason: '',
    effectiveDate: '',
    priority: 'normal',
    attachments: []
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Mock user data
  const user = {
    name: "Sarah Chen",
    email: "sarah.chen@wingbank.com",
    role: "Teller Supervisor",
    department: "Branch Operations",
    branchCode: "BR001"
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Cash Transfer Approved",
      message: "Your request CTR20240913001 has been approved by Branch Manager",
      type: "success",
      read: false,
      timestamp: new Date(Date.now() - 300000),
      metadata: { requestId: "CTR20240913001", amount: "50,000", currency: "USD" }
    },
    {
      id: 2,
      title: "Pending Approval Required",
      message: "Over-limit request requires your approval",
      type: "approval",
      read: false,
      timestamp: new Date(Date.now() - 900000),
      metadata: { requestId: "OLR20240913002", amount: "150,000", currency: "USD", priority: "urgent" }
    }
  ];

  // Form steps configuration
  const steps = [
    {
      title: 'Request Type',
      description: 'Select transfer type',
      icon: 'FileText',
      component: 'requestType'
    },
    {
      title: 'Branch Details',
      description: 'Branch information',
      icon: 'Building2',
      component: 'branch'
    },
    {
      title: 'Amount & Currency',
      description: 'Transfer amount',
      icon: 'DollarSign',
      component: 'amount'
    },
    {
      title: 'Request Details',
      description: 'Reason and date',
      icon: 'Calendar',
      component: 'details'
    },
    {
      title: 'Attachments',
      description: 'Supporting documents',
      icon: 'Paperclip',
      component: 'attachments'
    },
    {
      title: 'Review & Submit',
      description: 'Final review',
      icon: 'CheckCircle2',
      component: 'review'
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (formData?.requestType && !isSubmitting) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [formData, isSubmitting]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('cashTransferDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        setLastSaved(new Date(draftData.savedAt));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const handleAutoSave = () => {
    const draftData = {
      ...formData,
      savedAt: new Date()?.toISOString(),
      status: 'draft'
    };
    
    localStorage.setItem('cashTransferDraft', JSON.stringify(draftData));
    setLastSaved(new Date());
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    
    switch (stepIndex) {
      case 0: // Request Type
        if (!formData?.requestType) {
          newErrors.requestType = 'Please select a request type';
        }
        break;
        
      case 1: // Branch Details
        if (!formData?.branchCode) {
          newErrors.branchCode = 'Please select a branch';
        }
        break;
        
      case 2: // Amount & Currency
        if (!formData?.currency) {
          newErrors.currency = 'Please select a currency';
        }
        if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
          newErrors.amount = 'Please enter a valid amount';
        }
        break;
        
      case 3: // Request Details
        if (!formData?.reason || formData?.reason?.length < 20) {
          newErrors.reason = 'Please provide a detailed reason (minimum 20 characters)';
        }
        if (!formData?.effectiveDate) {
          newErrors.effectiveDate = 'Please select an effective date';
        }
        if (!formData?.priority) {
          newErrors.priority = 'Please select a priority level';
        }
        break;
        
      case 4: // Attachments (optional but recommended)
        // No required validation for attachments
        break;
        
      case 5: // Review & Submit
        // Final validation happens in ReviewSubmitSection
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (stepIndex) => {
    // Allow clicking on completed steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleFormDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear related errors
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (requestData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear draft from localStorage
      localStorage.removeItem('cashTransferDraft');
      
      // Navigate to success page or status tracking
      navigate('/request-status-tracking', { 
        state: { 
          message: 'Cash transfer request submitted successfully',
          requestId: requestData?.requestId 
        }
      });
      
    } catch (error) {
      console.error('Submission error:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (draftData) => {
    setIsSavingDraft(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('cashTransferDraft', JSON.stringify(draftData));
      setLastSaved(new Date());
      
      // Simulate API call for server-side save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Save draft error:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handleProfileClick = (action) => {
    console.log('Profile action:', action);
  };

  const renderStepContent = () => {
    switch (steps?.[currentStep]?.component) {
      case 'requestType':
        return (
          <RequestTypeSelector
            selectedType={formData?.requestType}
            onTypeChange={(type) => handleFormDataChange('requestType', type)}
            disabled={isSubmitting}
          />
        );
        
      case 'branch':
        return (
          <BranchSelector
            selectedBranch={formData?.branchCode}
            onBranchChange={(branch) => {
              handleFormDataChange('branchCode', branch);
              // Auto-populate branch name (in real app, this would come from API)
              const branches = {
                'BR001': 'Phnom Penh Main Branch',
                'BR002': 'Siem Reap Branch',
                'BR003': 'Battambang Branch'
              };
              handleFormDataChange('branchName', branches?.[branch] || '');
            }}
            requestType={formData?.requestType}
            disabled={isSubmitting}
            error={errors?.branchCode}
          />
        );
        
      case 'amount':
        return (
          <CurrencyAmountForm
            currency={formData?.currency}
            onCurrencyChange={(currency) => handleFormDataChange('currency', currency)}
            amount={formData?.amount}
            onAmountChange={(amount) => handleFormDataChange('amount', amount)}
            denominations={formData?.denominations}
            onDenominationsChange={(denominations) => handleFormDataChange('denominations', denominations)}
            disabled={isSubmitting}
            errors={errors}
          />
        );
        
      case 'details':
        return (
          <ReasonDateForm
            reason={formData?.reason}
            onReasonChange={(reason) => handleFormDataChange('reason', reason)}
            effectiveDate={formData?.effectiveDate}
            onEffectiveDateChange={(date) => handleFormDataChange('effectiveDate', date)}
            priority={formData?.priority}
            onPriorityChange={(priority) => handleFormDataChange('priority', priority)}
            disabled={isSubmitting}
            errors={errors}
          />
        );
        
      case 'attachments':
        return (
          <FileAttachmentSection
            attachments={formData?.attachments}
            onAttachmentsChange={(attachments) => handleFormDataChange('attachments', attachments)}
            disabled={isSubmitting}
          />
        );
        
      case 'review':
        return (
          <ReviewSubmitSection
            formData={formData}
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
            isSavingDraft={isSavingDraft}
            disabled={isSubmitting}
          />
        );
        
      default:
        return <div>Step not found</div>;
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
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed || mobileMenuOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
      />
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      } pt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="ArrowRightLeft" size={24} className="text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Cash Transfer Request</h1>
            </div>
            <p className="text-muted-foreground">
              Submit a new cash transfer request with automated approval routing
            </p>
            
            {/* Auto-save indicator */}
            {lastSaved && (
              <div className="flex items-center space-x-2 mt-2">
                <Icon name="Save" size={14} className="text-success" />
                <span className="text-xs text-success">
                  Last saved: {lastSaved?.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Progress Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ProgressIndicator
                  currentStep={currentStep}
                  totalSteps={steps?.length}
                  steps={steps}
                />
                
                {/* Quick Actions */}
                <div className="mt-6 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/request-status-tracking')}
                    iconName="Search"
                    iconPosition="left"
                    fullWidth
                  >
                    Track Requests
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/approval-queue-dashboard')}
                    iconName="Clock"
                    iconPosition="left"
                    fullWidth
                  >
                    Approval Queue
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-8">
                {/* Step Content */}
                <div className="mb-8">
                  {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0 || isSubmitting}
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {steps?.length}
                    </span>
                  </div>

                  {currentStep < steps?.length - 1 ? (
                    <Button
                      variant="default"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next
                    </Button>
                  ) : (
                    (<div className="w-20" />) // Placeholder to maintain layout
                  )}
                </div>
              </div>

              {/* Keyboard Shortcuts Help */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Keyboard" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Keyboard Shortcuts</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd>
                    <span className="ml-2">Save Draft</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd>
                    <span className="ml-2">Next Field</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
                    <span className="ml-2">Next Step</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                    <span className="ml-2">Cancel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CashTransferRequestForm;