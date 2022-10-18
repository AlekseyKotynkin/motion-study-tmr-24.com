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
 // Получаем переменную для распознавания языка пользователя
var translation_JS = localStorage.getItem('TMR::translation');
/**
  /**
  * @return {string}
   *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
   */
   function SignoutAdmin() {
     firebase.auth().signOut().then(function() {
        // Sign-out successful.
        if (localStorage.getItem('TMR::translation') == null) {
          localStorage.setItem('TMR::translation', 'en');
        }
        var translation_JS = localStorage.getItem('TMR::translation');
        localStorage.clear();
        localStorage.setItem('TMR::translation', translation_JS);
        window.location.replace("../../index.html")
     }).catch(function(error) {
        // An error happened.
        if(translation_JS == null || translation_JS == 'en'){
          alert ("An error happened!");
        } else {
          alert ("Произошла ошибка!");
        }
     });
   }

   /**
   * @return {string}
    *  Регистрация нового пользователя через форму.
    */
   function signUpRegister()
   {
     var email = document.getElementById("exampleInputEmail1").value.toLowerCase();
     var password = document.getElementById("exampleInputPassword1").value;
     var termsConditions = document.getElementById("exampleInputTermsConditions").checked;
     if (email.length < 4)
     {
       if(translation_JS == null || translation_JS == 'en'){
         alert('Please enter an email address.');
       } else {
         alert ("Пожалуйста, введите адрес электронной почты.");
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
    if (password.length < 4)
     {
       if(translation_JS == null || translation_JS == 'en'){
         alert('Please enter a password.');
       } else {
         alert ("Пожалуйста, введите пароль.");
       }
     return;
     }
    if (termsConditions == false)
     {
       if(translation_JS == null || translation_JS == 'en'){
         alert('Need to confirm consent all Terms & Conditions.');
       } else {
         alert ("Необходимо подтвердить согласие со всеми Положениями и условиями.");
       }
     return;
     }
       // sign up the Username
       // Set the tenant ID on Auth instance.
       // регистрируем имя пользователя
       firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
       // result.user.tenantId should be ‘TENANT_PROJECT_ID’.
       if(translation_JS == null || translation_JS == 'en'){
         alert (" You are registered! ");
       } else {
         alert (" Вы зарегистрированы! ");
       }
       window.location.replace("../../widget.html")

     }).catch(function(error)
     {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       // [START_EXCLUDE]
       if (errorCode == 'auth/weak-password') {
         if(translation_JS == null || translation_JS == 'en'){
           alert('The password is too weak.');
         } else {
           alert ("Пароль слишком слабый.");
         }
       } else {
         alert(errorMessage);
       }
       console.log(error);
    })
   }

   // открыть окно Фейсбука
   function location_Href(){
     window.open('https://www.facebook.com/TMR24Systems/');
   }
   // заполняем строки с русскими значениями
   function translationCommon_RU (){
     //
     var element = document.getElementById("registration_check");
     var newElement = '<label class="form-check-label text-muted"><input type="checkbox" class="form-check-input" id="exampleInputTermsConditions" checked="checked"> Я согласен со всеми положениями и условиями </label>'
     element.insertAdjacentHTML( 'afterbegin', newElement );
     //
     var element_1 = document.getElementById("registration_account_an");
     var newElement_1 = '<div class="text-center mt-4 font-weight-light"> У вас уже есть учетная запись? <a href="../../widget.html" class="text-primary">Вход</a></div>'
     element_1.insertAdjacentHTML( 'afterbegin', newElement_1 )

   }
   // заполняем строки с английскими значениями
   function translationCommon_EN (){
     var element = document.getElementById("registration_check");
     var newElement = '<label class="form-check-label text-muted"><input type="checkbox" class="form-check-input" id="exampleInputTermsConditions" checked="checked"> I agree to all Terms & Conditions </label>'
     element.insertAdjacentHTML( 'afterbegin', newElement );
     //
     var element_1 = document.getElementById("registration_account_an");
     var newElement_1 = '<div class="text-center mt-4 font-weight-light"> Already have an account? <a href="../../widget.html" class="text-primary">Login</a></div>'
     element_1.insertAdjacentHTML( 'afterbegin', newElement_1 );

   }
