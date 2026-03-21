# NOTION-STYLE DESIGN SYSTEM (CARD LIST VARIANT)
## Soft, Elegant Card Layout for Item Lists

---

## 🎨 Design Philosophy

**Aesthetic**: Clean, minimal card-based list inspired by Notion's aesthetic. Each item is a distinct card with soft borders, gentle shadows, and elegant typography. Perfect for displaying menu items, products, tasks, or any list of items.

**Key Characteristics**:
- Soft rounded card containers (2px borders)
- Icon/image on the left side
- Title + subtitle on the left
- Primary action (price/status) on the right
- Subtle hover effects (shadow + background change)
- Generous whitespace and padding
- Soft color palette with accent colors for values

---

## 🎯 Core Design Elements

### 1. **Card Container**

```
Structure:
- Border: 2px solid #E0E0E0 (light gray)
- Border radius: 12-16px (soft, rounded corners)
- Padding: 16-20px (generous)
- Background: #FFFFFF (white)
- Min height: 80-100px (spacious)
- Flex layout: Icon | Content | Action

Shadow:
- Default: None or very subtle 0px 2px 4px rgba(0,0,0,0.03)
- Hover: 0px 4px 12px rgba(0,0,0,0.08)

Hover State:
- Background: #FAFAFA or #F9F9F9
- Border: 2px solid #D0D0D0
- Shadow: 0px 4px 12px rgba(0,0,0,0.08)
- Transition: 150ms ease

Spacing:
- Gap between cards: 12-16px
- Card padding: 16-20px (H/V)
- Inner gaps: 12px (between icon and content), 16px (content to action)
```

### 2. **Icon Section**

```
Size: 48-56px (square or circle)
Border: 2px solid #D0D0D0 (soft gray border around icon)
Border radius: 12px (slightly rounded square) or 50% (circle)
Background: #F5F5F5 (light gray background)
Padding: 8-12px (inside border)

Content:
- Icon/illustration: 32-40px
- Color: #1A1A1A (dark gray/black) or colored (if category-based)
- Style: Simple, minimal, clean

Icon Examples:
- Makan (food): Fork & plate icon
- Tagihan (bill): Receipt icon
- Es krim: Ice cream icon
```

### 3. **Content Section (Title + Subtitle)**

```
Layout: Vertical stack

Title:
- Font size: 16px
- Font weight: 600 (semibold)
- Color: #1A1A1A (dark gray/black)
- Line height: 1.4
- Margin bottom: 4px

Subtitle/Description:
- Font size: 13px
- Font weight: 400 (regular)
- Color: #757575 (medium gray)
- Line height: 1.4
- Optional: Can show category, location, or description

Examples:
  Title: "Makan"
  Subtitle: "TOKO KOPI TUKU HARAPAN INDAH"
  
  Title: "Tagihan"
  Subtitle: (empty or description)
```

### 4. **Action Section (Price/Value)**

```
Position: Right side of card
Alignment: Vertical center

Price/Value:
- Font size: 16-18px
- Font weight: 600 (bold)
- Color: #E63946 or #D32F2F (red for expenses/prices)
  OR #2E7D32 (green for income/savings)
  OR #1565C0 (blue for neutral)

Format Examples:
- "-Rp 159.000" (expense, negative)
- "+Rp 50.000" (income, positive)
- "Rp 10.000" (neutral)
- "In Progress" (status)

Optional Suffix:
- Currency: "Rp"
- Status: "Pending"
- Category: "Food"

Text Alignment: Right-aligned
Min width: 100-120px (for alignment)
```

### 5. **Color Palette**

| Role | Color | Hex | Use Case |
|------|-------|-----|----------|
| Text - Primary | Dark Gray | `#1A1A1A` | Card titles |
| Text - Secondary | Medium Gray | `#757575` | Subtitles, descriptions |
| Text - Tertiary | Light Gray | `#BDBDBD` | Disabled, hints |
| Background - Card | White | `#FFFFFF` | Card background |
| Background - Hover | Light Gray | `#F9F9F9` | Hover state |
| Background - Icon | Light Gray | `#F5F5F5` | Icon background |
| Border - Card | Light Gray | `#E0E0E0` | Card border |
| Border - Icon | Gray | `#D0D0D0` | Icon border |
| Accent - Price (Expense) | Red | `#E63946` or `#D32F2F` | Negative values, prices |
| Accent - Price (Income) | Green | `#2E7D32` | Positive values |
| Accent - Neutral | Blue | `#1565C0` | Neutral values, status |
| Status - Food | Orange | `#F57C00` | Food category (optional) |
| Status - Bills | Blue | `#1565C0` | Bills category (optional) |
| Status - Savings | Green | `#2E7D32` | Savings category (optional) |

---

## 🧩 Component Specifications

### **Card List Item Component**

