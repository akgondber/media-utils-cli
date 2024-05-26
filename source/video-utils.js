import { fdir } from "fdir";
import { execa } from "execa";
import fs from "node:fs";
import path from "node:path";
import pMap from "p-map";
import { spinner } from "@clack/prompts";
import { getSourceFile, getSourceFolder } from "./clack-helpers.js";

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
    s.start("dfcd");
    s.stop(`${file} already has gif format`);
  }
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
      s.stop(`${file} already converted to gif format`);
    }
  };

  await pMap(files, converterMapper);
};

export { convertVideoToGif, convertAllFilesToGif };
