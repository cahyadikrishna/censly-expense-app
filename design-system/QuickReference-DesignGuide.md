# NOTION-STYLE DESIGN QUICK REFERENCE

## 🎯 ONE-PAGE CHEAT SHEET

---

## BORDERS & SHADOWS

### Border Specifications
```
Standard Elements:
  Width: 2px solid #000000
  Radius: 8px

Buttons & CTAs:
  Width: 3px solid #000000
  Radius: 8px

Cards:
  Width: 2px solid #000000
  Radius: 12px
```

### Doodle Shadow (Hover State)
```
CSS:
  box-shadow: 4px 4px 2px rgba(0,0,0,1), 0px 6px 3px rgba(0,0,0,0.3);

Tailwind:
  hover:shadow-[4px_4px_2px_rgba(0,0,0,1),0px_6px_3px_rgba(0,0,0,0.3)]

React Native:
  shadowColor: '#000'
  shadowOffset: { width: 4, height: 4 }
  shadowOpacity: 1
  shadowRadius: 2
  elevation: 8
```

---

## COLOR PALETTE

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Black | `#000000` | Borders, text, buttons |
| White | `#FFFFFF` | Backgrounds |
| Dark Gray | `#333333` | Headings |
| Gray | `#666666` | Body text |
| Light Gray | `#999999` | Placeholders, secondary text |
| Off-white | `#F9F9F9` | Hover backgrounds, sections |

---

## TYPOGRAPHY QUICK STYLES

### Headers
```
H1: 32-40px, bold (700), -0.02em tracking
H2: 24-28px, bold (700), -0.01em tracking
H3: 18-20px, bold (700)
```

### Body
```
Regular: 16px, 400, 1.6 line-height
Small: 14px, 400
Label: 12px, 600, 0.05em tracking (uppercase)
```

### Fonts
```
Display: DM Sans, Playfair Display
Body: Inter, IBM Plex Sans
```

---

## COMPONENT QUICK SPECS

### INPUT FIELD
```
Border: 2px black
Padding: 12px 16px
Radius: 8px
Focus: 2px outline ring
Hover: Add doodle shadow
```

### BUTTON
```
Primary:
  Border: 3px black
  Background: black
  Text: white
  Padding: 14px 24px
  
Outline:
  Border: 3px black
  Background: white
  Text: black
  
Hover: Add doodle shadow + scale 1.02
Active: Scale 0.95
```

### CARD
```
Border: 2px black
Radius: 12px
Padding: 20-24px
Background: white
Hover: Doodle shadow + scale 1.01
```

### TOGGLE
```
Width: 48px | Height: 28px
Border: 2px black
Radius: 14px
Off: white bg, black dot left
On: black bg, white dot right
Transition: 200ms ease
```

### BADGE
```
Border: 2px black
Padding: 6px 12px
Radius: 20px (full round)
Font: 12px bold
```

---

## SPACING SCALE

```
xs: 4px      md: 12px     2xl: 32px
sm: 8px      lg: 16px     3xl: 48px
             xl: 24px     4xl: 64px
```

### Component Padding
- Buttons: 14px (v) × 24px (h)
- Inputs: 12px (v) × 16px (h)
- Cards: 20-24px
- Page margins: 24-32px
- Section gap: 20px

---

## STATES & TRANSITIONS

### All Elements
```
Transition duration: 200ms
Easing: ease-out
Properties: shadow, scale, background-color
```

### Focus State
```
Outline: 2px solid black with 2px offset
Duration: 150ms
Easing: ease-in-out
```

### Active/Click
```
Scale: 0.95 (compress effect)
Duration: 100ms
Easing: ease-in
```

---

## DOODLE ILLUSTRATIONS

### Style Guidelines
```
Line weight: 2-3px strokes
Color: Black on white (or white on black)
Details: Minimal but expressive
Fills: Solid black only
Feel: Organic, hand-drawn, slightly imperfect
Spacing: Generous white space
```

### Placement
```
Hero sections: 150-300px
Empty states: 120-180px
Accents: 60-100px in corners
Icons: Simple line-drawn replacements
```

---

## IMPLEMENTATION CHECKLIST

