const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let db;

function getDb(){
    if(!db){
        let client = new mongoClient("mongodb://localhost:27017");
        client.connect();
        db = client.db("Shop")
    }
    return db;
}

module.exports = getDb;