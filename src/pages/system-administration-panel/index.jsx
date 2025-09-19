import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserManagementTab from './components/UserManagementTab';
import RoleConfigurationTab from './components/RoleConfigurationTab';
import WorkflowSettingsTab from './components/WorkflowSettingsTab';
import SystemIntegrationTab from './components/SystemIntegrationTab';
import AuditControlsTab from './components/AuditControlsTab';
import BranchManagementTab from './components/BranchManagementTab'; // <-- IMPORT NEW COMPONENT

const SystemAdministrationPanel = () => {
 const [activeTab, setActiveTab] = useState('user_management');
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

 const adminTabs = [
   {
     id: 'user_management',
     label: 'User Management',
     icon: 'Users',
     description: 'Manage user accounts, roles, and permissions',
     component: UserManagementTab
   },
   // --- ADDED NEW BRANCH MANAGEMENT TAB ---
   {
     id: 'branch_management',
     label: 'Branch Management',
     icon: 'Building2',
     description: 'Add, edit, or disable bank branches',
     component: BranchManagementTab,
   },
   {
     id: 'role_configuration',
     label: 'Role Configuration',
     icon: 'Shield',
     description: 'Configure user roles and permission matrices',
     component: RoleConfigurationTab
   },
   {
     id: 'workflow_settings',
     label: 'Workflow Settings',
     icon: 'GitBranch',
     description: 'Configure approval workflows and thresholds',
     component: WorkflowSettingsTab
   },
   {
     id: 'system_integration',
     label: 'System Integration',
     icon: 'Zap',
     description: 'Monitor and manage external system connections',
     component: SystemIntegrationTab
   },
   {
     id: 'audit_controls',
     label: 'Audit Controls',
     icon: 'FileText',
     description: 'Audit trails and compliance monitoring',
     component: AuditControlsTab
   }
 ];

 const activeTabData = adminTabs.find(tab => tab.id === activeTab);
 const ActiveComponent = activeTabData?.component;

 // ... (rest of the component remains the same)

 return (
   <div className="min-h-screen bg-background">
     {/* Header */}
     <div className="bg-card border-b border-border">
       <div className="px-6 py-4">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                 <Icon name="Settings" size={24} />
               </div>
               <div>
                 <h1 className="text-2xl font-bold text-foreground">System Administration</h1>
                 <p className="text-sm text-muted-foreground">
                   Comprehensive system management and configuration
                 </p>
               </div>
             </div>
           </div>
           <div className="flex items-center space-x-2">
             <Button
               variant="outline"
               iconName="RefreshCw"
               iconPosition="left"
               onClick={() => console.log('Refresh system status')}
             >
               Refresh
             </Button>
             <Button
               variant="outline"
               iconName="Download"
               iconPosition="left"
               onClick={() => console.log('Export system report')}
             >
               Export Report
             </Button>
           </div>
         </div>
       </div>
     </div>
     
     <div className="flex">
       {/* Sidebar Navigation */}
       <div className={`bg-card border-r border-border transition-all duration-300 ${
         sidebarCollapsed ? 'w-16' : 'w-80'
       }`}>
         <div className="p-4 border-b border-border">
           <div className="flex items-center justify-between">
             {!sidebarCollapsed && (
               <h3 className="text-sm font-semibold text-foreground">Administration Modules</h3>
             )}
             <Button
               variant="ghost"
               size="sm"
               onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
             >
               <Icon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
             </Button>
           </div>
         </div>
         
         <nav className="p-2">
           {adminTabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-150 mb-1 ${
                 activeTab === tab.id
                   ? 'bg-primary text-primary-foreground shadow-sm'
                   : 'text-muted-foreground hover:text-foreground hover:bg-muted'
               }`}
               title={sidebarCollapsed ? tab.label : undefined}
             >
               <Icon name={tab.icon} size={20} />
               {!sidebarCollapsed && (
                 <div className="min-w-0 flex-1">
                   <p className="text-sm font-medium">{tab.label}</p>
                   <p className="text-xs opacity-75 line-clamp-2">{tab.description}</p>
                 </div>
               )}
             </button>
           ))}
         </nav>
       </div>

       {/* Main Content */}
       <div className="flex-1 min-h-screen p-6">
         <div className="mb-6">
           <div className="flex items-center space-x-3 mb-2">
             <Icon name={activeTabData?.icon} size={24} className="text-primary" />
             <h2 className="text-xl font-semibold text-foreground">{activeTabData?.label}</h2>
           </div>
           <p className="text-sm text-muted-foreground">{activeTabData?.description}</p>
         </div>
         <div className="bg-background">
           {ActiveComponent && <ActiveComponent />}
         </div>
       </div>
     </div>
   </div>
 );
};

export default SystemAdministrationPanel;
