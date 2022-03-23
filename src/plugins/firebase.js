import Vue from 'vue'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import firebaseConfig from '../../firebaseConfig'

firebase.initializeApp(firebaseConfig)

Vue.prototype.$firebase = firebase
