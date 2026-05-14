# GrocerySearch

A mobile-first grocery search and deals UI built as part of the Prox Mobile App Development & Front-End Engineering Internship Assessment (Track C).

## Setup

```bash
git clone https://github.com/jasonlee44/grocery-search-mobile-ui.git
cd grocery-search-mobile-ui
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Viewing in mobile emulation

This app is designed for mobile viewports. To preview it as it's intended:

**Chrome (recommended)**
1. Open DevTools with `Cmd+Option+I` (Mac) or `F12` (Windows)
2. Click the **Toggle Device Toolbar** icon (phone/tablet icon) in the top-left of DevTools, or press `Cmd+Shift+M` / `Ctrl+Shift+M`
3. Select **iPhone 14 Pro** (or any mobile preset) from the device dropdown
4. Reload the page

**Firefox**
1. Open DevTools with `Cmd+Option+I` / `F12`
2. Click the **Responsive Design Mode** icon (phone icon) in the top-right of DevTools, or press `Cmd+Option+M` / `Ctrl+Shift+M`
3. Select a mobile preset or set the width to 390px

**Safari**
1. Enable the Develop menu: Safari → Settings → Advanced → check "Show features for web developers"
2. Open DevTools with `Cmd+Option+I`
3. Click **Responsive Design Mode** or press `Ctrl+Cmd+R`
4. Select an iPhone preset from the device dropdown

## Features

- Debounced search input (300ms) across product name, category, and retailer
- Filter by store and category with togglable chips
- Filters work independently of the search query — browse by category with no search term
- Product cards showing name, retailer, price, size, and image
- Loading skeleton, empty state, and error state with retry
- Recent searches persisted to localStorage, cleared on demand
- Scroll fade on filter/recent chip rows to signal overflow
- Mock analytics event tracking for 5 key user actions

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Context + useReducer (no external state library)
- No backend — mock data with simulated async delay and ~10% error rate

## Screenshots

<!-- Add screenshots here -->

## Write-up

### UX Decisions

<!-- Explain your layout and interaction choices, e.g.:
- Why 300ms debounce
- Why the sticky header
- How idle / loading / results / error states are handled
- The scroll fade on filter chips
-->

### State Management

<!-- Explain why Context + useReducer over Zustand or Redux,
how the reducer is structured, and why components
receive named functions instead of raw dispatch. -->

### Performance Considerations

<!-- Cover:
- React.memo on ProductCard
- useCallback on context handlers
- useMemo on filter active count
- Cancellation flag for stale async responses
-->

### Analytics Events

<!-- Describe each of the 5 events and why the properties were chosen:
- search_submitted (query, resultCount)
- filter_applied (filterType, filterValue)
- deal_viewed (productId, productName, retailer)
- saved_deal (productId, productName, price)
- retailer_clicked (retailer, productId)
-->

### What I'd Improve With More Time

<!-- Honest list of 3–5 things. Examples:
- Real product images
- Price comparison across retailers for the same item
- Accessibility (ARIA labels, keyboard navigation)
- Unit tests for the reducer and mockSearch
- Smooth transitions between UI states
-->
