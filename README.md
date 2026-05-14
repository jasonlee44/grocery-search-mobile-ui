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
- Filters work independently of the search query — browse by category with no search term
- Product cards showing name, retailer, price, size, and image
- Loading skeleton, empty state, and error state with retry
- Recent searches persisted to `localStorage`, capped at 8, cleared on demand
- Scroll fade on filter/recent chip rows to signal overflow
- Mock analytics event tracking for 5 key user actions

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Context + `useReducer` (no external state library)
- No backend — mock data with simulated 600–900ms async delay and ~10% error rate

---

## Write-up

### UX Decisions

**Sticky header with search always visible.** The header sticks to the top of the viewport so the search bar and filters are always one tap away, regardless of scroll position. On a mobile grocery app, users frequently want to adjust their search mid-browse, so I didn't want them scrolling back up to do that.

**300ms debounce.** I landed on 300ms because it feels responsive without firing on every keystroke. Below ~200ms you start triggering searches on almost every key, which feels noisy. Above ~400ms it feels sluggish. 300ms is a fairly standard debounce window for search inputs and felt right when testing by hand.

**Filters independent of search query.** You can filter by store or category even with an empty search field. This lets users browse "everything at Trader Joe's" or "all Produce" without needing to type anything. The search effect fires whenever either the debounced query or the active filters change.

**Recent searches shown only in idle state.** Recent searches appear below the search bar only when the query is empty and the app is in the idle state — they disappear as soon as you start typing. This keeps the header from getting crowded during active search, and the recents feel like a natural starting point rather than visual noise.

**Scroll fade on chip rows.** The `ScrollFade` component adds a white gradient fade at the right (and left, once scrolled) edge of any horizontally scrollable chip row. It's driven by a `scroll` event listener and a `ResizeObserver`, so the fades update accurately as the container resizes. This is a subtle cue that more chips are available off-screen, without needing scroll arrows or a "show more" button.

**Four distinct UI states.** The app explicitly handles `idle`, `loading`, `success`, and `error`. Rather than hiding UI when data isn't ready, each state renders something purposeful: a welcoming prompt on idle, skeleton cards on load, a result count on success, and a retry button on error. The ~10% simulated failure rate in `mockSearch.ts` was useful for testing that the error state actually works.

**Save toggle on product cards.** The bookmark button on each card toggles a local `saved` state with a visual fill change. It's intentionally local to the card (not persisted) since wiring a saved-deals list would have been scope creep for this assessment, but the `saved_deal` analytics event fires on the first save so the data would be there to build on.

---

### State Management

All application state lives in a single `AppContext` backed by `useReducer`. I chose this over Zustand or Redux for a few reasons:

**The app is small enough that a library would be overkill.** There are only 5 state fields: `query`, `results`, `status`, `filters`, and `recentSearches`. Adding a library like Zustand would have been fine, but it also would have meant an extra dependency for no real benefit at this scale.

**`useReducer` gives clear, auditable state transitions.** Every state change goes through a typed `Action` union, so there's exactly one place to trace what any dispatch does. The reducer is a pure function, which makes it easy to reason about and would be straightforward to unit test.

**Components receive named functions, not raw `dispatch`.** The context exposes `setQuery`, `setFilter`, `clearRecentSearches`, etc. rather than exposing dispatch directly. This keeps component code simple and, more importantly, lets side effects like analytics tracking live in the context handlers rather than scattered across components. For example, `setFilter` in the context is the right place to call `track('filter_applied', ...)`, not inside `FilterBar`.

**`localStorage` sync is a separate effect.** Rather than trying to handle persistence inside the reducer (which would make it impure), there's a dedicated `useEffect` that writes `state.recentSearches` to `localStorage` whenever it changes. The stored value is also read once at `AppProvider` mount to hydrate the initial state.

**Debouncing happens in the context.** `useDebounce` is called on `state.query` inside the provider, and the search `useEffect` depends on `debouncedQuery`. That means the 300ms delay is enforced in one place regardless of which component updates the query.

---

### Performance Considerations

**`React.memo` on `ProductCard`.** Each card only needs to re-render if its `product` prop changes. Since results are replaced entirely on each fetch (not mutated), cards that survive from one search to the next won't re-render unnecessarily.

**`useCallback` on all context handlers.** `setQuery`, `setFilter`, `clearRecentSearches`, `selectRecentSearch`, and `retrySearch` are all wrapped in `useCallback`. This gives them stable references so that child components memoized on their props (or effects that list them as dependencies) don't re-run without a real change.

**`useMemo` for derived values.** `activeCount` in `FilterBar` (number of active filters) and `resultLabel` in `App` (result count string) are both `useMemo`-computed so they don't recalculate on every render.

**Cancellation flag for stale responses.** The search `useEffect` uses a `cancelled` boolean set in the cleanup function:

```ts
let cancelled = false;
searchProducts(...)
  .then(results => {
    if (cancelled) return;
    dispatch({ type: 'FETCH_SUCCESS', payload: results });
  });
return () => { cancelled = true; };
```

If the user types quickly, each effect cleanup cancels the previous in-flight promise before the next fires. Without this, a slow response from an earlier query could overwrite the results of a faster, newer one.

**Filter options derived once at module load.** The `retailers` and `categories` arrays in `FilterBar` are computed using `Set` outside the component, so they're created once when the module loads rather than on each render.

---

### Analytics Events

All events are typed in `analytics.ts` using a generic `track<E>` function constrained by an `EventProperties` map, so TypeScript will catch any mismatch between an event name and its required properties at compile time.

**`search_submitted`** — fires after the debounce settles and the mock search resolves successfully (only for non-empty queries). Properties: `query` (the search term) and `resultCount` (how many products matched). Result count alongside the query is useful for spotting common searches that return zero results — a signal that the catalog might have a gap.

**`filter_applied`** — fires inside the `setFilter` context handler whenever a non-null filter value is applied. Properties: `filterType` (`"retailer"` or `"category"`) and `filterValue` (the selected option). Tracking both together makes it easy to see which specific filters are most used — e.g., whether users filter by store more than by category.

**`saved_deal`** — fires on the first save toggle in `ProductCard` (not on unsave). Properties: `productId`, `productName`, and `price`. Knowing which products (and at what prices) are being saved is useful for understanding which deals feel compelling to users.

**`retailer_clicked`** — fires when the retailer name button inside a card is tapped. Properties: `retailer` and `productId`. In a real app this would open the retailer's product page, so tracking it shows which retailer links are driving outbound traffic and from which products.

**`deal_viewed`** — this event is defined in the `EventProperties` type with properties `productId`, `productName`, and `retailer`, but it is not currently wired up in any component. The intent would be to fire it when a product card enters the viewport (via `IntersectionObserver`), which would give impression-level data without requiring a tap. I ran out of time to implement the observer; it's the most obvious gap between the defined event schema and what's actually tracked.

---

### What I'd Improve With More Time

1. **Wire up `deal_viewed` with an `IntersectionObserver`.** This is the most immediate gap — the event type and properties are defined, but the observer isn't implemented. A `useEffect` in `ProductCard` watching a ref against the viewport root would handle it cleanly.

2. **Expose the price filter in the UI.** `SearchFilters` has a `maxPrice` field and `mockSearch.ts` filters on it, but `FilterBar` only shows retailer and category chips. Adding a simple max-price slider or preset price chips (e.g., "Under $3 / Under $6 / Under $10") would make the filter panel more useful.

3. **Persisted saved deals.** The save toggle is currently local state in each `ProductCard`, so it resets on every search. Moving saved product IDs into `AppContext` (or even `localStorage`) would let users maintain a list of saved deals across sessions.

4. **Unit tests for the reducer and `mockSearch`.** The `AppState` reducer has clear action-to-state mappings that are straightforward to test with something like Vitest. The `mockSearch` search logic (including the stem-matching fallback) also has edge cases worth testing.

5. **Smooth state transitions.** Right now the switch from loading to results is instant. A simple fade or slide-up entrance on the result list would make the app feel more polished. The same goes for the filter chip active/inactive toggle.

---

### Tradeoffs, Assumptions, and Limitations

- **No real backend.** All data is from a hardcoded `mockProducts` array in `mockProducts.ts`. The simulated 600–900ms delay and ~10% error rate are enough to exercise loading and error states, but there's no actual network request, pagination, or ranking logic.

- **Stem matching is naive.** The `sharesStem` function in `mockSearch.ts` handles plurals by stripping the last character if the term is 5+ characters. This is just enough to make "strawberri" match "strawberries," but it's not a real stemmer — it would produce false positives or miss edge cases in a production search.

- **Images are placeholder URLs.** Product images are generated from `placehold.co` with category-based colors and labels. The `ProductCard` has an `onError` fallback in case the placeholder service is unavailable, but there are no real product images.

- **Saved state is ephemeral.** The bookmark on each card uses local `useState` and is lost when the search results are replaced. This was an intentional scope decision rather than an oversight.

- **`maxPrice` filter is not surfaced.** The type and filter logic support it, but there's no UI control for it.

- **No accessibility audit.** A few `aria-label` attributes are present (save button, clear button), but the app hasn't been tested with a screen reader or for full keyboard navigation. That would be a priority before shipping.
