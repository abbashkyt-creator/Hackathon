window.addEventListener('keydown', ev => {
				if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
					ev.preventDefault();
				}
			});
			window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
