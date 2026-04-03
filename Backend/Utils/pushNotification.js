const webpush = require("web-push");

// 🔐 Replace with your keys
const PUBLIC_KEY = "BE2D6lSg1CXNe7Jl-sKCB3s8wuS0M1GsTsEx1pN5ruSSA61HFruxDTIZyimVJoM-fQPDgjYGNbmxIXjsup7MZqU";
const PRIVATE_KEY = "YnEaKNx9rDTbyVraJHWeiP491ICXnjBkkoQgwWzu5bg";

webpush.setVapidDetails(
  "mailto:your@email.com",
  PUBLIC_KEY,
  PRIVATE_KEY
);

// 🚀 Send notification
const sendPushNotification = async (subscription, message) => {
  try {
    await webpush.sendNotification(subscription, message);
  } catch (err) {
    console.error("Push Error:", err);
  }
};

module.exports = sendPushNotification;