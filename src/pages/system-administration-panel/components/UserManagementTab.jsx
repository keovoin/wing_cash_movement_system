import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { supabase } from '../../../supabaseClient';

const UserModal = ({ user, onSave, onCancel, roles, branches }) => {
    // ... (This component remains largely the same, but the password field is for creation only)
};

const UserManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    fetchUsersAndBranches();
  }, []);

  const fetchUsersAndBranches = async () => {
    // Fetch users from the 'profiles' table
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
    if (profilesError) console.error('Error fetching profiles', profilesError);
    else setUsers(profiles);

    // Fetch branches for the dropdown
    const { data: branchesData, error: branchesError } = await supabase.from('branches').select('name, code');
    if (branchesError) console.error('Error fetching branches', branchesError);
    else setBranches(branchesData);
  };

  const handleSaveUser = async (userData) => {
    // This is a simplified Add User. A real app would use a secure server-side function.
    const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                name: userData.name,
                role: userData.role,
                branch: userData.branch,
            }
        }
    });

    if (error) {
        alert(error.message);
    } else {
        alert("User created successfully! They will need to confirm their email.");
        fetchUsersAndBranches(); // Refresh the list
        setShowAddUser(false);
    }
  };

  const roleOptions = [/* ... roles ... */];
  const branchOptions = branches.map(b => ({ value: b.name, label: `${b.name} (${b.code})` }));

  return (
    <div className="space-y-6">
       {/* UI for adding user and displaying user table */}
       {/* The table should now map over the `users` state fetched from Supabase */}
    </div>
  );
};

export default UserManagementTab;
