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
var items = [];
// var itemsUserName = [];
var itemsName = [];
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
 * Получение данных для таблицы List of own organizations из firestore
 */
 db.collection("Organization").where("OwnerEmail", "==", EmailLocalStorage)
     .get()
     .then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
             // doc.data() is never undefined for query doc snapshots
             console.log(doc.id, " => ", doc.data());
             var idDocOrganization = doc.id;
             var item = doc.data();
             var nameOrganization = doc.data().Organization;
             ////
             var tr = document.createElement("tr");

             var statusUserColumn = document.createElement('td');
             statusUserColumn.innerHTML = doc.data().OwnerEmail;

             var organizationColumn = document.createElement('td');
             organizationColumn.innerHTML = doc.data().Organization;

             var toComeInUserName = document.createElement('button');
             if(translation_JS == null || translation_JS == 'en'){
               toComeInUserName.innerHTML = "To come in";
             } else {
               toComeInUserName.innerHTML = "Выбрать";
             }
             toComeInUserName.className = 'badge badge-gradient-success';
             toComeInUserName.id = doc.id;
             toComeInUserName.item = doc.data();
             toComeInUserName.setAttribute('onclick', 'toComeInButtonSubdivision_Admin(this)');

             var toComeInUserColumn = document.createElement('td');
             toComeInUserColumn.appendChild(toComeInUserName);

             tr.appendChild(organizationColumn);
             tr.appendChild(statusUserColumn);
             tr.appendChild(toComeInUserColumn);

             var container = document.getElementById("tableAvalableUserMyOrganization_Admin").getElementsByTagName("tbody")[0];

             container.appendChild(tr);
         });
     })
     .catch((error) => {
         console.log("Error getting documents: ", error);
     });

 /**
 * @return {string}
  *  Получение данных для таблицы List Of Posts In Which You Are Involved As A User из firestore..
  */

  function toComeInButtonSubdivision_Admin(obj) {
    //обработка редактирования строки...
    var objItem = obj.item;
    var idDocOrganization = obj.id;
    var nameOrganization = objItem.Organization;
    itemsName.push({...{idDocOrganization: nameOrganization}});
    //
    var tableMyOrganization = document.getElementById("tableAvalableSubdivision_Admin");
    for(var k = 1; k<tableMyOrganization.rows.length;){
      tableMyOrganization.deleteRow(k);
    }
    //
    var table = document.getElementById("tableChangeUser_Admin");
    for(var i = 1; i<table.rows.length;){
      table.deleteRow(i);
    }
    //
    var tableDuble = document.getElementById("tableDetailingShift_Admin");
    for(var l = 1; l<tableDuble.rows.length;){
      tableDuble.deleteRow(l);
    }
    //получаем список подразделений
    var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
    docRefOrganization.collection("Subdivision").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        var idDocSubdivision = doc.id;
        var nameSubdivision = doc.data().Subdivision;
        itemsName.push({...{idDocSubdivision: nameSubdivision}});
        //получаем список должностей
        var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
        docRefSubdivision.collection("Position").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var idDocPosition = doc.id;
            var namePosition = doc.data().Position;
            itemsName.push({...{idDocPosition: namePosition}});
            //получаем список пользователей
            var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
            docRefPosition.collection("PositionUser").get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                var idDocUser = doc.id;
                var userName = doc.data().UserName;
                var userEmail = doc.data().UserEmail;
                var userСomment = doc.data().UserСomment;
                var idDocOrganization = doc.data().idDocOrganization;
                var idDocSubdivision = doc.data().idDocSubdivision;
                var idDocPosition = doc.data().idDocPosition;
                //заполняем таблицу
                var tr = document.createElement("tr");

                var userName_tr = document.createElement('td');
                userName_tr.innerHTML = userName;

                var userEmail_tr = document.createElement('td');
                userEmail_tr.innerHTML = userEmail;

                var userСomment_tr = document.createElement('td');
                userСomment_tr.innerHTML = userСomment;

                var organizationColumn = document.createElement('td');
                organizationColumn.innerHTML = itemsName.idDocOrganization;

                var subdivisionColumn = document.createElement('td');
                subdivisionColumn.innerHTML = itemsName.idDocSubdivision;

                var positionColumn = document.createElement('td');
                positionColumn.innerHTML = itemsName.idDocPosition;

                var toComeInUserName = document.createElement('button');
                if(translation_JS == null || translation_JS == 'en'){
                  toComeInUserName.innerHTML = "To come in";
                } else {
                  toComeInUserName.innerHTML = "Выбрать";
                }
                toComeInUserName.className = 'badge badge-gradient-success';
                toComeInUserName.id = idDocUser;
                toComeInUserName.item = doc.data();
                toComeInUserName.setAttribute('onclick', 'toComeInButtonEvent_Admin(this)');

                var toComeInUserColumn = document.createElement('td');
                toComeInUserColumn.appendChild(toComeInUserName);

                tr.appendChild(organizationColumn);
                tr.appendChild(subdivisionColumn);
                tr.appendChild(positionColumn);
                tr.appendChild(userName_tr);
                tr.appendChild(userEmail_tr);
                tr.appendChild(userСomment_tr);
                tr.appendChild(toComeInUserColumn);

                var container = document.getElementById("tableAvalableSubdivision_Admin").getElementsByTagName("tbody")[0];

                container.appendChild(tr);
                //end заполняем таблицу
              });
            });
            //end получаем список пользователей
          });
        });
        //end получаем список должностей
      });
    });
    //end получаем список подразделений
}

