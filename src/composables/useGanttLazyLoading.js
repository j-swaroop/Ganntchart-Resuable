import { ref, watch, nextTick, onUnmounted } from 'vue';
import { useGanttChart } from '@/stores/ganttChart.store';
import moment from 'moment';

// Constants
const BUFFER_DAYS = 14; // Days to fetch outside visible range
const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Composable for lazy loading (horizontal + vertical)
 * - Horizontal: Date-based API fetching (date range)
 * - Vertical: DOM rendering optimization using Intersection Observer
 */
export const useGanttLazyLoading = (options = {}) => {
  const {
    containerRef, // Use container as root for Intersection Observer
    xScale,
    viewMode,
    onItemsFetched,
    fetchItemsAPI // API function to fetch items by date range
  } = options;

  const ganttChartStore = useGanttChart();

  // State
  const isLoading = ref(false);
  const lastFetchedRange = ref({ start: null, end: null });

  /**
   * Generate dummy items for date range (for testing)
   */
  const generateDummyItemsForDateRange = (dateRange) => {
    const items = [];
    const start = moment(dateRange.start);
    const end = moment(dateRange.end);
    const daysDiff = end.diff(start, 'days');
    
    // Generate 1-3 items per week in the date range
    const itemsPerWeek = 2;
    const totalItems = Math.ceil(daysDiff / 7) * itemsPerWeek;
    
    // Get phases from store
    const phases = ganttChartStore.phasesList || [];
    const OTHER_PHASE = { _id: "others", name: "Others", colour: "#9CA3AF", textColor: "#ffffff" };
    
    for (let i = 0; i < totalItems; i++) {
      // Random start date within range
      const randomDays = Math.floor(Math.random() * daysDiff);
      const itemStart = moment(start).add(randomDays, 'days');
      
      // Random duration (1-7 days)
      const duration = Math.floor(Math.random() * 7) + 1;
      const itemEnd = moment(itemStart).add(duration, 'days');
      
      // Skip if item ends after range
      if (itemEnd.isAfter(end)) continue;
      
      // Random phase
      const phase = phases.length > 0 
        ? phases[Math.floor(Math.random() * phases.length)]
        : OTHER_PHASE;
      
      items.push({
        _id: `dummy-${dateRange.startFormatted}-${dateRange.endFormatted}-${i}-${Date.now()}`,
        title: `${phase.name} Item ${i + 1}`,
        startDate: itemStart.toISOString(),
        dueDate: itemEnd.toISOString(),
        phase: {
          _id: phase._id || phase._id,
          name: phase.name,
          colour: phase.colour || phase.colour || "#3098f2",
          textColor: phase.textColor || "#ffffff"
        },
        ganttSeq: i,
        predecessor: null,
        subItems: [],
        statusName: ["Not Started", "In Progress", "Completed"][Math.floor(Math.random() * 3)]
      });
    }
    
    console.log('[LazyLoading] Generated dummy items:', {
      count: items.length,
      dateRange: `${dateRange.startFormatted} - ${dateRange.endFormatted}`
    });
    
    return items;
  };

  /**
   * Check if date range has changed significantly
   * Only fetches if range extends beyond threshold (50% of buffer = 7 days)
   */
  const hasRangeChanged = (newRange) => {
    if (!lastFetchedRange.value.start || !lastFetchedRange.value.end) {
      return true; // First fetch
    }

    // Check if new range extends beyond last fetched range
    const lastStart = moment(lastFetchedRange.value.start);
    const lastEnd = moment(lastFetchedRange.value.end);
    const newStart = moment(newRange.start);
    const newEnd = moment(newRange.end);

    // Fetch if new range extends beyond buffer zone
    const bufferMs = BUFFER_DAYS * 24 * 60 * 60 * 1000;
    const thresholdDays = BUFFER_DAYS * 0.5; // 50% of buffer = 7 days
    const thresholdMs = bufferMs * 0.5;

    const startChanged = newStart.isBefore(lastStart.subtract(thresholdMs));
    const endChanged = newEnd.isAfter(lastEnd.add(thresholdMs));

    console.log('[LazyLoading] Checking if range changed:', {
      threshold: `${thresholdDays} days (50% of ${BUFFER_DAYS} day buffer)`,
      lastRange: `${moment(lastFetchedRange.value.start).format(DATE_FORMAT)} - ${moment(lastFetchedRange.value.end).format(DATE_FORMAT)}`,
      newRange: `${newRange.startFormatted} - ${newRange.endFormatted}`,
      startChanged,
      endChanged,
      willFetch: startChanged || endChanged
    });

    return startChanged || endChanged;
  };

  /**
   * Fetch items from API based on date range
   */
  const fetchItemsByDateRange = async (dateRange) => {
    if (!dateRange) return;

    // Check if we need to fetch
    if (!hasRangeChanged(dateRange)) {
      console.log('[LazyLoading] Date range unchanged, skipping fetch');
      return; // Range hasn't changed enough
    }

    console.log('[LazyLoading] Fetching items for date range:', {
      startDate: dateRange.startFormatted,
      endDate: dateRange.endFormatted,
      lastFetched: lastFetchedRange.value.start 
        ? `${moment(lastFetchedRange.value.start).format(DATE_FORMAT)} - ${moment(lastFetchedRange.value.end).format(DATE_FORMAT)}`
        : 'none'
    });

    isLoading.value = true;

    try {
      // Generate dummy items for testing (until API is ready)
      const items = generateDummyItemsForDateRange(dateRange);
      
      // If API function is provided, use it instead
      // const items = await fetchItemsAPI({
      //   startDate: dateRange.startFormatted,
      //   endDate: dateRange.endFormatted
      // });

      // Update store with fetched items
      // Merge with existing items (avoid duplicates by _id)
      if (items && Array.isArray(items)) {
        const existingCount = ganttChartStore.items.length;
        
        // Get existing item IDs to avoid duplicates
        const existingIds = new Set(ganttChartStore.items.map(i => i._id));
        
        // Filter out items that already exist
        const newItems = items.filter(item => !existingIds.has(item._id));
        
        console.log('[LazyLoading] Merging items:', {
          fetched: items.length,
          existing: existingCount,
          duplicates: items.length - newItems.length,
          new: newItems.length,
          totalAfter: existingCount + newItems.length
        });
        
        // Merge: keep existing items + add only new ones
        ganttChartStore.items = [...ganttChartStore.items, ...newItems];
      }

      // Update last fetched range
      lastFetchedRange.value = {
        start: dateRange.start,
        end: dateRange.end
      };

      // Call optional callback
      if (onItemsFetched) {
        onItemsFetched(items);
      }
    } catch (error) {
      console.error('Error fetching items by date range:', error);
    } finally {
      isLoading.value = false;
    }
  };



  /**
   * Watch for view mode changes (affects date range)
   * Note: viewMode must be a computed/ref, not a string
   */
  const watchViewModeChanges = (viewModeRef) => {
    if (!viewModeRef || typeof viewModeRef !== 'object' || !('value' in viewModeRef)) {
      return; // Not a valid reactive source, skip
    }
    
    watch(viewModeRef, () => {
      // Reset last fetched range when view mode changes
      lastFetchedRange.value = { start: null, end: null };
      fetchedDateRanges.value.clear(); // Clear fetched ranges for new view mode
      
      // Re-observe date intervals for new view mode
      if (horizontalObserver.value) {
        cleanupHorizontalObserver();
        nextTick(() => {
          setupHorizontalObserver();
          observeDateIntervals();
        });
      }
    });
  };



  // Watch viewMode if it's a computed/ref (not a string)
  if (viewMode && typeof viewMode === 'object' && 'value' in viewMode) {
    watchViewModeChanges(viewMode);
  }

  // ============================================
  // HORIZONTAL LAZY LOADING (Intersection Observer - Date Intervals)
  // ============================================
  // Observe date interval groups (parent-level elements in header)
  // - Observe `.interval-label-group` elements
  // - When date interval enters viewport → fetch items for that date range
  // - Uses Intersection Observer API (browser handles pixel detection)
  
  const horizontalObserver = ref(null);
  const fetchedDateRanges = ref(new Set()); // Track which date ranges have been fetched

  const setupHorizontalObserver = () => {
    if (!containerRef || !containerRef.value) {
      console.warn('[LazyLoading] Container ref not available');
      return;
    }
    
    console.log('[LazyLoading] Setting up Intersection Observer:', {
      root: 'containerRef (.gantt-content)',
      rootMargin: '0px 140px 0px 140px', // Horizontal margin only (top right bottom left)
      threshold: 0.01,
      containerRect: containerRef.value.getBoundingClientRect()
    });
    
    // Use container as root for Intersection Observer
    // Observe .interval-col elements (background columns in main SVG)
    horizontalObserver.value = new IntersectionObserver((entries) => {
      console.log('[LazyLoading] 🔥 Intersection Observer callback fired:', {
        totalEntries: entries.length,
        intersecting: entries.filter(e => e.isIntersecting).length,
        notIntersecting: entries.filter(e => !e.isIntersecting).length
      });
      
      const intersectingEntries = entries.filter(e => e.isIntersecting);
      
      intersectingEntries.forEach(entry => {
        const intervalCol = entry.target;
        const dateStr = intervalCol.getAttribute('data-date');
        
        console.log('[LazyLoading] Processing intersecting element:', {
          dateStr: dateStr || 'MISSING',
          element: intervalCol,
          boundingRect: intervalCol.getBoundingClientRect()
        });
        
        if (!dateStr) {
          console.warn('[LazyLoading] Interval column missing data-date attribute');
          return;
        }
        
        // Date interval entered viewport - fetch items for this date range
        const date = new Date(dateStr);
        const dateRange = calculateDateRangeForInterval(date);
        
        if (!dateRange) {
          console.warn('[LazyLoading] Could not calculate date range for:', dateStr);
          return;
        }
        
        if (!fetchedDateRanges.value.has(dateRange.startFormatted)) {
          console.log('[LazyLoading] ✨ Date interval entered viewport - fetching:', {
            date: dateStr,
            dateRange: `${dateRange.startFormatted} - ${dateRange.endFormatted}`
          });
          
          fetchItemsByDateRange(dateRange);
          fetchedDateRanges.value.add(dateRange.startFormatted);
        }
      });
    }, {
      root: containerRef.value, // Use container element as root
      rootMargin: '0px 140px 0px 140px', // Buffer in pixels (horizontal only: top right bottom left)
      threshold: 0.01
    });
    
    console.log('[LazyLoading] Observer created successfully');
  };

  const observeDateIntervals = () => {
    if (!horizontalObserver.value) {
      console.warn('[LazyLoading] Observer not set up yet');
      return;
    }
    
    if (!containerRef || !containerRef.value) {
      console.warn('[LazyLoading] Container ref not available');
      return;
    }
    
    // Observe all interval columns (background columns in main SVG inside container)
    const intervalCols = document.querySelectorAll('.interval-col');
    
    console.log('[LazyLoading] Searching for .interval-col elements:', {
      found: intervalCols.length,
      container: containerRef.value ? 'exists' : 'missing'
    });
    
    if (intervalCols.length === 0) {
      console.warn('[LazyLoading] No interval-col elements found yet');
      return;
    }
    
    // Log first few elements to verify data-date attribute
    intervalCols.forEach((col, index) => {
      if (index < 3) {
        console.log(`[LazyLoading] Sample interval-col ${index}:`, {
          dateAttr: col.getAttribute('data-date'),
          class: col.getAttribute('class'),
          bbox: col.getBoundingClientRect()
        });
      }
      horizontalObserver.value.observe(col);
    });
    
    console.log('[LazyLoading] ✅ Started observing interval columns:', {
      total: intervalCols.length,
      sampleDate: intervalCols[0]?.getAttribute('data-date') || 'MISSING',
      root: 'containerRef (.gantt-content)'
    });
  };

  const calculateDateRangeForInterval = (date) => {
    if (!xScale.value) return null;
    
    // Calculate date range for this interval (interval date ± buffer days)
    const bufferedStart = moment(date).subtract(BUFFER_DAYS, 'days').toDate();
    const bufferedEnd = moment(date).add(BUFFER_DAYS, 'days').toDate();
    
    return {
      start: bufferedStart,
      end: bufferedEnd,
      startFormatted: moment(bufferedStart).format(DATE_FORMAT),
      endFormatted: moment(bufferedEnd).format(DATE_FORMAT)
    };
  };

  const cleanupHorizontalObserver = () => {
    if (horizontalObserver.value) {
      horizontalObserver.value.disconnect();
      horizontalObserver.value = null;
    }
    fetchedDateRanges.value.clear();
  };

  // ============================================
  // VERTICAL LAZY LOADING (Intersection Observer - Phase Groups)
  // ============================================
  // TODO: Will be implemented later
  // This will handle DOM rendering optimization for phase groups
  // - Observe phase groups (parent-level elements)
  // - Render items when phase enters viewport
  // - Cleanup items when phase exits viewport
  // - Uses Intersection Observer API
  
  // Placeholder for vertical observer state
  const verticalObserver = ref(null);
  const renderedPhases = ref(new Set());

  const setupVerticalObserver = () => {
    // TODO: Implement Intersection Observer for phase groups
    // Will be added when implementing vertical lazy loading
  };

  const observePhaseGroups = () => {
    // TODO: Attach observer to phase group elements
    // Will be added when implementing vertical lazy loading
  };

  const cleanupVerticalObserver = () => {
    // TODO: Disconnect observer and cleanup
    // Will be added when implementing vertical lazy loading
  };

  // ============================================
  // MAIN CLEANUP (both horizontal + vertical)
  // ============================================
  
  const cleanupAll = () => {
    // Cleanup horizontal observer (Intersection Observer)
    cleanupHorizontalObserver();
    
    // Cleanup vertical observer (when implemented)
    cleanupVerticalObserver();
  };

  // Cleanup on unmount
  onUnmounted(() => {
    cleanupAll();
  });

  return {
    // State
    isLoading,
    lastFetchedRange,
    
    // Horizontal Lazy Loading (Intersection Observer - Date Intervals)
    setupHorizontalObserver,
    observeDateIntervals,
    cleanupHorizontalObserver,
    fetchedDateRanges, // Track which date ranges have been fetched
    
    // Vertical Lazy Loading (Intersection Observer - Phase Groups) - TODO
    setupVerticalObserver,
    observePhaseGroups,
    cleanupVerticalObserver,
    renderedPhases, // Track which phases have items rendered
    
    // Cleanup (both)
    cleanup: cleanupAll
  };
};

