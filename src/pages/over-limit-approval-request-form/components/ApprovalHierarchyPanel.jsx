import React from 'react';
import Icon from '../../../components/AppIcon';

const ApprovalHierarchyPanel = ({ selectedAmount, currency, requestType }) => {
  const thresholds = [
    {
      level: 1,
      title: "Branch Level",
      range: "Up to $50,000",
      approvers: ["Teller Supervisor", "Deputy Branch Manager"],
      timeframe: "2-4 hours",
      color: "bg-success/10 text-success border-success/20"
    },
    {
      level: 2,
      title: "Regional Level", 
      range: "$50,001 - $200,000",
      approvers: ["Branch Manager", "Regional Manager"],
      timeframe: "4-8 hours",
      color: "bg-warning/10 text-warning border-warning/20"
    },
    {
      level: 3,
      title: "Head Office Level",
      range: "$200,001 - $500,000", 
      approvers: ["Head of Banking Operations", "CBSO"],
      timeframe: "1-2 business days",
      color: "bg-error/10 text-error border-error/20"
    },
    {
      level: 4,
      title: "Executive Level",
      range: "Above $500,000",
      approvers: ["CEO", "Board Approval"],
      timeframe: "2-5 business days",
      color: "bg-accent/10 text-accent border-accent/20"
    }
  ];

  const getCurrentThreshold = () => {
    const amount = parseFloat(selectedAmount) || 0;
    if (amount <= 50000) return thresholds?.[0];
    if (amount <= 200000) return thresholds?.[1];
    if (amount <= 500000) return thresholds?.[2];
    return thresholds?.[3];
  };

  const currentThreshold = getCurrentThreshold();

  const approvalChain = [
    {
      step: 1,
      role: "Requester",
      name: "Current User",
      status: "active",
      timestamp: "Now"
    },
    {
      step: 2,
      role: "Teller Supervisor",
      name: "Sarah Chen",
      status: "pending",
      timestamp: "Pending"
    },
    {
      step: 3,
      role: "Deputy Branch Manager",
      name: "Michael Rodriguez",
      status: "pending",
      timestamp: "Pending"
    },
    {
      step: 4,
      role: "Branch Manager",
      name: "David Kim",
      status: selectedAmount > 50000 ? "pending" : "not_required",
      timestamp: selectedAmount > 50000 ? "Pending" : "Not Required"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Approval Hierarchy Visualization */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="GitBranch" size={20} className="mr-2" />
          Approval Chain
        </h3>
        
        <div className="space-y-3">
          {approvalChain?.map((step, index) => (
            <div key={step?.step} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step?.status === 'active' ? 'bg-primary text-primary-foreground' :
                step?.status === 'pending' ? 'bg-warning text-warning-foreground' :
                step?.status === 'approved' ? 'bg-success text-success-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                {step?.status === 'approved' ? (
                  <Icon name="Check" size={14} />
                ) : step?.status === 'active' ? (
                  <Icon name="User" size={14} />
                ) : step?.status === 'not_required' ? (
                  <Icon name="Minus" size={14} />
                ) : (
                  step?.step
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{step?.role}</p>
                    <p className="text-xs text-muted-foreground">{step?.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    step?.status === 'active' ? 'bg-primary/10 text-primary' :
                    step?.status === 'pending' ? 'bg-warning/10 text-warning' :
                    step?.status === 'approved'? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step?.timestamp}
                  </span>
                </div>
              </div>
              
              {index < approvalChain?.length - 1 && step?.status !== 'not_required' && (
                <div className="absolute left-4 mt-8 w-0.5 h-6 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Threshold Reference Table */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="DollarSign" size={20} className="mr-2" />
          Approval Thresholds
        </h3>
        
        <div className="space-y-2">
          {thresholds?.map((threshold) => (
            <div
              key={threshold?.level}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                threshold?.level === currentThreshold?.level 
                  ? currentThreshold?.color + 'border-2' :'bg-muted/30 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{threshold?.title}</h4>
                <span className="text-xs font-mono">{threshold?.range}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Icon name="Users" size={12} className="mr-1" />
                  {threshold?.approvers?.join(", ")}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} className="mr-1" />
                  {threshold?.timeframe}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Current Request Summary */}
      {selectedAmount && (
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="FileText" size={20} className="mr-2" />
            Request Summary
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-mono font-medium">
                {currency} {parseFloat(selectedAmount)?.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Approval Level:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentThreshold?.color}`}>
                {currentThreshold?.title}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Est. Processing:</span>
              <span className="text-sm font-medium">{currentThreshold?.timeframe}</span>
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-xs text-muted-foreground">
                  High-value transaction requires additional documentation
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalHierarchyPanel;