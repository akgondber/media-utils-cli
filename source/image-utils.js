import jimp from "jimp";
import consola from "consola";

const saveImage = async (image) => {
  const whereToWrite = await consola.prompt("What is the destination file");
  image.write(whereToWrite);
  consola.success(`File ${whereToWrite} was written.`);
};

const blit = async () => {
  const imageFile = await consola.prompt("Source filename");
  const placeableFile = await consola.prompt("Image to be inserted");
  const x = await consola.prompt("X");
  const y = await consola.prompt("Y");
  const whereToWrite = await consola.prompt(
    "Filename where to save the image to",
  );

  const image = await jimp.read(imageFile);
  const target = await jimp.read(placeableFile);

  image.blit(target, Number(x), Number(y));
  image.write(whereToWrite);
};

const blur = async () => {
  const imageFile = await consola.prompt("Source filename");
  const image = await jimp.read(imageFile);
  const r = await consola.prompt("the pixel radius of the blur");

  image.blur(Number(r));
  await saveImage(image);
};

const invert = async () => {
  const imageFile = await consola.prompt("Source filename");
  const image = await jimp.read(imageFile);

  image.invert();
  await saveImage(image);
};

const flip = async () => {
  const imageFile = await consola.prompt("Source filename");
  const image = await jimp.read(imageFile);
  const horizontal = await consola.prompt('Horizontal?', { type: 'confirm' });
  const vertical = await consola.prompt('Vertical?', { type: 'confirm' });
  image.flip(horizontal, vertical);
  saveImage(image);
};

const text = async () => {
  const imageFile = await consola.prompt("Source filename");

  const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
  const image = await jimp.read(imageFile);
  const text = await consola.prompt("text");
  const x = await consola.prompt("X");
  const y = await consola.prompt("Y");

  image.print(font, Number(x), Number(y), text);
  saveImage(image);
};

export { blit, blur, invert, flip, text };
