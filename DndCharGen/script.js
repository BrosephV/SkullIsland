const races = [
    { name: 'Human', bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, skills: [], emoji: '👤' },
    { name: 'Elf', bonuses: { dex: 2, int: 1 }, skills: ['Perception'], emoji: '🧝' },
    { name: 'Dwarf', bonuses: { con: 2, str: 1 }, skills: [], emoji: '🧔' },
    { name: 'Halfling', bonuses: { dex: 2, cha: 1 }, skills: [], emoji: '👦' },
    { name: 'Gnome', bonuses: { int: 2, dex: 1 }, skills: [], emoji: '🎅' },
    { name: 'Tiefling', bonuses: { cha: 2, int: 1 }, skills: [], emoji: '😈' }
];
const METAL_COLORS = ['light', 'medium', 'red', 'dark', 'brass', 'bronze', 'ceramic', 'copper', 'gold', 'iron', 'silver', 'steel'];
const ARMOR_METAL_COLORS = ['steel', 'iron', 'ceramic', 'brass', 'copper', 'bronze', 'silver', 'gold'];
const classes = [
    {
        name: 'Fighter', primary: ['str', 'con'], saves: ['str', 'con'], skillsChoose: 2,
        skillsFrom: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
        armor: 'All armor, shields', weapons: 'Simple weapons, martial weapons', hitDie: 10,
        subclasses: [
            {name: 'Champion', emoji: '🏆'}, {name: 'Battle Master', emoji: '🎲'}, {name: 'Eldritch Knight', emoji: '⚡'},
            {name: 'Arcane Archer', emoji: '🏹'}, {name: 'Samurai', emoji: '🗾'}, {name: 'Cavalier', emoji: '🐎'}
        ],
        subclassLevel: 3, asiLevels: [4,6,8,12,14,16,19], emoji: '⚔️',
        features: ['Fighting Style', 'Second Wind', 'Action Surge', 'Extra Attack', 'Indomitable']
    },
    {
        name: 'Wizard', primary: ['int', 'wis'], saves: ['int', 'wis'], skillsChoose: 2,
        skillsFrom: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
        armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows', hitDie: 6,
        subclasses: [
            {name: 'Abjuration', emoji: '🛡️'}, {name: 'Conjuration', emoji: '🌀'}, {name: 'Divination', emoji: '👁️'},
            {name: 'Enchantment', emoji: '💖'}, {name: 'Evocation', 'emoji': '🔥'}, {name: 'Illusion', emoji: '👻'},
            {name: 'Necromancy', emoji: '💀'}, {name: 'Transmutation', emoji: '🔄'}, {name: 'Bladesinging', emoji: '🗡️'},
            {name: 'War Magic', emoji: '⚔️'}
        ],
        subclassLevel: 2, asiLevels: [4,8,12,16,19], emoji: '🧙‍♂️',
        spells: ['Fire Bolt', 'Mage Hand', 'Shield', 'Magic Missile', 'Fireball', 'Counterspell', 'Fly', 'Dimension Door', 'Animate Objects'],
        features: ['Spellcasting', 'Arcane Recovery', 'Spell Mastery']
    },
    {
        name: 'Rogue', primary: ['dex', 'cha'], saves: ['dex', 'int'], skillsChoose: 4,
        skillsFrom: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
        armor: 'Light armor', weapons: 'Simple weapons, hand crossbows, longswords, rapiers, shortswords', hitDie: 8,
        subclasses: [
            {name: 'Thief', emoji: '💰'}, {name: 'Assassin', emoji: '☠️'}, {name: 'Arcane Trickster', emoji: '🎩'},
            {name: 'Inquisitive', emoji: '🔍'}, {name: 'Scout', emoji: '🏕️'}, {name: 'Swashbuckler', emoji: '⚔️'}
        ],
        subclassLevel: 3, asiLevels: [4,8,10,12,16,19], emoji: '🗡️',
        features: ['Sneak Attack', 'Thieves’ Cant', 'Cunning Action', 'Evasion', 'Uncanny Dodge']
    },
    {
        name: 'Cleric', primary: ['wis', 'cha'], saves: ['wis', 'cha'], skillsChoose: 2,
        skillsFrom: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
        armor: 'Light armor, medium armor, shields', weapons: 'Simple weapons', hitDie: 8,
        subclasses: [
            {name: 'Knowledge', emoji: '📚'}, {name: 'Life', emoji: '❤️'}, {name: 'Light', emoji: '☀️'},
            {name: 'Nature', emoji: '🌿'}, {name: 'Tempest', emoji: '🌩️'}, {name: 'Trickery', emoji: '🃏'},
            {name: 'War', emoji: '⚔️'}, {name: 'Forge', emoji: '🔨'}, {name: 'Grave', emoji: '⚰️'}
        ],
        subclassLevel: 1, asiLevels: [4,8,12,16,19], emoji: '✝️',
        spells: ['Guidance', 'Sacred Flame', 'Bless', 'Cure Wounds', 'Spiritual Weapon', 'Spirit Guardians', 'Revivify'],
        features: ['Spellcasting', 'Divine Domain', 'Channel Divinity']
    },
    {
        name: 'Barbarian', primary: ['str', 'con'], saves: ['str', 'con'], skillsChoose: 2,
        skillsFrom: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
        armor: 'Light armor, medium armor, shields', weapons: 'Simple weapons, martial weapons', hitDie: 12,
        subclasses: [
            {name: 'Berserker', emoji: '😡'}, {name: 'Totem Warrior', emoji: '🐺'},
            {name: 'Zealot', emoji: '🔥'}, {name: 'Ancestral Guardian', emoji: '👻'}
        ],
        subclassLevel: 3, asiLevels: [4,8,12,16,19], emoji: '🪓',
        features: ['Rage', 'Unarmored Defense', 'Reckless Attack', 'Danger Sense', 'Feral Instinct']
    },
    {
        name: 'Bard', primary: ['cha', 'dex'], saves: ['dex', 'cha'], skillsChoose: 3,
        skillsFrom: ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'],
        armor: 'Light armor', weapons: 'Simple weapons, hand crossbows, longswords, rapiers, shortswords', hitDie: 8,
        subclasses: [
            {name: 'Lore', emoji: '📖'}, {name: 'Valor', emoji: '🛡️'},
            {name: 'Glamour', emoji: '✨'}, {name: 'Swords', emoji: '⚔️'}
        ],
        subclassLevel: 3, asiLevels: [4,8,12,16,19], emoji: '🎸',
        spells: ['Vicious Mockery', 'Charm Person', 'Healing Word', 'Invisibility', 'Hypnotic Pattern', 'Dimension Door'],
        features: ['Spellcasting', 'Bardic Inspiration', 'Jack of All Trades', 'Song of Rest']
    }
];

const backgrounds = [
    { name: 'Acolyte', skills: ['Insight', 'Religion'], emoji: '🙏' },
    { name: 'Criminal', skills: ['Deception', 'Stealth'], emoji: '🕵️' },
    { name: 'Folk Hero', skills: ['Animal Handling', 'Survival'], emoji: '🦸' },
    { name: 'Noble', skills: ['History', 'Persuasion'], emoji: '👑' },
    { name: 'Sage', skills: ['Arcana', 'History'], emoji: '📚' },
    { name: 'Soldier', skills: ['Athletics', 'Intimidation'], emoji: '🥇' }
];

const skillsList = {
    'Acrobatics': 'dex',
    'Animal Handling': 'wis',
    'Arcana': 'int',
    'Athletics': 'str',
    'Deception': 'cha',
    'History': 'int',
    'Insight': 'wis',
    'Intimidation': 'cha',
    'Investigation': 'int',
    'Medicine': 'wis',
    'Nature': 'int',
    'Perception': 'wis',
    'Performance': 'cha',
    'Persuasion': 'cha',
    'Religion': 'int',
    'Sleight of Hand': 'dex',
    'Stealth': 'dex',
    'Survival': 'wis'
};

const skillEmojis = {
    'Acrobatics': '🤸',
    'Animal Handling': '🐕',
    'Arcana': '🔮',
    'Athletics': '🏋️',
    'Deception': '🤥',
    'History': '📜',
    'Insight': '💡',
    'Intimidation': '😠',
    'Investigation': '🔍',
    'Medicine': '💉',
    'Nature': '🌿',
    'Perception': '👀',
    'Performance': '🎭',
    'Persuasion': '🗨️',
    'Religion': '🙏',
    'Sleight of Hand': '✋',
    'Stealth': '👤',
    'Survival': '🏕️'
};

const abilityEmojis = {
    'str': '💪',
    'dex': '🏃',
    'con': '🛡️',
    'int': '🧠',
    'wis': '👁️',
    'cha': '🗣️'
};

const feats = [
    { name: 'Alert', emoji: '🚨' },
    { name: 'Athlete', emoji: '🏃' },
    { name: 'Great Weapon Master', emoji: '🗡️' },
    { name: 'Sharpshooter', emoji: '🏹' },
    { name: 'Lucky', emoji: '🍀' },
    { name: 'Tough', emoji: '🛡️' },
    { name: 'Spell Sniper', emoji: '🔮' }
];

const inventoryEmojis = {
    'Longsword': '🗡️',
    'Shield': '🛡️',
    'Chain Mail': '⛓️',
    'Backpack': '🎒',
    'Rations (5 days)': '🍞',
    'Torch': '🔦',
    'Spellbook': '📘',
    'Quarterstaff': '🏒',
    'Arcane Focus': '🔮',
    'Ink and Quill': '🖌️',
    'Rapier': '⚔️',
    'Shortbow': '🏹',
    'Leather Armor': '🥾',
    'Thieves’ Tools': '🛠️',
    'Rope': '🪢',
    'Mace': '🔨',
    'Scale Mail': '⚖️',
    'Holy Symbol': '✝️',
    'Prayer Book': '📖',
    'Greataxe': '🪓',
    'Handaxe': '🪓',
    'Hide Armor': '🦺',
    'Waterskin': '💧',
    'Lute': '🎻',
    'Costume': '🎭'
};

