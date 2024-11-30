var defaultSchema = {
	"type": "object"
}
var data = {}
var defaultOptions = Object.assign({}, JSONEditor.defaults.options, {
	disable_array_delete_all_rows: true,
	disable_array_delete_last_row: true,
	disable_edit_json: true,
	prompt_before_delete: false,
	case_sensitive_property_search: false,
	schema: defaultSchema,
	theme: "bootstrap5_dark",
	iconlib: "fontawesome5",
	object_layout: "normal",
	show_errors: "interaction"
})
const defaultExtras = {
	output: "",
	schema: ""
}
var customThemes = [
	"_dark",
	"_black"
]
var copyScrollOptions = {
	behavior: "instant",
	block: "start",
	inline: "nearest"
}
var jsonEditor = null
const jsonEditorInitDelay = 500
const QRCodeDimensions = 256
var isExpanded = false
var overlay = document.querySelector("#overlay")
var QRCodeDiv = document.querySelector("#qr-code-div")
var QRCodeContainer = document.querySelector("#qr-code")
var QRCode = new QRCode(QRCodeContainer, {
	useSVG: true,
	width: QRCodeDimensions,
	height: QRCodeDimensions,
	correctLevel: QRCode.CorrectLevel.L
})
var expandedTextarea = document.querySelector("#expanded-textarea")
var mainDiv = document.querySelector("#main-div")
var editorDiv = document.querySelector("#editor-div")
var outputDiv = document.querySelector("#output-div")
var schemaDiv = document.querySelector("#schema-div")
var optionsDiv = document.querySelector("#options-div")
var descriptionParagraph = document.querySelector("#description")
var resetButton = document.querySelector("#reset")
var directLink = document.querySelector("#direct-link")
var showQRCode = document.querySelector("#show-qr-code")
var expandButton = document.querySelector("#expand")
var expandButtonIcon = expandButton.querySelector("i")
var outputAdditionalButton = document.querySelector("#output-additional-expand")
var outputAdditionalButtonIcon = outputAdditionalButton.querySelector("i")
var outputAdditionalDiv = document.querySelector("#output-additional-div")
var schemaAdditionalButton = document.querySelector("#schema-additional-expand")
var schemaAdditionalButtonIcon = schemaAdditionalButton.querySelector("i")
var schemaAdditionalDiv = document.querySelector("#schema-additional-div")
var booleanOptionsSelect = document.querySelector("#boolean-options-select")
var head = document.getElementsByTagName("head")[0]
var iconlibSelect = document.querySelector("#iconlib-select")
var iconlibLink = document.querySelector("#iconlib-link")
var libSelect = document.querySelector("#lib-select")
var jsonEditorForm = document.querySelector("#json-editor-form")
var objectLayoutSelect = document.querySelector("#object-layout-select")
var loadOutput = document.querySelector("#load-output")
var setOutput = document.querySelector("#set-output")
var clearOutput = document.querySelector("#clear-output")
var copyOutput = document.querySelector("#copy-output")
var openOutput = document.querySelector("#open-output")
var saveOutput = document.querySelector("#save-output")
var outputURL = document.querySelector("#output-url")
var outputFilename = document.querySelector("#output-filename")
var loadSchema = document.querySelector("#load-schema")
var setSchema = document.querySelector("#set-schema")
var clearSchema = document.querySelector("#clear-schema")
var copySchema = document.querySelector("#copy-schema")
var openSchema = document.querySelector("#open-schema")
var saveSchema = document.querySelector("#save-schema")
var schemaURL = document.querySelector("#schema-url")
var schemaFilename = document.querySelector("#schema-filename")
var showErrorsSelect = document.querySelector("#show-errors-select")
var themeSelect = document.querySelector("#theme-select")
var themeLink = document.querySelector("#theme-link")
var validateTextarea = document.querySelector("#validate-textarea")
var aceConfig = {
	mode: "ace/mode/json",
	theme: "ace/theme/textmate",
	minLines: 4,
	maxLines: 48,
	showFoldWidgets: false,
	showPrintMargin: false,
	wrap: true
}
var outputTextarea = ace.edit("output-textarea", aceConfig)
var schemaTextarea = ace.edit("schema-textarea", aceConfig)
var ajvErrorsTextarea = ace.edit("ajv-errors-textarea", aceConfig)
var jeErrorsTextarea = ace.edit("je-errors-textarea", aceConfig)
ajvErrorsTextarea.setReadOnly(true)
jeErrorsTextarea.setReadOnly(true)
var ajvErrorsCount = document.querySelector("#ajv-errors-count")
var jeErrorsCount = document.querySelector("#je-errors-count")
var ajv = new AjvValidator()
var outputXHR
var schemaXHR

function isEmpty(object)
{
	for (const property in object)
		if (Object.hasOwn(object, property))
		  return false
	return true
}

String.prototype.replaceAll = function(search, replacement)
{
	var target = this
	return target.replace(new RegExp(search, "g"), replacement)
}

String.prototype.replaceAllFromList = function(searchList, replacement)
{
	var target = this
	
	for (let i = 0; i < searchList.length; i++)
		target = target.replaceAll(searchList[i], replacement)
	return target
}

function replaceSpacings(dataToReplace)
{
	return dataToReplace.replaceAll("  ", "	")
}

function makeLink()
{
	var modifiedData = JSON.parse(JSON.stringify(data))
	
	if (modifiedData.filenames.output == "")
		delete modifiedData.filenames.output
	
	if (modifiedData.filenames.schema == "")
		delete modifiedData.filenames.schema
	
	if (isEmpty(modifiedData.filenames))
		delete modifiedData.filenames
	
	if (modifiedData.urls.output == "")
		delete modifiedData.urls.output
	
	if (modifiedData.urls.schema == "")
		delete modifiedData.urls.schema
	
	if (isEmpty(modifiedData.urls))
		delete modifiedData.urls
	
	for (const [key, value] of Object.entries(modifiedData.options))
	{
		if (JSON.stringify(value) == JSON.stringify(defaultOptions[key]) || defaultOptions[key] == undefined)
			delete modifiedData.options[key]
	}
	
	if (isEmpty(modifiedData.options))
		delete modifiedData.options
	var url = window.location.href.replace(/\?.*/, "")
	
	if (!isEmpty(modifiedData))
	{
		url += "?data="
		url += LZString.compressToEncodedURIComponent(JSON.stringify(modifiedData))
	}
	return url
}

function copyToClipboard(element)
{
	var tempArea = document.createElement("input")
	tempArea.value = element
	document.body.appendChild(tempArea)
	tempArea.focus()
	tempArea.select()
	document.execCommand("copy")
	document.body.removeChild(tempArea)
}

function initXHR()
{
	outputXHR = new XMLHttpRequest()
	
	outputXHR.onreadystatechange = function ()
	{
		if (outputXHR.readyState === 4)
			outputXHRIsReady()
	}
	schemaXHR = new XMLHttpRequest()
	
	schemaXHR.onreadystatechange = function ()
	{
		if (schemaXHR.readyState === 4)
			schemaXHRIsReady()
	}
}

function outputXHRIsReady()
{
	outputTextarea.setValue(outputXHR.responseText)
	outputTextarea.clearSelection(1)
	setOutput.click()
}

function schemaXHRIsReady()
{
	schemaTextarea.setValue(schemaXHR.responseText)
	schemaTextarea.clearSelection(1)
	setSchema.click()
}

function loadJSON(url, xhr)
{
	xhr.open("GET", url)
	xhr.send(null)
}

function openJSON(elementToSet, elementToClick)
{
	var tempInput = document.createElement("input")
	tempInput.setAttribute("id", "upload-input")
	tempInput.type = "file"
	tempInput.click()
	var content
	
	tempInput.onchange = e =>
	{
		var file = e.target.files[0]
		var reader = new FileReader()
		reader.readAsText(file, "UTF-8")
		reader.onload = readerEvent =>
		{
			elementToSet.setValue(readerEvent.target.result)
			elementToSet.clearSelection(1)
			elementToClick.click()
			tempInput.remove()
		}
	}
}

