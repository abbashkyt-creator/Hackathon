console.log("PreventDefaultFix – Extention loaded");
function preventDefaultFix()
{
	canvas.addEventListener('touchstart', function(e) { e.preventDefault(); });
}
preventDefaultFix();