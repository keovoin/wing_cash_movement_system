import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const BranchManagementTab = () => {
 const [branches, setBranches] = useState([
   { id: 1, name: 'Phnom Penh Central', code: 'PP001', region: 'Phnom Penh', status: 'active' },
   { id: 2, name: 'Siem Reap', code: 'SR001', region: 'Siem Reap', status: 'active' },
   { id: 3, name: 'Battambang', code: 'BB001', region: 'Battambang', status: 'active' },
   { id: 4, name: 'Cash Management Center', code: 'CMC001', region: 'Head Office', status: 'active' },
   { id: 5, name: 'Head Office', code: 'HO001', region: 'Head Office', status: 'active' },
 ]);
 const [showAddBranch, setShowAddBranch] = useState(false);
 const [newBranch, setNewBranch] = useState({ name: '', code: '', region: '', status: 'active' });

 const handleAddBranch = () => {
   if (newBranch.name && newBranch.code && newBranch.region) {
       setBranches([...branches, { ...newBranch, id: Date.now() }]);
       setNewBranch({ name: '', code: '', region: '', status: 'active' });
       setShowAddBranch(false);
   } else {
       alert("Please fill in all fields.");
   }
 };

 return (
   <div className="space-y-6">
     <div className="flex items-center justify-between">
       <div>
         <h3 className="text-lg font-semibold text-foreground">Branch Management</h3>
         <p className="text-sm text-muted-foreground">
           Add, edit, or disable bank branches and their details
         </p>
       </div>
       <Button
         iconName="Plus"
         iconPosition="left"
         onClick={() => setShowAddBranch(true)}
       >
         Add Branch
       </Button>
     </div>

     {showAddBranch && (
       <div className="bg-card border border-border rounded-lg p-6 space-y-4">
         <h4 className="text-lg font-medium text-foreground">Add New Branch</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Input label="Branch Name" placeholder="e.g., Toul Kork Branch" value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} />
           <Input label="Branch Code" placeholder="e.g., TK001" value={newBranch.code} onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })} />
           <Input label="Region" placeholder="e.g., Phnom Penh" value={newBranch.region} onChange={(e) => setNewBranch({ ...newBranch, region: e.target.value })} />
         </div>
         <div className="flex justify-end space-x-2">
           <Button variant="outline" onClick={() => setShowAddBranch(false)}>Cancel</Button>
           <Button onClick={handleAddBranch}>Save Branch</Button>
         </div>
       </div>
     )}

     <div className="bg-card border border-border rounded-lg overflow-hidden">
       <table className="w-full">
         <thead className="bg-muted/50 border-b border-border">
           <tr>
             <th className="text-left p-4 text-sm font-medium text-foreground">Branch Name</th>
             <th className="text-left p-4 text-sm font-medium text-foreground">Branch Code</th>
             <th className="text-left p-4 text-sm font-medium text-foreground">Region</th>
             <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
             <th className="text-right p-4 text-sm font-medium text-foreground">Actions</th>
           </tr>
         </thead>
         <tbody className="divide-y divide-border">
           {branches.map((branch) => (
             <tr key={branch.id} className="hover:bg-muted/30 transition-colors duration-150">
               <td className="p-4 font-medium text-foreground">{branch.name}</td>
               <td className="p-4 text-muted-foreground font-mono">{branch.code}</td>
               <td className="p-4 text-muted-foreground">{branch.region}</td>
               <td className="p-4">
                 <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${branch.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                   {branch.status}
                 </span>
               </td>
               <td className="p-4 text-right">
                 <Button variant="ghost" size="sm" iconName="Edit" />
                  <Button variant="ghost" size="sm" iconName="Trash2" className="text-error" />
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );
};

export default BranchManagementTab;
