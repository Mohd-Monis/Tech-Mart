module.exports = function(req,res,next){
    if(!res.locals.isAuth){
        return res.status(401).render("shared/401");
    }
    
    if(!res.locals.isAdmin){
        return res.status(403).render("shared/403");
    }

    next();
}