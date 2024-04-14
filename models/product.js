const getDb = require("../data/database");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
class Product{
    constructor(price,name,summary,description,image,id,number){
        this.price = +price;
        this.name = name;
        this.summary = summary;
        this.description = description;
        this.imageName = image;
        this.imageUrl = `images/product-images/${image}`
        this.number = number
        if(id)
        this.id = new ObjectId(id);
    }
 
    static async fetchAll(){
        const Products = await getDb().collection("Products").find().toArray();
        return Products;
    }
 
    static async fetch(id){
        return await getDb().collection("Products").findOne({_id: new ObjectId(id)});
    }

    async save(){
        await getDb().collection("Products").insertOne({
            price:this.price,
            name:this.name,
            summary:this.summary,
            description:this.description,
            image:this.imageName,
            imageUrl:this.imageUrl
        })
    }
    
    async edit(){
        await getDb().collection("Products").updateOne(
            {_id : this.id} ,{ $set:  {
                name:this.name,
                summary:this.summary,
                description: this.description,
                price: this.price,
                image: this.imageName,
                imageUrl:this.imageUrl,
            }}
        )
    };

    static async del(id){
        await getDb().collection("Products").deleteOne({_id : new ObjectId(id)})
    }
}

module.exports = Product;