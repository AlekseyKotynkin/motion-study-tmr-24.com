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

/**
 * Общие методы для главной страницы приложения и автономного виджета.
 */
let documentData=[];
let documentDataSubdivision=[];
let items=[];
let itemsPosition=[];

// let docRef=0 ;
// let docRefFull=0 ;


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
*  Читаем параметры из localStorage 'TMR::rememberedAdmin'.
*/
const LocalStorageValueObjectOrganization = JSON.parse(localStorage.getItem('TMR::rememberedAdmin'));
const localStorageOrganizationId = (LocalStorageValueObjectOrganization[0]).OrganizationId;
const LocalStorageEmailOrganization = (LocalStorageValueObjectOrganization[0]).OwnerEmail;

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminSubdivision'.
*/
const LocalStorageValueObjectSubdivision = JSON.parse(localStorage.getItem('TMR::rememberedAdminSubdivision'));
const localStorageSubdivision = (LocalStorageValueObjectOrganization[0]).SubdivisionId;

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminPosition'.
*/
const LocalStorageValueObjectPosition = JSON.parse(localStorage.getItem('TMR::rememberedAdminPosition'));
const localStoragePosition = (LocalStorageValueObjectOrganization[0]).PositionId;

/**
* @return {string}
*  Заполняем шапку табличной части Подразделения.
*/

  var docRef = db.collection("Organization").doc(localStorageOrganizationId).collection("Subdivision").doc(localStorageSubdivision).collection("Position").doc(localStoragePosition);
    console.log(docRef);
    docRef.get().then(function(doc) {
    if (doc.exists) {
        documentData.push(doc.data());
    } else {
      console.log("No such document!");
    }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })
    .finally(() => {documentData;
     // documentData.forEach(item => {
     //    my_div = document.getElementById("headerTableSubdivision");
     //    const ul = my_div.querySelector("h4");
     //    let li = item.Organization;
     //    ul.insertAdjacentHTML("beforeend", li);
    // });
  });


/**
* @return {string}
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
 function SignoutAdmin() {
   localStorage.clear();

   window.location.replace("index.html")
 };
