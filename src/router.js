const express = require('express');
const db = require("./database.js");

const router = express.Router();

router.get("/api/articles", (req, res, next) => {
    const sql = "select * from article";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(403).json({"error":err.message});
          return;
        }
        res.json({
            "message":"Success",
            "data":rows
        })
      });
});

router.get("/api/article/:id", (req, res, next) => {
    const sql = `select * from article where id = ${req.params.id}`;
    const params = [];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(403).json({"error":err.message});
          return;
        }
        // Can be better: Before submitting work, please make sure that all lines of code containing debugger and console.log are deleted.
        console.log('row: ', row);
        res.json({
            "message":"Success",
            "data":row
        });
      });
});

router.post("/api/article/", (req, res, next) => {
    const errors=[];
    if (!req.body.title){
        errors.push("title is required");
    }
    if (!req.body.body){
        errors.push("body is required");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    const data = {
        title: req.body.title,
        body: req.body.body,
        date: req.body.date
    };
    const sql ='INSERT INTO article (title, body, date) VALUES (?,?,?)';
    const params =[data.title, data.body, data.date];
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(403).json({"error": err.message});
            return;
        }
        res.json({
            "message": "Success",
            "data": data,
            "id" : this.lastID
        });
    });
});

router.put("/api/article/:id", (req, res, next) => {
    const data = {
        title: req.body.title,
        body: req.body.body
    };
    console.log(data);
    db.run(
        `UPDATE article set 
           title = COALESCE(?,title),
           body = COALESCE(?,body)
           WHERE id = ?`,
        [data.title, data.body, req.params.id],
        (err, result) => {
            if (err){
                console.log(err);
                res.status(403).json({"error": res.message});
                return;
            }
            res.json({
                message: "Success",
                data: data
            });
    });
});

router.delete("/api/article/:id", (req, res, next) => {
    db.run(
        'DELETE FROM article WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(403).json({"error": res.message});
                return;
            }
            res.json({"message":"Deleted", rows: this.changes});
    });
});

router.get("/", (req, res, next) => {
    res.json({"message":"Ok"});
});

module.exports = router;
