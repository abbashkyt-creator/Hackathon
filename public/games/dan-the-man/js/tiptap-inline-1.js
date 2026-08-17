(function(){
  var cfg=window.__yes2sdkConfig;
  if(!cfg||!cfg.platform||cfg.platform==="crazygames")return;
  var _cg=window.CrazyGames;
  try{Object.defineProperty(window,"CrazyGames",{
    get:function(){return typeof window.Yes2SDK!=="undefined"?undefined:_cg;},
    configurable:true,enumerable:true
  });}catch(e){}
})();
