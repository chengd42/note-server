const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to mongoDB...', url);

mongoose
  .connect(url)
  .then((result) => console.log('connected to DB'))
  .catch((e) => console.log('error connecting to DB: ', e));

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Note', noteSchema);