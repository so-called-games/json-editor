var defaultSchema = {
	"type": "object"
}
var data = {}
var defaultOptions = Object.assign({}, JSONEditor.defaults.options, {
	use_default_values: true,
	use_name_attributes: true,
	prompt_before_delete: false,
	case_sensitive_property_search: false,
	required_by_default: false,
	display_required_only: false,
	show_opt_in: false,
	no_additional_properties: false,
	ajax: false,
	disable_edit_json: true,
	disable_collapse: false,
	disable_properties: false,
	disable_properties_reorder: false,
	disable_textarea_expanding: false,
	disable_expanded_preview: false,
	disable_array_add: false,
	disable_array_reorder: false,
	disable_array_delete: false,
	enable_array_copy: false,
	disable_array_delete_all_rows: true,
	disable_array_delete_last_row: true,
	array_controls_top: false,
	schema: defaultSchema,
	theme: "bootstrap5_dark",
	iconlib: "fontawesome5",
	object_layout: "normal",
	show_errors: "interaction"
})
const customThemes = [
	"_dark",
	"_black"
]
const defaultHides = {
	output: false,
	schema: false,
	errors: true
}
const defaultParseBBCode = false
const defaultExtras = {
	output: "",
	schema: ""
}
const titlePosfix = "JSON Editor"
const titleSeparator = "-"
var messageTimer
const messageShowLength = 2
const messageAnimationLength = 0.5
const messageLinkCopied = "Direct link to this session was copied"
const messageSchemaIsTooLong = "Schema is too long, so it will be removed from QR code"
const messageOutputCopied = "JSON output was copied"
const messageSchemaCopied = "JSON schema was copied"
const messagePreviewFontNotSpecified = "Preview font URL was not specified"
const messagePreviewFontLoadError = "Error occured while loading preview font"
const parsingMap = new Map()
setParsingMap()
var copyScrollOptions = {
	behavior: "instant",
	block: "start",
	inline: "nearest"
}
const jsonEditorInitDelay = 500
const QRCodeDimensions = 384
const QRCodeSaveDimensions = 1024
const QRCodeSaveOffset = 42
var jsonEditor = null
var isExpanded = false
var wasSchemaFromURL = false
var messageDiv = document.querySelector("#message")
var overlay = document.querySelector("#overlay")
var QRCodeDiv = document.querySelector("#qr-code-div")
var QRCodeInnerDiv = document.querySelector("#qr-code-inner-div")
var QRCodeContainer = document.querySelector("#qr-code")
var QRCode = new QRCode(QRCodeContainer, {
	useSVG: true,
	width: QRCodeDimensions,
	height: QRCodeDimensions,
	correctLevel: QRCode.CorrectLevel.L
})
var expandedTextareaDiv = document.querySelector("#expanded-textarea-div")
var expandedTextareaPath = document.querySelector("#expanded-textarea-path")
var expandedTextarea = document.querySelector("#expanded-textarea")
var currentTextarea
var previewDiv = document.querySelector("#preview-div")
var preview = document.querySelector("#preview")
var previewOptionsDiv = document.querySelector("#preview-options-div")
var previewParseBBCode = document.querySelector("#preview-parse-bbcode")
var previewSeparator = document.querySelector("#preview-separator")
var previewFontNormal = document.querySelector("#preview-font-normal")
var previewFontBold = document.querySelector("#preview-font-bold")
var previewFontItalic = document.querySelector("#preview-font-italic")
var previewFontBoldItalic = document.querySelector("#preview-font-bold-italic")
var loadPreviewFontNormal = document.querySelector("#load-preview-font-normal")
var loadPreviewFontBold = document.querySelector("#load-preview-font-bold")
var loadPreviewFontItalic = document.querySelector("#load-preview-font-italic")
var loadPreviewFontBoldItalic = document.querySelector("#load-preview-font-bold-italic")
var previewFontFaceNormal
var previewFontFaceBold
var previewFontFaceItalic
var previewFontFaceBoldItalic
var previewFontSize = document.querySelector("#preview-font-size")
const previewFontSizeMaskOptions = {
	mask: Number,
	scale: 0,
	min: 0,
	max: 32,
	normalizeZeros: true,
	autofix: true
}
const previewFontSizeMask = IMask(previewFontSize, previewFontSizeMaskOptions)
var mainDiv = document.querySelector("#main-div")
var editorDiv = document.querySelector("#editor-div")
var outputDiv = document.querySelector("#output-div")
var schemaDiv = document.querySelector("#schema-div")
var schemaInnerDiv = document.querySelector("#schema-inner-div")
var errorsDiv = document.querySelector("#errors-div")
var errorsInnerDiv = document.querySelector("#errors-inner-div")
var optionsDiv = document.querySelector("#options-div")
var descriptionParagraph = document.querySelector("#description")
var directLink = document.querySelector("#direct-link")
var showQRCode = document.querySelector("#show-qr-code")
var saveQRCode = document.querySelector("#save-qr-code")
var resetButton = document.querySelector("#reset")
var expandButton = document.querySelector("#expand")
var expandButtonIcon = expandButton.querySelector("i")
var previewOptionsButton = document.querySelector("#toggle-preview-options")
var previewOptionsButtonIcon = previewOptionsButton.querySelector("i")
var outputAdditionalButton = document.querySelector("#toggle-output-additional")
var outputAdditionalButtonIcon = outputAdditionalButton.querySelector("i")
var outputAdditionalDiv = document.querySelector("#output-additional-div")
var schemaAdditionalButton = document.querySelector("#toggle-schema-additional")
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
var toggleOutput = document.querySelector("#toggle-output")
var toggleOutputIcon = toggleOutput.querySelector("i")
var outputEditorDiv = document.querySelector("#output-editor-div")
var setOutput = document.querySelector("#set-output")
var clearOutput = document.querySelector("#clear-output")
var copyOutput = document.querySelector("#copy-output")
var openOutput = document.querySelector("#open-output")
var saveOutput = document.querySelector("#save-output")
var outputURL = document.querySelector("#output-url")
var outputFilename = document.querySelector("#output-filename")
var loadSchema = document.querySelector("#load-schema")
var toggleSchema = document.querySelector("#toggle-schema")
var toggleSchemaIcon = toggleSchema.querySelector("i")
var toggleErrors = document.querySelector("#toggle-errors")
var toggleErrorsIcon = toggleErrors.querySelector("i")
var schemaEditorDiv = document.querySelector("#schema-editor-div")
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

