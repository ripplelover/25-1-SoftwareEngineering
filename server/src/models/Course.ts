import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  professor: string;
  room: string;
  time: string;
  user: mongoose.Types.ObjectId; // 수강 학생
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  professor: { type: String, required: true },
  room: { type: String, required: true },
  time: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Course = mongoose.model<ICourse>('Course', courseSchema); 