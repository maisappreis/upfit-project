<template>
  <button
    class="button-area"
    @click="$emit('execute-action')"
    :class="{ green: !disable, disabled: disable }">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  disable: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.button-area {
  border: none;
  padding: 12px 20px;
  color: white;
  width: 200px;

  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
}

.green {
  background-color: green;
}

.disabled {
  background-color: rgba(3, 144, 3, 0.579);
  cursor: not-allowed;
}

@media only screen and (max-width: 1000px) {
  .button-area {
    height: 30px;
    padding: 5px 20px;
    width: 120px;
  }
}
</style>