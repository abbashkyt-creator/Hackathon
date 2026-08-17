// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

runOnStartup(async runtime => {
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.

	globalThis.language = {
		"en": {
			"level": "Level",
			"world": "World",
			"move": "Move",
			"jump": "Jump",
			"restart": "Reset",
			"ask_restart": "Reset?",
			"test_thanks": "Thank you for testing so far. More coming soon :)",
			"congratulate": "Well done!|Nice!|Good job!",
			"level_select": "Level select",
			"optional": "optional",
			"loaderror": "Error: Try reloading the page",
			"skip": "SKIP?",
			"unlocknow": "Unlock early?"
		},
		"fr": {
			"level": "Niveau",
			"world": "Monde",
			"move": "Déplacer",
			"jump": "Sauter",
			"restart": "Réinitialiser",
			"ask_restart": "Réinitialiser ?",
			"test_thanks": "Merci d'avoir testé jusqu'ici. La suite arrive bientôt :)",
			"congratulate": "Bien joué !|Super !|Bon travail !",
			"level_select": "Sélection du niveau",
			"optional": "facultatif",
			"loaderror": "Erreur : Veuillez recharger la page",
			"skip": "PASSER?",
			"unlocknow": "Utiliser tôt?"
		},
		"it": {
			"level": "Livello",
			"world": "Mondo",
			"move": "Muovi",
			"jump": "Salta",
			"restart": "Reset",
			"ask_restart": "Reset",
			"test_thanks": "Grazie per aver testato finora. Altro in arrivo presto :)",
			"congratulate": "Ben fatto!|Ottimo!|Bel lavoro!",
			"level_select": "Selezione livello",
			"optional": "facoltativo",
			"loaderror": "Errore: prova a ricaricare la pagina",
			"skip": "SALTARE?",
			"unlocknow": "Sblocca ora?"
		},
		"de": {
			"level": "Level",
			"world": "Welt",
			"move": "Bewegen",
			"jump": "Springen",
			"restart": "Neustart",
			"ask_restart": "Neustart?",
			"test_thanks": "Danke fürs Testen bisher. Bald kommt mehr :)",
			"congratulate": "Gut gemacht!|Super!|Tolle Leistung!",
			"level_select": "Level-Auswahl",
			"optional": "optional",
			"loaderror": "Fehler: Versuche die Seite neu zu laden",
			"skip": "ÜBERSPRINGEN?",
			"unlocknow": "Jetzt freischalten?"
		},
		"es": {
			"level": "Nivel",
			"world": "Mundo",
			"move": "Mover",
			"jump": "Saltar",
			"restart": "Reiniciar",
			"ask_restart": "¿Reiniciar?",
			"test_thanks": "Gracias por probar hasta ahora. Más contenido pronto :)",
			"congratulate": "¡Bien hecho!|¡Genial!|¡Buen trabajo!",
			"level_select": "Selección de nivel",
			"optional": "opcional",
			"loaderror": "Error: Intente recargar la página",
			"skip": "SALTAR?",
			"unlocknow": "Usar temprano?"
		},
		"tr": {
			"level": "Seviye",
			"world": "Dünya",
			"move": "Hareket",
			"jump": "Zıpla",
			"restart": "Sıfırla",
			"ask_restart": "Sıfırla?",
			"test_thanks": "Şimdiye kadar test ettiğin için teşekkürler. Daha fazlası yakında :)",
			"congratulate": "Aferin!|Harika!|İyi iş!",
			"level_select": "Seviye seçimi",
			"optional": "isteğe bağlı",
			"loaderror": "Hata: Lütfen sayfayı yeniden yüklemeyi deneyin.",
			"skip": "ATLAMAK?",
			"unlocknow": "Kilidi aç?"
		}
	}

	globalThis.color_data = {
		"worlds": [
			{ "accent": { "start": [228, 138, 31], "end": [0, 0, 0] }, "solids": { "start": [203, 201, 203], "end": [165, 157, 166] }, "background": { "start": [48, 48, 50], "end": [19, 20, 27] } },
			{ "accent": { "start": [255, 110, 180], "end": [255, 255, 255] }, "solids": { "start": [60, 20, 150], "end": [30, 10, 80] }, "background": { "start": [15, 5, 40], "end": [8, 2, 20] } },
			{ "accent": { "start": [0, 255, 150], "end": [6, 45, 70] }, "solids": { "start": [255, 80, 50], "end": [180, 40, 30] }, "background": { "start": [60, 20, 20], "end": [35, 10, 10] } },
			{ "accent": { "start": [255, 235, 150], "end": [47, 15, 15] }, "solids": { "start": [100, 180, 255], "end": [50, 120, 190] }, "background": { "start": [30, 60, 100], "end": [15, 30, 55] } },
			{ "accent": { "start": [255, 100, 30], "end": [255, 255, 255] }, "solids": { "start": [0, 200, 180], "end": [0, 140, 120] }, "background": { "start": [20, 60, 90], "end": [10, 30, 50] } },
			{ "accent": { "start": [240, 220, 40], "end": [240, 114, 0] }, "solids": { "start": [180, 40, 220], "end": [120, 20, 160] }, "background": { "start": [50, 20, 80], "end": [25, 10, 45] } },
			{ "accent": { "start": [85, 43, 29], "end": [239, 200, 182] }, "solids": { "start": [255, 127, 52], "end": [219, 75, 19] }, "background": { "start": [239, 200, 182], "end": [226, 177, 144] } },
			{ "accent": { "start": [33, 42, 40], "end": [37, 179, 185] }, "solids": { "start": [40, 123, 117], "end": [20, 100, 65] }, "background": { "start": [124, 164, 155], "end": [81, 142, 114] } },
			{ "accent": { "start": [245, 193, 1], "end": [213, 59, 59] }, "solids": { "start": [61, 158, 175], "end": [45, 95, 123] }, "background": { "start": [48, 75, 100], "end": [28, 60, 73] } },
			{ "accent": { "start": [238, 40, 71], "end": [70, 25, 103] }, "solids": { "start": [62, 69, 85], "end": [41, 49, 68] }, "background": { "start": [32, 40, 54], "end": [18, 29, 39] } },
			{ "accent": { "start": [119, 220, 56], "end": [255, 255, 255] }, "solids": { "start": [95, 73, 151], "end": [69, 44, 116] }, "background": { "start": [44, 41, 74], "end": [19, 22, 47] } },
			{ "accent": { "start": [199, 120, 182], "end": [168, 36, 96] }, "solids": { "start": [142, 91, 101], "end": [87, 48, 55] }, "background": { "start": [54, 31, 34], "end": [35, 16, 16] } },
			{ "accent": { "start": [28, 220, 242], "end": [30, 30, 192] }, "solids": { "start": [127, 45, 68], "end": [50, 4, 20] }, "background": { "start": [183, 64, 68], "end": [146, 30, 47] } },
			{ "accent": { "start": [93, 106, 197], "end": [198, 140, 25] }, "solids": { "start": [28, 8, 31], "end": [9, 1, 15] }, "background": { "start": [75, 70, 91], "end": [47, 39, 54] } },
			{ "accent": { "start": [220, 80, 255], "end": [140, 30, 190] }, "solids": { "start": [60, 180, 220], "end": [30, 110, 160] }, "background": { "start": [45, 25, 55], "end": [25, 12, 35] } },
			{ "accent": { "start": [255, 215, 100], "end": [230, 140, 30] }, "solids": { "start": [120, 220, 140], "end": [60, 160, 90] }, "background": { "start": [40, 50, 35], "end": [20, 28, 18] } },
			{ "accent": { "start": [100, 220, 255], "end": [40, 140, 200] }, "solids": { "start": [255, 180, 70], "end": [220, 120, 30] }, "background": { "start": [45, 30, 55], "end": [22, 15, 35] } },
			{ "accent": { "start": [180, 240, 80], "end": [100, 180, 40] }, "solids": { "start": [240, 100, 60], "end": [200, 60, 30] }, "background": { "start": [35, 45, 55], "end": [18, 22, 30] } },
			{ "accent": { "start": [255, 160, 220], "end": [200, 80, 160] }, "solids": { "start": [80, 200, 255], "end": [40, 120, 190] }, "background": { "start": [25, 35, 65], "end": [12, 18, 40] } },
			{ "accent": { "start": [14, 206, 231], "end": [0, 0, 0] }, "background": { "start": [155, 153, 156], "end": [200, 200, 200] }, "solids": { "start": [51, 51, 51], "end": [27, 27, 27] } },
			{ "accent": { "start": [235, 235, 235], "end": [35, 35, 35] }, "solids": { "start": [140, 140, 140], "end": [95, 95, 95] }, "background": { "start": [28, 28, 28], "end": [14, 14, 14] } }
		]
	}

	globalThis.hats = [
		{
			"hat": "no_hat",
			"unlock_moons": 0,
			"override_unlock": true
		},
		{
			"hat": "tophat",
			"unlock_moons": 3,
			"override_unlock": false
		},
		{
			"hat": "viking",
			"unlock_moons": 5,
			"override_unlock": false
		},
		{
			"hat": "flower",
			"unlock_moons": 10,
			"override_unlock": false
		},
		{
			"hat": "wizard",
			"unlock_moons": 15,
			"override_unlock": false
		},
		{
			"hat": "beard",
			"unlock_moons": 25,
			"override_unlock": false
		},
		{
			"hat": "sunglasses",
			"unlock_moons": 35,
			"override_unlock": false
		},
		{
			"hat": "wings",
			"unlock_moons": 45,
			"override_unlock": false
		},
		{
			"hat": "kitty",
			"unlock_moons": 55,
			"override_unlock": false
		},
		{
			"hat": "minime",
			"unlock_moons": 65,
			"override_unlock": false
		},
		{
			"hat": "crown",
			"unlock_moons": 75,
			"override_unlock": false
		}
	]

	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime) {
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.

	//runtime.addEventListener("tick", () => Tick(runtime))
}