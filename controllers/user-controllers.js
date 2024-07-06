const User = require("../models/user");
const Order = require('../models/order');
const { name } = require("ejs");

const stripe = require('stripe')(process.env.STRIPE);

function getProfile(req,res){
    res.render("user/profile",{user : req.session.user, csrfToken: req.csrfToken()})
}

async function editProfile(req,res){
    console.log("street is: ")
    console.log(req.body.street);
    console.log("user email is ; ")
    console.log(req.session.user.email)
    const user = req.session.user;
    const new_user = new User(user.name,user.email,user.password,{
        line1: req.body.street,
        postal_code : req.body.postal_code,
        city : req.body.city,
        country : req.body.country,
    },user._id)
    
    await new_user.edit();
    req.session.user = await User.fetch(req.session.user.email);
    res.redirect("/")
}

async function addIntoCart(req, res) {
    const user = req.session.user;
    const newUser = new User(user.name, user.email, user.password, user.address, user._id);
    let response;
    try {
        response = await newUser.addProductInCart(req.params.id);
    }
    catch (error) {
        console.log(error);
        return res.status(500).render("shared/500");
    }
    res.json({
        message: "cart updated",
        totalItems: newUser.cart.productNumber,
        ...response,
        total: newUser.cart.total,
    })
    req.session.user = await User.fetch(user.email);
    req.session.save();
}

async function reduceFromCart(req, res) {
    const user = req.session.user;
    const newUser = new User(user.name, user.email, user.password, user.address, user._id);
    let response;
    try {
        response = await newUser.removeProductFromCart(req.params.id);
    }
    catch (error) {
        console.log(error);
        return res.status(500).render("shared/500");
    }
    res.json({
        message: "cart updated",
        totalItems: newUser.cart.productNumber,
        ...response,
        total: newUser.cart.total,
    })
    req.session.user = await User.fetch(user.email);
    req.session.save();
}



async function getCart(req, res) {
    const user = await User.fetch(req.session.user.email);
    const cart = user.cart;
    console.log(cart.products)
    res.render("user/cart", { Products: cart.products, totalPrice: cart.total, userId: req.session.user._id, csrfToken: req.csrfToken() })
}

async function order(req, res) {
    let user = req.session.user;
    const order = new Order(user.cart, user._id);
    let cart = user.cart;
    await order.save();
    user = new User(user.name, user.email);
    await user.deleteCart();
    
    const session = await stripe.checkout.sessions.create({
        line_items: cart.products.map(function (item) {
            return {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.actualProduct.name,
                    },
                    unit_amount: +item.actualProduct.price*100,
                },
                quantity: item.number,
            }      
        }),
        mode: 'payment',
        customer : req.session.user.stripe_id,
        success_url: `http://localhost:3000/user/orders`,
        cancel_url: `http://locahost:3000/user/cancel`,
    });

    res.redirect(303, session.url);
}

async function getAllOrders(req, res) {
    const orders = await Order.fetchAll(req.session.user._id);
    console.log(orders);
    // return res.redirect("/cart");
    res.render("user/orders", { Orders: orders });
}

module.exports = {
    addIntoCart: addIntoCart,
    getCart: getCart,
    reduceFromCart: reduceFromCart,
    order: order,
    getAllOrders: getAllOrders,
    getProfile : getProfile,
    editProfile: editProfile,
}