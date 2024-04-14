const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

function getAddProductForm(req,res){
    const Token = req.csrfToken();
    res.render("add-product",{csrfToken: Token});
}

async function AddProduct(req,res){
    const productDetails = req.body
    const product = new Product(productDetails.price,productDetails.name,productDetails.summary,productDetails.description,req.file.filename)
   try{
    await product.save();
   }catch(error){
    console.log(error);
    return res.status(500).render("/shared/500");
   }
    res.redirect("/");
}




async function editProduct(req,res){
    let p;
    try{
        p = await Product.fetch(req.params.id);
    }catch(error){
        return res.status(500).render("shared/500");
    }
    res.render("admin/edit-product",{Product:p, csrfToken:req.csrfToken()});
}


async function editProductPost(req,res){
    const data = req.body;
    let filename;
    if(!req.file){
        
        let p ;
        try{
            p = await Product.fetch(req.params.id);
        }catch(error){
            return res.status(500).render("shared/500");
        }
        filename = p.image;
    }
    else{
        filename = req.file.filename;
    } 
    let P = new Product(data.price,data.name,data.summary,data.description,filename,req.params.id);
    try{
        await P.edit();
    }catch(error){
        return res.status(500).render("shared/500");
    }
    res.redirect("/view-products");
}

async function deleteProduct(req,res){
    try{
        await Product.del(req.params.id);
    }catch(error){
        return res.status(500).render("shared/500");
    }
    
    // res.redirect("/view-products");
    res.json({message: "deleted Product!"});
}

async function getOrders(req,res){
    console.log(User);
    const Orders = await Order.fetchAllforAdmin();
    
    await Promise.all(Orders.map(async function (i){
        i.user = await User.fetchById(i.userId);
        return i;
    }))
    console.log(Orders);
    // return res.redirect("/")
    res.render("admin/orders",{Orders:Orders,csrfToken:req.csrfToken()});
}


async function upateOrderStatus(req,res){
    let orderId = req.body.orderId;
    let value = req.body.status;
    await Order.updateStatus(value,orderId);
    return;
}


module.exports = {
    getAddProductForm: getAddProductForm,
    AddProduct:AddProduct,
    editProduct:editProduct,
    editProductPost: editProductPost,
    deleteProduct:deleteProduct,
    getOrders:getOrders,
    updateStatus:upateOrderStatus,
}


