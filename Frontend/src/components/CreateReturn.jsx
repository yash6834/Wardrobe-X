import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

const CreateReturn = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reason, setReason] = useState("");
  const [type, setType] = useState("return");
  const [customReason, setCustomReason] = useState("");
  const [newSize, setNewSize] = useState("");

  useEffect(() => {
    fetchOrder();
  }, []);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrder(res.data.order);
    } catch (err) {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async () => {
    const deliveredItems = order.items.filter(
      (i) => i.status === "delivered"
    );

    if (deliveredItems.length === 0) {
      return toast.error("Return available only after delivery");
    }

    if (!reason) return toast.error("Select a reason");

    if (reason === "Other" && !customReason.trim()) {
      return toast.error("Enter reason");
    }

    if (type === "exchange" && !newSize) {
      return toast.error("Select new size");
    }

    try {
      await api.post(
        "/api/returns",
        {
          orderId,
          items: deliveredItems.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
            size: i.size,
          })),
          type,
          reason: reason === "Other" ? customReason : reason,
          newSize: type === "exchange" ? newSize : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Return / Exchange request submitted");
      navigate("/my-returns");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="pt-24 text-center">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-24 text-center text-red-500">
        Order not found
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 max-w-md mx-auto">
      <div className="card p-4 border rounded-xl bg-white shadow">
        <h3 className="font-semibold mb-3">Return / Exchange</h3>

        {/* ORDER SUMMARY */}
        <div className="border-b pb-3 mb-3 text-sm">
          <p>
            <b>Order ID:</b>{" "}
            <span className="font-mono">{order._id}</span>
          </p>
          <p>
            <b>Items:</b> {order.items.length}
          </p>
        </div>

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="return">Return</option>
          <option value="exchange">Exchange</option>
        </select>

        {/* REASON */}
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="">Select reason</option>
          <option>Wrong size</option>
          <option>Damaged product</option>
          <option>Wrong item delivered</option>
          <option>Quality issue</option>
          <option>Other</option>
        </select>

        {reason === "Other" && (
          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Enter reason..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        {/* EXCHANGE SIZE */}
        {type === "exchange" && (
          <select
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="">Select new size</option>
            {order.items[0]?.product?.sizes?.map((s) => (
              <option key={s.size} value={s.size}>
                {s.size}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={submitHandler}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default CreateReturn;