```
Components to Update:
  ☐ Input fields (2px black border)
  ☐ Buttons (3px black border)
  ☐ Cards (2px black border)
  ☐ Form fields (consistent styling)
  ☐ Toggle switches (doodle shadow)
  ☐ Badges/tags
  ☐ Focus rings (2px black outline)
  ☐ Dividers (1px black lines)

Hover States:
  ☐ All interactive elements get doodle shadow
  ☐ Buttons/cards scale 1.02 or 1.01
  ☐ Inputs change background to #F9F9F9

Illustrations:
  ☐ Replace generic icons with doodle style
  ☐ Add hand-drawn illustrations to key sections
  ☐ Use black and white only
  ☐ Maintain consistent line weight

Typography:
  ☐ Use DM Sans or Playfair for headers
  ☐ Use Inter for body text
  ☐ Apply proper font weights
  ☐ Use correct letter spacing

Colors:
  ☐ Primary text: #000000
  ☐ Secondary text: #666666
  ☐ Borders: #000000
  ☐ Backgrounds: #FFFFFF / #F9F9F9
  ☐ Remove all other colors (except accents if used)
```

---

## COMMON MISTAKES TO AVOID

```
❌ Using rounded borders (use 8px max)
❌ Thin borders (use 2-3px minimum)
❌ Gray text on white (use black or dark gray)
❌ Shadows on everything (only hover states)
❌ Inconsistent padding/spacing
❌ Multiple accent colors
❌ Generic line icons (use doodle illustrations)
❌ Gradients (use solid colors only)
❌ Complex animations (keep it simple)
❌ Colored backgrounds (stick to white/off-white)
```

---

## REACT NATIVE SPECIFIC

### Shadow Implementation
```javascript
// Instead of Tailwind box-shadow, use:
style={{
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 2,
  elevation: 8, // Android
}}

// Or for hover states, nest Views with shadows
<View style={outerShadow}>
  <View style={innerContent}>
    {/* Content */}
  </View>
</View>
```

### NativeWind Limitations
```
- Box-shadow works but translates to platform-specific shadows
- Use elevation + shadowColor/Offset for consistency
- Test on both iOS and Android
- Consider creating custom shadow components
```

---

## TAILWIND UTILITIES TO ADD

```javascript
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'doodle': '4px 4px 2px rgba(0, 0, 0, 1), 0px 6px 3px rgba(0, 0, 0, 0.3)',
        'doodle-sm': '3px 3px 1px rgba(0, 0, 0, 0.5)',
        'doodle-lg': '6px 6px 3px rgba(0, 0, 0, 1), 0px 8px 4px rgba(0, 0, 0, 0.4)',
      },
      scale: {
        '102': '1.02',
        '101': '1.01',
        '95': '0.95',
      },
      borderWidth: {
        '3': '3px',
      },
      letterSpacing: {
        'tight': '-0.02em',
        'tight-sm': '-0.01em',
      },
    },
  },
}
```

---

## FILE STRUCTURE SUGGESTION

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.styles.js
│   ├── Input/
│   │   ├── Input.jsx
│   │   └── Input.styles.js
│   ├── Card/
│   │   ├── Card.jsx
│   │   └── Card.styles.js
│   ├── Toggle/
│   │   ├── Toggle.jsx
│   │   └── Toggle.styles.js
│   ├── Badge/
│   │   ├── Badge.jsx
│   │   └── Badge.styles.js
│   └── Divider/
│       └── Divider.jsx
├── styles/
│   ├── colors.js
│   ├── typography.js
│   ├── spacing.js
│   └── shadows.js
└── tailwind.config.js
```

---

## DESIGN SYSTEM PRINCIPLES

1. **Consistency**: Every border is 2-3px black
2. **Clarity**: High contrast, clear hierarchy
3. **Playfulness**: Doodle shadows add warmth
4. **Minimalism**: No unnecessary visual elements
5. **Accessibility**: Bold borders, clear focus states
6. **Scalability**: Components work at any size
7. **Personality**: Illustrations add character

---

## QUICK START FOR EXISTING COMPONENTS

If you have an existing generic Tailwind component:

**Before:**
```jsx
<button className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800">
  Click me
</button>
```

**After:**
```jsx
<button className="
  px-6 py-3
  bg-black
  text-white
  border-3 border-black
  rounded-lg
  font-bold
  tracking-tight
  transition-all duration-200 ease-out
  hover:shadow-doodle hover:scale-102
  active:scale-95
"
>
  Click me
</button>
```

---

## VISUAL HIERARCHY EXAMPLE

```
H1 (32px bold) ← Most prominent
  Content section header

H2 (24px bold)
  Subsection title

H3 (20px bold)
  Component label

Body (16px regular)
  Main content text

Small (14px regular)
  Secondary information

Label (12px bold uppercase)
  Form labels, badges
```

Use bold borders to separate visual sections instead of background colors.

---

**Created for: Notion-Style Task/Project Management App**
**Design Approach: Bold Borders + Doodle Shadows + Black & White**
**Framework: React Native with Tailwind (NativeWind)**
