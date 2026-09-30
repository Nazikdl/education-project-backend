import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import { __dirname } from "../app.js";
const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["application/pdf", ".pdf"],
]);

const maxFileSize = 500 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/Public`);
  },
  filename: (req, file, cb) => {
    const ext =
      allowedMimeTypes.get(file.mimetype) ||
      path.extname(file.originalname).toLowerCase();
    const safeBaseName = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);
    const filename = `${Date.now()}-${randomUUID()}${
      safeBaseName ? `-${safeBaseName}` : ""
    }${ext}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Allowed types: jpg, png, webp, gif, svg, mp4, webm, pdf",
      ),
    );
  }

  cb(null, true);
};

const uploadOption = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 10,
  },
});

export { allowedMimeTypes, maxFileSize };
export default uploadOption;
