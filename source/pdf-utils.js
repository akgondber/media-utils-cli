import fs from "node:fs";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import * as R from "ramda";
import {
  getText,
  getSourceFile,
  getDestFile,
  getNumber,
} from "./clack-helpers.js";

// Do stuff

// const getText = async (options) => {
//   const value = await text({type: 'text', ...options});
//   handleCancel(value);
//   return value;
// };

// PDF Creation
const createPDFWithDrawnText = async () => {
  const file = await getDestFile();
  const value = await getText("What is a text to be drawn?");
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  page.drawText(value, {
    x: width / 2,
    y: height / 2,
  });
  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync(file, pdfBytes);
};

const addTextToPdf = async () => {
  const sourceFile = await getText("Source pdf file to operate on");
  const pageNumber = await getNumber(
    "What is page number to place the image to?",
    { isPositive: true },
  );
  const textToAdd = await getText("What is a text to be added to pdf");
  const degreesValue = await getNumber("What is degrees for a text?");

  const existingPdfBytes = fs.readFileSync(sourceFile);

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[R.dec(pageNumber)];

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  // Draw a string of text diagonally across the first page
  firstPage.drawText(textToAdd, {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(degreesValue),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  const destFile = await getText("What is a destination file");
  fs.writeFileSync(destFile, pdfBytes);
};

const embedJpgToPdf = async () => {
  const sourceFile = await getSourceFile();
  const imageFile = await getText({ message: "Provide image filename" });
  const pageNumber = await getNumber(
    "What is page number to place the image to?",
    { isPositive: true },
  );
  const destFile = await getDestFile();
  const jpgImageBytes = fs.readFileSync(imageFile);
  const existingPdfBytes = fs.readFileSync(sourceFile);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  // const pageNumber = await
  // const pngImageBytes = ...

  // Create a new PDFDocument
  // const pdfDoc = await PDFDocument.create()

  // Embed the JPG image bytes and PNG image bytes
  const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
  // const pngImage = await pdfDoc.embedPng(pngImageBytes)

  // Get the width/height of the JPG image scaled down to 25% of its original size
  const jpgDims = jpgImage.scale(0.25);

  // Get the width/height of the PNG image scaled down to 50% of its original size
  // const pngDims = pngImage.scale(0.5)

  // Add a blank page to the document

  const page = pdfDoc.getPage(pageNumber - 1);

  // Draw the JPG image in the center of the page
  page.drawImage(jpgImage, {
    x: page.getWidth() / 2 - jpgDims.width / 2,
    y: page.getHeight() / 2 - jpgDims.height / 2,
    width: jpgDims.width,
    height: jpgDims.height,
  });

  // Draw the PNG image near the lower right corner of the JPG image
  // page.drawImage(pngImage, {
  //   x: page.getWidth() / 2 - pngDims.width / 2 + 75,
  //   y: page.getHeight() / 2 - pngDims.height,
  //   width: pngDims.width,
  //   height: pngDims.height,
  // })

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(destFile, pdfBytes);
};

const readPdfMetadata = async () => {
  const source = await getSourceFile();
  // This should be a Uint8Array or ArrayBuffer
  // This data can be obtained in a number of different ways
  // If your running in a Node environment, you could use fs.readFile()
  // In the browser, you could make a fetch() call and use res.arrayBuffer()
  const existingPdfBytes = fs.readFileSync(source);

  // Load a PDFDocument without updating its existing metadata
  const pdfDoc = await PDFDocument.load(existingPdfBytes, {
    updateMetadata: false,
  });

  // Print all available metadata fields
  console.log("Title:", pdfDoc.getTitle());
  console.log("Author:", pdfDoc.getAuthor());
  console.log("Subject:", pdfDoc.getSubject());
  console.log("Creator:", pdfDoc.getCreator());
  console.log("Keywords:", pdfDoc.getKeywords());
  console.log("Producer:", pdfDoc.getProducer());
  console.log("Creation Date:", pdfDoc.getCreationDate());
  console.log("Modification Date:", pdfDoc.getModificationDate());
};

export { createPDFWithDrawnText, addTextToPdf, embedJpgToPdf, readPdfMetadata };
