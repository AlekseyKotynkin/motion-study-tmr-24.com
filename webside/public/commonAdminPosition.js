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
// let documentData=[];
// let documentDataSubdivision=[];
let items=[];
let itemsPositionUser=[];

// let itemsPosition=[];

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
const LocalStorageOrganizationId = (LocalStorageValueObjectOrganization[0]).OrganizationId;
const LocalStorageEmailOrganization = (LocalStorageValueObjectOrganization[0]).OwnerEmail;
var docRefOrganization = db.collection("Organization").doc(LocalStorageOrganizationId);
let nameOrganization = "";
let documentDataOrganization=[];

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminSubdivision'.
*/
const LocalStorageValueObjectSubdivision = JSON.parse(localStorage.getItem('TMR::rememberedAdminSubdivision'));
const LocalStorageSubdivision = (LocalStorageValueObjectSubdivision[0]).SubdivisionId;
var docRefSubdivisio = docRefOrganization.collection("Subdivision").doc(LocalStorageSubdivision);
let nameSubdivision = "";
let documentDataSubdivision=[];

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminPosition'.
*/
const LocalStorageValueObjectPosition = JSON.parse(localStorage.getItem('TMR::rememberedAdminPosition'));
const LocalStoragePosition = (LocalStorageValueObjectPosition[0]).PositionId;
var docRefPosition = docRefSubdivisio.collection("Position").doc(LocalStoragePosition);
let namePosition = "";
let documentDataPosition=[];

let objIdDocUser ="";
let objIdDocSettings ="";

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
    const ul_User = my_div_User.querySelector("h4");
    namePosition =item.Position;
    let li = "Organization - "+(nameOrganization)+", Subdivision - "+(nameSubdivision)+", Position - "+(namePosition);
    ul_User.insertAdjacentHTML("beforeend", li);
    my_div = document.getElementById("headerTableSettings");
    const ul = my_div.querySelector("h4");
    ul.insertAdjacentHTML("beforeend", li);
   });
});


/**
* @return {string}
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
 function SignoutAdmin() {
   localStorage.clear();

   window.location.replace("index.html")
 };

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
       editUserName.innerHTML = "Edit";
       editUserName.className = 'badge badge-gradient-success';
       editUserName.id = item.idPositionUser;
       editUserName.setAttribute('onclick', 'editButtonUser(this)');

       var editUserNameColumn = document.createElement('td');
       editUserNameColumn.appendChild(editUserName);

       var toDismissName = document.createElement('button');
       toDismissName.innerHTML = "To dismiss";
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
      editSettings.innerHTML = "Edit";
      editSettings.className = 'badge badge-gradient-success';
      editSettings.id = item.idPositionSettings;
      editSettings.setAttribute('onclick', 'editButtonSettings(this)');

      var editSettingsColumn = document.createElement('td');
      editSettingsColumn.appendChild(editSettings);

      var deleteSettings = document.createElement('button');
      deleteSettings.innerHTML = "Delete";
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
};

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
};


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
};


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

function gridSystemModalNewUser()
{
  var userTitle = document.getElementById("exampleInputModalUserTitle").value;
  var userСomment = document.getElementById("exampleInputModalUserСomment").value;
  docRefPosition.collection("PositionUser").add({
  UserEmail: userTitle,
  UserСomment: userСomment,
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      alert("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
      alert("Error adding document: ", error);
  });
};



/**
* @return {string}
*  Обработка модального окна Регистрация Настроик Процессов.
*/

function gridSystemModalNewSettings()
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
  SettingsPassiveVideo: "false",
  SettingsPassiveGeolocation: "false",
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
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      alert("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
      alert("Error adding document: ", error);
  });
};

