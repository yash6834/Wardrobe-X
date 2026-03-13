// =======================
// User Registration Validation
// =======================
export const validateUserForm = (formData) => {

  const errors = {};
  let isValid = true;

  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,15}$/;


  /* NAME */

  if (!formData.name || formData.name.trim() === "") {

    errors.name = "Name is required";
    isValid = false;

  } else if (!nameRegex.test(formData.name)) {

    errors.name = "Name should contain only letters and spaces";
    isValid = false;

  }


  /* PHONE */

  if (!formData.phone || formData.phone.trim() === "") {

    errors.phone = "Phone number is required";
    isValid = false;

  } else if (!phoneRegex.test(formData.phone)) {

    errors.phone = "Enter a valid 10-digit phone number starting with 6-9";
    isValid = false;

  }


  /* EMAIL */

  if (!formData.email || formData.email.trim() === "") {

    errors.email = "Email is required";
    isValid = false;

  } else if (!emailRegex.test(formData.email)) {

    errors.email = "Enter a valid email address";
    isValid = false;

  }


  /* PASSWORD */

  if (!formData.password || formData.password.trim() === "") {

    errors.password = "Password is required";
    isValid = false;

  } else if (!passRegex.test(formData.password)) {

    errors.password = "Password must be 6-15 characters with letters and numbers";
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

  /* EMAIL VALIDATION */

  if (!formData.email || formData.email.trim() === "") {

    errors.email = "Email is required";

  } else if (!emailRegex.test(formData.email)) {

    errors.email = "Enter a valid email address";

  }


  /* PASSWORD VALIDATION */

  if (!formData.password || formData.password.trim() === "") {

    errors.password = "Password is required";

  } else if (formData.password.length < 6) {

    errors.password = "Password must be at least 6 characters";

  } else if (formData.password.length > 50) {

    errors.password = "Password is too long";

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

