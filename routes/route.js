const express = require("express");
const router = express.Router();
const multer = require("multer");
const authController = require('../controllers/authController');
const excelController = require('../controllers/excelController');
// const upload = require('../middleware/upload');


const multerStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads");
  },
  
  filename: function(req, file, cb) {
   
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});


const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const upload = multer({ dest: 'public/upload/event'});

const uploadEventPhoto = upload.single("file");

router.get("/",(req,res) =>{res.render("register")});

router.get("/register",(req,res) =>{res.render("register")});
router.post('/register',authController.register)

router.get("/login",(req,res) =>{ res.render("login",{ message:req.flash('error')} )});
router.post('/login',authController.login)

router.get("/dashboard",authController.checklogin,authController.dashboard);
router.get("/members",authController.checklogin,authController.members);

router.post('/excel/upload',uploadEventPhoto,excelController.excel_upload)

router.get('/logout', function(req, res){
    req.logout();
    // req.session.destroy();
    res.redirect('/login');
  });


module.exports = router;