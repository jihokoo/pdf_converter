var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var ThumbnailSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  }
});


ThumbnailSchema.methods = {
  asJSON: function(){
    return JSON.stringify(this);
  }
};

mongoose.model('Thumbnail', ThumbnailSchema);
