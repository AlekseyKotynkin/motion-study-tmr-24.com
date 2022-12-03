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
var itemsPositionUser=[];

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
const LocalStorageOrganizationId = (LocalStorageValueObjectOrganization[0]).OrganizationId;
const LocalStorageEmailOrganization = (LocalStorageValueObjectOrganization[0]).OwnerEmail;
var docRefOrganization = db.collection("Organization").doc(LocalStorageOrganizationId);
var nameOrganization = "";
var documentDataOrganization=[];

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminSubdivision'.
*/
const LocalStorageValueObjectSubdivision = JSON.parse(localStorage.getItem('TMR::rememberedAdminSubdivision'));
const LocalStorageSubdivision = (LocalStorageValueObjectSubdivision[0]).SubdivisionId;
var docRefSubdivisio = docRefOrganization.collection("Subdivision").doc(LocalStorageSubdivision);
var nameSubdivision = "";
var documentDataSubdivision=[];

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminPosition'.
*/
const LocalStorageValueObjectPosition = JSON.parse(localStorage.getItem('TMR::rememberedAdminPosition'));
const LocalStoragePosition = (LocalStorageValueObjectPosition[0]).PositionId;
var docRefPosition = docRefSubdivisio.collection("Position").doc(LocalStoragePosition);
var namePosition = "";
var documentDataPosition=[];

var objIdDocUser ="";
var objIdDocSettings ="";
var objActiveModal = "";

var itemsPositionSalesFunnel = [];



/**
* @return {string}
*  Заполняем шапки табличных частей Пользователи и Процессы (название кнопок).
*/
docRefOrganization.get().then(function(doc) {
if (doc.exists) {
    documentDataOrganization.push(doc.data());
} else {
  console.log("No such document!");
}
}).catch(function(error) {
    console.log("Error getting document:", error);
})
.finally(() => {documentDataOrganization;
  documentDataOrganization.forEach(item => {
   nameOrganization = item.Organization;
   });
});

docRefSubdivisio.get().then(function(doc) {
if (doc.exists) {
    documentDataSubdivision.push(doc.data());
} else {
  console.log("No such document!");
}
}).catch(function(error) {
    console.log("Error getting document:", error);
})
.finally(() => {documentDataSubdivision;
 documentDataSubdivision.forEach(item => {
    nameSubdivision = item.Subdivision;
  });
});

docRefPosition.get().then(function(doc) {
if (doc.exists) {
    documentDataPosition.push(doc.data());
} else {
  console.log("No such document!");
}
}).catch(function(error) {
    console.log("Error getting document:", error);
})
.finally(() => {documentDataPosition;
 documentDataPosition.forEach(item => {
    my_div_User = document.getElementById("headerTableUser");
    var ul_User = my_div_User.querySelector("h4");
    namePosition =item.Position;
    if(translation_JS == null || translation_JS == 'en'){
      var li =" " +"Organization - "+(nameOrganization)+", Subdivision - "+(nameSubdivision)+", Position - "+(namePosition);
    } else {
      var li =" " + " Организация - "+(nameOrganization)+", Подразделение - "+(nameSubdivision)+", Должность - "+(namePosition);
    }
    ul_User.insertAdjacentHTML("beforeend", li);
    my_div = document.getElementById("headerTableSettings");
    var ul = my_div.querySelector("h4");
    ul.insertAdjacentHTML("beforeend", li);
   });
});

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
  *  Получение данных для таблицы список Пользователей .
  */
function createATableOfClientUser()
{
 docRefPosition.collection("PositionUser")
 .get()
 .then(function(querySnapshot) {
   querySnapshot.forEach(function(doc) {
     itemsPositionUser.push({...doc.data(),...{idPositionUser: doc.id}});
   });

     })
     .catch(function(error) {
         console.log("Error getting documents: ", error);
     })
       .finally(() => {itemsPositionUser;
       itemsPositionUser.forEach(item => {
       var tr = document.createElement("tr");

       var userEmailColumn = document.createElement('td');
       userEmailColumn.innerHTML = item.UserEmail;

       var UserNameColumn = document.createElement('td');
       UserNameColumn.innerHTML = item.UserName;

       var UserСommentColumn = document.createElement('td');
       UserСommentColumn.innerHTML = item.UserСomment;

       var toDismissName = document.createElement('button');
       if(translation_JS == null || translation_JS == 'en'){
         toDismissName.innerHTML = "To dismiss";
       } else {
         toDismissName.innerHTML = "Уволить";
       }
       toDismissName.className = 'badge badge-gradient-danger';
       toDismissName.id = item.idPositionUser;
       toDismissName.setAttribute('onclick', 'toDismissButtonUser(this)');

       var toDismissColumn = document.createElement('td');
       toDismissColumn.appendChild(toDismissName);

       tr.appendChild(userEmailColumn);
       tr.appendChild(UserNameColumn);
       tr.appendChild(UserСommentColumn);
       tr.appendChild(toDismissColumn);

       container.appendChild(tr);
     });
   });
};

/**
* @return {string}
 *  Получение данных для таблицы список Процессов (название кнопок).
 */
function createATableOfClientSettings()
{
docRefPosition.collection("PositionSettings")
.get()
.then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    items.push({...doc.data(),...{idPositionSettings: doc.id}});
  });

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    })
      .finally(() => {items;
      items.forEach(item => {
      var tr = document.createElement("tr");
      ////
      var settingsTitleColumn = document.createElement('td');
      settingsTitleColumn.innerHTML = item.SettingsTitle;
      ///
      var settingsСommentColumn = document.createElement('td');
      settingsСommentColumn.innerHTML = item.SettingsСomment;
      ///
      var settingsActiveControl = document.createElement('td');
      var ActiveControl = item.SettingsActiveControl;
      if(translation_JS == null || translation_JS == 'en'){
        if(ActiveControl == false){
          settingsActiveControl.innerHTML = "false";
        }else{
          settingsActiveControl.innerHTML = "true";
        }
      } else {
        if(ActiveControl == false){
          settingsActiveControl.innerHTML = "не используется";
        }else{
          settingsActiveControl.innerHTML = "используется";
        }
      }
      ///
      var settingsPassiveControl = document.createElement('td');
      var PassiveControl = item.SettingsPassiveControl;
      if(translation_JS == null || translation_JS == 'en'){
        if(PassiveControl == false){
          settingsPassiveControl.innerHTML = "false";
        }else{
          settingsPassiveControl.innerHTML = "true";
        }
      } else {
        if(PassiveControl == false){
          settingsPassiveControl.innerHTML = "не используется";
        }else{
          settingsPassiveControl.innerHTML = "используется";
        }
      }
      ///
      var settingsResultCapture = document.createElement('td');
      var ResultCapture = item.SettingsResultCapture;
      if(translation_JS == null || translation_JS == 'en'){
        if(ResultCapture == false){
          settingsResultCapture.innerHTML = "false";
        }else{
          settingsResultCapture.innerHTML = "true";
        }
      } else {
        if(ResultCapture == false){
          settingsResultCapture.innerHTML = "не используется";
        }else{
          settingsResultCapture.innerHTML = "используется";
        }
      }
      ///
      var settingsCommitDescription = document.createElement('td');
      var CommitDescription = item.SettingsCommitDescription;
      if(translation_JS == null || translation_JS == 'en'){
        if(CommitDescription == false){
          settingsCommitDescription.innerHTML = "false";
        }else{
          settingsCommitDescription.innerHTML = "true";
        }
      } else {
        if(CommitDescription == false){
          settingsCommitDescription.innerHTML = "не используется";
        }else{
          settingsCommitDescription.innerHTML = "используется";
        }
      }
      ///
      var editSettings = document.createElement('button');
      if(translation_JS == null || translation_JS == 'en'){
        editSettings.innerHTML = "Edit";
      } else {
        editSettings.innerHTML = "Редактировать";
      }
      editSettings.className = 'badge badge-gradient-success';
      editSettings.id = item.idPositionSettings;
      editSettings.SettingsTitle = item.SettingsTitle;
      editSettings.setAttribute('onclick', 'editButtonSettings(this)');

      var editSettingsColumn = document.createElement('td');
      editSettingsColumn.appendChild(editSettings);

      var deleteSettings = document.createElement('button');
      if(translation_JS == null || translation_JS == 'en'){
        deleteSettings.innerHTML = "Delete";
      } else {
        deleteSettings.innerHTML = "Удалить";
      }
      deleteSettings.className = 'badge badge-gradient-danger';
      deleteSettings.id = item.idPositionSettings;
      deleteSettings.setAttribute('onclick', 'deleteButtonSettings(this)');
      ///
      var deleteSettingsColumn = document.createElement('td');
      deleteSettingsColumn.appendChild(deleteSettings);
      ///
      tr.appendChild(settingsTitleColumn);
      tr.appendChild(settingsСommentColumn);
      tr.appendChild(settingsActiveControl);
      tr.appendChild(settingsPassiveControl);
      tr.appendChild(settingsCommitDescription);
      tr.appendChild(settingsResultCapture);
      tr.appendChild(editSettingsColumn);
      tr.appendChild(deleteSettingsColumn);

      var container = document.getElementById("tableSettings").getElementsByTagName("tbody")[0];

      container.appendChild(tr);
    });
  });
}

/**
* @return {string}
 *  Получение данных для таблицы список Active Activity Control.
 */
function createTableActiveActivityControl()
{
docRefPosition.collection("PositionSettings")
.get()
.then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    // items.push({...doc.data(),...{idPositionSettings: doc.id}});
  });

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    })
      .finally(() => {items;
      items.forEach(item => {
      var tr = document.createElement("tr");
      ///
      var translation_data_EN = arrLang['en'];
      var translation_data_RU = arrLang['ru'];
      ////
      var settingsActiveTitleColumn = document.createElement('td');
      settingsActiveTitleColumn.innerHTML = item.SettingsTitle;
      ///
      var settingsActiveControl = document.createElement('td');
      var ActiveControl = item.SettingsActiveControl;
      if(translation_JS == null || translation_JS == 'en'){
        if(ActiveControl == false){
          settingsActiveControl.innerHTML = "false";
        }else{
          settingsActiveControl.innerHTML = "true";
        }
      } else {
        if(ActiveControl == false){
          settingsActiveControl.innerHTML = "не используется";
        }else{
          settingsActiveControl.innerHTML = "используется";
        }
      }
      ///
      var settingsActiveInterval = document.createElement('td');
      var settingsActiveInterval_local = item.SettingsActiveIntervalMinutes;
      if(translation_JS == null || translation_JS == 'en'){
        settingsActiveInterval.innerHTML = settingsActiveInterval_local;
      } else {
        for (var key in translation_data_EN) {
          var meaning = translation_data_EN[key];
          if(meaning == settingsActiveInterval_local){
            settingsActiveInterval.innerHTML = translation_data_RU[key];
          }
        }
      }
      ///
      var settingsActiveDuration = document.createElement('td');
      settingsActiveDuration_local = item.SettingsActiveDurationSeconds;
      if(translation_JS == null || translation_JS == 'en'){
        settingsActiveDuration.innerHTML = settingsActiveDuration_local;
      } else {
        for (var key_1 in translation_data_EN) {
          var meaning_1 = translation_data_EN[key_1];
          if(meaning_1 == settingsActiveDuration_local){
            settingsActiveDuration.innerHTML = translation_data_RU[key_1];
          }
        }
      }
      ///
      var settingsActiveTransition = document.createElement('td');
      var ActiveTransition = item.SettingsActiveTransition;
      if(translation_JS == null || translation_JS == 'en'){
        if(ActiveTransition == "No button" || ActiveTransition == "" || ActiveTransition == "Без перехода"){
          settingsActiveTransition.innerHTML = "No button";
          settingsActiveTransition.value = "No button";
        }else{
          settingsActiveTransition.innerHTML = ActiveTransition;
        }
      } else {
        if(ActiveTransition == "No button" || ActiveTransition == "" || ActiveTransition == "Без перехода"){
          settingsActiveTransition.innerHTML = "Без перехода";
          settingsActiveTransition.value = "No button";
        }else{
          settingsActiveTransition.innerHTML = ActiveTransition;
        }
      }
      ///
      var settingsActiveSignal = document.createElement('td');
      var ActiveSignal = item.SettingsActiveSignal;
      if(translation_JS == null || translation_JS == 'en'){
        if(ActiveSignal == false){
          settingsActiveSignal.innerHTML = "false";
        }else{
          settingsActiveSignal.innerHTML = "true";
        }
      } else {
        if(ActiveSignal == false){
          settingsActiveSignal.innerHTML = "не используется";
        }else{
          settingsActiveSignal.innerHTML = "используется";
        }
      }
      ///
      tr.appendChild(settingsActiveTitleColumn);
      tr.appendChild(settingsActiveControl);
      tr.appendChild(settingsActiveInterval);
      tr.appendChild(settingsActiveDuration);
      tr.appendChild(settingsActiveTransition);
      tr.appendChild(settingsActiveSignal);

      var container = document.getElementById("tableActiveActivityControl").getElementsByTagName("tbody")[0];

      container.appendChild(tr);
    });
  });
}


