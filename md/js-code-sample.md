# Javascript code sample

> [!warning]
> This code it's updated in 09/14/26 - 12:46 (UTC -5)

### BP/scripts/main.js
<details>

```javascript
import { system, world } from "@minecraft/server";

const getTypeHand = (player,hand) => player.getComponent("minecraft:equippable").getEquipmentSlot(hand);

function potionEffect(p,obj,c=0) {
	do {
		p.addEffect("minecraft:"+obj[c].n, obj[c].t * 20, {amplifier: (obj[c].amp ?? 0), showParticles: (obj[c].sp ?? true)});
		c++;
	} while (c<obj.length);
}

world.beforeEvents.entityHurt.subscribe((call) => {
	let { damage, hurtEntity: player } = call;
	if(damage >= player.getComponent("minecraft:health").currentValue) {
		let offHand = getTypeHand(player,"Offhand"), mainHand = getTypeHand(player,"Mainhand");
		if(offHand.hasItem() && offHand.hasTag("ct:custom_totem")) {
			call.cancel = true;
			system.run(() => player.getItemCooldown("ct_on_use") === 0 ? new PlayerTotemEffect(Number(player.id),"Offhand") : void 0);
		}
		else if(mainHand.hasItem() && mainHand.hasTag("ct:custom_totem")) {
			call.cancel = true;
			system.run(() => player.getItemCooldown("ct_on_use") === 0 ? new PlayerTotemEffect(Number(player.id),"Mainhand") : void 0);
		}
		else return;
	}
}, { entityFilter: { type: "minecraft:player" } });

class PlayerTotemEffect {
	constructor(id,hand) {
		this.player = world.getPlayers().find(p => p.id == id);
		this.#setCooldown = 30 // Avoid spam item consume and fix critical bug | type: Int Tick
		this.itemHand = getTypeHand(this.player,hand);
		try {this.itemHand.amount--} catch(_) {this.itemHand.setItem()};
		this.#loadTotem();
	}
	#loadTotem() {
        let healthData = this.player.getComponent("minecraft:health");
        healthData.setCurrentValue(Math.min(6,healthData.currentValue + 2));
		this.player.runCommand("effect @s clear");
		this.player.applyDamage(1);
		potionEffect(this.player, [{ n:"absorption",t:5,amp:1 }, { n:"regeneration",t:45,amp:1 }, { n:"fire_resistance",t:40 }]);
		this.player.runCommand("particle minecraft:totem_particle ~ ~2 ~");
		this.player.runCommand("playsound random.totem");
	}
	set #setCooldown(t) { this.player.startItemCooldown("ct_on_use", t)}
};
```
</details>
