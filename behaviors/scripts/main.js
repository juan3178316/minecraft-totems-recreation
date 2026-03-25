import { system, world, EntityComponentTypes } from "@minecraft/server";


function loadTotem(name,hand) {
	system.run(() => {
		new PlayerTotemEffect(name,hand);
	});
}

function getTypeHand(player,hand) {
	return player.getComponent(EntityComponentTypes.Equippable).getEquipmentSlot(hand);
}

function potionEffect(p,obj,c=0) {
	do {
		p.addEffect("minecraft:"+obj[c].n, obj[c].t * 20, {amplifier: obj[c].amp, showParticles: obj[c].sp});
		c++;
	} while (c<obj.length);
}

world.beforeEvents.entityHurt.subscribe((totems) => {
	let player = totems.hurtEntity;
	if(player.typeId !== "minecraft:player") return;
	if(totems.damage >= player.getComponent(EntityComponentTypes.Health).currentValue) {
		// Query if the damage that receive the player is greater than or equal to her current health
		if(getTypeHand(player,"Mainhand").hasItem() && getTypeHand(player,"Mainhand").hasTag("ct:custom_totem")) {
			totems.cancel = true;
			loadTotem(String(player.name),"Mainhand");
		}
		else if(getTypeHand(player,"Offhand").hasItem() && getTypeHand(player,"Offhand").hasTag("ct:custom_totem")) {
			totems.cancel = true;
			loadTotem(String(player.name),"Offhand");
		}
		else return;
	}
});

class PlayerTotemEffect {
	player;
	itemHand;
	constructor(namePlayer,hand) {
		this.player = world.getPlayers({name:namePlayer})[0];
		getTypeHand(this.player,hand).setItem(); // remove no stackeable totems

		// The commented code its used for item with stacks greater than 1
		//try { getTypeHand(this.player,hand).amount -= 1; }
		//catch(error) {
			//getTypeHand(this.player,hand).setItem();
			//console.error(error); // unnecessary
		//};
		// Apply totem behavior
		this.player.getComponent(EntityComponentTypes.Health).resetToDefaultValue();
		this.player.applyDamage(1);
		potionEffect(this.player, [
			{ n:"absorption",t:5,amp:1,sp:true },
			{ n:"regeneration",t:45,amp:1,sp:true },
			{ n:"fire_resistance",t:40,amp:0,sp:true }
		]);
		this.player.runCommand("particle minecraft:totem_particle ~ ~2 ~");
		this.player.runCommand("particle minecraft:totem_particle ~ ~2 ~");
		this.player.runCommand("playsound random.totem");
	}
}
