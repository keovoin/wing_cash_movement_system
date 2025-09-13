import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { Checkbox } from '../../../components/ui/Checkbox';

const RoleConfigurationTab = () => {
  const [selectedRole, setSelectedRole] = useState('Branch Manager');
  const [showAddRole, setShowAddRole] = useState(false);

  const roles = [
    {
      id: 1,
      name: "Branch Manager",
      description: "Full branch operations management with approval authority",
      userCount: 15,
      permissions: [
        "approve_transfers", "manage_staff", "view_reports", "branch_config",
        "user_delegation", "audit_access", "emergency_override"
      ]
    },
    {
      id: 2,
      name: "Teller Supervisor",
      description: "Daily cash operations and staff supervision",
      userCount: 28,
      permissions: [
        "create_requests", "view_status", "staff_supervision", "daily_reports"
      ]
    },
    {
      id: 3,
      name: "CMC Supervisor",
      description: "Cash Management Center operations and approvals",
      userCount: 8,
      permissions: [
        "approve_cmc", "bulk_operations", "system_config", "integration_management",
        "advanced_reports", "workflow_config"
      ]
    },
    {
      id: 4,
      name: "Banking Operations",
      description: "System administration and operational oversight",
      userCount: 5,
      permissions: [
        "full_admin", "user_management", "system_config", "audit_management",
        "integration_config", "security_settings", "backup_restore"
      ]
    }
  ];

  const allPermissions = [
    {
      category: "Request Management",
      permissions: [
        { id: "create_requests", name: "Create Requests", description: "Submit new cash transfer requests" },
        { id: "approve_transfers", name: "Approve Transfers", description: "Approve cash transfer requests" },
        { id: "approve_cmc", name: "CMC Approvals", description: "Approve CMC-level requests" },
        { id: "bulk_operations", name: "Bulk Operations", description: "Process multiple requests simultaneously" }
      ]
    },
    {
      category: "User Management",
      permissions: [
        { id: "user_management", name: "User Management", description: "Create, edit, and manage user accounts" },
        { id: "manage_staff", name: "Staff Management", description: "Manage branch staff and assignments" },
        { id: "user_delegation", name: "User Delegation", description: "Set up delegation rules and backup staff" },
        { id: "staff_supervision", name: "Staff Supervision", description: "Monitor and supervise staff activities" }
      ]
    },
    {
      category: "System Configuration",
      permissions: [
        { id: "system_config", name: "System Configuration", description: "Configure system settings and parameters" },
        { id: "branch_config", name: "Branch Configuration", description: "Configure branch-specific settings" },
        { id: "workflow_config", name: "Workflow Configuration", description: "Configure approval workflows and rules" },
        { id: "integration_config", name: "Integration Configuration", description: "Manage system integrations" }
      ]
    },
    {
      category: "Reporting & Analytics",
      permissions: [
        { id: "view_reports", name: "View Reports", description: "Access standard reports and analytics" },
        { id: "daily_reports", name: "Daily Reports", description: "Generate and view daily operational reports" },
        { id: "advanced_reports", name: "Advanced Reports", description: "Access advanced analytics and custom reports" },
        { id: "audit_access", name: "Audit Access", description: "View audit trails and compliance reports" }
      ]
    },
    {
      category: "Administrative",
      permissions: [
        { id: "full_admin", name: "Full Administrator", description: "Complete system administrative access" },
        { id: "audit_management", name: "Audit Management", description: "Manage audit settings and compliance" },
        { id: "security_settings", name: "Security Settings", description: "Configure security policies and settings" },
        { id: "emergency_override", name: "Emergency Override", description: "Override system restrictions in emergencies" },
        { id: "backup_restore", name: "Backup & Restore", description: "Manage system backups and restoration" },
        { id: "integration_management", name: "Integration Management", description: "Monitor and manage system integrations" }
      ]
    }
  ];

  const selectedRoleData = roles?.find(role => role?.name === selectedRole);

  const hasPermission = (permissionId) => {
    return selectedRoleData?.permissions?.includes(permissionId) || false;
  };

  const togglePermission = (permissionId) => {
    console.log(`Toggle permission ${permissionId} for role ${selectedRole}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Role Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Manage user roles and permission assignments
          </p>
        </div>
        <Button
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowAddRole(true)}
        >
          Add Role
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h4 className="text-sm font-medium text-foreground">Available Roles</h4>
            </div>
            <div className="divide-y divide-border">
              {roles?.map((role) => (
                <button
                  key={role?.id}
                  onClick={() => setSelectedRole(role?.name)}
                  className={`w-full p-4 text-left hover:bg-muted/50 transition-colors duration-150 ${
                    selectedRole === role?.name ? 'bg-primary/10 border-r-2 border-r-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{role?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {role?.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{role?.userCount}</p>
                      <p className="text-xs text-muted-foreground">users</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    Permissions for {selectedRole}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedRoleData?.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Copy"
                    onClick={() => console.log('Clone role')}
                  >
                    Clone
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Save"
                    onClick={() => console.log('Save changes')}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {allPermissions?.map((category) => (
                <div key={category?.category}>
                  <h5 className="text-sm font-medium text-foreground mb-3 flex items-center">
                    <Icon name="Shield" size={16} className="mr-2 text-primary" />
                    {category?.category}
                  </h5>
                  <div className="grid grid-cols-1 gap-3">
                    {category?.permissions?.map((permission) => (
                      <div
                        key={permission?.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors duration-150"
                      >
                        <Checkbox
                          checked={hasPermission(permission?.id)}
                          onChange={() => togglePermission(permission?.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">
                              {permission?.name}
                            </p>
                            {hasPermission(permission?.id) && (
                              <Icon name="Check" size={16} className="text-success" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {permission?.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{roles?.length}</p>
              <p className="text-sm text-muted-foreground">Total Roles</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {allPermissions?.reduce((acc, cat) => acc + cat?.permissions?.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Permissions</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="UserCheck" size={20} className="text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {roles?.reduce((acc, role) => acc + role?.userCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Assigned Users</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={20} className="text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {selectedRoleData?.permissions?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Active Permissions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleConfigurationTab;