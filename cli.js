#!/usr/bin/env node

import * as R from "ramda";
import { intro, outro, select } from '@clack/prompts';
import {
  convertAllFilesToGif,
  convertVideoToGif,
  concatVideoFiles,
  addStartingTitle,
  addStartingTitleAndImage,
} from "./source/video-utils.js";
import { blit, blur, invert, flip, text, contain, mask, rotate, convertToVideoAddingTitleAndSubtitle } from "./source/image-utils.js";
import { createPDFWithDrawnText, addTextToPdf, embedJpgToPdf, readPdfMetadata } from "./source/pdf-utils.js";

const utils = {
  video: {
    convertVideoToGif,
    convertAllFilesToGif,
    concatVideoFiles,
    addStartingTitle,
    addStartingTitleAndImage,
  },
  image: {
    blit,
    blur,
    invert,
    flip,
    text,
    contain,
    mask,
    rotate,
    convertToVideoAddingTitleAndSubtitle,
  },
  pdf: {
    createPDFWithDrawnText,
    addTextToPdf,
    embedJpgToPdf,
    readPdfMetadata,
  }
};

let options = [];
const imageOptionsMappings = {
  blit: 'Blit an image onto another',
  blur: 'Blur an image',
  invert: "Invert an image's colors",
  flip: "Flip an image along its x or y axis",
  text: "Print text onto an image",
  contain: "Contain an image within a height and width",
  mask: "Mask a source image on to this image using average pixel colour",
  rotate: "Rotate the image counter-clockwise by a number of degrees",
  convertToVideoAddingTitleAndSubtitle: "Create a video by adding title and subtitle to image",
};
const videoOptionsMappings = {
  convertVideoToGif: "Convert video file to gif",
  convertAllFilesToGif: "Convert all video files in folder to gif",
  concatVideoFiles: "Concat several video files",
  addStartingTitle: "Add animated title to video",
  addStartingTitleAndImage: "Add animated starting title and image to video",
};

intro(`Let's do some stuff`);

const mediaFileType = await select(
  {
    message: "What is the type of media file you want to operate on",
    options: [
      { label: "Video file", value: "video" },
      { label: "Image file", value: "image" },
      { label: "PDF file", value: "pdf" },
    ],
  },
);

if (mediaFileType === "video") {
  options = R.concat(
      R.map(R.applySpec({
        label: R.flip(R.prop)(videoOptionsMappings),
        value: R.identity,
      }),
      R.keys(videoOptionsMappings),
    ),
    // [
    //   { label: "Convert video file to gif", value: "convertVideoToGif" },
    //   {
    //     label: "Convert all video files in folder to gif",
    //     value: "convertAllFilesToGif",
    //   },
    // ],
    options,
  );
} else if (mediaFileType === "image") {
  options = R.concat(
    R.map(R.applySpec({
        label: R.flip(R.prop)(imageOptionsMappings),
        value: R.identity,
      }),
      R.keys(imageOptionsMappings),
    ),
    options
  );
} else if (mediaFileType === 'pdf') {
  options = R.concat(
    [
      { label: "Create pdf with text", value: 'createPDFWithDrawnText' },
      { label: "Add text to pdf file", value: "addTextToPdf" },
      { label: 'Embed jpg image to pdf file', value: "embedJpgToPdf" },
      { label: 'Read pdf metadata', value: "readPdfMetadata" },
    ],
    options,
  );
}

const result = await select({
  message: "What kind of util you want to use",
  options,
});

const func = R.path([mediaFileType, result], utils);
await func();


outro(`Done!`);
// await items[result]();
// if (result === 'convertmp4togif') {

// }
// import {fdir} from 'fdir';
// import {execa} from 'execa';
// import fs from 'node:fs';
// import path from 'node:path';
// import pMap from 'p-map';
// import ora from 'ora';

// // const sourcesPath = "C:\\fep\\bckn\\cudi\\v2\\demos\\what-is-word-cli-game-rounds\\media\\categorized\\a";
// const sourcesPath = "C:\\fep\\bckn\\cudi\\v2\\demos\\what-is-word-cli-game-rounds\\media";

// const files = new fdir()
// 		.filter((path, _isDirectory) => path.endsWith('.mp4'))
// 		.withFullPaths()
// 		.crawl(sourcesPath)
// 		.sync();

// const converterMapper = async file => {
//     const folder = path.dirname(file);
//     const gifVersion = path.basename(file).replace(/\.mp4$/, '.gif');
//     const gifFile = path.join(folder, gifVersion);

//     if (!fs.existsSync(gifFile)) {
//         const spinner = ora(`Converting ${path.basename(file)}...`).start();
//         await execa('ffmpeg', ['-i', file, '-pix_fmt', 'rgb24', gifFile]);//.stdout.pipe(process.stdout);
//         spinner.stop();
//         console.log(`Created file ${gifFile}`);
//         return `${file} already converted to gif format`;
//     }
//     return `${file} have been converted`;
// };

// const results = await pMap(files, converterMapper);
// console.log(results);
// console.log('Done!');
