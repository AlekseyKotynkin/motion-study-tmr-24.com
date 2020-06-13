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






 var buttons = document.querySelectorAll(".button");

 for (var button of buttons) {
    button.addEventListener('click', function () {
      buttons.forEach(i => i.classList.remove('active'));

      this.classList.toggle('active');
    });
 };

/**
 * Общие методы для главной страницы приложения и автономного виджета.
 */
let items=[];


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
 *  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
 */
const LocalStorageValueObjectUser = JSON.parse(localStorage.getItem('TMR::rememberedUser'));
const ParentHierarchyPositionUserlocalStorage = (LocalStorageValueObjectUser[0]).ParentHierarchy;
const EmailPositionUserLocalStorage = (LocalStorageValueObjectUser[0]).email;

/**
* @return {string}
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
 function SignoutAdmin() {
   localStorage.clear('firebaseui::rememberedAccounts');
   window.location.replace("index.html")
 }

 /**
 * @return {string}
  *  Получение данных для таблицы List Of Posts In Which You Are Involved As A User из firestore.
  */
    let organizationDocName = ParentHierarchyPositionUserlocalStorage.NameOrganization;
    let subdivisionDocName = ParentHierarchyPositionUserlocalStorage.NameSubdivision;
    let positionDocName = ParentHierarchyPositionUserlocalStorage.NamePosition;
    let li = (positionDocName)+", Subdivision - "+(subdivisionDocName)+", Organization - "+(organizationDocName);
