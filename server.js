const express = require("express");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// List available endpoints
app.get("/", (_req, res) => {
  res.json({
    endpoints: [
      { method: "GET", path: "/", description: "List available endpoints" },
      {
        method: "POST",
        path: "/upload",
        description:
          "Upload a file (multipart/form-data). Returns filename, size, mime-type, SHA256 hash",
      },
      {
        method: "GET",
        path: "/headers",
        description: "Return all request headers",
      },
      {
        method: "GET",
        path: "/echo",
        description: "Echo back query params and body",
      },
    ],
  });
});

// File upload — return metadata
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Use field name 'file'." });
  }

  const hash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");

  res.json({
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    sha256: hash,
  });
});

// Return all request headers
app.get("/headers", (req, res) => {
  res.json({ headers: req.headers });
});

// Echo query params and body
app.get("/echo", (req, res) => {
  res.json({
    query: req.query,
    body: req.body,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`request-lab listening on port ${PORT}`);
});
