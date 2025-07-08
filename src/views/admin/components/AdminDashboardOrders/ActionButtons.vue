<template>
    <div class="action-buttons flex justify-end gap-4 mt-4">
      <button
        class="action-button px-4 py-2 rounded-md bg-blue-500 text-white font-bold"
        @click="onExport"
      >
        Export Orders
      </button>
      <button
        class="action-button px-4 py-2 rounded-md bg-gray-300 text-gray-800 font-bold"
        @click="onRefresh"
      >
        Refresh List
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "ActionButtons",
    methods: {
      onExport() {
        this.$emit("export");
      },
      onRefresh() {
        this.$emit("refresh");
      },
    },
  };
  </script>
  
  <style scoped>
  .action-button {
    transition: background-color 0.3s, transform 0.2s;
  }
  
  .action-button:hover {
    background-color: #2563eb; /* Darker blue for hover effect */
    transform: scale(1.05);
  }
  
  .action-button:active {
    transform: scale(0.95);
  }
  </style>
  