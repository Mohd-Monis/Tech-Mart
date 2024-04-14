const getDb = require("../data/database");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
class Order{
    constructor(cart,userId,id){
        this.date = new Date();
        this.cart = cart;
        this.deliveryStatus = "not delivered"; 
        this.userId = new ObjectId(userId);
        if(id)
        this.id = new ObjectId(id)
    }

    static async fetchAllforAdmin(){
        return await getDb().collection("Orders").find().sort({date:-1}).toArray();
    }
    static async fetchAll(id){
        console.log("id before objectId()");
        console.log(id);
        return await getDb().collection("Orders").find({userId: new ObjectId(id) }).sort({date:-1}).toArray();
    }
    
    static async updateStatus(value,id){
        console.log("tried to set status to required value");
        await getDb().collection("Orders").updateOne({_id: new ObjectId(id)},{ $set: {deliveryStatus: value}});
    }

    async save(){
        let cart = await JSON.stringify(this.cart);
        cart = await JSON.parse(cart);
        await getDb().collection("Orders").insertOne({
            date:this.date,
            cart:cart,
            deliveryStatus: this.deliveryStatus,
            userId: this.userId,
        });
    }

    async edit(data){
        await getDb().collection("Orders").updateOne(
            {_id : this.id} ,{ $set:  data}
        )
    };

    async del(){
        await getDb().collection("Orders").deleteOne({_id :  this.id})
    }
}

module.exports = Order;