const express = require("express");
const app = express();
const createSaveSessoin = require('./controllers/session-controllers');
const saveSessoin = createSaveSessoin();
const authRouter = require('./routes/authroutes');
const userRouter = require('./routes/userroutes');
const adminRouter = require('./routes/adminrouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const csrf = require('@dr.pogodin/csurf');
const protectAdmin = require("./util/protectAdmin");
const error = require('./util/error-handler')
const path = require('path');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(saveSessoin);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(csrf({cookie:true}));




app.use(function(req,res,next){
    app.locals.isAuth = req.session.isAuth;
    app.locals.isAdmin = req.session.isAdmin;
    res.locals.isAuth = req.session.isAuth;
    res.locals.isAdmin = req.session.isAdmin;
    next();
})
app.use(authRouter);

app.use("/user",userRouter);

app.use('/admin/',protectAdmin)
app.use('/admin/',adminRouter);

app.use(error.errorServer);
app.use(error.errorUser);

app.listen(3000);

