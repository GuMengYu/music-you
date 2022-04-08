<template>
  <div class="discover">
   discover
    <Test />
    <Playground />
  </div>
</template>
<script setup>
import Test from './example/test';
import playground from './example/playground.vue';
import Playground from './example/playground.vue';

</script>
<style lang="scss" scoped>
.discover {
  display: flex;
  flex-direction: column;
  gap: 24px;
  .artist-list {
    grid-template-columns: repeat(6, 1fr);
  }
  .daily-song {
    max-height: 45vh;
  }
  .title {
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    height: 52px;
  }
  //.mini-card-box {
  //  .mini-card {
  //    transition: all .2s ease-in-out;
  //    padding: 1.5rem;
  //    &:not(:first-child) {
  //      margin-left: -100px;
  //    }
  //    &:hover {
  //    transform: translateY(-1rem) rotate(3deg);
  //      &~.mini-card {
  //        transform: translateX(100px);
  //      }
  //    }
  //  }
  //}
}
</style>
