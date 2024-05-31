const newsModel = require("../Models/news.model");

exports.postNews = async (req, res) => {
  const { _id, NE_name, NE_detail, NE_texteditor } = req.body;
  try {
    let images = [];
    if (req.files.length > 0) {
      for (let file of req.files) {
        if (file.size > 2 * 1024 * 1024) {
          // 2MB in bytes
          return res
            .status(400)
            .json({ success: false, message: "ขนาดของไฟล์ภาพต้องไม่เกิน 2MB" });
        }
        images.push({
          image_type: file.mimetype,
          image: file.buffer.toString("base64"),
        });
      }
    }

    const newsCreate = new newsModel({
      _id,
      NE_name,
      NE_detail,
      NE_texteditor,
      NE_image: images,
    });
    await newsCreate.save();
    res.status(201).json({
      success: true,
      NewsData: newsCreate,
    });
  } catch (error) {
    res.status(401).json({
      message: "Failed to create News",
      error: error.message,
    });
  }
};

exports.getList = async (req, res) => {
  try {
    const { page = 1, limit = 100, NE_name } = req.query;
    // filter
    let filter = {};
    if (NE_name) {
      filter.NE_name = { $regex: new RegExp(NE_name, "i") };
    }
    //  total
    const total = await newsModel.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    // get data
    const newsList = await newsModel
      .find(filter) // กรองข้อมูล
      .sort({ updatedAt: -1 }) // เรียงข้อมูลตามวันที่อัปเดตล่าสุด
      .limit(limit * 1) // limit ข้อมูล
      .skip((page - 1) * limit)
      .exec();
    // ส่งข้อมูลให้ user ดู
    res.status(200).json({
      success: true,
      page: pages,
      limit: limit,
      total: total,
      newsData: newsList,
    });
  } catch (error) {
    res.status(401).json({
      message: "Failed to get News",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    let updateData = req.body;
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        if (file.size > 2 * 1024 * 1024) {
          // 2MB in bytes
          return res
            .status(400)
            .json({ success: false, message: "ขนาดของไฟล์ภาพต้องไม่เกิน 2MB" });
        }
      }
      updateData.NE_image = req.files.map((file, index) => ({
        image_id: index + 1,
        image_type: file.mimetype,
        image: file.buffer.toString("base64"),
      }));
    }

    const options = { new: true };
    const updatedNews = await newsModel.findByIdAndUpdate(
      _id,
      updateData,
      options
    );
    if (!updatedNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }
    res.status(200).json({
      screen: true,
      newsId: updatedNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update News",
      error: error.message,
    });
  }
};

exports.removeNews = async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedNews = await newsModel.findOneAndDelete({ _id }).exec();
    if (!deletedNews) {
      return res
        .status(404)
        .json({ success: false, message: "ไม่พบข้อมูลที่ต้องการลบ" });
    }
    res.status(200).json({ success: true, message: "ลบข้อมูลสำเร็จ" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ไม่สามารถลบข้อมูลได้",
      error: error.message,
    });
  }
};
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const newsbyId = await newsModel.findById(id);
    if (!newsbyId) {
      return res.status(404).json("ไม่พบข้อมูลที่ต้องการ");
    }

    res.status(200).json({ success: true, newsById: newsbyId });
  } catch (error) {
    res.status(401).json({
      message: "Failed to get News",
      error: error.message,
    });
  }
};
