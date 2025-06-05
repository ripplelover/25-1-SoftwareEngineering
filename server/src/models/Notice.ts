import mongoose, { Document, Schema } from 'mongoose';

export interface INotice extends Document {
  course: mongoose.Types.ObjectId;
  professor: mongoose.Types.ObjectId;
  title: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: Date;
  views: number;
}

const noticeSchema = new Schema<INotice>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  professor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  fileUrl: { type: String },
  fileName: { type: String },
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 }
});

export const Notice = mongoose.model<INotice>('Notice', noticeSchema); 