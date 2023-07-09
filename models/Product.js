const mongoose = require('./db');

const articleSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    author: { type: String }
});

const prodSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    image: { type: String },
    category: { type: String },
    articles: [articleSchema]
});

const Product = mongoose.model('Product', prodSchema);

module.exports = Product;
