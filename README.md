# ByeByeEXIF
Chrome/Firefox extension that removes metadata before upload files

[![Firefox](https://extensionworkshop.com/assets/img/documentation/publish/get-the-addon-178x60px.dad84b42.png)](https://addons.mozilla.org/ja/firefox/addon/byebyeexif/)

# Usage
Open the website you wish to upload files to and click on the **extension icon** or **Cleanup file and upload** from the right-click menu.

Next, select a file from the dialog that appears automatically

Then this will automatically remove metadata from the selected files and upload them.

> [!CAUTION]
> **Do not upload files directly to websites using default button, otherwise, metadata couldn't be deleted.**

## Third-party libraries/Referenced codes
* [Variety Flat Bordered Icons](https://www.svgrepo.com/svg/467701/eraser-3)([Public Domain](https://www.svgrepo.com/page/licensing/#PD)) //Extension Icon
* [How To Set The Value Of A File Input](https://pqina.nl/blog/set-value-to-file-input/) //Algorithm of Hooking File Input
* [Image Data Cleaner](https://github.com/codepo8/image-data-cleaner/blob/master/scripts/cleaner.js#L49)([MIT](https://github.com/codepo8/image-data-cleaner/blob/master/LICENSE.md)) //Algorithm of cleaning Image's metadata
* [pdf-lib](https://github.com/Hopding/pdf-lib)([MIT](https://github.com/Hopding/pdf-lib/blob/master/LICENSE.md)) //Cleaning PDF
