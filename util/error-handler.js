 function errorUser(req,res,next){
    res.status(404).render("shared/404");
}

function errorServer(error,req,res,next){
    console.log(error);
    res.status(500).render("shared/500");
}

module.exports = {
    errorUser:errorUser,
    errorServer:errorServer,
}