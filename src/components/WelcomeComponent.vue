<template>
  <div class="welcome-component-container">
    <div class="avatar">
      <Avatar
      size="large"
        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        shape="circle"
      />
    </div>
    <div class="text">
      <h1>Willkommen! 👋</h1>
      <p>Was möchten Sie heute bestellen?</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.welcome-component-container {
  display: flex;
  gap: 1rem;
  .text {
    h1 {
      color: var(--Charcoal, #333);
      font-family: 'Krona One';
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 110%; /* 26.4px */
      letter-spacing: -1.536px;
    }
    p {
      color: var(--Steel-Symphony, #999);
      font-family: 'Quicksand';
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 150%; /* 24px */
    }
  }
}
</style>