function saveJSON(data, filename, type)
{
	var file = new Blob([data], {type: type})
	
	if (window.navigator.msSaveOrOpenBlob)
		window.navigator.msSaveOrOpenBlob(file, filename)
	else
	{
		var a = document.createElement("a"),
		url = URL.createObjectURL(file)
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		setTimeout(function()
		{
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
		}, 0);
	}
}

const validateSchema = () =>
{
	schemaTextarea.setValue(replaceSpacings(JSON.stringify(data.options.schema, null, 2)))
	const dataToValidate = JSON.parse(schemaTextarea.getValue())
	let errors
	ajvErrorsCount.textContent = "0"
	errors = ajv.validate202012(dataToValidate)
	ajvErrorsTextarea.setValue(replaceSpacings(JSON.stringify(errors, null, 2)))
	ajvErrorsCount.textContent = JSON.stringify(errors.length)
	schemaTextarea.clearSelection(1)
	ajvErrorsTextarea.clearSelection(1)
	jeErrorsCount.textContent = "0"
	errors = ajv.validateJeMetaSchema(dataToValidate)
	jeErrorsTextarea.setValue(replaceSpacings(JSON.stringify(errors, null, 2)))
	jeErrorsCount.textContent = JSON.stringify(errors.length)
	schemaTextarea.clearSelection(1)
	jeErrorsTextarea.clearSelection(1)
	schemaTextarea.setValue(replaceSpacings(schemaTextarea.getSession().getValue()))
	initJsonEditor()
}

var parseURL = function()
{
	data.filenames = Object.assign({}, defaultExtras)
	data.urls = Object.assign({}, defaultExtras)
	data.options = Object.assign({}, defaultOptions)
	var url = window.location.search
	var queryParamsString = url.substring(1, url.length)
	var queryParams = queryParamsString.split("&")
	
	if (queryParamsString.length)
	{
		queryParams.forEach(function(queryParam)
		{
			var splittedParam = queryParam.split("=")
			var param = splittedParam[0]
			var value = splittedParam[1]

			if (param === "data")
			{
				try
				{
					var parsedData = JSON.parse(LZString.decompressFromEncodedURIComponent(value))
					
					if ("filenames" in parsedData)
						data.filenames = Object.assign({}, parsedData.filenames)
					
					if ("urls" in parsedData)
						data.urls = Object.assign({}, parsedData.urls)
					
					if ("options" in parsedData)
						data.options = Object.assign(data.options, parsedData.options)
				}
				catch (reason)
				{
					console.log(reason)
				}
			}
		})
	}
	
	if ("filenames" in data)
	{
		if ("output" in data.filenames)
			outputFilename.value = data.filenames.output
		
		if ("schema" in data.filenames)
			schemaFilename.value = data.filenames.schema
	}
	initXHR()
	
	if ("urls" in data)
	{
		if ("schema" in data.urls)
		{
			if (data.urls.schema != "")
			{
				schemaURL.value = data.urls.schema
				loadJSON(data.urls.schema, schemaXHR)
			}
		}
		
		if ("output" in data.urls)
		{
			if (data.urls.output != "")
			{
				outputURL.value = data.urls.output
				loadJSON(data.urls.output, outputXHR)
				
				if ("schema" in data.urls)
				{
					outputXHR.onreadystatechange = function ()
					{
						if (outputXHR.readyState === 4)
						{
							if (!(schemaXHR.readyState === 4))
							{
								schemaXHR.onreadystatechange = function ()
								{
									if (schemaXHR.readyState === 4)
									{
										schemaXHRIsReady()
										setTimeout(() =>
										{
											outputXHRIsReady()
											initXHR()
										}, jsonEditorInitDelay)
									}
								}
							}
							else
								outputXHRIsReady()
						}
					}
				}
			}
		}
	}
	validateSchema()
	refreshUI()
}

