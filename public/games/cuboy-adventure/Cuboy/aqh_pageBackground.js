console.log("Background Setup – Extention loaded");
let colorNow = "#0179C9";
function backgroundSetup()
{
	const styleId = document.getElementsByTagName("style")[0];
	const blackBackgroundStyle = "html { background: #000000;";
	if (styleId.innerHTML.indexOf(blackBackgroundStyle) == -1)
	{
		styleId.innerHTML = "html, body { background: " + colorNow + "; overflow-y: hidden; overflow-x: hidden; scrollbar-width: none; scrollbar-height: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none; -o-user-select:none; -khtml-user-select: none; -webkit-touch-callout:none; user-zoom: none; -webkit-user-drag: none; -webkit-user-callout: none; -webkit-user-modify: none; -webkit-highlight: none; -webkit-text-size-adjust: none;  -webkit-tap-highlight-color: transparent; } .header-bar { display: none; } html::-webkit-scrollbar { display: none; } button, textarea, input, select, a { -webkit-tap-highlight-color: rgba(0, 0, 0, 0); -webkit-tap-highlight-color: transparent; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } " + styleId.innerHTML;
	}
}
backgroundSetup();
function backgroundColorChange(color)
{
	const styleId = document.getElementsByTagName("style")[0];
	styleId.innerHTML = styleId.innerHTML.replace(colorNow, color);
	colorNow = color;
	console.log("New Back Color: " + color);
}