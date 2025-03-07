const mongoose = require('../database');

const ProductSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    qrCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
