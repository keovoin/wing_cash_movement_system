import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') return 'CheckCircle2';
    return step?.icon || 'Circle';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Form Progress</h3>
        <span className="text-xs text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
      <div className="space-y-4">
        {steps?.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                status === 'completed' 
                  ? 'bg-success text-success-foreground' 
                  : status === 'current' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
              }`}>
                <Icon 
                  name={getStepIcon(step, status)} 
                  size={16} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step?.description}
                </p>
              </div>
              {status === 'completed' && (
                <Icon name="Check" size={16} className="text-success" />
              )}
            </div>
          );
        })}
      </div>
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;