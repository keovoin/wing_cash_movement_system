import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const users = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@wingbank.com",
      role: "Branch Manager",
      branch: "Phnom Penh Central",
      status: "active",
      lastLogin: "2025-01-13 07:30:00",
      adSync: true,
      permissions: ["approve_transfers", "manage_staff", "view_reports"]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      email: "michael.rodriguez@wingbank.com",
      role: "Teller Supervisor",
      branch: "Siem Reap",
      status: "active",
      lastLogin: "2025-01-13 08:15:00",
      adSync: true,
      permissions: ["create_requests", "view_status"]
    },
    {
      id: 3,
      name: "Sophea Phan",
      email: "sophea.phan@wingbank.com",
      role: "CMC Supervisor",
      branch: "Cash Management Center",
      status: "inactive",
      lastLogin: "2025-01-10 16:45:00",
      adSync: false,
      permissions: ["approve_cmc", "bulk_operations", "system_config"]
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@wingbank.com",
      role: "Banking Operations",
      branch: "Head Office",
      status: "active",
      lastLogin: "2025-01-13 08:00:00",
      adSync: true,
      permissions: ["full_admin", "user_management", "system_config"]
    }
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'Branch Manager', label: 'Branch Manager' },
    { value: 'Teller Supervisor', label: 'Teller Supervisor' },
    { value: 'CMC Supervisor', label: 'CMC Supervisor' },
    { value: 'Banking Operations', label: 'Banking Operations' }
  ];

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesRole = selectedRole === 'all' || user?.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    setSelectedUsers([]);
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-success/10 text-success',
      inactive: 'bg-error/10 text-error',
      pending: 'bg-warning/10 text-warning'
    };
    return `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors?.[status] || 'bg-muted text-muted-foreground'}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-80"
          />
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Filter by role"
            className="w-48"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Export users')}
          >
            Export
          </Button>
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={() => console.log('Sync AD')}
          >
            Sync AD
          </Button>
          <Button
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowAddUser(true)}
          >
            Add User
          </Button>
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedUsers?.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-sm font-medium text-primary">
            {selectedUsers?.length} user{selectedUsers?.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('activate')}
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('deactivate')}
            >
              Deactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('reset_password')}
            >
              Reset Password
            </Button>
          </div>
        </div>
      )}
      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-12 p-4">
                  <Checkbox
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    indeterminate={selectedUsers?.length > 0 && selectedUsers?.length < filteredUsers?.length}
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        setSelectedUsers(filteredUsers?.map(u => u?.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left p-4 text-sm font-medium text-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Role & Branch</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">Last Login</th>
                <th className="text-left p-4 text-sm font-medium text-foreground">AD Sync</th>
                <th className="text-right p-4 text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-muted/30 transition-colors duration-150">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => handleUserSelect(user?.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {user?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.role}</p>
                      <p className="text-xs text-muted-foreground">{user?.branch}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={getStatusBadge(user?.status)}>
                      {user?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground font-mono">
                      {new Date(user.lastLogin)?.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {new Date(user.lastLogin)?.toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user?.adSync ? 'bg-success' : 'bg-error'}`} />
                      <span className="text-xs text-muted-foreground">
                        {user?.adSync ? 'Synced' : 'Manual'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => setEditingUser(user)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Key"
                        onClick={() => console.log('Reset password', user?.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreHorizontal"
                        onClick={() => console.log('More actions', user?.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{users?.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="UserCheck" size={20} className="text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {users?.filter(u => u?.status === 'active')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {users?.filter(u => u?.adSync)?.length}
              </p>
              <p className="text-sm text-muted-foreground">AD Synced</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {users?.filter(u => {
                  const lastLogin = new Date(u.lastLogin);
                  const today = new Date();
                  return (today - lastLogin) / (1000 * 60 * 60 * 24) <= 1;
                })?.length}
              </p>
              <p className="text-sm text-muted-foreground">Active Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementTab;