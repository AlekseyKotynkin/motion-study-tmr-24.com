//Test
//2020 07 25 18 41
const debug = require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});
//require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
//const app = dialogflow ({debug: true});
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();
// Take the text parameter passed to this HTTP endpoint and insert it into
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {

  var arrayListObject = [];
  // Grab the text parameter.
  const original = req.query.text;
  const querySnapshot = await db.collectionGroup('PositionUser').where('UserEmail', '==', original).get();
  querySnapshot.forEach(async (doc) => {
    console.log(doc.id, ' => ', doc.data());
    //parentHierarchyDoc = doc.id;
    // Add a new document with a generated id.
    const parentHierarchyDoc = doc.ref.path;
    const organizationDocId = parentHierarchyDoc.split("/")[1];
    const subdivisionDocId = parentHierarchyDoc.split("/")[3];
    const positionDocId = parentHierarchyDoc.split("/")[5];
    var GodObj = {};
    GodObj.idDoc = doc.id;
    const docRefOrganization = db.collection('Organization').doc(organizationDocId);
    const docOrg = await docRefOrganization.get();
    if (!docOrg.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', docOrg.data());
      const nameOrganization = docOrg.data().Organization;
      GodObj.nameOrganization = nameOrganization;
    }
    const docRefSubdivision = docRefOrganization.collection('Subdivision').doc(subdivisionDocId);
    const docSub = await docRefSubdivision.get();
    if (!docSub.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', docSub.data());
      const nameSubdivision = docSub.data().Subdivision;
      GodObj.nameSubdivision = nameSubdivision;
    }
    const docRefPosition = docRefSubdivision.collection('Position').doc(positionDocId);
    const docPos = await docRefPosition.get();
    if (!docPos.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', docPos.data());
      const namePosition = docPos.data().Position;
      arrayListObject.push(GodObj.nameOrganization+'>'+GodObj.nameSubdivision+'>'+namePosition+'>'+GodObj.idDoc);

      const cityRef = db.collection('messages').doc(writeResult.id);
      const res = await cityRef.update({ gerDoc: arrayListObject});

      }
  });
  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original, gerDoc: arrayListObject});
  // Send back a message that we've succesfully written the message
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
