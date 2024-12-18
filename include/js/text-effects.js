const className = "text-effect"
const customTags = {
	"pulse": {
		"freq": "number",
		"color": "color",
		"ease": "number"
	},
	"wave": {
		"amp": "number",
		"freq": "number",
		"connected": "integer"
	},
	"tornado": {
		"radius": "number",
		"freq": "number",
		"connected": "integer"
	},
	"shake": {
		"rate": "number",
		"level": "integer",
		"connected": "integer"
	},
	"fade": {
		"start": "integer",
		"length": "integer"
	},
	"rainbow": {
		"freq": "number",
		"sat": "number",
		"val": "number",
	}
}
const frequencySyncMultiplier = 1.875
var effectFPS
var effectTagsCollection = []
var effectTickTimer
var elapsedTime

function ease(x, curve)
{
	if (x < 0)
		x = 0
	else if (x > 1)
		x = 1
	
	if (curve > 0)
	{
		if (curve < 1)
			return 1 - Math.pow(1 - x, 1 / curve)
		else
			return Math.pow(x, curve)
	}
	else if (curve < 0)
	{
		if (x < 0.5)
			return Math.pow(x * 2.0, -curve) * 0.5
		else
			return (1.0 - Math.pow(1.0 - (x - 0.5) * 2.0, -curve)) * 0.5 + 0.5
	}
	else
		return 0
}

function fract(value)
{
	return value - Math.floor(value)
}

function pingpong(value, length)
{
	return (length != 0) ? Math.abs(fract((value - length) / (length * 2)) * length * 2 - length) : 0
}

function lerp(a, b, weight)
{
	return a + weight * (b - a)
}

function multiplyColors(colorOne, colorTwo)
{
	var r, g, b, a
	r = colorOne.r * colorTwo.r
	g = colorOne.g * colorTwo.g
	b = colorOne.b * colorTwo.b
	a = colorOne.a * colorTwo.a
	return {
		r: r,
		g: g,
		b: b,
		a: a
	}
}

function lerpColors(colorFrom, colorTo, weight)
{
	var r, g, b, a
	r = lerp(colorFrom.r, colorTo.r, weight)
	g = lerp(colorFrom.g, colorTo.g, weight)
	b = lerp(colorFrom.b, colorTo.b, weight)
	a = lerp(colorFrom.a, colorTo.a, weight)
	return {
		r: r,
		g: g,
		b: b,
		a: a
	}
}

const HEXToRGB = (hex) =>
{
	const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
	return {
		r: r / 255,
		g: g / 255,
		b: b / 255
	}
}

const HEXToRGBA = (hex) =>
{
	const [r, g, b, a] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
	return {
		r: r / 255,
		g: g / 255,
		b: b / 255,
		a: a / 255
	}
}

function HSVToRGB(h, s, v)
{
	var r, g, b, i, f, p, q, t
	
	if (arguments.length === 1)
	{
		s = h.s,
		v = h.v,
		h = h.h
	}
	i = Math.floor(h * 6)
	f = h * 6 - i
	p = v * (1 - s)
	q = v * (1 - f * s)
	t = v * (1 - (1 - f) * s)
	
	switch (i % 6)
	{
		case 0:
			r = v,
			g = t,
			b = p
			break
		case 1:
			r = q,
			g = v,
			b = p
			break
		case 2:
			r = p,
			g = v,
			b = t
			break
		case 3:
			r = p,
			g = q,
			b = v
			break
		case 4:
			r = t,
			g = p,
			b = v
			break
		case 5:
			r = v,
			g = p,
			b = q
			break
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	}
}

