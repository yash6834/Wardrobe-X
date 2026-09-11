const Banner = require("../models/Banner");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ==========================================
// Upload image to Cloudinary
// ==========================================
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "wardrobe-x/banners",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


// ==========================================
// CREATE BANNER
// ==========================================
exports.createBanner = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const banner = new Banner({
      title: req.body.title,
      subtitle: req.body.subtitle,
      link: req.body.link,
      order: req.body.order,
      image: imageUrl,
      isActive: true,
    });

    await banner.save();

    res.json(banner);

  } catch (error) {
    console.error("❌ Create Banner Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET BANNERS
// ==========================================
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });

    res.json(banners);

  } catch (error) {
    console.error("❌ Get Banners Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// DELETE BANNER
// ==========================================
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    res.json({
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error("❌ Delete Banner Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE BANNER
// ==========================================
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    const updateData = {
      title: req.body.title ?? banner.title,
      subtitle: req.body.subtitle ?? banner.subtitle,
      link: req.body.link ?? banner.link,
      order: req.body.order ?? banner.order,
      isActive: banner.isActive,
    };

    // Toggle active status
    if (req.body.toggle) {
      updateData.isActive = !banner.isActive;
    }

    // Upload new image to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      updateData.image = result.secure_url;

      // Delete old Cloudinary image if possible
      if (
        banner.image &&
        banner.image.includes("res.cloudinary.com")
      ) {
        try {
          const parts = banner.image.split("/upload/")[1];

          if (parts) {
            const publicIdWithExtension = parts
              .split("/")
              .slice(1)
              .join("/");

            const publicId = publicIdWithExtension
              .replace(/\.[^/.]+$/, "");

            await cloudinary.uploader.destroy(publicId);
          }
        } catch (deleteError) {
          console.log(
            "⚠️ Could not delete old Cloudinary image:",
            deleteError.message
          );
        }
      }
    }

    const updated = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("❌ Update Banner Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};