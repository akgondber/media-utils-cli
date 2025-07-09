import { fdir } from "fdir";
import { execa } from "execa";
import fs from "node:fs";
import path from "node:path";
import pMap from "p-map";
import { spinner, confirm } from "@clack/prompts";
import converter from "number-to-words";
import Editly from "editly";
import * as R from "ramda";
import {
  getBool,
  getDestFile,
  getFile,
  getSourceFile,
  getSourceFolder,
  getText,
  getTime,
} from "./clack-helpers.js";

const convertVideoToGif = async () => {
  const file = await getSourceFile();
  const folder = path.dirname(file);
  const gifVersion = path.basename(file).replace(/\.mp4$/, ".gif");
  const gifFile = path.join(folder, gifVersion);
  const s = spinner();

  if (!fs.existsSync(gifFile)) {
    s.start(`Converting ${path.basename(file)}...`);
    await execa("ffmpeg", ["-i", file, "-pix_fmt", "rgb24", gifFile]);
    s.stop(`Created file ${gifFile}`);
  } else {
    s.stop(`${file} already has gif format`);
  }
};

const cutVideo = async () => {
  const file = await getSourceFile();
  const cutFrom = await getTime("Start time");
  const duration = await getTime("Duration");
  const dest = await getDestFile();
  const s = spinner();
  s.start("Cutting");
  await execa("ffmpeg", [
    "-i",
    file,
    "-ss",
    cutFrom,
    "-t",
    duration,
    "-acodec",
    "copy",
    dest,
  ]);
  s.stop(`File ${dest} was successfully created`);
};

const convertAllFilesToGif = async () => {
  const sourcesPath = await getSourceFolder();

  const files = new fdir()
    .filter((path, _isDirectory) => path.endsWith(".mp4"))
    .withFullPaths()
    .crawl(sourcesPath)
    .sync();

  const converterMapper = async (file) => {
    const folder = path.dirname(file);
    const gifVersion = path.basename(file).replace(/\.mp4$/, ".gif");
    const gifFile = path.join(folder, gifVersion);
    const s = spinner();

    if (!fs.existsSync(gifFile)) {
      s.start(`Converting ${path.basename(file)}...`);
      await execa("ffmpeg", ["-i", file, "-pix_fmt", "rgb24", gifFile]);
      s.stop(`Created file ${gifFile}`);
      return;
    } else {
      s.start("Checking on gif file existence for video file");
      s.stop(`${file} already converted to gif format`);
    }
  };

  await pMap(files, converterMapper);
};

const concatVideoFiles = async () => {
  let addNewFile = true;
  let i = 1;
  let sourceFiles = [];

  do {
    const sourceFile = await getFile(`${converter.toOrdinal(i)} file`);
    sourceFiles.push(sourceFile);
    if (i > 2) addNewFile = await getBool("Add new file?");
    i++;
  } while (addNewFile);
  {
  }

  const clips = R.map(
    (file) => ({
      layers: {
        type: "video",
        path: file,
      },
    }),
    sourceFiles,
  );

  await Editly({
    keepSourceAudio: true,
    outPath: "vid\\concatenated.mp4",
    clips: clips,
  });
};

const addStartingTitle = async () => {
  const videoFile = await getFile(`Video file`);
  const title = await getText("Text to add");
  const dest = await getDestFile();

  const clips = [
    {
      duration: 3,
      transition: { name: "directional-left" },
      layers: [
        {
          type: "title-background",
          text: title,
          background: {
            type: "linear-gradient",
            colors: ["#02aab0", "#00cdac"],
          },
        },
      ],
    },
    { layers: [{ type: "video", path: videoFile }] },
  ];

  await Editly({
    keepSourceAudio: true,
    outPath: dest,
    clips: clips,
  });
};

const addStartingTitleAndImage = async () => {
  const videoFile = await getFile(`Video file`);
  const imageFile = await getFile("Image file");
  const title = await getText("Text to add");
  const dest = await getDestFile();

  const clips = [
    {
      duration: 2,
      transition: { name: "directional-left" },
      layers: [
        {
          type: "title-background",
          text: title,
          background: {
            type: "linear-gradient",
            colors: ["#02aab0", "#00cdac"],
          },
        },
      ],
    },
    {
      duration: 1.5,
      transition: { name: "simplezoom" },
      layers: [{ type: "image", path: imageFile, zoomDirection: "in" }],
    },
    { layers: [{ type: "video", path: videoFile }] },
  ];

  await Editly({
    keepSourceAudio: true,
    outPath: dest,
    clips: clips,
  });
};

export {
  convertVideoToGif,
  convertAllFilesToGif,
  concatVideoFiles,
  addStartingTitle,
  addStartingTitleAndImage,
  cutVideo,
};
