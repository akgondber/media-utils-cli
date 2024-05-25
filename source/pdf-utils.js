import fs from 'node:fs';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import { intro, outro, isCancel, cancel, text } from '@clack/prompts';
import * as R from 'ramda';

// Do stuff

const handleCancel = (value) => {
  if (isCancel(value)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
};

const getText = async (options) => {
  const value = await text({type: 'text', ...options});
  handleCancel(value);
  return value;
};

const getSourceFile = async () => {
  const result = await getText({
    message: 'What is a source file?',
    validate: (value) => {
      if (!fs.existsSync(value)) {
        return `File ${value} does not exist`;
      }
    },
  });

  return result;
};

const getDestFile = async () => {
  const result = await getText({
    message: 'What is a dest file?',
  });

  return result;
};

const getNumber = async (message, { isPositive = false }) => {
  const value = await getText({
    message,
    validate: (value) => {
      if (isNaN(Number(value))) {
        return `input value should be a type of number, got ${typeof value}`;
      } else if (isPositive && Number(value) < 1) {
        return `input should be larger than 0`;
      }
    },
  });
  return Number(value);
};

// PDF Creation
const createPDFWithDrawnText = async () => {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize();
  const value = await getText({message: 'fv'});
  page.drawText(value, {
    x: width / 2,
    y: height / 2,
  });
  const pdfBytes = await pdfDoc.save()

  fs.writeFileSync('.\\files\\asf.pdf', pdfBytes);
};

const addTextToPdf = async () => {
  const sourceFile = await getText({ message: 'Source pdf file to operate on' });
  const existingPdfBytes = fs.readFileSync(sourceFile);

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Get the first page of the document
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize()
  const textToAdd = await getText({ message: 'What is a text to be added to pdf' });

  // Draw a string of text diagonally across the first page
  firstPage.drawText(textToAdd, {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  })


  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  const destFile = await getText({ message: 'What is a destination file' });
  fs.writeFileSync(destFile, pdfBytes);
};

const embedJpgToPdf = async () => {
  const sourceFile = await getSourceFile();
  const imageFile = await getText({ message: 'Provide image filename' });
  const pageNumber = await getNumber('What is page number to place the image to?', { isPositive: true });
  const destFile = await getDestFile();
  const jpgImageBytes = fs.readFileSync(imageFile);
  const existingPdfBytes = fs.readFileSync(sourceFile);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  // const pageNumber = await 
  // const pngImageBytes = ...

  // Create a new PDFDocument
  // const pdfDoc = await PDFDocument.create()

  // Embed the JPG image bytes and PNG image bytes
  const jpgImage = await pdfDoc.embedJpg(jpgImageBytes)
  // const pngImage = await pdfDoc.embedPng(pngImageBytes)

  // Get the width/height of the JPG image scaled down to 25% of its original size
  const jpgDims = jpgImage.scale(0.25)

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
  })

  // Draw the PNG image near the lower right corner of the JPG image
  // page.drawImage(pngImage, {
  //   x: page.getWidth() / 2 - pngDims.width / 2 + 75,
  //   y: page.getHeight() / 2 - pngDims.height,
  //   width: pngDims.width,
  //   height: pngDims.height,
  // })

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(destFile, pdfBytes);
};

export {
  createPDFWithDrawnText,
  addTextToPdf,
  embedJpgToPdf,
};
