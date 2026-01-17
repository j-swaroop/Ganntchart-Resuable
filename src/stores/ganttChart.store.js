import { defineStore } from 'pinia';

export const useGanttChart = defineStore('ganttChart', {
  state: () => ({
    items: [
      // Planning phase - 4 items
      {
        _id: "item-planning-1",
        title: "Planning - 1",
        startDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567890",
          name: "Planning",
          colour: "#3098f2",
          textColor: "#ffffff"
        },
        ganttSeq: 0,
        predecessor: null,
        subItems: [],
        statusName: "In Progress"
      },
      {
        _id: "item-planning-2",
        title: "Planning - 2",
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567890",
          name: "Planning",
          colour: "#3098f2",
          textColor: "#ffffff"
        },
        ganttSeq: 1,
        predecessor: null,
        subItems: [],
        statusName: "Not Started"
      },
      {
        _id: "item-planning-3",
        title: "Planning - 3",
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567890",
          name: "Planning",
          colour: "#3098f2",
          textColor: "#ffffff"
        },
        ganttSeq: 2,
        predecessor: null,
        subItems: [],
        statusName: "Pending"
      },
      {
        _id: "item-planning-4",
        title: "Planning - 4",
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567890",
          name: "Planning",
          colour: "#3098f2",
          textColor: "#ffffff"
        },
        ganttSeq: 3,
        predecessor: null,
        subItems: [],
        statusName: "Completed"
      },
      // Design phase - 4 items
      {
        _id: "item-design-1",
        title: "Design - 1",
        startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          phase: {
            _id: "1234567891",
            name: "Design",
            colour: "#8B5CF6",
            textColor: "#ffffff"
          },
        ganttSeq: 0,
        predecessor: null,
        subItems: [],
        statusName: "In Progress"
      },
      {
        _id: "item-design-2",
        title: "Design - 2",
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
          phase: {
            _id: "1234567891",
            name: "Design",
            colour: "#8B5CF6",
            textColor: "#ffffff"
          },
        ganttSeq: 1,
        predecessor: null,
        subItems: [],
        statusName: "Not Started"
      },
      {
        _id: "item-design-3",
        title: "Design - 3",
        startDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
          phase: {
            _id: "1234567891",
            name: "Design",
            colour: "#8B5CF6",
            textColor: "#ffffff"
          },
        ganttSeq: 2,
        predecessor: null,
        subItems: [],
        statusName: "Pending"
      },
      {
        _id: "item-design-4",
        title: "Design - 4",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          phase: {
            _id: "1234567891",
            name: "Design",
            colour: "#8B5CF6",
            textColor: "#ffffff"
          },
        ganttSeq: 3,
        predecessor: null,
        subItems: [],
        statusName: "Completed"
      },
      // Development phase - 4 items
      {
        _id: "item-development-1",
        title: "Development - 1",
        startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567892",
          name: "Development",
          colour: "#5dc185",
          textColor: "#ffffff"
        },
        ganttSeq: 0,
        predecessor: null,
        subItems: [],
        statusName: "In Progress"
      },
      {
        _id: "item-development-2",
        title: "Development - 2",
        startDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567892",
          name: "Development",
          colour: "#5dc185",
          textColor: "#ffffff"
        },
        ganttSeq: 1,
        predecessor: null,
        subItems: [],
        statusName: "Not Started"
      },
      {
        _id: "item-development-3",
        title: "Development - 3",
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567892",
          name: "Development",
          colour: "#5dc185",
          textColor: "#ffffff"
        },
        ganttSeq: 2,
        predecessor: null,
        subItems: [],
        statusName: "Pending"
      },
      {
        _id: "item-development-4",
        title: "Development - 4",
        startDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567892",
          name: "Development",
          colour: "#5dc185",
          textColor: "#ffffff"
        },
        ganttSeq: 3,
        predecessor: null,
        subItems: [],
        statusName: "Completed"
      },
      // Testing phase - 4 items
      {
        _id: "item-testing-1",
        title: "Testing - 1",
        startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567893",
          name: "Testing",
          colour: "#f59e0b",
          textColor: "#ffffff"
        },
        ganttSeq: 0,
        predecessor: null,
        subItems: [],
        statusName: "In Progress"
      },
      {
        _id: "item-testing-2",
        title: "Testing - 2",
        startDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567893",
          name: "Testing",
          colour: "#f59e0b",
          textColor: "#ffffff"
        },
        ganttSeq: 1,
        predecessor: null,
        subItems: [],
        statusName: "Not Started"
      },
      {
        _id: "item-testing-3",
        title: "Testing - 3",
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567893",
          name: "Testing",
          colour: "#f59e0b",
          textColor: "#ffffff"
        },
        ganttSeq: 2,
        predecessor: null,
        subItems: [],
        statusName: "Pending"
      },
      {
        _id: "item-testing-4",
        title: "Testing - 4",
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        phase: {
          _id: "1234567893",
          name: "Testing",
          colour: "#f59e0b",
          textColor: "#ffffff"
        },
        ganttSeq: 3,
        predecessor: null,
        subItems: [],
        statusName: "Completed"
      }
    ], // Main data array for Gantt chart items (tasks, events, etc.)
    loadingItems: [], // Array of loading item states
    dependencies: [], // Legacy dependencies array
    phasesList: [
      {
        _id: "1234567890",
        name: "Planning",
        colour: "#3098f2",
        textColor: "#ffffff"
      },
      {
        _id: "1234567891",
        name: "Design",
        colour: "#8B5CF6",
        textColor: "#ffffff"
      },
      {
        _id: "1234567892",
        name: "Development",
        colour: "#5dc185",
        textColor: "#ffffff"
      },
      {
        _id: "1234567893",
        name: "Testing",
        colour: "#f59e0b",
        textColor: "#ffffff"
      }
    ], // List of phases
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
      console.log("Updating item time for item:", item);
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
      console.log("Setting predecessor for item:", item);
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

  },
  
  getters: {
    allItems: (state) => {
      return state.items;
    },
  },
});
