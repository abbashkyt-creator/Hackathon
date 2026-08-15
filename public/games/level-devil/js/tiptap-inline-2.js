async function clipboard_copy(thing_to_copy) {
		const result = await navigator.clipboard.writeText(thing_to_copy);
	}

	// function clipboard_copy(thing_to_copy) {
	// 	if (!/ipad|iphone|ipod/i.test(navigator.userAgent) && navigator.clipboard && window.isSecureContext) {
	// 		navigator.clipboard.writeText(thing_to_copy);
	// 		return;
	// 	}
	// 	var t = document.createElement('textarea');
	// 	t.value = thing_to_copy;
	// 	t.setAttribute('readonly', '');
	// 	t.style.position = 'absolute';
	// 	t.style.left = '-9999px';
	// 	t.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';
	// 	t.style.fontSize = '12pt';
	// 	document.body.appendChild(t);
	// 	var r = document.createRange();
	// 	r.selectNodeContents(t);
	// 	var s = window.getSelection();
	// 	s.removeAllRanges();
	// 	s.addRange(r);
	// 	t.setSelectionRange(0, 999999);
	// 	document.execCommand('copy');
	// 	document.body.removeChild(t);
	// }