# Notion-Style Design System
## Bold Borders + Doodle Shadows for React Native Tailwind

---

## 🎨 Design Philosophy

**Aesthetic**: Clean, minimalist with playful doodle personality. Bold black borders create structural clarity. Hand-drawn shadow effects add warmth and approachability. Black & white foundation with optional soft accent colors.

**Key Characteristics**:
- Dark, bold borders (2-3px) on all interactive elements
- Doodle-style drop shadows on hover (organic, slightly offset)
- Consistent spacing and alignment
- Hand-drawn illustration accents
- High contrast for accessibility

---

## 🎯 Core Design Elements

### 1. **Borders & Strokes**
```
Primary Border: #000000 (solid black)
Border Width: 2px (standard), 3px (prominent elements like buttons)
Border Radius: 8px (slight roundness for friendliness, not too rounded)

Usage:
- Input fields: 2px black border
- Cards: 2px black border
- Buttons: 3px black border
- Toggle switches: 2px border
```

### 2. **Doodle Shadow System**

Instead of traditional shadows, use **hand-drawn style offsets** on hover:

```
Doodle Shadow Pattern (on hover):
- Shadow 1: 4px offset right + 4px offset down, black, 100% opacity, 2px blur
- Shadow 2 (optional): 6px offset down, black, 30% opacity, 3px blur
- This creates an organic, slightly wobbly look

CSS Example:
box-shadow: 
  4px 4px 2px rgba(0, 0, 0, 1),
  0px 6px 3px rgba(0, 0, 0, 0.3)

Tailwind Custom Class:
@layer components {
  .doodle-shadow {
    @apply shadow-[4px_4px_2px_rgba(0,0,0,1),0px_6px_3px_rgba(0,0,0,0.3)];
  }
  
  .doodle-shadow-hover {
    @apply hover:shadow-[4px_4px_2px_rgba(0,0,0,1),0px_6px_3px_rgba(0,0,0,0.3)] transition-shadow duration-200 ease-out;
  }
}
```

### 3. **Color Palette**

| Role | Color | Hex | Use Case |
|------|-------|-----|----------|
| Primary Background | White | `#FFFFFF` | Page background |
| Secondary Background | Off-white | `#F9F9F9` or `#F5F5F5` | Card backgrounds, hover states |
| Text - Primary | Black | `#000000` | Headings, body text |
| Text - Secondary | Dark Gray | `#666666` or `#555555` | Secondary text, labels |
| Borders & Strokes | Black | `#000000` | All borders |
| Accent (optional) | Soft Green | `#A8E6CF` or soft blue `#B3E5FC` | Highlights, CTAs |
| Focus State | Black | `#000000` | Input focus ring (2px solid) |

### 4. **Typography**

**Font Stack**:
```
Display/Headlines: 'DM Sans Bold' or 'Playfair Display' or 'Space Grotesk'
- Weight: 700 (bold)
- Letter spacing: -0.02em (tight for impact)

Body/Regular Text: 'Inter' or 'IBM Plex Sans'
- Weight: 400-500
- Line height: 1.6 (generous for readability)

Input Placeholders: 
- Weight: 400
- Color: #999999 (lighter gray)
```

**Size Hierarchy**:
- H1: 32-40px, bold, -0.02em tracking
- H2: 24-28px, bold, -0.01em tracking
- H3: 18-20px, bold
- Body: 16px, 400 weight, 1.6 line-height
- Small: 14px, 400 weight
- Label: 12px, 600 weight, uppercase letter-spacing 0.05em

---

## 🧩 Component Specifications

### **Input Fields**

```
Structure:
- Border: 2px solid #000000
- Border radius: 8px
- Padding: 12px 16px
- Background: #FFFFFF
- Font: Inter 16px, #000000

Hover State:
- Add doodle-shadow-hover class
- Border stays 2px solid black
- Background: #F9F9F9

Focus State:
- Border: 2px solid #000000 (no change)
- Outline: 2px solid #000000, 2px offset
- Shadow: doodle-shadow effect
- Background: #FFFFFF

Placeholder:
- Color: #999999
- Font: 400 weight, italic
```

