const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { printViaBrowser } = require("./browser-printer");
const { setData, getData } = require("./cache");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post("/set", async (req, res) => {
  const data = req.body;
  const id = setData(data);
  res.send(`http://localhost:${port}/get/${id}`);
});
app.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  const data = getData(id);
  res.header("Content-Type", "text/plain");
  res.send(data);
});

app.post("/print", async (req, res) => {
  const pdfResult = await printViaBrowser(req.body);
  res.contentType("application/pdf");
  res.send(pdfResult.buf); // Send the PDF file in the response
  await pdfResult.cleanup(); // Cleanup the page after sending the response

  // const doc = new PDFDocument();
  // doc.fontSize(32).text("HTML GPT");

  // // Setting response headers to display PDF inline
  // res.setHeader("Content-Type", "application/pdf");
  // res.setHeader("Content-Disposition", 'inline; filename="conversation.pdf"');

  // // Pipe generated PDF into response
  // doc.pipe(res);

  // // Add text from JSON body to PDF
  // for (const { role, content } of messages) {
  //   if (role === "system") continue;
  //   if (content) {
  //     doc.moveDown();
  //     doc.fontSize(16).text(roleNames[role], { bold: true });
  //     doc.moveDown(0.1);
  //     doc.fontSize(12).text(content.trim());
  //   }
  // }

  // // Finalize the PDF and end the document
  // doc.end();
});

app.listen(port, () => {
  console.log(`Print service is running on http://localhost:${port}`);
});
