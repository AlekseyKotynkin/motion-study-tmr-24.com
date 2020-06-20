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
let itemsUserName=[];
let itemsActiveUserName=[];
let nameOrganization = "";
let nameSubdivision = "";
let namePosition = "";
let nameActiveUserOrganization = "";
let nameActiveUserSubdivision = "";
let nameActiveUserPosition = "";


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
 *  Получение данных для таблицы List of active user sessions из firestore.
 */

 db.collection("WorkShift").where('EmailPositionUser', '==', EmailLocalStorage).where("WorkShiftEnd", "==", "")
     .get()
     .then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             // doc.data() is never undefined for query doc snapshots
            let parentHierarchyDoc = doc.data().ParentHierarchyPositionUser;
            let organizationDocId = parentHierarchyDoc.idDocOrganization;
            let subdivisionDocId = parentHierarchyDoc.idDocSubdivision;
            let positionDocId = parentHierarchyDoc.idDocPosition;
            itemsActiveUserName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
         });
           itemsActiveUserName.forEach(function(element){
             let organizationDocId = element.idDocOrganization ;
             let subdivisionDocId = element.idDocSubdivision ;
             let positionDocId = element.idDocPosition ;
             let docRefOrganization = db.collection("Organization").doc(organizationDocId);
                docRefOrganization.get().then(function(doc) {
                 if (doc.exists) {
                     nameActiveUserOrganization = doc.data().Organization;
                     element['NameOrganization'] = nameActiveUserOrganization;
                 } else {
                     console.log("No such document!");
                 }
             }).catch(function(error) {
                 console.log("Error getting document:", error);
             });
             let docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
                docRefSubdivision.get().then(function(doc) {
                 if (doc.exists) {
                     nameActiveUserSubdivision = doc.data().Subdivision;
                     element['NameSubdivision'] = nameActiveUserSubdivision;
                 } else {
                     console.log("No such document!");
                 }
             }).catch(function(error) {
                 console.log("Error getting document:", error);
             });
             let docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
                docRefPosition.get().then(function(doc) {
                 if (doc.exists) {
                     nameActiveUserPosition = doc.data().Position;
                     element['NamePosition'] = nameActiveUserPosition;
                 } else {
                     console.log("No such document!");
                 }
             }).catch(function(error) {
                 console.log("Error getting document:", error);
             }).finally(() => {
               [element].forEach(item =>
               {
                 var tr = document.createElement("tr");

                 var organizationColumn = document.createElement('td');
                 organizationColumn.innerHTML = item.NameOrganization;

                 var subdivisionColumn = document.createElement('td');
                 subdivisionColumn.innerHTML = item.NameSubdivision;

                 var positionColumn = document.createElement('td');
                 positionColumn.innerHTML = item.NamePosition;

                 var nameOfYourManagerColumn = document.createElement('td');
                 nameOfYourManagerColumn.innerHTML = item.UserСomment;

                 var statusUserColumn = document.createElement('td');
                 statusUserColumn.innerHTML = item.UserEmail;

                 var toComeInUserName = document.createElement('button');
                 toComeInUserName.innerHTML = "To come in";
                 toComeInUserName.className = 'badge badge-gradient-success';
                 toComeInUserName.id = item.idDocPositionUser;
                 toComeInUserName.item = item;
                 toComeInUserName.setAttribute('onclick', 'toComeInButtonUser(this)');

                 var toComeInUserColumn = document.createElement('td');
                 toComeInUserColumn.appendChild(toComeInUserName);

                 tr.appendChild(organizationColumn);
                 tr.appendChild(subdivisionColumn);
                 tr.appendChild(positionColumn);
                 tr.appendChild(nameOfYourManagerColumn);
                 tr.appendChild(statusUserColumn);
                 tr.appendChild(toComeInUserColumn);

                 var container = document.getElementById("tableActiveUser").getElementsByTagName("tbody")[0];

                 container.appendChild(tr);
              });
              });
              });
     })
     .catch(function(error) {
         console.log("Error getting documents: ", error);
     });

