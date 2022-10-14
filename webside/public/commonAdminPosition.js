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
      var li = "Organization - "+(nameOrganization)+", Subdivision - "+(nameSubdivision)+", Position - "+(namePosition);
    } else {
      var li = "Организация - "+(nameOrganization)+", Подразделение - "+(nameSubdivision)+", Должность - "+(namePosition);
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
     localStorage.clear();
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

       var userСommentColumn = document.createElement('td');
       userСommentColumn.innerHTML = item.UserСomment;

       var editUserName = document.createElement('button');
       if(translation_JS == null || translation_JS == 'en'){
         editUserName.innerHTML = "Edit";
       } else {
         editUserName.innerHTML = "Редактировать";
       }
       editUserName.className = 'badge badge-gradient-success';
       editUserName.id = item.idPositionUser;
       editUserName.setAttribute('onclick', 'editButtonUser(this)');

       var editUserNameColumn = document.createElement('td');
       editUserNameColumn.appendChild(editUserName);

       var toDismissName = document.createElement('button');
       if(translation_JS == null || translation_JS == 'en'){
         toDismissName.innerHTML = "To dismiss";
       } else {
         toDismissName.innerHTML = "Отклонить";
       }
       toDismissName.className = 'badge badge-gradient-danger';
       toDismissName.id = item.idPositionUser;
       toDismissName.setAttribute('onclick', 'toDismissButtonUser(this)');

       var toDismissColumn = document.createElement('td');
       toDismissColumn.appendChild(toDismissName);

       tr.appendChild(userEmailColumn);
       tr.appendChild(userСommentColumn);
       tr.appendChild(editUserNameColumn);
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

      var settingsTitleColumn = document.createElement('td');
      settingsTitleColumn.innerHTML = item.SettingsTitle;

      var settingsСommentColumn = document.createElement('td');
      settingsСommentColumn.innerHTML = item.SettingsСomment;

      var settingsActiveControl = document.createElement('td');
      settingsActiveControl.innerHTML = item.SettingsActiveControl

      var settingsPassiveControl = document.createElement('td');
      settingsPassiveControl.innerHTML = item.SettingsPassiveControl;

      var settingsResultCapture = document.createElement('td');
      settingsResultCapture.innerHTML = item.SettingsResultCapture;

      var settingsCommitDescription = document.createElement('td');
      settingsCommitDescription.innerHTML = item.SettingsCommitDescription;

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

      var deleteSettingsColumn = document.createElement('td');
      deleteSettingsColumn.appendChild(deleteSettings);

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

      var settingsActiveTitleColumn = document.createElement('td');
      settingsActiveTitleColumn.innerHTML = item.SettingsTitle;

      var settingsActiveControl = document.createElement('td');
      settingsActiveControl.innerHTML = item.SettingsActiveControl;

      var settingsActiveInterval = document.createElement('td');
      settingsActiveInterval.innerHTML = item.SettingsActiveIntervalMinutes

      var settingsActiveDuration = document.createElement('td');
      settingsActiveDuration.innerHTML = item.SettingsActiveDurationSeconds;

      var settingsActiveTransition = document.createElement('td');
      settingsActiveTransition.innerHTML = item.SettingsActiveTransition;

      var settingsActiveSignal = document.createElement('td');
      settingsActiveSignal.innerHTML = item.SettingsActiveSignal;


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

      var settingsPassiveTitleColumn = document.createElement('td');
      settingsPassiveTitleColumn.innerHTML = item.SettingsTitle;

      var settingsPassiveControl = document.createElement('td');
      settingsPassiveControl.innerHTML = item.SettingsPassiveControl;

      var settingsPassiveInterval = document.createElement('td');
      settingsPassiveInterval.innerHTML = item.SettingsPassiveIntervalMinutes

      var settingsPassiveDuration = document.createElement('td');
      settingsPassiveDuration.innerHTML = item.SettingsPassiveDurationSeconds;

      var settingsPassiveAudio = document.createElement('td');
      settingsPassiveAudio.innerHTML = item.SettingsPassiveAudio;

      var settingsPassivePhoto = document.createElement('td');
      settingsPassivePhoto.innerHTML = item.SettingsPassivePhoto;

      var settingsPassiveVideo = document.createElement('td');
      settingsPassiveVideo.innerHTML = item.SettingsPassiveVideo;

      var settingsPassiveGeolocation = document.createElement('td');
      settingsPassiveGeolocation.innerHTML = item.SettingsPassiveGeolocation;


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

      var settingsTitleColumn = document.createElement('td');
      settingsTitleColumn.innerHTML = item.SettingsTitle;

      var settingsCommitDescription = document.createElement('td');
      settingsCommitDescription.innerHTML = item.SettingsCommitDescription;

      var settingsResultCapture = document.createElement('td');
      settingsResultCapture.innerHTML = item.SettingsResultCapture

      var settingsResultControlOption1 = document.createElement('td');
      settingsResultControlOption1.innerHTML = item.SettingsResultControlOption1;

      var settingsResultControlOption2 = document.createElement('td');
      settingsResultControlOption2.innerHTML = item.SettingsResultControlOption2;

      var settingsResultControlOption3 = document.createElement('td');
      settingsResultControlOption3.innerHTML = item.SettingsResultControlOption3;

      var settingsResultControlOption4 = document.createElement('td');
      settingsResultControlOption4.innerHTML = item.SettingsResultControlOption4;

      var settingsResultControlOption5 = document.createElement('td');
      settingsResultControlOption5.innerHTML = item.SettingsResultControlOption5;

      var settingsResultControlOption6 = document.createElement('td');
      settingsResultControlOption6.innerHTML = item.SettingsResultControlOption6;

      var settingsResultControlOption7 = document.createElement('td');
      settingsResultControlOption7.innerHTML = item.SettingsResultControlOption7;

      var settingsResultControlOption8 = document.createElement('td');
      settingsResultControlOption8.innerHTML = item.SettingsResultControlOption8;

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
  var userTitle = document.getElementById("exampleInputModalUserTitle").value;
  if (userTitle.length < 1)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please enter an user name.');
    } else {
      alert ("Пожалуйста, введите имя пользователя.");
    }
   return;
  }
  var userСomment = document.getElementById("exampleInputModalUserСomment").value;
  if (userСomment.length < 1)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please enter an comments.');
    } else {
      alert ("Пожалуйста, введите комментарий.");
    }
   return;
  }
  docRefPosition.collection("PositionUser").add({
  UserEmail: userTitle,
  UserСomment: userСomment,
  idDocPosition: LocalStoragePosition,
  idDocSubdivision: LocalStorageSubdivision,
  idDocOrganization: LocalStorageOrganizationId,
  }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
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
};

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
  SettingsActiveControl: "false",
  SettingsActiveIntervalMinutes:"0",
  SettingsActiveDurationSeconds:"0",
  SettingsActiveTransition: "No button",
  SettingsActiveSignal: "false",
  SettingsPassiveControl: "false",
  SettingsPassiveIntervalMinutes:"0",
  SettingsPassiveDurationSeconds:"0",
  SettingsPassiveAudio: "false",
  SettingsPassivePhoto: "false",
  SettingsPassivePhotoInterval:"0",
  SettingsPassivePhotoCaptureEventOnClick:"false",
  SettingsPassivePhotoSmartphoneCamera: "false",
  SettingsPassivePhotoCameraIP: "false",
  SettingsPassiveVideo: "false",
  SettingsPassiveGeolocation: "false",
  SettingsPassiveGeolocationInterval:"0",
  SettingsPassiveGeolocationCaptureEventOnClick: "false",
  SettingsCommitDescription: "false",
  SettingsResultCapture: "false",
  SettingsResultControlOption1: "",
  SettingsResultControlOption2: "",
  SettingsResultControlOption3: "",
  SettingsResultControlOption4: "",
  SettingsResultControlOption5: "",
  SettingsResultControlOption6: "",
  SettingsResultControlOption7: "",
  SettingsResultControlOption8: "",
  SettingsSalesFunnel_Availability: "",
  SettingsSalesFunnel_Stage: "",
  SettingsSalesFunnel_Result: "",
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

