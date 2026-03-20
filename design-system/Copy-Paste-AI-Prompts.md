# COPY-PASTE PROMPTS FOR YOUR AI AGENT

## 📋 Use These Prompts Directly - Just Paste Your Code

---

## PROMPT SET #1: SETUP & TAILWIND CONFIG

```
I'm revamping my React Native app to use a Notion-style design system.

I've created a complete design system with these specifications:
- Bold 2-3px black borders on all interactive elements
- Doodle shadow effect on hover states
- Black and white color palette
- React Native + NativeWind (Tailwind CSS)

Here's the design system documentation: QuickReference-DesignGuide.md

TASK: Update my tailwind.config.js to support the design system.

Please:
1. Add custom shadow utilities for doodle effects
2. Add scale utilities (102, 101, 95)
3. Add borderWidth-3 for buttons
4. Add any other utilities needed

Please provide the complete updated tailwind.config.js file.
```

---

## PROMPT SET #2: BUTTON COMPONENT

```
I'm updating my React Native app to a Notion-style design system.

Design system reference: NotionStyle-Components.jsx section about Button component

Please revamp this button to match the design system:

REQUIREMENTS:
- 3px black border for all variants
- Primary variant: black background, white text
- Secondary variant: white background, black text
- Outline variant: white background, 3px black border, black text
- Padding: 14px vertical × 24px horizontal
- Font: Bold (700 weight), 16px
- Hover: Add doodle shadow + scale 1.02
- Active: Scale 0.95
- Disabled: opacity-50, no hover effect
- Transition: 200ms ease-out
- Works with React Native + NativeWind

Please provide:
1. The complete updated Button component
2. All 3 variants (primary, secondary, outline)
3. Comments explaining the design system approach

Make sure it's compatible with React Native.
```

---

## PROMPT SET #3: INPUT COMPONENT

```
I'm updating my React Native app to a Notion-style design system.

Design system reference: NotionStyle-Components.jsx section about InputField component

Please revamp this input to match the design system:

REQUIREMENTS:
- 2px black border
- 8px border-radius
- Padding: 12px vertical × 16px horizontal
- Placeholder text: #999999 color
- Focus state: 2px black outline ring, 2px offset
- Hover state: doodle shadow effect + background #F9F9F9
- Support variants:
  * Default
  * Error (red border #FF6B6B)
  * Success (green border #4CAF50)
  * Disabled (opacity 50%)
- Transition: 200ms ease-out
- React Native + NativeWind compatible

Please provide:
1. Complete updated InputField component
2. Support for all variants
3. Works with multiline (for textarea)
4. Comments on implementation

Make sure it works in React Native and existing elements setup.
```

---

## PROMPT SET #4: CARD COMPONENT

```
I'm updating my React Native app to a Notion-style design system.

Design system reference: NotionStyle-Components.jsx section about Card component

Please revamp this card to match the design system:

REQUIREMENTS:
- 2px black border
- 12px border-radius
- Padding: 20-24px
- Background: white (#FFFFFF)
- Support variants:
  * Default (no shadow)
  * Elevated (always has doodle shadow)
  * Interactive (shadow only on hover)
- Hover state: doodle shadow + scale 1.01
- Can be pressable/clickable (TouchableOpacity)
- Transition: 200ms ease-out
- React Native + NativeWind compatible

Please provide:
1. Complete updated Card component
2. All 3 variants
3. Comments on design system integration

Make sure it works in React Native and existing elements setup.
```

---

## PROMPT SET #5: TOGGLE/SWITCH COMPONENT

```
I'm updating my React Native app to a Notion-style design system.

Design system reference: NotionStyle-Components.jsx section about Toggle component

Please revamp this toggle to match the design system:

REQUIREMENTS:
- Width: 48px, Height: 28px
- 2px black border
- 14px border-radius (full round)
- Off state: white background, black dot on left
- On state: black background, white dot on right
- Dot size: 20-24px
- Transition: 200ms ease smooth slide
- Hover state: Add subtle doodle shadow (doodle-sm)
- Disabled state: opacity-50
- React Native + NativeWind compatible

Please provide:
1. Complete updated Toggle component
2. Animated dot transition
3. Proper Animated API usage for React Native
4. Comments on implementation

Make sure it works in React Native and existing elements setup.
```

---

## PROMPT SET #6: BADGE COMPONENT

```
I'm updating my React Native app to a Notion-style design system.

Design system reference: NotionStyle-Components.jsx section about Badge component

Please revamp this badge to match the design system:

REQUIREMENTS:
- 2px black border (or variant color borders)
- 20px border-radius (fully rounded)
- Padding: 6px vertical × 12px horizontal
- Font: 12px, bold (600 weight)
- Default: white background, black border, black text
- Variants:
  * success: light green background, green border, green text
  * error: light red background, red border, red text
  * warning: light yellow background, yellow border, yellow text
- Hover: Add doodle-sm shadow + scale 1.05
- Can display icon + label
- React Native + NativeWind compatible

Please provide:
1. Complete updated Badge component
2. All variants
3. Support for icon + label
4. Comments on implementation

Make sure it works in React Native and existing elements setup.
```

---

## PROMPT SET #7: FULL SCREEN/PAGE REVAMP

```
I'm updating my React Native app to a Notion-style design system.

Here's my complete design system NotionStyle-DesignSystem.md

Here's my quick reference: QuickReference-DesignGuide.md

Here's my component implementation reference: NotionStyle-Components.jsx

Now, please revamp this entire screen/page to match the design system: "/app/*"

Reusable components ready to use at "components/ui/*"

REQUIREMENTS:
1. Replace all buttons with the updated Button component design:
   - 3px black borders
   - Proper hover states with doodle shadows
   - Scale effects (1.02 on hover, 0.95 on active)

2. Replace all inputs with updated Input design:
   - 2px black borders
   - Proper focus rings
   - Hover background changes

3. Wrap all cards with updated Card design:
   - 2px black borders
   - Hover shadow effects
   - Scale 1.01

4. Update typography:
   - Headers: Bold (700 weight), proper sizes (H1/H2/H3)
   - Body: Regular (400-500), 16px
   - Labels: Small (12px), bold (600)

5. Fix spacing:
   - Use 8px scale (8, 16, 24, 32, 48, 64)
   - Section gaps: 20-32px
   - Component padding: consistent

6. Add/update all interactive elements:
   - All hover states have doodle shadow
   - All focus states have 2px black ring
   - All transitions are 200ms ease-out

7. Color palette:
   - Text: Black (#000000) or Dark Gray (#666666)
   - Borders: Black (#000000)
   - Backgrounds: White (#FFFFFF) or Off-white (#F9F9F9)
   - No other colors (except optional accents)

8. Keep ALL functionality exactly the same
   - Only update styling/appearance
   - No logic changes
   - Same props/state management

Please provide:
1. Complete updated screen code
2. Comments where design system changes were made
3. Explanation of any new styling patterns used

Reference the design system files and example components provided.
```

---

## PROMPT SET #8: ICON REPLACEMENT (Doodle Illustrations)

```
I'm updating my React Native app to a Notion-style design system.

Design system reference for illustrations:
[PASTE CONTENTS OF: NotionStyle-DesignSystem.md section about "Doodle Illustration Integration"]

My current screen/component:
[PASTE YOUR CODE THAT HAS GENERIC ICONS]

Please:
1. Identify all generic/standard icons in this code
2. Replace them with doodle-style illustrations

DOODLE STYLE REQUIREMENTS:
- Line weight: 2-3px strokes
- Color: Black on white (or white on black)
- Style: Hand-drawn, sketchy, organic feel
- Details: Minimal but expressive
- Size ranges:
  * Hero illustrations: 150-300px
  * Section illustrations: 80-120px
  * Icon replacements: 24-32px

For React Native, you can:
- Use SVG components with doodle-style paths
- Reference free Notion illustrations from Figma
- Or create simple SVG doodles

Please provide:
1. Updated code with doodle illustrations
2. New SVG components if needed
3. Suggestions for where to place illustrations
4. Links to resources for more doodles (Humaaans, Figma collections, etc.)

Keep the same structure and functionality.
```

---

## PROMPT SET #9: FORM EXAMPLE (Full Integration Demo)

```
I want to see a complete example of how a form should look with the Notion-style design system.

Here's my design system:
[PASTE CONTENTS OF: NotionStyle-DesignSystem.md]

Please create a complete example form/modal component that demonstrates:

1. Form title (H2 header, bold)
2. Text input field with label
3. Text area / multiline input
4. Select dropdown (if applicable)
5. Toggle/switch with label
6. Badge tags display
7. Error/success states on input
8. Submit + Cancel buttons
9. Proper spacing and alignment
10. Hover states on all interactive elements
11. Focus states with rings
12. Transitions

REQUIREMENTS:
- Use the design system specifications exactly
- React Native + NativeWind compatible
- All interactive elements have proper hover/focus states
- Spacing follows the 8px scale
- Colors are black/white/gray only
- Typography is properly styled
- Transitions are 200ms ease-out

Please provide:
1. Complete example form component
2. Comments explaining each design decision
3. References to which design system specs were used
4. Could be used as a reference for updating other forms

This will help me understand how to apply the system correctly.
```

---

## PROMPT SET #10: DESIGN SYSTEM AUDIT

```
I'm implementing a Notion-style design system in my React Native app.

Here's my complete design system spec:
[PASTE CONTENTS OF: NotionStyle-DesignSystem.md]

Here's my current app code:
[PASTE YOUR App.jsx or main entry point]
[PASTE YOUR navigation structure]
[PASTE 2-3 of your main screen files]

Please audit my current implementation and:

1. REVIEW: Check what's already done correctly
2. IDENTIFY: List what needs to be changed
3. PRIORITIZE: What to fix first (highest impact)
4. RECOMMEND: Specific changes for each component
5. CREATE: A step-by-step fix plan

Checklist to verify against:
- [ ] All buttons have 3px black borders
- [ ] All inputs have 2px black borders
- [ ] All cards have 2px black borders
- [ ] Hover states have doodle shadows
- [ ] Color palette is black/white/gray only
- [ ] Spacing uses 8px scale
- [ ] Typography is properly styled
- [ ] Transitions are 200ms ease-out
- [ ] Focus rings are 2px black
- [ ] No generic Tailwind defaults
- [ ] Consistent across all components

Please provide:
1. Audit summary (what's done, what's not)
2. Priority list of changes needed
3. Step-by-step implementation plan
4. Code snippets for high-priority items
5. Estimated effort for each category

This will help me understand where to focus first.
```

---

## 🎯 USAGE INSTRUCTIONS

### For Each Prompt:

1. **Copy the entire prompt** (between the triple backticks)
2. **Paste into your AI agent** (Claude, ChatGPT, etc.)
3. **Replace [PASTE YOUR CODE HERE]** with your actual code
4. **Replace [PASTE CONTENTS OF: filename]** with the actual file contents
5. **Send and wait for response**
6. **Review the output** using the checklist in the guide
7. **Test on actual device/emulator**

### Best Practice Workflow:

```
1. Start with PROMPT #1 (Setup)
   → Get tailwind.config.js updated

2. Then PROMPT #2 (Button)
   → Get Button component updated
   → Test it works

3. Then PROMPT #3 (Input)
   → Get Input component updated
   → Test it works

4. Then PROMPT #4 (Card)
   → Get Card component updated
   → Test it works

5. Then PROMPT #7 (Full Screen)
   → Update one screen at a time
   → Test each thoroughly

6. Then PROMPT #8 (Icons/Illustrations)
   → Add doodle elements
   → Fine-tune placement

7. Finally PROMPT #10 (Audit)
   → Make sure everything is consistent
   → Catch any missed styling
```

---

## ✅ VERIFICATION CHECKLIST

After AI agent provides code, check:

```
BORDERS
- [ ] Buttons: 3px solid black
- [ ] Inputs: 2px solid black
- [ ] Cards: 2px solid black
- [ ] Correct border-radius (8-12px)

SHADOWS
- [ ] No default shadows
- [ ] Hover states have doodle shadow
- [ ] Shadow is: 4px 4px 2px black, 6px down 30% opacity
- [ ] Works on React Native (using elevation/shadowColor)

COLORS
- [ ] Text: Black or dark gray only
- [ ] Borders: Black only
- [ ] Backgrounds: White or light gray
- [ ] No gradients or other colors

INTERACTIONS
- [ ] Hover: doodle shadow + scale effect
- [ ] Active: scale 0.95
- [ ] Disabled: opacity-50
- [ ] Focus: 2px black ring

TYPOGRAPHY
- [ ] Headers are bold (700)
- [ ] Body is regular (400-500)
- [ ] Sizes follow hierarchy
- [ ] Letter-spacing correct for headers

SPACING
- [ ] Uses 8px scale (8, 16, 24, 32...)
- [ ] Consistent padding in similar components
- [ ] Gaps between sections: 20-32px
- [ ] No random spacing values

TRANSITIONS
- [ ] Duration: 200ms
- [ ] Easing: ease-out
- [ ] Applied to: shadow, scale, colors
```

---

## 🚀 READY TO GO!

Start with **PROMPT #1** → Test → Then move to other prompts.

Good luck revamping your UI! 🎉
