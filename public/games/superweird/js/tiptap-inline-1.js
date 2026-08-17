async function clipboard_read() {
           const result = await navigator.clipboard.readText();
           JsToDef.send("clipboard_paste", result);
        }
