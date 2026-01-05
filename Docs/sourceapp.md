# ARC Raiders Damage Calculator - Complete Source Documentation

## 1. Application Overview

### Purpose
This is a Shield Damage Simulator for the game ARC Raiders. It allows players to calculate damage mitigation, shield durability effects, healing outcomes, and simulate combat scenarios with various weapons, shields, and healing items.

### Main Features
- **Shield System**: Simulates shield damage absorption with damage reduction (DR), durability mechanics, and permanent break states
- **Life System**: Tracks player health with defeat condition at < 1.0 HP
- **Weapon Presets**: 17 weapons, 6 gadgets, and 3 deployables with individual damage, headshot multipliers, and projectile counts
- **Healing System**: Shield and life healing with instant, over-time, and hold-to-use modes
- **Auto-Simulation**: Automatic weapons simulation with TTK, DPS calculations
- **Undo/Redo System**: Full state history management (50 states max)
- **Action Log**: Real-time logging of all actions with color-coded entries
- **Custom Presets**: Save and load custom shield configurations
- **Fatal Indicators**: Visual prediction of fatal shots

### Dependencies
- **Tailwind CSS**: https://cdn.tailwindcss.com (utility-first CSS framework)
- **Font Awesome 6.4.2**: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css (icon library)
- **Analytics**: https://analytics.tiiny.site/js/plausible.js (web analytics)

---

## 2. HTML Structure

### Root Elements

```html
<!DOCTYPE html>
<html lang="en">
```
- **DOCTYPE**: HTML5 document type
- **lang**: "en" - English language setting

### Head Section

#### Meta Tags
- `http-equiv="Cache-Control"` - "no-cache, no-store, must-revalidate" - Prevents browser caching
- `http-equiv="Pragma"` - "no-cache" - HTTP pragma for cache control
- `http-equiv="Expires"` - "0" - Immediate expiration
- `charset` - "UTF-8" - Character encoding
- `viewport` - "width=device-width, initial-scale=1.0" - Responsive viewport settings
- `title` - "Shield Damage Simulator"
- OpenGraph meta tags for social sharing (og:url, og:type)

#### External Resources
- `script src="https://cdn.tailwindcss.com"` - Tailwind CSS CDN
- `link rel="stylesheet"` to Font Awesome CSS
- `script defer` for Plausible analytics

#### Inline Styles

**body**:
- `font-family`: 'Inter', sans-serif
- `background-color`: #15141F (dark purple-black)

**.progress-bar-container**:
- `height`: 20px
- `background-color`: #333
- `border-radius`: 9999px (pill shape)
- `overflow`: hidden
- `box-shadow`: inset 0 2px 4px rgba(0, 0, 0, 0.6)

**.progress-bar**:
- `height`: 100%
- `transition`: width 0.3s ease-out (animated width changes)

**select** (custom styling):
- Removes default appearance (-webkit-appearance, -moz-appearance, appearance: none)
- Custom SVG dropdown arrow (white chevron)
- Background positioning: right 0.75rem center
- Background size: 1.5em 1.5em
- Padding-right: 2.5rem

**.btn-charging**:
- `position`: relative
- `overflow`: hidden
- `pointer-events`: none (prevents interaction during charging animation)

### Body Section

#### Body Container
- `class`: "text-white min-h-screen"
- Sets white text color and minimum full viewport height

#### Header (`.header`)
- `id`: Not explicitly set, contains main navigation
- `class`: "w-full bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-50 mb-6"
- **Properties**:
  - Full width, semi-transparent gray background
  - Backdrop blur effect
  - Bottom border (gray-700)
  - Shadow effect
  - Sticky positioning at top (z-index 50)
  - Bottom margin of 1.5rem

**Header Content Container**:
- `class`: "max-w-4xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
- Responsive: flex column on mobile, row on desktop
- Flex gap of 1rem

**Title Section**:
- `class`: "text-center md:text-left"
- Contains `h1` with:
  - `class`: "text-xl font-bold text-white tracking-wide"
  - Content: "ARC Raiders Damage Calculator"
  - Subtitle span: "by Eroktic" (gray-400 text)

**"How it Works?" Link**:
- `href`: "https://youtu.be/U0kVkmwPBl4"
- `target`: "_blank"
- `rel`: "noopener noreferrer"
- `class`: "text-yellow-400 font-bold hover:text-yellow-300 transition-colors duration-200"