/**
* @return {string}
 *  Получение данных для таблицы список Passive Activity Control.
 */
function createTablePassiveActivityControl()
{
docRefPosition.collection("PositionSettings")
.get()
.then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    // items.push({...doc.data(),...{idPositionSettings: doc.id}});
  });

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    })
      .finally(() => {items;
      items.forEach(item => {
      var tr = document.createElement("tr");
      //
      var translation_data_EN = arrLang['en'];
      var translation_data_RU = arrLang['ru'];
      ///
      var settingsPassiveTitleColumn = document.createElement('td');
      settingsPassiveTitleColumn.innerHTML = item.SettingsTitle;
      ///
      var settingsPassiveControl = document.createElement('td');
      var PassiveControl = item.SettingsPassiveControl;
      if(translation_JS == null || translation_JS == 'en'){
        if(PassiveControl == false){
          settingsPassiveControl.innerHTML = "false";
        }else{
          settingsPassiveControl.innerHTML = "true";
        }
      } else {
        if(PassiveControl == false){
          settingsPassiveControl.innerHTML = "не используется";
        }else{
          settingsPassiveControl.innerHTML = "используется";
        }
      }
      ///
      var settingsPassiveInterval = document.createElement('td');
      settingsPassiveInterval_local = item.SettingsPassiveIntervalMinutes
      if(translation_JS == null || translation_JS == 'en'){
        settingsPassiveInterval.innerHTML = settingsPassiveInterval_local;
      } else {
        // var translation_data_EN = arrLang['en'];
        // var translation_data_RU = arrLang['ru'];
        for (var key_1 in translation_data_EN) {
          var meaning_1 = translation_data_EN[key_1];
          if(meaning_1 == settingsPassiveInterval_local){
            settingsPassiveInterval.innerHTML = translation_data_RU[key_1];
          }
        }
      }
      ///
      var settingsPassiveDuration = document.createElement('td');
      settingsPassiveDuration_local = item.SettingsPassiveDurationSeconds;
      if(translation_JS == null || translation_JS == 'en'){
        settingsPassiveDuration.innerHTML = settingsPassiveDuration_local;
      } else {
        for (var key in translation_data_EN) {
          var meaning = translation_data_EN[key];
          if(meaning == settingsPassiveDuration_local){
            settingsPassiveDuration.innerHTML = translation_data_RU[key];
          }
        }
      }
      ///
      var settingsPassiveAudio = document.createElement('td');
      var PassiveAudio = item.SettingsPassiveAudio;
      if(translation_JS == null || translation_JS == 'en'){
        if(PassiveAudio == false){
          settingsPassiveAudio.innerHTML = "false";
        }else{
          settingsPassiveAudio.innerHTML = "true";
        }
      } else {
        if(PassiveAudio == false){
          settingsPassiveAudio.innerHTML = "не используется";
        }else{
          settingsPassiveAudio.innerHTML = "используется";
        }
      }
      ///
      var settingsPassivePhoto = document.createElement('td');
      var PassivePhoto = item.SettingsPassivePhoto;
      if(translation_JS == null || translation_JS == 'en'){
        if(PassivePhoto == false){
          settingsPassivePhoto.innerHTML = "false";
        }else{
          settingsPassivePhoto.innerHTML = "true";
        }
      } else {
        if(PassivePhoto == false){
          settingsPassivePhoto.innerHTML = "не используется";
        }else{
          settingsPassivePhoto.innerHTML = "используется";
        }
      }
      ///
      var settingsPassiveVideo = document.createElement('td');
      var PassiveVideo = item.SettingsPassiveVideo;
      if(translation_JS == null || translation_JS == 'en'){
        if(PassiveVideo == false){
          settingsPassiveVideo.innerHTML = "false";
        }else{
          settingsPassiveVideo.innerHTML = "true";
        }
      } else {
        if(PassiveVideo == false){
          settingsPassiveVideo.innerHTML = "не используется";
        }else{
          settingsPassiveVideo.innerHTML = "используется";
        }
      }
      ///
      var settingsPassiveGeolocation = document.createElement('td');
      var PassiveGeolocation = item.SettingsPassiveGeolocation;
      if(translation_JS == null || translation_JS == 'en'){
        if(PassiveGeolocation == false){
          settingsPassiveGeolocation.innerHTML = "false";
        }else{
          settingsPassiveGeolocation.innerHTML = "true";
        }
      } else {
        if(PassiveGeolocation == false){
          settingsPassiveGeolocation.innerHTML = "не используется";
        }else{
          settingsPassiveGeolocation.innerHTML = "используется";
        }
      }
      ///
      tr.appendChild(settingsPassiveTitleColumn);
      tr.appendChild(settingsPassiveControl);
      tr.appendChild(settingsPassiveInterval);
      tr.appendChild(settingsPassiveDuration);
      tr.appendChild(settingsPassiveAudio);
      tr.appendChild(settingsPassivePhoto);
      tr.appendChild(settingsPassiveVideo);
      tr.appendChild(settingsPassiveGeolocation);

      var container = document.getElementById("tablePassiveActivityControl").getElementsByTagName("tbody")[0];

      container.appendChild(tr);
    });
  });
}

/**
* @return {string}
 *  Получение данных для таблицы список Result Сapture.
 */
function createTableResultСapture()
{
docRefPosition.collection("PositionSettings")
.get()
.then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    // items.push({...doc.data(),...{idPositionSettings: doc.id}});
  });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    })
      .finally(() => {items;
      items.forEach(item => {
      var tr = document.createElement("tr");
      ///
      var settingsTitleColumn = document.createElement('td');
      settingsTitleColumn.innerHTML = item.SettingsTitle;
      ///
      var settingsCommitDescription = document.createElement('td');
      // settingsCommitDescription.innerHTML = item.SettingsCommitDescription;
      var CommitDescription = item.SettingsCommitDescription;
      if(translation_JS == null || translation_JS == 'en'){
        if(CommitDescription == false){
          settingsCommitDescription.innerHTML = "false";
        }else{
          settingsCommitDescription.innerHTML = "true";
        }
      } else {
        if(CommitDescription == false){
          settingsCommitDescription.innerHTML = "не используется";
        }else{
          settingsCommitDescription.innerHTML = "используется";
        }
      }
      ///
      var settingsResultCapture = document.createElement('td');
      // settingsResultCapture.innerHTML = item.SettingsResultCapture
      var ResultCapture = item.SettingsResultCapture;
      if(translation_JS == null || translation_JS == 'en'){
        if(ResultCapture == false){
          settingsResultCapture.innerHTML = "false";
        }else{
          settingsResultCapture.innerHTML = "true";
        }
      } else {
        if(ResultCapture == false){
          settingsResultCapture.innerHTML = "не используется";
        }else{
          settingsResultCapture.innerHTML = "используется";
        }
      }
      ///
      var settingsResultControlOption1 = document.createElement('td');
      settingsResultControlOption1.innerHTML = item.SettingsResultControlOption1;
      ///
      var settingsResultControlOption2 = document.createElement('td');
      settingsResultControlOption2.innerHTML = item.SettingsResultControlOption2;
      ///
      var settingsResultControlOption3 = document.createElement('td');
      settingsResultControlOption3.innerHTML = item.SettingsResultControlOption3;
      ////
      var settingsResultControlOption4 = document.createElement('td');
      settingsResultControlOption4.innerHTML = item.SettingsResultControlOption4;
      ////
      var settingsResultControlOption5 = document.createElement('td');
      settingsResultControlOption5.innerHTML = item.SettingsResultControlOption5;
      ///
      var settingsResultControlOption6 = document.createElement('td');
      settingsResultControlOption6.innerHTML = item.SettingsResultControlOption6;
      ///
      var settingsResultControlOption7 = document.createElement('td');
      settingsResultControlOption7.innerHTML = item.SettingsResultControlOption7;
      ////
      var settingsResultControlOption8 = document.createElement('td');
      settingsResultControlOption8.innerHTML = item.SettingsResultControlOption8;
      ///
      tr.appendChild(settingsTitleColumn);
      tr.appendChild(settingsCommitDescription);
      tr.appendChild(settingsResultCapture);
      tr.appendChild(settingsResultControlOption1);
      tr.appendChild(settingsResultControlOption2);
      tr.appendChild(settingsResultControlOption3);
      tr.appendChild(settingsResultControlOption4);
      tr.appendChild(settingsResultControlOption5);
      tr.appendChild(settingsResultControlOption6);
      tr.appendChild(settingsResultControlOption7);
      tr.appendChild(settingsResultControlOption8);
      ///
      var container = document.getElementById("tableResultСapture").getElementsByTagName("tbody")[0];
      container.appendChild(tr);
    });
  });
};

