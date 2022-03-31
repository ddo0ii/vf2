import Vue from 'vue'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import firebaseConfig from '../../firebaseConfig'
import store from '../store/'

firebase.initializeApp(firebaseConfig)
let unsubscribe = null
const subscribe = (fu) => {
  const ref = firebase.firestore().collection('users').doc(fu.uid)
  unsubscribe = ref.onSnapshot(doc => {
    if (doc.exists) store.commit('setUser', doc.data())
  }, console.error)
}

firebase.auth().onAuthStateChanged((fu) => {
  store.commit('setFireUser', fu)
  if (!fu) {
    store.commit('setUser', null)
    if (unsubscribe) unsubscribe()
  }
  subscribe(fu)
})

Vue.prototype.$firebase = firebase
