const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://memi-vf2-6d3da-default-rtdb.firebaseio.com'
})

const db = admin.database()

exports.createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const u = {
    email,
    displayName,
    photoURL,
    createAt: new Date()
  }
  db.ref('users').child(uid).set(u)
})
exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const { uid } = user
  db.ref('users').child(uid).remove()
})
