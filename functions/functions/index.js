const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./key.json')
const region = functions.config().admin.region || 'us-central1'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().admin.db_url,
  storageBucket: functions.config().admin.bucket_url
})

const rdb = admin.database()
const db = admin.firestore()

exports.createUser = functions.region(region).auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const time = new Date()
  const u = {
    email,
    displayName,
    photoURL,
    createdAt: time,
    level: email === functions.config().admin.email ? 0 : 5,
    visitedAt: time,
    visitCount: 0
  }
  await db.collection('users').doc(uid).set(u)
  u.createdAt = time.getTime()
  await rdb.ref('users').child(uid).set(u)
  try {
    await db.collection('meta').doc('users').update({ count: admin.firestore.FieldValue.increment(1) })
  } catch (e) {
    await db.collection('meta').doc('users').set({ count: 1 })
  }
})

exports.deleteUser = functions.region(region).auth.user().onDelete(async (user) => {
  const { uid } = user
  await rdb.ref('users').child(uid).remove()
  await db.collection('users').doc(uid).delete()
  await db.collection('meta').doc('users').update({ count: admin.firestore.FieldValue.increment(-1) })
})

exports.onCreateBoard = functions.region(region).firestore
  .document('boards/{bid}').onCreate(async (snap, context) => {
    try {
      await db.collection('meta').doc('boards').update({ count: admin.firestore.FieldValue.increment(1) })
    } catch (e) {
      await db.collection('meta').doc('boards').set({ count: 1 })
    }
  })

exports.onDeleteBoard = functions.region(region).firestore
  .document('boards/{bid}').onDelete(async (snap, context) => {
    await db.collection('meta').doc('boards').update({ count: admin.firestore.FieldValue.increment(-1) })
    const batch = db.batch()
    const sn = await db.collection('boards').doc(context.params.bid).collection('articles').get()
    sn.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()
  })

const removeOldTempFiles = async () => {
  // const moment = require('moment')
  const sn = await db.collection('tempFiles')
    // .where('createdAt', '<', moment().subtract(1, 'hours').toDate())
    .orderBy('createdAt')
    .limit(5)
    .get()
  if (sn.empty) return
  const batch = db.batch()
  for (const doc of sn.docs) {
    const file = doc.data()
    await admin.storage().bucket().file(file.name).delete()
      .catch(e => console.error('tempFile remove err: ' + e.message))
    batch.delete(doc.ref)
  }
  await batch.commit()
}

exports.onCreateBoardArticle = functions.region(region).firestore
  .document('boards/{bid}/articles/{aid}')
  .onCreate(async (snap, context) => {
    const set = {
      count: admin.firestore.FieldValue.increment(1)
    }
    const doc = snap.data()
    if (doc.category) set.categories = admin.firestore.FieldValue.arrayUnion(doc.category)
    if (doc.tags.length) set.tags = admin.firestore.FieldValue.arrayUnion(...doc.tags)
    try {
      await db.collection('boards').doc(context.params.bid).update(set)
    } catch (e) {
      console.error('board info update err: ' + e.message)
    }

    if (doc.images.length) {
      const ids = []
      const thumbIds = []
      doc.images.forEach(image => {
        ids.push(image.id)
        thumbIds.push(image.thumbId)
      })
      try {
        const batch = db.batch()
        const sn = await db.collection('tempFiles').where('id', 'in', ids).get()
        sn.docs.forEach(doc => batch.delete(doc.ref))
        const snt = await db.collection('tempFiles').where('id', 'in', thumbIds).get()
        snt.docs.forEach(doc => batch.delete(doc.ref))
        await batch.commit()
      } catch (e) {
        console.error('tempFiles remove err: ' + e.message)
      }
    }

    await removeOldTempFiles()
  })

