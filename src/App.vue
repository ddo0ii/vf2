<template>
  <v-app>
    <!-- app이라고 항상 언급 해야함 -->
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>이게앱바지</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/about">
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon to="/">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
    <!-- <v-main>
      <router-view/>
    </v-main> -->
    <!-- vue에서 v-content랑 v-main을 넣으면 되는듯 근데 저자는 main을 썼음 -->

    <v-footer app padless color="primary" dark absolute>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({

  })
}
</script>
