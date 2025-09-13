import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentAttachmentSection = ({ attachments = [], onAttachmentsChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const allowedFileTypes = {
    'application/pdf': { ext: 'PDF', icon: 'FileText', color: 'text-error' },
    'image/jpeg': { ext: 'JPG', icon: 'Image', color: 'text-success' },
    'image/png': { ext: 'PNG', icon: 'Image', color: 'text-success' },
    'image/jpg': { ext: 'JPG', icon: 'Image', color: 'text-success' },
    'application/msword': { ext: 'DOC', icon: 'FileText', color: 'text-accent' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'DOCX', icon: 'FileText', color: 'text-accent' }
  };

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 10;

  const requiredDocuments = [
    {
      id: 'customer_id',
      name: 'Customer ID Copy',
      description: 'Valid government-issued identification',
      required: true,
      status: attachments?.some(att => att?.category === 'customer_id') ? 'uploaded' : 'pending'
    },
    {
      id: 'transaction_form',
      name: 'Transaction Request Form',
      description: 'Completed and signed transaction form',
      required: true,
      status: attachments?.some(att => att?.category === 'transaction_form') ? 'uploaded' : 'pending'
    },
    {
      id: 'supporting_docs',
      name: 'Supporting Documentation',
      description: 'Business justification, contracts, invoices',
      required: false,
      status: attachments?.some(att => att?.category === 'supporting_docs') ? 'uploaded' : 'optional'
    },
    {
      id: 'compliance_cert',
      name: 'Compliance Certificate',
      description: 'AML/KYC compliance documentation',
      required: true,
      status: attachments?.some(att => att?.category === 'compliance_cert') ? 'uploaded' : 'pending'
    }
  ];

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(Array.from(e?.dataTransfer?.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(Array.from(e?.target?.files));
    }
  };

  const handleFiles = (files) => {
    if (attachments?.length + files?.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = files?.filter(file => {
      if (!allowedFileTypes?.[file?.type]) {
        alert(`File type ${file?.type} not allowed`);
        return false;
      }
      if (file?.size > maxFileSize) {
        alert(`File ${file?.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    validFiles?.forEach(file => {
      const fileId = Date.now() + Math.random();
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev?.[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 100);

      // Create file object
      const newAttachment = {
        id: fileId,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        category: 'supporting_docs',
        uploadDate: new Date()?.toISOString(),
        status: 'uploading',
        encrypted: true,
        virus_scanned: false
      };

      // Simulate upload completion
      setTimeout(() => {
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated?.[fileId];
          return updated;
        });

        const completedAttachment = {
          ...newAttachment,
          status: 'uploaded',
          virus_scanned: true,
          url: URL.createObjectURL(file)
        };

        onAttachmentsChange([...attachments, completedAttachment]);
      }, 1200);
    });
  };

  const removeAttachment = (attachmentId) => {
    const updatedAttachments = attachments?.filter(att => att?.id !== attachmentId);
    onAttachmentsChange(updatedAttachments);
  };

  const updateAttachmentCategory = (attachmentId, category) => {
    const updatedAttachments = attachments?.map(att => 
      att?.id === attachmentId ? { ...att, category } : att
    );
    onAttachmentsChange(updatedAttachments);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileTypeInfo = (type) => {
    return allowedFileTypes?.[type] || { ext: 'FILE', icon: 'File', color: 'text-muted-foreground' };
  };

  return (
    <div className="space-y-6">
      {/* Document Requirements Checklist */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CheckSquare" size={20} className="mr-2" />
          Required Documents
        </h3>
        
        <div className="space-y-3">
          {requiredDocuments?.map((doc) => (
            <div key={doc?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  doc?.status === 'uploaded' ? 'bg-success text-success-foreground' :
                  doc?.status === 'pending' ? 'bg-warning text-warning-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {doc?.status === 'uploaded' ? (
                    <Icon name="Check" size={14} />
                  ) : doc?.status === 'pending' ? (
                    <Icon name="Clock" size={14} />
                  ) : (
                    <Icon name="Minus" size={14} />
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center">
                    {doc?.name}
                    {doc?.required && (
                      <span className="ml-2 text-xs text-error">*</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc?.description}</p>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                doc?.status === 'uploaded' ? 'bg-success/10 text-success' :
                doc?.status === 'pending'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
              }`}>
                {doc?.status === 'uploaded' ? 'Uploaded' :
                 doc?.status === 'pending' ? 'Required' : 'Optional'}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* File Upload Area */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Upload" size={20} className="mr-2" />
          Upload Documents
        </h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragActive 
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Icon name="Upload" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">
            Drop files here or click to upload
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, JPG, PNG, DOC, DOCX up to 10MB each
          </p>
          
          <Button
            variant="outline"
            onClick={() => fileInputRef?.current?.click()}
            iconName="FolderOpen"
            iconPosition="left"
          >
            Choose Files
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="mt-4 text-xs text-muted-foreground">
            Maximum {maxFiles} files • {attachments?.length}/{maxFiles} uploaded
          </div>
        </div>
      </div>
      {/* Uploaded Files List */}
      {attachments?.length > 0 && (
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Files" size={20} className="mr-2" />
            Uploaded Files ({attachments?.length})
          </h3>
          
          <div className="space-y-3">
            {attachments?.map((attachment) => {
              const fileInfo = getFileTypeInfo(attachment?.type);
              const progress = uploadProgress?.[attachment?.id];
              
              return (
                <div key={attachment?.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-muted ${fileInfo?.color}`}>
                    <Icon name={fileInfo?.icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {attachment?.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        {attachment?.encrypted && (
                          <Icon name="Lock" size={14} className="text-success" title="Encrypted" />
                        )}
                        {attachment?.virus_scanned && (
                          <Icon name="Shield" size={14} className="text-success" title="Virus Scanned" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(attachment?.size)}</span>
                        <span>{fileInfo?.ext}</span>
                        <span>
                          {new Date(attachment.uploadDate)?.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <select
                        value={attachment?.category}
                        onChange={(e) => updateAttachmentCategory(attachment?.id, e?.target?.value)}
                        className="text-xs border border-border rounded px-2 py-1 bg-background"
                      >
                        <option value="customer_id">Customer ID</option>
                        <option value="transaction_form">Transaction Form</option>
                        <option value="supporting_docs">Supporting Docs</option>
                        <option value="compliance_cert">Compliance Cert</option>
                      </select>
                    </div>
                    
                    {progress !== undefined && (
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploading... {progress}%
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(attachment?.url, '_blank')}
                      disabled={attachment?.status === 'uploading'}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment?.id)}
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Security Notice */}
      <div className="bg-muted/30 rounded-lg border border-accent/20 p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">
              Document Security
            </h4>
            <p className="text-xs text-muted-foreground">
              All uploaded documents are automatically encrypted and virus-scanned. 
              Files are stored securely and will be permanently deleted after the retention period. 
              Only authorized personnel can access these documents during the approval process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAttachmentSection;