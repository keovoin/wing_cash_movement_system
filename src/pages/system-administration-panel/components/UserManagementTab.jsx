import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

// Modal Component for Add/Edit User
const UserModal = ({ user, onSave, onCancel, roles, branches }) => {
   const [userData, setUserData] = useState(user || { name: '', email: '', role: '', branch: '', status: 'active' });

   const handleChange = (field, value) => {
       setUserData(prev => ({ ...prev, [field]: value }));
   };

   return (
       <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
           <div className="bg-card border border-border rounded-lg p-6 w-full max-w-lg shadow-lg">
               <h3 className="text-lg font-semibold text-foreground mb-4">{user ? 'Edit User' : 'Add New User'}</h3>
               <div className="space-y-4">
                   <Input label="Full Name" placeholder="Enter user's full name" value={userData.name} onChange={(e) => handleChange('name', e.target.value)} />
                   <Input label="Email Address" type="email" placeholder="user@wingbank.com" value={userData.email} onChange={(e) => handleChange('email', e.target.value)} />
                   <Select label="Role" options={roles} value={userData.role} onChange={(value) => handleChange('role', value)} placeholder="Select a role" />
                   <Select label="Branch" options={branches} value={userData.branch} onChange={(value) => handleChange('branch', value)} placeholder="Assign a branch" />
               </div>
               <div className="flex justify-end space-x-2 mt-6">
                   <Button variant="outline" onClick={onCancel}>Cancel</Button>
                   <Button onClick={() => onSave(userData)}>Save User</Button>
               </div>
           </div>
       </div>
   );
};


const UserManagementTab = () => {
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedRole, setSelectedRole] = useState('all');
 const [selectedUsers, setSelectedUsers] = useState([]);
 const [showAddUser, setShowAddUser] = useState(false);
 const [editingUser, setEditingUser] = useState(null);
 const [users, setUsers] = useState([]); // Start with no users

 const roleOptions = [
   { value: 'Branch Manager', label: 'Branch Manager' },
   { value: 'Teller Supervisor', label: 'Teller Supervisor' },
   { value: 'CMC Supervisor', label: 'CMC Supervisor' },
   { value: 'Banking Operations', label: 'Banking Operations' }
 ];

 const branchOptions = [
     { value: 'Phnom Penh Central', label: 'Phnom Penh Central' },
     { value: 'Siem Reap', label: 'Siem Reap' },
     { value: 'Battambang', label: 'Battambang' },
     { value: 'Cash Management Center', label: 'Cash Management Center' },
     { value: 'Head Office', label: 'Head Office' }
 ];


 const handleSaveUser = (userData) => {
     setUsers(prevUsers => [...prevUsers, { ...userData, id: Date.now(), lastLogin: new Date().toISOString(), adSync: false }]);
     setShowAddUser(false);
 };


 const filteredUsers = users.filter(user => {
   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
   const matchesRole = selectedRole === 'all' || user.role === selectedRole;
   return matchesSearch && matchesRole;
 });

 const handleUserSelect = (userId) => {
   setSelectedUsers(prev => 
     prev.includes(userId) 
       ? prev.filter(id => id !== userId)
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
   return `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-muted text-muted-foreground'}`;
 };

 return (
   <div className="space-y-6">
     {showAddUser && (
         <UserModal 
             onSave={handleSaveUser} 
             onCancel={() => setShowAddUser(false)}
             roles={roleOptions}
             branches={branchOptions}
         />
     )}
     {/* Header Actions */}
     <div className="flex items-center justify-between">
       <div className="flex items-center space-x-4">
         <Input
           type="search"
           placeholder="Search users..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-80"
         />
         <Select
           options={[{ value: 'all', label: 'All Roles' }, ...roleOptions]}
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
     
     {/* Users Table */}
     <div className="bg-card border border-border rounded-lg overflow-hidden">
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-muted/50 border-b border-border">
             <tr>
               <th className="w-12 p-4">
                 <Checkbox
                   checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                   indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                   onChange={(e) => {
                     if (e.target.checked) {
                       setSelectedUsers(filteredUsers.map(u => u.id));
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
               <th className="text-right p-4 text-sm font-medium text-foreground">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-border">
             {filteredUsers.length === 0 ? (
               <tr>
                 <td colSpan="7" className="text-center p-8 text-muted-foreground">
                   No users found. Click "Add User" to get started.
                 </td>
               </tr>
             ) : (
               filteredUsers.map((user) => (
                 <tr key={user.id} className="hover:bg-muted/30 transition-colors duration-150">
                   <td className="p-4">
                     <Checkbox
                       checked={selectedUsers.includes(user.id)}
                       onChange={() => handleUserSelect(user.id)}
                     />
                   </td>
                   <td className="p-4">
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                         {user.name.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                         <p className="text-sm font-medium text-foreground">{user.name}</p>
                         <p className="text-xs text-muted-foreground">{user.email}</p>
                       </div>
                     </div>
                   </td>
                   <td className="p-4">
                     <div>
                       <p className="text-sm font-medium text-foreground">{user.role}</p>
                       <p className="text-xs text-muted-foreground">{user.branch}</p>
                     </div>
                   </td>
                   <td className="p-4">
                     <span className={getStatusBadge(user.status)}>
                       {user.status}
                     </span>
                   </td>
                   <td className="p-4">
                     <p className="text-sm text-foreground font-mono">
                       {new Date(user.lastLogin).toLocaleDateString()}
                     </p>
                     <p className="text-xs text-muted-foreground font-mono">
                       {new Date(user.lastLogin).toLocaleTimeString()}
                     </p>
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
                         iconName="Trash2"
                         onClick={() => console.log('Delete user', user.id)}
                       />
                     </div>
                   </td>
                 </tr>
               ))
             )}
           </tbody>
         </table>
       </div>
     </div>
   </div>
 );
};

export default UserManagementTab;
