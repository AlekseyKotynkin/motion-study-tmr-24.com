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

const currentUrl_host = window.location.host;
const currentUrl_protocol = window.location.protocol;


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
*  Заполняем шапки табличных частей .
*/
docRefOrganization.get().then(function (doc) /** Заполняем шапки табличных частей Организация.*/
{
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
    if (translation_JS == null || translation_JS == 'en') {
      document.getElementById("Organization_h4").innerHTML = "Organization - "+ nameOrganization;
    } else {
      document.getElementById("Organization_h4").innerHTML = "Организация - "+ nameOrganization;
    }
  });
});

docRefProducts.get().then(function (doc) /** Заполняем шапки табличных частей Продукт.*/
{
  if (doc.exists) {
    documentDataProducts.push(doc.data());
  } else {
    console.log("No such document!");
  }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  }).finally(() => {
    documentDataProducts;
    documentDataProducts.forEach(item => {
    nameProducts = item.ProductsTitle;
    if (translation_JS == null || translation_JS == 'en') {
      document.getElementById("Products_h4").innerHTML = "Products - "+ nameProducts;
    } else {
      document.getElementById("Products_h4").innerHTML = "Продукция - "+ nameProducts;
    }
  });
});

/** Заполняем табличную часть Упаковочные места.*/
db.collection("PackingPlaces").where("ProductsId", "==", LocalStorageProducts)
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      items.push({ ...doc.data(), ...{ idPackingPlaces: doc.id } });
    });

  })
  .catch(function (error) {
    console.log("Error getting documents: ", error);
  })
  .finally(() => {
    items;
    items.forEach(item => {
      var tr = document.createElement("tr");

      var PackingPlaces_NameLitl = document.createElement('td');
      PackingPlaces_NameLitl.innerHTML = item.PackingPlaces_NameLitl;

      ////
      var toComeInUserName = document.createElement('button');
      if (translation_JS == null || translation_JS == 'en') {
        toComeInUserName.innerHTML = "Prints";
      } else {
        toComeInUserName.innerHTML = "Печать";
      }
      toComeInUserName.className = 'badge badge-gradient-success';
      toComeInUserName.id = item.idPackingPlaces;
      // toComeInUserName.item = item.Subdivision;
      toComeInUserName.setAttribute('onclick', 'toPrintidPackingPlaces(this)');

      var toComeInUserColumn = document.createElement('td');
      toComeInUserColumn.appendChild(toComeInUserName);
      ////
      var quitName = document.createElement('button');
      if (translation_JS == null || translation_JS == 'en') {
        quitName.innerHTML = "to Сhange";
      } else {
        quitName.innerHTML = "Изменить";
      }
      quitName.className = 'badge badge-gradient-warning';
      quitName.id = item.idPackingPlaces;
      quitName.setAttribute('onclick', 'to_changePackingPlaces(this)');

      var quitColumn = document.createElement('td');
      quitColumn.appendChild(quitName);
      ////
      var toСhangePackingPlace = document.createElement('button');
      if (translation_JS == null || translation_JS == 'en') {
        toСhangePackingPlace.innerHTML = "Quit";
      } else {
        toСhangePackingPlace.innerHTML = "Удалить";
      }
      toСhangePackingPlace.className = 'badge badge-gradient-danger';
      toСhangePackingPlace.id = item.idPackingPlaces;
      toСhangePackingPlace.setAttribute('onclick', 'quitPackingPlaces(this)');

      var to_СhangePackingPlace = document.createElement('td');
      to_СhangePackingPlace.appendChild(toСhangePackingPlace);
      ////
      tr.appendChild(PackingPlaces_NameLitl);
      tr.appendChild(toComeInUserColumn);
      tr.appendChild(to_СhangePackingPlace);
      tr.appendChild(quitColumn);
      var container = document.getElementById("list_packingPlaces").getElementsByTagName("tbody")[0];
      container.appendChild(tr);
    });
  });




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

