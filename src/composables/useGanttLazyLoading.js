import { ref, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import moment from "moment";
import { useGanttChart } from "@/stores/ganttChart.store";

// Constants
const DAYS_TO_FETCH = 30; // Fetch 30 days at a time
const DATE_FORMAT = "YYYY-MM-DD";

export const useGanttLazyLoading = (options = {}) => {
  const {
    containerRef, // Scroll container element
    fetchItemsAPI, // API function to fetch items by date range
  } = options;

  const ganttChartStore = useGanttChart();
  const { ganttBoundaryStartDate, ganttBoundaryEndDate, items } = storeToRefs(ganttChartStore);

  // State
  const isLoading = ref(false);
  const lastFetchedRange = ref({ start: null, end: null });

  const previousStartCol = ref(null); // Actually observed start column (Element)
  const previousEndCol = ref(null); // Actually observed end column (Element)

  /**
   * Build 4–5 mock tasks for a date range (helper for lazy-load demo).
   * @param {Object} dateRange - { startFormatted, endFormatted }
   * @param {number} startSeq - Starting ganttSeq for the new items
   * @returns {Array} newItems
   */
  const buildMockTasksForDateRange = (dateRange, startSeq = 0) => {
    const phases = ganttChartStore.phasesList || [];
    const defaultPhase = { _id: "default", name: "Planning", colour: "#3098f2", textColor: "#ffffff" };
    const start = moment(dateRange.startFormatted).startOf("day");
    const end = moment(dateRange.endFormatted).endOf("day");
    const totalDays = Math.max(1, end.diff(start, "days"));
    const count = 3;
    const step = Math.max(1, Math.floor(totalDays / count));
    const newItems = [];

    for (let i = 0; i < count; i++) {
      const dayOffset = i * step;
      const taskStart = start.clone().add(dayOffset, "days");
      const taskEnd = taskStart.clone().add(2, "days");
      const taskPhase = phases[i % phases.length] || defaultPhase;
      newItems.push({
        _id: `lazy-${dateRange.startFormatted}-${i}-${Date.now()}`,
        title: `Lazy task ${i + 1} (${taskStart.format("MMM D")})`,
        startDate: taskStart.toDate().toISOString(),
        dueDate: taskEnd.toDate().toISOString(),
        phase: { ...taskPhase },
        ganttSeq: startSeq + i,
        predecessor: null,
        subItems: [],
        statusName: ["Not Started", "In Progress", "Pending", "Completed"][i % 4],
      });
    }

    return newItems;
  };

  /**
   * Fetch items from API based on date range; push mock tasks to store when no API.
   */
  const fetchItemsByDateRange = async (dateRange) => {
    if (!dateRange) return;

    isLoading.value = true;

    try {
      // Call the API function provided by parent component
      if (fetchItemsAPI) {
      }

      const newItems = buildMockTasksForDateRange(dateRange, items.value.length);
      items.value.push(...newItems);

      lastFetchedRange.value = {
        start: dateRange.start,
        end: dateRange.end,
      };
    } catch (_error) {
    } finally {
      isLoading.value = false;
    }
  };

  const setInitialFetchedRange = (startDate, endDate) => {
    const start = moment(startDate).startOf("day").toDate();
    const end = moment(endDate).endOf("day").toDate();
    lastFetchedRange.value = { start, end };

    // Store boundary dates in store (already in 'YYYY-MM-DD' format)
    ganttBoundaryStartDate.value = startDate;
    ganttBoundaryEndDate.value = endDate;

    const cursor = moment(startDate).startOf("month");
    const endM = moment(endDate).startOf("month");
    while (!cursor.isAfter(endM)) {
      fetchedDateRanges.value.add(cursor.format("YYYY-MM"));
      cursor.add(1, "month");
    }
  };

  // ============================================
  // HORIZONTAL LAZY LOADING (Intersection Observer - Date Intervals)
  // ============================================

  const horizontalObserver = ref(null);
  const fetchedDateRanges = ref(new Set());

  const setupHorizontalObserver = () => {
    if (!containerRef || !containerRef.value) return;

    horizontalObserver.value = new IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter((e) => e.isIntersecting);

        // console.log(
        //   "entries:",
        //   entries,
        //   previousEndCol.value,
        //   previousStartCol.value,
        //   ganttBoundaryEndDate.value,
        //   ganttBoundaryStartDate.value,
        // );

        intersectingEntries.forEach((entry) => {
          const boundaryType = entry.target.getAttribute("data-boundary");

          if (!boundaryType) return;

          let dateRange;

          switch (boundaryType) {
            case "start": {
              const currentStart = moment(ganttBoundaryStartDate.value);
              const newStart = currentStart.clone().subtract(DAYS_TO_FETCH, "days");
              const newEnd = currentStart.clone().subtract(1, "day");

              dateRange = {
                start: newStart.toDate(),
                end: newEnd.toDate(),
                startFormatted: newStart.format(DATE_FORMAT),
                endFormatted: newEnd.format(DATE_FORMAT),
              };

              ganttBoundaryStartDate.value = newStart.format(DATE_FORMAT);
              break;
            }
            case "end": {
              const currentEnd = moment(ganttBoundaryEndDate.value);
              const newStart = currentEnd.clone().add(1, "day");
              const newEnd = currentEnd.clone().add(DAYS_TO_FETCH, "days");

              dateRange = {
                start: newStart.toDate(),
                end: newEnd.toDate(),
                startFormatted: newStart.format(DATE_FORMAT),
                endFormatted: newEnd.format(DATE_FORMAT),
              };

              ganttBoundaryEndDate.value = newEnd.format(DATE_FORMAT);
              break;
            }
            default:
              return;
          }

          fetchItemsByDateRange(dateRange);
        });
      },
      {
        root: containerRef.value, // Use container element as root
        rootMargin: "0px 500px 0px 500px", // Buffer in pixels (horizontal: top right bottom left)
        threshold: 0.01,
      },
    );
  };

  const observeDateIntervals = () => {
    if (!horizontalObserver.value || !containerRef?.value) return;

    // Unobserve only the previous boundary columns (not all columns)
    if (previousStartCol.value) {
      horizontalObserver.value.unobserve(previousStartCol.value);
    }
    if (previousEndCol.value) {
      horizontalObserver.value.unobserve(previousEndCol.value);
    }

    // Observe the new boundary columns marked with data-boundary attribute
    const startCol = containerRef.value.querySelector(
      '.interval-col[data-boundary="start"]',
    );
    const endCol = containerRef.value.querySelector(
      '.interval-col[data-boundary="end"]',
    );

    if (startCol) {
      horizontalObserver.value.observe(startCol);
      previousStartCol.value = startCol;
      // console.log("[LazyLoading] Observing START boundary column");
    }
    if (endCol) {
      horizontalObserver.value.observe(endCol);
      previousEndCol.value = endCol;
      // console.log("[LazyLoading] Observing END boundary column");
    }
  };

  const cleanupHorizontalObserver = () => {
    if (horizontalObserver.value) {
      horizontalObserver.value.disconnect();
      horizontalObserver.value = null;
    }
    fetchedDateRanges.value.clear();
  };

  // ============================================
  // CLEANUP
  // ============================================

  const cleanupAll = () => {
    cleanupHorizontalObserver();
  };

  // Cleanup on unmount
  onUnmounted(() => {
    cleanupAll();
  });

  return {
    // State
    isLoading,
    lastFetchedRange,

    // Horizontal Lazy Loading (Intersection Observer)
    setupHorizontalObserver,
    observeDateIntervals,
    cleanupHorizontalObserver,
    fetchedDateRanges,
    setInitialFetchedRange,

    // Cleanup
    cleanup: cleanupAll,
  };
};
