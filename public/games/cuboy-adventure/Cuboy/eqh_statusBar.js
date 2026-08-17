console.log("StatusBar – Extention loaded");
function statusBarSetup()
{
	const statusBarHtml =
	`<meta id="statusBar" name="theme-color" content="#000000"/>
	<meta id="statusBarApple" name="apple-mobile-web-app-status-bar-style" content="#000000">`;
	const headerId = document.getElementsByTagName("head")[0];
	headerId.innerHTML = headerId.innerHTML + statusBarHtml;
}
statusBarSetup();
function statusBarColorChange(r, g, b)
{
	function rgbToHex(r, g, b)
	{
  		return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
	}
	const statusBarId = document.getElementById("statusBar");
	const statusBarAppleId = document.getElementById("statusBarApple");
	statusBarId.content = rgbToHex(r, g, b);
	statusBarAppleId.content = rgbToHex(r, g, b);
}