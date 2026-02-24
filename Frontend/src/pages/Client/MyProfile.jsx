import React, { useEffect, useState } from "react";
import {
  User2,
  Calendar,
  Crown,
  Mail,
  CheckCircle,
  ArrowRight,
  X,
  CreditCard,
  Activity
} from "lucide-react";
import api from "../../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchUser();
  }, []);

  const activeMembership =
    user?.memberships?.find(
      (m) => m.isActive && new Date(m.endDate) > new Date()
    ) || null;

  /* ================= FETCH PLANS ================= */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/api/membership/active");
        setPlans(res.data.plans || []);
      } catch {
        toast.error("Failed to load membership plans");
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  /* ================= PAYMENT ================= */
  const handlePayment = async (plan) => {
    try {
      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded");
        return;
      }

      const res = await api.post(
        "/api/membership/payment/create-order",
        { planId: plan._id }
      );

      const { razorpayKey, order } = res.data;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: "Membership Pro",
        description: `Plan: ${plan.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post("/api/membership/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan._id,
            });

            const meRes = await api.get("/api/auth/me");
            setUser(meRes.data.user);
            localStorage.setItem("user", JSON.stringify(meRes.data.user));

            toast.success("Membership activated!");
            setShowModal(false);
            setActiveTab("history");
          } catch {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#6366F1" },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black text-slate-900">
            Account Hub
          </h1>
          <p className="text-slate-500 mt-2">
            Manage your digital identity and subscriptions.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-28 h-28 bg-slate-100 rounded-3xl flex items-center justify-center">
              <User2 className="w-12 h-12 text-slate-400" />
            </div>

            <div className="space-y-3 w-full">
              <h2 className="text-2xl font-black text-slate-900">
                {user?.name}
              </h2>

              <p className="flex items-center gap-2 text-slate-500 text-sm">
                <Mail size={16} />
                {user?.email}
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <InfoBox label="Phone" value={user?.phone ? `+91 ${user.phone}` : "Not Added"} />
                <InfoBox label="Role" value={user?.role} highlight />
                <InfoBox
                  label="Membership"
                  value={activeMembership ? "Premium Active" : "Free Account"}
                  active={!!activeMembership}
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-8 border-b border-slate-200">
          <TabButton active={activeTab === "plans"} onClick={() => setActiveTab("plans")}>
            Available Plans
          </TabButton>
          <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")}>
            Billing & History
          </TabButton>
        </div>

        {/* PLANS TAB */}
        {activeTab === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingPlans
              ? [1, 2].map((i) => (
                  <div key={i} className="h-56 bg-slate-100 rounded-3xl animate-pulse" />
                ))
              : plans.map((plan) => (
                  <div
                    key={plan._id}
                    className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-xl font-black text-slate-900">
                      {plan.name}
                    </h3>

                    <p className="text-slate-500 text-sm mt-2">
                      {plan.description}
                    </p>

                    <ul className="mt-6 space-y-3 text-sm text-slate-600">
                      <li>✔ Valid for {plan.durationInDays} days</li>
                      <li>✔ {plan.discountPercent}% Discount</li>
                      <li>✔ Priority Support</li>
                      <li>✔ Faster Shipping</li>
                    </ul>

                    <div className="mt-6 flex justify-between items-center">
                      <span className="text-3xl font-black text-slate-900">
                        ₹{plan.price}
                      </span>

                      <button
                        disabled={!!activeMembership}
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowModal(true);
                        }}
                        className={`px-6 py-3 rounded-xl font-bold ${
                          activeMembership
                            ? "bg-slate-100 text-slate-300"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {activeMembership ? "Active" : "Subscribe"}
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-5 text-left text-xs uppercase text-slate-400">Plan</th>
                  <th className="p-5 text-left text-xs uppercase text-slate-400">Period</th>
                  <th className="p-5 text-right text-xs uppercase text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {user.memberships?.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-slate-400">
                      No subscription history found.
                    </td>
                  </tr>
                ) : (
                  user.memberships.map((m, i) => {
                    const isActive =
                      m.isActive && new Date(m.endDate) > new Date();
                    return (
                      <tr key={i} className="border-t hover:bg-slate-50">
                        <td className="p-5 font-semibold">{m.planName}</td>
                        <td className="p-5 text-sm text-slate-500">
                          {new Date(m.startDate).toLocaleDateString()} —{" "}
                          {new Date(m.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-5 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              isActive
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {isActive ? "Active" : "Expired"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="text-2xl font-black">
                {selectedPlan.name}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <p className="text-slate-500 mb-6">
              {selectedPlan.description}
            </p>

            <button
              onClick={() => handlePayment(selectedPlan)}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700"
            >
              Pay ₹{selectedPlan.price}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBox = ({ label, value, highlight, active }) => (
  <div className="bg-slate-50 px-4 py-3 rounded-xl text-sm">
    <span className="block text-xs text-slate-400 uppercase">
      {label}
    </span>
    <span
      className={`font-bold ${
        highlight
          ? "text-indigo-600"
          : active
          ? "text-emerald-600"
          : "text-slate-800"
      }`}
    >
      {value}
    </span>
  </div>
);

const TabButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-4 text-sm font-bold relative ${
      active ? "text-indigo-600" : "text-slate-400"
    }`}
  >
    {children}
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />
    )}
  </button>
);

export default MyProfile;