const spellEmojis = {
    'Fire Bolt': '🔥',
    'Mage Hand': '✋',
    'Shield': '🛡️',
    'Magic Missile': '☄️',
    'Fireball': '💥',
    'Counterspell': '🚫',
    'Fly': '🕊️',
    'Dimension Door': '🚪',
    'Animate Objects': '🤖',
    'Guidance': '🙏',
    'Sacred Flame': '✨',
    'Bless': '😇',
    'Cure Wounds': '🩹',
    'Spiritual Weapon': '👻',
    'Spirit Guardians': '🛡️',
    'Revivify': '⚰️',
    'Vicious Mockery': '🤬',
    'Charm Person': '💖',
    'Healing Word': '🗣️',
    'Invisibility': '👤',
    'Hypnotic Pattern': '🌀',
};

const featureEmojis = {
    'Fighting Style': '⚔️',
    'Second Wind': '🌬️',
    'Action Surge': '⚡',
    'Extra Attack': '⚔️',
    'Indomitable': '💪',
    'Spellcasting': '✨',
    'Arcane Recovery': '🧠',
    'Spell Mastery': '🔮',
    'Sneak Attack': '🗡️',
    'Thieves’ Cant': '🗣️',
    'Cunning Action': '🏃',
    'Evasion': '🤸',
    'Uncanny Dodge': '💨',
    'Divine Domain': '✝️',
    'Channel Divinity': '🙏',
    'Rage': '😡',
    'Unarmored Defense': '🛡️',
    'Reckless Attack': '🪓',
    'Danger Sense': '⚠️',
    'Feral Instinct': '🐺',
    'Bardic Inspiration': '🎶',
    'Jack of All Trades': '🃏',
    'Song of Rest': '😴',
};

const inventories = {
    'Fighter': ['Longsword', 'Shield', 'Chain Mail', 'Backpack', 'Rations (5 days)', 'Torch'],
    'Wizard': ['Spellbook', 'Quarterstaff', 'Arcane Focus', 'Backpack', 'Rations (5 days)', 'Ink and Quill'],
    'Rogue': ['Rapier', 'Shortbow', 'Leather Armor', 'Thieves’ Tools', 'Backpack', 'Rope'],
    'Cleric': ['Mace', 'Shield', 'Scale Mail', 'Holy Symbol', 'Backpack', 'Prayer Book'],
    'Barbarian': ['Greataxe', 'Handaxe', 'Hide Armor', 'Backpack', 'Rations (5 days)', 'Waterskin'],
    'Bard': ['Rapier', 'Lute', 'Leather Armor', 'Backpack', 'Rations (5 days)', 'Costume']
};

const alignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

const firstNames = [
    {name: 'Elara', gender: 'female'},
    {name: 'Thorin', gender: 'male'},
    {name: 'Lirael', gender: 'female'},
    {name: 'Garrick', gender: 'male'},
    {name: 'Sylas', gender: 'male'},
    {name: 'Mira', gender: 'female'},
    {name: 'Krag', gender: 'male'},
    {name: 'Fiona', gender: 'female'}
];
const lastNames = ['Stormwind', 'Ironfist', 'Silverleaf', 'Blackthorn', 'Fireforge', 'Moonshadow', 'Ravensong', 'Goldheart'];
// --- Detailed Weapon Data (Global Constant) ---
// Each key is the base item name. 'type' indicates how its variant/color is handled.
// 'none': No variant/color needed (e.g., 'Cane' -> cane)
// 'specific': ItemName_variantName (e.g., 'Dagger' -> Dagger_dagger)
// 'color': ItemName_color (e.g., 'Bow' -> Bow_red)
// 'variant_only': for shields where the variant itself is the second part of the URL (e.g., 'Shield_round_gold')
const WEAPON_DETAILS = {
    // Ranged
    'Crossbow': { type: 'specific', options: ['crossbow'] },
    'Slingshot': { type: 'none' },
    'Boomerang': { type: 'none' },
    'Bow': { type: 'color', options: METAL_COLORS },
    'Great_Bow': { type: 'color', options: METAL_COLORS }, // Assuming these are distinct from generic 'Bow'
    'Normal_Bow': { type: 'color', options: METAL_COLORS },
    'Recurve_Bow': { type: 'color', options: METAL_COLORS },

    // Swords
    'Dagger': { type: 'specific', options: ['dagger'] },
    'Glowsword': { type: 'none' },
    'Longsword': { type: 'specific', options: ['longsword'] },
    'Rapier': { type: 'specific', options: ['rapier'] },
    'Saber': { type: 'specific', options: ['saber'] },
    'Katana': { type: 'specific', options: ['katana'] },
    'Scimitar': { type: 'specific', options: ['scimitar'] },
    'Longsword_alt': { type: 'none' },
    'Arming_Sword': { type: 'color', options: ARMOR_METAL_COLORS },

    // Blunt
    'Flail': { type: 'specific', options: ['flail'] },
    'Mace': { type: 'specific', options: ['mace'] }, // Mace_mace as a specific variant
    'Waraxe': { type: 'specific', options: ['waraxe'] },
    'Club': { type: 'specific', options: ['club'] },

    // Polearms
    'Cane': { type: 'none' },
    'Spear': { type: 'none' },
    'Scythe': { type: 'specific', options: ['scythe'] },
    'Halberd': { type: 'specific', options: ['halberd'] },
    'Long_spear': { type: 'color', options: METAL_COLORS },
    'Dragon_spear': { type: 'color', options: METAL_COLORS },
    'Trident': { type: 'color', options: METAL_COLORS },

    // Magic
    'Simple_staff': { type: 'none' },
    'Loop_staff': { type: 'color', options: METAL_COLORS },
    'Diamond_staff': { type: 'none' },
    'Gnarled_staff': { type: 'none' },
    'S_staff': { type: 'color', options: METAL_COLORS },
    'Crystal': { type: 'none' },
    'Wand': { type: 'none' }
};

// --- Detailed Shield Data (Global Constant) ---
const SHIELD_DETAILS = {
    'Shield': { type: 'variant_only', options: ['crusader', 'spartan', 'round_black', 'round_brown', 'round_gold', 'round_green', 'round_silver', 'round_yellow'] },
    'Kite': { type: 'variant_only', options: ['kite_blue_blue', 'kite_blue_gray', 'kite_gray_blue', 'kite_gray_gray', 'kite_gray_green', 'kite_gray_orange', 'kite_gray', 'kite_green_gray', 'kite_orange', 'kite_red_gray'] },
    'Spartan_shield': { type: 'none' },
    'Two-engrailed_Shield': { type: 'none' },
    'Scutum_Shield': { type: 'none' },
    'Heater_Shield': { type: 'none' }
};
const baseURL = 'https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/#?';


const bodyColors = ['light', 'amber', 'olive', 'taupe', 'bronze', 'brown', 'black', 'lavender', 'blue', 'zombie_green', 'green', 'pale_green', 'bright_green', 'dark_green', 'fur_black', 'fur_brown', 'fur_tan', 'fur_copper', 'fur_gold', 'fur_grey', 'fur_white'];
const hairColors = ['blonde', 'ash', 'sandy', 'platinum', 'strawberry', 'redhead', 'ginger', 'carrot', 'chestnut', 'light_brown', 'dark_brown', 'black', 'raven', 'dark_gray', 'gray', 'white', 'red', 'orange', 'gold', 'green', 'blue', 'navy', 'violet', 'purple', 'pink', 'rose'];
const clothingColors = ['black', 'blue', 'bluegray', 'brown', 'charcoal', 'forest', 'gray', 'green', 'lavender', 'leather', 'maroon', 'navy', 'orange', 'pink', 'purple', 'red', 'rose', 'sky', 'slate', 'tan', 'teal', 'walnut', 'white', 'yellow'];

const hairStyles = ['Afro', 'Natural', 'Dreadlocks_short', 'Twists_fade', 'Twists_straight', 'Dreadlocks_long', 'Flat_top_straight', 'Flat_top_fade', 'Cornrows', 'Jewfro', 'Curly_short', 'Curly_long', 'Large_curls', 'Large_curls_xlong', 'Plain', 'Pixie', 'Page', 'Page2', 'Idol', 'Mop', 'Parted', 'Parted_2', 'Parted_3', 'Side_parted_with_bangs', 'Side_parted_with_bangs_2', 'Messy1', 'Messy2', 'Messy3', 'Bedhead', 'Unkempt', 'Bangs', 'Bangsshort', 'Swoop', 'Side_swoop', 'Curtains', 'Single', 'Cowlick', 'Cowlick_tall', 'Spiked_porcupine', 'Spiked_liberty2', 'Spiked_liberty', 'Spiked_beehive', 'Spiked', 'Spiked2', 'Halfmessy', 'Bunches', 'Pigtails', 'Pigtails_bangs', 'Bob', 'Lob', 'Bob_side_part', 'Relm_short', 'Half_up', 'Bangs_bun', 'Short_topknot', 'Short_topknot_2', 'Long_topknot', 'Long_topknot_2', 'Ponytail', 'Ponytail2', 'High_ponytail', 'Braid', 'Braid2', 'Shoulderl', 'Shoulderr', 'Long_tied', 'Relm_with_ponytail', 'Loose', 'Bangslong', 'Bangslong2', 'Long', 'Long_messy', 'Long_messy2', 'Curtains_long', 'Wavy', 'Long_center_part', 'Long_straight', 'Princess', 'Sara', 'Long_band', 'Xlong', 'Xlong_wavy', 'Relm_xlong'];

const raceMappings = {
    'Dragonborn': { head: 'Lizard_male', bodyColors: bodyColors, ears: 'dragon_ears', tail: 'lizard_tail', wings: 'lizard_wings' },
    'Half-orc': { head: 'Orc_male', bodyColors: ['olive', 'taupe', 'green'], ears: '', tail: '', wings: '' },
    'Human': { head: 'Human_male', bodyColors: ['light', 'olive', 'bronze', 'brown'], ears: '', tail: '', wings: '' },
    'Dwarf': { head: 'Human_male_plump', bodyColors: ['light', 'brown', 'olive'], ears: 'big_ears', tail: '', wings: '' },
    'Elf': { head: 'Human_female', bodyColors: ['light', 'olive', 'taupe'], ears: 'elven_ears', tail: '', wings: '' },
    'Gnome': { head: 'Goblin', bodyColors: ['light', 'olive', 'taupe'], ears: 'big_ears', tail: '', wings: '' },
    'Half-elf': { head: 'Human_male', bodyColors: ['light', 'olive'], ears: 'medium_elven_ears', tail: '', wings: '' },
    'Halfling': { head: 'Human_male_small', bodyColors: ['light', 'brown'], ears: '', tail: '', wings: '' },
    'Genasi': { head: 'Alien', bodyColors: ['blue', 'amber', 'green', 'lavender'], ears: '', tail: 'lizard_tail', wings: 'pixie_wings' },
    'Lizardfolk': { head: 'Lizard_male', bodyColors: bodyColors, ears: '', tail: 'lizard_tail', wings: '' },
    'Tabaxi': { head: 'Wolf_male', bodyColors: bodyColors, ears: 'cat_ears', tail: 'cat_tail', wings: '' },
    'Tiefling': { head: 'Vampire', bodyColors: ['fur_copper','fur_gold', 'lavender', 'bronze','blue'], ears: '', tail: 'lizard_tail', wings: 'bat_wings' }
};

const classMappings = {
    'Bard': {
        clothes: ['Tunic', 'TShirt', 'Longsleeve', 'Shortsleeve', 'Cardigan', 'Longsleeve_Polo'],
        legs: ['Pants', 'Pantaloons', 'Shorts'],
        jacket: ['Tabard', 'Frock_coat', 'Cape'],
        armour: ['None', 'Leather', 'Bauldron'],
        weapon: ['Dagger', 'Rapier', 'Simple_staff', 'Wand', 'Bow'],
        shield: ['Shield', 'Kite', 'None'], // Added 'None' to explicitly allow no shield
        accessory: ['belt', 'necklace']
    },
    'Rogue': {
        clothes: ['TShirt', 'Sleeveless', 'Sleeveless_laced', 'TShirt_VNeck'],
        legs: ['Pants', 'Shorts'],
        jacket: ['Cloak', 'Tattered'],
        armour: ['Leather'],
        weapon: ['Dagger', 'Scimitar', 'Longsword', 'Crossbow', 'Bow', 'Shortsword'], // Assuming Shortsword is a valid LPC item for Rogue
        shield: ['None'],
        accessory: ['belt']
    },
    'Sorcerer': {
        clothes: ['Tunic', 'Longsleeve_laced'],
        legs: ['Pants', 'Skirt'],
        jacket: ['Cloak', 'Inverness_cloak'],
        armour: ['None'],
        weapon: ['Wand', 'Simple_staff', 'Crystal', 'Dagger'],
        shield: ['None'],
        accessory: ['necklace']
    },
    'Druid': {
        clothes: ['Fur_Pants', 'TShirt', 'Sleeveless_striped'],
        legs: ['Pants', 'Shorts'],
        jacket: ['Cloak', 'Tattered'],
        armour: ['Leather', 'Bauldron'],
        weapon: ['Gnarled_staff', 'Scythe', 'Spear', 'Club', 'Dagger', 'Scimitar'], // Added more typical Druid weapons
        shield: ['Shield', 'None'], // Druids can use wooden shields
        accessory: ['belt']
    },
    'Fighter': {
        clothes: ['TShirt', 'Longsleeve', 'TShirt_Scoop'],
        legs: ['Pants'],
        jacket: ['Tabard', 'Jacket_trim'],
        armour: ['Plate', 'Chainmail', 'Legion'],
        weapon: ['Longsword', 'Arming_Sword', 'Waraxe', 'Club', 'Halberd', 'Long_spear', 'Crossbow', 'Bow', 'Flail', 'Mace', 'Dragon_spear', 'Trident', 'Katana', 'Saber', 'Scimitar', 'Spear', 'Great_Bow', 'Normal_Bow', 'Recurve_Bow'],
        shield: ['Shield', 'Kite', 'Spartan_shield', 'Two-engrailed_Shield', 'Scutum_Shield', 'Heater_Shield', 'None'],
        accessory: ['belt']
    },
    'Monk': {
        clothes: ['Sleeveless', 'Tunic_laced', 'Gi_Pants', 'Gi_Tops'],
        legs: ['Pants'],
        jacket: ['None'],
        armour: ['None'],
        weapon: ['Cane', 'Spear', 'Simple_staff', 'Club', 'Dagger'], // Monks use simple weapons
        shield: ['None'],
        accessory: ['belt']
    },
    'Ranger': {
        clothes: ['Tunic', 'TShirt', 'TShirt_VNeck'],
        legs: ['Pants', 'Shorts'],
        jacket: ['Cloak', 'Vest'],
        armour: ['Leather'],
        weapon: ['Bow', 'Longsword', 'Dagger', 'Spear', 'Crossbow', 'Scimitar', 'Handaxe'], // Added handaxe assuming it's available and fitting
        shield: ['Shield', 'None'],
        accessory: ['belt']
    },
    'Warlock': {
        clothes: ['Tunic', 'Longsleeve', 'Longsleeve_laced'],
        legs: ['Pants', 'Skirt'],
        jacket: ['Cloak', 'Inverness_cloak'],
        armour: ['None'],
        weapon: ['Wand', 'Scythe', 'Crystal', 'Dagger', 'Simple_staff', 'Loop_staff', 'S_staff'],
        shield: ['None'],
        accessory: ['necklace', 'belt']
    },
    'Paladin': {
        clothes: ['Tunic', 'Longsleeve', 'TShirt'],
        legs: ['Pants'],
        jacket: ['Tabard', 'Cape'],
        armour: ['Plate', 'Chainmail', 'Legion', 'Bauldron'],
        weapon: ['Longsword', 'Mace', 'Flail', 'Halberd', 'Trident', 'Arming_Sword', 'Dragon_spear', 'Waraxe', 'Club', 'Spear', 'Scimitar'],
        shield: ['Shield', 'Kite', 'Spartan_shield', 'Two-engrailed_Shield', 'Scutum_Shield', 'Heater_Shield', 'None'],
        accessory: ['belt', 'necklace']
    },
    'Cleric': {
        clothes: ['Tunic', 'Longsleeve_laced', 'TShirt'],
        legs: ['Pants'],
        jacket: ['Tabard', 'Cape'],
        armour: ['Plate', 'Chainmail', 'Legion', 'Leather'],
        weapon: ['Mace', 'Gnarled_staff', 'Flail', 'S_staff', 'Spear', 'Simple_staff', 'Club'],
        shield: ['Shield', 'Kite', 'Spartan_shield', 'Two-engrailed_Shield', 'Scutum_Shield', 'Heater_Shield', 'None'],
        accessory: ['belt', 'necklace']
    },
    'Barbarian': {
        clothes: ['Tunic', 'Sleeveless', 'Fur_Pants'],
        legs: ['Pants', 'Shorts'],
        jacket: ['Tattered', 'Cape'],
        armour: ['Leather', 'Bauldron'],
        weapon: ['Waraxe', 'Club', 'Longsword', 'Spear', 'Dragon_spear', 'Greataxe', 'Handaxe', 'Boomerang'], // Added more fitting Barbarian weapons
        shield: ['Shield', 'None'],
        accessory: ['belt']
    },
    'Wizard': {
        clothes: ['Tunic', 'Longsleeve', 'Longsleeve_laced'],
        legs: ['Pants', 'Skirt'],
        jacket: ['Cloak', 'Inverness_cloak'],
        armour: ['None'],
        weapon: ['Simple_staff', 'Wand', 'Dagger', 'Crystal', 'Loop_staff', 'Diamond_staff', 'S_staff'],
        shield: ['None'],
        accessory: ['necklace']
    }
    // Removed Artificer, Warlord, Champion, Alchemist, Brawler as they were not in your main `classes` array.
    // If you wish to use them, please add their definitions to the `classes` array at the top of the file as well.
};

const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const languages = ['Common', 'Elvish', 'Dwarvish', 'Halfling', 'Gnomish', 'Infernal', 'Draconic'];

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateStats() {
    return {
        str: Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1,
        dex: Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1,
        con: Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1,
        int: Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1,
        wis: Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1,
        cha: Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1
    };
}

function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function generateCharacter() {
    const charRace = randomChoice(races);
    const charClass = randomChoice(classes);
    const charBackground = randomChoice(backgrounds);

    const stats = generateStats();

    // Apply race bonuses
    for (const stat in charRace.bonuses) {
        stats[stat] += charRace.bonuses[stat];
    }

    const skillsProf = new Set([...charClass.skillsFrom.slice(0, charClass.skillsChoose), ...charBackground.skills, ...charRace.skills]);
    const savingThrows = new Set(charClass.saves);

    const inventory = inventories[charClass.name];

    const level = 1;
    const proficiencyBonus = Math.floor((level - 1) / 4) + 2;

    const spellsKnown = charClass.spells || [];
    const abilitiesKnown = charClass.features || [];

    const characterData = {
        name: `${randomChoice(firstNames).name} ${randomChoice(lastNames)}`,
        race: charRace,
        class: charClass,
        background: charBackground,
        alignment: randomChoice(alignments),
        level: level,
        stats: stats,
        inventory: inventory,
        skillsProf: skillsProf,
        savingThrows: savingThrows,
        proficiencyBonus: proficiencyBonus,
        spellsKnown: spellsKnown,
        abilitiesKnown: abilitiesKnown
    };

    updateIframe(characterData);
    displayCharacter(characterData);
}

function displayCharacter(characterData) {
    const { name, race, class: charClass, background, alignment, level, stats, inventory, skillsProf, savingThrows, proficiencyBonus, spellsKnown, abilitiesKnown } = characterData;
    const abilityScores = Object.entries(stats).map(([stat, score]) => {
        const modifier = getModifier(score);
        return `
            <div class="ability">
                <p><strong>${abilityEmojis[stat] || ''} ${stat.toUpperCase()}:</strong> ${score}</p>
                <p>Mod: ${modifier >= 0 ? '+' : ''}${modifier}</p>
            </div>
        `;
    }).join('');

    const savingThrowsDisplay = abilities.map(stat => {
        const isProficient = savingThrows.has(stat);
        const modifier = getModifier(stats[stat]) + (isProficient ? proficiencyBonus : 0);
        return `<li>${isProficient ? '✅' : ' '}${stat.toUpperCase()}: ${modifier >= 0 ? '+' : ''}${modifier}</li>`;
    }).join('');

    const skillsDisplay = Object.entries(skillsList).map(([skill, stat]) => {
        const isProficient = skillsProf.has(skill);
        const modifier = getModifier(stats[stat]) + (isProficient ? proficiencyBonus : 0);
        return `<li>${isProficient ? '✅' : ' '}${skillEmojis[skill] || ''} ${skill}: ${modifier >= 0 ? '+' : ''}${modifier}</li>`;
    }).join('');

    document.getElementById('basic-info').innerHTML = `
        <h2>${name}</h2>
        <p><strong>Race:</strong> ${race.emoji} ${race.name} | <strong>Class:</strong> ${charClass.emoji} ${charClass.name} | <strong>Level:</strong> ${level}</p>
        <p><strong>Background:</strong> ${background.emoji} ${background.name}</p>
        <p><strong>Alignment:</strong> ${alignment}</p>
        <p><strong>Proficiency Bonus:</strong> +${proficiencyBonus}</p>
    `;

    document.getElementById('abilities').innerHTML = `
        <p><strong>Ability Scores:</strong></p>
        ${abilityScores}
    `;

    document.getElementById('saves').innerHTML = `
        <p><strong>Saving Throws:</strong></p>
        <ul>
            ${savingThrowsDisplay}
        </ul>
    `;

    document.getElementById('skills').innerHTML = `
        <p><strong>Skills:</strong></p>
        <ul>
            ${skillsDisplay}
        </ul>
    `;

    document.getElementById('inventory').innerHTML = `
        <p><strong>Inventory:</strong> 🎒</p>
        <ul>
            ${inventory.map(item => `<li>${inventoryEmojis[item] || ''} ${item}</li>`).join('')}
        </ul>
    `;

    document.getElementById('spells').innerHTML = `
        <p><strong>Spells Known:</strong> ✨</p>
        <ul>
            ${spellsKnown.map(spell => `<li>${spellEmojis[spell] || ''} ${spell}</li>`).join('')}
        </ul>
    `;

    document.getElementById('features').innerHTML = `
        <p><strong>Class Features:</strong> ⭐</p>
        <ul>
            ${abilitiesKnown.map(feature => `<li>${featureEmojis[feature] || ''} ${feature}</li>`).join('')}
        </ul>
    `;

    document.getElementById('credits').innerHTML = `
        <p>Made with ❤️ | Character sprites from <a href="https://lpc.opengameart.org/" target="_blank">Liberated Pixel Cup</a>, licensed under CC BY-SA 3.0 and GPL 3.0. Contributors: Johannes Sjölund, Michael Whitlock, Matthew Krohn, and others. Generated by <a href="https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/" target="_blank">Universal LPC Spritesheet Character Generator</a>.</p>
    `;

    document.getElementById('feats').innerHTML = `
        <p><strong>Feats:</strong></p>
        <ul>
            ${feats.map(feat => `<li>${feat.emoji} ${feat.name}</li>`).join('')}
        </ul>
    `;
}

