const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

function createSession(){
    const store = mongoDBStore({
        uri:"mongodb://localhost:27017",
        databaseName:"Shop",
        collection:"session"
    })
    return session({
        resave:false,
        saveUninitialized:false,
        store:store,
        secret:"monis"
    })
    
}

module.exports = createSession;