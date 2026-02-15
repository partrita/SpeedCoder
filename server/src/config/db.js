const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.ATLAS_URL;

if (!uri) {
  console.error("ERROR: ATLAS_URL environment variable is not defined!");
}

const client = new MongoClient(uri || "mongodb://localhost:27017/speedcoder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


let _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (db) {
        _db = db.db("speedcoder");
      }
      return callback(err);
    });
  },
  getDb: function () {
    return _db;
  },
};