/**
* @return {string}
*  Обработка модального окна Регистрация Пользователя.
*/
function gridSystemModalNewUserSubmit()
{
  var email = document.getElementById("exampleInputModalUserTitle").value.toLowerCase();
  if (email.length < 1)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please enter an user name.');
    } else {
      alert ("Пожалуйста, введите имя пользователя.");
    }
   return;
  }
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if(reg.test(email) == false) {
     if(translation_JS == null || translation_JS == 'en'){
       alert('Enter the correct email!');
     } else {
       alert('Введите корректный email!');
     }
     return false;
  }
  var UserСomment = document.getElementById("exampleInputModalUserСomment").value;
  if (UserСomment.length < 1)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please enter an comments.');
    } else {
      alert ("Пожалуйста, введите комментарий.");
    }
   return;
  }
  var UserName = document.getElementById("exampleInputModalUserName").value;
  if (UserName.length < 1)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please enter an users name.');
    } else {
      alert ("Пожалуйста, введите ФИО.");
    }
   return;
  }
  docRefPosition.collection("PositionUser").add({
  UserEmail: email,
  UserСomment: UserСomment,
  UserName: UserName,
  idDocPosition: LocalStoragePosition,
  idDocSubdivision: LocalStorageSubdivision,
  idDocOrganization: LocalStorageOrganizationId,
  }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      db.collection("OrganizationTable").add({
        idDocOrganization: LocalStorageOrganizationId,
        nameOrganization:  nameOrganization,
        idDocPosition: LocalStoragePosition,
        namePosition: namePosition,
        idDocPositionUser: docRef.id,
        idDocSubdivision: LocalStorageSubdivision,
        nameSubdivision: nameSubdivision,
        UserEmail: email,
        UserСomment: UserСomment,
        UserName: UserName,
      }).then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      }).catch(function(error) {
          console.error("Error adding document: ", error);
          if(translation_JS == null || translation_JS == 'en'){
            alert("Error adding document: ", error);
          } else {
            alert("Ошибка при добавлении документа: ", error);
          }
      });
      $('#gridSystemModalNewUser').modal('toggle');
      window.location.reload();
  }).catch(function(error) {
      console.error("Error adding document: ", error);
      if(translation_JS == null || translation_JS == 'en'){
        alert("Error adding document: ", error);
      } else {
        alert("Ошибка при добавлении документа: ", error);
      }
  });
}

/**
* @return {string}
*  Обработка модального окна Регистрация Настроик Процессов.
*/
function gridSystemModalNewSettingsSubmit()
{
  var settingsTitle = document.getElementById("exampleInputModalNewSettingsTitle").value;
  var settingsСomment = document.getElementById("exampleInputModalNewSettingsСomment").value;
  docRefPosition.collection("PositionSettings").add({
  SettingsTitle: settingsTitle,
  SettingsСomment: settingsСomment,
  SettingsActiveControl: false,
  SettingsActiveIntervalMinutes:"0",
  SettingsActiveDurationSeconds:"0",
  SettingsActiveTransition: "No button",
  SettingsActiveSignal: false,
  SettingsPassiveControl: false,
  SettingsPassiveIntervalMinutes:"0",
  SettingsPassiveDurationSeconds:"0",
  SettingsPassiveAudio: false,
  SettingsPassivePhoto: false,
  SettingsPassivePhotoInterval:"0",
  SettingsPassivePhotoCaptureEventOnClick:false,
  SettingsPassivePhotoSmartphoneCamera: false,
  SettingsPassivePhotoCameraIP: false,
  SettingsPassiveVideo: false,
  SettingsPassiveGeolocation: false,
  SettingsPassiveGeolocationInterval:"0",
  SettingsPassiveGeolocationCaptureEventOnClick: false,
  SettingsCommitDescription: false,
  SettingsResultCapture: false,
  SettingsResultControlOption1: "",
  SettingsResultControlOption2: "",
  SettingsResultControlOption3: "",
  SettingsResultControlOption4: "",
  SettingsResultControlOption5: "",
  SettingsResultControlOption6: "",
  SettingsResultControlOption7: "",
  SettingsResultControlOption8: "",
  SettingsSalesFunnel_Availability_key: "str0",
  SettingsSalesFunnel_Stage_key: "str0",
  SettingsSalesFunnel_Result_key: "str0",
  }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      $('#gridSystemModalNewSettings').modal('toggle');
      window.location.reload();
  }).catch(function(error) {
      console.error("Error adding document: ", error);
      if(translation_JS == null || translation_JS == 'en'){
        alert("Error adding document: ", error);
      } else {
        alert("Ошибка при добавлении документа: ", error);
      }
  });
};

