import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  content: string;
  dueDate: Date;
  type: 'assignment' | 'notice';
}

const assignmentSchema = new Schema<IAssignment>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  dueDate: { type: Date, required: true },
  type: { type: String, enum: ['assignment', 'notice'], required: true }
});

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema); 