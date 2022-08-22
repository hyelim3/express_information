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

//db수정
app.patch("/members/check/:id", async (req, res) => {
  const { id } = req.params;
  const [[memberRow]] = await pool.query(
    `
    select *
    from member
    where id =?
    `,
    [id]
  );
  if (!memberRow) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }
  await pool.query(
    `
    UPDATE member
    set checked = ?
    where id =?
    `,
    [!memberRow.checked, id]
  );

  const [updatedMembers] = await pool.query(
    `
    select *
    from member
    order by id ASC
    `
  );
  res.json(updatedMembers);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