var refreshUI = function()
{
	var themeMap = {
		html: "",
		bootstrap3: "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css",
		bootstrap5: "./include/css/bootstrap5.css",
		bootstrap5_dark: "./include/css/dark.css",
		bootstrap5_black: "./include/css/black.css"
	}
	themeLink.href = themeMap[data.options.theme]
	themeSelect.value = data.options.theme
	var theme = aceConfig.theme

	if (data.options.theme == "bootstrap5_dark" || data.options.theme == "bootstrap5_black")
		theme = "ace/theme/twilight"
	outputTextarea.setTheme(theme)
	schemaTextarea.setTheme(theme)
	ajvErrorsTextarea.setTheme(theme)
	jeErrorsTextarea.setTheme(theme)
	var iconLibMap = {
		jqueryui: "https://code.jquery.com/ui/1.10.3/themes/south-street/jquery-ui.css",
		openiconic: "https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/font/css/open-iconic.min.css",
		spectre: "https://unpkg.com/spectre.css/dist/spectre-icons.min.css",
		bootstrap: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
		fontawesome3: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.css",
		fontawesome4: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css",
		fontawesome5: "https://use.fontawesome.com/releases/v5.6.1/css/all.css"
	}
	iconlibLink.href = iconLibMap[data.options.iconlib]
	iconlibSelect.value = data.options.iconlib
	objectLayoutSelect.value = data.options.object_layout
	showErrorsSelect.value = data.options.show_errors
	var booleanOptions = booleanOptionsSelect.children
	
	for (var i = 0; i < booleanOptions.length; i++)
	{
		var booleanValue = booleanOptions[i]
		
		if (data.options[booleanValue.value])
			booleanValue.selected = true
	}
	var libMapping = {
		ace_editor: {
			js: [
				"https://cdn.jsdelivr.net/npm/ace-editor-builds@1.2.4/src-min-noconflict/ace.js"
			],
			css: []
		},
		choices: {
			js: [
				"https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"
			],
			css: [
				"https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css"
			]
		},
		cleavejs: {
			js: [
				"https://cdn.jsdelivr.net/npm/cleave.js@1.4.7/dist/cleave.min.js"
			],
			css: []
		},
		sceditor: {
			js: [
				"https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
				"https://cdn.jsdelivr.net/npm/sceditor@2.1.3/minified/sceditor.min.js",
				"https://cdn.jsdelivr.net/npm/sceditor@2.1.3/minified/formats/bbcode.js",
				"https://cdn.jsdelivr.net/npm/sceditor@2.1.3/minified/formats/xhtml.js"
			],
			css: [
				"https://cdn.jsdelivr.net/npm/sceditor@2.1.3/minified/themes/default.min.css"
			]
		},
		simplemde: {
			js: [
				"https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"
			],
			css: [
				"https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css"
			]
		},
		select2: {
			js: [
				"https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
				"https://cdn.jsdelivr.net/npm/select2@4.0.6-rc.1/dist/js/select2.min.js"
			],
			css: [
				"https://cdn.jsdelivr.net/npm/select2@4.0.6-rc.1/dist/css/select2.min.css"
			]
		},
		selectize: {
			js: [
				"https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js",
				"https://cdn.jsdelivr.net/npm/selectize@0.12.6/dist/js/standalone/selectize.min.js"
			],
			css: [
				"https://cdn.jsdelivr.net/npm/selectize@0.12.6/dist/css/selectize.min.css",
				"https://cdn.jsdelivr.net/npm/selectize@0.12.6/dist/css/selectize.default.min.css"
			]
		},
		flatpickr: {
			js: [
				"https://cdn.jsdelivr.net/npm/flatpickr"
			],
			css: [
				"https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
			]
		},
		signature_pad: {
			js: [
				"https://cdn.jsdelivr.net/npm/signature_pad@2.3.2/dist/signature_pad.min.js"
			],
			css: []
		},
		mathjs: {
			js: [
				"https://cdn.jsdelivr.net/npm/mathjs@5.3.1/dist/math.min.js"
			],
			css: []
		},
	}
	
	if (data.selectedLibs || data.unselectedLibs)
	{
		var booleanOptions = booleanOptionsSelect.children
		
		for (var i = 0; i < booleanOptions.length; i++)
		{
			var booleanValue = booleanOptions[i]

			if (data.options[booleanValue.value])
				booleanValue.selected = true
		}
		var libSelectChildren = libSelect.children
		
		for (var i = 0; i < libSelectChildren.length; i++)
		{
			var child = libSelectChildren[i]
			child.selected = data.selectedLibs.includes(child.value)
		}
		data.unselectedLibs.forEach(function(selectedLib)
		{
			var concat = libMapping[selectedLib].js.concat(libMapping[selectedLib].css)
			concat.forEach(function()
			{
				var className = ".external_" + selectedLib
				var toRemove = head.querySelector(className)
				
				if (toRemove)
					toRemove.parentNode.removeChild(toRemove)
			})
		})
		data.selectedLibs.forEach(function(selectedLib)
		{
			libMapping[selectedLib].js.forEach(function(js)
			{
				var scriptElement = document.createElement("script")
				scriptElement.type = "text/javascript"
				scriptElement.src = js
				scriptElement.async = false
				scriptElement.classList.add("external_" + selectedLib)
				head.appendChild(scriptElement)
			})
			libMapping[selectedLib].css.forEach(function(css)
			{
				var linkElement = document.createElement("link")
				linkElement.setAttribute("rel", "stylesheet")
				linkElement.setAttribute("type", "text/css")
				linkElement.setAttribute("href", css)
				linkElement.classList.add("external_" + selectedLib)
				head.appendChild(linkElement)
			})
		})
	}
	schemaTextarea.clearSelection(1)
}

