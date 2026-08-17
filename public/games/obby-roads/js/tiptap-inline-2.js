<!--MOBILE_DATA_XXXX tags will get overridden by build script -->
        var addressableCatalogFilename = "catalog_2026.07.10.11.50.53.json";
        var mobileAddressableCatalogFilename = "catalog_2026.07.10.11.56.35.json";

        var mobileDataFilename = "02602028f2c317c9b2854e1680cb3d57.data";
        if (!mobileDataFilename.includes("MOBILE_DATA_FILENAME") && typeof navigator !== "undefined" && /(?:phone|windows\\s+phone|ipod|blackberry|(?:android|bb\\d+|meego|silk|googlebot) .+? mobile|palm|windows\\s+ce|opera mini|avantgo|mobilesafari|docomo|kaios)/i.test(navigator.userAgent))
        {
            window.config.metadata.data_filename = mobileDataFilename;
            window.config.cachedDecompressedFileSizes[mobileDataFilename] = 18614689;

            if(!mobileAddressableCatalogFilename.includes("MOBILE_ADDRESSABLE_CATALOG_FILENAME"))
            {
                addressableCatalogFilename = mobileAddressableCatalogFilename;
            }
        }

        function getAddressableCatalogFilename()
        {
            return addressableCatalogFilename;
        }
