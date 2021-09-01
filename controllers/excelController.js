const mysql = require("mysql");
const path = require("path");
const readXlsxFile = require("read-excel-file/node");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

exports.excel_upload = (req,res,next) => {
    try{
        let filePath = path.resolve("public/uploads/" + req.file.filename);
        readXlsxFile(filePath).then(rows => {
            rows.shift();
            const customers = [];
            let length = rows.length;
            for(let i=0; i<length; i++){
                let customer = {
                    name: rows[i][0],
                    email: rows[i][1],
                    aadhar: rows[i][2]
                }
                customers.push(customer);
                db.query('INSERT INTO  members SET ?',{ 
                    user_id:req.user.id,
                    name:customer.name,
                    email:customer.email,
                    aadhar:customer.aadhar },(error,results) => {
                    if(error){
                        console.log(error);
                    }  
                    else{
                        return res.render('members',{
                            message:'Uploaded successfully'
                        }) 
                    } 
                });
            }
        });
    }catch(error){
        const result = {
            status: "fail",
            filename: req.file.originalname,
            message: "Upload Error! message = " + error.message
        }
        res.json(result);
    }
}