/**
* @return {string}
 *  Получение данных для таблицы List Of Posts In Which You Are Involved As A User из firestore..
 */

 function toComeInButtonShift_Admin(obj) {
   //обработка редактирования строки...
   var objItem = obj.item;
   var idDocPosition = objItem.idDocPosition;
   var userEmail = objItem.UserEmail;
   var itemsActiveUserName = [];

   var table = document.getElementById("tableChangeUser_Admin");
   for(var i = 1;i<table.rows.length;){
     table.deleteRow(i);
   }

   var tableDuble = document.getElementById("tableDetailingShift_Admin");
   for(var l = 1; l<tableDuble.rows.length;){
     tableDuble.deleteRow(l);
   }

   db.collection("WorkShift").where('EmailPositionUser', '==', userEmail).where("IdDocPosition","==", idDocPosition).where("WorkShiftEnd", "==", "false")
   .get()
   .then(function(querySnapshot) {
     querySnapshot.forEach(function(doc) {
       // doc.data() is never undefined for query doc snapshots
       var parentHierarchyDoc = doc.data().ParentHierarchyPositionUser;
       var idDocOrganization = parentHierarchyDoc.idDocOrganization;
       var idDocSubdivision = parentHierarchyDoc.idDocSubdivision;
       var idDocPosition = parentHierarchyDoc.idDocPosition;
       itemsActiveUserName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: idDocPosition},...{idDocSubdivision: idDocSubdivision},...{idDocOrganization: idDocOrganization}});
     });
     itemsActiveUserName = itemsActiveUserName.sort(( a, b ) => b.WorkShiftStartTime - a.WorkShiftStartTime);
     itemsActiveUserName.forEach(function(element){
       var idDocOrganization = element.idDocOrganization ;
       var idDocSubdivision = element.idDocSubdivision ;
       var idDocPosition = element.idDocPosition ;
       var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
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
       var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
       var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
             var workShiftEndTime = item.WorkShiftEndTime;
             nameOfYourManagerColumn.innerHTML = new Date(workShiftEndTime.toDate()).toUTCString();

             var statusUserColumn = document.createElement('td');
             var workShiftStartTime = item.WorkShiftStartTime;
             statusUserColumn.innerHTML = new Date(workShiftStartTime.toDate()).toUTCString();

             var formattedColumn = document.createElement('td');
             var workShiftFormattedTime = workShiftEndTime - workShiftStartTime;
             var timestamp = new Date(workShiftFormattedTime).getTime();
             var hours = Math.floor(timestamp / 60 / 60);
             if (hours < 10) {
               hours = '0' + hours
             };
             var minutes = Math.floor(timestamp / 60) - (hours * 60);
             if (minutes < 10) {
               minutes = '0' + minutes
             };
             var seconds = timestamp % 60;
             if (seconds < 10) {
               seconds = '0' + seconds
             };
             var formatted = hours + ':' + minutes + ':' + seconds;
             formattedColumn.innerHTML = formatted;

             var toComeInUserName = document.createElement('button');
             if(translation_JS == null || translation_JS == 'en'){
               toComeInUserName.innerHTML = "To come in";
             } else {
               toComeInUserName.innerHTML = "Выбрать";
             }
             toComeInUserName.className = 'badge badge-gradient-success';
             toComeInUserName.id = item.idDocPositionUser;
             toComeInUserName.item = item;
             toComeInUserName.setAttribute('onclick', 'toComeInButtonEvent_Admin(this)');

             var toComeInUserColumn = document.createElement('td');
             toComeInUserColumn.appendChild(toComeInUserName);

             tr.appendChild(statusUserColumn);
             tr.appendChild(nameOfYourManagerColumn);
             tr.appendChild(formattedColumn);
             tr.appendChild(positionColumn);
             tr.appendChild(subdivisionColumn);
             tr.appendChild(organizationColumn);
             tr.appendChild(toComeInUserColumn);

             var container = document.getElementById("tableChangeUser_Admin").getElementsByTagName("tbody")[0];

             container.appendChild(tr);
           });
         });
       });
     })
     .catch(function(error) {
       console.log("Error getting documents: ", error);
     });
   }

   /**
   * @return {string}
   * Получение данных для таблицы Detailing Of The Selected Shift из firestore
   */
   function toComeInButtonEvent_Admin(objs) {
     //обработка редактирования строки...
     // let objItem = obj.item;
     var itemsShiftDoc = [];
     var nameDocShift = objs.id;
     // let nameDocShift = nameDocShiftDoc.IdDocPosition;

     var tableDuble = document.getElementById("tableDetailingShift_Admin");
     for(var i = 1;i<tableDuble.rows.length;){
       tableDuble.deleteRow(i);
     };

     var docRefShift = db.collection("WorkShift").doc(nameDocShift);
     docRefShift.collection("ProcessUser").get().then(function(querySnapshot) {
       querySnapshot.forEach(function(doc) {
         // doc.data() is never undefined for query doc snapshots
         console.log(doc.id, " => ", doc.data());
         itemsShiftDoc.push({...doc.data(),...{idDocShift: doc.id}});
       });
       itemsShiftDoc = itemsShiftDoc.sort(( a, b ) => b.ProcessUserStartTime - a.ProcessUserStartTime);
       itemsShiftDoc.forEach(item =>
         {
           var tr = document.createElement("tr");

           var timeStartShiftColumn = document.createElement('td');
           var processUserStartTime = item.ProcessUserStartTime;
           timeStartShiftColumn.innerHTML = new Date(processUserStartTime.toDate()).toUTCString();

           var timeEndShiftColumn = document.createElement('td');
           var processUserEndTime = item.ProcessUserEndTime;
           timeEndShiftColumn.innerHTML = new Date(processUserEndTime.toDate()).toUTCString();

           var nameShiftColumn = document.createElement('td');
           nameShiftColumn.innerHTML = item.NameDocProcessButton;

           var formattedColumn = document.createElement('td');
           var processUserFormattedTime = processUserEndTime - processUserStartTime;
           var timestamp = new Date(processUserFormattedTime).getTime();
           var hours = Math.floor(timestamp / 60 / 60);
           if (hours < 10) {
             hours = '0' + hours
           };
           var minutes = Math.floor(timestamp / 60) - (hours * 60);
           if (minutes < 10) {
             minutes = '0' + minutes
           };
           var seconds = timestamp % 60;
           if (seconds < 10) {
             seconds = '0' + seconds
           };
           var formatted = hours + ':' + minutes + ':' + seconds;
           formattedColumn.innerHTML = formatted;

           var toComeInUserName = document.createElement('button');
           if(translation_JS == null || translation_JS == 'en'){
             toComeInUserName.innerHTML = "To come in";
           } else {
             toComeInUserName.innerHTML = "Выбрать";
           }
           toComeInUserName.className = 'badge badge-gradient-success';
           toComeInUserName.id = item.idDocShift;
           toComeInUserName.item = item;
           toComeInUserName.setAttribute('onclick', 'gridSystemModalInfoEventID_Admin(this)');

           var toComeInUserColumn = document.createElement('td');
           toComeInUserColumn.appendChild(toComeInUserName);

           tr.appendChild(timeStartShiftColumn);
           tr.appendChild(timeEndShiftColumn);
           tr.appendChild(formattedColumn);
           tr.appendChild(nameShiftColumn);
           tr.appendChild(toComeInUserColumn);

           var container = document.getElementById("tableDetailingShift_Admin").getElementsByTagName("tbody")[0];

           container.appendChild(tr);
         });
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
  *  Обработка модального окна подробная информация по документу событие.
  */

  function gridSystemModalInfoEventID_Admin(objsi)
  {
    var idEventDoc = objsi.id;
    var idEventItem = objsi.item;
    var processUserStartTime = idEventItem.ProcessUserStartTime;
    var processUserEndTime = idEventItem.ProcessUserEndTime;
    var timeStartShift = new Date(processUserStartTime.toDate()).toUTCString();
    var timeEndShift = new Date(processUserEndTime.toDate()).toUTCString();
    var processUserFormattedTime = processUserEndTime - processUserStartTime;
    var timestamp = new Date(processUserFormattedTime).getTime();
    var hours = Math.floor(timestamp / 60 / 60);
    if (hours < 10) {
      hours = '0' + hours
    };
    var minutes = Math.floor(timestamp / 60) - (hours * 60);
    if (minutes < 10) {
      minutes = '0' + minutes
    };
    var seconds = timestamp % 60;
    if (seconds < 10) {
      seconds = '0' + seconds
    };
    var formatted = hours + ':' + minutes + ':' + seconds;
    var nameDocProcessButton = idEventItem.NameDocProcessButton;
    var processUserEnd = idEventItem.ProcessUserEnd;
    var commitDescriptioText = idEventItem.CommitDescriptioText;
    if (commitDescriptioText === undefined) {
      commitDescriptioText = 'no data'
    };
    var resultControlButton = idEventItem.ResultControlButton;
    if (resultControlButton === undefined) {
      resultControlButton = 'no data'
    };

    document.getElementById("nameEvent").innerHTML = "Name: "+ nameDocProcessButton;
    document.getElementById("timeStartEvent").innerHTML = "Start time: "+ timeStartShift;
    document.getElementById("timeEndEvent").innerHTML = "End time: "+ timeEndShift;
    document.getElementById("eventDuration").innerHTML = "Duration: "+ formatted;
    document.getElementById("commitDescriptioText").innerHTML = "Comment: "+ commitDescriptioText;
    document.getElementById("resultControlButton").innerHTML = "Test case: "+ resultControlButton;

    $(document).ready(function(){
      $("#gridSystemModalInfoEventID_Admin").modal("show");
    });
  }


    /**
    * @return {string}
     *  Получение данных для таблицы List Of Organizations In Which You Are Involved из firestore.
     */

    function createATableOfClientAdmin()
    {

    };

  /**
  * @return {string}
   *  Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved.
   */

  function toComeInButton(obj) {
    //обработка редактирования строки...
      var objId = obj.id;

      //   let itemsArray = [{
      //     OrganizationId: objId,
      //     OwnerEmail: EmailLocalStorage,
      //     ProviderId: "TMR-24.com"
      //   }];
      // localStorage.setItem('TMR::rememberedAdmin', JSON.stringify(itemsArray));
      // window.location.replace("indexAdminOrganization.html");
    };


    /**
    * @return {string}
     *  Обработчик кнопки quitColumn из таблицы List Of Organizations In Which You Are Involved.
     */

    function quitButton(obj) {
    var objId = obj.id;
    // alert('Document successfully deleted! '+ (objId));
    //   db.collection("Organization").doc(objId).delete().then(function() {
    //       console.log("Document successfully deleted!");
    //       window.location.reload();
    //   }).catch(function(error) {
    //       console.error("Error removing document: ", error);
    //   });

    };




/**
* @return {string}
 *  Обработчик кнопки toComeInUserColumn из таблицы List of posts in which you are involved as a User из firestore.
 */

function toComeInButtonUser(obj) {
  //обработка редактирования строки...
    var objItem = obj.item;
    //   let itemsArray = [{
    //     OwnerEmail: EmailLocalStorage,
    //     ProviderId: "TMR-24.com",
    //     ParentHierarchy: objItem
    //   }];
    // localStorage.setItem('TMR::rememberedUser', JSON.stringify(itemsArray));
    // window.location.replace("indexUser.html");
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
  //
