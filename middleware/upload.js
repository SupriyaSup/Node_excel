const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //  cb(null, path.join(__dirname, '/public/uploads', file))
    console.log('hi');
    console.log(path.join(__dirname));
  },
  filename: (req, file, cb) => {
     cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});   
 
const upload = multer({storage: storage});

module.exports = upload;