**Tailwind Classes**:
```jsx
className="
  w-full
  px-4 py-3
  border-2 border-black
  rounded-lg
  bg-white
  text-black
  text-base
  placeholder-gray-400
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
  hover:shadow-[4px_4px_2px_rgba(0,0,0,1),0px_6px_3px_rgba(0,0,0,0.3)]
"
```

---

### **Buttons**

```
Default Button:
- Border: 3px solid #000000
- Border radius: 8px
- Padding: 14px 24px
- Background: #000000
- Text color: #FFFFFF
- Font: DM Sans 16px, 700 weight
- Letter spacing: -0.01em

Hover State:
- Add doodle-shadow effect
- Scale: 1.02 (subtle scale up)
- All other properties same

Secondary Button:
- Border: 3px solid #000000
- Background: #FFFFFF
- Text color: #000000
- Same hover effect

Disabled:
- Opacity: 0.5
- Cursor: not-allowed
- No hover effect
```

**Tailwind Classes**:
```jsx
// Primary Button
className="
  px-6 py-3
  bg-black
  text-white
  border-3 border-black
  rounded-lg
  font-bold text-base
  tracking-tight
  transition-all duration-200 ease-out
  hover:shadow-[4px_4px_2px_rgba(0,0,0,1),0px_6px_3px_rgba(0,0,0,0.3)]
  hover:scale-102
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
"

// Secondary Button (Outline)
className="
  px-6 py-3
  bg-white
  text-black
  border-3 border-black
  rounded-lg
  font-bold text-base
  tracking-tight
  transition-all duration-200 ease-out
  hover:shadow-[4px_4px_2px_rgba(0,0,0,1),0px_6px_3px_rgba(0,0,0,0.3)]
  hover:scale-102
  active:scale-95
"
```

---

### **Cards**

```
Structure:
- Border: 2px solid #000000
- Border radius: 12px
- Padding: 20px-24px
- Background: #FFFFFF or #F9F9F9
- Shadow: none (until hover)

Hover State:
- Apply doodle-shadow effect
- Border remains 2px black
- Background can slightly lighten
- Slight scale (1.01)

Spacing:
- Gap between cards: 20px
- Padding inside: 24px (large cards), 16px (small cards)
```

**Tailwind Classes**:
```jsx
className="
  p-6
  border-2 border-black
  rounded-xl
  bg-white
  transition-all duration-200 ease-out
  hover:shadow-[4px_4px_2px_rgba(0,0,0,1),0px_6px_3px_rgba(0,0,0,0.3)]
  hover:scale-101
  cursor-pointer
"
```

---

### **Toggle / Switches**

```
Default State (Off):
- Border: 2px solid #000000
- Width: 48px
- Height: 28px
- Border radius: 14px
- Background: #FFFFFF
- Toggle dot: 24px circle, black, positioned left
- Transition: 200ms ease

Active State (On):
- Border: 2px solid #000000
- Background: #000000
- Toggle dot: white, positioned right
- Shadow: doodle shadow on hover

Hover:
- Add subtle doodle shadow
```

**Tailwind Classes**:
```jsx
className="
  relative inline-flex
  h-7 w-12
  items-center
  rounded-full
  border-2 border-black
  bg-white
  transition-all duration-200 ease-out
  cursor-pointer
  hover:shadow-[4px_4px_2px_rgba(0,0,0,0.2)]
  ${isActive ? 'bg-black' : 'bg-white'}
"
```

---

### **Badge / Tag**

```
Structure:
- Border: 2px solid #000000
- Border radius: 20px (fully rounded)
- Padding: 6px 12px
- Background: #FFFFFF (or light accent color)
- Font: 12px, 600 weight
- Text: #000000

Hover (optional):
- Light doodle shadow
- Scale: 1.05
```

**Tailwind Classes**:
```jsx
className="
  inline-block
  px-3 py-1
  border-2 border-black
  rounded-full
  text-xs font-bold
  bg-white
  text-black
  transition-all duration-200
  hover:shadow-[3px_3px_1px_rgba(0,0,0,0.5)]
"
```

