import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "information",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
const port = 4000;
app.use(cors());

app.get("/member", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM member");

  res.json(rows);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
