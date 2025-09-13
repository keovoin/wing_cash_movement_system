import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const WorkflowSettingsTab = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState('cash_transfer');
  const [showAddWorkflow, setShowAddWorkflow] = useState(false);

  const workflows = [
    {
      id: 'cash_transfer',
      name: 'Cash Transfer Request',
      description: 'Standard cash transfer approval workflow',
      status: 'active',
      steps: [
        { id: 1, role: 'Teller Supervisor', action: 'Submit', required: true },
        { id: 2, role: 'Branch Manager', action: 'Review & Approve', required: true },
        { id: 3, role: 'CMC Supervisor', action: 'Final Approval', required: true, condition: 'amount > 50000' }
      ],
      thresholds: [
        { currency: 'USD', amount: 10000, level: 'Branch Manager' },
        { currency: 'USD', amount: 50000, level: 'CMC Supervisor' },
        { currency: 'KHR', amount: 40000000, level: 'Branch Manager' },
        { currency: 'KHR', amount: 200000000, level: 'CMC Supervisor' }
      ]
    },
    {
      id: 'over_limit',
      name: 'Over-Limit Approval',
      description: 'High-value transaction approval workflow',
      status: 'active',
      steps: [
        { id: 1, role: 'Branch Manager', action: 'Submit Request', required: true },
        { id: 2, role: 'CMC Supervisor', action: 'Risk Assessment', required: true },
        { id: 3, role: 'Head of Operations', action: 'Final Approval', required: true },
        { id: 4, role: 'CBSO', action: 'Executive Approval', required: false, condition: 'amount > 1000000' }
      ],
      thresholds: [
        { currency: 'USD', amount: 100000, level: 'CMC Supervisor' },
        { currency: 'USD', amount: 500000, level: 'Head of Operations' },
        { currency: 'USD', amount: 1000000, level: 'CBSO' }
      ]
    },
    {
      id: 'emergency',
      name: 'Emergency Override',
      description: 'Emergency cash movement workflow',
      status: 'active',
      steps: [
        { id: 1, role: 'Any Authorized User', action: 'Emergency Request', required: true },
        { id: 2, role: 'Branch Manager', action: 'Immediate Review', required: true },
        { id: 3, role: 'Head of Operations', action: 'Post-Approval Review', required: true }
      ],
      thresholds: [
        { currency: 'USD', amount: 25000, level: 'Branch Manager' },
        { currency: 'USD', amount: 100000, level: 'Head of Operations' }
      ]
    }
  ];

  const workflowOptions = workflows?.map(w => ({
    value: w?.id,
    label: w?.name
  }));

  const roleOptions = [
    { value: 'Teller Supervisor', label: 'Teller Supervisor' },
    { value: 'Branch Manager', label: 'Branch Manager' },
    { value: 'CMC Supervisor', label: 'CMC Supervisor' },
    { value: 'Head of Operations', label: 'Head of Operations' },
    { value: 'CBSO', label: 'CBSO' }
  ];

  const selectedWorkflowData = workflows?.find(w => w?.id === selectedWorkflow);

  const getStepIcon = (index, total) => {
    if (index === 0) return 'Play';
    if (index === total - 1) return 'CheckCircle';
    return 'ArrowRight';
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-error/10 text-error',
      draft: 'bg-warning/10 text-warning'
    };
    return `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors?.[status] || 'bg-muted text-muted-foreground'}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Workflow Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure approval workflows and thresholds
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Export workflow config')}
          >
            Export Config
          </Button>
          <Button
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowAddWorkflow(true)}
          >
            Add Workflow
          </Button>
        </div>
      </div>
      {/* Workflow Selection */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Select
            label="Select Workflow"
            options={workflowOptions}
            value={selectedWorkflow}
            onChange={setSelectedWorkflow}
            className="w-64"
          />
          <div className="flex items-center space-x-2">
            <span className={getStatusBadge(selectedWorkflowData?.status)}>
              {selectedWorkflowData?.status}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              onClick={() => console.log('Clone workflow')}
            >
              Clone
            </Button>
          </div>
        </div>
      </div>
      {selectedWorkflowData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workflow Steps */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h4 className="text-sm font-medium text-foreground">Approval Steps</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedWorkflowData?.description}
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {selectedWorkflowData?.steps?.map((step, index) => (
                  <div key={step?.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <Icon name={getStepIcon(index, selectedWorkflowData?.steps?.length)} size={16} />
                      </div>
                      {index < selectedWorkflowData?.steps?.length - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{step?.role}</p>
                        <div className="flex items-center space-x-2">
                          {step?.required && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-error/10 text-error">
                              Required
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Edit"
                            onClick={() => console.log('Edit step', step?.id)}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{step?.action}</p>
                      {step?.condition && (
                        <p className="text-xs text-accent mt-1 font-mono">
                          Condition: {step?.condition}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => console.log('Add step')}
                >
                  Add Step
                </Button>
              </div>
            </div>
          </div>

          {/* Approval Thresholds */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h4 className="text-sm font-medium text-foreground">Approval Thresholds</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Amount-based approval requirements
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {selectedWorkflowData?.thresholds?.map((threshold, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {threshold?.currency} {threshold?.amount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{threshold?.level}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => console.log('Edit threshold', index)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => console.log('Delete threshold', index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => console.log('Add threshold')}
                >
                  Add Threshold
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="GitBranch" size={20} className="text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{workflows?.length}</p>
              <p className="text-sm text-muted-foreground">Total Workflows</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {workflows?.filter(w => w?.status === 'active')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Active Workflows</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {selectedWorkflowData?.steps?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Approval Steps</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={20} className="text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {selectedWorkflowData?.thresholds?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Thresholds</p>
            </div>
          </div>
        </div>
      </div>
      {/* Workflow Impact Analysis */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-medium text-foreground">Impact Analysis</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Preview changes before applying to production
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Icon name="Clock" size={24} className="mx-auto text-warning mb-2" />
              <p className="text-sm font-medium text-foreground">Avg Processing Time</p>
              <p className="text-2xl font-bold text-foreground mt-1">2.5 hrs</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Icon name="TrendingUp" size={24} className="mx-auto text-success mb-2" />
              <p className="text-sm font-medium text-foreground">Approval Rate</p>
              <p className="text-2xl font-bold text-foreground mt-1">94.2%</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Icon name="AlertTriangle" size={24} className="mx-auto text-error mb-2" />
              <p className="text-sm font-medium text-foreground">Escalations</p>
              <p className="text-2xl font-bold text-foreground mt-1">5.8%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSettingsTab;