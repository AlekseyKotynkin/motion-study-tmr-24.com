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
//
var items = [];
var itemsPositionUser = [];

/**
* @return {string}
*  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
*/
const LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
if (LocalStorageValueObject !== null) {
  var UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
  var EmailLocalStorage = (LocalStorageValueObject[0]).email;
  var FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;
} else {
  window.location.replace("widget.html");
}

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdmin'.
*/
const LocalStorageValueObjectOrganization = JSON.parse(localStorage.getItem('TMR::rememberedAdmin'));
const LocalStorageOrganizationId = (LocalStorageValueObjectOrganization[0]).OrganizationId;
const LocalStorageEmailOrganization = (LocalStorageValueObjectOrganization[0]).OwnerEmail;
var docRefOrganization = db.collection("Organization").doc(LocalStorageOrganizationId);
var nameOrganization = "";
var documentDataOrganization = [];

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminProducts'.
*/
const LocalStorageValueObjectProducts = JSON.parse(localStorage.getItem('TMR::rememberedAdminProducts'));
const LocalStorageProducts = (LocalStorageValueObjectProducts[0]).ProductsId;
var docRefProducts = db.collection("Products").doc(LocalStorageProducts);
var nameProducts = "";
var documentDataProducts = [];

/**
* @return {string}
*  Заполняем шапки табличных частей Пользователи и Процессы (название кнопок).
*/
docRefOrganization.get().then(function (doc) /** Заполняем шапки табличных частей Пользователи и Процессы (название кнопок).*/ {
  if (doc.exists) {
    documentDataOrganization.push(doc.data());
  } else {
    console.log("No such document!");
  }
}).catch(function (error) {
  console.log("Error getting document:", error);
}).finally(() => {
  documentDataOrganization;
  documentDataOrganization.forEach(item => {
    nameOrganization = item.Organization;

    var q = document.getElementById(Organization_h4);
    

    my_div = document.getElementById("headerTableSubdivision");
    var ul = my_div.querySelector("h4");
    my_div_process = document.getElementById("headerTableProducts");
    var ul_process = my_div_process.querySelector("h4");
    var li = item.Organization;
    ul.insertAdjacentHTML("beforeend", li);
    ul_process.insertAdjacentHTML("beforeend", li);




  });
});



/**
* @return {string}
*  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
*/
function SignoutAdmin() /**Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.*/
{
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    // Выход выполнен успешно.
    if (localStorage.getItem('TMR::translation') == null) {
      localStorage.setItem('TMR::translation', 'ru');
    }
    var translation_JS = localStorage.getItem('TMR::translation');
    localStorage.clear();
    localStorage.setItem('TMR::translation', translation_JS);
    window.location.replace("index.html")
  }).catch(function (error) {
    // An error happened.
    // Произошла ошибка.
    if (translation_JS == null || translation_JS == 'en') {
      alert("An error happened!");
    } else {
      alert("Произошла ошибка!");
    }
  });
}

