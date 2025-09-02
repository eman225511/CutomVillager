# ⛏️ Minecraft Villager Command Generator ⛏️

A powerful, user-friendly web application for creating custom Minecraft villagers with advanced trading systems. Generate complex `/summon` commands with ease!

![Minecraft Style Interface](https://img.shields.io/badge/Style-Minecraft-green?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🎮 **Comprehensive Villager Customization**
- **Professions**: All 14 villager professions (Armorer, Butcher, Cartographer, Cleric, Farmer, etc.)
- **Biomes**: 50+ biome types including new 1.19+ biomes (Cherry Grove, Mangrove Swamp, Deep Dark, etc.)
- **Levels**: Set villager experience levels (1-5)
- **Health & Position**: Custom health values and precise positioning

### 💎 **Advanced Trading System**
- **170+ Items**: Comprehensive item database including:
  - All tools, weapons, and armor sets (Wood, Stone, Iron, Diamond, Netherite, Golden)
  - Complete food collection (Sweet Berries, Glow Berries, Suspicious Stew, etc.)
  - All blocks (Wood variants, Wool colors, Terracotta, Ores, etc.)
  - Brewing materials and potions
  - Music discs and rare items
  - 30+ spawn eggs
- **Custom Trade Configuration**: Set buy/sell items, quantities, and prices
- **Multiple Trades**: Add unlimited trades per villager
- **Enchanted Books**: Support for enchanted items

### 🛡️ **Behavioral Options**
- **No AI**: Create stationary villagers
- **Invulnerable**: Make villagers immune to damage
- **Persistent**: Prevent despawning
- **Silent**: Remove sound effects
- **No Gravity**: Floating villagers
- **Glowing**: Add glowing effect
- **Show Name**: Display custom names
- **Baby**: Create baby villagers

### 🔧 **Advanced Features**
- **Real-time Preview**: See your command as you build
- **One-Click Copy**: Copy commands directly to clipboard
- **Kill Commands**: Generate removal commands for invulnerable villagers
- **Export/Import**: Save and load villager configurations
- **Preset System**: Save frequently used villager setups
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Quick Start
1. **Download** or clone this repository
2. **Open** `index.html` in your web browser
3. **Configure** your villager settings
4. **Click Generate** to create your command
5. **Copy** and paste into Minecraft

### No Installation Required!
This is a client-side web application - no server setup needed. Just open the HTML file in any modern web browser.

## 📖 How to Use

### Basic Setup
1. **Name**: Give your villager a custom name
2. **Profession**: Choose from 14 available professions
3. **Biome**: Select the villager's biome type (affects appearance)
4. **Level**: Set experience level (1-5)
5. **Position**: Set spawn coordinates (supports relative positioning with `~`)

### Adding Trades
1. Click **"+ ADD TRADE"**
2. Select **buy items** (what the villager wants)
3. Set **quantities** for each item
4. Choose **sell item** (what the villager offers)
5. Set **sell quantity**
6. Add more trades as needed

### Behavioral Options
Use the checkboxes to modify villager behavior:
- ✅ **Persistent**: Villager won't despawn
- ✅ **Show Name**: Display custom name above villager
- ⬜ **No AI**: Villager won't move or interact
- ⬜ **Invulnerable**: Villager can't take damage

## 🎯 Example Commands

### Basic Librarian
```mcfunction
/summon minecraft:villager ~ ~1 ~ {
  CustomName:'{"text":"Custom Villager"}',
  VillagerData:{profession:"minecraft:librarian",level:1,type:"minecraft:plains"},
  PersistenceRequired:1b,
  Offers:{Recipes:[]}
}
```

### Advanced Trading Villager
```mcfunction
/summon minecraft:villager ~ ~1 ~ {
  CustomName:'{"text":"Master Smith"}',
  VillagerData:{profession:"minecraft:toolsmith",level:5,type:"minecraft:desert"},
  PersistenceRequired:1b,
  CustomNameVisible:1b,
  Offers:{Recipes:[
    {buy:{id:"minecraft:emerald",Count:32},sell:{id:"minecraft:netherite_sword",Count:1},maxUses:3},
    {buy:{id:"minecraft:diamond",Count:16},sell:{id:"minecraft:diamond_pickaxe",Count:1},maxUses:5}
  ]}
}
```

## 🛠️ Technical Details

### File Structure
```
CutomVillager/
├── index.html          # Main application interface
├── script.js           # Core JavaScript functionality
├── styles.css          # Minecraft-themed styling
└── README.md           # Documentation
```

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Technologies Used
- **HTML5**: Semantic structure and form elements
- **CSS3**: Minecraft-themed styling with CSS variables
- **Vanilla JavaScript**: No frameworks - pure performance
- **Local Storage**: Save presets and configurations

## 🎨 Design Features

### Minecraft-Themed UI
- **Pixel-perfect fonts**: Press Start 2P font family
- **Authentic colors**: Minecraft color palette
- **Retro styling**: 8-bit inspired design elements
- **Responsive layout**: Works on all screen sizes

### User Experience
- **Intuitive interface**: Clear labels and organized sections
- **Real-time feedback**: Live command preview
- **Error prevention**: Input validation and sanitization
- **Accessibility**: Keyboard navigation and screen reader support

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions
- 🆕 Add more Minecraft items
- 🎨 Improve UI/UX design
- 🐛 Fix bugs and issues
- 📱 Enhance mobile responsiveness
- 🌐 Add internationalization support
- ⚡ Performance optimizations

## 📋 Supported Minecraft Versions

This generator creates commands compatible with:
- ✅ **Minecraft Java Edition 1.14+**
- ✅ **Latest versions** (1.20.x)
- ⚠️ **Bedrock Edition**: Limited compatibility (different NBT structure)

## 🐛 Known Issues

- Some newer items may not be available in older Minecraft versions
- Bedrock Edition uses different command syntax
- Complex enchantments require manual NBT editing

## 🙏 Acknowledgments

- **Mojang Studios** for creating Minecraft
- **Minecraft Community** for extensive documentation
- **Contributors** who help improve this tool

## 📞 Support

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Submit an issue with the `enhancement` label
- 💬 **Questions**: Use GitHub Discussions

---

## ⭐ Star this project if you find it useful!

**Made with ❤️ for the Minecraft community**

### 🔗 Quick Links
- [Live Demo](https://eman225511.github.io/CutomVillager) 
- [Issues](https://github.com/eman225511/CutomVillager/issues)
- [Wiki](https://github.com/eman225511e/CutomVillager/wiki)

### 📊 Project Stats
![GitHub stars](https://img.shields.io/github/stars/eman225511/CutomVillager?style=social)
![GitHub forks](https://img.shields.io/github/forks/eman225511/CutomVillager?style=social)
![GitHub issues](https://img.shields.io/github/issues/eman225511/CutomVillager)
![GitHub pull requests](https://img.shields.io/github/issues-pr/eman225511/CutomVillager)



