(function () {
            var iconUrl = 'Images/Icon.png';

            if (!window.config) {
                window.config = {
                loader: 'unity-2020',
                debug: false,
                maxRatio: 24 / 9,
                minRatio: 9 / 24,
                title: 'Knockout Penguins',
                thumbnail: iconUrl,
                numScreenshots: 3,
                unityVersion: '',
                unityWebglBuildUrl: '',
                fileSize: 14,
                metadata: {
                    poki_template_version: 1,
                    background_color: '#231F20',
                    code_filename: 'Poki.wasm.br',
                    company_name: 'DefaultCompany',
                    data_filename: 'Poki.data.br',
                    development_player: 'false',
                    framework_filename: 'Poki.framework.js.br',
                    height: '600',
                    loader_filename: 'Poki.loader.js',
                    product_name: 'Knockout Penguins',
                    product_version: '0.1',
                    splash_screen_style: 'Dark',
                    use_data_caching: 'true',
                    use_threads: 'false',
                    use_wasm: 'true',
                    use_webgl_1_0: 'false',
                    use_webgl_2_0: 'true',
                    width: '960'
                }
            };
                return;
            }

            if (!window.config.thumbnail)
                window.config.thumbnail = iconUrl;
        })();
