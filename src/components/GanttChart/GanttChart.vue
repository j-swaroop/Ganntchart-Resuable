<template>
  <div class="gantt-wrapper">
    <div class="gantt-header" ref="headerRef">
      <svg class="chart-header-svg" ref="headerSvgRef"></svg>
    </div>
    <div
      class="gantt-content"
      ref="containerRef"
      @mousemove="handleMouseMoveGanttChart"
      @mouseleave="showCursorToolTip = false"
    >
      <svg ref="svgRef" class="gantt-chart-svg"></svg>
    </div>
    <div
      v-if="showCursorToolTip"
      class="add-milestone-pointer-tooltip"
      :style="{
        position: 'fixed',
        left: cursorTooltipPosition.x + 'px',
        top: cursorTooltipPosition.y + 'px',
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M6 11.375C3.035 11.375 0.625 8.965 0.625 6C0.625 3.035 3.035 0.625 6 0.625C8.965 0.625 11.375 3.035 11.375 6C11.375 8.965 8.965 11.375 6 11.375ZM6 1.375C3.45 1.375 1.375 3.45 1.375 6C1.375 8.55 3.45 10.625 6 10.625C8.55 10.625 10.625 8.55 10.625 6C10.625 3.45 8.55 1.375 6 1.375Z"
          fill="#4B5563"
        />
        <path
          d="M8 6.375H4C3.795 6.375 3.625 6.205 3.625 6C3.625 5.795 3.795 5.625 4 5.625H8C8.205 5.625 8.375 5.795 8.375 6C8.375 6.205 8.205 6.375 8 6.375Z"
          fill="#4B5563"
        />
        <path
          d="M6 8.375C5.795 8.375 5.625 8.205 5.625 8V4C5.625 3.795 5.795 3.625 6 3.625C6.205 3.625 6.375 3.795 6.375 4V8C6.375 8.205 6.205 8.375 6 8.375Z"
          fill="#4B5563"
        />
      </svg>
      Add Milestone
    </div>

    <div class="zoom-controls-pan-view-button-wrapper">
      <div class="zoom-controls-wrapper">
        <div class="button-wrapper" @click="onClickZoomControl('minus')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M7.5 5.3125H2.5C2.32917 5.3125 2.1875 5.17083 2.1875 5C2.1875 4.82917 2.32917 4.6875 2.5 4.6875H7.5C7.67083 4.6875 7.8125 4.82917 7.8125 5C7.8125 5.17083 7.67083 5.3125 7.5 5.3125Z"
              fill="#6B7280"
            />
          </svg>
        </div>
        <div class="button-wrapper" @click="onClickZoomControl('plus')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M7.5 5.3125H2.5C2.32917 5.3125 2.1875 5.17083 2.1875 5C2.1875 4.82917 2.32917 4.6875 2.5 4.6875H7.5C7.67083 4.6875 7.8125 4.82917 7.8125 5C7.8125 5.17083 7.67083 5.3125 7.5 5.3125Z"
              fill="#6B7280"
            />
            <path
              d="M5 7.8125C4.82917 7.8125 4.6875 7.67083 4.6875 7.5V2.5C4.6875 2.32917 4.82917 2.1875 5 2.1875C5.17083 2.1875 5.3125 2.32917 5.3125 2.5V7.5C5.3125 7.67083 5.17083 7.8125 5 7.8125Z"
              fill="#6B7280"
            />
          </svg>
        </div>
      </div>

      <div
        class="pan-view-button-wrapper"
        :class="{ 'is-active': isPanModeActive }"
        @click="onClickPanViewButton"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M13 1.07V9h7c0 4.08-3.05 7.44-7 7.93v2.02c4.95-.5 9-4.76 9-9.95h-9V1.07zM11 1.07V11H2c0 5.19 4.05 9.45 9 9.95v-2.02c-3.95-.49-7-3.85-7-7.93h7V1.07z"
            fill="#6B7280"
          />
        </svg>
      </div>
    </div>

    <div class="start-project-schedule-buttons-wrapper">
      <div class="button-wrapper" @click="onClickProjectScheduleDateButton">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M3.98906 7.84172C3.9099 7.84172 3.83073 7.81255 3.76823 7.75005L1.23906 5.22088C1.11823 5.10005 1.11823 4.90005 1.23906 4.77922L3.76823 2.25005C3.88906 2.12922 4.08906 2.12922 4.2099 2.25005C4.33073 2.37088 4.33073 2.57088 4.2099 2.69172L1.90156 5.00005L4.2099 7.30838C4.33073 7.42922 4.33073 7.62922 4.2099 7.75005C4.15156 7.81255 4.06823 7.84172 3.98906 7.84172Z"
            fill="#6B7280"
          />
          <path
            d="M8.53984 5.3125H1.52734C1.35651 5.3125 1.21484 5.17083 1.21484 5C1.21484 4.82917 1.35651 4.6875 1.52734 4.6875H8.53984C8.71068 4.6875 8.85234 4.82917 8.85234 5C8.85234 5.17083 8.71068 5.3125 8.53984 5.3125Z"
            fill="#6B7280"
          />
        </svg>
      </div>
      <div class="button-wrapper" @click="onClickTodayDateButton">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
        >
          <path
            d="M6.0612 9.34171C5.9237 9.34171 5.79453 9.25004 5.75703 9.10837C5.7112 8.94171 5.8112 8.77087 5.98203 8.72504C7.6737 8.27921 8.85286 6.74587 8.85286 4.99587C8.85286 2.87087 7.1237 1.14171 4.9987 1.14171C3.19453 1.14171 2.0112 2.19587 1.45703 2.83337H2.68203C2.85286 2.83337 2.99453 2.97504 2.99453 3.14587C2.99453 3.31671 2.85703 3.46254 2.68203 3.46254H0.836198C0.815365 3.46254 0.777865 3.45837 0.748698 3.45004C0.711198 3.43754 0.677865 3.42087 0.648698 3.40004C0.611198 3.37504 0.582031 3.34171 0.561198 3.30421C0.540365 3.26671 0.523698 3.22087 0.519531 3.17504C0.519531 3.16254 0.519531 3.15421 0.519531 3.14171V1.25004C0.519531 1.07921 0.661198 0.937541 0.832031 0.937541C1.00286 0.937541 1.14453 1.07921 1.14453 1.25004V2.24587C1.8237 1.51671 3.10286 0.520874 4.9987 0.520874C7.46953 0.520874 9.47786 2.52921 9.47786 5.00004C9.47786 7.03337 8.10703 8.81671 6.14036 9.33337C6.11536 9.33754 6.0862 9.34171 6.0612 9.34171Z"
            fill="#6B7280"
          />
          <path
            d="M4.70286 9.47083C4.69453 9.47083 4.6862 9.46667 4.68203 9.46667C4.23203 9.4375 3.79036 9.3375 3.3737 9.175C3.25286 9.12917 3.16953 9.00833 3.1737 8.87917C3.1737 8.84167 3.18203 8.80417 3.19453 8.77083C3.25703 8.6125 3.44453 8.53333 3.5987 8.59167C3.9612 8.73333 4.34036 8.81667 4.7237 8.84583C4.8862 8.85417 5.01536 8.99583 5.01536 9.1625L5.0112 9.17917C5.00286 9.34167 4.86536 9.47083 4.70286 9.47083ZM2.40703 8.575C2.3362 8.575 2.26953 8.55 2.2112 8.50833C1.8612 8.225 1.55286 7.89583 1.30286 7.52917C1.26536 7.475 1.24453 7.41667 1.24453 7.35417C1.24453 7.25 1.29453 7.15417 1.38203 7.09583C1.51953 7 1.71953 7.0375 1.81536 7.17083C1.81536 7.175 1.81536 7.175 1.81536 7.175C1.81953 7.17917 1.8237 7.1875 1.82786 7.19167C2.04453 7.50417 2.30703 7.78333 2.60286 8.01667C2.6737 8.075 2.71953 8.1625 2.71953 8.25833C2.71953 8.32917 2.6987 8.4 2.65286 8.45833C2.59036 8.53333 2.50286 8.575 2.40703 8.575ZM1.01536 6.54167C0.877865 6.54167 0.757031 6.45417 0.719531 6.325C0.586198 5.89583 0.519531 5.45 0.519531 5V4.99583C0.523698 4.825 0.661198 4.6875 0.832031 4.6875C1.00286 4.6875 1.14453 4.82917 1.14453 5C1.14453 5.39167 1.20286 5.775 1.31536 6.1375C1.3237 6.17083 1.32786 6.2 1.32786 6.23333C1.32786 6.36667 1.24036 6.4875 1.10703 6.52917C1.07786 6.5375 1.0487 6.54167 1.01536 6.54167Z"
            fill="#6B7280"
          />
        </svg>
      </div>
    </div>

    <!-- Date Picker for item date editing using OMenu for outside click handling -->
    <OMenu
      class="gantt-date-picker-menu"
      ref="datePickerMenu"
      menu-class="gantt-date-picker-menu-content"
      :placement="datePickerPlacement"
      :close-on-outside-click="true"
      :close-on-esc="true"
      :custom-position-element="datePickerTrigger"
      @close="closeDatePicker"
    >
      <template #trigger>
        <div
          ref="datePickerTrigger"
          class="gantt-date-picker-trigger"
          :style="datePickerTriggerStyle"
        ></div>
      </template>
      <template #content>
        <div class="gantt-date-picker-content">
          <div class="relative-days-wrapper">
            <div
              v-for="item in relativeDays"
              :key="item._id"
              @click.stop="onClickRelativeDay(item)"
              tabindex="0"
            >
              <span>{{ item.name }}</span>
            </div>
          </div>
          <div class="date-picker-placeholder">
            Add your date picker here
          </div>
        </div>
      </template>
    </OMenu>

    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
    </div>

    <!-- Custom tooltip for date display -->
    <div v-if="tooltipVisible" class="gantt-date-tooltip" :style="tooltipStyle">
      {{ tooltipText }}
    </div>

    <!-- Context menu for right-click on items (using OMenu only) -->
    <OMenu
      ref="contextMenuMenu"
      class="gantt-context-menu"
      menu-class="gantt-context-menu-content"
      :placement="contextMenuPlacement"
      :close-on-outside-click="true"
      :close-on-esc="true"
      :custom-position-element="contextMenuTrigger"
      @close="closeContextMenu"
    >
      <template #trigger>
        <div
          ref="contextMenuTrigger"
          class="gantt-date-picker-trigger"
          :style="contextMenuTriggerStyle"
        ></div>
      </template>
      <template #content>
        <div v-if="contextMenuItem" class="gantt-context-menu-content">
          <div
            v-for="item in contextMenuItems"
            :key="item._id"
            class="gantt-context-menu-item"
            @click="onContextMenuSelect(item)"
          >
            <div class="basic-dropdown-item-option-wrapper">
              <img v-if="item.icon" :src="appImages[item.icon]" alt="" />
              <div>{{ item["name"] ? item["name"] : item }}</div>
            </div>
          </div>
        </div>
      </template>
    </OMenu>

  </div>
</template>

<script setup>
import * as d3 from "d3";
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";

import { useGanttChart } from "@/stores/ganttChart.store";
import { useGanttContextMenu } from "@/composables/useGanttContextMenu";

import OMenu from "@/components/sharedComponents/OMenu.vue";
import moment from "moment";

// Props
const props = defineProps({
  viewMode: {
    type: String,
    default: "daily", // 'daily', 'weekly', 'monthly'
    validator: (value) => ["daily", "weekly", "monthly"].includes(value),
  },
});

// Emits
const emit = defineEmits(["add-milestone"]);

const ganttChartStore = useGanttChart();

// Date picker state
const datePickerMenu = ref(null);
const datePickerTrigger = ref(null);
const datePickerValue = ref(null); // Will store Date object
const datePickerTriggerStyle = ref({});
const datePickerPlacement = ref("bottom-start");
const currentEditingItem = ref(null);
const currentDateType = ref(null); // 'start' or 'end'
const datePickerJustClosed = ref(false); // Flag to prevent milestone button from showing immediately after closing
let datePickerCloseTimeout = null;

// Tooltip state
const tooltipVisible = ref(false);
const tooltipText = ref("");
const tooltipStyle = ref({});

// Computed property for VueDatePicker (datePickerValue is always a Date object)
const datePickerModelValue = computed({
  get: () => datePickerValue.value || null,
  set: (val) => {
    datePickerValue.value = val;
  },
});

// Relative days options
const relativeDays = [
  { _id: 1, name: "Today" },
  { _id: 2, name: "Tomorrow" },
  { _id: 3, name: "In 3 days" },
];

const { phasesList, loadingItems } = storeToRefs(ganttChartStore);

const svgRef = ref(null);
const headerSvgRef = ref(null);
const headerRef = ref(null);
const containerRef = ref(null);

let dependencyMode = false;
let hasScrolledToToday = false; // Flag to scroll only once
let xScale = null; // Store the scale for scrolling
let resizeObserver = null; // Store observer for cleanup

// Component-level drag state tracking (persists across re-renders)
const isAnyDragActive = ref(false);
const activeDragItemIdRef = ref(null);
const pendingRender = ref(false);

// Vertical drag state
let isDraggingVertically = false;
let draggedItem = null;
let draggedItemOriginalY = 0;
let dragPointerStartY = 0;

// Pan/zoom state
const zoomFactor = ref(1);
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_SENSITIVITY = 0.0012;

const isSpacePressed = ref(false);
const isPanModeActive = ref(false);
let isPanning = false;

// Auto-scroll state
let autoScrollId = null;

// Helper function to start auto-scrolling
function startAutoScroll(direction, speed) {
  // Stop any existing scroll
  stopAutoScroll();
  
  const container = containerRef.value;
  if (!container) return;
  
  // Scroll based on direction
  autoScrollId = setInterval(() => {
    if (direction === 'up') {
      container.scrollTop -= speed;
    } else if (direction === 'down') {
      container.scrollTop += speed;
    } else if (direction === 'left') {
      container.scrollLeft -= speed;
    } else if (direction === 'right') {
      container.scrollLeft += speed;
    }
  }, 16); // ~60fps
}

// Helper function to stop auto-scrolling
function stopAutoScroll() {
  if (autoScrollId) {
    clearInterval(autoScrollId);
    autoScrollId = null;
  }
}

// Helper function to handle auto-scroll during drag
function handleAutoScroll(event) {
  const mouseX = event.sourceEvent?.clientX;
  const mouseY = event.sourceEvent?.clientY;

  if (!mouseX || !mouseY) return;

  const container = containerRef.value;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const scrollZone = 60;
  const maxSpeed = 15;

  const distFromTop = mouseY - rect.top;
  const distFromBottom = rect.bottom - mouseY;
  const distFromLeft = mouseX - rect.left;
  const distFromRight = rect.right - mouseX;

  let scrollDirection = null;
  let scrollSpeed = 0;

  // Check if near edges and calculate speed
  if (distFromTop < scrollZone) {
    scrollDirection = 'up';
    scrollSpeed = Math.max(1, maxSpeed * (1 - distFromTop / scrollZone));
  } else if (distFromBottom < scrollZone) {
    scrollDirection = 'down';
    scrollSpeed = Math.max(1, maxSpeed * (1 - distFromBottom / scrollZone));
  } else if (distFromLeft < scrollZone) {
    scrollDirection = 'left';
    scrollSpeed = Math.max(1, maxSpeed * (1 - distFromLeft / scrollZone));
  } else if (distFromRight < scrollZone) {
    scrollDirection = 'right';
    scrollSpeed = Math.max(1, maxSpeed * (1 - distFromRight / scrollZone));
  }

  // Start or stop scrolling
  if (scrollDirection) {
    startAutoScroll(scrollDirection, scrollSpeed);
  } else {
    stopAutoScroll();
  }
}
let panState = {
  startX: 0,
  startY: 0,
  scrollLeft: 0,
  scrollTop: 0,
};

// Add Milestone button state
const showAddMilestoneButton = ref(false);
const addMilestoneButtonPos = ref({ x: 0, y: 0 });
let addMilestoneButtonGroup = null;
let hideButtonOnScrollHandler = null;

let containerMouseDownHandler = null;
let containerWheelHandler = null;
let containerScrollHandler = null;
let windowMouseMoveHandler = null;
let windowMouseUpHandler = null;

let isLoading = ref(false);
// let initialLoaderTriggered = ref(false);

// Context menu composable
const {
  contextMenuMenu,
  contextMenuTrigger,
  contextMenuItem,
  contextMenuTriggerStyle,
  contextMenuPlacement,
  contextMenuItems,
  contextMenuJustClosed,
  openContextMenu,
  closeContextMenu,
  onContextMenuSelect,
} = useGanttContextMenu();

const shouldIgnoreKeyEvent = (event) => {
  const target = event?.target;
  if (!target) return false;
  const tagName = target.tagName ? target.tagName.toLowerCase() : "";
  return (
    tagName === "input" || tagName === "textarea" || target.isContentEditable
  );
};

// Relative day calculations map
const relativeDayMap = {
  Today: () => moment().toDate(),
  Tomorrow: () => moment().add(1, "days").toDate(),
  "In 3 days": () => moment().add(3, "days").toDate(),
};

// Helper to find item bar from event target
const findItemBar = (target) => {
  if (!target) return null;
  let element = target;
  while (element && element !== document.body) {
    const className =
      element.getAttribute?.("class") || element.className?.baseVal || "";
    if (className.includes("item-group")) {
      const children = element.children || element.childNodes;
      for (let child of children) {
        const childClass =
          child.getAttribute?.("class") || child.className?.baseVal || "";
        if (childClass.includes("item-bar") && child.tagName === "rect")
          return child;
      }
    }
    element = element.parentElement || element.parentNode;
  }
  return null;
};

// Date picker functions
const openDatePicker = (item, dateType, event, itemBarElement = null) => {
  showAddMilestoneButton.value = false;
  if (addMilestoneButtonGroup) {
    addMilestoneButtonGroup.remove();
    addMilestoneButtonGroup = null;
  }

  currentEditingItem.value = item;
  currentDateType.value = dateType;
  datePickerValue.value = (dateType === "start" ? item.startDate : item.dueDate)
    ? new Date(dateType === "start" ? item.startDate : item.dueDate)
    : new Date();

  if (!datePickerTrigger.value) return;

  const itemBar =
    itemBarElement || findItemBar(event?.target || event?.sourceEvent?.target);
  if (!itemBar) return;

  const rect = itemBar.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const menuHeight = 300; // Approximate menu height
  const spacing = 8;

  // Check if there's space below, otherwise position above
  const hasSpaceBelow = rect.bottom + menuHeight + spacing < viewportHeight;
  const isTop = !hasSpaceBelow;

  // Set placement based on dateType and position
  datePickerPlacement.value = isTop
    ? dateType === "start"
      ? "top-start"
      : "top-end"
    : dateType === "start"
    ? "bottom-start"
    : "bottom-end";

  // Position trigger at appropriate edge and vertical position
  datePickerTriggerStyle.value = {
    left: `${dateType === "start" ? rect.left : rect.right}px`,
    top: `${isTop ? rect.top - spacing : rect.bottom + spacing}px`,
  };

  nextTick(() => datePickerMenu.value?.openMenu());
};

const closeDatePicker = () => {
  datePickerMenu.value?.closeMenu();
  currentEditingItem.value = null;
  currentDateType.value = null;

  // Set flag to prevent milestone button from showing immediately after closing
  datePickerJustClosed.value = true;

  // Clear any existing timeout
  if (datePickerCloseTimeout) {
    clearTimeout(datePickerCloseTimeout);
  }

  // Clear flag after delay (300ms should be enough)
  datePickerCloseTimeout = setTimeout(() => {
    datePickerJustClosed.value = false;
    datePickerCloseTimeout = null;
  }, 300);
};

const handleDateChange = (newDate) => {
  if (!currentEditingItem.value || !currentDateType.value || !newDate) {
    closeDatePicker();
    return;
  }

  const dateString = moment(newDate).format("YYYY-MM-DD");
  const isStart = currentDateType.value === "start";

  ganttChartStore.updateItemTime(
    currentEditingItem.value._id,
    isStart ? dateString : null,
    isStart ? null : dateString
  );

  closeDatePicker();
};

const onClickRelativeDay = (item) => {
  const getDate = relativeDayMap[item.name] || relativeDayMap["Today"];
  handleDateChange(getDate());
};

// Tooltip functions
const showTooltip = (element, text, position = "top") => {
  if (!element) return;
  if (props.viewMode === "daily") return;

  const rect = element.getBoundingClientRect();
  const tooltipHeight = 28;
  const spacing = 8;

  let top, left;

  if (position === "top") {
    top = rect.top - tooltipHeight - spacing;
    left = rect.left + rect.width / 2;
  } else {
    top = rect.bottom + spacing;
    left = rect.left + rect.width / 2;
  }

  tooltipText.value = text;
  tooltipStyle.value = {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    transform: "translateX(-50%)",
    zIndex: 10000,
  };
  tooltipVisible.value = true;
};

const hideTooltip = () => {
  tooltipVisible.value = false;
};

const updateContainerCursor = () => {
  if (!containerRef.value) return;
  containerRef.value.classList.toggle("is-space-pressed", isSpacePressed.value);
  containerRef.value.classList.toggle(
    "is-pan-mode-active",
    isPanModeActive.value
  );
  containerRef.value.classList.toggle("is-panning", isPanning);
};

// Computed view configuration
const viewConfig = computed(() => {
  switch (props.viewMode) {
    case "weekly":
      return {
        minWidth: 200, // Minimum width per week
        timeInterval: d3.timeWeek,
        formatLabel: (d) => `Week ${moment(d).week()}`,
        formatTooltip: (d) => moment(d).format("MMM DD"),
      };
    case "monthly":
      return {
        minWidth: 200, // Minimum width per month
        timeInterval: d3.timeMonth,
        formatLabel: (d) => moment(d).format("MMM YYYY"),
        formatTooltip: (d) => moment(d).format("MMMM YYYY"),
      };
    case "daily":
    default:
      return {
        minWidth: 200, // Minimum width per day
        timeInterval: d3.timeDay,
        formatLabel: (d) => d3.timeFormat("%b %d")(d),
        formatTooltip: (d) => moment(d).format("MMM DD, YYYY"),
      };
  }
});

// Computed property to find the earliest start date across all items
const earliestStartDate = computed(() => {
  if (!ganttChartStore.allItems || ganttChartStore.allItems.length === 0) {
    return moment().toDate();
  }

  let earliest = moment(ganttChartStore.allItems[0].startDate).toDate();
  ganttChartStore.allItems.forEach((item) => {
    if (item.startDate) {
      const itemStart = moment(item.startDate).toDate();
      if (itemStart < earliest) {
        earliest = itemStart;
      }
    }
  });

  return earliest;
});

const groupedData = computed(() => {
  const groups = {};
  const OTHER_PHASE_NAME = "Others";

  // First pass: Group items by phase
  ganttChartStore.allItems.forEach((originalItem) => {
    // CRITICAL: Prioritize data from loadingItems if item is being updated
    // This ensures we show the new dates (from drag) immediately, even before API resolves
    // If multiple loadingItems exist for same item (shouldn't happen), use the most recent one
    const loadingItem = loadingItems.value
      .filter((li) => li.itemId === originalItem._id)
      .sort((a, b) => b.startedAt - a.startedAt)[0]; // Most recent first
    
    // Use loadingItem data if available (has new dates), otherwise use original item
    let item = loadingItem?.itemData || originalItem;
    
    const cat = item?.phase?.name || OTHER_PHASE_NAME;
    const textColor = item?.phase?.textColor || "#ffffff";

    if (!groups[cat]) {
      if (cat === OTHER_PHASE_NAME) {
        // Default values for "Other" group
        groups[cat] = {
          phase: OTHER_PHASE_NAME,
          color: "#9CA3AF", // Gray color for "Other"
          items: [],
          minStart: item.startDate,
          maxEnd: item.dueDate,
          textColor: "#ffffff",
        };
      } else {
        groups[cat] = {
          phase: cat,
          color: item?.phase?.colour,
          items: [],
          minStart: item.startDate,
          maxEnd: item.dueDate,
          textColor: textColor,
        };
      }
    }
    groups[cat].items.push(item);
    if (moment(item.startDate).toDate() < moment(groups[cat].minStart).toDate())
      groups[cat].minStart = item.startDate;
    if (moment(item.dueDate).toDate() > moment(groups[cat].maxEnd).toDate())
      groups[cat].maxEnd = item.dueDate;
  });

  // Second pass: Ensure ganttSeq exists and sort items within each group
  Object.values(groups).forEach((group) => {
    // Assign ganttSeq if not present (for new items or API without ganttSeq)
    group.items.forEach((item, index) => {
      if (item.ganttSeq === undefined) {
        item.ganttSeq = index;
      }
    });

    // Sort items by ganttSeq (vertical order)
    group.items.sort((a, b) => (a.ganttSeq || 0) - (b.ganttSeq || 0));
  });

  // // Sort phases in a consistent order
  // const phaseOrder = phasesList.value.map((phase) => phase.name);

  return Object.values(groups).sort((a, b) => {
    // Always put "Other" at the bottom
    if (a.phase === OTHER_PHASE_NAME) return 1;
    if (b.phase === OTHER_PHASE_NAME) return -1;

    // const indexA = phaseOrder.indexOf(a.phase);
    // const indexB = phaseOrder.indexOf(b.phase);

    // // If phase not in order list, put it at the end (but before "Other")
    // if (indexA === -1) return 1;
    // if (indexB === -1) return -1;

    // return indexA - indexB;
    return 0; // Preserve original order for everything else

  });
});

// Setup resize observer to scroll to today (daily) or earliest date (weekly/monthly)
function setupResizeObserver() {
  if (containerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width > 0 && !hasScrolledToToday && xScale && containerRef.value) {
        isLoading.value = true;
        const loaderStartTime = Date.now();

        // For weekly and monthly views, scroll to earliest start date (left side)
        // For daily view, scroll to today (center)
        let targetDate;
        let scrollPosition;

        if (props.viewMode === "weekly" || props.viewMode === "monthly") {
          // Scroll to earliest start date (left side of viewport)
          targetDate = earliestStartDate.value;
          const earliestPosition = xScale(targetDate);
          scrollPosition = Math.max(0, earliestPosition - 20); // Small offset from left edge
        } else {
          // Daily view: scroll to today (center)
          targetDate = moment().toDate();
          const todayPosition = xScale(targetDate);
          scrollPosition = todayPosition - containerRef.value.clientWidth / 2;
        }

        const targetScrollLeft = Math.max(0, scrollPosition);

        containerRef.value.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
        hasScrolledToToday = true;
        resizeObserver.disconnect(); // Stop observing after scroll

        // Wait for scroll animation to complete (minimum 1 second display time)
        let lastScrollLeft = containerRef.value.scrollLeft;
        let stableChecks = 0;

        const scrollCheckInterval = setInterval(() => {
          const currentScrollLeft = containerRef.value.scrollLeft;
          const isAtTarget = Math.abs(currentScrollLeft - targetScrollLeft) < 1;
          const isStable = Math.abs(currentScrollLeft - lastScrollLeft) < 1;
          const elapsedTime = Date.now() - loaderStartTime;
          const minDisplayTime = 1000; // 1 second minimum

          if (
            (isAtTarget || (isStable && stableChecks >= 2)) &&
            elapsedTime >= minDisplayTime
          ) {
            clearInterval(scrollCheckInterval);
            isLoading.value = false;
          } else {
            stableChecks = isStable ? stableChecks + 1 : 0;
            lastScrollLeft = currentScrollLeft;
          }
        }, 50);
      }
    });
    resizeObserver.observe(containerRef.value);
  }
}

onMounted(async () => {
  await nextTick();
  renderChart();
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", handleWindowBlur);
  setupResizeObserver();
});

// Cleanup observer on component unmount
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  // Clean up date picker close timeout
  if (datePickerCloseTimeout) {
    clearTimeout(datePickerCloseTimeout);
    datePickerCloseTimeout = null;
  }
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  window.removeEventListener("blur", handleWindowBlur);
  stopPan();
  if (containerRef.value) {
    teardownContainerInteractions(containerRef.value);
    if (hideButtonOnScrollHandler) {
      containerRef.value.removeEventListener(
        "scroll",
        hideButtonOnScrollHandler
      );
      hideButtonOnScrollHandler = null;
    }
  }
  // Cleanup button
  if (addMilestoneButtonGroup) {
    addMilestoneButtonGroup.remove();
    addMilestoneButtonGroup = null;
  }
});

// Watch for changes in items and re-render
watch(
  () => ganttChartStore.allItems,
  () => {
    renderChart();
  },
  { deep: true }
);

// Watch for viewMode changes and re-render
watch(
  () => props.viewMode,
  () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    hasScrolledToToday = false;
    renderChart();
    nextTick(() => {
      setupResizeObserver();
    });
  }
);

// Watch for loadingItems changes to update visual state immediately
watch(
  () => ganttChartStore.loadingItems,
  () => {
    // Re-render to update visual state (locked/unlocked) of items
    renderChart();
  },
  { deep: true }
);

const handleKeyDown = (event) => {
  // Handle Escape key to disable pan mode
  if (event.code === "Escape") {
    if (isPanModeActive.value) {
      event.preventDefault();
      isPanModeActive.value = false;
      if (isPanning) stopPan();
      updateContainerCursor();
    }
    return;
  }

  if (event.code !== "Space") return;
  if (shouldIgnoreKeyEvent(event)) return;
  if (!isSpacePressed.value) {
    event.preventDefault();
    isSpacePressed.value = true;
    updateContainerCursor();
  } else {
    event.preventDefault();
  }
};

const handleKeyUp = (event) => {
  if (event.code !== "Space") return;
  if (isSpacePressed.value) {
    event.preventDefault();
    isSpacePressed.value = false;
    if (isPanning) stopPan();
    updateContainerCursor();
  }
};

const handleWindowBlur = () => {
  if (isSpacePressed.value) {
    isSpacePressed.value = false;
  }
  if (isPanning) {
    stopPan();
  }
  updateContainerCursor();
};

const handlePanMove = (event) => {
  if (!isPanning || !containerRef.value) return;
  const dx = event.clientX - panState.startX;
  const dy = event.clientY - panState.startY;
  containerRef.value.scrollTo({
    left: panState.scrollLeft - dx,
    top: panState.scrollTop - dy,
    behavior: "auto",
  });
};

const stopPan = () => {
  if (!isPanning) return;
  isPanning = false;
  if (windowMouseMoveHandler) {
    window.removeEventListener("mousemove", windowMouseMoveHandler);
    windowMouseMoveHandler = null;
  }
  if (windowMouseUpHandler) {
    window.removeEventListener("mouseup", windowMouseUpHandler);
    windowMouseUpHandler = null;
  }
  updateContainerCursor();
};

const startPan = (event) => {
  if (!containerRef.value) return;
  isPanning = true;
  panState = {
    startX: event.clientX,
    startY: event.clientY,
    scrollLeft: containerRef.value.scrollLeft,
    scrollTop: containerRef.value.scrollTop,
  };
  updateContainerCursor();
  windowMouseMoveHandler = handlePanMove;
  windowMouseUpHandler = stopPan;
  window.addEventListener("mousemove", windowMouseMoveHandler);
  window.addEventListener("mouseup", windowMouseUpHandler);
};

const handleWheel = (event) => {
  if (!containerRef.value) return;
  if (!event.ctrlKey) return;
  event.preventDefault();
  const delta = -event.deltaY;
  const proposedZoom =
    zoomFactor.value + delta * ZOOM_SENSITIVITY * zoomFactor.value;
  const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, proposedZoom));
  if (clampedZoom === zoomFactor.value) return;

  const container = containerRef.value;
  const rect = container.getBoundingClientRect();
  const pointerX = event.clientX - rect.left;
  const reference =
    (container.scrollLeft + pointerX) / Math.max(container.scrollWidth, 1);

  zoomFactor.value = clampedZoom;

  nextTick(() => {
    if (!containerRef.value) return;
    const newScrollWidth = Math.max(containerRef.value.scrollWidth, 1);
    const newScrollLeft = reference * newScrollWidth - pointerX;
    containerRef.value.scrollLeft = Math.max(0, newScrollLeft);
  });
};

const setupContainerInteractions = () => {
  const container = containerRef.value;
  if (!container) return;

  if (!containerMouseDownHandler) {
    containerMouseDownHandler = (event) => {
      if (
        (!isSpacePressed.value && !isPanModeActive.value) ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      startPan(event);
    };
    container.addEventListener("mousedown", containerMouseDownHandler);
  }

  if (!containerWheelHandler) {
    containerWheelHandler = handleWheel;
    container.addEventListener("wheel", containerWheelHandler, {
      passive: false,
    });
  }

  if (!containerScrollHandler) {
    containerScrollHandler = () => {
      if (headerRef.value && containerRef.value && headerSvgRef.value) {
        // Use transform to scroll header since overflow-x is hidden
        const scrollLeft = containerRef.value.scrollLeft;
        headerSvgRef.value.style.transform = `translateX(-${scrollLeft}px)`;
      }
    };
    container.addEventListener("scroll", containerScrollHandler);
  }

  updateContainerCursor();
};

const teardownContainerInteractions = (el) => {
  if (!el) return;
  if (containerMouseDownHandler) {
    el.removeEventListener("mousedown", containerMouseDownHandler);
    containerMouseDownHandler = null;
  }
  if (containerWheelHandler) {
    el.removeEventListener("wheel", containerWheelHandler);
    containerWheelHandler = null;
  }
  if (containerScrollHandler) {
    el.removeEventListener("scroll", containerScrollHandler);
    containerScrollHandler = null;
  }
};

watch(zoomFactor, () => {
  if (svgRef.value) {
    renderChart();
    // nextTick(() => {
    //   setupResizeObserver();
    // });
  }
});

watch(
  () => containerRef.value,
  (newEl, prevEl) => {
    if (prevEl) {
      teardownContainerInteractions(prevEl);
      if (hideButtonOnScrollHandler) {
        prevEl.removeEventListener("scroll", hideButtonOnScrollHandler);
        hideButtonOnScrollHandler = null;
      }
    }
    if (newEl) {
      setupContainerInteractions();
      // Setup scroll handler for Add Milestone button
      if (!hideButtonOnScrollHandler) {
        hideButtonOnScrollHandler = () => {
          if (addMilestoneButtonGroup) {
            addMilestoneButtonGroup.remove();
            addMilestoneButtonGroup = null;
            showAddMilestoneButton.value = false;
          }
        };
        newEl.addEventListener("scroll", hideButtonOnScrollHandler);
      }
    }
  },
  { immediate: true }
);

// Helper function to create vertical drag behavior for item reordering
function createVerticalDragBehavior(params) {
  const {
    item,
    itemGroup,
    bar,
    yPos,
    containerWidth,
    itemPositions,
    phaseBounds,
    chart,
    activeDragItemId,
    ganttChartStore,
  } = params;

  const ROW_HEIGHT = 40;
  const ITEM_HEIGHT = 32;
  const HALF_ITEM_HEIGHT = ITEM_HEIGHT / 2;
  const PLACEHOLDER = "__drag_placeholder__";

  let dropIndicator = null;
  let currentPreviewPhase = null;
  let currentPreviewInsertIndex = null;

  const chartNode = chart.node ? chart.node() : null;

  const getPointerYRelativeToChart = (dragEvent) => {
    if (!chartNode) return dragPointerStartY;
    const sourceEvent = dragEvent.sourceEvent || dragEvent;
    if (!sourceEvent) return dragPointerStartY;
    const [, pointerY] = d3.pointer(sourceEvent, chartNode);
    return pointerY;
  };

  const getPhaseAtY = (yCoord) => {
    return (
      Object.entries(phaseBounds).find(([, bounds]) => {
        return yCoord >= bounds.yStart && yCoord <= bounds.yEnd;
      })?.[0] || null
    );
  };

  const getPhasePositions = (phase, excludeDragged = true) => {
    if (!phase) return [];
    return itemPositions
      .filter((pos) => {
        if (excludeDragged && draggedItem && pos.item._id === draggedItem._id) {
          return false;
        }
        return pos.phase === phase;
      })
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  };

  const resetPreviewTransforms = () => {
    itemPositions.forEach((pos) => {
      if (draggedItem && pos.item._id === draggedItem._id) return;
      pos.itemGroup?.attr("transform", null);
    });
  };

  const applyPreviewForPhase = (phase, insertIndex = null) => {
    if (!phase) return;
    const positions = getPhasePositions(phase, true);
    if (!positions.length) return;

    const previewOrder = [...positions];
    if (insertIndex !== null && insertIndex !== undefined) {
      const clampedIndex = Math.max(
        0,
        Math.min(insertIndex, previewOrder.length)
      );
      previewOrder.splice(clampedIndex, 0, PLACEHOLDER);
    }

    let indexCounter = 0;
    previewOrder.forEach((entry) => {
      if (entry === PLACEHOLDER) {
        indexCounter++;
        return;
      }
      const offsetRows = indexCounter - (entry.orderIndex ?? indexCounter);
      if (offsetRows === 0) {
        entry.itemGroup?.attr("transform", null);
      } else {
        entry.itemGroup?.attr(
          "transform",
          `translate(0, ${offsetRows * ROW_HEIGHT})`
        );
      }
      indexCounter++;
    });
  };

  const hideDropIndicator = () => {
    if (dropIndicator) {
      dropIndicator.style("opacity", 0);
    }
  };

  const updateDropIndicatorPosition = (phase, insertIndex) => {
    if (!dropIndicator || insertIndex === null || insertIndex === undefined) {
      hideDropIndicator();
      return;
    }
    const bounds = phaseBounds[phase];
    if (!bounds) {
      hideDropIndicator();
      return;
    }

    const positions = getPhasePositions(phase, true);
    const clampedIndex = Math.max(0, Math.min(insertIndex, positions.length));

    let indicatorY;
    if (!positions.length) {
      indicatorY = bounds.itemAreaStart ?? bounds.yStart + ROW_HEIGHT;
    } else if (clampedIndex === 0) {
      indicatorY = positions[0].yStart;
    } else if (clampedIndex === positions.length) {
      indicatorY = positions[positions.length - 1].yStart + ROW_HEIGHT;
    } else {
      indicatorY = positions[clampedIndex].yStart;
    }

    dropIndicator
      .attr("y1", indicatorY)
      .attr("y2", indicatorY)
      .style("opacity", 1);
  };

  const computeInsertIndex = (phase, metrics = {}) => {
    const positions = getPhasePositions(phase, true);
    if (!positions.length) return 0;

    const { leadingEdgeY, centerY, direction } = metrics;

    if (direction && leadingEdgeY !== undefined) {
      if (direction < 0) {
        for (let i = 0; i < positions.length; i++) {
          if (leadingEdgeY <= positions[i].yStart) {
            return i;
          }
        }
      } else if (direction > 0) {
        for (let i = positions.length - 1; i >= 0; i--) {
          if (leadingEdgeY >= positions[i].yEnd) {
            return i + 1;
          }
        }
      }
    }

    const referenceY = centerY ?? leadingEdgeY ?? 0;
    let index = 0;
    positions.forEach((pos) => {
      const center = pos.yStart + HALF_ITEM_HEIGHT;
      if (referenceY > center) {
        index++;
      }
    });
    return index;
  };

  const computeTargetGanttSeq = (phase, insertIndex) => {
    const positions = getPhasePositions(phase, true);
    const clampedIndex = Math.max(
      0,
      Math.min(insertIndex ?? positions.length, positions.length)
    );

    if (positions[clampedIndex]) {
      return positions[clampedIndex].ganttSeq;
    }
    if (positions.length) {
      return positions[positions.length - 1].ganttSeq + 1;
    }
    return 0;
  };

  return d3
    .drag()
    .on("start", function (event) {
      // Only allow vertical drag if not in dependency mode or pan mode
      if (
        dependencyMode ||
        activeDragItemId !== null ||
        isSpacePressed.value ||
        isPanModeActive.value
      )
        return;

      isDraggingVertically = true;
      draggedItem = item;
      draggedItemOriginalY = yPos;
      dragPointerStartY = getPointerYRelativeToChart(event);
      currentPreviewPhase = null;
      currentPreviewInsertIndex = null;

      // Set component-level drag state
      isAnyDragActive.value = true;
      activeDragItemIdRef.value = item._id;

      // Create drop indicator line
      dropIndicator = chart
        .append("line")
        .attr("class", "drop-indicator")
        .attr("x1", 0)
        .attr("x2", containerWidth)
        .attr("stroke", "#516CE0")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .style("opacity", 0);
    })
    .on("drag", function (event) {
      if (!isDraggingVertically) return;
      // Block drag if pan mode is active
      if (dependencyMode || isSpacePressed.value || isPanModeActive.value) {
        return;
      }

      // Decrease opacity when drag happens (this handler only fires on actual drag)
      bar.style("cursor", "grabbing");
      itemGroup.style("opacity", 0.6);

      const pointerY = getPointerYRelativeToChart(event);
      const deltaY = pointerY - dragPointerStartY;
      const draggedTop = draggedItemOriginalY + deltaY;
      const draggedBottom = draggedTop + ITEM_HEIGHT;
      const draggedCenterY = draggedTop + HALF_ITEM_HEIGHT;
      const direction = deltaY === 0 ? 0 : deltaY > 0 ? 1 : -1;
      const leadingEdgeY =
        direction === 0
          ? draggedCenterY
          : direction > 0
          ? draggedBottom
          : draggedTop;

      itemGroup.attr("transform", `translate(0, ${deltaY})`);
      resetPreviewTransforms();

      const hoveredPhase = getPhaseAtY(leadingEdgeY);

      if (hoveredPhase) {
        const insertIndex = computeInsertIndex(hoveredPhase, {
          leadingEdgeY,
          centerY: draggedCenterY,
          direction,
        });
        currentPreviewPhase = hoveredPhase;
        currentPreviewInsertIndex = insertIndex;

        const draggedPhase = draggedItem?.phase?.name;
        if (hoveredPhase === draggedPhase) {
          applyPreviewForPhase(hoveredPhase, insertIndex);
        } else {
          applyPreviewForPhase(draggedPhase, null);
          applyPreviewForPhase(hoveredPhase, insertIndex);
        }

        updateDropIndicatorPosition(hoveredPhase, insertIndex);
      } else {
        currentPreviewPhase = null;
        currentPreviewInsertIndex = null;
        const draggedPhase = draggedItem?.phase?.name;
        applyPreviewForPhase(draggedPhase, null);
        hideDropIndicator();
      }
    })
    .on("end", function (event) {
      if (!isDraggingVertically) return;
      // Block end handler if pan mode is active
      if (dependencyMode || isSpacePressed.value || isPanModeActive.value) {
        // Reset state
        isDraggingVertically = false;
        draggedItem = null;
        // Clear component-level state
        if (activeDragItemIdRef.value === item._id) {
          isAnyDragActive.value = false;
          activeDragItemIdRef.value = null;
        }
        return;
      }

      // Validate item still exists in store before applying updates
      const currentItem = ganttChartStore.allItems.find((i) => i._id === item._id);
      if (!currentItem) {
        // Item was removed during drag, just reset state
        isDraggingVertically = false;
        draggedItem = null;
        draggedItemOriginalY = 0;
        dragPointerStartY = 0;
        currentPreviewPhase = null;
        currentPreviewInsertIndex = null;
        isAnyDragActive.value = false;
        activeDragItemIdRef.value = null;
        itemGroup.style("opacity", 1);
        itemGroup.attr("transform", null);
        bar.style("cursor", "grab");
        resetPreviewTransforms();
        hideDropIndicator();
        if (dropIndicator) {
          dropIndicator.remove();
          dropIndicator = null;
        }
        // Trigger pending render if any
        if (pendingRender.value) {
          nextTick(() => {
            renderChart();
          });
        }
        return;
      }

      itemGroup.style("opacity", 1);
      itemGroup.attr("transform", null);
      bar.style("cursor", "grab");

      resetPreviewTransforms();
      hideDropIndicator();

      if (dropIndicator) {
        dropIndicator.remove();
        dropIndicator = null;
      }

      const pointerY = getPointerYRelativeToChart(event);
      const deltaY = pointerY - dragPointerStartY;
      const draggedTop = draggedItemOriginalY + deltaY;
      const draggedBottom = draggedTop + ITEM_HEIGHT;
      const draggedCenterY = draggedTop + HALF_ITEM_HEIGHT;
      const direction = deltaY === 0 ? 0 : deltaY > 0 ? 1 : -1;
      const leadingEdgeY =
        direction === 0
          ? draggedCenterY
          : direction > 0
          ? draggedBottom
          : draggedTop;

      const hoveredPhase = getPhaseAtY(leadingEdgeY);
      const draggedPhase = draggedItem?.phase?.name;
      const targetPhaseName =
        currentPreviewPhase || hoveredPhase || draggedPhase;

      let insertIndex;
      if (currentPreviewPhase) {
        insertIndex = currentPreviewInsertIndex;
      } else {
        insertIndex = computeInsertIndex(targetPhaseName, {
          leadingEdgeY,
          centerY: draggedCenterY,
          direction,
        });
      }

      const targetGanttSeq =
        targetPhaseName !== null
          ? computeTargetGanttSeq(targetPhaseName, insertIndex)
          : null;

      // Clear component-level drag state before API call
      isAnyDragActive.value = false;
      activeDragItemIdRef.value = null;

      if (
        targetPhaseName &&
        targetGanttSeq !== null &&
        (targetPhaseName !== draggedPhase ||
          targetGanttSeq !== draggedItem.ganttSeq)
      ) {
        // Get the phase object from phaseBounds
        const phaseBoundsData = phaseBounds[targetPhaseName];
        const targetPhaseObject = phaseBoundsData?.phaseObject;

        // Handle "Others" phase - send null/empty phase to API
        if (targetPhaseName === "Others") {
          ganttChartStore.updateItemPosition(
            draggedItem,
            null, // Pass null for "Others" phase
            targetGanttSeq
          );
        } else if (targetPhaseObject) {
          ganttChartStore.updateItemPosition(
            draggedItem,
            targetPhaseObject,
            targetGanttSeq
          );
        }

        nextTick(() => {
          renderChart();
        });
      } else {
        // No position change, but trigger pending render if any
        if (pendingRender.value) {
          nextTick(() => {
            renderChart();
          });
        }
      }

      // Reset drag state
      isDraggingVertically = false;
      draggedItem = null;
      draggedItemOriginalY = 0;
      dragPointerStartY = 0;
      currentPreviewPhase = null;
      currentPreviewInsertIndex = null;
    });
}

// Helper function to create horizontal drag behavior for moving items in time
function createHorizontalDragBehavior(params) {
  const {
    item,
    itemGroup,
    bar,
    xStart,
    width,
    start,
    end,
    x,
    containerWidth,
    leftIndent,
    rightIndent,
    leftDragZone,
    rightDragZone,
    labelContainer,
    statusText,
    leftLine,
    rightLine,
    leftCube,
    rightCube,
    activateDragVisuals,
    getActiveDragItemId,
    setActiveDragItemId,
    ganttChartStore,
  } = params;

  let originalDuration = 0; // Store original duration in milliseconds
  let dragStartX = 0; // Store initial drag position
  let dragStartY = 0; // Store initial Y position for direction detection
  let isHorizontalDrag = false; // Track if this is a horizontal drag
  let dragStarted = false; // Track if drag has been confirmed as horizontal

  return d3
    .drag()
    .on("start", function (event) {
      // Block if item is currently loading (being updated via API)
      if (ganttChartStore.isItemLoading(item._id)) {
        event.sourceEvent?.stopPropagation();
        event.sourceEvent?.preventDefault();
        return;
      }

      // Only block on dependency mode or pan mode (space or button)
      if (dependencyMode || isSpacePressed.value || isPanModeActive.value) {
        return;
      }

      // Check if pointer is in center area (not on left/right edges where resize zones are)
      const pointerX = event.x;
      const barX = xStart;
      const relativeX = pointerX - barX;

      // If pointer is on left or right edge (resize zones), don't handle horizontal drag
      if (relativeX < 10 || relativeX > width - 10) {
        return; // Let resize drags handle it
      }

      // Store initial positions for direction detection
      dragStartX = event.x;
      dragStartY = event.y;
      isHorizontalDrag = false;
      dragStarted = false;

      // Calculate original duration in milliseconds
      originalDuration = end - start;

      // Don't set activeDragItemId here - wait to confirm direction in drag handler
    })
    .on("drag", function (event) {
      console.log("drag", event);
      // Block drag if pan mode is active
      if (dependencyMode || isSpacePressed.value || isPanModeActive.value) {
        return;
      }

      // If drag hasn't started yet, check direction to determine if this is horizontal
      if (!dragStarted) {
        const deltaX = Math.abs(event.x - dragStartX);
        const deltaY = Math.abs(event.y - dragStartY);

        // If ONLY vertical movement (no horizontal), exit and let vertical drag handle it
        if (deltaY > deltaX && deltaY > 5 && deltaX < 3) {
          isHorizontalDrag = false;
          dragStarted = false;
          return; // Let vertical drag handle it alone
        }

        // If horizontal movement is detected, proceed with horizontal drag
        // The unified drag handler ensures only one direction is active at a time
        if (deltaX >= 3) {
          // Check if another item is being dragged
          const currentActive = getActiveDragItemId();
          if (currentActive !== null && currentActive !== item._id) {
            // Another item is being dragged, don't interfere
            return;
          }

          isHorizontalDrag = true;
          dragStarted = true;
          setActiveDragItemId(item._id);
          // Set component-level drag state
          isAnyDragActive.value = true;
          activeDragItemIdRef.value = item._id;
          activateDragVisuals();
          // Hide status label while horizontally dragging
          if (statusText) {
            statusText.style("opacity", 0);
          }
          bar.style("cursor", "grabbing");
        } else {
          // Not enough horizontal movement yet, wait
          return;
        }
      }

      // Only proceed if this is confirmed as a horizontal drag
      if (!isHorizontalDrag || !dragStarted) return;

      // Only block if another item is being dragged
      const currentActive = getActiveDragItemId();
      if (currentActive !== null && currentActive !== item._id) {
        return;
      }

      // Calculate delta from start position
      const deltaX = event.x - dragStartX;
      const newX = Math.max(
        0,
        Math.min(xStart + deltaX, containerWidth - width)
      );

      // Calculate new end position
      const newEndX = newX + width;

      // Clamp to container bounds
      if (newEndX > containerWidth) {
        const adjustedX = Math.max(0, containerWidth - width);
        const adjustedEndX = containerWidth;

        // Update bar position and width
        bar.attr("x", adjustedX).attr("width", adjustedEndX - adjustedX);

        // Update all related elements
        leftIndent.attr("x", adjustedX + 2);
        rightIndent.attr("x", adjustedEndX - 4);
        leftDragZone.attr("x", adjustedX - 4);
        rightDragZone.attr("x", adjustedEndX - 8);
        labelContainer.attr("x", adjustedX + 14);
        if (statusText) statusText.attr("x", adjustedEndX - 14);

        // Update connector lines and cubes
        leftLine.attr("x1", adjustedX).attr("x2", adjustedX - 12);
        leftCube.attr("x", adjustedX - 20);
        rightLine.attr("x1", adjustedEndX).attr("x2", adjustedEndX + 12);
        rightCube.attr("x", adjustedEndX + 12);
      } else {
        // Update bar position (width stays the same)
        bar.attr("x", newX);

        // Update all related elements
        leftIndent.attr("x", newX + 2);
        rightIndent.attr("x", newX + width - 4);
        leftDragZone.attr("x", newX - 4);
        rightDragZone.attr("x", newX + width - 8);
        labelContainer.attr("x", newX + 14);
        if (statusText) statusText.attr("x", newX + width - 14);

        // Update connector lines and cubes
        leftLine.attr("x1", newX).attr("x2", newX - 12);
        leftCube.attr("x", newX - 20);
        rightLine.attr("x1", newX + width).attr("x2", newX + width + 12);
        rightCube.attr("x", newX + width + 12);
      }
    })
    .on("end", function (event) {
      // Block end handler if pan mode is active
      if (dependencyMode || isSpacePressed.value || isPanModeActive.value) {
        // Reset state
        if (getActiveDragItemId() === item._id) {
          setActiveDragItemId(null);
        }
        // Clear component-level state
        if (activeDragItemIdRef.value === item._id) {
          isAnyDragActive.value = false;
          activeDragItemIdRef.value = null;
        }
        bar.style("cursor", "grab");
        return;
      }

      // Only process if this was a confirmed horizontal drag
      if (
        !isHorizontalDrag ||
        !dragStarted ||
        getActiveDragItemId() !== item._id
      ) {
        // Reset state if drag wasn't horizontal
        if (getActiveDragItemId() === item._id) {
          setActiveDragItemId(null);
        }
        // Clear component-level state
        if (activeDragItemIdRef.value === item._id) {
          isAnyDragActive.value = false;
          activeDragItemIdRef.value = null;
        }
        bar.style("cursor", "grab");
        return;
      }

      // Validate item still exists in store before applying updates
      const currentItem = ganttChartStore.allItems.find((i) => i._id === item._id);
      if (!currentItem) {
        // Item was removed during drag, just reset state
        setActiveDragItemId(null);
        isAnyDragActive.value = false;
        activeDragItemIdRef.value = null;
        bar.style("cursor", "grab");
        // Trigger pending render if any
        if (pendingRender.value) {
          nextTick(() => {
            renderChart();
          });
        }
        return;
      }

      // Calculate final position
      const deltaX = event.x - dragStartX;
      const newX = Math.max(
        0,
        Math.min(xStart + deltaX, containerWidth - width)
      );

      // Calculate new start date and snap to start of day
      const newStartDate = x.invert(newX);
      const snappedStartDate = moment(newStartDate).startOf("day").toDate();

      // Calculate original duration in days (since items are normalized to full days)
      const originalStart = moment(start).startOf("day");
      const originalEnd = moment(end).endOf("day");
      const durationDays = originalEnd.diff(originalStart, "days");

      // Calculate end date based on snapped start date + duration in days
      const snappedEndDate = moment(snappedStartDate)
        .add(durationDays, "days")
        .toDate();

      // Normalize to start/end of day (convert local date to UTC)
      const startOfDay = moment(snappedStartDate)
        .startOf("day")
        .utc()
        .toISOString();
      const endOfDay = moment(snappedEndDate).endOf("day").utc().toISOString();

      // Clear component-level drag state before API call
      isAnyDragActive.value = false;
      activeDragItemIdRef.value = null;

      // Reset state
      setActiveDragItemId(null);
      bar.style("cursor", "grab");

      // Update item dates - this will set loading state and make API call
      // This also triggers fetchItems in background which may complete during drag
      ganttChartStore.updateItemTime(item._id, startOfDay, endOfDay).then(() => {
        console.log("Item time updated successfully");
      }).catch((error) => {
        console.error("Error updating item time:", error);
      });

      // Re-render immediately to show disabled state (loading state is set synchronously in updateItemTime)
      // Also check for pending render (in case refetch completed during drag)
      nextTick(() => {
        renderChart();
      });
    });
}

// Optimized function to check if a point or rectangle overlaps with any item
// This function is outside renderChart for better performance and reusability
function isPointOrRectNearItem(
  svgElement,
  chartElement,
  x,
  y,
  rectWidth = 0,
  rectHeight = 0,
  padding = 5
) {
  if (!svgElement || !chartElement) return false;
  const itemBars = d3.select(svgElement).selectAll(".item-bar").nodes();
  if (!itemBars?.length) return false;

  const x1 = x - padding,
    x2 = x + rectWidth + padding;
  const y1 = y - padding,
    y2 = y + rectHeight + padding;

  for (const bar of itemBars) {
    const itemBar = d3.select(bar);
    const bx = parseFloat(itemBar.attr("x")) || 0;
    const by = parseFloat(itemBar.attr("y")) || 0;
    const bw = parseFloat(itemBar.attr("width")) || 0;
    const bh = parseFloat(itemBar.attr("height")) || 32;

    if (
      x2 >= bx - padding &&
      x1 <= bx + bw + padding &&
      y2 >= by - padding &&
      y1 <= by + bh + padding
    ) {
      return true;
    }
  }
  return false;
}

// Helper function to check if click is on empty space (not on interactive elements)
function isClickOnEmptySpace(event, svg, chart) {
  const target = event.target;
  if (!target || target === svg.node() || target === chart.node()) return true;
  if (target.tagName === "INPUT" || target.tagName === "input") return false;

  const interactiveClasses = [
    "item-bar",
    "indent-",
    "connector-",
    "dependency-line",
    "lag-input-group",
    "item-group",
  ];
  let current = target;
  const svgNode = svg.node();

  while (current && current !== svgNode) {
    const className = current.className?.baseVal || current.className || "";
    if (
      typeof className === "string" &&
      interactiveClasses.some((cls) => className.includes(cls))
    ) {
      return false;
    }
    current = current.parentElement;
  }

  const [clickX, clickY] = d3.pointer(event, chart.node());
  return !isPointOrRectNearItem(
    svg.node(),
    chart.node(),
    clickX,
    clickY,
    0,
    0,
    5
  );
}

// Helper function to create lag input group UI
function createLagInputGroup({
  svg,
  midX,
  midY,
  lagValue,
  item,
  predecessorId,
  linkType,
  dependencyLine,
  ganttChartStore,
  renderChart,
}) {
  const boxWidth = 125; // Reduced to match smaller input width
  const boxHeight = 28;
  const buttonSize = 20; // Increased button width
  const buttonRadius = buttonSize / 2;
  const padding = 4;

  const lagGroup = svg
    .append("g")
    .attr("class", "lag-input-group")
    .attr("data-item-id", item._id)
    .style("opacity", 0)
    .style("pointer-events", "none");

  const lagBox = lagGroup
    .append("rect")
    .attr("class", "lag-input-container")
    .attr("x", midX - boxWidth / 2)
    .attr("y", midY - boxHeight / 2)
    .attr("width", boxWidth)
    .attr("height", boxHeight);

  // Helper function to process lag update (defined early so it can be used in input handlers)
  async function processLagUpdate() {
    console.log("=== PROCESSING LAG UPDATE ===");
    // Handle empty or just "-" as 0, otherwise parse and round (allows negatives)
    const value = this.value?.trim();
    const newLag = value === "" || value === "-" 
      ? 0 
      : Math.round(parseFloat(value) || 0);
    console.log("New lag value:", newLag);
    console.log("Item ID:", item._id);
    console.log("Predecessor ID:", predecessorId);
    console.log("Link type:", linkType);

    if (item.predecessor && item.predecessor.lag !== newLag) {
      // Backend handles date calculation, just update the lag
      await ganttChartStore.updatePredecessorLag(item, newLag);
      console.log("Lag updated in store");

      // Re-render chart to reflect changes
      renderChart();
    }
  }

  // Input field (number only)
  const inputStartX = midX - boxWidth / 2 + padding + buttonRadius * 4 + 8;
  const inputWidth = 15; // Reduced width for single/double digit numbers
  const inputHeight = 20;
  const foreignObject = lagGroup
    .append("foreignObject")
    .attr("x", inputStartX)
    .attr("y", midY - inputHeight / 2)
    .attr("width", inputWidth)
    .attr("height", inputHeight);

  const inputDiv = foreignObject
    .append("xhtml:div")
    .style("width", "100%")
    .style("height", "100%")
    .style("display", "flex")
    .style("align-items", "center")
    .style("justify-content", "center");

  const input = inputDiv
    .append("xhtml:input")
    .attr("type", "number")
    .attr("step", "1")
    .attr("value", lagValue)
    .style("width", "100%")
    .style("height", "100%")
    .style("border", "none")
    .style("outline", "none")
    .style("padding", "0")
    .style("font-size", "11px")
    .style("text-align", "center")
    .style("background", "transparent")
    .on("focus", function () {
      console.log("=== INPUT FOCUS EVENT ===");
      console.log("Input focused, value:", this.value);
    })
    .on("keydown", function (event) {
      console.log("=== KEYDOWN EVENT ===", event.key);
      // Handle Enter key - process update directly
      if (event.key === "Enter") {
        console.log("Enter key pressed, processing update directly");
        event.preventDefault();
        processLagUpdate.call(this);
      }
    })
    .on("input", function (event) {
      console.log("=== INPUT EVENT ===", this.value);
      // Round to whole number, allow negatives
      let value = this.value;
      // Allow typing "-" without rounding
      if (value === "-" || value === "") {
        return;
      }
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        this.value = Math.round(numValue);
      }
    })
    .on("blur", function (event) {
      console.log("=== BLUR EVENT FIRED ===");
      processLagUpdate.call(this, item, predecessorId, linkType);
    });

  // Helper function to create increment/decrement buttons (defined after input is created)
  const createButton = (type, xOffset, onChange) => {
    const button = lagGroup
      .append("g")
      .attr("class", "lag-input-button")
      .on("click", function(event) {
        event.stopPropagation();
        
        // Only update the input value visually - don't call processLagUpdate
        // This prevents renderChart() from being triggered and hiding the container
        const currentValue = parseInt(input.node().value) || 0;
        const newValue = onChange(currentValue);
        input.node().value = newValue;
        input.node().focus();
        // processLagUpdate will be called on blur/enter instead
      });

    const buttonX = midX - boxWidth / 2 + padding + xOffset - buttonSize / 2;
    const buttonY = midY - buttonSize / 2;
    
    // Create rounded rectangle container
    button
      .append("rect")
      .attr("class", "lag-input-button-container")
      .attr("x", buttonX)
      .attr("y", buttonY)
      .attr("width", buttonSize)
      .attr("height", buttonSize)
      .attr("rx", 10);

    // Create SVG group for icon paths (centered in button)
    const iconGroup = button
      .append("g")
      .attr("transform", `translate(${buttonX + buttonSize / 2 - 5}, ${buttonY + buttonSize / 2 - 5})`);

    if (type === "minus") {
      // Minus icon path
      iconGroup
        .append("path")
        .attr("d", "M7.5 5.3125H2.5C2.32917 5.3125 2.1875 5.17083 2.1875 5C2.1875 4.82917 2.32917 4.6875 2.5 4.6875H7.5C7.67083 4.6875 7.8125 4.82917 7.8125 5C7.8125 5.17083 7.67083 5.3125 7.5 5.3125Z")
        .attr("fill", "#6B7280");
    } else {
      // Plus icon paths
      iconGroup
        .append("path")
        .attr("d", "M7.5 5.3125H2.5C2.32917 5.3125 2.1875 5.17083 2.1875 5C2.1875 4.82917 2.32917 4.6875 2.5 4.6875H7.5C7.67083 4.6875 7.8125 4.82917 7.8125 5C7.8125 5.17083 7.67083 5.3125 7.5 5.3125Z")
        .attr("fill", "#292D32");
      iconGroup
        .append("path")
        .attr("d", "M5 7.8125C4.82917 7.8125 4.6875 7.67083 4.6875 7.5V2.5C4.6875 2.32917 4.82917 2.1875 5 2.1875C5.17083 2.1875 5.3125 2.32917 5.3125 2.5V7.5C5.3125 7.67083 5.17083 7.8125 5 7.8125Z")
        .attr("fill", "#292D32");
    }
    return button;
  };

  // "Days" label text
  const daysLabelX = inputStartX + inputWidth + 4;
  lagGroup
    .append("text")
    .attr("x", daysLabelX)
    .attr("y", midY)
    .attr("dy", "0.35em")
    .attr("class", "lag-input-label")
    .text("Days");

  // Delete button after "Days" text
  const deleteButtonX = daysLabelX + 30; // Position after "Days" text
  const deleteButtonSize = 16;
  const deleteButtonGroup = lagGroup
    .append("g")
    .attr("class", "lag-delete-button")
    .attr(
      "transform",
      `translate(${deleteButtonX}, ${midY - deleteButtonSize / 2}) scale(${deleteButtonSize / 16})`
    )
    .style("cursor", "pointer")
    .style("opacity", 1)
    .on("mouseenter", function () {
      d3.select(this).style("opacity", 1);
      // Change all paths to red on hover
      d3.select(this).selectAll("path").attr("fill", "#EF4444");
    })
    .on("mouseleave", function () {
      d3.select(this).style("opacity", 0.7);
      // Change all paths back to gray
      d3.select(this).selectAll("path").attr("fill", "#6B7280");
    })
    .on("click", async function (event) {
      event.stopPropagation();
      // Remove the dependency using store method with API call
      if (item.predecessor) {
        try {
          await ganttChartStore.removePredecessor(item);
          // Re-render chart after successful removal
          renderChart();
        } catch (error) {
          console.error("Failed to remove predecessor:", error);
          // Optionally show error toast or handle error
        }
      }
    });

  // Add delete icon SVG paths (viewBox is 0 0 16 17)
  deleteButtonGroup
    .append("path")
    .attr(
      "d",
      "M13.9999 4.94775C13.9866 4.94775 13.9666 4.94775 13.9466 4.94775C10.4199 4.59442 6.89994 4.46108 3.41328 4.81442L2.05328 4.94775C1.77328 4.97442 1.52661 4.77442 1.49994 4.49442C1.47328 4.21442 1.67328 3.97442 1.94661 3.94775L3.30661 3.81442C6.85328 3.45442 10.4466 3.59442 14.0466 3.94775C14.3199 3.97442 14.5199 4.22108 14.4933 4.49442C14.4733 4.75442 14.2533 4.94775 13.9999 4.94775Z"
    )
    .attr("fill", "#6B7280");
  deleteButtonGroup
    .append("path")
    .attr(
      "d",
      "M5.66675 4.27443C5.64009 4.27443 5.61342 4.27443 5.58009 4.26777C5.31342 4.2211 5.12675 3.9611 5.17342 3.69443L5.32009 2.8211C5.42675 2.1811 5.57342 1.29443 7.12675 1.29443H8.87342C10.4334 1.29443 10.5801 2.21443 10.6801 2.82777L10.8268 3.69443C10.8734 3.96777 10.6868 4.22777 10.4201 4.26777C10.1468 4.31443 9.88675 4.12777 9.84676 3.8611L9.70009 2.99443C9.60675 2.41443 9.58675 2.3011 8.88009 2.3011H7.13342C6.42675 2.3011 6.41342 2.39443 6.31342 2.98777L6.16009 3.85443C6.12009 4.1011 5.90675 4.27443 5.66675 4.27443Z"
    )
    .attr("fill", "#6B7280");
  deleteButtonGroup
    .append("path")
    .attr(
      "d",
      "M10.1401 15.6277H5.8601C3.53343 15.6277 3.4401 14.341 3.36676 13.301L2.93343 6.58765C2.91343 6.31432 3.12676 6.07432 3.4001 6.05432C3.6801 6.04099 3.91343 6.24765 3.93343 6.52099L4.36676 13.2343C4.4401 14.2477 4.46676 14.6277 5.8601 14.6277H10.1401C11.5401 14.6277 11.5668 14.2477 11.6334 13.2343L12.0668 6.52099C12.0868 6.24765 12.3268 6.04099 12.6001 6.05432C12.8734 6.07432 13.0868 6.30765 13.0668 6.58765L12.6334 13.301C12.5601 14.341 12.4668 15.6277 10.1401 15.6277Z"
    )
    .attr("fill", "#6B7280");
  deleteButtonGroup
    .append("path")
    .attr(
      "d",
      "M9.10672 11.9609H6.88672C6.61339 11.9609 6.38672 11.7343 6.38672 11.4609C6.38672 11.1876 6.61339 10.9609 6.88672 10.9609H9.10672C9.38005 10.9609 9.60672 11.1876 9.60672 11.4609C9.60672 11.7343 9.38005 11.9609 9.10672 11.9609Z"
    )
    .attr("fill", "#6B7280");
  deleteButtonGroup
    .append("path")
    .attr(
      "d",
      "M9.66659 9.29443H6.33325C6.05992 9.29443 5.83325 9.06777 5.83325 8.79443C5.83325 8.5211 6.05992 8.29443 6.33325 8.29443H9.66659C9.93992 8.29443 10.1666 8.5211 10.1666 8.79443C10.1666 9.06777 9.93992 9.29443 9.66659 9.29443Z"
    )
    .attr("fill", "#6B7280");

  // Create buttons after input is available
  createButton("minus", buttonRadius, (val) => val - 1);
  createButton("plus", buttonRadius * 3 + 4, (val) => val + 1);

  // Track hover and focus state (defined early so they can be used in handlers)
  let isHovered = false;
  let isFocused = false;
  let isVisible = false;
  let listenerAttached = false;

  // Window-level keydown handler for Delete key when lag group is visible
  const windowKeydownHandler = async function (event) {
    // Only handle Delete key when lag group is visible
    if (event.key === "Delete" && isVisible) {
      const activeElement = document.activeElement;
      // Don't trigger if user is typing in an input, textarea, or contenteditable element
      // unless it's our specific lag input
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable)
      ) {
        // If the active element is our lag input, allow Delete to work
        // Otherwise, let the user type normally
        if (activeElement !== input.node()) {
          return;
        }
      }
      
      console.log("Delete key pressed on lag-input-group, removing predecessor");
      event.preventDefault();
      event.stopPropagation();
      // Remove the dependency using store method with API call
      if (item.predecessor) {
        try {
          await ganttChartStore.removePredecessor(item);
          // Re-render chart after successful removal
          renderChart();
        } catch (error) {
          console.error("Failed to remove predecessor:", error);
        }
      }
    }
  };
  // Show lag box on hover of dependency line or box
  dependencyLine
    .on("mouseenter", function () {
      console.log("=== DEPENDENCY LINE HOVER ===");
      isHovered = true;
      isVisible = true;
      lagGroup.style("opacity", 1).style("pointer-events", "all");
      // Change line color to blue when input is showing
      dependencyLine.attr("stroke", "#3B82F6");
      // Add window keydown listener when group becomes visible (only if not already attached)
      if (!listenerAttached) {
        window.addEventListener("keydown", windowKeydownHandler);
        listenerAttached = true;
      }
      console.log("Lag box shown, opacity:", lagGroup.style("opacity"));
    })
    .on("mouseleave", function () {
      isHovered = false;
      // Only hide if input is not focused
      if (!isFocused) {
        isVisible = false;
        lagGroup.style("opacity", 0).style("pointer-events", "none");
        // Change line color back to gray when input is hidden
        dependencyLine.attr("stroke", "#9CA3AF");
        // Remove window keydown listener when group is hidden
        if (listenerAttached) {
          window.removeEventListener("keydown", windowKeydownHandler);
          listenerAttached = false;
        }
      }
    })
    .on("click", function (event) {
      event.stopPropagation();
      console.log("=== DEPENDENCY LINE CLICKED ===");
      // Show and focus the input
      isHovered = true;
      isVisible = true;
      lagGroup.style("opacity", 1).style("pointer-events", "all");
      // Change line color to blue when input is showing
      dependencyLine.attr("stroke", "#3B82F6");
      // Add window keydown listener when group becomes visible (only if not already attached)
      if (!listenerAttached) {
        window.addEventListener("keydown", windowKeydownHandler);
        listenerAttached = true;
      }
      // Focus the input element
      const inputNode = input.node();
      if (inputNode) {
        inputNode.focus();
        inputNode.select(); // Select all text for easy editing
      }
    });

  // Keep box visible when hovering over the box itself
  lagGroup
    .on("mouseenter", function () {
      isHovered = true;
      isVisible = true;
      lagGroup.style("opacity", 1).style("pointer-events", "all");
      // Change line color to blue when input is showing
      dependencyLine.attr("stroke", "#3B82F6");
      // Add window keydown listener when group becomes visible (only if not already attached)
      if (!listenerAttached) {
        window.addEventListener("keydown", windowKeydownHandler);
        listenerAttached = true;
      }
    })
    .on("mouseleave", function () {
      isHovered = false;
      // Only hide if input is not focused
      if (!isFocused) {
        isVisible = false;
        lagGroup.style("opacity", 0).style("pointer-events", "none");
        // Change line color back to gray when input is hidden
        dependencyLine.attr("stroke", "#9CA3AF");
        // Remove window keydown listener when group is hidden
        if (listenerAttached) {
          window.removeEventListener("keydown", windowKeydownHandler);
          listenerAttached = false;
        }
      }
    });

  // Keep box visible when input is focused
  input.on("focus", function () {
    isFocused = true;
    isVisible = true;
    lagGroup.style("opacity", 1).style("pointer-events", "all");
    // Change line color to blue when input is focused
    dependencyLine.attr("stroke", "#3B82F6");
    // Add window keydown listener when group becomes visible (only if not already attached)
    if (!listenerAttached) {
      window.addEventListener("keydown", windowKeydownHandler);
      listenerAttached = true;
    }
  });

  // Hide on blur if mouse is not over line or box
  // Note: processLagUpdate is already called in the input's blur handler above
  input.on("blur", function () {
    isFocused = false;
    setTimeout(() => {
      if (!isHovered) {
        isVisible = false;
        lagGroup.style("opacity", 0).style("pointer-events", "none");
        dependencyLine.attr("stroke", "#9CA3AF");
        // Remove window keydown listener when group is hidden
        if (listenerAttached) {
          window.removeEventListener("keydown", windowKeydownHandler);
          listenerAttached = false;
        }
        processLagUpdate.call(this, item, predecessorId, linkType);
      }
    }, 100);
  });

  return {
    lagGroup,
    input,
    boxWidth,
    boxHeight,
  };
}

