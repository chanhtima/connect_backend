const mongoose = require("mongoose");
const createAutoIncrementIdPreHook = require("../libs/createAutoID");


const productSchema=mongoose.Schema({
   _id:Number,
   PD_name:String,
   PD_category:String,
   PD_detail:String,
   PD_texteditor:String,
   PD_image:[{
       image_id:Number,
       image_type: String,
       image: String,
   }],
})
 productSchema.pre('save', createAutoIncrementIdPreHook(productSchema))

module.exports = mongoose.model('productModel',productSchema)