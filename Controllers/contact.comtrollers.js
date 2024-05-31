const contactModel = require("../Models/contact.model");

exports.create = async (req, res) => {
  try {
    const newContact = await contactModel(req.body).save();
    res.send(newContact);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server create Contact Error");
  }
};

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const total = await contactModel.countDocuments();
    const pages = Math.ceil(total / limit);
    const contactList = await contactModel
      .find({})
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    res.status(200).json({
      success: true,
      page: pages,
      limit: limit,
      total: total,
      contactData: contactList,
    });
  } catch (error) {
    res.status(500).send("Server get Data Contact Error");
    console.log(error);
  }
};