/**
* @return {string}
*  Обработчик кнопки toDismiss из таблицы Пользователи.
*/
function toDismissButtonUser(obj)
{
  var objId = obj.id;
  if(translation_JS == null || translation_JS == 'en'){
    alert('Document successfully deleted!'+ (objId));
  } else {
    alert('Документ успешно удален!'+ (objId));
  }
  docRefPosition.collection("PositionUser").doc(objId).delete().then(function()
  {
      console.log("Document successfully deleted!");
      window.location.reload();
  }).catch(function(error)
  {
      console.error("Error removing document: ", error);
  });
  db.collection("OrganizationTable").where("idDocPositionUser", "==", objId).where("UserEmail", "==", UserNamelocalStorage)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            db.collection("OrganizationTable").doc(doc.id).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

/**
* @return {string}
*  Обработчик кнопки deleteButtonSettings из таблицы Процессов.
*/
function deleteButtonSettings(obj)
{
  var objId = obj.id;
  if(translation_JS == null || translation_JS == 'en'){
    alert('Document successfully deleted!'+ (objId));
  } else {
    alert('Документ успешно удален!'+ (objId));
  }
  docRefPosition.collection("PositionSettings").doc(objId).delete().then(function()
  {
       console.log("Document successfully deleted!");
       window.location.reload();
  }).catch(function(error)
  {
       console.error("Error removing document: ", error);
  });
}

// /**
// * @return {string}
// *  Обработчик кнопки editButtonUser из таблицы Пользователи.
// */
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
 * @return {string}
  *  Обработчик кнопки editButtonSettings из таблицы Процессы.
  */
 function editButtonSettings(obj)
 {
   var settingsTitleOBJ = obj.SettingsTitle;

   var articleDiv = document.getElementById("exampleInputModalSettingsActiveTransition").innerHTML;
   if(translation_JS == null || translation_JS == 'en'){
     var articleDivOn = '<option>No button</option>';
   } else {
     var articleDivOn = '<option>Без перехода</option>';
   }
   document.body.innerHTML = document.body.innerHTML.replace(articleDiv, articleDivOn);

     docRefPosition.collection("PositionSettings").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          var settingsTitle = doc.data().SettingsTitle;
          if (settingsTitle != settingsTitleOBJ){
            var liLast = document.createElement('option');
            liLast.innerHTML = settingsTitle;
            exampleInputModalSettingsActiveTransition.prepend(liLast);
          }
      });
    });
   objIdDocSettings = obj.id;
   var washingtonRef = docRefPosition.collection("PositionSettings").doc(objIdDocSettings);
   washingtonRef.get().then(function(doc) {
     if (doc.exists)
   {
       var settingsTitle = doc.data().SettingsTitle;
       var settingsСomment = doc.data().SettingsСomment;
       var settingsActiveControl = doc.data().SettingsActiveControl;
       var settingsActiveIntervalMinutes = doc.data().SettingsActiveIntervalMinutes;
       var settingsActiveDurationSeconds = doc.data().SettingsActiveDurationSeconds;
       var settingsActiveTransition = doc.data().SettingsActiveTransition;
       var settingsActiveSignal = doc.data().SettingsActiveSignal;
       var settingsPassiveControl = doc.data().SettingsPassiveControl;
       var settingsPassiveIntervalMinutes = doc.data().SettingsPassiveIntervalMinutes;
       var settingsPassiveDurationSeconds = doc.data().SettingsPassiveDurationSeconds;
       var settingsPassiveAudio = doc.data().SettingsPassiveAudio;
       var settingsPassivePhoto = doc.data().SettingsPassivePhoto;
       var settingsPassivePhotoSmartphoneCamera = doc.data().SettingsPassivePhotoSmartphoneCamera;
       var settingsPassivePhotoCameraIP = doc.data().SettingsPassivePhotoCameraIP;
       var settingsPassivePhotoInterval = doc.data().SettingsPassivePhotoInterval;
       var settingsPassivePhotoCaptureEventOnClick = doc.data().SettingsPassivePhotoCaptureEventOnClick;
       var settingsPassiveVideo = doc.data().SettingsPassiveVideo;
       var settingsPassiveGeolocation = doc.data().SettingsPassiveGeolocation;
       var settingsPassiveGeolocationInterval = doc.data().SettingsPassiveGeolocationInterval;
       var settingsPassiveGeolocationCaptureEventOnClick = doc.data().SettingsPassiveGeolocationCaptureEventOnClick;
       var settingsCommitDescription = doc.data().SettingsCommitDescription;
       var settingsResultCapture = doc.data().SettingsResultCapture;
       var settingsResultControlOption1 = doc.data().SettingsResultControlOption1;
       var settingsResultControlOption2 = doc.data().SettingsResultControlOption2;
       var settingsResultControlOption3 = doc.data().SettingsResultControlOption3;
       var settingsResultControlOption4 = doc.data().SettingsResultControlOption4;
       var settingsResultControlOption5 = doc.data().SettingsResultControlOption5;
       var settingsResultControlOption6 = doc.data().SettingsResultControlOption6;
       var settingsResultControlOption7 = doc.data().SettingsResultControlOption7;
       var settingsResultControlOption8 = doc.data().SettingsResultControlOption8;
       document.getElementById('exampleInputModalSettingsTitle').value = settingsTitle;
       document.getElementById('exampleInputModalSettingsСomment').value = settingsСomment;
       document.getElementById('exampleInputModalSettingsActiveControl').checked  = settingsActiveControl;
       ////
       document.getElementById('exampleInputModalSettingsActiveInterval').value = settingsActiveIntervalMinutes;
       var a = document.getElementById('exampleInputModalSettingsActiveInterval').value;
       var l_l = document.getElementById('exampleInputModalSettingsActiveInterval').length;
       for (l = 0; l < l_l; l++){
          var cells = document.getElementById('exampleInputModalSettingsActiveInterval').options[l].value;
          document.getElementById('exampleInputModalSettingsActiveInterval').options[l].selected=false;
          if (a==cells){
          document.getElementById('exampleInputModalSettingsActiveInterval').options[l].selected=true;
          }
       };
       ////
       document.getElementById('exampleInputModalSettingsActiveDuration').value = settingsActiveDurationSeconds;
       var b = document.getElementById('exampleInputModalSettingsActiveDuration').value;
       var l_b = document.getElementById('exampleInputModalSettingsActiveDuration').length;
       for (v = 0; v < l_b; v++){
          var cells1 = document.getElementById('exampleInputModalSettingsActiveDuration').options[v].value;
          document.getElementById('exampleInputModalSettingsActiveDuration').options[v].selected=false;
          if (b==cells1){
          document.getElementById('exampleInputModalSettingsActiveDuration').options[v].selected=true;
          }
       };
       ///
       if(settingsActiveTransition == "No button" || settingsActiveTransition == ""){
         if(translation_JS == null || translation_JS == 'en'){
           document.getElementById('exampleInputModalSettingsActiveTransition').value = "No button";
           settingsActiveTransition = "No button";
         } else {
           document.getElementById('exampleInputModalSettingsActiveTransition').value = "Без перехода";
           settingsActiveTransition = "Без перехода";
         }
       }else{
         document.getElementById('exampleInputModalSettingsActiveTransition').value = settingsActiveTransition;
       };
       var d = settingsActiveTransition;
       var l_k = document.getElementById('exampleInputModalSettingsActiveTransition').length;
       for (k = 0; k < l_k; k++){
          var cells2 = document.getElementById('exampleInputModalSettingsActiveTransition').options[k].value;
          document.getElementById('exampleInputModalSettingsActiveTransition').options[k].selected=false;
          if (d==cells2){
          document.getElementById('exampleInputModalSettingsActiveTransition').options[k].selected=true;
          }
       };
       document.getElementById('exampleInputModalSettingsActiveSignal').checked = settingsActiveSignal;
       document.getElementById('exampleInputModalSettingsPassiveControl').checked  = settingsPassiveControl;
       /////
       document.getElementById('exampleInputModalSettingsPassiveInterval').value = settingsPassiveIntervalMinutes;
       var g = document.getElementById('exampleInputModalSettingsPassiveInterval').value;
       var l_g = document.getElementById('exampleInputModalSettingsPassiveInterval').length;
       for (m = 0; m < l_g; m++){
          var cells5 = document.getElementById('exampleInputModalSettingsPassiveInterval').options[m].value;
          document.getElementById('exampleInputModalSettingsPassiveInterval').options[m].selected=false;
          if (g==cells5){
          document.getElementById('exampleInputModalSettingsPassiveInterval').options[m].selected=true;
          }
       };
       /////
       document.getElementById('exampleInputModalSettingsPassiveDuration').value = settingsPassiveDurationSeconds;
       var s = document.getElementById('exampleInputModalSettingsPassiveDuration').value;
       var l_s = document.getElementById('exampleInputModalSettingsPassiveDuration').length;
       for (n = 0; n < l_s; n++){
          var cells3 = document.getElementById('exampleInputModalSettingsPassiveDuration').options[n].value;
          document.getElementById('exampleInputModalSettingsPassiveDuration').options[n].selected=false;
          if (s==cells3){
          document.getElementById('exampleInputModalSettingsPassiveDuration').options[n].selected=true;
          }
       };
       /////
       document.getElementById('exampleInputModalSettingsPassiveAudio').checked = settingsPassiveAudio;
       document.getElementById('exampleInputModalSettingsPassivePhoto').checked = settingsPassivePhoto;
       document.getElementById('exampleInputModalSettingsPassivePhotoSmartphoneCamera').checked = settingsPassivePhotoSmartphoneCamera;
       document.getElementById('exampleInputModalSettingsPassivePhotoExternalIPCamera').checked = settingsPassivePhotoCameraIP;
       /////
       document.getElementById('exampleInputModalSettingsPassiveIntervalFoto').value = settingsPassivePhotoInterval;
       var c = document.getElementById('exampleInputModalSettingsPassiveIntervalFoto').value;
       var l_c = document.getElementById('exampleInputModalSettingsPassiveIntervalFoto').length;
       for (j = 0; j < l_c; j++){
          var cells3 = document.getElementById('exampleInputModalSettingsPassiveIntervalFoto').options[j].value;
          document.getElementById('exampleInputModalSettingsPassiveIntervalFoto').options[j].selected=false;
          if (c==cells3){
          document.getElementById('exampleInputModalSettingsPassiveIntervalFoto').options[j].selected=true;
          }
       };
       ///
       document.getElementById('exampleInputModalSettingsPassivePhotoCaptureEventOnClick').checked = settingsPassivePhotoCaptureEventOnClick;
       document.getElementById('exampleInputModalSettingsPassiveVideo').checked = settingsPassiveVideo;
       document.getElementById('exampleInputModalSettingsPassiveGeolocation').checked = settingsPassiveGeolocation;
       /////
       document.getElementById('exampleInputModalSettingsPassiveIntervalGEO').value = settingsPassiveGeolocationInterval;
       var f = document.getElementById('exampleInputModalSettingsPassiveIntervalGEO').value;
       var l_f = document.getElementById('exampleInputModalSettingsPassiveIntervalGEO').length;
       for (h = 0; h < l_f; h++){
          var cells4 = document.getElementById('exampleInputModalSettingsPassiveIntervalGEO').options[h].value;
          document.getElementById('exampleInputModalSettingsPassiveIntervalGEO').options[h].selected=false;
          if (f==cells4){
          document.getElementById('exampleInputModalSettingsPassiveIntervalGEO').options[h].selected=true;
          }
       };
       /////
       document.getElementById('exampleInputModalSettingsPassiveGeolocationCaptureEventOnClick').checked = settingsPassiveGeolocationCaptureEventOnClick;
       document.getElementById('exampleInputModalSettingsCommitDescription').checked = settingsCommitDescription;
       document.getElementById('exampleInputModalSettingsResultControl').checked = settingsResultCapture;
       document.getElementById('exampleInputModalSettingsResultControlOption1').value = settingsResultControlOption1;
       document.getElementById('exampleInputModalSettingsResultControlOption2').value = settingsResultControlOption2;
       document.getElementById('exampleInputModalSettingsResultControlOption3').value = settingsResultControlOption3;
       document.getElementById('exampleInputModalSettingsResultControlOption4').value = settingsResultControlOption4;
       document.getElementById('exampleInputModalSettingsResultControlOption5').value = settingsResultControlOption5;
       document.getElementById('exampleInputModalSettingsResultControlOption6').value = settingsResultControlOption6;
       document.getElementById('exampleInputModalSettingsResultControlOption7').value = settingsResultControlOption7;
       document.getElementById('exampleInputModalSettingsResultControlOption8').value = settingsResultControlOption8;
       var modal = document.getElementById('gridSystemModalEditSettings');
       $(document).ready(function(){
         $("#gridSystemModalEditSettings").modal('show');
         // window.location.reload();
       });
       } else {
         console.log("No such document!");
       }
   }).catch(function(error) {
       console.log("Error getting document:", error);
   });
 }

 /**
 * @return {string}
  *  Обработчик кнопки Submit из модального окна gridSystemModalEditSettings.
  */
 function  gridSystemModalEditSettingsSubmit()
{
  var settingsTitle = document.getElementById('exampleInputModalSettingsTitle').value;
  var settingsСomment = document.getElementById('exampleInputModalSettingsСomment').value;
  var settingsActiveControl = document.getElementById('exampleInputModalSettingsActiveControl').checked;
  var settingsActiveIntervalMinutes = document.getElementById('exampleInputModalSettingsActiveInterval').value;
  var settingsActiveDurationSeconds = document.getElementById('exampleInputModalSettingsActiveDuration').value;
  var settingsActiveTransition_local = document.getElementById('exampleInputModalSettingsActiveTransition').value;
  if(settingsActiveTransition_local == "Без перехода"){
    var settingsActiveTransition = "No button";
  }else{
    var settingsActiveTransition = settingsActiveTransition_local;
  }
  var settingsActiveSignal = document.getElementById('exampleInputModalSettingsActiveSignal').checked;
  var settingsPassiveControl = document.getElementById('exampleInputModalSettingsPassiveControl').checked;
  var settingsPassiveIntervalMinutes = document.getElementById('exampleInputModalSettingsPassiveInterval').value;
  var settingsPassiveDurationSeconds = document.getElementById('exampleInputModalSettingsPassiveDuration').value;
  var settingsPassiveAudio = document.getElementById('exampleInputModalSettingsPassiveAudio').checked;
  var settingsPassivePhoto = document.getElementById('exampleInputModalSettingsPassivePhoto').checked;
  var settingsPassivePhotoSmartphoneCamera = document.getElementById('exampleInputModalSettingsPassivePhotoSmartphoneCamera').checked;
  var settingsPassivePhotoCameraIP = document.getElementById('exampleInputModalSettingsPassivePhotoExternalIPCamera').checked;
  var settingsPassivePhotoInterval = document.getElementById('exampleInputModalSettingsPassiveIntervalFoto').value;
  var settingsPassivePhotoCaptureEventOnClick = document.getElementById('exampleInputModalSettingsPassivePhotoCaptureEventOnClick').checked;
  var settingsPassiveVideo = document.getElementById('exampleInputModalSettingsPassiveVideo').checked;
  var settingsPassiveGeolocation = document.getElementById('exampleInputModalSettingsPassiveGeolocation').checked;
  var settingsPassiveGeolocationInterval = document.getElementById('exampleInputModalSettingsPassiveIntervalGEO').value;
  var settingsPassiveGeolocationCaptureEventOnClick = document.getElementById('exampleInputModalSettingsPassiveGeolocationCaptureEventOnClick').checked;
  var settingsCommitDescription = document.getElementById('exampleInputModalSettingsCommitDescription').checked;
  var settingsResultCapture = document.getElementById('exampleInputModalSettingsResultControl').checked;
  var settingsResultControlOption1 = document.getElementById('exampleInputModalSettingsResultControlOption1').value;
  var settingsResultControlOption2 = document.getElementById('exampleInputModalSettingsResultControlOption2').value;
  var settingsResultControlOption3 = document.getElementById('exampleInputModalSettingsResultControlOption3').value;
  var settingsResultControlOption4 = document.getElementById('exampleInputModalSettingsResultControlOption4').value;
  var settingsResultControlOption5 = document.getElementById('exampleInputModalSettingsResultControlOption5').value;
  var settingsResultControlOption6 = document.getElementById('exampleInputModalSettingsResultControlOption6').value;
  var settingsResultControlOption7 = document.getElementById('exampleInputModalSettingsResultControlOption7').value;
  var settingsResultControlOption8 = document.getElementById('exampleInputModalSettingsResultControlOption8').value;
  //
  var washingtonRef = docRefPosition.collection("PositionSettings").doc(objIdDocSettings);
  // Set the "capital" field of the city 'DC'
  return washingtonRef.update({
    SettingsTitle: settingsTitle,
    SettingsСomment: settingsСomment,
    SettingsActiveControl: settingsActiveControl,
    SettingsActiveIntervalMinutes: settingsActiveIntervalMinutes,
    SettingsActiveDurationSeconds: settingsActiveDurationSeconds,
    SettingsActiveTransition: settingsActiveTransition,
    SettingsActiveSignal: settingsActiveSignal,
    SettingsPassiveControl: settingsPassiveControl,
    SettingsPassiveIntervalMinutes: settingsPassiveIntervalMinutes,
    SettingsPassiveDurationSeconds: settingsPassiveDurationSeconds,
    SettingsPassiveAudio: settingsPassiveAudio,
    SettingsPassivePhoto: settingsPassivePhoto,
    SettingsPassivePhotoSmartphoneCamera: settingsPassivePhotoSmartphoneCamera,
    SettingsPassivePhotoCameraIP: settingsPassivePhotoCameraIP,
    SettingsPassivePhotoInterval: settingsPassivePhotoInterval,
    SettingsPassivePhotoCaptureEventOnClick: settingsPassivePhotoCaptureEventOnClick,
    SettingsPassiveVideo: settingsPassiveVideo,
    SettingsPassiveGeolocation: settingsPassiveGeolocation,
    SettingsPassiveGeolocationInterval: settingsPassiveGeolocationInterval,
    SettingsPassiveGeolocationCaptureEventOnClick: settingsPassiveGeolocationCaptureEventOnClick,
    SettingsCommitDescription: settingsCommitDescription,
    SettingsResultCapture: settingsResultCapture,
    SettingsResultControlOption1: settingsResultControlOption1,
    SettingsResultControlOption2: settingsResultControlOption2,
    SettingsResultControlOption3: settingsResultControlOption3,
    SettingsResultControlOption4: settingsResultControlOption4,
    SettingsResultControlOption5: settingsResultControlOption5,
    SettingsResultControlOption6: settingsResultControlOption6,
    SettingsResultControlOption7: settingsResultControlOption7,
    SettingsResultControlOption8: settingsResultControlOption8,
  })
  .then(() => {
      console.log("Document successfully updated!");
      $('#gridSystemModalEditSettings').modal('toggle');
      window.location.reload();
  })
  .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}

/**
* @return {string}
 *  Обработчик кнопки Submit из модального окна editGridSystemModalNewUser.
 */
// function  editGridSystemModalNewUserSubmit()
// {
//   var userTitle = document.getElementById("editExampleInputModalUserTitle").value;
//   var UserСomment = document.getElementById("editExampleInputModalUserСomment").value;
//   docRefPosition.collection("PositionUser").doc(objIdDocUser).set({
//       UserTitle: userTitle,
//       UserСomment: UserСomment,
//   })
//   .then(function() {
//       console.log("Document successfully written!");
//       $('#gridSystemModalNewOrganization').modal('toggle');
//       window.location.reload();
//   })
//   .catch(function(error) {
//       console.error("Error writing document: ", error);
//   });
// }
//
/**
* @return {string}
*  Обработка модального окна Список источников Трафика.
*/
function editGridSystemModalNewPositionTrafficSubmit()
{
  var editGridSystemModalNewPositionTraffic1 = document.getElementById("editGridSystemModalNewPositionTraffic1").value;
  var editGridSystemModalNewPositionTraffic2 = document.getElementById("editGridSystemModalNewPositionTraffic2").value;
  var editGridSystemModalNewPositionTraffic3 = document.getElementById("editGridSystemModalNewPositionTraffic3").value;
  var editGridSystemModalNewPositionTraffic4 = document.getElementById("editGridSystemModalNewPositionTraffic4").value;
  var editGridSystemModalNewPositionTraffic5 = document.getElementById("editGridSystemModalNewPositionTraffic5").value;
  var editGridSystemModalNewPositionTraffic6 = document.getElementById("editGridSystemModalNewPositionTraffic6").value;
  var editGridSystemModalNewPositionTraffic7 = document.getElementById("editGridSystemModalNewPositionTraffic7").value;
  var editGridSystemModalNewPositionTraffic8 = document.getElementById("editGridSystemModalNewPositionTraffic8").value;
  var editGridSystemModalNewPositionTraffic9 = document.getElementById("editGridSystemModalNewPositionTraffic9").value;
  var editGridSystemModalNewPositionTraffic10 = document.getElementById("editGridSystemModalNewPositionTraffic10").value;
  docRefPosition.collection("PositionSettingsNoteTrafic").add({
  SettingsNoteTrafficOption1: editGridSystemModalNewPositionTraffic1,
  SettingsNoteTrafficOption2: editGridSystemModalNewPositionTraffic2,
  SettingsNoteTrafficOption3: editGridSystemModalNewPositionTraffic3,
  SettingsNoteTrafficOption4: editGridSystemModalNewPositionTraffic4,
  SettingsNoteTrafficOption5: editGridSystemModalNewPositionTraffic5,
  SettingsNoteTrafficOption6: editGridSystemModalNewPositionTraffic6,
  SettingsNoteTrafficOption7: editGridSystemModalNewPositionTraffic7,
  SettingsNoteTrafficOption8: editGridSystemModalNewPositionTraffic8,
  SettingsNoteTrafficOption9: editGridSystemModalNewPositionTraffic9,
  SettingsNoteTrafficOption10: editGridSystemModalNewPositionTraffic10,

  }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      $('#editGridSystemModalNewPositionTraffic').modal('toggle');
      window.location.reload();
  }).catch(function(error) {
      console.error("Error adding document: ", error);
      if(translation_JS == null || translation_JS == 'en'){
        alert("Error adding document: ", error);
      } else {
        alert("Ошибка при добавлении документа: ", error);
      }
  });
};

/**
* @return {string}
*  Обработка модального окна Список Заметок.
*/
function editGridSystemModalNewUserNoteSubmit()
{
  var editExampleInputModalUserNote1 = document.getElementById("editExampleInputModalUserNote1").value;
  var editExampleInputModalUserNote2 = document.getElementById("editExampleInputModalUserNote2").value;
  var editExampleInputModalUserNote3 = document.getElementById("editExampleInputModalUserNote3").value;
  var editExampleInputModalUserNote4 = document.getElementById("editExampleInputModalUserNote4").value;
  var editExampleInputModalUserNote5 = document.getElementById("editExampleInputModalUserNote5").value;
  var editExampleInputModalUserNote6 = document.getElementById("editExampleInputModalUserNote6").value;
  var editExampleInputModalUserNote7 = document.getElementById("editExampleInputModalUserNote7").value;
  var editExampleInputModalUserNote8 = document.getElementById("editExampleInputModalUserNote8").value;
  var editExampleInputModalUserNote9 = document.getElementById("editExampleInputModalUserNote9").value;
  var editExampleInputModalUserNote10 = document.getElementById("editExampleInputModalUserNote10").value;
  docRefPosition.collection("PositionSettingsNoteList").add({
  SettingsNoteListOption1: editExampleInputModalUserNote1,
  SettingsNoteListOption2: editExampleInputModalUserNote2,
  SettingsNoteListOption3: editExampleInputModalUserNote3,
  SettingsNoteListOption4: editExampleInputModalUserNote4,
  SettingsNoteListOption5: editExampleInputModalUserNote5,
  SettingsNoteListOption6: editExampleInputModalUserNote6,
  SettingsNoteListOption7: editExampleInputModalUserNote7,
  SettingsNoteListOption8: editExampleInputModalUserNote8,
  SettingsNoteListOption9: editExampleInputModalUserNote9,
  SettingsNoteListOption10: editExampleInputModalUserNote10,

  }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      $('#editGridSystemModalNewPositionNote').modal('toggle');
      window.location.reload();
  }).catch(function(error) {
      console.error("Error adding document: ", error);
      if(translation_JS == null || translation_JS == 'en'){
        alert("Error adding document: ", error);
      } else {
        alert("Ошибка при добавлении документа: ", error);
      }
  });
};


 /**
 * @return {string}
  *  Получение данных для таблицы список источников Трафика .
  */
function createATableOfPositionTraffic()
{
 let itemPositionTraffic = [];
 docRefPosition.collection("PositionSettingsNoteTrafic")
 .get()
 .then(function(querySnapshot) {
   querySnapshot.forEach(function(doc) {
     itemPositionTraffic.push({...doc.data(),...{idPositionSettingsTrafic: doc.id}})
   });

     })
     .catch(function(error) {
         console.log("Error getting documents: ", error);
     })
       .finally(() => {itemPositionTraffic;
       itemPositionTraffic.forEach(item => {
       var tr = document.createElement("tr");

       var settingsNoteTrafficOption1 = document.createElement('td');
       settingsNoteTrafficOption1.innerHTML = item.SettingsNoteTrafficOption1;

       var settingsNoteTrafficOption2 = document.createElement('td');
       settingsNoteTrafficOption2.innerHTML = item.SettingsNoteTrafficOption2;

       var settingsNoteTrafficOption3 = document.createElement('td');
       settingsNoteTrafficOption3.innerHTML = item.SettingsNoteTrafficOption3;

       var settingsNoteTrafficOption4 = document.createElement('td');
       settingsNoteTrafficOption4.innerHTML = item.SettingsNoteTrafficOption4;

       var settingsNoteTrafficOption5 = document.createElement('td');
       settingsNoteTrafficOption5.innerHTML = item.SettingsNoteTrafficOption5;

       var settingsNoteTrafficOption6 = document.createElement('td');
       settingsNoteTrafficOption6.innerHTML = item.SettingsNoteTrafficOption6;

       var settingsNoteTrafficOption7 = document.createElement('td');
       settingsNoteTrafficOption7.innerHTML = item.SettingsNoteTrafficOption7;

       var settingsNoteTrafficOption8 = document.createElement('td');
       settingsNoteTrafficOption8.innerHTML = item.SettingsNoteTrafficOption8;

       var settingsNoteTrafficOption9 = document.createElement('td');
       settingsNoteTrafficOption9.innerHTML = item.SettingsNoteTrafficOption9;

       var settingsNoteTrafficOption10 = document.createElement('td');
       settingsNoteTrafficOption10.innerHTML = item.SettingsNoteTrafficOption10;

       var editUserName = document.createElement('button');
       if(translation_JS == null || translation_JS == 'en'){
         editUserName.innerHTML = "Edit";
       } else {
         editUserName.innerHTML = "Редактировать";
       }
       editUserName.className = 'badge badge-gradient-success';
       editUserName.id = item.idPositionSettingsTrafic;
       editUserName.setAttribute('onclick', 'editButtonNoteTraffic(this)');

       var editUserNameColumn = document.createElement('td');
       editUserNameColumn.appendChild(editUserName);

       var toDismissName = document.createElement('button');
       if(translation_JS == null || translation_JS == 'en'){
         toDismissName.innerHTML = "To dismiss";
       } else {
         toDismissName.innerHTML = "Удалить";
       }
       toDismissName.className = 'badge badge-gradient-danger';
       toDismissName.id = item.idPositionSettingsTrafic;
       toDismissName.setAttribute('onclick', 'toDismissButtonNoteTraffic(this)');

       var toDismissColumn = document.createElement('td');
       toDismissColumn.appendChild(toDismissName);

       tr.appendChild(settingsNoteTrafficOption1);
       tr.appendChild(settingsNoteTrafficOption2);
       tr.appendChild(settingsNoteTrafficOption3);
       tr.appendChild(settingsNoteTrafficOption4);
       tr.appendChild(settingsNoteTrafficOption5);
       tr.appendChild(settingsNoteTrafficOption6);
       tr.appendChild(settingsNoteTrafficOption7);
       tr.appendChild(settingsNoteTrafficOption8);
       tr.appendChild(settingsNoteTrafficOption9);
       tr.appendChild(settingsNoteTrafficOption10);

       tr.appendChild(editUserNameColumn);
       tr.appendChild(toDismissColumn);

       var container = document.getElementById("tablePositionTraffic").getElementsByTagName("tbody")[0];
       container.appendChild(tr);
     });
     if(itemPositionTraffic.length === 0)
       {
         my_div_UserPositionTraffic = document.getElementById("headerTablePositionTraffic");
         const ul_UserPositionTraffic = my_div_UserPositionTraffic.querySelector("h4");
         if(translation_JS == null || translation_JS == 'en'){
           var li = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#editGridSystemModalNewPositionTraffic"> + Add a list of traffic positions </button>';
         } else {
           var li = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#editGridSystemModalNewPositionTraffic"> + Добавить список позиций трафика </button>';
         }
         ul_UserPositionTraffic.insertAdjacentHTML("afterend", li);
       }
   });
};
 /**
 * @return {string}
  *  Получение данных для таблицы список Заметок .
  */
