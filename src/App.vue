<template>
  <v-app>
    <!-- app이라고 항상 언급 해야함 -->
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <site-title :title="title"></site-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/about">
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon to="/">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Application</v-list-item-title>
          <v-list-item-subtitle>subtext</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <site-menu></site-menu>
    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>
    <!-- <v-main>
      <router-view/>
    </v-main> -->
    <!-- vue에서 v-content랑 v-main을 넣으면 되는듯 근데 저자는 main을 썼음 -->
    <site-footer :footer="footer"></site-footer>
  </v-app>
</template>

<script>
import SiteTitle from '@/components/site/title'
import SiteFooter from '@/components/site/footer'
import SiteMenu from '@/components/site/menu'

export default {
  components: { SiteTitle, SiteFooter, SiteMenu },
  name: 'App',
  data: () => ({
    drawer: false,
    title: '나의 타이틀입니다.',
    footer: '푸터입니다.',
    group: null
  }),
  watch: {
    group () {
      this.drawer = false
    }
  }
}
</script>
