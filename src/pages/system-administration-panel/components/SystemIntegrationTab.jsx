import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemIntegrationTab = () => {
 const [selectedIntegration, setSelectedIntegration] = useState('active_directory');

 const integrations = [
   {
     id: 'active_directory',
     name: 'Active Directory',
     description: 'User authentication and authorization service',
     status: 'connected',
     lastSync: '2025-01-13 08:40:00',
     endpoint: 'ldap://ad.wingbank.internal:389',
     health: 99.2,
     responseTime: 89,
     dailyRequests: 2340,
     errorRate: 0.01,
     features: ['User Authentication', 'Role Management', 'Group Sync', 'Password Policy']
   },
   {
     id: 'email_gateway',
     name: 'Email Gateway',
     description: 'Notification and communication service',
     status: 'connected',
     lastSync: '2025-01-13 08:44:00',
     endpoint: 'smtp://mail.wingbank.com:587',
     health: 96.8,
     responseTime: 234,
     dailyRequests: 8760,
     errorRate: 0.05,
     features: ['Email Notifications', 'Approval Alerts', 'Status Updates', 'Reports']
   },
   {
     id: 'document_management',
     name: 'Document Management System',
     description: 'File storage and document processing service',
     status: 'warning',
     lastSync: '2025-01-13 07:30:00',
     endpoint: 'https://docs.wingbank.internal/api',
     health: 87.3,
     responseTime: 456,
     dailyRequests: 3240,
     errorRate: 0.12,
     features: ['File Upload', 'Document Storage', 'Version Control', 'Access Control']
   },
   {
     id: 'audit_system',
     name: 'Audit & Compliance System',
     description: 'Regulatory compliance and audit trail management',
     status: 'connected',
     lastSync: '2025-01-13 08:43:00',
     endpoint: 'https://audit.wingbank.internal/v1',
     health: 99.7,
     responseTime: 67,
     dailyRequests: 12580,
     errorRate: 0.003,
     features: ['Audit Logging', 'Compliance Reports', 'Risk Assessment', 'Regulatory Reporting']
   }
 ];

 const selectedIntegrationData = integrations.find(i => i.id === selectedIntegration);

 const getStatusBadge = (status) => {
   const colors = {
     connected: 'bg-success/10 text-success',
     warning: 'bg-warning/10 text-warning',
     error: 'bg-error/10 text-error',
     disconnected: 'bg-muted text-muted-foreground'
   };
   return `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-muted text-muted-foreground'}`;
 };

 const getStatusIcon = (status) => {
   switch (status) {
     case 'connected': return 'CheckCircle';
     case 'warning': return 'AlertTriangle';
     case 'error': return 'XCircle';
     case 'disconnected': return 'Circle';
     default: return 'Circle';
   }
 };

 const getHealthColor = (health) => {
   if (health >= 95) return 'text-success';
   if (health >= 85) return 'text-warning';
   return 'text-error';
 };

 return (
   <div className="space-y-6">
     {/* Header */}
     <div className="flex items-center justify-between">
       <div>
         <h3 className="text-lg font-semibold text-foreground">System Integration</h3>
         <p className="text-sm text-muted-foreground">
           Monitor and manage external system connections
         </p>
       </div>
       <div className="flex items-center space-x-2">
         <Button
           variant="outline"
           iconName="RefreshCw"
           iconPosition="left"
           onClick={() => console.log('Refresh all connections')}
         >
           Refresh All
         </Button>
         <Button
           iconName="Plus"
           iconPosition="left"
           onClick={() => console.log('Add integration')}
         >
           Add Integration
         </Button>
       </div>
     </div>
     {/* Integration Overview */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       <div className="bg-card border border-border rounded-lg p-4">
         <div className="flex items-center space-x-2">
           <Icon name="Zap" size={20} className="text-primary" />
           <div>
             <p className="text-2xl font-bold text-foreground">{integrations.length}</p>
             <p className="text-sm text-muted-foreground">Total Integrations</p>
           </div>
         </div>
       </div>
       <div className="bg-card border border-border rounded-lg p-4">
         <div className="flex items-center space-x-2">
           <Icon name="CheckCircle" size={20} className="text-success" />
           <div>
             <p className="text-2xl font-bold text-foreground">
               {integrations.filter(i => i.status === 'connected').length}
             </p>
             <p className="text-sm text-muted-foreground">Connected</p>
           </div>
         </div>
       </div>
       <div className="bg-card border border-border rounded-lg p-4">
         <div className="flex items-center space-x-2">
           <Icon name="AlertTriangle" size={20} className="text-warning" />
           <div>
             <p className="text-2xl font-bold text-foreground">
               {integrations.filter(i => i.status === 'warning').length}
             </p>
             <p className="text-sm text-muted-foreground">Warnings</p>
           </div>
         </div>
       </div>
       <div className="bg-card border border-border rounded-lg p-4">
         <div className="flex items-center space-x-2">
           <Icon name="Activity" size={20} className="text-accent" />
           <div>
             <p className="text-2xl font-bold text-foreground">
               {Math.round(integrations.reduce((acc, i) => acc + i.health, 0) / integrations.length)}%
             </p>
             <p className="text-sm text-muted-foreground">Avg Health</p>
           </div>
         </div>
       </div>
     </div>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* Integration List */}
       <div className="lg:col-span-1">
         <div className="bg-card border border-border rounded-lg">
           <div className="p-4 border-b border-border">
             <h4 className="text-sm font-medium text-foreground">Integrations</h4>
           </div>
           <div className="divide-y divide-border">
             {integrations.map((integration) => (
               <button
                 key={integration.id}
                 onClick={() => setSelectedIntegration(integration.id)}
                 className={`w-full p-4 text-left hover:bg-muted/50 transition-colors duration-150 ${
                   selectedIntegration === integration.id ? 'bg-primary/10 border-r-2 border-r-primary' : ''
                 }`}
               >
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center space-x-2">
                     <Icon name={getStatusIcon(integration.status)} size={16} className={
                       integration.status === 'connected' ? 'text-success' :
                       integration.status === 'warning' ? 'text-warning' :
                       integration.status === 'error' ? 'text-error' : 'text-muted-foreground'
                     } />
                     <p className="text-sm font-medium text-foreground">{integration.name}</p>
                   </div>
                   <span className={getStatusBadge(integration.status)}>
                     {integration.status}
                   </span>
                 </div>
                 <p className="text-xs text-muted-foreground line-clamp-2">
                   {integration.description}
                 </p>
                 <div className="flex items-center justify-between mt-2">
                   <span className={`text-xs font-medium ${getHealthColor(integration.health)}`}>
                     {integration.health}% health
                   </span>
                   <span className="text-xs text-muted-foreground">
                     {integration.responseTime}ms
                   </span>
                 </div>
               </button>
             ))}
           </div>
         </div>
       </div>

       {/* Integration Details */}
       <div className="lg:col-span-2">
         {selectedIntegrationData && (
           <div className="space-y-6">
             {/* Connection Status */}
             <div className="bg-card border border-border rounded-lg">
               <div className="p-4 border-b border-border">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <Icon name={getStatusIcon(selectedIntegrationData.status)} size={24} className={
                       selectedIntegrationData.status === 'connected' ? 'text-success' :
                       selectedIntegrationData.status === 'warning' ? 'text-warning' :
                       selectedIntegrationData.status === 'error' ? 'text-error' : 'text-muted-foreground'
                     } />
                     <div>
                       <h4 className="text-lg font-semibold text-foreground">
                         {selectedIntegrationData.name}
                       </h4>
                       <p className="text-sm text-muted-foreground">
                         {selectedIntegrationData.description}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Button
                       variant="outline"
                       size="sm"
                       iconName="TestTube"
                       onClick={() => console.log('Test connection')}
                     >
                       Test
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       iconName="Settings"
                       onClick={() => console.log('Configure')}
                     >
                       Configure
                     </Button>
                   </div>
                 </div>
               </div>
               <div className="p-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-xs text-muted-foreground">Endpoint</p>
                     <p className="text-sm font-mono text-foreground mt-1">
                       {selectedIntegrationData.endpoint}
                     </p>
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground">Last Sync</p>
                     <p className="text-sm text-foreground mt-1">
                       {new Date(selectedIntegrationData.lastSync).toLocaleString()}
                     </p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Performance Metrics */}
             <div className="bg-card border border-border rounded-lg">
               <div className="p-4 border-b border-border">
                 <h4 className="text-sm font-medium text-foreground">Performance Metrics</h4>
               </div>
               <div className="p-4">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="text-center">
                     <p className={`text-2xl font-bold ${getHealthColor(selectedIntegrationData.health)}`}>
                       {selectedIntegrationData.health}%
                     </p>
                     <p className="text-xs text-muted-foreground">Health Score</p>
                   </div>
                   <div className="text-center">
                     <p className="text-2xl font-bold text-foreground">
                       {selectedIntegrationData.responseTime}ms
                     </p>
                     <p className="text-xs text-muted-foreground">Avg Response</p>
                   </div>
                   <div className="text-center">
                     <p className="text-2xl font-bold text-foreground">
                       {selectedIntegrationData.dailyRequests.toLocaleString()}
                     </p>
                     <p className="text-xs text-muted-foreground">Daily Requests</p>
                   </div>
                   <div className="text-center">
                     <p className="text-2xl font-bold text-foreground">
                       {(selectedIntegrationData.errorRate * 100).toFixed(2)}%
                     </p>
                     <p className="text-xs text-muted-foreground">Error Rate</p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Features */}
             <div className="bg-card border border-border rounded-lg">
               <div className="p-4 border-b border-border">
                 <h4 className="text-sm font-medium text-foreground">Available Features</h4>
               </div>
               <div className="p-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {selectedIntegrationData.features.map((feature, index) => (
                     <div key={index} className="flex items-center space-x-3 p-2 rounded-lg border border-border">
                       <Icon name="CheckCircle" size={16} className="text-success" />
                       <span className="text-sm text-foreground">{feature}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 );
};

export default SystemIntegrationTab;
