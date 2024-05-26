import jimp from "jimp";
import consola from "consola";
import { getBool, getDestFile, getFile, getNumber, getSourceFile, getText } from "./clack-helpers.js";

const saveImage = async (image) => {
  const whereToWrite = await getDestFile();
  image.write(whereToWrite);
};

const blit = async () => {
  const imageFile = await getSourceFile();
  const placeableFile = await getFile("Image file to be inserted");
  const x = await getNumber("X");
  const y = await getNumber("Y");
  const whereToWrite = await getDestFile();

  const image = await jimp.read(imageFile);
  const target = await jimp.read(placeableFile);

  image.blit(target, Number(x), Number(y));
  image.write(whereToWrite);
};

const blur = async () => {
  const imageFile = await getSourceFile(); // consola.prompt("Source filename");
  const image = await jimp.read(imageFile);
  const r = await getNumber("pixel radius of the blur"); // consola.prompt("the pixel radius of the blur");

  image.blur(Number(r));
  await saveImage(image);
};

const invert = async () => {
  const imageFile = await getSourceFile();
  const image = await jimp.read(imageFile);

  image.invert();
  await saveImage(image);
};

const flip = async () => {
  const imageFile = await getSourceFile();
  const image = await jimp.read(imageFile);
  const horizontal = await getBool('Horizontal?');
  const vertical = await getBool('Vertical?');
  image.flip(horizontal, vertical);
  saveImage(image);
};

const text = async () => {
  const imageFile = await getSourceFile();

  const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
  const image = await jimp.read(imageFile);
  const text = await getText("text");
  const x = await getNumber("X");
  const y = await getNumber("Y");

  image.print(font, Number(x), Number(y), text);
  saveImage(image);
};

export { blit, blur, invert, flip, text };
