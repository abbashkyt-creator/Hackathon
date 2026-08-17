function color_normalize(array) {
    return array.map(value => value / 255);
}

function color_mix(a, b) {
    return [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2,
        (a[2] + b[2]) / 2
    ];
}

function apply_colorscheme(effect, start, end) {
    start = color_normalize(start);
    end = color_normalize(end);
    effect.setParameter(0, start);
    effect.setParameter(2, end);
}

function to_degrees(radians) {
    return radians * (180 / Math.PI);
}

function to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

// MARK: Save game

async function save_game(runtime) {
    globalThis.savegame = {
        "current_level": runtime.globalVars.current_level,
        "highest_level": runtime.globalVars.highest_level,
        "current_world": runtime.globalVars.current_world,
        "game_finished": runtime.globalVars.game_finished,
        "collected_moons": globalThis.savegame.collected_moons,
        "selected_hat": runtime.globalVars.selected_hat,
        "overridden_hats": globalThis.savegame.overridden_hats
    };

    await runtime.storage.setItem(`${runtime.projectName}_save`, JSON.stringify(globalThis.savegame));
    console.log("saved", globalThis.savegame);
    return true;
}

async function load_game(runtime) {
    const savegame = await runtime.storage.getItem(`${runtime.projectName}_save`);
    const new_savegame = {
        "current_world": 1,
        "current_level": 1,
        "highest_level": 1,
        "game_finished": false,
        "collected_moons": new Array(runtime.globalVars.level_amount).fill(false),
        "selected_hat": 0,
        "overridden_hats": []
    }

    if (savegame) {
        try {
            let data = JSON.parse(savegame);
            globalThis.savegame = data;

            if (globalThis.savegame.collected_moons.length < runtime.globalVars.level_amount) {
                // migrate savefile
                for (let i = 0; i < runtime.globalVars.level_amount - globalThis.savegame.collected_moons.length; i++) {
                    globalThis.savegame.game_finished = false; // reset game finished state
                    globalThis.savegame.collected_moons.push(false); // add missing moons
                }
            }

            if (!globalThis.savegame.selected_hat) {
                globalThis.savegame.selected_hat = 0;
            }

            if (!globalThis.savegame.overridden_hats) {
                globalThis.savegame.overridden_hats = [];
            }

            if (!globalThis.savegame.highest_level) globalThis.savegame.highest_level = globalThis.savegame.current_level;
        } catch (e) {
            // corrupted or invalid json
            console.error("Json parse failed", savegame);
            globalThis.savegame = new_savegame;
        }
    } else {
        globalThis.savegame = new_savegame;
    }

    apply_savegame(runtime);

    return;
}

function apply_savegame(runtime) {
    runtime.globalVars.game_finished = globalThis.savegame.game_finished;
    runtime.globalVars.current_level = globalThis.savegame.current_level;
    runtime.globalVars.current_world = globalThis.savegame.current_world;
    runtime.globalVars.highest_level = globalThis.savegame.highest_level;
    runtime.globalVars.selected_hat = globalThis.savegame.selected_hat;

    globalThis.savegame.overridden_hats.forEach(e => {
        globalThis.hats[e].override_unlock = true;
    })
}

async function clear_savegame(runtime) {
    await runtime.storage.removeItem(`${runtime.projectName}_save`);
}

