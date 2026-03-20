# Agent Guidelines for Censly

## Project Overview

Censly is a React Native (Expo) expense/income tracking mobile app using:
- **Framework**: Expo SDK 55 with expo-router (file-based routing)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State**: Zustand (global/auth), TanStack React Query (server state)
- **Backend**: Supabase (Postgres + Auth + Storage)
- **Animations**: React Native Reanimated

## Project Structure

```
app/                    # expo-router pages (file-based routing)
  (auth)/               # Auth group routes
  (tabs)/               # Tab group routes
  transaction/          # Transaction detail/add routes
  _layout.tsx           # Root layout
components/             # Reusable UI components
hooks/                  # Custom hooks (useTransactions, useCategories, etc.)
lib/                    # Utilities (supabase, currency)
stores/                 # Zustand stores (authStore)
types/                  # Shared TypeScript types/interfaces
supabase/               # DB schema and migrations
assets/                 # Images, fonts, icons
ios/, android/          # Native project dirs (generated)
```

## Build & Run Commands

```bash
# Install dependencies
npm install

# Start development
npm start              # Default (will prompt for platform)
npm run android        # Android only
npm run ios            # iOS only
npm run web            # Web only

# TypeScript check
npx tsc --noEmit       # Full type check
npx tsc --noEmit <file>  # Check single file

# Prebuild native projects (after adding native modules)
npx expo prebuild
```

No test runner or linter is currently configured. Before committing, manually verify TypeScript compiles cleanly with `npx tsc --noEmit`.

## Code Style Guidelines

### TypeScript
- Strict mode is enabled (`strict: true` in tsconfig.json).
- All functions must have explicit return types where inference is unclear.
- Prefer `type` over `interface` for object shapes unless you need declaration merging.
- Use `Pick<>` and `Partial<>` for mutation input types.
- Use path aliases: `@components/*`, `@lib/*`, `@stores/*`, `@hooks/*`, `@types/*`.

### Imports
- **Absolute path aliases** (`@lib/*`, `@hooks/*`) for project modules.
- **Relative imports** for sibling/collocated files.
- **Named imports** preferred over default imports where possible.
- Group imports: 1) React, 2) third-party, 3) absolute path aliases, 4) relative imports. Separate groups with blank lines.

### Naming Conventions
- **Files**: PascalCase for components (`TransactionItem.tsx`), camelCase for hooks/utils (`useTransactions.ts`, `currency.ts`).
- **Types/interfaces**: PascalCase, suffixed with type kind when ambiguous (`CategoryDefault`, `Category`, `CategoryItem`).
- **Query keys objects**: camelCase, grouped (`transactionKeys`, `categoryKeys`).
- **React components**: PascalCase, default export.
- **Custom hooks**: camelCase, prefixed with `use`, named export.
- **Zustand stores**: camelCase, prefixed with `use`, named export (`useAuthStore`).

### Components
- Use `React.memo()` for list item components to prevent unnecessary re-renders.
- Props interfaces should be defined above the component (not inline).
- Use NativeWind `className` (not `style`) for styling where possible. Use `style` only for dynamic values.
- Use `TouchableOpacity` with `activeOpacity={0.7}` for tappable elements.
- Always wrap screens in `SafeAreaView` from `react-native-safe-area-context`.
- Use `useCallback` for event handlers passed as props to list items.
- Use `useMemo` for expensive derived data computations.

### React Query Patterns
- Define a `queryKeys` object (or object-of-objects) at the top of the hooks file.
- Always include `enabled` prop on queries that depend on a value (e.g., `enabled: !!id`).
- Mutations should handle both `onSuccess` and `onError` with `console.error` logging.
- Invalidate related query keys in `onSuccess` (e.g., `queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })`).
- Prefer `useMutation` with `mutationFn` over inline functions.

### Error Handling
- Always log errors with context prefix matching the hook/file: `[useTransactions] fetchTransactions error:`, `[useCategories] createCategory error:`.
- Use `console.error` for errors, `console.log` for success results.
- Wrap async operations in try-catch or rely on React Query's error handling.
- Never swallow errors silently.

### Styling with NativeWind
Custom colors defined in `tailwind.config.js`:
- `background`: #FFFFFF
- `surface`: #F5F5F5
- `accent-green`: #22C55E
- `accent-red`: #EF4444

Use these instead of hardcoding hex values. Tailwind classes for text: `text-gray-900`, `text-gray-500`, `text-gray-400`, `text-white`.

### State Management
- **Server state**: TanStack React Query hooks.
- **Auth state**: Zustand store (`stores/authStore.ts`).
- **UI state**: `useState`/`useReducer` within components.
- Do not use Zustand for server-fetched data.

### Supabase Patterns
- Soft delete pattern: set `is_deleted: true` instead of removing rows.
- Two category tables: `categories_default` (system-wide) and `categories_custom` (user-specific).
- Always attach category data to transactions via a lookup map.
- Auth helpers return `{ data: { user } }` or `{ data: { session } }`.

### Database Conventions
- Always filter custom tables with `.eq("is_deleted", false)`.
- Sort categories by `sort_order` ascending.
- Sort transactions by `date` descending, then `created_at` descending.
- Use `CategorySource = "default" | "custom"` to track category origin.

### File Conventions
- Page routes (`app/*.tsx`): default export.
- Component routes: named export where shared, default export for single-use.
- All hooks and utility functions: named exports.
- Type definitions: centralized in `types/index.ts`, imported via path alias.
