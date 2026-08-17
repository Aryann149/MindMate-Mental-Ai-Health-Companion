import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Activity, FileText, Search, Ban, CheckCircle2 } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import StatPill from "../components/ui/StatPill";
import { AdminAPI } from "../api/endpoints";

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const loadAnalytics = () => AdminAPI.analytics().then(({ data }) => setAnalytics(data.totals));
  const loadUsers = () => AdminAPI.users({ search }).then(({ data }) => setUsers(data.users));

  useEffect(() => { loadAnalytics(); loadUsers(); }, []);

  const search_ = async (e) => {
    e.preventDefault();
    loadUsers();
  };

  const toggleStatus = async (u) => {
    await AdminAPI.setUserStatus(u._id, !u.isActive);
    toast.success(`User ${u.isActive ? "deactivated" : "activated"}`);
    loadUsers();
  };

  return (
    <AppLayout title="Admin Panel">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatPill icon={Users} label="Total Users" value={analytics?.totalUsers ?? "—"} accent="lavender" />
        <StatPill icon={CheckCircle2} label="Active Users" value={analytics?.activeUsers ?? "—"} accent="mint" />
        <StatPill icon={FileText} label="Journal Entries" value={analytics?.totalJournals ?? "—"} accent="bloom" />
        <StatPill icon={Activity} label="Mood Logs" value={analytics?.totalMoods ?? "—"} accent="coral" />
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-200">Manage Users</p>
          <form onSubmit={search_} className="flex gap-2">
            <input className="glass-input" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn-secondary !px-3"><Search size={14} /></button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-white/10">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Joined</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-white/5">
                  <td className="py-2.5 text-slate-300">{u.name}</td>
                  <td className="py-2.5 text-slate-500">{u.email}</td>
                  <td className="py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-coral-500/15 text-coral-300" : "bg-white/5 text-slate-400"}`}>{u.role}</span>
                  </td>
                  <td className="py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.isActive ? "bg-mint-500/15 text-mint-300" : "bg-white/5 text-slate-500"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => toggleStatus(u)} className="text-slate-500 hover:text-coral-400" title={u.isActive ? "Deactivate" : "Activate"}>
                      {u.isActive ? <Ban size={15} /> : <CheckCircle2 size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && <p className="text-sm text-slate-500 py-6 text-center">No users found.</p>}
        </div>
      </GlassCard>
    </AppLayout>
  );
};

export default AdminPanel;
