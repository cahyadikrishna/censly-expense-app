# NOTION-STYLE TAB NAVIGATION DESIGN SYSTEM
## Simple Bottom Tab Bar with Dot Indicator

---

## 🎨 Design Philosophy

**Aesthetic**: Clean, minimalist bottom tab navigation. Simple structure with SVG icons and labels. Active state shown with a black dot indicator below the text. Soft, elegant, Notion-inspired.

**Key Characteristics**:
- SVG icons (you already have them!)
- No borders or backgrounds
- Text label below icon
- Black dot indicator for active state
- Smooth transition between states
- Generous spacing and padding
- Soft gray for inactive, black for active

---

## 🎯 Core Design Elements

### 1. **Tab Bar Container**

```
Position: Bottom of screen
Background: #FFFFFF (white)
Height: 70-80px (including padding)
Border: 1px top border #E0E0E0 (optional, subtle divider)

Padding:
- Top: 12px
- Bottom: 16-20px (accounts for safe area on phones)
- Horizontal: 0px (full width)

Safe Area:
- Add bottom safe area padding for notched/rounded bottom phones
- iOS: Use SafeAreaView
- Android: Add bottom padding (e.g., 16px)

Spacing:
- Distribute tabs equally across width
- Equal flex space for each tab
```

**Tailwind Classes**:
```jsx
// Tab Bar Container
className="
  flex flex-row
  bg-white
  border-t border-gray-200
  pt-3 pb-5
  px-0
  justify-around
  items-end
"

// Safe area wrapper (for iPhone bottom padding)
className="pb-safe" // or custom padding
```

---

### 2. **Individual Tab Item**

```
Structure:
- Icon (24-32px)
- Gap: 6-8px
- Label: 12px text
- Dot indicator: 4-6px circle below label

Layout: Flex column, centered

Padding:
- No padding (spacing comes from container distribution)
- Vertical space: 8-12px total from icon to dot

Alignment:
- All items centered horizontally
- Icons centered
- Labels centered
- Dots centered
```

**Tailwind Classes**:
```jsx
// Tab Item Container
className="
  flex flex-col
  items-center
  gap-1
  flex-1
  py-2
"

// Tab Content (icon + label wrapper)
className="
  flex flex-col
  items-center
  gap-1
"
```

---

### 3. **Icon Styling**

```
Size: 24-28px (SVG viewBox should be 24x24 or 32x32)
Color: 
  - Inactive: #BDBDBD (light gray)
  - Active: #1A1A1A (black)
Stroke Width: 1.5-2px (for line icons)

SVG Format:
- Use stroke="currentColor" for easy color changes
- Set width and height on container
- Preserve aspect ratio

No Background:
- Just the icon, no circle/box background
- Clean and minimal
```

**Tailwind Classes**:
```jsx
// Icon Container
className="w-6 h-6"

// SVG styling
<svg
  className="w-full h-full"
  style={{ color: isActive ? '#1A1A1A' : '#BDBDBD' }}
  // ... svg content
/>
```

---

### 4. **Label Text**

```
Font Size: 12px (or 11px for tight space)
Font Weight: 400 (regular) - inactive, 500 (medium) - active
Color:
  - Inactive: #BDBDBD (light gray)
  - Active: #1A1A1A (black)
Line Height: 1.2

Transition:
- Color: 150ms ease
- Font weight: 150ms ease
```

**Tailwind Classes**:
```jsx
// Label Text
className="
  text-xs
  font-medium
  transition-colors duration-150
  ${isActive ? 'text-gray-900' : 'text-gray-400'}
"
```

---

### 5. **Active State Indicator (Black Dot)**

```
Style: Simple black dot
Size: 4-6px diameter (typically 4px)
Color: #1A1A1A (black)
Border Radius: 50% (circle)
Position: Below label, centered
Spacing: 4-6px gap between label and dot

Visibility:
- Hidden when inactive (opacity 0 or display none)
- Visible when active
- Smooth fade-in transition (100ms)

Animation:
- Fade in: opacity 0 -> 1
- Duration: 100-150ms
- Easing: ease
```

**Tailwind Classes**:
```jsx
// Dot Indicator
className="
  w-1 h-1
  bg-black
  rounded-full
  transition-opacity duration-150
  ${isActive ? 'opacity-100' : 'opacity-0'}
"
```

---

### 6. **Color Palette**

| Role | Color | Hex | Use Case |
|------|-------|-----|----------|
| Background | White | `#FFFFFF` | Tab bar background |
| Border | Light Gray | `#E0E0E0` | Top divider line |
| Icon - Inactive | Light Gray | `#BDBDBD` | Inactive tab icons |
| Icon - Active | Black | `#1A1A1A` | Active tab icon |
| Label - Inactive | Light Gray | `#BDBDBD` | Inactive tab label |
| Label - Active | Black | `#1A1A1A` | Active tab label |
| Indicator - Active | Black | `#1A1A1A` | Active indicator dot |

---

## 🧩 Component Specifications

### **Tab Navigation Component Structure**

```
Tab Bar
├── Tab Item 1 (Home)
│   ├── Icon (24x24)
│   ├── Label (12px)
│   └── Indicator Dot (4px, inactive)
├── Tab Item 2 (Pockets)
│   ├── Icon (24x24)
│   ├── Label (12px)
│   └── Indicator Dot (4px, active) ← Active
├── Tab Item 3 (Transactions)
│   ├── Icon (24x24)
│   ├── Label (12px)
│   └── Indicator Dot (4px, inactive)
└── Tab Item 4 (Cards)
    ├── Icon (24x24)
    ├── Label (12px)
    └── Indicator Dot (4px, inactive)
```

---

### **Complete Tab Item Specification**

```
Inactive State:
- Icon color: #BDBDBD (light gray)
- Label color: #BDBDBD (light gray)
- Label weight: 400 (regular)
- Dot opacity: 0 (hidden)
- No background
- No border

Active State:
- Icon color: #1A1A1A (black)
- Label color: #1A1A1A (black)
- Label weight: 500 (medium, slightly heavier)
- Dot opacity: 1 (visible)
- Dot size: 4px
- No background
- No border

Interaction:
- onPress: Update active tab, navigate
- Transition: All changes 150ms ease
- Feedback: Immediate visual response
```

---

### **Layout Dimensions**

```
Tab Bar Height: 70-80px total
  - Icon: 24-28px
  - Gap (icon to label): 6-8px
  - Label: 12px height
  - Gap (label to dot): 4-6px
  - Dot: 4-6px height
  - Padding: 12px top, 16-20px bottom

Spacing:
- Tabs distributed equally (flex 1 each)
- No fixed gaps (distribution handles spacing)
- Horizontal padding: 0px (edge to edge)

Safe Area:
- Bottom padding increased for notch/rounded phones
- Typically add 16-20px extra on iOS/Android with notch

Responsive:
- Mobile (< 600px): Full width distribution, no side padding
- Tablet (> 600px): Can add max-width, center on screen
```

---

## 🎬 Animation & Transitions

```
All State Changes:
- Duration: 150ms
- Easing: ease (smooth)
- Properties: color, opacity

Icon Color Change:
- 150ms ease
- Smooth gray -> black transition

Label Color + Weight Change:
- 150ms ease
- Color: gray -> black
- Weight: 400 -> 500

Dot Indicator Fade In:
- 100-150ms ease
- Opacity: 0 -> 1

Tab Press Animation:
- Optional: Slight scale or opacity change
- 100ms ease-in-out
- Scale: 1.0 -> 0.95 -> 1.0 (slight compress)
```

---

## 📐 Spacing Reference

```
Tab Bar:
- Top border: 1px
- Top padding: 12px
- Bottom padding: 16-20px (+ 20px safe area)
- Horizontal padding: 0px

Tab Item (per item):
- Flex: 1 (equal distribution)
- Vertical padding: 8px top/bottom

Internal Spacing:
- Icon to Label gap: 6-8px
- Label to Dot gap: 4-6px

Icon/Dot Sizes:
- Icon: 24px × 24px (or 28px)
- Dot: 4px × 4px (or 6px)
```

---

## 📋 Usage Patterns

### **Navigation Options**

```
Pattern 1: Stack Navigation
- Each tab shows different screens
- State preserved when switching tabs
- Use React Navigation BottomTabNavigator

Pattern 2: Conditional Rendering
- Single screen, different content shown per tab
- Simpler state management
- Good for small apps

Pattern 3: Nested Navigation
- Each tab has its own navigation stack
- Each tab can have multiple screens
- Most flexible, common in production apps
```

