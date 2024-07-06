const bcrypt = require('bcryptjs');
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const getDb = require('../data/database');
const Cart = require('./cart');
const stripe = require('stripe')('sk_test_51OYrXGSIIvhxXi32kqD6dl9NfO36bNQtwaKqjnvL3ahtjGAt4oQuYrPuGXyW3XT11uVEyberwpy9JY1ZkTGKiPj200qHx9N2pV');

class User {
    constructor(name, email, password, address, id) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.cart = new Cart();
        if (id)
            this.id = new ObjectId(id);
    }
    static async checkUser(email, password) {
        const user = await getDb().collection("Users").findOne({ email: email });
        console.log(user);
        if (user && await bcrypt.compare(password, user.password)) return true;
        return false;
    }

    static async fetch(email) {
        return await getDb().collection("Users").findOne({ email: email });
    }

    static async fetchById(id){
        return await getDb().collection("Users").findOne({_id: new ObjectId(id)});
    }

    async save() {
        const customer = await stripe.customers.create({
            name : this.name,
            address : this.address,
            email : this.email, 
        })
        await getDb().collection("Users").insertOne({
            name: this.name,
            stripe_id : customer.id,
            email: this.email,
            password: await bcrypt.hash(this.password, 3),
            address: this.address,
            cart:this.cart,
        })
    }

    async edit() {
        const customer = await stripe.customers.create({
            name : this.name,
            address : this.address,
            email : this.email, 
        })
        console.log("inside edit!!");
        await getDb().collection("Users").updateOne({_id: this.id},{ $set: {address:this.address, stripe_id : customer.id}});
    };

    async addProductInCart(id){
        const user = await User.fetch(this.email);
        this.cart = new Cart(user.cart);
        let productNumber = await this.cart.addProduct(id);
        await getDb().collection("Users").updateOne({_id: this.id},{ $set: {cart:this.cart}});
        return productNumber;
    }
    
    async removeProductFromCart(id){
        const user = await User.fetch(this.email);
        this.cart = new Cart(user.cart);
        let productNumber = await this.cart.reduceProduct(id);
        await getDb().collection("Users").updateOne({_id: this.id},{ $set: {cart:this.cart}});
        return productNumber;
    }

    async deleteCart(){
        this.cart.refresh();
        await getDb().collection("Users").updateOne({email:this.email},{ $set: {cart:this.cart}});
    }

    async del() {
        await getDb().collection("Users").deleteOne({ _id: this.id })
    }

}


module.exports = User