/**
* @return {string}
 *  Получение данных для таблицы List Of Posts In Which You Are Involved As A User из firestore.
 */

var parentHierarchy = db.collectionGroup('PositionUser').where('UserEmail', '==', EmailLocalStorage);
parentHierarchy.get().then(function (querySnapshot) {
  querySnapshot.forEach(function (doc) {
   let parentHierarchyDoc = doc.ref.path;
   let organizationDocId = parentHierarchyDoc.split("/")[1];
   let subdivisionDocId = parentHierarchyDoc.split("/")[3];
   let positionDocId = parentHierarchyDoc.split("/")[5];
   itemsUserName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
  });
  itemsUserName.forEach(function(element){
    let organizationDocId = element.idDocOrganization ;
    let subdivisionDocId = element.idDocSubdivision ;
    let positionDocId = element.idDocPosition ;
    let docRefOrganization = db.collection("Organization").doc(organizationDocId);
       docRefOrganization.get().then(function(doc) {
        if (doc.exists) {
            nameOrganization = doc.data().Organization;
            element['NameOrganization'] = nameOrganization;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    let docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
       docRefSubdivision.get().then(function(doc) {
        if (doc.exists) {
            nameSubdivision = doc.data().Subdivision;
            element['NameSubdivision'] = nameSubdivision;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    let docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
       docRefPosition.get().then(function(doc) {
        if (doc.exists) {
            namePosition = doc.data().Position;
            element['NamePosition'] = namePosition;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }).finally(() => {
      [element].forEach(item =>
    {
        var tr = document.createElement("tr");

        var organizationColumn = document.createElement('td');
        organizationColumn.innerHTML = item.NameOrganization;

        var subdivisionColumn = document.createElement('td');
        subdivisionColumn.innerHTML = item.NameSubdivision;

        var positionColumn = document.createElement('td');
        positionColumn.innerHTML = item.NamePosition;

        var nameOfYourManagerColumn = document.createElement('td');
        nameOfYourManagerColumn.innerHTML = item.UserСomment;

        var statusUserColumn = document.createElement('td');
        statusUserColumn.innerHTML = item.UserEmail;

        var toComeInUserName = document.createElement('button');
        toComeInUserName.innerHTML = "To come in";
        toComeInUserName.className = 'badge badge-gradient-success';
        toComeInUserName.id = item.idDocPositionUser;
        toComeInUserName.item = item;
        toComeInUserName.setAttribute('onclick', 'toComeInButtonUser(this)');

        var toComeInUserColumn = document.createElement('td');
        toComeInUserColumn.appendChild(toComeInUserName);

        tr.appendChild(organizationColumn);
        tr.appendChild(subdivisionColumn);
        tr.appendChild(positionColumn);
        tr.appendChild(nameOfYourManagerColumn);
        tr.appendChild(statusUserColumn);
        tr.appendChild(toComeInUserColumn);

        var container = document.getElementById("tablePostsUser").getElementsByTagName("tbody")[0];

        container.appendChild(tr);
     });
    });
  });
});

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
  *  Обработка модального окна Регистрация Организации.
  */

  function gridSystemModalNewOrganizationSubmit()
  {
    let Organization = document.getElementById("exampleInputNameOrganization").value;
    let Position = document.getElementById("exampleInputPosition").value;
   //  Add a new document with a generated id.
  db.collection("Organization").add({
    StatusUser: "StatusUser_Owner",
    Organization: Organization,
    Subdivision: "",
    Position: Position,
    OwnerEmail: EmailLocalStorage,
    OwnerID: "",
    PositionOfYourManager: "",
    NameOfYourManager: "",
  }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      $('#gridSystemModalNewOrganization').modal('toggle');
      window.location.reload();

  }).catch(function(error) {
      console.error("Error adding document: ", error);
  });
  }


    /**
    * @return {string}
     *  Получение данных для таблицы List Of Organizations In Which You Are Involved из firestore.
     */

    function createATableOfClientAdmin()
    {
    db.collection("Organization").where("OwnerEmail", "==", EmailLocalStorage)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        items.push({...doc.data(),...{idOrganization: doc.id}});
      });

        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
        .finally(() => {items;
        items.forEach(item => {
          var tr = document.createElement("tr");

          var organizationName = document.createElement('a');
          organizationName.innerHTML = item.Organization;

          var organizationColumn = document.createElement('td');
          organizationColumn.appendChild(organizationName);

          var subdivisionColumn = document.createElement('td');
          subdivisionColumn.innerHTML = item.Subdivision;

          var positionColumn = document.createElement('td');
          positionColumn.innerHTML = item.Position;

          var positionOfYourManagerColumn = document.createElement('td');
          positionOfYourManagerColumn.innerHTML = item.PositionOfYourManager;

          var nameOfYourManagerColumn = document.createElement('td');
          nameOfYourManagerColumn.innerHTML = item.NameOfYourManager;

          var statusUserColumn = document.createElement('td');
          statusUserColumn.innerHTML = item.StatusUser;

          var toComeInUserName = document.createElement('button');
          toComeInUserName.innerHTML = "To come in";
          toComeInUserName.className = 'badge badge-gradient-success';
          toComeInUserName.id = item.idOrganization;
          toComeInUserName.setAttribute('onclick', 'toComeInButton(this)');

          var toComeInUserColumn = document.createElement('td');
          toComeInUserColumn.appendChild(toComeInUserName);

          var quitName = document.createElement('button');
          quitName.innerHTML = "Quit";
          quitName.className = 'badge badge-gradient-danger';
          quitName.id = item.idOrganization;
          quitName.setAttribute('onclick', 'quitButton(this)');

          var quitColumn = document.createElement('td');
          quitColumn.appendChild(quitName);

          tr.appendChild(organizationColumn);
          tr.appendChild(subdivisionColumn);
          tr.appendChild(positionColumn);
          tr.appendChild(positionOfYourManagerColumn);
          tr.appendChild(nameOfYourManagerColumn);
          tr.appendChild(statusUserColumn);
          tr.appendChild(toComeInUserColumn);
          tr.appendChild(quitColumn);

          container.appendChild(tr);
        });
      });
  };

  /**
  * @return {string}
   *  Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved.
   */

  function toComeInButton(obj) {
    //обработка редактирования строки...
      let objId = obj.id;

        let itemsArray = [{
          OrganizationId: objId,
          OwnerEmail: EmailLocalStorage,
          ProviderId: "TMR-24.com"
        }];
      localStorage.setItem('TMR::rememberedAdmin', JSON.stringify(itemsArray));
      window.location.replace("indexAdminOrganization.html");
    };


    /**
    * @return {string}
     *  Обработчик кнопки quitColumn из таблицы List Of Organizations In Which You Are Involved.
     */

    function quitButton(obj) {
    let objId = obj.id;
    alert('Document successfully deleted! '+ (objId));
      db.collection("Organization").doc(objId).delete().then(function() {
          console.log("Document successfully deleted!");
          window.location.reload();
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });

    };




/**
* @return {string}
 *  Обработчик кнопки toComeInUserColumn из таблицы List of posts in which you are involved as a User из firestore.
 */

function toComeInButtonUser(obj) {
  //обработка редактирования строки...
    let objItem = obj.item;
      let itemsArray = [{
        OwnerEmail: EmailLocalStorage,
        ProviderId: "TMR-24.com",
        ParentHierarchy: objItem
      }];
    localStorage.setItem('TMR::rememberedUser', JSON.stringify(itemsArray));
    window.location.replace("indexUser.html");
  };


  /**
  * @return {string}
   *  Обработчик кнопки quitColumn из таблицы List of posts in which you are involved as a User из firestore.
   */

  // function quitButtonUser(obj) {
  // let objId = obj.id;
  // alert('Document successfully deleted! '+ (objId));
  //   db.collection("Organization").doc(objId).delete().then(function() {
  //       console.log("Document successfully deleted!");
  //   }).catch(function(error) {
  //       console.error("Error removing document: ", error);
  //   });
  //   window.location.reload();
  // }
