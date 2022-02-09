<template>
  <div
    :class="'store-card ' + (cardHovered ? 'hovered' : '')"
    @mouseover="cardHovered = true"
    @mouseleave="cardHovered = false"
  >
    <v-img
      lazy-src="@assets/default-cover.png"
      class="store-card__background flex-fill"
      :src="presence.cover"
    />

    <div class="store-card__service-info">
      <div class="store-card__service">
        <h2 class="h-1x">
          <router-link
            :style="`color: ${brightColorFix()}`"
            :key="presenceLinkName"
            class="text-decoration-none"
            :to="`/store/presences/${encodeURIComponent(presenceLinkName)}`"
          >
            {{ presence.title }}
          </router-link>
        </h2>
        <p :style="`color: ${brightColorFix()}`">
          创建者:
          <router-link
            :style="`color: ${brightColorFix()};font-weight:bold;`"
            :to="`/users/${presence.artist.id}`"
            class="text-decoration-none"
            >{{ presence.artist.name }}</router-link
          >
        </p>

        <transition name="card-animation" mode="out-in">
          <div>
            <p
              :style="`color: ${brightColorFix()}`"
              class="store-card__desc h-2x"
            >
              {{ presence.description }}
            </p>
          </div>
        </transition>
      </div>
    </div>
    <div
      class="store-card__gradient"
      :style="`background: linear-gradient(135deg, ${presence.color} 0%, ${presenceGradientColor} 100%);`"
    ></div>
  </div>
</template>

<script>
import tinycolor from 'tinycolor2';

export default {
  name: 'StoreCard',
  props: ['presence'],
  data() {
    return {
      cardHovered: false,
      presenceLinkName: this.$props.presence.title,
    };
  },
  computed: {
    presenceGradientColor() {
      return tinycolor(this.presence.color).darken(45).toHexString();
    },
  },
  mounted() {},
  methods: {
    brightColorFix() {
      return tinycolor(this.presence.color).getBrightness() >= 200
        ? '#111218'
        : '#ffffff';
    },
  },
};
</script>
<style lang="scss" scoped>
.store-card {
  max-width: 380px;
  height: 150px;
  position: relative;
  background: hsl(216, 7%, 9%);
  background-size: cover;
  box-shadow: 0 4px 32px 0 rgba(9, 10, 10, 0.2);
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 0.6em;
  padding: 0.5rem;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  z-index: 1;

  transform: translateY(0px);

  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  user-select: none;

  &:hover {
    z-index: 2;
  }

  &.hovered .store-card__background {
    transform: rotate(-10deg) scale(1.25);
  }

  .store-card__background {
    left: 0;
    transition: 0.2s transform cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: absolute;
    width: 100%;
    z-index: -1;
    transform: scale(1.05);
  }

  .store-card__gradient {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(to bottom right, #002f4b, #dc4225);
    opacity: 0.85;

    z-index: 1;
  }

  .store-card__overlay {
    position: absolute;
    top: 8px;
    right: 0;
    bottom: 0;

    z-index: 111;
  }

  .store-card__service-info {
    filter: drop-shadow(0 4px 0.75rem rgba(0, 0, 0, 0.4));

    z-index: 2;

    color: white;
    margin: auto 0;
    margin-right: auto;

    padding: 0 1em;

    a {
      color: white;
    }

    h2 {
      font-size: 1.3em;
      margin: 0;
      overflow: hidden;
      display: -webkit-box;

      .fa-stack {
        font-size: 0.45em;
      }
    }

    p {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      font-weight: 500;
    }

    .store-card__desc {
      opacity: 1;
      overflow: hidden;

      margin-top: 8px;
      font-size: 12px;

      color: rgba(255, 255, 255, 0.8);

      transition: all 0.2s ease;
    }

    .store-card__buttons {
      margin-top: 10px;

      display: inline-flex;

      .button {
        width: 15em;
        font-size: 12px;
        white-space: nowrap;
        padding: 0.8rem 0;

        i {
          margin-right: unset;
        }

        &.button--like {
          width: unset;
          padding: 1em 1.5em;
        }
      }
    }

    .store-card__warning {
      font-weight: 600;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      margin: 10px 0;
      border-radius: 4px;
      padding: 10px;

      box-shadow: 0 3px 26px -5px rgba(0, 0, 0, 0.5);
      background: rgba(0, 0, 0, 0.6);
    }
  }
}
</style>
