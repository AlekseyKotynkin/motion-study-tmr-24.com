//Test
//2020 07 25 18 41
const debug = require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});
//require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
//const app = dialogflow ({debug: true});
//const sanitizer = require('sanitizer');
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
//const cors = require('cors')({ origin: true });
admin.initializeApp();
const db = admin.firestore();

// [START messageFunctionTrigger]
// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.addDocListPosts = functions.https.onCall(async (data, context) => {
  // [START_EXCLUDE]
  // [START readMessageData]
  // Message text passed from the client.
  const text = data.text;
  // [END readMessageData]
  // [START messageHttpsErrors]
  // Checking attribute.
  if (!(typeof text === 'string') || text.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
        'one arguments "text" containing the message text to add.');
  }
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.');
  }
  // [END messageHttpsErrors]

  var arrayListObject = [];
  // Grab the text parameter.
  const original = data.text;
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
  // Отправляем обратно сообщение о том, что мы успешно написали сообщение
  //data.json({result: `Message with ID: ${writeResult.id} added.`});

  return { text: writeResult.id };

});