var initJsonEditor = function()
{
	if (jsonEditor)
		jsonEditor.destroy()
	var modifiedOptions = Object.assign({}, data.options)
	modifiedOptions.theme = modifiedOptions.theme.replaceAllFromList(customThemes, "")
	jsonEditor = new window.JSONEditor(jsonEditorForm, modifiedOptions)
	jsonEditor.on("change", function()
	{
		var json = jsonEditor.getValue()
		outputTextarea.setValue(replaceSpacings(JSON.stringify(json, null, 2)))
		outputTextarea.clearSelection(1)
		var validationErrors = jsonEditor.validate()
		
		if (validationErrors.length)
			validateTextarea.value = replaceSpacings(JSON.stringify(validationErrors, null, 2))
		else
			validateTextarea.value = "valid"
	})
}
overlay.addEventListener("click", function()
{
	overlay.hidden = true
})
QRCodeDiv.addEventListener("click", function(e)
{
	e.stopPropagation();
})
expandedTextarea.addEventListener("click", function(e)
{
	e.stopPropagation();
})
resetButton.addEventListener("click", function()
{
	window.open("?", "_self")
})
directLink.addEventListener("click", function()
{
	copyToClipboard(makeLink())
	document.body.scrollIntoView(copyScrollOptions)
})
showQRCode.addEventListener("click", function()
{
	var isHidden = overlay.hidden
	overlay.hidden = !isHidden
	QRCodeDiv.hidden = !isHidden
	expandedTextarea.hidden = true
	
	if (isHidden)
		QRCode.makeCode(makeLink())
})
expandButton.addEventListener("click", function()
{
	var isHidden
	
	if (!isExpanded)
	{
		isHidden = true
		editorDiv.className = "col-md-12 w-12"
		expandButtonIcon.className = "fas fa-compress"
	}
	else
	{
		isHidden = false
		editorDiv.className = "col-md-7 w-12"
		expandButtonIcon.className = "fas fa-expand"
	}
	descriptionParagraph.hidden = isHidden
	resetButton.hidden = isHidden
	directLink.hidden = isHidden
	showQRCode.hidden = isHidden
	outputDiv.hidden = isHidden
	schemaDiv.hidden = isHidden
	optionsDiv.hidden = isHidden
	isExpanded = !isExpanded
})
outputAdditionalButton.addEventListener("click", function()
{
	if (outputAdditionalDiv.hidden)
	{
		outputAdditionalDiv.hidden = false
		outputAdditionalButtonIcon.className = "fas fa-caret-down"
	}
	else
	{
		outputAdditionalDiv.hidden = true
		outputAdditionalButtonIcon.className = "fas fa-caret-right"
	}
})
schemaAdditionalButton.addEventListener("click", function()
{
	if (schemaAdditionalDiv.hidden)
	{
		schemaAdditionalDiv.hidden = false
		schemaAdditionalButtonIcon.className = "fas fa-caret-down"
	}
	else
	{
		schemaAdditionalDiv.hidden = true
		schemaAdditionalButtonIcon.className = "fas fa-caret-right"
	}
})
loadOutput.addEventListener("click", function()
{
	loadJSON(outputURL.value, outputXHR)
})
setOutput.addEventListener("click", function()
{
	jsonEditor.setValue(JSON.parse(outputTextarea.getValue()))
})
clearOutput.addEventListener("click", function()
{
	outputTextarea.setValue("{}")
	outputTextarea.clearSelection(1)
	document.body.scrollIntoView(copyScrollOptions)
})
copyOutput.addEventListener("click", function()
{
	copyToClipboard(outputTextarea.getValue())
	document.body.scrollIntoView(copyScrollOptions)
})
openOutput.addEventListener("click", function()
{
	openJSON(outputTextarea, setOutput)
})
saveOutput.addEventListener("click", function()
{
	saveJSON(outputTextarea.getValue(), outputFilename.value + ".json", "application/json")
})
outputURL.addEventListener("change", function()
{
	data.urls.output = outputURL.value
})
outputFilename.addEventListener("change", function()
{
	data.filenames.output = outputFilename.value
})
loadSchema.addEventListener("click", function()
{
	loadJSON(schemaURL.value, schemaXHR)
})
setSchema.addEventListener("click", function()
{
	try
	{
		data.options.schema = JSON.parse(schemaTextarea.getValue())
		validateSchema()
	}
	catch (e)
	{
		alert("Invalid Schema: " + e.message)
		return
	}
	refreshUI()
})
clearSchema.addEventListener("click", function()
{
	schemaTextarea.setValue(replaceSpacings(JSON.stringify(defaultSchema, null, 2)))
	schemaTextarea.clearSelection(1)
	schemaDiv.scrollIntoView(copyScrollOptions)
	setSchema.click()
})
copySchema.addEventListener("click", function()
{
	copyToClipboard(schemaTextarea.getValue())
	schemaDiv.scrollIntoView(copyScrollOptions)
})
openSchema.addEventListener("click", function()
{
	openJSON(schemaTextarea, setSchema)
})
saveSchema.addEventListener("click", function()
{
	saveJSON(schemaTextarea.getValue(), schemaFilename.value + ".json", "application/json")
})
schemaURL.addEventListener("change", function()
{
	data.urls.schema = schemaURL.value
})
schemaFilename.addEventListener("change", function()
{
	data.filenames.schema = schemaFilename.value
})
themeSelect.addEventListener("change", function()
{
	data.options.theme = this.value || ""
	refreshUI()
})
iconlibSelect.addEventListener("change", function()
{
	data.options.iconlib = this.value || ""
	refreshUI()
})
objectLayoutSelect.addEventListener("change", function()
{
	data.options.object_layout = this.value || ""
	refreshUI()
})
showErrorsSelect.addEventListener("change", function()
{
	data.options.show_errors = this.value || ""
	refreshUI()
})
booleanOptionsSelect.addEventListener("change", function()
{
	var booleanOptions = this.children
	
	for (var i = 0; i < booleanOptions.length; i++)
	{
		data.options[booleanOptions[i].value] = booleanOptions[i].selected
	}
	initJsonEditor()
	refreshUI()
})
libSelect.addEventListener("change", function()
{
	data.selectedLibs = []
	data.unselectedLibs = []
	var libs = this.children
	
	for (var i = 0; i < libs.length; i++)
	{
		if (libs[i].selected)
		{
		data.selectedLibs.push(libs[i].value)
		}
		else
		{
		data.unselectedLibs.push(libs[i].value)
		}
	}
	refreshUI()
})
parseURL()
