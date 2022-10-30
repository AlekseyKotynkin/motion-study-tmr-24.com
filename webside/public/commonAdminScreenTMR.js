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
var nameOrganization = "";
var nameSubdivision = "";
var namePosition = "";
var idDocPosition = "";
var idDocOrganization = "";
var idDocSubdivision = "";
var itemsName = [];
var itemsListUser = [];





/**
* @return {string}
*  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
*/
var LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
var UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
var EmailLocalStorage = (LocalStorageValueObject[0]).email;
var FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;

/**
* @return {string}
*  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
*/

//Получение данных для таблицы Список организаций

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

    // var statusUserColumn = document.createElement('td');
    // statusUserColumn.innerHTML = doc.data().OwnerEmail;

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
    toComeInUserName.setAttribute('onclick', 'adminScreenTMR_Select_an_organization(this)');

    var toComeInUserColumn = document.createElement('td');
    toComeInUserColumn.appendChild(toComeInUserName);

    tr.appendChild(organizationColumn);
    // tr.appendChild(statusUserColumn);
    tr.appendChild(toComeInUserColumn);

    var container = document.getElementById("modal_adminScreenTMR_TableOrganization").getElementsByTagName("tbody")[0];

    container.appendChild(tr);
  });
})
.catch((error) => {
  console.log("Error getting documents: ", error);
})


/**
* @return {string}
*  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
*/
function list_own_organizations_adminScreen(){
  $('#modal_adminScreenTMR_Choosing_an_Organization').modal('show');
}

//Получение данных для таблицы List Of Posts In Which You Are Involved As A User из firestore.. Список подразделений, должностей и сотрудников

function adminScreenTMR_Select_an_organization(obj) {
  //обработка редактирования строки...
  itemsName = [];
  var objItem = obj.item;
  var idDocOrganization = obj.id;
  var nameOrganization = objItem.Organization;
  $('#modal_adminScreenTMR_Choosing_an_Organization').modal('toggle');
  itemsName.push({[idDocOrganization]: nameOrganization});
  // очищаем и заполняем шабку выбора Организации
  my_div_User = document.getElementById("adminScreenTMR_Choosing_an_Organization");
  var ul_User = my_div_User.querySelector("h4");
  ul_User.remove();
  if(translation_JS == null || translation_JS == 'en'){
    var li ='<h4 class="card-description">Organization Report: '+(nameOrganization)+'</h4>';
    var li_1 ='<p class="card-description">A list of users : </p>';
    var li_2 ='<button onclick="list_user_adminScreen" target="_blank" class="btn ml-auto btn-inverse-primary btn-fw">List users</button>';
  } else {
    var li ='<h4 class="card-description">Отчет по организации: '+(nameOrganization)+'</h4>';
    var li_1 ='<p class="card-description">Выбрать список сотрудников : </p>';
    var li_2 ='<button onclick="list_user_adminScreen" target="_blank" class="btn ml-auto btn-inverse-primary btn-fw">Список сотрудников</button>';
  }
  my_div_User.insertAdjacentHTML('afterbegin', li);
  my_div_User.insertAdjacentHTML('beforeend', li_1);
  my_div_User.insertAdjacentHTML('beforeend', li_2);
  // //очистить таблицу
  // var tableMyOrganization = document.getElementById("tableAvalableSubdivision_Admin");
  // for(var k = 1; k<tableMyOrganization.rows.length;){
  //   tableMyOrganization.deleteRow(k);
  // }
  // //очистить таблицу
  // var table = document.getElementById("tableChangeUser_Admin");
  // for(var i = 1; i<table.rows.length;){
  //   table.deleteRow(i);
  // }
  // //очистить таблицу
  // var tableDuble = document.getElementById("tableDetailingShift_Admin");
  // for(var l = 1; l<tableDuble.rows.length;){
  //   tableDuble.deleteRow(l);
  // }
  //получаем список подразделений
  var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
  docRefOrganization.collection("Subdivision").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      var idDocSubdivision = doc.id;
      var nameSubdivision = doc.data().Subdivision;
      // itemsName.push({...{[idDocSubdivision]: nameSubdivision}});
      itemsName.push({[idDocSubdivision]: nameSubdivision});
      //получаем список должностей
      var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
      docRefSubdivision.collection("Position").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          var idDocPosition = doc.id;
          var namePosition = doc.data().Position;
          // itemsName.push({...{[idDocPosition]: namePosition}});
          itemsName.push({[idDocPosition]: namePosition});
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
              var idDocOrganization_local = doc.data().idDocOrganization;
              var idDocSubdivision_local = doc.data().idDocSubdivision;
              var idDocPosition_local = doc.data().idDocPosition;
              itemsListUser.push({[idDocUser]: doc.data()});
              //заполняем таблицу
              var tr = document.createElement("tr");

              var toDismissColumn1 = document.createElement('input');
              toDismissColumn1.type = "checkbox";
              toDismissColumn1.checked = true;
              toDismissColumn1.className = 'form-check';
              toDismissColumn1.addEventListener("click", function(e) {console.log("checkbox");  });

              var toDismissColumn = document.createElement('td');
              toDismissColumn.appendChild(toDismissColumn1);

              var userName_tr = document.createElement('td');
              userName_tr.innerHTML = userName;

              var userEmail_tr = document.createElement('td');
              userEmail_tr.innerHTML = userEmail;
              //
              var userСomment_tr = document.createElement('td');
              userСomment_tr.innerHTML = userСomment;
              //
              // var organizationColumn = document.createElement('td');
              // itemsName.forEach((element, index, array) => {
              //   if(element[idDocOrganization_local] !== undefined){
              //     organizationColumn.innerHTML = element[idDocOrganization_local];
              //   }
              // });
              //
              var subdivisionColumn = document.createElement('td');
              itemsName.forEach((element, index, array) => {
                if(element[idDocSubdivision_local] !== undefined){
                  subdivisionColumn.innerHTML = element[idDocSubdivision_local];
                }
              });
              //
              var positionColumn = document.createElement('td');
              itemsName.forEach((element, index, array) => {
                if(element[idDocPosition_local] !== undefined){
                  positionColumn.innerHTML = element[idDocPosition_local];
                }
              });
              //
              // var toComeInUserName = document.createElement('button');
              // if(translation_JS == null || translation_JS == 'en'){
              //   toComeInUserName.innerHTML = "To come in";
              // } else {
              //   toComeInUserName.innerHTML = "Выбрать";
              // }
              // toComeInUserName.className = 'badge badge-gradient-success';
              // toComeInUserName.id = idDocUser;
              // toComeInUserName.item = doc.data();
              // toComeInUserName.setAttribute('onclick', 'toComeInButtonShift_Admin(this)');
              //
              // var toComeInUserColumn = document.createElement('td');
              // toComeInUserColumn.appendChild(toComeInUserName);

              tr.appendChild(toDismissColumn);
              // tr.appendChild(organizationColumn);
              tr.appendChild(userEmail_tr);
              tr.appendChild(userName_tr);
              tr.appendChild(userСomment_tr);
              tr.appendChild(subdivisionColumn);
              tr.appendChild(positionColumn);


              var container = document.getElementById("modal_adminScreenTMR_TableUsers").getElementsByTagName("tbody")[0];

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
*  Заполняем таблички диаграмм занятости выбранных сотрудников
*/
function modal_adminScreenTMR_TableUsers_Edit(){



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

//  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
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
    window.location.replace("../../index.html")
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
