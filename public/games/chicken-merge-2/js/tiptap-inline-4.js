window.addEventListener("wheel", (event) => event.preventDefault(), {
		    passive: false,
		});

		window.addEventListener("keydown", (event) => {
		    if (["ArrowUp", "ArrowDown", " "].includes(event.key)) {
		        event.preventDefault();
		    }
		});
		FetchDomElements();
		Resize();
