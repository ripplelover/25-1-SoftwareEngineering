import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterial extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  content?: string;
  uploader: mongoose.Types.ObjectId;
  uploaderRole: 'professor' | 'student';
  fileUrl?: string;
  fileName?: string;
  createdAt: Date;
  viewCount: number;
}

const materialSchema = new Schema<IMaterial>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: { type: String },
  uploader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploaderRole: { type: String, enum: ['professor', 'student'], required: true },
  fileUrl: { type: String },
  fileName: { type: String },
  createdAt: { type: Date, default: Date.now },
  viewCount: { type: Number, default: 0 }
});

export const Material = mongoose.model<IMaterial>('Material', materialSchema); 