<template>
    <div class="content-area">
      <DefaultButton />
      <DefaulfTable :data="users" />
    </div>
</template>

<script>
import DefaulfTable from '../common/DefaulfTable.vue';
import DefaultButton from '../common/DefaultButton.vue';

export default {
  name: 'RevenuePage',
  components: {
    DefaulfTable, DefaultButton
  },

  data() {
    return {
      users: [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
      ],
    }
  }
}
</script>

<style scoped>
</style>