function parseCustomBBCode(string)
{
	var parsedString = string
	
	for (const tag in customTags)
	{
		var matchRegex = "\\[" + tag + "(?<args>(\\s?[a-zA-Z_]+=[\\-0-9\\.#a-zA-Z]+){0,})\\](?<content>.*?)\\[\\/" + tag + "\\]"
		parsedString = parsedString.replace(new RegExp(matchRegex, "gm"), "<span class=\"" + className + "\" data-effect=\"" + tag + "\"$<args>>$<content></span>")
		matchRegex = "<span class=\"" + className + "\" data\\-effect=\"" + tag + "\"(?:\\s?[a-zA-Z_]+=[\\-0-9\\.#a-zA-Z]+){1,}>"
		var match = parsedString.match(matchRegex)
		
		while (match != null)
		{
			var matchArgsRegex = "((?<key>[a-zA-Z_]+)=(?<value>[\\-0-9\\.#a-zA-Z]+)){1,}"
			parsedString = parsedString.slice(0, match.index) + parsedString.slice(match.index, match.index + match[0].length).replace(new RegExp(matchArgsRegex, "gm"), "data-$<key>=\"$<value>\"") + parsedString.slice(match.index + match[0].length)
			match = parsedString.match(matchRegex)
		}
	}
	return parsedString
}

function parseEffects(container)
{
	resetEffectsTimer()
	tagElementsList = Array.from(container.querySelectorAll("span." + className + ":not(:has(span." + className + "-char))"))
	tagElementsList.forEach((tagElement) =>
	{
		if (!effectTagsCollection.includes(tagElement))
		{
			effectTagsCollection.push(tagElement)
			var constructedHTML = ""
			var textContent = tagElement.textContent
			
			for (let i = 0; i < textContent.length; i++)
				constructedHTML += "<span class=\"" + className + "-char\" data-index=\"" + i + "\">" + textContent[i] + "</span>"
			tagElement.innerHTML += constructedHTML
		}
	})
	
	if (tagElementsList.length > 0)
	{
		effectsTick()
		effectTickTimer = setInterval(effectsTick, 1000 / effectFPS)
	}
}

function resetEffectsTimer()
{
	elapsedTime = 0
	clearInterval(effectTickTimer)
}

function effectsTick()
{
	if (effectTagsCollection == null || effectTagsCollection.length == 0)
	{
		resetEffectsTimer()
		return
	}
	
	elapsedTime += 1 / effectFPS
	
	for (let i = 0; i < effectTagsCollection.length; i++)
	{
		tagElement = effectTagsCollection[i]
		
		if (tagElement != undefined)
		{
			characterElementsList = Array.from(tagElement.querySelectorAll("span." + className + "-char"))
			var contentLength = characterElementsList.length
			var widthCounter = 0
			
			characterElementsList.forEach((characterElement) =>
			{
				characterElement.style.left = widthCounter + "px"
				widthCounter += characterElement.offsetWidth
				effectFunction(characterElement, Number(characterElement.dataset.index), contentLength, tagElement.dataset)
			})
		}
		else
			effectTagsCollection.splice(i, 1)
	}
}

function isValidEffectParameter(effect, parameter, value)
{
	if (effect in customTags && parameter in customTags[effect])
	{
		var parameterType = customTags[effect][parameter]
		
		switch(parameterType)
		{
			case "integer":
				return /^(\-|)\d+$/.test(value)
			case "number":
				return /^(\-|)\d+(\.\d+|)$/.test(value)
			case "color":
				return /^#[a-fA-F0-9]{6}([a-fA-F0-9]{2}|)$/.test(value)
		}
	}
	return false
}

function effectFunction(characterElement, characterIndex, contentLength, effectData)
{
	switch(effectData.effect)
	{
		case "pulse":
			var proposedFrequency = effectData.freq
			
			if (isValidEffectParameter(effectData.effect, "freq", proposedFrequency))
				proposedFrequency = Number(proposedFrequency)
			else
				proposedFrequency = undefined
			var proposedColor = effectData.color
			
			if (!isValidEffectParameter(effectData.effect, "color", proposedColor))
				proposedColor = undefined
			var proposedEase = effectData.ease
			
			if (isValidEffectParameter(effectData.effect, "ease", proposedEase))
				proposedEase = Number(proposedEase)
			else
				proposedEase = undefined
			effectPulse(characterElement, characterIndex, proposedFrequency, proposedColor, proposedEase)
			break
		case "wave":
			var proposedAmplitude = effectData.amp
			
			if (isValidEffectParameter(effectData.effect, "amp", proposedAmplitude))
			{
				proposedAmplitude = Number(proposedAmplitude)
				
				if (proposedAmplitude <= 0)
					proposedAmplitude = undefined
			}
			else
				proposedAmplitude = undefined
			var proposedFrequency = effectData.freq
			
			if (isValidEffectParameter(effectData.effect, "freq", proposedFrequency))
				proposedFrequency = Number(proposedFrequency)
			else
				proposedFrequency = undefined
			var proposedConnected = effectData.connected
			
			if (isValidEffectParameter(effectData.effect, "connected", proposedConnected))
			{
				proposedConnected = Number(proposedConnected)
				
				if (proposedConnected <= 0)
					proposedConnected = undefined
			}
			else
				proposedConnected = undefined
			effectWave(characterElement, characterIndex, contentLength, proposedAmplitude, proposedFrequency, proposedConnected)
			break
		case "tornado":
			var proposedRadius = effectData.radius
			
			if (isValidEffectParameter(effectData.effect, "radius", proposedRadius))
			{
				proposedRadius = Number(proposedRadius)
				
				if (proposedRadius <= 0)
					proposedRadius = undefined
			}
			else
				proposedRadius = undefined
			var proposedFrequency = effectData.freq
			
			if (isValidEffectParameter(effectData.effect, "freq", proposedFrequency))
				proposedFrequency = Number(proposedFrequency)
			else
				proposedFrequency = undefined
			var proposedConnected = effectData.connected
			
			if (isValidEffectParameter(effectData.effect, "connected", proposedConnected))
			{
				proposedConnected = Number(proposedConnected)
				
				if (proposedConnected <= 0)
					proposedConnected = undefined
			}
			else
				proposedConnected = undefined
			effectTornado(characterElement, characterIndex, proposedRadius, proposedFrequency, proposedConnected)
			break
		case "shake":
			var proposedRate = effectData.rate
			
			if (isValidEffectParameter(effectData.effect, "rate", proposedRate))
			{
				proposedRate = Number(proposedRate)
				
				if (proposedRate < 0)
					proposedRate = undefined
			}
			else
				proposedRate = undefined
			var proposedLevel = effectData.level
			
			if (isValidEffectParameter(effectData.effect, "level", proposedLevel))
			{
				proposedLevel = Number(proposedLevel)
				
				if (proposedLevel < 0)
					proposedLevel = undefined
			}
			else
				proposedLevel = undefined
			var proposedConnected = effectData.connected
			
			if (isValidEffectParameter(effectData.effect, "connected", proposedConnected))
			{
				proposedConnected = Number(proposedConnected)
				
				if (proposedConnected <= 0)
					proposedConnected = undefined
			}
			else
				proposedConnected = undefined
			effectShake(characterElement, characterIndex, proposedRate, proposedLevel, proposedConnected)
			break
		case "fade":
			var proposedStart = effectData.start
			
			if (isValidEffectParameter(effectData.effect, "start", proposedStart))
			{
				proposedStart = Number(proposedStart)
				
				if (proposedStart < 0)
					proposedStart = undefined
			}
			else
				proposedStart = undefined
			var proposedLength = effectData.length
			
			if (isValidEffectParameter(effectData.effect, "length", proposedLength))
			{
				proposedLength = Number(proposedLength)
				
				if (proposedLength < 0)
					proposedLength = undefined
			}
			else
				proposedLength = undefined
			effectFade(characterElement, characterIndex, proposedStart, proposedLength)
			break
		case "rainbow":
			var proposedFrequency = effectData.freq
			
			if (isValidEffectParameter(effectData.effect, "freq", proposedFrequency))
				proposedFrequency = Number(proposedFrequency)
			else
				proposedFrequency = undefined
			var proposedSaturation = effectData.sat
			
			if (isValidEffectParameter(effectData.effect, "sat", proposedSaturation))
			{
				proposedSaturation = Number(proposedSaturation)
				
				if (proposedSaturation < 0 || proposedSaturation > 1)
					proposedSaturation = undefined
			}
			else
				proposedSaturation = undefined
			var proposedValue= effectData.val
			
			if (isValidEffectParameter(effectData.effect, "val", proposedValue))
			{
				proposedValue = Number(proposedValue)
				
				if (proposedValue < 0 || proposedValue > 1)
					proposedValue = undefined
			}
			else
				proposedValue = undefined
			effectRainbow(characterElement, characterIndex, contentLength, proposedFrequency, proposedSaturation, proposedValue)
			break
	}
}

