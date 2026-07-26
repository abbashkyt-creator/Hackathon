

/////////////////////////////////////////
// main visibility API function 
// check if current tab is active or not
var vis = (function(){
    var stateKey, 
        eventKey, 
        keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();


/////////////////////////////////////////
// check if current tab is active or not
vis(function(){
					
    if(vis()){	
        
        // the setTimeout() is used due to a delay 
        // before the tab gains focus again, very important!
	      setTimeout(function(){ 
          
            // tween resume() code goes here	
            visibleResume();
            

          
        },300);		
												
    } else {
	
        // tween pause() code goes here	
        visiblePause();
        

    }
});


/////////////////////////////////////////
// focus / blur handlers DISABLED.
// blur was firing during window resize-drag (and on devtools open,
// address-bar focus, etc.), bumping gameLoopId and killing the RAF
// chain — the screen then stayed black until a click triggered
// focus → visibleResume. visibilitychange above is the correct
// signal for "tab actually backgrounded" and is kept active.