const scriptsInEvents = {

	async Loader_Event2_Act3(runtime, localVars)
	{
		const language = runtime.objects.language.getFirstInstance();
		language.setJsonDataCopy(globalThis.language);
		
		load_game(runtime);
	},

	async Loader_Event6_Act1(runtime, localVars)
	{
		runtime.globalVars.current_level = globalThis.savegame.current_level;
		runtime.globalVars.current_world = globalThis.savegame.current_world;
	},

	async General_Event3_Act1(runtime, localVars)
	{
		globalThis.savegame.collected_moons[runtime.globalVars.current_level-1] = true;
	},

	async General_Event4_Act2(runtime, localVars)
	{
		runtime.globalVars.last_level = runtime.globalVars.current_level;
		runtime.globalVars.current_level += 1;
		if(runtime.globalVars.highest_level < runtime.globalVars.current_level) runtime.globalVars.highest_level = runtime.globalVars.current_level;
		
		runtime.globalVars.current_world = Math.floor((runtime.globalVars.current_level-1) / 5) + 1;
		
		if(runtime.globalVars.current_level > runtime.globalVars.level_amount) {
			runtime.globalVars.game_finished = true;
		}
		
		if(runtime.globalVars.game_finished) {
			runtime.globalVars.current_level = runtime.globalVars.level_amount+1;
		
			runtime.globalVars.current_world = Math.floor((runtime.globalVars.current_level-1) / 5) + 1;
			save_game(runtime);
			runtime.goToLayout("level_select");
			runtime.callFunction("stop_gameplay");
		} else {
			try {
				const test = runtime.getLayout("level" + runtime.globalVars.current_level);
				save_game(runtime);
				await runtime.callFunction("request_interstitial");
				runtime.goToLayout("level" + runtime.globalVars.current_level);
			} catch (e) {
				runtime.globalVars.current_level = 1;
				save_game(runtime);
				runtime.goToLayout("level1");
			}
		}
	},

	async General_Event5_Act2(runtime, localVars)
	{
		if(runtime.globalVars.game_finished) {
			runtime.globalVars.current_level = runtime.globalVars.level_amount+1;
			runtime.globalVars.current_world = Math.floor((runtime.globalVars.current_level-1) / 5) + 1;
			save_game(runtime);
			runtime.goToLayout("level_select");
			runtime.callFunction("stop_gameplay");
		} else {
			try {
				const test = runtime.getLayout("level" + runtime.globalVars.current_level);
				save_game(runtime);
				await runtime.callFunction("request_interstitial");
				runtime.goToLayout("level" + runtime.globalVars.current_level);
			} catch (e) {
				runtime.globalVars.current_level = 1;
				save_game(runtime);
				runtime.goToLayout("level1");
			}
			}
	},

	async General_Event6_Act2(runtime, localVars)
	{
		runtime.goToLayout("level_select");
		runtime.callFunction("stop_gameplay");
	},

	async General_Event7_Act3(runtime, localVars)
	{
		try {
			const test = runtime.getLayout("level" + localVars.lvl);
			runtime.globalVars.current_level = localVars.lvl;
			runtime.globalVars.current_world = Math.floor((runtime.globalVars.current_level-1) / 5) + 1;
			await runtime.callFunction("request_interstitial");
			runtime.goToLayout("level" + localVars.lvl_tmp);
		} catch (e) {
			runtime.globalVars.current_level = localVars.level_amount+1;
			save_game(runtime);
			runtime.goToLayout("level_select");
			runtime.callFunction("stop_gameplay");
		}
	},

	async Game_Event4_Act1(runtime, localVars)
	{
		for(const button of runtime.objects.button_ad.instances()) {
			for(const child of button.children()) {
				child.isVisible = runtime.globalVars.death_amount >= 0;
			}
		}
	},

	async Game_Event16_Act1(runtime, localVars)
	{
		globalThis.hats[runtime.globalVars.selected_hat].override_unlock = true;
		globalThis.savegame.overridden_hats.push(runtime.globalVars.selected_hat);
	},

	async Game_Event17_Act1(runtime, localVars)
	{
		save_game(runtime);
	},

	async Game_Event19_Act3(runtime, localVars)
	{
		if(runtime.globalVars.selected_hat < 0) {
			runtime.globalVars.selected_hat = globalThis.hats.length-1;
		} else if(runtime.globalVars.selected_hat > globalThis.hats.length-1) {
			runtime.globalVars.selected_hat = 0;
		}
	},

	async Game_Event19_Act6(runtime, localVars)
	{
const moon_amount = globalThis.savegame.collected_moons.filter(x => x === true).length;
const this_hat = globalThis.hats[runtime.globalVars.selected_hat];
const player = runtime.objects.player.getFirstInstance();

if(this_hat.unlock_moons <= moon_amount || this_hat.override_unlock === true) {
	//console.log("hat unlocked");
	const button = runtime.objects.hatselect_accept.createInstance("main", player.x, player.y + 120, true, "accept");
	if(runtime.globalVars.manual_input_override === "touch") button.getChildAt(0).isVisible = false;
} else {
	//console.log("hat locked");
	const unlock = runtime.objects.hatselect_accept.createInstance("main", player.x, player.y + 120, true, "unlock");
	unlock.getChildAt(0).text = `${moon_amount}/${this_hat.unlock_moons}`;
	if(runtime.globalVars.manual_input_override === "touch") unlock.getChildAt(1).isVisible = false;
}
	},

	async Game_Event79_Act3(runtime, localVars)
	{
		const up_angle = 270;
		let diff = localVars.steepness - up_angle;
		diff = ((diff % 360) + 360) % 360;
		diff = diff > 180 ? diff - 360 : diff;
		let steepness_deg = Math.abs(diff);
		steepness_deg = Math.min(steepness_deg, 90);
		localVars.steepness = Math.pow(Math.max(0, 1 - steepness_deg / 15), 2);
	},

	async Game_Event158_Act1(runtime, localVars)
	{
		if(!globalThis.colors) {
			globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world-1];
		}
		
		localVars.r = globalThis.colors.accent.start[0];
		localVars.g = globalThis.colors.accent.start[1];
		localVars.b = globalThis.colors.accent.start[2];
	},

	async Game_Event160_Act1(runtime, localVars)
	{
		globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world-1];
		
		for(const b of runtime.objects.button.instances()) {
			b.colorRgb = color_normalize(globalThis.colors.accent.start);
		}
		
		for(const f of runtime.objects.forcefield.instances()) {
			f.colorRgb = color_normalize(globalThis.colors.accent.start);
		}
		
		for(const t of runtime.objects.timedilator.instances()) {
			t.colorRgb = color_normalize(globalThis.colors.accent.start);
		}
		
		for(const p of runtime.objects.portal_sprite.instances()) {
			p.colorRgb = color_normalize(globalThis.colors.accent.start);
		}
		
		for(const pd of runtime.objects.portal_direction.instances()) {
			pd.colorRgb = color_normalize(globalThis.colors.accent.start);
		}
		
		const goal = runtime.objects.goal_door.getFirstInstance();
		goal.colorRgb = color_normalize(globalThis.colors.accent.start);
		goal.getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.start);
		
		for (const alltext of runtime.objects.all_text.instances()) {
			alltext.fontColor = color_normalize(globalThis.colors.accent.start);
		}
		
		const transition_layer = runtime.layout.getLayer("TRANSITION");
		transition_layer.backgroundColor = color_normalize(globalThis.colors.background.end);
		
		runtime.layout.getLayer("background_grad").backgroundColor = color_normalize(globalThis.colors.background.start);
		runtime.objects.background_gradient.getFirstInstance().colorRgb = color_normalize(globalThis.colors.background.end);
		
		runtime.layout.getLayer("solids_grad").backgroundColor = color_normalize(globalThis.colors.solids.start);
		runtime.objects.solid_gradient.getFirstInstance().colorRgb = color_normalize(globalThis.colors.solids.end);
	},

	async Game_Event162_Act1(runtime, localVars)
	{
		if(!globalThis.colors) {
			globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world-1];
		}
		runtime.objects.all_text.getFirstPickedInstance().fontColor = color_normalize(globalThis.colors.accent.start);
	},

	async Game_Event163_Act1(runtime, localVars)
	{
		try {
			if(!globalThis.colors) {
				globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world-1];
			}
		
			const player = runtime.objects.player.getFirstInstance();
			const player_transition = runtime.objects.transition_player.getFirstInstance();
		
			player.colorRgb = color_normalize(globalThis.colors.accent.start);
			player.getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.end);
			player.getChildAt(0).getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.start);
		
			player_transition.colorRgb = color_normalize(globalThis.colors.accent.start);
			player_transition.getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.end);
		} catch (err) {
			// fail silent, it only causes the cosmetics to not be colored properly
		}
	},

	async Game_Event199_Act3(runtime, localVars)
	{
		globalThis.colors = globalThis.color_data.worlds[runtime.globalVars.current_world];
		
		for(const txt of runtime.objects.all_text.instances()) {
			txt.fontColor = color_normalize(globalThis.colors.accent.start);
		}
		
		const transition_layer = runtime.layout.getLayer("TRANSITION");
		transition_layer.backgroundColor = color_normalize(globalThis.colors.background.end);
	},

	async Game_Event206_Act1(runtime, localVars)
	{
		const all = globalThis.savegame.collected_moons.every(item => item === true);
		const moon = runtime.objects.moon_collected.getFirstPickedInstance();
		
		if(all) {
			moon.destroy();
		}
	},

	async Game_Event207_Act1(runtime, localVars)
	{
		const moon = runtime.objects.moon_collected.getFirstPickedInstance();
		moon.setAnimation(globalThis.savegame.collected_moons[moon.instVars.lvl].toString());
	},

	async Game_Event220_Act1(runtime, localVars)
	{
		await clear_savegame(runtime);
		console.log("cleared savegame");
	},

	async Game_Event221_Act1(runtime, localVars)
	{
		const langs = localVars.lang_cycle.split("|");
		const i = langs.indexOf(runtime.globalVars.language);
		
		if(langs[i+1]){
			runtime.globalVars.language = langs[i+1];
		} else {
			runtime.globalVars.language = langs[0];
		}
	},

	async Game_Event297_Act3(runtime, localVars)
	{
		const button = runtime.objects.button.getFirstPickedInstance();
		const func = button.instVars.function.split("|");
		
		if(button.instVars.audio !== "") runtime.callFunction("play_audio", button.instVars.audio, button.instVars.audio + button.uid, true, -5);
		
		const signal_receiver_sprites = runtime.objects.signal_receiver_sprite.getAllInstances();
		const receiver = [...signal_receiver_sprites].filter(e => e.instVars.signal_receiver !== "" && e.instVars.signal_receiver.split(",").some(item => button.instVars.signal.split(",").includes(item)));
		
		if (func[0] === "rotate_level") {
			const level = runtime.layout;
			button.behaviors.Tween.startTween("value", to_degrees(level.angle) + parseInt(func[1]), 0.5, "linear", {"startValue": to_degrees(level.angle), "tags": "level_rotate"});
		} else if (func[0] === "saw_follow") {
			const player = runtime.objects.player.getFirstInstance();
			receiver[0].behaviors.Follow.startFollowing(player, true);
		} else if (func[0] === "reverse_gravity") {
			const player = runtime.objects.player.getFirstInstance();
			player.behaviors.Physics.behavior.worldGravity = -player.behaviors.Physics.behavior.worldGravity;
			player.instVars.gravity_reversed = -player.instVars.gravity_reversed;
		} else if (func[0] === "slide") {
			const player = runtime.objects.player.getFirstInstance();
			player.instVars.slide = true;
			const dir = Math.sign(parseInt(func[1]));
			player.instVars.slide_dir = dir;
			runtime.callFunction("set_camera_offset_X", 300*dir);
			const level_angle = runtime.layout.angle;
			button.behaviors.Tween.startTween("value", -11*dir, 0.5, "linear", {"startValue": to_degrees(level_angle), "tags": "level_rotate"});
		} else if (func[0] === "invisible_player") {
			const player = runtime.objects.player.getFirstInstance();
			player.behaviors.Tween.startTween("opacity", 0, 1.5, "linear");
		} else if (func[0] === "set_gravity") {
			const player = runtime.objects.player.getFirstInstance();
			player.behaviors.Physics.behavior.worldGravity = parseFloat(func[1]);
		} else if (func[0] === "player_motor") {
			const player = runtime.objects.player.getFirstInstance();
			player.instVars.motor = parseInt(func[1]);
		} else if (func[0] === "screenwrap") {
			const player = runtime.objects.player.getFirstInstance();
			player.instVars.screenwrap = true;
		
			const wrap_top = runtime.objects.screenwrap_visual.createInstance("main", runtime.layout.width, 0);
			const wrap_bot = runtime.objects.screenwrap_visual.createInstance("main", runtime.layout.width, runtime.layout.height-21);
		
			wrap_top.width = runtime.layout.width*10;
			wrap_bot.width = runtime.layout.width*10;
		
			wrap_top.colorRgb = color_normalize(globalThis.colors.accent.end);
			wrap_bot.colorRgb = color_normalize(globalThis.colors.accent.end);
		} else if (func[0] === "screenwrap_x") {
			const player = runtime.objects.player.getFirstInstance();
			player.instVars.screenwrap = true;
		
			const wrap_left = runtime.objects.screenwrap_visual.createInstance("main", 0, runtime.layout.height);
			const wrap_right = runtime.objects.screenwrap_visual.createInstance("main", runtime.layout.width, runtime.layout.height);
		
			wrap_left.width = runtime.layout.height*10;
			wrap_right.width = runtime.layout.height*10;
			wrap_left.angleDegrees = 270;
			wrap_right.angleDegrees = 90; 
		
			wrap_left.colorRgb = color_normalize(globalThis.colors.accent.end);
			wrap_right.colorRgb = color_normalize(globalThis.colors.accent.end);
		} else if (func[0] === "special_sawwave") {
			runtime.callFunction("special_sawwave", button.instVars.signal);
		} else if (func[0] === "goto_level") {
			runtime.callFunction("from_levelselect", parseInt(func[1]));
		} else if (func[0] === "special_sine") {
			// good lord is this ugly
			runtime.objects.buzzsaw.getFirstInstance().behaviors.Sine.period *= 0.75;
			const goal = runtime.objects.goal_door.getFirstInstance(); 
			goal.behaviors.Tween.startTween("y", goal.y + 100, 0.6, "out-cubic");
		} else if (func[0] === "lvl_select_teleport") {
			const player = runtime.objects.player.getFirstInstance();
			const button = runtime.objects.button.getAllInstances().find(b => parseInt(b.instVars.function.split("|")[1]) === runtime.globalVars.highest_level);
			player.behaviors.Physics.teleport(button.x, button.y + 160);
		} else if (func[0] === "set_gravity_falling") {
			const player = runtime.objects.player.getFirstInstance();
			player.behaviors.Physics.behavior.worldGravity = parseFloat(func[1]);
			runtime.callFunction("set_camera_offset_Y", 240);
		} else if (func[0] === "start_player_shmup") {
			runtime.callFunction("start_player_shmup");
		} else if (func[0] === "set_camera_offset_Y") {
			runtime.callFunction("set_camera_offset_Y", parseInt(func[1]));
		} else if (func[0] === "layoutwarp") {
			const layer = runtime.layout.getLayer("warp");
			const added = layer.effects.WarpLayout.getParameter(2) + parseInt(func[1]);
			layer.effects.WarpLayout.setParameter(2, added);
			layer.effects.WarpLayout.setParameter(3, added);
		} else if (func[0] === "oobe") {
			const player = runtime.objects.player.getFirstInstance();
			const oobe = runtime.objects.oobe_player.createInstance("main", player.x, player.y, true, "default");
			oobe.opacity = 0.3;
			oobe.behaviors.Tween.startTween("opacity", 1, 0.5, "in-out-sine", {"pingPong": true, "loop": true});
			oobe.behaviors.Tween.startTween("y", player.y - 320, 0.75, "out-cubic");
			player.addChild(oobe, {
				"transformX": true,
				"transformY": true,
				"destroyWithParent": true
			});
			oobe.colorRgb = color_normalize(globalThis.colors.accent.start);
			oobe.getChildAt(0).colorRgb = color_normalize(globalThis.colors.accent.end);
			runtime.callFunction("set_camera_offset_Y", -200);
		} else if (func[0] === "reverse_control") {
			const player = runtime.objects.player.getFirstInstance();
			player.instVars.reverse_controls = true;
		} else if (func[0] === "darkness") {
			const darkness = runtime.objects.darkness_cutout.getFirstInstance();
			const size = darkness.width * 0.66;
			darkness.behaviors.Tween.startTween("size", [size, size], 0.5, "out-cubic");
		} else if (func[0] === "activate_sawspawner") {
			const spawner = runtime.objects.sawspawner.getFirstInstance();
			spawner.behaviors.Timer.startTimer(parseFloat(func[1]), "spawn_saw", "regular");
		}
		
		
		receiver.forEach(r => {
			try {
			if(func[0] === "tween") {
				const dir_factor = r.instVars.tween_dir_factor.split(",").map(v => parseFloat(v));
				const dir_extra = r.instVars.tween_extra.split(",").map(v => parseInt(v));
				let duration = r.instVars.tween_duration_override > 0 ? r.instVars.tween_duration_override : func[3];
				const pos = func[2].split(",").map(v => parseInt(v));
				r.instVars.playerpush_x = Math.sign(pos[0]*dir_factor[0]+dir_extra[0]);
				r.instVars.playerpush_y = Math.sign(pos[1]*dir_factor[1]+dir_extra[1]);
				r.behaviors.Tween.startTween(func[1], [r.x+pos[0]*dir_factor[0]+dir_extra[0],r.y+pos[1]*dir_factor[1]+dir_extra[1]], parseFloat(duration), func[4], {"tags": "move"});
		
				for(const child of r.allChildren()) {
					if(child.behaviors.Physics) child.behaviors.Physics.isAwake = true;
				}
			} else if (func[0] === "set_enabled") {
				r.behaviors[func[1]].isEnabled = true
			} else if (func[0] === "sine") {
				const dir_factor = r.instVars.tween_dir_factor.split(",").map(v => parseFloat(v));
				const dir_extra = r.instVars.tween_extra.split(",").map(v => parseInt(v));
				let duration = r.instVars.tween_duration_override > 0 ? r.instVars.tween_duration_override : func[3];
				const pos = func[2].split(",").map(v => parseInt(v));
				r.behaviors.Tween.startTween(func[1], [r.x+pos[0]*dir_factor[0]+dir_extra[0],r.y+pos[1]*dir_factor[1]+dir_extra[1]], parseFloat(duration), func[4], {"pingPong": true, "loop": true, "tags": "move" + button.instVars.add_tag});
				for(const child of r.allChildren()) {
					if(child.behaviors.Physics) child.behaviors.Physics.isAwake = true;
				}
			}
			} catch (err) {
				console.error("Error processing receiver:", r, err);
			}
		})
	},

	async Game_Event346_Act3(runtime, localVars)
	{
		const shot = runtime.objects.player_shoot.getFirstPickedInstance();
		shot.colorRgb = color_normalize(globalThis.colors.accent.start);
	},

	async Game_Event357_Act1(runtime, localVars)
	{
		try {
			const layer = runtime.layout.getLayer("warp");
			layer.effects.WarpLayout.setParameter(2, 0);
			layer.effects.WarpLayout.setParameter(3, 0);
		} catch {
			// just do nothing
		}
		
	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
