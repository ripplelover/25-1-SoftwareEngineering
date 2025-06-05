import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  professor: string;
  professorId: string;
  room: string;
  time: string;
  students: string[];
}

const courseSchema = new Schema({
  name: { type: String, required: true },
  professor: { type: String, required: true },
  professorId: { type: String, required: true },
  room: { type: String, required: true },
  time: { type: String, required: true },
  students: [{ type: String }]
});

export const Course = mongoose.model<ICourse>('Course', courseSchema); 