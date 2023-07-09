const mongoose = require('./db');

const warehouseSchema = new mongoose.Schema({
    productId: { type: Number },
    productName: { type: String },
    productImage: { type: String },
    productBarcode: { type: String },
    date: { type: Date },
    quantity: { type: Number },
    address: { type: String }
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
