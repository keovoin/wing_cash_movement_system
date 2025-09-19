import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { supabase } from '../../../supabaseClient';

const BranchManagementTab = () => {
  const [branches, setBranches] = useState([]);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', code: '', region: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('branches').select('*');
    if (error) console.error('Error fetching branches:', error);
    else setBranches(data);
    setLoading(false);
  };

  const handleAddBranch = async () => {
    if (newBranch.name && newBranch.code && newBranch.region) {
      const { data, error } = await supabase.from('branches').insert([newBranch]).select();
      if (error) {
        alert(error.message);
      } else {
        setBranches([...branches, ...data]);
        setNewBranch({ name: '', code: '', region: '' });
        setShowAddBranch(false);
      }
    } else {
        alert("Please fill in all fields.");
    }
  };

  if (loading) return <div>Loading branches...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Branch Management</h3>
        <Button iconName="Plus" iconPosition="left" onClick={() => setShowAddBranch(true)}>Add Branch</Button>
      </div>

      {showAddBranch && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Branch Name" value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} />
            <Input label="Branch Code" value={newBranch.code} onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })} />
            <Input label="Region" value={newBranch.region} onChange={(e) => setNewBranch({ ...newBranch, region: e.target.value })} />
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
             {/* table headers */}
          </thead>
          <tbody className="divide-y divide-border">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium">{branch.name}</td>
                <td className="p-4 font-mono">{branch.code}</td>
                <td className="p-4">{branch.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchManagementTab;
