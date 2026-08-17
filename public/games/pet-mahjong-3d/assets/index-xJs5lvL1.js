var jh=Object.defineProperty;var $h=(i,e,t)=>e in i?jh(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var gn=(i,e,t)=>$h(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const yo="165",Bi={ROTATE:0,DOLLY:1,PAN:2},zi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Zh=0,nc=1,Jh=2,Xl=1,Qh=2,yn=3,Xn=0,Ht=1,En=2,zn=0,sr=1,ic=2,rc=3,sc=4,ed=5,pi=100,td=101,nd=102,id=103,rd=104,sd=200,ad=201,od=202,cd=203,ja=204,$a=205,ld=206,ud=207,hd=208,dd=209,fd=210,pd=211,md=212,gd=213,_d=214,vd=0,xd=1,Sd=2,Ps=3,Md=4,yd=5,Ed=6,wd=7,ql=0,bd=1,Td=2,kn=0,Ad=1,Rd=2,Cd=3,Pd=4,Ld=5,Dd=6,Id=7,Yl=300,lr=301,ur=302,Za=303,Ja=304,Xs=306,Qa=1e3,_i=1001,eo=1002,en=1003,Ud=1004,$r=1005,an=1006,fa=1007,vi=1008,qn=1009,Nd=1010,Fd=1011,Ls=1012,Kl=1013,hr=1014,On=1015,qs=1016,jl=1017,$l=1018,dr=1020,Od=35902,Bd=1021,zd=1022,hn=1023,kd=1024,Hd=1025,ar=1026,fr=1027,Gd=1028,Zl=1029,Vd=1030,Jl=1031,Ql=1033,pa=33776,ma=33777,ga=33778,_a=33779,ac=35840,oc=35841,cc=35842,lc=35843,uc=36196,hc=37492,dc=37496,fc=37808,pc=37809,mc=37810,gc=37811,_c=37812,vc=37813,xc=37814,Sc=37815,Mc=37816,yc=37817,Ec=37818,wc=37819,bc=37820,Tc=37821,va=36492,Ac=36494,Rc=36495,Wd=36283,Cc=36284,Pc=36285,Lc=36286,Xd=3200,qd=3201,Yd=0,Kd=1,Fn="",Yt="srgb",Qn="srgb-linear",Eo="display-p3",Ys="display-p3-linear",Ds="linear",ct="srgb",Is="rec709",Us="p3",ki=7680,Dc=519,jd=512,$d=513,Zd=514,eu=515,Jd=516,Qd=517,ef=518,tf=519,Ic=35044,Uc="300 es",bn=2e3,Ns=2001;class Pi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Pt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nc=1234567;const zr=Math.PI/180,Gr=180/Math.PI;function Mr(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pt[i&255]+Pt[i>>8&255]+Pt[i>>16&255]+Pt[i>>24&255]+"-"+Pt[e&255]+Pt[e>>8&255]+"-"+Pt[e>>16&15|64]+Pt[e>>24&255]+"-"+Pt[t&63|128]+Pt[t>>8&255]+"-"+Pt[t>>16&255]+Pt[t>>24&255]+Pt[n&255]+Pt[n>>8&255]+Pt[n>>16&255]+Pt[n>>24&255]).toLowerCase()}function Dt(i,e,t){return Math.max(e,Math.min(t,i))}function wo(i,e){return(i%e+e)%e}function nf(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function rf(i,e,t){return i!==e?(t-i)/(e-i):0}function kr(i,e,t){return(1-t)*i+t*e}function sf(i,e,t,n){return kr(i,e,1-Math.exp(-t*n))}function af(i,e=1){return e-Math.abs(wo(i,e*2)-e)}function of(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function cf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function lf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function uf(i,e){return i+Math.random()*(e-i)}function hf(i){return i*(.5-Math.random())}function df(i){i!==void 0&&(Nc=i);let e=Nc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ff(i){return i*zr}function pf(i){return i*Gr}function mf(i){return(i&i-1)===0&&i!==0}function gf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function _f(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function vf(i,e,t,n,r){const s=Math.cos,a=Math.sin,o=s(t/2),c=a(t/2),l=s((e+n)/2),u=a((e+n)/2),h=s((e-n)/2),d=a((e-n)/2),m=s((n-e)/2),g=a((n-e)/2);switch(r){case"XYX":i.set(o*u,c*h,c*d,o*l);break;case"YZY":i.set(c*d,o*u,c*h,o*l);break;case"ZXZ":i.set(c*h,c*d,o*u,o*l);break;case"XZX":i.set(o*u,c*g,c*m,o*l);break;case"YXY":i.set(c*m,o*u,c*g,o*l);break;case"ZYZ":i.set(c*g,c*m,o*u,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ir(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const st={DEG2RAD:zr,RAD2DEG:Gr,generateUUID:Mr,clamp:Dt,euclideanModulo:wo,mapLinear:nf,inverseLerp:rf,lerp:kr,damp:sf,pingpong:af,smoothstep:of,smootherstep:cf,randInt:lf,randFloat:uf,randFloatSpread:hf,seededRandom:df,degToRad:ff,radToDeg:pf,isPowerOfTwo:mf,ceilPowerOfTwo:gf,floorPowerOfTwo:_f,setQuaternionFromProperEuler:vf,normalize:Nt,denormalize:ir};class we{constructor(e=0,t=0){we.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Dt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ne{constructor(e,t,n,r,s,a,o,c,l){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l)}set(e,t,n,r,s,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],m=n[5],g=n[8],v=r[0],p=r[3],f=r[6],w=r[1],y=r[4],T=r[7],O=r[2],C=r[5],R=r[8];return s[0]=a*v+o*w+c*O,s[3]=a*p+o*y+c*C,s[6]=a*f+o*T+c*R,s[1]=l*v+u*w+h*O,s[4]=l*p+u*y+h*C,s[7]=l*f+u*T+h*R,s[2]=d*v+m*w+g*O,s[5]=d*p+m*y+g*C,s[8]=d*f+m*T+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-n*s*u+n*o*c+r*s*l-r*a*c}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=u*a-o*l,d=o*c-u*s,m=l*s-a*c,g=t*h+n*d+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(r*l-u*n)*v,e[2]=(o*n-r*a)*v,e[3]=d*v,e[4]=(u*t-r*c)*v,e[5]=(r*s-o*t)*v,e[6]=m*v,e[7]=(n*c-l*t)*v,e[8]=(a*t-n*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(xa.makeScale(e,t)),this}rotate(e){return this.premultiply(xa.makeRotation(-e)),this}translate(e,t){return this.premultiply(xa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const xa=new Ne;function tu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Fs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function xf(){const i=Fs("canvas");return i.style.display="block",i}const Fc={};function nu(i){i in Fc||(Fc[i]=!0,console.warn(i))}function Sf(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Oc=new Ne().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Bc=new Ne().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Zr={[Qn]:{transfer:Ds,primaries:Is,toReference:i=>i,fromReference:i=>i},[Yt]:{transfer:ct,primaries:Is,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Ys]:{transfer:Ds,primaries:Us,toReference:i=>i.applyMatrix3(Bc),fromReference:i=>i.applyMatrix3(Oc)},[Eo]:{transfer:ct,primaries:Us,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Bc),fromReference:i=>i.applyMatrix3(Oc).convertLinearToSRGB()}},Mf=new Set([Qn,Ys]),Qe={enabled:!0,_workingColorSpace:Qn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Mf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Zr[e].toReference,r=Zr[t].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Zr[i].primaries},getTransfer:function(i){return i===Fn?Ds:Zr[i].transfer}};function or(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Sa(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Hi;class yf{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Hi===void 0&&(Hi=Fs("canvas")),Hi.width=e.width,Hi.height=e.height;const n=Hi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Hi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Fs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=or(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(or(t[n]/255)*255):t[n]=or(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ef=0;class iu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=Mr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ma(r[a].image)):s.push(Ma(r[a]))}else s=Ma(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function Ma(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?yf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let wf=0;class Bt extends Pi{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,n=_i,r=_i,s=an,a=vi,o=hn,c=qn,l=Bt.DEFAULT_ANISOTROPY,u=Fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=Mr(),this.name="",this.source=new iu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new we(0,0),this.repeat=new we(1,1),this.center=new we(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Yl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qa:e.x=e.x-Math.floor(e.x);break;case _i:e.x=e.x<0?0:1;break;case eo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qa:e.y=e.y-Math.floor(e.y);break;case _i:e.y=e.y<0?0:1;break;case eo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Yl;Bt.DEFAULT_ANISOTROPY=1;class ut{constructor(e=0,t=0,n=0,r=1){ut.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const c=e.elements,l=c[0],u=c[4],h=c[8],d=c[1],m=c[5],g=c[9],v=c[2],p=c[6],f=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(l+1)/2,T=(m+1)/2,O=(f+1)/2,C=(u+d)/4,R=(h+v)/4,N=(g+p)/4;return y>T&&y>O?y<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(y),r=C/n,s=R/n):T>O?T<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(T),n=C/r,s=N/r):O<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(O),n=R/s,r=N/s),this.set(n,r,s,t),this}let w=Math.sqrt((p-g)*(p-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(w)<.001&&(w=1),this.x=(p-g)/w,this.y=(h-v)/w,this.z=(d-u)/w,this.w=Math.acos((l+m+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bf extends Pi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Bt(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new iu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ti extends bf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class ru extends Bt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=en,this.minFilter=en,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Tf extends Bt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=en,this.minFilter=en,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class on{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let c=n[r+0],l=n[r+1],u=n[r+2],h=n[r+3];const d=s[a+0],m=s[a+1],g=s[a+2],v=s[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=d,e[t+1]=m,e[t+2]=g,e[t+3]=v;return}if(h!==v||c!==d||l!==m||u!==g){let p=1-o;const f=c*d+l*m+u*g+h*v,w=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const O=Math.sqrt(y),C=Math.atan2(O,f*w);p=Math.sin(p*C)/O,o=Math.sin(o*C)/O}const T=o*w;if(c=c*p+d*T,l=l*p+m*T,u=u*p+g*T,h=h*p+v*T,p===1-o){const O=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=O,l*=O,u*=O,h*=O}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],u=n[r+3],h=s[a],d=s[a+1],m=s[a+2],g=s[a+3];return e[t]=o*g+u*h+c*m-l*d,e[t+1]=c*g+u*d+l*h-o*m,e[t+2]=l*g+u*m+o*d-c*h,e[t+3]=u*g-o*h-c*d-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(r/2),h=o(s/2),d=c(n/2),m=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=d*u*h+l*m*g,this._y=l*m*h-d*u*g,this._z=l*u*g+d*m*h,this._w=l*u*h-d*m*g;break;case"YXZ":this._x=d*u*h+l*m*g,this._y=l*m*h-d*u*g,this._z=l*u*g-d*m*h,this._w=l*u*h+d*m*g;break;case"ZXY":this._x=d*u*h-l*m*g,this._y=l*m*h+d*u*g,this._z=l*u*g+d*m*h,this._w=l*u*h-d*m*g;break;case"ZYX":this._x=d*u*h-l*m*g,this._y=l*m*h+d*u*g,this._z=l*u*g-d*m*h,this._w=l*u*h+d*m*g;break;case"YZX":this._x=d*u*h+l*m*g,this._y=l*m*h+d*u*g,this._z=l*u*g-d*m*h,this._w=l*u*h-d*m*g;break;case"XZY":this._x=d*u*h-l*m*g,this._y=l*m*h-d*u*g,this._z=l*u*g+d*m*h,this._w=l*u*h+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-c)*m,this._y=(s-l)*m,this._z=(a-r)*m}else if(n>o&&n>h){const m=2*Math.sqrt(1+n-o-h);this._w=(u-c)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+l)/m}else if(o>h){const m=2*Math.sqrt(1+o-n-h);this._w=(s-l)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+h-n-o);this._w=(a-r)/m,this._x=(s+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Dt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-n*l,this._z=s*u+a*l+n*c-r*o,this._w=a*u-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,o),h=Math.sin((1-t)*u)/l,d=Math.sin(t*u)/l;return this._w=a*h+this._w*d,this._x=n*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{constructor(e=0,t=0,n=0){A.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*n),u=2*(o*t-s*r),h=2*(s*n-a*t);return this.x=t+c*l+a*h-o*u,this.y=n+c*u+o*l-s*h,this.z=r+c*h+s*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ya.copy(this).projectOnVector(e),this.sub(ya)}reflect(e){return this.sub(ya.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Dt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ya=new A,zc=new on;class yr{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,nn):nn.fromBufferAttribute(s,a),nn.applyMatrix4(e.matrixWorld),this.expandByPoint(nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Jr.copy(n.boundingBox)),Jr.applyMatrix4(e.matrixWorld),this.union(Jr)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,nn),nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ar),Qr.subVectors(this.max,Ar),Gi.subVectors(e.a,Ar),Vi.subVectors(e.b,Ar),Wi.subVectors(e.c,Ar),Rn.subVectors(Vi,Gi),Cn.subVectors(Wi,Vi),si.subVectors(Gi,Wi);let t=[0,-Rn.z,Rn.y,0,-Cn.z,Cn.y,0,-si.z,si.y,Rn.z,0,-Rn.x,Cn.z,0,-Cn.x,si.z,0,-si.x,-Rn.y,Rn.x,0,-Cn.y,Cn.x,0,-si.y,si.x,0];return!Ea(t,Gi,Vi,Wi,Qr)||(t=[1,0,0,0,1,0,0,0,1],!Ea(t,Gi,Vi,Wi,Qr))?!1:(es.crossVectors(Rn,Cn),t=[es.x,es.y,es.z],Ea(t,Gi,Vi,Wi,Qr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const _n=[new A,new A,new A,new A,new A,new A,new A,new A],nn=new A,Jr=new yr,Gi=new A,Vi=new A,Wi=new A,Rn=new A,Cn=new A,si=new A,Ar=new A,Qr=new A,es=new A,ai=new A;function Ea(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){ai.fromArray(i,s);const o=r.x*Math.abs(ai.x)+r.y*Math.abs(ai.y)+r.z*Math.abs(ai.z),c=e.dot(ai),l=t.dot(ai),u=n.dot(ai);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const Af=new yr,Rr=new A,wa=new A;class bo{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Af.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Rr.subVectors(e,this.center);const t=Rr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Rr,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Rr.copy(e.center).add(wa)),this.expandByPoint(Rr.copy(e.center).sub(wa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const vn=new A,ba=new A,ts=new A,Pn=new A,Ta=new A,ns=new A,Aa=new A;class To{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,vn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=vn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(vn.copy(this.origin).addScaledVector(this.direction,t),vn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ba.copy(e).add(t).multiplyScalar(.5),ts.copy(t).sub(e).normalize(),Pn.copy(this.origin).sub(ba);const s=e.distanceTo(t)*.5,a=-this.direction.dot(ts),o=Pn.dot(this.direction),c=-Pn.dot(ts),l=Pn.lengthSq(),u=Math.abs(1-a*a);let h,d,m,g;if(u>0)if(h=a*c-o,d=a*o-c,g=s*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,m=h*(h+a*d+2*o)+d*(a*h+d+2*c)+l}else d=s,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*c)+l;else d=-s,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*c)+l;else d<=-g?(h=Math.max(0,-(-a*s+o)),d=h>0?-s:Math.min(Math.max(-s,-c),s),m=-h*h+d*(d+2*c)+l):d<=g?(h=0,d=Math.min(Math.max(-s,-c),s),m=d*(d+2*c)+l):(h=Math.max(0,-(a*s+o)),d=h>0?s:Math.min(Math.max(-s,-c),s),m=-h*h+d*(d+2*c)+l);else d=a>0?-s:s,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(ba).addScaledVector(ts,d),m}intersectSphere(e,t){vn.subVectors(e.center,this.origin);const n=vn.dot(this.direction),r=vn.dot(vn)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,r=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,r=(e.min.x-d.x)*l),u>=0?(s=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-d.z)*h,c=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,c=(e.min.z-d.z)*h),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,vn)!==null}intersectTriangle(e,t,n,r,s){Ta.subVectors(t,e),ns.subVectors(n,e),Aa.crossVectors(Ta,ns);let a=this.direction.dot(Aa),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Pn.subVectors(this.origin,e);const c=o*this.direction.dot(ns.crossVectors(Pn,ns));if(c<0)return null;const l=o*this.direction.dot(Ta.cross(Pn));if(l<0||c+l>a)return null;const u=-o*Pn.dot(Aa);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ft{constructor(e,t,n,r,s,a,o,c,l,u,h,d,m,g,v,p){ft.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l,u,h,d,m,g,v,p)}set(e,t,n,r,s,a,o,c,l,u,h,d,m,g,v,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=r,f[1]=s,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=u,f[10]=h,f[14]=d,f[3]=m,f[7]=g,f[11]=v,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ft().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/Xi.setFromMatrixColumn(e,0).length(),s=1/Xi.setFromMatrixColumn(e,1).length(),a=1/Xi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=a*u,m=a*h,g=o*u,v=o*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=m+g*l,t[5]=d-v*l,t[9]=-o*c,t[2]=v-d*l,t[6]=g+m*l,t[10]=a*c}else if(e.order==="YXZ"){const d=c*u,m=c*h,g=l*u,v=l*h;t[0]=d+v*o,t[4]=g*o-m,t[8]=a*l,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=m*o-g,t[6]=v+d*o,t[10]=a*c}else if(e.order==="ZXY"){const d=c*u,m=c*h,g=l*u,v=l*h;t[0]=d-v*o,t[4]=-a*h,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*u,t[9]=v-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const d=a*u,m=a*h,g=o*u,v=o*h;t[0]=c*u,t[4]=g*l-m,t[8]=d*l+v,t[1]=c*h,t[5]=v*l+d,t[9]=m*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const d=a*c,m=a*l,g=o*c,v=o*l;t[0]=c*u,t[4]=v-d*h,t[8]=g*h+m,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=m*h+g,t[10]=d-v*h}else if(e.order==="XZY"){const d=a*c,m=a*l,g=o*c,v=o*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=d*h+v,t[5]=a*u,t[9]=m*h-g,t[2]=g*h-m,t[6]=o*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Rf,e,Cf)}lookAt(e,t,n){const r=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),Ln.crossVectors(n,Xt),Ln.lengthSq()===0&&(Math.abs(n.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),Ln.crossVectors(n,Xt)),Ln.normalize(),is.crossVectors(Xt,Ln),r[0]=Ln.x,r[4]=is.x,r[8]=Xt.x,r[1]=Ln.y,r[5]=is.y,r[9]=Xt.y,r[2]=Ln.z,r[6]=is.z,r[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],m=n[13],g=n[2],v=n[6],p=n[10],f=n[14],w=n[3],y=n[7],T=n[11],O=n[15],C=r[0],R=r[4],N=r[8],E=r[12],M=r[1],L=r[5],X=r[9],z=r[13],q=r[2],K=r[6],V=r[10],Q=r[14],W=r[3],ce=r[7],he=r[11],le=r[15];return s[0]=a*C+o*M+c*q+l*W,s[4]=a*R+o*L+c*K+l*ce,s[8]=a*N+o*X+c*V+l*he,s[12]=a*E+o*z+c*Q+l*le,s[1]=u*C+h*M+d*q+m*W,s[5]=u*R+h*L+d*K+m*ce,s[9]=u*N+h*X+d*V+m*he,s[13]=u*E+h*z+d*Q+m*le,s[2]=g*C+v*M+p*q+f*W,s[6]=g*R+v*L+p*K+f*ce,s[10]=g*N+v*X+p*V+f*he,s[14]=g*E+v*z+p*Q+f*le,s[3]=w*C+y*M+T*q+O*W,s[7]=w*R+y*L+T*K+O*ce,s[11]=w*N+y*X+T*V+O*he,s[15]=w*E+y*z+T*Q+O*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],h=e[6],d=e[10],m=e[14],g=e[3],v=e[7],p=e[11],f=e[15];return g*(+s*c*h-r*l*h-s*o*d+n*l*d+r*o*m-n*c*m)+v*(+t*c*m-t*l*d+s*a*d-r*a*m+r*l*u-s*c*u)+p*(+t*l*h-t*o*m-s*a*h+n*a*m+s*o*u-n*l*u)+f*(-r*o*u-t*c*h+t*o*d+r*a*h-n*a*d+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=e[9],d=e[10],m=e[11],g=e[12],v=e[13],p=e[14],f=e[15],w=h*p*l-v*d*l+v*c*m-o*p*m-h*c*f+o*d*f,y=g*d*l-u*p*l-g*c*m+a*p*m+u*c*f-a*d*f,T=u*v*l-g*h*l+g*o*m-a*v*m-u*o*f+a*h*f,O=g*h*c-u*v*c-g*o*d+a*v*d+u*o*p-a*h*p,C=t*w+n*y+r*T+s*O;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/C;return e[0]=w*R,e[1]=(v*d*s-h*p*s-v*r*m+n*p*m+h*r*f-n*d*f)*R,e[2]=(o*p*s-v*c*s+v*r*l-n*p*l-o*r*f+n*c*f)*R,e[3]=(h*c*s-o*d*s-h*r*l+n*d*l+o*r*m-n*c*m)*R,e[4]=y*R,e[5]=(u*p*s-g*d*s+g*r*m-t*p*m-u*r*f+t*d*f)*R,e[6]=(g*c*s-a*p*s-g*r*l+t*p*l+a*r*f-t*c*f)*R,e[7]=(a*d*s-u*c*s+u*r*l-t*d*l-a*r*m+t*c*m)*R,e[8]=T*R,e[9]=(g*h*s-u*v*s-g*n*m+t*v*m+u*n*f-t*h*f)*R,e[10]=(a*v*s-g*o*s+g*n*l-t*v*l-a*n*f+t*o*f)*R,e[11]=(u*o*s-a*h*s-u*n*l+t*h*l+a*n*m-t*o*m)*R,e[12]=O*R,e[13]=(u*v*r-g*h*r+g*n*d-t*v*d-u*n*p+t*h*p)*R,e[14]=(g*o*r-a*v*r-g*n*c+t*v*c+a*n*p-t*o*p)*R,e[15]=(a*h*r-u*o*r+u*n*c-t*h*c-a*n*d+t*o*d)*R,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,c=e.z,l=s*a,u=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+n,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,u=a+a,h=o+o,d=s*l,m=s*u,g=s*h,v=a*u,p=a*h,f=o*h,w=c*l,y=c*u,T=c*h,O=n.x,C=n.y,R=n.z;return r[0]=(1-(v+f))*O,r[1]=(m+T)*O,r[2]=(g-y)*O,r[3]=0,r[4]=(m-T)*C,r[5]=(1-(d+f))*C,r[6]=(p+w)*C,r[7]=0,r[8]=(g+y)*R,r[9]=(p-w)*R,r[10]=(1-(d+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=Xi.set(r[0],r[1],r[2]).length();const a=Xi.set(r[4],r[5],r[6]).length(),o=Xi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],rn.copy(this);const l=1/s,u=1/a,h=1/o;return rn.elements[0]*=l,rn.elements[1]*=l,rn.elements[2]*=l,rn.elements[4]*=u,rn.elements[5]*=u,rn.elements[6]*=u,rn.elements[8]*=h,rn.elements[9]*=h,rn.elements[10]*=h,t.setFromRotationMatrix(rn),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=bn){const c=this.elements,l=2*s/(t-e),u=2*s/(n-r),h=(t+e)/(t-e),d=(n+r)/(n-r);let m,g;if(o===bn)m=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===Ns)m=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=bn){const c=this.elements,l=1/(t-e),u=1/(n-r),h=1/(a-s),d=(t+e)*l,m=(n+r)*u;let g,v;if(o===bn)g=(a+s)*h,v=-2*h;else if(o===Ns)g=s*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Xi=new A,rn=new ft,Rf=new A(0,0,0),Cf=new A(1,1,1),Ln=new A,is=new A,Xt=new A,kc=new ft,Hc=new on;class Ot{constructor(e=0,t=0,n=0,r=Ot.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],h=r[2],d=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(Dt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Dt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Dt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Dt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Dt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Dt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return kc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(kc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Hc.setFromEuler(this),this.setFromQuaternion(Hc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ot.DEFAULT_ORDER="XYZ";class Ao{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Pf=0;const Gc=new A,qi=new on,xn=new ft,rs=new A,Cr=new A,Lf=new A,Df=new on,Vc=new A(1,0,0),Wc=new A(0,1,0),Xc=new A(0,0,1),qc={type:"added"},If={type:"removed"},Yi={type:"childadded",child:null},Ra={type:"childremoved",child:null};class Ct extends Pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pf++}),this.uuid=Mr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new A,t=new Ot,n=new on,r=new A(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ft},normalMatrix:{value:new Ne}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ao,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return qi.setFromAxisAngle(e,t),this.quaternion.multiply(qi),this}rotateOnWorldAxis(e,t){return qi.setFromAxisAngle(e,t),this.quaternion.premultiply(qi),this}rotateX(e){return this.rotateOnAxis(Vc,e)}rotateY(e){return this.rotateOnAxis(Wc,e)}rotateZ(e){return this.rotateOnAxis(Xc,e)}translateOnAxis(e,t){return Gc.copy(e).applyQuaternion(this.quaternion),this.position.add(Gc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vc,e)}translateY(e){return this.translateOnAxis(Wc,e)}translateZ(e){return this.translateOnAxis(Xc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?rs.copy(e):rs.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(Cr,rs,this.up):xn.lookAt(rs,Cr,this.up),this.quaternion.setFromRotationMatrix(xn),r&&(xn.extractRotation(r.matrixWorld),qi.setFromRotationMatrix(xn),this.quaternion.premultiply(qi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(qc),Yi.child=e,this.dispatchEvent(Yi),Yi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(If),Ra.child=e,this.dispatchEvent(Ra),Ra.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(qc),Yi.child=e,this.dispatchEvent(Yi),Yi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cr,e,Lf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cr,Df,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++){const s=t[n];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++){const o=r[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];s(e.shapes,h)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}Ct.DEFAULT_UP=new A(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new A,Sn=new A,Ca=new A,Mn=new A,Ki=new A,ji=new A,Yc=new A,Pa=new A,La=new A,Da=new A;class un{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),sn.subVectors(e,t),r.cross(sn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){sn.subVectors(r,t),Sn.subVectors(n,t),Ca.subVectors(e,t);const a=sn.dot(sn),o=sn.dot(Sn),c=sn.dot(Ca),l=Sn.dot(Sn),u=Sn.dot(Ca),h=a*l-o*o;if(h===0)return s.set(0,0,0),null;const d=1/h,m=(l*c-o*u)*d,g=(a*u-o*c)*d;return s.set(1-m-g,g,m)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(e,t,n,r,s,a,o,c){return this.getBarycoord(e,t,n,r,Mn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Mn.x),c.addScaledVector(a,Mn.y),c.addScaledVector(o,Mn.z),c)}static isFrontFacing(e,t,n,r){return sn.subVectors(n,t),Sn.subVectors(e,t),sn.cross(Sn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),sn.cross(Sn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return un.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return un.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return un.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return un.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return un.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;Ki.subVectors(r,n),ji.subVectors(s,n),Pa.subVectors(e,n);const c=Ki.dot(Pa),l=ji.dot(Pa);if(c<=0&&l<=0)return t.copy(n);La.subVectors(e,r);const u=Ki.dot(La),h=ji.dot(La);if(u>=0&&h<=u)return t.copy(r);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(Ki,a);Da.subVectors(e,s);const m=Ki.dot(Da),g=ji.dot(Da);if(g>=0&&m<=g)return t.copy(s);const v=m*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(ji,o);const p=u*g-m*h;if(p<=0&&h-u>=0&&m-g>=0)return Yc.subVectors(s,r),o=(h-u)/(h-u+(m-g)),t.copy(r).addScaledVector(Yc,o);const f=1/(p+v+d);return a=v*f,o=d*f,t.copy(n).addScaledVector(Ki,a).addScaledVector(ji,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const su={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Dn={h:0,s:0,l:0},ss={h:0,s:0,l:0};function Ia(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ke{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Qe.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Qe.workingColorSpace){if(e=wo(e,1),t=Dt(t,0,1),n=Dt(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Ia(a,s,e+1/3),this.g=Ia(a,s,e),this.b=Ia(a,s,e-1/3)}return Qe.toWorkingColorSpace(this,r),this}setStyle(e,t=Yt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Yt){const n=su[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=or(e.r),this.g=or(e.g),this.b=or(e.b),this}copyLinearToSRGB(e){return this.r=Sa(e.r),this.g=Sa(e.g),this.b=Sa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Yt){return Qe.fromWorkingColorSpace(Lt.copy(this),e),Math.round(Dt(Lt.r*255,0,255))*65536+Math.round(Dt(Lt.g*255,0,255))*256+Math.round(Dt(Lt.b*255,0,255))}getHexString(e=Yt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Lt.copy(this),t);const n=Lt.r,r=Lt.g,s=Lt.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=u<=.5?h/(a+o):h/(2-a-o),a){case n:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-n)/h+2;break;case s:c=(n-r)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Lt.copy(this),t),e.r=Lt.r,e.g=Lt.g,e.b=Lt.b,e}getStyle(e=Yt){Qe.fromWorkingColorSpace(Lt.copy(this),e);const t=Lt.r,n=Lt.g,r=Lt.b;return e!==Yt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Dn),this.setHSL(Dn.h+e,Dn.s+t,Dn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Dn),e.getHSL(ss);const n=kr(Dn.h,ss.h,t),r=kr(Dn.s,ss.s,t),s=kr(Dn.l,ss.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Lt=new Ke;Ke.NAMES=su;let Uf=0;class Ks extends Pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=Mr(),this.name="",this.type="Material",this.blending=sr,this.side=Xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ja,this.blendDst=$a,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ki,this.stencilZFail=ki,this.stencilZPass=ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==sr&&(n.blending=this.blending),this.side!==Xn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ja&&(n.blendSrc=this.blendSrc),this.blendDst!==$a&&(n.blendDst=this.blendDst),this.blendEquation!==pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ps&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class jt extends Ks{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ot,this.combine=ql,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wt=new A,as=new we;class fn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ic,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=On,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return nu("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)as.fromBufferAttribute(this,t),as.applyMatrix3(e),this.setXY(t,as.x,as.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ir(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ir(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ir(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ir(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ir(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),r=Nt(r,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ic&&(e.usage=this.usage),e}}class au extends fn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ou extends fn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class wi extends fn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Nf=0;const Zt=new ft,Ua=new Ct,$i=new A,qt=new yr,Pr=new yr,Rt=new A;class Li extends Pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nf++}),this.uuid=Mr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(tu(e)?ou:au)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ne().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Zt.makeRotationFromQuaternion(e),this.applyMatrix4(Zt),this}rotateX(e){return Zt.makeRotationX(e),this.applyMatrix4(Zt),this}rotateY(e){return Zt.makeRotationY(e),this.applyMatrix4(Zt),this}rotateZ(e){return Zt.makeRotationZ(e),this.applyMatrix4(Zt),this}translate(e,t,n){return Zt.makeTranslation(e,t,n),this.applyMatrix4(Zt),this}scale(e,t,n){return Zt.makeScale(e,t,n),this.applyMatrix4(Zt),this}lookAt(e){return Ua.lookAt(e),Ua.updateMatrix(),this.applyMatrix4(Ua.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($i).negate(),this.translate($i.x,$i.y,$i.z),this}setFromPoints(e){const t=[];for(let n=0,r=e.length;n<r;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new wi(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];qt.setFromBufferAttribute(s),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,qt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,qt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(qt.min),this.boundingBox.expandByPoint(qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new bo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){const n=this.boundingSphere.center;if(qt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Pr.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors(qt.min,Pr.min),qt.expandByPoint(Rt),Rt.addVectors(qt.max,Pr.max),qt.expandByPoint(Rt)):(qt.expandByPoint(Pr.min),qt.expandByPoint(Pr.max))}qt.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Rt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Rt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)Rt.fromBufferAttribute(o,l),c&&($i.fromBufferAttribute(e,l),Rt.add($i)),r=Math.max(r,n.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let N=0;N<n.count;N++)o[N]=new A,c[N]=new A;const l=new A,u=new A,h=new A,d=new we,m=new we,g=new we,v=new A,p=new A;function f(N,E,M){l.fromBufferAttribute(n,N),u.fromBufferAttribute(n,E),h.fromBufferAttribute(n,M),d.fromBufferAttribute(s,N),m.fromBufferAttribute(s,E),g.fromBufferAttribute(s,M),u.sub(l),h.sub(l),m.sub(d),g.sub(d);const L=1/(m.x*g.y-g.x*m.y);isFinite(L)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-m.y).multiplyScalar(L),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(L),o[N].add(v),o[E].add(v),o[M].add(v),c[N].add(p),c[E].add(p),c[M].add(p))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let N=0,E=w.length;N<E;++N){const M=w[N],L=M.start,X=M.count;for(let z=L,q=L+X;z<q;z+=3)f(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const y=new A,T=new A,O=new A,C=new A;function R(N){O.fromBufferAttribute(r,N),C.copy(O);const E=o[N];y.copy(E),y.sub(O.multiplyScalar(O.dot(E))).normalize(),T.crossVectors(C,E);const L=T.dot(c[N])<0?-1:1;a.setXYZW(N,y.x,y.y,y.z,L)}for(let N=0,E=w.length;N<E;++N){const M=w[N],L=M.start,X=M.count;for(let z=L,q=L+X;z<q;z+=3)R(e.getX(z+0)),R(e.getX(z+1)),R(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new fn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const r=new A,s=new A,a=new A,o=new A,c=new A,l=new A,u=new A,h=new A;if(e)for(let d=0,m=e.count;d<m;d+=3){const g=e.getX(d+0),v=e.getX(d+1),p=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,p),o.add(u),c.add(u),l.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,m=t.count;d<m;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,h=o.normalized,d=new l.constructor(c.length*u);let m=0,g=0;for(let v=0,p=c.length;v<p;v++){o.isInterleavedBufferAttribute?m=c[v]*o.data.stride+o.offset:m=c[v]*u;for(let f=0;f<u;f++)d[g++]=l[m++]}return new fn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Li,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,n);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let u=0,h=l.length;u<h;u++){const d=l[u],m=e(d,n);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const m=l[h];u.push(m.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],h=s[l];for(let d=0,m=h.length;d<m;d++)u.push(h[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Kc=new ft,oi=new To,os=new bo,jc=new A,Zi=new A,Ji=new A,Qi=new A,Na=new A,cs=new A,ls=new we,us=new we,hs=new we,$c=new A,Zc=new A,Jc=new A,ds=new A,fs=new A;class kt extends Ct{constructor(e=new Li,t=new jt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){cs.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=o[c],h=s[c];u!==0&&(Na.fromBufferAttribute(h,e),a?cs.addScaledVector(Na,u):cs.addScaledVector(Na.sub(t),u))}t.add(cs)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),os.copy(n.boundingSphere),os.applyMatrix4(s),oi.copy(e.ray).recast(e.near),!(os.containsPoint(oi.origin)===!1&&(oi.intersectSphere(os,jc)===null||oi.origin.distanceToSquared(jc)>(e.far-e.near)**2))&&(Kc.copy(s).invert(),oi.copy(e.ray).applyMatrix4(Kc),!(n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,oi)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const p=d[g],f=a[p.materialIndex],w=Math.max(p.start,m.start),y=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let T=w,O=y;T<O;T+=3){const C=o.getX(T),R=o.getX(T+1),N=o.getX(T+2);r=ps(this,f,e,n,l,u,h,C,R,N),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let p=g,f=v;p<f;p+=3){const w=o.getX(p),y=o.getX(p+1),T=o.getX(p+2);r=ps(this,a,e,n,l,u,h,w,y,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const p=d[g],f=a[p.materialIndex],w=Math.max(p.start,m.start),y=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let T=w,O=y;T<O;T+=3){const C=T,R=T+1,N=T+2;r=ps(this,f,e,n,l,u,h,C,R,N),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let p=g,f=v;p<f;p+=3){const w=p,y=p+1,T=p+2;r=ps(this,a,e,n,l,u,h,w,y,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function Ff(i,e,t,n,r,s,a,o){let c;if(e.side===Ht?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,e.side===Xn,o),c===null)return null;fs.copy(o),fs.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(fs);return l<t.near||l>t.far?null:{distance:l,point:fs.clone(),object:i}}function ps(i,e,t,n,r,s,a,o,c,l){i.getVertexPosition(o,Zi),i.getVertexPosition(c,Ji),i.getVertexPosition(l,Qi);const u=Ff(i,e,t,n,Zi,Ji,Qi,ds);if(u){r&&(ls.fromBufferAttribute(r,o),us.fromBufferAttribute(r,c),hs.fromBufferAttribute(r,l),u.uv=un.getInterpolation(ds,Zi,Ji,Qi,ls,us,hs,new we)),s&&(ls.fromBufferAttribute(s,o),us.fromBufferAttribute(s,c),hs.fromBufferAttribute(s,l),u.uv1=un.getInterpolation(ds,Zi,Ji,Qi,ls,us,hs,new we)),a&&($c.fromBufferAttribute(a,o),Zc.fromBufferAttribute(a,c),Jc.fromBufferAttribute(a,l),u.normal=un.getInterpolation(ds,Zi,Ji,Qi,$c,Zc,Jc,new A),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:c,c:l,normal:new A,materialIndex:0};un.getNormal(Zi,Ji,Qi,h.normal),u.face=h}return u}class Di extends Li{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],u=[],h=[];let d=0,m=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new wi(l,3)),this.setAttribute("normal",new wi(u,3)),this.setAttribute("uv",new wi(h,2));function g(v,p,f,w,y,T,O,C,R,N,E){const M=T/R,L=O/N,X=T/2,z=O/2,q=C/2,K=R+1,V=N+1;let Q=0,W=0;const ce=new A;for(let he=0;he<V;he++){const le=he*L-z;for(let Te=0;Te<K;Te++){const ke=Te*M-X;ce[v]=ke*w,ce[p]=le*y,ce[f]=q,l.push(ce.x,ce.y,ce.z),ce[v]=0,ce[p]=0,ce[f]=C>0?1:-1,u.push(ce.x,ce.y,ce.z),h.push(Te/R),h.push(1-he/N),Q+=1}}for(let he=0;he<N;he++)for(let le=0;le<R;le++){const Te=d+le+K*he,ke=d+le+K*(he+1),Y=d+(le+1)+K*(he+1),ee=d+(le+1)+K*he;c.push(Te,ke,ee),c.push(ke,Y,ee),W+=6}o.addGroup(m,W,E),m+=W,d+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Di(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function pr(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Ft(i){const e={};for(let t=0;t<i.length;t++){const n=pr(i[t]);for(const r in n)e[r]=n[r]}return e}function Of(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function cu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}const Bf={clone:pr,merge:Ft};var zf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yn extends Ks{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zf,this.fragmentShader=kf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=pr(e.uniforms),this.uniformsGroups=Of(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class lu extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=bn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const In=new A,Qc=new we,el=new we;class Kt extends lu{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Gr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(zr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Gr*2*Math.atan(Math.tan(zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){In.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(In.x,In.y).multiplyScalar(-e/In.z),In.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(In.x,In.y).multiplyScalar(-e/In.z)}getViewSize(e,t){return this.getViewBounds(e,Qc,el),t.subVectors(el,Qc)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(zr*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const er=-90,tr=1;class Hf extends Ct{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Kt(er,tr,e,t);r.layers=this.layers,this.add(r);const s=new Kt(er,tr,e,t);s.layers=this.layers,this.add(s);const a=new Kt(er,tr,e,t);a.layers=this.layers,this.add(a);const o=new Kt(er,tr,e,t);o.layers=this.layers,this.add(o);const c=new Kt(er,tr,e,t);c.layers=this.layers,this.add(c);const l=new Kt(er,tr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===bn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ns)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,c),e.setRenderTarget(n,4,r),e.render(t,l),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(h,d,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class uu extends Bt{constructor(e,t,n,r,s,a,o,c,l,u){e=e!==void 0?e:[],t=t!==void 0?t:lr,super(e,t,n,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gf extends Ti{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new uu(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:an}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Di(5,5,5),s=new Yn({name:"CubemapFromEquirect",uniforms:pr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:zn});s.uniforms.tEquirect.value=t;const a=new kt(r,s),o=t.minFilter;return t.minFilter===vi&&(t.minFilter=an),new Hf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}const Fa=new A,Vf=new A,Wf=new Ne;class Un{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Fa.subVectors(n,t).cross(Vf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Fa),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Wf.getNormalMatrix(e),r=this.coplanarPoint(Fa).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new bo,ms=new A;class Ro{constructor(e=new Un,t=new Un,n=new Un,r=new Un,s=new Un,a=new Un){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=bn){const n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],c=r[3],l=r[4],u=r[5],h=r[6],d=r[7],m=r[8],g=r[9],v=r[10],p=r[11],f=r[12],w=r[13],y=r[14],T=r[15];if(n[0].setComponents(c-s,d-l,p-m,T-f).normalize(),n[1].setComponents(c+s,d+l,p+m,T+f).normalize(),n[2].setComponents(c+a,d+u,p+g,T+w).normalize(),n[3].setComponents(c-a,d-u,p-g,T-w).normalize(),n[4].setComponents(c-o,d-h,p-v,T-y).normalize(),t===bn)n[5].setComponents(c+o,d+h,p+v,T+y).normalize();else if(t===Ns)n[5].setComponents(o,h,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(e){return ci.center.set(0,0,0),ci.radius=.7071067811865476,ci.applyMatrix4(e.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(ms.x=r.normal.x>0?e.max.x:e.min.x,ms.y=r.normal.y>0?e.max.y:e.min.y,ms.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ms)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function hu(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Xf(i){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,h=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,c,l){const u=c.array,h=c._updateRange,d=c.updateRanges;if(i.bindBuffer(l,o),h.count===-1&&d.length===0&&i.bufferSubData(l,0,u),d.length!==0){for(let m=0,g=d.length;m<g;m++){const v=d[m];i.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}h.count!==-1&&(i.bufferSubData(l,h.offset*u.BYTES_PER_ELEMENT,u,h.offset,h.count),h.count=-1),c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}class Ii extends Li{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),c=Math.floor(r),l=o+1,u=c+1,h=e/o,d=t/c,m=[],g=[],v=[],p=[];for(let f=0;f<u;f++){const w=f*d-a;for(let y=0;y<l;y++){const T=y*h-s;g.push(T,-w,0),v.push(0,0,1),p.push(y/o),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let w=0;w<o;w++){const y=w+l*f,T=w+l*(f+1),O=w+1+l*(f+1),C=w+1+l*f;m.push(y,T,C),m.push(T,O,C)}this.setIndex(m),this.setAttribute("position",new wi(g,3)),this.setAttribute("normal",new wi(v,3)),this.setAttribute("uv",new wi(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ii(e.width,e.height,e.widthSegments,e.heightSegments)}}var qf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Kf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$f=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ep=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,tp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,np=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ip=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,sp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ap=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,op=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,up=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,dp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,pp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,mp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,gp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_p=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Sp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ep=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,wp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Tp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ap=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Pp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ip=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Up=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Np=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Fp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Op=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Bp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,zp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Wp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Xp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,qp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$p=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,em=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,im=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,sm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,am=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,om=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,cm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,um=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,pm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_m=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Mm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ym=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Em=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Am=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,Rm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Pm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Lm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Im=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Um=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Om=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,km=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Km=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$m=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Jm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Qm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,eg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,og=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ug=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,dg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_g=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Sg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Eg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ue={alphahash_fragment:qf,alphahash_pars_fragment:Yf,alphamap_fragment:Kf,alphamap_pars_fragment:jf,alphatest_fragment:$f,alphatest_pars_fragment:Zf,aomap_fragment:Jf,aomap_pars_fragment:Qf,batching_pars_vertex:ep,batching_vertex:tp,begin_vertex:np,beginnormal_vertex:ip,bsdfs:rp,iridescence_fragment:sp,bumpmap_pars_fragment:ap,clipping_planes_fragment:op,clipping_planes_pars_fragment:cp,clipping_planes_pars_vertex:lp,clipping_planes_vertex:up,color_fragment:hp,color_pars_fragment:dp,color_pars_vertex:fp,color_vertex:pp,common:mp,cube_uv_reflection_fragment:gp,defaultnormal_vertex:_p,displacementmap_pars_vertex:vp,displacementmap_vertex:xp,emissivemap_fragment:Sp,emissivemap_pars_fragment:Mp,colorspace_fragment:yp,colorspace_pars_fragment:Ep,envmap_fragment:wp,envmap_common_pars_fragment:bp,envmap_pars_fragment:Tp,envmap_pars_vertex:Ap,envmap_physical_pars_fragment:Bp,envmap_vertex:Rp,fog_vertex:Cp,fog_pars_vertex:Pp,fog_fragment:Lp,fog_pars_fragment:Dp,gradientmap_pars_fragment:Ip,lightmap_pars_fragment:Up,lights_lambert_fragment:Np,lights_lambert_pars_fragment:Fp,lights_pars_begin:Op,lights_toon_fragment:zp,lights_toon_pars_fragment:kp,lights_phong_fragment:Hp,lights_phong_pars_fragment:Gp,lights_physical_fragment:Vp,lights_physical_pars_fragment:Wp,lights_fragment_begin:Xp,lights_fragment_maps:qp,lights_fragment_end:Yp,logdepthbuf_fragment:Kp,logdepthbuf_pars_fragment:jp,logdepthbuf_pars_vertex:$p,logdepthbuf_vertex:Zp,map_fragment:Jp,map_pars_fragment:Qp,map_particle_fragment:em,map_particle_pars_fragment:tm,metalnessmap_fragment:nm,metalnessmap_pars_fragment:im,morphinstance_vertex:rm,morphcolor_vertex:sm,morphnormal_vertex:am,morphtarget_pars_vertex:om,morphtarget_vertex:cm,normal_fragment_begin:lm,normal_fragment_maps:um,normal_pars_fragment:hm,normal_pars_vertex:dm,normal_vertex:fm,normalmap_pars_fragment:pm,clearcoat_normal_fragment_begin:mm,clearcoat_normal_fragment_maps:gm,clearcoat_pars_fragment:_m,iridescence_pars_fragment:vm,opaque_fragment:xm,packing:Sm,premultiplied_alpha_fragment:Mm,project_vertex:ym,dithering_fragment:Em,dithering_pars_fragment:wm,roughnessmap_fragment:bm,roughnessmap_pars_fragment:Tm,shadowmap_pars_fragment:Am,shadowmap_pars_vertex:Rm,shadowmap_vertex:Cm,shadowmask_pars_fragment:Pm,skinbase_vertex:Lm,skinning_pars_vertex:Dm,skinning_vertex:Im,skinnormal_vertex:Um,specularmap_fragment:Nm,specularmap_pars_fragment:Fm,tonemapping_fragment:Om,tonemapping_pars_fragment:Bm,transmission_fragment:zm,transmission_pars_fragment:km,uv_pars_fragment:Hm,uv_pars_vertex:Gm,uv_vertex:Vm,worldpos_vertex:Wm,background_vert:Xm,background_frag:qm,backgroundCube_vert:Ym,backgroundCube_frag:Km,cube_vert:jm,cube_frag:$m,depth_vert:Zm,depth_frag:Jm,distanceRGBA_vert:Qm,distanceRGBA_frag:eg,equirect_vert:tg,equirect_frag:ng,linedashed_vert:ig,linedashed_frag:rg,meshbasic_vert:sg,meshbasic_frag:ag,meshlambert_vert:og,meshlambert_frag:cg,meshmatcap_vert:lg,meshmatcap_frag:ug,meshnormal_vert:hg,meshnormal_frag:dg,meshphong_vert:fg,meshphong_frag:pg,meshphysical_vert:mg,meshphysical_frag:gg,meshtoon_vert:_g,meshtoon_frag:vg,points_vert:xg,points_frag:Sg,shadow_vert:Mg,shadow_frag:yg,sprite_vert:Eg,sprite_frag:wg},se={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new we(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new we(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},cn={basic:{uniforms:Ft([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:Ft([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:Ft([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:Ft([se.common,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.roughnessmap,se.metalnessmap,se.fog,se.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:Ft([se.common,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.gradientmap,se.fog,se.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:Ft([se.common,se.bumpmap,se.normalmap,se.displacementmap,se.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:Ft([se.points,se.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:Ft([se.common,se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:Ft([se.common,se.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:Ft([se.common,se.bumpmap,se.normalmap,se.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:Ft([se.sprite,se.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:Ft([se.common,se.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:Ft([se.lights,se.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};cn.physical={uniforms:Ft([cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new we(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new we},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new we},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const gs={r:0,b:0,g:0},li=new Ot,bg=new ft;function Tg(i,e,t,n,r,s,a){const o=new Ke(0);let c=s===!0?0:1,l,u,h=null,d=0,m=null;function g(w){let y=w.isScene===!0?w.background:null;return y&&y.isTexture&&(y=(w.backgroundBlurriness>0?t:e).get(y)),y}function v(w){let y=!1;const T=g(w);T===null?f(o,c):T&&T.isColor&&(f(T,1),y=!0);const O=i.xr.getEnvironmentBlendMode();O==="additive"?n.buffers.color.setClear(0,0,0,1,a):O==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(w,y){const T=g(y);T&&(T.isCubeTexture||T.mapping===Xs)?(u===void 0&&(u=new kt(new Di(1,1,1),new Yn({name:"BackgroundCubeMaterial",uniforms:pr(cn.backgroundCube.uniforms),vertexShader:cn.backgroundCube.vertexShader,fragmentShader:cn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(O,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),li.copy(y.backgroundRotation),li.x*=-1,li.y*=-1,li.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(li.y*=-1,li.z*=-1),u.material.uniforms.envMap.value=T,u.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(bg.makeRotationFromEuler(li)),u.material.toneMapped=Qe.getTransfer(T.colorSpace)!==ct,(h!==T||d!==T.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=T,d=T.version,m=i.toneMapping),u.layers.enableAll(),w.unshift(u,u.geometry,u.material,0,0,null)):T&&T.isTexture&&(l===void 0&&(l=new kt(new Ii(2,2),new Yn({name:"BackgroundMaterial",uniforms:pr(cn.background.uniforms),vertexShader:cn.background.vertexShader,fragmentShader:cn.background.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=T,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=Qe.getTransfer(T.colorSpace)!==ct,T.matrixAutoUpdate===!0&&T.updateMatrix(),l.material.uniforms.uvTransform.value.copy(T.matrix),(h!==T||d!==T.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,h=T,d=T.version,m=i.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function f(w,y){w.getRGB(gs,cu(i)),n.buffers.color.setClear(gs.r,gs.g,gs.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(w,y=1){o.set(w),c=y,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(w){c=w,f(o,c)},render:v,addToRenderList:p}}function Ag(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,a=!1;function o(M,L,X,z,q){let K=!1;const V=h(z,X,L);s!==V&&(s=V,l(s.object)),K=m(M,z,X,q),K&&g(M,z,X,q),q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,T(M,L,X,z),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function h(M,L,X){const z=X.wireframe===!0;let q=n[M.id];q===void 0&&(q={},n[M.id]=q);let K=q[L.id];K===void 0&&(K={},q[L.id]=K);let V=K[z];return V===void 0&&(V=d(c()),K[z]=V),V}function d(M){const L=[],X=[],z=[];for(let q=0;q<t;q++)L[q]=0,X[q]=0,z[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:X,attributeDivisors:z,object:M,attributes:{},index:null}}function m(M,L,X,z){const q=s.attributes,K=L.attributes;let V=0;const Q=X.getAttributes();for(const W in Q)if(Q[W].location>=0){const he=q[W];let le=K[W];if(le===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(le=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(le=M.instanceColor)),he===void 0||he.attribute!==le||le&&he.data!==le.data)return!0;V++}return s.attributesNum!==V||s.index!==z}function g(M,L,X,z){const q={},K=L.attributes;let V=0;const Q=X.getAttributes();for(const W in Q)if(Q[W].location>=0){let he=K[W];he===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(he=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(he=M.instanceColor));const le={};le.attribute=he,he&&he.data&&(le.data=he.data),q[W]=le,V++}s.attributes=q,s.attributesNum=V,s.index=z}function v(){const M=s.newAttributes;for(let L=0,X=M.length;L<X;L++)M[L]=0}function p(M){f(M,0)}function f(M,L){const X=s.newAttributes,z=s.enabledAttributes,q=s.attributeDivisors;X[M]=1,z[M]===0&&(i.enableVertexAttribArray(M),z[M]=1),q[M]!==L&&(i.vertexAttribDivisor(M,L),q[M]=L)}function w(){const M=s.newAttributes,L=s.enabledAttributes;for(let X=0,z=L.length;X<z;X++)L[X]!==M[X]&&(i.disableVertexAttribArray(X),L[X]=0)}function y(M,L,X,z,q,K,V){V===!0?i.vertexAttribIPointer(M,L,X,q,K):i.vertexAttribPointer(M,L,X,z,q,K)}function T(M,L,X,z){v();const q=z.attributes,K=X.getAttributes(),V=L.defaultAttributeValues;for(const Q in K){const W=K[Q];if(W.location>=0){let ce=q[Q];if(ce===void 0&&(Q==="instanceMatrix"&&M.instanceMatrix&&(ce=M.instanceMatrix),Q==="instanceColor"&&M.instanceColor&&(ce=M.instanceColor)),ce!==void 0){const he=ce.normalized,le=ce.itemSize,Te=e.get(ce);if(Te===void 0)continue;const ke=Te.buffer,Y=Te.type,ee=Te.bytesPerElement,de=Y===i.INT||Y===i.UNSIGNED_INT||ce.gpuType===Kl;if(ce.isInterleavedBufferAttribute){const ae=ce.data,Ie=ae.stride,Ae=ce.offset;if(ae.isInstancedInterleavedBuffer){for(let He=0;He<W.locationSize;He++)f(W.location+He,ae.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let He=0;He<W.locationSize;He++)p(W.location+He);i.bindBuffer(i.ARRAY_BUFFER,ke);for(let He=0;He<W.locationSize;He++)y(W.location+He,le/W.locationSize,Y,he,Ie*ee,(Ae+le/W.locationSize*He)*ee,de)}else{if(ce.isInstancedBufferAttribute){for(let ae=0;ae<W.locationSize;ae++)f(W.location+ae,ce.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ae=0;ae<W.locationSize;ae++)p(W.location+ae);i.bindBuffer(i.ARRAY_BUFFER,ke);for(let ae=0;ae<W.locationSize;ae++)y(W.location+ae,le/W.locationSize,Y,he,le*ee,le/W.locationSize*ae*ee,de)}}else if(V!==void 0){const he=V[Q];if(he!==void 0)switch(he.length){case 2:i.vertexAttrib2fv(W.location,he);break;case 3:i.vertexAttrib3fv(W.location,he);break;case 4:i.vertexAttrib4fv(W.location,he);break;default:i.vertexAttrib1fv(W.location,he)}}}}w()}function O(){N();for(const M in n){const L=n[M];for(const X in L){const z=L[X];for(const q in z)u(z[q].object),delete z[q];delete L[X]}delete n[M]}}function C(M){if(n[M.id]===void 0)return;const L=n[M.id];for(const X in L){const z=L[X];for(const q in z)u(z[q].object),delete z[q];delete L[X]}delete n[M.id]}function R(M){for(const L in n){const X=n[L];if(X[M.id]===void 0)continue;const z=X[M.id];for(const q in z)u(z[q].object),delete z[q];delete X[M.id]}}function N(){E(),a=!0,s!==r&&(s=r,l(s.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:N,resetDefaultState:E,dispose:O,releaseStatesOfGeometry:C,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:p,disableUnusedAttributes:w}}function Rg(i,e,t){let n;function r(l){n=l}function s(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function a(l,u,h){h!==0&&(i.drawArraysInstanced(n,l,u,h),t.update(u,n,h))}function o(l,u,h){if(h===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<h;m++)this.render(l[m],u[m]);else{d.multiDrawArraysWEBGL(n,l,0,u,0,h);let m=0;for(let g=0;g<h;g++)m+=u[g];t.update(m,n,1)}}function c(l,u,h,d){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)a(l[g],u[g],d[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v];for(let v=0;v<d.length;v++)t.update(g,n,d[v])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Cg(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==hn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const R=C===qs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==qn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==On&&!R)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),f=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,O=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:g,maxCubemapSize:v,maxAttributes:p,maxVertexUniforms:f,maxVaryings:w,maxFragmentUniforms:y,vertexTextures:T,maxSamples:O}}function Pg(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new Un,o=new Ne,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const m=h.length!==0||d||n!==0||r;return r=d,n=h.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,m){const g=h.clippingPlanes,v=h.clipIntersection,p=h.clipShadows,f=i.get(h);if(!r||g===null||g.length===0||s&&!p)s?u(null):l();else{const w=s?0:n,y=w*4;let T=f.clippingState||null;c.value=T,T=u(g,d,y,m);for(let O=0;O!==y;++O)T[O]=t[O];f.clippingState=T,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=w}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,m,g){const v=h!==null?h.length:0;let p=null;if(v!==0){if(p=c.value,g!==!0||p===null){const f=m+v*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(p===null||p.length<f)&&(p=new Float32Array(f));for(let y=0,T=m;y!==v;++y,T+=4)a.copy(h[y]).applyMatrix4(w,o),a.normal.toArray(p,T),p[T+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function Lg(i){let e=new WeakMap;function t(a,o){return o===Za?a.mapping=lr:o===Ja&&(a.mapping=ur),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Za||o===Ja)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Gf(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",r),t(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class du extends lu{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const rr=4,tl=[.125,.215,.35,.446,.526,.582],mi=20,Oa=new du,nl=new Ke;let Ba=null,za=0,ka=0,Ha=!1;const di=(1+Math.sqrt(5))/2,nr=1/di,il=[new A(-di,nr,0),new A(di,nr,0),new A(-nr,0,di),new A(nr,0,di),new A(0,di,-nr),new A(0,di,nr),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)];class rl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){Ba=this._renderer.getRenderTarget(),za=this._renderer.getActiveCubeFace(),ka=this._renderer.getActiveMipmapLevel(),Ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ol(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ba,za,ka),this._renderer.xr.enabled=Ha,e.scissorTest=!1,_s(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===lr||e.mapping===ur?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ba=this._renderer.getRenderTarget(),za=this._renderer.getActiveCubeFace(),ka=this._renderer.getActiveMipmapLevel(),Ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:an,minFilter:an,generateMipmaps:!1,type:qs,format:hn,colorSpace:Qn,depthBuffer:!1},r=sl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sl(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Dg(s)),this._blurMaterial=Ig(s,e,t)}return r}_compileMaterial(e){const t=new kt(this._lodPlanes[0],e);this._renderer.compile(t,Oa)}_sceneToCubeUV(e,t,n,r){const o=new Kt(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(nl),u.toneMapping=kn,u.autoClear=!1;const m=new jt({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),g=new kt(new Di,m);let v=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,v=!0):(m.color.copy(nl),v=!0);for(let f=0;f<6;f++){const w=f%3;w===0?(o.up.set(0,c[f],0),o.lookAt(l[f],0,0)):w===1?(o.up.set(0,0,c[f]),o.lookAt(0,l[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,l[f]));const y=this._cubeSize;_s(r,w*y,f>2?y:0,y,y),u.setRenderTarget(r),v&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=h,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===lr||e.mapping===ur;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ol()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=al());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new kt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;_s(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Oa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=il[(r-s-1)%il.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new kt(this._lodPlanes[r],l),d=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*mi-1),v=s/g,p=isFinite(s)?1+Math.floor(u*v):mi;p>mi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${mi}`);const f=[];let w=0;for(let R=0;R<mi;++R){const N=R/v,E=Math.exp(-N*N/2);f.push(E),R===0?w+=E:R<p&&(w+=2*E)}for(let R=0;R<f.length;R++)f[R]=f[R]/w;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;const T=this._sizeLods[r],O=3*T*(r>y-rr?r-y+rr:0),C=4*(this._cubeSize-T);_s(t,O,C,3*T,2*T),c.setRenderTarget(t),c.render(h,Oa)}}function Dg(i){const e=[],t=[],n=[];let r=i;const s=i-rr+1+tl.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let c=1/o;a>i-rr?c=tl[a-i+rr-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,v=3,p=2,f=1,w=new Float32Array(v*g*m),y=new Float32Array(p*g*m),T=new Float32Array(f*g*m);for(let C=0;C<m;C++){const R=C%3*2/3-1,N=C>2?0:-1,E=[R,N,0,R+2/3,N,0,R+2/3,N+1,0,R,N,0,R+2/3,N+1,0,R,N+1,0];w.set(E,v*g*C),y.set(d,p*g*C);const M=[C,C,C,C,C,C];T.set(M,f*g*C)}const O=new Li;O.setAttribute("position",new fn(w,v)),O.setAttribute("uv",new fn(y,p)),O.setAttribute("faceIndex",new fn(T,f)),e.push(O),r>rr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function sl(i,e,t){const n=new Ti(i,e,t);return n.texture.mapping=Xs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _s(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Ig(i,e,t){const n=new Float32Array(mi),r=new A(0,1,0);return new Yn({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Co(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function al(){return new Yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Co(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ol(){return new Yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Co(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function Co(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ug(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Za||c===Ja,u=c===lr||c===ur;if(l||u){let h=e.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new rl(i)),h=l?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const m=o.image;return l&&m&&m.height>0||u&&m&&r(m)?(t===null&&(t=new rl(i)),h=l?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function r(o){let c=0;const l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Ng(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&nu("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Fg(i,e,t,n){const r={},s=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let p=0,f=v.length;p<f;p++)e.remove(v[p])}d.removeEventListener("dispose",a),delete r[d.id];const m=s.get(d);m&&(e.remove(m),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function c(h){const d=h.attributes;for(const g in d)e.update(d[g],i.ARRAY_BUFFER);const m=h.morphAttributes;for(const g in m){const v=m[g];for(let p=0,f=v.length;p<f;p++)e.update(v[p],i.ARRAY_BUFFER)}}function l(h){const d=[],m=h.index,g=h.attributes.position;let v=0;if(m!==null){const w=m.array;v=m.version;for(let y=0,T=w.length;y<T;y+=3){const O=w[y+0],C=w[y+1],R=w[y+2];d.push(O,C,C,R,R,O)}}else if(g!==void 0){const w=g.array;v=g.version;for(let y=0,T=w.length/3-1;y<T;y+=3){const O=y+0,C=y+1,R=y+2;d.push(O,C,C,R,R,O)}}else return;const p=new(tu(d)?ou:au)(d,1);p.version=v;const f=s.get(h);f&&e.remove(f),s.set(h,p)}function u(h){const d=s.get(h);if(d){const m=h.index;m!==null&&d.version<m.version&&l(h)}else l(h);return s.get(h)}return{get:o,update:c,getWireframeAttribute:u}}function Og(i,e,t){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,m){i.drawElements(n,m,s,d*a),t.update(m,n,1)}function l(d,m,g){g!==0&&(i.drawElementsInstanced(n,m,s,d*a,g),t.update(m,n,g))}function u(d,m,g){if(g===0)return;const v=e.get("WEBGL_multi_draw");if(v===null)for(let p=0;p<g;p++)this.render(d[p]/a,m[p]);else{v.multiDrawElementsWEBGL(n,m,0,s,d,0,g);let p=0;for(let f=0;f<g;f++)p+=m[f];t.update(p,n,1)}}function h(d,m,g,v){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<d.length;f++)l(d[f]/a,m[f],v[f]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,s,d,0,v,0,g);let f=0;for(let w=0;w<g;w++)f+=m[w];for(let w=0;w<v.length;w++)t.update(f,n,v[w])}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Bg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function zg(i,e,t){const n=new WeakMap,r=new ut;function s(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==h){let E=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let y=0;m===!0&&(y=1),g===!0&&(y=2),v===!0&&(y=3);let T=o.attributes.position.count*y,O=1;T>e.maxTextureSize&&(O=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const C=new Float32Array(T*O*4*h),R=new ru(C,T,O,h);R.type=On,R.needsUpdate=!0;const N=y*4;for(let M=0;M<h;M++){const L=p[M],X=f[M],z=w[M],q=T*O*4*M;for(let K=0;K<L.count;K++){const V=K*N;m===!0&&(r.fromBufferAttribute(L,K),C[q+V+0]=r.x,C[q+V+1]=r.y,C[q+V+2]=r.z,C[q+V+3]=0),g===!0&&(r.fromBufferAttribute(X,K),C[q+V+4]=r.x,C[q+V+5]=r.y,C[q+V+6]=r.z,C[q+V+7]=0),v===!0&&(r.fromBufferAttribute(z,K),C[q+V+8]=r.x,C[q+V+9]=r.y,C[q+V+10]=r.z,C[q+V+11]=z.itemSize===4?r.w:1)}}d={count:h,texture:R,size:new we(T,O)},n.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let v=0;v<l.length;v++)m+=l[v];const g=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function kg(i,e,t,n){let r=new WeakMap;function s(c){const l=n.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==l&&(e.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return h}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:a}}class fu extends Bt{constructor(e,t,n,r,s,a,o,c,l,u=ar){if(u!==ar&&u!==fr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===ar&&(n=hr),n===void 0&&u===fr&&(n=dr),super(null,r,s,a,o,c,u,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:en,this.minFilter=c!==void 0?c:en,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const pu=new Bt,mu=new fu(1,1);mu.compareFunction=eu;const gu=new ru,_u=new Tf,vu=new uu,cl=[],ll=[],ul=new Float32Array(16),hl=new Float32Array(9),dl=new Float32Array(4);function Er(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=cl[r];if(s===void 0&&(s=new Float32Array(r),cl[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function bt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Tt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function js(i,e){let t=ll[e];t===void 0&&(t=new Int32Array(e),ll[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Hg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2fv(this.addr,e),Tt(t,e)}}function Vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;i.uniform3fv(this.addr,e),Tt(t,e)}}function Wg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4fv(this.addr,e),Tt(t,e)}}function Xg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,n))return;dl.set(n),i.uniformMatrix2fv(this.addr,!1,dl),Tt(t,n)}}function qg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,n))return;hl.set(n),i.uniformMatrix3fv(this.addr,!1,hl),Tt(t,n)}}function Yg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(bt(t,n))return;ul.set(n),i.uniformMatrix4fv(this.addr,!1,ul),Tt(t,n)}}function Kg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function jg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2iv(this.addr,e),Tt(t,e)}}function $g(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;i.uniform3iv(this.addr,e),Tt(t,e)}}function Zg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4iv(this.addr,e),Tt(t,e)}}function Jg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Qg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;i.uniform2uiv(this.addr,e),Tt(t,e)}}function e_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;i.uniform3uiv(this.addr,e),Tt(t,e)}}function t_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;i.uniform4uiv(this.addr,e),Tt(t,e)}}function n_(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);const s=this.type===i.SAMPLER_2D_SHADOW?mu:pu;t.setTexture2D(e||s,r)}function i_(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||_u,r)}function r_(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||vu,r)}function s_(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||gu,r)}function a_(i){switch(i){case 5126:return Hg;case 35664:return Gg;case 35665:return Vg;case 35666:return Wg;case 35674:return Xg;case 35675:return qg;case 35676:return Yg;case 5124:case 35670:return Kg;case 35667:case 35671:return jg;case 35668:case 35672:return $g;case 35669:case 35673:return Zg;case 5125:return Jg;case 36294:return Qg;case 36295:return e_;case 36296:return t_;case 35678:case 36198:case 36298:case 36306:case 35682:return n_;case 35679:case 36299:case 36307:return i_;case 35680:case 36300:case 36308:case 36293:return r_;case 36289:case 36303:case 36311:case 36292:return s_}}function o_(i,e){i.uniform1fv(this.addr,e)}function c_(i,e){const t=Er(e,this.size,2);i.uniform2fv(this.addr,t)}function l_(i,e){const t=Er(e,this.size,3);i.uniform3fv(this.addr,t)}function u_(i,e){const t=Er(e,this.size,4);i.uniform4fv(this.addr,t)}function h_(i,e){const t=Er(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function d_(i,e){const t=Er(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function f_(i,e){const t=Er(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function p_(i,e){i.uniform1iv(this.addr,e)}function m_(i,e){i.uniform2iv(this.addr,e)}function g_(i,e){i.uniform3iv(this.addr,e)}function __(i,e){i.uniform4iv(this.addr,e)}function v_(i,e){i.uniform1uiv(this.addr,e)}function x_(i,e){i.uniform2uiv(this.addr,e)}function S_(i,e){i.uniform3uiv(this.addr,e)}function M_(i,e){i.uniform4uiv(this.addr,e)}function y_(i,e,t){const n=this.cache,r=e.length,s=js(t,r);bt(n,s)||(i.uniform1iv(this.addr,s),Tt(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||pu,s[a])}function E_(i,e,t){const n=this.cache,r=e.length,s=js(t,r);bt(n,s)||(i.uniform1iv(this.addr,s),Tt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||_u,s[a])}function w_(i,e,t){const n=this.cache,r=e.length,s=js(t,r);bt(n,s)||(i.uniform1iv(this.addr,s),Tt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||vu,s[a])}function b_(i,e,t){const n=this.cache,r=e.length,s=js(t,r);bt(n,s)||(i.uniform1iv(this.addr,s),Tt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||gu,s[a])}function T_(i){switch(i){case 5126:return o_;case 35664:return c_;case 35665:return l_;case 35666:return u_;case 35674:return h_;case 35675:return d_;case 35676:return f_;case 5124:case 35670:return p_;case 35667:case 35671:return m_;case 35668:case 35672:return g_;case 35669:case 35673:return __;case 5125:return v_;case 36294:return x_;case 36295:return S_;case 36296:return M_;case 35678:case 36198:case 36298:case 36306:case 35682:return y_;case 35679:case 36299:case 36307:return E_;case 35680:case 36300:case 36308:case 36293:return w_;case 36289:case 36303:case 36311:case 36292:return b_}}class A_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=a_(t.type)}}class R_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=T_(t.type)}}class C_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const Ga=/(\w+)(\])?(\[|\.)?/g;function fl(i,e){i.seq.push(e),i.map[e.id]=e}function P_(i,e,t){const n=i.name,r=n.length;for(Ga.lastIndex=0;;){const s=Ga.exec(n),a=Ga.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){fl(t,l===void 0?new A_(o,i,e):new R_(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new C_(o),fl(t,h)),t=h}}}class ws{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);P_(s,a,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function pl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const L_=37297;let D_=0;function I_(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function U_(i){const e=Qe.getPrimaries(Qe.workingColorSpace),t=Qe.getPrimaries(i);let n;switch(e===t?n="":e===Us&&t===Is?n="LinearDisplayP3ToLinearSRGB":e===Is&&t===Us&&(n="LinearSRGBToLinearDisplayP3"),i){case Qn:case Ys:return[n,"LinearTransferOETF"];case Yt:case Eo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function ml(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+I_(i.getShaderSource(e),a)}else return r}function N_(i,e){const t=U_(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function F_(i,e){let t;switch(e){case Ad:t="Linear";break;case Rd:t="Reinhard";break;case Cd:t="OptimizedCineon";break;case Pd:t="ACESFilmic";break;case Dd:t="AgX";break;case Id:t="Neutral";break;case Ld:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function O_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Or).join(`
`)}function B_(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function z_(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Or(i){return i!==""}function gl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _l(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const k_=/^[ \t]*#include +<([\w\d./]+)>/gm;function to(i){return i.replace(k_,G_)}const H_=new Map;function G_(i,e){let t=Ue[e];if(t===void 0){const n=H_.get(e);if(n!==void 0)t=Ue[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return to(t)}const V_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vl(i){return i.replace(V_,W_)}function W_(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function xl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function X_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Qh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===yn&&(e="SHADOWMAP_TYPE_VSM"),e}function q_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case lr:case ur:e="ENVMAP_TYPE_CUBE";break;case Xs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Y_(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ur:e="ENVMAP_MODE_REFRACTION";break}return e}function K_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ql:e="ENVMAP_BLENDING_MULTIPLY";break;case bd:e="ENVMAP_BLENDING_MIX";break;case Td:e="ENVMAP_BLENDING_ADD";break}return e}function j_(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function $_(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=X_(t),l=q_(t),u=Y_(t),h=K_(t),d=j_(t),m=O_(t),g=B_(s),v=r.createProgram();let p,f,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Or).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Or).join(`
`),f.length>0&&(f+=`
`)):(p=[xl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Or).join(`
`),f=[xl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==kn?"#define TONE_MAPPING":"",t.toneMapping!==kn?Ue.tonemapping_pars_fragment:"",t.toneMapping!==kn?F_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,N_("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Or).join(`
`)),a=to(a),a=gl(a,t),a=_l(a,t),o=to(o),o=gl(o,t),o=_l(o,t),a=vl(a),o=vl(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===Uc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Uc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=w+p+a,T=w+f+o,O=pl(r,r.VERTEX_SHADER,y),C=pl(r,r.FRAGMENT_SHADER,T);r.attachShader(v,O),r.attachShader(v,C),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(L){if(i.debug.checkShaderErrors){const X=r.getProgramInfoLog(v).trim(),z=r.getShaderInfoLog(O).trim(),q=r.getShaderInfoLog(C).trim();let K=!0,V=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,O,C);else{const Q=ml(r,O,"vertex"),W=ml(r,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+X+`
`+Q+`
`+W)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(z===""||q==="")&&(V=!1);V&&(L.diagnostics={runnable:K,programLog:X,vertexShader:{log:z,prefix:p},fragmentShader:{log:q,prefix:f}})}r.deleteShader(O),r.deleteShader(C),N=new ws(r,v),E=z_(r,v)}let N;this.getUniforms=function(){return N===void 0&&R(this),N};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(v,L_)),M},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=D_++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=O,this.fragmentShader=C,this}let Z_=0;class J_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Q_(e),t.set(e,n)),n}}class Q_{constructor(e){this.id=Z_++,this.code=e,this.usedTimes=0}}function e0(i,e,t,n,r,s,a){const o=new Ao,c=new J_,l=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let m=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(E){return l.add(E),E===0?"uv":`uv${E}`}function p(E,M,L,X,z){const q=X.fog,K=z.geometry,V=E.isMeshStandardMaterial?X.environment:null,Q=(E.isMeshStandardMaterial?t:e).get(E.envMap||V),W=Q&&Q.mapping===Xs?Q.image.height:null,ce=g[E.type];E.precision!==null&&(m=r.getMaxPrecision(E.precision),m!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const he=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,le=he!==void 0?he.length:0;let Te=0;K.morphAttributes.position!==void 0&&(Te=1),K.morphAttributes.normal!==void 0&&(Te=2),K.morphAttributes.color!==void 0&&(Te=3);let ke,Y,ee,de;if(ce){const Ye=cn[ce];ke=Ye.vertexShader,Y=Ye.fragmentShader}else ke=E.vertexShader,Y=E.fragmentShader,c.update(E),ee=c.getVertexShaderID(E),de=c.getFragmentShaderID(E);const ae=i.getRenderTarget(),Ie=z.isInstancedMesh===!0,Ae=z.isBatchedMesh===!0,He=!!E.map,P=!!E.matcap,Ge=!!Q,Be=!!E.aoMap,at=!!E.lightMap,xe=!!E.bumpMap,We=!!E.normalMap,Fe=!!E.displacementMap,Re=!!E.emissiveMap,ht=!!E.metalnessMap,b=!!E.roughnessMap,x=E.anisotropy>0,k=E.clearcoat>0,j=E.dispersion>0,Z=E.iridescence>0,J=E.sheen>0,ge=E.transmission>0,re=x&&!!E.anisotropyMap,ie=k&&!!E.clearcoatMap,Ce=k&&!!E.clearcoatNormalMap,te=k&&!!E.clearcoatRoughnessMap,pe=Z&&!!E.iridescenceMap,Oe=Z&&!!E.iridescenceThicknessMap,Me=J&&!!E.sheenColorMap,oe=J&&!!E.sheenRoughnessMap,Pe=!!E.specularMap,Le=!!E.specularColorMap,pt=!!E.specularIntensityMap,_=ge&&!!E.transmissionMap,H=ge&&!!E.thicknessMap,U=!!E.gradientMap,G=!!E.alphaMap,$=E.alphaTest>0,_e=!!E.alphaHash,be=!!E.extensions;let mt=kn;E.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(mt=i.toneMapping);const Mt={shaderID:ce,shaderType:E.type,shaderName:E.name,vertexShader:ke,fragmentShader:Y,defines:E.defines,customVertexShaderID:ee,customFragmentShaderID:de,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:Ae,batchingColor:Ae&&z._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&z.instanceColor!==null,instancingMorph:Ie&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ae===null?i.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:Qn,alphaToCoverage:!!E.alphaToCoverage,map:He,matcap:P,envMap:Ge,envMapMode:Ge&&Q.mapping,envMapCubeUVHeight:W,aoMap:Be,lightMap:at,bumpMap:xe,normalMap:We,displacementMap:d&&Fe,emissiveMap:Re,normalMapObjectSpace:We&&E.normalMapType===Kd,normalMapTangentSpace:We&&E.normalMapType===Yd,metalnessMap:ht,roughnessMap:b,anisotropy:x,anisotropyMap:re,clearcoat:k,clearcoatMap:ie,clearcoatNormalMap:Ce,clearcoatRoughnessMap:te,dispersion:j,iridescence:Z,iridescenceMap:pe,iridescenceThicknessMap:Oe,sheen:J,sheenColorMap:Me,sheenRoughnessMap:oe,specularMap:Pe,specularColorMap:Le,specularIntensityMap:pt,transmission:ge,transmissionMap:_,thicknessMap:H,gradientMap:U,opaque:E.transparent===!1&&E.blending===sr&&E.alphaToCoverage===!1,alphaMap:G,alphaTest:$,alphaHash:_e,combine:E.combine,mapUv:He&&v(E.map.channel),aoMapUv:Be&&v(E.aoMap.channel),lightMapUv:at&&v(E.lightMap.channel),bumpMapUv:xe&&v(E.bumpMap.channel),normalMapUv:We&&v(E.normalMap.channel),displacementMapUv:Fe&&v(E.displacementMap.channel),emissiveMapUv:Re&&v(E.emissiveMap.channel),metalnessMapUv:ht&&v(E.metalnessMap.channel),roughnessMapUv:b&&v(E.roughnessMap.channel),anisotropyMapUv:re&&v(E.anisotropyMap.channel),clearcoatMapUv:ie&&v(E.clearcoatMap.channel),clearcoatNormalMapUv:Ce&&v(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&v(E.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&v(E.iridescenceMap.channel),iridescenceThicknessMapUv:Oe&&v(E.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&v(E.sheenColorMap.channel),sheenRoughnessMapUv:oe&&v(E.sheenRoughnessMap.channel),specularMapUv:Pe&&v(E.specularMap.channel),specularColorMapUv:Le&&v(E.specularColorMap.channel),specularIntensityMapUv:pt&&v(E.specularIntensityMap.channel),transmissionMapUv:_&&v(E.transmissionMap.channel),thicknessMapUv:H&&v(E.thicknessMap.channel),alphaMapUv:G&&v(E.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(We||x),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!K.attributes.uv&&(He||G),fog:!!q,useFog:E.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:z.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:Te,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:mt,decodeVideoTexture:He&&E.map.isVideoTexture===!0&&Qe.getTransfer(E.map.colorSpace)===ct,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===En,flipSided:E.side===Ht,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:be&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:be&&E.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Mt.vertexUv1s=l.has(1),Mt.vertexUv2s=l.has(2),Mt.vertexUv3s=l.has(3),l.clear(),Mt}function f(E){const M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)M.push(L),M.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(w(M,E),y(M,E),M.push(i.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function w(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function y(E,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.skinning&&o.enable(4),M.morphTargets&&o.enable(5),M.morphNormals&&o.enable(6),M.morphColors&&o.enable(7),M.premultipliedAlpha&&o.enable(8),M.shadowMapEnabled&&o.enable(9),M.doubleSided&&o.enable(10),M.flipSided&&o.enable(11),M.useDepthPacking&&o.enable(12),M.dithering&&o.enable(13),M.transmission&&o.enable(14),M.sheen&&o.enable(15),M.opaque&&o.enable(16),M.pointsUvs&&o.enable(17),M.decodeVideoTexture&&o.enable(18),M.alphaToCoverage&&o.enable(19),E.push(o.mask)}function T(E){const M=g[E.type];let L;if(M){const X=cn[M];L=Bf.clone(X.uniforms)}else L=E.uniforms;return L}function O(E,M){let L;for(let X=0,z=u.length;X<z;X++){const q=u[X];if(q.cacheKey===M){L=q,++L.usedTimes;break}}return L===void 0&&(L=new $_(i,M,E,s),u.push(L)),L}function C(E){if(--E.usedTimes===0){const M=u.indexOf(E);u[M]=u[u.length-1],u.pop(),E.destroy()}}function R(E){c.remove(E)}function N(){c.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:T,acquireProgram:O,releaseProgram:C,releaseShaderCache:R,programs:u,dispose:N}}function t0(){let i=new WeakMap;function e(s){let a=i.get(s);return a===void 0&&(a={},i.set(s,a)),a}function t(s){i.delete(s)}function n(s,a,o){i.get(s)[a]=o}function r(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:r}}function n0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Sl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ml(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(h,d,m,g,v,p){let f=i[e];return f===void 0?(f={id:h.id,object:h,geometry:d,material:m,groupOrder:g,renderOrder:h.renderOrder,z:v,group:p},i[e]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=m,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=v,f.group=p),e++,f}function o(h,d,m,g,v,p){const f=a(h,d,m,g,v,p);m.transmission>0?n.push(f):m.transparent===!0?r.push(f):t.push(f)}function c(h,d,m,g,v,p){const f=a(h,d,m,g,v,p);m.transmission>0?n.unshift(f):m.transparent===!0?r.unshift(f):t.unshift(f)}function l(h,d){t.length>1&&t.sort(h||n0),n.length>1&&n.sort(d||Sl),r.length>1&&r.sort(d||Sl)}function u(){for(let h=e,d=i.length;h<d;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:u,sort:l}}function i0(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new Ml,i.set(n,[a])):r>=s.length?(a=new Ml,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function r0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new Ke};break;case"SpotLight":t={position:new A,direction:new A,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function s0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let a0=0;function o0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function c0(i){const e=new r0,t=s0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new A);const r=new A,s=new ft,a=new ft;function o(l){let u=0,h=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let m=0,g=0,v=0,p=0,f=0,w=0,y=0,T=0,O=0,C=0,R=0;l.sort(o0);for(let E=0,M=l.length;E<M;E++){const L=l[E],X=L.color,z=L.intensity,q=L.distance,K=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=X.r*z,h+=X.g*z,d+=X.b*z;else if(L.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(L.sh.coefficients[V],z);R++}else if(L.isDirectionalLight){const V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Q=L.shadow,W=t.get(L);W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.directionalShadow[m]=W,n.directionalShadowMap[m]=K,n.directionalShadowMatrix[m]=L.shadow.matrix,w++}n.directional[m]=V,m++}else if(L.isSpotLight){const V=e.get(L);V.position.setFromMatrixPosition(L.matrixWorld),V.color.copy(X).multiplyScalar(z),V.distance=q,V.coneCos=Math.cos(L.angle),V.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),V.decay=L.decay,n.spot[v]=V;const Q=L.shadow;if(L.map&&(n.spotLightMap[O]=L.map,O++,Q.updateMatrices(L),L.castShadow&&C++),n.spotLightMatrix[v]=Q.matrix,L.castShadow){const W=t.get(L);W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.spotShadow[v]=W,n.spotShadowMap[v]=K,T++}v++}else if(L.isRectAreaLight){const V=e.get(L);V.color.copy(X).multiplyScalar(z),V.halfWidth.set(L.width*.5,0,0),V.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=V,p++}else if(L.isPointLight){const V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),V.distance=L.distance,V.decay=L.decay,L.castShadow){const Q=L.shadow,W=t.get(L);W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,W.shadowCameraNear=Q.camera.near,W.shadowCameraFar=Q.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=L.shadow.matrix,y++}n.point[g]=V,g++}else if(L.isHemisphereLight){const V=e.get(L);V.skyColor.copy(L.color).multiplyScalar(z),V.groundColor.copy(L.groundColor).multiplyScalar(z),n.hemi[f]=V,f++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=se.LTC_FLOAT_1,n.rectAreaLTC2=se.LTC_FLOAT_2):(n.rectAreaLTC1=se.LTC_HALF_1,n.rectAreaLTC2=se.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const N=n.hash;(N.directionalLength!==m||N.pointLength!==g||N.spotLength!==v||N.rectAreaLength!==p||N.hemiLength!==f||N.numDirectionalShadows!==w||N.numPointShadows!==y||N.numSpotShadows!==T||N.numSpotMaps!==O||N.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=T,n.spotShadowMap.length=T,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=T+O-C,n.spotLightMap.length=O,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=R,N.directionalLength=m,N.pointLength=g,N.spotLength=v,N.rectAreaLength=p,N.hemiLength=f,N.numDirectionalShadows=w,N.numPointShadows=y,N.numSpotShadows=T,N.numSpotMaps=O,N.numLightProbes=R,n.version=a0++)}function c(l,u){let h=0,d=0,m=0,g=0,v=0;const p=u.matrixWorldInverse;for(let f=0,w=l.length;f<w;f++){const y=l[f];if(y.isDirectionalLight){const T=n.directional[h];T.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),h++}else if(y.isSpotLight){const T=n.spot[m];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),m++}else if(y.isRectAreaLight){const T=n.rectArea[g];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),a.identity(),s.copy(y.matrixWorld),s.premultiply(p),a.extractRotation(s),T.halfWidth.set(y.width*.5,0,0),T.halfHeight.set(0,y.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const T=n.point[d];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){const T=n.hemi[v];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(p),v++}}}return{setup:o,setupView:c,state:n}}function yl(i){const e=new c0(i),t=[],n=[];function r(u){l.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function l0(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new yl(i),e.set(r,[o])):s>=a.length?(o=new yl(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class u0 extends Ks{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class h0 extends Ks{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const d0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,f0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function p0(i,e,t){let n=new Ro;const r=new we,s=new we,a=new ut,o=new u0({depthPacking:qd}),c=new h0,l={},u=t.maxTextureSize,h={[Xn]:Ht,[Ht]:Xn,[En]:En},d=new Yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new we},radius:{value:4}},vertexShader:d0,fragmentShader:f0}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new Li;g.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new kt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xl;let f=this.type;this.render=function(C,R,N){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||C.length===0)return;const E=i.getRenderTarget(),M=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),X=i.state;X.setBlending(zn),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const z=f!==yn&&this.type===yn,q=f===yn&&this.type!==yn;for(let K=0,V=C.length;K<V;K++){const Q=C[K],W=Q.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const ce=W.getFrameExtents();if(r.multiply(ce),s.copy(W.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ce.x),r.x=s.x*ce.x,W.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ce.y),r.y=s.y*ce.y,W.mapSize.y=s.y)),W.map===null||z===!0||q===!0){const le=this.type!==yn?{minFilter:en,magFilter:en}:{};W.map!==null&&W.map.dispose(),W.map=new Ti(r.x,r.y,le),W.map.texture.name=Q.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const he=W.getViewportCount();for(let le=0;le<he;le++){const Te=W.getViewport(le);a.set(s.x*Te.x,s.y*Te.y,s.x*Te.z,s.y*Te.w),X.viewport(a),W.updateMatrices(Q,le),n=W.getFrustum(),T(R,N,W.camera,Q,this.type)}W.isPointLightShadow!==!0&&this.type===yn&&w(W,N),W.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(E,M,L)};function w(C,R){const N=e.update(v);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,m.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Ti(r.x,r.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(R,null,N,d,v,null),m.uniforms.shadow_pass.value=C.mapPass.texture,m.uniforms.resolution.value=C.mapSize,m.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(R,null,N,m,v,null)}function y(C,R,N,E){let M=null;const L=N.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(L!==void 0)M=L;else if(M=N.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const X=M.uuid,z=R.uuid;let q=l[X];q===void 0&&(q={},l[X]=q);let K=q[z];K===void 0&&(K=M.clone(),q[z]=K,R.addEventListener("dispose",O)),M=K}if(M.visible=R.visible,M.wireframe=R.wireframe,E===yn?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:h[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,N.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const X=i.properties.get(M);X.light=N}return M}function T(C,R,N,E,M){if(C.visible===!1)return;if(C.layers.test(R.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&M===yn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,C.matrixWorld);const z=e.update(C),q=C.material;if(Array.isArray(q)){const K=z.groups;for(let V=0,Q=K.length;V<Q;V++){const W=K[V],ce=q[W.materialIndex];if(ce&&ce.visible){const he=y(C,ce,E,M);C.onBeforeShadow(i,C,R,N,z,he,W),i.renderBufferDirect(N,null,z,he,C,W),C.onAfterShadow(i,C,R,N,z,he,W)}}}else if(q.visible){const K=y(C,q,E,M);C.onBeforeShadow(i,C,R,N,z,K,null),i.renderBufferDirect(N,null,z,K,C,null),C.onAfterShadow(i,C,R,N,z,K,null)}}const X=C.children;for(let z=0,q=X.length;z<q;z++)T(X[z],R,N,E,M)}function O(C){C.target.removeEventListener("dispose",O);for(const N in l){const E=l[N],M=C.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}function m0(i){function e(){let _=!1;const H=new ut;let U=null;const G=new ut(0,0,0,0);return{setMask:function($){U!==$&&!_&&(i.colorMask($,$,$,$),U=$)},setLocked:function($){_=$},setClear:function($,_e,be,mt,Mt){Mt===!0&&($*=mt,_e*=mt,be*=mt),H.set($,_e,be,mt),G.equals(H)===!1&&(i.clearColor($,_e,be,mt),G.copy(H))},reset:function(){_=!1,U=null,G.set(-1,0,0,0)}}}function t(){let _=!1,H=null,U=null,G=null;return{setTest:function($){$?de(i.DEPTH_TEST):ae(i.DEPTH_TEST)},setMask:function($){H!==$&&!_&&(i.depthMask($),H=$)},setFunc:function($){if(U!==$){switch($){case vd:i.depthFunc(i.NEVER);break;case xd:i.depthFunc(i.ALWAYS);break;case Sd:i.depthFunc(i.LESS);break;case Ps:i.depthFunc(i.LEQUAL);break;case Md:i.depthFunc(i.EQUAL);break;case yd:i.depthFunc(i.GEQUAL);break;case Ed:i.depthFunc(i.GREATER);break;case wd:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}U=$}},setLocked:function($){_=$},setClear:function($){G!==$&&(i.clearDepth($),G=$)},reset:function(){_=!1,H=null,U=null,G=null}}}function n(){let _=!1,H=null,U=null,G=null,$=null,_e=null,be=null,mt=null,Mt=null;return{setTest:function(Ye){_||(Ye?de(i.STENCIL_TEST):ae(i.STENCIL_TEST))},setMask:function(Ye){H!==Ye&&!_&&(i.stencilMask(Ye),H=Ye)},setFunc:function(Ye,yt,Et){(U!==Ye||G!==yt||$!==Et)&&(i.stencilFunc(Ye,yt,Et),U=Ye,G=yt,$=Et)},setOp:function(Ye,yt,Et){(_e!==Ye||be!==yt||mt!==Et)&&(i.stencilOp(Ye,yt,Et),_e=Ye,be=yt,mt=Et)},setLocked:function(Ye){_=Ye},setClear:function(Ye){Mt!==Ye&&(i.clearStencil(Ye),Mt=Ye)},reset:function(){_=!1,H=null,U=null,G=null,$=null,_e=null,be=null,mt=null,Mt=null}}}const r=new e,s=new t,a=new n,o=new WeakMap,c=new WeakMap;let l={},u={},h=new WeakMap,d=[],m=null,g=!1,v=null,p=null,f=null,w=null,y=null,T=null,O=null,C=new Ke(0,0,0),R=0,N=!1,E=null,M=null,L=null,X=null,z=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,V=0;const Q=i.getParameter(i.VERSION);Q.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(Q)[1]),K=V>=1):Q.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),K=V>=2);let W=null,ce={};const he=i.getParameter(i.SCISSOR_BOX),le=i.getParameter(i.VIEWPORT),Te=new ut().fromArray(he),ke=new ut().fromArray(le);function Y(_,H,U,G){const $=new Uint8Array(4),_e=i.createTexture();i.bindTexture(_,_e),i.texParameteri(_,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(_,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let be=0;be<U;be++)_===i.TEXTURE_3D||_===i.TEXTURE_2D_ARRAY?i.texImage3D(H,0,i.RGBA,1,1,G,0,i.RGBA,i.UNSIGNED_BYTE,$):i.texImage2D(H+be,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,$);return _e}const ee={};ee[i.TEXTURE_2D]=Y(i.TEXTURE_2D,i.TEXTURE_2D,1),ee[i.TEXTURE_CUBE_MAP]=Y(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[i.TEXTURE_2D_ARRAY]=Y(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ee[i.TEXTURE_3D]=Y(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),de(i.DEPTH_TEST),s.setFunc(Ps),xe(!1),We(nc),de(i.CULL_FACE),Be(zn);function de(_){l[_]!==!0&&(i.enable(_),l[_]=!0)}function ae(_){l[_]!==!1&&(i.disable(_),l[_]=!1)}function Ie(_,H){return u[_]!==H?(i.bindFramebuffer(_,H),u[_]=H,_===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=H),_===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=H),!0):!1}function Ae(_,H){let U=d,G=!1;if(_){U=h.get(H),U===void 0&&(U=[],h.set(H,U));const $=_.textures;if(U.length!==$.length||U[0]!==i.COLOR_ATTACHMENT0){for(let _e=0,be=$.length;_e<be;_e++)U[_e]=i.COLOR_ATTACHMENT0+_e;U.length=$.length,G=!0}}else U[0]!==i.BACK&&(U[0]=i.BACK,G=!0);G&&i.drawBuffers(U)}function He(_){return m!==_?(i.useProgram(_),m=_,!0):!1}const P={[pi]:i.FUNC_ADD,[td]:i.FUNC_SUBTRACT,[nd]:i.FUNC_REVERSE_SUBTRACT};P[id]=i.MIN,P[rd]=i.MAX;const Ge={[sd]:i.ZERO,[ad]:i.ONE,[od]:i.SRC_COLOR,[ja]:i.SRC_ALPHA,[fd]:i.SRC_ALPHA_SATURATE,[hd]:i.DST_COLOR,[ld]:i.DST_ALPHA,[cd]:i.ONE_MINUS_SRC_COLOR,[$a]:i.ONE_MINUS_SRC_ALPHA,[dd]:i.ONE_MINUS_DST_COLOR,[ud]:i.ONE_MINUS_DST_ALPHA,[pd]:i.CONSTANT_COLOR,[md]:i.ONE_MINUS_CONSTANT_COLOR,[gd]:i.CONSTANT_ALPHA,[_d]:i.ONE_MINUS_CONSTANT_ALPHA};function Be(_,H,U,G,$,_e,be,mt,Mt,Ye){if(_===zn){g===!0&&(ae(i.BLEND),g=!1);return}if(g===!1&&(de(i.BLEND),g=!0),_!==ed){if(_!==v||Ye!==N){if((p!==pi||y!==pi)&&(i.blendEquation(i.FUNC_ADD),p=pi,y=pi),Ye)switch(_){case sr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ic:i.blendFunc(i.ONE,i.ONE);break;case rc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case sc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",_);break}else switch(_){case sr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ic:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case rc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case sc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",_);break}f=null,w=null,T=null,O=null,C.set(0,0,0),R=0,v=_,N=Ye}return}$=$||H,_e=_e||U,be=be||G,(H!==p||$!==y)&&(i.blendEquationSeparate(P[H],P[$]),p=H,y=$),(U!==f||G!==w||_e!==T||be!==O)&&(i.blendFuncSeparate(Ge[U],Ge[G],Ge[_e],Ge[be]),f=U,w=G,T=_e,O=be),(mt.equals(C)===!1||Mt!==R)&&(i.blendColor(mt.r,mt.g,mt.b,Mt),C.copy(mt),R=Mt),v=_,N=!1}function at(_,H){_.side===En?ae(i.CULL_FACE):de(i.CULL_FACE);let U=_.side===Ht;H&&(U=!U),xe(U),_.blending===sr&&_.transparent===!1?Be(zn):Be(_.blending,_.blendEquation,_.blendSrc,_.blendDst,_.blendEquationAlpha,_.blendSrcAlpha,_.blendDstAlpha,_.blendColor,_.blendAlpha,_.premultipliedAlpha),s.setFunc(_.depthFunc),s.setTest(_.depthTest),s.setMask(_.depthWrite),r.setMask(_.colorWrite);const G=_.stencilWrite;a.setTest(G),G&&(a.setMask(_.stencilWriteMask),a.setFunc(_.stencilFunc,_.stencilRef,_.stencilFuncMask),a.setOp(_.stencilFail,_.stencilZFail,_.stencilZPass)),Re(_.polygonOffset,_.polygonOffsetFactor,_.polygonOffsetUnits),_.alphaToCoverage===!0?de(i.SAMPLE_ALPHA_TO_COVERAGE):ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function xe(_){E!==_&&(_?i.frontFace(i.CW):i.frontFace(i.CCW),E=_)}function We(_){_!==Zh?(de(i.CULL_FACE),_!==M&&(_===nc?i.cullFace(i.BACK):_===Jh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ae(i.CULL_FACE),M=_}function Fe(_){_!==L&&(K&&i.lineWidth(_),L=_)}function Re(_,H,U){_?(de(i.POLYGON_OFFSET_FILL),(X!==H||z!==U)&&(i.polygonOffset(H,U),X=H,z=U)):ae(i.POLYGON_OFFSET_FILL)}function ht(_){_?de(i.SCISSOR_TEST):ae(i.SCISSOR_TEST)}function b(_){_===void 0&&(_=i.TEXTURE0+q-1),W!==_&&(i.activeTexture(_),W=_)}function x(_,H,U){U===void 0&&(W===null?U=i.TEXTURE0+q-1:U=W);let G=ce[U];G===void 0&&(G={type:void 0,texture:void 0},ce[U]=G),(G.type!==_||G.texture!==H)&&(W!==U&&(i.activeTexture(U),W=U),i.bindTexture(_,H||ee[_]),G.type=_,G.texture=H)}function k(){const _=ce[W];_!==void 0&&_.type!==void 0&&(i.bindTexture(_.type,null),_.type=void 0,_.texture=void 0)}function j(){try{i.compressedTexImage2D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function Z(){try{i.compressedTexImage3D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function J(){try{i.texSubImage2D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function ge(){try{i.texSubImage3D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function re(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function ie(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function Ce(){try{i.texStorage2D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function te(){try{i.texStorage3D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function pe(){try{i.texImage2D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function Oe(){try{i.texImage3D.apply(i,arguments)}catch(_){console.error("THREE.WebGLState:",_)}}function Me(_){Te.equals(_)===!1&&(i.scissor(_.x,_.y,_.z,_.w),Te.copy(_))}function oe(_){ke.equals(_)===!1&&(i.viewport(_.x,_.y,_.z,_.w),ke.copy(_))}function Pe(_,H){let U=c.get(H);U===void 0&&(U=new WeakMap,c.set(H,U));let G=U.get(_);G===void 0&&(G=i.getUniformBlockIndex(H,_.name),U.set(_,G))}function Le(_,H){const G=c.get(H).get(_);o.get(H)!==G&&(i.uniformBlockBinding(H,G,_.__bindingPointIndex),o.set(H,G))}function pt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},W=null,ce={},u={},h=new WeakMap,d=[],m=null,g=!1,v=null,p=null,f=null,w=null,y=null,T=null,O=null,C=new Ke(0,0,0),R=0,N=!1,E=null,M=null,L=null,X=null,z=null,Te.set(0,0,i.canvas.width,i.canvas.height),ke.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:de,disable:ae,bindFramebuffer:Ie,drawBuffers:Ae,useProgram:He,setBlending:Be,setMaterial:at,setFlipSided:xe,setCullFace:We,setLineWidth:Fe,setPolygonOffset:Re,setScissorTest:ht,activeTexture:b,bindTexture:x,unbindTexture:k,compressedTexImage2D:j,compressedTexImage3D:Z,texImage2D:pe,texImage3D:Oe,updateUBOMapping:Pe,uniformBlockBinding:Le,texStorage2D:Ce,texStorage3D:te,texSubImage2D:J,texSubImage3D:ge,compressedTexSubImage2D:re,compressedTexSubImage3D:ie,scissor:Me,viewport:oe,reset:pt}}function g0(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new we,u=new WeakMap;let h;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,x){return m?new OffscreenCanvas(b,x):Fs("canvas")}function v(b,x,k){let j=1;const Z=ht(b);if((Z.width>k||Z.height>k)&&(j=k/Math.max(Z.width,Z.height)),j<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const J=Math.floor(j*Z.width),ge=Math.floor(j*Z.height);h===void 0&&(h=g(J,ge));const re=x?g(J,ge):h;return re.width=J,re.height=ge,re.getContext("2d").drawImage(b,0,0,J,ge),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+J+"x"+ge+")."),re}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),b;return b}function p(b){return b.generateMipmaps&&b.minFilter!==en&&b.minFilter!==an}function f(b){i.generateMipmap(b)}function w(b,x,k,j,Z=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let J=x;if(x===i.RED&&(k===i.FLOAT&&(J=i.R32F),k===i.HALF_FLOAT&&(J=i.R16F),k===i.UNSIGNED_BYTE&&(J=i.R8)),x===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.R8UI),k===i.UNSIGNED_SHORT&&(J=i.R16UI),k===i.UNSIGNED_INT&&(J=i.R32UI),k===i.BYTE&&(J=i.R8I),k===i.SHORT&&(J=i.R16I),k===i.INT&&(J=i.R32I)),x===i.RG&&(k===i.FLOAT&&(J=i.RG32F),k===i.HALF_FLOAT&&(J=i.RG16F),k===i.UNSIGNED_BYTE&&(J=i.RG8)),x===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RG8UI),k===i.UNSIGNED_SHORT&&(J=i.RG16UI),k===i.UNSIGNED_INT&&(J=i.RG32UI),k===i.BYTE&&(J=i.RG8I),k===i.SHORT&&(J=i.RG16I),k===i.INT&&(J=i.RG32I)),x===i.RGB&&k===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),x===i.RGBA){const ge=Z?Ds:Qe.getTransfer(j);k===i.FLOAT&&(J=i.RGBA32F),k===i.HALF_FLOAT&&(J=i.RGBA16F),k===i.UNSIGNED_BYTE&&(J=ge===ct?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function y(b,x){let k;return b?x===null||x===hr||x===dr?k=i.DEPTH24_STENCIL8:x===On?k=i.DEPTH32F_STENCIL8:x===Ls&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===hr||x===dr?k=i.DEPTH_COMPONENT24:x===On?k=i.DEPTH_COMPONENT32F:x===Ls&&(k=i.DEPTH_COMPONENT16),k}function T(b,x){return p(b)===!0||b.isFramebufferTexture&&b.minFilter!==en&&b.minFilter!==an?Math.log2(Math.max(x.width,x.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?x.mipmaps.length:1}function O(b){const x=b.target;x.removeEventListener("dispose",O),R(x),x.isVideoTexture&&u.delete(x)}function C(b){const x=b.target;x.removeEventListener("dispose",C),E(x)}function R(b){const x=n.get(b);if(x.__webglInit===void 0)return;const k=b.source,j=d.get(k);if(j){const Z=j[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&N(b),Object.keys(j).length===0&&d.delete(k)}n.remove(b)}function N(b){const x=n.get(b);i.deleteTexture(x.__webglTexture);const k=b.source,j=d.get(k);delete j[x.__cacheKey],a.memory.textures--}function E(b){const x=n.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(x.__webglFramebuffer[j]))for(let Z=0;Z<x.__webglFramebuffer[j].length;Z++)i.deleteFramebuffer(x.__webglFramebuffer[j][Z]);else i.deleteFramebuffer(x.__webglFramebuffer[j]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[j])}else{if(Array.isArray(x.__webglFramebuffer))for(let j=0;j<x.__webglFramebuffer.length;j++)i.deleteFramebuffer(x.__webglFramebuffer[j]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let j=0;j<x.__webglColorRenderbuffer.length;j++)x.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[j]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const k=b.textures;for(let j=0,Z=k.length;j<Z;j++){const J=n.get(k[j]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),a.memory.textures--),n.remove(k[j])}n.remove(b)}let M=0;function L(){M=0}function X(){const b=M;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),M+=1,b}function z(b){const x=[];return x.push(b.wrapS),x.push(b.wrapT),x.push(b.wrapR||0),x.push(b.magFilter),x.push(b.minFilter),x.push(b.anisotropy),x.push(b.internalFormat),x.push(b.format),x.push(b.type),x.push(b.generateMipmaps),x.push(b.premultiplyAlpha),x.push(b.flipY),x.push(b.unpackAlignment),x.push(b.colorSpace),x.join()}function q(b,x){const k=n.get(b);if(b.isVideoTexture&&Fe(b),b.isRenderTargetTexture===!1&&b.version>0&&k.__version!==b.version){const j=b.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ke(k,b,x);return}}t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+x)}function K(b,x){const k=n.get(b);if(b.version>0&&k.__version!==b.version){ke(k,b,x);return}t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+x)}function V(b,x){const k=n.get(b);if(b.version>0&&k.__version!==b.version){ke(k,b,x);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+x)}function Q(b,x){const k=n.get(b);if(b.version>0&&k.__version!==b.version){Y(k,b,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+x)}const W={[Qa]:i.REPEAT,[_i]:i.CLAMP_TO_EDGE,[eo]:i.MIRRORED_REPEAT},ce={[en]:i.NEAREST,[Ud]:i.NEAREST_MIPMAP_NEAREST,[$r]:i.NEAREST_MIPMAP_LINEAR,[an]:i.LINEAR,[fa]:i.LINEAR_MIPMAP_NEAREST,[vi]:i.LINEAR_MIPMAP_LINEAR},he={[jd]:i.NEVER,[tf]:i.ALWAYS,[$d]:i.LESS,[eu]:i.LEQUAL,[Zd]:i.EQUAL,[ef]:i.GEQUAL,[Jd]:i.GREATER,[Qd]:i.NOTEQUAL};function le(b,x){if(x.type===On&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===an||x.magFilter===fa||x.magFilter===$r||x.magFilter===vi||x.minFilter===an||x.minFilter===fa||x.minFilter===$r||x.minFilter===vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,W[x.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,W[x.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,W[x.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,ce[x.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,ce[x.minFilter]),x.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,he[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===en||x.minFilter!==$r&&x.minFilter!==vi||x.type===On&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(b,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Te(b,x){let k=!1;b.__webglInit===void 0&&(b.__webglInit=!0,x.addEventListener("dispose",O));const j=x.source;let Z=d.get(j);Z===void 0&&(Z={},d.set(j,Z));const J=z(x);if(J!==b.__cacheKey){Z[J]===void 0&&(Z[J]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,k=!0),Z[J].usedTimes++;const ge=Z[b.__cacheKey];ge!==void 0&&(Z[b.__cacheKey].usedTimes--,ge.usedTimes===0&&N(x)),b.__cacheKey=J,b.__webglTexture=Z[J].texture}return k}function ke(b,x,k){let j=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(j=i.TEXTURE_3D);const Z=Te(b,x),J=x.source;t.bindTexture(j,b.__webglTexture,i.TEXTURE0+k);const ge=n.get(J);if(J.version!==ge.__version||Z===!0){t.activeTexture(i.TEXTURE0+k);const re=Qe.getPrimaries(Qe.workingColorSpace),ie=x.colorSpace===Fn?null:Qe.getPrimaries(x.colorSpace),Ce=x.colorSpace===Fn||re===ie?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let te=v(x.image,!1,r.maxTextureSize);te=Re(x,te);const pe=s.convert(x.format,x.colorSpace),Oe=s.convert(x.type);let Me=w(x.internalFormat,pe,Oe,x.colorSpace,x.isVideoTexture);le(j,x);let oe;const Pe=x.mipmaps,Le=x.isVideoTexture!==!0,pt=ge.__version===void 0||Z===!0,_=J.dataReady,H=T(x,te);if(x.isDepthTexture)Me=y(x.format===fr,x.type),pt&&(Le?t.texStorage2D(i.TEXTURE_2D,1,Me,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Me,te.width,te.height,0,pe,Oe,null));else if(x.isDataTexture)if(Pe.length>0){Le&&pt&&t.texStorage2D(i.TEXTURE_2D,H,Me,Pe[0].width,Pe[0].height);for(let U=0,G=Pe.length;U<G;U++)oe=Pe[U],Le?_&&t.texSubImage2D(i.TEXTURE_2D,U,0,0,oe.width,oe.height,pe,Oe,oe.data):t.texImage2D(i.TEXTURE_2D,U,Me,oe.width,oe.height,0,pe,Oe,oe.data);x.generateMipmaps=!1}else Le?(pt&&t.texStorage2D(i.TEXTURE_2D,H,Me,te.width,te.height),_&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,te.width,te.height,pe,Oe,te.data)):t.texImage2D(i.TEXTURE_2D,0,Me,te.width,te.height,0,pe,Oe,te.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Le&&pt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,H,Me,Pe[0].width,Pe[0].height,te.depth);for(let U=0,G=Pe.length;U<G;U++)if(oe=Pe[U],x.format!==hn)if(pe!==null)if(Le){if(_)if(x.layerUpdates.size>0){for(const $ of x.layerUpdates){const _e=oe.width*oe.height;t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,U,0,0,$,oe.width,oe.height,1,pe,oe.data.slice(_e*$,_e*($+1)),0,0)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,U,0,0,0,oe.width,oe.height,te.depth,pe,oe.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,U,Me,oe.width,oe.height,te.depth,0,oe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Le?_&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,U,0,0,0,oe.width,oe.height,te.depth,pe,Oe,oe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,U,Me,oe.width,oe.height,te.depth,0,pe,Oe,oe.data)}else{Le&&pt&&t.texStorage2D(i.TEXTURE_2D,H,Me,Pe[0].width,Pe[0].height);for(let U=0,G=Pe.length;U<G;U++)oe=Pe[U],x.format!==hn?pe!==null?Le?_&&t.compressedTexSubImage2D(i.TEXTURE_2D,U,0,0,oe.width,oe.height,pe,oe.data):t.compressedTexImage2D(i.TEXTURE_2D,U,Me,oe.width,oe.height,0,oe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Le?_&&t.texSubImage2D(i.TEXTURE_2D,U,0,0,oe.width,oe.height,pe,Oe,oe.data):t.texImage2D(i.TEXTURE_2D,U,Me,oe.width,oe.height,0,pe,Oe,oe.data)}else if(x.isDataArrayTexture)if(Le){if(pt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,H,Me,te.width,te.height,te.depth),_)if(x.layerUpdates.size>0){let U;switch(Oe){case i.UNSIGNED_BYTE:switch(pe){case i.ALPHA:U=1;break;case i.LUMINANCE:U=1;break;case i.LUMINANCE_ALPHA:U=2;break;case i.RGB:U=3;break;case i.RGBA:U=4;break;default:throw new Error(`Unknown texel size for format ${pe}.`)}break;case i.UNSIGNED_SHORT_4_4_4_4:case i.UNSIGNED_SHORT_5_5_5_1:case i.UNSIGNED_SHORT_5_6_5:U=1;break;default:throw new Error(`Unknown texel size for type ${Oe}.`)}const G=te.width*te.height*U;for(const $ of x.layerUpdates)t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,te.width,te.height,1,pe,Oe,te.data.slice(G*$,G*($+1)));x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,pe,Oe,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Me,te.width,te.height,te.depth,0,pe,Oe,te.data);else if(x.isData3DTexture)Le?(pt&&t.texStorage3D(i.TEXTURE_3D,H,Me,te.width,te.height,te.depth),_&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,pe,Oe,te.data)):t.texImage3D(i.TEXTURE_3D,0,Me,te.width,te.height,te.depth,0,pe,Oe,te.data);else if(x.isFramebufferTexture){if(pt)if(Le)t.texStorage2D(i.TEXTURE_2D,H,Me,te.width,te.height);else{let U=te.width,G=te.height;for(let $=0;$<H;$++)t.texImage2D(i.TEXTURE_2D,$,Me,U,G,0,pe,Oe,null),U>>=1,G>>=1}}else if(Pe.length>0){if(Le&&pt){const U=ht(Pe[0]);t.texStorage2D(i.TEXTURE_2D,H,Me,U.width,U.height)}for(let U=0,G=Pe.length;U<G;U++)oe=Pe[U],Le?_&&t.texSubImage2D(i.TEXTURE_2D,U,0,0,pe,Oe,oe):t.texImage2D(i.TEXTURE_2D,U,Me,pe,Oe,oe);x.generateMipmaps=!1}else if(Le){if(pt){const U=ht(te);t.texStorage2D(i.TEXTURE_2D,H,Me,U.width,U.height)}_&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,Oe,te)}else t.texImage2D(i.TEXTURE_2D,0,Me,pe,Oe,te);p(x)&&f(j),ge.__version=J.version,x.onUpdate&&x.onUpdate(x)}b.__version=x.version}function Y(b,x,k){if(x.image.length!==6)return;const j=Te(b,x),Z=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+k);const J=n.get(Z);if(Z.version!==J.__version||j===!0){t.activeTexture(i.TEXTURE0+k);const ge=Qe.getPrimaries(Qe.workingColorSpace),re=x.colorSpace===Fn?null:Qe.getPrimaries(x.colorSpace),ie=x.colorSpace===Fn||ge===re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);const Ce=x.isCompressedTexture||x.image[0].isCompressedTexture,te=x.image[0]&&x.image[0].isDataTexture,pe=[];for(let G=0;G<6;G++)!Ce&&!te?pe[G]=v(x.image[G],!0,r.maxCubemapSize):pe[G]=te?x.image[G].image:x.image[G],pe[G]=Re(x,pe[G]);const Oe=pe[0],Me=s.convert(x.format,x.colorSpace),oe=s.convert(x.type),Pe=w(x.internalFormat,Me,oe,x.colorSpace),Le=x.isVideoTexture!==!0,pt=J.__version===void 0||j===!0,_=Z.dataReady;let H=T(x,Oe);le(i.TEXTURE_CUBE_MAP,x);let U;if(Ce){Le&&pt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,H,Pe,Oe.width,Oe.height);for(let G=0;G<6;G++){U=pe[G].mipmaps;for(let $=0;$<U.length;$++){const _e=U[$];x.format!==hn?Me!==null?Le?_&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,$,0,0,_e.width,_e.height,Me,_e.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,$,Pe,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Le?_&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,$,0,0,_e.width,_e.height,Me,oe,_e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,$,Pe,_e.width,_e.height,0,Me,oe,_e.data)}}}else{if(U=x.mipmaps,Le&&pt){U.length>0&&H++;const G=ht(pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,H,Pe,G.width,G.height)}for(let G=0;G<6;G++)if(te){Le?_&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,0,0,pe[G].width,pe[G].height,Me,oe,pe[G].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,Pe,pe[G].width,pe[G].height,0,Me,oe,pe[G].data);for(let $=0;$<U.length;$++){const be=U[$].image[G].image;Le?_&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,$+1,0,0,be.width,be.height,Me,oe,be.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,$+1,Pe,be.width,be.height,0,Me,oe,be.data)}}else{Le?_&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,0,0,Me,oe,pe[G]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,Pe,Me,oe,pe[G]);for(let $=0;$<U.length;$++){const _e=U[$];Le?_&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,$+1,0,0,Me,oe,_e.image[G]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+G,$+1,Pe,Me,oe,_e.image[G])}}}p(x)&&f(i.TEXTURE_CUBE_MAP),J.__version=Z.version,x.onUpdate&&x.onUpdate(x)}b.__version=x.version}function ee(b,x,k,j,Z,J){const ge=s.convert(k.format,k.colorSpace),re=s.convert(k.type),ie=w(k.internalFormat,ge,re,k.colorSpace);if(!n.get(x).__hasExternalTextures){const te=Math.max(1,x.width>>J),pe=Math.max(1,x.height>>J);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?t.texImage3D(Z,J,ie,te,pe,x.depth,0,ge,re,null):t.texImage2D(Z,J,ie,te,pe,0,ge,re,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),We(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,Z,n.get(k).__webglTexture,0,xe(x)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,Z,n.get(k).__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function de(b,x,k){if(i.bindRenderbuffer(i.RENDERBUFFER,b),x.depthBuffer){const j=x.depthTexture,Z=j&&j.isDepthTexture?j.type:null,J=y(x.stencilBuffer,Z),ge=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=xe(x);We(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,re,J,x.width,x.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,re,J,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,J,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ge,i.RENDERBUFFER,b)}else{const j=x.textures;for(let Z=0;Z<j.length;Z++){const J=j[Z],ge=s.convert(J.format,J.colorSpace),re=s.convert(J.type),ie=w(J.internalFormat,ge,re,J.colorSpace),Ce=xe(x);k&&We(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,ie,x.width,x.height):We(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ce,ie,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ie,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ae(b,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,b),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),q(x.depthTexture,0);const j=n.get(x.depthTexture).__webglTexture,Z=xe(x);if(x.depthTexture.format===ar)We(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(x.depthTexture.format===fr)We(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Ie(b){const x=n.get(b),k=b.isWebGLCubeRenderTarget===!0;if(b.depthTexture&&!x.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");ae(x.__webglFramebuffer,b)}else if(k){x.__webglDepthbuffer=[];for(let j=0;j<6;j++)t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[j]),x.__webglDepthbuffer[j]=i.createRenderbuffer(),de(x.__webglDepthbuffer[j],b,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=i.createRenderbuffer(),de(x.__webglDepthbuffer,b,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ae(b,x,k){const j=n.get(b);x!==void 0&&ee(j.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Ie(b)}function He(b){const x=b.texture,k=n.get(b),j=n.get(x);b.addEventListener("dispose",C);const Z=b.textures,J=b.isWebGLCubeRenderTarget===!0,ge=Z.length>1;if(ge||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=x.version,a.memory.textures++),J){k.__webglFramebuffer=[];for(let re=0;re<6;re++)if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer[re]=[];for(let ie=0;ie<x.mipmaps.length;ie++)k.__webglFramebuffer[re][ie]=i.createFramebuffer()}else k.__webglFramebuffer[re]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer=[];for(let re=0;re<x.mipmaps.length;re++)k.__webglFramebuffer[re]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(ge)for(let re=0,ie=Z.length;re<ie;re++){const Ce=n.get(Z[re]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=i.createTexture(),a.memory.textures++)}if(b.samples>0&&We(b)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let re=0;re<Z.length;re++){const ie=Z[re];k.__webglColorRenderbuffer[re]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[re]);const Ce=s.convert(ie.format,ie.colorSpace),te=s.convert(ie.type),pe=w(ie.internalFormat,Ce,te,ie.colorSpace,b.isXRRenderTarget===!0),Oe=xe(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe,pe,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.RENDERBUFFER,k.__webglColorRenderbuffer[re])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),de(k.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),le(i.TEXTURE_CUBE_MAP,x);for(let re=0;re<6;re++)if(x.mipmaps&&x.mipmaps.length>0)for(let ie=0;ie<x.mipmaps.length;ie++)ee(k.__webglFramebuffer[re][ie],b,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ie);else ee(k.__webglFramebuffer[re],b,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);p(x)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ge){for(let re=0,ie=Z.length;re<ie;re++){const Ce=Z[re],te=n.get(Ce);t.bindTexture(i.TEXTURE_2D,te.__webglTexture),le(i.TEXTURE_2D,Ce),ee(k.__webglFramebuffer,b,Ce,i.COLOR_ATTACHMENT0+re,i.TEXTURE_2D,0),p(Ce)&&f(i.TEXTURE_2D)}t.unbindTexture()}else{let re=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(re=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(re,j.__webglTexture),le(re,x),x.mipmaps&&x.mipmaps.length>0)for(let ie=0;ie<x.mipmaps.length;ie++)ee(k.__webglFramebuffer[ie],b,x,i.COLOR_ATTACHMENT0,re,ie);else ee(k.__webglFramebuffer,b,x,i.COLOR_ATTACHMENT0,re,0);p(x)&&f(re),t.unbindTexture()}b.depthBuffer&&Ie(b)}function P(b){const x=b.textures;for(let k=0,j=x.length;k<j;k++){const Z=x[k];if(p(Z)){const J=b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ge=n.get(Z).__webglTexture;t.bindTexture(J,ge),f(J),t.unbindTexture()}}}const Ge=[],Be=[];function at(b){if(b.samples>0){if(We(b)===!1){const x=b.textures,k=b.width,j=b.height;let Z=i.COLOR_BUFFER_BIT;const J=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=n.get(b),re=x.length>1;if(re)for(let ie=0;ie<x.length;ie++)t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let ie=0;ie<x.length;ie++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),re){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ge.__webglColorRenderbuffer[ie]);const Ce=n.get(x[ie]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ce,0)}i.blitFramebuffer(0,0,k,j,0,0,k,j,Z,i.NEAREST),c===!0&&(Ge.length=0,Be.length=0,Ge.push(i.COLOR_ATTACHMENT0+ie),b.depthBuffer&&b.resolveDepthBuffer===!1&&(Ge.push(J),Be.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Be)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ge))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),re)for(let ie=0;ie<x.length;ie++){t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.RENDERBUFFER,ge.__webglColorRenderbuffer[ie]);const Ce=n.get(x[ie]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ge.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ie,i.TEXTURE_2D,Ce,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&c){const x=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function xe(b){return Math.min(r.maxSamples,b.samples)}function We(b){const x=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Fe(b){const x=a.render.frame;u.get(b)!==x&&(u.set(b,x),b.update())}function Re(b,x){const k=b.colorSpace,j=b.format,Z=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||k!==Qn&&k!==Fn&&(Qe.getTransfer(k)===ct?(j!==hn||Z!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),x}function ht(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(l.width=b.naturalWidth||b.width,l.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(l.width=b.displayWidth,l.height=b.displayHeight):(l.width=b.width,l.height=b.height),l}this.allocateTextureUnit=X,this.resetTextureUnits=L,this.setTexture2D=q,this.setTexture2DArray=K,this.setTexture3D=V,this.setTextureCube=Q,this.rebindTextures=Ae,this.setupRenderTarget=He,this.updateRenderTargetMipmap=P,this.updateMultisampleRenderTarget=at,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=We}function _0(i,e){function t(n,r=Fn){let s;const a=Qe.getTransfer(r);if(n===qn)return i.UNSIGNED_BYTE;if(n===jl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===$l)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Od)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Nd)return i.BYTE;if(n===Fd)return i.SHORT;if(n===Ls)return i.UNSIGNED_SHORT;if(n===Kl)return i.INT;if(n===hr)return i.UNSIGNED_INT;if(n===On)return i.FLOAT;if(n===qs)return i.HALF_FLOAT;if(n===Bd)return i.ALPHA;if(n===zd)return i.RGB;if(n===hn)return i.RGBA;if(n===kd)return i.LUMINANCE;if(n===Hd)return i.LUMINANCE_ALPHA;if(n===ar)return i.DEPTH_COMPONENT;if(n===fr)return i.DEPTH_STENCIL;if(n===Gd)return i.RED;if(n===Zl)return i.RED_INTEGER;if(n===Vd)return i.RG;if(n===Jl)return i.RG_INTEGER;if(n===Ql)return i.RGBA_INTEGER;if(n===pa||n===ma||n===ga||n===_a)if(a===ct)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===pa)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ma)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ga)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_a)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===pa)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ma)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ga)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_a)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ac||n===oc||n===cc||n===lc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===ac)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===oc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===cc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===lc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===uc||n===hc||n===dc)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===uc||n===hc)return a===ct?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===dc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===fc||n===pc||n===mc||n===gc||n===_c||n===vc||n===xc||n===Sc||n===Mc||n===yc||n===Ec||n===wc||n===bc||n===Tc)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===fc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===pc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===mc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===gc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===_c)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===vc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===xc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Sc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Mc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===yc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ec)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===wc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===bc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Tc)return a===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===va||n===Ac||n===Rc)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===va)return a===ct?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ac)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Rc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Wd||n===Cc||n===Pc||n===Lc)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===va)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Cc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Pc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Lc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===dr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class v0 extends Kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class xi extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const x0={type:"move"};class Va{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),f=this._getHandJoint(l,v);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),m=.02,g=.005;l.inputState.pinching&&d>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(x0)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new xi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const S0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,M0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class y0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new Bt,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Yn({vertexShader:S0,fragmentShader:M0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new kt(new Ii(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class E0 extends Pi{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,h=null,d=null,m=null,g=null;const v=new y0,p=t.getContextAttributes();let f=null,w=null;const y=[],T=[],O=new we;let C=null;const R=new Kt;R.layers.enable(1),R.viewport=new ut;const N=new Kt;N.layers.enable(2),N.viewport=new ut;const E=[R,N],M=new v0;M.layers.enable(1),M.layers.enable(2);let L=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ee=y[Y];return ee===void 0&&(ee=new Va,y[Y]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(Y){let ee=y[Y];return ee===void 0&&(ee=new Va,y[Y]=ee),ee.getGripSpace()},this.getHand=function(Y){let ee=y[Y];return ee===void 0&&(ee=new Va,y[Y]=ee),ee.getHandSpace()};function z(Y){const ee=T.indexOf(Y.inputSource);if(ee===-1)return;const de=y[ee];de!==void 0&&(de.update(Y.inputSource,Y.frame,l||a),de.dispatchEvent({type:Y.type,data:Y.inputSource}))}function q(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",q),r.removeEventListener("inputsourceschange",K);for(let Y=0;Y<y.length;Y++){const ee=T[Y];ee!==null&&(T[Y]=null,y[Y].disconnect(ee))}L=null,X=null,v.reset(),e.setRenderTarget(f),m=null,d=null,h=null,r=null,w=null,ke.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(O.width,O.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",q),r.addEventListener("inputsourceschange",K),p.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(O),r.renderState.layers===void 0){const ee={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,ee),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),w=new Ti(m.framebufferWidth,m.framebufferHeight,{format:hn,type:qn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let ee=null,de=null,ae=null;p.depth&&(ae=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=p.stencil?fr:ar,de=p.stencil?dr:hr);const Ie={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:s};h=new XRWebGLBinding(r,t),d=h.createProjectionLayer(Ie),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),w=new Ti(d.textureWidth,d.textureHeight,{format:hn,type:qn,depthTexture:new fu(d.textureWidth,d.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),ke.setContext(r),ke.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function K(Y){for(let ee=0;ee<Y.removed.length;ee++){const de=Y.removed[ee],ae=T.indexOf(de);ae>=0&&(T[ae]=null,y[ae].disconnect(de))}for(let ee=0;ee<Y.added.length;ee++){const de=Y.added[ee];let ae=T.indexOf(de);if(ae===-1){for(let Ae=0;Ae<y.length;Ae++)if(Ae>=T.length){T.push(de),ae=Ae;break}else if(T[Ae]===null){T[Ae]=de,ae=Ae;break}if(ae===-1)break}const Ie=y[ae];Ie&&Ie.connect(de)}}const V=new A,Q=new A;function W(Y,ee,de){V.setFromMatrixPosition(ee.matrixWorld),Q.setFromMatrixPosition(de.matrixWorld);const ae=V.distanceTo(Q),Ie=ee.projectionMatrix.elements,Ae=de.projectionMatrix.elements,He=Ie[14]/(Ie[10]-1),P=Ie[14]/(Ie[10]+1),Ge=(Ie[9]+1)/Ie[5],Be=(Ie[9]-1)/Ie[5],at=(Ie[8]-1)/Ie[0],xe=(Ae[8]+1)/Ae[0],We=He*at,Fe=He*xe,Re=ae/(-at+xe),ht=Re*-at;ee.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ht),Y.translateZ(Re),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert();const b=He+Re,x=P+Re,k=We-ht,j=Fe+(ae-ht),Z=Ge*P/x*b,J=Be*P/x*b;Y.projectionMatrix.makePerspective(k,j,Z,J,b,x),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}function ce(Y,ee){ee===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ee.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;v.texture!==null&&(Y.near=v.depthNear,Y.far=v.depthFar),M.near=N.near=R.near=Y.near,M.far=N.far=R.far=Y.far,(L!==M.near||X!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),L=M.near,X=M.far,R.near=L,R.far=X,N.near=L,N.far=X,R.updateProjectionMatrix(),N.updateProjectionMatrix(),Y.updateProjectionMatrix());const ee=Y.parent,de=M.cameras;ce(M,ee);for(let ae=0;ae<de.length;ae++)ce(de[ae],ee);de.length===2?W(M,R,N):M.projectionMatrix.copy(R.projectionMatrix),he(Y,M,ee)};function he(Y,ee,de){de===null?Y.matrix.copy(ee.matrixWorld):(Y.matrix.copy(de.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ee.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ee.projectionMatrix),Y.projectionMatrixInverse.copy(ee.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Gr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&m===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let le=null;function Te(Y,ee){if(u=ee.getViewerPose(l||a),g=ee,u!==null){const de=u.views;m!==null&&(e.setRenderTargetFramebuffer(w,m.framebuffer),e.setRenderTarget(w));let ae=!1;de.length!==M.cameras.length&&(M.cameras.length=0,ae=!0);for(let Ae=0;Ae<de.length;Ae++){const He=de[Ae];let P=null;if(m!==null)P=m.getViewport(He);else{const Be=h.getViewSubImage(d,He);P=Be.viewport,Ae===0&&(e.setRenderTargetTextures(w,Be.colorTexture,d.ignoreDepthValues?void 0:Be.depthStencilTexture),e.setRenderTarget(w))}let Ge=E[Ae];Ge===void 0&&(Ge=new Kt,Ge.layers.enable(Ae),Ge.viewport=new ut,E[Ae]=Ge),Ge.matrix.fromArray(He.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(He.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(P.x,P.y,P.width,P.height),Ae===0&&(M.matrix.copy(Ge.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ae===!0&&M.cameras.push(Ge)}const Ie=r.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")){const Ae=h.getDepthInformation(de[0]);Ae&&Ae.isValid&&Ae.texture&&v.init(e,Ae,r.renderState)}}for(let de=0;de<y.length;de++){const ae=T[de],Ie=y[de];ae!==null&&Ie!==void 0&&Ie.update(ae,ee,l||a)}le&&le(Y,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}const ke=new hu;ke.setAnimationLoop(Te),this.setAnimationLoop=function(Y){le=Y},this.dispose=function(){}}}const ui=new Ot,w0=new ft;function b0(i,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,cu(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function r(p,f,w,y,T){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(p,f):f.isMeshToonMaterial?(s(p,f),h(p,f)):f.isMeshPhongMaterial?(s(p,f),u(p,f)):f.isMeshStandardMaterial?(s(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,T)):f.isMeshMatcapMaterial?(s(p,f),g(p,f)):f.isMeshDepthMaterial?s(p,f):f.isMeshDistanceMaterial?(s(p,f),v(p,f)):f.isMeshNormalMaterial?s(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?c(p,f,w,y):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Ht&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Ht&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const w=e.get(f),y=w.envMap,T=w.envMapRotation;y&&(p.envMap.value=y,ui.copy(T),ui.x*=-1,ui.y*=-1,ui.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),p.envMapRotation.value.setFromMatrix4(w0.makeRotationFromEuler(ui)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,w,y){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*w,p.scale.value=y*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function u(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function h(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,w){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ht&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=w.texture,p.transmissionSamplerSize.value.set(w.width,w.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function v(p,f){const w=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(w.matrixWorld),p.nearDistance.value=w.shadow.camera.near,p.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function T0(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(w,y){const T=y.program;n.uniformBlockBinding(w,T)}function l(w,y){let T=r[w.id];T===void 0&&(g(w),T=u(w),r[w.id]=T,w.addEventListener("dispose",p));const O=y.program;n.updateUBOMapping(w,O);const C=e.render.frame;s[w.id]!==C&&(d(w),s[w.id]=C)}function u(w){const y=h();w.__bindingPointIndex=y;const T=i.createBuffer(),O=w.__size,C=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,O,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,T),T}function h(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const y=r[w.id],T=w.uniforms,O=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let C=0,R=T.length;C<R;C++){const N=Array.isArray(T[C])?T[C]:[T[C]];for(let E=0,M=N.length;E<M;E++){const L=N[E];if(m(L,C,E,O)===!0){const X=L.__offset,z=Array.isArray(L.value)?L.value:[L.value];let q=0;for(let K=0;K<z.length;K++){const V=z[K],Q=v(V);typeof V=="number"||typeof V=="boolean"?(L.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,X+q,L.__data)):V.isMatrix3?(L.__data[0]=V.elements[0],L.__data[1]=V.elements[1],L.__data[2]=V.elements[2],L.__data[3]=0,L.__data[4]=V.elements[3],L.__data[5]=V.elements[4],L.__data[6]=V.elements[5],L.__data[7]=0,L.__data[8]=V.elements[6],L.__data[9]=V.elements[7],L.__data[10]=V.elements[8],L.__data[11]=0):(V.toArray(L.__data,q),q+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,X,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(w,y,T,O){const C=w.value,R=y+"_"+T;if(O[R]===void 0)return typeof C=="number"||typeof C=="boolean"?O[R]=C:O[R]=C.clone(),!0;{const N=O[R];if(typeof C=="number"||typeof C=="boolean"){if(N!==C)return O[R]=C,!0}else if(N.equals(C)===!1)return N.copy(C),!0}return!1}function g(w){const y=w.uniforms;let T=0;const O=16;for(let R=0,N=y.length;R<N;R++){const E=Array.isArray(y[R])?y[R]:[y[R]];for(let M=0,L=E.length;M<L;M++){const X=E[M],z=Array.isArray(X.value)?X.value:[X.value];for(let q=0,K=z.length;q<K;q++){const V=z[q],Q=v(V),W=T%O;W!==0&&O-W<Q.boundary&&(T+=O-W),X.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=T,T+=Q.storage}}}const C=T%O;return C>0&&(T+=O-C),w.__size=T,w.__cache={},this}function v(w){const y={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(y.boundary=4,y.storage=4):w.isVector2?(y.boundary=8,y.storage=8):w.isVector3||w.isColor?(y.boundary=16,y.storage=12):w.isVector4?(y.boundary=16,y.storage=16):w.isMatrix3?(y.boundary=48,y.storage=48):w.isMatrix4?(y.boundary=64,y.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),y}function p(w){const y=w.target;y.removeEventListener("dispose",p);const T=a.indexOf(y.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function f(){for(const w in r)i.deleteBuffer(r[w]);a=[],r={},s={}}return{bind:c,update:l,dispose:f}}class A0{constructor(e={}){const{canvas:t=xf(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;const m=new Uint32Array(4),g=new Int32Array(4);let v=null,p=null;const f=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Yt,this.toneMapping=kn,this.toneMappingExposure=1;const y=this;let T=!1,O=0,C=0,R=null,N=-1,E=null;const M=new ut,L=new ut;let X=null;const z=new Ke(0);let q=0,K=t.width,V=t.height,Q=1,W=null,ce=null;const he=new ut(0,0,K,V),le=new ut(0,0,K,V);let Te=!1;const ke=new Ro;let Y=!1,ee=!1;const de=new ft,ae=new A,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ae=!1;function He(){return R===null?Q:1}let P=n;function Ge(S,D){return t.getContext(S,D)}try{const S={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${yo}`),t.addEventListener("webglcontextlost",H,!1),t.addEventListener("webglcontextrestored",U,!1),t.addEventListener("webglcontextcreationerror",G,!1),P===null){const D="webgl2";if(P=Ge(D,S),P===null)throw Ge(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Be,at,xe,We,Fe,Re,ht,b,x,k,j,Z,J,ge,re,ie,Ce,te,pe,Oe,Me,oe,Pe,Le;function pt(){Be=new Ng(P),Be.init(),oe=new _0(P,Be),at=new Cg(P,Be,e,oe),xe=new m0(P),We=new Bg(P),Fe=new t0,Re=new g0(P,Be,xe,Fe,at,oe,We),ht=new Lg(y),b=new Ug(y),x=new Xf(P),Pe=new Ag(P,x),k=new Fg(P,x,We,Pe),j=new kg(P,k,x,We),pe=new zg(P,at,Re),ie=new Pg(Fe),Z=new e0(y,ht,b,Be,at,Pe,ie),J=new b0(y,Fe),ge=new i0,re=new l0(Be),te=new Tg(y,ht,b,xe,j,d,c),Ce=new p0(y,j,at),Le=new T0(P,We,at,xe),Oe=new Rg(P,Be,We),Me=new Og(P,Be,We),We.programs=Z.programs,y.capabilities=at,y.extensions=Be,y.properties=Fe,y.renderLists=ge,y.shadowMap=Ce,y.state=xe,y.info=We}pt();const _=new E0(y,P);this.xr=_,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const S=Be.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Be.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(S){S!==void 0&&(Q=S,this.setSize(K,V,!1))},this.getSize=function(S){return S.set(K,V)},this.setSize=function(S,D,F=!0){if(_.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=S,V=D,t.width=Math.floor(S*Q),t.height=Math.floor(D*Q),F===!0&&(t.style.width=S+"px",t.style.height=D+"px"),this.setViewport(0,0,S,D)},this.getDrawingBufferSize=function(S){return S.set(K*Q,V*Q).floor()},this.setDrawingBufferSize=function(S,D,F){K=S,V=D,Q=F,t.width=Math.floor(S*F),t.height=Math.floor(D*F),this.setViewport(0,0,S,D)},this.getCurrentViewport=function(S){return S.copy(M)},this.getViewport=function(S){return S.copy(he)},this.setViewport=function(S,D,F,B){S.isVector4?he.set(S.x,S.y,S.z,S.w):he.set(S,D,F,B),xe.viewport(M.copy(he).multiplyScalar(Q).round())},this.getScissor=function(S){return S.copy(le)},this.setScissor=function(S,D,F,B){S.isVector4?le.set(S.x,S.y,S.z,S.w):le.set(S,D,F,B),xe.scissor(L.copy(le).multiplyScalar(Q).round())},this.getScissorTest=function(){return Te},this.setScissorTest=function(S){xe.setScissorTest(Te=S)},this.setOpaqueSort=function(S){W=S},this.setTransparentSort=function(S){ce=S},this.getClearColor=function(S){return S.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor.apply(te,arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha.apply(te,arguments)},this.clear=function(S=!0,D=!0,F=!0){let B=0;if(S){let I=!1;if(R!==null){const ne=R.texture.format;I=ne===Ql||ne===Jl||ne===Zl}if(I){const ne=R.texture.type,ue=ne===qn||ne===hr||ne===Ls||ne===dr||ne===jl||ne===$l,fe=te.getClearColor(),me=te.getClearAlpha(),ye=fe.r,Ee=fe.g,Se=fe.b;ue?(m[0]=ye,m[1]=Ee,m[2]=Se,m[3]=me,P.clearBufferuiv(P.COLOR,0,m)):(g[0]=ye,g[1]=Ee,g[2]=Se,g[3]=me,P.clearBufferiv(P.COLOR,0,g))}else B|=P.COLOR_BUFFER_BIT}D&&(B|=P.DEPTH_BUFFER_BIT),F&&(B|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",H,!1),t.removeEventListener("webglcontextrestored",U,!1),t.removeEventListener("webglcontextcreationerror",G,!1),ge.dispose(),re.dispose(),Fe.dispose(),ht.dispose(),b.dispose(),j.dispose(),Pe.dispose(),Le.dispose(),Z.dispose(),_.dispose(),_.removeEventListener("sessionstart",yt),_.removeEventListener("sessionend",Et),Gt.stop()};function H(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const S=We.autoReset,D=Ce.enabled,F=Ce.autoUpdate,B=Ce.needsUpdate,I=Ce.type;pt(),We.autoReset=S,Ce.enabled=D,Ce.autoUpdate=F,Ce.needsUpdate=B,Ce.type=I}function G(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function $(S){const D=S.target;D.removeEventListener("dispose",$),_e(D)}function _e(S){be(S),Fe.remove(S)}function be(S){const D=Fe.get(S).programs;D!==void 0&&(D.forEach(function(F){Z.releaseProgram(F)}),S.isShaderMaterial&&Z.releaseShaderCache(S))}this.renderBufferDirect=function(S,D,F,B,I,ne){D===null&&(D=Ie);const ue=I.isMesh&&I.matrixWorld.determinant()<0,fe=Xh(S,D,F,B,I);xe.setMaterial(B,ue);let me=F.index,ye=1;if(B.wireframe===!0){if(me=k.getWireframeAttribute(F),me===void 0)return;ye=2}const Ee=F.drawRange,Se=F.attributes.position;let je=Ee.start*ye,gt=(Ee.start+Ee.count)*ye;ne!==null&&(je=Math.max(je,ne.start*ye),gt=Math.min(gt,(ne.start+ne.count)*ye)),me!==null?(je=Math.max(je,0),gt=Math.min(gt,me.count)):Se!=null&&(je=Math.max(je,0),gt=Math.min(gt,Se.count));const _t=gt-je;if(_t<0||_t===1/0)return;Pe.setup(I,B,fe,F,me);let Wt,Ze=Oe;if(me!==null&&(Wt=x.get(me),Ze=Me,Ze.setIndex(Wt)),I.isMesh)B.wireframe===!0?(xe.setLineWidth(B.wireframeLinewidth*He()),Ze.setMode(P.LINES)):Ze.setMode(P.TRIANGLES);else if(I.isLine){let ve=B.linewidth;ve===void 0&&(ve=1),xe.setLineWidth(ve*He()),I.isLineSegments?Ze.setMode(P.LINES):I.isLineLoop?Ze.setMode(P.LINE_LOOP):Ze.setMode(P.LINE_STRIP)}else I.isPoints?Ze.setMode(P.POINTS):I.isSprite&&Ze.setMode(P.TRIANGLES);if(I.isBatchedMesh)I._multiDrawInstances!==null?Ze.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances):Ze.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else if(I.isInstancedMesh)Ze.renderInstances(je,_t,I.count);else if(F.isInstancedBufferGeometry){const ve=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,Ut=Math.min(F.instanceCount,ve);Ze.renderInstances(je,_t,Ut)}else Ze.render(je,_t)};function mt(S,D,F){S.transparent===!0&&S.side===En&&S.forceSinglePass===!1?(S.side=Ht,S.needsUpdate=!0,Kr(S,D,F),S.side=Xn,S.needsUpdate=!0,Kr(S,D,F),S.side=En):Kr(S,D,F)}this.compile=function(S,D,F=null){F===null&&(F=S),p=re.get(F),p.init(D),w.push(p),F.traverseVisible(function(I){I.isLight&&I.layers.test(D.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),S!==F&&S.traverseVisible(function(I){I.isLight&&I.layers.test(D.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),p.setupLights();const B=new Set;return S.traverse(function(I){const ne=I.material;if(ne)if(Array.isArray(ne))for(let ue=0;ue<ne.length;ue++){const fe=ne[ue];mt(fe,F,I),B.add(fe)}else mt(ne,F,I),B.add(ne)}),w.pop(),p=null,B},this.compileAsync=function(S,D,F=null){const B=this.compile(S,D,F);return new Promise(I=>{function ne(){if(B.forEach(function(ue){Fe.get(ue).currentProgram.isReady()&&B.delete(ue)}),B.size===0){I(S);return}setTimeout(ne,10)}Be.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let Mt=null;function Ye(S){Mt&&Mt(S)}function yt(){Gt.stop()}function Et(){Gt.start()}const Gt=new hu;Gt.setAnimationLoop(Ye),typeof self<"u"&&Gt.setContext(self),this.setAnimationLoop=function(S){Mt=S,_.setAnimationLoop(S),S===null?Gt.stop():Gt.start()},_.addEventListener("sessionstart",yt),_.addEventListener("sessionend",Et),this.render=function(S,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),_.enabled===!0&&_.isPresenting===!0&&(_.cameraAutoUpdate===!0&&_.updateCamera(D),D=_.getCamera()),S.isScene===!0&&S.onBeforeRender(y,S,D,R),p=re.get(S,w.length),p.init(D),w.push(p),de.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),ke.setFromProjectionMatrix(de),ee=this.localClippingEnabled,Y=ie.init(this.clippingPlanes,ee),v=ge.get(S,f.length),v.init(),f.push(v),_.enabled===!0&&_.isPresenting===!0){const ne=y.xr.getDepthSensingMesh();ne!==null&&Vt(ne,D,-1/0,y.sortObjects)}Vt(S,D,0,y.sortObjects),v.finish(),y.sortObjects===!0&&v.sort(W,ce),Ae=_.enabled===!1||_.isPresenting===!1||_.hasDepthSensing()===!1,Ae&&te.addToRenderList(v,S),this.info.render.frame++,Y===!0&&ie.beginShadows();const F=p.state.shadowsArray;Ce.render(F,S,D),Y===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=v.opaque,I=v.transmissive;if(p.setupLights(),D.isArrayCamera){const ne=D.cameras;if(I.length>0)for(let ue=0,fe=ne.length;ue<fe;ue++){const me=ne[ue];ni(B,I,S,me)}Ae&&te.render(S);for(let ue=0,fe=ne.length;ue<fe;ue++){const me=ne[ue];Tn(v,S,me,me.viewport)}}else I.length>0&&ni(B,I,S,D),Ae&&te.render(S),Tn(v,S,D);R!==null&&(Re.updateMultisampleRenderTarget(R),Re.updateRenderTargetMipmap(R)),S.isScene===!0&&S.onAfterRender(y,S,D),Pe.resetDefaultState(),N=-1,E=null,w.pop(),w.length>0?(p=w[w.length-1],Y===!0&&ie.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,f.pop(),f.length>0?v=f[f.length-1]:v=null};function Vt(S,D,F,B){if(S.visible===!1)return;if(S.layers.test(D.layers)){if(S.isGroup)F=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(D);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ke.intersectsSprite(S)){B&&ae.setFromMatrixPosition(S.matrixWorld).applyMatrix4(de);const ue=j.update(S),fe=S.material;fe.visible&&v.push(S,ue,fe,F,ae.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||ke.intersectsObject(S))){const ue=j.update(S),fe=S.material;if(B&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),ae.copy(S.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),ae.copy(ue.boundingSphere.center)),ae.applyMatrix4(S.matrixWorld).applyMatrix4(de)),Array.isArray(fe)){const me=ue.groups;for(let ye=0,Ee=me.length;ye<Ee;ye++){const Se=me[ye],je=fe[Se.materialIndex];je&&je.visible&&v.push(S,ue,je,F,ae.z,Se)}}else fe.visible&&v.push(S,ue,fe,F,ae.z,null)}}const ne=S.children;for(let ue=0,fe=ne.length;ue<fe;ue++)Vt(ne[ue],D,F,B)}function Tn(S,D,F,B){const I=S.opaque,ne=S.transmissive,ue=S.transparent;p.setupLightsView(F),Y===!0&&ie.setGlobalState(y.clippingPlanes,F),B&&xe.viewport(M.copy(B)),I.length>0&&ii(I,D,F),ne.length>0&&ii(ne,D,F),ue.length>0&&ii(ue,D,F),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function ni(S,D,F,B){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new Ti(1,1,{generateMipmaps:!0,type:Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float")?qs:qn,minFilter:vi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace}));const ne=p.state.transmissionRenderTarget[B.id],ue=B.viewport||M;ne.setSize(ue.z,ue.w);const fe=y.getRenderTarget();y.setRenderTarget(ne),y.getClearColor(z),q=y.getClearAlpha(),q<1&&y.setClearColor(16777215,.5),Ae?te.render(F):y.clear();const me=y.toneMapping;y.toneMapping=kn;const ye=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),Y===!0&&ie.setGlobalState(y.clippingPlanes,B),ii(S,F,B),Re.updateMultisampleRenderTarget(ne),Re.updateRenderTargetMipmap(ne),Be.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let Se=0,je=D.length;Se<je;Se++){const gt=D[Se],_t=gt.object,Wt=gt.geometry,Ze=gt.material,ve=gt.group;if(Ze.side===En&&_t.layers.test(B.layers)){const Ut=Ze.side;Ze.side=Ht,Ze.needsUpdate=!0,Jo(_t,F,B,Wt,Ze,ve),Ze.side=Ut,Ze.needsUpdate=!0,Ee=!0}}Ee===!0&&(Re.updateMultisampleRenderTarget(ne),Re.updateRenderTargetMipmap(ne))}y.setRenderTarget(fe),y.setClearColor(z,q),ye!==void 0&&(B.viewport=ye),y.toneMapping=me}function ii(S,D,F){const B=D.isScene===!0?D.overrideMaterial:null;for(let I=0,ne=S.length;I<ne;I++){const ue=S[I],fe=ue.object,me=ue.geometry,ye=B===null?ue.material:B,Ee=ue.group;fe.layers.test(F.layers)&&Jo(fe,D,F,me,ye,Ee)}}function Jo(S,D,F,B,I,ne){S.onBeforeRender(y,D,F,B,I,ne),S.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),I.onBeforeRender(y,D,F,B,S,ne),I.transparent===!0&&I.side===En&&I.forceSinglePass===!1?(I.side=Ht,I.needsUpdate=!0,y.renderBufferDirect(F,D,B,I,S,ne),I.side=Xn,I.needsUpdate=!0,y.renderBufferDirect(F,D,B,I,S,ne),I.side=En):y.renderBufferDirect(F,D,B,I,S,ne),S.onAfterRender(y,D,F,B,I,ne)}function Kr(S,D,F){D.isScene!==!0&&(D=Ie);const B=Fe.get(S),I=p.state.lights,ne=p.state.shadowsArray,ue=I.state.version,fe=Z.getParameters(S,I.state,ne,D,F),me=Z.getProgramCacheKey(fe);let ye=B.programs;B.environment=S.isMeshStandardMaterial?D.environment:null,B.fog=D.fog,B.envMap=(S.isMeshStandardMaterial?b:ht).get(S.envMap||B.environment),B.envMapRotation=B.environment!==null&&S.envMap===null?D.environmentRotation:S.envMapRotation,ye===void 0&&(S.addEventListener("dispose",$),ye=new Map,B.programs=ye);let Ee=ye.get(me);if(Ee!==void 0){if(B.currentProgram===Ee&&B.lightsStateVersion===ue)return ec(S,fe),Ee}else fe.uniforms=Z.getUniforms(S),S.onBuild(F,fe,y),S.onBeforeCompile(fe,y),Ee=Z.acquireProgram(fe,me),ye.set(me,Ee),B.uniforms=fe.uniforms;const Se=B.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Se.clippingPlanes=ie.uniform),ec(S,fe),B.needsLights=Yh(S),B.lightsStateVersion=ue,B.needsLights&&(Se.ambientLightColor.value=I.state.ambient,Se.lightProbe.value=I.state.probe,Se.directionalLights.value=I.state.directional,Se.directionalLightShadows.value=I.state.directionalShadow,Se.spotLights.value=I.state.spot,Se.spotLightShadows.value=I.state.spotShadow,Se.rectAreaLights.value=I.state.rectArea,Se.ltc_1.value=I.state.rectAreaLTC1,Se.ltc_2.value=I.state.rectAreaLTC2,Se.pointLights.value=I.state.point,Se.pointLightShadows.value=I.state.pointShadow,Se.hemisphereLights.value=I.state.hemi,Se.directionalShadowMap.value=I.state.directionalShadowMap,Se.directionalShadowMatrix.value=I.state.directionalShadowMatrix,Se.spotShadowMap.value=I.state.spotShadowMap,Se.spotLightMatrix.value=I.state.spotLightMatrix,Se.spotLightMap.value=I.state.spotLightMap,Se.pointShadowMap.value=I.state.pointShadowMap,Se.pointShadowMatrix.value=I.state.pointShadowMatrix),B.currentProgram=Ee,B.uniformsList=null,Ee}function Qo(S){if(S.uniformsList===null){const D=S.currentProgram.getUniforms();S.uniformsList=ws.seqWithValue(D.seq,S.uniforms)}return S.uniformsList}function ec(S,D){const F=Fe.get(S);F.outputColorSpace=D.outputColorSpace,F.batching=D.batching,F.batchingColor=D.batchingColor,F.instancing=D.instancing,F.instancingColor=D.instancingColor,F.instancingMorph=D.instancingMorph,F.skinning=D.skinning,F.morphTargets=D.morphTargets,F.morphNormals=D.morphNormals,F.morphColors=D.morphColors,F.morphTargetsCount=D.morphTargetsCount,F.numClippingPlanes=D.numClippingPlanes,F.numIntersection=D.numClipIntersection,F.vertexAlphas=D.vertexAlphas,F.vertexTangents=D.vertexTangents,F.toneMapping=D.toneMapping}function Xh(S,D,F,B,I){D.isScene!==!0&&(D=Ie),Re.resetTextureUnits();const ne=D.fog,ue=B.isMeshStandardMaterial?D.environment:null,fe=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Qn,me=(B.isMeshStandardMaterial?b:ht).get(B.envMap||ue),ye=B.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Ee=!!F.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Se=!!F.morphAttributes.position,je=!!F.morphAttributes.normal,gt=!!F.morphAttributes.color;let _t=kn;B.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(_t=y.toneMapping);const Wt=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Ze=Wt!==void 0?Wt.length:0,ve=Fe.get(B),Ut=p.state.lights;if(Y===!0&&(ee===!0||S!==E)){const $t=S===E&&B.id===N;ie.setState(B,S,$t)}let nt=!1;B.version===ve.__version?(ve.needsLights&&ve.lightsStateVersion!==Ut.state.version||ve.outputColorSpace!==fe||I.isBatchedMesh&&ve.batching===!1||!I.isBatchedMesh&&ve.batching===!0||I.isBatchedMesh&&ve.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&ve.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&ve.instancing===!1||!I.isInstancedMesh&&ve.instancing===!0||I.isSkinnedMesh&&ve.skinning===!1||!I.isSkinnedMesh&&ve.skinning===!0||I.isInstancedMesh&&ve.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&ve.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&ve.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&ve.instancingMorph===!1&&I.morphTexture!==null||ve.envMap!==me||B.fog===!0&&ve.fog!==ne||ve.numClippingPlanes!==void 0&&(ve.numClippingPlanes!==ie.numPlanes||ve.numIntersection!==ie.numIntersection)||ve.vertexAlphas!==ye||ve.vertexTangents!==Ee||ve.morphTargets!==Se||ve.morphNormals!==je||ve.morphColors!==gt||ve.toneMapping!==_t||ve.morphTargetsCount!==Ze)&&(nt=!0):(nt=!0,ve.__version=B.version);let mn=ve.currentProgram;nt===!0&&(mn=Kr(B,D,I));let jr=!1,ri=!1,ua=!1;const At=mn.getUniforms(),An=ve.uniforms;if(xe.useProgram(mn.program)&&(jr=!0,ri=!0,ua=!0),B.id!==N&&(N=B.id,ri=!0),jr||E!==S){At.setValue(P,"projectionMatrix",S.projectionMatrix),At.setValue(P,"viewMatrix",S.matrixWorldInverse);const $t=At.map.cameraPosition;$t!==void 0&&$t.setValue(P,ae.setFromMatrixPosition(S.matrixWorld)),at.logarithmicDepthBuffer&&At.setValue(P,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&At.setValue(P,"isOrthographic",S.isOrthographicCamera===!0),E!==S&&(E=S,ri=!0,ua=!0)}if(I.isSkinnedMesh){At.setOptional(P,I,"bindMatrix"),At.setOptional(P,I,"bindMatrixInverse");const $t=I.skeleton;$t&&($t.boneTexture===null&&$t.computeBoneTexture(),At.setValue(P,"boneTexture",$t.boneTexture,Re))}I.isBatchedMesh&&(At.setOptional(P,I,"batchingTexture"),At.setValue(P,"batchingTexture",I._matricesTexture,Re),At.setOptional(P,I,"batchingColorTexture"),I._colorsTexture!==null&&At.setValue(P,"batchingColorTexture",I._colorsTexture,Re));const ha=F.morphAttributes;if((ha.position!==void 0||ha.normal!==void 0||ha.color!==void 0)&&pe.update(I,F,mn),(ri||ve.receiveShadow!==I.receiveShadow)&&(ve.receiveShadow=I.receiveShadow,At.setValue(P,"receiveShadow",I.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(An.envMap.value=me,An.flipEnvMap.value=me.isCubeTexture&&me.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&D.environment!==null&&(An.envMapIntensity.value=D.environmentIntensity),ri&&(At.setValue(P,"toneMappingExposure",y.toneMappingExposure),ve.needsLights&&qh(An,ua),ne&&B.fog===!0&&J.refreshFogUniforms(An,ne),J.refreshMaterialUniforms(An,B,Q,V,p.state.transmissionRenderTarget[S.id]),ws.upload(P,Qo(ve),An,Re)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(ws.upload(P,Qo(ve),An,Re),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&At.setValue(P,"center",I.center),At.setValue(P,"modelViewMatrix",I.modelViewMatrix),At.setValue(P,"normalMatrix",I.normalMatrix),At.setValue(P,"modelMatrix",I.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const $t=B.uniformsGroups;for(let da=0,Kh=$t.length;da<Kh;da++){const tc=$t[da];Le.update(tc,mn),Le.bind(tc,mn)}}return mn}function qh(S,D){S.ambientLightColor.needsUpdate=D,S.lightProbe.needsUpdate=D,S.directionalLights.needsUpdate=D,S.directionalLightShadows.needsUpdate=D,S.pointLights.needsUpdate=D,S.pointLightShadows.needsUpdate=D,S.spotLights.needsUpdate=D,S.spotLightShadows.needsUpdate=D,S.rectAreaLights.needsUpdate=D,S.hemisphereLights.needsUpdate=D}function Yh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(S,D,F){Fe.get(S.texture).__webglTexture=D,Fe.get(S.depthTexture).__webglTexture=F;const B=Fe.get(S);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=F===void 0,B.__autoAllocateDepthBuffer||Be.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,D){const F=Fe.get(S);F.__webglFramebuffer=D,F.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(S,D=0,F=0){R=S,O=D,C=F;let B=!0,I=null,ne=!1,ue=!1;if(S){const me=Fe.get(S);me.__useDefaultFramebuffer!==void 0?(xe.bindFramebuffer(P.FRAMEBUFFER,null),B=!1):me.__webglFramebuffer===void 0?Re.setupRenderTarget(S):me.__hasExternalTextures&&Re.rebindTextures(S,Fe.get(S.texture).__webglTexture,Fe.get(S.depthTexture).__webglTexture);const ye=S.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(ue=!0);const Ee=Fe.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ee[D])?I=Ee[D][F]:I=Ee[D],ne=!0):S.samples>0&&Re.useMultisampledRTT(S)===!1?I=Fe.get(S).__webglMultisampledFramebuffer:Array.isArray(Ee)?I=Ee[F]:I=Ee,M.copy(S.viewport),L.copy(S.scissor),X=S.scissorTest}else M.copy(he).multiplyScalar(Q).floor(),L.copy(le).multiplyScalar(Q).floor(),X=Te;if(xe.bindFramebuffer(P.FRAMEBUFFER,I)&&B&&xe.drawBuffers(S,I),xe.viewport(M),xe.scissor(L),xe.setScissorTest(X),ne){const me=Fe.get(S.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+D,me.__webglTexture,F)}else if(ue){const me=Fe.get(S.texture),ye=D||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,me.__webglTexture,F||0,ye)}N=-1},this.readRenderTargetPixels=function(S,D,F,B,I,ne,ue){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=Fe.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ue!==void 0&&(fe=fe[ue]),fe){xe.bindFramebuffer(P.FRAMEBUFFER,fe);try{const me=S.texture,ye=me.format,Ee=me.type;if(!at.textureFormatReadable(ye)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!at.textureTypeReadable(Ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=S.width-B&&F>=0&&F<=S.height-I&&P.readPixels(D,F,B,I,oe.convert(ye),oe.convert(Ee),ne)}finally{const me=R!==null?Fe.get(R).__webglFramebuffer:null;xe.bindFramebuffer(P.FRAMEBUFFER,me)}}},this.readRenderTargetPixelsAsync=async function(S,D,F,B,I,ne,ue){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=Fe.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ue!==void 0&&(fe=fe[ue]),fe){xe.bindFramebuffer(P.FRAMEBUFFER,fe);try{const me=S.texture,ye=me.format,Ee=me.type;if(!at.textureFormatReadable(ye))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!at.textureTypeReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=S.width-B&&F>=0&&F<=S.height-I){const Se=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Se),P.bufferData(P.PIXEL_PACK_BUFFER,ne.byteLength,P.STREAM_READ),P.readPixels(D,F,B,I,oe.convert(ye),oe.convert(Ee),0),P.flush();const je=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);await Sf(P,je,4);try{P.bindBuffer(P.PIXEL_PACK_BUFFER,Se),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ne)}finally{P.deleteBuffer(Se),P.deleteSync(je)}return ne}}finally{const me=R!==null?Fe.get(R).__webglFramebuffer:null;xe.bindFramebuffer(P.FRAMEBUFFER,me)}}},this.copyFramebufferToTexture=function(S,D=null,F=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,S=arguments[1]);const B=Math.pow(2,-F),I=Math.floor(S.image.width*B),ne=Math.floor(S.image.height*B),ue=D!==null?D.x:0,fe=D!==null?D.y:0;Re.setTexture2D(S,0),P.copyTexSubImage2D(P.TEXTURE_2D,F,0,0,ue,fe,I,ne),xe.unbindTexture()},this.copyTextureToTexture=function(S,D,F=null,B=null,I=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,S=arguments[1],D=arguments[2],I=arguments[3]||0,F=null);let ne,ue,fe,me,ye,Ee;F!==null?(ne=F.max.x-F.min.x,ue=F.max.y-F.min.y,fe=F.min.x,me=F.min.y):(ne=S.image.width,ue=S.image.height,fe=0,me=0),B!==null?(ye=B.x,Ee=B.y):(ye=0,Ee=0);const Se=oe.convert(D.format),je=oe.convert(D.type);Re.setTexture2D(D,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,D.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,D.unpackAlignment);const gt=P.getParameter(P.UNPACK_ROW_LENGTH),_t=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Wt=P.getParameter(P.UNPACK_SKIP_PIXELS),Ze=P.getParameter(P.UNPACK_SKIP_ROWS),ve=P.getParameter(P.UNPACK_SKIP_IMAGES),Ut=S.isCompressedTexture?S.mipmaps[I]:S.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,Ut.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ut.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,fe),P.pixelStorei(P.UNPACK_SKIP_ROWS,me),S.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,I,ye,Ee,ne,ue,Se,je,Ut.data):S.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,I,ye,Ee,Ut.width,Ut.height,Se,Ut.data):P.texSubImage2D(P.TEXTURE_2D,I,ye,Ee,Se,je,Ut),P.pixelStorei(P.UNPACK_ROW_LENGTH,gt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,_t),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Wt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Ze),P.pixelStorei(P.UNPACK_SKIP_IMAGES,ve),I===0&&D.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),xe.unbindTexture()},this.copyTextureToTexture3D=function(S,D,F=null,B=null,I=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),F=arguments[0]||null,B=arguments[1]||null,S=arguments[2],D=arguments[3],I=arguments[4]||0);let ne,ue,fe,me,ye,Ee,Se,je,gt;const _t=S.isCompressedTexture?S.mipmaps[I]:S.image;F!==null?(ne=F.max.x-F.min.x,ue=F.max.y-F.min.y,fe=F.max.z-F.min.z,me=F.min.x,ye=F.min.y,Ee=F.min.z):(ne=_t.width,ue=_t.height,fe=_t.depth,me=0,ye=0,Ee=0),B!==null?(Se=B.x,je=B.y,gt=B.z):(Se=0,je=0,gt=0);const Wt=oe.convert(D.format),Ze=oe.convert(D.type);let ve;if(D.isData3DTexture)Re.setTexture3D(D,0),ve=P.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)Re.setTexture2DArray(D,0),ve=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,D.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,D.unpackAlignment);const Ut=P.getParameter(P.UNPACK_ROW_LENGTH),nt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),mn=P.getParameter(P.UNPACK_SKIP_PIXELS),jr=P.getParameter(P.UNPACK_SKIP_ROWS),ri=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,_t.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,_t.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,me),P.pixelStorei(P.UNPACK_SKIP_ROWS,ye),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ee),S.isDataTexture||S.isData3DTexture?P.texSubImage3D(ve,I,Se,je,gt,ne,ue,fe,Wt,Ze,_t.data):D.isCompressedArrayTexture?P.compressedTexSubImage3D(ve,I,Se,je,gt,ne,ue,fe,Wt,_t.data):P.texSubImage3D(ve,I,Se,je,gt,ne,ue,fe,Wt,Ze,_t),P.pixelStorei(P.UNPACK_ROW_LENGTH,Ut),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,nt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,mn),P.pixelStorei(P.UNPACK_SKIP_ROWS,jr),P.pixelStorei(P.UNPACK_SKIP_IMAGES,ri),I===0&&D.generateMipmaps&&P.generateMipmap(ve),xe.unbindTexture()},this.initRenderTarget=function(S){Fe.get(S).__webglFramebuffer===void 0&&Re.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Re.setTextureCube(S,0):S.isData3DTexture?Re.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Re.setTexture2DArray(S,0):Re.setTexture2D(S,0),xe.unbindTexture()},this.resetState=function(){O=0,C=0,R=null,xe.reset(),Pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Eo?"display-p3":"srgb",t.unpackColorSpace=Qe.workingColorSpace===Ys?"display-p3":"srgb"}}class Po{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ke(e),this.near=t,this.far=n}clone(){return new Po(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class R0 extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ot,this.environmentIntensity=1,this.environmentRotation=new Ot,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Lo extends Bt{constructor(e,t,n,r,s,a,o,c,l){super(e,t,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Do extends Ct{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class C0 extends Do{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Wa=new ft,El=new A,wl=new A;class xu{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new we(512,512),this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ro,this._frameExtents=new we(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;El.setFromMatrixPosition(e.matrixWorld),t.position.copy(El),wl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wl),t.updateMatrixWorld(),Wa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Wa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const bl=new ft,Lr=new A,Xa=new A;class P0 extends xu{constructor(){super(new Kt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new we(4,2),this._viewportCount=6,this._viewports=[new ut(2,1,1,1),new ut(0,1,1,1),new ut(3,1,1,1),new ut(1,1,1,1),new ut(3,0,1,1),new ut(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Lr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Lr),Xa.copy(n.position),Xa.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Xa),n.updateMatrixWorld(),r.makeTranslation(-Lr.x,-Lr.y,-Lr.z),bl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bl)}}class L0 extends Do{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new P0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class D0 extends xu{constructor(){super(new du(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Su extends Do{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new D0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Tl=new ft;class I0{constructor(e,t,n=0,r=1/0){this.ray=new To(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Ao,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Tl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Tl),this}intersectObject(e,t=!0,n=[]){return no(e,this,n,t),n.sort(Al),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)no(e[r],this,n,t);return n.sort(Al),n}}function Al(i,e){return i.distance-e.distance}function no(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let a=0,o=s.length;a<o;a++)no(s[a],e,t,!0)}}class Rl{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Dt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yo);const Cl={type:"change"},qa={type:"start"},Pl={type:"end"},vs=new To,Ll=new Un,U0=Math.cos(70*st.DEG2RAD);class N0 extends Pi{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Bi.ROTATE,MIDDLE:Bi.DOLLY,RIGHT:Bi.PAN},this.touches={ONE:zi.ROTATE,TWO:zi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(_){_.addEventListener("keydown",ie),this._domElementKeyEvents=_},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ie),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Cl),n.update(),s=r.NONE},this.update=function(){const _=new A,H=new on().setFromUnitVectors(e.up,new A(0,1,0)),U=H.clone().invert(),G=new A,$=new on,_e=new A,be=2*Math.PI;return function(Mt=null){const Ye=n.object.position;_.copy(Ye).sub(n.target),_.applyQuaternion(H),o.setFromVector3(_),n.autoRotate&&s===r.NONE&&X(M(Mt)),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let yt=n.minAzimuthAngle,Et=n.maxAzimuthAngle;isFinite(yt)&&isFinite(Et)&&(yt<-Math.PI?yt+=be:yt>Math.PI&&(yt-=be),Et<-Math.PI?Et+=be:Et>Math.PI&&(Et-=be),yt<=Et?o.theta=Math.max(yt,Math.min(Et,o.theta)):o.theta=o.theta>(yt+Et)/2?Math.max(yt,o.theta):Math.min(Et,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor);let Gt=!1;if(n.zoomToCursor&&C||n.object.isOrthographicCamera)o.radius=he(o.radius);else{const Vt=o.radius;o.radius=he(o.radius*l),Gt=Vt!=o.radius}if(_.setFromSpherical(o),_.applyQuaternion(U),Ye.copy(n.target).add(_),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),u.set(0,0,0)),n.zoomToCursor&&C){let Vt=null;if(n.object.isPerspectiveCamera){const Tn=_.length();Vt=he(Tn*l);const ni=Tn-Vt;n.object.position.addScaledVector(T,ni),n.object.updateMatrixWorld(),Gt=!!ni}else if(n.object.isOrthographicCamera){const Tn=new A(O.x,O.y,0);Tn.unproject(n.object);const ni=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Gt=ni!==n.object.zoom;const ii=new A(O.x,O.y,0);ii.unproject(n.object),n.object.position.sub(ii).add(Tn),n.object.updateMatrixWorld(),Vt=_.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Vt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Vt).add(n.object.position):(vs.origin.copy(n.object.position),vs.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(vs.direction))<U0?e.lookAt(n.target):(Ll.setFromNormalAndCoplanarPoint(n.object.up,n.target),vs.intersectPlane(Ll,n.target))))}else if(n.object.isOrthographicCamera){const Vt=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),Vt!==n.object.zoom&&(n.object.updateProjectionMatrix(),Gt=!0)}return l=1,C=!1,Gt||G.distanceToSquared(n.object.position)>a||8*(1-$.dot(n.object.quaternion))>a||_e.distanceToSquared(n.target)>a?(n.dispatchEvent(Cl),G.copy(n.object.position),$.copy(n.object.quaternion),_e.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",pe),n.domElement.removeEventListener("pointerdown",ht),n.domElement.removeEventListener("pointercancel",x),n.domElement.removeEventListener("wheel",Z),n.domElement.removeEventListener("pointermove",b),n.domElement.removeEventListener("pointerup",x),n.domElement.getRootNode().removeEventListener("keydown",ge,{capture:!0}),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ie),n._domElementKeyEvents=null)};const n=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=r.NONE;const a=1e-6,o=new Rl,c=new Rl;let l=1;const u=new A,h=new we,d=new we,m=new we,g=new we,v=new we,p=new we,f=new we,w=new we,y=new we,T=new A,O=new we;let C=!1;const R=[],N={};let E=!1;function M(_){return _!==null?2*Math.PI/60*n.autoRotateSpeed*_:2*Math.PI/60/60*n.autoRotateSpeed}function L(_){const H=Math.abs(_*.01);return Math.pow(.95,n.zoomSpeed*H)}function X(_){c.theta-=_}function z(_){c.phi-=_}const q=function(){const _=new A;return function(U,G){_.setFromMatrixColumn(G,0),_.multiplyScalar(-U),u.add(_)}}(),K=function(){const _=new A;return function(U,G){n.screenSpacePanning===!0?_.setFromMatrixColumn(G,1):(_.setFromMatrixColumn(G,0),_.crossVectors(n.object.up,_)),_.multiplyScalar(U),u.add(_)}}(),V=function(){const _=new A;return function(U,G){const $=n.domElement;if(n.object.isPerspectiveCamera){const _e=n.object.position;_.copy(_e).sub(n.target);let be=_.length();be*=Math.tan(n.object.fov/2*Math.PI/180),q(2*U*be/$.clientHeight,n.object.matrix),K(2*G*be/$.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(q(U*(n.object.right-n.object.left)/n.object.zoom/$.clientWidth,n.object.matrix),K(G*(n.object.top-n.object.bottom)/n.object.zoom/$.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Q(_){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=_:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function W(_){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=_:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function ce(_,H){if(!n.zoomToCursor)return;C=!0;const U=n.domElement.getBoundingClientRect(),G=_-U.left,$=H-U.top,_e=U.width,be=U.height;O.x=G/_e*2-1,O.y=-($/be)*2+1,T.set(O.x,O.y,1).unproject(n.object).sub(n.object.position).normalize()}function he(_){return Math.max(n.minDistance,Math.min(n.maxDistance,_))}function le(_){h.set(_.clientX,_.clientY)}function Te(_){ce(_.clientX,_.clientX),f.set(_.clientX,_.clientY)}function ke(_){g.set(_.clientX,_.clientY)}function Y(_){d.set(_.clientX,_.clientY),m.subVectors(d,h).multiplyScalar(n.rotateSpeed);const H=n.domElement;X(2*Math.PI*m.x/H.clientHeight),z(2*Math.PI*m.y/H.clientHeight),h.copy(d),n.update()}function ee(_){w.set(_.clientX,_.clientY),y.subVectors(w,f),y.y>0?Q(L(y.y)):y.y<0&&W(L(y.y)),f.copy(w),n.update()}function de(_){v.set(_.clientX,_.clientY),p.subVectors(v,g).multiplyScalar(n.panSpeed),V(p.x,p.y),g.copy(v),n.update()}function ae(_){ce(_.clientX,_.clientY),_.deltaY<0?W(L(_.deltaY)):_.deltaY>0&&Q(L(_.deltaY)),n.update()}function Ie(_){let H=!1;switch(_.code){case n.keys.UP:_.ctrlKey||_.metaKey||_.shiftKey?z(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):V(0,n.keyPanSpeed),H=!0;break;case n.keys.BOTTOM:_.ctrlKey||_.metaKey||_.shiftKey?z(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):V(0,-n.keyPanSpeed),H=!0;break;case n.keys.LEFT:_.ctrlKey||_.metaKey||_.shiftKey?X(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):V(n.keyPanSpeed,0),H=!0;break;case n.keys.RIGHT:_.ctrlKey||_.metaKey||_.shiftKey?X(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):V(-n.keyPanSpeed,0),H=!0;break}H&&(_.preventDefault(),n.update())}function Ae(_){if(R.length===1)h.set(_.pageX,_.pageY);else{const H=Le(_),U=.5*(_.pageX+H.x),G=.5*(_.pageY+H.y);h.set(U,G)}}function He(_){if(R.length===1)g.set(_.pageX,_.pageY);else{const H=Le(_),U=.5*(_.pageX+H.x),G=.5*(_.pageY+H.y);g.set(U,G)}}function P(_){const H=Le(_),U=_.pageX-H.x,G=_.pageY-H.y,$=Math.sqrt(U*U+G*G);f.set(0,$)}function Ge(_){n.enableZoom&&P(_),n.enablePan&&He(_)}function Be(_){n.enableZoom&&P(_),n.enableRotate&&Ae(_)}function at(_){if(R.length==1)d.set(_.pageX,_.pageY);else{const U=Le(_),G=.5*(_.pageX+U.x),$=.5*(_.pageY+U.y);d.set(G,$)}m.subVectors(d,h).multiplyScalar(n.rotateSpeed);const H=n.domElement;X(2*Math.PI*m.x/H.clientHeight),z(2*Math.PI*m.y/H.clientHeight),h.copy(d)}function xe(_){if(R.length===1)v.set(_.pageX,_.pageY);else{const H=Le(_),U=.5*(_.pageX+H.x),G=.5*(_.pageY+H.y);v.set(U,G)}p.subVectors(v,g).multiplyScalar(n.panSpeed),V(p.x,p.y),g.copy(v)}function We(_){const H=Le(_),U=_.pageX-H.x,G=_.pageY-H.y,$=Math.sqrt(U*U+G*G);w.set(0,$),y.set(0,Math.pow(w.y/f.y,n.zoomSpeed)),Q(y.y),f.copy(w);const _e=(_.pageX+H.x)*.5,be=(_.pageY+H.y)*.5;ce(_e,be)}function Fe(_){n.enableZoom&&We(_),n.enablePan&&xe(_)}function Re(_){n.enableZoom&&We(_),n.enableRotate&&at(_)}function ht(_){n.enabled!==!1&&(R.length===0&&(n.domElement.setPointerCapture(_.pointerId),n.domElement.addEventListener("pointermove",b),n.domElement.addEventListener("pointerup",x)),!oe(_)&&(Oe(_),_.pointerType==="touch"?Ce(_):k(_)))}function b(_){n.enabled!==!1&&(_.pointerType==="touch"?te(_):j(_))}function x(_){switch(Me(_),R.length){case 0:n.domElement.releasePointerCapture(_.pointerId),n.domElement.removeEventListener("pointermove",b),n.domElement.removeEventListener("pointerup",x),n.dispatchEvent(Pl),s=r.NONE;break;case 1:const H=R[0],U=N[H];Ce({pointerId:H,pageX:U.x,pageY:U.y});break}}function k(_){let H;switch(_.button){case 0:H=n.mouseButtons.LEFT;break;case 1:H=n.mouseButtons.MIDDLE;break;case 2:H=n.mouseButtons.RIGHT;break;default:H=-1}switch(H){case Bi.DOLLY:if(n.enableZoom===!1)return;Te(_),s=r.DOLLY;break;case Bi.ROTATE:if(_.ctrlKey||_.metaKey||_.shiftKey){if(n.enablePan===!1)return;ke(_),s=r.PAN}else{if(n.enableRotate===!1)return;le(_),s=r.ROTATE}break;case Bi.PAN:if(_.ctrlKey||_.metaKey||_.shiftKey){if(n.enableRotate===!1)return;le(_),s=r.ROTATE}else{if(n.enablePan===!1)return;ke(_),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&n.dispatchEvent(qa)}function j(_){switch(s){case r.ROTATE:if(n.enableRotate===!1)return;Y(_);break;case r.DOLLY:if(n.enableZoom===!1)return;ee(_);break;case r.PAN:if(n.enablePan===!1)return;de(_);break}}function Z(_){n.enabled===!1||n.enableZoom===!1||s!==r.NONE||(_.preventDefault(),n.dispatchEvent(qa),ae(J(_)),n.dispatchEvent(Pl))}function J(_){const H=_.deltaMode,U={clientX:_.clientX,clientY:_.clientY,deltaY:_.deltaY};switch(H){case 1:U.deltaY*=16;break;case 2:U.deltaY*=100;break}return _.ctrlKey&&!E&&(U.deltaY*=10),U}function ge(_){_.key==="Control"&&(E=!0,n.domElement.getRootNode().addEventListener("keyup",re,{passive:!0,capture:!0}))}function re(_){_.key==="Control"&&(E=!1,n.domElement.getRootNode().removeEventListener("keyup",re,{passive:!0,capture:!0}))}function ie(_){n.enabled===!1||n.enablePan===!1||Ie(_)}function Ce(_){switch(Pe(_),R.length){case 1:switch(n.touches.ONE){case zi.ROTATE:if(n.enableRotate===!1)return;Ae(_),s=r.TOUCH_ROTATE;break;case zi.PAN:if(n.enablePan===!1)return;He(_),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(n.touches.TWO){case zi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Ge(_),s=r.TOUCH_DOLLY_PAN;break;case zi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Be(_),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&n.dispatchEvent(qa)}function te(_){switch(Pe(_),s){case r.TOUCH_ROTATE:if(n.enableRotate===!1)return;at(_),n.update();break;case r.TOUCH_PAN:if(n.enablePan===!1)return;xe(_),n.update();break;case r.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Fe(_),n.update();break;case r.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Re(_),n.update();break;default:s=r.NONE}}function pe(_){n.enabled!==!1&&_.preventDefault()}function Oe(_){R.push(_.pointerId)}function Me(_){delete N[_.pointerId];for(let H=0;H<R.length;H++)if(R[H]==_.pointerId){R.splice(H,1);return}}function oe(_){for(let H=0;H<R.length;H++)if(R[H]==_.pointerId)return!0;return!1}function Pe(_){let H=N[_.pointerId];H===void 0&&(H=new we,N[_.pointerId]=H),H.set(_.pageX,_.pageY)}function Le(_){const H=_.pointerId===R[0]?R[1]:R[0];return N[H]}n.domElement.addEventListener("contextmenu",pe),n.domElement.addEventListener("pointerdown",ht),n.domElement.addEventListener("pointercancel",x),n.domElement.addEventListener("wheel",Z,{passive:!1}),n.domElement.getRootNode().addEventListener("keydown",ge,{passive:!0,capture:!0}),this.update()}}const Dr=new A;function Jt(i,e,t,n,r,s){const a=2*Math.PI*r/4,o=Math.max(s-2*r,0),c=Math.PI/4;Dr.copy(e),Dr[n]=0,Dr.normalize();const l=.5*a/(a+o),u=1-Dr.angleTo(i)/c;return Math.sign(Dr[t])===1?u*l:o/(a+o)+l+l*(1-u)}class F0 extends Di{constructor(e=1,t=1,n=1,r=2,s=.1){if(r=r*2+1,s=Math.min(e/2,t/2,n/2,s),super(1,1,1,r,r,r),r===1)return;const a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;const o=new A,c=new A,l=new A(e,t,n).divideScalar(2).subScalar(s),u=this.attributes.position.array,h=this.attributes.normal.array,d=this.attributes.uv.array,m=u.length/6,g=new A,v=.5/r;for(let p=0,f=0;p<u.length;p+=3,f+=2)switch(o.fromArray(u,p),c.copy(o),c.x-=Math.sign(c.x)*v,c.y-=Math.sign(c.y)*v,c.z-=Math.sign(c.z)*v,c.normalize(),u[p+0]=l.x*Math.sign(o.x)+c.x*s,u[p+1]=l.y*Math.sign(o.y)+c.y*s,u[p+2]=l.z*Math.sign(o.z)+c.z*s,h[p+0]=c.x,h[p+1]=c.y,h[p+2]=c.z,Math.floor(p/m)){case 0:g.set(1,0,0),d[f+0]=Jt(g,c,"z","y",s,n),d[f+1]=1-Jt(g,c,"y","z",s,t);break;case 1:g.set(-1,0,0),d[f+0]=1-Jt(g,c,"z","y",s,n),d[f+1]=1-Jt(g,c,"y","z",s,t);break;case 2:g.set(0,1,0),d[f+0]=1-Jt(g,c,"x","z",s,e),d[f+1]=Jt(g,c,"z","x",s,n);break;case 3:g.set(0,-1,0),d[f+0]=1-Jt(g,c,"x","z",s,e),d[f+1]=1-Jt(g,c,"z","x",s,n);break;case 4:g.set(0,0,1),d[f+0]=1-Jt(g,c,"x","y",s,e),d[f+1]=1-Jt(g,c,"y","x",s,t);break;case 5:g.set(0,0,-1),d[f+0]=Jt(g,c,"x","y",s,e),d[f+1]=1-Jt(g,c,"y","x",s,t);break}}}const O0=[{image:"line.png",format:"RGBA8888",size:{w:2033,h:1606},scale:1,frames:[{filename:"buttons/arrow-button.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:6,y:6,w:148,h:150},frame:{x:1883,y:843,w:148,h:150}},{filename:"buttons/continue-ad-button-blue-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:430,h:125},spriteSourceSize:{x:53,y:3,w:323,h:119},frame:{x:599,y:1468,w:323,h:119}},{filename:"buttons/continue-button.png",rotated:!1,trimmed:!0,sourceSize:{w:430,h:125},spriteSourceSize:{x:6,y:6,w:418,h:113},frame:{x:580,y:1353,w:418,h:113}},{filename:"buttons/hint-button.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:6,y:6,w:148,h:150},frame:{x:1883,y:995,w:148,h:150}},{filename:"buttons/minus-button.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:6,y:6,w:148,h:150},frame:{x:1711,y:1194,w:148,h:150}},{filename:"buttons/next-button-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:192,h:192},spriteSourceSize:{x:4,y:3,w:183,h:186},frame:{x:1168,y:1415,w:183,h:186}},{filename:"buttons/plus-button.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:6,y:4,w:148,h:152},frame:{x:1883,y:689,w:148,h:152}},{filename:"buttons/restart-button.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:6,y:4,w:148,h:150},frame:{x:1861,y:1301,w:148,h:150}},{filename:"buttons/shuffle-button.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:6,y:6,w:148,h:150},frame:{x:1883,y:995,w:148,h:150}},{filename:"buttons/sound-button-muted-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:4,y:4,w:152,h:152},frame:{x:1711,y:1040,w:152,h:152}},{filename:"buttons/sound-button-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:4,y:4,w:152,h:152},frame:{x:1865,y:1147,w:152,h:152}},{filename:"buttons/square-button.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:4,y:6,w:152,h:150},frame:{x:1055,y:1201,w:152,h:150}},{filename:"gameplay/animal-atlas-packed-v1.png",rotated:!1,trimmed:!1,sourceSize:{w:1600,h:1e3},spriteSourceSize:{x:0,y:0,w:1600,h:1e3},frame:{x:1,y:1,w:1600,h:1e3}},{filename:"gameplay/bonus-icons-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:512,h:512},spriteSourceSize:{x:58,y:34,w:429,h:440},frame:{x:1603,y:1,w:429,h:440}},{filename:"hud/available-pairs-sign-imagegen-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:256,h:256},spriteSourceSize:{x:25,y:28,w:202,h:196},frame:{x:1055,y:1003,w:202,h:196}},{filename:"hud/counter-badge.png",rotated:!1,trimmed:!0,sourceSize:{w:300,h:66},spriteSourceSize:{x:4,y:4,w:292,h:60},frame:{x:1e3,y:1353,w:292,h:60}},{filename:"hud/fps-badge.png",rotated:!1,trimmed:!0,sourceSize:{w:180,h:96},spriteSourceSize:{x:6,y:6,w:168,h:83},frame:{x:1294,y:1326,w:168,h:83}},{filename:"hud/powerup-ad-badge-right-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:180,h:84},spriteSourceSize:{x:7,y:7,w:166,h:70},frame:{x:1664,y:1492,w:166,h:70}},{filename:"hud/powerup-count-badge-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:180,h:84},spriteSourceSize:{x:7,y:7,w:166,h:70},frame:{x:1353,y:1531,w:166,h:70}},{filename:"hud/rewarded-video-film-frame-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:7,y:22,w:145,h:116},frame:{x:1292,y:1208,w:145,h:116}},{filename:"hud/selected-panel.png",rotated:!1,trimmed:!0,sourceSize:{w:296,h:367},spriteSourceSize:{x:9,y:9,w:278,h:349},frame:{x:1603,y:689,w:278,h:349}},{filename:"hud/timer-badge.png",rotated:!1,trimmed:!0,sourceSize:{w:360,h:104},spriteSourceSize:{x:4,y:4,w:352,h:96},frame:{x:1,y:1509,w:352,h:96}},{filename:"modals-loading/level-loading-art-628.png",rotated:!1,trimmed:!0,sourceSize:{w:628,h:628},spriteSourceSize:{x:40,y:69,w:577,h:504},frame:{x:1,y:1003,w:577,h:504}},{filename:"modals-loading/level-loading-badge-v2.png",rotated:!1,trimmed:!0,sourceSize:{w:256,h:256},spriteSourceSize:{x:17,y:29,w:233,h:203},frame:{x:1294,y:1003,w:233,h:203}},{filename:"modals-loading/modal-card.png",rotated:!1,trimmed:!0,sourceSize:{w:430,h:252},spriteSourceSize:{x:6,y:4,w:420,h:244},frame:{x:1603,y:443,w:420,h:244}},{filename:"modals-loading/pause-card-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:512,h:360},spriteSourceSize:{x:19,y:6,w:473,h:348},frame:{x:580,y:1003,w:473,h:348}},{filename:"orbit-controls/orbit-arrow-down-floor-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:108,h:92},spriteSourceSize:{x:13,y:8,w:82,h:76},frame:{x:1464,y:1404,w:82,h:76}},{filename:"orbit-controls/orbit-arrow-left-floor-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:260,h:118},spriteSourceSize:{x:9,y:13,w:242,h:92},frame:{x:355,y:1509,w:242,h:92}},{filename:"orbit-controls/orbit-arrow-right-floor-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:260,h:118},spriteSourceSize:{x:9,y:13,w:242,h:92},frame:{x:924,y:1468,w:242,h:92}},{filename:"orbit-controls/orbit-arrow-up-floor-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:108,h:92},spriteSourceSize:{x:12,y:8,w:83,h:76},frame:{x:1464,y:1326,w:83,h:76}},{filename:"pause-menu/pause-close-icon-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:128,h:135},spriteSourceSize:{x:7,y:7,w:114,h:121},frame:{x:1549,y:1352,w:114,h:121}},{filename:"pause-menu/pause-reset-icon-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:128,h:131},spriteSourceSize:{x:7,y:7,w:114,h:117},frame:{x:1548,y:1475,w:114,h:117}},{filename:"pause-menu/pause-restart-icon-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:128,h:139},spriteSourceSize:{x:7,y:7,w:114,h:125},frame:{x:1851,y:1453,w:114,h:125}},{filename:"pause-menu/toggle-arrows-enabled-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:7,y:9,w:147,h:144},frame:{x:1554,y:1206,w:147,h:144}},{filename:"pause-menu/toggle-arrows-icon-v2.png",rotated:!1,trimmed:!0,sourceSize:{w:160,h:160},spriteSourceSize:{x:7,y:8,w:146,h:144},frame:{x:1703,y:1346,w:146,h:144}},{filename:"powerups/powerup-hint-icon-v4.png",rotated:!1,trimmed:!0,sourceSize:{w:128,h:128},spriteSourceSize:{x:23,y:5,w:81,h:118},frame:{x:1209,y:1201,w:81,h:118}},{filename:"powerups/powerup-remove-pair-icon-v4.png",rotated:!1,trimmed:!0,sourceSize:{w:128,h:128},spriteSourceSize:{x:15,y:5,w:98,h:118},frame:{x:1353,y:1411,w:98,h:118}},{filename:"powerups/powerup-shuffle-icon-v4.png",rotated:!1,trimmed:!0,sourceSize:{w:128,h:128},spriteSourceSize:{x:7,y:6,w:113,h:116},frame:{x:1439,y:1208,w:113,h:116}},{filename:"tutorial/tutorial-hand-v1.png",rotated:!1,trimmed:!0,sourceSize:{w:192,h:224},spriteSourceSize:{x:6,y:30,w:180,h:164},frame:{x:1529,y:1040,w:180,h:164}}]}],B0={textures:O0},z0={start:0,duration:1.1},k0={start:1.43,duration:.194},H0={start:1.954,duration:.377},G0={start:2.662,duration:.714},V0={start:3.706,duration:1.292},W0={start:5.327,duration:2.546},X0={start:8.203,duration:1.292},q0={start:9.825,duration:1.135},Y0={start:11.289,duration:1.135},K0={start:12.754,duration:1.135},j0={start:14.219,duration:1.122},$0={start:15.671,duration:2.128},Z0={start:18.129,duration:1.501},J0={button:z0,tileSelect:k0,blockedTile:H0,matchSuccess:G0,hint:V0,levelComplete:W0,levelFailed:X0,matchBreak:q0,removePairBonus:Y0,rotate:K0,shuffle:j0,timerWarning:$0,timeBonus:Z0},Mu=document.querySelector("#game"),yu=document.querySelector("#remaining"),Eu=document.querySelector("#message"),wu=document.querySelector("#selected-tile"),bu=document.querySelector("#selected-tile-preview"),Tu=document.querySelector("#available-pairs"),Au=document.querySelector("#timer"),Ru=document.querySelector("#fps"),Cu=document.querySelector("#score"),Pu=document.querySelector("#combo"),Lu=document.querySelector("#level-number"),Du=document.querySelector("#level-badge-value"),Iu=document.querySelector(".rotate-guide"),Uu=document.querySelector(".zoom-controls"),Nu=document.querySelector("#hint"),Fu=document.querySelector("#shuffle"),Ou=document.querySelector("#ad-remove-pair"),Bu=document.querySelector("#sound-toggle"),zu=document.querySelector("#hint-count"),ku=document.querySelector("#shuffle-count"),Hu=document.querySelector("#remove-pair-count"),Gu=document.querySelector("#pause-game"),Vu=document.querySelector("#level-complete"),Wu=document.querySelector("#level-complete-title"),Xu=document.querySelector("#level-complete-value"),qu=document.querySelector("#next-level"),Yu=document.querySelector("#retry-level"),Ku=document.querySelector("#continue-level"),ju=document.querySelector("#pause-menu"),$u=document.querySelector("#pause-close"),Zu=document.querySelector("#pause-restart"),Ju=document.querySelector("#pause-reset"),Qu=document.querySelector("#pause-arrows-toggle"),eh=document.querySelector("#level-loading"),th=document.querySelector("#loading-status"),nh=document.querySelector("#loading-progress-fill"),ih=document.querySelector("#rotation-gesture-hint"),rh=document.querySelector("#tutorial-hand"),sh=document.querySelector("#shuffle-toast");if(!Mu||!yu||!Eu||!wu||!bu||!Tu||!Au||!Ru||!Cu||!Pu||!Lu||!Du||!Iu||!Uu||!Nu||!Fu||!Ou||!Bu||!zu||!ku||!Hu||!Gu||!Vu||!Wu||!Xu||!qu||!Yu||!Ku||!ju||!$u||!Zu||!Ju||!Qu||!eh||!th||!nh||!ih||!rh||!sh)throw new Error("Game shell is missing required DOM nodes.");const Q0=yu,ev=Eu,Dl=wu,hi=bu,tv=Tu,io=Au,nv=Ru,iv=Cu,rv=Pu,sv=Lu,av=Du,qr=Iu,ov=Uu,$s=Nu,Zs=Fu,Kn=Vu,Io=Wu,Uo=Xu,Js=qu,Qs=Yu,mr=Ku,ea=Ou,ro=Bu,cv=Gu,Os=ju,lv=$u,uv=Zu,hv=Ju,bs=Qu,dv=zu,fv=ku,pv=Hu,so=eh,mv=th,gv=nh,Bs=ih,Ai=rh,ao=sh,xt=1.06,jn=1.06,oo=1.06,ei=1.04,xs=st.degToRad(15),No=new A(0,ei*2,0),zs=new A(6.3,8.1-No.y,10.2),Hr=[{name:"Ash Cat",species:"cat",body:"#879099",accent:"#d2c3ad",mark:"#2b3037"},{name:"Rust Fox",species:"fox",body:"#b95e31",accent:"#f2c27c",mark:"#24262c"},{name:"Slate Dog",species:"dog",body:"#66707c",accent:"#d7b681",mark:"#252931"},{name:"Moon Rabbit",species:"rabbit",body:"#c9c7bd",accent:"#e48e87",mark:"#363842"},{name:"Iron Wolf",species:"wolf",body:"#59636f",accent:"#bfc7c7",mark:"#20252c"},{name:"Black Raven",species:"raven",body:"#252b35",accent:"#6fa7a6",mark:"#d99d3f"},{name:"Jade Lizard",species:"lizard",body:"#4e8d72",accent:"#a8c66c",mark:"#222b28"},{name:"Red Boar",species:"boar",body:"#8a5643",accent:"#c99664",mark:"#2d2525"},{name:"Amber Owl",species:"raven",body:"#6d5c42",accent:"#e2b65d",mark:"#1c1a1b"},{name:"Stripe Badger",species:"boar",body:"#74716a",accent:"#e2dbc6",mark:"#17191d"},{name:"Mask Ferret",species:"cat",body:"#8b7357",accent:"#d7c6a1",mark:"#15191e"},{name:"Thorn Deer",species:"dog",body:"#8a6846",accent:"#d6b477",mark:"#241b17"},{name:"Iron Goat",species:"boar",body:"#948a77",accent:"#cfc0a1",mark:"#24272c"},{name:"Storm Ram",species:"wolf",body:"#6e7881",accent:"#d9c58e",mark:"#1e252c"},{name:"Cinder Bear",species:"boar",body:"#5b4b43",accent:"#bd8754",mark:"#171615"},{name:"Shade Panther",species:"cat",body:"#2b303a",accent:"#6fa7a6",mark:"#d99d3f"},{name:"Frost Lynx",species:"cat",body:"#9fa9ad",accent:"#d8c28a",mark:"#25313a"},{name:"River Otter",species:"lizard",body:"#735b48",accent:"#bfa77e",mark:"#1f2527"},{name:"Needle Hedgehog",species:"boar",body:"#6f6254",accent:"#e0bf75",mark:"#221b19"},{name:"Copper Squirrel",species:"fox",body:"#a55f38",accent:"#f0c27c",mark:"#271a16"},{name:"Night Bat",species:"raven",body:"#34333d",accent:"#9c6fb1",mark:"#171821"},{name:"Mire Frog",species:"lizard",body:"#5f8b5b",accent:"#c4cf75",mark:"#1e2a1f"},{name:"Stone Turtle",species:"lizard",body:"#66715f",accent:"#c1a967",mark:"#222922"},{name:"Ember Snake",species:"lizard",body:"#9c553d",accent:"#e6b05c",mark:"#241a18"},{name:"Marsh Croc",species:"lizard",body:"#536f4d",accent:"#b8c66f",mark:"#1a251b"},{name:"Prism Chameleon",species:"lizard",body:"#4c8b73",accent:"#d2b455",mark:"#1c2a27"},{name:"Gold Eagle",species:"raven",body:"#6c5133",accent:"#dcae50",mark:"#1b1716"},{name:"Ash Falcon",species:"raven",body:"#68707a",accent:"#d7b36a",mark:"#1b2027"},{name:"Tundra Penguin",species:"raven",body:"#2f3942",accent:"#f0d28a",mark:"#edf0df"},{name:"Harbor Seal",species:"dog",body:"#7c8386",accent:"#c8c2ad",mark:"#24292e"},{name:"Tusking Walrus",species:"boar",body:"#8c6751",accent:"#f0dfbf",mark:"#2b1f1d"},{name:"Rust Crab",species:"lizard",body:"#a34f3d",accent:"#e4a35d",mark:"#281715"},{name:"Ink Octopus",species:"lizard",body:"#4b3d65",accent:"#cf8fbd",mark:"#171622"},{name:"Glass Seahorse",species:"lizard",body:"#4f8b93",accent:"#dfc66f",mark:"#17292e"},{name:"Koi Drifter",species:"lizard",body:"#d0c2a5",accent:"#c95c42",mark:"#222528"},{name:"Dust Moth",species:"raven",body:"#796d61",accent:"#d7a957",mark:"#25201d"},{name:"Stag Beetle",species:"lizard",body:"#3f3332",accent:"#b67843",mark:"#151313"},{name:"Glass Scorpion",species:"lizard",body:"#6e8b81",accent:"#e0b45a",mark:"#182522"},{name:"Temple Monkey",species:"cat",body:"#84664d",accent:"#d1a96d",mark:"#251d19"},{name:"Red Panda",species:"fox",body:"#a84f34",accent:"#f1d0a2",mark:"#1e1917"}];let rt=[],$e=null,et=null,co=0,ks=0,Nn=1,lo=0,Qt=360,pn=0,uo=-1,Vr=!1,Xe=0,$n=0,gr=performance.now(),Ya=60,Il=0,it=!1,tt=!1,Hs=!1,ho=!1,zt=[],bi=0,ta="",Je=null,fo=0;const Ts=new Map,cr=new Map;let Hn=1;const Si=new A;let Zn=!1,It=!1,ah=performance.now(),Mi=0,As=8,yi=0,oh=!1,dn=0,Jn=null,_r=!1,po=!1,vr=0,xr=0,lt=null,dt=null;const ch=10*60,_v=5*60,vv=J0,xv=new URL(""+new URL("sfx-sprite-ByGOwJWD.mp3",import.meta.url).href,import.meta.url).href,Sv=`${xv}?v=20260727e`,lh="mahjong-3d-audio-muted-v1",uh="mahjong-3d-rotation-arrows-hidden-v1",Mv={button:.48,tileSelect:1,blockedTile:.46,matchSuccess:.62,hint:.58,levelComplete:.72,levelFailed:.66,matchBreak:.58,removePairBonus:.62,rotate:.42,shuffle:.58,timerWarning:.6,timeBonus:.66};function yv(){try{return window.localStorage.getItem(lh)==="1"}catch{return!1}}function Ev(i){try{window.localStorage.setItem(lh,i?"1":"0")}catch{}}function wv(){try{return window.localStorage.getItem(uh)==="1"}catch{return!1}}function bv(i){try{window.localStorage.setItem(uh,i?"1":"0")}catch{}}class Tv{constructor(){gn(this,"context",null);gn(this,"spriteBuffer",null);gn(this,"spriteLoadPromise",null);gn(this,"activeSources",new Set);gn(this,"music",new Audio(new URL(""+new URL("loop-BIbKzLkZ.mp3",import.meta.url).href,import.meta.url).href));gn(this,"musicPosition",0);gn(this,"mutedByAd",!1);gn(this,"mutedByUser",yv());this.music.loop=!0,this.music.preload="auto",this.music.volume=.28}getContext(){if(this.context)return this.context;const e=window.AudioContext||window.webkitAudioContext;return e?(this.context=new e,this.context):null}loadSprite(){if(this.spriteBuffer)return Promise.resolve(this.spriteBuffer);if(this.spriteLoadPromise)return this.spriteLoadPromise;const e=this.getContext();return e?(this.spriteLoadPromise=fetch(Sv,{cache:"reload"}).then(t=>{if(!t.ok)throw new Error(`Failed to load sound sprite: ${t.status}`);return t.arrayBuffer()}).then(t=>e.decodeAudioData(t)).then(t=>(this.spriteBuffer=t,t)).catch(t=>{throw console.warn(t),this.spriteLoadPromise=null,t}),this.spriteLoadPromise):null}warmup(){this.music.readyState===0&&this.music.load();const e=this.getContext();(e==null?void 0:e.state)==="suspended"&&e.resume(),this.loadSprite()}play(e){if(this.mutedByAd||this.mutedByUser)return;const t=vv[e];if(!t)return;const n=this.getContext(),r=this.loadSprite();!n||!r||r.then(s=>{if(this.mutedByAd)return;n.state==="suspended"&&n.resume();const a=n.createBufferSource(),o=n.createGain();a.buffer=s,o.gain.value=Mv[e],a.connect(o),o.connect(n.destination),this.activeSources.add(a),a.addEventListener("ended",()=>this.activeSources.delete(a),{once:!0}),a.start(0,t.start,t.duration)})}startMusic(){if(!(this.mutedByAd||this.mutedByUser)&&this.music.paused){if(this.music.volume=.28,this.musicPosition>0&&Number.isFinite(this.musicPosition))try{const e=Number.isFinite(this.music.duration)&&this.music.duration>0?this.music.duration:0;this.music.currentTime=e>0?this.musicPosition%e:this.musicPosition}catch{}this.music.play().catch(()=>{})}}pauseMusic(){Number.isFinite(this.music.currentTime)&&(this.musicPosition=this.music.currentTime),this.music.pause()}isUserMuted(){return this.mutedByUser}setUserMuted(e,t){this.mutedByUser=e,Ev(e),e?(this.pauseMusic(),this.stopActiveSfx()):t&&this.startMusic()}toggleUserMuted(e){return this.setUserMuted(!this.mutedByUser,e),this.mutedByUser}stopActiveSfx(){this.activeSources.forEach(e=>{try{e.stop()}catch{}}),this.activeSources.clear()}muteForAd(){this.mutedByAd=!0,this.pauseMusic(),this.stopActiveSfx()}unmuteAfterAd(e){this.mutedByAd=!1,e&&this.startMusic()}}const Ve=new Tv;function hh(){const i=Ve.isUserMuted();ro.classList.toggle("is-muted",i),ro.setAttribute("aria-label",i?"Увімкнути звук":"Вимкнути звук")}let Ei=wv();function dh(){qr.classList.toggle("controls-hidden",Ei),bs.classList.toggle("is-off",Ei),bs.setAttribute("aria-pressed",String(Ei)),bs.setAttribute("aria-label",Ei?"Show rotation arrows":"Hide rotation arrows")}function Av(){Ei=!Ei,bv(Ei),dh()}const tn=[{width:3,height:3,layers:4,time:210,shape:"starterCubeFaces"},{width:4,height:4,layers:4,time:240,shape:"windmill"},{width:4,height:3,layers:4,time:270,shape:"compact"},{width:4,height:4,layers:4,time:270,shape:"terraceCube",variant:1},{width:5,height:5,layers:3,time:300,shape:"canyon"},{width:5,height:5,layers:4,time:330,shape:"crown"},{width:6,height:4,layers:4,time:360,shape:"twinTowers"},{width:5,height:5,layers:5,time:390,shape:"checkerStack"},{width:6,height:5,layers:4,time:420,shape:"windmill"},{width:5,height:5,layers:5,time:450,shape:"notchedCube",variant:2},{width:6,height:5,layers:5,time:480,shape:"balcony"},{width:6,height:6,layers:4,time:510,shape:"splitCube",variant:1},{width:6,height:6,layers:5,time:540,shape:"arch",variant:1},{width:6,height:6,layers:5,time:570,shape:"diagonal",variant:1},{width:7,height:5,layers:5,time:600,shape:"bridge"},{width:6,height:6,layers:6,time:630,shape:"canyon",variant:1},{width:7,height:6,layers:5,time:660,shape:"twinTowers",variant:1},{width:7,height:7,layers:5,time:690,shape:"ring"},{width:7,height:7,layers:5,time:720,shape:"windmill",variant:1},{width:7,height:7,layers:6,time:750,shape:"crown",variant:1},{width:7,height:7,layers:6,time:780,shape:"checkerStack",variant:1},{width:8,height:6,layers:5,time:810,shape:"fortress"},{width:7,height:7,layers:6,time:840,shape:"balcony",variant:1},{width:8,height:6,layers:6,time:870,shape:"coreCube",variant:1},{width:8,height:8,layers:5,time:900,shape:"arch",variant:2},{width:8,height:8,layers:6,time:930,shape:"diagonal",variant:2},{width:8,height:8,layers:6,time:960,shape:"canyon",variant:2},{width:8,height:8,layers:6,time:990,shape:"crown",variant:2},{width:8,height:8,layers:7,time:1020,shape:"twinTowers",variant:2},{width:8,height:8,layers:7,time:1080,shape:"windmill",variant:2},{width:8,height:7,layers:7,time:1110,shape:"spiral",variant:1},{width:9,height:7,layers:6,time:1140,shape:"fortress",variant:1},{width:8,height:8,layers:7,time:1170,shape:"splitCube",variant:2},{width:9,height:7,layers:7,time:1200,shape:"balcony",variant:2},{width:9,height:8,layers:6,time:1230,shape:"ring",variant:1},{width:8,height:8,layers:8,time:1260,shape:"checkerStack",variant:2},{width:9,height:8,layers:7,time:1290,shape:"diagonal",variant:3},{width:9,height:9,layers:6,time:1320,shape:"arch",variant:3},{width:9,height:9,layers:7,time:1350,shape:"coreCube",variant:2},{width:9,height:9,layers:8,time:1380,shape:"crown",variant:3}],fh="mahjong-3d-progress-v2",ph="mahjong-3d-current-level-v1",mh="mahjong-3d-powerups-v1",gi={hint:2,shuffle:2,removePair:2};let Gn={...gi};function Rv(){try{const i=window.localStorage.getItem(fh);if(!i)return 0;const e=Number.parseInt(i,10);return Number.isFinite(e)?st.clamp(e,0,tn.length-1):0}catch{return 0}}function gh(){try{window.localStorage.setItem(fh,String($n))}catch{}}function Cv(i){try{const e=window.localStorage.getItem(ph);if(!e)return 0;const t=Number.parseInt(e,10);return Number.isFinite(t)?st.clamp(t,0,i):0}catch{return 0}}function _h(){try{window.localStorage.setItem(ph,String(Xe))}catch{}}function Pv(){try{const i=window.localStorage.getItem(mh);if(!i)return{...gi};const e=JSON.parse(i);return{hint:Math.max(0,Math.floor(Number(e.hint??gi.hint))),shuffle:Math.max(0,Math.floor(Number(e.shuffle??gi.shuffle))),removePair:Math.max(0,Math.floor(Number(e.removePair??gi.removePair)))}}catch{return{...gi}}}function Gs(){try{window.localStorage.setItem(mh,JSON.stringify(Gn))}catch{}}function Lv(){$n=0,Xe=0,Gn={...gi},gh(),_h(),Gs(),Wr()}function Wr(){[["hint",dv,$s],["shuffle",fv,Zs],["removePair",pv,ea]].forEach(([e,t,n])=>{const r=Gn[e];t.textContent=r>0?String(r):"",n.classList.toggle("needs-ad",r<=0),n.setAttribute("data-count",String(r))})}function Dv(i){const e=i==="hint"?$s:i==="shuffle"?Zs:ea;e.classList.remove("powerup-gained"),e.offsetWidth,e.classList.add("powerup-gained"),window.setTimeout(()=>e.classList.remove("powerup-gained"),980)}function Iv(i){Gn[i]+=1,Gs(),Wr(),Dv(i)}function Uv(i){return i==="time"?io.closest(".timer-badge")??io:i==="hint"?$s:i==="shuffle"?Zs:ea}function Nv(i){const e=i.clone();ot.localToWorld(e);const t=e.project(De);return{x:st.clamp((t.x*.5+.5)*window.innerWidth,24,window.innerWidth-24),y:st.clamp((-t.y*.5+.5)*window.innerHeight,24,window.innerHeight-24)}}function Ul(i,e,t,n){const r=Uv(i),s=r.getBoundingClientRect(),a=Nv(e),o={x:s.left+s.width/2,y:s.top+s.height/2},c=document.createElement("span");c.className=`bonus-fly-token bonus-fly-token-${i}`,c.textContent=t,c.style.left=`${a.x}px`,c.style.top=`${a.y}px`,c.style.setProperty("--bonus-fly-dx",`${o.x-a.x}px`),c.style.setProperty("--bonus-fly-dy",`${o.y-a.y}px`),document.body.appendChild(c);let l=!1;const u=()=>{l||(l=!0,c.remove(),r.classList.add("bonus-target-hit"),window.setTimeout(()=>r.classList.remove("bonus-target-hit"),420),n())};c.addEventListener("animationend",u,{once:!0}),window.setTimeout(u,1100)}async function Fo(i){return Gn[i]>0?(Gn[i]-=1,Gs(),Wr(),!0):(qe("Подивись рекламу, щоб додати заряд."),await Th()?(Gn[i]+=1,Gs(),Wr(),Ni(),qe("Заряд додано. Натисни кнопку ще раз."),!1):(qe("Реклама не завершилась. Заряд не додано."),!1))}function Fv(){const i=Math.min(tn.length-1,Xe+1);i<=$n||($n=i,gh())}$n=Rv();Gn=Pv();Wr();Xe=Cv($n);const ti=new R0;ti.background=null;ti.fog=new Po(1383202,12,30);const De=new Kt(42,window.innerWidth/window.innerHeight,.1,100);De.position.copy(No).add(zs);const vt=new A0({canvas:Mu,antialias:!0,alpha:!0});vt.setPixelRatio(Math.min(window.devicePixelRatio,1.5));vt.setSize(window.innerWidth,window.innerHeight);vt.setClearColor(0,0);vt.shadowMap.enabled=!1;const ze=new N0(De,vt.domElement);ze.enableDamping=!0;ze.dampingFactor=.08;ze.enableRotate=!1;ze.minDistance=6;ze.maxDistance=20;ze.minPolarAngle=0;ze.maxPolarAngle=Math.PI;ze.target.copy(No);ze.addEventListener("start",()=>Oi());const Nl=new I0,Ka=new we,ot=new xi;ti.add(ot);const vh=new Su(15778923,3.2);vh.position.set(4,8,6);ti.add(vh);ti.add(new C0(8960189,2435889,1.7));const xh=new Su(5809818,1.5);xh.position.set(-3,-7,-4);ti.add(xh);const Sh=new L0(14195514,1.1,18);Sh.position.set(0,-3.2,0);ti.add(Sh);function Oo(i,e){const t=document.createElement("canvas");t.width=256,t.height=256;const n=t.getContext("2d");if(!n)throw new Error("Canvas 2D context unavailable.");n.clearRect(0,0,t.width,t.height),n.lineCap="round",n.lineJoin="round",n.strokeStyle=e,n.lineWidth=14,n.globalAlpha=.45,n.strokeRect(23,23,210,210),n.globalAlpha=1,n.strokeStyle=i,n.lineWidth=8;const r=52,s=26;n.beginPath(),n.moveTo(s,s+r),n.lineTo(s,s),n.lineTo(s+r,s),n.moveTo(256-s-r,s),n.lineTo(256-s,s),n.lineTo(256-s,s+r),n.moveTo(256-s,256-s-r),n.lineTo(256-s,256-s),n.lineTo(256-s-r,256-s),n.moveTo(s+r,256-s),n.lineTo(s,256-s),n.lineTo(s,256-s-r),n.stroke(),n.strokeStyle="rgba(28, 36, 42, 0.28)",n.lineWidth=2,n.strokeRect(38,38,180,180);const a=new Lo(t);return a.colorSpace=Yt,a}const Bo=new F0(xt*.98,oo*.98,jn*.98,5,.1),Ov=new Ii(xt*.94,xt*.94),zo=new jt({color:16777215}),Mh=new jt({color:13621471}),Vs=new jt({color:16768085}),yh=new jt({color:14155764}),na=new jt({map:Oo("rgba(28, 36, 42, 0.24)","rgba(0, 0, 0, 0)"),transparent:!0,opacity:.35,toneMapped:!1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2}),ko=new jt({map:Oo("rgba(76, 225, 218, 0.98)","rgba(76, 225, 218, 0.68)"),transparent:!0,toneMapped:!1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-3}),Ho=new jt({map:Oo("rgba(192, 145, 255, 0.98)","rgba(192, 145, 255, 0.62)"),transparent:!0,toneMapped:!1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-3}),Go=new Set([zo,Mh,Vs,yh,na,ko,Ho]),ia=new Set([na.map,ko.map,Ho.map].filter(i=>!!i)),wn=new A(0,ei*2,0),mo=new Map,Bv=new URL(""+new URL("line-PUY5SQyk.png",import.meta.url).href,import.meta.url).href,zv=B0,kv=zv.textures[0],go=new Map;kv.frames.forEach(i=>{go.set(i.filename,i);const e=i.filename.split(/[\\/]/).pop();e&&go.set(e,i)});const Ss=8,Fl=5,Ol=0,Hv=5;let Ms=null,Ir=null,ln=null,Bn=null,Ur=null,Nr=null;const ys=[{offset:new A(0,xt*.492,0),rotation:new Ot(-Math.PI/2,0,0),neighbor:[0,0,1]},{offset:new A(0,-xt*.492,0),rotation:new Ot(Math.PI/2,0,Math.PI),neighbor:[0,0,-1]},{offset:new A(0,0,xt*.492),rotation:new Ot(0,0,0),neighbor:[0,1,0]},{offset:new A(0,0,-xt*.492),rotation:new Ot(0,Math.PI,0),neighbor:[0,-1,0]},{offset:new A(xt*.492,0,0),rotation:new Ot(0,Math.PI/2,0),neighbor:[1,0,0]},{offset:new A(-xt*.492,0,0),rotation:new Ot(0,-Math.PI/2,0),neighbor:[-1,0,0]}];function Br(i,e){De.updateMatrixWorld();const t=new on().setFromAxisAngle(new A(0,1,0),i),n=new A().setFromMatrixColumn(De.matrixWorld,0).normalize(),r=new on().setFromAxisAngle(n,e),s=Wv();ot.position.sub(s).applyQuaternion(t).applyQuaternion(r).add(s),ot.quaternion.premultiply(t).premultiply(r),ot.updateMatrixWorld(!0)}function Gv(i,e){Br(i*.0058,e*.0058)}function _o(i,e=!0){["left","right","up","down"].includes(i)&&(e&&Ve.play("rotate"),i==="left"&&Br(xs,0),i==="right"&&Br(-xs,0),i==="up"&&Br(0,-xs),i==="down"&&Br(0,xs))}function vo(i){Oi();const e=De.position.clone().sub(ze.target),t=e.length(),n=i==="in"?.86:1.16,r=st.clamp(t*n,ze.minDistance,ze.maxDistance);e.setLength(r),De.position.copy(ze.target).add(e),De.lookAt(ze.target),ze.update()}function Vv(){const i=window.innerWidth,e=window.innerHeight;return i<e?{left:14,right:Math.max(i*.62,i-(i<=480?88:106)),top:Math.min(124,Math.max(92,e*.12)),bottom:e-Math.min(116,Math.max(88,e*.11))}:{left:Math.min(72,i*.06),right:i-Math.min(142,i*.12),top:Math.min(82,e*.13),bottom:e-Math.min(104,e*.16)}}function Bl(i,e){const t=new on().setFromAxisAngle(new A(0,1,0),i);ot.quaternion.copy(t),ot.position.copy(e).sub(e.clone().applyQuaternion(t)),ot.updateMatrixWorld(!0)}function xo(){return ot.updateMatrixWorld(!0),new yr().setFromObject(ot)}function Eh(i){const{min:e,max:t}=i;return[new A(e.x,e.y,e.z),new A(e.x,e.y,t.z),new A(e.x,t.y,e.z),new A(e.x,t.y,t.z),new A(t.x,e.y,e.z),new A(t.x,e.y,t.z),new A(t.x,t.y,e.z),new A(t.x,t.y,t.z)]}function zl(i,e,t){De.updateMatrixWorld(!0);const n=new A().setFromMatrixColumn(De.matrixWorld,0).normalize(),r=new A().setFromMatrixColumn(De.matrixWorld,1).normalize(),s=new A().setFromMatrixColumn(De.matrixWorld,2).negate().normalize();let a=0,o=0,c=0;Eh(i).forEach(m=>{const g=m.sub(e);a=Math.max(a,Math.abs(g.dot(n))),o=Math.max(o,Math.abs(g.dot(r))),c=Math.max(c,Math.abs(g.dot(s)))});const l=Math.max(.35,(t.right-t.left)/window.innerWidth),u=Math.max(.35,(t.bottom-t.top)/window.innerHeight),h=Math.tan(st.degToRad(De.fov*.5)),d=h*De.aspect;return(Math.max(a/(d*l),o/(h*u))+c)*1.06}function wh(){ot.quaternion.identity(),ot.position.set(0,0,0),ot.updateMatrixWorld(!0),Si.set(0,0,0);const i=wn.clone(),e=Vv(),t=zs.clone().normalize();if(De.up.set(0,1,0),De.position.copy(i).add(t.clone().multiplyScalar(10)),De.lookAt(i),De.updateMatrixWorld(!0),window.innerWidth<window.innerHeight){const h=[0,-Math.PI/12,Math.PI/12,-Math.PI/6,Math.PI/6,-Math.PI/4,Math.PI/4];let d=0,m=Number.POSITIVE_INFINITY;h.forEach(g=>{Bl(g,i);const v=zl(xo(),i,e);v<m&&(m=v,d=g)}),Bl(d,i)}const n=zl(xo(),i,e),r=st.clamp(n,ze.minDistance,ze.maxDistance);De.position.copy(i).add(t.multiplyScalar(r)),De.lookAt(i),De.updateMatrixWorld(!0);const s=2*r*Math.tan(st.degToRad(De.fov*.5))/window.innerHeight,a=(e.left+e.right)*.5,o=Xe===0&&window.innerWidth<window.innerHeight,c=(e.top+e.bottom)*.5-(o?window.innerHeight*.12:0),l=new A().setFromMatrixColumn(De.matrixWorld,0).normalize(),u=new A().setFromMatrixColumn(De.matrixWorld,1).normalize();Si.addScaledVector(l,-(a-window.innerWidth*.5)*s).addScaledVector(u,(c-window.innerHeight*.5)*s),ze.target.copy(i).add(Si),De.position.add(Si),De.lookAt(ze.target),ze.update()}function kl(i){if(!i)return ze.target.clone();if(i.mesh){const e=new A;return i.mesh.getWorldPosition(e),e}return new A(i.x*xt,i.z*ei,i.y*jn).multiplyScalar(Hn)}function Wv(){const i=new A,e=new A;let t=0;return rt.forEach(n=>{!n.active||!n.mesh||(n.mesh.getWorldPosition(e),i.add(e),t+=1)}),t>0?i.multiplyScalar(1/t):ze.target.clone()}function Xv(i){const e=kl(i[0]).add(kl(i[1])).multiplyScalar(.5),t=wn.clone().lerp(e,.14).add(Si),n=e.clone().sub(wn).setY(0);n.lengthSq()<.08&&n.set(zs.x,0,zs.z),n.normalize();const r=De.position.distanceTo(ze.target),s=st.clamp(r*.65,ze.minDistance*.82,ze.maxDistance*.64),a=r*.45;ze.target.copy(t),De.up.set(0,1,0),De.position.copy(t).add(n.multiplyScalar(s)).add(new A(0,a,0)),De.lookAt(ze.target),ze.update()}function Vo(i=!1){const e=rt.filter(n=>n.active);if(e.length===0)return;wn.set(0,0,0),ot.updateMatrixWorld(!0);const t=new A;if(e.forEach(n=>{if(n.mesh){n.mesh.getWorldPosition(t),wn.add(t);return}wn.add(new A(n.x*xt,n.z*ei,n.y*jn).multiplyScalar(Hn))}),wn.multiplyScalar(1/e.length),i){const n=wn.clone().add(Si),r=n.clone().sub(ze.target);ze.target.copy(n),De.position.add(r),ze.update()}}function qv(i,e,t,n){const r=e-(i.width-1)/2,s=t-(i.height-1)/2,a=Math.abs(r),o=Math.abs(s),c=(i.width-1)/2,l=(i.height-1)/2,u=e===0||t===0||e===i.width-1||t===i.height-1,h=(e<=1||e>=i.width-2)&&(t<=1||t>=i.height-2),d=i.variant??0;switch(i.shape){case"compact":return!0;case"notchedCube":{const m=n%2===0?0:1+(d>1&&n>2?1:0),g=e<=m,v=e>=i.width-1-m,p=t<=m,f=t>=i.height-1-m,w=d%2===0?g&&p||v&&f:v&&p||g&&f,y=n>1&&(g&&f&&(n+d)%3===0||v&&p&&(n+d)%3===1);return!w&&!y}case"terraceCube":{const m=Math.floor(n/2),g=n<=1&&a<=c&&o<=l,v=e>=m&&t>=m&&e<i.width-m&&t<i.height-m,p=n>0&&n%2===1&&(Math.abs(r)<=.5||Math.abs(s)<=.5);return g||v||p}case"starterCubeFaces":return n<=2||n===3&&e===1&&t===1;case"coreCube":{const m=n<=1||u,g=a<=Math.max(.5,c-2)&&o<=Math.max(.5,l-2),v=(e===1||e===i.width-2||t===1||t===i.height-2)&&(n+d)%2===0;return m||g||v}case"splitCube":{const m=i.width%2===0?e===i.width/2-1||e===i.width/2:r===0,g=i.height%2===0?t===i.height/2-1||t===i.height/2:s===0,v=n%2===0&&(Math.abs(r)<=.5||Math.abs(s)<=.5),p=n>=i.layers-2&&(a<=c-1||o<=l-1);return!m&&!g||v||p}case"arch":{const m=i.width<=5&&d===0?0:1,g=e<=m||e>=i.width-1-m,v=n>=i.layers-2&&t>=Math.floor(i.height/2)-1,p=d>0&&n<=1&&t===i.height-1,f=n<=Math.max(1,d)&&(t===0||a<=.5);return g||v||p||f}case"canyon":{const m=d>1?1.5:.5,g=a<=m&&t>0&&t<i.height-1&&n>0,v=e<=1||e>=i.width-2,p=n<=1,f=n>=i.layers-2&&(d%2===0&&Math.abs(s)<=.5||d%2===1&&t%2===0);return!g&&(p||v||f||u)}case"crown":{const m=n<=1,g=u&&n<=i.layers-2,v=d>1?2:3,p=n>=i.layers-3&&u&&((e+t+d)%v===0||h),f=a<=.5&&o<=.5&&n>=2;return m||g||p||f}case"diagonal":{const m=Math.abs(e-t-(d-1))<=1,g=d>0&&Math.abs(e+t-(i.width-1))<=1,v=n<=1&&(u||m||g),p=n>1&&(m||d>1&&g),f=e<=1&&t>=i.height-2||e>=i.width-2&&t<=1;return v||p||f}case"twinTowers":{const m=d>1?2:1,g=e<=m&&(t<=m||t>=i.height-1-m||d>0),v=e>=i.width-1-m&&(t<=m||t>=i.height-1-m||d>0),p=n<=1&&(u||o<=.5),f=n>=i.layers-2&&Math.abs(s)<=(d>0?1.5:.5),w=d>1&&n%2===0&&(t===1||t===i.height-2);return g||v||p||f||w}case"checkerStack":{const m=n<=1,g=(e+t+n+d)%2===0,v=(e+t+d)%3===0,p=n>=i.layers-2&&(u||a<=.5||o<=.5);return m||p||g||v}case"windmill":{const m=a<=.5&&o<=.5,g=e>=Math.floor(i.width/2)&&t===Math.floor(i.height/2)||e<=Math.floor(i.width/2)&&t===Math.ceil(i.height/2)-1||t>=Math.floor(i.height/2)&&e===Math.ceil(i.width/2)-1||t<=Math.floor(i.height/2)&&e===Math.floor(i.width/2),v=d>0&&n%2===1?!(e<=1&&t<=1)&&!(e>=i.width-2&&t>=i.height-2):!0,p=n<=1&&(g||h||m),f=n>1&&g&&v;return p||f||m}case"balcony":{const m=t>=Math.floor(i.height/2)||n<=1,g=n%2===0&&e<=1&&t<i.height-1,v=n%2===1&&e>=i.width-2&&t>0,p=d>0&&n<=2&&t<=1&&(e+n)%2===0,f=n>=i.layers-2&&(a<=c-1||t>=i.height-2);return m||g||v||p||f}case"cross":return a<=.5||o<=.5||n===0&&a<=1.5&&o<=1.5;case"stairs":{const m=Math.min(i.width,2+n),g=Math.min(i.height,2+n);return e<m&&t<g}case"ring":return u||n>0&&(a<=.5||o<=.5);case"pyramid":{const m=Math.max(1,Math.floor(Math.max(c,l))-Math.floor(n/1.15));return a<=m&&o<=m&&(n===0||a+o<=m+1)}case"towers":return h||n<=1&&(Math.abs(s)<=.5||Math.abs(r)<=.5);case"diamond":{const m=Math.max(2,Math.floor(c+l)-n);return a+o<=m}case"bridge":{const m=e<=1||e>=i.width-2,g=n>=i.layers-2&&Math.abs(s)<=.5,v=n<=1&&(t===0||t===i.height-1);return m||g||v}case"spiral":return n===0?u||e===1&&t<=i.height-2:n===1?e>=1&&t===1||e===i.width-2&&t<=i.height-2||t===i.height-2&&e>=1:n===2?e>=2&&e<=i.width-3&&t===2||e===2&&t>=2&&t<=i.height-3:a<=.5||o<=.5;case"fortress":{const m=h,g=n<=1&&u,v=a<=1&&o<=1&&n>=1,p=n===2&&a<=c&&o<=.5;return m||g||v||p}default:return!0}}function Yv(i){const e=[];let t=0;const n=Math.floor(i.layers/2);for(let r=0;r<i.layers;r+=1)for(let s=0;s<i.width;s+=1)for(let a=0;a<i.height;a+=1){const o=s-(i.width-1)/2,c=a-(i.height-1)/2;i.width%2===1&&i.height%2===1&&i.layers%2===1&&o===0&&c===0&&r===n||qv(i,s,a,r)&&e.push({id:t++,x:o,y:c,z:r})}return e.length%2===1&&e.pop(),e}function Wo(i){const e=[...i];for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function So(i){if(i.length<2)return[...i];for(let e=0;e<16;e+=1){const t=Wo(i);if(t.every((n,r)=>n!==i[r]))return t}return i.map((e,t)=>i[(t+1)%i.length])}function Ui(){return typeof window<"u"&&window.PokiSDK?window.PokiSDK:null}async function Kv(){const i=Ui();if(i!=null&&i.init)try{await Promise.race([i.init(),new Promise(e=>window.setTimeout(e,1500))])}catch(e){console.warn("PokiSDK.init failed",e)}}function jv(){var i,e;try{(e=(i=Ui())==null?void 0:i.gameLoadingFinished)==null||e.call(i)}catch(t){console.warn("PokiSDK.gameLoadingFinished failed",t)}}function $v(i=!1){var e,t;if(!(Zn&&!i)){Zn=!0,ra()&&Ve.startMusic();try{(t=(e=Ui())==null?void 0:e.gameplayStart)==null||t.call(e)}catch(n){console.warn("PokiSDK.gameplayStart failed",n)}}}function wr(){var i,e;if(Zn){Zn=!1,Ve.pauseMusic();try{(e=(i=Ui())==null?void 0:i.gameplayStop)==null||e.call(i)}catch(t){console.warn("PokiSDK.gameplayStop failed",t)}}}function ra(){return document.visibilityState==="visible"&&document.hasFocus()}function sa(){if(!ra()){Ve.pauseMusic();return}Zn&&!it&&!tt&&!It&&Ve.startMusic()}function Ni(){it||(Ve.warmup(),$v(),sa())}function bh(i=.5){var e,t;try{(t=(e=Ui())==null?void 0:e.happyTime)==null||t.call(e,i)}catch(n){console.warn("PokiSDK.happyTime failed",n)}}async function Yr(){if(It)return!1;const i=Ui();if(!(i!=null&&i.commercialBreak))return!0;It=!0,wr(),Ve.muteForAd();try{return await i.commercialBreak(),!0}catch(e){return console.warn("PokiSDK.commercialBreak failed",e),!0}finally{It=!1,Ve.unmuteAfterAd(Zn&&!it&&ra())}}async function Th(){if(It)return!1;const i=Ui();if(!(i!=null&&i.rewardedBreak))return!0;It=!0,wr(),Ve.muteForAd();try{return await i.rewardedBreak()===!0}catch(e){return console.warn("PokiSDK.rewardedBreak failed",e),!1}finally{It=!1,Ve.unmuteAfterAd(Zn&&!it&&ra())}}function Zv(){const i=Yv(tn[Xe]),e=i.length/2,t=Xe>0&&i.length>=8?2:0,n=e-t/2,r=Qv(),s=Jv(Xe),a=Wo(Array.from({length:n},(l,u)=>s[u%s.length]).flatMap(l=>[l,l])),o=t>0?ex(i):new Set;let c=0;return i.map(l=>{const u=o.has(l.id);return{...l,kind:u?"bonus":"animal",animal:u?Hr[0]:a[c++],bonus:u?r:void 0,active:!0}})}function Jv(i){const e=[8,10,12,16,18,20,22,24],t=e[Math.min(i,e.length-1)]??Hr.length;return Hr.slice(0,Math.min(t,Hr.length))}function Qv(){const i=["time","hint","shuffle","removePair"];return i[Xe%i.length]}function ex(i){const e=(tn[Xe].width-1)/2,t=(tn[Xe].height-1)/2,n=(u,h,d,m)=>i.some(g=>g.x===u.x+h&&g.y===u.y+d&&g.z===u.z+m),r=u=>[!n(u,-1,0,0),!n(u,1,0,0),!n(u,0,-1,0),!n(u,0,1,0),!n(u,0,0,-1),!n(u,0,0,1)].filter(Boolean).length,s=i.filter(u=>{const h=r(u);return h>0&&h<3}),o=[...s.length>=2?s:i].sort((u,h)=>{const d=u.z*6-Math.abs(u.x-e)-Math.abs(u.y-t);return h.z*6-Math.abs(h.x-e)-Math.abs(h.y-t)-d}),c=o[0],l=o.find(u=>c&&(u.x!==c.x||u.y!==c.y||u.z!==c.z))??o[1];return new Set([c==null?void 0:c.id,l==null?void 0:l.id].filter(u=>typeof u=="number"))}function Ah(i,e,t=Xe){const n=Math.max(i.width,i.height),r=e>240?.68:e>180?.74:e>130?.84:1,s=n>=11?.74:n>=10?.8:n>=9?.86:1,a=window.innerWidth/Math.max(1,window.innerHeight),o=a<.82?st.clamp(a/.82,.78,1):1,c=t===0?.9:1;return Math.min(r,s)*o*c}function tx(){const i=document.createElement("canvas");i.width=256,i.height=256;const e=i.getContext("2d");if(!e)throw new Error("Canvas 2D context unavailable.");return e.fillStyle="#ffffff",e.fillRect(0,0,256,256),e.fillStyle="#eef5f0",e.beginPath(),e.roundRect(28,28,200,200,32),e.fill(),e.fillStyle="#cfe8df",e.beginPath(),e.roundRect(88,88,80,80,28),e.fill(),i}function Rh(i){if(!ln)return tx();const e=document.createElement("canvas");e.width=256,e.height=256;const t=e.getContext("2d");if(!t)throw new Error("Canvas 2D context unavailable.");const n=Math.max(0,Hr.findIndex(le=>le.name===i.name)),r=n%Ss,s=Math.floor(n/Ss),a=Math.round(r*ln.naturalWidth/Ss),o=Math.round(s*ln.naturalHeight/Fl),c=Math.round((r+1)*ln.naturalWidth/Ss),l=Math.round((s+1)*ln.naturalHeight/Fl),u=Math.min(Ol,(c-a)*.12),h=Math.min(Ol,(l-o)*.12),d=a+u,m=o+h,g=c-a-u*2,v=l-o-h*2,p=document.createElement("canvas");p.width=g,p.height=v;const f=p.getContext("2d");if(!f)throw new Error("Canvas 2D context unavailable.");f.drawImage(ln,d,m,g,v,0,0,g,v);const w=f.getImageData(0,0,g,v).data;let y=g,T=v,O=-1,C=-1;for(let le=0;le<v;le+=1)for(let Te=0;Te<g;Te+=1){const ke=(le*g+Te)*4,Y=w[ke],ee=w[ke+1],de=w[ke+2];w[ke+3]<12||Y>244&&ee>244&&de>244||(y=Math.min(y,Te),T=Math.min(T,le),O=Math.max(O,Te),C=Math.max(C,le))}const R=O>=y&&C>=T,N=2,E=R?Math.max(0,y-N):0,M=R?Math.max(0,T-N):0,L=R?Math.min(g,O+N+1):g,X=R?Math.min(v,C+N+1):v,z=L-E,q=X-M;t.fillStyle="#ffffff",t.fillRect(0,0,e.width,e.height),t.filter="contrast(1.04) saturate(1.04)";const K=Hv,V=Math.min((e.width-K*2)/z,(e.height-K*2)/q),Q=z*V,W=q*V,ce=(e.width-Q)/2,he=(e.height-W)/2;return t.drawImage(p,E,M,z,q,ce,he,Q,W),t.filter="none",ix(t,e.width,e.height),e}function nx(i,e,t,n){return n<12?!0:i>240&&e>240&&t>240}function ix(i,e,t){const n=i.getImageData(0,0,e,t),{data:r}=n,s=new Uint8Array(e*t),a=[],o=(c,l)=>{if(c<0||l<0||c>=e||l>=t)return;const u=l*e+c;if(s[u])return;const h=u*4;nx(r[h],r[h+1],r[h+2],r[h+3])&&(s[u]=1,a.push(u))};for(let c=0;c<e;c+=1)o(c,0),o(c,t-1);for(let c=0;c<t;c+=1)o(0,c),o(e-1,c);for(let c=0;c<a.length;c+=1){const l=a[c],u=l%e,h=Math.floor(l/e);o(u+1,h),o(u-1,h),o(u,h+1),o(u,h-1)}for(let c=0;c<s.length;c+=1)s[c]&&(r[c*4+3]=0);i.putImageData(n,0,0)}function rx(i,e,t,n){if(n<16)return!0;const r=Math.max(i,e,t),s=Math.min(i,e,t),a=r===0?0:(r-s)/r,o=(i+e+t)/3;return i>202&&e>170&&t>118&&a<.44||o>188&&a<.3}function sx(i){const e=Rh(i),t=document.createElement("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");if(!n)throw new Error("Canvas 2D context unavailable.");n.drawImage(e,0,0);const r=n.getImageData(0,0,t.width,t.height),{data:s}=r,a=new Uint8Array(t.width*t.height),o=[],c=(l,u)=>{if(l<0||u<0||l>=t.width||u>=t.height)return;const h=u*t.width+l;if(a[h])return;const d=h*4;rx(s[d],s[d+1],s[d+2],s[d+3])&&(a[h]=1,o.push(h))};for(let l=0;l<t.width;l+=1)c(l,0),c(l,t.height-1);for(let l=0;l<t.height;l+=1)c(0,l),c(t.width-1,l);for(let l=0;l<o.length;l+=1){const u=o[l],h=u%t.width,d=Math.floor(u/t.width);c(h+1,d),c(h-1,d),c(h,d+1),c(h,d-1)}for(let l=0;l<a.length;l+=1){if(!a[l])continue;const u=l*4;s[u+3]=0}return n.putImageData(r,0,0),t}function ax(i){const e=new Lo(Rh(i));return e.colorSpace=Yt,e.anisotropy=vt.capabilities.getMaxAnisotropy(),e}function ox(i){return i==="time"?"#8f45c9":i==="hint"?"#ffd85a":i==="shuffle"?"#55c7e9":"#ef78c7"}function cx(i,e,t,n,r){if(Bn){const s=e==="time"?0:e==="hint"?1:e==="shuffle"?2:3,a=s%2,o=Math.floor(s/2),c=Bn.naturalWidth/2,l=Bn.naturalHeight/2;i.drawImage(Bn,a*c,o*l,c,l,t,n,r,r);return}i.fillStyle="rgba(255,255,255,0.94)",i.beginPath(),i.arc(t+r/2,n+r/2,r*.34,0,Math.PI*2),i.fill()}function Ch(i,e){const t=document.createElement("canvas");t.width=256,t.height=256;const n=t.getContext("2d");if(!n)throw new Error("Canvas 2D context unavailable.");const r=Math.max(0,Math.ceil(e)),s=ox(i);return n.fillStyle=s,n.fillRect(0,0,256,256),n.fillStyle="rgba(255,255,255,0.86)",n.fillRect(18,18,220,220),n.fillStyle=s,n.fillRect(28,28,200,200),cx(n,i,50,34,156),n.fillStyle=r>0?"#26163a":"#7b1734",n.fillRect(42,190,172,42),n.fillStyle="#ffffff",n.font="900 35px Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(Yo(r),128,212),t}function lx(i,e){const t=new Lo(Ch(i,e));return t.colorSpace=Yt,t.anisotropy=vt.capabilities.getMaxAnisotropy(),t}function Xo(i){return i.kind==="bonus"?lx(i.bonus??"time",pn):ax(i.animal)}function ux(i){const e=mo.get(i.name);if(e)return e;const t=sx(i).toDataURL("image/png");return mo.set(i.name,t),t}function hx(i){return i.kind==="bonus"?Ch(i.bonus??"time",pn).toDataURL("image/png"):ux(i.animal)}function dx(){if(Ms)return Promise.resolve(Ms);if(Ir)return Ir;const i=new Image;return Ir=new Promise(e=>{i.onload=()=>{Ms=i,e(i)},i.onerror=()=>{Ms=null,Ir=null,e(null)},i.src=`${Bv}?v=line`}),Ir}function fx(i){const e=new Image;return new Promise(t=>{e.onload=()=>t(e),e.onerror=()=>t(null),e.src=i.toDataURL("image/png")})}async function Ph(i){const e=await dx(),t=go.get(i);if(!e||!t)return null;const n=t.sourceSize??{w:t.frame.w,h:t.frame.h},r=t.spriteSourceSize??{x:0,y:0,w:t.frame.w,h:t.frame.h},s=document.createElement("canvas");s.width=n.w,s.height=n.h;const a=s.getContext("2d");return a?(a.clearRect(0,0,s.width,s.height),a.drawImage(e,t.frame.x,t.frame.y,t.frame.w,t.frame.h,r.x,r.y,r.w,r.h),fx(s)):null}function Lh(){return ln?Promise.resolve(!0):Ur||(Ur=Ph("animal-atlas-packed-v1.png").then(i=>i?(ln=i,mo.clear(),rt.filter(e=>e.active).forEach(e=>qo(e)),rt.length>0&&br(),!0):(ln=null,Ur=null,!1)),Ur)}function Dh(){return Bn?Promise.resolve(!0):Nr||(Nr=Ph("bonus-icons-v1.png").then(i=>i?(Bn=i,rt.filter(e=>e.active&&e.kind==="bonus").forEach(e=>qo(e)),rt.length>0&&br(),!0):(Bn=null,Nr=null,!1)),Nr)}function px(i,e,t,n=xt*.78){const r=new kt(new Ii(n,n),new jt({map:i,transparent:!0,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-1}));return r.position.copy(e),r.rotation.copy(t),r}function mx(i,e){const t=new kt(Ov,na);return t.position.copy(i).multiplyScalar(1.012),t.rotation.copy(e),t.userData.isAvailabilityFrame=!0,t}function gx(i){const e=new xi;e.position.set(i.x*xt,i.z*ei,i.y*jn),e.userData.tileId=i.id;const t=new kt(Bo,zo);t.userData.tileId=i.id,e.add(t);const n=Xo(i),r=ys.map(a=>px(n,a.offset,a.rotation)),s=ys.map(a=>mx(a.offset,a.rotation));return r.forEach((a,o)=>{a.userData.tileId=i.id,a.userData.neighbor=ys[o].neighbor,a.userData.isSymbolFace=!0,e.add(a)}),s.forEach((a,o)=>{a.userData.tileId=i.id,a.userData.neighbor=ys[o].neighbor,e.add(a)}),e}function _x(){zt=[],Je=null,ot.traverse(i=>{const e=i;e.geometry&&e.geometry!==Bo&&e.geometry.dispose();const t=e.material,n=r=>{if(Go.has(r))return;const s=r;s.map&&!ia.has(s.map)&&s.map.dispose(),r.dispose()};Array.isArray(t)?t.forEach(n):t&&n(t)}),ot.clear()}function Hl(i){const e=new Set,t=new Set;i.traverse(n=>{const r=n;r.geometry&&r.geometry!==Bo&&r.geometry.dispose(),(Array.isArray(r.material)?r.material:r.material?[r.material]:[]).forEach(a=>{if(Go.has(a)||e.has(a))return;e.add(a);const o=a;o.map&&!ia.has(o.map)&&!t.has(o.map)&&(t.add(o.map),o.map.dispose()),a.dispose()})})}function vx(i){const e=new Set,t=new Set;i.children.slice(1).forEach(n=>{const r=n;if(!r.userData.isSymbolFace)return;const s=r.material;if(!s)return;(Array.isArray(s)?s:[s]).forEach(o=>{if(e.has(o))return;e.add(o);const c=o;c.map&&!ia.has(c.map)&&!t.has(c.map)&&(t.add(c.map),c.map.dispose()),o.dispose()})})}function qo(i){if(!i.mesh)return;vx(i.mesh);const e=Xo(i);i.mesh.children.slice(1).forEach(t=>{const n=t;n.userData.isSymbolFace&&(n.material=new jt({map:e,transparent:!0,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-1}))})}function xx(i){const e=[];return i.traverse(t=>{const n=t;if(!n.material)return;const r=s=>{const a=s.clone();return a.transparent=!0,a.opacity=1,a.depthWrite=!1,e.push(a),Go.has(s)||s.dispose(),a};n.material=Array.isArray(n.material)?n.material.map(r):r(n.material)}),e}function Sx(i){const e=[];return i.traverse(t=>{const n=t;if(!n.material)return;const r=Array.isArray(n.material)?n.material:[n.material];e.push(...r)}),e}function Gl(i,e,t,n){if(!i.mesh)return[];const r=[],s=n??i.mesh.position,a=s.clone().sub(e).normalize();a.lengthSq()===0&&a.set(i.id%2*2-1,0,0);const o=new A(-a.z,0,a.x).normalize(),c=s.clone(),l=Xo(i);for(let u=0;u<7;u+=1){const h=u>=4,d=u%2===0?1:-1,m=new A((Math.random()-.5)*xt*.42,(Math.random()-.5)*oo*.38,(Math.random()-.5)*jn*.42),g=h?new kt(new Ii(xt*(.18+Math.random()*.08),xt*(.18+Math.random()*.08)),new jt({map:l,transparent:!0,opacity:1,depthWrite:!1,toneMapped:!1})):new kt(new Di(xt*(.14+Math.random()*.08),oo*(.1+Math.random()*.08),jn*(.12+Math.random()*.08)),new jt({color:u%3===0?16777215:u%3===1?16768085:13498354,transparent:!0,opacity:1,depthWrite:!1,toneMapped:!1}));g.position.copy(c).add(m),g.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),g.visible=!1,t.add(g),r.push({mesh:g,start:g.position.clone(),velocity:a.clone().multiplyScalar(.7+Math.random()*.62).addScaledVector(o,d*(.18+Math.random()*.32)).add(new A(0,.72+Math.random()*.48,0)),rotation:g.rotation.clone(),angularVelocity:new A((Math.random()-.5)*7,(Math.random()-.5)*9,(Math.random()-.5)*7),scale:g.scale.clone(),materials:Sx(g)})}return r}function Mx(i,e,t,n=!1){if(!i.mesh||!e.mesh)return null;Mo(i,Vs),Mo(e,Vs);const r=new A,s=rt.filter(g=>g.active&&g.mesh);s.forEach(g=>r.add(g.mesh.position)),s.length>0&&r.multiplyScalar(1/s.length);const a=new xi;ot.add(a);const o=De.position.clone().sub(ze.target).setY(0);o.lengthSq()<1e-4&&o.set(0,0,1),o.normalize();const c=new A(-o.z,0,o.x).normalize(),l=Math.abs(c.x)>=Math.abs(c.z)?new A(Math.sign(c.x)||1,0,0):new A(0,0,Math.sign(c.z)||1),u=s.reduce((g,v)=>{const p=v.mesh.position.clone().sub(r).setY(0).length();return Math.max(g,p)},0),h=r.clone().addScaledVector(o,u+1.05);h.y+=.34;const m=[i,e].map((g,v)=>{const p=g.mesh,f=v===0?-1:1,w=h.clone().addScaledVector(l,f*1.08).addScaledVector(o,.16);return{group:p,basePosition:p.position.clone(),outwardPosition:w,baseScale:p.scale.clone(),baseRotation:p.rotation.clone(),materials:xx(p)}}).map((g,v)=>{const p=v===0?-1:1,f=h.clone().addScaledVector(l,p*(xt*.43));return{...g,approachPosition:f.clone().addScaledVector(l,p*.36).addScaledVector(o,p*.28),impactPosition:f}});return zt.push({startedAt:t,duration:980,outwardDuration:260,impactDuration:260,fragmentsSoundPlayed:n,fragmentsVisible:!1,entries:m,fragmentGroup:a,fragments:[...Gl(i,h,a,m[0].impactPosition),...Gl(e,h,a,m[1].impactPosition)]}),h.clone()}function yx(i){zt=zt.filter(e=>{const t=st.clamp((i-e.startedAt)/e.duration,0,1),n=i-e.startedAt,r=st.clamp(n/e.outwardDuration,0,1),s=st.clamp((n-e.outwardDuration)/e.impactDuration,0,1),a=1-Math.pow(1-r,3),o=1-Math.pow(1-s,3),c=Math.sin(s*Math.PI*5)*(1-s)*.035;e.entries.forEach((h,d)=>{if(!e.fragmentsVisible){if(h.group.visible=!0,r<1)h.group.position.lerpVectors(h.basePosition,h.outwardPosition,a),h.group.position.y+=Math.sin(r*Math.PI)*.08;else{const m=1-o;h.group.position.copy(h.outwardPosition).multiplyScalar(m*m).addScaledVector(h.approachPosition,2*m*o).addScaledVector(h.impactPosition,o*o),h.group.position.y+=Math.sin(s*Math.PI)*.08}h.group.position.x+=c*(d===0?-1:1),h.group.scale.copy(h.baseScale).multiplyScalar(1+Math.sin(s*Math.PI)*.1),h.group.rotation.copy(h.baseRotation),Ih(h.group)}}),!e.fragmentsVisible&&s>=1&&(e.fragmentsVisible=!0,e.fragmentsSoundPlayed||(e.fragmentsSoundPlayed=!0),e.entries.forEach(h=>{h.group.visible=!1}),e.fragments.forEach(h=>{h.mesh.visible=!0}));const l=st.clamp((n-e.outwardDuration-e.impactDuration)/(e.duration-e.outwardDuration-e.impactDuration),0,1),u=1-Math.pow(1-l,2);return e.fragments.forEach(h=>{e.fragmentsVisible&&(h.mesh.position.copy(h.start).addScaledVector(h.velocity,u).add(new A(0,-.42*l*l,0)),h.mesh.rotation.set(h.rotation.x+h.angularVelocity.x*l,h.rotation.y+h.angularVelocity.y*l,h.rotation.z+h.angularVelocity.z*l),h.mesh.scale.copy(h.scale).multiplyScalar(1+.2*Math.sin(l*Math.PI)),h.materials.forEach(d=>{d.opacity=1-l}))}),t<1?!0:(e.entries.forEach(h=>{ot.remove(h.group),Hl(h.group)}),ot.remove(e.fragmentGroup),Hl(e.fragmentGroup),!1)})}function Ex(i,e,t){const n=performance.now();Ve.play("shuffle");const r=new A;i.forEach(({sourceTile:s})=>{s.mesh&&r.add(s.mesh.position)}),i.length>0&&r.multiplyScalar(1/i.length),Je={startedAt:n,duration:940,message:t,finalized:!1,applyDeck:e,entries:i.filter(({sourceTile:s,targetTile:a})=>s.mesh&&a.mesh).map(({sourceTile:s,targetTile:a},o)=>({sourceTile:s,targetTile:a,mesh:s.mesh,basePosition:s.mesh.position.clone(),spreadPosition:s.mesh.position.clone().add(s.mesh.position.clone().sub(r).setY(0).normalize().multiplyScalar(.34+o%4*.025)),targetPosition:a.mesh.position.clone(),baseRotation:s.mesh.rotation.clone(),baseScale:s.mesh.scale.clone(),delay:o%8*.018}))}}function wx(i){i.mesh&&Ih(i.mesh)}function Ih(i){i.children.slice(1).forEach(e=>{const t=e;if(t.userData.isAvailabilityFrame){t.visible=!1;return}t.userData.isSymbolFace&&(t.visible=!0)})}function Vl(i,e){i.mesh&&i.mesh.children.slice(1).forEach(t=>{const n=t;if(!n.userData.isSymbolFace)return;const r=n.material;r.transparent=!0,r.opacity=e})}function bx(i){if(!Je)return;const e=st.clamp((i-Je.startedAt)/Je.duration,0,1);if(Je.entries.forEach((r,s)=>{const a=st.clamp((e-r.delay)/(1-r.delay),0,1),o=st.clamp(a/.3,0,1),c=st.clamp((a-.3)/.7,0,1),l=1-Math.pow(1-o,3),u=.5-Math.cos(c*Math.PI)*.5,h=Math.sin(c*Math.PI)*(.42+s%5*.025);a<.3?r.mesh.position.lerpVectors(r.basePosition,r.spreadPosition,l):r.mesh.position.lerpVectors(r.spreadPosition,r.targetPosition,u),r.mesh.position.y+=h,r.mesh.rotation.copy(r.baseRotation),r.mesh.scale.copy(r.baseScale).multiplyScalar(1+Math.sin(a*Math.PI)*.065),wx(r.sourceTile),Vl(r.sourceTile,1)}),e<1)return;if(!Je.finalized){const r=Je.applyDeck(),s=new Map;Je.entries.forEach(a=>{s.set(a.sourceTile,a.mesh),a.sourceTile.mesh=void 0}),Je.entries.forEach(a=>{const o=s.get(a.sourceTile);o&&(a.targetTile.mesh=o,o.userData.tileId=a.targetTile.id,o.traverse(c=>{c.userData.tileId=a.targetTile.id}))}),Je.message=Je.message||(r?"Куби перемішано.":"Ходів все ще немає. Спробуй ще раз."),Je.finalized=!0}Je.entries.forEach(r=>{r.mesh.position.copy(r.targetPosition),r.mesh.rotation.copy(r.baseRotation),r.mesh.scale.copy(r.baseScale),Vl(r.targetTile,1)});const t=Je.message,n=Fi()>1&&!Vn();Je=null,oa(),St(),n?(qe("Ходів все ще немає, перемішую ще раз..."),ca("Немає ходів, поле перемішано.")):t&&qe(t)}function Uh(){_x(),Hn=Ah(tn[Xe],rt.length),ot.quaternion.identity(),ot.position.set(0,0,0),ot.scale.setScalar(Hn),rt.forEach(i=>{i.active&&(i.mesh=gx(i),ot.add(i.mesh))}),Vo(),wh(),St()}function fi(i,e,t,n){return i?rt.some(r=>r.active&&r.x===i.x+e&&r.y===i.y+t&&r.z===i.z+n):!1}function Tx(i){i.mesh&&i.mesh.children.slice(1).forEach(e=>{const t=e,[n,r,s]=t.userData.neighbor;t.visible=!fi(i,n,r,s)})}function aa(i){return i!=null&&i.active?[!fi(i,-1,0,0),!fi(i,1,0,0),!fi(i,0,-1,0),!fi(i,0,1,0),!fi(i,0,0,-1),!fi(i,0,0,1)].filter(Boolean).length>=3:!1}function Ri(i){return i.kind==="bonus"?`bonus:${i.bonus??"time"}`:`animal:${i.animal.name}`}function Ci(i){return i.kind!=="bonus"?i.animal.name:i.bonus==="hint"?"бонус підказки":i.bonus==="shuffle"?"бонус шафлу":i.bonus==="removePair"?"бонус видалення пари":"бонус часу"}function Es(i){return{kind:i.kind,animal:i.animal,bonus:i.bonus}}function Fr(i,e){i.kind=e.kind,i.animal=e.animal,i.bonus=e.bonus}function Vn(){return Xr()[0]??null}function Xr(){const i=[],e=rt.filter(aa);for(let t=0;t<e.length;t+=1)for(let n=t+1;n<e.length;n+=1)Ri(e[t])===Ri(e[n])&&i.push([e[t],e[n]]);return i}function Wl(){const i=[],e=rt.filter(t=>t.active);for(let t=0;t<e.length;t+=1)for(let n=t+1;n<e.length;n+=1)Ri(e[t])===Ri(e[n])&&i.push([e[t],e[n]]);return i}function Ax(i){const e=new Map;for(const t of i){const n=Ri(t),r=e.get(n);if(r)return[r,t];e.set(n,t)}return null}function Rx(i){const e=So(i),t=i.filter(aa),n=Ax(i);if(t.length<2||!n)return e;const r=new Array(i.length),s=i.indexOf(t[0]),a=i.indexOf(t[1]);r[s]=n[0],r[a]=n[1];const o=Wo(i.filter(l=>l!==n[0]&&l!==n[1]));return i.map((l,u)=>u).filter(l=>l!==s&&l!==a).forEach((l,u)=>{r[l]=o[u]}),r.map((l,u)=>l??e[u])}function qe(i){ev.textContent=i}function Nh(i){ao.dataset.mode=i,ao.classList.remove("hidden")}function oa(){ao.classList.add("hidden")}function ca(i="Немає ходів, поле перемішано."){tt||it||bi>0||Je||zt.length>0||(bi=performance.now()+360,ta=i,Nh("auto"))}function Cx(i){i<fo||(fo=i+900,!(tt||it||bi>0||Je||zt.length>0||It||Fi()<=1||Vn())&&($e=null,et=null,qe("Немає ходів, перемішую поле..."),St(),ca("Немає ходів, поле перемішано.")))}function Yo(i){const e=Math.max(0,Math.ceil(i)),t=Math.floor(e/60),n=e%60;return`${String(t).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function Px(){return _v}function Ko(i=!1){const e=Math.max(0,Math.ceil(pn));!i&&e===uo||(uo=e,rt.filter(t=>t.active&&t.kind==="bonus").forEach(t=>qo(t)),($e==null?void 0:$e.kind)==="bonus"&&br())}function Fi(){return rt.filter(i=>i.active).length}function Fh(){Kn.classList.add("hidden")}function Oh(){it||tt||It||!Kn.classList.contains("hidden")||(tt=!0,$e=null,et=null,lt=null,Os.classList.remove("hidden"),wr(),qe("Пауза."),St())}function jo(i=!0){if(!tt){Os.classList.add("hidden");return}Os.classList.add("hidden"),tt=!1,gr=performance.now(),i&&!it&&Fi()>0&&(Ni(),qe(`Рівень ${Xe+1}/${tn.length}. Знайди дві однакові вільні плитки.`))}async function Bh(){!tt||It||await Yr()&&jo(!0)}async function Lx(){!tt||It||await Yr()&&(Lv(),ks=0,jo(!1),Tr(0,!0),Ni(),qe("Прогрес скинуто. Бонуси відновлено."))}async function Dx(){!tt||It||await Yr()&&(jo(!1),Tr(Xe,!1),Ni())}function Wn(i,e){As=st.clamp(Math.max(e,As),6,100),mv.textContent=i,gv.style.setProperty("--loading-progress",`${As}%`)}function Ws(i="Loading level",e=16){Mi&&(window.clearTimeout(Mi),Mi=0),ah=performance.now(),As=6,Wn(i,e),so.classList.remove("hidden")}function zh(i=1050){const e=performance.now()-ah,t=Math.max(80,i-e);Mi&&window.clearTimeout(Mi),Mi=window.setTimeout(()=>{so.classList.add("hidden"),so.classList.remove("boot-loading"),Mi=0},t)}function Ix(){ia.forEach(i=>{i.needsUpdate=!0}),ot.traverse(i=>{const e=i;(Array.isArray(e.material)?e.material:e.material?[e.material]:[]).forEach(n=>{const r=n;r.map&&(r.map.needsUpdate=!0),n.needsUpdate=!0})})}function Ux(i){i.preventDefault(),!Hs&&(Hs=!0,ho=!tt&&!it,tt=!0,lt=null,dt=null,Oi(),oa(),Ws("Restoring graphics",18),qe("Відновлюю графіку..."))}function Nx(){Hs=!1,vt.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),vt.setSize(window.innerWidth,window.innerHeight),vt.setClearColor(0,0),Ix(),rt.length>0&&(Uh(),Ko(!0)),tt=!ho,ho=!1,gr=performance.now(),Wn("Ready",100),zh(420),St()}function Fx(i=1250){oh||(yi&&window.clearTimeout(yi),yi=window.setTimeout(()=>{Ox(),Bs.classList.remove("hidden"),yi=0},i))}function Ox(){if(Xe!==0||window.innerWidth>=window.innerHeight||rt.length===0){Bs.style.removeProperty("--rotation-hint-top");return}De.updateMatrixWorld(!0);const i=xo(),e=Eh(i).reduce((n,r)=>{const a=(-r.project(De).y*.5+.5)*window.innerHeight;return Number.isFinite(a)?Math.max(n,a):n},0),t=st.clamp(e+90,window.innerHeight*.66,window.innerHeight-92);Bs.style.setProperty("--rotation-hint-top",`${t}px`)}function Sr(i=!0){yi&&(window.clearTimeout(yi),yi=0),Bs.classList.add("hidden"),i&&(oh=!0)}function Oi(i=!0){dn&&(window.clearTimeout(dn),dn=0),Ai.classList.add("hidden"),i&&(Jn=null),_r=!1}function Bx(i){if(!i.mesh)return null;const e=new A;De.getWorldPosition(e);let t=-1/0,n=null;for(const r of i.mesh.children){const s=r;if(!s.userData.isSymbolFace||!s.visible)continue;const a=new A,o=new A(0,0,1);s.getWorldPosition(a),o.applyQuaternion(s.getWorldQuaternion(new on)).normalize();const c=e.clone().sub(a).normalize(),l=o.dot(c);l<.12||l>t&&(t=l,n=a)}return n}function kh(i){if(!i.mesh||!i.active)return!1;const e=Bx(i),t=e??new A;e||(i.mesh.getWorldPosition(t),t.y+=xt*.52*Hn);const n=t.project(De);if(!Number.isFinite(n.x)||!Number.isFinite(n.y)||n.z<-1||n.z>1)return!1;const r=st.clamp((n.x*.5+.5)*window.innerWidth,42,window.innerWidth-42),s=st.clamp((-n.y*.5+.5)*window.innerHeight,72,window.innerHeight-52);return Ai.style.setProperty("--tutorial-hand-x",`${r}px`),Ai.style.setProperty("--tutorial-hand-y",`${s}px`),!0}function $o(i){Jn=i.id,_r=!1,kh(i)&&(Ai.classList.remove("hidden"),dn&&window.clearTimeout(dn),dn=window.setTimeout(()=>{Ai.classList.add("hidden"),Jn=null,dn=0},5200))}function Hh(){if(!_r||Jn===null)return;const i=rt.find(e=>e.id===Jn&&e.active);if(_r=!1,!i){Oi();return}window.requestAnimationFrame(()=>$o(i))}function zx(){wr(),bh(.65),Ve.play("levelComplete"),Kn.dataset.state="complete",Io.textContent="Level Complete",Uo.textContent="",Js.classList.remove("hidden"),Qs.classList.add("hidden"),mr.classList.add("hidden"),Kn.classList.remove("hidden")}function kx(){wr(),bh(1),Ve.play("levelComplete"),Kn.dataset.state="completed",Io.textContent="Well done!",Uo.textContent="Game completed",Js.classList.add("hidden"),Qs.classList.remove("hidden"),mr.classList.add("hidden"),Kn.classList.remove("hidden")}function Hx(){wr(),Ve.play("levelFailed"),Kn.dataset.state="failed",Io.textContent="Out of Time",Uo.textContent="",Js.classList.add("hidden"),Qs.classList.remove("hidden"),mr.classList.remove("hidden"),Kn.classList.remove("hidden")}function br(){Q0.textContent=String(Fi()),Dl.textContent=$e?"":"-",Dl.setAttribute("aria-label",$e?Ci($e):"Нічого не вибрано"),$e?(hi.classList.remove("empty"),hi.style.backgroundImage=`url("${hx($e)}")`,hi.style.backgroundSize="contain",hi.style.backgroundPosition="center"):(hi.classList.add("empty"),hi.style.backgroundImage="",hi.style.backgroundPosition=""),tv.textContent=String(Xr().length),io.textContent=Yo(Qt),iv.textContent=String(ks),rv.textContent=`x${Nn}`,sv.textContent=`${Xe+1}/${tn.length}`,av.textContent=String(Xe+1)}function Gx(i,e){if(i<=0)return;const t=1/i;Ya+=(t-Ya)*.08,!(e-Il<250)&&(Il=e,nv.textContent=String(Math.round(Ya)))}function Mo(i,e){var n;const t=(n=i.mesh)==null?void 0:n.children[0];t&&(t.material=e)}function Vx(i,e){if(!i.mesh)return;const t=e==="selected"?ko:e==="hint"?Ho:na,n=e==="selected"||e==="hint",r=1;i.mesh.children.slice(1).forEach(s=>{const a=s;if(a.userData.isAvailabilityFrame){a.material=t,a.visible=n&&a.visible;return}if(!a.userData.isSymbolFace)return;const o=a.material;o.transparent=!0,o.opacity=r})}function St(){Vo(),rt.forEach(i=>{if(!i.active||!i.mesh)return;const e=aa(i);let t=e?"free":"blocked",n=e?zo:Mh;if(et!=null&&et.includes(i)&&(t="hint",n=yh),$e===i&&(t="selected",n=Vs),Mo(i,n),Tx(i),Vx(i,t),!Je){const r=et!=null&&et.includes(i)?.06:0;i.mesh.position.y=i.z*ei+($e===i?.09:r),i.mesh.scale.setScalar(1)}}),br()}function Wx(i){Ts.set(i.id,performance.now())}function Xx(i){cr.set(i.id,performance.now())}function qx(i){const t=De.position.clone().sub(ze.target).setY(0);t.lengthSq()<1e-4&&t.set(0,0,1),t.normalize();const n=new A(-t.z,0,t.x).normalize();Ts.forEach((r,s)=>{const a=rt.find(d=>d.id===s);if(!(a!=null&&a.active)||!a.mesh){Ts.delete(s);return}const o=st.clamp((i-r)/280,0,1),c=a.x*xt,l=a.y*jn;if(o>=1){a.mesh.position.x=c,a.mesh.position.z=l,Ts.delete(s);return}const u=1-o,h=Math.sin(o*Math.PI*8)*.08*u;a.mesh.position.x=c+n.x*h,a.mesh.position.z=l+n.z*h})}function Yx(i){cr.forEach((t,n)=>{const r=rt.find(c=>c.id===n);if(!(r!=null&&r.active)||!r.mesh){cr.delete(n);return}const s=st.clamp((i-t)/520,0,1),a=r.z*ei+($e===r?.09:et!=null&&et.includes(r)?.06:0);if(s>=1){r.mesh.position.y=a,r.mesh.scale.setScalar(1),cr.delete(n);return}const o=1-s;r.mesh.position.y=a+Math.sin(s*Math.PI*6)*.045*o,r.mesh.scale.setScalar(1+Math.sin(s*Math.PI*4)*.035*o)})}function Gh(i,e,t){const n=performance.now(),r=i.kind==="bonus"&&e.kind==="bonus"&&i.bonus===e.bonus?i.bonus:null,s=r?Math.ceil(pn):0,a=t??(r==="time"&&s>0?"timeBonus":r==="removePair"&&s>0?"removePairBonus":"matchSuccess"),o=!1;a&&Ve.play(a);const c=i.mesh&&e.mesh?i.mesh.position.clone().add(e.mesh.position).multiplyScalar(.5):new A((i.x+e.x)*xt*.5,(i.z+e.z)*ei*.5,(i.y+e.y)*jn*.5),l=Mx(i,e,n,o)??c;i.active=!1,e.active=!1,Xe===0&&(xr+=1,xr>=3&&(vr=0,cr.clear())),$e=null,et=null,Nn=n-lo<=3e3?Nn+1:1,lo=n;const u=Nn>1?75*Nn:0;ks+=100+u,r==="time"&&s>0?(pn=0,Ul(r,l,`+${Yo(s)}`,()=>{Qt+=s,Qt>20&&(Vr=!1),br()})):r&&r!=="time"&&s>0&&(pn=0,Ul(r,l,"+1",()=>Iv(r)));let h=Fi();if(h===0)ks+=Math.ceil(Qt)*5,it=!0,Fv(),Xe>=tn.length-1?(kx(),qe("Гру завершено.")):(zx(),qe("Рівень пройдено."));else if(Vn())qe(r==="time"&&s>0?`Бонус часу: +${s}с. Залишилось ${h}.`:r&&s>0?`${Ci(i)}: +1. Залишилось ${h}.`:Nn>1?`Швидка серія x${Nn}. +${100+u}`:`Пара знята. Залишилось ${h}.`);else{qe("Пара знята. Немає ходів, перемішую поле..."),ca(`Пара знята. Немає ходів, поле перемішано. +${100+u}`),St();return}St()}function Kx(i){if(tt||it||Je||zt.length>0)return;Oi();const e=et,t=!!(e!=null&&e.includes(i));if(t||(et=null),!aa(i)){Ve.play("blockedTile"),Wx(i),co=performance.now()+450,qe("Цей блок заблокований: потрібні три відкриті грані.");return}if(!$e){if(Ve.play("tileSelect"),$e=i,t&&(et=e),qe(`Обрано: ${Ci(i)}. Знайди пару.`),St(),Xe===0&&xr<3&&(e!=null&&e.includes(i))){const n=e.find(r=>r!==i&&r.active);n&&window.setTimeout(()=>{$e===i&&n.active&&!tt&&!it&&$o(n)},180)}return}if($e===i){Ve.play("button"),$e=null,t&&(et=e),qe("Вибір скасовано."),St();return}if(Ri($e)===Ri(i)){Gh($e,i);return}$e=i,t&&(et=e),Ve.play("tileSelect"),co=performance.now()+450,qe(`Не пара. Тепер обрано: ${Ci(i)}.`),St()}function Zo(i="manual"){if(tt||it||Je||zt.length>0)return;Nh(i);const e=rt.filter(o=>o.active);if(e.length<2){oa();return}const t=e.map(Es);let n=So(e),r=!1;for(let o=0;o<24;o+=1){const c=So(e);if(e.forEach((l,u)=>{Fr(l,Es(c[u]))}),r=!!Vn(),r){n=c;break}}e.forEach((o,c)=>{Fr(o,t[c])}),r||(n=Rx(e),e.forEach((o,c)=>{Fr(o,Es(n[c]))}),r=!!Vn(),e.forEach((o,c)=>{Fr(o,t[c])}));const s=n.map((o,c)=>Es(o??e[c])),a=e.map((o,c)=>({sourceTile:n[c]??o,targetTile:o}));$e=null,et=null,qe("Перемішую куби..."),St(),Ex(a,()=>(e.forEach((o,c)=>{Fr(o,s[c])}),r||!!Vn()),i==="manual"?"":ta)}function Tr(i=Xe,e=!0){if(!ln||!Bn){Ws("Loading animals",44),Promise.all([Lh(),Dh()]).then(([r,s])=>{if(!r||!s){Wn("Loading failed",100);return}Tr(i,e)});return}const t=e?$n:tn.length-1;Xe=st.clamp(i,0,t),Ws(`Level ${Xe+1}`,28),_h(),tt=!1,Os.classList.add("hidden"),Fh(),rt=Zv(),$e=null,et=null,Nn=1,lo=0,Qt=ch,pn=rt.some(r=>r.kind==="bonus")?Px():0,uo=-1,Vr=!1,gr=performance.now(),it=!1,bi=0,ta="",fo=performance.now()+1e3,xr=0,po=!1,Oi(),oa(),vr=Xe===0?performance.now()+3e3:0,cr.clear(),Uh(),Wn("Arranging cubes",72),Ko(!0);const n=Vn();n?Xe<=1?(et=n,$e=null,Xe===0&&Xv(n),qe("Почни з підсвічених кубів: вибери їх по черзі."),St()):qe(`Рівень ${Xe+1}/${tn.length}. Знайди дві однакові вільні плитки.`):(Zo("auto"),qe("Немає ходів, перемішую поле...")),Wn("Ready",100),zh(),Xe===0?Fx():Sr(!1)}async function jx(){if(!await Yr())return;const i=Math.min($n,Xe+1);Tr(i),Ni()}async function $x(){await Yr()&&Tr(Xe)}async function Zx(){mr.disabled=!0,qe("Завантаження реклами...");const i=await Th();if(mr.disabled=!1,!i){qe("Реклама не завершилась. Спробуй ще раз або перезапусти рівень.");return}Fh(),it=!1,$e=null,et=null,Qt=Math.max(1,Math.ceil(ch/2)),Vr=Qt<=15,gr=performance.now(),qe("Продовження: половина часу рівня."),Ni(),St()}function Vh(i){const e=vt.domElement.getBoundingClientRect();Ka.x=(i.clientX-e.left)/e.width*2-1,Ka.y=-((i.clientY-e.top)/e.height*2-1),Nl.setFromCamera(Ka,De);const n=Nl.intersectObjects(ot.children,!0).find(r=>r.object.userData.tileId!==void 0);return n?rt.find(r=>r.id===n.object.userData.tileId)??null:null}function Jx(i){var t,n;if(tt)return;(n=(t=vt.domElement).setPointerCapture)==null||n.call(t,i.pointerId),dt={pointerId:i.pointerId,x:i.clientX,y:i.clientY,active:!1};const e=Vh(i);lt=e!=null&&e.active?{tileId:e.id,pointerId:i.pointerId,x:i.clientX,y:i.clientY,moved:!1,startedAt:performance.now()}:null}function Qx(i){if(tt)return;if((dt==null?void 0:dt.pointerId)===i.pointerId){const t=i.clientX-dt.x,n=i.clientY-dt.y;(lt?Math.hypot(i.clientX-lt.x,i.clientY-lt.y):Math.hypot(t,n))>8&&(dt.active=!0,document.body.classList.add("is-manual-rotating"),(lt==null?void 0:lt.pointerId)===i.pointerId&&(lt.moved=!0),Sr(),Jn!==null&&(dn&&(window.clearTimeout(dn),dn=0),Ai.classList.add("hidden"),_r=!0)),dt.active&&(i.preventDefault(),Gv(t,n),dt.x=i.clientX,dt.y=i.clientY)}if(!lt||lt.pointerId!==i.pointerId)return;Math.hypot(i.clientX-lt.x,i.clientY-lt.y)>8&&(lt.moved=!0)}function eS(i){var s,a;const e=(dt==null?void 0:dt.pointerId)===i.pointerId&&dt.active;if(document.body.classList.remove("is-manual-rotating"),(dt==null?void 0:dt.pointerId)===i.pointerId&&((a=(s=vt.domElement).releasePointerCapture)==null||a.call(s,i.pointerId),dt=null),e&&Hh(),tt){lt=null;return}if(!lt||lt.pointerId!==i.pointerId)return;const t=lt;lt=null;const n=performance.now()-t.startedAt;if(t.moved||n>700){Sr();return}const r=Vh(i);!(r!=null&&r.active)||r.id!==t.tileId||(Sr(),Ni(),Kx(r))}function tS(i){var e,t;document.body.classList.remove("is-manual-rotating"),(dt==null?void 0:dt.pointerId)===i.pointerId&&((t=(e=vt.domElement).releasePointerCapture)==null||t.call(e,i.pointerId),dt=null),(lt==null?void 0:lt.pointerId)===i.pointerId&&(lt=null),Hh()}async function nS(){if(!(tt||it||Je||zt.length>0||It)){if(et=Vn(),$e=null,!et){qe("Вільної пари немає, перемішую поле..."),ca("Немає ходів, поле перемішано."),St();return}if(!await Fo("hint")){et=null,St();return}Ve.play("hint"),qe(`Підказка: шукай пару "${Ci(et[0])}".`),St()}}function iS(i){if(vr=i+3e3,Xe!==0||xr>=3||tt||it||Je||zt.length>0||It){(Xe!==0||xr>=3)&&(vr=0);return}const e=Xr();if(e.length===0)return;const t=$e,n=t?e.find(s=>s.includes(t))??e[0]:e[0];et=n,n.forEach(Xx);const r=t?n.find(s=>s!==t&&s.active)??null:po?null:n[0];r&&(po=!0,$o(r)),qe(`Підказка: почни з підсвіченої пари "${Ci(n[0])}".`),St()}async function rS(){if(!(it||Je||zt.length>0||It)){if(Fi()<2){qe("Немає кубів для перемішування.");return}await Fo("shuffle")&&Zo("manual")}}async function sS(){if(it||Je||zt.length>0||It)return;const i=Xr();if((i.length>0?i:Wl()).length===0){qe("Немає однакової пари для видалення.");return}if($e=null,et=null,St(),!await Fo("removePair")||it||Je||zt.length>0)return;const t=Xr(),n=t.length>0?t:Wl(),r=n[Math.floor(Math.random()*n.length)];if(!r){qe("Пари вже немає."),St();return}et=r,St(),Gh(r[0],r[1],"removePairBonus"),it||qe(`Прибрано пару "${Ci(r[0])}".`)}function aS(){if(De.aspect=window.innerWidth/window.innerHeight,De.updateProjectionMatrix(),vt.setSize(window.innerWidth,window.innerHeight),rt.length>0){const i=Ah(tn[Xe],rt.length);Math.abs(i-Hn)>.001&&(Hn=i,ot.scale.setScalar(Hn),Vo(!0),wh())}}window.addEventListener("resize",aS);window.addEventListener("blur",sa);window.addEventListener("focus",sa);document.addEventListener("visibilitychange",sa);window.addEventListener("keydown",i=>{if(i.key==="Escape"){i.preventDefault(),tt?Bh():Oh();return}if(!tt){if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(i.key)){i.preventDefault(),Sr(),_o(i.key.replace("Arrow","").toLowerCase());return}if(i.key==="+"||i.key==="="){i.preventDefault(),vo("in");return}(i.key==="-"||i.key==="_")&&(i.preventDefault(),vo("out"))}});vt.domElement.addEventListener("pointerdown",Jx);vt.domElement.addEventListener("pointermove",Qx);vt.domElement.addEventListener("pointerup",eS);vt.domElement.addEventListener("pointercancel",tS);vt.domElement.addEventListener("webglcontextlost",Ux);vt.domElement.addEventListener("webglcontextrestored",Nx);let Rs=0,Cs=0;function la(){Rs&&window.clearTimeout(Rs),Cs&&window.clearInterval(Cs),Rs=0,Cs=0}qr.addEventListener("pointerdown",i=>{var n;const e=i.target.closest("[data-rotate]");if(!e||tt||it)return;i.preventDefault(),la(),(n=e.setPointerCapture)==null||n.call(e,i.pointerId),Sr();const t=e.dataset.rotate??"";_o(t),Rs=window.setTimeout(()=>{Cs=window.setInterval(()=>_o(t,!1),150)},330)});qr.addEventListener("pointerup",la);qr.addEventListener("pointercancel",la);qr.addEventListener("lostpointercapture",la);ov.addEventListener("click",i=>{const e=i.target.closest("[data-zoom]");e&&(Ve.play("button"),vo(e.dataset.zoom==="out"?"out":"in"))});$s.addEventListener("click",()=>{Ve.play("button"),nS()});Zs.addEventListener("click",()=>{Ve.play("button"),rS()});ea.addEventListener("click",()=>{Ve.play("button"),sS()});cv.addEventListener("click",()=>{Ve.play("button"),Oh()});ro.addEventListener("click",()=>{const i=Ve.toggleUserMuted(Zn&&!it);hh(),i||Ve.play("button")});lv.addEventListener("click",()=>{Ve.play("button"),Bh()});uv.addEventListener("click",()=>{Ve.play("button"),Dx()});hv.addEventListener("click",()=>{Ve.play("button"),Lx()});bs.addEventListener("click",()=>{Ve.play("button"),Av()});Js.addEventListener("click",()=>{Ve.play("button"),jx()});Qs.addEventListener("click",()=>{Ve.play("button"),$x()});mr.addEventListener("click",()=>{Ve.play("button"),Zx()});function Wh(i=0){if(requestAnimationFrame(Wh),Hs)return;const e=Math.min(.08,Math.max(0,(i-gr)/1e3));if(gr=i,Gx(e,i),!tt&&!it&&Fi()>0&&(Qt=Math.max(0,Qt-e),!Vr&&Qt>0&&Qt<=15&&(Vr=!0,Ve.play("timerWarning")),pn>0&&rt.some(t=>t.active&&t.kind==="bonus")&&(pn=Math.max(0,pn-e),Ko()),Qt<=0?(it=!0,$e=null,et=null,Hx(),qe("Час вийшов."),St()):br()),ze.update(),Jn!==null&&!_r&&!Ai.classList.contains("hidden")){const t=rt.find(n=>n.id===Jn&&n.active);t?kh(t):Oi()}if(!Je){const t=ze.target.clone();ze.target.lerp(wn.clone().add(Si),.08),De.position.add(ze.target.clone().sub(t))}yx(i),bx(i),!Je&&zt.length===0&&qx(i),!Je&&zt.length===0&&Yx(i),!tt&&!it&&vr>0&&i>=vr&&iS(i),!tt&&!it&&Cx(i),!tt&&!it&&bi>0&&i>=bi&&(bi=0,Zo("auto"),ta=""),document.body.classList.toggle("miss-flash",i<co),vt.render(ti,De)}async function oS(){Ws("Loading atlas",12);const i=Lh(),e=Dh();Wn("Preparing sound",34),await Kv(),Wn("Drawing animals",58),await Promise.all([i,e]),Wn("Starting level",82),jv(),Tr(Xe)}oS();hh();dh();Wh();
