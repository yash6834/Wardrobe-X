const Banner = require("../models/Banner");


exports.createBanner = async (req, res) => {
  try {

    const banner = new Banner({
      title: req.body.title,
      subtitle: req.body.subtitle,
      link: req.body.link,
      order: req.body.order,
      image: req.file
        ? `/uploads/cms/${req.file.filename}`
        : "",
      isActive: true
    });

    await banner.save();

    res.json(banner);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getBanners = async (req, res) => {

  const banners =
    await Banner.find().sort({ order: 1 });

  res.json(banners);

};


exports.deleteBanner = async (req, res) => {

  await Banner.findByIdAndDelete(req.params.id);

  res.json({
    message: "Deleted successfully"
  });

};


exports.updateBanner = async (req, res) => {
  try {

    const banner =
      await Banner.findById(req.params.id);

    if (!banner)
      return res.status(404).json({
        message: "Banner not found"
      });

    const updateData = {
      title: req.body.title ?? banner.title,
      subtitle: req.body.subtitle ?? banner.subtitle,
      link: req.body.link ?? banner.link,
      order: req.body.order ?? banner.order,
      isActive: banner.isActive
    };

    if (req.body.toggle)
      updateData.isActive =
        !banner.isActive;

    if (req.file)
      updateData.image =
        `/uploads/cms/${req.file.filename}`;

    const updated =
      await Banner.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
