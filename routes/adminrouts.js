const router = require("express").Router();
const control = require("../controllers/admin-controllers");

const uploadMiddleware = require("../util/fileuploadmidddleware")

router.get('/add-product',control.getAddProductForm);

router.post('/add-product',uploadMiddleware,control.AddProduct);


router.get('/edit/:id',control.editProduct);


router.post('/edit/:id',uploadMiddleware,control.editProductPost)

router.delete('/delete/:id',control.deleteProduct)

router.get('/orders',control.getOrders)

router.post('/update-order-status',control.updateStatus)

module.exports = router