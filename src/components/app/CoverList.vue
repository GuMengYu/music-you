<template>
  <div class="cover-list" :data-grid="gridStyle">
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    gridStyle: {
      type: String,
      default: 'A',
    },
  },
};
</script>
<style scoped lang="scss">
@mixin --columns($cols) {
  grid-template-columns: repeat($cols, 1fr);
}
.cover-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 599px) {
    &[data-grid='A'] {
      @include --columns(2)
    }
    &[data-grid='B'] {
      @include --columns(1)
    }
  }
  @media (min-width: 600px) and (max-width: 959px) {
    &[data-grid='A'] {
      @include --columns(3)
    }
    &[data-grid='B'] {
      @include --columns(2)
    }
  }
  @media (min-width: 960px) and (max-width: 1263px) {
    &[data-grid='A'] {
      @include --columns(4)
    }
    &[data-grid='B'] {
      @include --columns(3)
    }
  }
  @media (min-width: 1264px) and (max-width: 1903px) {
    &[data-grid='A'] {
      @include --columns(5)
    }
    &[data-grid='B'] {
      @include --columns(4)
    }
  }
  @media (min-width: 1264px) and (max-width: 1903px) {
    &[data-grid='A'] {
      @include --columns(6)
    }
    &[data-grid='B'] {
      @include --columns(4)
    }
  }
  @media screen and (min-width: 1940px) {
    &[data-grid='A'] {
      @include --columns(7)
    }
    &[data-grid='B'] {
      @include --columns(6)
    }
  }
  ::v-deep .cover-container {
    .v-responsive__content {
      // 覆盖v-image 中responsive__content 的内联样式，避免 grid item 计算宽度的问题
      width: inherit !important;
    }
  }
}
</style>
