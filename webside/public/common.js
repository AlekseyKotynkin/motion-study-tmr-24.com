/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Общие методы для главной страницы приложения и автономного виджета.
 */
var db = firebase.firestore();
var database = firebase.database();
/**
 * @return {string} The reCAPTCHA rendering mode from the configuration.
 */
function getRecaptchaMode() {
  var config = parseQueryString(location.hash);
  return config['recaptcha'] === 'invisible' ?
      'invisible' : 'normal';
}


/**
 * @return {string} The email signInMethod from the configuration.
 *  Знак электронной почты InMethod из конфигурации.
 */
function getEmailSignInMethod() {
  var config = parseQueryString(location.hash);
  return config['emailSignInMethod'] === 'password' ?
      'password' : 'emailLink';
}


/**
 * @param {string} queryString The full query string.
 *
 * @return {!Object<string, string>} The parsed query parameters.
 *
 */
function parseQueryString(queryString) {
  // Remove first character if it is ? or #.
  if (queryString.length &&
      (queryString.charAt(0) == '#' || queryString.charAt(0) == '?')) {
    queryString = queryString.substring(1);
  }
  var config = {};
  var pairs = queryString.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    if (pair.length == 2) {
      config[pair[0]] = pair[1];
    }
  }
  return config;
}


  /**
  * @return {string}
   *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
   */
   function SignoutAdmin() {
     firebase.auth().signOut().then(function() {
        // Sign-out successful.
     }).catch(function(error) {
        // An error happened.
     });
     localStorage.clear('firebaseui::rememberedAccounts');
     window.location.replace("../../index.html")
   }

   /**
   * @return {string}
    *  Регистрация нового пользователя через форму.
    */
   function signUpRegister()
   {
     var email = document.getElementById("exampleInputEmail1").value;
     var password = document.getElementById("exampleInputPassword1").value;
     var name = document.getElementById("exampleInputUsername1").value;
     var phone = document.getElementById("exampleInputPhone").value;
     var termsConditions = document.getElementById("exampleInputTermsConditions").value;

     if (username.length < 2)
     {
      alert('Please enter an name.');
      return;
     }
     if (phone.length < 10)
     {
      alert('Please enter your phone number.');
      return;
     }
     if (email.length < 4)
     {
      alert('Please enter an email address.');
      return;
     }
    if (password.length < 4)
     {
     alert('Please enter a password.');
     return;
     }
    if (termsConditions == "on")
     {
     alert('Need to confirm consent all Terms & Conditions.');
     return;
     }
       // sign up the Username
       // регистрируем имя пользователя
     firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error)
     {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       // [START_EXCLUDE]
       if (errorCode == 'auth/weak-password') {
         alert('The password is too weak.');
       } else {
         alert(errorMessage);
       }
       console.log(error);
      // window.location.replace()
     });
     var userId = firebase.auth().currentUser.uid;
     return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
     var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      // ...
     });
  //  function writeUserData(userId, name, email, imageUrl) {
     firebase.database().ref('users/' + userId).set
     ({
      username: name,
      email: email,
      phone: phone,
      //profile_picture : imageUrl
     });
  //  }
     alert (" You are registered! ");
     window.location.replace("../../widget.html")
   };


     //  Вход пользователя через форму.

  function signUp()
  {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
    var email = document.getElementById("inputEmail1").value;
    var password = document.getElementById("inputPassword1").value;


    if (email.length < 4)
    {
     alert('Please enter an email address.');
     return;
    }
   if (password.length < 4)
    {
    alert('Please enter a password.');
    return;
    }
      // sign up the Username
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error)
    {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      window.location.replace()
    });

    let itemsArray = [{
      displayName: username,
      email: email,
      photoUrl: "TMR-24.com"
    }];
    localStorage.setItem('firebaseui::rememberedAccounts', JSON.stringify(itemsArray));

    alert (" Welcome! ");
    window.location.replace("../../index.html")
  };

  function signInWathGoogle()
  {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  };