// Helper function to check if point is within buffer distance of an SVG path element
function isPointNearPath(px, py, pathElement, buffer = 10) {
  if (!pathElement || !pathElement.node) return false;
  
  const pathNode = pathElement.node();
  const svg = pathNode.ownerSVGElement;
  if (!svg) return false;
  
  // Store original stroke width
  const originalStrokeWidth = pathNode.getAttribute("stroke-width") || "1";
  
  // Temporarily expand stroke width to check proximity (restored immediately)
  pathNode.setAttribute("stroke-width", buffer * 2);
  
  // Create a point object
  const point = svg.createSVGPoint();
  point.x = px;
  point.y = py;
  
  // Check if point is in the expanded stroke
  const isNear = pathNode.isPointInStroke(point);
  
  // Restore original stroke width immediately
  pathNode.setAttribute("stroke-width", originalStrokeWidth);
  
  return isNear;
}

// Function to show/hide Add Milestone button
function updateAddMilestoneButton(show, x, y, svg, chart) {
  if (!show) {
    if (addMilestoneButtonGroup) {
      addMilestoneButtonGroup.remove();
      addMilestoneButtonGroup = null;
    }
    showAddMilestoneButton.value = false;
    return;
  }

  const buttonHeight = 24,
    buttonRadius = 6,
    paddingX = 4,
    iconSize = 16,
    gap = 4,
    textWidth = 72;
  const buttonWidth = paddingX * 2 + iconSize + gap + textWidth;
  const buttonX = x - buttonWidth / 2;
  const buttonY = y - buttonHeight / 2;

  if (
    isPointOrRectNearItem(
      svg.node(),
      chart.node(),
      buttonX,
      buttonY,
      buttonWidth,
      buttonHeight,
      0
    )
  ) {
    return;
  }

  svg.selectAll(".add-milestone-button-group").remove();
  addMilestoneButtonGroup = chart
    .append("g")
    .attr("class", "add-milestone-button-group")
    .attr("transform", `translate(${x}, ${y})`);

  addMilestoneButtonGroup
    .append("rect")
    .attr("x", -buttonWidth / 2)
    .attr("y", -buttonHeight / 2)
    .attr("width", buttonWidth)
    .attr("height", buttonHeight)
    .attr("rx", buttonRadius)
    .attr("ry", buttonRadius)
    .attr("fill", "#FFF")
    .attr("stroke", "#F3F4F6")
    .attr("stroke-width", 1)
    .style("cursor", "pointer")
    .style(
      "filter",
      "drop-shadow(0 10px 15px -3px rgba(0, 0, 0, 0.10)) drop-shadow(0 4px 6px -2px rgba(0, 0, 0, 0.05))"
    );

  const iconX = -buttonWidth / 2 + paddingX + iconSize / 2;
  const iconPaths = [
    "M6 11.375C3.035 11.375 0.625 8.965 0.625 6C0.625 3.035 3.035 0.625 6 0.625C8.965 0.625 11.375 3.035 11.375 6C11.375 8.965 8.965 11.375 6 11.375ZM6 1.375C3.45 1.375 1.375 3.45 1.375 6C1.375 8.55 3.45 10.625 6 10.625C8.55 10.625 10.625 8.55 10.625 6C10.625 3.45 8.55 1.375 6 1.375Z",
    "M8 6.375H4C3.795 6.375 3.625 6.205 3.625 6C3.625 5.795 3.795 5.625 4 5.625H8C8.205 5.625 8.375 5.795 8.375 6C8.375 6.205 8.205 6.375 8 6.375Z",
    "M6 8.375C5.795 8.375 5.625 8.205 5.625 8V4C5.625 3.795 5.795 3.625 6 3.625C6.205 3.625 6.375 3.795 6.375 4V8C6.375 8.205 6.205 8.375 6 8.375Z",
  ];

  const iconGroup = addMilestoneButtonGroup
    .append("g")
    .attr("transform", `translate(${iconX}, 0) scale(${iconSize / 12})`)
    .style("pointer-events", "none");

  iconPaths.forEach((path) => {
    iconGroup
      .append("path")
      .attr("d", path)
      .attr("fill", "#4B5563")
      .attr("transform", "translate(-6, -6)");
  });

  addMilestoneButtonGroup
    .append("text")
    .attr("x", iconX + iconSize / 2 + gap)
    .attr("y", 0)
    .attr("dy", "0.1em")
    .attr("fill", "#4B5563")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "start")
    .style("font-size", "10px")
    .style("font-weight", "500")
    .style("font-family", "Nunito, sans-serif")
    .style("pointer-events", "none")
    .style("user-select", "none")
    .text("Add Milestone");

  addMilestoneButtonGroup.on("click", (event) => {
    event.stopPropagation();
    // Calculate the date from x coordinate using the scale
    let startDate = null;
    if (xScale) {
      const dateFromX = xScale.invert(x);
      // Format as YYYY-MM-DD for the date input
      startDate = moment(dateFromX).startOf("day").format("YYYY-MM-DD");
    }
    emit("add-milestone", { x, y, startDate });
    updateAddMilestoneButton(false, 0, 0, svg, chart);
  });
  let startDate = null;
  if (xScale) {
    const dateFromX = xScale.invert(x);
    // Format as YYYY-MM-DD for the date input
    startDate = moment(dateFromX).startOf("day").format("YYYY-MM-DD");
  }
  emit("add-milestone", { x, y, startDate });
  updateAddMilestoneButton(false, 0, 0, svg, chart);
  showAddMilestoneButton.value = true;
  addMilestoneButtonPos.value = { x, y };
}

// Helper function to reliably measure text width
function getTextWidth(
  text,
  fontSize,
  fontWeight,
  fontFamily = "Nunito, sans-serif"
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
  return context.measureText(text).width;
}

function getGanttChartDates() {
  let startDate, endDate;
  if (props.viewMode === "daily") {
    // Daily: 6 months before and 6 months after today
    startDate = moment().subtract(6, "months").toDate();
    endDate = moment().add(6, "months").toDate();
  } else if (props.viewMode === "weekly") {
    // Weekly: 26 weeks before and 26 weeks after today
    startDate = moment().subtract(1, "years").toDate();
    endDate = moment().add(1, "years").toDate();
  } else if (props.viewMode === "monthly") {
    // Monthly: 6 months before and 6 months after today
    startDate = moment().subtract(2, "years").toDate();
    endDate = moment().add(2, "years").toDate();
  } else {
    // Default fallback
    startDate = moment().subtract(6, "months").toDate();
    endDate = moment().add(6, "months").toDate();
  }
  return { startDate, endDate };
}

