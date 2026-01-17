# Lazy Loading - Intersection Observer Implementation

## ✅ Implementation Status

- **Horizontal Lazy Loading (Date-based):** ✅ **IMPLEMENTED & WORKING**
- **Vertical Lazy Loading (Phase-based):** ⏳ **TODO** (planned for future)

---

## Overview

Using **Intersection Observer API** to implement lazy loading for the Gantt chart component.

**Key Principle:** Observe parent-level elements (background columns), not individual items. Let the browser handle pixel-based intersection detection automatically.

---

## Horizontal Lazy Loading ✅ IMPLEMENTED

### What We Observe

- **Element:** `.interval-col` (background columns in main chart SVG)
- **Root:** `.gantt-content` (the scrolling container)
- **Data Attribute:** `data-date` (stores the date for each column)
- **Detection:** Browser automatically detects when columns enter/exit viewport horizontally

### How It Works

```
┌─────────────────────────────────────────┐
│  .gantt-content (containerRef)          │  ← Intersection Observer ROOT
│  ┌─────────────────────────────────┐    │
│  │  .gantt-chart-svg               │    │
│  │  ┌───┬───┬───┬───┬───┬───┐      │    │
│  │  │Jan│Jan│Jan│Feb│Feb│Feb│      │    │  ← .interval-col elements
│  │  │15 │16 │17 │01 │02 │03 │      │    │     (OBSERVED)
│  │  └───┴───┴───┴───┴───┴───┘      │    │     Each has data-date
│  │                                  │    │
│  │  Items rendered on top           │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
         ↑                           ↑
      Scroll left              Scroll right
```

**When scrolling right:**
1. New column (e.g., Feb 15) enters viewport
2. Intersection Observer detects it
3. Reads `data-date="2026-02-15T00:00:00.000Z"`
4. Calculates date range: Feb 1 - Mar 1 (±14 day buffer)
5. Checks `fetchedDateRanges` Set: already fetched?
6. If NO → fetch items for that range
7. Merge with existing store items (filter duplicates by `_id`)
8. Chart re-renders
9. Re-observe columns (elements recreated)

### Implementation

**1. Add data-date to background columns:**

```javascript
// In renderChart() - GanttChart.vue
backgroundLayer
  .selectAll(".interval-col")
  .data(timeIntervals)
  .join("rect")
  .attr("class", "interval-col")
  .attr("data-date", (d) => moment(d).toISOString()) // ← Store date
  .attr("x", (d) => x(d))
  .attr("width", /* ... */)
  .attr("height", minContentHeight)
  .attr("fill", (d, i) => (i % 2 ? columnColors[1] : columnColors[0]));
```

**2. Setup Intersection Observer:**

```javascript
// In useGanttLazyLoading.js
const setupHorizontalObserver = () => {
  horizontalObserver.value = new IntersectionObserver((entries) => {
    const intersectingEntries = entries.filter(e => e.isIntersecting);
    
    intersectingEntries.forEach(entry => {
      const column = entry.target;
      const dateStr = column.getAttribute('data-date');
      
      if (dateStr) {
        const date = new Date(dateStr);
        const dateRange = calculateDateRangeForInterval(date); // ±14 days
        
        // Check if already fetched
        if (!fetchedDateRanges.value.has(dateRange.startFormatted)) {
          fetchItemsByDateRange(dateRange);
          fetchedDateRanges.value.add(dateRange.startFormatted);
        }
      }
    });
  }, {
    root: containerRef.value, // .gantt-content element
    rootMargin: '0px 140px 0px 140px', // Horizontal buffer (top right bottom left)
    threshold: 0.01
  });
};
```

**3. Observe columns after render:**

```javascript
// In GanttChart.vue
const { setupHorizontalObserver, observeDateIntervals, cleanup } = useGanttLazyLoading({
  containerRef,
  xScale: computed(() => xScale),
  viewMode: computed(() => props.viewMode),
  zoomFactor,
});

onMounted(() => {
  renderChart();
  setupHorizontalObserver();
  // observeDateIntervals() called after scroll-to-today completes
});

// Re-observe after renders (elements are recreated)
watch(() => ganttChartStore.allItems, () => {
  renderChart();
  nextTick(() => {
    if (hasStartedObserving) observeDateIntervals();
  });
}, { deep: true });
```

### Duplicate Prevention

**Two-level protection:**

1. **`fetchedDateRanges` Set** — tracks fetched date ranges by start date
   ```javascript
   if (!fetchedDateRanges.value.has("2026-02-01")) {
     // Not fetched yet
     fetchItemsByDateRange(dateRange);
     fetchedDateRanges.value.add("2026-02-01");
   }
   ```

2. **`hasRangeChanged()` function** — checks if new range is significantly different
   ```javascript
   // Only fetch if new range extends beyond 50% of buffer (7 days)
   const threshold = BUFFER_DAYS * 0.5; // 7 days
   const shouldFetch = (
     newStart < lastStart - 7 days ||
     newEnd > lastEnd + 7 days
   );
   ```

**Example:**
```
Fetched: Jan 1 - Jan 29 (buffer ±14 days from Jan 15)

Scroll to Jan 16:
  → Range: Jan 2 - Jan 30
  → Within 7-day threshold ✅
  → Skip fetch

Scroll to Jan 25:
  → Range: Jan 11 - Feb 8  
  → Beyond 7-day threshold ❌
  → Fetch new data
  → Add to Set: "2026-01-11"
```

### Why Re-observe After Renders?

```javascript
function renderChart() {
  svg.selectAll("*").remove(); // ← Removes ALL SVG elements!
  headerSvg.selectAll("*").remove();
  
  // ... creates new .interval-col elements
}
```

**Problem:** `renderChart()` destroys all SVG elements and creates new ones.

**Solution:** Re-observe after every render:
- Zoom changes → `renderChart()` → `observeDateIntervals()`
- Data changes → `renderChart()` → `observeDateIntervals()`
- View mode changes → `renderChart()` → `observeDateIntervals()`

This ensures the observer always watches the current DOM elements.

---

## Vertical Lazy Loading ⏳ TODO

### Planned Implementation

**What will be observed:**
- Phase sections/groups (e.g., "Design", "Development", "Testing")
- Elements: `.phase-label-group` or phase container elements
- Purpose: Render/hide items based on visible phases (DOM optimization)

**Note:** This is **DOM rendering optimization only** — data is already loaded horizontally by date range. Vertical observation just controls which items are visible in the DOM.

**Why later?**
- Current implementation renders all items (works fine for moderate datasets)
- Vertical optimization needed only for very large projects with many phases/items
- Horizontal lazy loading (date-based) provides the main performance benefit

---

## Simple Example - How It Works

### Scenario: User scrolls right

```
Step 1: Initial viewport
  Visible columns: Jan 15, Jan 16, Jan 17
  Observer detects: Jan 15 column
  Fetches: Jan 1 - Jan 29 (±14 day buffer)
  Adds to Set: "2026-01-01"

Step 2: Scroll right a bit
  Visible columns: Jan 18, Jan 19, Jan 20
  Observer detects: Jan 18 column
  Calculates range: Jan 4 - Feb 1
  Checks Set: "2026-01-04" already fetched? NO
  Checks threshold: Within 7 days of last fetch? YES
  Result: Skip fetch (data overlap)

Step 3: Scroll right more
  Visible columns: Feb 10, Feb 11, Feb 12
  Observer detects: Feb 10 column
  Calculates range: Jan 27 - Feb 24
  Checks Set: "2026-01-27" already fetched? NO
  Checks threshold: Beyond 7 days of last fetch? YES
  Result: Fetch items for Jan 27 - Feb 24
  Adds to Set: "2026-01-27"
  Merge: Filters out duplicates by item._id
  Store: Now has items from Jan 1 - Feb 24
```

### Intersection Observer = Pixel Observer?

**YES!** The browser's Intersection Observer API is pixel-based:
- Calculates bounding rectangles of observed elements
- Checks if they intersect with root element's viewport
- Considers `rootMargin` buffer in pixels
- All calculations done by browser automatically

**We just:**
- Tell it what to observe (`.interval-col` elements)
- Tell it where the viewport is (`root: containerRef.value`)
- Tell it the buffer size (`rootMargin: '0px 140px'`)
- Handle the callback when intersections happen

---

## Technical Details

### File Structure

```
src/
├── components/
│   └── GanttChart/
│       └── GanttChart.vue         # Main component, integrates lazy loading
├── composables/
│   └── useGanttLazyLoading.js     # Intersection Observer logic
└── stores/
    └── ganttChart.store.js        # State management
```

### Key Files

**`useGanttLazyLoading.js`:**
- `setupHorizontalObserver()` — creates Intersection Observer
- `observeDateIntervals()` — attaches observer to `.interval-col` elements
- `fetchItemsByDateRange()` — generates/fetches items for date range
- `cleanupHorizontalObserver()` — disconnects observer on unmount

**`GanttChart.vue`:**
- Calls `setupHorizontalObserver()` on mount
- Calls `observeDateIntervals()` after scroll-to-today completes
- Re-observes after renders (zoom, data changes, view mode changes)
- Passes `containerRef` and `xScale` to composable

---

## Benefits

1. **Reduced API Calls:** Only fetch items for visible date ranges
2. **Reduced Memory:** Don't load entire project timeline at once
3. **Automatic Detection:** Browser handles all pixel calculations
4. **Parent-Level Observation:** Observe ~365 columns instead of thousands of items
5. **Buffer Zone:** Prefetch data before it's needed (smooth scrolling)
6. **Duplicate Prevention:** Smart caching with Set + threshold checking
7. **No Manual Calculations:** No scroll event math, no pixel tracking

---

## Future: API Integration

Currently using dummy data for testing. To integrate with real API:

```javascript
// In useGanttLazyLoading.js, replace generateDummyItemsForDateRange with:

const fetchItemsByDateRange = async (dateRange) => {
  if (!hasRangeChanged(dateRange)) return;
  
  isLoading.value = true;
  
  try {
    // Call your API
    const response = await fetch(`/api/items?startDate=${dateRange.startFormatted}&endDate=${dateRange.endFormatted}`);
    const items = await response.json();
    
    // Merge with existing items (filter duplicates)
    const existingIds = new Set(ganttChartStore.items.map(i => i._id));
    const newItems = items.filter(item => !existingIds.has(item._id));
    ganttChartStore.items = [...ganttChartStore.items, ...newItems];
    
    // Update last fetched range
    lastFetchedRange.value = { start: dateRange.start, end: dateRange.end };
  } catch (error) {
    console.error('Error fetching items:', error);
  } finally {
    isLoading.value = false;
  }
};
```

---

## Summary

**Current Implementation:**
- Pure Intersection Observer (no scroll events)
- Observes `.interval-col` background columns
- Root: `.gantt-content` scrolling container
- Fetches items when columns enter viewport
- Prevents duplicates with Set + threshold
- Re-observes after renders (elements recreated)
- Uses dummy data (ready for API integration)

**Result:** Efficient, browser-optimized lazy loading that only fetches data for visible date ranges!
