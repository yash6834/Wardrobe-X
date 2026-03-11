const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ==============================
// CREATE FOLDERS IF NOT EXIST
// ==============================

const productDir = path.join(__dirname, "../uploads/products");
const cmsDir = path.join(__dirname, "../uploads/cms");

if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
  console.log("Products uploads folder created!");
}

if (!fs.existsSync(cmsDir)) {
  fs.mkdirSync(cmsDir, { recursive: true });
  console.log("CMS uploads folder created!");
}


// ==============================
// STORAGE CONFIG
// ==============================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    // detect route
    if (req.baseUrl.includes("cms")) {
      cb(null, cmsDir);
    }
    else if (req.baseUrl.includes("product")) {
      cb(null, productDir);
    }
    else {
      cb(null, productDir);
    }

  },

  filename: function (req, file, cb) {

    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, "img-" + uniqueSuffix + ext);

  },

});


// ==============================
// FILE FILTER
// ==============================

const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  }
  else {
    cb(new Error("Only image files allowed"), false);
  }

};


// ==============================
// LIMITS
// ==============================

const limits = {
  fileSize: 5 * 1024 * 1024,
};


// ==============================
// EXPORT
// ==============================

const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;