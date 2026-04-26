import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    pdfUrl: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: "Untitled Video"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);