var canvas3D=document.querySelector('#canvas3D');
var gl=( canvas3D.getContext('webgl') || canvas3D.getContext('experimental-webgl') );

var canvas2D=document.getElementById('canvas2D');
canvas2D.addEventListener('mousedown',msdown,false);
canvas2D.addEventListener('mousemove',msmove,false);
canvas2D.addEventListener("mouseup",msup,false);
canvas2D.addEventListener('mouseout',msup,false);

canvas2D.addEventListener('touchmove',frmove,false);
canvas2D.addEventListener('touchstart',frdown,false);
canvas2D.addEventListener('touchend',frup,false);

var rd=canvas2D.getContext('2d');
var xm=0,ym=0;
var mdown=false;

function msmove(evt)
{
var rect=canvas2D.getBoundingClientRect();
xm=(evt.clientX-rect.left); 
ym=(evt.clientY-rect.top);
}

function msdown(evt)
{
var rect=canvas2D.getBoundingClientRect();
xm=(evt.clientX-rect.left); 
ym=(evt.clientY-rect.top);
mdown=true;
}

function msup(evt) { mdown=false; canvasclick(); }


function frmove(evt)
{
evt.preventDefault();

var cxm=0,cym=0;
for (var i=0;i<evt.touches.length;i++)
{
cxm+=evt.touches[i].clientX;
cym+=evt.touches[i].clientY;
}
var rect=canvas2D.getBoundingClientRect();
xm=((cxm/evt.touches.length)-rect.left);
ym=((cym/evt.touches.length)-rect.top);


}


function frdown(evt)
{
evt.preventDefault();

var cxm=0,cym=0;
for (var i=0;i<evt.touches.length;i++)
{
cxm+=evt.touches[i].clientX;
cym+=evt.touches[i].clientY;
}
var rect=canvas2D.getBoundingClientRect();
xm=((cxm/evt.touches.length)-rect.left);
ym=((cym/evt.touches.length)-rect.top);
mdown=true;
}

function frup(evt) { evt.preventDefault(); mdown=false; canvasclick(); }


function init() { gamerun(); PokiSDK.init().then(initDone).catch(() => { initDone(); }); }

function initDone() { pokiready=true; }

function loadingComplete() { PokiSDK.gameLoadingFinished(); if (PokiSDK.getURLParam('country')==='GB') { nomultiplayer=true; } }

function gameplayStart() { PokiSDK.gameplayStart(); }

function gameplayStop() { PokiSDK.gameplayStop(); }

function showHalftimeAd() { adpause=true; PokiSDK.commercialBreak().then(() => { adpause=false; }); }

function showLoadingAd() { adpause=true; PokiSDK.commercialBreak().then(() => { adpause=false; }); }

function showRewardAd() { adpause=true; PokiSDK.rewardedBreak().then((success) => { cntimeout=3; pointcnt=0; adpause=false; }); }

function showBoostAd() { adpause=true; PokiSDK.rewardedBreak().then((success) => { boostat(); adpause=false; }); }

function movepill(perc) { if (perc==0) { PokiSDK.movePill(0,24); } else { PokiSDK.movePill(perc,0); }  }
