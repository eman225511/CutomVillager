// Villager Command Generator - Advanced JavaScript

class VillagerCommandGenerator {
    constructor() {
        this.trades = [];
        this.init();
        this.setupEventListeners();
        this.loadPresets();
        this.updatePreview();
    }

    init() {
        // Add initial trade if none exist
        if (this.trades.length === 0) {
            this.addTrade();
        }
        
        // Show welcome message
        this.showStatus('Welcome! Configure your villager and click Generate.', 'success');
    }

    setupEventListeners() {
        // Main form elements - Remove auto-generation listeners
        // We only generate on explicit button clicks now

        // Buttons
        document.getElementById('generateBtn').addEventListener('click', () => this.generateCommand());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyCommand());
        document.getElementById('copyKillBtn').addEventListener('click', () => this.copyKillCommand());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetForm());
        document.getElementById('addTradeBtn').addEventListener('click', () => this.addTrade());
        document.getElementById('savePresetBtn').addEventListener('click', () => this.savePreset());
        document.getElementById('loadPresetBtn').addEventListener('change', (e) => this.loadPreset(e.target.value));
        document.getElementById('exportBtn').addEventListener('click', () => this.exportConfig());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importConfig(e));

        // Advanced options toggle
        document.getElementById('advancedToggle').addEventListener('click', () => this.toggleAdvancedOptions());
        
        // Only listen to invulnerable checkbox for kill command visibility
        document.getElementById('invulnerable').addEventListener('change', () => {
            this.toggleKillCommandSection(document.getElementById('invulnerable').checked);
        });
    }

    addTrade() {
        const tradeId = Date.now();
        const trade = {
            id: tradeId,
            buyItem: '',
            buyCount: 1,
            buyItem2: '',
            buyCount2: 0,
            sellItem: '',
            sellCount: 1,
            maxUses: 9,
            xp: 1,
            priceMultiplier: 1.0,
            demand: 0,
            specialPrice: 0
        };
        
        this.trades.push(trade);
        this.renderTrades();
        // Removed auto-update preview
    }

    removeTrade(tradeId) {
        this.trades = this.trades.filter(trade => trade.id !== tradeId);
        this.renderTrades();
        // Removed auto-update preview
    }

    renderTrades() {
        const container = document.getElementById('tradesContainer');
        container.innerHTML = '';

        this.trades.forEach((trade, index) => {
            const tradeElement = this.createTradeElement(trade, index);
            container.appendChild(tradeElement);
        });
    }

    createTradeElement(trade, index) {
        const div = document.createElement('div');
        div.className = 'trade-item';
        div.innerHTML = `
            <div class="trade-header">
                <span class="trade-number">Trade ${index + 1}</span>
                ${this.trades.length > 1 ? `<button class="remove-trade" onclick="generator.removeTrade(${trade.id})">Remove</button>` : ''}
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Buy Item 1</label>
                    <select class="form-select" id="buyItem_${trade.id}" onchange="generator.updateTrade(${trade.id}, 'buyItem', this.value)">
                        ${this.getItemOptions(trade.buyItem)}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Count</label>
                    <input type="number" class="form-input" min="1" max="64" value="${trade.buyCount}" 
                           onchange="generator.updateTrade(${trade.id}, 'buyCount', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label class="form-label">Buy Item 2 (Optional)</label>
                    <select class="form-select" id="buyItem2_${trade.id}" onchange="generator.updateTrade(${trade.id}, 'buyItem2', this.value)">
                        <option value="">None</option>
                        ${this.getItemOptions(trade.buyItem2)}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Count</label>
                    <input type="number" class="form-input" min="0" max="64" value="${trade.buyCount2}" 
                           onchange="generator.updateTrade(${trade.id}, 'buyCount2', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label class="form-label">Sell Item</label>
                    <select class="form-select" id="sellItem_${trade.id}" onchange="generator.updateTrade(${trade.id}, 'sellItem', this.value)">
                        ${this.getItemOptions(trade.sellItem)}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Count</label>
                    <input type="number" class="form-input" min="1" max="64" value="${trade.sellCount}" 
                           onchange="generator.updateTrade(${trade.id}, 'sellCount', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label class="form-label tooltip" data-tooltip="How many times this trade can be used">Max Uses</label>
                    <input type="number" class="form-input" min="1" max="999999" value="${trade.maxUses}" 
                           onchange="generator.updateTrade(${trade.id}, 'maxUses', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label class="form-label tooltip" data-tooltip="Experience points gained from trade">XP Reward</label>
                    <input type="number" class="form-input" min="0" max="100" value="${trade.xp}" 
                           onchange="generator.updateTrade(${trade.id}, 'xp', parseInt(this.value))">
                </div>
            </div>
        `;
        return div;
    }

    updateTrade(tradeId, property, value) {
        const trade = this.trades.find(t => t.id === tradeId);
        if (trade) {
            trade[property] = value;
            // Removed auto-update preview
        }
    }

    getItemOptions(selectedItem = '') {
        const items = [
            '', 'apple', 'arrow', 'baked_potato', 'beef', 'beetroot', 'beetroot_seeds', 'book', 'bow',
            'bread', 'brick', 'bucket', 'carrot', 'chicken', 'clay_ball', 'coal', 'cobblestone',
            'cod', 'cooked_beef', 'cooked_chicken', 'cooked_cod', 'cooked_mutton', 'cooked_porkchop',
            'cooked_rabbit', 'cooked_salmon', 'cookie', 'diamond', 'diamond_axe', 'diamond_boots',
            'diamond_chestplate', 'diamond_helmet', 'diamond_hoe', 'diamond_leggings', 'diamond_pickaxe',
            'diamond_shovel', 'diamond_sword', 'emerald', 'enchanted_book', 'ender_pearl', 'experience_bottle',
            'feather', 'flint', 'glass', 'gold_ingot', 'golden_apple', 'golden_carrot', 'gunpowder',
            'ink_sac', 'iron_axe', 'iron_boots', 'iron_chestplate', 'iron_helmet', 'iron_ingot',
            'iron_leggings', 'iron_pickaxe', 'iron_shovel', 'iron_sword', 'item_frame', 'leather',
            'leather_boots', 'leather_chestplate', 'leather_helmet', 'leather_leggings', 'map',
            'melon_slice', 'mutton', 'name_tag', 'paper', 'porkchop', 'potato', 'pumpkin', 'quartz',
            'rabbit', 'rabbit_hide', 'rotten_flesh', 'saddle', 'salmon', 'seeds', 'spider_eye',
            'stick', 'stone', 'stone_axe', 'stone_hoe', 'stone_pickaxe', 'stone_shovel', 'stone_sword',
            'string', 'sugar', 'wheat', 'wheat_seeds', 'wooden_axe', 'wooden_hoe', 'wooden_pickaxe',
            'wooden_shovel', 'wooden_sword',
            // Food & Farming
            'beetroot_soup', 'mushroom_stew', 'rabbit_stew', 'suspicious_stew', 'sweet_berries', 'glow_berries',
            'honey_bottle', 'cake', 'pumpkin_pie', 'milk_bucket', 'tropical_fish', 'pufferfish', 'kelp',
            'dried_kelp', 'sea_pickle', 'bamboo', 'sugar_cane', 'cactus', 'cocoa_beans', 'melon',
            'chorus_fruit', 'poisonous_potato', 'spider_eye', 'fermented_spider_eye',
            // Blocks
            'dirt', 'grass_block', 'sand', 'gravel', 'oak_log', 'birch_log', 'spruce_log', 'jungle_log',
            'acacia_log', 'dark_oak_log', 'mangrove_log', 'cherry_log', 'oak_planks', 'birch_planks',
            'spruce_planks', 'jungle_planks', 'acacia_planks', 'dark_oak_planks', 'mangrove_planks',
            'cherry_planks', 'oak_leaves', 'birch_leaves', 'spruce_leaves', 'jungle_leaves',
            'acacia_leaves', 'dark_oak_leaves', 'mangrove_leaves', 'cherry_leaves', 'glass_pane',
            'white_wool', 'orange_wool', 'magenta_wool', 'light_blue_wool', 'yellow_wool', 'lime_wool',
            'pink_wool', 'gray_wool', 'light_gray_wool', 'cyan_wool', 'purple_wool', 'blue_wool',
            'brown_wool', 'green_wool', 'red_wool', 'black_wool', 'terracotta', 'white_terracotta',
            'orange_terracotta', 'magenta_terracotta', 'light_blue_terracotta', 'yellow_terracotta',
            'lime_terracotta', 'pink_terracotta', 'gray_terracotta', 'light_gray_terracotta',
            'cyan_terracotta', 'purple_terracotta', 'blue_terracotta', 'brown_terracotta',
            'green_terracotta', 'red_terracotta', 'black_terracotta', 'obsidian', 'netherrack',
            'soul_sand', 'soul_soil', 'basalt', 'blackstone', 'end_stone', 'purpur_block',
            // Ores & Minerals
            'iron_ore', 'gold_ore', 'diamond_ore', 'emerald_ore', 'coal_ore', 'copper_ore', 'lapis_ore',
            'redstone_ore', 'ancient_debris', 'nether_quartz_ore', 'nether_gold_ore', 'deepslate_iron_ore',
            'deepslate_gold_ore', 'deepslate_diamond_ore', 'deepslate_emerald_ore', 'deepslate_coal_ore',
            'deepslate_copper_ore', 'deepslate_lapis_ore', 'deepslate_redstone_ore', 'copper_ingot',
            'raw_iron', 'raw_gold', 'raw_copper', 'lapis_lazuli', 'redstone', 'amethyst_shard',
            'prismarine_shard', 'prismarine_crystals', 'nautilus_shell', 'heart_of_the_sea',
            // Netherite Items
            'netherite_scrap', 'netherite_ingot', 'netherite_sword', 'netherite_pickaxe', 'netherite_axe',
            'netherite_shovel', 'netherite_hoe', 'netherite_helmet', 'netherite_chestplate',
            'netherite_leggings', 'netherite_boots',
            // Golden Items
            'golden_sword', 'golden_pickaxe', 'golden_axe', 'golden_shovel', 'golden_hoe',
            'golden_helmet', 'golden_chestplate', 'golden_leggings', 'golden_boots',
            // Chainmail Items
            'chainmail_helmet', 'chainmail_chestplate', 'chainmail_leggings', 'chainmail_boots',
            // Tools & Weapons
            'crossbow', 'trident', 'shield', 'fishing_rod', 'flint_and_steel', 'shears', 'compass',
            'clock', 'spyglass', 'lead', 'carrot_on_a_stick', 'warped_fungus_on_a_stick',
            // Potions & Brewing
            'potion', 'splash_potion', 'lingering_potion', 'glass_bottle', 'dragon_breath',
            'blaze_powder', 'blaze_rod', 'brewing_stand', 'cauldron', 'nether_wart', 'ghast_tear',
            'magma_cream', 'slime_ball', 'phantom_membrane', 'turtle_helmet',
            // Enchanting
            'enchanting_table', 'bookshelf', 'anvil', 'grindstone', 'lapis_lazuli',
            // Redstone
            'redstone_torch', 'lever', 'stone_button', 'oak_button', 'stone_pressure_plate',
            'oak_pressure_plate', 'tripwire_hook', 'dispenser', 'dropper', 'hopper', 'chest',
            'trapped_chest', 'ender_chest', 'shulker_box', 'observer', 'piston', 'sticky_piston',
            'repeater', 'comparator', 'daylight_detector', 'redstone_lamp', 'note_block', 'jukebox',
            // Music Discs
            'music_disc_13', 'music_disc_cat', 'music_disc_blocks', 'music_disc_chirp', 'music_disc_far',
            'music_disc_mall', 'music_disc_mellohi', 'music_disc_stal', 'music_disc_strad', 'music_disc_ward',
            'music_disc_11', 'music_disc_wait', 'music_disc_otherside', 'music_disc_pigstep',
            // Flowers & Dyes
            'poppy', 'dandelion', 'blue_orchid', 'allium', 'azure_bluet', 'red_tulip', 'orange_tulip',
            'white_tulip', 'pink_tulip', 'oxeye_daisy', 'cornflower', 'lily_of_the_valley', 'sunflower',
            'lilac', 'rose_bush', 'peony', 'white_dye', 'orange_dye', 'magenta_dye', 'light_blue_dye',
            'yellow_dye', 'lime_dye', 'pink_dye', 'gray_dye', 'light_gray_dye', 'cyan_dye', 'purple_dye',
            'blue_dye', 'brown_dye', 'green_dye', 'red_dye', 'black_dye', 'bone_meal',
            // Mob Drops
            'bone', 'spider_eye', 'ender_pearl', 'blaze_rod', 'ghast_tear', 'magma_cream', 'slime_ball',
            'prismarine_shard', 'prismarine_crystals', 'rabbit_foot', 'rabbit_hide', 'phantom_membrane',
            'shulker_shell', 'dragon_head', 'wither_skeleton_skull', 'zombie_head', 'player_head',
            'creeper_head', 'skeleton_skull', 'totem_of_undying', 'elytra', 'dragon_egg',
            // Spawn Eggs
            'pig_spawn_egg', 'cow_spawn_egg', 'chicken_spawn_egg', 'sheep_spawn_egg', 'wolf_spawn_egg',
            'cat_spawn_egg', 'horse_spawn_egg', 'donkey_spawn_egg', 'mule_spawn_egg', 'llama_spawn_egg',
            'parrot_spawn_egg', 'rabbit_spawn_egg', 'polar_bear_spawn_egg', 'turtle_spawn_egg',
            'panda_spawn_egg', 'fox_spawn_egg', 'bee_spawn_egg', 'villager_spawn_egg', 'zombie_spawn_egg',
            'skeleton_spawn_egg', 'spider_spawn_egg', 'creeper_spawn_egg', 'enderman_spawn_egg',
            'witch_spawn_egg', 'blaze_spawn_egg', 'ghast_spawn_egg', 'magma_cube_spawn_egg',
            'wither_skeleton_spawn_egg', 'ender_dragon_spawn_egg', 'wither_spawn_egg'
        ];

        return items.map(item => 
            `<option value="${item}" ${item === selectedItem ? 'selected' : ''}>${item || 'Select Item...'}</option>`
        ).join('');
    }

    getProfessionOptions() {
        return [
            { value: 'minecraft:none', label: 'None (Nitwit)' },
            { value: 'minecraft:armorer', label: 'Armorer' },
            { value: 'minecraft:butcher', label: 'Butcher' },
            { value: 'minecraft:cartographer', label: 'Cartographer' },
            { value: 'minecraft:cleric', label: 'Cleric' },
            { value: 'minecraft:farmer', label: 'Farmer' },
            { value: 'minecraft:fisherman', label: 'Fisherman' },
            { value: 'minecraft:fletcher', label: 'Fletcher' },
            { value: 'minecraft:leatherworker', label: 'Leatherworker' },
            { value: 'minecraft:librarian', label: 'Librarian' },
            { value: 'minecraft:mason', label: 'Mason' },
            { value: 'minecraft:shepherd', label: 'Shepherd' },
            { value: 'minecraft:toolsmith', label: 'Toolsmith' },
            { value: 'minecraft:weaponsmith', label: 'Weaponsmith' }
        ];
    }

    getBiomeOptions() {
        return [
            { value: 'minecraft:plains', label: 'Plains' },
            { value: 'minecraft:desert', label: 'Desert' },
            { value: 'minecraft:jungle', label: 'Jungle' },
            { value: 'minecraft:savanna', label: 'Savanna' },
            { value: 'minecraft:snow', label: 'Snow' },
            { value: 'minecraft:swamp', label: 'Swamp' },
            { value: 'minecraft:taiga', label: 'Taiga' },
            { value: 'minecraft:mountains', label: 'Mountains' },
            { value: 'minecraft:forest', label: 'Forest' },
            { value: 'minecraft:birch_forest', label: 'Birch Forest' },
            { value: 'minecraft:dark_forest', label: 'Dark Forest' },
            { value: 'minecraft:flower_forest', label: 'Flower Forest' },
            { value: 'minecraft:bamboo_jungle', label: 'Bamboo Jungle' },
            { value: 'minecraft:sparse_jungle', label: 'Sparse Jungle' },
            { value: 'minecraft:windswept_hills', label: 'Windswept Hills' },
            { value: 'minecraft:windswept_forest', label: 'Windswept Forest' },
            { value: 'minecraft:windswept_gravelly_hills', label: 'Windswept Gravelly Hills' },
            { value: 'minecraft:windswept_savanna', label: 'Windswept Savanna' },
            { value: 'minecraft:savanna_plateau', label: 'Savanna Plateau' },
            { value: 'minecraft:badlands', label: 'Badlands' },
            { value: 'minecraft:eroded_badlands', label: 'Eroded Badlands' },
            { value: 'minecraft:wooded_badlands', label: 'Wooded Badlands' },
            { value: 'minecraft:meadow', label: 'Meadow' },
            { value: 'minecraft:cherry_grove', label: 'Cherry Grove' },
            { value: 'minecraft:grove', label: 'Grove' },
            { value: 'minecraft:snowy_slopes', label: 'Snowy Slopes' },
            { value: 'minecraft:frozen_peaks', label: 'Frozen Peaks' },
            { value: 'minecraft:jagged_peaks', label: 'Jagged Peaks' },
            { value: 'minecraft:stony_peaks', label: 'Stony Peaks' },
            { value: 'minecraft:snowy_taiga', label: 'Snowy Taiga' },
            { value: 'minecraft:old_growth_birch_forest', label: 'Old Growth Birch Forest' },
            { value: 'minecraft:old_growth_pine_taiga', label: 'Old Growth Pine Taiga' },
            { value: 'minecraft:old_growth_spruce_taiga', label: 'Old Growth Spruce Taiga' },
            { value: 'minecraft:snowy_beach', label: 'Snowy Beach' },
            { value: 'minecraft:beach', label: 'Beach' },
            { value: 'minecraft:stony_shore', label: 'Stony Shore' },
            { value: 'minecraft:warm_ocean', label: 'Warm Ocean' },
            { value: 'minecraft:lukewarm_ocean', label: 'Lukewarm Ocean' },
            { value: 'minecraft:deep_lukewarm_ocean', label: 'Deep Lukewarm Ocean' },
            { value: 'minecraft:ocean', label: 'Ocean' },
            { value: 'minecraft:deep_ocean', label: 'Deep Ocean' },
            { value: 'minecraft:cold_ocean', label: 'Cold Ocean' },
            { value: 'minecraft:deep_cold_ocean', label: 'Deep Cold Ocean' },
            { value: 'minecraft:frozen_ocean', label: 'Frozen Ocean' },
            { value: 'minecraft:deep_frozen_ocean', label: 'Deep Frozen Ocean' },
            { value: 'minecraft:mushroom_fields', label: 'Mushroom Fields' },
            { value: 'minecraft:dripstone_caves', label: 'Dripstone Caves' },
            { value: 'minecraft:lush_caves', label: 'Lush Caves' },
            { value: 'minecraft:deep_dark', label: 'Deep Dark' },
            { value: 'minecraft:nether_wastes', label: 'Nether Wastes' },
            { value: 'minecraft:soul_sand_valley', label: 'Soul Sand Valley' },
            { value: 'minecraft:crimson_forest', label: 'Crimson Forest' },
            { value: 'minecraft:warped_forest', label: 'Warped Forest' },
            { value: 'minecraft:basalt_deltas', label: 'Basalt Deltas' },
            { value: 'minecraft:the_end', label: 'The End' },
            { value: 'minecraft:small_end_islands', label: 'Small End Islands' },
            { value: 'minecraft:end_midlands', label: 'End Midlands' },
            { value: 'minecraft:end_highlands', label: 'End Highlands' },
            { value: 'minecraft:end_barrens', label: 'End Barrens' },
            { value: 'minecraft:mangrove_swamp', label: 'Mangrove Swamp' }
        ];
    }

    normalizeItemId(id) {
        if (!id || id.trim() === '') return '';
        id = id.trim();
        return id.includes(':') ? id : `minecraft:${id}`;
    }

    escapeJson(str) {
        return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    generateCommand() {
        try {
            const name = document.getElementById('villagerName').value.trim() || 'Custom Villager';
            const profession = document.getElementById('profession').value;
            const biomeType = document.getElementById('biomeType').value;
            const level = parseInt(document.getElementById('villagerLevel').value) || 1;
            const xp = parseInt(document.getElementById('xpValue').value) || 0;
            const health = parseFloat(document.getElementById('health').value) || 20.0;
            
            const posX = document.getElementById('posX').value.trim() || '~';
            const posY = document.getElementById('posY').value.trim() || '~1';
            const posZ = document.getElementById('posZ').value.trim() || '~';
            const position = `${posX} ${posY} ${posZ}`;

            let nbtData = [];

            // Custom name
            nbtData.push(`CustomName:'{"text":"${this.escapeJson(name)}"}'`);

            // Custom name visibility
            if (document.getElementById('customNameVisible').checked) {
                nbtData.push('CustomNameVisible:1b');
            }

            // Villager data
            nbtData.push(`VillagerData:{profession:"${profession}",level:${level},type:"${biomeType}"}`);

            // Experience
            if (xp > 0) {
                nbtData.push(`Xp:${xp}`);
            }

            // Health
            if (health !== 20.0) {
                nbtData.push(`Health:${health}f`);
                nbtData.push(`Attributes:[{Name:"generic.max_health",Base:${health}d}]`);
            }

            // Boolean flags
            if (document.getElementById('noAI').checked) nbtData.push('NoAI:1b');
            if (document.getElementById('invulnerable').checked) nbtData.push('Invulnerable:1b');
            if (document.getElementById('persistenceRequired').checked) nbtData.push('PersistenceRequired:1b');
            if (document.getElementById('silent').checked) nbtData.push('Silent:1b');
            if (document.getElementById('noGravity').checked) nbtData.push('NoGravity:1b');
            if (document.getElementById('glowing').checked) nbtData.push('Glowing:1b');
            if (document.getElementById('baby').checked) nbtData.push('IsBaby:1b');

            // Generate trades
            const validTrades = this.trades.filter(trade => 
                trade.buyItem && trade.sellItem && trade.buyCount > 0 && trade.sellCount > 0
            );

            if (validTrades.length > 0) {
                const recipes = validTrades.map(trade => {
                    let recipe = `{buy:{id:"${this.normalizeItemId(trade.buyItem)}",count:${trade.buyCount}}`;
                    
                    // Second buy item (optional)
                    if (trade.buyItem2 && trade.buyCount2 > 0) {
                        recipe += `,buyB:{id:"${this.normalizeItemId(trade.buyItem2)}",count:${trade.buyCount2}}`;
                    }
                    
                    recipe += `,sell:{id:"${this.normalizeItemId(trade.sellItem)}",count:${trade.sellCount}}`;
                    recipe += `,maxUses:${trade.maxUses}`;
                    recipe += `,xp:${trade.xp}`;
                    recipe += `,priceMultiplier:${trade.priceMultiplier}f`;
                    recipe += `,demand:${trade.demand}`;
                    recipe += `,specialPrice:${trade.specialPrice}`;
                    recipe += `,uses:0`;
                    recipe += '}';
                    
                    return recipe;
                }).join(',');

                nbtData.push(`Offers:{Recipes:[${recipes}]}`);
            }

            const command = `/summon villager ${position} {${nbtData.join(',')}}`;
            
            document.getElementById('commandOutput').textContent = command;
            
            // Generate kill command if villager is invulnerable
            const isInvulnerable = document.getElementById('invulnerable').checked;
            this.toggleKillCommandSection(isInvulnerable);
            
            if (isInvulnerable) {
                this.generateKillCommand(name);
            }
            
            this.showStatus('Command generated successfully!', 'success');
            
        } catch (error) {
            document.getElementById('commandOutput').textContent = `Error: ${error.message}`;
            this.showStatus('Error generating command: ' + error.message, 'error');
        }
    }

    generateKillCommand(villagerName) {
        // Generate multiple kill command options
        const escapedName = this.escapeJson(villagerName);
        const killCommands = [
            `# Kill by custom name:`,
            `/kill @e[type=villager,name="${villagerName}"]`,
            ``,
            `# Kill all villagers in 10 block radius:`,
            `/kill @e[type=villager,distance=..10]`,
            ``,
            `# Kill all invulnerable villagers:`,
            `/kill @e[type=villager,nbt={Invulnerable:1b}]`,
            ``,
            `# Kill all villagers (use with caution!):`,
            `/kill @e[type=villager]`
        ].join('\n');
        
        document.getElementById('killCommandOutput').textContent = killCommands;
    }

    toggleKillCommandSection(show) {
        const section = document.getElementById('killCommandSection');
        if (show) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    }

    async copyKillCommand() {
        const killCommandText = document.getElementById('killCommandOutput').textContent;
        try {
            await navigator.clipboard.writeText(killCommandText);
            this.showStatus('Kill commands copied to clipboard!', 'success');
            
            // Temporarily change button text
            const copyBtn = document.getElementById('copyKillBtn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (error) {
            this.showStatus('Failed to copy kill commands. Please select and copy manually.', 'error');
        }
    }

    updatePreview() {
        // This method is now only called when explicitly generating commands
        // No longer auto-generates on every change
        this.generateCommand();
    }

    async copyCommand() {
        const commandText = document.getElementById('commandOutput').textContent;
        try {
            await navigator.clipboard.writeText(commandText);
            this.showStatus('Command copied to clipboard!', 'success');
            
            // Temporarily change button text
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (error) {
            this.showStatus('Failed to copy command. Please select and copy manually.', 'error');
        }
    }

    resetForm() {
        if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
            // Reset all form elements
            document.getElementById('villagerName').value = 'Custom Villager';
            document.getElementById('profession').value = 'minecraft:librarian';
            document.getElementById('biomeType').value = 'minecraft:plains';
            document.getElementById('villagerLevel').value = '1';
            document.getElementById('xpValue').value = '0';
            document.getElementById('health').value = '20';
            document.getElementById('posX').value = '~';
            document.getElementById('posY').value = '~1';
            document.getElementById('posZ').value = '~';

            // Reset checkboxes
            const checkboxes = ['noAI', 'invulnerable', 'persistenceRequired', 'silent', 'noGravity', 'glowing', 'customNameVisible', 'baby'];
            checkboxes.forEach(id => {
                document.getElementById(id).checked = false;
            });

            // Reset trades
            this.trades = [];
            this.addTrade();

            // Clear command outputs
            document.getElementById('commandOutput').textContent = 'Click "Generate Command" to create your villager command...';
            document.getElementById('killCommandSection').style.display = 'none';

            this.showStatus('Form reset successfully!', 'success');
        }
    }

    savePreset() {
        const presetName = prompt('Enter a name for this preset:');
        if (!presetName) return;

        const preset = {
            name: presetName,
            data: this.getCurrentFormData(),
            timestamp: new Date().toISOString()
        };

        let presets = JSON.parse(localStorage.getItem('villagerPresets') || '[]');
        presets = presets.filter(p => p.name !== presetName); // Remove existing with same name
        presets.push(preset);
        
        localStorage.setItem('villagerPresets', JSON.stringify(presets));
        this.loadPresets();
        this.showStatus(`Preset "${presetName}" saved successfully!`, 'success');
    }

    loadPresets() {
        const presets = JSON.parse(localStorage.getItem('villagerPresets') || '[]');
        const select = document.getElementById('loadPresetBtn');
        
        select.innerHTML = '<option value="">Load Preset...</option>';
        presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.name;
            option.textContent = preset.name;
            select.appendChild(option);
        });
    }

    loadPreset(presetName) {
        if (!presetName) return;

        const presets = JSON.parse(localStorage.getItem('villagerPresets') || '[]');
        const preset = presets.find(p => p.name === presetName);
        
        if (preset) {
            this.setFormData(preset.data);
            this.showStatus(`Preset "${presetName}" loaded successfully!`, 'success');
        }
    }

    getCurrentFormData() {
        return {
            villagerName: document.getElementById('villagerName').value,
            profession: document.getElementById('profession').value,
            biomeType: document.getElementById('biomeType').value,
            villagerLevel: document.getElementById('villagerLevel').value,
            xpValue: document.getElementById('xpValue').value,
            health: document.getElementById('health').value,
            posX: document.getElementById('posX').value,
            posY: document.getElementById('posY').value,
            posZ: document.getElementById('posZ').value,
            checkboxes: {
                noAI: document.getElementById('noAI').checked,
                invulnerable: document.getElementById('invulnerable').checked,
                persistenceRequired: document.getElementById('persistenceRequired').checked,
                silent: document.getElementById('silent').checked,
                noGravity: document.getElementById('noGravity').checked,
                glowing: document.getElementById('glowing').checked,
                customNameVisible: document.getElementById('customNameVisible').checked,
                baby: document.getElementById('baby').checked
            },
            trades: [...this.trades]
        };
    }

    setFormData(data) {
        document.getElementById('villagerName').value = data.villagerName || '';
        document.getElementById('profession').value = data.profession || 'minecraft:librarian';
        document.getElementById('biomeType').value = data.biomeType || 'minecraft:plains';
        document.getElementById('villagerLevel').value = data.villagerLevel || '1';
        document.getElementById('xpValue').value = data.xpValue || '0';
        document.getElementById('health').value = data.health || '20';
        document.getElementById('posX').value = data.posX || '~';
        document.getElementById('posY').value = data.posY || '~1';
        document.getElementById('posZ').value = data.posZ || '~';

        if (data.checkboxes) {
            Object.keys(data.checkboxes).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.checked = data.checkboxes[key];
                }
            });
        }

        if (data.trades) {
            this.trades = data.trades;
            this.renderTrades();
        }

        // Don't auto-generate command when loading preset
    }

    exportConfig() {
        const config = this.getCurrentFormData();
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `villager-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('Configuration exported successfully!', 'success');
    }

    importConfig(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                this.setFormData(config);
                this.showStatus('Configuration imported successfully!', 'success');
            } catch (error) {
                this.showStatus('Error importing configuration: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    toggleAdvancedOptions() {
        const content = document.getElementById('advancedContent');
        const toggle = document.getElementById('advancedToggle');
        
        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            content.style.maxHeight = content.scrollHeight + 'px';
            toggle.classList.remove('collapsed');
        } else {
            content.classList.add('collapsed');
            content.style.maxHeight = '0';
            toggle.classList.add('collapsed');
        }
    }

    showStatus(message, type = 'success') {
        const statusContainer = document.getElementById('statusContainer');
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message status-${type}`;
        statusDiv.textContent = message;
        
        statusContainer.appendChild(statusDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.parentNode.removeChild(statusDiv);
            }
        }, 5000);
    }
}

// Initialize the generator when the page loads
let generator;
document.addEventListener('DOMContentLoaded', () => {
    generator = new VillagerCommandGenerator();
});