**Navigation (`nav`)**:
- `class`: "flex items-center space-x-6"
- Contains 4 social media links:
  1. **YouTube**: `href="https://www.youtube.com/eroktic"`, icon `fa-youtube`, hover text-red-500
  2. **Twitch**: `href="https://www.twitch.tv/eroktic"`, icon `fa-twitch`, hover text-purple-500
  3. **Discord**: `href="https://discord.gg/kW4xnSuRtC"`, icon `fa-discord`, hover text-indigo-400
  4. **Ko-Fi**: `href="https://ko-fi.com/eroktic"`, icon `fa-mug-hot`, hover text-pink-400, hidden "Support" text on mobile
- Each link has `group` class and hover scale transform effect

#### Main Content Container
- `id`: Not set
- `class`: "max-w-6xl mx-auto p-4 sm:p-8"
- Maximum width of 72rem, centered, responsive padding

**Grid Layout**:
- `class`: "grid grid-cols-1 lg:grid-cols-3 gap-6"
- 1 column on mobile, 3 columns on large screens
- 1.5rem gap between columns

---

### Left Column (lg:col-span-2)

#### Shield Status Panel (#shield-status)
- `class`: "bg-gray-800 p-6 rounded-xl shadow-lg border border-indigo-500/30"
- Background gray-800, padding 1.5rem, rounded corners, shadow, indigo border

**Header Row**:
- `class`: "flex flex-wrap items-center justify-between mb-4 gap-y-2"

