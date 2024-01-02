import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app.js';
import Note from '../models/note.js';
import helper from './test_helper.js';

const api = supertest(app);

beforeEach(async () => {
  await Note.deleteMany({});
  console.log('cleared');
  for (let note of helper.initialNotes) {
    let noteObject = new Note(note);
    await noteObject.save();
    console.log('saved');
  }
  console.log('done');
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two notes', async () => {
  const res = await api.get('/api/notes');
  expect(res.body).toHaveLength(helper.initialNotes.length);
});

test('the first note is about HTTP methods', async () => {
  const res = await api.get('/api/notes');
  expect(res.body[0].content).toBe('HTML is easy');
});

test('a valid note can be posted', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  };

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const notesAtEnd = await helper.notesInDb();

  const contents = notesAtEnd.map((note) => note.content);

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);
  expect(contents).toContain('async/await simplifies making async calls');
});

test('note without content will not be added', async () => {
  const newNote = {
    important: false,
  };

  await api.post('/api/notes').send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(resultNote.body).toEqual(notesAtStart[0]);
});

test('a note can be deleted', async () => {
  console.log('entered test');
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();
  const contentsAtEnd = notesAtEnd.map((note) => note.content);

  expect(notesAtEnd.length).toBe(notesAtStart.length - 1);
  expect(contentsAtEnd).not.toContain(noteToDelete.content);
});

afterAll(async () => {
  await mongoose.connection.close();
});
