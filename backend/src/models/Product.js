const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    productSlug: { type: String, required: true, unique: true, trim: true },
    galleryImages: { type: [String], default: [] },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
