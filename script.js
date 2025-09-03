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
        
        // Create the basic structure
        const tradeHeader = document.createElement('div');
        tradeHeader.className = 'trade-header';
        tradeHeader.innerHTML = `
            <span class="trade-number">Trade ${index + 1}</span>
            ${this.trades.length > 1 ? `<button class="remove-trade" onclick="generator.removeTrade(${trade.id})">Remove</button>` : ''}
        `;
        
        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';
        
        // Buy Item 1
        const buyItem1Group = document.createElement('div');
        buyItem1Group.className = 'form-group';
        const buyItem1Label = document.createElement('label');
        buyItem1Label.className = 'form-label';
        buyItem1Label.textContent = 'Buy Item 1';
        const buyItem1Select = this.createSearchableSelect(`buyItem_${trade.id}`, trade.buyItem);
        buyItem1Select.querySelector('input').addEventListener('change', (e) => {
            this.updateTrade(trade.id, 'buyItem', e.target.value);
        });
        buyItem1Group.appendChild(buyItem1Label);
        buyItem1Group.appendChild(buyItem1Select);
        
        // Buy Count 1
        const buyCount1Group = document.createElement('div');
        buyCount1Group.className = 'form-group';
        buyCount1Group.innerHTML = `
            <label class="form-label">Count</label>
            <input type="number" class="form-input" min="1" max="64" value="${trade.buyCount}" 
                   onchange="generator.updateTrade(${trade.id}, 'buyCount', parseInt(this.value))">
        `;
        
        // Buy Item 2 (Optional)
        const buyItem2Group = document.createElement('div');
        buyItem2Group.className = 'form-group';
        const buyItem2Label = document.createElement('label');
        buyItem2Label.className = 'form-label';
        buyItem2Label.textContent = 'Buy Item 2 (Optional)';
        const buyItem2Select = this.createSearchableSelect(`buyItem2_${trade.id}`, trade.buyItem2);
        buyItem2Select.querySelector('input').addEventListener('change', (e) => {
            this.updateTrade(trade.id, 'buyItem2', e.target.value);
        });
        buyItem2Group.appendChild(buyItem2Label);
        buyItem2Group.appendChild(buyItem2Select);
        
        // Buy Count 2
        const buyCount2Group = document.createElement('div');
        buyCount2Group.className = 'form-group';
        buyCount2Group.innerHTML = `
            <label class="form-label">Count</label>
            <input type="number" class="form-input" min="0" max="64" value="${trade.buyCount2}" 
                   onchange="generator.updateTrade(${trade.id}, 'buyCount2', parseInt(this.value))">
        `;
        
        // Sell Item
        const sellItemGroup = document.createElement('div');
        sellItemGroup.className = 'form-group';
        const sellItemLabel = document.createElement('label');
        sellItemLabel.className = 'form-label';
        sellItemLabel.textContent = 'Sell Item';
        const sellItemSelect = this.createSearchableSelect(`sellItem_${trade.id}`, trade.sellItem, false);
        sellItemSelect.querySelector('input').addEventListener('change', (e) => {
            this.updateTrade(trade.id, 'sellItem', e.target.value);
        });
        sellItemGroup.appendChild(sellItemLabel);
        sellItemGroup.appendChild(sellItemSelect);
        
        // Sell Count
        const sellCountGroup = document.createElement('div');
        sellCountGroup.className = 'form-group';
        sellCountGroup.innerHTML = `
            <label class="form-label">Count</label>
            <input type="number" class="form-input" min="1" max="64" value="${trade.sellCount}" 
                   onchange="generator.updateTrade(${trade.id}, 'sellCount', parseInt(this.value))">
        `;
        
        // Max Uses
        const maxUsesGroup = document.createElement('div');
        maxUsesGroup.className = 'form-group';
        maxUsesGroup.innerHTML = `
            <label class="form-label tooltip" data-tooltip="How many times this trade can be used">Max Uses</label>
            <input type="number" class="form-input" min="1" max="999999" value="${trade.maxUses}" 
                   onchange="generator.updateTrade(${trade.id}, 'maxUses', parseInt(this.value))">
        `;
        
        // XP Reward
        const xpGroup = document.createElement('div');
        xpGroup.className = 'form-group';
        xpGroup.innerHTML = `
            <label class="form-label tooltip" data-tooltip="Experience points gained from trade">XP Reward</label>
            <input type="number" class="form-input" min="0" max="100" value="${trade.xp}" 
                   onchange="generator.updateTrade(${trade.id}, 'xp', parseInt(this.value))">
        `;
        
        // Append all elements
        formGrid.appendChild(buyItem1Group);
        formGrid.appendChild(buyCount1Group);
        formGrid.appendChild(buyItem2Group);
        formGrid.appendChild(buyCount2Group);
        formGrid.appendChild(sellItemGroup);
        formGrid.appendChild(sellCountGroup);
        formGrid.appendChild(maxUsesGroup);
        formGrid.appendChild(xpGroup);
        
        div.appendChild(tradeHeader);
        div.appendChild(formGrid);
        
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
            '', 'acacia_leaves', 'acacia_log', 'acacia_planks', 'allium', 'amethyst_shard', 'ancient_debris', 'anvil',
            'apple', 'arrow', 'azure_bluet', 'baked_potato', 'bamboo', 'basalt', 'bee_spawn_egg', 'beef',
            'beetroot', 'beetroot_seeds', 'beetroot_soup', 'birch_leaves', 'birch_log', 'birch_planks', 
            'black_dye', 'black_terracotta', 'black_wool', 'blackstone', 'blaze_powder', 'blaze_rod', 
            'blaze_spawn_egg', 'blue_dye', 'blue_orchid', 'blue_terracotta', 'blue_wool', 'bone', 
            'bone_meal', 'book', 'bookshelf', 'bow', 'bread', 'brewing_stand', 'brick', 'brown_dye', 
            'brown_terracotta', 'brown_wool', 'bucket', 'cactus', 'cake', 'carrot', 'carrot_on_a_stick',
            'cat_spawn_egg', 'cauldron', 'chainmail_boots', 'chainmail_chestplate', 'chainmail_helmet',
            'chainmail_leggings', 'cherry_leaves', 'cherry_log', 'cherry_planks', 'chest', 'chicken',
            'chicken_spawn_egg', 'chorus_fruit', 'clay_ball', 'clock', 'coal', 'coal_ore', 'cobblestone',
            'cocoa_beans', 'cod', 'comparator', 'compass', 'cooked_beef', 'cooked_chicken', 'cooked_cod',
            'cooked_mutton', 'cooked_porkchop', 'cooked_rabbit', 'cooked_salmon', 'cookie', 'copper_ingot',
            'copper_ore', 'cornflower', 'cow_spawn_egg', 'creeper_head', 'creeper_spawn_egg', 'crossbow',
            'cyan_dye', 'cyan_terracotta', 'cyan_wool', 'dandelion', 'dark_oak_leaves', 'dark_oak_log',
            'dark_oak_planks', 'daylight_detector', 'deepslate_coal_ore', 'deepslate_copper_ore',
            'deepslate_diamond_ore', 'deepslate_emerald_ore', 'deepslate_gold_ore', 'deepslate_iron_ore',
            'deepslate_lapis_ore', 'deepslate_redstone_ore', 'diamond', 'diamond_axe', 'diamond_boots',
            'diamond_chestplate', 'diamond_helmet', 'diamond_hoe', 'diamond_leggings', 'diamond_ore',
            'diamond_pickaxe', 'diamond_shovel', 'diamond_sword', 'dirt', 'dispenser', 'donkey_spawn_egg',
            'dragon_breath', 'dragon_egg', 'dragon_head', 'dried_kelp', 'dropper', 'elytra', 'emerald',
            'emerald_ore', 'enchanted_book', 'enchanting_table', 'end_stone', 'ender_chest', 'ender_dragon_spawn_egg',
            'ender_pearl', 'enderman_spawn_egg', 'experience_bottle', 'feather', 'fermented_spider_eye',
            'fishing_rod', 'flint', 'flint_and_steel', 'fox_spawn_egg', 'ghast_spawn_egg', 'ghast_tear',
            'glass', 'glass_bottle', 'glass_pane', 'glow_berries', 'gold_ingot', 'gold_ore', 'golden_apple',
            'golden_axe', 'golden_boots', 'golden_carrot', 'golden_chestplate', 'golden_helmet', 'golden_hoe',
            'golden_leggings', 'golden_pickaxe', 'golden_shovel', 'golden_sword', 'grass_block', 'gravel',
            'gray_dye', 'gray_terracotta', 'gray_wool', 'green_dye', 'green_terracotta', 'green_wool',
            'grindstone', 'gunpowder', 'heart_of_the_sea', 'honey_bottle', 'hopper', 'horse_spawn_egg',
            'ink_sac', 'iron_axe', 'iron_boots', 'iron_chestplate', 'iron_helmet', 'iron_ingot',
            'iron_leggings', 'iron_ore', 'iron_pickaxe', 'iron_shovel', 'iron_sword', 'item_frame',
            'jukebox', 'jungle_leaves', 'jungle_log', 'jungle_planks', 'kelp', 'lapis_lazuli', 'lapis_ore',
            'lead', 'leather', 'leather_boots', 'leather_chestplate', 'leather_helmet', 'leather_leggings',
            'lever', 'light_blue_dye', 'light_blue_terracotta', 'light_blue_wool', 'light_gray_dye',
            'light_gray_terracotta', 'light_gray_wool', 'lilac', 'lily_of_the_valley', 'lime_dye',
            'lime_terracotta', 'lime_wool', 'lingering_potion', 'llama_spawn_egg', 'mace', 'magenta_dye',
            'magenta_terracotta', 'magenta_wool', 'magma_cream', 'magma_cube_spawn_egg', 'mangrove_leaves',
            'mangrove_log', 'mangrove_planks', 'map', 'melon', 'melon_slice', 'milk_bucket', 'mule_spawn_egg',
            'mushroom_stew', 'music_disc_11', 'music_disc_13', 'music_disc_blocks', 'music_disc_cat',
            'music_disc_chirp', 'music_disc_far', 'music_disc_mall', 'music_disc_mellohi', 'music_disc_otherside',
            'music_disc_pigstep', 'music_disc_stal', 'music_disc_strd', 'music_disc_wait', 'music_disc_ward',
            'mutton', 'name_tag', 'nautilus_shell', 'nether_gold_ore', 'nether_quartz_ore', 'nether_wart',
            'netherite_axe', 'netherite_boots', 'netherite_chestplate', 'netherite_helmet', 'netherite_hoe',
            'netherite_ingot', 'netherite_leggings', 'netherite_pickaxe', 'netherite_scrap', 'netherite_shovel',
            'netherite_sword', 'netherrack', 'note_block', 'oak_button', 'oak_leaves', 'oak_log', 'oak_planks',
            'oak_pressure_plate', 'observer', 'obsidian', 'orange_dye', 'orange_terracotta', 'orange_tulip',
            'orange_wool', 'oxeye_daisy', 'panda_spawn_egg', 'paper', 'parrot_spawn_egg', 'peony',
            'phantom_membrane', 'pig_spawn_egg', 'pink_dye', 'pink_terracotta', 'pink_tulip', 'pink_wool',
            'piston', 'player_head', 'poisonous_potato', 'polar_bear_spawn_egg', 'poppy', 'porkchop',
            'potato', 'potion', 'prismarine_crystals', 'prismarine_shard', 'pufferfish', 'pumpkin',
            'pumpkin_pie', 'purple_dye', 'purple_terracotta', 'purple_wool', 'purpur_block', 'quartz',
            'rabbit', 'rabbit_foot', 'rabbit_hide', 'rabbit_spawn_egg', 'rabbit_stew', 'raw_copper',
            'raw_gold', 'raw_iron', 'red_dye', 'red_terracotta', 'red_tulip', 'red_wool', 'redstone',
            'redstone_lamp', 'redstone_ore', 'redstone_torch', 'repeater', 'rose_bush', 'rotten_flesh',
            'saddle', 'salmon', 'sand', 'sea_pickle', 'seeds', 'sheep_spawn_egg', 'shears', 'shield',
            'shulker_box', 'shulker_shell', 'skeleton_skull', 'skeleton_spawn_egg', 'slime_ball',
            'soul_sand', 'soul_soil', 'spider_eye', 'spider_spawn_egg', 'splash_potion', 'spruce_leaves',
            'spruce_log', 'spruce_planks', 'spyglass', 'stick', 'sticky_piston', 'stone', 'stone_axe',
            'stone_button', 'stone_hoe', 'stone_pickaxe', 'stone_pressure_plate', 'stone_shovel', 'stone_sword',
            'string', 'sugar', 'sugar_cane', 'sunflower', 'suspicious_stew', 'sweet_berries', 'terracotta',
            'totem_of_undying', 'trapped_chest', 'trident', 'tripwire_hook', 'tropical_fish', 'turtle_helmet',
            'turtle_spawn_egg', 'villager_spawn_egg', 'water_bucket', 'warped_fungus_on_a_stick', 'wheat', 'wheat_seeds',
            'white_dye', 'white_terracotta', 'white_tulip', 'white_wool', 'witch_spawn_egg', 'wither_skeleton_skull',
            'wither_skeleton_spawn_egg', 'wither_spawn_egg', 'wolf_spawn_egg', 'wooden_axe', 'wooden_hoe',
            'wooden_pickaxe', 'wooden_shovel', 'wooden_sword', 'yellow_dye', 'yellow_terracotta', 'yellow_wool',
            'zombie_head', 'zombie_spawn_egg'
        ];

        return items.map(item => 
            `<option value="${item}" ${item === selectedItem ? 'selected' : ''}>${item || 'Select Item...'}</option>`
        ).join('');
    }

    getItemsList() {
        return [
            '', 'acacia_leaves', 'acacia_log', 'acacia_planks', 'allium', 'amethyst_shard', 'ancient_debris', 'anvil',
            'apple', 'arrow', 'azure_bluet', 'baked_potato', 'bamboo', 'basalt', 'bee_spawn_egg', 'beef',
            'beetroot', 'beetroot_seeds', 'beetroot_soup', 'birch_leaves', 'birch_log', 'birch_planks', 
            'black_dye', 'black_terracotta', 'black_wool', 'blackstone', 'blaze_powder', 'blaze_rod', 
            'blaze_spawn_egg', 'blue_dye', 'blue_orchid', 'blue_terracotta', 'blue_wool', 'bone', 
            'bone_meal', 'book', 'bookshelf', 'bow', 'bread', 'brewing_stand', 'brick', 'brown_dye', 
            'brown_terracotta', 'brown_wool', 'bucket', 'cactus', 'cake', 'carrot', 'carrot_on_a_stick',
            'cat_spawn_egg', 'cauldron', 'chainmail_boots', 'chainmail_chestplate', 'chainmail_helmet',
            'chainmail_leggings', 'cherry_leaves', 'cherry_log', 'cherry_planks', 'chest', 'chicken',
            'chicken_spawn_egg', 'chorus_fruit', 'clay_ball', 'clock', 'coal', 'coal_ore', 'cobblestone',
            'cocoa_beans', 'cod', 'comparator', 'compass', 'cooked_beef', 'cooked_chicken', 'cooked_cod',
            'cooked_mutton', 'cooked_porkchop', 'cooked_rabbit', 'cooked_salmon', 'cookie', 'copper_ingot',
            'copper_ore', 'cornflower', 'cow_spawn_egg', 'creeper_head', 'creeper_spawn_egg', 'crossbow',
            'cyan_dye', 'cyan_terracotta', 'cyan_wool', 'dandelion', 'dark_oak_leaves', 'dark_oak_log',
            'dark_oak_planks', 'daylight_detector', 'deepslate_coal_ore', 'deepslate_copper_ore',
            'deepslate_diamond_ore', 'deepslate_emerald_ore', 'deepslate_gold_ore', 'deepslate_iron_ore',
            'deepslate_lapis_ore', 'deepslate_redstone_ore', 'diamond', 'diamond_axe', 'diamond_boots',
            'diamond_chestplate', 'diamond_helmet', 'diamond_hoe', 'diamond_leggings', 'diamond_ore',
            'diamond_pickaxe', 'diamond_shovel', 'diamond_sword', 'dirt', 'dispenser', 'donkey_spawn_egg',
            'dragon_breath', 'dragon_egg', 'dragon_head', 'dried_kelp', 'dropper', 'elytra', 'emerald',
            'emerald_ore', 'enchanted_book', 'enchanting_table', 'end_stone', 'ender_chest', 'ender_dragon_spawn_egg',
            'ender_pearl', 'enderman_spawn_egg', 'experience_bottle', 'feather', 'fermented_spider_eye',
            'fishing_rod', 'flint', 'flint_and_steel', 'fox_spawn_egg', 'ghast_spawn_egg', 'ghast_tear',
            'glass', 'glass_bottle', 'glass_pane', 'glow_berries', 'gold_ingot', 'gold_ore', 'golden_apple',
            'golden_axe', 'golden_boots', 'golden_carrot', 'golden_chestplate', 'golden_helmet', 'golden_hoe',
            'golden_leggings', 'golden_pickaxe', 'golden_shovel', 'golden_sword', 'grass_block', 'gravel',
            'gray_dye', 'gray_terracotta', 'gray_wool', 'green_dye', 'green_terracotta', 'green_wool',
            'grindstone', 'gunpowder', 'heart_of_the_sea', 'honey_bottle', 'hopper', 'horse_spawn_egg',
            'ink_sac', 'iron_axe', 'iron_boots', 'iron_chestplate', 'iron_helmet', 'iron_ingot',
            'iron_leggings', 'iron_ore', 'iron_pickaxe', 'iron_shovel', 'iron_sword', 'item_frame',
            'jukebox', 'jungle_leaves', 'jungle_log', 'jungle_planks', 'kelp', 'lapis_lazuli', 'lapis_ore',
            'lead', 'leather', 'leather_boots', 'leather_chestplate', 'leather_helmet', 'leather_leggings',
            'lever', 'light_blue_dye', 'light_blue_terracotta', 'light_blue_wool', 'light_gray_dye',
            'light_gray_terracotta', 'light_gray_wool', 'lilac', 'lily_of_the_valley', 'lime_dye',
            'lime_terracotta', 'lime_wool', 'lingering_potion', 'llama_spawn_egg', 'mace', 'magenta_dye',
            'magenta_terracotta', 'magenta_wool', 'magma_cream', 'magma_cube_spawn_egg', 'mangrove_leaves',
            'mangrove_log', 'mangrove_planks', 'map', 'melon', 'melon_slice', 'milk_bucket', 'mule_spawn_egg',
            'mushroom_stew', 'music_disc_11', 'music_disc_13', 'music_disc_blocks', 'music_disc_cat',
            'music_disc_chirp', 'music_disc_far', 'music_disc_mall', 'music_disc_mellohi', 'music_disc_otherside',
            'music_disc_pigstep', 'music_disc_stal', 'music_disc_strd', 'music_disc_wait', 'music_disc_ward',
            'mutton', 'name_tag', 'nautilus_shell', 'nether_gold_ore', 'nether_quartz_ore', 'nether_wart',
            'netherite_axe', 'netherite_boots', 'netherite_chestplate', 'netherite_helmet', 'netherite_hoe',
            'netherite_ingot', 'netherite_leggings', 'netherite_pickaxe', 'netherite_scrap', 'netherite_shovel',
            'netherite_sword', 'netherrack', 'note_block', 'oak_button', 'oak_leaves', 'oak_log', 'oak_planks',
            'oak_pressure_plate', 'observer', 'obsidian', 'orange_dye', 'orange_terracotta', 'orange_tulip',
            'orange_wool', 'oxeye_daisy', 'panda_spawn_egg', 'paper', 'parrot_spawn_egg', 'peony',
            'phantom_membrane', 'pig_spawn_egg', 'pink_dye', 'pink_terracotta', 'pink_tulip', 'pink_wool',
            'piston', 'player_head', 'poisonous_potato', 'polar_bear_spawn_egg', 'poppy', 'porkchop',
            'potato', 'potion', 'prismarine_crystals', 'prismarine_shard', 'pufferfish', 'pumpkin',
            'pumpkin_pie', 'purple_dye', 'purple_terracotta', 'purple_wool', 'purpur_block', 'quartz',
            'rabbit', 'rabbit_foot', 'rabbit_hide', 'rabbit_spawn_egg', 'rabbit_stew', 'raw_copper',
            'raw_gold', 'raw_iron', 'red_dye', 'red_terracotta', 'red_tulip', 'red_wool', 'redstone',
            'redstone_lamp', 'redstone_ore', 'redstone_torch', 'repeater', 'rose_bush', 'rotten_flesh',
            'saddle', 'salmon', 'sand', 'sea_pickle', 'seeds', 'sheep_spawn_egg', 'shears', 'shield',
            'shulker_box', 'shulker_shell', 'skeleton_skull', 'skeleton_spawn_egg', 'slime_ball',
            'soul_sand', 'soul_soil', 'spider_eye', 'spider_spawn_egg', 'splash_potion', 'spruce_leaves',
            'spruce_log', 'spruce_planks', 'spyglass', 'stick', 'sticky_piston', 'stone', 'stone_axe',
            'stone_button', 'stone_hoe', 'stone_pickaxe', 'stone_pressure_plate', 'stone_shovel', 'stone_sword',
            'string', 'sugar', 'sugar_cane', 'sunflower', 'suspicious_stew', 'sweet_berries', 'terracotta',
            'totem_of_undying', 'trapped_chest', 'trident', 'tripwire_hook', 'tropical_fish', 'turtle_helmet',
            'turtle_spawn_egg', 'villager_spawn_egg', 'water_bucket', 'warped_fungus_on_a_stick', 'wheat', 'wheat_seeds',
            'white_dye', 'white_terracotta', 'white_tulip', 'white_wool', 'witch_spawn_egg', 'wither_skeleton_skull',
            'wither_skeleton_spawn_egg', 'wither_spawn_egg', 'wolf_spawn_egg', 'wooden_axe', 'wooden_hoe',
            'wooden_pickaxe', 'wooden_shovel', 'wooden_sword', 'yellow_dye', 'yellow_terracotta', 'yellow_wool',
            'zombie_head', 'zombie_spawn_egg'
        ];
    }

    createSearchableSelect(id, selectedItem = '', includeNone = true) {
        const items = this.getItemsList();
        const filteredItems = includeNone ? items : items.filter(item => item !== '');
        
        const container = document.createElement('div');
        container.className = 'searchable-select';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-input searchable-input';
        input.id = id;
        input.value = selectedItem || (includeNone ? '' : 'Select Item...');
        input.placeholder = includeNone ? 'Type to search items...' : 'Select Item...';
        input.autocomplete = 'off';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'searchable-dropdown';
        dropdown.style.display = 'none';
        
        // Populate dropdown
        this.updateSearchDropdown(dropdown, filteredItems, selectedItem, input);
        
        // Event listeners
        input.addEventListener('input', () => {
            const searchTerm = input.value.toLowerCase();
            const filtered = filteredItems.filter(item => 
                item.toLowerCase().includes(searchTerm) || item === ''
            );
            this.updateSearchDropdown(dropdown, filtered, input.value, input);
        });
        
        input.addEventListener('focus', () => {
            dropdown.style.display = 'block';
        });
        
        input.addEventListener('blur', (e) => {
            // Delay hiding to allow clicking on dropdown items
            setTimeout(() => {
                if (!container.contains(document.activeElement)) {
                    dropdown.style.display = 'none';
                }
            }, 150);
        });
        
        container.appendChild(input);
        container.appendChild(dropdown);
        
        return container;
    }
    
    updateSearchDropdown(dropdown, items, selectedItem, input) {
        dropdown.innerHTML = '';
        
        items.slice(0, 50).forEach(item => { // Limit to 50 items for performance
            const option = document.createElement('div');
            option.className = 'searchable-option';
            option.textContent = item || 'None';
            option.dataset.value = item;
            
            if (item === selectedItem) {
                option.classList.add('selected');
            }
            
            option.addEventListener('mousedown', () => {
                input.value = item;
                dropdown.style.display = 'none';
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
            });
            
            dropdown.appendChild(option);
        });
        
        if (items.length > 50) {
            const moreOption = document.createElement('div');
            moreOption.className = 'searchable-option more-items';
            moreOption.textContent = `... ${items.length - 50} more items (keep typing to filter)`;
            dropdown.appendChild(moreOption);
        }
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
            
            // If invulnerable is checked, provide additional commands
            const isInvulnerable = document.getElementById('invulnerable').checked;
            let finalCommand = command;
            
            if (isInvulnerable) {
                // Add alternative approach for 1.21.4 compatibility
                finalCommand = [
                    `# Main spawn command:`,
                    command,
                    ``,
                    `# Ensure invulnerability (run after spawning):`,
                    `/data modify entity @e[type=villager,limit=1,sort=nearest] Invulnerable set value 1b`,
                    ``,
                    `# Alternative: Use resistance effect for pseudo-invulnerability:`,
                    `/effect give @e[type=villager,limit=1,sort=nearest] minecraft:resistance 999999 255 true`
                ].join('\n');
            }
            
            document.getElementById('commandOutput').textContent = finalCommand;
            
            // Generate kill command if villager is invulnerable
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
            `# Remove invulnerability then kill:`,
            `/data modify entity @e[type=villager,limit=1,sort=nearest] Invulnerable set value 0b`,
            `/kill @e[type=villager,limit=1,sort=nearest]`,
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
