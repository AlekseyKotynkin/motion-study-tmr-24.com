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
      if (localStorage.getItem('TMR::translation') == null) {
        localStorage.setItem('TMR::translation', 'en');
      }
      var translation_JS = localStorage.getItem('TMR::translation');
      localStorage.clear();
      localStorage.setItem('TMR::translation', translation_JS);
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
    var email = document.getElementById("inputEmail1").value.toLowerCase();
    if (email.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter an email address.');
      } else {
        alert ("Пожалуйста, введите адрес электронной почты!");
      }
     return;
    }
    var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email.value)) {
        if(translation_JS == null || translation_JS == 'en'){
          alert('Please provide a valid email address!');
        } else {
          alert('Пожалуйста, укажите действительный адрес электронной почты!');
        }
        email.focus;
        return false;
    }
    firebase.auth().sendPasswordResetEmail(email);
    if(translation_JS == null || translation_JS == 'en'){
      alert('An email has been sent to you to restore your password!');
    } else {
      alert ("Вам отправлено письмо для восстановления пароля!");
    }
  }

/**
* @return {string}
//  Вход пользователя через форму.
 */
  function signUp()
  {
    var email = document.getElementById("inputEmail1").value.toLowerCase();
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
    const validateEmail = (email) => {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    };

    const validate = () => {
      const $result = $('#result');
      const email = $('#email').val();
      $result.text('');

      if (validateEmail(email)) {
        $result.text(email + ' is valid :)');
        $result.css('color', 'green');
      } else {
        $result.text(email + ' is not valid :(');
        $result.css('color', 'red');
      }
      return false;
    }
    
    $('#email').on('input', validate);
    // function validateEmail(email) {
    //   var re = /\S+@\S+\.\S+/;
    //   return re.test(email);
    // }
    // var re = ()/\S+@\S+\.\S+/);
    // var k = re.test(email);
    // console.log(validateEmail(k)
    // console.log(validateEmail('my email is anystring@anystring.any')); // true
    //
    // console.log(validateEmail('my email is anystring@anystring .any')); // false
    // var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (!filter.test(email.value)) {
    //     if(translation_JS == null || translation_JS == 'en'){
    //       alert('Please provide a valid email address!');
    //     } else {
    //       alert('Пожалуйста, укажите действительный адрес электронной почты!');
    //     }
    //     email.focus;
    //     return false;
    // }
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
           if (localStorage.getItem('TMR::translation') == null) {
             localStorage.setItem('TMR::translation', 'en');
           }
           var translation_JS = localStorage.getItem('TMR::translation');
           localStorage.clear();
           localStorage.setItem('TMR::translation', translation_JS);
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
        if(translation_JS == null || translation_JS == 'en'){
          alert ('The user '+ email+' is not registered!' );
        } else {
          alert ('Пользователь '+ email+' не зарегистрирован!');
        }
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