```
Structure:
┌─────────────────────────────────────────────────────┐
│  [Icon]  Title              Action/Price            │
│  Border  Subtitle/Desc.     Rp 159.000             │
└─────────────────────────────────────────────────────┘

Layout:
- Container: Flex row, items-center, gap-4
- Icon section: Flex shrink 0 (fixed width)
- Content section: Flex 1 (grows)
- Action section: Flex shrink 0 (fixed width, right-aligned)

Padding:
- Container: 16px 20px (or 20px in all directions)
- Icon: 8px inside border
- Content: No padding (gap handles spacing)
- Action: No padding

Heights:
- Minimum: 80px
- Flexible based on content
```

**Tailwind Classes**:
```jsx
// Card Container
className="
  flex flex-row items-center gap-4
  px-5 py-4
  bg-white
  border-2 border-gray-300
  rounded-2xl
  transition-all duration-150
  hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
  active:bg-gray-100
"

// Icon Section
className="
  w-14 h-14
  flex-shrink-0
  flex items-center justify-center
  bg-gray-100
  border-2 border-gray-300
  rounded-xl
"

// Content Section
className="flex-1 gap-1"

// Title
className="text-base font-semibold text-gray-900"

// Subtitle
className="text-sm font-normal text-gray-600"

// Action Section
className="flex-shrink-0 text-right"

// Price/Action Text
className="text-lg font-semibold text-red-600"
```

---

### **Card List Container**

```
Structure:
- Padding: 20-24px (page padding)
- Gap between cards: 12-16px (use gap-3 or gap-4)
- Max width: 100% (full width or constrained on desktop)

Responsive:
- Mobile: 16px padding, 12px gap
- Tablet: 24px padding, 16px gap
- Desktop: 32px padding, 16px gap
```

**Tailwind Classes**:
```jsx
className="
  flex flex-col gap-3
  p-6
  bg-white
  w-full
"
```

---

### **Icon Design**

```
Container:
- Size: 56px × 56px (56x56 box)
- Border: 2px #D0D0D0
- Border radius: 12px (slightly rounded square)
- Background: #F5F5F5
- Flex center alignment

Icon/Emoji/Illustration:
- Size: 32-40px (inside the box)
- Color: Depends on category
- Type: Emoji, SVG icon, or illustration

Icon Style Examples:
- Simple line icons
- Emoji (🍽️ 🧾 🍦)
- Colored illustrations
- Minimal doodles

Accessibility:
- Make sure color is not the only differentiator
- Use icon + shape combination for categories
```

---

### **Interactive States**

```
Default State:
- Border: 2px #E0E0E0
- Background: #FFFFFF
- Shadow: None or very subtle
- Cursor: pointer

Hover State:
- Border: 2px #D0D0D0 (slightly darker)
- Background: #F9F9F9 (light gray)
- Shadow: 0px 4px 12px rgba(0,0,0,0.08)
- Scale: 1.00 (no scale effect for elegance)
- Transition: 150ms ease

Active/Pressed State:
- Background: #F5F5F5 (slightly darker)
- Border: 2px #D0D0D0
- Shadow: 0px 2px 8px rgba(0,0,0,0.06)
- Transition: 100ms ease

Focus State (for keyboard):
- Outline: 2px solid #1A1A1A
- Outline offset: 2px
- Or: Ring effect with rgba(0,0,0,0.1)

Disabled State:
- Opacity: 0.6
- Background: #F5F5F5
- Border: 2px #E8E8E8
- Cursor: not-allowed
- No hover effect
```

---

## 📐 Spacing System

```
xs: 4px    md: 12px   xl: 24px    3xl: 48px
sm: 8px    lg: 16px   2xl: 32px   4xl: 64px
```

### **Component Spacing**:
- Card padding: 16-20px
- Icon size: 56px (can be 48-64px)
- Gap between cards: 12-16px
- Gap between sections in card: 12-16px
- Page margin: 20-24px
- Icon border width: 2px
- Card border width: 2px

---

## 🎬 Animation & Transitions

```
All Interactive Elements:
- Duration: 150ms
- Easing: ease (smooth, natural)
- Properties: background-color, border-color, shadow, transform

Hover Animation:
- Duration: 150ms
- Effect: Background change + border adjustment + shadow

Active Animation:
- Duration: 100ms
- Effect: Slight background change
- No scale effect (maintain elegance)

Page Load:
- No animation needed
- Or subtle fade-in if desired
```

---

## 📋 Usage Patterns

### **Expense/Price List**
```
Title: Item name
Subtitle: Vendor/Location
Action: Price in red (-Rp xxx.xxx)
Icon: Category icon
```

### **Task/Todo List**
```
Title: Task name
Subtitle: Due date or status
Action: Status badge or date
Icon: Priority or category icon
```

