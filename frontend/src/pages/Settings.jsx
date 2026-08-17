import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, ShieldAlert } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import GlassCard from "../components/ui/GlassCard";
import { UserAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user, updateLocalUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "prefer_not_to_say",
    occupation: user?.occupation || "",
  });
  const [goals, setGoals] = useState(user?.goals || {});
  const [contact, setContact] = useState({ name: "", relationship: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await UserAPI.updateProfile(profile);
      updateLocalUser(data.user);
      toast.success("Profile updated");
    } finally {
      setSaving(false);
    }
  };

  const saveGoals = async () => {
    const { data } = await UserAPI.updateGoals(goals);
    updateLocalUser({ goals: data.goals });
    toast.success("Goals updated");
  };

  const toggleEmergency = async () => {
    const { data } = await UserAPI.toggleEmergencySupport(!user.emergencySupport?.enabled);
    updateLocalUser({ emergencySupport: data.emergencySupport });
    toast.success(data.emergencySupport.enabled ? "Emergency support enabled" : "Emergency support disabled");
  };

  const addContact = async () => {
    if (!contact.name.trim()) return toast.error("Contact name is required");
    const { data } = await UserAPI.addTrustedContact(contact);
    updateLocalUser({ emergencySupport: { ...user.emergencySupport, trustedContacts: data.trustedContacts } });
    setContact({ name: "", relationship: "", phone: "", email: "" });
    toast.success("Trusted contact added");
  };

  const removeContact = async (id) => {
    const { data } = await UserAPI.removeTrustedContact(id);
    updateLocalUser({ emergencySupport: { ...user.emergencySupport, trustedContacts: data.trustedContacts } });
  };

  return (
    <AppLayout title="Settings">
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">Profile</p>
          <div className="space-y-3">
            <input className="glass-input w-full" placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="glass-input w-full" placeholder="Age" value={profile.age} onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })} />
              <select className="glass-input w-full" value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}>
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non_binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input className="glass-input w-full" placeholder="Occupation" value={profile.occupation} onChange={(e) => setProfile({ ...profile, occupation: e.target.value })} />
            <button onClick={saveProfile} disabled={saving} className="btn-primary w-full">Save profile</button>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-slate-200 mb-4">Daily Goals</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Sleep goal (hours)</label>
              <input type="number" className="glass-input w-full" value={goals.sleepHoursGoal} onChange={(e) => setGoals({ ...goals, sleepHoursGoal: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Water goal (glasses)</label>
              <input type="number" className="glass-input w-full" value={goals.waterGlassesGoal} onChange={(e) => setGoals({ ...goals, waterGlassesGoal: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Meditation goal (minutes/day)</label>
              <input type="number" className="glass-input w-full" value={goals.meditationMinutesGoal} onChange={(e) => setGoals({ ...goals, meditationMinutesGoal: Number(e.target.value) })} />
            </div>
            <button onClick={saveGoals} className="btn-primary w-full">Save goals</button>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-start gap-3 mb-4">
            <ShieldAlert size={20} className="text-coral-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">Emergency Support (opt-in)</p>
              <p className="text-xs text-slate-500 mt-1">
                When enabled, MindMate will gently surface a supportive prompt — encouraging you to reach out to a
                trusted contact or professional — if multiple entries show signs of severe distress. MindMate never
                contacts anyone automatically; you stay fully in control.
              </p>
            </div>
            <button
              onClick={toggleEmergency}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border ${
                user?.emergencySupport?.enabled ? "bg-mint-500/20 border-mint-500/40 text-mint-300" : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {user?.emergencySupport?.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-slate-400 mb-3">Trusted contacts</p>
            <div className="space-y-2 mb-4">
              {user?.emergencySupport?.trustedContacts?.map((c) => (
                <div key={c._id} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-slate-300">{c.name} {c.relationship && `· ${c.relationship}`} {c.phone && `· ${c.phone}`}</span>
                  <button onClick={() => removeContact(c._id)} className="text-slate-600 hover:text-coral-400"><Trash2 size={14} /></button>
                </div>
              ))}
              {!user?.emergencySupport?.trustedContacts?.length && <p className="text-xs text-slate-600">No trusted contacts added yet.</p>}
            </div>

            <div className="grid md:grid-cols-4 gap-2">
              <input className="glass-input" placeholder="Name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
              <input className="glass-input" placeholder="Relationship" value={contact.relationship} onChange={(e) => setContact({ ...contact, relationship: e.target.value })} />
              <input className="glass-input" placeholder="Phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
              <button onClick={addContact} className="btn-secondary"><Plus size={14} /> Add</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default Settings;
