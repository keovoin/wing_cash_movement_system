import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileAttachmentSection = ({ 
  attachments, 
  onAttachmentsChange, 
  disabled = false,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return 'FileText';
    if (type?.startsWith('image/')) return 'Image';
    return 'File';
  };

  const getFileTypeColor = (type) => {
    if (type === 'application/pdf') return 'text-error';
    if (type?.startsWith('image/')) return 'text-accent';
    return 'text-muted-foreground';
  };

  const validateFile = (file) => {
    const errors = [];
    
    if (!allowedTypes?.includes(file?.type)) {
      errors?.push('File type not supported. Please use PDF, JPG, or PNG files.');
    }
    
    if (file?.size > maxFileSize) {
      errors?.push(`File size exceeds ${formatFileSize(maxFileSize)} limit.`);
    }
    
    if (attachments?.length >= maxFiles) {
      errors?.push(`Maximum ${maxFiles} files allowed.`);
    }
    
    return errors;
  };

  const simulateVirusScan = (fileId) => {
    return new Promise((resolve) => {
      // Simulate virus scanning delay
      setTimeout(() => {
        resolve({ clean: true, scannedAt: new Date() });
      }, 2000);
    });
  };

  const processFile = async (file) => {
    const fileId = Date.now() + Math.random();
    const errors = validateFile(file);
    
    if (errors?.length > 0) {
      return { success: false, errors };
    }

    // Create file object
    const fileObj = {
      id: fileId,
      name: file?.name,
      size: file?.size,
      type: file?.type,
      uploadedAt: new Date(),
      status: 'scanning',
      scanResult: null,
      url: URL.createObjectURL(file)
    };

    // Add to attachments immediately
    const newAttachments = [...attachments, fileObj];
    onAttachmentsChange(newAttachments);

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
    }

    // Simulate virus scan
    const scanResult = await simulateVirusScan(fileId);
    
    // Update file status
    const updatedAttachments = newAttachments?.map(att => 
      att?.id === fileId 
        ? { ...att, status: 'completed', scanResult }
        : att
    );
    
    onAttachmentsChange(updatedAttachments);
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress?.[fileId];
      return newProgress;
    });

    return { success: true };
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      await processFile(file);
    }
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e?.dataTransfer?.files;
    if (files && files?.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = e?.target?.files;
    if (files && files?.length > 0) {
      handleFiles(files);
    }
    // Reset input
    e.target.value = '';
  };

  const removeFile = (fileId) => {
    const updatedAttachments = attachments?.filter(att => att?.id !== fileId);
    onAttachmentsChange(updatedAttachments);
    
    // Clean up upload progress
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress?.[fileId];
      return newProgress;
    });
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef?.current) {
      fileInputRef?.current?.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Paperclip" size={20} className="text-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Supporting Documents</h3>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-primary bg-primary/5'
            : disabled
            ? 'border-muted bg-muted/30 cursor-not-allowed' :'border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedExtensions?.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Upload" size={24} className="text-muted-foreground" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              {dragActive ? 'Drop files here' : 'Upload supporting documents'}
            </p>
            <p className="text-xs text-muted-foreground">
              Drag and drop files or click to browse
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats: PDF, JPG, PNG</p>
            <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
            <p>Maximum {maxFiles} files allowed</p>
          </div>
        </div>
      </div>
      {/* File List */}
      {attachments?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Attached Files ({attachments?.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2">
            {attachments?.map((file) => (
              <div
                key={file?.id}
                className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg"
              >
                {/* File Icon */}
                <div className={`flex-shrink-0 ${getFileTypeColor(file?.type)}`}>
                  <Icon name={getFileIcon(file?.type)} size={20} />
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file?.name}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file?.size)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(file.uploadedAt)?.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex items-center space-x-2">
                  {file?.status === 'scanning' && (
                    <>
                      <Icon name="Shield" size={16} className="text-warning animate-pulse" />
                      <span className="text-xs text-warning">Scanning...</span>
                    </>
                  )}
                  
                  {uploadProgress?.[file?.id] !== undefined && (
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress?.[file?.id]}%` }}
                      />
                    </div>
                  )}
                  
                  {file?.status === 'completed' && file?.scanResult?.clean && (
                    <>
                      <Icon name="ShieldCheck" size={16} className="text-success" />
                      <span className="text-xs text-success">Clean</span>
                    </>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e?.stopPropagation();
                      window.open(file?.url, '_blank');
                    }}
                    disabled={file?.status !== 'completed'}
                    iconName="Eye"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e?.stopPropagation();
                      removeFile(file?.id);
                    }}
                    disabled={disabled}
                    iconName="Trash2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Document Requirements */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Required Documents</h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={14} />
            <span>End of Day (EOD) Report (if applicable)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={14} />
            <span>Cash Transfer Advice Form</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Image" size={14} />
            <span>ATM Cash Loading Forms (for ATM replenishment)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={14} />
            <span>Branch Manager Authorization (for high amounts)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileAttachmentSection;