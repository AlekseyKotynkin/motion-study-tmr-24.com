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
var storage = firebase.storage();
//
var items=[];
var itemsUserName=[];
var itemsActiveUserName=[];
var nameOrganization = "";
var nameSubdivision = "";
var namePosition = "";
var nameActiveUserOrganization = "";
var nameActiveUserSubdivision = "";
var nameActiveUserPosition = "";


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
            var parentHierarchyDoc = doc.data().ParentHierarchyPositionUser;
            var organizationDocId = parentHierarchyDoc.idDocOrganization;
            var subdivisionDocId = parentHierarchyDoc.idDocSubdivision;
            var positionDocId = parentHierarchyDoc.idDocPosition;
            itemsActiveUserName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
         });
           itemsActiveUserName.forEach(function(element){
             var organizationDocId = element.idDocOrganization ;
             var subdivisionDocId = element.idDocSubdivision ;
             var positionDocId = element.idDocPosition ;
             var docRefOrganization = db.collection("Organization").doc(organizationDocId);
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
             var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
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
             var docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
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
                 if(translation_JS == null || translation_JS == 'en'){
                   toComeInUserName.innerHTML = "To come in";
                 } else {
                   toComeInUserName.innerHTML = "Перейти";
                 }
                 toComeInUserName.className = 'badge badge-gradient-success lang';
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
   var parentHierarchyDoc = doc.ref.path;
   var organizationDocId = parentHierarchyDoc.split("/")[1];
   var subdivisionDocId = parentHierarchyDoc.split("/")[3];
   var positionDocId = parentHierarchyDoc.split("/")[5];
   itemsUserName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
  });
  itemsUserName.forEach(function(element){
    var organizationDocId = element.idDocOrganization ;
    var subdivisionDocId = element.idDocSubdivision ;
    var positionDocId = element.idDocPosition ;
    var docRefOrganization = db.collection("Organization").doc(organizationDocId);
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
    var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
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
    var docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
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
        if(translation_JS == null || translation_JS == 'en'){
          toComeInUserName.innerHTML = "To come in";
        } else {
          toComeInUserName.innerHTML = "Перейти";
        }
        toComeInUserName.className = 'badge badge-gradient-success lang';
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
  *  Обработка модального окна Регистрация Организации.
  */

  function gridSystemModalNewOrganizationSubmit()
  {
    //exampleInputUpload2
    var Organization = document.getElementById("exampleInputNameOrganization").value;
    var Position = document.getElementById("exampleInputPosition").value;
    var iconOrganization = document.getElementById("exampleInputUpload2").value;
    if (Organization.length < 1)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter the name of the organization.');
      } else {
        alert ("Пожалуйста, введите название организации.");
      }
     return;
    }
    if (Position.length < 1)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter the name of the position.');
      } else {
        alert ("Пожалуйста, введите название подразделения.");
      }
     return;
    };
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
      if (iconOrganization !="")
      {   // Загружаем логотип Организации!
        var storageRef = firebase.storage().ref();
        // File or Blob named mountains.jpg
        var file = document.querySelector("#exampleInputUpload2").files[0];
        // Create the file metadata
        var metadata = {
          contentType: 'image/jpeg'
        };
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child('IconOrganization/'+ docRef.id).put(file, metadata);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            document.querySelector("#exampleInputUpload2").files[0];
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            $('#gridSystemModalNewOrganization').modal('toggle');
            window.location.reload();
          });
        });
      } else {
        $('#gridSystemModalNewOrganization').modal('toggle');
        window.location.reload();
      }
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
          if(translation_JS == null || translation_JS == 'en'){
            toComeInUserName.innerHTML = "To come in";
          } else {
            toComeInUserName.innerHTML = "Перейти";
          }
          toComeInUserName.className = 'badge badge-gradient-success lang';
          toComeInUserName.id = item.idOrganization;
          toComeInUserName.setAttribute('onclick', 'toComeInButton(this)');

          var toComeInUserColumn = document.createElement('td');
          toComeInUserColumn.appendChild(toComeInUserName);

          var quitName = document.createElement('button');
          if(translation_JS == null || translation_JS == 'en'){
            quitName.innerHTML = "Quit";
          } else {
            quitName.innerHTML = "Удалить";
          }
          quitName.className = 'badge badge-gradient-danger lang';
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
  }

  /**
  * @return {string}
   *  Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved.
   */

  function toComeInButton(obj) {
    //обработка редактирования строки...
      var objId = obj.id;

        var itemsArray = [{
          OrganizationId: objId,
          OwnerEmail: EmailLocalStorage,
          ProviderId: "TMR-24.com"
        }];
      localStorage.setItem('TMR::rememberedAdmin', JSON.stringify(itemsArray));
      window.location.replace("indexAdminOrganization.html");
    }

    /**
    * @return {string}
     *  Обработчик кнопки quitColumn из таблицы List Of Organizations In Which You Are Involved.
     */

    function quitButton(obj) {
    var objId = obj.id;
    if(translation_JS == null || translation_JS == 'en'){
      alert('Document successfully deleted! '+ (objId));
    } else {
      alert('Документ успешно удален! '+ (objId));
    }
      db.collection("Organization").doc(objId).delete().then(function() {
          console.log("Document successfully deleted!");
          window.location.reload();
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    }
/**
* @return {string}
 *  Обработчик кнопки toComeInUserColumn из таблицы List of posts in which you are involved as a User из firestore.
 */

function toComeInButtonUser(obj) {
  //обработка редактирования строки...
    var objItem = obj.item;
      var itemsArray = [{
        OwnerEmail: EmailLocalStorage,
        ProviderId: "TMR-24.com",
        ParentHierarchy: objItem
      }];
    localStorage.setItem('TMR::rememberedUser', JSON.stringify(itemsArray));
    window.location.replace("indexUser.html");
  }

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
