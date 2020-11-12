var app = require("express")();
var cors = require("cors");
const { ObjectID } = require("mongodb");
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var mresult = [];
app.use(cors());

app.get("/update/:ilanid/:userid/:username/:fiyat", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;

  var url =
    "mongodb+srv://murat:murat3838@cluster0-2yepv.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("test");
    var myquery = { ilanid: req.params.ilanid };
    var newvalues = {
      $set: {
        ilanid: req.params.ilanid,
        userid: req.params.userid,
        username: req.params.username,
        fiyat: req.params.fiyat,
      },
    };
    dbo.collection("teklif").updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      // console.log(res.result.nModified + " document(s) updated");
      io.emit("name", req.params.fiyat);
      db.close();
    });
  });

  res.end("end");
});
// ////////////////////

app.get("/tarih/:ilanid", async (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url =
    "mongodb+srv://murat:murat3838@cluster0-2yepv.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

  var t = [];
  await new Promise((resolve, rej) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("test");
      // console.log(req.params.ilanid);
      var query = { ilanid: req.params.ilanid };
      dbo
        .collection("teklif")
        .find(query)
        .toArray(async function (err, result) {
          if (err) throw err;
          t = result;
          // io.emit("name", t[0].fiyat);
          resolve("");

          db.close();
        });
    });
  }).then(async (resolve) => {
    if (t.length === 0) {
      await io.emit("name", "dahayok");
      res.end("");
    } else {
      await io.emit("name", t[0].fiyat);
      res.end("");
    }
  });
});




// ///////////////////////////



app.get("/:ilanid", async (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url =
    "mongodb+srv://murat:murat3838@cluster0-2yepv.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

  var t = [];
  await new Promise((resolve, rej) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      var dbo = db.db("test");
      // console.log(req.params.ilanid);
      var query = { ilanid: req.params.ilanid };
      dbo
        .collection("teklif")
        .find(query)
        .toArray(async function (err, result) {
          if (err) throw err;
          t = result;
          // io.emit("name", t[0].fiyat);
          resolve("");

          db.close();
        });
    });
  }).then(async (resolve) => {
    if (t.length === 0) {
      await io.emit("name", "dahayok");
      res.end("");
    } else {
      await io.emit("name", t[0].fiyat);
      res.end("");
    }
  });
});

// ///////////////////////
app.get(
  "/insertfiyat/:ilanid/:userid/:username/:fiyat/:date",
  async (req, res) => {
    var mresult = [];
    await io.emit("name", req.params.fiyat);
    var MongoClient = require("mongodb").MongoClient;
    var url =
      "mongodb+srv://murat:murat3838@cluster0-2yepv.gcp.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

    // if(mresult.length===0)
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;

      var myobj = {
        ilanid: req.params.ilanid,
        userid: req.params.userid,
        username: req.params.username,
        fiyat: req.params.fiyat,
        end_date: new Date(req.params.date),
      };
      var dbo = db.db("test");
      dbo.collection("teklif").insertOne(myobj, function (err, res) {
        if (err) throw err;
        // console.log("1 document inserted");

        db.close();
      });
    });
    res.end("");
  }
);

// ///////////////////
http.listen(8000, () => {
  console.log("listening on *:6000");
});

