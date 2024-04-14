const multer = require("multer");
const uuid = require("uuid").v4;


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./public/images/product-images/");
    },
    filename: function(req,file,cb){
        cb(null, uuid() + '-' + file.originalname)
    }
})

const upload = multer({storage:storage});

module.exports = upload.single('product-image')