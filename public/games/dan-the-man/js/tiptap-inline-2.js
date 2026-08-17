(function(){
  var origGetContext=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,attrs){
    if(type==="webgl"||type==="webgl2"||type==="experimental-webgl"){
      attrs=Object.assign({},attrs||{},{preserveDrawingBuffer:true});
    }
    return origGetContext.call(this,type,attrs);
  };
})();
window.addEventListener("message",function(e){
  if(e.data&&e.data.type==="yes2sdk:capture"){
    try{
      var c=document.querySelector("#unity-canvas")||document.querySelector("canvas");
      if(!c){parent.postMessage({type:"yes2sdk:capture-result",success:false,error:"No canvas found"},"*");return;}
      var url=c.toDataURL("image/png");
      parent.postMessage({type:"yes2sdk:capture-result",success:true,dataUrl:url},"*");
    }catch(err){
      parent.postMessage({type:"yes2sdk:capture-result",success:false,error:err.message},"*");
    }
  }
});
