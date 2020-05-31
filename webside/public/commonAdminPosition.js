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
const localStorageOrganizationId = (LocalStorageValueObjectOrganization[0]).OrganizationId;
const LocalStorageEmailOrganization = (LocalStorageValueObjectOrganization[0]).OwnerEmail;
var docRefOrganization = db.collection("Organization").doc(localStorageOrganizationId);
let nameOrganization = "";
let documentDataOrganization=[];
    // console.log(localStorageOrganizationId);
/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminSubdivision'.
*/
const LocalStorageValueObjectSubdivision = JSON.parse(localStorage.getItem('TMR::rememberedAdminSubdivision'));
const localStorageSubdivision = (LocalStorageValueObjectSubdivision[0]).SubdivisionId;
var docRefSubdivisio = docRefOrganization.collection("Subdivision").doc(localStorageSubdivision);
let nameSubdivision = "";
let documentDataSubdivision=[];
    // console.log(localStorageSubdivision);
/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdminPosition'.
*/
const LocalStorageValueObjectPosition = JSON.parse(localStorage.getItem('TMR::rememberedAdminPosition'));
const localStoragePosition = (LocalStorageValueObjectPosition[0]).PositionId;
var docRefPosition = docRefSubdivisio.collection("Position").doc(localStoragePosition);
let namePosition = "";
let documentDataPosition=[];
    // console.log(localStoragePosition);
/**
* @return {string}
*  Заполняем шапку табличной части Подразделения.
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
  *  Получение данных для таблицы список Настроек List Of Subdivision In Which You Are Involved из firestore.
  */
function createATableOfClientSettings()
{
 docRefPosition.collection("PositionUser")
 .get()
 .then(function(querySnapshot) {
   querySnapshot.forEach(function(doc) {
     items.push({...doc.data(),...{idPositionUser: doc.id}});
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
       userСommentColumn.innerHTML = item.userСomment;

       var toComeInUserName = document.createElement('button');
       toComeInUserName.innerHTML = "To come in";
       toComeInUserName.className = 'badge badge-gradient-success';
       toComeInUserName.id = item.idPositionUser;
       toComeInUserName.setAttribute('onclick', 'toComeInButtonPositionUser(this)');

       var toComeInUserColumn = document.createElement('td');
       toComeInUserColumn.appendChild(toComeInUserName);

       var quitName = document.createElement('button');
       quitName.innerHTML = "Quit";
       quitName.className = 'badge badge-gradient-danger';
       quitName.id = item.idPositionUser;
       quitName.setAttribute('onclick', 'quitButtonPositionUser(this)');

       var quitColumn = document.createElement('td');
       quitColumn.appendChild(quitName);

       tr.appendChild(userEmailColumn);
       tr.appendChild(nameOfDepartmentHeadColumn);
       tr.appendChild(toComeInUserColumn);
       tr.appendChild(quitColumn);

       container.appendChild(tr);

       var container = document.getElementById("tableUser").getElementsByTagName("tbody")[0];
     });
   });
};

/**
* @return {string}
 *  Получение данных для таблицы список Пользователи List Of Subdivision In Which You Are Involved из firestore.
 */
function createATableOfClientUser()
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

      var toComeInUserName = document.createElement('button');
      toComeInUserName.innerHTML = "To come in";
      toComeInUserName.className = 'badge badge-gradient-success';
      toComeInUserName.id = item.idPositionSettings;
      toComeInUserName.setAttribute('onclick', 'toComeInButtonPositionSettings(this)');

      var toComeInUserColumn = document.createElement('td');
      toComeInUserColumn.appendChild(toComeInUserName);

      var quitName = document.createElement('button');
      quitName.innerHTML = "Quit";
      quitName.className = 'badge badge-gradient-danger';
      quitName.id = item.idPositionSettings;
      quitName.setAttribute('onclick', 'quitButtonPositionSettings(this)');

      var quitColumn = document.createElement('td');
      quitColumn.appendChild(quitName);

      tr.appendChild(settingsTitleColumn);
      tr.appendChild(settingsСommentColumn);
      tr.appendChild(toComeInUserColumn);
      tr.appendChild(quitColumn);

      container.appendChild(tr);

      var container = document.getElementById("tableSettings").getElementsByTagName("tbody")[0];
    });
  });
};


 /**
 * @return {string}
  *  Обработка модального окна Регистрация Пользователя Должности.
  */

  function gridSystemModalNewUser()
  {
    var userTitle = document.getElementById("exampleInputModalUserTitle").value;
    var userСomment = document.getElementById("exampleInputModalUserСomment").value;
    // Добавляем в коллекциию организации Подразделения и данные руководителя.
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
    *  Обработка модального окна Регистрация Настроик Должности.
    */

    function gridSystemModalNewSubdivision()
    {
      var settingsTitle = document.getElementById("exampleInputModalSettingsTitle").value;
      var settingsСomment = document.getElementById("exampleInputModalSettingsСomment").value;
      // Добавляем в коллекциию организации Подразделения и данные руководителя.
      docRefPosition.collection("PositionSettings").add({
      SettingsTitle: settingsTitle,
      SettingsСomment: settingsСomment,
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
