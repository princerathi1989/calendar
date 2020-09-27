// Create express app
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./database.js");
const bcrypt = require("bcrypt");
const HTTP_PORT = 3000;

app.use(express.json());
app.use(cors());

const comparePasswords = async (entered, actual, res, err) => {
  try {
    if (await bcrypt.compare(entered, actual.password)) {
      res.status(200).json({
        success: true,
        id: actual.id,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch {
    res.status(500).json({ error: err.message });
  }
};

const getFormattedData = (req, rows) =>{
  let eventArray = [];
  if(rows[0].appointments) {
    eventArray = JSON.parse(rows[0].appointments);
    const eventIndex = eventArray.findIndex(el => el.id === req.body.data.id);
    if(eventIndex > -1) {
      eventArray[eventIndex] = req.body.data;
    } else {
      eventArray.push(req.body.data);
    }
  } else {
    eventArray.push(req.body.data);
  }
  return JSON.stringify(eventArray);
}

/** Registration */
app.post("/api/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const sql =
      "INSERT INTO user (firstName, lastName, email, phone, password) VALUES (?,?,?,?,?)";
    params = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.phone,
      hashedPassword,
    ];
    db.run(sql, params, function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      const sql = "INSERT INTO appointment (id, appointments) VALUES (?,?)";
      params = [this.lastID, []];
      db.run(sql, params, (err) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ success: true });
      });
    });
  } catch {
    res.status(400).send();
  }
});

/** Login */
app.post("/api/users/login", (req, res) => {
  const sql = "SELECT * FROM user WHERE email = ?";
  db.get(sql, req.body.email, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row == null) {
      res.status(200).json({
        success: false,
        message: "Unable to find the user",
      });
      return;
    }
    comparePasswords(req.body.password, row, res, err);
  });
});

/** Get Appointments */
app.get("/api/appointments/:id", (req, res) => {
  const sql = "SELECT * FROM appointment WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      data: row,
    });
  });
});

/** Save Appointments */
app.put("/api/appointments", (req, res) => {
  const sql = "SELECT * FROM appointment WHERE id = ?";
  db.all(sql, req.body.id, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }    
    const sql ="UPDATE appointment SET appointments = ? WHERE id = ?";
    params = [getFormattedData(req, rows), req.body.id];
    db.run(sql, params, function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(200).json({success: true});
    });
  });
});

/** Get Users */
app.get("/api/users", (_req, res) => {
  const sql = "SELECT * FROM user";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Default response for any other request
app.use(function (res) {
  res.status(404);
});

app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
