# JSON Editor
This is a representation of the [JSON Editor interactive demo](https://json-editor.github.io/json-editor/), reworked and updated for my game development purposes.

### Online demo
You can check this new interactive demo [there](https://so-called-games.github.io/json-editor/).

## Added and updated features
There are following features which were added or changed in this version of the demo.

### Direct link copying
Now instead of updating page and changing URL by clicking the link button, link with the data will just copy to clipboard so you can share it, no need to copy it from browser's URL field. When you copy the link, schema or output JSON, popup message with corresponding text will appear, which makes editor more responsive as otherwise there is no indication that something happened when the button is clicked. Link will be also much shorter now, since it will store only options that differ from the defaults and because editor uses JavaSctipt map to convert every option name and property to absolute shortest string containing only from 1 to 3 characters.

### Sharing sessions with QR code
You have another option to open editor without any link sharing: by QR code. QR code is containing direct link to this session and is stored in `<svg>` element by default. Because of that you can infinitely scale it, but you can also download the code as a PNG image by **by clicking *Save as PNG*** button below (the button will be shown only when QR code is shown in vector mode, because if code is rendered as raster image, you can save it from context menu anyway). The QR code option is convenient when you want to quickly open the editor on another device without any link sharing at all or share the session with another person.

### Upload and download JSON source
You can **upload** a file containing JSON source from a device both for the schema and the output **by clicking *Open*** button as well as **load** the source from remote location **by specifying remote URL and clicking *Load*** button. Last button is hidden in *Extra options* menu in bottom part of corresponding tabs. You can also **download** edited JSON **by clicking *Save*** button. All of the file processing is being done by JavaScript, so you can execute this editor on the local path as well. Downloaded file will have name specified in filename input field for the schema or the output, with *".json"* extension added at the end.

**Warning**: loading source from URL might be restricted due to JavaScript's *same-origin policy*, which forbids to load content if *Access-Control-Allow-Origin* HTTP header sended from URL source was set to *"\*"* and resource is contained on another domain. Because of that, you have following options to make it work: get resource from the same domain (so both resource and editor itself must be contained on the same domain), set *Access-Control-Allow-Origin* returned header value to domain where the editor is contained if you have control over the server where resource is contained, or you can somehow disable JavaScript same-origin policy itself (some browser does support that).

### Schema and output copying
You can quickly **copy** ACE Editors text both for the schema and the output *by clicking at the **Copy*** button, so it's much more easy to instantly copy edited text on touchscreen devices.

### Clearing JSON editors
You can quickly **reset** ACE Editor for the schema or the output **by clicking *Clear***. This feature was also added for the editor to be more friendly on touchscreen devices.

### Editor sections toggle option
You can **expand** property editor **by clicking button next to the *Reset***. In expanded mode all of the elements are hidden besides a main header, this button to collapse back and the editor itself. Also you can collapse both output and schema JSON source editors and *Errors* section as well for editor to be more easily controllable. All of the toggle options will be stored in direct link excluding property editor mode, since you cannot copy a link to the session when property editor is expanded.

### Mobile-friendly scaling
Scaling of the editor page is different for desktop and mobile devices. This is because with greater scale the editor will look and control more reliably on mobile devices. Since you cannot natively expand `<textarea>` elements on some mobile browsers to contain more lines of multiline string property in property editor, expanded `<textarea>` feature was implemented for editor to be even more accessible on mobile devices. To show `<textarea>` over the editor, click expand button on the right side of the `<textarea>` element in property editor itself. To close expanded `<textarea>`, click anywhere outside of it.

### Additional themes
Some additional Bootstrap 5 and ACE Editor themes were implemented, including dark ones (dark theme is set by default).

### Overall look
Look of the editor page was changed a bit to be nicer and less overloaded by additional text and options. The only options remain now is boolean options of the editor itself and *Theme* (also now Bootstrap 5 based themes are only available options by default since the editor was originally developed to look proper and nice with Bootstrap 5).