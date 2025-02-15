import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  courseId: number;

  @Prop({ type: String, enum: ['enrolled', 'cancelled'], default: 'enrolled' })
  status: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