function updateIframe(characterData) {
    const charRace = characterData.race;
    const charClass = characterData.class.name;

    const selectedRaceMapping = raceMappings[charRace.name];

    const weaponChoices = classMappings[charClass].weapon;
    const shieldChoices = classMappings[charClass].shield;

    let weaponParam = 'None';
    let shieldParam = 'None';

    // --- Weapon Generation Logic ---
    if (weaponChoices && weaponChoices.length > 0) {
        const chosenWeaponName = randomChoice(weaponChoices);
        if (chosenWeaponName !== 'None') {
            const weaponInfo = WEAPON_DETAILS[chosenWeaponName];
            let weaponString = chosenWeaponName.replace(/\s+/g, '_');

            if (weaponInfo) {
                if (weaponInfo.type === 'specific') {
                    weaponString += '_' + randomChoice(weaponInfo.options).replace(/\s+/g, '_');
                } else if (weaponInfo.type === 'color') {
                    weaponString += '_' + randomChoice(weaponInfo.options).replace(/\s+/g, '_');
                }
            }
            weaponParam = weaponString;
        }
    }

    // --- Shield Generation Logic ---
    if (shieldChoices && shieldChoices.length > 0) {
        const chosenShieldName = randomChoice(shieldChoices);
        if (chosenShieldName !== 'None') {
            const shieldInfo = SHIELD_DETAILS[chosenShieldName];
            let shieldString = chosenShieldName.replace(/\s+/g, '_');

            if (shieldInfo) {
                if (shieldInfo.type === 'variant_only') {
                    shieldString = randomChoice(shieldInfo.options).replace(/\s+/g, '_');
                } else if (shieldInfo.type === 'specific') {
                    shieldString += '_' + randomChoice(shieldInfo.options).replace(/\s+/g, '_');
                }
            }
            shieldParam = shieldString;
        }
    }

    // --- General Character Sprite Parameters ---
    const sex = randomChoice(['male', 'female']);
    const bodyColor = randomChoice(selectedRaceMapping.bodyColors);
    const hairStyle = randomChoice(hairStyles);
    const hairColor = randomChoice(hairColors);

    let clothesOptions = classMappings[charClass].clothes;
    const isNonHumanoid = ['Dragonborn', 'Lizardfolk', 'Tabaxi'].includes(charRace.name);
    if (isNonHumanoid) {
        clothesOptions = clothesOptions.filter(item => !['Longsleeve_laced', 'Longsleeve_Polo', 'TShirt_Scoop'].includes(item));
        if (clothesOptions.length === 0) clothesOptions = ['TShirt', 'Sleeveless', 'Fur_Pants'];
    }
    const clothesType = randomChoice(clothesOptions);
    const clothesColor = randomChoice(clothingColors);

    const legsType = randomChoice(classMappings[charClass].legs);
    const legsColor = randomChoice(clothingColors);
    const jacketType = randomChoice(classMappings[charClass].jacket);
    const jacketColor = jacketType !== 'None' ? randomChoice(clothingColors) : '';
    const armourType = randomChoice(classMappings[charClass].armour);
    const armourColor = armourType !== 'None' ? randomChoice(ARMOR_METAL_COLORS) : '';
    const accessoryType = randomChoice(classMappings[charClass].accessory);
    const accessoryColor = accessoryType !== 'None' ? randomChoice(['brown', 'gold', 'silver']) : '';

    const headPrefix = selectedRaceMapping.head.replace(/_male$/, `_${sex}`).replace(/_female$/, `_${sex}`);
    const head = `${headPrefix}_${bodyColor}`;

    // --- Construct the full URL parameters ---
    const params = [
        `sex=${sex}`,
        `body=Body_color_${bodyColor}`,
        `head=${head}`,
        `hair=${hairStyle}_${hairColor}`,
        `clothes=${clothesType}_${clothesColor}`,
        `legs=${legsType}_${legsColor}`,
        `jacket=${jacketType !== 'None' ? jacketType + '_' + jacketColor : 'None'}`,
        `armour=${armourType !== 'None' ? armourType + (armourColor ? '_' + armourColor : '') : 'None'}`,
        `weapon=${weaponParam}`,
        `accessory=${accessoryType !== 'None' ? accessoryType + '_' + accessoryColor : 'None'}`,
        `tail=${selectedRaceMapping.tail || 'None'}`,
        `wings=${selectedRaceMapping.wings || 'None'}`,
        `ears=${selectedRaceMapping.ears || 'None'}`,
        `shield=${shieldParam}`
    ].join('&');

    const url = `${baseURL}${params}`;
    console.log(url);
    const iframe = document.getElementById('sprite-iframe');
    iframe.src = url;
}


document.addEventListener('DOMContentLoaded', () => {
    generateCharacter();
    document.getElementById('random').addEventListener('click', generateCharacter);
});