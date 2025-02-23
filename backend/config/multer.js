const multer = require("multer");
const storage = multer.memoryStorage();


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {

    if (file.fieldname === "image" || file.fieldname === "gallery") {
      const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedFormats.includes(file.mimetype)) {
        return cb(new Error("Only JPEG, JPG, and PNG files are allowed for images"), false);
      }
    }
    
    else if (file.fieldname === "attachments") {
      const allowedFormats = [
        "image/jpeg", "image/png", "image/jpg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedFormats.includes(file.mimetype)) {
        return cb(new Error("Only images (JPEG, JPG, PNG) and documents (PDF, DOC, DOCX) are allowed for attachments"), false);
      }
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, 
}).fields([
  { name: "image", maxCount: 1 },       
  { name: "gallery", maxCount: 10 },  
  { name: "attachments", maxCount: 10 },
]);

module.exports = upload;