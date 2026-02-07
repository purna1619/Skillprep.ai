import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  questions: {
    type: Array,
    required: true,
  },
});

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
