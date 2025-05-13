// Razorpay Configuration
const RAZORPAY_CONFIG = {
  key_id: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual key
  currency: "INR",
  name: "Ultimate Prep",
  description: "Premium Access",
  image: "/assets/logo.png", // Add your logo path
  theme: {
    color: "#2563eb" // Blue-600 color to match our theme
  },
  modal: {
    backdropClose: false,
    escape: false,
    animation: true
  }
};

// Premium Plan Configuration
const PREMIUM_PLANS = {
  monthly: {
    id: "plan_monthly",
    name: "Monthly Premium",
    price: 49900, // ₹499 (in paise)
    duration: "1 month"
  },
  yearly: {
    id: "plan_yearly",
    name: "Yearly Premium",
    price: 399900, // ₹3,999 (in paise)
    duration: "1 year",
    savings: "33% off"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RAZORPAY_CONFIG, PREMIUM_PLANS };
} 