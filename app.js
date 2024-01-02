import { MONGODB_URI } from './utils/config.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import middleware from './utils/middleware.js';
import notesRouter from './controllers/notes.js';

export const app = express();

mongoose.set('strictQuery', false);

console.log('connecting to mongoDB...', MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('connected to DB'))
  .catch((e) => console.log('error connecting to DB: ', e));

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);

// Error handler

app.use(middleware.errorHandler);
