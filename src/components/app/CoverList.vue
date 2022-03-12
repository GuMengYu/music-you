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
  @media (max-width: 600px) {
    &[data-grid='A'] {
      @include --columns(2);
    }
    &[data-grid='B'] {
      @include --columns(1);
    }
  }
  @media (min-width: 601px) and (max-width: 960px) {
    &[data-grid='A'] {
      @include --columns(3);
    }
    &[data-grid='B'] {
      @include --columns(2);
    }
  }
  @media (min-width: 961px) and (max-width: 1264px) {
    &[data-grid='A'] {
      @include --columns(4);
    }
    &[data-grid='B'] {
      @include --columns(3);
    }
  }
  @media (min-width: 1265px) and (max-width: 1904px) {
    &[data-grid='A'] {
      @include --columns(5);
    }
    &[data-grid='B'] {
      @include --columns(4);
    }
  }
  @media screen and (min-width: 1905px) {
    &[data-grid='A'] {
      @include --columns(7);
    }
    &[data-grid='B'] {
      @include --columns(6);
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
