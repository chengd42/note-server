require('dotenv').config();

const Note = require('./models/note');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>Hello from express!</h1>');
});

// get all notes
app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

// get a note
app.get('/api/notes/:id', (req, res, next) => {
  // const id = Number(req.params.id);
  // const note = notes.find((n) => n.id === id);
  // note ? res.json(note) : res.status(404).send('Bad Request');
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((e) => next(e));
});

// delete
app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id).catch((e) => next(e));
  res.status(204).end();
});

// post
app.post('/api/notes', (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
  });

  note
    .save()
    .then((note) => res.json(note))
    .catch((e) => next(e));
});

// toggle important
app.put('/api/notes/:id', (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important,
  };
  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((note) => res.json(note))
    .catch((e) => next(e));
});

// handle unknow endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// Error handler
const errorHandler = (error, req, res, next) => {
  console.log('error', error);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`express server running on port ${port}`);
});
