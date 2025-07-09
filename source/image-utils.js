import jimp from "jimp";
import {
  getBool,
  getDestFile,
  getFile,
  getNumber,
  getSourceFile,
  getText,
} from "./clack-helpers.js";
import Editly from "editly";

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
  await saveImage(image);
};

const blur = async () => {
  const imageFile = await getSourceFile();
  const image = await jimp.read(imageFile);
  const r = await getNumber("pixel radius of the blur");

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
  const horizontal = await getBool("Horizontal?");
  const vertical = await getBool("Vertical?");
  image.flip(horizontal, vertical);
  await saveImage(image);
};

const text = async () => {
  const imageFile = await getSourceFile();

  const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
  const image = await jimp.read(imageFile);
  const text = await getText("text");
  const x = await getNumber("X");
  const y = await getNumber("Y");

  image.print(font, Number(x), Number(y), text);
  await saveImage(image);
};

const contain = async () => {
  const imageFile = await getSourceFile();
  const width = await getNumber("width");
  const height = await getNumber("height");
  const image = await jimp.read(imageFile);

  image.contain(width, height);
  await saveImage(image);
};

const mask = async () => {
  const imageFile = await getSourceFile();
  const maskFile = await getFile("Mask image");
  const image = await jimp.read(imageFile);
  const mask = await jimp.read(maskFile);

  image.mask(mask, 50, 60);
  await saveImage(image);
};

const rotate = async () => {
  const imageFile = await getSourceFile();
  const degrees = await getNumber("The number of degrees to rotate");
  const image = await jimp.read(imageFile);

  image.rotate(degrees);
  await saveImage(image);
};

const pixelate = async () => {
  const imageFile = await getSourceFile();
  const size = await getNumber("The size");
  const image = await jimp.read(imageFile);

  image.pixelate(size);
  await saveImage(image);
};

const contrast = async () => {
  const imageFile = await getSourceFile();
  const value = await getNumber("Value in [-1, 1] range", {
    inRange: { min: -1, max: 1 },
  });
  const image = await jimp.read(imageFile);

  image.contrast(value);
  await saveImage(image);
};

const opacity = async () => {
  const imageFile = await getSourceFile();
  const value = await getNumber("The value in [0, 1] range", {
    inRange: { min: 0, max: 1 },
  });
  const image = await jimp.read(imageFile);

  image.opacity(value);
  await saveImage(image);
};

const convertToVideoAddingTitleAndSubtitle = async () => {
  const img = await getSourceFile();
  const title = await getText("What is a title?");
  const subtitle = await getText("What is a subtitle?");
  const dest = await getDestFile();

  await Editly({
    outPath: dest,
    clips: [
      {
        duration: 7,
        layers: [
          { type: "image", path: img },
          { type: "news-title", text: title },
          {
            type: "subtitle",
            text: subtitle,
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        ],
      },
    ],
  });
};

const crop = async () => {
  const imageFile = await getSourceFile();
  const x = await getNumber("What is x position?");
  const y = await getNumber("What is y position?");
  const height = await getNumber("What is height?");
  const width = await getNumber("What is width?");
  const image = await jimp.read(imageFile);

  image.crop(x, y, width, height);
  await saveImage(image);
};

export {
  blit,
  blur,
  invert,
  flip,
  text,
  contain,
  mask,
  rotate,
  pixelate,
  contrast,
  opacity,
  convertToVideoAddingTitleAndSubtitle,
  crop,
};