/**
* @return {string}
*  Обработчик кнопки editButtonUser из таблицы Пользователи.
*/
function editButtonUser(obj)
{
  objIdDocUser = obj.id;
  var washingtonRef = docRefPosition.collection("PositionUser").doc(objIdDocUser);
  washingtonRef.get().then(function(doc) {
    if (doc.exists)
  {
      let userEmail = doc.data().UserEmail;
      let userСomment = doc.data().UserСomment;
      document.getElementById('editExampleInputModalUserTitle').value = userEmail;
      document.getElementById('editExampleInputModalUserСomment').value = userСomment;
      var modal = document.getElementById('editGridSystemModalNewUser');
      $(document).ready(function(){
        $("#editGridSystemModalNewUser").modal('show');
        window.location.reload();
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
  *  Обработчик кнопки editButtonSettings из таблицы Процессы.
  */
 function editButtonSettings(obj)
 {
   var settingsTitleOBJ = obj.SettingsTitle;

   var articleDiv = document.getElementById("exampleInputModalSettingsActiveTransition").innerHTML;
   if(translation_JS == null || translation_JS == 'en'){
     var articleDivOn = '<option>No button</option>';
   } else {
     var articleDivOn = '<option>Нет кнопки</option>';
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
       document.getElementById('exampleInputModalSettingsActiveInterval').value = settingsActiveIntervalMinutes;
       document.getElementById('exampleInputModalSettingsActiveDuration').value = settingsActiveDurationSeconds;
       document.getElementById('exampleInputModalSettingsActiveTransition').value = settingsActiveTransition;
       document.getElementById('exampleInputModalSettingsActiveSignal').checked = settingsActiveSignal;
       document.getElementById('exampleInputModalSettingsPassiveControl').checked  = settingsPassiveControl;
       document.getElementById('exampleInputModalSettingsPassiveInterval').value = settingsPassiveIntervalMinutes;
       document.getElementById('exampleInputModalSettingsPassiveDuration').value = settingsPassiveDurationSeconds;
       document.getElementById('exampleInputModalSettingsPassiveAudio').checked = settingsPassiveAudio;
       document.getElementById('exampleInputModalSettingsPassivePhoto').checked = settingsPassivePhoto;
       document.getElementById('exampleInputModalSettingsPassivePhotoSmartphoneCamera').checked = settingsPassivePhotoSmartphoneCamera;
       document.getElementById('exampleInputModalSettingsPassivePhotoExternalIPCamera').checked = settingsPassivePhotoCameraIP;
       document.getElementById('exampleInputModalSettingsPassiveIntervalFoto').value = settingsPassivePhotoInterval;
       document.getElementById('exampleInputModalSettingsPassivePhotoCaptureEventOnClick').checked = settingsPassivePhotoCaptureEventOnClick;
       document.getElementById('exampleInputModalSettingsPassiveVideo').checked = settingsPassiveVideo;
       document.getElementById('exampleInputModalSettingsPassiveGeolocation').checked = settingsPassiveGeolocation;
       document.getElementById('exampleInputModalSettingsPassiveIntervalGEO').value = settingsPassiveGeolocationInterval;
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
  var settingsActiveTransition = document.getElementById('exampleInputModalSettingsActiveTransition').value;
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

  docRefPosition.collection("PositionSettings").doc(objIdDocSettings).set({
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
  }).then(function() {
      console.log("Document successfully written!");
      $('#gridSystemModalEditSettings').modal('toggle');
      window.location.reload();

  }).catch(function(error) {
      console.error("Error writing document: ", error);
  });
}

/**
* @return {string}
 *  Обработчик кнопки Submit из модального окна editGridSystemModalNewUser.
 */
function  editGridSystemModalNewUserSubmit()
{
  var userTitle = document.getElementById("editExampleInputModalUserTitle").value;
  var userСomment = document.getElementById("editExampleInputModalUserСomment").value;
  docRefPosition.collection("PositionUser").doc(objIdDocUser).set({
      UserTitle: userTitle,
      UserСomment: userСomment,
  })
  .then(function() {
      console.log("Document successfully written!");
      $('#gridSystemModalNewOrganization').modal('toggle');
      window.location.reload();
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
}

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
         toDismissName.innerHTML = "Отклонить";
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
         toDismissName.innerHTML = "Отклонить";
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
itemsPositionSalesFunnel.push({...{SettingsTitle: "Expect"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability: "does not participate"},...{SettingsSalesFunnel_Stage: "Available green"},...{SettingsSalesFunnel_Result: "Ignore"}});
itemsPositionSalesFunnel.push({...{SettingsTitle: "Other"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability: "does not participate"},...{SettingsSalesFunnel_Stage: "Perhaps yellow"},...{SettingsSalesFunnel_Result: "Ignore"}});
itemsPositionSalesFunnel.push({...{SettingsTitle: "Gone"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability: "does not participate"},...{SettingsSalesFunnel_Stage: "Not available red"},...{SettingsSalesFunnel_Result: "Ignore"}});

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
      settingsTitleColumn.innerHTML = item.SettingsTitle;

      var settingsСommentColumn = document.createElement('td');
      settingsСommentColumn.innerHTML = item.SettingsСomment;

      var editSettings = document.createElement('select');
      editSettings.options[0] = new Option("does not participate", "str0");
      editSettings.options[1] = new Option("Stage 1 of the sales funnel", "str1");
      editSettings.options[2] = new Option("Stage 2 of the sales funnel", "str2");
      editSettings.options[3] = new Option("Stage 3 of the sales funnel", "str3");
      editSettings.options[4] = new Option("Stage 4 of the sales funnel", "str4");
      editSettings.options[5] = new Option("Stage 5 of the sales funnel", "str5");
      editSettings.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
      var x = item.SettingsSalesFunnel_Availability;
      for (i = 0; i < 6; i++){
         var cells = editSettings.options[i].innerHTML;
         editSettings.options[i].selected=false;
         if (x==cells){
         editSettings.options[i].selected=true;
         }
      }
      editSettings.addEventListener("click", function(e) {console.log("checkbox");  });

      var editSettingsColumn = document.createElement('td');
      editSettingsColumn.appendChild(editSettings);


      var deleteSettings = document.createElement('select');
      deleteSettings.options[0] = new Option("Not available red", "str0");
      deleteSettings.options[1] = new Option("Perhaps yellow", "str1");
      deleteSettings.options[2] = new Option("Available green", "str2");
      deleteSettings.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
      var y = item.SettingsSalesFunnel_Stage;
      for (l = 0; l < 3; l++){
         var cells1 = deleteSettings.options[l].innerHTML;
         deleteSettings.options[l].selected=false;
         if (y==cells1){
         deleteSettings.options[l].selected=true;
         }
      }
      deleteSettings.addEventListener("click", function(e) {console.log("checkbox");  });

      var deleteSettingsColumn = document.createElement('td');
      deleteSettingsColumn.appendChild(deleteSettings);

      var resultButton = document.createElement('select');
      resultButton.options[0] = new Option("Ignore", "str0");
      resultButton.options[1] = new Option("Take account of", "str1");
      resultButton.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
      var z = item.SettingsSalesFunnel_Result;
      for (k = 0; k < 2; k++){
         var cells2 = resultButton.options[k].innerHTML;
         resultButton.options[k].selected=false;
         if (z==cells2){
         resultButton.options[k].selected=true;
         }
      }
      resultButton.addEventListener("click", function(e) {console.log("checkbox");  });

      var resultButtonColumn = document.createElement('td');
      resultButtonColumn.appendChild(resultButton);

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
  var rowLength = tablePositionsListSettings.rows.length;
  for (i = 0; i < rowLength; i++){
     var cells = tablePositionsListSettings.rows.item(i).cells;
     var cellVal_0 = cells.item(0).innerHTML;
     var cellVal_1 = cells.item(1).innerHTML;
     var l = cells.item(2).lastChild.options.selectedIndex;
     var cellVal_2 = cells.item(2).lastChild.options[l].innerHTML;
     var l2 = cells.item(3).lastChild.options.selectedIndex;
     var cellVal_3 = cells.item(3).lastChild.options[l2].innerHTML;
     var l3 = cells.item(4).lastChild.options.selectedIndex;
     var cellVal_4 = cells.item(4).lastChild.options[l3].innerHTML;
     itemPositionsListSettings.push({...{namePosition: cellVal_0},...{SettingsSalesFunnel_Availability: cellVal_2},...{SettingsSalesFunnel_Stage: cellVal_3},...{SettingsSalesFunnel_Result: cellVal_4}});
   }
  // удаляем 3 настройки базовых кнопок
  itemPositionsListSettings.splice(0, 3);
  // разбираем данные для изменение документов
  itemPositionsListSettings.forEach(function(item, i, arr) {
  var namePosition = itemPositionsListSettings[i].namePosition;
  var settingsSalesFunnel_Availability = itemPositionsListSettings[i].SettingsSalesFunnel_Availability;
  var settingsSalesFunnel_Stage = itemPositionsListSettings[i].SettingsSalesFunnel_Stage;
  var settingsSalesFunnel_Result = itemPositionsListSettings[i].SettingsSalesFunnel_Result;
  itemsPositionSalesFunnel.forEach(function(item, l, arr) {
  var settingsTitle = itemsPositionSalesFunnel[l].SettingsTitle;
  var idDocPositionSettingsr = itemsPositionSalesFunnel[l].idPositionSettings;
  if (namePosition == settingsTitle)
    {
      docRefPosition.collection("PositionSettings").doc(idDocPositionSettingsr).update({
        SettingsSalesFunnel_Availability: settingsSalesFunnel_Availability,
        SettingsSalesFunnel_Stage: settingsSalesFunnel_Stage,
        SettingsSalesFunnel_Result: settingsSalesFunnel_Result,
      }).then(function() {
        console.log("Frank food updated");
      });
    }
  });
});
}
