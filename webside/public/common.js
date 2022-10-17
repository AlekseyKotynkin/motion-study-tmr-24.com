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
 // Получаем переменную для распознавания языка пользователя
var translation_JS = localStorage.getItem('TMR::translation');
/**
 * Общие методы для главной страницы приложения и автономного виджета.
 */
var db = firebase.firestore();
var database = firebase.database();
/**

* @return {string}
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
  function SignoutAdminLogin() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      // Выход выполнен успешно.
      localStorage.clear();
      window.location.replace("index.html")
    }).catch(function(error) {
      // An error happened.
      // Произошла ошибка.
      if(translation_JS == null || translation_JS == 'en'){
        alert ("An error happened!");
      } else {
        alert ("Произошла ошибка!");
      }
    });
  }

//востановление пароля
  function RecoverPasswordAdminLogin() {
    var email = document.getElementById("inputEmail1").value;
    if (email.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter an email address.');
      } else {
        alert ("Пожалуйста, введите адрес электронной почты!");
      }
     return;
    }
    firebase.auth().sendPasswordResetEmail(email)
  }

/**
* @return {string}
//  Вход пользователя через форму.
 */
  function signUp()
  {
    var email = document.getElementById("inputEmail1").value;
    var password = document.getElementById("inputPassword1").value;
    if (email.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter an email address.');
      } else {
        alert ("Пожалуйста, введите адрес электронной почты!");
      }
     return;
    }
    if (password.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter a password.');
      } else {
        alert ("Пожалуйста, введите пароль!");
      }
    return;
    }
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      // User is signed in.
      // Пользователь вошел в систему.
    //  var user = firebase.auth().currentUser;
      var name, emailData, photoUrl, uid, emailVerified;
       if (user != null) {
       emailData = user.email;
       if (email != emailData)
       {
         firebase.auth().signOut().then(function() {
           // Sign-out successful.
           // Выход выполнен успешно.
           localStorage.clear();
           window.location.replace();
         }).catch(function(error) {
           // An error happened.
           // Произошла ошибка.
           if(translation_JS == null || translation_JS == 'en'){
             alert ("An error happened!");
           } else {
             alert ("Произошла ошибка!");
           }
         });
       }
       if(translation_JS == null || translation_JS == 'en'){
         alert('User is signed in. ' + email);
       } else {
         alert('Пользователь вошел в систему. ' + email);
       }
       name = user.displayName;
       if (name === null)
       {
         var itemsArray = [{
           displayName: name,
           email: email,
           photoUrl: photoUrl
         }];
        localStorage.setItem('firebaseui::rememberedAccounts', JSON.stringify(itemsArray));
        window.location.replace("registerPersonalData.html");
       }else{
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
          var itemsArray = [{
          displayName: name,
          email: email,
          photoUrl: photoUrl
         }];
         localStorage.setItem('firebaseui::rememberedAccounts', JSON.stringify(itemsArray));
         window.location.replace("index.html")
        }
       }
      } else {
      // No user is signed in.
      // Ни один пользователь не вошел в систему.
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
        // Sign-out successful.
        // Выход выполнен успешно.
        var user = result.user;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        });
      }
    });
  }


     //  Вход пользователя через форму Google.
  // function signInWathGoogle()
  // {
  //   firebase.auth().signInWithPopup(provider).then(function(result) {
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     // Это дает вам токен доступа Google. Вы можете использовать его для доступа к Google API.
  //     var token = result.credential.accessToken;
  //     // The signed-in user info.
  //     // Информация о вошедшем в систему пользователе.
  //     var user = result.user;
  //         var name = user.displayName;
  //         var email = user.email;
  //         var photoUrl = user.photoUrl;
  //
  //         var itemsArray = [{
  //           displayName: name,
  //           email: email,
  //           photoUrl: photoUrl
  //         }];
  //         localStorage.setItem('firebaseui::rememberedAccounts', JSON.stringify(itemsArray));
  //         if(translation_JS == null || translation_JS == 'en'){
  //           alert ("Welcome!");
  //         } else {
  //           alert ("Здравствуйте!");
  //         }
  //         window.location.replace("index.html")
  //   }).catch(function(error) {
  //     // Handle Errors here.
  //     // Здесь обрабатываются ошибки.
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     // The email of the user's account used.
  //     // Электронная почта используемой учетной записи пользователя.
  //     var email = error.email;
  //     // The firebase.auth.AuthCredential type that was used.
  //     // Используемый тип firebase.auth.AuthCredential.
  //     var credential = error.credential;
  //     // ...
  //   });
  // }

  // открыть окно Фейсбука
  function location_Href(){
    window.open('https://www.facebook.com/TMR24Systems/');
  }

  // заполняем строки с русскими значениями
  function translationCommon_RU (){
    //
  }
  // заполняем строки с английскими значениями
  function translationCommon_EN (){
  }
