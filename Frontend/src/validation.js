// =======================
// User Registration Validation
// =======================
export const validateUserForm = (formData) => {
  const errors = {};
  let isValid = true;

  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,15}$/;

  if (!nameRegex.test(formData.name)) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (!phoneRegex.test(formData.phone)) {
    errors.phone = "Enter valid 10-digit number without alphabets and symbols.";
    isValid = false;
  }

  if (!emailRegex.test(formData.email)) {
    errors.email = "Invalid email address.";
    isValid = false;
  }

  if (!passRegex.test(formData.password)) {
    errors.password = "Password must be 6-15 chars, include letters and digits.";
    isValid = false;
  }

  return { isValid, errors };
};

// =======================
// Login Validation
// =======================
export function Login(formData) {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// =======================
// Forgot Password Validation
// =======================
export const validateForgotPassword = (formData) => {
  const errors = {};
  let isValid = true;

  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email address";
    isValid = false;
  }

  return { isValid, errors };
};

// =======================
// Product Validation
// =======================
export const validateProductForm = (product) => {
  const errors = {};
  let isValid = true;

  if (!product.name || !product.name.trim()) {
    errors.name = "Product name is required.";
    isValid = false;
  }

  if (!product.description || !product.description.trim()) {
    errors.description = "Description is required.";
    isValid = false;
  }

  if (!product.price || isNaN(product.price) || product.price <= 0) {
    errors.price = "Enter a valid positive price.";
    isValid = false;
  }

  if (!product.category || !product.category.trim()) {
    errors.category = "Category is required.";
    isValid = false;
  }

  if (!product.subCategory || !product.subCategory.trim()) {
    errors.subCategory = "Subcategory is required.";
    isValid = false;
  }

  if (!product.stock || isNaN(product.stock) || product.stock < 0) {
    errors.stock = "Enter a valid stock quantity.";
    isValid = false;
  }

  if (!product.image) {
    errors.image = "Product image is required.";
    isValid = false;
  } else if (
    !["image/jpeg", "image/png", "image/webp"].includes(product.image.type)
  ) {
    errors.image = "Only JPG, PNG, or WEBP images are allowed.";
    isValid = false;
  }

  return { isValid, errors };
};

// =======================
// Checkout Form Validation
// =======================
// =======================
// Checkout Form Validation (Razorpay Compatible)
// =======================
export const validateCheckoutForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Billing Details
  if (!formData.name || !formData.name.trim()) {
    errors.name = "Full name is required.";
    isValid = false;
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required.";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email address.";
    isValid = false;
  }

  if (!formData.address || !formData.address.trim()) {
    errors.address = "Address is required.";
    isValid = false;
  }

  if (!formData.city || !formData.city.trim()) {
    errors.city = "City is required.";
    isValid = false;
  }

  if (!formData.state || !formData.state.trim()) {
    errors.state = "State is required.";
    isValid = false;
  }

  if (!formData.zip || !/^\d{5,6}$/.test(formData.zip)) {
    errors.zip = "Enter a valid ZIP code.";
    isValid = false;
  }

  if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
    errors.phone = "Enter a valid 10-digit phone number.";
    isValid = false;
  }

  // 🚫 DO NOT validate card / upi
  // Razorpay handles all payment details securely

  return {
    isValid,
    errors,
  };
};

