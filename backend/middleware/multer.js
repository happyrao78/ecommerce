import multer from "multer";

const storage =multer.diskStorage({
    
    // destination: function (req, file, cb) {
    //     cb(null, "C:/Users/HP/Desktop/Projects/Ecommerce Website/backend/middleware/uploads/")
    // },
      filename:function(req,file,callback){
        callback(null,file.originalname)
    }

})

var upload = multer({storage: storage,
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...')
    },
});

export default upload;