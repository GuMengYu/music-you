<template>
  <v-container
    class="text-center fill-height"
  >
    <v-row class="align-baseline">
      <v-col>
        <h1 class="display-2 primary--text">
          Whoops, 404
        </h1>

        <p>The page you were looking for does not exist</p>

        <v-btn
          to="/now"
          color="primary"
          outlined
        >
          Get me out of here!
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  export default {
    name: '404',
  }
</script>
