const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const roleNames = { system: "System", user: "User", assistant: "Assistant" };

app.post("/print", (req, res) => {
  const doc = new PDFDocument();
  doc.fontSize(32).text("HTML GPT");

  // Setting response headers to display PDF inline
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="conversation.pdf"');

  // Pipe generated PDF into response
  doc.pipe(res);

  // Add text from JSON body to PDF
  const { messages } = req.body;
  for (const { role, content } of messages) {
    if (content) {
      doc.moveDown();
      doc.fontSize(16).text(roleNames[role], { bold: true });
      doc.moveDown(0.1);
      doc.fontSize(12).text(content);
    }
  }

  // Finalize the PDF and end the document
  doc.end();
});

app.listen(port, () => {
  console.log(`Print service is running on http://localhost:${port}`);
});
