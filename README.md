# GrocerySearch

A mobile-first grocery search and deals UI built as part of the Prox Mobile App Development & Front-End Engineering Internship Assessment (Track C).

## Setup

```bash
git clone https://github.com/jasonlee44/grocery-search-mobile-ui.git
cd grocery-search-mobile-ui
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. For the best experience, use Chrome DevTools mobile emulation (iPhone 14 Pro recommended).

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
