export const validateUserForm = (formData) => {
  const errors = {};
  let isValid = true;

  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,15}$/;

  if (!nameRegex.test(formData.name)) {
    errors.name = "Name must require";
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

// 🛍️ Product validation for AddProduct form
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

  /* if (!product.size || !product.size.trim()) {
    errors.size = "Size is required.";
    isValid = false;
  } */

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




export const validateCheckoutForm = (formData) => {
  const errors = {};
  let isValid = true;

  // --- Billing Details ---
  if (!formData.name.trim()) {
    errors.name = "Full name is required.";
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email address.";
    isValid = false;
  }

  if (!formData.address.trim()) {
    errors.address = "Address is required.";
    isValid = false;
  }

  if (!formData.city.trim()) {
    errors.city = "City is required.";
    isValid = false;
  }

  if (!formData.state.trim()) {
    errors.state = "State is required.";
    isValid = false;
  }

  if (!/^\d{5,6}$/.test(formData.zip)) {
    errors.zip = "Enter a valid ZIP code.";
    isValid = false;
  }

  if (!/^[6-9]\d{9}$/.test(formData.phone)) {
    errors.phone = "Enter a valid 10-digit phone number.";
    isValid = false;
  }

  // --- Payment Validation ---
  if (formData.paymentMethod === "card") {
    if (!formData.cardName.trim()) {
      errors.cardName = "Name on card is required.";
      isValid = false;
    }

    if (!/^\d{16}$/.test(formData.cardNumber)) {
      errors.cardNumber = "Card number must be 16 digits.";
      isValid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      errors.expiry = "Expiry must be in MM/YY format.";
      isValid = false;
    }

    if (!/^\d{3}$/.test(formData.cvv)) {
      errors.cvv = "CVV must be 3 digits.";
      isValid = false;
    }
  }

  if (formData.paymentMethod === "upi") {
    if (!formData.upiId.trim()) {
      errors.upiId = "UPI ID is required.";
      isValid = false;
    } else if (!/^[\w.-]+@[\w]+$/.test(formData.upiId)) {
      errors.upiId = "Enter a valid UPI ID (e.g., username@bank).";
      isValid = false;
    }
  }

  // COD requires no additional validation
  // You can add future validations for COD if needed

  return { isValid, errors };
};


