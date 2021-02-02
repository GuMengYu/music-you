<template>
  <v-list-item
    :href="item.href"
    :rel="item.href ? 'nofollow' : undefined"
    :target="item.href ? '_blank' : undefined"
    :to="item.to"
    class="v-list-item--default"
    color="primary"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-list-item-icon v-if="item.icon" class="d-flex align-center justify-center">
      <v-icon size="18" color="red">
        {{ item.icon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title class="font-weight-bold" v-text="item.title" />
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
  }
</script>

<style lang="sass">
  .v-list-item.v-list-item.v-list-item--default
    min-height: 32px
    padding-left: 8px !important
    > .v-list-item__icon
      margin: 4px 8px
</style>
