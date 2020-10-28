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

/**
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
     var user = firebase.auth().currentUser;

     user.updateProfile({
      displayName: "Jane Q. User",
      photoURL: "https://example.com/jane-q-user/profile.jpg"
     }).then(function() {
      // Update successful.
     }).catch(function(error) {
      // An error happened.
     });

  //  }
     alert (" You are registered! ");
     window.location.replace("../../widget.html")
   };
