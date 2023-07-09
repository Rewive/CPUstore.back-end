const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/api/product/', controller.createProduct); //добавить новый продукт (товар)
router.get('/api/product/', controller.readAllProducts); //запросить все существующие продукты (товары)
router.get('/api/product/:id', controller.readProduct); //запросить конкретный продукт (товар) по ID
router.delete('/api/product/', controller.deleteAllProducts); //удалить все продукты (товары) из БД
router.delete('/api/product/:id', controller.deleteProduct); //удалить конкретный продукт (товар) из БД по ID
router.post('/api/product/addFromJSON', controller.addProductsFromJSON); //добавить продукты из JSON файла
router.get('/api/warehouse/', controller.readAllWarehouses); //запросить информацию обо всех складах
router.get('/api/warehouse/:id', controller.readWarehouse); //запросить информацию о конкретном складе по ID

module.exports = router;
