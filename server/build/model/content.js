"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ContentSchema = new mongoose_1.default.Schema({
    owner: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    editors: { type: String },
    viewers: { type: String }
});
exports.Content = mongoose_1.default.model('Content', ContentSchema);
