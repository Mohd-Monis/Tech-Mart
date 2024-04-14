const User = require("../models/user");
const checkSignUpInput = require("../util/checkSignUpInput")
const {addErrorFlag,flushError} = require("../util/addErrorFlag");
const Product = require("../models/product")

function getHome(req, res) {
    if (!req.session.isAuth) {
        return res.redirect("login");
    }
    return res.render("home");
}

async function getLogIn(req, res) {
    let sessionInput = req.session.input;
    try{
        await flushError(req);
    } catch(error){
        return res.status(500).render("/shared/500")
    }
    if (!sessionInput) {
        sessionInput = req.session.input;
    }
    res.render("login",{csrfToken:req.csrfToken(), input: sessionInput});
}


async function getSignUp(req, res) {
    let sessionInput = req.session.input;
    try{
        await flushError(req);
    } catch(error){
        return res.status(500).render("/shared/500")
    }
    if (!sessionInput) {
        sessionInput = req.session.input;
    }
    res.render("signup", {
        input: sessionInput,
        csrfToken: req.csrfToken()
    });
}
async function postSignUp(req, res) {
    const data = req.body
    if (! await checkSignUpInput(data.name,data.email,data.password,data.street,data.postalCode,data.city,data.country)) {
        const body = req.body;
        try{
            await addErrorFlag(req, {
                hasError: true,
                name: req.body.name,
                email: req.body.email,
                street:  body.street,
                city:body.city,
                country: body.country,
                postalCode:body.postalCode,
                password: body.password
                
            },
                function () {
                    res.redirect("/signup")
                })
        } catch(error){
            res.status(500).render("/shared/500")
        }
        return;
    }
    await addErrorFlag(req, {
        hasError: false,
        name: '',
        email: '',
        address: '',
    },
        async function () {
            const user = new User(req.body.name, req.body.email, req.body.password, {
                street:req.body.street,
                postalCode:req.body.postalCode,
                city:req.body.city,
                country:req.body.country
            });
            await user.save();
            res.redirect("login");
        })

}

async function postLogin(req, res) {
    if (await User.checkUser(req.body.email, req.body.password)) {
        req.session.isAuth = true;
        req.session.user = await User.fetch(req.body.email);
        req.session.isAdmin = req.session.user.isAdmin;
        req.session.save(function () {
            return res.redirect("/");
        })
        return;
    }  
    addErrorFlag(req, { hasError : true, email : req.body.email,password : req.body.password})
    res.redirect("/login");
}

function logout(req,res){
    req.session.user = null;
    req.session.isAdmin = false;
    req.session.isAuth = false;
    res.redirect("/");
}


async function viewProduct(req,res){
    const Products =  await  Product.fetchAll();
    res.render("shared/products",{Products: Products, csrfToken: req.csrfToken()});
}

async function viewSingleProduct(req,res){
    const p = await Product.fetch(req.params.id);
    res.render("shared/view-product",{ Product: p , csrfToken: req.csrfToken()});

}

module.exports = {
    getHome:getHome,
    getLogIn:getLogIn,
    getSignUp:getSignUp,
    postSignUp:postSignUp,
    postLogin:postLogin,
    logout: logout,
    viewProduct:viewProduct,
    viewSingleProduct:viewSingleProduct,
}