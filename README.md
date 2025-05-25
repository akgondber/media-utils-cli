# media-utils-cli [![NPM version][npm-image]][npm-url]

> Media utils for different kinds of files (video, audio, images, pdf files) - transforming, converting, resizing, image manipulations, etc.

## Install

```bash
$ npm install --global media-utils-cli
```

## CLI

```
$ media-utils-cli
```

## Demos

### Example

![demo](media/demo.gif)

### Convert video file to gif

![demo converting video to gif](media/demo_convert_video_to_gif.gif)

### Cut up video file

![demo cutting up video file](media/demo_cut_example.gif)

### Image manipulation: contrast

![demo contrast image file](media/demo_image_contrast.gif)

## Notes

In order to use video utils you should have [ffmpeg](https://ffmpeg.org/) installed in your system.

## What's under the hood?

- [jimp](https://github.com/jimp-dev/jimp) - to manipulate over image files
- [pdf-lib](https://github.com/Hopding/pdf-lib) - to do pdf documents manipulations
- [editly](https://github.com/mifi/editly) - Slick, declarative command line video editing

## License

MIT © [Rushan Alyautdinov](https://github.com/akgondber)

[npm-image]: https://img.shields.io/npm/v/media-utils-cli.svg?style=flat
[npm-url]: https://npmjs.org/package/media-utils-cli
