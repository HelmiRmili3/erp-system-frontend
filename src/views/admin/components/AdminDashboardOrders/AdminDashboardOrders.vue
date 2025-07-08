<template>
  <DashboardWrapper>
    <!-- Header Section -->
    <SectionHeader title="Orders" />

    <!-- Order Status Cards -->
    <div class="flex gap-4">
      <OrderStatusCard label="All orders" count="114" color="#87C767" bgColor="#DCFFCB" />
      <OrderStatusCard label="Waiting for payment" count="34" color="#5F6C7B" bgColor="#F8D7DA" />
      <!-- Add more <OrderStatusCard> as needed -->
    </div>

    <!-- Filter Bar -->
    <FilterBar />

    <!-- Orders List -->
    <OrderList>
      <OrderListItem v-for="order in orders" :key="order?.id" :order="order" />
    </OrderList>

    <!-- Action Buttons -->
    <ActionButtons />
  </DashboardWrapper>
</template>

<script>
import DashboardWrapper from './DashboardWrapper.vue'
import SectionHeader from './SectionHeader.vue'
import OrderStatusCard from './OrderStatusCard.vue'
import FilterBar from './FilterBar.vue'
import OrderList from './OrderList.vue'
import OrderListItem from './OrderList/OrderListItem.vue'
import ActionButtons from './ActionButtons.vue'

export default {
  components: {
    DashboardWrapper,
    SectionHeader,
    OrderStatusCard,
    FilterBar,
    OrderList,
    OrderListItem,
    ActionButtons
  },
  data() {
    return {
      orders: []
    }
  }
}
</script>

<style scoped>
/* Add scoped styles here if needed */
</style>