### **Menu/Product List**
```
Title: Product name
Subtitle: Description or category
Action: Price or availability
Icon: Product image or category icon
```

### **Transaction List**
```
Title: Transaction type
Subtitle: Details or time
Action: Amount (positive/negative)
Icon: Category icon
```

---

## ✅ Implementation Checklist

- [ ] Create CardListItem component with icon, content, action layout
- [ ] Add 2px border styling (#E0E0E0)
- [ ] Implement hover effect (background + border + shadow)
- [ ] Create Icon wrapper (56px box with 2px border, #F5F5F5 background)
- [ ] Set up title (16px, 600 weight, #1A1A1A)
- [ ] Set up subtitle (13px, 400 weight, #757575)
- [ ] Set up action text (16-18px, 600 weight, color-based)
- [ ] Update color palette for prices (red for expense, green for income)
- [ ] Add smooth transitions (150ms ease)
- [ ] Update page padding and card gaps
- [ ] Test on mobile, tablet, desktop
- [ ] Test with various content lengths
- [ ] Add doodle illustrations to icons (optional)

---

## 🛠️ Tailwind Config Addition

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#999999',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#1A1A1A',
        },
        red: {
          600: '#E63946',
          700: '#D32F2F',
        },
        green: {
          700: '#2E7D32',
        },
        blue: {
          600: '#1565C0',
        },
      },
      boxShadow: {
        'soft': '0px 2px 4px rgba(0, 0, 0, 0.05)',
        'soft-md': '0px 4px 12px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0px 8px 16px rgba(0, 0, 0, 0.10)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
}
```

---

## 🎯 Visual Hierarchy

```
Largest/Most Prominent:
  - Action value (price) - Bold, colored, right side

Large/Important:
  - Card title - Bold, dark gray

Medium:
  - Card icon - Visual identifier

Small/Secondary:
  - Subtitle/description - Regular, medium gray

Spacing creates the hierarchy as much as size.
```

---

## 💡 Design Principles for Card Lists

1. **Scannability**: Quick glance should show title and action
2. **Icon Communication**: Icon + border/color shows category at a glance
3. **Clear Action**: Right-aligned action/price is immediately visible
4. **Elegant Simplicity**: Soft borders, subtle shadows, no clutter
5. **Readable**: High contrast on text, generous padding
6. **Consistent**: All cards follow same layout
7. **Responsive**: Works at any screen size
8. **Interactivity**: Smooth hover states provide feedback

---

## 📸 Layout Breakdown

```
┌──────────────────────────────────────────────────────────┐
│                        Card List                         │
├──────────────────────────────────────────────────────────┤
│  [Icon]  Title                              -Rp 159.000 │  ← Card 1
│  Border  TOKO KOPI TUKU HARAPAN INDAH                   │
├──────────────────────────────────────────────────────────┤
│  [Icon]  Title                               -Rp 88.000 │  ← Card 2
│  Border  COURTSIDE BREW                                 │
├──────────────────────────────────────────────────────────┤
│  [Icon]  Title                              -Rp 350.000 │  ← Card 3
│  Border  (no subtitle)                                  │
├──────────────────────────────────────────────────────────┤
│  [Icon]  Title                               -Rp 10.000 │  ← Card 4
│  Border  es krim                                        │
├──────────────────────────────────────────────────────────┤
│  [Icon]  Title                               -Rp 43.638 │  ← Card 5
│  Border  MIE GACOAN                                     │
└──────────────────────────────────────────────────────────┘

Key Features:
✓ Soft 2px borders
✓ Light icon border (#D0D0D0)
✓ Icon background (#F5F5F5)
✓ Red price color (#E63946)
✓ 12-16px gap between cards
✓ Spacious padding (16-20px)
✓ Hover effect (shadow + bg change)
✓ Clean, minimalist appearance
```

---

## 🎨 Color Usage Examples

**For Your Example (Expense Tracking)**:
- Icon border: #D0D0D0 (gray)
- Icon background: #F5F5F5 (light gray)
- Title text: #1A1A1A (black)
- Subtitle text: #757575 (medium gray)
- Price text: #E63946 (red) for expenses
- Card border: #E0E0E0 (light gray)
- Card background: #FFFFFF (white)
- Hover background: #F9F9F9 (very light gray)

---

## 🔄 Future Enhancements

Optional additions:
- Category badges (small tags showing category)
- Expandable cards (tap to see more details)
- Checkboxes (for todo lists)
- Drag-to-reorder functionality
- Filter/sort buttons
- Search functionality
- Empty state illustrations
- Loading skeleton states

---

**This design system is optimized for:**
- ✅ Expense/transaction tracking
- ✅ Product/menu listings
- ✅ Task/todo management
- ✅ Item recommendations
- ✅ Feed-style displays
- ✅ Any card-based list

Start with the card layout specs and you're ready to go! 🚀
