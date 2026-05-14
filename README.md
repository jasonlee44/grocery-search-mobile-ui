# GrocerySearch

A mobile-first grocery search and deals UI built as part of the Prox Mobile App Development & Front-End Engineering Internship Assessment (Track C).

**[Live Demo →](https://grocery-search-mobile-ui.vercel.app)**

---

## Setup

```bash
git clone https://github.com/jasonlee44/grocery-search-mobile-ui.git
cd grocery-search-mobile-ui
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Requirements:** Node 18+ and npm 9+.

### Viewing in mobile emulation

This app is designed for mobile viewports. To preview it as intended:

**Chrome (recommended)**
1. Open DevTools with `Cmd+Option+I` (Mac) or `F12` (Windows)
2. Click the **Toggle Device Toolbar** icon in the top-left of DevTools, or press `Cmd+Shift+M` / `Ctrl+Shift+M`
3. Select **iPhone 14 Pro** (or any mobile preset) from the device dropdown
4. Reload the page

**Firefox**
1. Open DevTools with `Cmd+Option+I` / `F12`
2. Click the **Responsive Design Mode** icon, or press `Cmd+Option+M` / `Ctrl+Shift+M`
3. Select a mobile preset or set the width to 390px

**Safari**
1. Enable the Develop menu: Safari → Settings → Advanced → check "Show features for web developers"
2. Open DevTools with `Cmd+Option+I`
3. Click **Responsive Design Mode** or press `Ctrl+Cmd+R`
4. Select an iPhone preset from the device dropdown

---

## Features

- Debounced search input (300ms) across product name, category, and retailer
- Filter by store and category with togglable chips
- Filters work independently of the search query (browse by category with no search term)
- Product cards showing name, retailer, price, size, and image
- Loading skeleton, empty state, and error state with retry
- Recent searches persisted to `localStorage`, capped at 8, cleared on demand
- Scroll fade on filter/recent chip rows to signal overflow
- Mock analytics event tracking for 5 key user actions

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Context + `useReducer` (no external state library)
- No backend. Mock data with simulated 600–900ms async delay and ~10% error rate

---

## Write-up

### UX Decisions

The header is sticky so you can adjust the search or swap filters without scrolling back up. On a mobile grocery app that matters more than it sounds.

I landed on 300ms for the debounce after testing by hand. Below ~200ms it fires on almost every keystroke; above ~400ms it starts to feel sluggish.

Filters work without a search query, so you can browse all Produce or everything at Trader Joe's without typing. Recent searches only appear when the query is empty so they don't crowd the header mid-search.

The `ScrollFade` component adds a gradient edge to chip rows when there's overflow. It tracks `scroll` and uses a `ResizeObserver` to stay accurate as the container resizes, giving a quiet cue that more chips are hiding off-screen.

The app has four states: `idle`, `loading`, `success`, and `error`. The ~10% error rate in `mockSearch.ts` was useful for testing the retry flow. The save toggle is local to each card. I scoped out persisting it, but the `saved_deal` event still fires so the data would be there to build on.

---

### State Management

Everything lives in `AppContext` backed by `useReducer`. With only 5 state fields, adding Zustand or Redux felt like overkill. `useReducer` gives a typed `Action` union and a pure reducer, which is readable and easy to unit test.

The context exposes named functions (`setQuery`, `setFilter`, etc.) instead of raw `dispatch`. Components stay lean, and analytics calls end up next to the state changes that trigger them. `track('filter_applied', ...)` lives in `setFilter`, not in `FilterBar`.

`localStorage` sync is a separate `useEffect` that writes `recentSearches` whenever it changes; the stored value is read back on mount to populate the initial state. Debouncing also lives in the context so the 300ms delay is consistent no matter which component updates the query.

---

### Performance Considerations

- `React.memo` on `ProductCard`. The full result list is swapped on each fetch, so memoizing by prop stops cards from re-rendering when the parent updates for other reasons.
- `useCallback` on all context handlers. Stable references stop child effects and memoized components from re-running when nothing has changed.
- `useMemo` for `activeCount` in `FilterBar` and `resultLabel` in `App`.
- Cancellation flag for stale responses. The search `useEffect` sets `cancelled = true` in its cleanup, so a slow earlier response can't overwrite results from a newer one:

```ts
let cancelled = false;
searchProducts(...).then(results => {
  if (cancelled) return;
  dispatch({ type: 'FETCH_SUCCESS', payload: results });
});
return () => { cancelled = true; };
```

- Filter chip options are computed from `mockProducts` with `Set` once at module load, not on every render.

---

### Analytics Events

Events use a generic `track<E>` function constrained by an `EventProperties` map, so TypeScript will catch a wrong property at the call site.

- **`search_submitted`**: fires when the debounce settles and results come back. Includes `query` and `resultCount`. Zero-result queries are useful for spotting gaps in the catalog.
- **`filter_applied`**: fires in `setFilter` on any non-null filter change. Includes `filterType` and `filterValue`.
- **`saved_deal`**: fires on first save in `ProductCard` (not on unsave). Includes `productId`, `productName`, `price`.
- **`retailer_clicked`**: fires when the retailer name is tapped. Includes `retailer` and `productId`.
- **`deal_viewed`**: typed with `productId`, `productName`, `retailer`, but not wired up. I wanted to fire it via `IntersectionObserver` when a card enters the viewport. It's the main missing piece from the event schema.

---

### What I'd Improve With More Time

1. Wire up `deal_viewed` with an `IntersectionObserver` in `ProductCard`.
2. Add a price filter UI. `maxPrice` is already in `SearchFilters` and `mockSearch.ts` filters on it, but there's no chip or slider in `FilterBar`.
3. Persist saved deals in `AppContext` or `localStorage` so bookmarks survive across searches.
4. Unit tests for the reducer and the `mockSearch` filter/stem logic using Vitest.
5. Animate state transitions. The swap from loading to results is instant right now.

---

### Tradeoffs and Limitations

- No real backend. Data is hardcoded in `mockProducts.ts`; the delay and error rate exercise the loading and error states but there's no real network call or ranking logic.
- Stem matching is naive. `sharesStem` strips the last character for terms 5+ chars long, which covers basic plurals but isn't a proper stemmer.
- Product images are `placehold.co` URLs colored by category. `ProductCard` has an `onError` fallback but there are no real images.
- Saved state resets on every new search. Scope decision.
- `maxPrice` filter logic exists but has no UI.
- No accessibility audit. A few `aria-label`s exist but the app hasn't been tested with a screen reader or for full keyboard nav.
