const bcrypt = require('bcryptjs');
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const getDb = require('../data/database');
const Cart = require('./cart');

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
        await getDb().collection("Users").insertOne({
            name: this.name,
            email: this.email,
            password: await bcrypt.hash(this.password, 3),
            address: this.address,
            cart:this.cart,
        })
    }

    async edit(data) {
        await getDb().collection("Users").updateOne(
            { _id: this.id }, { $set: data }
        )
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