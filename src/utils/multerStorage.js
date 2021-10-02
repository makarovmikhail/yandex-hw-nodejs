const path = require("path");
const fs = require("fs");
const File = require("../entities/File");
const db = require("../entities/Database");

function MyCustomStorage(opts) {
  this.getDestination = opts.destination || getDestination;
}

MyCustomStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  this.getDestination(req, file, function (err, path) {
    if (err) return cb(err);

    let outStream = fs.createWriteStream(path);

    file.stream.pipe(outStream);
    outStream.on("error", cb);
    outStream.on("finish", function () {
      db.insert(
        new File(
          file.imageId,
          outStream.bytesWritten,
          Date.now(),
          Buffer.from(JSON.stringify(file), "utf-8"),
          file.mimetype
        )
      );
      cb(null, {
        path: path,
        size: outStream.bytesWritten
      });
    });
  });
};

MyCustomStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  fs.unlink(file.path, cb);
};

module.exports = function (opts) {
  return new MyCustomStorage(opts);
};
