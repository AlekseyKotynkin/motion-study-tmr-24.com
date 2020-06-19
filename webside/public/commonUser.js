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
let items=[];
let idDocShiftUser="";
let idActivButtonUser="";
let idDocActivButtonUser="";


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
const EmailPositionUserLocalStorage = (LocalStorageValueObjectUser[0]).OwnerEmail;

  /**
  * @return {string}
  *  Получение данных для шапки таблицы List Of Posts In Which You Are Involved As A User из firestore.
  */
let organizationDocName = ParentHierarchyPositionUserlocalStorage.NameOrganization;
let subdivisionDocName = ParentHierarchyPositionUserlocalStorage.NameSubdivision;
let positionDocName = ParentHierarchyPositionUserlocalStorage.NamePosition;
let organizationDocId = ParentHierarchyPositionUserlocalStorage.idDocOrganization;
let subdivisionDocId = ParentHierarchyPositionUserlocalStorage.idDocSubdivision;
let positionDocId = ParentHierarchyPositionUserlocalStorage.idDocPosition;
let li = (positionDocName)+", Subdivision - "+(subdivisionDocName)+", Organization - "+(organizationDocName);

/**
* @return {string}
 *  Проверяем есть ли активный сеанс.
 */

 db.collection("WorkShift").where('IdDocPosition', '==', positionDocId).where("WorkShiftEnd", "==", "")
.get()
.then(function(querySnapshot) {
querySnapshot.forEach(function(doc) {
   // doc.data() is never undefined for query doc snapshots
   // console.log(doc.id, " => ", doc.data());
   idDocShiftUser = doc.id;
   var articleDiv = document.getElementById("buttonTableProcessesUser").innerHTML;
   var articleDivOn = '';
   document.body.innerHTML = document.body.innerHTML.replace(articleDiv, articleDivOn);
   my_div = document.getElementById("buttonTableProcessesUser");
   let lit = '<button type="button" class="btn btn-inverse-success btn-fw" onclick = "CloseShiftUser()"> - Close Shift </button>';
   my_div.insertAdjacentHTML("afterend", lit);
  // Получить активный процесс и активировать кнопку на экране.
   var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
   docRefWorkShift.collection("ProcessUser").where("ProcessUserEnd", "==", "")
       .get()
       .then(function(querySnapshot) {
           querySnapshot.forEach(function(doc) {
               // doc.data() is never undefined for query doc snapshots
               // console.log(doc.id, " => ", doc.data());
               idDocActivButtonUser = doc.id;
               idActivButtonUser = doc.data().IdDocProcessButton;
              // console.log(idDocActivButtonUser);
              // console.log(idActivButtonUser);
               let elem = document.getElementById(idActivButtonUser);
               elem.classList.toggle('active');
           });
       }).catch(function(error) {
           console.log("Error getting documents: ", error);
       });
});
}).catch(function(error) {
  console.log("Error getting documents: ", error);
});

/**
* @return {string}
*  Получить настройки процессов для данной Дожности.
*/
var docRefOrganization = db.collection("Organization").doc(organizationDocId);
var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
var docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
docRefPosition.collection("PositionSettings").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        items.push({...doc.data(),...{idDocPositionSettings: doc.id}});
        let nameButton = doc.data().SettingsTitle;
        my_div = document.getElementById("idButtons");
        let lit = '<button type="button" class="btn btn-outline-secondary btn-lg btn-block" id="idButtonsX" onclick ="toRegisterProcessUser(this)"></button>';
        my_div.insertAdjacentHTML("beforeend", lit);
        my_div = document.getElementById("idButtonsX");
        let li = '<p class="text">'+(nameButton)+'</p>';
        my_div.insertAdjacentHTML("beforeend", li);
        document.getElementById('idButtonsX').id = doc.id;
    });
});

/**
* @return {string}
*  Открытие рабочей смены.
*/
function AddShiftUser() {
  let timestampStart = firebase.firestore.FieldValue.serverTimestamp();
  db.collection("WorkShift").add({
    EmailPositionUser: EmailPositionUserLocalStorage,
    IdDocPosition: positionDocId,
    ParentHierarchyPositionUser: ParentHierarchyPositionUserlocalStorage,
    WorkShiftEnd: "",
    WorkShiftStartTime: timestampStart,
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      window.location.replace("indexUser.html");
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

/**
* @return {string}
*  Закрытие рабочей смены.
*/
 function CloseShiftUser() {
  let timestampStop = firebase.firestore.FieldValue.serverTimestamp();
  var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
  // Set the "capital" field of the city 'DC'
  return docRefWorkShift.update({
      WorkShiftEndTime: timestampStop,
      WorkShiftEnd: "false",
  })
  .then(function() {
      console.log("Document successfully updated!");
      let elem = document.getElementById(idActivButtonUser);
      elem.classList.toggle('active');
      let timestampStop = firebase.firestore.FieldValue.serverTimestamp();
      var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
      var docRefWorkShiftProcessUser = docRefWorkShift.collection("ProcessUser").doc(idDocActivButtonUser);
      // Set the "capital" field of the city 'DC'
      return docRefWorkShiftProcessUser.update({
          ProcessUserEndTime: timestampStop,
          ProcessUserEnd: "false",
      }).then(function() {
        // idActivButtonUser = "";
        // idDocActivButtonUser = "";
        window.location.replace("indexUser.html")
      });

  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}

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
  *  Регистрируем событие процесс Пользователя.
  */
function toRegisterProcessUser(obj) {
    // Проверяем открыта ли смена.
   if (idDocShiftUser == "")
   {
   alert("Open work shift!");
   }
   else
   {
     // Получить активный процесс и закрыть его.
   if (idDocActivButtonUser == "")
   {
   alert("Good luck Go!");
   }
   else
   {
         let elemExit = document.getElementById(idActivButtonUser);
         elemExit.classList.toggle('active');
         idActivButtonUser = obj.id;
         objDoc = obj.innerText;
         let elem = document.getElementById(idActivButtonUser);
         elem.classList.toggle('active');
         let timestampStop = firebase.firestore.FieldValue.serverTimestamp();
         var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
         var docRefWorkShiftProcessUser = docRefWorkShift.collection("ProcessUser").doc(idDocActivButtonUser);
         // Set the "capital" field of the city 'DC'
         return docRefWorkShiftProcessUser.update({
             ProcessUserEndTime: timestampStop,
             ProcessUserEnd: "false",
         })
         .then(function() {
          let timestampStart = firebase.firestore.FieldValue.serverTimestamp();
          var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
          docRefWorkShift.collection("ProcessUser").add({
          EmailPositionUser: EmailPositionUserLocalStorage,
          IdDocPosition: positionDocId,
          ParentHierarchyPositionUser: ParentHierarchyPositionUserlocalStorage,
          ProcessUserEnd: "",
          ProcessUserStartTime: timestampStart,
          IdDocProcessButton: idActivButtonUser,
          NameDocProcessButton: objDoc,
        })
        .then(function(docRef) {
            // console.log("Document written with ID: ", docRef.id);
            // idDocActivButtonUser = docRef.id;
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
         })
         .catch(function(error) {
             // The document probably doesn't exist.
             console.error("Error updating document: ", error);
         });
       }
       // Записываем процесс, регистрируем время.
    idActivButtonUser = obj.id;
    objDoc = obj.innerText;
    let timestampStart = firebase.firestore.FieldValue.serverTimestamp();
    var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
    docRefWorkShift.collection("ProcessUser").add({
    EmailPositionUser: EmailPositionUserLocalStorage,
    IdDocPosition: positionDocId,
    ParentHierarchyPositionUser: ParentHierarchyPositionUserlocalStorage,
    ProcessUserEnd: "",
    ProcessUserStartTime: timestampStart,
    IdDocProcessButton: idActivButtonUser,
    NameDocProcessButton: objDoc,
    }).then(function(docRef) {
        // console.log("Document written with ID: ", docRef.id);
        idDocActivButtonUser = docRef.id;
        let elem = document.getElementById(idActivButtonUser);
        elem.classList.toggle('active');
    }).catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }
}
