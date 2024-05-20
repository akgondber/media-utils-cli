#!/usr/bin/env node

import { consola } from "consola";
import * as R from "ramda";
import {
  convertAllFilesToGif,
  convertVideoToGif,
} from "./source/video-utils.js";
import { blit, blur, invert, flip, text } from "./source/image-utils.js";

const utils = {
  video: {
    convertVideoToGif,
    convertAllFilesToGif,
  },
  image: {
    blit,
    blur,
    invert,
    flip,
    text,
  },
};

let options = [];
consola.box("Media-Utils");
const mediaFileType = await consola.prompt(
  "What is the type of media file you want to operate on",
  {
    type: "select",
    options: [
      { label: "Video file", value: "video" },
      { label: "Image file", value: "image" },
    ],
  },
);

if (mediaFileType === "video") {
  options = R.concat(
    [
      { label: "Convert video file to gif", value: "convertVideoToGif" },
      {
        label: "Convert all video files in folder to gif",
        value: "convertAllFilesToGif",
      },
    ],
    options,
  );
} else if (mediaFileType === "image") {
  options = R.concat(
    [
      { label: "Blit", value: "blit" },
      { label: "Blur", value: "blur" },
      { label: "Flip", value: "flip" },
      { label: "Text", value: "text" },
      { label: "Invert", value: "invert" },
    ],
    options,
  );
}

const result = await consola.prompt("What kind of util you want to use", {
  type: "select",
  options,
});

const func = R.path([mediaFileType, result], utils);
await func();
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