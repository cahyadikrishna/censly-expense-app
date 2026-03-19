# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Censly is a personal finance/expense tracker mobile app built with React Native (Expo SDK 55) targeting iOS, Android, and web. Currency is Indonesian Rupiah (IDR).

## Commands

- `npx expo start` — start the dev server
- `npx expo start --ios` / `--android` / `--web` — start for a specific platform
- `npx tsc --noEmit` — type-check the project

No test framework is configured yet.

## Architecture

**Routing:** Expo Router (file-based). Two route groups:
- `app/(auth)/` — authentication screens (Google Sign-In via `@react-native-google-signin/google-signin`)
- `app/(tabs)/` — main app tabs (Home, Transactions, Settings)
- `app/_layout.tsx` — root layout: sets up auth listener, React Query provider, gesture handler. Currently has a **dev bypass** that skips auth and always redirects to tabs.

**State management:** Zustand stores in `stores/`. `authStore` holds user/session and wraps Supabase auth.

**Backend:** Supabase (`lib/supabase.ts`). Client configured with AsyncStorage for session persistence. Requires env vars `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY`.

**Data fetching:** TanStack React Query (QueryClient created in root layout).

**Styling:** NativeWind v4 (Tailwind CSS for React Native) via `global.css`. Custom theme colors defined in `tailwind.config.js`: `background`, `surface`, `accent-green`, `accent-red`. Dark mode only (`userInterfaceStyle: "dark"`).

**Path aliases** (configured in `tsconfig.json`): `@/*`, `@components/*`, `@lib/*`, `@stores/*`, `@hooks/*`, `@types/*`.

**Types:** Domain types in `types/index.ts` — `Transaction`, `Category`, `Profile`, `MonthlySummary`.

**Currency utilities:** `lib/currency.ts` — `formatIDR()` with compact notation (rb/jt/M suffixes), `parseIDR()`, `formatIDRInput()` for input masking.

## Key Config

- Babel: `babel-preset-expo` with NativeWind JSX import source + `react-native-reanimated/plugin` (must be last)
- Metro: wrapped with `withNativeWind`
- Google Sign-In also requires `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` env var
