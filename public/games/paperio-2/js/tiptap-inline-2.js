function isSupported() {
		
				'use strict';
		
				try {
		
					eval("class A {};let b=(...x)=>x;b=new Promise((r=0)=>r());[b]=[`${0}`];{let {b}={ b(){}}}");
					var canvas = document.createElement( 'canvas' );
					var context = canvas.getContext( 'webgl' ) || canvas.getContext('experimental-webgl' );
					if ( ! context ) throw '';
		
				} catch ( error ) { return false; }
		
				return true;
			}
		
			var isSupported = isSupported();
			var isOld = location.pathname.match( 'old' );
		
			if ( ! isSupported && ! isOld ) location.replace( '/old' );
			else if ( isSupported && isOld ) location.replace( '/' );
		
			window.isSupported = isSupported;
