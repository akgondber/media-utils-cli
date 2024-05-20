import { fdir } from "fdir";
import { execa } from "execa";
import fs from "node:fs";
import path from "node:path";
import pMap from "p-map";
import ora from "ora";
import consola from "consola";

// const sourcesPath = "C:\\fep\\bckn\\cudi\\v2\\demos\\what-is-word-cli-game-rounds\\media\\categorized\\a";
// const sourcesPath = "C:\\fep\\bckn\\cudi\\v2\\demos\\what-is-word-cli-game-rounds\\media";
const convertVideoToGif = async () => {
  const file = await consola.prompt("What is source file");

  // const files = new fdir()
  // 	.filter((path, _isDirectory) => path.endsWith('.mp4'))
  // 	.withFullPaths()
  // 	.crawl(sourcesPath)
  // 	.sync();

  // const converterMapper = async file => {
  //     const folder = path.dirname(file);
  //     const gifVersion = path.basename(file).replace(/\.mp4$/, '.gif');
  //     const gifFile = path.join(folder, gifVersion);

  //     if (!fs.existsSync(gifFile)) {
  //         const spinner = ora(`Converting ${path.basename(file)}...`).start();
  //         await execa('ffmpeg', ['-i', file, '-pix_fmt', 'rgb24', gifFile]);//.stdout.pipe(process.stdout);
  //         spinner.stop(`Created file ${gifFile}`);
  //         return `${file} already converted to gif format`;
  //     }
  //     return `${file} have been converted`;
  // };

  // const results = await pMap(files, converterMapper);
  const folder = path.dirname(file);
  const gifVersion = path.basename(file).replace(/\.mp4$/, ".gif");
  const gifFile = path.join(folder, gifVersion);
  if (!fs.existsSync(gifFile)) {
    const spinner = ora(`Converting ${path.basename(file)}...`).start();
    await execa("ffmpeg", ["-i", file, "-pix_fmt", "rgb24", gifFile]); //.stdout.pipe(process.stdout);
    spinner.stop(`Created file ${gifFile}`);
    return consola.info(`${file} already converted to gif format`);
  }
  return consola.success(`${file} have been converted`);
};

const convertAllFilesToGif = async () => {
  const sourcesPath = await consola.prompt("What is source folder");

  const files = new fdir()
    .filter((path, _isDirectory) => path.endsWith(".mp4"))
    .withFullPaths()
    .crawl(sourcesPath)
    .sync();

  const converterMapper = async (file) => {
    const folder = path.dirname(file);
    const gifVersion = path.basename(file).replace(/\.mp4$/, ".gif");
    const gifFile = path.join(folder, gifVersion);

    if (!fs.existsSync(gifFile)) {
      const spinner = ora(`Converting ${path.basename(file)}...`).start();
      await execa("ffmpeg", ["-i", file, "-pix_fmt", "rgb24", gifFile]);
      spinner.stop(`Created file ${gifFile}`);
      consola.info(`${file} already converted to gif format`);
      return;
    }
    return consola.success(`${file} have been converted to gif`);
  };

  const results = await pMap(files, converterMapper);
};

export { convertVideoToGif, convertAllFilesToGif };
