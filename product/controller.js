const express = require('express');
const Product = require('../models/Product');
const Warehouse = require('../models/Warehouse');
const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid');
const faker = require('faker');

module.exports.getProduct = async (req, res) => {
    const { product } = req.body;
    try {
        const checkprod = await Product.get({ product });
        if (checkprod) {
            await Product.set({ product }, { $push: { members: getUserData(check) } });
            const checkprod = await Product.get({ product });
            return res.status(200).json(checkprod)
        }
        res.status(400).json({ error: "Bad Request", msg: "Данного продукта не существует" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

//CRUD
module.exports.createProduct = async (req, res) => {
    try {
        const newProductData = { ...req.body, barcode: uuidv4() };
        const newProduct = new Product(newProductData);
        await newProduct.save();

        // Generate warehouse data for the new product
        const newWarehouseData = {
            productId: newProduct.id,
            date: dayjs().format(),
            quantity: faker.datatype.number({ min: 0, max: 100 }),
            address: faker.address.streetAddress()
        };
        const newWarehouse = new Warehouse(newWarehouseData);
        await newWarehouse.save();

        res.status(201).json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports.readProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);

        // Delete associated warehouse data
        await Warehouse.deleteMany({ productId: id });

        res.status(200).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports.deleteAllProducts = async (req, res) => {
    try {
        await Product.deleteMany({});

        // Delete all warehouse data
        await Warehouse.deleteMany({});

        res.status(200).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports.readAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

const fs = require('fs');
const path = require('path');
const bwipjs = require('bwip-js');

module.exports.addProductsFromJSON = async (req, res) => {
    try {
        const productsData = req.body;
        productsData.forEach(async productData => {
            const newProductData = { ...productData, barcode: uuidv4() };
            const newProduct = new Product(newProductData);
            await newProduct.save();

            // Generate barcode image for the new product
            bwipjs.toBuffer({
                bcid: 'code128',
                text: newProduct._id.toString(),
                scale: 3,
                height: 10,
                includetext: true,
                textxalign: 'center'
            }, async function (err, png) {
                if (err) { } else {
                    const publicPath = path.resolve(__dirname, '..', 'public');
                    const barcodeImagePath = path.join(publicPath, `${newProduct._id.toString()}.png`);
                    fs.writeFileSync(barcodeImagePath, png);
                    const newWarehouseData = {
                        productId: newProduct.id,
                        productName: newProduct.name,
                        productImage: newProduct.image,
                        productBarcode: newProduct._id.toString(),
                        productBarcodeImage: `${newProduct._id.toString()}.png`,
                        date: dayjs().format(),
                        quantity: faker.datatype.number({ min: 0, max: 100 }),
                        address: faker.address.streetAddress()
                    };
                    const newWarehouse = new Warehouse(newWarehouseData);
                    await newWarehouse.save();
                }
            });
        });
        res.status(201).json({ message: "Success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports.readWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const warehouse = await Warehouse.findById(id);
        if (warehouse) {
            // Populate product data
            const product = await Product.findById(warehouse.productId);
            if (product) {
                warehouse.productName = product.name;
                warehouse.productImage = product.image;
                warehouse.productBarcode = product.barcode;
                warehouse.productBarcodeImage = product.barcodeImage;
            }
            res.status(200).json(warehouse);
        } else {
            res.status(404).json({ error: "Not Found", msg: "Данного склада не существует" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports.readAllWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        // Populate product data
        for (let i = 0; i < warehouses.length; i++) {
            const warehouse = warehouses[i];
            console.log(Number(warehouse.productId))
            const product = await Product.findOne({ id: Number(warehouse.productId) });
            console.log(product)
            if (product) {
                warehouse.productName = product.name;
                warehouse.productImage = product.image;
            }
        }
        res.status(200).json(warehouses);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}  