<template>
  <v-input
    v-click-outside="onClickOutside"
    dense
    :hide-details="true"
    class="input-field"
    :class="{'actived': inputActived}"
    :prepend-icon="icon"
  >
    <input
      class="input"
      :placeholder="holder"
      @click="inputActived = true"
    >
  </v-input>
</template>

<script>
export default {
  name: 'Input',
  props: {
    icon: {
      type: String,
      default: '',
    },
    holder: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    inputActived: false,
  }),
  methods: {
    onClickOutside() {
      this.inputActived = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.input-field {
  height: 32px;
  width: 100%;
  padding: 0 10px ;
  border-radius: 4px;
  border: 1px solid #bcbbbd;
  //background-color: #d5d4d4;
  line-height: 32px;
  display: flex;
  font-size: 13px;
  transition: all .1s ease-in-out;
}
.actived {
    border-color: #de7a7b;
    border-right-width: 1px!important;
    outline: 0;
    box-shadow: 0 0 0 3px #de7a7b;
}
//.input {
//  max-height: 28px;
//  width: 100%;
//}
</style>