exports.onUpdateBoardArticle = functions.region(region).firestore
  .document('boards/{bid}/articles/{aid}')
  .onUpdate(async (change, context) => {
    const isEqual = require('lodash').isEqual
    const set = {}
    const beforeDoc = change.before.data()
    const doc = change.after.data()
    if (doc.category && beforeDoc.category !== doc.category) set.categories = admin.firestore.FieldValue.arrayUnion(doc.category)
    if (doc.tags.length && isEqual(beforeDoc.tags, doc.tags)) set.tags = admin.firestore.FieldValue.arrayUnion(...doc.tags)
    if (Object.keys(set).length) await db.collection('boards').doc(context.params.bid).update(set)

    const deleteImages = beforeDoc.images.filter(before => {
      return !doc.images.some(after => before.id === after.id)
    })

    const imgs = []
    imgs.push('images')
    imgs.push('boards')
    imgs.push(context.params.bid)
    imgs.push(context.params.aid)
    const p = imgs.join('/') + '/'
    for (const image of deleteImages) {
      await admin.storage().bucket().file(p + image.id)
        .delete()
        .catch(e => console.error('storage deleteImages remove err: ' + e.message))
      await admin.storage().bucket().file(p + image.thumbId)
        .delete()
        .catch(e => console.error('storage deleteImages remove err: ' + e.message))
    }

    const ids = []
    const thumbIds = []
    doc.images.forEach(image => {
      ids.push(image.id)
      thumbIds.push(image.thumbId)
    })
    try {
      const batch = db.batch()
      const sn = await db.collection('tempFiles').where('id', 'in', ids).get()
      sn.docs.forEach(doc => batch.delete(doc.ref))
      const snt = await db.collection('tempFiles').where('id', 'in', thumbIds).get()
      snt.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()
    } catch (e) {
      console.error('tempFiles remove err: ' + e.message)
    }
  })

exports.onDeleteBoardArticle = functions.region(region).firestore
  .document('boards/{bid}/articles/{aid}')
  .onDelete(async (snap, context) => {
    await db.collection('boards').doc(context.params.bid)
      .update({ count: admin.firestore.FieldValue.increment(-1) })
      .catch(e => console.error('boards update err: ' + e.message))

    try {
      // remove comment
      const batch = db.batch()
      const sn = await db.collection('boards').doc(context.params.bid)
        .collection('articles').doc(context.params.aid)
        .collection('comments').get()
      sn.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()
    } catch (e) {
      console.error('comment remove err: ' + e.message)
    }

    // remove storage
    const doc = snap.data()
    const ps = []
    ps.push('boards')
    ps.push(context.params.bid)
    ps.push(context.params.aid + '-' + doc.uid + '.md')

    await admin.storage().bucket().file(ps.join('/'))
      .delete()
      .catch(e => console.error('storage remove err: ' + e.message))

    const imgs = []
    imgs.push('images')
    imgs.push('boards')
    imgs.push(context.params.bid)
    imgs.push(context.params.aid)
    return admin.storage().bucket().deleteFiles({
      prefix: imgs.join('/')
    })
  })

exports.onCreateBoardComment = functions.region(region).firestore
  .document('boards/{bid}/articles/{aid}/comments/{cid}')
  .onCreate((snap, context) => {
    return db.collection('boards').doc(context.params.bid)
      .collection('articles').doc(context.params.aid)
      .update({ commentCount: admin.firestore.FieldValue.increment(1) })
  })

exports.onDeleteBoardComment = functions.region(region).firestore
  .document('boards/{bid}/articles/{aid}/comments/{cid}')
  .onDelete((snap, context) => {
    return db.collection('boards').doc(context.params.bid)
      .collection('articles').doc(context.params.aid)
      .update({ commentCount: admin.firestore.FieldValue.increment(-1) })
  })

exports.saveTempFiles = functions.region(region).storage
  .object().onFinalize(async (object) => {
    const last = require('lodash').last
    const name = object.name
    if (last(name.split('.')) === 'md') return
    const createdAt = new Date()
    const id = createdAt.getTime().toString()
    const set = {
      name,
      contentType: object.contentType,
      size: object.size,
      crc32c: object.crc32c,
      createdAt,
      id: last(name.split('/'))
    }
    await db.collection('tempFiles').doc(id).set(set)
  })

// exports.onDeleteTempFile = functions.region(region).firestore
//   .document('tempFiles/{tid}')
//   .onDelete(async (snap, context) => {
//     const moment = require('moment')
//     const sn = await db.collection('tempFiles')
//       .where('createdAt', '<', moment().subtract(1, 'hours'))
//       .orderBy('createdAt')
//       .limit(5)
//     if (!sn.empty) return
//     for (const doc of sn.docs) {
//       await admin.storage().bucket().file(doc.name).delete()
//         .catch(e => console.error('tempFile remove err: ' + e.message))
//     }
//   })
