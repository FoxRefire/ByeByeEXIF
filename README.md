<p align="center">
  <img width="180" src="https://github.com/user-attachments/assets/784ea26f-571a-429b-a8f3-6e28272bfd1d">
  <h1 align="center">ByeByeEXIF</h1>
  <div align="center"> Chrome/Firefox extension that removes metadata before upload files</div>
</p>


[![Firefox](https://extensionworkshop.com/assets/img/documentation/publish/get-the-addon-178x60px.dad84b42.png)](https://addons.mozilla.org/ja/firefox/addon/byebyeexif/)

## Usage
Open the website you wish to upload files to and click on the **extension icon** or **Cleanup file and upload** from the right-click menu.

Next, select a file from the dialog that appears automatically

Then this will automatically remove metadata from the selected files and upload them.

> [!WARNING]
> **Do not upload files directly to websites using default button, otherwise metadata couldn't be deleted.**

## Supported File Formats
```
<Images>
.jpg, .jpeg, .png, .gif, .bmp, .webp, .heic
.ppm, .tiff

<Videos>
.mp4, .webm, .ogv, .mpg, .mpeg, .m1v, .m4v,
.avi, .mkv, .mov, .wmv, .avif, .avifs

<Audios>
.mp3, .aac, .wav, .wv, .ogg, .opus, .flac

<PDF Document>
.pdf

<Office Documents>
.doc, .dot, .docx, .dotx, .docm, .dotm, .xls,
.xlt, .xla, .xlsx, .xltx, .xlsm, .xltm, .xlam,
.xlsb, .ppt, .pot, .pps, .ppa, .pptx, .potx,
.ppsx, .ppam, .pptm, .potm, .ppsm, .mdb, .odt,
.ods, .odp, .odg, .odc, .odf, .odi, .odm, .odb,
.ott, .ots, .otp, .otg, .otc, .oti, .oth
```

## Demo
[demo1](https://github.com/user-attachments/assets/3292feb6-656b-4597-93ed-8e22909dece1)


## Third-party libraries/Referenced codes
* [Variety Flat Bordered Icons](https://www.svgrepo.com/svg/467701/eraser-3)([Public Domain](https://www.svgrepo.com/page/licensing/#PD)) //Extension Icon
* [How To Set The Value Of A File Input](https://pqina.nl/blog/set-value-to-file-input/) //Algorithm of Hooking File Input
* [Image Data Cleaner](https://github.com/codepo8/image-data-cleaner/blob/master/scripts/cleaner.js#L49)([MIT](https://github.com/codepo8/image-data-cleaner/blob/master/LICENSE.md)) //Algorithm of cleaning Image's metadata
* [pdf-lib](https://github.com/Hopding/pdf-lib)([MIT](https://github.com/Hopding/pdf-lib/blob/master/LICENSE.md)) //Handling PDF
* [jszip](https://github.com/Stuk/jszip)([MIT or GPL v3](https://github.com/Stuk/jszip/blob/main/LICENSE.markdown)) //Handling Office documents
* [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)([MIT](https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/LICENSE)) //Handling Video Files
