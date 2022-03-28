import Vue from 'vue'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import firebaseConfig from '../../firebaseConfig'
import store from '../store/'

firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged((fu) => store.commit('setFireUser', fu))

Vue.prototype.$firebase = firebase