function gridSystemModalNewPackingPlacesSubmit() /** Обработка модального окна добавить Упаковочное место.*/
{
  var PackingPlaces_Name = document.getElementById("PackingPlaces_Name").value;
  if (PackingPlaces_Name.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter the name of the packing place.');
    } else {
      alert("Пожалуйста введите наименование упаковочного места.");
    }
    return;
  }

  var PackingPlaces_NameLitl = document.getElementById("PackingPlaces_NameLitl").value;
  if (PackingPlaces_NameLitl.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter the abbreviated name of the packing place.');
    } else {
      alert("Пожалуйста введите сокращенное наименование упаковочного места.");
    }
    return;
  }

  var PackingPlaces_Comment = document.getElementById("PackingPlaces_Comment").value;

  var PackingPlaces_Barcode = document.getElementById("PackingPlaces_Barcode").value;
  if (PackingPlaces_Barcode.length !== 13) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter the barcode of the packing place in the EAN13 format.');
    } else {
      alert("Пожалуйста введите штрих-код упаковочного места в формате EAN13.");
    }
    return;
  }

  var PackingPlaces_length = document.getElementById("PackingPlaces_length").value;
  if (PackingPlaces_length.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter the length of the packing place in millimeters.');
    } else {
      alert("Пожалуйста введите в миллиметрах длину упаковочного места.");
    }
    return;
  }

  var PackingPlaces_width = document.getElementById("PackingPlaces_width").value;
  if (PackingPlaces_width.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter the width of the packing place in millimeters.');
    } else {
      alert("Пожалуйста введите в миллиметрах ширину упаковочного места.");
    }
    return;
  }

  var PackingPlaces_height = document.getElementById("PackingPlaces_height").value;
  if (PackingPlaces_height.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter the height of the packing place in millimeters.');
    } else {
      alert("Пожалуйста введите в миллиметрах высоту упаковочного места.");
    }
    return;
  }

  var PackingPlaces_weight = document.getElementById("PackingPlaces_weight").value;
  if (PackingPlaces_weight.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter the weight of the packing place in millimeters.');
    } else {
      alert("Пожалуйста введите в миллиметрах вес упаковочного места.");
    }
    return;
  }

  var PackingPlaces_TU = document.getElementById("PackingPlaces_TU").value;
  if (PackingPlaces_TU.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter the number of the product manufacturing specifications.');
    } else {
      alert("Пожалуйста введите номер технических условий изготовления продукции.");
    }
    return;
  }

  db.collection("PackingPlaces").add({
    ProductsOrganizationId: LocalStorageOrganizationId,  
    ProductsId : LocalStorageProducts,   
    PackingPlaces_Name: PackingPlaces_Name,
    PackingPlaces_NameLitl: PackingPlaces_NameLitl,
    PackingPlaces_Comment: PackingPlaces_Comment,
    PackingPlaces_Barcode: PackingPlaces_Barcode,
    PackingPlaces_length: PackingPlaces_length,
    PackingPlaces_width: PackingPlaces_width,
    PackingPlaces_height: PackingPlaces_height,
    PackingPlaces_weight: PackingPlaces_weight,
    PackingPlaces_TU: PackingPlaces_TU,
  })
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    $('#gridSystemModalNewPackingPlaces').modal('toggle');
    window.location.reload();
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
    if (translation_JS == null || translation_JS == 'en') {
      alert("Error adding document: ", error);
    } else {
      alert("Ошибка при добавлении документа: ", error);
    }
  });
}

function gridSystemModalNewSpecificatioSubmit() /** Обработка модального окна добавить Спецификацию.*/
{



}

function toPrintidPackingPlaces(obj) // Обработчик кнопки из таблицы Упаковочное место - Печати этикетки.
{
  var objId = obj.id;
  var docRef = db.collection("PackingPlaces").doc(objId);
  docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        var PackingPlaces_Barcode = doc.data().PackingPlaces_Barcode;
        var PackingPlaces_Name = doc.data().PackingPlaces_Name;
        var PackingPlaces_length = doc.data().PackingPlaces_length;
        var PackingPlaces_width = doc.data().PackingPlaces_width;
        var PackingPlaces_height = doc.data().PackingPlaces_height;
        var PackingPlaces_weight = doc.data().PackingPlaces_weight;
        var PackingPlaces_TU = doc.data().PackingPlaces_TU;
        var url = new URL("https://tmr-24.com/indexPrintPackagingLabel.html/?Barcode=00000000&Name=value2&length=value2&width=value2&height=value2&weight=value2&TU=value2");
        if (currentUrl_host !== "tmr-24.com"){
          url.host = currentUrl_host;
          url.protocol = currentUrl_protocol;      
        }
        url.searchParams.set('Barcode', PackingPlaces_Barcode);
        url.searchParams.set('Name', PackingPlaces_Name);
        url.searchParams.set('length', PackingPlaces_length);
        url.searchParams.set('width', PackingPlaces_width);
        url.searchParams.set('height', PackingPlaces_height);
        url.searchParams.set('weight', PackingPlaces_weight);
        url.searchParams.set('TU', PackingPlaces_TU);
        window.open(url, '_blank');

    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

function quitPackingPlaces(obj)/** Обработчик кнопки из таблицы Упаковочное место - удалить.*/
{
  var objId = obj.id;
  if (translation_JS == null || translation_JS == 'en') {
    alert('The feature is in development!' + (objId));
  } else {
    alert('Функция в разработке!' + (objId));
  }
  // docRefPosition.collection("PositionSettings").doc(objId).delete().then(function () {
  //   console.log("Document successfully deleted!");
  //   window.location.reload();
  // }).catch(function (error) {
  //   console.error("Error removing document: ", error);
  // });
}

function to_changePackingPlaces(obj)/** Обработчик кнопки из таблицы Упаковочное место - изменить.*/
{
  var objId = obj.id;
  if (translation_JS == null || translation_JS == 'en') {
    alert('The feature is in development!' + (objId));
  } else {
    alert('Функция в разработке!' + (objId));
  }
  // docRefPosition.collection("PositionSettings").doc(objId).delete().then(function () {
  //   console.log("Document successfully deleted!");
  //   window.location.reload();
  // }).catch(function (error) {
  //   console.error("Error removing document: ", error);
  // });
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
