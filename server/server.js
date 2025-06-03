const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 라우트
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assignments', require('./routes/assignments'));

// 파일 업로드 라우트
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '파일이 없습니다.' });
  }
  res.json({
    fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
    fileName: req.file.originalname
  });
});

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/academic_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB 연결 성공'))
.catch(err => console.error('MongoDB 연결 실패:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`)); 