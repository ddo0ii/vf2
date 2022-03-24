<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <site-title :title="site.title"></site-title>
      <v-spacer/>
      <v-btn icon @click="save"><v-icon>mdi-check</v-icon></v-btn>
      <v-btn icon @click="read"><v-icon>mdi-numeric</v-icon></v-btn>
      <v-btn icon @click="readOne"><v-icon>mdi-account-check</v-icon></v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer">
      <site-menu :items="site.menu"></site-menu>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
    <site-footer :footer="site.footer"></site-footer>
  </v-app>
</template>
<script>
import SiteTitle from '@/components/site/title'
import SiteFooter from '@/components/site/footer'
import SiteMenu from '@/components/site/menu'

export default {
  components: { SiteTitle, SiteFooter, SiteMenu },
  name: 'App',
  data () {
    return {
      drawer: false,
      site: {
        menu: [],
        title: '나의 타이틀입니다',
        footer: '푸터입니다'
      }
    }
  },
  // 형상 그려진것 없을때 created
  // 형상 그려진 후에 mounted를 사용 -- 필요 없음
  created () {
    this.subscribe()
  },

  methods: {
    subscribe () {
      this.$firebase.database().ref().child('site').on('value', (sn) => {
        const v = sn.val()
        if (!v) {
          this.$firebase.database().ref().child('site').set(this.site)
        }
        this.site = v
      }, (e) => {
        console.log(e.message)
      })
    },
    save () {
      console.log('save')
      // 계속 child를 붙여서 넣어도 됨
      this.$firebase.database().ref().child('abcd').set({
        title: 'abcd', text: 'tttttt'
      })
    },
    // 이거는 DB에서 자체적으로 계속 바꾸면 바뀌는대로 console에 출력된다. 계속 변화 감지
    read () {
      this.$firebase.database().ref().child('abcd').on('value', (sn) => {
        // sn은 snapshot임
        console.log(sn)
        console.log(sn.val())
      })
    },
    // 얘는 DB에서 바꿔도 다시 출력되지 않는다. 일회성 느낌. 순차적으로 할때 아래와 같이. then 붙여서 많이 함
    async readOne () {
      const sn = await this.$firebase.database().ref().child('abcd').once('value')
      console.log(sn.val())
    }
  }
}
</script>