function createATableOfPositionNote()
{
 let itemPositionNote = [];
 docRefPosition.collection("PositionSettingsNoteList")
 .get()
 .then(function(querySnapshot) {
   querySnapshot.forEach(function(doc) {
     itemPositionNote.push({...doc.data(),...{idPositionNoteList: doc.id}});
   });

     })
     .catch(function(error) {
         console.log("Error getting documents: ", error);
     })
       .finally(() => {itemPositionNote;
       itemPositionNote.forEach(item => {
       var tr = document.createElement("tr");

       var settingsNoteListOption1 = document.createElement('td');
       settingsNoteListOption1.innerHTML = item.SettingsNoteListOption1;

       var settingsNoteListOption2 = document.createElement('td');
       settingsNoteListOption2.innerHTML = item.SettingsNoteListOption2;

       var settingsNoteListOption3 = document.createElement('td');
       settingsNoteListOption3.innerHTML = item.SettingsNoteListOption3;

       var settingsNoteListOption4 = document.createElement('td');
       settingsNoteListOption4.innerHTML = item.SettingsNoteListOption4;

       var settingsNoteListOption5 = document.createElement('td');
       settingsNoteListOption5.innerHTML = item.SettingsNoteListOption5;

       var settingsNoteListOption6 = document.createElement('td');
       settingsNoteListOption6.innerHTML = item.SettingsNoteListOption6;

       var settingsNoteListOption7 = document.createElement('td');
       settingsNoteListOption7.innerHTML = item.SettingsNoteListOption7;

       var settingsNoteListOption8 = document.createElement('td');
       settingsNoteListOption8.innerHTML = item.SettingsNoteListOption8;

       var settingsNoteListOption9 = document.createElement('td');
       settingsNoteListOption9.innerHTML = item.SettingsNoteListOption9;

       var settingsNoteListOption10 = document.createElement('td');
       settingsNoteListOption10.innerHTML = item.SettingsNoteListOption10;

       var editUserName = document.createElement('button');
       if(translation_JS == null || translation_JS == 'en'){
         editUserName.innerHTML = "Edit";
       } else {
         editUserName.innerHTML = "Редактировать";
       }
       editUserName.className = 'badge badge-gradient-success';
       editUserName.id = item.idPositionNoteList;
       editUserName.setAttribute('onclick', 'editButtonNoteListr(this)');

       var editUserNameColumn = document.createElement('td');
       editUserNameColumn.appendChild(editUserName);

       var toDismissName = document.createElement('button');
       if(translation_JS == null || translation_JS == 'en'){
         toDismissName.innerHTML = "To dismiss";
       } else {
         toDismissName.innerHTML = "Удалить";
       }
       toDismissName.className = 'badge badge-gradient-danger';
       toDismissName.id = item.idPositionNoteList;
       toDismissName.setAttribute('onclick', 'toDismissButtonNoteList(this)');

       var toDismissColumn = document.createElement('td');
       toDismissColumn.appendChild(toDismissName);

       tr.appendChild(settingsNoteListOption1);
       tr.appendChild(settingsNoteListOption2);
       tr.appendChild(settingsNoteListOption3);
       tr.appendChild(settingsNoteListOption4);
       tr.appendChild(settingsNoteListOption5);
       tr.appendChild(settingsNoteListOption6);
       tr.appendChild(settingsNoteListOption7);
       tr.appendChild(settingsNoteListOption8);
       tr.appendChild(settingsNoteListOption9);
       tr.appendChild(settingsNoteListOption10);

       tr.appendChild(editUserNameColumn);
       tr.appendChild(toDismissColumn);

       var container = document.getElementById("tablePositionNote").getElementsByTagName("tbody")[0];
       container.appendChild(tr);
     });
       if(itemPositionNote.length === 0)
         {
           my_div_User = document.getElementById("headerTablePositionNote");
           const ul_User = my_div_User.querySelector("h4");
           if(translation_JS == null || translation_JS == 'en'){
             var li = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#editGridSystemModalNewPositionNote"> + Add a list of note positions </button>';
           } else {
             var li = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#editGridSystemModalNewPositionNote"> + Добавьте список позиций заметок </button>';
           }
           ul_User.insertAdjacentHTML("afterend", li);
         }
   });
};