function renderChart() {
  // If a drag is currently active, defer rendering until drag completes
  if (isAnyDragActive.value) {
    pendingRender.value = true;
    return;
  }

  // Clear pending render flag
  pendingRender.value = false;

  const svg = d3.select(svgRef.value);
  const headerSvg = d3.select(headerSvgRef.value);
  svg.selectAll("*").remove();
  headerSvg.selectAll("*").remove();

  // Reset button state when re-rendering
  addMilestoneButtonGroup = null;
  showAddMilestoneButton.value = false;

  // ---- shared drag and dependency state ----
  let activeDragItemId = null;
  let dependencyActive = false;
  let dependencySourceItemId = null;
  let dependencySourceType = null;
  let dependencyPreviewLine = null;
  let hoveredTargetCube = null;
  const allCubes = []; // New: { id: item._id, type: 'left'|'right', element: cubeElement, x: number, y: number, radius: 10 }

  // Track item positions for drop calculation
  const itemPositions = []; // { item, phase, yStart, yEnd, ganttSeq }

  // Track phase boundaries
  const phaseBounds = {}; // { phaseName: { yStart, yEnd, phaseObject } }

  // Track item bounds for proximity-based hover (10px buffer)
  const itemBounds = []; // { itemId, x, y, width, height, leftLine, rightLine, leftCube, rightCube, hasPredecessor }

  // Track lag input bounds for proximity-based hover
  const lagInputBounds = []; // { midX, midY, boxWidth, boxHeight, lagGroup, dependencyLine }

  // STEP 1: Calculate date range based on view mode
  let { startDate, endDate } = getGanttChartDates();

  // const startOfWeek = new Date("2025-11-01");
  // const endOfWeek = new Date("2025-11-07");

  // STEP 1: Calculate 6 months past and 6 months future from today using moment
  // const startDate = moment().subtract(6, "months").toDate();
  // const endDate = moment().add(6, "months").toDate();
  // const startDate = moment().startOf("year").toDate();
  // const endDate = moment().endOf("year").toDate();

  // STEP 2: Calculate number of intervals (days/weeks/months) based on view mode
  // const dayCount = 7;
  const timeIntervals = viewConfig.value.timeInterval.range(startDate, endDate);
  const intervalCount = timeIntervals.length;
  const containerEl = containerRef.value;
  const viewportWidth = containerEl ? containerEl.clientWidth : 0;
  const baseContentWidth =
    viewConfig.value.minWidth * intervalCount * zoomFactor.value;
  const containerWidth = Math.max(viewportWidth, baseContentWidth);

  const containerHeight = 40; // Day labels container height
  const spacingBelowLabels = 24; // Spacing below day labels container

  // Calculate height based on actual number of items in each phase
  let calculatedHeight = spacingBelowLabels; // Start with spacing below header
  groupedData.value.forEach((group) => {
    calculatedHeight += 32; // Phase label + bar area
    calculatedHeight += group.items.length * 40; // Each item = 40px height
    calculatedHeight += 48; // Spacing after phase
  });

  const contentHeight = calculatedHeight + 40; // Extra bottom padding
  // Use offsetHeight for immediate height (more reliable on initial render than clientHeight)
  const containerHeightValue =
    containerEl?.offsetHeight || containerEl?.clientHeight || 500;
  const minContentHeight = Math.max(contentHeight, containerHeightValue);
  const totalHeight = minContentHeight + containerHeight;

  // STEP 3: Update time scale to use new date range
  const x = d3
    .scaleTime()
    // .domain([startOfWeek, endOfWeek])
    .domain([startDate, endDate])
    .range([0, containerWidth]);

  // Store scale for use outside renderChart
  xScale = x;

  // Setup header SVG (fixed at top)
  headerSvg.attr("width", containerWidth).attr("height", containerHeight);

  // Setup main SVG (scrollable content)
  svg.attr("width", containerWidth).attr("height", minContentHeight);
  // define arrowhead marker for dependency lines
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 10)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", "#94a3b8");

  // New: Define marker for preview line (circle endpoint)
  svg
    .append("defs")
    .append("marker")
    .attr("id", "preview-arrowhead")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 5) // center of circle
    .attr("refY", 5)
    .attr("markerWidth", 6) // ≈ 0.375rem at 16px base
    .attr("markerHeight", 6) // ≈ 0.375rem
    .attr("orient", "auto")
    .append("circle")
    .attr("cx", 5)
    .attr("cy", 5)
    .attr("r", 3) // 6px diameter ≈ 0.375rem
    .attr("fill", "#516CE0")
    .style("cursor", "pointer");

  // Layers: background, then connectors, then items
  const backgroundLayer = svg.append("g").attr("class", "background-layer");
  const connectorsLayer = svg.append("g").attr("class", "connectors-layer");
  const chart = svg.append("g").attr("class", "items-layer");

  // Enhanced Blueprint/Comfy-style noodle path (more curvy / realistic)
  const getNoodlePath = (
    x1,
    y1,
    x2,
    y2,
    fromType = "right", // "left" | "right"
    toType = "left" // "left" | "right"
  ) => {
    const dx = x2 - x1 || 1; // avoid 0
    const dy = y2 - y1;

    // Stronger horizontal pull for a more pronounced curve
    const basePull = Math.max(Math.abs(dx) * 0.7, 60);

    // Horizontal direction based on sides
    const fromSign = fromType === "left" ? -1 : 1;
    const toSign = toType === "right" ? 1 : -1;

    const c1x = x1 + basePull * fromSign;
    const c2x = x2 + basePull * toSign;

    // Vertical offset to create a nicer S-curve
    const verticalBase = Math.min(Math.abs(dy) * 0.5, 60);
    const verticalSign = dy >= 0 ? 1 : -1;

    // Pull first control point slightly away from the line, second in opposite sense
    const c1y = y1 + verticalBase * verticalSign;
    const c2y = y2 - verticalBase * verticalSign;

    return `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;
  };

  // const dayWidth = containerWidth / dayCount;
  // const days = d3.range(dayCount);

  // STEP 4: Use time intervals based on view mode (days/weeks/months)
  const columnColors = ["var(--gray-50, #F9FAFB)", "var(--white, #FFF)"];

  // Add background columns to main content
  backgroundLayer
    .selectAll(".interval-col")
    .data(timeIntervals)
    .join("rect")
    // .attr("x", (d) => d * dayWidth)
    .attr("class", "interval-col")
    .attr("x", (d) => x(d))
    .attr("y", 0)
    // .attr("width", dayWidth)
    .attr("width", (d, i) => {
      const nextInterval =
        i < timeIntervals.length - 1
          ? timeIntervals[i + 1]
          : viewConfig.value.timeInterval.offset(d, 1);
      return x(nextInterval) - x(d);
    })
    .attr("height", minContentHeight)
    .attr("fill", (d, i) => (i % 2 ? columnColors[1] : columnColors[0]));

  // ===== RENDER HEADER (Fixed at top) =====
  const headerChart = headerSvg.append("g");

  // Add background to header
  headerChart
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .style("fill", "var(--white, #FFF)")
    .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

  // Add interval labels to header (day/week/month based on view mode)
  const intervalLabelGroups = headerChart
    .selectAll(".interval-label-group")
    .data(timeIntervals)
    .join("g")
    .attr("class", "interval-label-group")
    .attr("transform", (d, i) => {
      const nextInterval =
        i < timeIntervals.length - 1
          ? timeIntervals[i + 1]
          : viewConfig.value.timeInterval.offset(d, 1);
      const centerX = x(d) + (x(nextInterval) - x(d)) / 2;
      return `translate(${centerX}, 0)`;
    });

  // Add text label
  intervalLabelGroups
    .append("text")
    .attr("class", "interval-label")
    .attr("x", 0)
    .attr("y", 25)
    // .attr("text-anchor", "start")
    .attr("text-anchor", "middle")
    .attr("fill", (d) => {
      // Highlight current interval (today/this week/this month)
      const isCurrent =
        props.viewMode === "daily"
          ? moment(d).isSame(moment(), "day")
          : props.viewMode === "weekly"
          ? moment(d).isSame(moment(), "week")
          : moment(d).isSame(moment(), "month");
      return isCurrent
        ? "var(--Governor-Bay-500, #516CE0)"
        : "var(--gray-400, #9ca3af)";
    })
    // .text((d) => d3.timeFormat("%b %d")(d3.timeDay.offset(start, d)));
    // .text((d) => d3.timeFormat("%b %d")(d));
    .text((d, i) => {
      // For weekly view, show date range like "1st Nov - 5th Nov"
      if (props.viewMode === "weekly") {
        const cfg = viewConfig.value;
        const start = d;
        const nextInterval =
          i < timeIntervals.length - 1
            ? timeIntervals[i + 1]
            : cfg.timeInterval.offset(d, 1);
        // End is the day before the next interval starts
        const end = moment(nextInterval).subtract(1, "day").toDate();
        const startStr = moment(start).format("DD");
        const endStr = moment(end).format("DD MMM");
        return `${startStr} - ${endStr}`;
      }
      return viewConfig.value.formatLabel(d);
    });

  // Add info icon for weekly view only
  if (props.viewMode === "weekly") {
    const infoIcons = intervalLabelGroups
      .append("g")
      .attr("class", "week-info-icon");

    // Calculate text width to position icon next to label
    infoIcons.each(function (d) {
      const textElement = d3.select(this.parentNode).select(".interval-label");
      const textBBox = textElement.node()?.getBBox();
      const textWidth = textBBox?.width || 0;

      // Increase gap between text and icon
      const iconX = textWidth / 2 + 8; // 8px spacing after text (increased from 6px)

      // Text is positioned at y=25, and text-anchor is "middle"
      // For 12px font, the text baseline is at y=25, visual center is around y=19-20
      // Align icon center with text visual center
      const iconY = 19.5; // Adjusted to better align with text center

      const iconGroup = d3
        .select(this)
        .attr("transform", `translate(${iconX}, ${iconY})`);

      // Add info circle SVG paths (from info-circle.svg)
      // Scale to 12px size (0.75 scale of 16px original)
      const iconScale = 0.75;
      // SVG viewBox is 0-16, center is at 8,8
      // Translate by -8 to move center to origin, then scale
      // After transform, icon center is at (0,0) relative to iconGroup
      const iconOffset = -5;

      const paths = iconGroup
        .append("g")
        .attr(
          "transform",
          `translate(${iconOffset}, ${iconOffset}) scale(${iconScale})`
        )
        .attr("class", "icon-group-path");
      // .style("opacity", 0.7)
      // .style("transition", "opacity 0.2s ease-in-out");

      // paths
      //   .append("path")
      //   .attr(
      //     "d",
      //     "M8.00065 14.6667C11.6673 14.6667 14.6673 11.6667 14.6673 8.00004C14.6673 4.33337 11.6673 1.33337 8.00065 1.33337C4.33398 1.33337 1.33398 4.33337 1.33398 8.00004C1.33398 11.6667 4.33398 14.6667 8.00065 14.6667Z"
      //   )
      //   .attr("stroke", "#9CA3AF")
      //   .attr("stroke-linecap", "round")
      //   .attr("stroke-linejoin", "round")
      //   .attr("fill", "none");

      // paths
      //   .append("path")
      //   .attr("d", "M8 5.33337V8.66671")
      //   .attr("stroke", "#9CA3AF")
      //   .attr("stroke-linecap", "round")
      //   .attr("stroke-linejoin", "round")
      //   .attr("fill", "none");

      // paths
      //   .append("path")
      //   .attr("d", "M7.99609 10.6666H8.00208")
      //   .attr("stroke", "#9CA3AF")
      //   .attr("stroke-linecap", "round")
      //   .attr("stroke-linejoin", "round")
      //   .attr("fill", "none");

      // Add hover handlers
      const weekStart = moment(d).startOf("week");
      const weekEnd = moment(d).endOf("week");
      const tooltipText = `${weekStart.format("MMM DD")} - ${weekEnd.format(
        "MMM DD"
      )}`;

      iconGroup
        .on("mouseenter", function (event) {
          paths.style("opacity", 1);
          showTooltip(this, tooltipText, "top");
        })
        .on("mouseleave", function () {
          paths.style("opacity", 0.7);
          hideTooltip();
        });
    });
  }

  let yPos = spacingBelowLabels; // Start below the spacing (header is separate now)

  groupedData.value.forEach((group) => {
    // Track phase start position
    const phaseStartY = yPos;

    // Get phase object from first item in the group
    const phaseObject = group.items[0]?.phase;

    // Normalize phase dates to full days for display
    const phaseStart = moment(group.minStart).startOf("day").toDate();
    const phaseEnd = moment(group.maxEnd).endOf("day").toDate();
    const phaseX = x(phaseStart);
    const phaseWidth = x(phaseEnd) - x(phaseStart);

    // Phase bar
    const phaseBar = chart
      .append("rect")
      .attr("x", phaseX)
      .attr("y", yPos + 8)
      .attr("width", phaseWidth)
      .attr("height", 4)
      .attr("rx", 2)
      .attr("fill", group.color)
      .style("opacity", 0.9);

    // Format date range for phase label
    const startDateStr = moment(phaseStart).format("MMM DD");
    const endDateStr = moment(phaseEnd).format("MMM DD");
    const dateRangeText = `${startDateStr} - ${endDateStr}`;

    // Calculate text widths reliably using helper function
    const phaseNameWidth = getTextWidth(group.phase, "13px", 600);
    const spacing = 8; // Space between phase name and date
    const dateRangeWidth = getTextWidth(dateRangeText, "12px", 600);

    // Create a group for phase label hover area
    const phaseLabelGroup = chart
      .append("g")
      .attr("class", "phase-label-group");

    phaseLabelGroup.on("click", function (event) {
      event.stopPropagation();
      ganttChartStore.isEditItemPhase = true;
      ganttChartStore.isEditItemPhaseObject = phaseObject;
      ganttChartStore.onOpenAddEditItemPhasePopup = true;
    });
    // Phase name text
    const phaseNameText = phaseLabelGroup
      .append("text")
      .attr("x", phaseX)
      .attr("y", yPos)
      .attr("class", "phase-name-text")
      .text(group.phase);

    // Add underline below the phase name text
    const underlineOffset = 4; // Distance below text baseline
    const underline = phaseLabelGroup
      .append("line")
      .attr("x1", phaseX)
      .attr("y1", yPos + underlineOffset)
      .attr("x2", phaseX + phaseNameWidth)
      .attr("y2", yPos + underlineOffset)
      .attr("class", "phase-name-underline");

    // Date range text with different styling (hidden by default)
    const dateRangeTextElement = phaseLabelGroup
      .append("text")
      .attr("x", phaseX + phaseNameWidth + spacing)
      .attr("y", yPos)
      .attr("fill", "var(--gray-600, #4B5563)")
      .style("font-size", "12px")
      .style("font-weight", 600)
      .style("opacity", 0)
      .style("transition", "opacity 0.3s ease-in-out")
      .text(dateRangeText);

    const iconSpacing = 8; // Space between date and icon
    const iconX =
      phaseX + phaseNameWidth + spacing + dateRangeWidth + iconSpacing;
    const iconY = yPos - 10; // Center 12px icon with 12px text

    // Check if this is the "Others" phase
    const isOthersPhase = group.phase === "Others";

    // Shared hover handlers for phase section (defined before iconGroup)
    const showPhaseDetails = function () {
      dateRangeTextElement.style("opacity", 1);
      if (!isOthersPhase) {
        iconGroup.style("opacity", 1);
      }
    };

    const hidePhaseDetails = function () {
      dateRangeTextElement.style("opacity", 0);
      if (!isOthersPhase) {
        iconGroup.style("opacity", 0);
      }
    };

    // Pencil icon group (hidden by default, and not shown for "Others" phase)
    const iconGroup = phaseLabelGroup
      .append("g")
      .attr("transform", `translate(${iconX}, ${iconY})`)
      .style("cursor", isOthersPhase ? "default" : "pointer")
      .style("opacity", 0)
      .style("transition", "opacity 0.3s ease-in-out")
      .style("display", isOthersPhase ? "none" : "block");

    // Add transparent rectangle for better click area and cursor
    iconGroup
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "transparent")
      .style("cursor", isOthersPhase ? "default" : "pointer");

    iconGroup
      .append("path")
      .attr(
        "d",
        "M7.5 11.375H4.5C1.785 11.375 0.625 10.215 0.625 7.5V4.5C0.625 1.785 1.785 0.625 4.5 0.625H5.5C5.705 0.625 5.875 0.795 5.875 1C5.875 1.205 5.705 1.375 5.5 1.375H4.5C2.195 1.375 1.375 2.195 1.375 4.5V7.5C1.375 9.805 2.195 10.625 4.5 10.625H7.5C9.805 10.625 10.625 9.805 10.625 7.5V6.5C10.625 6.295 10.795 6.125 11 6.125C11.205 6.125 11.375 6.295 11.375 6.5V7.5C11.375 10.215 10.215 11.375 7.5 11.375Z"
      )
      .attr("fill", "#9CA3AF")
      .style("transition", "fill 0.3s ease-in-out");

    iconGroup
      .append("path")
      .attr(
        "d",
        "M4.24967 8.84503C3.94467 8.84503 3.66467 8.73503 3.45967 8.53503C3.21467 8.29003 3.10967 7.93503 3.16467 7.56003L3.37967 6.05503C3.41967 5.76503 3.60967 5.39003 3.81467 5.18503L7.75467 1.24503C8.74967 0.250029 9.75967 0.250029 10.7547 1.24503C11.2997 1.79003 11.5447 2.34503 11.4947 2.90003C11.4497 3.35003 11.2097 3.79003 10.7547 4.24003L6.81467 8.18003C6.60967 8.38503 6.23467 8.57503 5.94467 8.61503L4.43967 8.83003C4.37467 8.84503 4.30967 8.84503 4.24967 8.84503ZM8.28467 1.77503L4.34467 5.71503C4.24967 5.81003 4.13967 6.03003 4.11967 6.16003L3.90467 7.66503C3.88467 7.81003 3.91467 7.93003 3.98967 8.00503C4.06467 8.08003 4.18467 8.11003 4.32967 8.09003L5.83467 7.87503C5.96467 7.85503 6.18967 7.74503 6.27967 7.65003L10.2197 3.71003C10.5447 3.38503 10.7147 3.09503 10.7397 2.82503C10.7697 2.50003 10.5997 2.15503 10.2197 1.77003C9.41967 0.970029 8.86967 1.19503 8.28467 1.77503Z"
      )
      .attr("fill", "#9CA3AF")
      .style("transition", "fill 0.3s ease-in-out");

    iconGroup
      .append("path")
      .attr(
        "d",
        "M9.92576 4.91501C9.89076 4.91501 9.85576 4.91001 9.82576 4.90001C8.51076 4.53001 7.46576 3.48501 7.09576 2.17001C7.04076 1.97001 7.15576 1.76501 7.35576 1.70501C7.55576 1.65001 7.76076 1.76501 7.81576 1.96501C8.11576 3.03001 8.96076 3.87501 10.0258 4.17501C10.2258 4.23001 10.3408 4.44001 10.2858 4.64001C10.2408 4.81001 10.0908 4.91501 9.92576 4.91501Z"
      )
      .attr("fill", "#9CA3AF")
      .style("transition", "fill 0.3s ease-in-out");

    // Add hover effect to darken icon and keep phase details visible (only for non-"Others" phases)
    if (!isOthersPhase) {
      iconGroup
        .on("mouseenter", function () {
          iconGroup.selectAll("path").attr("fill", "#6B7280"); // Darker gray on hover
          showPhaseDetails(); // Keep date and icon visible
        })
        .on("mouseleave", function () {
          iconGroup.selectAll("path").attr("fill", "#9CA3AF"); // Original color on leave
          // Don't hide phase details here - let phaseLabelGroup handle it
        })
        .on("click", function (event) {
          event.stopPropagation(); // Prevent event bubbling
          ganttChartStore.isEditItemPhase = true;
          ganttChartStore.isEditItemPhaseObject = phaseObject;
          ganttChartStore.onOpenAddEditItemPhasePopup = true;
        });
    }

    // Add hover handlers to phase bar and label group
    phaseBar
      .on("mouseenter", showPhaseDetails)
      .on("mouseleave", hidePhaseDetails);

    phaseLabelGroup
      .on("mouseenter", showPhaseDetails)
      .on("mouseleave", hidePhaseDetails);

    yPos += 24;

    // --- items ---
    group.items.forEach((item, itemIndex) => {
      // Normalize item dates to full days for display (day-level granularity only)
      const start = moment(item.startDate).startOf("day").toDate();
      const end = moment(item.dueDate).endOf("day").toDate();
      const xStart = x(start);
      const width = Math.max(x(end) - x(start), 8);

      const itemGroup = chart.append("g").attr("class", "item-group");

      // Store item position for drop calculation & preview transforms
      itemPositions.push({
        item: item,
        phase: group.phase,
        yStart: yPos,
        yEnd: yPos + 32, // Item height is 32px
        ganttSeq: item.ganttSeq,
        orderIndex: itemIndex,
        itemGroup,
      });
      function hexToRgba(hex, opacity) {
        const { r, g, b } = hexToRgb(hex);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // Outline rect (hover highlight) – 5px gap all around
      const outline = itemGroup
        .append("rect")
        .attr("class", "item-bar-outline")
        .attr("x", xStart - 2.5)
        .attr("y", yPos - 2.5)
        .attr("width", width + 5)
        .attr("height", 32 + 5)
        .attr("rx", 8)
        .attr("fill", "none")
        .attr("stroke", group.color)
        .attr("stroke-width", 1.5)
        .style("opacity", 0)
        .style("transition", "opacity 0.23s ease-in-out")
        // .style("background-color", group.color)
        //need same color but with lower opacity but color is in hex format so we need to convert it to rgba
        .style("background-color", hexToRgba(group.color, 0.2));

      // Keep outline behind the main bar
      outline.lower();

      // main bar
      const bar = itemGroup
        .append("rect")
        .attr("class", "item-bar")
        .attr("x", xStart)
        .attr("y", yPos)
        .attr("width", width)
        .attr("height", 32)
        .attr("rx", 8)
        .attr("fill", group.color);

      // Right-click handler for context menu (attached to itemGroup so it works anywhere on the item)
      itemGroup.on("contextmenu", function (event) {
        event.preventDefault();
        event.stopPropagation();
        openContextMenu(item, event, bar.node());
      });

      // Apply loading state styling if item is being updated
      if (ganttChartStore.isItemLoading(item._id)) {
        itemGroup.style("pointer-events", "none");
        itemGroup.style("opacity", 0.5);
        bar.style("cursor", "not-allowed");
      }

      // indents
      const leftIndent = itemGroup
        .append("rect")
        .attr("class", "indent-left")
        .attr("x", xStart + 2)
        .attr("y", yPos + 4)
        .attr("width", 2)
        .attr("height", 24)
        .attr("rx", 1)
        .attr("fill", "#fff")
        .style("opacity", 0);

      const rightIndent = itemGroup
        .append("rect")
        .attr("class", "indent-right")
        .attr("x", xStart + width - 4)
        .attr("y", yPos + 4)
        .attr("width", 2)
        .attr("height", 24)
        .attr("rx", 1)
        .attr("fill", "#fff")
        .style("opacity", 0);

      // transparent drag zones
      const leftDragZone = itemGroup
        .append("rect")
        .attr("class", "indent-left-zone")
        .attr("x", xStart - 4)
        .attr("y", yPos + 4)
        .attr("width", 10)
        .attr("height", 24)
        .style("fill", "transparent")
        .style("cursor", "ew-resize")
        .on("click", function (event) {
          event.stopPropagation();
          // D3 drag prevents clicks after drag, so this only fires on pure clicks
          openDatePicker(item, "start", event, bar.node());
        })
        .on("mouseenter", function (event) {
          const dateText = moment(item.startDate).format("MMM DD, YYYY");
          // Use getBoundingClientRect to get viewport position
          const rect = this.getBoundingClientRect();
          showTooltip(this, dateText, "top");
        })
        .on("mouseleave", function () {
          hideTooltip();
        });

      const rightDragZone = itemGroup
        .append("rect")
        .attr("class", "indent-right-zone")
        .attr("x", xStart + width - 8)
        .attr("y", yPos + 4)
        .attr("width", 10)
        .attr("height", 24)
        .style("fill", "transparent")
        .style("cursor", "ew-resize")
        .on("click", function (event) {
          event.stopPropagation();
          // D3 drag prevents clicks after drag, so this only fires on pure clicks
          openDatePicker(item, "end", event, bar.node());
        })
        .on("mouseenter", function (event) {
          const dateText = moment(item.dueDate).format("MMM DD, YYYY");
          // Use getBoundingClientRect to get viewport position
          const rect = this.getBoundingClientRect();
          showTooltip(this, dateText, "top");
        })
        .on("mouseleave", function () {
          hideTooltip();
        });

      // connector lines + cubes
      const leftLine = itemGroup
        .append("line")
        .attr("class", "connector-line-left")
        .attr("x1", xStart)
        .attr("y1", yPos + 16)
        .attr("x2", xStart - 12)
        .attr("y2", yPos + 16)
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 1.5)
        .style("opacity", 0);

      const leftCube = itemGroup
        .append("rect")
        .attr("class", `connector-cube-left cube-${item._id}-left`)
        .attr("x", xStart - 20)
        .attr("y", yPos + 12)
        .attr("width", 8)
        .attr("height", 8)
        .attr("rx", 2)
        .attr("fill", "#cbd5e1")
        .style("opacity", 0)
        .style("cursor", "grab") // New: Indicate draggable
        .style("transition", "fill 0.2s, opacity 0.2s"); // New: Smooth transitions

      // New: Store cube info for drag detection
      allCubes.push({
        id: item._id,
        type: "left",
        element: leftCube.node(),
        x: parseFloat(leftCube.attr("x")) + 4, // Center x
        y: parseFloat(leftCube.attr("y")) + 4, // Center y
        radius: 10, // Effective drop radius
      });
      const rightLine = itemGroup
        .append("line")
        .attr("class", "connector-line-right")
        .attr("x1", xStart + width)
        .attr("y1", yPos + 16)
        .attr("x2", xStart + width + 12)
        .attr("y2", yPos + 16)
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 1.5)
        .style("opacity", 0);

      const rightCube = itemGroup
        .append("rect")
        .attr("class", `connector-cube-right cube-${item._id}-right`)
        .attr("x", xStart + width + 12)
        .attr("y", yPos + 12)
        .attr("width", 8)
        .attr("height", 8)
        .attr("rx", 2)
        .attr("fill", "#cbd5e1")
        .style("opacity", 0)
        .style("cursor", "grab") // New: Indicate draggable
        .style("transition", "fill 0.2s, opacity 0.2s"); // New: Smooth transitions

      // New: Store cube info for drag detection
      allCubes.push({
        id: item._id,
        type: "right",
        element: rightCube.node(),
        x: parseFloat(rightCube.attr("x")) + 4, // Center x
        y: parseFloat(rightCube.attr("y")) + 4, // Center y
        radius: 10, // Effective drop radius
      });
      // text
      const textColor = group?.textColor || "#ffffff";

      // Calculate label width reliably before creating elements (used for subitem count positioning)
      const labelWidth = getTextWidth(item.title, "12px", 500);

      // statusName text at right end of item bar
      const statusName = item?.statusName || "";
      const statusWidth =
        statusName && statusName.length
          ? getTextWidth(statusName, "12px", 500) + 16 // include some padding
          : 0;

      // Use foreignObject + HTML so we can apply CSS ellipsis and let the browser
      // handle truncation efficiently, including while dragging/resizing.
      // By default (idle / dragging), we let the label use full width minus padding.
      const labelContainer = itemGroup
        .append("foreignObject")
        .attr("class", "gantt-item-label-fo")
        .attr("x", xStart + 14)
        // Slightly inset from the top of the bar and vertically centered
        .attr("y", yPos + 6)
        .attr("width", Math.max(width - 28, 0)) // 14px padding each side
        .attr("height", 20);

      labelContainer.on("click", function (event) {
        ganttChartStore.addItemDetails(item._id);
        ganttChartStore.showSidePanel(true);
      });

      const labelDiv = labelContainer
        .append("xhtml:div")
        .attr("class", "gantt-item-label-text")
        .style("color", textColor)
        .text(item.title);

      // Subitem count text (only if subitems exist)
      const subitemCount = item.subitems?.length || 0;
      const subitemCountText = itemGroup
        .append("text")
        .attr("x", xStart + 14 + labelWidth + (subitemCount > 0 ? 10 : 0)) // Position with spacing if subitems exist
        .attr("y", yPos + 21)
        .attr("fill", textColor)
        .style("font-size", "10px")
        .style("font-weight", 500)
        .style("opacity", 0)
        .style("pointer-events", "none")
        .text(
          subitemCount > 0
            ? `${subitemCount} ${subitemCount === 1 ? "subitem" : "subitems"}`
            : ""
        );

      const statusText = itemGroup
        .append("text")
        .attr("x", xStart + width - 14)
        .attr("y", yPos + 21)
        .attr("fill", textColor)
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .style("font-weight", 500)
        .style("opacity", 0)
        .style("pointer-events", "none")
        .style("text-transform", "capitalize")
        .text(statusName);

      // Tooltip behaviour:
      // - Weekly: only for very small ("compact") bars.
      // - Monthly: for all bars.
      const isCompactBar = props.viewMode === "weekly" && width < 200; // threshold in px for "too small" bars
      const hasStatus = !!statusName;
      const tooltipText = hasStatus
        ? `${item.title} - ${statusName}`
        : item.title;

      bar.on("click", function () {
        ganttChartStore.addItemDetails(item._id);
        ganttChartStore.showSidePanel(true);
      });

      // --- Vertical drag behavior (to reorder items) ---
      const dragVertical = createVerticalDragBehavior({
        item,
        itemGroup,
        bar,
        yPos,
        containerWidth,
        itemPositions,
        phaseBounds,
        chart,
        activeDragItemId,
        ganttChartStore,
      });

      // Note: We'll apply drag handlers in a specific order
      // Horizontal drag will be applied first, then vertical drag (so vertical takes precedence)

      // Helper function to check if item has dependency on a connector
      const hasDependencyOnConnector = (itemId, connectorType) => {
        // Check if this item has a predecessor (for "to" side)
        const item = ganttChartStore.allItems.find((i) => i._id === itemId);
        if (item && item.predecessor && item.predecessor.itemId !== null) {
          const linkType = item.predecessor.type || "FS";
          // Map link type to connector position
          let toType;
          if (linkType === "FS") toType = "left";
          else if (linkType === "SS") toType = "left";
          else if (linkType === "FF") toType = "right";
          else if (linkType === "SF") toType = "right";
          else toType = "left";

          if (toType === connectorType) return true;
        }

        // Check if this item is a predecessor for other items (for "from" side)
        const hasAsPredecessor = ganttChartStore.allItems.some((i) => {
          if (i.predecessor && i.predecessor.itemId === itemId) {
            const linkType = i.predecessor.type || "FS";
            let fromType;
            if (linkType === "FS") fromType = "right";
            else if (linkType === "SS") fromType = "left";
            else if (linkType === "FF") fromType = "right";
            else if (linkType === "SF") fromType = "left";
            else fromType = "right";

            return fromType === connectorType;
          }
          return false;
        });

        return hasAsPredecessor;
      };

      // Check if item has a predecessor (one predecessor per item constraint)
      const hasPredecessor =
        item.predecessor && item.predecessor.itemId !== null;

      // Store item bounds for proximity-based hover detection
      itemBounds.push({
        itemId: item._id,
        x: xStart,
        y: yPos,
        width: width,
        height: 32,
        leftLine,
        rightLine,
        leftCube,
        rightCube,
        hasPredecessor,
      });

      // --- Hover logic (show status + shrink title to make room) ---
      itemGroup
        .on("mouseenter", function () {
          if (activeDragItemId !== null || dependencyMode) return;
          outline.style("opacity", 1);
          leftIndent.style("opacity", 1);
          rightIndent.style("opacity", 1);
          rightLine.style("opacity", 1);
          // Show cubes, but maintain disabled styling for left cube if item has predecessor
          if (hasPredecessor) {
            leftCube.style("opacity", 0.5).attr("fill", "#e2e8f0");
          } else {
            leftCube.style("opacity", 1);
          }
          rightCube.style("opacity", 1);

          if (props.viewMode === "monthly" || isCompactBar) {
            // Monthly view: always show tooltip, keep status label hidden.
            // Weekly view: for compact bars, only show tooltip and hide status.
            showTooltip(bar.node(), tooltipText, "bottom");
            statusText.style("opacity", 0);
          } else {
            // Weekly (non-compact) bars: show statusName on hover and shrink label to make room
            const currentBarWidth = parseFloat(bar.attr("width")) || width;
            labelContainer.attr(
              "width",
              Math.max(currentBarWidth - 28 - statusWidth, 0)
            );
            statusText.style("opacity", 1);
          }
          // Show subitem count on hover (only if subitems exist)
          if (subitemCount > 0) {
            subitemCountText.style("opacity", 0.6);
          }
        })
        .on("mouseleave", function () {
          if (activeDragItemId !== null || dependencyMode) return;
          outline.style("opacity", 0);
          leftIndent.style("opacity", 0);
          rightIndent.style("opacity", 0);
          if (!hasDependencyOnConnector(item._id, "left")) {
            leftLine.style("opacity", 0);
            leftCube.style("opacity", 0);
          }
          if (!hasDependencyOnConnector(item._id, "right")) {
            rightLine.style("opacity", 0);
            rightCube.style("opacity", 0);
          }

          if (props.viewMode === "monthly" || isCompactBar) {
            // Monthly: tooltip-only, status was never shown.
            // Weekly compact: tooltip-only, status was never shown.
            hideTooltip();
          } else {
            // Weekly non-compact: hide statusName on mouse leave
            // and let title use full width again.
            const currentBarWidth = parseFloat(bar.attr("width")) || width;
            labelContainer.attr("width", Math.max(currentBarWidth - 28, 0));
            statusText.style("opacity", 0);
          }
          // Hide subitem count on mouse leave
          if (subitemCount > 0) {
            subitemCountText.style("opacity", 0);
          }
        });
      const activateDragVisuals = () => {
        leftIndent.style("opacity", 1);
        rightIndent.style("opacity", 1);
        leftLine.style("opacity", 0);
        rightLine.style("opacity", 0);
        leftCube.style("opacity", 0);
        rightCube.style("opacity", 0);
        // Hide status and subitem labels during any drag (move or resize)
        if (statusText) statusText.style("opacity", 0);
        if (subitemCount > 0) subitemCountText.style("opacity", 0);
        // While dragging, let the title use full width (remove reserved space for status)
        if (labelContainer && bar) {
          const currentBarWidth = parseFloat(bar.attr("width")) || width;
          labelContainer.attr(
            "width",
            Math.max(currentBarWidth - 28, 0) // 14px padding each side
          );
        }
      };

      // --- Horizontal drag behavior (to move items in time) ---
      const dragHorizontal = createHorizontalDragBehavior({
        item,
        itemGroup,
        bar,
        xStart,
        width,
        start,
        end,
        x,
        containerWidth,
        leftIndent,
        rightIndent,
        leftDragZone,
        rightDragZone,
        labelContainer,
        statusText,
        leftLine,
        rightLine,
        leftCube,
        rightCube,
        activateDragVisuals,
        getActiveDragItemId: () => activeDragItemId,
        setActiveDragItemId: (value) => {
          activeDragItemId = value;
        },
        ganttChartStore,
      });

      // --- Dependency cube interactivity ---
      [leftCube, rightCube].forEach((cube, idx) => {
        const cubeType = idx === 0 ? "left" : "right";

        // Disable left cube (start point) if item has a predecessor
        const isDisabled = cubeType === "left" && hasPredecessor;

        if (isDisabled) {
          // Visual indication that left cube is disabled
          cube
            .attr("fill", "#e2e8f0")
            .style("opacity", 0.5)
            .style("cursor", "not-allowed");
        }

        cube
          .on("mouseenter", function () {
            if (activeDragItemId === null && !isDisabled)
              d3.select(this).style("cursor", "pointer");
            else if (isDisabled) d3.select(this).style("cursor", "not-allowed");
          })
          .on("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            // Prevent clicking if disabled (item has predecessor and this is left cube)
            if (isDisabled) {
              return;
            }

            if (activeDragItemId !== null) return;

            if (!dependencyActive) {
              dependencyActive = true;
              dependencyMode = true;
              dependencySourceItemId = item._id;
              dependencySourceType = cubeType;

              // Show all connectors when entering dependency mode
              svg
                .selectAll(
                  ".connector-cube-left, .connector-cube-right, .connector-line-left, .connector-line-right"
                )
                .style("opacity", 1);
            } else {
              if (dependencySourceItemId !== item._id) {
                // Map connector positions to predecessor link types
                // FS: right → left (Finish-to-Start)
                // SS: left → left (Start-to-Start)
                // FF: right → right (Finish-to-Finish)
                // SF: left → right (Start-to-Finish)
                let linkType = "FS"; // default
                if (dependencySourceType === "left" && cubeType === "left") {
                  linkType = "SS";
                } else if (
                  dependencySourceType === "right" &&
                  cubeType === "right"
                ) {
                  linkType = "FF";
                } else if (
                  dependencySourceType === "left" &&
                  cubeType === "right"
                ) {
                  linkType = "SF";
                } else if (
                  dependencySourceType === "right" &&
                  cubeType === "left"
                ) {
                  linkType = "FS";
                }

                // Create predecessor relationship on the successor item
                ganttChartStore.setPredecessor(item._id, {
                  itemId: dependencySourceItemId,
                  type: linkType,
                  lag: 0, // Default lag, can be updated later
                });

                drawDependencies();
              }

              dependencyActive = false;
              dependencyMode = false;
              dependencySourceItemId = null;
              dependencySourceType = null;
              // Hide all connectors, then show ones with dependencies
              svg
                .selectAll(
                  ".connector-cube-left, .connector-cube-right, .connector-line-left, .connector-line-right"
                )
                .style("opacity", 0);
              // Re-show connectors for items with dependencies
              showConnectorsForDependencies();
            }
          });
      });

      // --- activate visuals while dragging (indents only + hide status/subitems) ---

      // Create unified drag handler that handles both horizontal and vertical drags
      // This is necessary because calling .call(drag) twice overrides the first one
      // The handler detects the PRIMARY drag direction and locks it for the entire drag
      let dragStartX = 0;
      let dragStartY = 0;
      let dragDirection = null; // 'horizontal' or 'vertical' - one direction at a time
      let dragStarted = false;

      const unifiedDrag = d3
        .drag()
        .on("start", function (event) {
          // Block on dependency mode or pan mode
          if (dependencyMode || isSpacePressed.value || isPanModeActive.value) {
            event.sourceEvent?.stopPropagation();
            event.sourceEvent?.preventDefault();
            return;
          }

          // Check if pointer is in center area (not on left/right edges where resize zones are)
          const pointerX = event.x;
          const barX = xStart;
          const relativeX = pointerX - barX;

          // If pointer is on left or right edge (resize zones), don't handle drag here
          if (relativeX < 10 || relativeX > width - 10) {
            return; // Let resize drags handle it
          }

          // Store initial positions for direction detection
          dragStartX = event.x;
          dragStartY = event.y;
          dragDirection = null;
          dragStarted = false;

          // Call both start handlers - they'll check their own conditions
          // We call both because we don't know the direction yet
          // They'll set up their state, and we'll use the appropriate one in drag handler

          // IMPORTANT: Call vertical drag start FIRST (before horizontal sets activeDragItemId)
          // Vertical drag start - only if conditions allow
          if (
            !dependencyMode &&
            !isSpacePressed.value &&
            !isPanModeActive.value
          ) {
            // Temporarily clear activeDragItemId to allow vertical drag to start
            const tempActiveDragItemId = activeDragItemId;
            activeDragItemId = null;

            const verticalStartHandler = dragVertical.on("start");
            if (verticalStartHandler) {
              verticalStartHandler.call(this, event);
            }

            // Restore activeDragItemId (horizontal will set it if needed)
            activeDragItemId = tempActiveDragItemId;
          }

          // Horizontal drag start - only if conditions allow
          // Note: horizontal drag start doesn't set activeDragItemId immediately
          if (
            !dependencyMode &&
            !isSpacePressed.value &&
            !isPanModeActive.value
          ) {
            const horizontalStartHandler = dragHorizontal.on("start");
            if (horizontalStartHandler) {
              horizontalStartHandler.call(this, event);
            }
          }
        })
        .on("drag", function (event) {
          // Block drag if pan mode is active
          if (dependencyMode || isSpacePressed.value || isPanModeActive.value) {
            return;
          }

          // Handle auto-scroll based on mouse position near edges
          handleAutoScroll(event);

          if (!dragStarted) {
            // Determine PRIMARY drag direction based on which has more movement
            const deltaX = Math.abs(event.x - dragStartX);
            const deltaY = Math.abs(event.y - dragStartY);

            // Need at least 3px movement in one direction to start
            if (deltaX < 3 && deltaY < 3) {
              return; // Not enough movement yet
            }

            // Choose the PRIMARY direction based on which has more movement
            // This ensures only one direction is active at a time
            if (deltaY > deltaX) {
              // Primarily vertical - lock to vertical only
              dragDirection = "vertical";
              dragStarted = true;
            } else if (deltaX >= deltaY) {
              // Primarily horizontal (or equal) - lock to horizontal only
              dragDirection = "horizontal";
              dragStarted = true;
            } else {
              return; // Not enough movement
            }
          }

          // Handle drag based on locked direction (one direction at a time)
          if (dragDirection === "vertical") {
            const verticalDragHandler = dragVertical.on("drag");
            if (verticalDragHandler) {
              verticalDragHandler.call(this, event);
            }
          } else if (dragDirection === "horizontal") {
            const horizontalDragHandler = dragHorizontal.on("drag");
            if (horizontalDragHandler) {
              horizontalDragHandler.call(this, event);
            }
          }
        })
        .on("end", function (event) {
          // Stop auto-scrolling when drag ends
          stopAutoScroll();
          
          // Call end handler for the active direction
          if (dragDirection === "vertical") {
            const verticalEndHandler = dragVertical.on("end");
            if (verticalEndHandler) {
              verticalEndHandler.call(this, event);
            }
          } else if (dragDirection === "horizontal") {
            const horizontalEndHandler = dragHorizontal.on("end");
            if (horizontalEndHandler) {
              horizontalEndHandler.call(this, event);
            }
          }

          // Cleanup
          dragStartX = 0;
          dragStartY = 0;
          dragDirection = null;
          dragStarted = false;
        });

      // Apply unified drag handler to the whole item group so dragging works
      // when the user grabs the bar *or* the text/label area.
      itemGroup.call(unifiedDrag);
      itemGroup.style("cursor", "grab");
      bar.style("cursor", "grab");

      // --- Dragging logic (no minimum duration, prevent negative duration) ---
      const dragLeft = (function () {
        let blocked = false;
        let hasDragged = false;
        return d3
          .drag()
          .on("start", function () {
            // Block if item is currently loading (being updated via API)
            if (ganttChartStore.isItemLoading(item._id)) {
              blocked = true;
              return;
            }
            if (isSpacePressed.value || isPanModeActive.value) {
              blocked = true;
              return;
            }
            if (activeDragItemId && activeDragItemId !== item._id) {
              blocked = true;
              return;
            }
            blocked = false;
            activeDragItemId = item._id;
            // Set component-level drag state
            isAnyDragActive.value = true;
            activeDragItemIdRef.value = item._id;
            hasDragged = false;
            activateDragVisuals();
          })
          .on("drag", function (event) {
            if (blocked) return;
            hasDragged = true; // Mark that actual drag occurred
            // Prevent start from going past end (negative duration)
            const endX = x(end);
            const clampedX = Math.min(event.x, endX);
            const newX = Math.max(0, clampedX);
            const newWidth = x(end) - newX;
            const newStartDate = x.invert(Math.max(0, clampedX));
            outline.attr("x", newX - 5).attr("width", newWidth + 10);
            bar.attr("x", newX).attr("width", newWidth);
            leftIndent.attr("x", newX + 2);
            leftDragZone.attr("x", newX - 4);
            labelContainer
              .attr("x", newX + 14)
              .attr("width", Math.max(newWidth - 28, 0));
            if (statusText) statusText.attr("x", newX + newWidth - 8);
            showTooltip(
              leftDragZone.node(),
              moment(newStartDate).format("MMM DD, YYYY"),
              "top"
            );
          })
          .on("end", function (event) {
            if (blocked) return;

            // Prevent start from going past end (negative duration)
            const endX = x(end);
            const clampedX = Math.min(event.x, endX);
            const newStartDate = x.invert(Math.max(0, clampedX));

            // Apply 50% snapping logic for start date
            const dayStart = moment(newStartDate).startOf("day");
            const dayEnd = moment(newStartDate).endOf("day");
            const dayStartX = x(dayStart.toDate());
            const dayEndX = x(dayEnd.toDate());
            const dayWidth = dayEndX - dayStartX;
            const positionInDay =
              dayWidth > 0 ? (clampedX - dayStartX) / dayWidth : 0;

            // 50% logic: < 50% = start of current day, >= 50% = start of next day
            let snappedDate =
              positionInDay < 0.5
                ? dayStart.toDate()
                : moment(dayStart).add(1, "day").startOf("day").toDate();

            // Ensure start date is not after end date
            const finalStartDate = snappedDate > end ? end : snappedDate;

            // Set to START of day (convert local date to UTC)
            const startOfDay = moment(finalStartDate)
              .startOf("day")
              .utc()
              .toISOString();
            const currentStartDate = moment(item.startDate)
              .startOf("day")
              .utc()
              .toISOString();
            const dateChanged = startOfDay !== currentStartDate;

            hideTooltip();

            // Validate item still exists in store before applying updates
            const currentItem = ganttChartStore.allItems.find((i) => i._id === item._id);
            if (!currentItem) {
              // Item was removed during drag, just reset state
              activeDragItemId = null;
              hasDragged = false;
              isAnyDragActive.value = false;
              activeDragItemIdRef.value = null;
              // Trigger pending render if any
              if (pendingRender.value) {
                nextTick(() => {
                  renderChart();
                });
              }
              return;
            }

            // Clear component-level drag state before API call
            isAnyDragActive.value = false;
            activeDragItemIdRef.value = null;

            activeDragItemId = null;
            
            // Check if drag actually occurred before resetting hasDragged
            const didDrag = hasDragged;
            hasDragged = false;

            if (didDrag) {
              // Update item start date - this will set loading state and make API call
              ganttChartStore.updateItemTime(item._id, startOfDay, null).then(() => {
                console.log("Item start date updated successfully");
              }).catch((error) => {
                console.error("Error updating item start date:", error);
              });

              // Re-render immediately to show disabled state (loading state is set synchronously in updateItemTime)
              nextTick(() => {
                renderChart();
              });
            }
          });
      })();

      const dragRight = (function () {
        let blocked = false;
        let hasDragged = false;
        return d3
          .drag()
          .on("start", function () {
            // Block if item is currently loading (being updated via API)
            if (ganttChartStore.isItemLoading(item._id)) {
              blocked = true;
              return;
            }
            if (isSpacePressed.value || isPanModeActive.value) {
              blocked = true;
              return;
            }
            if (activeDragItemId && activeDragItemId !== item._id) {
              blocked = true;
              return;
            }
            blocked = false;
            activeDragItemId = item._id;
            // Set component-level drag state
            isAnyDragActive.value = true;
            activeDragItemIdRef.value = item._id;
            hasDragged = false;
            activateDragVisuals();
          })
          .on("drag", function (event) {
            if (blocked) return;
            hasDragged = true;
            // Prevent end from going before start (negative duration)
            const startX = x(start);
            const clampedX = Math.max(event.x, startX);
            const maxRight = containerWidth;
            const newEnd = Math.min(clampedX, maxRight);
            const newWidth = newEnd - xStart;
            const newEndDate = x.invert(Math.max(0, clampedX));
            outline.attr("width", newWidth + 10);
            bar.attr("width", newWidth);
            rightIndent.attr("x", xStart + newWidth - 4);
            rightDragZone.attr("x", xStart + newWidth - 8);
            labelContainer.attr("width", Math.max(newWidth - 28, 0));
            if (statusText) statusText.attr("x", xStart + newWidth - 8);
            showTooltip(
              rightDragZone.node(),
              moment(newEndDate).format("MMM DD, YYYY"),
              "top"
            );
          })
          .on("end", function (event) {
            if (blocked) return;

            // Prevent end from going before start (negative duration)
            const startX = x(start);
            const clampedX = Math.max(event.x, startX);
            const newEnd = Math.min(clampedX, containerWidth);
            const newEndDate = x.invert(newEnd);

            // Apply 50% snapping logic for end date
            const dayStart = moment(newEndDate).startOf("day");
            const dayEnd = moment(newEndDate).endOf("day");
            const dayStartX = x(dayStart.toDate());
            const dayEndX = x(dayEnd.toDate());
            const dayWidth = dayEndX - dayStartX;
            const positionInDay =
              dayWidth > 0 ? (clampedX - dayStartX) / dayWidth : 0;

            // 50% logic: < 50% = end of previous day, >= 50% = end of current day
            let snappedDate =
              positionInDay < 0.5
                ? moment(dayStart).subtract(1, "day").endOf("day").toDate()
                : dayEnd.toDate();

            // Ensure end date is not before start date
            const finalEndDate = snappedDate < start ? start : snappedDate;

            // Set to END of day (convert local date to UTC)
            const endOfDay = moment(finalEndDate)
              .endOf("day")
              .utc()
              .toISOString();
            const currentDueDate = moment(item.dueDate)
              .endOf("day")
              .utc()
              .toISOString();
            const dateChanged = endOfDay !== currentDueDate;

            hideTooltip();

            // Validate item still exists in store before applying updates
            const currentItem = ganttChartStore.allItems.find((i) => i._id === item._id);
            if (!currentItem) {
              // Item was removed during drag, just reset state
              activeDragItemId = null;
              hasDragged = false;
              isAnyDragActive.value = false;
              activeDragItemIdRef.value = null;
              // Trigger pending render if any
              if (pendingRender.value) {
                nextTick(() => {
                  renderChart();
                });
              }
              return;
            }

            // Clear component-level drag state before API call
            isAnyDragActive.value = false;
            activeDragItemIdRef.value = null;

            activeDragItemId = null;
            
            // Check if drag actually occurred before resetting hasDragged
            const didDrag = hasDragged;
            hasDragged = false;

            if (didDrag) {
              // Update item end date - this will set loading state and make API call
              ganttChartStore.updateItemTime(item._id, null, endOfDay).then(() => {
                console.log("Item end date updated successfully");
              }).catch((error) => {
                console.error("Error updating item end date:", error);
              });

              // Re-render immediately to show disabled state (loading state is set synchronously in updateItemTime)
              nextTick(() => {
                renderChart();
              });
            }
          });
      })();

      leftDragZone.call(dragLeft);
      rightDragZone.call(dragRight);

      yPos += 40;
    });

    // Store phase bounds for drag detection
    phaseBounds[group.phase] = {
      yStart: phaseStartY,
      yEnd: yPos + 48, // Include spacing after phase
      itemAreaStart: phaseStartY + 24,
      phaseObject: phaseObject,
    };

    yPos += 48;
  });

  // New: Drag behavior for cubes to create preview line
  function createDependencyDrag(cubeData) {
    return d3
      .drag()
      .on("start", function (event) {
        if (dependencyActive) return; // Prevent multiple drags

        const [mx, my] = d3.pointer(event, svg.node());
        dependencyActive = true;
        dependencySourceItemId = cubeData.id;
        dependencySourceType = cubeData.type;

        // Show source connector
        d3.select(`.cube-${cubeData.id}-${cubeData.type}`).style("opacity", 1);
        const sourceItemGroup = d3
          .select(cubeData.element)
          .node()
          ?.closest(".item-group");
        if (sourceItemGroup) {
          d3.select(sourceItemGroup)
            .select(`.connector-line-${cubeData.type}`)
            .style("opacity", 1);
          d3.select(sourceItemGroup)
            .select(".item-bar-outline")
            .style("opacity", 1);
          d3.select(cubeData.element)
            .attr("fill", "#3b82f6")
            .style("opacity", 1);
          // bring source item group and cube to front and ensure visibility
          d3.select(sourceItemGroup).raise();
          d3.select(cubeData.element)
            .raise()
            .attr("fill", "#3b82f6")
            .style("opacity", 1);
        }

        // Create preview line from source cube center to mouse
        const sourceX = cubeData.x;
        const sourceY = cubeData.y;
        dependencyPreviewLine = connectorsLayer
          .append("path")
          .attr("class", "dependency-preview-line")
          .attr(
            "d",
            getNoodlePath(
              sourceX,
              sourceY,
              mx,
              my,
              cubeData.type, // fromType
              mx >= sourceX ? "left" : "right" // rough toType guess
            )
          )
          .attr("stroke", "#516CE0")
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("marker-end", "url(#preview-arrowhead)")
          .attr("stroke-opacity", 0.9)
          .style("filter", "drop-shadow(0 0 4px rgba(81,108,224,0.25))")
          .style("pointer-events", "none")
          .style("opacity", 0.7);

        // Highlight source cube
        d3.select(cubeData.element).attr("fill", "#3b82f6").style("opacity", 1);

        // Enter dependency mode: Show all potential target cubes
        allCubes.forEach((c) => {
          if (c.id !== cubeData.id) {
            d3.select(c.element).style("opacity", 1);
            const lineClass =
              c.type === "left"
                ? ".connector-line-left"
                : ".connector-line-right";
            const itemG = d3.select(c.element).node().closest(".item-group");
            d3.select(itemG).select(lineClass).style("opacity", 1);
          }
        });
      })
      .on("drag", function (event) {
        if (!dependencyActive) return;

        const [mx, my] = d3.pointer(event, svg.node());
        const sourceX = cubeData.x;
        const sourceY = cubeData.y;

        // Keep source outline visible and bring cube/group to front during drag
        const sourceCubeEl =
          svg
            .select(`.cube-${dependencySourceItemId}-${dependencySourceType}`)
            .node() ||
          svg.select(`.cube-${dependencySourceItemId}-left`).node() ||
          svg.select(`.cube-${dependencySourceItemId}-right`).node();
        if (sourceCubeEl) {
          const sourceGroup = d3.select(sourceCubeEl.parentElement);
          if (sourceGroup) {
            sourceGroup.select(".item-bar-outline").style("opacity", 1);
            sourceGroup.raise();
          }
          d3.select(sourceCubeEl)
            .raise()
            .attr("fill", "#3b82f6")
            .style("opacity", 1);
        }

        // Update preview line to follow mouse
        let previewToType = mx >= sourceX ? "left" : "right";
        if (hoveredTargetCube) {
          // When we’re actually over a target cube, use its side so preview == final
          previewToType = hoveredTargetCube.type; // "left" or "right"
        }
        dependencyPreviewLine.attr(
          "d",
          getNoodlePath(
            sourceX,
            sourceY,
            mx,
            my,
            cubeData.type, // fromType ("left"/"right" on source cube)
            previewToType // toType ("left"/"right" on target side)
          )
        );
        // Check for hover over target cubes
        hoveredTargetCube = null;
        allCubes.forEach((c) => {
          if (c.id === dependencySourceItemId) return;
          const dx = mx - c.x;
          const dy = my - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= c.radius) {
            hoveredTargetCube = c;
            // Highlight target
            d3.select(c.element).attr("fill", "#10b981").style("opacity", 1); // Green for valid drop
            return;
          } else {
            // Reset if not hovered
            d3.select(c.element).attr("fill", "#cbd5e1").style("opacity", 1);
          }
        });

        if (hoveredTargetCube) {
          // Optional: Show tooltip with link type preview (e.g., based on sourceType + targetType)
          const linkType = getLinkTypeFromEndpoints(
            dependencySourceType,
            hoveredTargetCube.type
          );
          showTooltip(
            hoveredTargetCube.element,
            `Connect as ${linkType}`,
            "top"
          );
        } else {
          hideTooltip();
        }
      })
      .on("end", function (event) {
        if (!dependencyActive) return;

        const [mx, my] = d3.pointer(event, svg.node());

        // Hide preview
        if (dependencyPreviewLine) {
          dependencyPreviewLine.remove();
          dependencyPreviewLine = null;
        }

        // ensure source cube is visible briefly (then reset below)
        const sourceCubeEl =
          svg
            .select(`.cube-${dependencySourceItemId}-${dependencySourceType}`)
            .node() ||
          svg.select(`.cube-${dependencySourceItemId}-left`).node() ||
          svg.select(`.cube-${dependencySourceItemId}-right`).node();
        if (sourceCubeEl) {
          d3.select(sourceCubeEl).raise();
        }

        // Reset highlights
        allCubes.forEach((c) => {
          d3.select(c.element)
            .attr("fill", "#cbd5e1")
            .style("opacity", c.id === dependencySourceItemId ? 0 : 1); // Hide source if no existing dep
        });

        // If dropped on valid target
        if (
          hoveredTargetCube &&
          hoveredTargetCube.id !== dependencySourceItemId
        ) {
          const targetItemId = hoveredTargetCube.id;
          const targetType = hoveredTargetCube.type;
          const linkType = getLinkTypeFromEndpoints(
            dependencySourceType,
            targetType
          );

          // Check if target already has predecessor
          const targetItem = ganttChartStore.allItems.find(
            (i) => i._id === targetItemId
          );
          if (targetItem.predecessor && targetItem.predecessor.itemId) {
            // Show popup to confirm breaking old connection
            if (
              confirm(
                `Item "${
                  targetItem.title
                }" already has a predecessor. Break existing connection and link to "${
                  ganttChartStore.allItems.find(
                    (i) => i._id === dependencySourceItemId
                  ).title
                }" as ${linkType}?`
              )
            ) {
              // Break old: Set predecessor's successor chain update if needed, but for now just update
              ganttChartStore.removePredecessor(targetItemId); // Remove old link locally
            } else {
              // Cancel
              resetDependencyMode();
              return;
            }
          }

          // Create new predecessor link locally
          const lag = 0; // Default; could prompt or calculate
          ganttChartStore.setPredecessor(targetItemId, {
            itemId: dependencySourceItemId,
            type: linkType,
            lag,
          });

          // Auto-recalculate dates for target (preserving duration)
          // This should trigger cascade via store logic
          renderChart(); // Re-render to show new line

          // Success feedback
          showTooltip(
            hoveredTargetCube.element,
            `Connected as ${linkType}`,
            "bottom",
            1000
          );
        } else {
          // Cancel: No valid drop
          hideTooltip();
        }

        resetDependencyMode();
      });
  }

  // New: Helper to map endpoint types to link type
  function getLinkTypeFromEndpoints(sourceType, targetType) {
    if (sourceType === "right" && targetType === "left") return "FS";
    if (sourceType === "left" && targetType === "left") return "SS";
    if (sourceType === "right" && targetType === "right") return "FF";
    if (sourceType === "left" && targetType === "right") return "SF";
    return "FS"; // Default
  }

  // New: Reset dependency mode
  function resetDependencyMode() {
    dependencyActive = false;
    dependencySourceItemId = null;
    dependencySourceType = null;
    hoveredTargetCube = null;

    // Hide all non-existing connectors
    svg
      .selectAll(
        ".connector-cube-left, .connector-cube-right, .connector-line-left, .connector-line-right"
      )
      .style("opacity", 0);

    // Re-show existing ones
    showConnectorsForDependencies();
  }

  // Apply drag to all cubes (after they are created)
  allCubes.forEach((cubeData) => {
    d3.select(cubeData.element).call(createDependencyDrag(cubeData));
  });

  // --- Show connectors for items with dependencies ---
  function showConnectorsForDependencies() {
    // Collect all item IDs that have dependencies (from predecessor relationships)
    const itemsWithDeps = new Set();
    const itemConnectorTypes = {}; // { itemId: { left: boolean, right: boolean } }

    // Convert predecessor relationships to connector positions
    ganttChartStore.allItems.forEach((item) => {
      if (item.predecessor && item.predecessor.itemId !== null) {
        const predecessorId = item.predecessor.itemId;
        const linkType = item.predecessor.type || "FS";

        itemsWithDeps.add(predecessorId);
        itemsWithDeps.add(item._id);

        // Map link type to connector positions
        // FS: right → left (Finish-to-Start)
        // SS: left → left (Start-to-Start)
        // FF: right → right (Finish-to-Finish)
        // SF: left → right (Start-to-Finish)
        let fromType, toType;
        if (linkType === "FS") {
          fromType = "right";
          toType = "left";
        } else if (linkType === "SS") {
          fromType = "left";
          toType = "left";
        } else if (linkType === "FF") {
          fromType = "right";
          toType = "right";
        } else if (linkType === "SF") {
          fromType = "left";
          toType = "right";
        } else {
          // Default to FS
          fromType = "right";
          toType = "left";
        }

        // Track which connector types are used
        if (!itemConnectorTypes[predecessorId]) {
          itemConnectorTypes[predecessorId] = { left: false, right: false };
        }
        if (!itemConnectorTypes[item._id]) {
          itemConnectorTypes[item._id] = { left: false, right: false };
        }

        // Mark the connector types used
        itemConnectorTypes[predecessorId][fromType] = true;
        itemConnectorTypes[item._id][toType] = true;
      }
    });

    // Show connectors for items with dependencies
    itemsWithDeps.forEach((itemId) => {
      const connectorTypes = itemConnectorTypes[itemId];
      // Find the item to check if it has a predecessor
      const item = ganttChartStore.allItems.find((i) => i._id === itemId);
      const hasPredecessor =
        item && item.predecessor && item.predecessor.itemId !== null;

      if (connectorTypes.left) {
        // Find the left line and cube for this item
        const leftLine = svg.select(`.cube-${itemId}-left`).node();
        if (leftLine) {
          // Get the parent group and select the line
          const itemGroup = d3.select(leftLine.parentElement);
          const line = itemGroup.select(".connector-line-left");
          const cube = itemGroup.select(`.cube-${itemId}-left`);
          if (line.node()) line.style("opacity", 1);
          if (cube.node()) {
            cube.style("opacity", 1);
            // Maintain disabled styling if item has predecessor
            if (hasPredecessor) {
              cube.attr("fill", "#e2e8f0").style("opacity", 0.5);
            }
          }
        }
      }
      if (connectorTypes.right) {
        // Find the right line and cube for this item
        const rightLine = svg.select(`.cube-${itemId}-right`).node();
        if (rightLine) {
          // Get the parent group and select the line
          const itemGroup = d3.select(rightLine.parentElement);
          const line = itemGroup.select(".connector-line-right");
          const cube = itemGroup.select(`.cube-${itemId}-right`);
          if (line.node()) line.style("opacity", 1);
          if (cube.node()) cube.style("opacity", 1);
        }
      }
    });
  }

  // --- Draw dependencies between cubes ---
  function drawDependencies() {
    console.log("=== drawDependencies called ===");
    svg.selectAll(".dependency-line").remove();
    svg.selectAll(".lag-input-group").remove();

    // Convert predecessor relationships to visual dependencies
    const itemsWithPredecessors = ganttChartStore.allItems.filter(
      (i) => i.predecessor && i.predecessor.itemId !== null
    );
    // console.log("Items with predecessors:", itemsWithPredecessors.length);

    ganttChartStore.allItems.forEach((item) => {
      if (item.predecessor && item.predecessor.itemId !== null) {
        const predecessorId = item.predecessor.itemId;
        const linkType = item.predecessor.type || "FS";

        // Map link type to connector positions
        let fromType, toType;
        if (linkType === "FS") {
          fromType = "right";
          toType = "left";
        } else if (linkType === "SS") {
          fromType = "left";
          toType = "left";
        } else if (linkType === "FF") {
          fromType = "right";
          toType = "right";
        } else if (linkType === "SF") {
          fromType = "left";
          toType = "right";
        } else {
          // Default to FS
          fromType = "right";
          toType = "left";
        }

        const fromCube = svg
          .select(`.cube-${predecessorId}-${fromType}`)
          .node();
        const toCube = svg.select(`.cube-${item._id}-${toType}`).node();
        if (!fromCube || !toCube) return;

        const fromRect = fromCube.getBoundingClientRect();
        const toRect = toCube.getBoundingClientRect();
        const svgRect = svg.node().getBoundingClientRect();
        const x1 = fromRect.x + fromRect.width / 2 - svgRect.x;
        const y1 = fromRect.y + fromRect.height / 2 - svgRect.y;
        const x2 = toRect.x + toRect.width / 2 - svgRect.x;
        const y2 = toRect.y + toRect.height / 2 - svgRect.y;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        // Create dependency line
        const dependencyLine = connectorsLayer
          .append("path")
          .attr("class", "dependency-line")
          .attr("data-item-id", item._id)
          .attr("data-predecessor-id", predecessorId)
          .attr("d", getNoodlePath(x1, y1, x2, y2, fromType, toType))
          .attr("stroke", "#9CA3AF")
          .attr("stroke-width", 1)
          .attr("fill", "none")
          .attr("marker-end", "url(#arrowhead)")
          .attr("stroke-opacity", 0.9)
          .style("filter", "drop-shadow(0 0 4px rgba(81,108,224,0.35))");

        // Calculate current lag based on link type
        const predecessorItem = ganttChartStore.allItems.find(
          (i) => i._id === predecessorId
        );
        if (predecessorItem) {
          // Normalize to full days for lag calculation
          const predStart = moment(predecessorItem.startDate)
            .startOf("day")
            .toDate();
          const predEnd = moment(predecessorItem.dueDate).endOf("day").toDate();
          const itemStart = moment(item.startDate).startOf("day").toDate();
          const itemEnd = moment(item.dueDate).endOf("day").toDate();

          let calculatedLag = 0;
          const msPerDay = 24 * 60 * 60 * 1000;

          if (linkType === "FS") {
            // Finish-to-Start: days between predecessor end and item start
            calculatedLag = (itemStart - predEnd) / msPerDay;
          } else if (linkType === "SS") {
            // Start-to-Start: days between predecessor start and item start
            calculatedLag = (itemStart - predStart) / msPerDay;
          } else if (linkType === "FF") {
            // Finish-to-Finish: days between predecessor end and item end
            calculatedLag = (itemEnd - predEnd) / msPerDay;
          } else if (linkType === "SF") {
            // Start-to-Finish: days between predecessor start and item end
            calculatedLag = (itemEnd - predStart) / msPerDay;
          }

          // Use stored lag if available, otherwise use calculated
          const currentLag =
            item.predecessor.lag !== undefined
              ? item.predecessor.lag
              : calculatedLag;
          const lagValue = Math.round(currentLag); // Round to whole number

          // Create lag input box using helper function
          const lagInputResult = createLagInputGroup({
            svg,
            midX,
            midY,
            lagValue,
            item,
            predecessorId,
            linkType,
            dependencyLine,
            ganttChartStore,
            renderChart,
          });
          
          const { lagGroup, input, boxWidth, boxHeight } = lagInputResult;

          // Store lag input bounds for proximity-based hover detection
          // Get bounding box of dependency line path and expand by buffer
          const lineNode = dependencyLine.node();
          const lineBBox = lineNode ? lineNode.getBBox() : null;
          lagInputBounds.push({
            midX,
            midY,
            boxWidth,
            boxHeight,
            lagGroup,
            dependencyLine,
            inputNode: input.node(), // Store input node to check focus state
            // Store bounding box for simple proximity check
            lineX: lineBBox ? lineBBox.x : 0,
            lineY: lineBBox ? lineBBox.y : 0,
            lineWidth: lineBBox ? lineBBox.width : 0,
            lineHeight: lineBBox ? lineBBox.height : 0,
          });
        }
      }
    });

    // Show connectors for items with dependencies
    showConnectorsForDependencies();
  }

  // Cancel dependency mode when clicking background
  svg.on("click", (event) => {
    if (event.defaultPrevented) return;

    // Check if click is near a dependency line (10px buffer)
    const [mx, my] = d3.pointer(event, chart.node());
    const LAG_BUFFER = 10;
    let clickedNearLagInput = false;
    
    lagInputBounds.forEach((lagBounds) => {
      // Check if click is within buffer zone around dependency line path
      const isNear = isPointNearPath(mx, my, lagBounds.dependencyLine, LAG_BUFFER);
      
      if (isNear) {
        clickedNearLagInput = true;
        // Show and focus the lag input
        lagBounds.lagGroup.style("opacity", 1).style("pointer-events", "all");
        lagBounds.dependencyLine.attr("stroke", "#3B82F6");
        // Focus the input element
        if (lagBounds.inputNode) {
          lagBounds.inputNode.focus();
          lagBounds.inputNode.select(); // Select all text for easy editing
        }
        event.stopPropagation(); // Prevent other click handlers
      }
    });

    // If clicked near lag input, don't process other click handlers
    if (clickedNearLagInput) return;

    // Check if click is on empty space
    const isEmptySpace = isClickOnEmptySpace(event, svg, chart);

    // If not empty space, hide button if showing
    if (!isEmptySpace) {
      updateAddMilestoneButton(false, 0, 0, svg, chart);
    }

    if (dependencyActive) {
      dependencyActive = false;
      dependencyMode = false;
      dependencySourceItemId = null;
      dependencySourceType = null;
      // Hide all connectors, then show ones with dependencies
      svg
        .selectAll(
          ".connector-cube-left, .connector-cube-right, .connector-line-left, .connector-line-right"
        )
        .style("opacity", 0);
      // Re-show connectors for items with dependencies
      showConnectorsForDependencies();
    }

    // If empty space and not in dependency mode, show button (but not if date picker just closed)
    if (
      isEmptySpace &&
      !dependencyActive &&
      !isSpacePressed.value &&
      !isPanModeActive.value &&
      activeDragItemId === null &&
      !datePickerJustClosed.value &&
      !contextMenuJustClosed.value
    ) {
      const [x, y] = d3.pointer(event, chart.node());
      updateAddMilestoneButton(true, x, y, svg, chart);
    } else if (isEmptySpace && !dependencyActive) {
      // Hide button if conditions not met
      updateAddMilestoneButton(false, 0, 0, svg, chart);
    }
  });

  // Proximity-based connector visibility (10px buffer around items)
  // Enhances existing hover - shows connectors when cursor is near items
  svg.on("mousemove", function (event) {
    if (activeDragItemId !== null || dependencyMode) return;
    const [mx, my] = d3.pointer(event, chart.node());
    const BUFFER = 20; // Distance in pixels - change this to adjust hover distance

    if (itemBounds.length === 0) return;

    itemBounds.forEach((bounds) => {
      // Check if mouse is within horizontal buffer zone (left/right only, not top/bottom)
      const isNear =
        mx >= bounds.x - BUFFER &&
        mx <= bounds.x + bounds.width + BUFFER &&
        my >= bounds.y &&
        my <= bounds.y + bounds.height;

      if (isNear) {
        // Show connectors when near item
        bounds.rightLine.style("opacity", 1);
        bounds.rightCube.style("opacity", 1);
        if (!bounds.hasPredecessor) {
          bounds.leftLine.style("opacity", 1);
          bounds.leftCube.style("opacity", 1);
        } else {
          bounds.leftLine.style("opacity", 1);
          bounds.leftCube.style("opacity", 0.5).attr("fill", "#e2e8f0");
        }
      } else {
        // Hide connectors when not near
        bounds.leftLine.style("opacity", 0);
        bounds.leftCube.style("opacity", 0);
        bounds.rightLine.style("opacity", 0);
        bounds.rightCube.style("opacity", 0);
      }
    });

    // Proximity-based lag input visibility (10px buffer around dependency line path)
    const LAG_BUFFER = 10; // Distance in pixels for lag input hover
    lagInputBounds.forEach((lagBounds) => {
      // Check if mouse is within buffer zone around dependency line path (1px line + buffer)
      const isNearLag = isPointNearPath(mx, my, lagBounds.dependencyLine, LAG_BUFFER);
      
      // Check if mouse is over the lag container itself
      const isOverLagContainer =
        mx >= lagBounds.midX - lagBounds.boxWidth / 2 &&
        mx <= lagBounds.midX + lagBounds.boxWidth / 2 &&
        my >= lagBounds.midY - lagBounds.boxHeight / 2 &&
        my <= lagBounds.midY + lagBounds.boxHeight / 2;

      if (isNearLag || isOverLagContainer) {
        // Show lag input when near dependency line or over the container
        lagBounds.lagGroup.style("opacity", 1).style("pointer-events", "all");
        lagBounds.dependencyLine.attr("stroke", "#3B82F6");
      } else {
        // Hide lag input when not near (but check if input is focused first)
        const isFocused = lagBounds.inputNode && document.activeElement === lagBounds.inputNode;
        if (!isFocused) {
          // Only hide if not focused
          lagBounds.lagGroup.style("opacity", 0).style("pointer-events", "none");
          lagBounds.dependencyLine.attr("stroke", "#9CA3AF");
        }
      }
    });

    // Restore connectors with dependencies (in case we hid them)
    showConnectorsForDependencies();
  });

  // render all existing dependencies
  drawDependencies();

  // Sync header scroll position with content on render
  if (headerRef.value && containerRef.value && headerSvgRef.value) {
    const scrollLeft = containerRef.value.scrollLeft;
    headerSvgRef.value.style.transform = `translateX(-${scrollLeft}px)`;
  }
}

