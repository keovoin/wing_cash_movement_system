import React from 'react';
import Icon from '../../../components/AppIcon';

const RequestTypeSelector = ({ selectedType, onTypeChange, disabled = false }) => {
  const requestTypes = [
    {
      id: 'branch-to-cmc',
      title: 'Branch Request Cash from CMC',
      description: 'Request cash delivery from Cash Management Center to branch',
      icon: 'ArrowDown',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    },
    {
      id: 'branch-to-cmc-transfer',
      title: 'Branch Transfer Cash to CMC',
      description: 'Transfer excess cash from branch to Cash Management Center',
      icon: 'ArrowUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      id: 'branch-to-branch',
      title: 'Branch to Branch/Nostro Transfer',
      description: 'Transfer cash between branches or to Nostro account',
      icon: 'ArrowRightLeft',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="FileText" size={20} className="text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Request Type</h2>
      </div>
      <div className="space-y-3">
        {requestTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => !disabled && onTypeChange(type?.id)}
            disabled={disabled}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              selectedType === type?.id
                ? `${type?.borderColor} ${type?.bgColor} shadow-sm`
                : 'border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-md ${selectedType === type?.id ? type?.bgColor : 'bg-muted'}`}>
                <Icon 
                  name={type?.icon} 
                  size={20} 
                  className={selectedType === type?.id ? type?.color : 'text-muted-foreground'} 
                />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${
                  selectedType === type?.id ? 'text-foreground' : 'text-foreground'
                }`}>
                  {type?.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {type?.description}
                </p>
              </div>
              {selectedType === type?.id && (
                <Icon name="CheckCircle2" size={20} className={type?.color} />
              )}
            </div>
          </button>
        ))}
      </div>
      {selectedType && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">
              Selected: {requestTypes?.find(t => t?.id === selectedType)?.title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTypeSelector;