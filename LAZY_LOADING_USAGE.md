# How to Use useGanttLazyLoading Composable

## Overview
The `useGanttLazyLoading` composable handles horizontal lazy loading by fetching items from API based on visible date range when user scrolls horizontally.

---

## 1. **Basic Setup in GanttChart.vue**

```javascript
import { useGanttLazyLoading } from '@/composables/useGanttLazyLoading';
import { getAPIResponse } from '@/network/base/api';

// In script setup
const lazyLoading = useGanttLazyLoading({
  containerRef,
  xScale,
  viewMode: props.viewMode,
  zoomFactor: zoomFactor, // from useGanttZoomPan
  fetchItemsAPI: async ({ startDate, endDate }) => {
    // Your API call here
    const response = await getAPIResponse(
      `/api/items?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.items; // Return array of items
  },
  onItemsFetched: (items) => {
    console.log('Items fetched:', items);
    // Optional: Trigger chart re-render
    renderChart();
  }
});

// Setup scroll listener
onMounted(() => {
  lazyLoading.setupScrollListener();
  lazyLoading.fetchInitialItems(); // Fetch initial visible range
});

// Cleanup
onUnmounted(() => {
  lazyLoading.cleanup();
});
```

---

## 2. **API Function Example**

Your API function should accept date range and return items:

```javascript
// In your service file (e.g., project.service.js)
export const fetchItemsByDateRange = async (startDate, endDate) => {
  const response = await getAPIResponse(
    `/api/items?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data.items;
};

// Then in composable:
fetchItemsAPI: fetchItemsByDateRange
```

---

## 3. **Store Integration**

The composable updates `ganttChartStore.items` directly. If you need a method in the store:

```javascript
// In ganttChart.store.js
actions: {
  setItems(newItems) {
    // Merge with existing items (avoid duplicates)
    const existingIds = new Set(this.items.map(i => i._id));
    const newItemsToAdd = newItems.filter(item => !existingIds.has(item._id));
    this.items = [...this.items, ...newItemsToAdd];
  }
}
```

Then update composable:
```javascript
ganttChartStore.setItems(items);
```

---

## 4. **Configuration Options**

```javascript
const lazyLoading = useGanttLazyLoading({
  containerRef,        // Required: Container element ref
  xScale,              // Required: D3 scale for date calculations
  viewMode,            // Optional: Watch for view mode changes
  zoomFactor,          // Optional: Watch for zoom changes
  fetchItemsAPI,       // Required: Function to fetch items
  onItemsFetched      // Optional: Callback after fetch
});
```

---

## 5. **How It Works**

1. **Initial Load**: `fetchInitialItems()` fetches items for visible date range
2. **Horizontal Scroll**: Throttled scroll handler calculates new date range and fetches
3. **Zoom Changes**: Watches zoom factor and re-fetches when zoom changes
4. **View Mode Changes**: Watches view mode and re-fetches for new date range
5. **Smart Fetching**: Only fetches if date range has changed significantly (avoids redundant calls)

---

## 6. **Throttling & Performance**

- Scroll events are throttled to 200ms (configurable)
- Only fetches if date range extends beyond buffer zone
- Buffer zone: 14 days outside visible range (configurable)

---

## 7. **Example: Complete Integration**

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useGanttLazyLoading } from '@/composables/useGanttLazyLoading';
import { useGanttZoomPan } from '@/composables/useGanttZoomPan';
import { getAPIResponse } from '@/network/base/api';

const containerRef = ref(null);
let xScale = null; // Will be set in renderChart

// Zoom/Pan (existing)
const { zoomFactor } = useGanttZoomPan({
  containerRef,
  onZoomChange: () => renderChart()
});

// Lazy Loading
const lazyLoading = useGanttLazyLoading({
  containerRef,
  xScale: computed(() => xScale), // Make reactive
  viewMode: props.viewMode,
  zoomFactor,
  fetchItemsAPI: async ({ startDate, endDate }) => {
    const response = await getAPIResponse(
      `/api/items?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data?.items || [];
  },
  onItemsFetched: () => {
    // Re-render chart with new items
    renderChart();
  }
});

onMounted(() => {
  lazyLoading.setupScrollListener();
  // Initial fetch will happen after renderChart sets xScale
  nextTick(() => {
    lazyLoading.fetchInitialItems();
  });
});

onUnmounted(() => {
  lazyLoading.cleanup();
});
</script>
```

---

## 8. **Notes**

- **Vertical lazy loading** (Intersection Observer) will be implemented later
- For now, this handles **horizontal lazy loading only** (date-based fetching)
- Items are fetched across all phases for the date range
- Frontend groups items by phase after fetching

