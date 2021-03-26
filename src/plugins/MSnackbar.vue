<template>
  <v-snackbar
    v-model="visible"
    :timeout="timeout"
    :bottom="y === 'bottom'"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
    :color="color || typeColor"
    text
  >
    <v-icon v-if="iconClass" small class="mr-2">
      {{ color.icon }}
    </v-icon>
    <v-icon v-else small class="mr-2" :color="color || typeColor">
      {{ typeIcon }}
    </v-icon>
    <slot>
      <template v-if="!dangerouslyUseHTMLString">
        {{ message }}
      </template>
      <template v-else>
        {{ message }}
      </template>
    </slot>
    <template v-if="showClose" v-slot:action="{ attrs }">
      <v-icon v-bind="attrs" :color="color || typeColor" @click="close">
        {{ mdiClose }}
      </v-icon>
    </template>
  </v-snackbar>
</template>

<script>
import {
  mdiClose,
  mdiCheck,
  mdiInformation,
  mdiAlert,
  mdiCarBrakeAlert,
} from '@mdi/js';

const typeMap = {
  success: mdiCheck,
  info: mdiInformation,
  error: mdiAlert,
  warning: mdiCarBrakeAlert,
};
const typeColorMap = {
  success: 'success',
  info: 'info',
  error: 'error',
  warning: 'warning',
};
export default {
  name: 'MSnackBar',
  data: () => ({
    visible: false,
    closed: false,
    message: '',
    timeout: 5000,
    onClose: null,
    x: 'center',
    y: 'top',
    mode: '',
    iconClass: '',
    type: 'info',
    dangerouslyUseHTMLString: false,
    showClose: true,
    color: '',
    mdiClose,
  }),
  computed: {
    typeIcon() {
      return this.type && !this.iconClass ? `${typeMap[this.type]}` : '';
    },
    typeColor() {
      return this.type && !this.color ? typeColorMap[this.type] : '';
    },
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        // this.$el.addEventListener("transitionend", this.destroyElement);
      }
    },
  },
  mounted() {},
  methods: {
    destroyElement() {

    },
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },
  },
};
</script>
