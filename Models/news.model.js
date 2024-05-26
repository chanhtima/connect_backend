const mongoose = require("mongoose");
const createAutoIncrementIdPreHook = require("../libs/createAutoID");

const newsSchema = mongoose.Schema(
  {
    _id: Number,
    NE_name:String,
    NE_detail:String,
    NE_texteditor:String,
    NE_image:[{
        image_type: String,
        image: String,
    }],
  },
  { timestamps: true }
);
newsSchema.pre("save", createAutoIncrementIdPreHook(newsSchema));
module.exports = mongoose.model("newsModel", newsSchema);
