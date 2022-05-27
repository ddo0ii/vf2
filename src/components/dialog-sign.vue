<template>
  <v-card>
    <v-toolbar dense color="primary" dark flat>
      <v-toolbar-title>
        {{ modeIn ? '로그인' : '회원가입'}}
      </v-toolbar-title>
      <v-spacer/>
      <v-btn text @click="modeIn=!modeIn">
        <v-icon left v-text="modeIn ? 'mdi-account-plus' : 'mdi-account'"></v-icon>
        <span v-text="modeIn ? '회원가입' : '로그인'"></span>
      </v-btn>
      <v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" :order="$vuetify.breakpoint.xs ? 1 : null">
          <template v-if="modeIn">
            <v-alert color="info" dark border="left" outlined height="100%">
              <ul>
                <li>{{site.title}}({{site.description}}) 에 오신걸 환영합니다 🌹💕</li>
                <br>
                <li>그리팅 메세지 리얼타임으로 변경 예정..😎</li>
              </ul>
            </v-alert>
          </template>
          <template v-else>
            <v-alert color="primary" border="left" outlined height="100%">
              <ul>
                <li>소셜 로그인 시 회원가입이 필요 없습니다🎶</li>
                <li>소셜 가입시 이메일(email), 표시이름(displayName: 실명 아님), 사진(photoURL: 소셜 제공)이 저장됩니다. 💥</li>
                <li>이메일 가입시 이메일(email)과 표시이름(displayName: 실명 아님)이 저장됩니다.</li>
                <li>이메일 가입시 메일 확인 후 정상 동작합니다</li>
                <li>패스워드는 구글 정책(firebase auth)에 의해 암호화되어 저장되며 이 사이트에서는 수집하지 않습니다</li>
                <li>회원 탈퇴 후 7일 후에 모든 데이터가 삭제됩니다.(재가입 방지)</li>
                <li>일부 기능은 관리자의 승인 후 사용할 수 있습니다</li>
              </ul>
            </v-alert>
          </template>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card outlined :loading="loading" :disabled="loading">
            <!-- social -->
            <template>
              <v-subheader>
                소셜 로그인
                <v-spacer/>
              </v-subheader>
              <v-card-actions>
                <v-btn block color="#dd4b39" dark @click="signInWithGoogle">
                  <v-icon left>mdi-google</v-icon>
                  <span>구글 로그인</span>
                </v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn block color="#3b5999" dark @click="signInWithFacebook">
                  <v-icon left>mdi-facebook</v-icon>
                  <span>페이스북 로그인</span>
                </v-btn>
              </v-card-actions>
            </template>

            <v-divider/>

            <template v-if="modeIn">
              <v-subheader>
                이메일 로그인
                <v-spacer/>
              </v-subheader>
              <v-card-text>
                <v-text-field
                  v-model="email"
                  outlined
                  label="이메일"
                  hide-details
                  type="email"
                  autocomplete="email"
                  required
                  class="mb-4"/>
                <v-text-field
                  v-model="password"
                  type="password"
                  outlined
                  label="비밀번호"
                  hide-details
                  required
                  @keypress.native.enter="signInWithEmail"/>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="signInWithEmail">
                  <v-icon left>mdi-email</v-icon>
                  로그인
                </v-btn>
              </v-card-actions>
            </template>

            <template v-else>
              <v-subheader>이메일로 가입</v-subheader>
              <v-card-text>
                <v-text-field
                  v-model="email"
                  outlined
                  label="이메일"
                  hide-details
                  type="email"
                  autocomplete="email"
                  required
                  class="mb-4"/>
                <v-text-field
                  v-model="displayName"
                  outlined
                  label="닉네임"
                  hide-details
                  type="text"
                  required
                  class="mb-4"/>
                <v-text-field
                  v-model="password"
                  type="password"
                  outlined
                  label="비밀번호"
                  hide-details
                  required
                  @keypress.native.enter="signUpWithEmail"/>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="info" @click="signUpWithEmail">
                  <v-icon left>mdi-email</v-icon>
                  회원가입
                </v-btn>
              </v-card-actions>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      site: {
        title: process.env.VUE_APP_SITE_TITLE,
        description: process.env.VUE_APP_SITE_DESCRIPTION
      },
      loading: false,
      modeIn: true,
      email: '',
      password: '',
      displayName: ''
    }
  },
  methods: {
    async signInWithEmail () {
      throw Error('나중에 만들께요')
    },
    async signUpWithEmail () {
      throw Error('나중에 만들께요')
    },
    async signInWithGoogle () {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.loading = true
      try {
        await this.$firebase.auth().signInWithPopup(provider)
        // const sn = await this.$firebase.auth().signInWithPopup(provider)
        // this.$store.commit('setFireUser', sn.user)
      } finally {
        this.loading = false
      }
    },
    signInWithFacebook () {
      throw Error('나중에 만들께요')
    }
  }
}
</script>
