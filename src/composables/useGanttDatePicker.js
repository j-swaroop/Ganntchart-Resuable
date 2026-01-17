import { ref, computed, nextTick } from "vue";
import { useGanttChart } from "@/stores/ganttChart.store";
import moment from "moment";

// Constants
const MENU_HEIGHT = 300;
const SPACING = 8;
const CLOSE_DELAY = 300;
const DATE_FORMAT = "YYYY-MM-DD";

export const useGanttDatePicker = () => {
  const ganttChartStore = useGanttChart();

  // Date picker state
  const datePickerMenu = ref(null);
  const datePickerTrigger = ref(null);
  const datePickerValue = ref(null);
  const datePickerTriggerStyle = ref({});
  const datePickerPlacement = ref("bottom-start");
  const currentEditingItem = ref(null);
  const currentDateType = ref(null); // 'start' or 'end'
  const datePickerJustClosed = ref(false);
  let datePickerCloseTimeout = null;

  // Computed property for VueDatePicker
  const datePickerModelValue = computed({
    get: () => datePickerValue.value || null,
    set: (val) => {
      datePickerValue.value = val;
    },
  });

  // Helper function to find item bar element
  const findItemBar = (target) => {
    if (!target) return null;
    let element = target;
    while (element && element !== document.body) {
      const className =
        element.getAttribute?.("class") || element.className?.baseVal || "";
      if (className.includes("item-group")) {
        const children = element.children || element.childNodes;
        for (const child of children) {
          const childClass =
            child.getAttribute?.("class") || child.className?.baseVal || "";
          if (childClass.includes("item-bar") && child.tagName === "rect") {
            return child;
          }
        }
      }
      element = element.parentElement || element.parentNode;
    }
    return null;
  };

  // Helper to calculate placement based on position and date type
  const calculatePlacement = (isTop, dateType) => {
    const vertical = isTop ? "top" : "bottom";
    const horizontal = dateType === "start" ? "start" : "end";
    return `${vertical}-${horizontal}`;
  };

  // Helper to clear timeout
  const clearCloseTimeout = () => {
    if (datePickerCloseTimeout) {
      clearTimeout(datePickerCloseTimeout);
      datePickerCloseTimeout = null;
    }
  };

  // Date picker functions
  const openDatePicker = (item, dateType, event, itemBarElement = null, onBeforeOpen = null) => {
    // Call optional callback to hide milestone button or perform other actions
    onBeforeOpen?.();

    currentEditingItem.value = item;
    currentDateType.value = dateType;
    
    // Set date value - use item's date or current date as fallback
    const itemDate = dateType === "start" ? item.startDate : item.dueDate;
    datePickerValue.value = itemDate ? new Date(itemDate) : new Date();

    if (!datePickerTrigger.value) return;

    const itemBar =
      itemBarElement || findItemBar(event?.target || event?.sourceEvent?.target);
    if (!itemBar) return;

    const rect = itemBar.getBoundingClientRect();
    const hasSpaceBelow = rect.bottom + MENU_HEIGHT + SPACING < window.innerHeight;
    const isTop = !hasSpaceBelow;

    // Calculate placement and position
    datePickerPlacement.value = calculatePlacement(isTop, dateType);
    datePickerTriggerStyle.value = {
      left: `${dateType === "start" ? rect.left : rect.right}px`,
      top: `${isTop ? rect.top - SPACING : rect.bottom + SPACING}px`,
    };

    nextTick(() => datePickerMenu.value?.openMenu());
  };

  const closeDatePicker = () => {
    datePickerMenu.value?.closeMenu();
    currentEditingItem.value = null;
    currentDateType.value = null;
    datePickerJustClosed.value = true;

    // Clear any existing timeout and set new one
    clearCloseTimeout();
    datePickerCloseTimeout = setTimeout(() => {
      datePickerJustClosed.value = false;
      datePickerCloseTimeout = null;
    }, CLOSE_DELAY);
  };

  const handleDateChange = (newDate) => {
    if (!currentEditingItem.value || !currentDateType.value || !newDate) {
      closeDatePicker();
      return;
    }

    const dateString = moment(newDate).format(DATE_FORMAT);
    const isStart = currentDateType.value === "start";

    ganttChartStore.updateItemTime(
      currentEditingItem.value._id,
      isStart ? dateString : null,
      isStart ? null : dateString
    );

    closeDatePicker();
  };

  // Cleanup function
  const cleanup = () => {
    clearCloseTimeout();
  };

  return {
    // State
    datePickerMenu,
    datePickerTrigger,
    datePickerValue,
    datePickerTriggerStyle,
    datePickerPlacement,
    currentEditingItem,
    currentDateType,
    datePickerJustClosed,
    datePickerModelValue,
    // Functions
    openDatePicker,
    closeDatePicker,
    handleDateChange,
    findItemBar,
    cleanup,
  };
};