/**
* @return {string}
*  Обработка модального окна Регистрация Пользователя.
*/
// function gridSystemModalNewUserSubmit() /** Обработка модального окна Регистрация Пользователя.*/
// {
//   var email = document.getElementById("exampleInputModalUserTitle").value.toLowerCase();
//   if (email.length < 1) {
//     if (translation_JS == null || translation_JS == 'en') {
//       alert('Please enter an user name.');
//     } else {
//       alert("Пожалуйста, введите имя пользователя.");
//     }
//     return;
//   }
//   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
//   if (reg.test(email) == false) {
//     if (translation_JS == null || translation_JS == 'en') {
//       alert('Enter the correct email!');
//     } else {
//       alert('Введите корректный email!');
//     }
//     return false;
//   }
//   var UserСomment = document.getElementById("exampleInputModalUserСomment").value;
//   if (UserСomment.length < 1) {
//     if (translation_JS == null || translation_JS == 'en') {
//       alert('Please enter an comments.');
//     } else {
//       alert("Пожалуйста, введите комментарий.");
//     }
//     return;
//   }
//   var UserName = document.getElementById("exampleInputModalUserName").value;
//   if (UserName.length < 1) {
//     if (translation_JS == null || translation_JS == 'en') {
//       alert('Please enter an users name.');
//     } else {
//       alert("Пожалуйста, введите ФИО.");
//     }
//     return;
//   }
//   docRefPosition.collection("PositionUser").add({
//     UserEmail: email,
//     UserСomment: UserСomment,
//     UserName: UserName,
//     idDocPosition: LocalStoragePosition,
//     idDocSubdivision: LocalStorageSubdivision,
//     idDocOrganization: LocalStorageOrganizationId,
//   }).then(function (docRef) {
//     console.log("Document written with ID: ", docRef.id);
//     db.collection("OrganizationTable").add({
//       idDocOrganization: LocalStorageOrganizationId,
//       nameOrganization: nameOrganization,
//       idDocPosition: LocalStoragePosition,
//       namePosition: namePosition,
//       idDocPositionUser: docRef.id,
//       idDocSubdivision: LocalStorageSubdivision,
//       nameSubdivision: nameSubdivision,
//       UserEmail: email,
//       UserСomment: UserСomment,
//       UserName: UserName,
//     }).then(function (docRef) {
//       console.log("Document written with ID: ", docRef.id);
//     }).catch(function (error) {
//       console.error("Error adding document: ", error);
//       if (translation_JS == null || translation_JS == 'en') {
//         alert("Error adding document: ", error);
//       } else {
//         alert("Ошибка при добавлении документа: ", error);
//       }
//     });
//     $('#gridSystemModalNewUser').modal('toggle');
//     window.location.reload();
//   }).catch(function (error) {
//     console.error("Error adding document: ", error);
//     if (translation_JS == null || translation_JS == 'en') {
//       alert("Error adding document: ", error);
//     } else {
//       alert("Ошибка при добавлении документа: ", error);
//     }
//   });
// }

/**
* @return {string}
*  Обработчик кнопки toDismiss из таблицы Пользователи.
*/

// function toDismissButtonUser(obj) /** Обработчик кнопки toDismiss из таблицы Пользователи.*/
// {
//   var objId = obj.id;
//   if (translation_JS == null || translation_JS == 'en') {
//     alert('Document successfully deleted!' + (objId));
//   } else {
//     alert('Документ успешно удален!' + (objId));
//   }
//   docRefPosition.collection("PositionUser").doc(objId).delete().then(function () {
//     console.log("Document successfully deleted!");
//     window.location.reload();
//   }).catch(function (error) {
//     console.error("Error removing document: ", error);
//   });
//   db.collection("OrganizationTable").where("idDocPositionUser", "==", objId).where("UserEmail", "==", UserNamelocalStorage)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//         db.collection("OrganizationTable").doc(doc.id).delete().then(() => {
//           console.log("Document successfully deleted!");
//         }).catch((error) => {
//           console.error("Error removing document: ", error);
//         });
//       });
//     })
//     .catch((error) => {
//       console.log("Error getting documents: ", error);
//     });
// }

/**
* @return {string}
*  Обработчик кнопки deleteButtonSettings из таблицы Процессов.
*/
// function deleteButtonSettings(obj)/** Обработчик кнопки deleteButtonSettings из таблицы Процессов.*/
// {
//   var objId = obj.id;
//   if (translation_JS == null || translation_JS == 'en') {
//     alert('Document successfully deleted!' + (objId));
//   } else {
//     alert('Документ успешно удален!' + (objId));
//   }
//   docRefPosition.collection("PositionSettings").doc(objId).delete().then(function () {
//     console.log("Document successfully deleted!");
//     window.location.reload();
//   }).catch(function (error) {
//     console.error("Error removing document: ", error);
//   });
// }

