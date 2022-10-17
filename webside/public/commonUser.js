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
var items=[];
var idDocShiftUser="";
var idActivButtonUser="";
var idDocActivButtonUser="";


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
var nameOrganization = ParentHierarchyPositionUserlocalStorage.NameOrganization;
var nameSubdivision = ParentHierarchyPositionUserlocalStorage.NameSubdivision;
var namePosition = ParentHierarchyPositionUserlocalStorage.NamePosition;
var idDocOrganization = ParentHierarchyPositionUserlocalStorage.idDocOrganization;
var idDocSubdivision = ParentHierarchyPositionUserlocalStorage.idDocSubdivision;
var idDocPosition = ParentHierarchyPositionUserlocalStorage.idDocPosition;
if(translation_JS == null || translation_JS == 'en'){
  var li = (namePosition)+", Subdivision - "+(nameSubdivision)+", Organization - "+(nameOrganization);
} else {
  var li = (namePosition)+", Подразделение - "+(nameSubdivision)+", Организация - "+(nameOrganization);
}

/**
* @return {string}
 *  Проверяем есть ли активный сеанс.
 */

 db.collection("WorkShift").where('IdDocPosition', '==', idDocPosition).where("WorkShiftEnd", "==", "")
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
   if(translation_JS == null || translation_JS == 'en'){
     var lit = '<button type="button" class="btn btn-inverse-success btn-fw" onclick = "CloseShiftUser()"> - Close Shift </button>';
   } else {
     var lit = '<button type="button" class="btn btn-inverse-success btn-fw" onclick = "CloseShiftUser()"> Закрыть смену </button>';
   }
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
               var elem = document.getElementById(idActivButtonUser);
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
var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
docRefPosition.collection("PositionSettings").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        items.push({...doc.data(),...{idDocPositionSettings: doc.id}});
        var nameButton = doc.data().SettingsTitle;
        my_div = document.getElementById("idButtons");
        var lit = '<button type="button" class="btn btn-outline-secondary btn-lg btn-block" id="idButtonsX" onclick ="toRegisterProcessUser(this)"></button>';
        my_div.insertAdjacentHTML("beforeend", lit);
        my_div = document.getElementById("idButtonsX");
        var li = '<p class="text">'+(nameButton)+'</p>';
        my_div.insertAdjacentHTML("beforeend", li);
        document.getElementById('idButtonsX').id = doc.id;
    });
});

/**
* @return {string}
*  Открытие рабочей смены.
*/
function AddShiftUser() {
  var timestampStart = firebase.firestore.FieldValue.serverTimestamp();
  db.collection("WorkShift").add({
    EmailPositionUser: EmailPositionUserLocalStorage,
    IdDocPosition: idDocPosition,
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
  var timestampStop = firebase.firestore.FieldValue.serverTimestamp();
  var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
  // Set the "capital" field of the city 'DC'
  return docRefWorkShift.update({
      WorkShiftEndTime: timestampStop,
      WorkShiftEnd: "false",
  })
  .then(function() {
      console.log("Document successfully updated!");
      var elem = document.getElementById(idActivButtonUser);
      elem.classList.toggle('active');
      var timestampStop = firebase.firestore.FieldValue.serverTimestamp();
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

 /**
 * @return {string}
  *  Регистрируем событие процесс Пользователя.
  */
function toRegisterProcessUser(obj) {
    // Проверяем открыта ли смена.
   if (idDocShiftUser == "")
   {
     if(translation_JS == null || translation_JS == 'en'){
       alert("Open work shift!");
     } else {
       alert ("Откройте pабочую смену!");
     }
   }
   else
   {
     // Получить активный процесс и закрыть его.
   if (idDocActivButtonUser == "")
   {
     if(translation_JS == null || translation_JS == 'en'){
       alert("Good luck Go!");
     } else {
       alert ("Удачи Вам!");
     }
   }
   else
   {
         var elemExit = document.getElementById(idActivButtonUser);
         elemExit.classList.toggle('active');
         idActivButtonUser = obj.id;
         objDoc = obj.innerText;
         var elem = document.getElementById(idActivButtonUser);
         elem.classList.toggle('active');
         var timestampStop = firebase.firestore.FieldValue.serverTimestamp();
         var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
         var docRefWorkShiftProcessUser = docRefWorkShift.collection("ProcessUser").doc(idDocActivButtonUser);
         // Set the "capital" field of the city 'DC'
         return docRefWorkShiftProcessUser.update({
            ProcessUserEndTime: timestampStop,
            ProcessUserEnd: "false",
            }).then(function() {
            var timestampStart = firebase.firestore.FieldValue.serverTimestamp();
            var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
            docRefWorkShift.collection("ProcessUser").add({
            EmailPositionUser: EmailPositionUserLocalStorage,
            IdDocPosition: idDocPosition,
            ParentHierarchyPositionUser: ParentHierarchyPositionUserlocalStorage,
            ProcessUserEnd: "",
            ProcessUserStartTime: timestampStart,
            IdDocProcessButton: idActivButtonUser,
            NameDocProcessButton: objDoc,
            }).then(function(docRef) {
                // console.log("Document written with ID: ", docRef.id);
                // idDocActivButtonUser = docRef.id;
            }).catch(function(error) {
                console.error("Error adding document: ", error);
            });
         }).catch(function(error) {
             // The document probably doesn't exist.
             console.error("Error updating document: ", error);
         });
       }
       // Записываем процесс, регистрируем время.
    idActivButtonUser = obj.id;
    objDoc = obj.innerText;
    var timestampStart = firebase.firestore.FieldValue.serverTimestamp();
    var docRefWorkShift = db.collection("WorkShift").doc(idDocShiftUser);
    docRefWorkShift.collection("ProcessUser").add({
    EmailPositionUser: EmailPositionUserLocalStorage,
    IdDocPosition: idDocPosition,
    ParentHierarchyPositionUser: ParentHierarchyPositionUserlocalStorage,
    ProcessUserEnd: "",
    ProcessUserStartTime: timestampStart,
    IdDocProcessButton: idActivButtonUser,
    NameDocProcessButton: objDoc,
    }).then(function(docRef) {
        // console.log("Document written with ID: ", docRef.id);
        idDocActivButtonUser = docRef.id;
        var elem = document.getElementById(idActivButtonUser);
        elem.classList.toggle('active');
    }).catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }
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
