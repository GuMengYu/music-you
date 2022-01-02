<template>
  <v-list-item
    :href="item.href"
    :rel="item.href ? 'nofollow' : undefined"
    :target="item.href ? '_blank' : undefined"
    :to="item.to"
    class="v-list-item--default justify-center"
    color="primary"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-list-item-icon
      v-if="item.icon"
      class="d-flex align-center justify-center align-self-center"
    >
      <v-icon size="20" :color="item.color || 'primary'">
        {{ item.icon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title v-text="item.title" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'DefaultListItem',

  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
