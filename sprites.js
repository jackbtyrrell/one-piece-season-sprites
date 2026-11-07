// The list of sprites shown on the page (Fortnite: Treasure Hunters season).
// To add a sprite picture: put it in images/sprites/ and set image: "images/sprites/<file>".
// rarity can be: Common, Uncommon, Rare, Epic, Legendary, Mythic
// chance = % chance that a sprite you find is this one (game version 43.00,
//          from royal-arena.net/sprites). null = it doesn't come from the normal sprite pool.
// Leave image empty to show a "?" placeholder.

const SPRITES = [
  { name: "Plundarrgh",        rarity: "Mythic",    chance: 0.5,    image: "images/sprites/plundarrgh.webp", ability: "Opening a chest increases pickaxe speed and movement speed." },
  { name: "Sweet Dreams",      rarity: "Mythic",    chance: null,   image: "images/sprites/sweet-dreams.webp", ability: "Grants a random item at each level, exploding with Mythic loot at max level." },

  { name: "Transponder Snail", rarity: "Legendary", chance: 0.9901, image: "images/sprites/transponder-snail.webp", ability: "Extra resources on pickup. Teammates with this sprite get some too." },
  { name: "Lil' Flacko",       rarity: "Legendary", chance: 1,      image: "images/sprites/lil-flacko.webp", ability: "Makes a small shockwave when you land, knocking back enemies." },
  { name: "Lil' Uzi Vert Jr.", rarity: "Legendary", chance: null,   image: "images/sprites/lil-uzi-vert-jr.webp", ability: "Makes a Chug Splash effect when you restore shields." },

  { name: "Lil' Squibbly",     rarity: "Epic",      chance: 9.376,  image: "images/sprites/lil-squibbly.webp", ability: "Jumping into a fishing hole fishes it and gives bonus loot." },
  { name: "Kelper",            rarity: "Epic",      chance: 9.376,  image: "images/sprites/kelper.webp", ability: "Restores health over time while you're in water." },
  { name: "Exmarks",           rarity: "Epic",      chance: 9.376,  image: "images/sprites/exmarks.webp", ability: "Reveals Treasure Maps and Wanted Posters." },
  { name: "Chester",           rarity: "Epic",      chance: 9.376,  image: "images/sprites/chester.webp", ability: "Chance of extra loot from Treasure Chests, and no fall damage." },

  { name: "Wayfinder",         rarity: "Rare",      chance: 15.002, image: "images/sprites/wayfinder.webp", ability: "Reveals nearby sprites and gives more items from Buried Chests." },
  { name: "Barry O'Fish",      rarity: "Rare",      chance: 15.002, image: "images/sprites/barry-ofish.webp", ability: "Tactical sprint uses less stamina in water." },
  { name: "Re-Pete",           rarity: "Rare",      chance: 15.002, image: "images/sprites/re-pete.webp", ability: "Faster reloads, with a chance that reloading refunds ammo." },
  { name: "Halfpeel'd",        rarity: "Rare",      chance: 15.002, image: "images/sprites/halfpeeld.webp", ability: "Marks eliminations on the map." },
];
