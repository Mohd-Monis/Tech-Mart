const User = require("../models/user");
const Order = require('../models/order');

const stripe = require('stripe')('sk_test_51OYrXGSIIvhxXi32CzJC9kbbm8xuDrWIVq6HfClyrwQWXAHojem5gKRffnvUBlk3gfOH7DZ5pp5ZVff1CDjzx8Ph00hnEJb5DZ');


async function addIntoCart(req, res) {
    const user = req.session.user;
    const newUser = new User(user.name, user.email, user.password, user.address, user._id);
    let productNumber;
    try {
        productNumber = await newUser.addProductInCart(req.params.id);
    }
    catch (error) {
        console.log(error);
        return res.status(500).render("shared/500");
    }
    res.json({
        message: "cart updated",
        totalItems: newUser.cart.productNumber,
        productNumber: productNumber,
        total: newUser.cart.total,
    })
    req.session.user = await User.fetch(user.email);
    req.session.save();
}

async function reduceFromCart(req, res) {
    const user = req.session.user;
    const newUser = new User(user.name, user.email, user.password, user.address, user._id);
    let productNumber;
    try {
        productNumber = await newUser.removeProductFromCart(req.params.id);
    }
    catch (error) {
        console.log(error);
        return res.status(500).render("shared/500");
    }
    res.json({
        message: "cart updated",
        totalItems: newUser.cart.productNumber,
        productNumber: productNumber,
        total: newUser.cart.total,
    })
    req.session.user = await User.fetch(user.email);
    req.session.save();
}


async function getCart(req, res) {
    const user = await User.fetch(req.session.user.email);
    const cart = user.cart;
    res.render("user/cart", { Products: cart.products, totalPrice: cart.total, userId: req.session.user._id, csrfToken: req.csrfToken() })
}

async function order(req, res) {
    let user = req.session.user;
    console.log("user id is: ")
    console.log(req.session.user._id);
    const order = new Order(user.cart, user._id);
    let cart = user.cart;
    await order.save();
    user = new User(user.name, user.email);
    await user.deleteCart();
    console.log("cart is: ")
    console.log(cart);
    const session = await stripe.checkout.sessions.create({
        line_items: cart.products.map(function (item) {
            return {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.actualProduct.name,
                    },
                    unit_amount: +item.actualProduct.price,
                },
                quantity: item.number,
            }      
        }),
        mode: 'payment',
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
}