/**
* @return {string}*  Обработчик кнопки editButtonUser из таблицы Пользователи.
*/
// function editButtonUser(obj)
// {
//   objIdDocUser = obj.id;
//   var washingtonRef = docRefPosition.collection("PositionUser").doc(objIdDocUser);
//   washingtonRef.get().then(function(doc) {
//     if (doc.exists)
//   {
//       let userEmail = doc.data().UserEmail;
//       let UserСomment = doc.data().UserСomment;
//       document.getElementById('editExampleInputModalUserTitle').value = userEmail;
//       document.getElementById('editExampleInputModalUserСomment').value = UserСomment;
//       var modal = document.getElementById('editGridSystemModalNewUser');
//       $(document).ready(function(){
//         $("#editGridSystemModalNewUser").modal('show');
//         window.location.reload();
//       });
//       } else {
//         console.log("No such document!");
//       }
//   }).catch(function(error) {
//       console.log("Error getting document:", error);
//   });
// }


/**
* @return {string}* Открыть окно Фейсбука.
*/
function location_Href() /** Открыть окно Фейсбука..*/
{
  window.open('https://www.facebook.com/TMR24Systems/');
}

/**
* @return {string}* Заполняем строки с русскими значениями.
*/
function translationCommon_EN() /** Заполняем строки с русскими значениями.*/
{
  // //
  // var element_1 = document.getElementById("settings_button_modal_title_active_activity");
  // var newElement_1 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsActiveControl">Active Control</label>';
  // element_1.insertAdjacentHTML('beforeend', newElement_1);
  // //
  // var element_2 = document.getElementById("settings_button_modal_title_active_activity_signal");
  // var newElement_2 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsActiveSignal">Signal</label>';
  // element_2.insertAdjacentHTML('beforeend', newElement_2);
  // //
  // var element_3 = document.getElementById("settings_button_modal_title_passive_activity");
  // var newElement_3 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveControl">Passive Control</label>';
  // element_3.insertAdjacentHTML('beforeend', newElement_3);
  // //
  // var element_4 = document.getElementById("settings_button_modal_title_passive_activity_audio");
  // var newElement_4 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveAudio">Audio</label>';
  // element_4.insertAdjacentHTML('beforeend', newElement_4);
  // //
  // var element_5 = document.getElementById("settings_button_modal_title_passive_activity_photo");
  // var newElement_5 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhoto">Photo</label>';
  // element_5.insertAdjacentHTML('beforeend', newElement_5);
  // //
  // var element_6 = document.getElementById("settings_button_modal_title_passive_activity_clic");
  // var newElement_6 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoCaptureEventOnClick">Capture event on click</label>';
  // element_6.insertAdjacentHTML('beforeend', newElement_6);
  // //
  // var element_7 = document.getElementById("settings_button_modal_title_commit_description");
  // var newElement_7 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsCommitDescription">Commit Description</label>';
  // element_7.insertAdjacentHTML('beforeend', newElement_7);
  // //
  // var element_8 = document.getElementById("settings_button_modal_title_result_control");
  // var newElement_8 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsResultControl">Result Control</label>';
  // element_8.insertAdjacentHTML('beforeend', newElement_8);
  // //
  // var element_9 = document.getElementById("settings_button_modal_title_passive_activity_smartphone_camera");
  // var newElement_9 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoSmartphoneCamera">Smartphone camera</label>';
  // element_9.insertAdjacentHTML('beforeend', newElement_9);
  // //
  // var element_10 = document.getElementById("settings_button_modal_title_passive_activity_ip_camera");
  // var newElement_10 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoExternalIPCamera">External IP camera</label>';
  // element_10.insertAdjacentHTML('beforeend', newElement_10);
  // //
  // var element_11 = document.getElementById("settings_button_modal_title_passive_activity_video");
  // var newElement_11 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveVideo">Video</label>';
  // element_11.insertAdjacentHTML('beforeend', newElement_11);
  // //
  // var element_12 = document.getElementById("settings_button_modal_title_passive_activity_geolocation");
  // var newElement_12 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveGeolocation">Geolocation</label>';
  // element_12.insertAdjacentHTML('beforeend', newElement_12);
  // //
  // var element_13 = document.getElementById("settings_button_modal_title_passive_activity_geolocation_clic");
  // var newElement_13 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveGeolocationCaptureEventOnClick">Capture event on click</label>';
  // element_13.insertAdjacentHTML('beforeend', newElement_13);
}

