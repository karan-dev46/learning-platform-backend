const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facultyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    duration: { type: String }, // e.g. "3 months"
    price: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
