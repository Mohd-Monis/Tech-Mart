const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

const uri  = proces.env.MONGO_URI;


const uri = process.env.MONGO_URI;
function createSession(){
    const store = mongoDBStore({
        uri:uri,
        uri:uri,
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
