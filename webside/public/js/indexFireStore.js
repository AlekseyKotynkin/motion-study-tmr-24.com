// // Initialize Cloud Firestore through Firebase
// firebase.initializeApp({
//   apiKey: "AIzaSyBRd2yCJouL2GTNXQXuIiruefG40mixJeY",
//   authDomain: "motion-study-tmr-24.firebaseapp.com",
//   projectId: "motion-study-tmr-24",
// });
//

var firebaseConfig = {
   apiKey: "AIzaSyBRd2yCJouL2GTNXQXuIiruefG40mixJeY",
   authDomain: "motion-study-tmr-24.firebaseapp.com",
   databaseURL: "https://motion-study-tmr-24.firebaseio.com",
   projectId: "motion-study-tmr-24",
   storageBucket: "motion-study-tmr-24.appspot.com",
   messagingSenderId: "475611275877",
   appId: "1:475611275877:web:c864a0fa3746694f2edc8c",
   measurementId: "G-T3J9JSRXL6"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 // firebase.analytics();

var firestore = firebase.firestore();