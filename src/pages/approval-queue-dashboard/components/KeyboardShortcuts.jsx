import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KeyboardShortcuts = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { key: 'j', description: 'Move down in list' },
        { key: 'k', description: 'Move up in list' },
        { key: 'Enter', description: 'Open selected request' },
        { key: 'Esc', description: 'Close detail panel' },
        { key: '/', description: 'Focus search' }
      ]
    },
    {
      category: 'Actions',
      items: [
        { key: 'a', description: 'Approve selected request' },
        { key: 'r', description: 'Reject selected request' },
        { key: 'd', description: 'Delegate selected request' },
        { key: 'c', description: 'Add comment' },
        { key: 'x', description: 'Select/deselect request' }
      ]
    },
    {
      category: 'Bulk Operations',
      items: [
        { key: 'Ctrl + a', description: 'Select all visible requests' },
        { key: 'Ctrl + Shift + a', description: 'Bulk approve selected' },
        { key: 'Ctrl + Shift + r', description: 'Bulk reject selected' },
        { key: 'Ctrl + Shift + d', description: 'Bulk delegate selected' },
        { key: 'Ctrl + Shift + x', description: 'Clear selection' }
      ]
    },
    {
      category: 'Filters',
      items: [
        { key: 'f', description: 'Toggle advanced filters' },
        { key: '1-5', description: 'Quick filter by priority' },
        { key: 'Ctrl + f', description: 'Save current filter preset' },
        { key: 'Ctrl + r', description: 'Reset all filters' }
      ]
    },
    {
      category: 'View',
      items: [
        { key: 'v', description: 'Toggle detail panel' },
        { key: 'Ctrl + +', description: 'Increase font size' },
        { key: 'Ctrl + -', description: 'Decrease font size' },
        { key: 'Ctrl + 0', description: 'Reset font size' },
        { key: '?', description: 'Show/hide shortcuts' }
      ]
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={`bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-hidden transition-all duration-150 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Keyboard" size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Keyboard Shortcuts</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortcuts?.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  {category?.category}
                </h3>
                <div className="space-y-3">
                  {category?.items?.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{shortcut?.description}</span>
                      <div className="flex items-center space-x-1">
                        {shortcut?.key?.split(' + ')?.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            {keyIndex > 0 && (
                              <span className="text-xs text-muted-foreground">+</span>
                            )}
                            <kbd className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs font-mono rounded border border-border">
                              {key}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">?</kbd> anytime to toggle this help</span>
          </div>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;