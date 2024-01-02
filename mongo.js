import mongoose from 'mongoose';
console.log('argvs', process.argv);

if (process.argv.length < 3) {
  console.log('please give a password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://cheng:${password}@cluster0.8vomgl0.mongodb.net/testNoteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: 'JavaScript is easy',
});

note.save().then(() => {
  console.log('note saved!');
  mongoose.connection.close();
});

Note.find({}).then((result) => {
  result.forEach((note) => console.log(note));
  mongoose.connection.close();
});