Array.prototype.move = function(old_index, new_index)
{
	var array = this
	
	if (new_index >= array.length)
	{
		var k = new_index - array.length + 1
		while (k--)
			array.push(undefined)
	}
	array.splice(new_index, 0, array.splice(old_index, 1)[0])
	return array
}

Object.getByPath = function(object, path)
{
    path = path.replace(/\[(\w+)\]/g, ".$1")
    path = path.replace(/^\./, "")
    var array = path.split(".")
	
    for (var i = 0, n = array.length; i < n; ++i)
	{
        var key = array[i]
		
        if (key in object)
            object = object[key]
		else
            return
    }
    return object
}

Object.setByPath = function(object, path, value)
{
  var array = path.split(".")
  var newObject = object
  
  while (array.length - 1)
  {
    var n = array.shift()
	
    if (!(n in newObject))
		newObject[n] = {}
    newObject = newObject[n]
  }
  newObject[array[0]] = value
}

Object.deleteByPath = function(object, path)
{
	const parts = path.split(".")
	const last = parts.pop()
	
	for (const part of parts)
	{
		object = object[part]
		
		if (!object)
			return
	}
	delete object[last]
}

function getMapKeyByValue(map, searchValue)
{
	for (let [key, value] of map.entries())
	{
		if (value === searchValue)
			return key
	}
}

