<template>
  <v-input
    v-click-outside="onClickOutside"
    dense
    :hide-details="true"
    class="input-field"
    :class="{'actived': searchInputActived}"
  >
    <input
      class="searchInput"
      placeholder="搜索"
      @click="searchInputActived = true"
    >
  </v-input>
</template>

<script>
export default {
  name: 'Iinput',
  data: () => ({
    searchInputActived: false,
  }),
  methods: {
    onClickOutside() {
      this.searchInputActived = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.input-field {
  height: 32px;
  width: 100%;
  padding: 0 20px ;
  border-radius: 4px;
  border: 1px solid #bcbbbd;
  background-color: #d5d4d4;
  line-height: 32px;
  display: inline-block;
  font-size: 13px;
  transition: all .1s ease-in-out;
}
.actived {
    border-color: #de7a7b;
    border-right-width: 1px!important;
    outline: 0;
    box-shadow: 0 0 0 3px #de7a7b;
}
.searchInput {
  max-height: 28px;
  width: 100%;
}
</style>
