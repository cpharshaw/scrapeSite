var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var JobSchema = new Schema({
  // `title` is required and of type String
  linkedinID: {
    type: String,
    required: true,
    unique: true
  },
  datajk: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  desc: {
    type: String
  }, 
  link: {
    type: String,
    required: true
  },
  insertDate: {
    type: Date,
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ],

});


// This creates our model from the above schema, using mongoose's model method
var Job = mongoose.model("Job", JobSchema);

// Export the Article model
module.exports = Job;
