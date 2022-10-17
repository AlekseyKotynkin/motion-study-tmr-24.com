/**
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
var storage = firebase.storage();
//


 /**
 * @return {string}
 *  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
 */
const LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
const UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
const EmailLocalStorage = (LocalStorageValueObject[0]).email;
const FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;


/**
* @return {string}
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
 function SignoutAdmin() {
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
