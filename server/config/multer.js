const multer = require("multer");

const path = require("path");

const fs = require("fs");

// Correct uploads folder
const uploadPath =
  path.join(
    __dirname,
    "../uploads"
  );

// Ensure uploads folder exists
if (
  !fs.existsSync(uploadPath)
) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// Storage
const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(null, uploadPath);
    },

    filename: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        Date.now() +
          path.extname(
            file.originalname
          )
      );
    },
  });

// File Filter
const fileFilter = (
  req,
  file,
  cb
) => {
  if (
    file.mimetype.startsWith(
      "image"
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only images allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;