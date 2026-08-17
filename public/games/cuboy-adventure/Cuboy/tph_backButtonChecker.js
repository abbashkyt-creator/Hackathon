console.log("BackButtonChecker – Extention loaded");
history.pushState(null, null, document.URL);
let backGo = false;
function browserGoBack()
{
	backGo = true;
	window.history.back();
	console.log("BACK");
}
function browserStayPage()
{
	history.forward();
	//history.pushState(null, null, document.URL);
}
window.addEventListener('popstate', function ()
{
	history.forward();
	//history.pushState(null, null, document.URL);
	if (!backGo)
	{
		let map = {};
		map["type"] = "backCheck";
		GMS_API.send_async_event_social(map);
	}
});