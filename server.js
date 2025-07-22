require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const Upload = require('./models/Upload');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file || !req.body.text) {
      return res.status(400).json({ error: 'Image and text required.' });
    }
    const newUpload = new Upload({
      text: req.body.text,
      imagePath: req.file.path
    });
    const saved = await newUpload.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