/**
* @return {string}* Заполняем строки с английскими значениями.
*/
function translationCommon_RU() /** Заполняем строки с английскими значениями.*/
{
  // //
  // var element_1 = document.getElementById("settings_button_modal_title_active_activity");
  // var newElement_1 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsActiveControl">Активный Контроль</label>';
  // element_1.insertAdjacentHTML('beforeend', newElement_1);
  // //
  // var element_2 = document.getElementById("settings_button_modal_title_active_activity_signal");
  // var newElement_2 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsActiveSignal">Сигнал</label>';
  // element_2.insertAdjacentHTML('beforeend', newElement_2);
  // //
  // var element_3 = document.getElementById("settings_button_modal_title_passive_activity");
  // var newElement_3 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveControl">Пассивный Контроль</label>';
  // element_3.insertAdjacentHTML('beforeend', newElement_3);
  // //
  // var element_4 = document.getElementById("settings_button_modal_title_passive_activity_audio");
  // var newElement_4 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveAudio">Запись звука</label>';
  // element_4.insertAdjacentHTML('beforeend', newElement_4);
  // //
  // var element_5 = document.getElementById("settings_button_modal_title_passive_activity_photo");
  // var newElement_5 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhoto">Фото фиксация</label>';
  // element_5.insertAdjacentHTML('beforeend', newElement_5);
  // //
  // var element_6 = document.getElementById("settings_button_modal_title_passive_activity_clic");
  // var newElement_6 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoCaptureEventOnClick">Захват события по щелчку мыши</label>';
  // element_6.insertAdjacentHTML('beforeend', newElement_6);
  // //
  // var element_7 = document.getElementById("settings_button_modal_title_commit_description");
  // var newElement_7 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsCommitDescription">Описание фиксации</label>';
  // element_7.insertAdjacentHTML('beforeend', newElement_7);
  // //
  // var element_8 = document.getElementById("settings_button_modal_title_result_control");
  // var newElement_8 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsResultControl">Контроль результатов</label>';
  // element_8.insertAdjacentHTML('beforeend', newElement_8);
  // //
  // var element_9 = document.getElementById("settings_button_modal_title_passive_activity_smartphone_camera");
  // var newElement_9 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoSmartphoneCamera">Камера смартфона</label>';
  // element_9.insertAdjacentHTML('beforeend', newElement_9);
  // //
  // var element_10 = document.getElementById("settings_button_modal_title_passive_activity_ip_camera");
  // var newElement_10 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoExternalIPCamera">Внешняя камера</label>';
  // element_10.insertAdjacentHTML('beforeend', newElement_10);
  // //
  // var element_11 = document.getElementById("settings_button_modal_title_passive_activity_video");
  // var newElement_11 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveVideo">Видео</label>';
  // element_11.insertAdjacentHTML('beforeend', newElement_11);
  // //
  // var element_12 = document.getElementById("settings_button_modal_title_passive_activity_geolocation");
  // var newElement_12 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveGeolocation">Геолокация</label>';
  // element_12.insertAdjacentHTML('beforeend', newElement_12);
  // //
  // var element_13 = document.getElementById("settings_button_modal_title_passive_activity_geolocation_clic");
  // var newElement_13 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveGeolocationCaptureEventOnClick">Захват события по щелчку мыши</label>';
  // element_13.insertAdjacentHTML('beforeend', newElement_13);
}