**Shield Name (#shieldName)**:
- `class`: "text-2xl font-semibold truncate mr-2"
- Displays current shield name

**Durability Container (`.relative.group.cursor-help`)**:
- `onmouseenter`: "adjustTooltipPosition(this)"
- Contains:
  - `#shieldDurabilityContainer`: 
    - Classes: "flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 text-sm font-bold transition-all duration-300 shadow-sm"
    - Contains `#shieldDurabilityRaw` (left value), separator, warning icon (`#shieldDurabilityWarning`), `#shieldDurabilityValue`
  - **Tooltip (`.tooltip-target`)**:
    - Classes: "absolute bottom-full right-0 mb-2 hidden group-hover:block w-72 bg-gray-900 text-xs text-gray-300 p-3 rounded-xl shadow-2xl border border-gray-700 z-50 text-left"
    - Shows durability explanation

**Shield Health Bar Section**:
- Label row: `#shieldHealthLabel` (left), `#shieldResistanceLabel` (right, yellow-400)
- Bar container: `.progress-bar-container.relative.bg-gray-900`
  - `#shieldPredictionBar`: Gray prediction bar (absolute, z-index)
  - `#shieldBar`: Actual shield bar (pink-500, relative, z-10)
  - `#shieldOverlay`: Segment lines overlay (z-20, pointer-events-none)
  - `#shieldDefeatedOverlay`: "DEFEATED" overlay (hidden by default, z-30)

**Life Bar Section (#lifeBarContainer)**:
- Similar structure to shield bar
- Label: "Life" (left), `#lifeHealthLabel` (right, yellow-400)
- Bar container:
  - `#lifePredictionBar`: Gray prediction
  - `#lifeBar`: Red-600 health bar
  - `#lifeDefeatedOverlay`: "DEFEATED" overlay
- Note: "* Player is defeated if Life drops below 1.0"

**Preset Buttons Row**:
- `class`: "flex flex-wrap gap-2 mt-4"
- 5 buttons:
  1. `onclick="applyPreset('none')"` - "No Shield" (gray-600)
  2. `onclick="applyPreset('light')"` - "Light" (green-600)
  3. `onclick="applyPreset('medium')"` - "Medium" (blue-600)
  4. `onclick="applyPreset('heavy')"` - "Heavy" (pink-600)
  5. `#btnCustomPreset` onclick="applyPreset('custom')" - "Save / Custom" (gray-600 with border)

**Custom Settings Panel (#customSettingsPanel)**:
- `class`: "hidden mt-4 pt-4 border-t border-gray-600 grid grid-cols-2 md:grid-cols-5 gap-3"
- Hidden by default, revealed when custom mode active
- 5 input fields:
  1. `#customCapacity` - Max Shield (oninput: updateCustomSimulator)
  2. `#customCurrentShield` - Current Shield
  3. `#customDR` - DR %
  4. `#customLife` - Max Life
  5. `#customCurrentLife` - Current Life

#### Stats Grid
- `class`: "grid grid-cols-2 md:grid-cols-4 gap-4"
- 4 stat cards:

1. **Shots Fired** (#statBulletsFired):
   - Container: "bg-gray-800 p-4 rounded-xl shadow-lg border border-amber-500/30"
   - Label: "Shots Fired" (uppercase tracking-wider)
   - Value: text-amber-400, xl-2xl font-bold

2. **Damage Mitigated** (#statDamageMitigated):
   - Container: border border-cyan-500/30
   - Label: "Dmg Mitigated"
   - Value: text-cyan-400

3. **Potential Dmg** (#statDamageTaken):
   - Container: border border-red-500/30, with tooltip
   - Label: "Potential Dmg" (dotted border cursor-help)
   - Tooltip: "Actual Life Lost + Mitigated Damage"
   - Value: text-red-400

4. **Current EHP** (#statEHP, #ehpContainer):
   - Container: border border-purple-500/30, with tooltip
   - Label: "Current EHP"
   - Tooltip: Formula display "(Life - 0.5) / (1 - DR%)"
   - Value: text-purple-400

#### Automatic Weapons Simulation (Hidden by default)
- Container: "hidden bg-gray-800 p-6 rounded-xl shadow-lg border border-indigo-500/30 mb-6"
- Checkbox `#enableSim` (onchange: toggleSimulationUI)
- Label: "Automatic Weapons Simulation"
- Settings panel `#simSettings` (hidden):
  - RPM input `#simRPM` (value=100, min=1, max=2000)
  - Info text explaining simulation mode

#### Simulation Stats (#simStats)
- `class`: "grid grid-cols-4 gap-2 mb-6 hidden"
- 4 stat displays:
  1. TTK (#simTTK) - "0.00s"
  2. Avg DPS (#simAvgDPS) - "0"
  3. Min DPS (#simMinDPS) - "0"
  4. Max DPS (#simMaxDPS) - "0"

#### Apply Damage Panel
- Container: "bg-gray-800 p-6 rounded-xl shadow-lg border border-red-500/30"
- Header: "Apply Damage" (text-red-300, text-2xl)

**Weapon Selection Section**:
- Label: "Weapon Preset"
- Select `#weaponPreset` (onchange: applyWeaponPreset)
  - Full width, gray-700 background
- Custom settings `#customWeaponSettings` (hidden):
  - Headshot multiplier input `#customHSM` (value=2.5, step=0.05)
  - oninput: updateCustomHSM and simulator.updateUI

**Damage Inputs**:
- Grid with 3 columns:
  1. `#baseDamageInput` - Base Dmg/Pellet (value=40, min=0.1, step=0.1, max=10000)
     - oninput: onDamageInput and simulator.updateUI
  2. `#projectileCountInput` - Projectiles (value=1, min=1, max=100)
     - oninput: simulator.updateUI
  3. `#numHitsInput` - Triggers Pulled (value=1, min=1, max=10000)
     - oninput: simulator.updateUI

**Shot Buttons Row**:
- `class`: "flex space-x-2 mt-6"
- 3 buttons:
  1. `#btnLegShot` onclick="applyDamage(0.75)" - "Leg Shot (x0.75)"
  2. `#btnBodyShot` onclick="applyDamage(1)" - "Body Shot (x1)"
  3. `#btnHeadShot` onclick="applyDamage(2.5)" - "Head Shot (x2.5)"
- All: bg-red-800 hover:bg-red-900, shadow-xl shadow-red-500/30

#### Patch Notes / Notes Section
- Container: "bg-gray-800 rounded-xl shadow-lg border border-gray-600/30 overflow-hidden mt-6"
- Toggle button (onclick: togglePatchNotes):
  - Icon: `fa-edit`, text: "Notes"
  - Chevron icon `#patchNotesIcon` (rotates on toggle)
- Content `#patchNotesContent` (hidden):
  - Contains list of notes about calculator features
  - Links to Anvil Community

---

### Right Column (lg:col-span-1)

#### Action Log Panel
- Container: "bg-gray-900 p-6 rounded-xl shadow-lg h-96 flex flex-col border border-gray-700"
- Fixed height of 24rem (h-96)

**Header**:
- Title: "Action Log" (text-gray-300, text-2xl)
- Button row:
  1. Copy button (onclick: copyActionLog), icon `#copyIcon`
  2. Undo button (onclick: undoAction), icon `fa-undo`
  3. Redo button (onclick: redoAction), icon `fa-redo`
- All buttons: 8x8 size, gray-700 background, hover effects

**Log Output (#logOutput)**:
- `class`: "flex-grow overflow-y-auto space-y-2 text-sm text-gray-300 p-2 rounded bg-gray-950/50"
- Scrollable container with dark background
- Contains log entry divs with various classes based on type

#### Healing Stats Grid
- `class`: "grid grid-cols-2 gap-4"
- 2 stat cards:
  1. Shield Repaired (#statShieldRepaired) - border-green-500/30, text-green-400
  2. Life Healed (#statLifeHealed) - border-green-500/30, text-green-400

#### Apply Healing Panel
- Container: "bg-gray-800 p-6 rounded-xl shadow-lg border border-green-500/30"
- Header: "Apply Healing" (text-green-300, text-2xl)
- Checkbox `#simulateHeal` with label "Simulate"

**Shield Healing Section**:
- Label: "Shield Item"
- Select `#shieldHealPreset` (onchange: toggleHealInputs('shield'))
- Custom inputs `#customShieldHealInputs` (hidden grid):
  - `#customShieldAmount` - Amount placeholder
  - `#customShieldDuration` - Time (s) placeholder
- Button `#btnApplyShieldHeal` onclick="applyHeal('shield')" - "Recharge Shield"

**Life Healing Section**:
- Label: "Life Item"
- Select `#lifeHealPreset` (onchange: toggleHealInputs('life'))
- Custom inputs `#customLifeHealInputs` (hidden grid):
  - `#customLifeAmount` - Amount placeholder
  - `#customLifeDuration` - Time (s) placeholder
- Button `#btnApplyLifeHeal` onclick="applyHeal('life')" - "Apply Heal"

#### Footer
- `class`: "mt-8 text-center text-xs text-gray-500 pb-4"
- Text: "Last Updated: 06 December 2025"

---

## 3. CSS Documentation

### Base Classes

**Body Styling**:
- `text-white` - All text white color
- `min-h-screen` - Minimum viewport height
- Custom background: #15141F (dark purple-black)
- Custom font-family: 'Inter', sans-serif

**Header**:
- `bg-gray-800/90` - Gray background with 90% opacity
- `backdrop-blur-sm` - Slight backdrop blur
- `border-b border-gray-700` - Bottom border
- `shadow-lg` - Large shadow
- `sticky top-0` - Sticky at top of viewport
- `z-50` - High z-index for layering
- `mb-6` - Bottom margin of 1.5rem

**Grid System**:
- `grid` - CSS Grid display
- `grid-cols-1 lg:grid-cols-3` - 1 column mobile, 3 columns large screens
- `gap-6` - 1.5rem gap between items
- `flex flex-col md:flex-row` - Flex column on mobile, row on desktop
- `justify-between` - Space between elements

**Cards/Panels**:
- `bg-gray-800` - Dark gray background
- `bg-gray-900` - Darker gray background
- `p-4`, `p-6` - Padding (1rem, 1.5rem)
- `rounded-xl` - Rounded corners (0.75rem)
- `shadow-lg` - Large shadow effect
- `border` with various colors (indigo-500/30, red-500/30, green-500/30, etc.)

### Progress Bars

**Container**:
- `h-5` (height: 20px)
- `bg-gray-900` - Dark background
- `rounded-9999px` - Fully rounded (pill shape)
- `overflow-hidden` - Clip overflow content
- `relative` - For absolute positioning of children

**Bar**:
- `h-full` - Full height
- `transition-all duration-500` - Smooth width transition over 500ms
- Background colors: bg-pink-500, bg-red-600, bg-gray-500/80

### Buttons

**Damage Buttons**:
- `px-4 py-3` - Horizontal and vertical padding
- `bg-red-800 hover:bg-red-900` - Red background, darker on hover
- `text-white font-bold` - White bold text
- `rounded-lg` - Rounded corners (0.5rem)
- `transition duration-200` - 200ms transition
- `shadow-xl shadow-red-500/30` - Large shadow with red tint

**Healing Buttons**:
- `bg-green-600 hover:bg-green-700` - Green background
- `shadow-md` - Medium shadow

**Hold Mode Buttons**:
- `bg-indigo-600 hover:bg-indigo-700` - Indigo/purple
- `border-2 border-indigo-400` - Thicker border
- `shadow-[0_0_15px_rgba(99,102,241,0.5)]` - Custom purple glow shadow

**Fatal Buttons**:
- `bg-red-950 hover:bg-black` - Very dark red to black
- `border border-red-500` - Red border
- `text-red-500` - Red text
- `shadow-[0_0_15px_rgba(220,38,38,0.4)]` - Red glow

**Disabled Buttons**:
- `bg-gray-700 text-gray-500` - Gray background and text
- `cursor-not-allowed` - Not-allowed cursor
- `opacity-50` - 50% opacity

### Text Styling

**Headers**:
- `text-xl`, `text-2xl` - Large font sizes
- `font-bold`, `font-semibold` - Font weights
- `tracking-wide` - Wide letter spacing

**Labels**:
- `text-xs`, `text-sm` - Small font sizes
- `font-medium`, `font-bold` - Font weights
- `uppercase tracking-wider` - Uppercase with wide spacing
- `text-gray-400`, `text-gray-500` - Gray text colors

**Stat Values**:
- `text-xl sm:text-2xl` - Responsive font size
- `font-bold` - Bold weight
- Color-coded by stat type (amber, cyan, red, purple, green)

---

## 4. JavaScript Documentation

### Global Variables

```javascript
const DEFAULT_MAX_LIFE = 100;  // Default maximum life value
let simulator = null;              // Global ShieldSimulator instance
let currentMode = 'heavy';         // Current shield preset mode
let customSavedDurability = null;  // Saved durability for custom reset
let actionHistory = [];            // Array of state snapshots
let historyIndex = -1;             // Current position in history
const MAX_HISTORY = 50;            // Maximum history states to keep
let activeSimulation = null;       // Reference to active simulation interval
```

### Constants & Data Structures

#### SHIELD_PRESETS
```javascript
{
  none: { charges: 0, dr: 0.0, life: 100, name: 'No Shield', nameColor: 'text-gray-400', barColor: 'bg-gray-600', borderColor: 'border-gray-500/30' },
  light: { charges: 40, dr: 40.0, life: 100, name: 'Light Shield', nameColor: 'text-green-400', barColor: 'bg-green-500', borderColor: 'border-green-500/30' },
  medium: { charges: 70, dr: 42.5, life: 100, name: 'Medium Shield', nameColor: 'text-blue-400', barColor: 'bg-blue-500', borderColor: 'border-blue-500/30' },
  heavy: { charges: 80, dr: 52.5, life: 100, name: 'Heavy Shield', nameColor: 'text-pink-400', barColor: 'bg-pink-600', borderColor: 'border-pink-500/30' },
  custom: { charges: 80, dr: 50, life: 100, name: 'Custom Shield', nameColor: 'text-amber-400', barColor: 'bg-amber-500', borderColor: 'border-amber-500/30' }
}
```

#### HEALING_ITEMS
```javascript
{
  shield: {
    'Arc Powercell': { amount: 20, duration: 10, useTime: 3, color: 'text-gray-400' },
    'Shield Recharger': { amount: 40, duration: 10, useTime: 2, color: 'text-green-400' },
    'Surge Shield Recharger': { amount: 50, duration: 0, useTime: 5, color: 'text-blue-400' },
    'Custom': { amount: 0, duration: 0, useTime: 0, color: 'text-white' }
  },
  life: {
    'Fabric': { amount: 10, duration: 25, useTime: 1.5, color: 'text-gray-400' },
    'Bandage': { amount: 20, duration: 10, useTime: 1.5, color: 'text-white' },
    'Herbal Bandage': { amount: 35, duration: 10, useTime: 1.5, color: 'text-green-400' },
    'Sterilized Bandage': { amount: 50, duration: 10, useTime: 1.5, color: 'text-blue-400' },
    'Vita Shot': { amount: 50, duration: 0, useTime: 4, color: 'text-blue-400' },
    'Vita Spray': { amount: 10, duration: 0, mode: 'hold', useTime: 0, color: 'text-pink-400' },
    'Custom': { amount: 0, duration: 0, useTime: 0, color: 'text-white' }
  }
}
```

#### WEAPONS (17 weapons)
```javascript
{
  'Anvil': { damage: 40, hsm: 2.5, projectiles: 1, color: 'text-green-400' },
  'Arpeggio': { damage: 9.5, hsm: 2, projectiles: 3, color: 'text-green-400' },
  'Bettina': { damage: 14, hsm: 2, projectiles: 1, color: 'text-pink-400' },
  'Bobcat': { damage: 6, hsm: 2, projectiles: 1, color: 'text-pink-400' },
  'Burletta': { damage: 10, hsm: 2.5, projectiles: 1, color: 'text-green-400' },
  'Ferro': { damage: 40, hsm: 2.5, projectiles: 1, color: 'text-white' },
  'Hairpin': { damage: 20, hsm: 2.5, projectiles: 1, color: 'text-white' },
  'Il Toro': { damage: 7.5, hsm: 1, projectiles: 9, color: 'text-green-400' },
  'Kettle': { damage: 10, hsm: 2.5, projectiles: 1, color: 'text-white' },
  'Osprey': { damage: 45, hsm: 2, projectiles: 1, color: 'text-blue-400' },
  'Rattler': { damage: 9, hsm: 2, projectiles: 1, color: 'text-white' },
  'Renegade': { damage: 35, hsm: 2.25, projectiles: 1, color: 'text-blue-400' },
  'Stitcher': { damage: 7, hsm: 2.5, projectiles: 1, color: 'text-white' },
  'Tempest': { damage: 10, hsm: 1.5, projectiles: 1, color: 'text-pink-400' },
  'Torrente': { damage: 8, hsm: 2, projectiles: 1, color: 'text-blue-400' },
  'Venator': { damage: 9, hsm: 2.5, projectiles: 2, color: 'text-blue-400' },
  'Vulcano': { damage: 5.5, hsm: 1, projectiles: 9, color: 'text-pink-400' }
}
```

#### GADGETS (6 gadgets)
```javascript
{
  'Explosive Mine': { damage: 40, color: 'text-blue-400' },
  'Heavy Fuze Grenade': { damage: 80, color: 'text-blue-400' },
  'Light Impact Grenade': { damage: 30, color: 'text-white' },
  'Shrapnel Grenade': { damage: 60, color: 'text-green-400' },
  'Snap Blast Grenade': { damage: 70, color: 'text-green-400' },
  "Trigger'Nade": { damage: 90, color: 'text-blue-400' }
}
```

#### DEPLOYABLES (3 AI deployables)
```javascript
{
  'Rocketeer': { damage: 90, color: 'text-white' },
  'Sentinel': { damage: 80, color: 'text-white' },
  'Turret': { damage: 2.5, color: 'text-white' }
}
```

---

### Functions

#### State Management Functions

**saveState()**
- Saves current simulator state to history
- Parameters: None
- Returns: void
- Creates state object with all simulator properties and logHTML
- Manages history array with MAX_HISTORY limit

**loadState(state)**
- Restores simulator from saved state
- Parameters: state object
- Returns: void
- Restores all properties and log HTML

**undoAction()**
- Undoes to previous state in history
- Parameters: None
- Returns: void

**redoAction()**
- Redoes to next state in history
- Parameters: None
- Returns: void

**resetHistory()**
- Clears history and saves initial state
- Parameters: None
- Returns: void

#### Utility Functions

**copyActionLog()**
- Copies action log to clipboard
- Uses navigator.clipboard with document.execCommand fallback
- Shows success feedback

**log(message, type)**
- Adds entry to action log
- Parameters: message (string), type (string)
- Type options: 'info', 'success', 'error', 'shield-break', 'perm-break', 'shield-repair', 'defeated', 'attack', 'heal'
- Creates styled entry and prepends to log

**togglePatchNotes()**
- Toggles patch notes visibility
- Parameters: None
- Returns: void

**adjustTooltipPosition(container)**
- Adjusts tooltip position based on screen space
- Parameters: container (DOM element)
- Returns: void

---

#### ShieldSimulator Class

**constructor(preset)**
- Initializes new simulator instance
- Parameters: preset object
- Properties: maxShield, currentShield, dr, maxLife, currentLife, shieldColor, shieldName, nameColor, borderColor, maxDurability, currentDurability, isPermanentlyBroken, bulletsFired, damageMitigated, totalDamageTaken, shieldRepaired, lifeHealed, activeIntervals, shieldInterval, lifeInterval

- Clears log, calls updateUI(), logs initialization

**updateUI()**
- Updates all UI elements to reflect current state
- Parameters: None
- Returns: void
- Updates shield bar, life bar, labels, EHP, stats, durability indicator, button states, fatal indicators


**updateFatalIndicators()**
- Updates damage button styling to show fatal hits
- Performs dry-run simulation for each button
- Applies fatal styling (dark red, skull icon) if hit would be fatal

**isHitFatal(baseDamage, multiplier, projectiles, triggers)**
- Dry-runs damage calculation to check for fatality
- Returns: boolean

**applySingleBulletDamage(baseDamage, multiplier)**
- Applies damage from single bullet/hit
- Returns: { shieldLost, lifeLost, broken, defeated }
- Handles shield absorption, DR, durability loss, life damage

**applyBatchDamage(baseDamage, multiplier, label, weaponName, projectiles)**
- Applies damage from multiple projectiles
- Returns: total life lost
- Logs batch damage and shield breaks

**logBatchDamage(name, label, hits, shieldLost, lifeLost)**
- Logs damage batch to action log
- Parameters: name, label, hits, shieldLost, lifeLost

**clearActiveHeals()**
- Clears all active healing intervals
- Resets prediction bars

**startHeal(target, totalAmount, duration)**
- Starts healing process (instant or over time)
- Parameters: target ('shield'/'life'), totalAmount, duration

**healInstant(target, amount)**
- Applies instant healing
- Parameters: target, amount

**heal(target, amount)**
- Alias for healInstant

**startChanneling(type, amountPerSec)**
- Starts hold-to-heal channeling
- Parameters: type, amountPerSec

**stopChanneling()**
- Stops hold-to-heal channeling
- Saves state

---

#### Preset and Configuration Functions

**updateCustomSimulator(useSavedDurability = false)**
- Updates simulator from custom settings inputs
- Parameters: useSavedDurability (boolean)

**applyPreset(presetKey)**
- Applies a shield preset
- Parameters: presetKey ('none'/'light'/'medium'/'heavy'/'custom')

**updateCustomButtonState()**
- Updates custom preset button appearance

**updateCustomHSM()**
- Updates custom headshot multiplier

**toggleMultipliers(enable)**
- Enables/disables leg and head shot buttons

**toggleSimulationUI()**
- Toggles automatic weapons simulation UI

**onDamageInput()**
- Handles manual damage input changes

---

#### Weapon and Healing Functions

**populateWeaponPresets()**
- Populates weapon dropdown with all items
- Creates categories: Custom, Weapons, Gadgets, AI
- Sorts by rarity

**applyWeaponPreset()**
- Applies selected weapon preset
- Updates damage inputs and button states

**applyDamage(multiplier)**
- Applies damage with given multiplier
- Handles both standard and simulation modes
- Parameters: multiplier (0.75/1/HSM)

**populateHealPresets(type)**
- Populates healing item dropdown
- Parameters: type ('shield'/'life')

**toggleHealInputs(type)**
- Toggles custom healing inputs and updates button
- Handles hold mode vs click mode

**applyHeal(type)**
- Applies healing item
- Parameters: type ('shield'/'life')
- Handles casting animation if simulate enabled

---

#### Initialization

**window.onload**
- Initializes application on page load
- Calls populateWeaponPresets() and applyPreset('heavy')

---

## 5. Data Structures

### State Object (History)
```javascript
{
  currentShield: number,           // Current shield value
  currentLife: number,            // Current life value
  currentDurability: number,      // Current durability
  isPermanentlyBroken: boolean,   // Permanent break status
  bulletsFired: number,           // Total bullets fired
  damageMitigated: number,        // Total damage mitigated
  totalDamageTaken: number,        // Total actual damage taken
  shieldRepaired: number,         // Total shield healed
  lifeHealed: number,             // Total life healed
  logHTML: string                 // HTML of action log
}
```

### Damage Result Object
```javascript
{
  shieldLost: number,    // Amount of shield lost
  lifeLost: number,     // Amount of life lost
  broken: boolean,      // Whether shield broke
  defeated: boolean     // Whether target was defeated
}
```

---

## 6. User Flow & Interactions

### Initial State
1. Page loads, window.onload triggers
2. Weapon and healing presets populated
3. Heavy shield preset applied
4. Initial state saved to history

### Shield Selection
1. User clicks shield preset button
2. applyPreset() called, new ShieldSimulator created
3. History reset, UI updated

### Custom Shield Flow
1. First click: imports current stats to custom inputs, snapshots durability
2. Input changes: recreate simulator with new values
3. Second click: restores saved snapshot

### Weapon Selection
1. User changes dropdown
2. applyWeaponPreset() updates inputs and button states
3. Fatal indicators recalculated

### Manual Damage Application
1. User adjusts damage inputs (optional)
2. User clicks shot button
3. For each trigger pull and projectile:
   - Shield absorbs first (if active)
   - DR applies to mitigate life damage
   - Durability decreases
   - Life damaged by mitigated amount
4. State saved to history

### Auto-Simulation
1. User enables simulation checkbox
2. Simulation UI revealed
3. User clicks shot button
4. First shot fires immediately
5. Interval started with delay = 60000 / RPM
6. Each cycle fires shot, calculates stats
7. Stops when defeated or limit reached

### Healing Application
1. User selects healing item
2. User clicks healing button
3. If simulate checked and useTime > 0:
   - Casting animation plays
   - Heal applied after animation
4. Else: heal applied immediately
5. If duration > 0: over-time heal started
6. Hold mode: healing while button pressed

### Undo/Redo
1. State automatically saved after each action
2. Undo: moves back in history
3. Redo: moves forward in history

### Shield Break
1. Durability reaches 0
2. isPermanentlyBroken set to true
3. Shield healing blocked

### Defeat
1. Life drops below 1.0
2. "DEFEATED" overlays shown
3. Active heals cleared

---

## 7. Calculation Logic

### Damage Calculation
```
if shield active:
    mitigatedBase = baseDamage * (1 - dr/100)
    lifeDamage = mitigatedBase * multiplier
    shieldLoss = min(currentShield, baseDamage)
    currentDurability -= shieldLoss
    if currentDurability <= 0: break permanently
else:
    lifeDamage = baseDamage * multiplier

actualLifeLost = min(currentLife, lifeDamage)
currentLife -= actualLifeLost
```

### Effective HP (EHP)
```
effectivePool = max(0, currentLife - 0.5)
damageFactor = 1 - (dr / 100)

if shield active:
    ehp = effectivePool / damageFactor
else:
    ehp = effectivePool
```

### Simulation Calculations
```
delayMs = 60000 / RPM
delaySec = delayMs / 1000

TTK = (triggersFired - 1) * delaySec

instantDPS = lifeLostThisShot / delaySec
avgDPS = totalLifeLost / (triggersFired * delaySec)
```

### Healing Calculation
```
// Instant
actualHealed = min(current + amount, max) - current

// Over-time
tickRate = 0.1 seconds
amountPerTick = totalAmount / (duration / tickRate)

// Hold-to-heal
amountPerTick = (amountPerSecond * tickRate)
```

### Fatality Detection (Dry Run)
Clones state, simulates all hits, returns true if life < 1.0

---

## Complete Element ID Reference

### Input Elements
- enableSim, simRPM, weaponPreset, customHSM
- baseDamageInput, projectileCountInput, numHitsInput
- shieldHealPreset, lifeHealPreset
- customCapacity, customCurrentShield, customDR, customLife, customCurrentLife
- customShieldAmount, customShieldDuration, customLifeAmount, customLifeDuration
- simulateHeal

### Button Elements
- btnCustomPreset, btnLegShot, btnBodyShot, btnHeadShot
- btnApplyShieldHeal, btnApplyLifeHeal

### Display Elements
- shieldName, shieldDurabilityContainer, shieldDurabilityRaw, shieldDurabilityValue, shieldDurabilityWarning
- shieldHealthLabel, shieldResistanceLabel, shieldBar, shieldPredictionBar, shieldOverlay, shieldDefeatedOverlay
- lifeHealthLabel, lifeBar, lifePredictionBar, lifeDefeatedOverlay
- statBulletsFired, statDamageMitigated, statDamageTaken, statEHP
- statShieldRepaired, statLifeHealed
- simTTK, simAvgDPS, simMinDPS, simMaxDPS

### Container Elements
- shield-status, lifeBarContainer, ehpContainer
- customSettingsPanel, simSettings, simStats
- customWeaponSettings, customShieldHealInputs, customLifeHealInputs
- patchNotesContent, logOutput

---

## End of Documentation

This documentation provides complete coverage of the ARC Raiders Damage Calculator application. Every element, function, style, variable, and interaction has been documented with full context including names, purposes, structures, and behaviors. The entire application can be replicated in React without viewing the original source code.

**Document Version**: 1.0
**Source File**: sourceapp.html