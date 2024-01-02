import express from 'express';
import Note from '../models/note.js';

const notesRouter = express.Router();

// get all notes
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});
  console.log('all notes in db', notes);
  res.json(notes);
});

// get a note
notesRouter.get('/:id', async (req, res, next) => {
  try {
    const note = Note.findById(req.params.id);

    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

//post a note
notesRouter.post('/', async (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
  });
  try {
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

// delete a note
notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// change a note's important
notesRouter.put('/:id', async (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important,
  };
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {
      new: true,
    });
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

export default notesRouter;
