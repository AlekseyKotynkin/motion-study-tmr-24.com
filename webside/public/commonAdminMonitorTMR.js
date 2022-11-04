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
var itemsMyListUser = [];
var itemsMyOrganization = [];
var itemListShift_local = [];

//////
var color_Green = '#0af521'; //зеленый
var color_Yellow = '#e9f50a'; //желтый
var color_Orange = '#f0430a'; //оранжевый
var color_Red = '#d22830'; //красный
var addRows_data = [];
/////

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
    itemsMyOrganization.push({idDocOrganization: idDocOrganization, nameOrganization: nameOrganization});
  });
})
.catch((error) => {
  console.log("Error getting documents: ", error);
})

/**
* @return {string}
*  Формируем таблицу доступных Организаций.
*/
function list_own_organizations_adminMonitorTMR(){
  var liLast_Title = document.getElementById('adminMonitorTMR_Monitor_Title');
  if(liLast_Title !== null){
    liLast_Title.remove();
  }
  ///
  var liLast_Gant = document.getElementById('adminMonitorTMR_Monitor_Shift');
  if(liLast_Gant !== null){
    liLast_Gant.remove();
  }
  ///
  var liLast_0 = document.getElementById('adminMonitorTMR_ActivWindows');
  if(liLast_0 !== null){
    liLast_0.remove();
  }
  if(translation_JS == null || translation_JS == 'en'){
    var html = [
        '<div class="row" id="adminMonitorTMR_ActivWindows">',
          '<div class="col-12 grid-margin">',
            '<div class="card">',
              '<div class="card-body">',
                '<h4 class="card-description lang" key="list_own_organizations">List of own organizations</h4>',
                '<div class="table-responsive">',
                  '<table id="modal_adminMonitorTMR_TableOrganization" class="table">',
                    '<thead>',
                      '<tr>',
                        '<th class="lang" key="organization"> Organization </th>',
                        '<th></th>',
                      '</tr>',
                    '</thead>',
                      '<tbody>',
                      '</tbody>',
                   '</table>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>'
    ].join('');
  } else {
    var html = [
        '<div class="row" id="adminMonitorTMR_ActivWindows">',
          '<div class="col-12 grid-margin">',
            '<div class="card">',
              '<div class="card-body">',
                '<h4 class="card-description lang" key="list_own_organizations">Список собственных организаций</h4>',
                '<div class="table-responsive">',
                  '<table id="modal_adminMonitorTMR_TableOrganization" class="table">',
                    '<thead>',
                      '<tr>',
                        '<th class="lang" key="organization"> Наименование организации </th>',
                        '<th></th>',
                      '</tr>',
                    '</thead>',
                      '<tbody>',
                      '</tbody>',
                   '</table>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>'
    ].join('');
  }
  var liLast = document.getElementById('adminMonitorTMR_Monitor');
  liLast.insertAdjacentHTML('afterbegin', html);
  //
  itemsMyOrganization.forEach(item => {

    var tr = document.createElement("tr");

    var organizationColumn = document.createElement('td');
    organizationColumn.innerHTML = item.nameOrganization;

    var toComeInUserName = document.createElement('button');
    if(translation_JS == null || translation_JS == 'en'){
      toComeInUserName.innerHTML = "To come in";
    } else {
      toComeInUserName.innerHTML = "Выбрать";
    }
    toComeInUserName.className = 'badge badge-gradient-success';
    toComeInUserName.id = item.idDocOrganization;
    toComeInUserName.item = item;
    toComeInUserName.setAttribute('onclick', 'adminMonitorTMR_Select_an_organization(this)');

    var toComeInUserColumn = document.createElement('td');
    toComeInUserColumn.appendChild(toComeInUserName);

    tr.appendChild(organizationColumn);
    tr.appendChild(toComeInUserColumn);

    var container = document.getElementById("modal_adminMonitorTMR_TableOrganization").getElementsByTagName("tbody")[0];

    container.appendChild(tr);
  });

}

//Получение открытых смен и устанавливаем слушатель по данной организации.

