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

app.get("/hc", (req, res) => {
  res.send("OK");
});

app.post("/print", async (req, res) => {
  const pdfResult = await printViaBrowser(req.body);
  res.contentType("application/pdf");
  res.send(pdfResult.buf); // Send the PDF file in the response
  await pdfResult.cleanup(); // Cleanup the page after sending the response
});

app.listen(port, () => {
  console.log(`Print service is running on http://localhost:${port}`);
});
