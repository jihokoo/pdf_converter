var Boom = require("boom"),
  mongoose = require("mongoose"),
  path = require("path"),
  fs = require("fs"),
  exec = require("child_process").exec,
  Thumbnail = mongoose.model("Thumbnail");

// Upload to s3 to avoid storing locally and taking up space
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/s3_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'jihokoo-miscellaneous'} } );

var s3ThumbnailUrl = "https://s3-us-west-1.amazonaws.com/jihokoo-miscellaneous/Thumbnails/";
var localUrl = "http://localhost:8000/thumbs/";

function getAll (request, reply) {
  Thumbnail.find().select('-_id -__v').exec(function(dbError, thumbnails) {
    if (dbError) {
      reply(dbError)
        .code(500);
    } else {
      reply(thumbnails);
    }
  });
}

function viewThumbnail (request, reply) {

  Thumbnail.findOne({name: request.params.fileName}).select('+imageUrl').exec(function(execError, thumbnail) {

    if (execError) {
      reply(execError)
        .code(500);
    } else {

      if (!thumbnail) {
        var error = Boom.badRequest("Thumbnail Not Found");
        error.output.statusCode = 404;
        reply(error);
      } else {
        var context = {
          imageUrl: thumbnail.imageUrl
        };

        reply.view('thumbnail', context);
      }
    }
  });
}

function create (request, reply) {
  var file = request.payload.file;
  var name = file.hapi.filename;

  var tempPath = path.normalize(__dirname + '/../../public/files/' + name);
  var tempFile = fs.createWriteStream(tempPath); // Create write stream to our temporary path

  file.pipe(tempFile); // Pipe pdf from payload into temporary file
  file.on('end', function(fileError) {
    if (fileError) {
      reply(fileError)
        .code(500);
    } else {
      var thumbName = name.replace(/\.(pdf)$/, '') + "_thumb_";

      // Use imageMagick to convert to png and resize to thumbnail
      var convert = "convert -density 300 ./public/files/" + name + " -resize 43x65^ -gravity center ./public/thumbnails/" + thumbName +"%d.png";
      // Pipe list of thumbnails to grep to select
      var printFileNames = "ls ./public/thumbnails | grep " + thumbName;

      // Use exec over spawn since we're not waiting on data
      exec(convert + " && " + printFileNames, function(execError, stdout, stderr) {

        removeLocal(tempPath); // Remove local copy of pdf file

        if (execError) {
          reply(execError)
            .code(500);
        } else {
          var thumbnail;
          var thumbnails = [];
          var fileNames = stdout.split('\n');

          fileNames.forEach(function(fileName){
            if (fileName.length > 0) {
              thumbnail = {
                name: fileName,
                url: localUrl + fileName,
                imageUrl: s3ThumbnailUrl + fileName
              };

              thumbnails.push(thumbnail);
            }
          });

          Thumbnail.create(thumbnails, function(dbError) {
            if (dbError) {
              reply(dbError)
                .code(500);
            }

            reply(thumbnails);
          });

          fileNames.forEach(function(fileName) {
            if (fileName.length > 0) {
              uploadToAWS(fileName); // upload thumbnail to aws s3 bucket
            }
          });
        }
      });
    }
  });
}

function uploadToAWS (fileName) {
  var filePath = "./public/thumbnails/" + fileName;

  var fileStream = fs.createReadStream(filePath);
  var data = {
    Key: "Thumbnails/" + fileName,
    Body: fileStream,
    ContentEncoding: 'base64',
    ContentType: 'image/png' // so aws lets us view image
  };

  s3Bucket.putObject(data, function(s3Error){
      if (s3Error) {
        console.err("upload", s3Error);
      }

      removeLocal(filePath); // remove thumbnails stored locally
  });
}

function removeLocal (filePath) {
  fs.unlink(filePath, function (fileError) {
    if (fileError) {
        console.err("unlink", fileError);
    }
  });
}

module.exports = {
  getAll: getAll,
  create: create,
  viewThumbnail: viewThumbnail
};
