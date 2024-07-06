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
        const actualProduct = await Product.fetch(id);
        this.productNumber++;
        this.total+= +actualProduct.price;
        for (let i of this.products) {
            if (i.actualProduct._id.equals(actualProduct._id)) {
                i.number++;
                return { total_product_num : this.productNumber, curr_product_num : i.number};
            }
        }
        this.products.push({
            actualProduct : actualProduct,
            number:1,
            productNumber: 1,
        })
        return {total_product_num : this.productNumber,curr_product_num : 1};
    }

    async reduceProduct(id){
        const actualProduct = await Product.fetch(id);
        this.productNumber--;
        this.total-= actualProduct.price;
        let curr_product_num = 0;
        for(let i = 0; i < this.products.length; i++){
            if(this.products[i].actualProduct._id.equals(actualProduct._id)){
                curr_product_num = --this.products[i].number;
                if(this.products[i].number == 0){
                    this.products.splice(i,1);
                }
            }
        }
        return {total_product_num : this.productNumber, curr_product_num : curr_product_num};
    }
    
    refresh(){
        this.productNumber = 0;
        this.total = 0;
        this.products = [];
    }

}

module.exports = Cart;