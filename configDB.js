
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database:"node"
});

db.connect();

// db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
//   });
   

const user = db.query('SELECT * FROM users u WHERE u.email = ?',('ashfak@cuion.in'),async (error,results) => {
    console.log(results);
});


db.end();


