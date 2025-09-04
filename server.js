const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Paths
const baseDir = path.join(__dirname);
const uploadDir = path.join(baseDir, 'uploads');
const videosFile = path.join(baseDir, 'videos.json');

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|ogg|mov|avi/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error('Only video files are allowed'));
  }
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(baseDir));
app.use('/uploads', express.static(uploadDir));

// Corrected Public pages for logged-out users
const publicPages = ['/', '/index', '/signup', '/login', '/watch', '/videos'];

// Access control middleware
app.use((req, res, next) => {
  const userLoggedIn = req.cookies.loggedInUser;
  const pathWithoutQuery = req.path.toLowerCase();

  if (!userLoggedIn && !publicPages.includes(pathWithoutQuery)) {
    return res.sendFile(path.join(baseDir, '404.html'));
  }
  next();
});

// Routes
app.get('/', (req, res) => res.sendFile(path.join(baseDir, 'index.html')));
app.get('/index', (req, res) => res.sendFile(path.join(baseDir, 'index.html')));
app.get('/upload', (req, res) => res.sendFile(path.join(baseDir, 'upload.html')));
app.get('/watch', (req, res) => res.sendFile(path.join(baseDir, 'watch.html')));
app.get('/login', (req, res) => res.sendFile(path.join(baseDir, 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(baseDir, 'signup.html')));

// Upload API
app.post('/upload', upload.single('video'), (req, res) => {
  const { title } = req.body;
  if (!req.file || !title) return res.status(400).json({ success: false, message: 'Missing video or title' });

  let videos = [];
  if (fs.existsSync(videosFile)) videos = JSON.parse(fs.readFileSync(videosFile));

  const videoData = {
    id: Date.now(),
    title,
    filename: req.file.filename,
    originalName: req.file.originalname,
    uploadedAt: new Date().toISOString()
  };

  videos.push(videoData);
  fs.writeFileSync(videosFile, JSON.stringify(videos, null, 2));

  res.json({ success: true, video: videoData });
});

// Fetch all videos
app.get('/videos', (req, res) => {
  if (fs.existsSync(videosFile)) res.json(JSON.parse(fs.readFileSync(videosFile)));
  else res.json([]);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));