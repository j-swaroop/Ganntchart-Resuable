import { ref, nextTick, reactive } from "vue";
import { useGanttChart } from "@/stores/ganttChart.store";
import moment from "moment";

export const useGanttContextMenu = () => {
  const ganttChartStore = useGanttChart();

  // Context menu state
  const contextMenuMenu = ref(null);
  const contextMenuTrigger = ref(null);
  const contextMenuItem = ref(null);
  const contextMenuTriggerStyle = ref({});
  const contextMenuPlacement = ref("bottom-start");
  const contextMenuJustClosed = ref(false); // Flag to prevent milestone button from showing immediately after closing
  let contextMenuCloseTimeout = null;

  // Context menu items
  const contextMenuItems = ref([
    { _id: 1, name: "Edit" },
    { _id: 6, name: "Add Sub item" },
    { _id: 5, name: "Delete" },
    { _id: 8, name: "Duplicate Item" },
  ]);

  // Context menu handlers
  const openContextMenu = (item, event, itemBarElement = null) => {
    // Close existing menu if open and clear item
    if (contextMenuMenu.value) {
      contextMenuMenu.value.closeMenu();
    }
    contextMenuItem.value = null;

    // Set the new item for context menu
    contextMenuItem.value = item;

    // Check if trigger exists (same as date picker)
    if (!contextMenuTrigger.value) return;

    // Get item bar rect (itemBarElement should always be provided from handler)
    const itemBar = itemBarElement;
    if (!itemBar) return;

    const rect = itemBar.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const menuHeight = 300; // Approximate menu height
    const spacing = 8;

    // Check if there's space below, otherwise position above (same as date picker)
    const hasSpaceBelow = rect.bottom + menuHeight + spacing < viewportHeight;
    const isTop = !hasSpaceBelow;

    // Set placement (right side, like end date picker)
    contextMenuPlacement.value = isTop ? "top-end" : "bottom-end";

    // Position trigger at right side of item bar (like end date picker)
    contextMenuTriggerStyle.value = {
      left: `${rect.right}px`,
      top: `${isTop ? rect.top - spacing : rect.bottom + spacing}px`,
    };

    // Open menu (same as date picker)
    nextTick(() => {
      contextMenuMenu.value?.openMenu();
    });
  };

  const closeContextMenu = () => {
    contextMenuMenu.value?.closeMenu();
    contextMenuItem.value = null;

    // Set flag to prevent milestone button from showing immediately after closing (same as date picker)
    contextMenuJustClosed.value = true;

    // Clear any existing timeout
    if (contextMenuCloseTimeout) {
      clearTimeout(contextMenuCloseTimeout);
    }

    // Clear flag after delay (300ms should be enough, same as date picker)
    contextMenuCloseTimeout = setTimeout(() => {
      contextMenuJustClosed.value = false;
      contextMenuCloseTimeout = null;
    }, 300);
  };

  const onContextMenuSelect = async (val) => {
    if (!contextMenuItem.value) return;

    const item = contextMenuItem.value;
    const selectedItem = item;

    if (val.name === "Edit") {
      console.log("Edit item functionality - no implementation for now");
      ganttChartStore.addItemDetails(selectedItem._id);
      ganttChartStore.showSidePanel(true);
    } else if (val.name === "Delete") {
      console.log("Delete item functionality - no implementation for now");
      await ganttChartStore.deleteItem(selectedItem._id, false);
      await ganttChartStore.fetchItems();
    } else if (val.name === "Add Sub item") {
      console.log("Add Sub item functionality - no implementation for now");
      ganttChartStore.addItemDetails(selectedItem._id);
      ganttChartStore.showSidePanel(true);
    } else if (val.name === "Duplicate Item") {
      console.log("Duplicate Item functionality - no implementation for now");
      await ganttChartStore.handleDuplicateItem(selectedItem, true, false);
    }

    closeContextMenu();
  };

  return {
    // State
    contextMenuMenu,
    contextMenuTrigger,
    contextMenuItem,
    contextMenuTriggerStyle,
    contextMenuPlacement,
    contextMenuItems,
    contextMenuJustClosed,
    // Functions
    openContextMenu,
    closeContextMenu,
    onContextMenuSelect,
  };
};
