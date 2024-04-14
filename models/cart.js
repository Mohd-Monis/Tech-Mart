const getDb = require("../data/database");
const Product = require("./product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
class Cart {
    
    constructor(cart){
        if(!cart){
            this.productNumber = 0;
            this.total = 0;
            this.products = [];
            return;    
        }
        this.productNumber = cart.productNumber;
        this.total = cart.total;
        this.products = cart.products;
    }
    async addProduct(id) {
        let productNumber = 1;
        const actualProduct = await Product.fetch(id);
        this.productNumber++;
        this.total+= +actualProduct.price;
        for (let i of this.products) {
            if (i.actualProduct._id.equals(actualProduct._id)) {
                i.number++;
                productNumber = i.number;
                return productNumber;
            }
        }
        this.products.push({
            actualProduct,
            number:1,
            productNumber: productNumber,
        })
        return productNumber;
    }

    async reduceProduct(id){
        const actualProduct = await Product.fetch(id);
        let productNumber = 0;
        this.productNumber--;
        this.total-= actualProduct.price;
        for(let i = 0; i < this.products.length; i++){
            if(this.products[i].actualProduct._id.equals(actualProduct._id)){
                this.products[i].number--;
                productNumber = this.products[i].number;
                if(this.products[i].number == 0){
                    this.products.splice(i,1);
                }
            }
        }
        return productNumber;
    }
    
    refresh(){
        this.productNumber = 0;
        this.total = 0;
        this.products = [];
    }

}

module.exports = Cart;