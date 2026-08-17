window.__vcStopwatches = [Date.now()];
      const isYandexIframe = new URL(location.href).searchParams.get("iframe") === "yandex";
      if (isYandexIframe) {
        // prefetch yandex sdk
        const url = "https://sdk.games.s3.yandex.net/sdk.js";
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = url;
        link.as = "script";
        document.head.appendChild(link);
      }
