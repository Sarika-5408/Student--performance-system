const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Allowed MIME types (validate actual content, not just extension)
const ALLOWED_MIME_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
};

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk storage with randomized filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

// File filter — validate MIME type AND extension
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  // Check both extension and MIME type
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error(`File type not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}`), false);
  }

  if (!ALLOWED_MIME_TYPES[mimeType]) {
    return cb(new Error(`MIME type not allowed: ${mimeType}`), false);
  }

  // Ensure extension matches MIME type (prevent mismatch attacks)
  if (ALLOWED_MIME_TYPES[mimeType] !== ext) {
    return cb(new Error('File extension does not match content type.'), false);
  }

  cb(null, true);
};

const maxFileSizeBytes = (parseInt(process.env.MAX_FILE_SIZE_MB) || 2) * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeBytes,
    files: 1,             // Only 1 file at a time
    fields: 5,            // Max non-file fields
    fieldNameSize: 100,   // Prevent long field names
  },
});

// Middleware to handle multer errors gracefully
const handleUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 2}MB.`,
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// Cleanup temporary file
const cleanupFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to cleanup file:', filePath);
    });
  }
};

module.exports = { handleUpload, cleanupFile };
