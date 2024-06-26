const puppeteer = require("puppeteer");
var CryptoJS = require("crypto-js");
const { setData } = require("./cache");
const port = process.env.PORT || 3000;

let browser;
(async () => {
  browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  console.log("Browser launched");
})();

function btoa(text) {
  const buffer = Buffer.from(text, "utf8"); // Convert the string to a buffer
  const base64 = buffer.toString("base64"); // Convert the buffer to a Base64 string
  return base64;
}

const pass = "placeholder";
function encodeData(data) {
  var result = CryptoJS.AES.encrypt(
    btoa(JSON.stringify(data)),
    pass
  ).toString();

  return result;
}

async function printViaBrowser(dataObj) {
  let pdfBuffer;
  let page;
  try {
    if (!browser) {
      throw new Error("Browser not launched");
    }

    const id = setData(encodeData(dataObj));
    const data_url = `http://localhost:${port}/get/${id}`;
    const url = `https://html-gpt.rankun.net/gpt_enc.html?api_key=${pass}&data_url=${data_url}`;
    console.log("printing:", url);

    page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    pdfBuffer = await page.pdf({
      format: "A4",
      scale: 0.9,
      margin: { top: 36, right: 24, bottom: 36, left: 24 },
    });
  } catch (e) {
    console.error(e);
    await page.close();
    throw e;
  }

  return {
    buf: pdfBuffer,
    cleanup: async () => {
      await page.close();
    },
  };
}

module.exports = { printViaBrowser };
