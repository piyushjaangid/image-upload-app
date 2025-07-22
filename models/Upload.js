const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imagePath: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);
