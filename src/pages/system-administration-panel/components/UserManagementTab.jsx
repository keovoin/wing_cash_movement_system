import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { saveToStorage, loadFromStorage } from '../../../utils/storage';

// Modal Component for Add/Edit User
const UserModal = ({ user, onSave, onCancel, roles, branches }) => {
   const [userData, setUserData] = useState(user || { name: '', email: '', password: '', role: '', branch: '', status: 'active' });

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
                   <Input label="Password" type="password" placeholder="Enter password" value={userData.password} onChange={(e) => handleChange('password', e.target.value)} />
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
 const [users, setUsers] = useState([]);
 const [branches, setBranches] = useState([]);
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedRole, setSelectedRole] = useState('all');
 const [showAddUser, setShowAddUser] = useState(false);
 const fileInputRef = React.useRef(null);

 useEffect(() => {
   setUsers(loadFromStorage('users') || []);
   setBranches(loadFromStorage('branches') || []);
 }, []);

 const handleSaveUser = (userData) => {
   const updatedUsers = [...users, { ...userData, id: Date.now(), lastLogin: new Date().toISOString() }];
   setUsers(updatedUsers);
   saveToStorage('users', updatedUsers);
   setShowAddUser(false);
 };

 const roleOptions = [
   { value: 'Branch Manager', label: 'Branch Manager' },
   { value: 'Teller Supervisor', label: 'Teller Supervisor' },
   { value: 'CMC Supervisor', label: 'CMC Supervisor' },
   { value: 'Banking Operations', label: 'Banking Operations' }
 ];

 const branchOptions = branches.map(b => ({ value: b.name, label: b.name }));

 const handleFileUpload = (event) => {
   const file = event.target.files[0];
   if (!file) return;

   const reader = new FileReader();
   reader.onload = (e) => {
       try {
           const data = new Uint8Array(e.target.result);
           const workbook = XLSX.read(data, { type: 'array' });
           const sheetName = workbook.SheetNames[0];
           const worksheet = workbook.Sheets[sheetName];
           const json = XLSX.utils.sheet_to_json(worksheet);

           // Basic validation
           if (json.length > 0 && ['Name', 'Email', 'Password', 'Role', 'Branch'].every(key => key in json[0])) {
               const newUsers = json.map(row => ({
                   id: Date.now() + Math.random(),
                   name: row.Name,
                   email: row.Email,
                   password: row.Password,
                   role: row.Role,
                   branch: row.Branch,
                   status: 'active',
                   lastLogin: new Date().toISOString()
               }));
               const updatedUsers = [...users, ...newUsers];
               setUsers(updatedUsers);
               saveToStorage('users', updatedUsers);
               alert(`${newUsers.length} users uploaded successfully!`);
           } else {
               alert("Invalid Excel template. Please make sure the columns are: Name, Email, Password, Role, Branch");
           }
       } catch (error) {
           console.error("Error parsing Excel file:", error);
           alert("There was an error processing your file. Please ensure it's a valid Excel file.");
       }
   };
   reader.readAsArrayBuffer(file);
   fileInputRef.current.value = ""; // Reset file input
 };
 
 const handleDownloadTemplate = () => {
   const ws = XLSX.utils.json_to_sheet([
       { Name: "John Doe", Email: "john.doe@example.com", Password: "password123", Role: "Teller Supervisor", Branch: "Phnom Penh Central" }
   ]);
   const wb = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, "Users");
   XLSX.writeFile(wb, "User_Upload_Template.xlsx");
 };

 const filteredUsers = users.filter(user => {
   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
   const matchesRole = selectedRole === 'all' || user.role === selectedRole;
   return matchesSearch && matchesRole;
 });

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
     <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
     <div className="flex items-center justify-between">
        {/* Search and filter inputs */}
       <div className="flex items-center space-x-2">
           <Button variant="outline" onClick={handleDownloadTemplate} iconName="Download" iconPosition="left">Template</Button>
           <Button variant="outline" onClick={() => fileInputRef.current.click()} iconName="Upload" iconPosition="left">Batch Upload</Button>
           <Button iconName="Plus" iconPosition="left" onClick={() => setShowAddUser(true)}>Add User</Button>
       </div>
     </div>
     
     {/* Users Table */}
     <div className="bg-card border border-border rounded-lg overflow-hidden">
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-muted/50 border-b border-border">
             <tr>
               <th className="p-4 text-left text-sm font-medium text-foreground">User</th>
               <th className="p-4 text-left text-sm font-medium text-foreground">Role & Branch</th>
               <th className="p-4 text-left text-sm font-medium text-foreground">Status</th>
               <th className="p-4 text-left text-sm font-medium text-foreground">Last Login</th>
               <th className="p-4 text-right text-sm font-medium text-foreground">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-border">
             {filteredUsers.length === 0 ? (
               <tr>
                 <td colSpan="5" className="text-center p-8 text-muted-foreground">
                   No users found. Click "Add User" or "Batch Upload" to get started.
                 </td>
               </tr>
             ) : (
               filteredUsers.map((user) => (
                 <tr key={user.id} className="hover:bg-muted/30">
                   <td className="p-4">
                       <p className="text-sm font-medium text-foreground">{user.name}</p>
                       <p className="text-xs text-muted-foreground">{user.email}</p>
                   </td>
                   <td className="p-4">
                       <p className="text-sm font-medium text-foreground">{user.role}</p>
                       <p className="text-xs text-muted-foreground">{user.branch}</p>
                   </td>
                   <td className="p-4">
                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>{user.status}</span>
                   </td>
                   <td className="p-4 text-sm text-muted-foreground">{new Date(user.lastLogin).toLocaleString()}</td>
                   <td className="p-4 text-right"><Button variant="ghost" size="sm" iconName="Edit" /></td>
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
