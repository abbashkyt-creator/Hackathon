const ctx = self;
ctx.onmessage = function (e) {
        // console.log('Worker location:', self.location.origin);
    // console.log(`Worker function started. Data` + e.data);
    const url = e.data;

    try {
        new Promise(async (res, rej) => {
            // console.log(`Worker function finished`);

            const response = await fetch(url, {
                // "referrer": "https://preview.construct.net/previewworker.js",
                "referrer": "https://preview.construct.net/previewworker.js",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "omit"
              });

            // if (response.type == "basic") throw new Error(`Cant get file in worker: ${url}`);
            
            const arrayBuffer = await response.arrayBuffer();
            // console.log(`response`, { type: response.type } );

            // if (text.includes("not found")) throw new Error(`Error, url not found: ${url}`);

            ctx.postMessage({ arrayBuffer, url }, [arrayBuffer])
        })   
    }
    catch (error) {
        console.log(`Error in WebWorker: \n${JSON.stringify(error)}`);
        ctx.postMessage({ image: null, url });
        return;
    }
};


// const image = await createImageBitmap(arrayBuffer);

// const canvas = new OffscreenCanvas(width, height);
// const ctx = canvas.getContext('2d');
// ctx.drawImage(imageBitmap, 0, 0, width, height);

// // Закрываем ImageBitmap, чтобы освободить память
// imageBitmap.close();

// // Конвертируем canvas в Blob (в формате JPEG, качество 0.9)
// const resizedBlob = await canvas.convertToBlob({ type: 'image/png', /* quality: 0.9 */ });

// // Отправляем Blob обратно
// self.postMessage({ blob: resizedBlob });

// ctx.postMessage({ image, url });