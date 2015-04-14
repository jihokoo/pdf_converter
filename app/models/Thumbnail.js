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
  },
  imageUrl: {
    type: String,
    required: true,
    unique: true,
    select: false // hide this field to match the problem description
  }
});


ThumbnailSchema.methods = {
  asJSON: function(){
    return JSON.stringify(this);
  }
};

mongoose.model('Thumbnail', ThumbnailSchema);
