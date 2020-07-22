//const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Взять текстовый параметр, переданный этой конечной точке HTTP, и вставить его в
// Cloud Firestore under the path /messages/:documentId/original
// Cloud Firestore по пути / messages /: documentId / original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  // Захватить текстовый параметр.
  const original = req.query.text;
  // Получить переданный из Cloud Firestore
  const querySnapshot = await db.collectionGroup('PositionUser').where('UserEmail', '==', original).get();
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
    let parentHierarchyDoc = doc.ref.path;
    let organizationDocId = parentHierarchyDoc.split("/")[1];
    let subdivisionDocId = parentHierarchyDoc.split("/")[3];
    let positionDocId = parentHierarchyDoc.split("/")[5];
    itemsUserName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
  });
  itemsUserName.forEach(function(element){
    let organizationDocId = element.idDocOrganization ;
    let subdivisionDocId = element.idDocSubdivision ;
    let positionDocId = element.idDocPosition ;
    const docRefOrganization = db.collection('Organization').doc('organizationDocId');
    const doc = await docRefOrganization.get();
    if (!doc.exists) {
    console.log('No such document!');
    nameOrganization = doc.data().Organization;
    } else {
    console.log('Document data:', doc.data());
    };
    const docRefSubdivision = docRefOrganization.collection('Subdivision').doc('subdivisionDocId');
    const doc = await docRefSubdivision.get();
    if (!doc.exists) {
    console.log('No such document!');
    nameSubdivision = doc.data().Subdivision;
    } else {
    console.log('Document data:', doc.data());
    };
    const docRefPosition = docRefSubdivision.collection('Position').doc('positionDocId');
    const doc = await docRefPosition.get();
    if (!doc.exists) {
    console.log('No such document!');
    namePosition = doc.data().Position;
    } else {
    console.log('Document data:', doc.data());
    };





  }




  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  // Вставить новое сообщение в Cloud Firestore, используя Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've succesfully written the message
  // Отправить обратно сообщение, что мы успешно написали сообщение
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});


// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Cloud Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);

      const uppercase = original.toUpperCase();

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Cloud Firestore.
      // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });
