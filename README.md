# JSON Editor
This is a representation of the [JSON Editor interactive demo](https://json-editor.github.io/json-editor/), reworked and updated for my game development purposes.

### Online demo
You can check online [this new interactive demo](https://so-called-games.github.io/json-editor/).

## Added and updated features
There are following features which were added or changed in this version of the demo.

### Direct link copying
Now instead of updating page and changing URL by clicking the link button, link with the data will just copy to clipboard so you can share it, no need to copy it from browser's URL field.

### Schema and output copying
You can quickly copy ACE Editors text both for the schema and the output by clicking at the *"Copy"* button, so it's much more easy to instantly copy edited text on touchscreen devices.

### Upload and download JSON source
You can upload a file containing JSON source both for the schema and the output by clicking *"Open"* button and download edited JSON by clicking *"Save"* button. All of the file processing is being done by JavaScript, so you can execute this editor on the local path as well. Downloaded file will have name specified in filename input field for the schema or the output, with *".json"* extension added at the end.

### Clearing JSON editors
You can quickly reset ACE Editor for the schema or the output by clicking *"Clear"*. This feature was also added for the editor to be more friendly on touchscreen devices.

### Editor expanding option
You can expand the property editor by clicking button next to the *"Reset"*. In expanded mode all of the elements are hidden besides a main header, this button to collapse back and the editor itself.

### Mobile-friendly scaling
Scaling of the editor page is different for desktop and mobile devices. This is because with greater scale the editor will look and control more reliably on mobile devices.

### Additional themes
Some additional Bootstrap 5 and ACE Editor themes were implemented, including dark ones (dark theme is set by default).

### Overall look
Look of the editor page was changed a bit to be nicer and less overloaded by additional text and options. The only options remain now is boolean options of the editor itself, *Show Errors*, *Theme* and *Icons* (also Spectre and Tailwind themes were removed since they look cluttered and unfriendly in my opinion).