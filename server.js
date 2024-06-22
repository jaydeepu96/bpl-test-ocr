const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { PDFDocument } = require("pdf-lib");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const app = express();
const port = 3000;

app.use(cors());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const extractTextFromPDF = async (filePath) => {
  const pdfData = await pdfParse(fs.readFileSync(filePath));
  return pdfData.text;
};

const extractTextFromDocx = async (filePath) => {
  const { value } = await mammoth.extractRawText({ path: filePath });
  return value;
};

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileName = req.file.filename;
    const filePath = req.file.path;

    console.log("File uploaded:", fileName);

    let text = "";

    const ext = path.extname(fileName).toLowerCase();
    if (ext === ".pdf") {
      text = await extractTextFromPDF(filePath);
    } else if (ext === ".docx" || ext === ".doc") {
      text = await extractTextFromDocx(filePath);
    } else {
      throw new Error("Unsupported file type.");
    }

    res.json({ fileName, text });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
});

app.post("/compare-documents", async (req, res) => {
  try {
    const { prevFileName, newFileName } = req.body;

    console.log("Comparing files:", prevFileName, newFileName);

    const prevFilePath = path.join(__dirname, "uploads", prevFileName);
    const newFilePath = path.join(__dirname, "uploads", newFileName);

    const prevFileContent = fs.readFileSync(prevFilePath, "utf-8");
    const newFileContent = fs.readFileSync(newFilePath, "utf-8");

    const differences = diffChars(prevFileContent, newFileContent);

    let diffResult = "";
    differences.forEach((part) => {
      const color = part.added ? "green" : part.removed ? "red" : "grey";
      diffResult += `<span style="color: ${color}">${part.value}</span>`;
    });

    res.json({ diff: diffResult });
  } catch (error) {
    console.error("Error comparing files:", error);
    res.status(500).send("Error comparing files");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
