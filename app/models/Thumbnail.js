var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var ThumbnailSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  originalFileURL: {
    type: String,
    required: true
  }
});


ThumbnailSchema.methods = {
  asJSON: function(){
    return JSON.stringify(this);
  }
};

mongoose.model('Thumbnail', ThumbnailSchema);
