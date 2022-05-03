<template>
  <div v-scroll.self="onScroll" class="infinite-scroll overflow-y-auto">
    <slot />
    <div v-show="isShowSpinner">
      <slot name="spinner" v-bind="{ isFirstLoad }">
        <v-progress-linear
          color="primary"
          indeterminate
          rounded
        ></v-progress-linear>
      </slot>
    </div>
  </div>
</template>

<script>
import { isFunction } from 'lodash-es';
const STATUS = {
  READY: 0,
  LOADING: 1,
  COMPLETE: 2,
  ERROR: 3,
};
const isVisible = (elm) => {
  return elm.offsetWidth + elm.offsetHeight > 0;
};
export default {
  name: 'InfinityScrollLoad',
  props: {
    distance: {
      type: Number,
      default: 100,
    },
    onInfinite: Function,
    identifier: {
      default: +new Date(),
    },
  },
  data: () => ({
    isFirstLoad: true,
    status: STATUS.READY,
  }),
  watch: {
    identifier() {
      this.reset();
    },
  },
  computed: {
    isShowSpinner() {
      return this.status === STATUS.LOADING;
    },
  },
  async mounted() {
    setTimeout(() => {
      this.onScroll(this.$el);
    }, 1);
  },
  methods: {
    onScroll(el) {
      if (this.status === STATUS.READY) {
        if (isVisible(el)) {
          this.attemptLoad();
        } else {
          this.attemptLoad();
        }
      }
    },
    attemptLoad() {
      if (
        this.getDistance() <= this.distance &&
        isVisible(this.$el) &&
        this.status !== STATUS.COMPLETE
      ) {
        this.status = STATUS.LOADING;
        if (isFunction(this.onInfinite)) {
          this.onInfinite.call(null, this);
        } else {
          this.$emit('infinite', this);
        }
      } else if (this.status === STATUS.LOADING) {
        this.status = STATUS.READY;
      }
    },
    async loaded() {
      this.isFirstLoad = false;
      if (this.status === STATUS.LOADING) {
        await this.$nextTick();
        this.attemptLoad();
      }
    },
    complete() {
      this.status = STATUS.COMPLETE;
    },
    reset() {
      this.status = STATUS.READY;
      this.isFirstLoad = true;
      setTimeout(() => {
        this.onScroll(this.$el);
      }, 1);
    },
    error() {
      this.status = STATUS.ERROR;
    },
    getDistance() {
      let distanceToBottom;
      const container = this.$el;
      const { scrollTop, clientHeight, scrollHeight } = container;

      distanceToBottom = scrollHeight - (scrollTop + clientHeight);
      return distanceToBottom;
    },
  },
  deactivated() {
    /* istanbul ignore else */
    if (this.status === STATUS.LOADING) {
      this.status = STATUS.READY;
    }
  },
  activated() {},
};
</script>