const onClickZoomControl = (type) => {
  if (!containerRef.value) return;

  const container = containerRef.value;

  // Calculate reference point based on current viewport center
  // This maintains the current viewport position during zoom
  const viewportCenter = container.clientWidth / 2;
  const reference =
    (container.scrollLeft + viewportCenter) /
    Math.max(container.scrollWidth, 1);

  if (type === "minus") {
    zoomFactor.value = Math.max(MIN_ZOOM, zoomFactor.value - 0.1);
  } else if (type === "plus") {
    zoomFactor.value = Math.min(MAX_ZOOM, zoomFactor.value + 0.1);
  }

  // After zoom and re-render, maintain scroll position using reference point
  // Use same approach as wheel zoom for smooth behavior
  nextTick(() => {
    if (!containerRef.value) return;
    const newScrollWidth = Math.max(containerRef.value.scrollWidth, 1);
    const newViewportCenter = containerRef.value.clientWidth / 2;
    const newScrollLeft = reference * newScrollWidth - newViewportCenter;
    containerRef.value.scrollLeft = Math.max(0, newScrollLeft);
  });
};

const showCursorToolTip = ref(false);
const cursorTooltipPosition = ref({ x: 0, y: 0 });

function handleMouseMoveGanttChart(e) {
  const bar = e.target.closest?.(".interval-col");

  if (!bar) {
    showCursorToolTip.value = false;
    return;
  }

  showCursorToolTip.value = true;

  cursorTooltipPosition.value = {
    x: e.clientX + 12,
    y: e.clientY + 12,
  };
}

