import { ref, nextTick, watch } from "vue";

// Constants
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_SENSITIVITY = 0.0012;

export const useGanttZoomPan = (options = {}) => {
  const { containerRef, onScroll, onZoomChange, shouldIgnoreKeyEvent } = options;

  // Pan/zoom state
  const zoomFactor = ref(1);
  const isSpacePressed = ref(false);
  const isPanModeActive = ref(false);
  const isPanning = ref(false);
  let panState = {
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  };

  // Event handler references
  let containerMouseDownHandler = null;
  let containerWheelHandler = null;
  let containerScrollHandler = null;
  let windowMouseMoveHandler = null;
  let windowMouseUpHandler = null;

  // Update container cursor classes
  const updateContainerCursor = () => {
    if (!containerRef?.value) return;
    containerRef.value.classList.toggle("is-space-pressed", isSpacePressed.value);
    containerRef.value.classList.toggle(
      "is-pan-mode-active",
      isPanModeActive.value
    );
    containerRef.value.classList.toggle("is-panning", isPanning.value);
  };

  // Pan functions
  const handlePanMove = (event) => {
    if (!isPanning.value || !containerRef?.value) return;
    const dx = event.clientX - panState.startX;
    const dy = event.clientY - panState.startY;
    containerRef.value.scrollTo({
      left: panState.scrollLeft - dx,
      top: panState.scrollTop - dy,
      behavior: "auto",
    });
  };

  const stopPan = () => {
    if (!isPanning.value) return;
    isPanning.value = false;
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
    if (!containerRef?.value) return;
    isPanning.value = true;
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

  // Zoom functions
  const handleWheel = (event) => {
    if (!containerRef?.value) return;
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
      if (!containerRef?.value) return;
      const newScrollWidth = Math.max(containerRef.value.scrollWidth, 1);
      const newScrollLeft = reference * newScrollWidth - pointerX;
      containerRef.value.scrollLeft = Math.max(0, newScrollLeft);
    });
  };

  const onClickZoomControl = (type) => {
    if (!containerRef?.value) return;

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
      if (!containerRef?.value) return;
      const newScrollWidth = Math.max(containerRef.value.scrollWidth, 1);
      const newViewportCenter = containerRef.value.clientWidth / 2;
      const newScrollLeft = reference * newScrollWidth - newViewportCenter;
      containerRef.value.scrollLeft = Math.max(0, newScrollLeft);
    });
  };

  // Keyboard handlers
  const handleKeyDown = (event) => {
    // Handle Escape key to disable pan mode
    if (event.code === "Escape") {
      if (isPanModeActive.value) {
        event.preventDefault();
        isPanModeActive.value = false;
        if (isPanning.value) stopPan();
        updateContainerCursor();
      }
      return;
    }

    if (event.code !== "Space") return;
    if (shouldIgnoreKeyEvent && shouldIgnoreKeyEvent(event)) return;
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
      if (isPanning.value) stopPan();
      updateContainerCursor();
    }
  };

  const handleWindowBlur = () => {
    if (isSpacePressed.value) {
      isSpacePressed.value = false;
    }
    if (isPanning.value) {
      stopPan();
    }
    updateContainerCursor();
  };

  // Pan view button handler
  const onClickPanViewButton = () => {
    isPanModeActive.value = !isPanModeActive.value;
    updateContainerCursor();

    // Stop panning if disabling pan mode while panning
    if (!isPanModeActive.value && isPanning.value) {
      stopPan();
    }
  };

  // Container interactions setup
  const setupContainerInteractions = () => {
    const container = containerRef?.value;
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

    if (!containerScrollHandler && onScroll) {
      containerScrollHandler = () => {
        if (containerRef?.value) {
          const scrollLeft = containerRef.value.scrollLeft;
          onScroll(scrollLeft);
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

  // Setup window event listeners
  const setupWindowListeners = () => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);
  };

  // Watch for zoom changes
  if (onZoomChange) {
    watch(zoomFactor, () => {
      onZoomChange();
    });
  }

  // Cleanup function
  const cleanup = () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", handleWindowBlur);
    stopPan();
    if (containerRef?.value) {
      teardownContainerInteractions(containerRef.value);
    }
  };

  return {
    // State
    zoomFactor,
    isSpacePressed,
    isPanModeActive,
    isPanning,
    // Functions
    onClickZoomControl,
    onClickPanViewButton,
    setupContainerInteractions,
    teardownContainerInteractions,
    setupWindowListeners,
    cleanup,
  };
};

