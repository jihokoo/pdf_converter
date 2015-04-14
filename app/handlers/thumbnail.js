var mongoose = require("mongoose"),
  path = require("path"),
  fs = require("fs"),
  exec = require("child_process").exec,
  Thumbnail = mongoose.model("Thumbnail");

// Module to stream files to s3
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'jihokoo-miscellaneous'} } );

var s3ThumbnailURL = "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/";

function getAll (request, reply) {
  Thumbnail.find(function(err, thumbnails) {
    if (err) {
      reply(500, err);
    } else {
      reply(thumbnails);
    }
  });
}

function create (request, reply) {
  var file = request.payload.file;
  var name = file.hapi.filename;

  var tempPath = path.normalize(__dirname + '/../../public/files/' + name);
  var tempFile = fs.createWriteStream(tempPath); // Create write stream to our temporary path

  file.pipe(tempFile); // Pipe pdf from payload into temporary file
  file.on('end', function(err) {

    if (err) {
      reply(500, err);
    } else {
      var thumbName = name.replace(/\.(pdf)$/, '') + "_thumb_";

      // Use imageMagick to convert to png and resize to thumbnail
      var convert = "convert -density 300 ./public/files/" + name + " -resize 43x65^ -gravity center ./public/thumbnails/" + thumbName +"%d.png";
      // Pipe list of thumbnails to grep to select
      var printFileNames = "ls ./public/thumbnails | grep " + thumbName;

      // Use exec over spawn since we're not waiting on data
      exec(convert + " && " + printFileNames, function(err, stdout, stderr) {

        removeLocal(tempPath); // Remove local copy of pdf file

        if (err) {
          reply(500, err);
        } else {
          var thumbnail;
          var thumbnails = [];
          var fileNames = stdout.split('\n');

          fileNames.forEach(function(fileName){
            if (fileName.length > 0) {
              thumbnail = {
                name: fileName,
                url: s3ThumbnailURL + fileName
              };

              thumbnails.push(thumbnail);
            }
          });

          Thumbnail.create(thumbnails, function(err) {
            if (err) {
              reply(500, err);
            }

            reply(thumbnails);
          });

          fileNames.forEach(function(fileName) {
            if (fileName.length > 0) {
              uploadAndRemoveLocal(fileName);
            }
          });
        }
      });
    }
  });
}

function uploadAndRemoveLocal (fileName) {
  var filePath = "./public/thumbnails/" + fileName;

  var fileStream = fs.createReadStream(filePath);
  var data = {
    Key: "Thumbnails/" + fileName,
    Body: fileStream,
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  };

  s3Bucket.putObject(data, function(err, data){
      if (err) {
        console.err("upload", err);
      }

      removeLocal(filePath);
  });
}

function removeLocal (filePath) {
  fs.unlink(filePath, function (err) {
    if (err) {
        console.err("unlink", err);
    }
  });
}

module.exports = {
  getAll: getAll,
  create: create
};
