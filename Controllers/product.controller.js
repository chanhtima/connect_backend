const productModel = require("../Models/product.model");

exports.post = async (req, res) => {
  try {
    const product = new productModel({
      _id: req.body._id,
      PD_name: req.body.PD_name,
      PD_category: req.body.PD_category,
      PD_detail: req.body.PD_detail,
      PD_texteditor: req.body.PD_texteditor,
      PD_image: req.files.map((file, index) => ({
        image_id: index + 1,
        image_type: file.mimetype,
        image: file.buffer.toString("base64"),
      })),
    });
    await product.save();
    res.status(200).json({
      success: true,
      productData: product,
    });
  } catch (error) {
    res.status(409).json({
      message: "Failed to create Product",
      error: error.message,
    });
  }
};
exports.getList = async (req, res) => {
  try {
    const { page = 1, limit = 100, PD_name, PD_category } = req.query;
    let filter = {};
    if (PD_name) {
      filter.PD_name = { $regex: new RegExp(PD_name, "i") };
    }
    if (PD_category) {
      filter.PD_category = { $regex: new RegExp(PD_category, "i") };
    }
    const count = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);
    const productList = await productModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    res.status(200).json({
      success: true,
      page: totalPages,
      limit: limit,
      total: count,
      productData: productList,
    });
  } catch (error) {
    res.status(409).json({
      message: "Failed to get Product",
      error: error.message,
    });
  }
};

exports.patch = async (req, res) => {
  try {
    const _id = req.params.id;
    let updates = req.body;

    if (req.files && req.files.length > 0) {
      updates.PD_image = req.files.map((file, index) => ({
        image_id: index + 1,
        image_type: file.mimetype,
        image: file.buffer.toString("base64"),
      }));
    }

    const options = { new: true };
    const updatedProduct = await productModel.findByIdAndUpdate(
      _id,
      updates,
      options
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      productData: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "ไม่พบ id" });
    }

    await productModel.findOneAndDelete({ _id: id }).exec();
    res.status(200).json({ success: true, message: "ลบสินค้าสำเร็จ" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ไม่สามารถลบสินค้าได้",
      error: error.message,
    });
  }
};


exports.getById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ success: false, message: "ไม่พบ id" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "ไม่พบสินค้า" });
    }

    res.status(200).json({ success: true, productById: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ไม่สามารถดึงข้อมูลสินค้าได้",
      error: error.message,
    });
  }
};