/**
* @return {string}
*  Обработчик кнопки toDismiss из таблицы Пользователи.
*/
function toDismissButtonUser(obj)
{
  let objId = obj.id;
  alert('Document successfully deleted! '+ (objId));
  docRefPosition.collection("PositionUser").doc(objId).delete().then(function()
  {
      console.log("Document successfully deleted!");
  }).catch(function(error)
  {
      console.error("Error removing document: ", error);
  });
  window.location.reload();
}

/**
* @return {string}
*  Обработчик кнопки deleteButtonSettings из таблицы Процессов.
*/

function deleteButtonSettings(obj)
{
  let objId = obj.id;
  alert('Document successfully deleted! '+ (objId));
  docRefPosition.collection("PositionSettings").doc(objId).delete().then(function()
  {
       console.log("Document successfully deleted!");
  }).catch(function(error)
  {
       console.error("Error removing document: ", error);
  });
   window.location.reload();
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
   objIdDocSettings = obj.id;
   var washingtonRef = docRefPosition.collection("PositionSettings").doc(objIdDocSettings);
   washingtonRef.get().then(function(doc) {
     if (doc.exists)
   {   let settingsTitle = doc.data().SettingsTitle;
       let settingsСomment = doc.data().SettingsСomment;
       let settingsActiveControl = doc.data().SettingsActiveControl;
       let settingsActiveIntervalMinutes = doc.data().SettingsActiveIntervalMinutes;
       let settingsActiveDurationSeconds = doc.data().SettingsActiveDurationSeconds;
       let settingsActiveTransition = doc.data().SettingsActiveTransition;
       let settingsActiveSignal = doc.data().SettingsActiveSignal;
       let settingsPassiveControl = doc.data().SettingsPassiveControl;
       let settingsPassiveIntervalMinutes = doc.data().SettingsPassiveIntervalMinutes;
       let settingsPassiveDurationSeconds = doc.data().SettingsPassiveDurationSeconds;
       let settingsPassiveAudio = doc.data().SettingsPassiveAudio;
       let settingsPassivePhoto = doc.data().SettingsPassivePhoto;
       let settingsPassiveVideo = doc.data().SettingsPassiveVideo;
       let settingsPassiveGeolocation = doc.data().SettingsPassiveGeolocation;
       let settingsCommitDescription = doc.data().SettingsCommitDescription;
       let settingsResultCapture = doc.data().SettingsResultCapture;
       let settingsResultControlOption1 = doc.data().SettingsResultControlOption1;
       let settingsResultControlOption2 = doc.data().SettingsResultControlOption2;
       let settingsResultControlOption3 = doc.data().SettingsResultControlOption3;
       let settingsResultControlOption4 = doc.data().SettingsResultControlOption4;
       let settingsResultControlOption5 = doc.data().SettingsResultControlOption5;
       let settingsResultControlOption6 = doc.data().SettingsResultControlOption6;
       let settingsResultControlOption7 = doc.data().SettingsResultControlOption7;
       let settingsResultControlOption8 = doc.data().SettingsResultControlOption8;
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
       document.getElementById('exampleInputModalSettingsPassiveVideo').checked = settingsPassiveVideo;
       document.getElementById('exampleInputModalSettingsPassiveGeolocation').checked = settingsPassiveGeolocation;
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
 function  gridSystemModalEditSettings()
{

}

/**
* @return {string}
 *  Обработчик кнопки Submit из модального окна editGridSystemModalNewUser.
 */
function  editGridSystemModalNewUser()
{ console.log(objIdDocUser);
  console.log(docRefPosition);
  var washingtonRef = docRefPosition.collection("PositionUser").doc(objIdDocUser);
  console.log(washingtonRef);




  console.log(washingtonRef);
  alert(washingtonRef);
  // Set the "capital" field of the city 'DC'




  return washingtonRef.update({
    // var userTitle = document.getElementById("editExampleInputModalUserTitle").value;
    // var userСomment = document.getElementById("editExampleInputModalUserСomment").value;
    //   UserTitle = userTitle;
    //   UserСomment = userСomment;
      capital: true
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}