function replacePropertiesWithMap(object, map, usingValues = false)
{
	for (const [old_key, value] of Object.entries(object))
	{
		if (typeof value === "object" && old_key != "schema" && old_key != "s")
			replacePropertiesWithMap(value, map, usingValues)
		var matchingValue = usingValues ? getMapKeyByValue(map, value) : map.get(value)
		
		if (matchingValue != undefined)
			object[old_key] = matchingValue
		var new_key = usingValues ? getMapKeyByValue(map, old_key) : map.get(old_key)
		
		if (old_key !== new_key)
		{
			Object.defineProperty(object, new_key, Object.getOwnPropertyDescriptor(object, old_key))
			delete object[old_key]
		}
	}
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

function escapeRegExp(string)
{
	return string.replace("/[-[\]{}()*+?.,\\^$|#\s]/g", "\\$&");
}

function rgb(r, g, b)
{
	return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
}

function replaceSpacings(dataToReplace)
{
	return dataToReplace.replaceAll("  ", "	")
}

function setParsingMap()
{
	parsingMap.set(0, false)
	parsingMap.set(1, true)
	parsingMap.set("o", "output")
	parsingMap.set("s", "schema")
	parsingMap.set("h", "hide")
	parsingMap.set("e", "errors")
	parsingMap.set("p", "preview")
	parsingMap.set("bb", "bbcode")
	parsingMap.set("sr", "separator")
	parsingMap.set("fs", "font_size")
	parsingMap.set("fn", "font_normal")
	parsingMap.set("fb", "font_bold")
	parsingMap.set("fi", "font_italic")
	parsingMap.set("fbi", "font_bold_italic")
	parsingMap.set("f", "filenames")
	parsingMap.set("u", "urls")
	parsingMap.set("op", "options")
	parsingMap.set("t", "theme")
	parsingMap.set("no", "html")
	parsingMap.set("b3", "bootstrap3")
	parsingMap.set("b5", "bootstrap5")
	parsingMap.set("b5d", "bootstrap5_dark")
	parsingMap.set("b5b", "bootstrap5_black")
	parsingMap.set("i", "iconlib")
	parsingMap.set("jq", "jqueryui")
	parsingMap.set("oi", "openiconic")
	parsingMap.set("b", "bootstrap")
	parsingMap.set("sc", "spectre")
	parsingMap.set("f3", "fontawesome3")
	parsingMap.set("f4", "fontawesome4")
	parsingMap.set("f5", "fontawesome5")
	parsingMap.set("l", "object_layout")
	parsingMap.set("n", "normal")
	parsingMap.set("g", "grid")
	parsingMap.set("se", "show_errors")
	parsingMap.set("ia", "interaction")
	parsingMap.set("ch", "change")
	parsingMap.set("al", "always")
	parsingMap.set("ne", "never")
	parsingMap.set("sl", "selectedLibs")
	parsingMap.set("ul", "unselectedLibs")
	parsingMap.set("ae", "ace_editor")
	parsingMap.set("ci", "choices")
	parsingMap.set("sce", "sceditor")
	parsingMap.set("smd", "simplemde")
	parsingMap.set("s2", "select2")
	parsingMap.set("st", "selectize")
	parsingMap.set("fp", "flatpickr")
	parsingMap.set("sp", "signature_pad")
	parsingMap.set("mjs", "mathjs")
	parsingMap.set("cjs", "cleavejs")
	parsingMap.set("ud", "use_default_values")
	parsingMap.set("un", "use_name_attributes")
	parsingMap.set("pd", "prompt_before_delete")
	parsingMap.set("cs", "case_sensitive_property_search")
	parsingMap.set("rd", "required_by_default")
	parsingMap.set("ro", "display_required_only")
	parsingMap.set("so", "show_opt_in")
	parsingMap.set("na", "no_additional_properties")
	parsingMap.set("aj", "ajax")
	parsingMap.set("de", "disable_edit_json")
	parsingMap.set("dc", "disable_collapse")
	parsingMap.set("dp", "disable_properties")
	parsingMap.set("dr", "disable_properties_reorder")
	parsingMap.set("dt", "disable_textarea_expanding")
	parsingMap.set("daa", "disable_array_add")
	parsingMap.set("dar", "disable_array_reorder")
	parsingMap.set("dad", "disable_array_delete")
	parsingMap.set("dda", "disable_array_delete_all_rows")
	parsingMap.set("ddr", "disable_array_delete_last_row")
	parsingMap.set("ac", "enable_array_copy")
	parsingMap.set("at", "array_controls_top")
}

function makeLink(includeSchema = true)
{
	var modifiedData = JSON.parse(JSON.stringify(data))
	
	if (modifiedData.hide.output == defaultHides.output)
		delete modifiedData.hide.output
	
	if (modifiedData.hide.schema == defaultHides.schema)
		delete modifiedData.hide.schema
	
	if (modifiedData.hide.errors == defaultHides.errors)
		delete modifiedData.hide.errors
	
	if (isEmpty(modifiedData.hide))
		delete modifiedData.hide
	
	if (modifiedData.preview.bbcode == defaultParseBBCode)
		delete modifiedData.preview.bbcode
	
	if (modifiedData.preview.separator == "")
		delete modifiedData.preview.separator
	
	if (modifiedData.preview.font_size == undefined)
		delete modifiedData.preview.font_size
	
	if (modifiedData.preview.font_normal == "")
		delete modifiedData.preview.font_normal
	
	if (modifiedData.preview.font_bold == "")
		delete modifiedData.preview.font_bold
	
	if (modifiedData.preview.font_italic == "")
		delete modifiedData.preview.font_italic
	
	if (modifiedData.preview.font_bold_italic == "")
		delete modifiedData.preview.font_bold_italic
	
	if (isEmpty(modifiedData.preview))
		delete modifiedData.preview
	
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
	
	if (wasSchemaFromURL || !includeSchema)
		delete modifiedData.options.schema
	
	for (const [key, value] of Object.entries(modifiedData.options))
		if (JSON.stringify(value) == JSON.stringify(defaultOptions[key]))
			delete modifiedData.options[key]
	
	if (isEmpty(modifiedData.options))
		delete modifiedData.options
	replacePropertiesWithMap(modifiedData, parsingMap, true)
	var url = window.location.href.replace(/\?.*/, "")
	
	if (!isEmpty(modifiedData))
	{
		url += "?d="
		url += LZString.compressToEncodedURIComponent(JSON.stringify(modifiedData))
	}
	return url
}

function MakeQRCode(includeSchema)
{
	var isHidden = overlay.hidden
	QRCode.makeCode(makeLink(includeSchema))
	overlay.hidden = !isHidden
	
	if (!QRCode._htOption.useSVG)
	{
		saveQRCode.hidden = true
		QRCodeInnerDiv.classList.add("qr-code-compatible-div")
	}
	QRCodeDiv.hidden = !isHidden
	expandedTextareaDiv.hidden = true
}

function showMessage(message, duration = messageShowLength)
{
	if (messageDiv.innerHTML !== message)
	{
		messageDiv.classList.remove("fade-in")
		messageDiv.classList.remove("fade-out")
		clearTimeout(messageTimer)
		messageDiv.innerHTML = message
		messageDiv.classList.add("fade-in")
		messageDiv.hidden = false
		messageTimer = setTimeout(function()
		{
			messageDiv.classList.remove("fade-in")
			messageTimer = setTimeout(function()
			{
				messageDiv.classList.add("fade-out")
				messageTimer = setTimeout(function()
				{
					messageDiv.hidden = true
					messageDiv.innerHTML = ""
					messageDiv.classList.remove("fade-out")
				}, messageAnimationLength * 1000 - 10)
			}, duration * 1000)
		}, messageAnimationLength * 1000)
	}
}

function copyToClipboard(element)
{
	var tempArea = document.createElement("textarea")
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
		}, 0)
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
	initJSONEditor()
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

			if (param === "d")
			{
				try
				{
					var parsedData = JSON.parse(LZString.decompressFromEncodedURIComponent(value))
					replacePropertiesWithMap(parsedData, parsingMap, false)
					
					if ("hide" in parsedData)
					{
						data.hide = Object.assign({}, parsedData.hide)
						
						if (!("output" in data.hide))
							data.hide.output = defaultHides.output
						
						if (!("schema" in data.hide))
							data.hide.schema = defaultHides.schema
						
						if (!("errors" in data.hide))
							data.hide.errors = defaultHides.errors
					}
					else
						data.hide = Object.assign({}, defaultHides)
					
					if ("preview" in parsedData)
						data.preview = Object.assign({}, parsedData.preview)
					else
						data.preview = {}
					
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
	
	if ("hide" in data)
	{
		if ("output" in data.hide)
			if (data.hide.output)
				{
					data.hide.output = false
					toggleOutput.click()
				}
		
		if ("schema" in data.hide)
			if (data.hide.schema)
				{
					data.hide.schema = false
					toggleSchema.click()
				}
		
		if ("errors" in data.hide)
		{
			if (data.hide.errors)
			{
				data.hide.errors = false
				toggleErrors.click()
			}
		}
		else
		{
			data.hide.errors = false
			toggleErrors.click()
		}
	}
	else
	{
		data.hide = Object.assign({}, defaultHides)
		data.hide.errors = false
		toggleErrors.click()
	}
	
	if ("preview" in data)
	{
		if ("bbcode" in data.preview)
			previewParseBBCode.checked = (data.preview.bbcode != "false")
		else
		{
			data.preview.bbcode = defaultParseBBCode
			previewParseBBCode.checked = defaultParseBBCode
		}
		
		if ("separator" in data.preview)
			previewSeparator.value = data.preview.separator
		
		if ("font_size" in data.preview)
			previewFontSize.value = Number(data.preview.font_size)
		
		if ("font_normal" in data.preview)
		{
			previewFontNormal.value = data.preview.font_normal
			loadPreviewFontNormal.click()
		}
		
		if ("font_bold" in data.preview)
		{
			previewFontBold.value = data.preview.font_bold
			loadPreviewFontBold.click()
		}
		
		if ("font_italic" in data.preview)
		{
			previewFontItalic.value = data.preview.font_italic
			loadPreviewFontItalic.click()
		}
		
		if ("font_bold_italic" in data.preview)
		{
			previewFontBoldItalic.value = data.preview.font_bold_italic
			loadPreviewFontBoldItalic.click()
		}
	}
	else
	{
		data.preview = {}
		data.preview.bbcode = defaultParseBBCode
		previewParseBBCode.checked = defaultParseBBCode
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
				wasSchemaFromURL = true
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

function refreshPreview()
{
	var value = expandedTextarea.value
	var useBBCode = data.preview != undefined && data.preview.bbcode != undefined && data.preview.bbcode
	
	if (data.preview != undefined && data.preview.separator != undefined && data.preview.separator != "")
	{
		var gutterColor = eval(getComputedStyle(previewDiv.querySelector("#preview-reference-gutter")).color)
		var iterateTimes = value.split(data.preview.separator).length - 1
		var lastIndex = 0
		
		for (let i = 1; i <= iterateTimes; i++)
		{
			var currentIndex = value.indexOf(data.preview.separator, lastIndex)
			var indexedGutter = ""
			
			if (i == 1)
			{
				indexedGutter = useBBCode ? "[b][color=" + gutterColor + "]" + i + ":[/color][/b] " : "<span class=\"preview-gutter\">" + i + ": </span>"
				value = value.substr(0, lastIndex) + indexedGutter + value.substr(lastIndex)
				currentIndex += indexedGutter.length
			}
			indexedGutter = useBBCode ? "\n[b][color=" + gutterColor + "]" + (i + 1) + ":[/color][/b] " : "<br><span class=\"preview-gutter\">" + (i + 1) + ": </span>"
			value = value.substr(0, currentIndex) + indexedGutter + value.substr(currentIndex)
			lastIndex = currentIndex + indexedGutter.length
			value = value.slice(0, lastIndex) + value.slice(lastIndex + data.preview.separator.length)
		}
	}
	
	if (data.preview.font_size != undefined)
		preview.style.fontSize = data.preview.font_size + "pt"
	else
		preview.style.fontSize = ""
	preview.innerHTML = ""
	
	if (useBBCode)
		preview.appendChild(renderBBCode(value))
	else
		preview.innerHTML = value
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
	
	if (data.options.disable_expanded_preview)
	{
		previewDiv.hidden = true
		expandedTextarea.classList.add("expanded-textarea-rounded")
		expandedTextarea.removeEventListener("input", refreshPreview)
	}
	else
	{
		previewDiv.hidden = false
		expandedTextarea.classList.remove("expanded-textarea-rounded")
		expandedTextarea.addEventListener("input", refreshPreview)
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

var initJSONEditor = function(initialValue = undefined, expandPath = undefined)
{
	if (jsonEditor)
		jsonEditor.destroy()
	var modifiedOptions = Object.assign({}, data.options)
	modifiedOptions.theme = modifiedOptions.theme.replaceAllFromList(customThemes, "")
	jsonEditor = new window.JSONEditor(jsonEditorForm, modifiedOptions)
	
	jsonEditor.on("ready", function()
	{
		var rootName = jsonEditorForm.querySelectorAll(".je-object__container > .je-object__title > span")[0].innerText
		
		if (rootName != "root")
			document.title = rootName + " " + titleSeparator + " " + titlePosfix
		else
			document.title = titlePosfix
		
		if (initialValue)
		{
			jsonEditor.setValue(initialValue)
			
			if (expandPath)
			{
				var constructedPath
				var pathArray = expandPath.split(".")
				
				for (let i = 0; i < pathArray.length; i++)
				{
					if (constructedPath)
						constructedPath += "." + pathArray[i]
					else
						constructedPath = pathArray[i]
					var currentElement = jsonEditorForm.querySelector(".je-object__container[data-schemapath='" + constructedPath + "']")
					
					if (currentElement.querySelectorAll(":scope > .card")[0].style.display === "none")
						currentElement.querySelector(".json-editor-btntype-toggle").click()
				}
			}
		}
	})
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
		
		if (!data.options.disable_properties_reorder)
		{
			objectControlsList = Array.from(jsonEditorForm.querySelector(".je-object__container .card").querySelectorAll(".je-object__controls"))
			objectControlsList.forEach((controlElement) =>
			{
				reorderButtons = Array.from(controlElement.querySelectorAll(".json-editor-property-control-button"))
				reorderButtons.forEach((reorderButton) =>
				{
					reorderButton.remove()
				})
				controlElement.querySelectorAll(".json-editor-property-control-button") == null
				var comparedParent = controlElement.parentNode.parentNode
				var generalParent = comparedParent.parentNode
				
				if (comparedParent.previousSibling != null && comparedParent.previousSibling.querySelector(".je-object__container") != null || comparedParent.nextSibling != null && comparedParent.nextSibling.querySelector(".je-object__container") != null)
				{
					for (let i = 0; i < 2; i++)
					{
						var postfix = (i == 0) ? "up" : "down"
						var moveButton = document.createElement("button")
						moveButton.type = "button"
						moveButton.title = "Move property " + postfix
						moveButton.classList.add("btn", "btn-secondary", "btn-sm", "json-editor-property-control-button", "json-editor-btntype-move" + postfix)
						moveButton.onclick = function()
						{
							reorderProperty(comparedParent, i)
						}
						var icon = document.createElement("i")
						icon.classList.add("fas", "fa-caret-" + postfix)
						moveButton.appendChild(icon)
						controlElement.appendChild(moveButton)
						
						if ((generalParent.querySelectorAll(":scope > .row:first-child")[0] == comparedParent) && i == 0 || (generalParent.querySelectorAll(":scope > .row:last-child")[0] == comparedParent) && i == 1)
							moveButton.classList.add("visually-hidden")
					}
				}
			})
		}
		
		if (!data.options.disable_textarea_expanding)
		{
			textareaList = Array.from(jsonEditorForm.querySelectorAll("textarea:not(.je-object__controls *, .textarea-clone)"))
			textareaList.forEach((textareaElement) =>
			{
				parentNode = textareaElement.parentNode
				
				if (!parentNode.classList.contains("input-group"))
				{
					textareaElement.classList.add("textarea-clone")
					textareaElement.hidden = true
					var inputGroup = document.createElement("div")
					inputGroup.classList.add("input-group")
					var movedTextarea = document.createElement("textarea")
					movedTextarea.classList.add("form-control")
					movedTextarea.value = textareaElement.value
					movedTextarea.onchange = function()
					{
						textareaElement.value = movedTextarea.value
						var event = new Event("change")
						textareaElement.dispatchEvent(event)
					}
					inputGroup.appendChild(movedTextarea)
					var expandTextareaButton = document.createElement("button")
					expandTextareaButton.type = "button"
					expandTextareaButton.title = "Expand to fullscreen"
					expandTextareaButton.classList.add("btn", "btn-sm", "btn-secondary", "expand-button")
					expandTextareaButton.onclick = function()
					{
						expandTextarea(movedTextarea)
					}
					var icon = document.createElement("i")
					icon.classList.add("fas", "fa-expand")
					expandTextareaButton.appendChild(icon)
					inputGroup.appendChild(expandTextareaButton)
					parentNode.appendChild(inputGroup)
				}
			})
		}
	})
}

function reorderProperty(propertyRow, direction)
{
	var path = propertyRow.querySelector(".je-object__container").dataset.schemapath
	var parentPath = propertyRow.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(".je-object__container").dataset.schemapath
	
	if (direction == 0)
		propertyRow.parentNode.insertBefore(propertyRow, propertyRow.previousSibling)
	else
		propertyRow.nextSibling.after(propertyRow)
	var propertyContainer = jsonEditor.getEditor(parentPath)
	var arrayFromContainer = Object.entries(propertyContainer.getValue())
	var propertyIndex
	var propertyName = path.split(".").pop()
	
	for (let i = 0; i < arrayFromContainer.length; i++)
	{
		if (arrayFromContainer[i][0] == propertyName)
		{
			propertyIndex = i
			break
		}
	}
	arrayFromContainer.move(propertyIndex, propertyIndex + (direction == 0 ? -1 : 1))
	var jsonData = jsonEditor.getValue()
	var reorderedData = Object.fromEntries(arrayFromContainer)
	var parentPathWithoutRoot = parentPath.replace(new RegExp("^(root\.|root)"), "")
	
	if (parentPathWithoutRoot === "")
		jsonData = Object.assign({}, reorderedData)
	else
		Object.setByPath(jsonData, parentPathWithoutRoot, Object.assign({}, reorderedData))
	initJSONEditor(jsonData, parentPath)
}

function expandTextarea(textareaElement)
{
	currentTextarea = textareaElement
	expandedTextarea.value = textareaElement.value
	var sourcePath = textareaElement.parentNode.parentNode.querySelector("label.form-label").getAttribute("for")
	sourcePath = sourcePath.replace(new RegExp("^root\\["), "").replace(new RegExp("\\]$"), "").replaceAll("\\]\\[", " / ")
	expandedTextareaPath.innerHTML = sourcePath
	refreshPreview()
	QRCodeDiv.hidden = true
	overlay.hidden = false
	expandedTextareaDiv.hidden = false
}
overlay.addEventListener("click", function()
{
	if (currentTextarea != undefined)
	{
		currentTextarea.value = expandedTextarea.value
		var event = new Event("change")
		currentTextarea.dispatchEvent(event)
		currentTextarea = undefined
		expandedTextarea.value = ""
		expandedTextareaPath.innerHTML = ""
	}
	overlay.hidden = true
})
QRCodeDiv.addEventListener("click", function(e)
{
	e.stopPropagation();
})
expandedTextareaDiv.addEventListener("click", function(e)
{
	e.stopPropagation();
})
saveQRCode.addEventListener("click", function()
{
	var clonedSVG = QRCodeContainer.querySelector("svg").parentNode.cloneNode(true)
	clonedSVG.querySelector("rect#template").setAttribute("stroke", "black")
	clonedSVG.querySelector("rect#template").setAttribute("stroke-width", "1.125px")
	clonedSVG.querySelector("rect#template").setAttribute("vector-effect", "non-scaling-stroke")
	var source = "data:image/svg+xml;base64," + btoa(clonedSVG.innerHTML)
	var canvas = document.createElement("canvas")
	canvas.setAttribute("width", QRCodeSaveDimensions)
	canvas.setAttribute("height", QRCodeSaveDimensions)
	var context = canvas.getContext("2d")
	context.imageSmoothingEnabled = false
	context.fillStyle = "white"
	context.fillRect(0, 0, QRCodeSaveDimensions, QRCodeSaveDimensions)
	var imageElement = new Image()
	var offsetedSize = QRCodeSaveDimensions - 2 * QRCodeSaveOffset
	imageElement.setAttribute("width", offsetedSize)
	imageElement.setAttribute("height", offsetedSize)
	imageElement.setAttribute("style", "image-rendering: pixelated;")
	imageElement.src = source
	imageElement.decode().then(() =>
	{
		context.drawImage(imageElement, QRCodeSaveOffset, QRCodeSaveOffset, offsetedSize, offsetedSize)
		var canvasData = canvas.toDataURL("image/png")
		var a = document.createElement("a")
		a.textContent = "save"
		a.download = "qr-code.png"
		a.href = canvasData
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		canvas.remove()
	})
})
directLink.addEventListener("click", function()
{
	copyToClipboard(makeLink())
	document.body.scrollIntoView(copyScrollOptions)
	showMessage(messageLinkCopied)
})
showQRCode.addEventListener("click", function()
{
	var isHidden = overlay.hidden
	
	if (isHidden)
	{
		try
		{
			MakeQRCode(true)
		}
		catch (e)
		{
			if (e.message === "QRCodeLimitLength[i] is undefined")
			{
				showMessage(messageSchemaIsTooLong)
				MakeQRCode(false)
			}
			else
				alert("Error occured while generating QR code: " + e.message + ".")
		}
	}
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
previewOptionsButton.addEventListener("click", function()
{
	if (previewOptionsDiv.hidden)
	{
		previewOptionsDiv.hidden = false
		previewOptionsButtonIcon.className = "fas fa-caret-down"
	}
	else
	{
		previewOptionsDiv.hidden = true
		previewOptionsButtonIcon.className = "fas fa-caret-right"
	}
})
previewParseBBCode.addEventListener("change", function()
{
	data.preview.bbcode = previewParseBBCode.checked
	refreshPreview()
})
previewSeparator.addEventListener("change", function()
{
	data.preview.separator = previewSeparator.value
	refreshPreview()
})
previewFontSize.addEventListener("change", function()
{
	if (previewFontSize.value != "")
	{
		try
		{
			var proposedSize = parseInt(previewFontSize.value)
			data.preview.font_size = proposedSize
		}
		catch (e)
		{
			alert(e.message)
		}
	}
	else
		if (data.preview.font_size != undefined)
			delete data.preview.font_size
	refreshPreview()
})
previewFontNormal.addEventListener("change", function()
{
	data.preview.font_normal = previewFontNormal.value
})
previewFontBold.addEventListener("change", function()
{
	data.preview.font_bold = previewFontBold.value
})
previewFontItalic.addEventListener("change", function()
{
	data.preview.font_italic = previewFontItalic.value
})
previewFontBoldItalic.addEventListener("change", function()
{
	data.preview.font_bold_italic = previewFontBoldItalic.value
})
loadPreviewFontNormal.addEventListener("click", function()
{
	if (data.preview.font_normal != undefined && data.preview.font_normal != "")
	{
		var fontName = "CustomFontRegular"
		
		if (previewFontFaceNormal != undefined)
			document.fonts.delete(previewFontFaceNormal)
		previewFontFaceNormal = new FontFace(fontName, "url(" + data.preview.font_normal + ")")
		previewFontFaceNormal.load().then(function(loadedFont)
		{
			document.fonts.add(loadedFont)
		}).catch(function(e)
		{
			showMessage(messagePreviewFontLoadError)
		})
	}
	else
		showMessage(messagePreviewFontNotSpecified)
})
loadPreviewFontBold.addEventListener("click", function()
{
	if (data.preview.font_bold != undefined && data.preview.font_bold != "")
	{
		var fontName = "CustomFontBold"
		
		if (previewFontFaceBold != undefined)
			document.fonts.delete(previewFontFaceBold)
		previewFontFaceBold = new FontFace(fontName, "url(" + data.preview.font_bold + ")")
		previewFontFaceBold.load().then(function(loadedFont)
		{
			document.fonts.add(loadedFont)
		}).catch(function(e)
		{
			showMessage(messagePreviewFontLoadError)
		})
	}
	else
		showMessage(messagePreviewFontNotSpecified)
})
loadPreviewFontItalic.addEventListener("click", function()
{
	if (data.preview.font_italic != undefined && data.preview.font_italic != "")
	{
		var fontName = "CustomFontItalic"
		
		if (previewFontFaceItalic != undefined)
			document.fonts.delete(previewFontFaceItalic)
		previewFontFaceItalic = new FontFace(fontName, "url(" + data.preview.font_italic + ")")
		previewFontFaceItalic.load().then(function(loadedFont)
		{
			preview.style.fontFamily = fontName
		}).catch(function(e)
		{
			showMessage(messagePreviewFontLoadError)
		})
	}
	else
		showMessage(messagePreviewFontNotSpecified)
})
loadPreviewFontBoldItalic.addEventListener("click", function()
{
	if (data.preview.font_bold_italic != undefined && data.preview.font_bold_italic != "")
	{
		var fontName = "CustomFontBoldItalic"
		
		if (previewFontFaceBoldItalic != undefined)
			document.fonts.delete(previewFontFaceBoldItalic)
		previewFontFaceBoldItalic = new FontFace(fontName, "url(" + data.preview.font_bold_italic + ")")
		previewFontFaceBoldItalic.load().then(function(loadedFont)
		{
			preview.style.fontFamily = fontName
		}).catch(function(e)
		{
			showMessage(messagePreviewFontLoadError)
		})
	}
	else
		showMessage(messagePreviewFontNotSpecified)
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
toggleOutput.addEventListener("click", function()
{
	if ("hide" in data)
	{
		if ("output" in data.hide)
		{
			data.hide.output = !data.hide.output
		}
		else
			data.hide.output = !defaultHides.output
	}
	else
		data.hide = { "output": !defaultHides.output }
	var isHidden
	
	if (data.hide.output)
	{
		isHidden = true
		toggleOutputIcon.className = "fas fa-caret-right"
	}
	else
	{
		isHidden = false
		toggleOutputIcon.className = "fas fa-caret-down"
	}
	outputEditorDiv.hidden = isHidden
	
	if (!isHidden)
		outputTextarea.resize()
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
	showMessage(messageOutputCopied)
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
	wasSchemaFromURL = true
})
toggleSchema.addEventListener("click", function()
{
	if ("hide" in data)
	{
		if ("schema" in data.hide)
		{
			data.hide.schema = !data.hide.schema
		}
		else
			data.hide.schema = !defaultHides.schema
	}
	else
		data.hide = { "schema": !defaultHides.schema }
	var isHidden
	
	if (data.hide.schema)
	{
		isHidden = true
		toggleSchemaIcon.className = "fas fa-caret-right"
	}
	else
	{
		isHidden = false
		toggleSchemaIcon.className = "fas fa-caret-down"
	}
	schemaEditorDiv.hidden = isHidden
	
	if (!isHidden)
		schemaTextarea.resize()
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
	showMessage(messageSchemaCopied)
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
	wasSchemaFromURL = false
})
schemaFilename.addEventListener("change", function()
{
	data.filenames.schema = schemaFilename.value
})
toggleErrors.addEventListener("click", function()
{
	if ("hide" in data)
	{
		if ("errors" in data.hide)
		{
			data.hide.errors = !data.hide.errors
		}
		else
			data.hide.errors = !defaultHides.errors
	}
	else
		data.hide = { "errors": !defaultHides.errors }
	var isHidden
	
	if (data.hide.errors)
	{
		isHidden = true
		schemaInnerDiv.className = "col-md-12 w-12"
		errorsDiv.className = "col-md-0 w-12"
		toggleErrorsIcon.className = "fas fa-caret-right"
	}
	else
	{
		isHidden = false
		schemaInnerDiv.className = "col-md-7 w-12"
		errorsDiv.className = "col-md-5 w-12"
		toggleErrorsIcon.className = "fas fa-caret-down"
	}
	schemaTextarea.resize()
	ajvErrorsTextarea.resize()
	jeErrorsTextarea.resize()
	errorsInnerDiv.hidden = isHidden
	
	if (!isHidden)
	{
		errorsDiv.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
		ajvErrorsTextarea.resize()
		jeErrorsTextarea.resize()
	}
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
		data.options[booleanOptions[i].value] = booleanOptions[i].selected
	initJSONEditor(JSON.parse(outputTextarea.getValue()))
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
			data.selectedLibs.push(libs[i].value)
		else
			data.unselectedLibs.push(libs[i].value)
	}
	refreshUI()
})
parseURL()
