import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { User, UserRole, CommitteeGroup } from '../types';
import { 
  ShieldCheck, 
  UserPlus, 
  UserX, 
  Ban, 
  CheckCircle2, 
  Crown, 
  Shield, 
  User as UserIcon, 
  Search, 
  Trash2, 
  Users, 
  Layers, 
  Check, 
  X, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  onSelectGroup: (groupId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSelectGroup }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<CommitteeGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  
  // Add User Form State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserContact, setNewUserContact] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('GROUP_ADMIN');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUser = db.getCurrentUser();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const reloadData = () => {
    setUsers(db.getUsers());
    setGroups(db.getGroups());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserContact.trim()) return;

    db.addUser({
      name: newUserName.trim(),
      emailOrPhone: newUserContact.trim(),
      role: newUserRole,
      status: 'ACTIVE'
    });

    reloadData();
    setIsAddingUser(false);
    setNewUserName('');
    setNewUserContact('');
    setNewUserRole('GROUP_ADMIN');
    showToast(t.userAddedSuccess || "New user/admin added successfully!");
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    db.updateUserRole(userId, newRole);
    reloadData();
    showToast(t.userUpdatedSuccess || "User role updated successfully!");
  };

  const handleToggleBlock = (userId: string, currentStatus?: string) => {
    const newStatus = currentStatus === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    db.updateUserStatus(userId, newStatus);
    reloadData();
    showToast(`User status updated to ${newStatus}`);
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user/admin?")) {
      db.removeUser(userId);
      reloadData();
      showToast("User removed successfully.");
    }
  };

  const handleApproveGroup = (groupId: string) => {
    db.approveGroup(groupId);
    reloadData();
    showToast(t.approvedSuccess || "Committee approved!");
  };

  const handleRejectGroup = (groupId: string) => {
    db.rejectGroup(groupId);
    reloadData();
    showToast(t.rejectedSuccess || "Committee rejected.");
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm(t.confirmDeleteCommittee || "Are you sure you want to delete this committee?")) {
      db.deleteGroup(groupId);
      reloadData();
      showToast("Committee deleted.");
    }
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.emailOrPhone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const superAdminsCount = users.filter(u => u.role === 'SUPER_ADMIN').length;
  const groupAdminsCount = users.filter(u => u.role === 'GROUP_ADMIN').length;
  const regularUsersCount = users.filter(u => u.role === 'MEMBER').length;
  const blockedUsersCount = users.filter(u => u.status === 'BLOCKED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-800/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Crown size={15} className="text-amber-400" />
              <span>Super Head Admin Access</span>
            </span>
            {isSuperAdmin && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                Active Rights
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t.adminPanel}</h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Complete management of Group Head Admins, registered users, role promotions, access blocks, and all committee operations across CommitteePro.
          </p>
        </div>

        <button
          onClick={() => setIsAddingUser(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <UserPlus size={18} />
          <span>{t.addNewUser}</span>
        </button>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
            <Crown size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{superAdminsCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase">{t.superAdmin}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
            <Shield size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{groupAdminsCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase">{t.groupAdmin}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
            <Users size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{regularUsersCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase">Regular Users</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl">
            <Ban size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{blockedUsersCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase">{t.blockedUsers}</div>
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      {isAddingUser && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-indigo-100 shadow-xl space-y-5 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{t.addNewUser}</h3>
                <p className="text-xs text-slate-500">Create new Group Head Admin or Member credentials</p>
              </div>
            </div>
            <button onClick={() => setIsAddingUser(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.userName}</label>
                <input
                  required
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. Usman Shah"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.emailOrPhone}</label>
                <input
                  required
                  type="text"
                  value={newUserContact}
                  onChange={e => setNewUserContact(e.target.value)}
                  placeholder="e.g. usman@gmail.com or 03001234567"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.userRole}</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm outline-none cursor-pointer"
                >
                  <option value="GROUP_ADMIN">🛡️ Group Head Admin (ہیڈ ایڈمن)</option>
                  <option value="SUPER_ADMIN">👑 Super Head Admin (سپر ہیڈ ایڈمن)</option>
                  <option value="MEMBER">👤 Regular Member (عام ممبر)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingUser(false)}
                className="px-5 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/30"
              >
                {t.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Section 1: User & Admin Management List */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-purple-600" size={22} />
              <span>{t.usersAndAdmins}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              List of all registered admins and members. Promote roles, grant group admin status, or block access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative min-w-[200px]">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search name or phone..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Head Admins</option>
              <option value="GROUP_ADMIN">Group Head Admins</option>
              <option value="MEMBER">Regular Members</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-3 px-6">{t.userName}</th>
                <th className="py-3 px-4">{t.emailOrPhone}</th>
                <th className="py-3 px-4">{t.userRole}</th>
                <th className="py-3 px-4">{t.userStatus}</th>
                <th className="py-3 px-6 text-right">Super Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm font-semibold">
                    No users found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isBlocked = user.status === 'BLOCKED';
                  return (
                    <tr key={user.id} className={`hover:bg-slate-50/80 transition-colors ${isBlocked ? 'bg-rose-50/30' : ''}`}>
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs uppercase ${
                          user.role === 'SUPER_ADMIN' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : user.role === 'GROUP_ADMIN' 
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-slate-900 font-bold">{user.name}</div>
                          <div className="text-[10px] text-slate-400">Joined {new Date(user.joinedAt).toLocaleDateString()}</div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                        {user.emailOrPhone}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : user.role === 'GROUP_ADMIN'
                            ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role === 'SUPER_ADMIN' && <Crown size={13} className="text-amber-500" />}
                          {user.role === 'GROUP_ADMIN' && <Shield size={13} className="text-indigo-600" />}
                          {user.role === 'MEMBER' && <UserIcon size={13} className="text-slate-500" />}
                          <span>
                            {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'GROUP_ADMIN' ? 'Group Admin' : 'Member'}
                          </span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isBlocked 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Role switch buttons */}
                          {user.role !== 'GROUP_ADMIN' && (
                            <button
                              onClick={() => handleRoleChange(user.id, 'GROUP_ADMIN')}
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 flex items-center gap-1"
                              title={t.promoteToGroupAdmin}
                            >
                              <Shield size={14} />
                              <span className="hidden lg:inline">{t.promoteToGroupAdmin}</span>
                            </button>
                          )}

                          {user.role !== 'SUPER_ADMIN' && (
                            <button
                              onClick={() => handleRoleChange(user.id, 'SUPER_ADMIN')}
                              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold border border-purple-200 flex items-center gap-1"
                              title={t.promoteToSuperAdmin}
                            >
                              <Crown size={14} className="text-amber-500" />
                              <span className="hidden lg:inline">{t.promoteToSuperAdmin}</span>
                            </button>
                          )}

                          {user.role !== 'MEMBER' && (
                            <button
                              onClick={() => handleRoleChange(user.id, 'MEMBER')}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                              title={t.demoteToMember}
                            >
                              <UserIcon size={14} />
                              <span className="hidden lg:inline">{t.demoteToMember}</span>
                            </button>
                          )}

                          {/* Block / Unblock */}
                          <button
                            onClick={() => handleToggleBlock(user.id, user.status)}
                            className={`p-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 ${
                              isBlocked 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                            title={isBlocked ? t.unblockUser : t.blockUser}
                          >
                            <Ban size={14} />
                            <span className="hidden lg:inline">{isBlocked ? t.unblockUser : t.blockUser}</span>
                          </button>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemoveUser(user.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200"
                            title={t.removeUser}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: All Committees Full Control Overview */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="text-indigo-600" size={22} />
            <span>{t.allCommitteesFull}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Super Head Admin overview of every saving committee across CommitteePro. Inspect, approve requests, or purge committees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group) => {
            const isPending = group.status === 'PENDING_APPROVAL';
            const isActive = group.status === 'ACTIVE';

            return (
              <div
                key={group.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                  isPending 
                    ? 'bg-amber-50/50 border-amber-200' 
                    : isActive 
                    ? 'bg-white border-slate-200/80 shadow-xs hover:border-indigo-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-slate-900 text-lg">{group.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isPending ? 'bg-amber-100 text-amber-800' : isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {group.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong className="text-slate-800">Monthly Contribution:</strong> PKR {group.amount.toLocaleString()}</p>
                    <p><strong className="text-slate-800">Duration:</strong> {group.totalCycles} Months | {group.members.length} Members</p>
                    <p><strong className="text-slate-800">Requested By:</strong> {group.requestedBy || 'Group Admin'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectGroup(group.id)}
                    className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{t.viewGroup}</span>
                    <ArrowRight size={14} />
                  </button>

                  {isPending && (
                    <button
                      onClick={() => handleApproveGroup(group.id)}
                      className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Check size={14} />
                      <span>{t.approveGroup}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200"
                    title={t.deleteCommittee}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
