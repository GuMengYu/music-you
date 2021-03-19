<template>
  <v-menu
    v-model="showMenu"
    absolute
    close-delay="100"
    content-class="rounded"
    max-height="500"
    open-delay="60"
    :position-x="coordinate[0]"
    :position-y="coordinate[1]"
    transition="slide-y-transition"
    class="contextmenu"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-sheet :outlined="false">
      <default-list :items="items">
        <template #item="{ index, item }">
          <v-list-item
            :key="index"
            class="v-list-item--default"
            @click="_dispatch(item.type)"
          >
            <v-list-item-title class="text-caption" v-text="item.title" />
          </v-list-item>
        </template>
      </default-list>
    </v-sheet>
  </v-menu>
</template>

<script>
import DefaultList from '@components/default/List';
import { sync } from 'vuex-pathify';
export default {
  name: 'ContextMenu',
  components: { DefaultList },
  computed: {
    items: sync('contextmenu/items'),
    showMenu: sync('contextmenu/show'),
    coordinate: sync('contextmenu/coordinate'),
  },
  methods: {
    _dispatch() {},
  },
};
</script>

<style scoped lang="scss">
.contextmenu {
  ::v-deep .v-sheet {
    background: transparent;
    backdrop-filter: blur(80px);
  }
}
</style>