function effectPulse(characterElement, characterIndex, effectFrequency = 1, effectColor = "#ffffff40", effectEase = 2)
{
	effectFrequency *= frequencySyncMultiplier
	var sinedTime = ease(pingpong(elapsedTime, 1 / effectFrequency) * effectFrequency, effectEase)
	var inlineColor = getComputedStyle(characterElement).color
	var matchRegex = /rgb(?:a|)\((?<r>\d{1,3}),\s?(?<g>\d{1,3}),\s?(?<b>\d{1,3})(?:,\s?(?<a>\d\.(?:\d+|))|)\)/g
	
	if (!matchRegex.test(inlineColor))
		inlineColor = "rgb(255, 255, 255)"
	var match = matchRegex.exec(inlineColor)
	var colorComponents
	
	if (match != null)
		colorComponents = match.groups
	else
		colorComponents = {
			r: 255,
			g: 255,
			b: 255
		}
	var currentColor = {
		r: colorComponents["r"] / 255,
		g: colorComponents["g"] / 255,
		b: colorComponents["b"] / 255,
		a: colorComponents["a"] != undefined ? colorComponents["a"] : 1
	}
	var targetColor
	var hex = effectColor.replace(/^#/, "")
	
	if (effectColor.length == 7)
	{
		targetColor = HEXToRGB(hex)
		targetColor.a = 1
	}
	else if (effectColor.length == 9)
		targetColor = HEXToRGBA(hex)
	else
		return
	var lerpedColor = lerpColors(currentColor, multiplyColors(currentColor, targetColor), sinedTime)
	characterElement.style.color = "rgba(" + Math.round(lerpedColor.r * 255) + ", " + Math.round(lerpedColor.g * 255) + ", " + Math.round(lerpedColor.b * 255) + ", " + lerpedColor.a + ")"
}

function effectWave(characterElement, characterIndex, contentLength, effectAmplitude = 1, effectFrequency = 1, effectConnected = 1)
{
	effectFrequency *= frequencySyncMultiplier
	var calculatedIndex = Math.floor(characterIndex / effectConnected)
	var calculatedValue = Math.sin((calculatedIndex * 2) / contentLength + effectFrequency * elapsedTime) * (effectAmplitude / 250) * characterElement.offsetHeight
	characterElement.style.marginTop = calculatedValue + "px"
}

function effectTornado(characterElement, characterIndex, effectRadius = 1, effectFrequency = "#ffffff40", effectConnected = 1)
{
	effectFrequency *= frequencySyncMultiplier
	var calculatedIndex = Math.floor(characterIndex / effectConnected)
	
}

function effectShake(characterElement, characterIndex, effectRate = 1, effectLevel = "#ffffff40", effectConnected = 1)
{
	var calculatedIndex = Math.floor(characterIndex / effectConnected)
	
}

function effectFade(characterElement, characterIndex, effectStart = 0, effectLength = 10)
{
	if (characterIndex >= effectStart)
	{
		var fadeStep = 1 / (effectLength + 1)
		characterElement.style.opacity = 1 - (characterIndex - effectStart + 1) * fadeStep
	}
	else if (characterIndex >= effectStart + effectLength)
		characterElement.style.opacity = 0
}

function effectRainbow(characterElement, characterIndex, contentLength, effectFrequency = 1, effectSaturation = 1, effectValue = 1)
{
	effectFrequency *= frequencySyncMultiplier
	var RGB = HSVToRGB((characterIndex / 4 + effectFrequency * elapsedTime) % 1, effectSaturation, effectValue)
	characterElement.style.color = "rgb(" + RGB.r + ", " + RGB.g + ", " + RGB.b + ")"
}