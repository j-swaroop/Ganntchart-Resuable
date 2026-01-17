import { defineStore } from 'pinia';

export const useGanttChart = defineStore('ganttChart', {
  state: () => ({
    items: [], // Main data array for Gantt chart items (tasks, events, etc.)
    loadingItems: [], // Array of loading item states
    dependencies: [], // Legacy dependencies array
    phasesList: [], // List of phases
  }),
  
  actions: {
    // Update item position with local resequencing
    updateItemPosition(item, newPhaseObject, newGanttSeq) {
      if (!item) return;
      const itemId = item._id;
      const oldPhaseId = item?.phase?._id;
      const oldSeq = item.ganttSeq;
      const isSamePhase = oldPhaseId === (newPhaseObject?._id);

      // Update the dragged item with the full phase object (or null for "Others")
      item.phase = newPhaseObject ? { ...newPhaseObject } : null;
      item.ganttSeq = newGanttSeq;

      // Resequence other items locally for real-time UI update
      this.items.forEach((i) => {
        if (i._id === itemId) return; // Skip the moved item
        if (!i.phase?._id) return; // Skip items without phase

        const iPhaseId = i.phase._id;

        if (iPhaseId === oldPhaseId && isSamePhase) {
          // Same phase reordering
          if (oldSeq < newGanttSeq) {
            if (i.ganttSeq > oldSeq && i.ganttSeq <= newGanttSeq) {
              i.ganttSeq--;
            }
          } else {
            if (i.ganttSeq >= newGanttSeq && i.ganttSeq < oldSeq) {
              i.ganttSeq++;
            }
          }
        } else if (iPhaseId === oldPhaseId && !isSamePhase) {
          // Close gap in old phase
          if (i.ganttSeq > oldSeq) {
            i.ganttSeq--;
          }
        } else if (iPhaseId === newPhaseObject?._id && !isSamePhase) {
          // Make space in new phase
          if (i.ganttSeq >= newGanttSeq) {
            i.ganttSeq++;
          }
        }
      });
    },

    addLoadingItem(itemId, itemData, promise) {
      // Generate unique request ID with timestamp
      const requestId = `${itemId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Add to array with promise stored
      const loadingItem = {
        itemId,
        requestId,
        startedAt: Date.now(),
        itemData: JSON.parse(JSON.stringify(itemData)), // Deep clone
        promise: promise || null, // Store the API promise
        interactive: false, // Set to true when API resolves (item becomes interactive but stays for rendering)
      };
      
      this.loadingItems.push(loadingItem);
      
      console.log(this.loadingItems, "loading items");
      
      return requestId;
    },

    removeLoadingItem(requestId) {
      // Find and remove by requestId
      const index = this.loadingItems.findIndex(
        (li) => li.requestId === requestId
      );
      if (index !== -1) {
        this.loadingItems.splice(index, 1);
      }
    },

    isItemLoading(itemId) {
      // Check if any loading item matches this itemId AND is not yet interactive
      // Once interactive (API resolved), item is no longer "loading" for UI purposes
      // but remains in loadingItems for rendering until refetch completes
      return this.loadingItems.some(
        (li) => li.itemId === itemId && !li.interactive
      );
    },

    getLoadingItemByRequestId(requestId) {
      // Get loading item by requestId (useful for awaiting the promise)
      return this.loadingItems.find((li) => li.requestId === requestId);
    },

    updateLoadingItemPromise(requestId, promise) {
      // Update the promise for an existing loading item
      const loadingItem = this.getLoadingItemByRequestId(requestId);
      if (loadingItem) {
        loadingItem.promise = promise;
      }
    },

    updateItemTime(id, newStart, newEnd) {
      const item = this.items.find((i) => i._id === id);
      if (!item) {
        console.error("Item not found with ID:", id);
        return;
      }

      // Update the item dates
      // For resize operations: newStart or newEnd might be null (only one date changes)
      if (newStart !== null && newStart !== undefined) {
        item.startDate = newStart;
      }
      if (newEnd !== null && newEnd !== undefined) {
        item.dueDate = newEnd;
      }
    },

    setPredecessor(itemId, predecessor) {
      const item = this.items.find((i) => i._id === itemId);
      if (!item) return;
      item.predecessor = predecessor;
    },

    updatePredecessorLag(item, lag) {
      if (!item || !item.predecessor) return;
      
      // Update local state
      item.predecessor.lag = lag;
    },

    removePredecessor(item) {
      if (!item) return;
      
      // Update local state
      item.predecessor = null;
    },

    // Legacy methods for backward compatibility with visualization
    addDependency(dependency) {
      // Check if dependency already exists
      const exists = this.dependencies.some(
        (dep) =>
          dep.from === dependency.from &&
          dep.to === dependency.to &&
          dep.fromType === dependency.fromType &&
          dep.toType === dependency.toType
      );
      if (!exists) {
        this.dependencies.push(dependency);
      }
    },

    removeDependency(dependency) {
      const index = this.dependencies.findIndex(
        (dep) =>
          dep.from === dependency.from &&
          dep.to === dependency.to &&
          dep.fromType === dependency.fromType &&
          dep.toType === dependency.toType
      );
      if (index > -1) {
        this.dependencies.splice(index, 1);
      }
    },
  },
  
  getters: {
    allItems: (state) => {
      return state.items;
    },
  },
});