const onClickProjectScheduleDateButton = () => {
  const items = ganttChartStore.items || [];

  if (!items.length) return;

  // 🔍 find earliest startDate
  const earliestItemDate = items
    .map((item) => item.startDate)
    .filter(Boolean) // remove null / undefined / empty
    .map((date) => moment(date))
    .filter((m) => m.isValid())
    .reduce((earliest, current) =>
      current.isBefore(earliest) ? current : earliest
    );

  if (!earliestItemDate) return;

  const targetDate = earliestItemDate.startOf("day").toDate();

  const earliestPosition = xScale(targetDate);
  const scrollPosition = Math.max(0, earliestPosition - 20);

  containerRef.value.scrollTo({
    left: scrollPosition,
    // behavior: "smooth",
  });
};

const onClickTodayDateButton = () => {
  if (!xScale || !containerRef.value) {
    return;
  }

  const todayDate = moment().toDate();
  const todayPosition = xScale(todayDate);

  const scrollPosition = todayPosition - containerRef.value.clientWidth / 2;
  const targetScrollLeft = Math.max(0, scrollPosition);

  containerRef.value.scrollTo({
    left: targetScrollLeft,
    // behavior: "smooth",
  });
};

const onClickPanViewButton = () => {
  isPanModeActive.value = !isPanModeActive.value;
  updateContainerCursor();

  // Stop panning if disabling pan mode while panning
  if (!isPanModeActive.value && isPanning) {
    stopPan();
  }
};

