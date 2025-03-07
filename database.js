const mysql = require('mysql2');

// ✅ Create MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change to your MySQL username if different
    password: '123456', // Replace with your MySQL password
    database: 'dcr_auth'
});

// ✅ Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database!');
});

module.exports = db;
