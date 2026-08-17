document.onclick = function(){
            window.focus();
        }

        window.addEventListener('keydown', ev => {
            if (['ArrowDown', 'ArrowUp',' '].includes(ev.key)) {
                ev.preventDefault();
            }
        });
        window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });

        /**
         * 判断设备类型（手机、平板或PC）
         * 通过检测用户代理字符串、触摸功能和屏幕宽度来确定设备类型
         * @returns {string} 返回设备类型：'phone'、'tablet'、'pc' 或 'unknown'
         */
        function getDeviceType() {
            const ua = navigator.userAgent;
            const isTouch = "ontouchend" in document;
            const screenWidth = window.innerWidth;
            const maxTouchPoints = navigator.maxTouchPoints || 1;
            
            // 1. 检测是否为 iPad (包括 iPadOS 桌面模式)
            const isIPad =
                /iPad/.test(ua) ||
                (/(Macintosh|MacIntel)/.test(ua) && isTouch && maxTouchPoints > 1);
            
            // 2. 检测是否为 iPad Pro (额外补充，部分 iPad Pro UA 不含 iPad)
            const isIPadPro =
                /(Macintosh|MacIntel)/.test(ua) &&
                isTouch &&
                maxTouchPoints > 1 &&
                ["Apple", "Apple Inc."].includes(navigator.vendor || "");
            
            // 3. 检测 Android 平板
            const isAndroid = /Android/.test(ua);
            const isAndroidTablet = isAndroid && !/Mobile/.test(ua); // 多数 Android 平板 UA 不含 Mobile
            // 补充：部分 Android 平板 UA 含 Mobile，但屏幕大 + 触摸
            const isPossibleAndroidTablet =
                isAndroid && /Mobile/.test(ua) && screenWidth >= 1024 && isTouch;
            
            // 4. 通用平板判断：触摸设备 + 中等以上屏幕
            const isLikelyTablet =
                isTouch &&
                ((screenWidth >= 768 && screenWidth <= 1024) ||
                (screenWidth >= 1024 && screenHeight >= 1366)); // 适配大屏设备
            
            // 合并平板判断
            const isTablet =
                isIPad ||
                isIPadPro ||
                isAndroidTablet ||
                isPossibleAndroidTablet ||
                (isLikelyTablet && !/iPhone|Android.*Mobile/i.test(ua));
            
            // 手机：移动设备且非平板
            const isPhone =
                /Android|iPhone|Mobile|iPod|BlackBerry|IEMobile|Opera Mini|webOS/i.test(
                ua
                ) && !isTablet;
            
            // PC：非手机非平板
            const isPC = !isPhone && !isTablet;
            
            if (isPhone) return "phone";
            if (isTablet) return "tablet";
            if (isPC) return "pc";
            
            return "unknown";
        }
        window.getDeviceType = getDeviceType;
