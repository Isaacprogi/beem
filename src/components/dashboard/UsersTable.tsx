import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Users, CheckCircle, MoreVertical, X, Shield, ShieldOff, Trash2, Edit, Eye, Save, AlertTriangle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {Label } from "@radix-ui/react-select";
import { SelectItem, SelectValue,Select,SelectContent,SelectTrigger } from "../ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  display_name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  blocked: boolean;
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Dropdown Component
interface DropdownProps {
  user: User;
  buttonRect: DOMRect;
  onClose: () => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onBlock: (user: User) => void;
}

const Dropdown = ({ user, buttonRect, onClose, onView, onEdit, onDelete, onBlock }: DropdownProps) => {
  const style = {
    position: "fixed" as const,
    top: buttonRect.bottom + window.scrollY,
    left: buttonRect.right - 128 + window.scrollX,
    width: "128px",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 9999,
  };

  return createPortal(
    <div style={style}>
      <button 
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm" 
        onClick={() => { onView(user); onClose(); }}
      >
        <Eye className="w-4 h-4" />
        View
      </button>
      <button 
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm" 
        onClick={() => { onEdit(user); onClose(); }}
      >
        <Edit className="w-4 h-4" />
        Edit
      </button>
      <button 
        className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm ${user.blocked ? 'text-green-600' : 'text-orange-600'}`}
        onClick={() => { onBlock(user); onClose(); }}
      >
        {user.blocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
        {user.blocked ? 'Unblock' : 'Block'}
      </button>
      <button 
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-red-600" 
        onClick={() => { onDelete(user); onClose(); }}
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>,
    document.body
  );
};

// View User Component
interface ViewUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewUserModal = ({ user, isOpen, onClose }: ViewUserModalProps) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
          <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{user.display_name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
          <p className="text-slate-900 bg-slate-50 p-3 rounded-lg font-mono text-sm">{user.user_id}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Profile ID</label>
          <p className="text-slate-900 bg-slate-50 p-3 rounded-lg font-mono text-sm">{user.id}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <div className="flex items-center gap-2">
            {user.blocked ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                <XCircle className="w-3 h-3" />
                Blocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Created</label>
            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg text-sm">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Updated</label>
            <p className="text-slate-900 bg-slate-50 p-3 rounded-lg text-sm">
              {new Date(user.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};


interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  profile: any;
  onClose: () => void;
  onSave: (user: User, displayName: string, role: string) => void;
}

const EditUserModal = ({ user, profile, isOpen, onClose, onSave }: EditUserModalProps) => {
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("user");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name);
      setRole(profile.role); // initialize with the user’s current role
    }
  }, [user, profile]);

  const handleSave = () => {
    if (user) {
      setShowConfirmation(true);
    }
  };

  const confirmSave = () => {
    if (user) {
      onSave(user, displayName.trim(), role);
      setShowConfirmation(false);
      onClose();
    }
  };

  if (!user) return null;

  if (showConfirmation) {
    return (
      <Modal isOpen={isOpen} onClose={() => setShowConfirmation(false)} title="Confirm Changes">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h4 className="text-lg font-semibold text-slate-800">Save Changes?</h4>
          <p className="text-slate-600">
            Are you sure you want to update <strong>{user.display_name}</strong>?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <div className="space-y-4">
        {/* User ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
          <p className="text-slate-900 bg-slate-50 p-3 rounded-lg font-mono text-sm">{user.user_id}</p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter display name"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              (!displayName.trim() || displayName === user.display_name) &&
              role === profile.role
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};


// Delete Confirmation Component
interface DeleteConfirmationModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: User) => void;
}

const DeleteConfirmationModal = ({ user, isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) => {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h4 className="text-lg font-semibold text-slate-800">Delete User?</h4>
        <p className="text-slate-600">
          Are you sure you want to delete <strong>{user.display_name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete User
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Block Confirmation Component
interface BlockConfirmationModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: User) => void;
}

const BlockConfirmationModal = ({ user, isOpen, onClose, onConfirm }: BlockConfirmationModalProps) => {
  if (!user) return null;

  const isBlocking = !user.blocked;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isBlocking ? "Block User" : "Unblock User"}>
      <div className="text-center space-y-4">
        <AlertTriangle className={`w-12 h-12 mx-auto ${isBlocking ? 'text-orange-500' : 'text-green-500'}`} />
        <h4 className="text-lg font-semibold text-slate-800">
          {isBlocking ? 'Block User?' : 'Unblock User?'}
        </h4>
        <p className="text-slate-600">
          Are you sure you want to {isBlocking ? 'block' : 'unblock'} <strong>{user.display_name}</strong>?
          {isBlocking && ' This will prevent them from accessing the platform.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user)}
            className={`px-4 py-2 text-white rounded-lg hover:opacity-90 flex items-center gap-2 ${
              isBlocking ? 'bg-orange-600' : 'bg-green-600'
            }`}
          >
            {isBlocking ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {isBlocking ? 'Block User' : 'Unblock User'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Main Users Table Component
const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const {profile} = useAuth()
  const [loading, setLoading] = useState(true);
  const [dropdownUser, setDropdownUser] = useState<{ user: User; rect: DOMRect } | null>(null);
  
  // Modal states
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
  const [blockModal, setBlockModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, user_id, role, created_at, updated_at, blocked")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleDropdownClick = (user: User, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownUser(dropdownUser?.user.id === user.id ? null : { user, rect });
  };

  const closeDropdown = () => setDropdownUser(null);

  const handleViewUser = (user: User) => {
    setViewModal({ isOpen: true, user });
  };

  const handleEditUser = (user: User) => {
    setEditModal({ isOpen: true, user });
  };

  const handleDeleteUser = (user: User) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleBlockUser = (user: User) => {
    setBlockModal({ isOpen: true, user });
  };


  const handleSaveUser = async (user: User, displayName: string, role: string) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, role })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please try again.");
    } else {
      await fetchUsers();
      alert("User updated successfully!");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Error updating user. Please try again.");
  }
};


  const confirmDeleteUser = async (user: User) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
      } else {
        await fetchUsers();
        setDeleteModal({ isOpen: false, user: null });
        alert("User deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please try again.");
    }
  };

  const confirmBlockUser = async (user: User) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ blocked: !user.blocked })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating user:", error);
        alert("Error updating user status. Please try again.");
      } else {
        await fetchUsers();
        setBlockModal({ isOpen: false, user: null });
        alert(`User ${user.blocked ? 'unblocked' : 'blocked'} successfully!`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user status. Please try again.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownUser(null);
    };

    if (dropdownUser) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownUser]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Users Management</h2>
        <p className="text-slate-600">Manage and monitor your platform users</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Display Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                   
                    <td className="px-6 py-4 font-medium text-slate-900">{user.display_name}</td>
                   
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.blocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3" />
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {profile?.role}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                        onClick={(e) => handleDropdownClick(user, e)}
                      >
                        <MoreVertical className="w-4 h-4 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Dropdown */}
            {dropdownUser && (
              <Dropdown
                user={dropdownUser.user}
                buttonRect={dropdownUser.rect}
                onClose={closeDropdown}
                onView={handleViewUser}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onBlock={handleBlockUser}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewUserModal
        user={viewModal.user}
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, user: null })}
      />

      <EditUserModal
        user={editModal.user}
        isOpen={editModal.isOpen}
        profile={profile}
        onClose={() => setEditModal({ isOpen: false, user: null })}
        onSave={handleSaveUser}
      />

      <DeleteConfirmationModal
        user={deleteModal.user}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={confirmDeleteUser}
      />

      <BlockConfirmationModal
        user={blockModal.user}
        isOpen={blockModal.isOpen}
        onClose={() => setBlockModal({ isOpen: false, user: null })}
        onConfirm={confirmBlockUser}
      />
    </div>
  );
};

export default UsersTable;