/**
* @return {string}
*  Обработчик кнопки editButtonNoteListr из таблицы Пользователи.
*/
function editButtonNoteListr(obj)
{
  objActiveModal = obj.id;
  var washingtonRef = docRefPosition.collection("PositionSettingsNoteList").doc(objActiveModal);
  washingtonRef.get().then(function(doc) {
    if (doc.exists)
  {
      var updateExampleInputModalUserNote1 = doc.data().SettingsNoteListOption1;
      var updateExampleInputModalUserNote2 = doc.data().SettingsNoteListOption2;
      var updateExampleInputModalUserNote3 = doc.data().SettingsNoteListOption3;
      var updateExampleInputModalUserNote4 = doc.data().SettingsNoteListOption4;
      var updateExampleInputModalUserNote5 = doc.data().SettingsNoteListOption5;
      var updateExampleInputModalUserNote6 = doc.data().SettingsNoteListOption6;
      var updateExampleInputModalUserNote7 = doc.data().SettingsNoteListOption7;
      var updateExampleInputModalUserNote8 = doc.data().SettingsNoteListOption8;
      var updateExampleInputModalUserNote9 = doc.data().SettingsNoteListOption9;
      var updateExampleInputModalUserNote10 = doc.data().SettingsNoteListOption10;
      document.getElementById('updateExampleInputModalUserNote1').value = updateExampleInputModalUserNote1;
      document.getElementById('updateExampleInputModalUserNote2').value = updateExampleInputModalUserNote2;
      document.getElementById('updateExampleInputModalUserNote3').value = updateExampleInputModalUserNote3;
      document.getElementById('updateExampleInputModalUserNote4').value = updateExampleInputModalUserNote4;
      document.getElementById('updateExampleInputModalUserNote5').value = updateExampleInputModalUserNote5;
      document.getElementById('updateExampleInputModalUserNote6').value = updateExampleInputModalUserNote6;
      document.getElementById('updateExampleInputModalUserNote7').value = updateExampleInputModalUserNote7;
      document.getElementById('updateExampleInputModalUserNote8').value = updateExampleInputModalUserNote8;
      document.getElementById('updateExampleInputModalUserNote9').value = updateExampleInputModalUserNote9;
      document.getElementById('updateExampleInputModalUserNote10').value = updateExampleInputModalUserNote10;
      var modal = document.getElementById('updateGridSystemModalNewPositionNote');
      $(document).ready(function(){
        $("#updateGridSystemModalNewPositionNote").modal('show');
      //  window.location.reload();
      });
      } else {
        console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}

/**
* @return {string}
*  Обработчик кнопки editButtonNoteTraffic из таблицы Трафик.
*/
function editButtonNoteTraffic(obj)
{
  objActiveModal = obj.id;
  var washingtonRef = docRefPosition.collection("PositionSettingsNoteTrafic").doc(objActiveModal);
  washingtonRef.get().then(function(doc) {
    if (doc.exists)
  {
    var updateGridSystemModalNewPositionTraffic1 = doc.data().SettingsNoteTrafficOption1;
    var updateGridSystemModalNewPositionTraffic2 = doc.data().SettingsNoteTrafficOption2;
    var updateGridSystemModalNewPositionTraffic3 = doc.data().SettingsNoteTrafficOption3;
    var updateGridSystemModalNewPositionTraffic4 = doc.data().SettingsNoteTrafficOption4;
    var updateGridSystemModalNewPositionTraffic5 = doc.data().SettingsNoteTrafficOption5;
    var updateGridSystemModalNewPositionTraffic6 = doc.data().SettingsNoteTrafficOption6;
    var updateGridSystemModalNewPositionTraffic7 = doc.data().SettingsNoteTrafficOption7;
    var updateGridSystemModalNewPositionTraffic8 = doc.data().SettingsNoteTrafficOption8;
    var updateGridSystemModalNewPositionTraffic9 = doc.data().SettingsNoteTrafficOption9;
    var updateGridSystemModalNewPositionTraffic10 = doc.data().SettingsNoteTrafficOption10;
    document.getElementById('updateGridSystemModalNewPositionTraffic1').value = updateGridSystemModalNewPositionTraffic1;
    document.getElementById('updateGridSystemModalNewPositionTraffic2').value = updateGridSystemModalNewPositionTraffic2;
    document.getElementById('updateGridSystemModalNewPositionTraffic3').value = updateGridSystemModalNewPositionTraffic3;
    document.getElementById('updateGridSystemModalNewPositionTraffic4').value = updateGridSystemModalNewPositionTraffic4;
    document.getElementById('updateGridSystemModalNewPositionTraffic5').value = updateGridSystemModalNewPositionTraffic5;
    document.getElementById('updateGridSystemModalNewPositionTraffic6').value = updateGridSystemModalNewPositionTraffic6;
    document.getElementById('updateGridSystemModalNewPositionTraffic7').value = updateGridSystemModalNewPositionTraffic7;
    document.getElementById('updateGridSystemModalNewPositionTraffic8').value = updateGridSystemModalNewPositionTraffic8;
    document.getElementById('updateGridSystemModalNewPositionTraffic9').value = updateGridSystemModalNewPositionTraffic9;
    document.getElementById('updateGridSystemModalNewPositionTraffic10').value = updateGridSystemModalNewPositionTraffic10;
      var modal = document.getElementById('updateGridSystemModalNewPositionTraffic');
      $(document).ready(function(){
        $("#updateGridSystemModalNewPositionTraffic").modal('show');
      //  window.location.reload();
      });
      } else {
        console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}


/**
* @return {string}
*  Обработчик кнопки toDismiss из таблицы заметки.
*/
function toDismissButtonNoteList(obj)
{
  var objId = obj.id;
  if(translation_JS == null || translation_JS == 'en'){
    alert('Document successfully deleted!'+ (objId));
  } else {
    alert('Документ успешно удален!'+ (objId));
  }
  docRefPosition.collection("PositionSettingsNoteList").doc(objId).delete().then(function()
  {
      console.log("Document successfully deleted!");
      window.location.reload();
  }).catch(function(error)
  {
      console.error("Error removing document: ", error);
  });
}

/**
* @return {string}
*  Обработчик кнопки toDismiss из таблицы Трафик.
*/
function toDismissButtonNoteTraffic(obj)
{
  var objId = obj.id;
  if(translation_JS == null || translation_JS == 'en'){
    alert('Document successfully deleted!'+ (objId));
  } else {
    alert('Документ успешно удален!'+ (objId));
  }
  docRefPosition.collection("PositionSettingsNoteTrafic").doc(objId).delete().then(function()
  {
      console.log("Document successfully deleted!");
      window.location.reload();
  }).catch(function(error)
  {
      console.error("Error removing document: ", error);
  });
}

/**
* @return {string}
*  Обработчик кнопки сохранить изменение из таблицы Трафик.
*/
function updateGridSystemModalNewPositionTrafficSubmit()
{
  var updateGridSystemModalNewPositionTraffic1 = document.getElementById("updateGridSystemModalNewPositionTraffic1").value;
  var updateGridSystemModalNewPositionTraffic2 = document.getElementById("updateGridSystemModalNewPositionTraffic2").value;
  var updateGridSystemModalNewPositionTraffic3 = document.getElementById("updateGridSystemModalNewPositionTraffic3").value;
  var updateGridSystemModalNewPositionTraffic4 = document.getElementById("updateGridSystemModalNewPositionTraffic4").value;
  var updateGridSystemModalNewPositionTraffic5 = document.getElementById("updateGridSystemModalNewPositionTraffic5").value;
  var updateGridSystemModalNewPositionTraffic6 = document.getElementById("updateGridSystemModalNewPositionTraffic6").value;
  var updateGridSystemModalNewPositionTraffic7 = document.getElementById("updateGridSystemModalNewPositionTraffic7").value;
  var updateGridSystemModalNewPositionTraffic8 = document.getElementById("updateGridSystemModalNewPositionTraffic8").value;
  var updateGridSystemModalNewPositionTraffic9 = document.getElementById("updateGridSystemModalNewPositionTraffic9").value;
  var updateGridSystemModalNewPositionTraffic10 = document.getElementById("updateGridSystemModalNewPositionTraffic10").value;
  var washingtonRef = docRefPosition.collection("PositionSettingsNoteTrafic").doc(objActiveModal);
        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
          SettingsNoteTrafficOption1: updateGridSystemModalNewPositionTraffic1,
          SettingsNoteTrafficOption2: updateGridSystemModalNewPositionTraffic2,
          SettingsNoteTrafficOption3: updateGridSystemModalNewPositionTraffic3,
          SettingsNoteTrafficOption4: updateGridSystemModalNewPositionTraffic4,
          SettingsNoteTrafficOption5: updateGridSystemModalNewPositionTraffic5,
          SettingsNoteTrafficOption6: updateGridSystemModalNewPositionTraffic6,
          SettingsNoteTrafficOption7: updateGridSystemModalNewPositionTraffic7,
          SettingsNoteTrafficOption8: updateGridSystemModalNewPositionTraffic8,
          SettingsNoteTrafficOption9: updateGridSystemModalNewPositionTraffic9,
          SettingsNoteTrafficOption10: updateGridSystemModalNewPositionTraffic10,
        })
        .then(function() {
            console.log("Document successfully updated!");
            window.location.reload();

        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
   objActiveModal = "";
}

/**
* @return {string}
*  Обработчик кнопки сохранить изменение из таблицы заметки.
*/
function updateGridSystemModalNewUserNoteSubmit()
{
  var updateExampleInputModalUserNote1 = document.getElementById("updateExampleInputModalUserNote1").value;
  var updateExampleInputModalUserNote2 = document.getElementById("updateExampleInputModalUserNote2").value;
  var updateExampleInputModalUserNote3 = document.getElementById("updateExampleInputModalUserNote3").value;
  var updateExampleInputModalUserNote4 = document.getElementById("updateExampleInputModalUserNote4").value;
  var updateExampleInputModalUserNote5 = document.getElementById("updateExampleInputModalUserNote5").value;
  var updateExampleInputModalUserNote6 = document.getElementById("updateExampleInputModalUserNote6").value;
  var updateExampleInputModalUserNote7 = document.getElementById("updateExampleInputModalUserNote7").value;
  var updateExampleInputModalUserNote8 = document.getElementById("updateExampleInputModalUserNote8").value;
  var updateExampleInputModalUserNote9 = document.getElementById("updateExampleInputModalUserNote9").value;
  var updateExampleInputModalUserNote10 = document.getElementById("updateExampleInputModalUserNote10").value;
  var washingtonRef = docRefPosition.collection("PositionSettingsNoteList").doc(objActiveModal);
        // Set the "capital" field of the city 'DC'
        return washingtonRef.update({
          SettingsNoteListOption1: updateExampleInputModalUserNote1,
          SettingsNoteListOption2: updateExampleInputModalUserNote2,
          SettingsNoteListOption3: updateExampleInputModalUserNote3,
          SettingsNoteListOption4: updateExampleInputModalUserNote4,
          SettingsNoteListOption5: updateExampleInputModalUserNote5,
          SettingsNoteListOption6: updateExampleInputModalUserNote6,
          SettingsNoteListOption7: updateExampleInputModalUserNote7,
          SettingsNoteListOption8: updateExampleInputModalUserNote8,
          SettingsNoteListOption9: updateExampleInputModalUserNote9,
          SettingsNoteListOption10: updateExampleInputModalUserNote10,
        })
        .then(function() {
            console.log("Document successfully updated!");
            window.location.reload();

        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
   objActiveModal = "";
}

/**
* @return {string}
*  заполняем таблицу список настроек tableAvalablePositionsListSettings
*/
function createSaveSettingsShiftPosition()
{
//заполняем таблицу список настроек tableAvalablePositionsListSettings
itemsPositionSalesFunnel = [];
////добавляем настройки базовых кнопок
itemsPositionSalesFunnel.push({...{SettingsTitle: "Expect"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability_key: "str0"},...{SettingsSalesFunnel_Stage_key: "str0"},...{SettingsSalesFunnel_Result_key: "str0"}});
itemsPositionSalesFunnel.push({...{SettingsTitle: "Other"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability_key: "str0"},...{SettingsSalesFunnel_Stage_key: "str1"},...{SettingsSalesFunnel_Result_key: "str0"}});
itemsPositionSalesFunnel.push({...{SettingsTitle: "Gone"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability_key: "str0"},...{SettingsSalesFunnel_Stage_key: "str0"},...{SettingsSalesFunnel_Result_key: "str0"}});

docRefPosition.collection("PositionSettings")
.get()
.then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    itemsPositionSalesFunnel.push({...doc.data(),...{idPositionSettings: doc.id}});
  });

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    })
      .finally(() => {itemsPositionSalesFunnel;
      itemsPositionSalesFunnel.forEach(item => {
      var tr = document.createElement("tr");

      var settingsTitleColumn = document.createElement('td');
      // settingsTitleColumn.innerHTML = item.SettingsTitle;
      var TitleColumn = item.SettingsTitle;
      if(TitleColumn == "Expect" || TitleColumn == "Other" || TitleColumn == "Gone"){
        if(translation_JS == null || translation_JS == 'en'){
          settingsTitleColumn.innerHTML = item.SettingsTitle;
        } else {
          if(TitleColumn == "Expect"){
            settingsTitleColumn.innerHTML = "Ожидаю";
          }
          if(TitleColumn == "Other"){
            settingsTitleColumn.innerHTML = "Другое";
          }
          if(TitleColumn == "Gone"){
            settingsTitleColumn.innerHTML = "Отлучился";
          }
        }
      }else{
        settingsTitleColumn.innerHTML = item.SettingsTitle;
      }
      ///
      var settingsСommentColumn = document.createElement('td');
      // settingsСommentColumn.innerHTML = item.SettingsСomment;
      var SettingsСomment = item.SettingsСomment;
      if(SettingsСomment == "base button"){
        if(translation_JS == null || translation_JS == 'en'){
          settingsСommentColumn.innerHTML = item.SettingsСomment;
        } else {
          settingsСommentColumn.innerHTML = "базовая кнопка";
        }
      }else{
        settingsСommentColumn.innerHTML = item.SettingsСomment;
      }
      ///
      if(TitleColumn == "Expect" || TitleColumn == "Other" || TitleColumn == "Gone"){
        var editSettingsColumn = document.createElement('td');
        if(translation_JS == null || translation_JS == 'en'){
          editSettingsColumn.innerHTML = "does not participate";
        } else {
          editSettingsColumn.innerHTML = "не участвует";
        }
      }else{
        var editSettings = document.createElement('select');
        if(translation_JS == null || translation_JS == 'en'){
          editSettings.options[0] = new Option("does not participate", "str0");
          editSettings.options[1] = new Option("Stage 1 of the sales funnel", "str1");
          editSettings.options[2] = new Option("Stage 2 of the sales funnel", "str2");
          editSettings.options[3] = new Option("Stage 3 of the sales funnel", "str3");
          editSettings.options[4] = new Option("Stage 4 of the sales funnel", "str4");
          editSettings.options[5] = new Option("Stage 5 of the sales funnel", "str5");
        } else {
          editSettings.options[0] = new Option("не участвует", "str0");
          editSettings.options[1] = new Option("этап 1 воронки продаж", "str1");
          editSettings.options[2] = new Option("этап 2 воронки продаж", "str2");
          editSettings.options[3] = new Option("этап 3 воронки продаж", "str3");
          editSettings.options[4] = new Option("этап 4 воронки продаж", "str4");
          editSettings.options[5] = new Option("этап 5 воронки продаж", "str5");
        }
        editSettings.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
        var x = item.SettingsSalesFunnel_Availability_key;
        for (i = 0; i < 6; i++){
           var cells = editSettings.options[i].value;
           editSettings.options[i].selected=false;
           if (x==cells){
           editSettings.options[i].selected=true;
           }
        }
        editSettings.addEventListener("click", function(e) {console.log("checkbox");  });
        var editSettingsColumn = document.createElement('td');
        editSettingsColumn.appendChild(editSettings);
      }
      ///
      if(TitleColumn == "Expect" || TitleColumn == "Gone"){
        var deleteSettingsColumn = document.createElement('td');
        if(translation_JS == null || translation_JS == 'en'){
          deleteSettingsColumn.innerHTML = "red - simple employee";
        } else {
          deleteSettingsColumn.innerHTML = "красный - простой сотрудника";
        }
      }else if (TitleColumn == "Other") {
        var deleteSettingsColumn = document.createElement('td');
        if(translation_JS == null || translation_JS == 'en'){
          deleteSettingsColumn.innerHTML = "orange - other activities";
        } else {
          deleteSettingsColumn.innerHTML = "оранжевый - прочая деятельность";
        }
      }else{
        var deleteSettings = document.createElement('select');
        if(translation_JS == null || translation_JS == 'en'){
          deleteSettings.options[0] = new Option("red - simple employee", "str0");
          deleteSettings.options[1] = new Option("orange - other activities", "str1");
          deleteSettings.options[2] = new Option("yellow - auxiliary duties", "str2");
          deleteSettings.options[3] = new Option("green - job responsibilities", "str3");
        } else {
          deleteSettings.options[0] = new Option("красный - простой сотрудника", "str0");
          deleteSettings.options[1] = new Option("оранжевый - прочая деятельность", "str1");
          deleteSettings.options[2] = new Option("желтый - вспомогательные обязанности", "str2");
          deleteSettings.options[3] = new Option("зеленый - должностные обязанности", "str3");
        }
        deleteSettings.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
        var y = item.SettingsSalesFunnel_Stage_key;
        for (l = 0; l < 4; l++){
           var cells1 = deleteSettings.options[l].value;
           deleteSettings.options[l].selected=false;
           if (y==cells1){
           deleteSettings.options[l].selected=true;
           }
        }
        deleteSettings.addEventListener("click", function(e) {console.log("checkbox");  });
        var deleteSettingsColumn = document.createElement('td');
        deleteSettingsColumn.appendChild(deleteSettings);
      }
      ////
      if(TitleColumn == "Expect" || TitleColumn == "Other" || TitleColumn == "Gone"){
        var resultButtonColumn = document.createElement('td');
        if(translation_JS == null || translation_JS == 'en'){
          resultButtonColumn.innerHTML = "Ignore";
        } else {
          resultButtonColumn.innerHTML = "Игнорировать";
        }
      }else{
        var resultButton = document.createElement('select');
        if(translation_JS == null || translation_JS == 'en'){
          resultButton.options[0] = new Option("Ignore", "str0");
          resultButton.options[1] = new Option("Participates", "str1");
        } else {
          resultButton.options[0] = new Option("Игнорировать", "str0");
          resultButton.options[1] = new Option("Участвует", "str1");
        }
        resultButton.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
        var z = item.SettingsSalesFunnel_Result_key;
        for (k = 0; k < 2; k++){
           var cells2 = resultButton.options[k].value;
           resultButton.options[k].selected=false;
           if (z==cells2){
           resultButton.options[k].selected=true;
           }
        }
        resultButton.addEventListener("click", function(e) {console.log("checkbox");  });
        var resultButtonColumn = document.createElement('td');
        resultButtonColumn.appendChild(resultButton);
      }
      //////
      tr.appendChild(settingsTitleColumn);
      tr.appendChild(settingsСommentColumn);
      tr.appendChild(editSettingsColumn);
      tr.appendChild(deleteSettingsColumn);
      tr.appendChild(resultButtonColumn);

      var container = document.getElementById("tableAvalablePositionsListSettings").getElementsByTagName("tbody")[0];

      container.appendChild(tr);
    });
  });
  //добавляем кнопку сохранения измененых настроек
  my_div_UserSaveSettingsShiftPosition = document.getElementById("titleSaveSettingsShiftPosition");
  const ul_UserSaveSettingsShiftPosition = my_div_UserSaveSettingsShiftPosition.querySelector("h4");
  if(translation_JS == null || translation_JS == 'en'){
    var li = '<button type="button" class="btn btn-gradient-primary mr-2" onclick="gridSystemSaveSettingsShiftPosition()">Save settings</button>';
  } else {
    var li = '<button type="button" class="btn btn-gradient-primary mr-2" onclick="gridSystemSaveSettingsShiftPosition()">Сохранить настройки</button>';
  }
  ul_UserSaveSettingsShiftPosition.insertAdjacentHTML("afterend", li);
}


/**
* @return {string}
*  получаем данные с таблицы tableAvalablePositionsListSettings и обновляем настройки в документах
*/
function gridSystemSaveSettingsShiftPosition()
{
  //читаем данные с таблицы
  var tablePositionsListSettings = document.getElementById('tableAvalablePositionsListSettings');
  //удалил шапку таблицы
  var itemPositionsListSettings =[];
  tablePositionsListSettings.deleteRow(0);
  tablePositionsListSettings.deleteRow(0);
  tablePositionsListSettings.deleteRow(0);
  tablePositionsListSettings.deleteRow(0);
  tablePositionsListSettings = document.getElementById('tableAvalablePositionsListSettings');
  var rowLength = tablePositionsListSettings.rows.length;
  for (i = 0; i < rowLength; i++){
     var cells = tablePositionsListSettings.rows.item(i).cells;
     var cellVal_0 = cells.item(0).innerHTML;
     var cellVal_1 = cells.item(1).innerHTML;
     var l = cells.item(2).lastChild.options.selectedIndex;
     var cellVal_2 = cells.item(2).lastChild.options[l].value;
     var l2 = cells.item(3).lastChild.options.selectedIndex;
     var cellVal_3 = cells.item(3).lastChild.options[l2].value;
     var l3 = cells.item(4).lastChild.options.selectedIndex;
     var cellVal_4 = cells.item(4).lastChild.options[l3].value;
     itemPositionsListSettings.push({...{namePosition: cellVal_0},...{SettingsSalesFunnel_Availability_key: cellVal_2},...{SettingsSalesFunnel_Stage_key: cellVal_3},...{SettingsSalesFunnel_Result: cellVal_4}});
   }
  // удаляем 3 настройки базовых кнопок
  // itemPositionsListSettings.splice(0, 3);
  // разбираем данные для изменение документов
  itemPositionsListSettings.forEach(function(item, i, arr) {
  var namePosition = itemPositionsListSettings[i].namePosition;
  var settingsSalesFunnel_Availability_key = itemPositionsListSettings[i].SettingsSalesFunnel_Availability_key;
  var settingsSalesFunnel_Stage_key = itemPositionsListSettings[i].SettingsSalesFunnel_Stage_key;
  var settingsSalesFunnel_Result_key = itemPositionsListSettings[i].SettingsSalesFunnel_Result;
  var k = itemPositionsListSettings.length;
  var f = 0;
  itemsPositionSalesFunnel.forEach(function(item, l, arr) {
  var settingsTitle = itemsPositionSalesFunnel[l].SettingsTitle;
  var idDocPositionSettingsr = itemsPositionSalesFunnel[l].idPositionSettings;
  if (namePosition == settingsTitle)
    {
      f = f + 1;
      docRefPosition.collection("PositionSettings").doc(idDocPositionSettingsr).update({
        SettingsSalesFunnel_Availability_key: settingsSalesFunnel_Availability_key,
        SettingsSalesFunnel_Stage_key: settingsSalesFunnel_Stage_key,
        SettingsSalesFunnel_Result_key: settingsSalesFunnel_Result_key,
      }).then(function() {
        console.log("Frank food updated");
        if(k = f){
          window.location.reload();
        }
      });
    }
  });
});
}

// открыть окно Фейсбука
function location_Href(){
  window.open('https://www.facebook.com/TMR24Systems/');
}

// заполняем строки с русскими значениями
function translationCommon_EN (){
  //
  var element_1 = document.getElementById("settings_button_modal_title_active_activity");
  var newElement_1 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsActiveControl">Active Control</label>';
  element_1.insertAdjacentHTML( 'beforeend', newElement_1 );
  //
  var element_2 = document.getElementById("settings_button_modal_title_active_activity_signal");
  var newElement_2 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsActiveSignal">Signal</label>';
  element_2.insertAdjacentHTML( 'beforeend', newElement_2 );
  //
  var element_3 = document.getElementById("settings_button_modal_title_passive_activity");
  var newElement_3 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveControl">Passive Control</label>';
  element_3.insertAdjacentHTML( 'beforeend', newElement_3 );
  //
  var element_4 = document.getElementById("settings_button_modal_title_passive_activity_audio");
  var newElement_4 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveAudio">Audio</label>';
  element_4.insertAdjacentHTML( 'beforeend', newElement_4 );
  //
  var element_5 = document.getElementById("settings_button_modal_title_passive_activity_photo");
  var newElement_5 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhoto">Photo</label>';
  element_5.insertAdjacentHTML( 'beforeend', newElement_5 );
  //
  var element_6 = document.getElementById("settings_button_modal_title_passive_activity_clic");
  var newElement_6 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoCaptureEventOnClick">Capture event on click</label>';
  element_6.insertAdjacentHTML( 'beforeend', newElement_6 );
  //
  var element_7 = document.getElementById("settings_button_modal_title_commit_description");
  var newElement_7 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsCommitDescription">Commit Description</label>';
  element_7.insertAdjacentHTML( 'beforeend', newElement_7 );
  //
  var element_8 = document.getElementById("settings_button_modal_title_result_control");
  var newElement_8 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsResultControl">Result Control</label>';
  element_8.insertAdjacentHTML( 'beforeend', newElement_8 );
  //
  var element_9 = document.getElementById("settings_button_modal_title_passive_activity_smartphone_camera");
  var newElement_9 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoSmartphoneCamera">Smartphone camera</label>';
  element_9.insertAdjacentHTML( 'beforeend', newElement_9 );
  //
  var element_10 = document.getElementById("settings_button_modal_title_passive_activity_ip_camera");
  var newElement_10 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoExternalIPCamera">External IP camera</label>';
  element_10.insertAdjacentHTML( 'beforeend', newElement_10 );
  //
  var element_11 = document.getElementById("settings_button_modal_title_passive_activity_video");
  var newElement_11 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveVideo">Video</label>';
  element_11.insertAdjacentHTML( 'beforeend', newElement_11 );
  //
  var element_12 = document.getElementById("settings_button_modal_title_passive_activity_geolocation");
  var newElement_12 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveGeolocation">Geolocation</label>';
  element_12.insertAdjacentHTML( 'beforeend', newElement_12 );
  //
  var element_13 = document.getElementById("settings_button_modal_title_passive_activity_geolocation_clic");
  var newElement_13 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveGeolocationCaptureEventOnClick">Capture event on click</label>';
  element_13.insertAdjacentHTML( 'beforeend', newElement_13 );
}
// заполняем строки с английскими значениями
function translationCommon_RU (){
  //
  var element_1 = document.getElementById("settings_button_modal_title_active_activity");
  var newElement_1 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsActiveControl">Активный Контроль</label>';
  element_1.insertAdjacentHTML( 'beforeend', newElement_1 );
  //
  var element_2 = document.getElementById("settings_button_modal_title_active_activity_signal");
  var newElement_2 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsActiveSignal">Сигнал</label>';
  element_2.insertAdjacentHTML( 'beforeend', newElement_2 );
  //
  var element_3 = document.getElementById("settings_button_modal_title_passive_activity");
  var newElement_3 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveControl">Пассивный Контроль</label>';
  element_3.insertAdjacentHTML( 'beforeend', newElement_3 );
  //
  var element_4 = document.getElementById("settings_button_modal_title_passive_activity_audio");
  var newElement_4 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveAudio">Запись звука</label>';
  element_4.insertAdjacentHTML( 'beforeend', newElement_4 );
  //
  var element_5 = document.getElementById("settings_button_modal_title_passive_activity_photo");
  var newElement_5 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhoto">Фото фиксация</label>';
  element_5.insertAdjacentHTML( 'beforeend', newElement_5 );
  //
  var element_6 = document.getElementById("settings_button_modal_title_passive_activity_clic");
  var newElement_6 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoCaptureEventOnClick">Захват события по щелчку мыши</label>';
  element_6.insertAdjacentHTML( 'beforeend', newElement_6 );
  //
  var element_7 = document.getElementById("settings_button_modal_title_commit_description");
  var newElement_7 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsCommitDescription">Описание фиксации</label>';
  element_7.insertAdjacentHTML( 'beforeend', newElement_7 );
  //
  var element_8 = document.getElementById("settings_button_modal_title_result_control");
  var newElement_8 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsResultControl">Контроль результатов</label>';
  element_8.insertAdjacentHTML( 'beforeend', newElement_8 );
  //
  var element_9 = document.getElementById("settings_button_modal_title_passive_activity_smartphone_camera");
  var newElement_9 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoSmartphoneCamera">Камера смартфона</label>';
  element_9.insertAdjacentHTML( 'beforeend', newElement_9 );
  //
  var element_10 = document.getElementById("settings_button_modal_title_passive_activity_ip_camera");
  var newElement_10 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassivePhotoExternalIPCamera">Внешняя камера</label>';
  element_10.insertAdjacentHTML( 'beforeend', newElement_10 );
  //
  var element_11 = document.getElementById("settings_button_modal_title_passive_activity_video");
  var newElement_11 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveVideo">Видео</label>';
  element_11.insertAdjacentHTML( 'beforeend', newElement_11 );
  //
  var element_12 = document.getElementById("settings_button_modal_title_passive_activity_geolocation");
  var newElement_12 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveGeolocation">Геолокация</label>';
  element_12.insertAdjacentHTML( 'beforeend', newElement_12 );
  //
  var element_13 = document.getElementById("settings_button_modal_title_passive_activity_geolocation_clic");
  var newElement_13 = '<label class="form-check-label"><input type="checkbox" class="form-check-input" id="exampleInputModalSettingsPassiveGeolocationCaptureEventOnClick">Захват события по щелчку мыши</label>';
  element_13.insertAdjacentHTML( 'beforeend', newElement_13 );

}
