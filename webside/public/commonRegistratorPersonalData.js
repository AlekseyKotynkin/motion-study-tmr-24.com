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
  var storage = firebase.storage();
/**
 * Общие методы для главной страницы приложения и автономного виджета.
 */

/**
  /**
  * @return {string}
   *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
   */
   function SignoutAdmin() {
     firebase.auth().signOut().then(function() {
       // Sign-out successful.
       // Выход выполнен успешно.
       localStorage.clear();
       window.location.replace("index.html")
     }).catch(function(error) {
       // An error happened.
       // Произошла ошибка.
       alert ("An error happened!");
     });
   }

   /**
   * @return {string}
    *  Регистрация нового пользователя через форму.
    */
   function signUpRegisterPersonalData()
   {
     firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
       // User is signed in.
       // Пользователь вошел в систему.
     //  var user = firebase.auth().currentUser;
       var name, email, photoUrl, uid, emailVerified;
        if (user != null) {
        email = user.email;
        alert('User is signed in. ' + email);
        name = user.displayName;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                         // this value to authenticate with your backend server, if
                         // you have one. Use User.getToken() instead.
        }

       } else {
       // No user is signed in.
       // Ни один пользователь не вошел в систему.
       alert('No user is signed in.');

       }
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



     //alert (" Welcome! ");
     //window.location.replace("../../index.html")
   };
