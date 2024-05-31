const moongoose = require("mongoose");
const createAutoIncrementIdPreHook = require("../libs/createAutoID");

const contactSchema = moongoose.Schema(
  {
    _id: Number,
    fullName: String,
    email: String,
    telephone: String,
    subject: String,
    message: String,
  },
  { timestamps: true }
);

contactSchema.pre("save", createAutoIncrementIdPreHook(contactSchema));
module.exports = moongoose.model("contactModel", contactSchema);
