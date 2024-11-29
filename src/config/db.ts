import mysql from "mysql";

const connection = mysql.createConnection({
  host:"localhost",
  user:"techwwpp_techwwpp_deolu",
  password:"0]6J7bx5JEE=",
  database:"techwwpp_homeyhost_booking_app",
});

connection.connect((error) => {
  if(error) throw error;
  console.info(`Connected to MySQL database`);
})

export default connection;