function adminMonitorTMR_Select_an_organization(obj) {
  //обработка редактирования строки...
  itemsName = [];
  var objItem = obj.item;
  var idDocOrganization = obj.id;
  var nameOrganization = objItem.nameOrganization;
  itemsName.push({[idDocOrganization]: nameOrganization});
  //
  var liLast_Gant = document.getElementById('adminMonitorTMR_Monitor_Shift');
  if(liLast_Gant !== null){
    liLast_Gant.remove();
  }
  ///
  var liLast_Title = document.getElementById('adminMonitorTMR_Monitor_Title');
  if(liLast_Title !== null){
    liLast_Title.remove();
  }
  if(translation_JS == null || translation_JS == 'en'){
    var html_title = [
      '<div class="row" id = "adminMonitorTMR_Monitor_Title">',
        '<div class="col-12">',
          '<span class="d-flex align-items-center purchase-popup" id="adminMonitorTMR_Choosing_an_Organization">',
            '<h4 class="card-description">Organization Report: '+(nameOrganization)+'</h4>',
            '<button onclick="list_own_organizations_adminMonitorTMR()" target="_blank" class="btn ml-auto btn-inverse-primary btn-fw lang" key="list_own_organizations" >List of own organizations</button>',
            '<p class="card-description">A list of users : </p>',
            // '<button onclick="list_user_adminScreen" target="_blank" class="btn ml-auto btn-inverse-primary btn-fw">List users</button>',
          '</span>',
        '</div>',
      '</div>'
    ].join('');
  } else {
    var html_title = [
      '<div class="row" id = "adminMonitorTMR_Monitor_Title">',
        '<div class="col-12">',
          '<span class="d-flex align-items-center purchase-popup" id="adminMonitorTMR_Choosing_an_Organization">',
            '<h4 class="card-description">Отчет по организации: '+(nameOrganization)+'</h4>',
            '<button onclick="list_own_organizations_adminMonitorTMR()" target="_blank" class="btn ml-auto btn-inverse-primary btn-fw lang" key="list_own_organizations" >Список собственных организаций</button>',
            '<p class="card-description">Выбрать список сотрудников : </p>',
            // '<button onclick="list_user_adminScreen" target="_blank" class="btn ml-auto btn-inverse-primary btn-fw">Список сотрудников</button>',
          '</span>',
        '</div>',
      '</div>'
    ].join('');
  }
  var liLast_title_0 = document.getElementById('adminMonitorTMR_Monitor');
  liLast_title_0.insertAdjacentHTML('afterbegin', html_title);
  //
  var liLast_0 = document.getElementById('adminMonitorTMR_ActivWindows');
  if(liLast_0 !== null){
    liLast_0.remove();
  }
  //
  if(translation_JS == null || translation_JS == 'en'){
    var html = [
        '<div class="row" id="adminMonitorTMR_ActivWindows">',
          '<div class="col-12 grid-margin">',
            '<div class="card">',
              '<div class="card-body">',
                '<h4 class="card-description lang" key="list_users">List users - '+(nameOrganization)+':</h4>',
                '<div class="table-responsive">',
                  '<table id="modal_adminMonitorTMR_TableUsers"class="table">',
                    '<thead>',
                      '<tr>',
                        '<th class="lang" key="subdivision">Subdivision</th>',
                        '<th class="lang" key="position">Position</th>',
                        '<th class="lang" key="users_name">Name</th>',
                        '<th class="lang" key="email">Email</th>',
                        '<th class="lang" key="start_shift">Start of shift</th>',
                        '<th class="lang" key="active_button">Active button</th>',
                        '<th class="lang" key="timeStart_active_button">Start of events</th>',
                      '</tr>',
                    '</thead>',
                      '<tbody>',
                      '</tbody>',
                   '</table>',
                '</div>',
                '<div class="form-group row">',
                  // '<label class="col-12 col-form-label lang" key="data_on">On the date:</label>',
                  '<div class="col-12">',
                    // '<input class="form-control" type="date" id="adminMonitorTMR_ActivWindows_data" name="date" style="width: 150px;" required/>',
                      // '</div>',
                      // '<div class="col-sm-6 col-form-label">',
                    // '<button type="button" class="btn btn-primary btn-lg" onclick="modal_adminMonitorTMR_Table_Activ()">Select employees</button>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>'
    ].join('');
  } else {
    var html = [
        '<div class="row" id="adminMonitorTMR_ActivWindows">',
          '<div class="col-12 grid-margin">',
            '<div class="card">',
              '<div class="card-body">',
                '<h4 class="card-description lang" key="list_position_shifts">Список пользователей - '+(nameOrganization)+':</h4>',
                '<div class="table-responsive">',
                  '<table id="modal_adminMonitorTMR_TableUsers"class="table">',
                    '<thead>',
                      '<tr>',
                        '<th class="lang" key="subdivision">Подразделение</th>',
                        '<th class="lang" key="position">Должность</th>',
                        '<th class="lang" key="users_name">ФИО</th>',
                        '<th class="lang" key="email">Логин</th>',
                        '<th class="lang" key="start_shift">Начало смены</th>',
                        '<th class="lang" key="active_button">Активная кнопка</th>',
                        '<th class="lang" key="timeStart_active_button">Начало события</th>',
                      '</tr>',
                    '</thead>',
                      '<tbody>',
                      '</tbody>',
                   '</table>',
                '</div>',
                '<div class="form-group row">',
                  // '<label class="col-12 col-form-label lang" key="data_on">На дату:</label>',
                  '<div class="col-12">',
                    // '<input class="form-control" type="date" id="adminMonitorTMR_ActivWindows_data" name="date" style="width: 150px;" required/>',
                    //   '</div>',
                    //   '<div class="col-sm-6 col-form-label">',
                    // '<button type="button" class="btn btn-primary btn-lg" onclick="modal_adminMonitorTMR_Table_Activ()">Выбрать сотрудников</button>',
                  '</div>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>'
    ].join('');
  }
  var liLast = document.getElementById('adminMonitorTMR_Monitor_Title');
  liLast.insertAdjacentHTML('afterEnd', html);
  /// получаем список открытых смен и активных событий

  db.collection("WorkShift").where("WorkShiftEnd", "==", "")
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              var idDocShift_local = doc.id;
              var workShiftStartTime = doc.data().WorkShiftStartTime;
              var parentHierarchyPositionUser_local = doc.data().ParentHierarchyPositionUser;
              var nameSubdivision = parentHierarchyPositionUser_local.NameSubdivision;
              var namePosition = parentHierarchyPositionUser_local.NamePosition;
              var userName = parentHierarchyPositionUser_local.UserName;
              var userEmail = parentHierarchyPositionUser_local.UserEmail;
              var idDocOrganization_local = parentHierarchyPositionUser_local.idDocOrganization;
              if (idDocOrganization_local == idDocOrganization){
                 var docRef = db.collection("WorkShift").doc(idDocShift_local);
                 docRef.collection("ProcessUser").where("ProcessUserEnd", "==", "")
                     .get()
                     .then((querySnapshot) => {
                         querySnapshot.forEach((doc) => {
                             // doc.data() is never undefined for query doc snapshots
                             console.log(doc.id, " => ", doc.data());
                             var docProcessUser = doc.data();
                             var nameDocProcessButton = doc.data().NameDocProcessButton;
                             var processUserStartTime = doc.data().ProcessUserStartTime;
                             var settingsSalesFunnel_Stage_key = doc.data().SettingsSalesFunnel_Stage_key;
                             //заполняем таблицу
                             var tr = document.createElement("tr");

                             var nameSubdivision_tr = document.createElement('td');
                             nameSubdivision_tr.innerHTML = nameSubdivision;

                             var namePosition_tr = document.createElement('td');
                             namePosition_tr.innerHTML = namePosition;

                             var userName_tr = document.createElement('td');
                             userName_tr.innerHTML = userName;

                             var userEmail_tr = document.createElement('td');
                             userEmail_tr.innerHTML = userEmail;

                             var workShiftStartTime_tr = document.createElement('td');
                             workShiftStartTime_tr.innerHTML = new Date(workShiftStartTime.toDate()).toString();
                             ///

                             var to_nameDocProcessButton = document.createElement('button');
                             if(translation_JS == null || translation_JS == 'en'){
                               to_nameDocProcessButton.innerHTML = nameDocProcessButton;
                             } else {
                               if(nameDocProcessButton == "Expect"){
                                 to_nameDocProcessButton.innerHTML = "Ожидаю";
                               } else if (nameDocProcessButton == "Other") {
                                 to_nameDocProcessButton.innerHTML = "Другое";
                               } else if (nameDocProcessButton == "Gone"){
                                 to_nameDocProcessButton.innerHTML = "Отлучился";
                               } else {
                                 to_nameDocProcessButton.innerHTML = nameDocProcessButton;
                               }
                             }
                             // var settingsSalesFunnel_Stage_key_mapChartjs = doc.data().SettingsSalesFunnel_Stage_key;
                             if(settingsSalesFunnel_Stage_key === "str0"){
                               to_nameDocProcessButton.style.background = '#d22830';
                             }else if (settingsSalesFunnel_Stage_key === "str1"){
                               to_nameDocProcessButton.style.background = '#f0430a';
                             }else if (settingsSalesFunnel_Stage_key === "str2"){
                               to_nameDocProcessButton.style.background = '#e9f50a';
                             }else if (settingsSalesFunnel_Stage_key === "str3"){
                               to_nameDocProcessButton.style.background = '#0af521';
                             }else{
                               to_nameDocProcessButton.style.background = '#d22830';
                             }
                             to_nameDocProcessButton.className = 'btn btn-fw';

                             var nameDocProcessButton_tr = document.createElement('td');
                             nameDocProcessButton_tr.appendChild(to_nameDocProcessButton);

                             //
                             var processUserStartTime_tr = document.createElement('td');
                             processUserStartTime_tr.innerHTML = new Date(processUserStartTime.toDate()).toString();
                             //
                             tr.appendChild(nameSubdivision_tr);
                             tr.appendChild(namePosition_tr);
                             tr.appendChild(userName_tr);
                             tr.appendChild(userEmail_tr);
                             tr.appendChild(workShiftStartTime_tr);
                             tr.appendChild(nameDocProcessButton_tr);
                             tr.appendChild(processUserStartTime_tr);

                             var container = document.getElementById("modal_adminMonitorTMR_TableUsers").getElementsByTagName("tbody")[0];

                             container.appendChild(tr);
                             //end заполняем таблицу
                         });
                     })
                     .catch((error) => {
                         console.log("Error getting documents: ", error);
                     });
              }
          });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
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
///
