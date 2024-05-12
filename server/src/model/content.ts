import mongoose, { Document, Model, Schema } from 'mongoose';

interface IContent extends Document {
    owner: string;
    title: string;
    content: string;
    editors: string;
    viewers: string;
}

const ContentSchema: Schema<IContent> = new mongoose.Schema({
    owner: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    editors: { type: String },
    viewers: { type: String }
});

export const Content: Model<IContent> = mongoose.model<IContent>('Content', ContentSchema);