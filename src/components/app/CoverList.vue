<template>
  <div class="cover-list">
    <v-btn
      fab
      x-small
      color="white"
      class="previous-items-btn carousel"
      @click="scrollTo(true)"
      v-show="showPrevious"
    >
      <v-icon color="black">
        {{ mdiChevronLeft }}
      </v-icon>
    </v-btn>
    <div class="item-wrapper">
      <v-row
        no-gutters
        ref="coverCardList"
        class="cover-list-content"
        v-scroll.self="onScroll"
      >
        <v-col
          v-for="item in list"
          :key="item.id"
          :cols="12 / col"
          class="cover-card pa-0 mr-4"
        >
          <artists-cover v-if="type === 'artist'" :artists="item" />
          <Cover v-else :data="item" class="item" :type="type" />
        </v-col>
      </v-row>
    </div>
    <v-btn
      fab
      x-small
      color="white"
      class="next-items-btn carousel"
      @click="scrollTo(false)"
      v-show="showNext"
    >
      <v-icon color="black">
        {{ mdiChevronRight }}
      </v-icon>
    </v-btn>
  </div>
</template>
<script>
import Cover from '@components/app/Cover';
import ArtistsCover from '@components/app/Artists';
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js';
export default {
  components: {
    ArtistsCover,
    Cover,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'album',
    },
    col: {
      type: Number,
      default: 6,
    },
  },
  data() {
    return {
      mdiChevronRight,
      mdiChevronLeft,
      scrollLeft: 0,
      scrollWidth: 0,
      clientWidth: 0,
    };
  },
  methods: {
    scrollTo(reverse) {
      const container = this.$refs['coverCardList'];

      if (reverse) {
        this.goto(container, 0);
      } else {
        this.goto(container, this.overflowX);
        // container.scrollLeft = this.overflowX;
      }
    },
    goto(container, targetLocation) {
      const startTime = performance.now();
      const startLocation = container.scrollLeft;

      const ease = (t) =>
        t < 0.5 ? 4 * t ** 3 : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

      return new Promise((resolve) =>
        requestAnimationFrame(function step(currentTime) {
          const timeElapsed = currentTime - startTime;
          const progress = Math.abs(Math.min(timeElapsed / 500, 1));

          container.scrollLeft = Math.floor(
            startLocation + (targetLocation - startLocation) * ease(progress),
          );

          const clientWidth = container.clientWidth;
          if (
            progress === 1 ||
            clientWidth + container.scrollLeft === container.scrollWidth
          ) {
            return resolve(targetLocation);
          }

          requestAnimationFrame(step);
        }),
      );
    },
    onScroll(e) {
      this.scrollLeft = e.target.scrollLeft;
    },
    init() {
      console.log('init');
      this.$nextTick(() => {
        this.scrollWidth = this.$refs['coverCardList'].scrollWidth;
        this.clientWidth = this.$refs['coverCardList'].clientWidth;
      });
    },
  },
  computed: {
    overflowX() {
      return this.scrollWidth - this.clientWidth;
    },
    showPrevious() {
      return this.scrollLeft > 0 && this.scrollWidth > this.clientWidth;
    },
    showNext() {
      return (
        this.scrollWidth > this.clientWidth &&
        (this.scrollLeft === 0 ||
          this.scrollLeft + this.clientWidth < this.scrollWidth)
      );
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    'list.length'(val) {
      val && this.init();
    },
  },
};
</script>
<style scoped lang="scss">
.cover-list {
  position: relative;
  .item-wrapper {
    .cover-list-content {
      flex-wrap: nowrap;
      overflow: hidden;
      overflow-x: scroll;
      &::-webkit-scrollbar {
        height: 0;
      }
      .cover-card {
        &:last-child {
          margin-right: 0 !important;
        }
      }
    }
  }
  .carousel {
    position: absolute;
    z-index: 2;
    top: calc(50% - 32px);
  }
  .previous-items-btn {
    left: 0;
    transform: translate3d(-50%, 0, 0);
  }
  .next-items-btn {
    right: 0;
    transform: translate3d(50%, 0, 0);
  }
}
</style>
