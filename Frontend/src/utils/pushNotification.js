import api from "../api/api";

// 🔧 helper function (ADD THIS AT TOP)
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

// 🔔 MAIN FUNCTION
export const subscribeUserToPush = async () => {
  try {
    if (!("serviceWorker" in navigator)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ Permission denied");
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    // 🔥 CHECK if already subscribed (avoid duplicates)
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BE2D6lSg1CXNe7Jl-sKCB3s8wuS0M1GsTsEx1pN5ruSSA61HFruxDTIZyimVJoM-fQPDgjYGNbmxIXjsup7MZqU"), // ✅ FIXED
      });
    }

    // 🔥 send to backend
    await api.post("/api/save-subscription", subscription);

    console.log(" Subscribed:", subscription);
  } catch (err) {
    console.error(" Push subscription error:", err);
  }
};