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
    ref="listItem"
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
  name: 'NavItem',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  watch: {
    $route: 'onRouteChange',
  },

  mounted() {
    this.onRouteChange();
  },
  methods: {
    handleAnimation(animation) {
      this.playAnim = animation;
    },
    onRouteChange() {
      this.$nextTick(() => {
        if (this.$refs.listItem.isActive) {
          this.isActive = true;
        }
      });
    },
  },
};
</script>
