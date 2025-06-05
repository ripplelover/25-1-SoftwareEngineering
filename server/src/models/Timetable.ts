import mongoose, { Document, Schema } from 'mongoose';

export interface ITimetableEntry {
  day: string; // 예: '월', '화', ...
  period: number; // 교시
  course: mongoose.Types.ObjectId; // Course 참조
}

export interface ITimetable extends Document {
  user: mongoose.Types.ObjectId;
  year: number;
  semester: number;
  entries: ITimetableEntry[];
}

const timetableEntrySchema = new Schema<ITimetableEntry>({
  day: { type: String, required: true },
  period: { type: Number, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true }
});

const timetableSchema = new Schema<ITimetable>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  entries: [timetableEntrySchema]
});

export const Timetable = mongoose.model<ITimetable>('Timetable', timetableSchema); 