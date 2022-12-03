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
var LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
if (LocalStorageValueObject !== null){
  var UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
  var EmailLocalStorage = (LocalStorageValueObject[0]).email;
  var FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;

  var html = [
    '<li class="nav-item nav-profile dropdown">',
      '<a class="nav-link dropdown-toggle" id="profileDropdown" href="#" data-toggle="dropdown" aria-expanded="false">',
        '<div class="nav-profile-img">',
          '<img src="" name="IDFotoUrlLocalStorage" alt="image">',
          '<span class="availability-status online"></span>',
        '</div>',
        '<div class="nav-profile-text">',
          '<p class="mb-1 text-black" id="user_name_local">',
          '</p>',
        '</div>',
      '</a>',
      '<div class="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">',
        '<a class="dropdown-item lang" key="activity_log" href="#">',
          '<i class="mdi mdi-cached mr-2 text-success"></i> Activity Log </a>',
        '<div class="dropdown-divider"></div>',
        '<a onclick="SignoutAdmin()" class="dropdown-item lang" key="sign_out" href="#">',
          '<i class="mdi mdi-logout mr-2 text-primary"></i> Sign out </a>',
      '</div>',
    '</li>'
  ].join('');
var liLast = document.getElementById('indexKnowledgeBase_accaundUsers');
liLast.insertAdjacentHTML('afterbegin', html);
///
if(FotoUrlLocalStorage == null){
  var reader = new XMLHttpRequest();
  var checkFor = FotoUrlLocalStorage;
  reader.open('get', checkFor, true);
  reader.onreadystatechange = checkReadyState;
  reader.send(null);
}else{
  var up_names = document.getElementsByName("IDFotoUrlLocalStorage");
  up_names[0].src = FotoUrlLocalStorage;
}
document.getElementById("user_name_local").textContent = UserNamelocalStorage
} else {
  var liLast_Title = document.getElementById('indexKnowledgeBase_accaundUsers');
  if(liLast_Title !== null){
    liLast_Title.remove();
  }
}

/**
* @return {string}
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
 function SignoutAdmin() {
   firebase.auth().signOut().then(function() {
     // Sign-out successful.
     // Выход выполнен успешно.
     if (localStorage.getItem('TMR::translation') == null) {
       localStorage.setItem('TMR::translation', 'ru');
     }
     var translation_JS = localStorage.getItem('TMR::translation');
     localStorage.clear();
     localStorage.setItem('TMR::translation', translation_JS);
     window.location.replace("indexKnowledgeBase.html")
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

/**
* @return {string}
*  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
*/
function checkReadyState() {
  hiddenImg= new Image();
  hiddenImg.src= "svg/logo TMR Systems 192 80.svg";
  document.IDFotoUrlLocalStorage.src=hiddenImg.src;
  return;
}
