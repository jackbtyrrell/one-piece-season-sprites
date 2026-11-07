// The list of sprites shown on the page (Fortnite: Treasure Hunters season).
//
// Each sprite has a base look and may have variants:
//   Fortune (the game files call it "Jeweled") and Cursed.
//
// looks: { base, fortune, cursed } — each look has:
//   image:  the picture in images/sprites/
//   chance: % chance that a sprite you find is this sprite in this look
//           (game version 43.00, from royal-arena.net/sprites).
//           null = it doesn't come from the normal sprite pool.
//   note:   (optional) text to show instead of a chance
//
// rarity can be: Common, Uncommon, Rare, Epic, Legendary, Mythic

const CURSED = { note: "Cursed Sprite Chests only" };
const NOT_IN_POOL = { chance: null };

const SPRITES = [
  { name: "Plundarrgh", rarity: "Mythic",
    ability: "Opening a chest increases pickaxe speed and movement speed.",
    looks: {
      base:    { image: "images/sprites/plundarrgh.webp",         chance: 0.495 },
      fortune: { image: "images/sprites/plundarrgh-fortune.png",  chance: 0.005 },
      cursed:  { image: "images/sprites/plundarrgh-cursed.png",   ...CURSED },
    } },

  { name: "Sweet Dreams", rarity: "Mythic",
    ability: "Grants a random item at each level, exploding with Mythic loot at max level.",
    looks: {
      base: { image: "images/sprites/sweet-dreams.webp", ...NOT_IN_POOL },
    } },

  { name: "Transponder Snail", rarity: "Legendary",
    ability: "Extra resources on pickup. Teammates with this sprite get some too.",
    looks: {
      base: { image: "images/sprites/transponder-snail.webp", chance: 0.9901 },
    } },

  { name: "Lil' Flacko", rarity: "Legendary",
    ability: "Makes a small shockwave when you land, knocking back enemies.",
    looks: {
      base:    { image: "images/sprites/lil-flacko.webp",         chance: 0.9901 },
      fortune: { image: "images/sprites/lil-flacko-fortune.png",  chance: 0.01 },
      cursed:  { image: "images/sprites/lil-flacko-cursed.png",   ...CURSED },
    } },

  { name: "Lil' Uzi Vert Jr.", rarity: "Legendary",
    ability: "Makes a Chug Splash effect when you restore shields.",
    looks: {
      base:    { image: "images/sprites/lil-uzi-vert-jr.webp",         ...NOT_IN_POOL },
      fortune: { image: "images/sprites/lil-uzi-vert-jr-fortune.png",  ...NOT_IN_POOL },
      cursed:  { image: "images/sprites/lil-uzi-vert-jr-cursed.png",   ...NOT_IN_POOL },
    } },

  { name: "Lil' Squibbly", rarity: "Epic",
    ability: "Jumping into a fishing hole fishes it and gives bonus loot.",
    looks: {
      base:    { image: "images/sprites/lil-squibbly.webp",         chance: 9.282 },
      fortune: { image: "images/sprites/lil-squibbly-fortune.png",  chance: 0.0938 },
      cursed:  { image: "images/sprites/lil-squibbly-cursed.png",   ...CURSED },
    } },

  { name: "Kelper", rarity: "Epic",
    ability: "Restores health over time while you're in water.",
    looks: {
      base:    { image: "images/sprites/kelper.webp",         chance: 9.282 },
      fortune: { image: "images/sprites/kelper-fortune.png",  chance: 0.0938 },
      cursed:  { image: "images/sprites/kelper-cursed.png",   ...CURSED },
    } },

  { name: "Exmarks", rarity: "Epic",
    ability: "Reveals Treasure Maps and Wanted Posters.",
    looks: {
      base:    { image: "images/sprites/exmarks.webp",         chance: 9.282 },
      fortune: { image: "images/sprites/exmarks-fortune.png",  chance: 0.0938 },
      cursed:  { image: "images/sprites/exmarks-cursed.png",   ...CURSED },
    } },

  { name: "Chester", rarity: "Epic",
    ability: "Chance of extra loot from Treasure Chests, and no fall damage.",
    looks: {
      base:    { image: "images/sprites/chester.webp",         chance: 9.282 },
      fortune: { image: "images/sprites/chester-fortune.png",  chance: 0.0938 },
      cursed:  { image: "images/sprites/chester-cursed.png",   ...CURSED },
    } },

  { name: "Wayfinder", rarity: "Rare",
    ability: "Reveals nearby sprites and gives more items from Buried Chests.",
    looks: {
      base:    { image: "images/sprites/wayfinder.webp",         chance: 14.701 },
      fortune: { image: "images/sprites/wayfinder-fortune.png",  chance: 0.3 },
      cursed:  { image: "images/sprites/wayfinder-cursed.png",   ...CURSED },
    } },

  { name: "Barry O'Fish", rarity: "Rare",
    ability: "Tactical sprint uses less stamina in water.",
    looks: {
      base:    { image: "images/sprites/barry-ofish.webp",         chance: 14.701 },
      fortune: { image: "images/sprites/barry-ofish-fortune.png",  chance: 0.3 },
      cursed:  { image: "images/sprites/barry-ofish-cursed.png",   ...CURSED },
    } },

  { name: "Re-Pete", rarity: "Rare",
    ability: "Faster reloads, with a chance that reloading refunds ammo.",
    looks: {
      base:    { image: "images/sprites/re-pete.webp",         chance: 14.701 },
      fortune: { image: "images/sprites/re-pete-fortune.png",  chance: 0.3 },
      cursed:  { image: "images/sprites/re-pete-cursed.png",   ...CURSED },
    } },

  { name: "Halfpeel'd", rarity: "Rare",
    ability: "Marks eliminations on the map.",
    looks: {
      base:    { image: "images/sprites/halfpeeld.webp",         chance: 14.701 },
      fortune: { image: "images/sprites/halfpeeld-fortune.png",  chance: 0.3 },
      cursed:  { image: "images/sprites/halfpeeld-cursed.png",   ...CURSED },
    } },
];

const VARIANT_INFO = {
  base:    { label: "Base" },
  fortune: { label: "Fortune", perk: "Reveals nearby chests." },
  cursed:  { label: "Cursed",  perk: "Better odds of rare variants, but water hurts you." },
};