---

### **Divider / Separator**

```
Style: Simple thin line
- Color: #000000
- Height: 1px (thin line)
- Width: 100% or specify
- Margin: 24px 0 (top and bottom spacing)
- No shadow effects
```

**Tailwind Classes**:
```jsx
className="my-6 border-t-2 border-black"
```

---

## 🎭 Doodle Illustration Integration

### **Placement Strategy**:
1. **Hero sections**: Large (150-300px) doodle illustrations
2. **Empty states**: Medium (120-180px) illustrations
3. **Accent elements**: Small (60-100px) in corners or margins
4. **Icon replacements**: Simple line-drawn icons instead of standard icons

### **Illustration Style Guide**:
- **Line weight**: 2-3px strokes
- **Color**: Black on white, or white on black (no grays for main illustration)
- **Details**: Minimal but expressive (simple eyes, curved lines)
- **Organic feel**: Slightly imperfect, hand-drawn appearance
- **No fill gradients**: Solid black fills only
- **Spacing**: Generous white space around illustrations

### **Where to Source**:
- Free Notion illustrations: Figma "Free Notion Illustrations"
- Humaaans: https://www.humaaans.com/ (customizable illustrations)
- Create custom SVG illustrations with organic line weight
- Hand-draw and scan for authentic look

---

## 🎬 Animation & Transitions

### **Hover Transitions**:
```
duration: 200ms
easing: ease-out
properties: shadow, scale, background-color
```

### **Focus Transitions**:
```
duration: 150ms
easing: ease-in-out
ring effect: 2px solid black with 2px offset
```

### **Active/Click Feedback**:
```
scale: 0.95 (compress effect)
duration: 100ms
easing: ease-in
```

### **Page Load**:
```
Stagger entrance animations:
- Cards/sections fade in with 50ms delay between each
- Headers slide down 16px
- Duration: 300-400ms
```

---

## 📐 Spacing System

Use consistent spacing scale:
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
4xl: 64px
```

**Component Padding**:
- Buttons: 14px (v) × 24px (h)
- Input fields: 12px (v) × 16px (h)
- Cards: 20-24px
- Page margins: 24px or 32px

---

## ✅ Implementation Checklist for Your App

- [ ] Add custom Tailwind config for doodle-shadow utilities
- [ ] Create reusable button component with doodle hover
- [ ] Create reusable input component with border styling
- [ ] Create card wrapper component with doodle shadow
- [ ] Update all form fields with 2px black borders
- [ ] Replace generic icons with doodle-style illustrations
- [ ] Add focus ring styling (2px black outline)
- [ ] Test all hover states across components
- [ ] Ensure consistent spacing throughout
- [ ] Update color palette to black/white/grays
- [ ] Add toggle switch component with doodle style
- [ ] Create badge/tag components
- [ ] Add smooth transitions (200ms ease-out)
- [ ] Test on mobile and tablet (React Native)

---

## 🛠️ Tailwind Config Addition

Add to your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      spacing: {
        '102': '1.02',
        '101': '1.01',
      },
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
      fontFamily: {
        'display': ['"DM Sans"', '"Playfair Display"', 'serif'],
        'body': ['"Inter"', '"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
}
```

---

## 📱 React Native Considerations

Since you're using React Native with Tailwind (NativeWind):

**Note**: Box-shadow syntax is different in React Native:

```jsx
// Use shadowColor, shadowOffset, shadowOpacity, shadowRadius instead
<View style={{
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 2,
  elevation: 8, // for Android
}}>
  {/* Component */}
</View>

// Or use Tailwind's supportable properties
className="border-2 border-black rounded-lg"
```

For the doodle shadow effect, you may need to use:
- Nested Views with shadows
- Or create a custom component that combines View styles

---

## 🎨 Final Notes

The key to this design system is **consistency**:
- Every interactive element has a 2-3px black border
- Every hover state gets the doodle shadow effect
- All spacing follows the scale
- Typography is clean and clear
- Illustrations add personality without overwhelming

This creates a cohesive, memorable aesthetic that feels both professional and playful.