---

## ✅ Implementation Checklist

- [ ] Create TabBar component wrapper
- [ ] Create TabItem component (icon + label + dot)
- [ ] Accept SVG icons as props
- [ ] Implement active state tracking
- [ ] Style inactive state (light gray)
- [ ] Style active state (black)
- [ ] Add black dot indicator
- [ ] Implement smooth transitions (150ms)
- [ ] Add press animation (optional scale)
- [ ] Handle safe area (bottom padding)
- [ ] Test navigation between tabs
- [ ] Verify colors match spec
- [ ] Test on different screen sizes
- [ ] Test on iOS and Android
- [ ] Verify accessibility (tap targets)

---

## 🛠️ Tailwind Config

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          400: '#BDBDBD',
          900: '#1A1A1A',
        },
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
    },
  },
}
```

---

## 🎨 Visual Reference

```
INACTIVE TAB:
  ☁️       (gray icon, 24px)
  Label    (gray text, 12px)
           (no dot, opacity 0)


ACTIVE TAB:
  🏠       (black icon, 24px)
  Label    (black text, 12px, bold)
  •        (black dot, 4px, opacity 1)


FULL TAB BAR:
┌─────────────────────────────────────────┐
│  ☁️      🏠      ☁️      ☁️      ☁️      │
│ Home   Pockets  Trans  Cards   More    │
│         •                              │  ← Active indicator dot
└─────────────────────────────────────────┘
```

---

## 💡 Design Principles

1. **Simplicity**: No backgrounds, borders, or decorations
2. **Clarity**: Icon + text clearly identifies each tab
3. **Elegance**: Soft gray, black accent, subtle dot indicator
4. **Accessibility**: Large tap targets (at least 44x44pt)
5. **Feedback**: Clear visual feedback on state change
6. **Consistency**: Same styling across all tabs
7. **Minimal Animation**: Smooth but not distracting
8. **Safe Area**: Respects device notches/rounded corners

---

## 🔄 State Management

```javascript
// Example state structure
const [activeTab, setActiveTab] = useState('home');

const tabs = [
  { id: 'home', label: 'Beranda', icon: HomeIcon },
  { id: 'transactions', label: 'Transaksi', icon: TransactionIcon },
  { id: 'settings', label: 'Pengaturan', icon: SettingsIcon },
];

const handleTabPress = (tabId) => {
  setActiveTab(tabId);
  // Navigate or change content
};
```

---

## 🎯 Best Practices

**DO:**
- ✅ Use SVG icons (you already have them!)
- ✅ Smooth transitions (150ms)
- ✅ Clear active indicator (the black dot)
- ✅ Consistent spacing
- ✅ High contrast (gray and black)
- ✅ Include labels for clarity
- ✅ Respect safe areas

**DON'T:**
- ❌ Add borders or backgrounds
- ❌ Use multiple colors
- ❌ Make dot too large (4-6px max)
- ❌ Animate too much (keep it subtle)
- ❌ Overlap tabs
- ❌ Use icons alone (need labels)
- ❌ Change icon size on active

---

## 📱 Responsive Behavior

```
Mobile (< 600px):
- Full width distribution
- 4-5 tabs maximum
- Each tab gets ~25% width
- Touch-friendly size

Tablet (> 600px):
- Can center with max-width
- More padding on sides
- Icons can be slightly larger
- More space between tabs

Desktop:
- Usually not used
- Or can be positioned at bottom of sidebar
```

---

## 🔌 Integration with React Navigation

```javascript
// Bottom Tab Navigator setup
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

// Custom tab bar component
const CustomTabBar = (props) => {
  return <TabBarComponent {...props} />;
};

<Tab.Navigator
  tabBar={CustomTabBar}
  screenOptions={{
    headerShown: false,
  }}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Transactions" component={TransactionScreen} />
  {/* ... */}
</Tab.Navigator>
```

---

**This design system is optimized for:**
- ✅ Bottom tab navigation
- ✅ Mobile-first design
- ✅ Notion-inspired minimal aesthetic
- ✅ SVG icon usage
- ✅ Simple, clean appearance
- ✅ Clear active state indicator

Start with the component specs and you're ready to go! 🚀