function scrollToStoredGanttDate() {
  const storedDate = localStorage.getItem("initalStartDateToSetForGanttChart");

  if (!storedDate || !containerRef.value || !xScale) return;

  const targetDate = moment(storedDate).startOf("day").toDate();
  const earliestPosition = xScale(targetDate);

  if (earliestPosition == null || isNaN(earliestPosition)) return;

  containerRef.value.scrollTo({
    left: Math.max(0, earliestPosition - 20),
    // behavior: "smooth",
  });

  localStorage.removeItem("initalStartDateToSetForGanttChart");
}

onMounted(async () => {
  await nextTick();

  // Retry until layout + scale are ready
  const interval = setInterval(() => {
    scrollToStoredGanttDate();
    if (!localStorage.getItem("initalStartDateToSetForGanttChart")) {
      clearInterval(interval);
    }
  }, 50);
});
</script>

<style scoped lang="scss">
.gantt-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid var(--gray-100, #f3f4f6);
  user-select: none;
  position: relative;
  overflow: hidden;
  .zoom-controls-wrapper,
  .pan-view-button-wrapper,
  .start-project-schedule-buttons-wrapper {
    display: inline-flex;
    padding: 0.25rem;
    align-items: center;
    gap: 0.25rem;
    border-radius: 6.25rem;
    background: var(--white, #fff);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

    .button-wrapper {
      border-radius: 0.625rem;
      display: flex;
      padding: 0.25rem;
      justify-content: center;
      align-items: center;
      align-self: stretch;
      cursor: pointer;
      transition: all 0.35s ease-in-out;
      &:hover {
        background: var(--Grey-50, #f9fafb);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
          0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
    }
  }

  .zoom-controls-pan-view-button-wrapper {
    top: 3.5rem;
    right: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 2;
    position: absolute;
  }

  .pan-view-button-wrapper {
    padding: 0.4375rem;
    cursor: pointer;
    img {
      display: flex;
    }
    &:hover {
      background: var(--Grey-50, #f9fafb);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    &.is-active {
      background: var(--Grey-100, #f3f4f6);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
  }

  .start-project-schedule-buttons-wrapper {
    left: 0.875rem;
    bottom: 4rem;
    z-index: 2;
    position: absolute;
  }
}

.gantt-header {
  width: 100%;
  overflow-x: hidden; // Scrolling controlled by content
  overflow-y: hidden;
  position: sticky;
  top: 0;
  // z-index: 1;
  background: #ffffff;
}

.gantt-content {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  cursor: cell;
  // Hide scrollbars but keep scroll functionality
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE and Edge
  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
  &.is-space-pressed,
  &.is-pan-mode-active {
    cursor: grab;
  }
  &.is-panning {
    cursor: grabbing;
  }
}

.add-milestone-pointer-tooltip {
  display: flex;
  height: 1.5rem;
  padding: 0 0.25rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.375rem;
  border: 1px solid var(--gray-100, #f3f4f6);
  background: var(--white, #fff);

  /* /shadow/lg */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  color: var(--gray-600, #4b5563);
  font-family: Nunito;
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.item-bar,
.connector-line-left,
.connector-line-right,
.connector-cube-left,
.connector-cube-right {
  transition: all 0.12s ease-out;
}

.day-labels-background {
  fill: var(--white, #fff);
}

.add-milestone-button-group {
  display: flex;
  align-items: center;
}

// Date picker trigger (hidden, used for positioning)
.gantt-date-picker-trigger {
  position: fixed;
  width: 1px;
  height: 1px;
  pointer-events: none;
  visibility: hidden;
}

// Custom date tooltip (absolutely positioned HTML element)
.gantt-date-tooltip {
  position: fixed;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10000;
  transition: opacity 0.2s ease-in-out;

  border-radius: 0.375rem;
  border: 1px solid var(--gray-100, #f3f4f6);
  background: var(--white, #fff);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: inline-flex;
  height: 1.5rem;
  padding: 0 0.25rem;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  color: var(--Grey-500, #6b7280);
  font-size: 0.625rem;
}

.loading-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #6b7280;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.gantt-chart-svg {
  background: #fff;
  :deep(.phase-label-group) {
    cursor: pointer;
  }
  :deep(.phase-name-text) {
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    fill: #4b5563;
  }

  :deep(.phase-name-underline) {
    stroke: #4b5563;
    stroke-width: 1;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  :deep(.phase-label-group:hover .phase-name-underline) {
    opacity: 1;
  }
  :deep(.week-info-icon) {
    cursor: pointer;
    pointer-events: all;
  }
  :deep(.icon-group-path) {
    opacity: 0.7;
    transition: opacity 0.2 ease-in-out;
  }
  :deep(.lag-input-container) {
    fill: var(--white, #FFF);
    stroke: var(--gray-100, #F3F4F6);
    stroke-width: 1;
    rx: 6px; /* border-radius equivalent */
    // filter: drop-shadow(0 10px 15px -3px rgba(0, 0, 0, 0.10)) drop-shadow(0 4px 6px -2px rgba(0, 0, 0, 0.05));
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.10)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06));

  }

  :deep(.lag-input-button) {
    cursor: pointer;
    transition: all 0.2s ease;

    .lag-input-button-container {
      fill: var(--white, #FFF);
      // stroke: var(--gray-200, #E5E7EB);
      // stroke-width: 1;
      transition: fill 0.2s ease;
      // filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.10)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06));
    }

    &:hover {
      .lag-input-button-container {
        fill: var(--Governor-Bay-100, #DFE6FA);
      }
    }

    &:active {
      .lag-input-button-container {
        fill: var(--gray-100, #F3F4F6);
      }
    }
  }

  :deep(.lag-input-label) {
    color: var(--Governor-Bay-500, #516CE0);
    font-size: .625rem;
    fill: var(--Governor-Bay-500, #516CE0);
    pointer-events: none;
  }

  :deep(.lag-input-group) {
    input[type="number"] {
      color: var(--Governor-Bay-500, #516CE0);
      font-size: .625rem;
      
      /* Hide spinner arrows for Chrome, Safari, Edge */
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      
      /* Hide spinner arrows for Firefox */
      -moz-appearance: textfield;
      
      /* Keep input compact */
      min-width: auto;
      max-width: 100%;
      width: 100%;
    }
  }
}

.chart-header-svg {
  background: #fff;
  transform: translateX(0);
  :deep(.interval-label) {
    color: var(--gray-400, #9ca3af);
    font-family: Nunito;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1rem; /* 133.333% */
    letter-spacing: 0.0375rem;
    text-transform: uppercase;
  }
}
</style>

<style lang="scss">
// Global style for teleported menu content (OMenu teleports to body)
.gantt-date-picker-menu-content {
  max-height: 25rem !important;
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  min-width: 18.5rem !important;

  // Remove transition delay for instant closing
  &.menu-fade-leave-active,
  &.menu-fade-leave-to {
    transition: none !important;
  }

  .gantt-date-picker-content {
    background: var(--white, #fff);
    border: 1px solid var(--gray-200, #e5e7eb);
    border-radius: 8px;
    box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.05);
    padding: 6px !important;
    .relative-days-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding-left: 0.75rem;
      padding-top: 6px;

      div {
        border-radius: 8px;
        background: var(--gray-100, #f3f4f6);
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
        display: flex;
        padding: 0.25rem 0.75rem;
        justify-content: center;
        align-items: center;
        gap: 4px;
        cursor: pointer;

        &:hover {
          background: var(--gray-200, #e5e7eb);
        }

        span {
          color: var(--gray-600, #4b5563);
          font-size: 0.75rem;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
      }
    }
  }
  .dp__menu {
    border: none !important;
    background: transparent !important;
  }
}

// Global style for context menu content (OMenu teleports to body)
.gantt-context-menu-content {
  padding: 2px !important;
  display: flex !important;
  flex-direction: column !important;

  // Remove transition delay for instant closing
  &.menu-fade-leave-active,
  &.menu-fade-leave-to {
    transition: none !important;
  }

  .gantt-context-menu-item {
    cursor: pointer;
    color: #111827;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--gray-100, #f3f4f6);
    }

    .basic-dropdown-item-option-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  }
}

.gantt-item-label-text {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 500;
  font-family: "Nunito", sans-serif;
  pointer-events: none;
}
</style>
