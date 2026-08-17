// Fallback to make sure globalThis is available when running in an old
			// browser (available from Chome 71)
			// https://github.com/defold/defold/issues/10503
			if (typeof globalThis === 'undefined') {
				window.globalThis = window;
			}
