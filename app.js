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
app.use(express.json());

app.get("/member", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM member");

  res.json(rows);
});
//포스트맨 db수정
app.patch("/members/:id", async (req, res) => {
  const { id } = req.params;
  const { 거주지, 연락처 } = req.body;

  const [rows] = await pool.query(
    `
    select *
    from member
    where id =?
    `,
    [id]
  );

  if (rows.length === 0) {
    res.status(404).json({
      msg: "not found",
    });
  }

  if (!거주지) {
    res.status(400).json({
      msg: "거주지 required",
    });
  }

  if (!연락처) {
    res.status(400).json({
      msg: "연락처 required",
    });
  }

  const [rs] = await pool.query(
    `
    update member
    set 거주지 = ?,
    연락처 = ?
    where id = ?
    `,
    [거주지, 연락처, id]
  );

  const [updatedMembers] = await pool.query(
    `
    select *
    from member
    order by id asc
    `
  );
  res.json(updatedMembers);
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
//삭제 db연동
app.delete("/members/check/:id", async (req, res) => {
  const { id } = req.params;
  const [[memberRow]] = await pool.query(
    `
    select *
    from member
    where id =?
    `,
    [id]
  );

  if (memberRow === undefined) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  await pool.query(
    `
    delete
    from member
    where id = ?
    `,
    [id]
  );

  const [updatedMembers] = await pool.query(
    `
    select *
    from member
    order by id asc
     `
  );
  res.json(updatedMembers);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
