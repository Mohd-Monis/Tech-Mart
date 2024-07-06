const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let db;
const uri = process.env.MONGO_URI;
function getDb(){
    if(!db){
        let client = new mongoClient(uri);
        client.connect();
        db = client.db("Shop")
    }
    return db;
}

module.exports = getDb;