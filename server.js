const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const { nanoid } = require('nanoid'); // Unique ID Generator
const db = require('./database'); // MySQL Connection

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Test Route (Check if the server is running)
app.get('/', (req, res) => {
    res.send('✅ DCR Authentication System is Running!');
});

// ✅ Generate a Single QR Code and Save to MySQL
app.post('/generate', async (req, res) => {
    console.log("📌 Received POST request to /generate");

    try {
        const uniqueCode = nanoid(10); // Generate Unique Code
        const qrData = `https://dcr-auth.com/verify?code=${uniqueCode}`;
        const qrImage = await QRCode.toDataURL(qrData); // Generate QR Code

        console.log("🔹 Generated Code:", uniqueCode);

        // ✅ Save to MySQL
        const sql = "INSERT INTO products (code, qrCode) VALUES (?, ?)";
        db.query(sql, [uniqueCode, qrImage], (err, result) => {
            if (err) {
                console.error("❌ Error saving to database:", err);
                return res.status(500).json({ message: "❌ Error saving to database", error: err });
            }
            console.log("✅ Product saved to database:", uniqueCode);
            res.json({ message: "✅ Code Generated!", code: uniqueCode, qrCode: qrImage });
        });

    } catch (error) {
        console.error("❌ Error generating code:", error);
        res.status(500).json({ message: "❌ Error generating code", error });
    }
});

// ✅ Bulk Generate 10 QR Codes and Save to MySQL
app.post('/generate-multiple', async (req, res) => {
    console.log("📌 Received POST request to /generate-multiple");

    try {
        let codesArray = [];
        for (let i = 0; i < 10; i++) { // Generates 10 Unique Codes
            const uniqueCode = nanoid(10);
            const qrData = `https://dcr-auth.com/verify?code=${uniqueCode}`;
            const qrImage = await QRCode.toDataURL(qrData);
            codesArray.push([uniqueCode, qrImage]);
        }

        const sql = "INSERT INTO products (code, qrCode) VALUES ?";
        db.query(sql, [codesArray], (err, result) => {
            if (err) {
                console.error("❌ Error saving bulk data:", err);
                return res.status(500).json({ message: "❌ Error saving to database", error: err });
            }
            console.log("✅ Bulk products saved to database:", codesArray.map(c => c[0]));
            res.json({ message: "✅ Bulk Codes Generated!", codes: codesArray.map(c => c[0]) });
        });

    } catch (error) {
        console.error("❌ Error generating bulk codes:", error);
        res.status(500).json({ message: "❌ Error generating codes", error });
    }
});

// ✅ Verify Product Code
app.post('/verify', (req, res) => {
    console.log("📌 Received POST request to /verify");
    const { code } = req.body;

    if (!code) {
        console.log("⚠️ No code provided");
        return res.status(400).json({ message: '❌ Please enter a product code.', status: 'error' });
    }

    const sql = "SELECT qrCode FROM products WHERE code = ?";
    db.query(sql, [code], (err, results) => {
        if (err) {
            console.error("❌ Error verifying code:", err);
            return res.status(500).json({ message: "❌ Error verifying code", error: err });
        }

        if (results.length > 0) {
            console.log("✅ Product is authentic:", code);
            res.json({ message: '✅ Product is authentic!', status: 'valid', qrCode: results[0].qrCode });
        } else {
            console.log("❌ Invalid product code:", code);
            res.json({ message: '❌ Invalid product code.', status: 'invalid' });
        }
    });
});

// ✅ Start the Server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

//end point 
app.get('/codes', (req, res) => {
    const sql = "SELECT id, code, createdAt FROM products";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching codes:", err);
            return res.status(500).json({ message: "❌ Error retrieving codes", error: err });
        }

        res.json({ message: "✅ Codes Retrieved!", data: results });
    });
});
