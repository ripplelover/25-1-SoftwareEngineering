import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission {
  student: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  submittedAt: Date;
  score?: number;
  feedback?: string;
  gradedAt?: Date;
}

export interface IAssignment extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  content: string;
  dueDate: Date;
  type: 'assignment' | 'notice';
  submissions: ISubmission[];
}

const submissionSchema = new Schema<ISubmission>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  score: { type: Number, min: 0, max: 100 },
  feedback: String,
  gradedAt: Date
});

const assignmentSchema = new Schema<IAssignment>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  dueDate: { type: Date, required: true },
  type: { type: String, enum: ['assignment', 'notice'], required: true },
  submissions: [submissionSchema]
});

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema); 