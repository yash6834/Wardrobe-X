import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { User, Shield, Edit, Lock } from "lucide-react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({ name: "", email: "", role: "Admin" });
  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/api/admin/profile");
      setAdmin(res.data);
      setFormData({ name: res.data.name, email: res.data.email });
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.put("/api/admin/profile", formData);
      setAdmin(res.data.admin);
      setMode("view");
    } catch (err) {
      alert("Error updating profile");
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      await api.put("/api/admin/change-password", passwordData);
      setMode("view");
    } catch {
      alert("Error updating password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="backdrop-blur-lg bg-white/70 border rounded-3xl p-6 shadow-xl flex items-center gap-6">
          
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {admin.name?.charAt(0)}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">{admin.name}</h1>
            <p className="text-slate-500">{admin.email}</p>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full mt-2 inline-block">
              {admin.role}
            </span>
          </div>

        </div>

        {/* TABS */}
        <div className="flex gap-3">
          <Tab icon={<User size={16}/>} active={mode==="view"} onClick={()=>setMode("view")} label="Overview"/>
          <Tab icon={<Edit size={16}/>} active={mode==="edit"} onClick={()=>setMode("edit")} label="Edit"/>
          <Tab icon={<Lock size={16}/>} active={mode==="password"} onClick={()=>setMode("password")} label="Security"/>
        </div>

        {/* CONTENT */}
        <div className="backdrop-blur-lg bg-white/70 border rounded-3xl p-6 shadow-xl">

          {mode === "view" && (
            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard label="Full Name" value={admin.name} />
              <InfoCard label="Email" value={admin.email} />
              <InfoCard label="Role" value={admin.role} />
              <InfoCard label="Status" value="Active" />
            </div>
          )}

          {mode === "edit" && (
            <div className="space-y-4 max-w-md">
              <Input value={formData.name} onChange={(v)=>setFormData({...formData,name:v})} placeholder="Name"/>
              <Input value={formData.email} onChange={(v)=>setFormData({...formData,email:v})} placeholder="Email"/>

              <button
                onClick={handleSaveProfile}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {mode === "password" && (
            <div className="space-y-4 max-w-md">
              <Input type="password" value={passwordData.oldPassword} onChange={(v)=>setPasswordData({...passwordData,oldPassword:v})} placeholder="Old Password"/>
              <Input type="password" value={passwordData.newPassword} onChange={(v)=>setPasswordData({...passwordData,newPassword:v})} placeholder="New Password"/>
              <Input type="password" value={passwordData.confirmPassword} onChange={(v)=>setPasswordData({...passwordData,confirmPassword:v})} placeholder="Confirm Password"/>

              <button
                onClick={handleChangePassword}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

/* COMPONENTS */

const Tab = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${
      active ? "bg-indigo-600 text-white shadow" : "bg-white text-slate-600 hover:bg-slate-100"
    }`}
  >
    {icon} {label}
  </button>
);

const InfoCard = ({ label, value }) => (
  <div className="p-4 rounded-xl bg-white shadow border">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-semibold text-slate-800">{value}</p>
  </div>
);

const Input = ({ value, onChange, placeholder, type="text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e)=>onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
  />
);

export default AdminProfile;