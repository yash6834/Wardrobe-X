import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import {
  Trash2,
  UploadCloud,
  Hash,
  Edit,
  X,
  Plus,
  Image as ImageIcon,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

const BASE_URL = "http://localhost:3000";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ image: null, order: 0 });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  /* ================= FETCH (Logic Unchanged) ================= */
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data } = await api.get("/api/cms/banner");
    setBanners(data.sort((a, b) => a.order - b.order));
  };

  /* ================= TOGGLE ACTIVE (Logic Unchanged) ================= */
  const toggleStatus = async (id) => {
    await api.put(`/api/cms/banner/${id}`, { toggle: true });
    fetchBanners();
  };

  /* ================= HANDLE CHANGE (Logic Unchanged) ================= */
  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formData,
        order: parseInt(e.target.value) || 0,
      });
    }
  };

  /* ================= CREATE (Logic Unchanged) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", formData.image);
    data.append("order", formData.order);
    await api.post("/api/cms/banner", data);
    fetchBanners();
    setPreview(null);
    setFormData({ image: null, order: 0 });
  };

  /* ================= DELETE (Logic Unchanged) ================= */
  const deleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    await api.delete(`/api/cms/banner/${id}`);
    fetchBanners();
  };

  /* ================= EDIT (Logic Unchanged) ================= */
  const openEdit = (banner) => {
    setEditingId(banner._id);
    setFormData({ image: null, order: banner.order });
    setPreview(`${BASE_URL}${banner.image}`);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("order", formData.order);
    if (formData.image) data.append("image", formData.image);
    await api.put(`/api/cms/banner/${editingId}`, data);
    setIsEditOpen(false);
    setPreview(null);
    fetchBanners();
  };

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Banner Management</h2>
          <p className="text-slate-500">Upload and organize the promotional banners for your hero section.</p>
        </div>

        {/* ================= CREATE FORM ================= */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <Plus size={20} strokeWidth={3} />
            <h3 className="font-bold text-lg">Add New Banner</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Banner Image</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  required
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="p-4 flex items-center gap-3">
                  <UploadCloud className="text-slate-400 group-hover:text-indigo-500" size={24} />
                  <span className="text-sm text-slate-500 font-medium">
                    {formData.image ? formData.image.name : "Choose banner file"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Display Order</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="number"
                  name="order"
                  placeholder="0"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
              <Plus size={18} /> Upload Banner
            </button>

            {preview && !isEditOpen && (
              <div className="md:col-span-3 mt-2 relative w-full max-w-xs rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                 <img src={preview} className="w-full h-32 object-cover" alt="Preview" />
                 <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full cursor-pointer" onClick={() => setPreview(null)}><X size={14}/></div>
              </div>
            )}
          </form>
        </div>

        {/* ================= LIST ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative">
                <img
                  src={`${BASE_URL}${banner.image}`}
                  className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Banner"
                />
                <div className="absolute top-3 right-3">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${banner.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {banner.isActive ? "Live" : "Hidden"}
                   </span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Hash size={14} className="text-slate-400" />
                  <span className="text-sm font-bold">Order: {banner.order}</span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => toggleStatus(banner._id)}
                    className={`p-2 rounded-lg transition-colors ${banner.isActive ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'}`}
                    title="Toggle Visibility"
                  >
                    {banner.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>

                  <button
                    onClick={() => openEdit(banner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => deleteBanner(banner._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No banners found. Start by uploading one above!</p>
          </div>
        )}

        {/* ================= EDIT MODAL ================= */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditOpen(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-xl text-slate-800">Update Banner</h3>
                <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Change Image (Optional)</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {preview && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                    <img src={preview} className="w-full h-40 object-cover" alt="Edit Preview" />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Order Position</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <button
                  onClick={handleUpdate}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all"
                >
                  <Save size={18} /> Update Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners;