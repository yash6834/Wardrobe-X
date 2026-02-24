import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import {
  Plus,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Clock,
  X
} from "lucide-react";

const Memberships = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // create / edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationInDays: "",
    discountPercent: "",
    description: ""
  });

  /* ================= FETCH ================= */
  const fetchPlans = async () => {
    try {
      const res = await api.get("/api/membership");
      setPlans(res.data.plans || []);
    } catch {
      toast.error("Failed to load memberships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/membership/${editingId}`, formData);
        toast.success("Plan updated successfully");
      } else {
        await api.post("/api/membership", formData);
        toast.success("New plan created");
      }
      closeModal();
      fetchPlans();
    } catch {
      toast.error("Action failed");
    }
  };

  /* ================= STATUS TOGGLE ================= */
  const toggleStatus = async (id) => {
    try {
      await api.patch(`/api/membership/${id}/status`);
      fetchPlans();
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================= DELETE FLOW ================= */
  const openDeleteModal = (plan) => {
    setDeleteId(plan._id);
    setDeleteName(plan.name);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
    setDeleteName("");
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/membership/delete/${deleteId}`);
      toast.success("Plan deleted successfully");
      fetchPlans();
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };



  /* ================= MODAL HELPERS ================= */
  const openEditModal = (plan) => {
    setEditingId(plan._id);
    setFormData({
      name: plan.name,
      price: plan.price,
      durationInDays: plan.durationInDays,
      discountPercent: plan.discountPercent,
      description: plan.description || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      durationInDays: "",
      discountPercent: "",
      description: ""
    });
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen pt-24">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Membership Plans
          </h1>
          <p className="text-slate-500">
            Configure and manage subscription tiers.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black"
        >
          <Plus size={20} /> Create New Plan
        </button>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b text-xs text-slate-400 uppercase">
                <th className="px-6 py-4 text-left">Plan</th>
                <th className="px-6 py-4 text-center">Price</th>
                <th className="px-6 py-4 text-center">Duration</th>
                <th className="px-6 py-4 text-center">Discount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {plans.map((plan) => (
                <tr key={plan._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-bold">{plan.name}</div>
                    <div className="text-xs text-slate-400">
                      {plan.description || "No description"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center font-bold">
                    ₹{plan.price}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm">
                      <Clock size={14} /> {plan.durationInDays} Days
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center text-emerald-600 font-medium">
                    {plan.discountPercent}% OFF
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${plan.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                        }`}
                    >
                      {plan.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        onClick={() => toggleStatus(plan._id)}
                        className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl"
                      >
                        {plan.status === "active" ? (
                          <ToggleRight size={22} />
                        ) : (
                          <ToggleLeft size={22} />
                        )}
                      </button>

                      <button
                        onClick={() => openDeleteModal(plan)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {plans.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400">
                    No membership plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black mb-6">
              {editingId ? "Update Plan" : "Create Plan"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full p-4 border rounded-xl"
                placeholder="Plan Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <input
                type="number"
                className="w-full p-4 border rounded-xl"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />

              <input
                type="number"
                className="w-full p-4 border rounded-xl"
                placeholder="Duration (Days)"
                value={formData.durationInDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationInDays: e.target.value
                  })
                }
                required
              />

              <input
                type="number"
                className="w-full p-4 border rounded-xl"
                placeholder="Discount (%)"
                value={formData.discountPercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercent: e.target.value
                  })
                }
              />

              <textarea
                className="w-full p-4 border rounded-xl"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
              />

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 py-4 rounded-xl font-black"
              >
                {editingId ? "Save Changes" : "Create Plan"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-2">Delete Plan?</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete
              <span className="font-bold"> "{deleteName}"</span>?
              <br />
              <span className="text-rose-600 font-semibold">
                This action cannot be undone.
              </span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-3 rounded-2xl border font-bold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memberships;
