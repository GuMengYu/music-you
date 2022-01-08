<template>
  <v-menu
    bottom
    close-delay="100"
    content-class="rounded-xl outlined"
    left
    max-height="500"
    offset-y
    open-delay="60"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #activator="props">
      <slot name="activator" v-bind="{ ...props }" />
    </template>

    <div>
      <slot v-if="$slots.default" />
      <default-list v-else :items="items" color="background">
        <template v-if="$scopedSlots.item" #item="props">
          <slot name="item" v-bind="{ ...props }" />
        </template>
      </default-list>
    </div>
  </v-menu>
</template>

<script>
// Components
import DefaultList from '@components/default/List';

export default {
  name: 'AppMenu',

  components: { DefaultList },

  props: {
    elevation: String,
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
