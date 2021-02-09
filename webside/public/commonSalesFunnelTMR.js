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
var db = firebase.firestore();
var storage = firebase.storage();
//
let nameOrganization = "";
let nameSubdivision = "";
let namePosition = "";



 /**
 * @return {string}
 *  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
 */
const LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
const UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
const EmailLocalStorage = (LocalStorageValueObject[0]).email;
const FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;
////
var docRefPosition = "";
//массив с настройками кнопок
let itemSettingsButton = [];

let itemsOrganizationName = [];
//переменные для диаграммы на страницы
let LABELS = [];
let dataNotAvailable = [];
let dataPerhaps = [];
let dataAvailable = [];





//////////////////////////////////////////////////////////////////////////////////
function gridDisplayOrganizationOwner() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListUser tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListSettings tbody').empty();
  //очищаем     docRefPosition = "";
   docRefPosition = "";
   // очистим таблицу настроек кнопок
   itemSettingsButton = [];
/**
* @return {string}
* Получение данных для таблицы List of own organizations из firestore с фильтром собственник организации
*/

db.collection("Organization").where("OwnerEmail", "==", EmailLocalStorage)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            let idDocOrganization = doc.id;
            let nameOrganization = doc.data().Organization;
            // alert('Compiling a list of users of your organization '+nameOrganization+'.');
            // * начало получаем коллекции которые относятся к Организации найденых по запросу выше
            var docRef = db.collection("Organization").doc(idDocOrganization);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    // console.log("Document data:", doc.data());
                    // начало* получаем коллекции которые относятся к Организации найденых по запросу выше
                    docRef.collection("Subdivision").get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            // console.log(doc.id, " => ", doc.data());
                            let idDocSubdivision = doc.id;
                            // начало* получаем id документов Subdivision найденых по запросу выше
                            var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
                            docRefSubdivision.get().then(function(doc) {
                                if (doc.exists) {
                                    // console.log("Document data:", doc.data());
                                    // начало* получаем id документов Position найденых по запросу выше
                                    docRefSubdivision.collection("Position").get().then(function(querySnapshot) {
                                       querySnapshot.forEach(function(doc) {
                                           // doc.data() is never undefined for query doc snapshots
                                           // console.log(doc.id, " => ", doc.data());
                                           // начало* получаем документы Position найденых по запросу выше
                                             let parentHierarchyDoc = doc.ref.path;
                                             let organizationDocId = parentHierarchyDoc.split("/")[1];
                                             let subdivisionDocId = parentHierarchyDoc.split("/")[3];
                                             let positionDocId = parentHierarchyDoc.split("/")[5];
                                             itemsOrganizationName = [];
                                             itemsOrganizationName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
                                             // console.log("1.1 => ",itemsOrganizationName);

                                             itemsOrganizationName.forEach(function(element){
                                               let organizationDocId = element.idDocOrganization ;
                                               let subdivisionDocId = element.idDocSubdivision ;
                                               let positionDocId = element.idDocPosition ;
                                               let docRefOrganization = db.collection("Organization").doc(organizationDocId);
                                                   docRefOrganization.get().then(function(doc) {
                                                   if (doc.exists) {
                                                       nameOrganization = doc.data().Organization;
                                                       element['NameOrganization'] = nameOrganization;
                                                   } else {
                                                       // console.log("No such document!");
                                                   }
                                               }).catch(function(error) {
                                                   // console.log("Error getting document:", error);
                                               });
                                               let docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
                                                   docRefSubdivision.get().then(function(doc) {
                                                   if (doc.exists) {
                                                       nameSubdivision = doc.data().Subdivision;
                                                       element['NameSubdivision'] = nameSubdivision;
                                                   } else {
                                                       // console.log("No such document!");
                                                   }
                                               }).catch(function(error) {
                                                   // console.log("Error getting document:", error);
                                               });
                                               let docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
                                                   docRefPosition.get().then(function(doc) {
                                                   if (doc.exists) {
                                                       namePosition = doc.data().Position;
                                                       element['NamePosition'] = namePosition;
                                                   } else {
                                                       // console.log("No such document!");
                                                   }
                                               }).catch(function(error) {
                                                   // console.log("Error getting document:", error);
                                               }).finally(() => {
                                                 [element].forEach(item =>
                                               {
                                                   var tr = document.createElement("tr");

                                                   var positionColumn = document.createElement('td');
                                                   positionColumn.innerHTML = item.NamePosition;

                                                   var subdivisionColumn = document.createElement('td');
                                                   subdivisionColumn.innerHTML = item.NameSubdivision;

                                                   var organizationColumn = document.createElement('td');
                                                   organizationColumn.innerHTML = item.NameOrganization;

                                                   var toComeInUserName = document.createElement('button');
                                                   toComeInUserName.innerHTML = "To come in";
                                                   toComeInUserName.className = 'badge badge-gradient-success';
                                                   toComeInUserName.id = item.idDocPositionUser;
                                                   toComeInUserName.item = item;
                                                   toComeInUserName.setAttribute('onclick', 'toComeInButtonPositionsListUser(this)');

                                                   var toComeInUserColumn = document.createElement('td');
                                                   toComeInUserColumn.appendChild(toComeInUserName);


                                                   tr.appendChild(positionColumn);
                                                   tr.appendChild(subdivisionColumn);
                                                   tr.appendChild(organizationColumn);
                                                   tr.appendChild(toComeInUserColumn);

                                                   var container = document.getElementById("tableAvalablePositionsList").getElementsByTagName("tbody")[0];

                                                   container.appendChild(tr);
                                                });
                                             });
                                           });
                                           // окончание* получаем документы Position найденых по запросу выше
                                       });
                                      });
                                    // начало* получаем id документов Position найденых по запросу выше
                                } else {
                                    // doc.data() will be undefined in this case
                                    // console.log("No such document!");
                                }
                            }).catch(function(error) {
                                // console.log("Error getting document:", error);
                            });
                            // окончание* получаем id документов Subdivision найденых по запросу выше
                        });
                    });
                    // окончание* получаем коллекции которые относятся к Организации найденых по запросу выше
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                }
            }).catch(function(error) {
                // console.log("Error getting document:", error);
            });
            // * окончание получаем коллекции которые относятся к Организации найденых по запросу выше
        });
    })
    .catch(function(error) {
        // console.log("Error getting documents: ", error);
    });

}
////////////////////////////////////////////////////////////////////////////////////
function gridDisplayManagerOrganization() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListUser tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListSettings tbody').empty();
  //очищаем     docRefPosition = "";
   docRefPosition = "";
   // очистим таблицу настроек кнопок
   itemSettingsButton = [];
/**
* @return {string}
* Получение данных для таблицы List of own organizations из firestore с фильтром менеджер организации
*/
db.collection("Organization").where("PositionOfYourManager", "==", EmailLocalStorage)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            let idDocOrganization = doc.id;
            let nameOrganization = doc.data().Organization;
            // alert('Compiling a list of users of your organization '+nameOrganization+'.');
            // * начало получаем коллекции которые относятся к Организации найденых по запросу выше
            var docRef = db.collection("Organization").doc(idDocOrganization);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    // console.log("Document data:", doc.data());
                    // начало* получаем коллекции которые относятся к Организации найденых по запросу выше
                    docRef.collection("Subdivision").get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            // console.log(doc.id, " => ", doc.data());
                            let idDocSubdivision = doc.id;
                            // начало* получаем id документов Subdivision найденых по запросу выше
                            var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
                            docRefSubdivision.get().then(function(doc) {
                                if (doc.exists) {
                                    // console.log("Document data:", doc.data());
                                    // начало* получаем id документов Position найденых по запросу выше
                                    docRefSubdivision.collection("Position").get().then(function(querySnapshot) {
                                       querySnapshot.forEach(function(doc) {
                                           // doc.data() is never undefined for query doc snapshots
                                           // console.log(doc.id, " => ", doc.data());
                                           // начало* получаем документы Position найденых по запросу выше
                                             let parentHierarchyDoc = doc.ref.path;
                                             let organizationDocId = parentHierarchyDoc.split("/")[1];
                                             let subdivisionDocId = parentHierarchyDoc.split("/")[3];
                                             let positionDocId = parentHierarchyDoc.split("/")[5];
                                             itemsOrganizationName = [];
                                             itemsOrganizationName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
                                             // console.log("1.1 => ",itemsOrganizationName);

                                             itemsOrganizationName.forEach(function(element){
                                               let organizationDocId = element.idDocOrganization ;
                                               let subdivisionDocId = element.idDocSubdivision ;
                                               let positionDocId = element.idDocPosition ;
                                               let docRefOrganization = db.collection("Organization").doc(organizationDocId);
                                                   docRefOrganization.get().then(function(doc) {
                                                   if (doc.exists) {
                                                       nameOrganization = doc.data().Organization;
                                                       element['NameOrganization'] = nameOrganization;
                                                   } else {
                                                       // console.log("No such document!");
                                                   }
                                               }).catch(function(error) {
                                                   // console.log("Error getting document:", error);
                                               });
                                               let docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
                                                   docRefSubdivision.get().then(function(doc) {
                                                   if (doc.exists) {
                                                       nameSubdivision = doc.data().Subdivision;
                                                       element['NameSubdivision'] = nameSubdivision;
                                                   } else {
                                                       // console.log("No such document!");
                                                   }
                                               }).catch(function(error) {
                                                   // console.log("Error getting document:", error);
                                               });
                                               let docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
                                                   docRefPosition.get().then(function(doc) {
                                                   if (doc.exists) {
                                                       namePosition = doc.data().Position;
                                                       element['NamePosition'] = namePosition;
                                                   } else {
                                                       // console.log("No such document!");
                                                   }
                                               }).catch(function(error) {
                                                   // console.log("Error getting document:", error);
                                               }).finally(() => {
                                                 [element].forEach(item =>
                                               {
                                                   var tr = document.createElement("tr");

                                                   var positionColumn = document.createElement('td');
                                                   positionColumn.innerHTML = item.NamePosition;

                                                   var subdivisionColumn = document.createElement('td');
                                                   subdivisionColumn.innerHTML = item.NameSubdivision;

                                                   var organizationColumn = document.createElement('td');
                                                   organizationColumn.innerHTML = item.NameOrganization;

                                                   var toComeInUserName = document.createElement('button');
                                                   toComeInUserName.innerHTML = "To come in";
                                                   toComeInUserName.className = 'badge badge-gradient-success';
                                                   toComeInUserName.id = item.idDocPositionUser;
                                                   toComeInUserName.item = item;
                                                   toComeInUserName.setAttribute('onclick', 'toComeInButtonPositionsListUser(this)');

                                                   var toComeInUserColumn = document.createElement('td');
                                                   toComeInUserColumn.appendChild(toComeInUserName);


                                                   tr.appendChild(positionColumn);
                                                   tr.appendChild(subdivisionColumn);
                                                   tr.appendChild(organizationColumn);
                                                   tr.appendChild(toComeInUserColumn);

                                                   var container = document.getElementById("tableAvalablePositionsList").getElementsByTagName("tbody")[0];

                                                   container.appendChild(tr);
                                                });
                                             });
                                           });
                                           // окончание* получаем документы Position найденых по запросу выше
                                       });
                                      });
                                    // начало* получаем id документов Position найденых по запросу выше
                                } else {
                                    // doc.data() will be undefined in this case
                                    // console.log("No such document!");
                                }
                            }).catch(function(error) {
                                // console.log("Error getting document:", error);
                            });
                            // окончание* получаем id документов Subdivision найденых по запросу выше
                        });
                    });
                    // окончание* получаем коллекции которые относятся к Организации найденых по запросу выше
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                }
            }).catch(function(error) {
                // console.log("Error getting document:", error);
            });
            // * окончание получаем коллекции которые относятся к Организации найденых по запросу выше
        });
    })
    .catch(function(error) {
        // console.log("Error getting documents: ", error);
    });

}
////////////////////////////////////////////////////////////////////////////////////
function gridDisplayManagerSubdivision() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListUser tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListSettings tbody').empty();
  //очищаем     docRefPosition = "";
   docRefPosition = "";
   // очистим таблицу настроек кнопок
   itemSettingsButton = [];
/**
* @return {string}
* Получение данных для таблицы List of own organizations из firestore с фильтром менеджер подразделения
*/

  var parentHierarchy = db.collectionGroup('Subdivision').where('SubdivisionOfYourManager', '==', EmailLocalStorage);
  parentHierarchy.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          let idDocSubdivision = doc.id;
          // начало* получаем id документов Subdivision найденых по запросу выше
          var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
          docRefSubdivision.get().then(function(doc) {
              if (doc.exists) {
                  // console.log("Document data:", doc.data());
                  // начало* получаем id документов Position найденых по запросу выше
                  docRefSubdivision.collection("Position").get().then(function(querySnapshot) {
                     querySnapshot.forEach(function(doc) {
                         // doc.data() is never undefined for query doc snapshots
                         // console.log(doc.id, " => ", doc.data());
                         // начало* получаем документы Position найденых по запросу выше
                           let parentHierarchyDoc = doc.ref.path;
                           let organizationDocId = parentHierarchyDoc.split("/")[1];
                           let subdivisionDocId = parentHierarchyDoc.split("/")[3];
                           let positionDocId = parentHierarchyDoc.split("/")[5];
                           itemsOrganizationName = [];
                           itemsOrganizationName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
                           // console.log("1.1 => ",itemsOrganizationName);

                           itemsOrganizationName.forEach(function(element){
                             let organizationDocId = element.idDocOrganization ;
                             let subdivisionDocId = element.idDocSubdivision ;
                             let positionDocId = element.idDocPosition ;
                             let docRefOrganization = db.collection("Organization").doc(organizationDocId);
                                 docRefOrganization.get().then(function(doc) {
                                 if (doc.exists) {
                                     nameOrganization = doc.data().Organization;
                                     element['NameOrganization'] = nameOrganization;
                                 } else {
                                     // console.log("No such document!");
                                 }
                             }).catch(function(error) {
                                 // console.log("Error getting document:", error);
                             });
                             let docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
                                 docRefSubdivision.get().then(function(doc) {
                                 if (doc.exists) {
                                     nameSubdivision = doc.data().Subdivision;
                                     element['NameSubdivision'] = nameSubdivision;
                                 } else {
                                     // console.log("No such document!");
                                 }
                             }).catch(function(error) {
                                 // console.log("Error getting document:", error);
                             });
                             let docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
                                 docRefPosition.get().then(function(doc) {
                                 if (doc.exists) {
                                     namePosition = doc.data().Position;
                                     element['NamePosition'] = namePosition;
                                 } else {
                                     // console.log("No such document!");
                                 }
                             }).catch(function(error) {
                                 // console.log("Error getting document:", error);
                             }).finally(() => {
                               [element].forEach(item =>
                             {
                                 var tr = document.createElement("tr");

                                 var positionColumn = document.createElement('td');
                                 positionColumn.innerHTML = item.NamePosition;

                                 var subdivisionColumn = document.createElement('td');
                                 subdivisionColumn.innerHTML = item.NameSubdivision;

                                 var organizationColumn = document.createElement('td');
                                 organizationColumn.innerHTML = item.NameOrganization;

                                 var toComeInUserName = document.createElement('button');
                                 toComeInUserName.innerHTML = "To come in";
                                 toComeInUserName.className = 'badge badge-gradient-success';
                                 toComeInUserName.id = item.idDocPositionUser;
                                 toComeInUserName.item = item;
                                 toComeInUserName.setAttribute('onclick', 'toComeInButtonPositionsListUser(this)');

                                 var toComeInUserColumn = document.createElement('td');
                                 toComeInUserColumn.appendChild(toComeInUserName);


                                 tr.appendChild(positionColumn);
                                 tr.appendChild(subdivisionColumn);
                                 tr.appendChild(organizationColumn);
                                 tr.appendChild(toComeInUserColumn);

                                 var container = document.getElementById("tableAvalablePositionsList").getElementsByTagName("tbody")[0];

                                 container.appendChild(tr);
                              });
                           });
                         });
                         // окончание* получаем документы Position найденых по запросу выше
                     });
                    });
                  // начало* получаем id документов Position найденых по запросу выше
              } else {
                  // doc.data() will be undefined in this case
                  // console.log("No such document!");
              }
          }).catch(function(error) {
              // console.log("Error getting document:", error);
          });
          // окончание* получаем id документов Subdivision найденых по запросу выше
      });
  });

}
//////////////////////////////////////////////////////////////////////////////////////////
function gridDisplayManagerPosition() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListUser tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListSettings tbody').empty();
  //очищаем     docRefPosition = "";
   docRefPosition = "";
   // очистим таблицу настроек кнопок
   itemSettingsButton = [];
  /**
  * @return {string}
  * Получение данных для таблицы List of own organizations из firestore с фильтром менеджер должности
  */

  var parentHierarchy = db.collectionGroup('PositionUser').where('PositionOfManager', '==', EmailLocalStorage);
  parentHierarchy.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
     let parentHierarchyDoc = doc.ref.path;
     let organizationDocId = parentHierarchyDoc.split("/")[1];
     let subdivisionDocId = parentHierarchyDoc.split("/")[3];
     let positionDocId = parentHierarchyDoc.split("/")[5];
     itemsOrganizationName = [];
     itemsOrganizationName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: positionDocId},...{idDocSubdivision: subdivisionDocId},...{idDocOrganization: organizationDocId}});
    });
    itemsOrganizationName.forEach(function(element){
      let organizationDocId = element.idDocOrganization ;
      let subdivisionDocId = element.idDocSubdivision ;
      let positionDocId = element.idDocPosition ;
      let docRefOrganization = db.collection("Organization").doc(organizationDocId);
         docRefOrganization.get().then(function(doc) {
          if (doc.exists) {
              nameOrganization = doc.data().Organization;
              element['NameOrganization'] = nameOrganization;
          } else {
              // console.log("No such document!");
          }
      }).catch(function(error) {
          // console.log("Error getting document:", error);
      });
      let docRefSubdivision = docRefOrganization.collection("Subdivision").doc(subdivisionDocId);
         docRefSubdivision.get().then(function(doc) {
          if (doc.exists) {
              nameSubdivision = doc.data().Subdivision;
              element['NameSubdivision'] = nameSubdivision;
          } else {
              // console.log("No such document!");
          }
      }).catch(function(error) {
          // console.log("Error getting document:", error);
      });
      let docRefPosition = docRefSubdivision.collection("Position").doc(positionDocId);
         docRefPosition.get().then(function(doc) {
          if (doc.exists) {
              namePosition = doc.data().Position;
              element['NamePosition'] = namePosition;
          } else {
              // console.log("No such document!");
          }
      }).catch(function(error) {
          // console.log("Error getting document:", error);
      }).finally(() => {
        [element].forEach(item =>
      {
        var tr = document.createElement("tr");

        var positionColumn = document.createElement('td');
        positionColumn.innerHTML = item.NamePosition;

        var subdivisionColumn = document.createElement('td');
        subdivisionColumn.innerHTML = item.NameSubdivision;

        var organizationColumn = document.createElement('td');
        organizationColumn.innerHTML = item.NameOrganization;

        var toComeInUserName = document.createElement('button');
        toComeInUserName.innerHTML = "To come in";
        toComeInUserName.className = 'badge badge-gradient-success';
        toComeInUserName.id = item.idDocPositionUser;
        toComeInUserName.item = item;
        toComeInUserName.setAttribute('onclick', 'toComeInButtonPositionsListUser(this)');

        var toComeInUserColumn = document.createElement('td');
        toComeInUserColumn.appendChild(toComeInUserName);


        tr.appendChild(positionColumn);
        tr.appendChild(subdivisionColumn);
        tr.appendChild(organizationColumn);
        tr.appendChild(toComeInUserColumn);

        var container = document.getElementById("tableAvalablePositionsList").getElementsByTagName("tbody")[0];

        container.appendChild(tr);
       });
      });
    });
  });
}

/////////////////////////////////////////////////////////////////////////////////////////


  /**
  * @return {string}
   *  Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved.
   */

  function toComeInButtonPositionsListUser(obj) {
    let itemsPositionUser = [];
    //очищаю таблицу tableAvalablePositionsList
    $('#tableAvalablePositionsListUser tbody').empty();
    //очищаю таблицу tableAvalablePositionsList
    $('#tableAvalablePositionsListSettings tbody').empty();
    //очищаем     docRefPosition = "";
     docRefPosition = "";
     // очистим таблицу настроек кнопок
     itemSettingsButton = [];
    //обработка редактирования строки...
      let objId = obj.id;
      let objItem = obj.item;
      let idDocOrganization = objItem.idDocOrganization;
      let idDocSubdivision = objItem.idDocSubdivision;
    //заполняем таблицу список пользователей tableAvalablePositionsListUser
      var docRef = db.collection("Organization").doc(idDocOrganization);
      var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
      docRefPosition = docRefSubdivision.collection("Position").doc(objId);
      docRefPosition.collection("PositionUser")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          itemsPositionUser.push({...doc.data(),...{idPositionUser: doc.id}});
        });
          })
          .catch(function(error) {
              // console.log("Error getting documents: ", error);
          })
            .finally(() => {itemsPositionUser;
            itemsPositionUser.forEach(item => {
            var tr = document.createElement("tr");

            var toDismissColumn1 = document.createElement('input');
            toDismissColumn1.type = "checkbox";
            toDismissColumn1.checked = true;
            toDismissColumn1.className = 'form-check';
            toDismissColumn1.addEventListener("click", function(e) {console.log("checkbox");  });

            var toDismissColumn = document.createElement('td');
            toDismissColumn.appendChild(toDismissColumn1);

            var userEmailColumn = document.createElement('td');
            userEmailColumn.innerHTML = item.UserEmail;

            var userСommentColumn = document.createElement('td');
            userСommentColumn.innerHTML = item.UserСomment;

            tr.appendChild(toDismissColumn);
            tr.appendChild(userEmailColumn);
            tr.appendChild(userСommentColumn);

            var container = document.getElementById("tableAvalablePositionsListUser").getElementsByTagName("tbody")[0];

            container.appendChild(tr);
          });
        });

        //заполняем таблицу список настроек tableAvalablePositionsListSettings
        itemSettingsButton.push({...{SettingsTitle: "Expect"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability: "does not participate"},...{SettingsSalesFunnel_Stage: "Available green"},...{SettingsSalesFunnel_Result: "Ignore"}});
        itemSettingsButton.push({...{SettingsTitle: "Other"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability: "does not participate"},...{SettingsSalesFunnel_Stage: "Perhaps yellow"},...{SettingsSalesFunnel_Result: "Ignore"}});
        itemSettingsButton.push({...{SettingsTitle: "Gone"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability: "does not participate"},...{SettingsSalesFunnel_Stage: "Not available red"},...{SettingsSalesFunnel_Result: "Ignore"}});


        docRefPosition.collection("PositionSettings")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            itemSettingsButton.push({...doc.data(),...{idPositionSettings: doc.id}});
          });

            })
            .catch(function(error) {
                // console.log("Error getting documents: ", error);
            })
              .finally(() => {itemSettingsButton;
              itemSettingsButton.forEach(item => {
              var tr = document.createElement("tr");

              var settingsTitleColumn = document.createElement('td');
              settingsTitleColumn.innerHTML = item.SettingsTitle;

              var settingsСommentColumn = document.createElement('td');
              settingsСommentColumn.innerHTML = item.SettingsСomment;

              // var editSettings = document.createElement('select');
              // editSettings.options[0] = new Option("does not participate", "str0");
              // editSettings.options[1] = new Option("Stage 1 of the sales funnel", "str1");
              // editSettings.options[2] = new Option("Stage 2 of the sales funnel", "str2");
              // editSettings.options[3] = new Option("Stage 3 of the sales funnel", "str3");
              // editSettings.options[4] = new Option("Stage 4 of the sales funnel", "str4");
              // editSettings.options[5] = new Option("Stage 5 of the sales funnel", "str5");
              // editSettings.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
              // editSettings.addEventListener("click", function(e) {console.log("checkbox");  });
              //
              // var editSettingsColumn = document.createElement('td');
              // editSettingsColumn.appendChild(editSettings);

              var editSettingsColumn = document.createElement('td');
              editSettingsColumn.innerHTML = item.SettingsSalesFunnel_Availability;

              // var deleteSettings = document.createElement('select');
              // deleteSettings.options[0] = new Option("Not available red", "str0");
              // deleteSettings.options[1] = new Option("Perhaps yellow", "str1");
              // deleteSettings.options[2] = new Option("Available green", "str2");
              // deleteSettings.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
              // deleteSettings.addEventListener("click", function(e) {console.log("checkbox");  });
              //
              // var deleteSettingsColumn = document.createElement('td');
              // deleteSettingsColumn.appendChild(deleteSettings);

              var deleteSettingsColumn = document.createElement('td');
              deleteSettingsColumn.innerHTML = item.SettingsSalesFunnel_Stage;

              // var resultButton = document.createElement('select');
              // resultButton.options[0] = new Option("Ignore", "str0");
              // resultButton.options[1] = new Option("Take account of", "str1");
              // resultButton.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
              // resultButton.addEventListener("click", function(e) {console.log("checkbox");  });
              //
              // var resultButtonColumn = document.createElement('td');
              // resultButtonColumn.appendChild(resultButton);

              var resultButtonColumn = document.createElement('td');
              resultButtonColumn.innerHTML = item.SettingsSalesFunnel_Result;

              tr.appendChild(settingsTitleColumn);
              tr.appendChild(settingsСommentColumn);
              tr.appendChild(editSettingsColumn);
              tr.appendChild(deleteSettingsColumn);
              tr.appendChild(resultButtonColumn);

              var container = document.getElementById("tableAvalablePositionsListSettings").getElementsByTagName("tbody")[0];

              container.appendChild(tr);
            });
          });

    };

    /////////////////////////////////////////////////////////////////////////////////////////

/**
* @return {string}
*  Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved.
*/

function gridDisplay()
{
  //получаем и проверяем заполненость ячеек из формы
  var getAnalysisStartDate = document.getElementById("exampleInputAnalysisStartDate").value;
  if (getAnalysisStartDate.length < 1)
  {
   alert('Please fill in the date!.');
   return;
  }
  let dayAnalysisStartDate = getAnalysisStartDate.split("/")[0];
  let monthAnalysisStartDate = getAnalysisStartDate.split("/")[1];
  let yearAnalysisStartDate = getAnalysisStartDate.split("/")[2];
  if (dayAnalysisStartDate == undefined)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (monthAnalysisStartDate == undefined)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (yearAnalysisStartDate == undefined)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (dayAnalysisStartDate > 31)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (monthAnalysisStartDate > 12)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (yearAnalysisStartDate.length < 4)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  var getAnalysisExpirationDate = document.getElementById("exampleInputAnalysisExpirationDate").value;
  if (getAnalysisExpirationDate.length < 1)
  {
   alert('Please fill in the date!.');
   return;
  }
  let dayAnalysisExpirationDate = getAnalysisExpirationDate.split("/")[0];
  let monthAnalysisExpirationDate = getAnalysisExpirationDate.split("/")[1];
  let yearAnalysisExpirationDate = getAnalysisExpirationDate.split("/")[2];
  if (dayAnalysisExpirationDate == undefined)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (monthAnalysisStartDate == undefined)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (yearAnalysisExpirationDate == undefined)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (dayAnalysisExpirationDate > 31)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (monthAnalysisExpirationDate > 12)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  if (yearAnalysisExpirationDate.length < 4)
  {
    alert('Please fill in the date according to the template!');
    return;
  }
  var getComparisonCheckbox = document.getElementById("exampleInputComparisonCheckbox").checked;
  if (getComparisonCheckbox == true)
  {
    var getComparisonStartDate = document.getElementById("exampleInputComparisonStartDate").value;
    if (getComparisonStartDate.length < 1)
    {
     alert('Please fill in the date!.');
     return;
    }
    let dayComparisonStartDate = getComparisonStartDate.split("/")[0];
    let monthComparisonStartDate = getComparisonStartDate.split("/")[1];
    let yearComparisonStartDate = getComparisonStartDate.split("/")[2];
    if (dayComparisonStartDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (monthComparisonStartDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (yearComparisonStartDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (dayComparisonStartDate > 31)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (monthComparisonStartDate > 12)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (yearComparisonStartDate.length < 4)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    var getComparisonExpirationDate = document.getElementById("exampleInputComparisonExpirationDate").value;
    if (getComparisonExpirationDate.length < 1)
    {
     alert('Please fill in the date!.');
     return;
    }
    let dayComparisonExpirationDate = getComparisonExpirationDate.split("/")[0];
    let monthComparisonExpirationDate = getComparisonExpirationDate.split("/")[1];
    let yearComparisonExpirationDate = getComparisonExpirationDate.split("/")[2];
    if (dayComparisonExpirationDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (monthComparisonExpirationDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (yearComparisonExpirationDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (dayComparisonExpirationDate > 31)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (monthComparisonExpirationDate > 12)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (yearComparisonExpirationDate.length < 4)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    //собираем формат времени
    var dateComparisonStart = +new Date(yearComparisonStartDate, monthComparisonStartDate-1, dayComparisonStartDate, 0, 0, 0);
    var dateComparisonExpiration = +new Date(yearComparisonExpirationDate, monthComparisonExpirationDate-1, dayComparisonExpirationDate, 23, 59, 59);
  }
  //собираем формат времени
  var dateAnalysisStartMiliseconds = +new Date(yearAnalysisStartDate, monthAnalysisStartDate-1, dayAnalysisStartDate, 0, 0, 0);
  var dateAnalysisStart = new Date(yearAnalysisStartDate, monthAnalysisStartDate-1, dayAnalysisStartDate, 0, 0, 0);
  var dateAnalysisExpirationMilisecond = +new Date(yearAnalysisExpirationDate, monthAnalysisExpirationDate-1, dayAnalysisExpirationDate, 23, 59, 59);
  var dateAnalysisExpiration = new Date(yearAnalysisExpirationDate, monthAnalysisExpirationDate-1, dayAnalysisExpirationDate, 23, 59, 59);
  /// создаем массив дат входящих в интервал
  //получаем данные таблицы и формируем список пользователей
  //читаем данные с таблицы
  var tablePositionsListUser = document.getElementById('tableAvalablePositionsListUser');
  //удалил шапку таблицы
  let itemPositionsListUser =[];
  var rowLength = tablePositionsListUser.rows.length;
  for (i = 0; i < rowLength; i++){
     var cells = tablePositionsListUser.rows.item(i).cells;
     var cellVal_0 = cells.item(0).lastChild.checked;
     if(cellVal_0 == true)
     {
       var cellVal_1 = cells.item(1).innerHTML;
       var cellVal_2 = cells.item(2).innerHTML;
       itemPositionsListUser.push(cellVal_1)
     }
  }
  //переменные для запуска команды формирования отчета
  let length_itemShiftInterval = "";
  let length_itemShiftInterval_1 = 0;


  // получаем документы смен подходящие данному отбору
  let itemShiftInterval = [];
  let itemDocShiftList = [];
  let itemShiftInterval_baza = [];

  docRefPosition.collection("PositionShift").where("WorkShiftPositionStart", ">", dateAnalysisStart)
                                            .where("WorkShiftPositionStart", "<", dateAnalysisExpiration)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              let docShift = doc.data();
              let massListPositionUser = docShift.ListPositionUser;
              let idDocPosition = docShift.IdDocPosition;
              let workShiftPositionExpiration = docShift.WorkShiftPositionExpiration;
              let workShiftPositionExpirationMiliseconds = workShiftPositionExpiration.seconds*1000;
              let k = workShiftPositionExpirationMiliseconds+43200000;
              //для увеличения обхвата на 12 часов при поиске документов интервала смены
              let workShiftPositionExpirationGetProcessUser = new Date (k);
              let workShiftPositionStart = docShift.WorkShiftPositionStart;
              let workShiftPositionStartMiliseconds = workShiftPositionStart.seconds*1000;
              let idDocShiftPosition = doc.id;
              //начало проверяем совпадения интервала в шапки документа
              if(workShiftPositionExpirationMiliseconds < dateAnalysisExpirationMilisecond)
              {
                //записываем базовый массив
                itemShiftInterval_baza.push({...doc.data(),...{IdDocShiftPosition: doc.id},...{numerDocShiftPosition: workShiftPositionStartMiliseconds}});
                //начало проверяем список сотрудников по смене со списком сотрудников включенных в отчет
                massListPositionUser.forEach(function(item, i, arr) {
                  // alert( i + ": " + item + " (массив:" + arr + ")" );
                  let userPositionUser = massListPositionUser[i];
                  let resuitUserList = itemPositionsListUser.includes(userPositionUser);
                    if (resuitUserList == true)
                    {
                      // //начало отбора документов по сменам должности с привязкой к сотруднику
                      // var museums = db.collectionGroup('ProcessUser').where("EmailPositionUser", "==", userPositionUser)
                      //                                                 .where("IdDocPosition", "==", idDocPosition)
                      //                                                 .where("ProcessUserEnd", "==", "false")
                      //                                                 .where("ProcessUserEndTime", ">=", workShiftPositionStart)
                      //                                                 .where("ProcessUserEndTime", "<", workShiftPositionExpirationGetProcessUser);
                      // museums.get().then((querySnapshot) => {
                      //     querySnapshot.forEach((doc) => {
                      //         let docShiftUser = doc.data();
                      //         let processUserStartTime = docShiftUser.ProcessUserStartTime;
                      //         let processUserStartTimeMiliseconds = processUserStartTime.seconds*1000;
                      //         let processUserEndTime = docShiftUser.ProcessUserEndTime;
                      //         let processUserEndTimeMiliseconds = processUserEndTime.seconds*1000;
                      //         if (processUserStartTimeMiliseconds <= workShiftPositionExpirationMiliseconds)
                      //         {
                      //         // начало обрезаем документы чьи показатели заходят за рамки смены только для отчета
                      //           if (processUserStartTimeMiliseconds < workShiftPositionStartMiliseconds)
                      //           {
                      //             processUserStartTimeMiliseconds = workShiftPositionStartMiliseconds;
                      //           }
                      //           if (processUserEndTimeMiliseconds > workShiftPositionExpirationMiliseconds)
                      //           {
                      //             processUserEndTimeMiliseconds = workShiftPositionExpirationMiliseconds;
                      //           }
                      //           // окончание обрезаем документы чьи показатели заходят за рамки смены только для отчета
                      //         // начало получение статуса кнопки
                      //         let nameDocProcessButton = docShiftUser.NameDocProcessButton;
                      //         itemSettingsButton.forEach(function(item, i, arr) {
                      //           let settingsTitle = item.SettingsTitle;
                      //           if (settingsTitle == nameDocProcessButton)
                      //           {
                      //             let settingsSalesFunnel_Stage = item.SettingsSalesFunnel_Stage;
                      //             let processDurationMiliseconds = processUserEndTimeMiliseconds - processUserStartTimeMiliseconds;
                      //             itemDocShiftList.push({...doc.data(),...{idDocProceUser: doc.id},...{IdDocShiftPosition: idDocShiftPosition},...{ProcessUserStartTimeMiliseconds: processUserStartTimeMiliseconds},...{ProcessUserEndTimeMiliseconds: processUserEndTimeMiliseconds},...{SettingsSalesFunnel_Stage: settingsSalesFunnel_Stage},...{ProcessDurationMiliseconds: processDurationMiliseconds}});
                      //             itemDocShiftList.sort(( a, b ) => a.ProcessUserStartTimeMiliseconds - b.ProcessUserStartTimeMiliseconds);
                      //           }
                      //         });
                      //         // окончание получение статуса кнопки
                      //         }
                      //     });
                      //  }).finally(() => {
                      //
                      //    itemShiftInterval.forEach(function(item, i, arr) {
                      //       // начало заполняес интервалы смен недоступностью
                      //       let idDocShiftPosition = item.IdDocShiftPosition;
                      //       let userActiveShift = item.userActiveShift;
                      //       let workShiftPositionStart = item.WorkShiftPositionStart;
                      //       let workShiftPositionStartMiliseconds = (workShiftPositionStart.seconds)*1000;
                      //       let workShiftPositionExpiration = item.WorkShiftPositionExpiration;
                      //       let workShiftPositionExpirationMiliseconds = (workShiftPositionExpiration.seconds)*1000;
                      //       let itemDocShiftList_idDocShiftPosition = [];
                      //       itemDocShiftList.forEach(function(item, i, arr) {
                      //         let idDocShiftPosition_1 = item.IdDocShiftPosition;
                      //         if (idDocShiftPosition_1 == idDocShiftPosition)
                      //         {
                      //           itemDocShiftList_idDocShiftPosition.push(item);
                      //         }
                      //       });
                      //       let itemDocShiftList_idDocShiftPosition_User = [];
                      //       itemDocShiftList_idDocShiftPosition.forEach(function(item, i, arr) {
                      //         let emailPositionUser_1 = item.EmailPositionUser;
                      //         if (emailPositionUser_1 == userActiveShift)
                      //         {
                      //           itemDocShiftList_idDocShiftPosition_User.push(item);
                      //         }
                      //       });
                      //       itemDocShiftList_idDocShiftPosition_User.sort(( a, b ) => a.ProcessUserStartTimeMiliseconds - b.ProcessUserStartTimeMiliseconds);
                      //       let length_itemDocShiftList_idDocShiftPosition_User =itemDocShiftList_idDocShiftPosition_User.length;
                      //       if (length_itemDocShiftList_idDocShiftPosition_User == 0)
                      //       {
                      //         let processDurationMiliseconds_4 = workShiftPositionExpirationMiliseconds - workShiftPositionStartMiliseconds;
                      //         let object = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: workShiftPositionStartMiliseconds, ProcessUserEndTimeMiliseconds: workShiftPositionExpirationMiliseconds, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_4};
                      //         itemDocShiftList.unshift(object);
                      //       } else {
                      //         //начало прорабатываем и дополняем массив
                      //          //добавляю документ в начало
                      //          let itemDocShiftList_idDocShiftPosition_User_0 = itemDocShiftList_idDocShiftPosition_User[0];
                      //          let processUserStartTimeMiliseconds = itemDocShiftList_idDocShiftPosition_User_0.ProcessUserStartTimeMiliseconds;
                      //          if (processUserStartTimeMiliseconds > workShiftPositionStartMiliseconds)
                      //          {
                      //            // let processUserStartTimeMiliseconds_1 = itemDocShiftList_idDocShiftPosition_User[1].ProcessUserStartTimeMiliseconds;
                      //            let processDurationMiliseconds_1 = workShiftPositionStartMiliseconds - processUserStartTimeMiliseconds;
                      //            let object = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: workShiftPositionStartMiliseconds, ProcessUserEndTimeMiliseconds: processUserStartTimeMiliseconds, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_1};
                      //            itemDocShiftList.unshift(object);
                      //          };
                      //          //добавляю документ в конец
                      //          let length = itemDocShiftList_idDocShiftPosition_User.length;
                      //          let length_finall_0 = length - 1;
                      //          let itemDocShiftList_idDocShiftPosition_User_finall_0 = itemDocShiftList_idDocShiftPosition_User[length_finall_0];
                      //          let processUserEndTimeMiliseconds = itemDocShiftList_idDocShiftPosition_User_finall_0.ProcessUserEndTimeMiliseconds;
                      //          if (processUserEndTimeMiliseconds < workShiftPositionExpirationMiliseconds)
                      //          {
                      //            let processDurationMiliseconds_2 = workShiftPositionExpirationMiliseconds - processUserEndTimeMiliseconds;
                      //            let object_1 = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: processUserEndTimeMiliseconds, ProcessUserEndTimeMiliseconds: workShiftPositionExpirationMiliseconds, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_2};
                      //            itemDocShiftList.push(object_1);
                      //          };
                      //          //проверяем интервалы между документами
                      //          let processUserEndTimeMiliseconds_3 = "";
                      //          itemDocShiftList_idDocShiftPosition_User.forEach(function(item, index, array) {
                      //            if (index != 0)
                      //            {
                      //              let processUserStartTimeMiliseconds_3 = item.ProcessUserStartTimeMiliseconds;
                      //                if (processUserStartTimeMiliseconds_3 > processUserEndTimeMiliseconds_3)
                      //                {
                      //                  let processDurationMiliseconds_3 = processUserStartTimeMiliseconds_3 - processUserEndTimeMiliseconds_3;
                      //                  let object_2 = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: processUserEndTimeMiliseconds_3, ProcessUserEndTimeMiliseconds: processUserStartTimeMiliseconds_3, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_3};
                      //                  itemDocShiftList.push(object_2);
                      //                }
                      //            }
                      //            processUserEndTimeMiliseconds_3 = item.ProcessUserEndTimeMiliseconds;
                      //           });
                      //         //окончание прорабатываем и дополняем массив
                      //       }
                      //       // окончание проверки пользователь входящих  ListPositionUser
                      //   });
                      // });
                      // //окончание отбора документов по сменам должности с привязкой к сотруднику
                      itemShiftInterval.push({...doc.data(),...{IdDocShiftPosition: doc.id},...{numerDocShiftPosition: workShiftPositionStartMiliseconds},...{userActiveShift: userPositionUser}});
                      itemShiftInterval.sort(( a, b ) => a.numerDocShiftPosition - b.numerDocShiftPosition);
                      // console.log(itemShiftInterval);
                    }
                });
                //окончание проверяем список сотрудников по смене со списком сотрудников включенных в отчет
              }
              //окончание проверяем совпадения интервала в шапки документа
          });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      }).finally(() => {
         length_itemShiftInterval = itemShiftInterval.length;
goo1()
      });

      //

function goo1()
{
  // length_itemShiftInterval_1 = length_itemShiftInterval_1 + 1;
  // console.log(length_itemShiftInterval_1);

  itemShiftInterval.forEach(function(item, i, arr) {

  let userPositionUser = item.userActiveShift;
  let idDocPosition = item.IdDocPosition;
  let idDocShiftPosition = item.idDocShiftPosition;
  let workShiftPositionStart = item.WorkShiftPositionStart;
  let workShiftPositionStartMiliseconds = workShiftPositionStart.seconds*1000;
  let workShiftPositionExpiration = item.WorkShiftPositionExpiration;
  let workShiftPositionExpirationMiliseconds = workShiftPositionExpiration.seconds*1000;
  let k = workShiftPositionExpirationMiliseconds+43200000;
  //для увеличения обхвата на 12 часов при поиске документов интервала смены
  let workShiftPositionExpirationGetProcessUser = new Date (k);
    //начало отбора документов по сменам должности с привязкой к сотруднику
    var museums = db.collectionGroup('ProcessUser').where("EmailPositionUser", "==", userPositionUser)
                                                    .where("IdDocPosition", "==", idDocPosition)
                                                    .where("ProcessUserEnd", "==", "false")
                                                    .where("ProcessUserEndTime", ">=", workShiftPositionStart)
                                                    .where("ProcessUserEndTime", "<", workShiftPositionExpirationGetProcessUser);
    museums.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let docShiftUser = doc.data();
            let processUserStartTime = docShiftUser.ProcessUserStartTime;
            let processUserStartTimeMiliseconds = processUserStartTime.seconds*1000;
            let processUserEndTime = docShiftUser.ProcessUserEndTime;
            let processUserEndTimeMiliseconds = processUserEndTime.seconds*1000;
            if (processUserStartTimeMiliseconds <= workShiftPositionExpirationMiliseconds)
            {
            // начало обрезаем документы чьи показатели заходят за рамки смены только для отчета
              if (processUserStartTimeMiliseconds < workShiftPositionStartMiliseconds)
              {
                processUserStartTimeMiliseconds = workShiftPositionStartMiliseconds;
              }
              if (processUserEndTimeMiliseconds > workShiftPositionExpirationMiliseconds)
              {
                processUserEndTimeMiliseconds = workShiftPositionExpirationMiliseconds;
              }
              // окончание обрезаем документы чьи показатели заходят за рамки смены только для отчета
            // начало получение статуса кнопки
            let nameDocProcessButton = docShiftUser.NameDocProcessButton;
            itemSettingsButton.forEach(function(item, i, arr) {
              let settingsTitle = item.SettingsTitle;
              if (settingsTitle == nameDocProcessButton)
              {
                let settingsSalesFunnel_Stage = item.SettingsSalesFunnel_Stage;
                let processDurationMiliseconds = processUserEndTimeMiliseconds - processUserStartTimeMiliseconds;
                itemDocShiftList.push({...doc.data(),...{idDocProceUser: doc.id},...{IdDocShiftPosition: idDocShiftPosition},...{ProcessUserStartTimeMiliseconds: processUserStartTimeMiliseconds},...{ProcessUserEndTimeMiliseconds: processUserEndTimeMiliseconds},...{SettingsSalesFunnel_Stage: settingsSalesFunnel_Stage},...{ProcessDurationMiliseconds: processDurationMiliseconds}});
                itemDocShiftList.sort(( a, b ) => a.ProcessUserStartTimeMiliseconds - b.ProcessUserStartTimeMiliseconds);
              }
            });
            // окончание получение статуса кнопки
            }
        });
     }).finally(() => {
        length_itemShiftInterval_1 = length_itemShiftInterval_1 + 1;
        if (length_itemShiftInterval == length_itemShiftInterval_1)
        {
          goo2();
        }
     });
    //окончание отбора документов по сменам должности с привязкой к сотруднику
  });
}

function goo2()
{

   itemShiftInterval.forEach(function(item, i, arr) {
      // начало заполняес интервалы смен недоступностью
      let idDocShiftPosition = item.IdDocShiftPosition;
      let userActiveShift = item.userActiveShift;
      let workShiftPositionStart = item.WorkShiftPositionStart;
      let workShiftPositionStartMiliseconds = (workShiftPositionStart.seconds)*1000;
      let workShiftPositionExpiration = item.WorkShiftPositionExpiration;
      let workShiftPositionExpirationMiliseconds = (workShiftPositionExpiration.seconds)*1000;
      let itemDocShiftList_idDocShiftPosition = [];
      itemDocShiftList.forEach(function(item, i, arr) {
        let idDocShiftPosition_1 = item.IdDocShiftPosition;
        if (idDocShiftPosition_1 == idDocShiftPosition)
        {
          itemDocShiftList_idDocShiftPosition.push(item);
        }
      });
      let itemDocShiftList_idDocShiftPosition_User = [];
      itemDocShiftList_idDocShiftPosition.forEach(function(item, i, arr) {
        let emailPositionUser_1 = item.EmailPositionUser;
        if (emailPositionUser_1 == userActiveShift)
        {
          itemDocShiftList_idDocShiftPosition_User.push(item);
        }
      });
      itemDocShiftList_idDocShiftPosition_User.sort(( a, b ) => a.ProcessUserStartTimeMiliseconds - b.ProcessUserStartTimeMiliseconds);
      let length_itemDocShiftList_idDocShiftPosition_User =itemDocShiftList_idDocShiftPosition_User.length;
      if (length_itemDocShiftList_idDocShiftPosition_User == 0)
      {
        let processDurationMiliseconds_4 = workShiftPositionExpirationMiliseconds - workShiftPositionStartMiliseconds;
        let object = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: workShiftPositionStartMiliseconds, ProcessUserEndTimeMiliseconds: workShiftPositionExpirationMiliseconds, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_4};
        itemDocShiftList.unshift(object);
      } else {
        //начало прорабатываем и дополняем массив
         //добавляю документ в начало
         let itemDocShiftList_idDocShiftPosition_User_0 = itemDocShiftList_idDocShiftPosition_User[0];
         let processUserStartTimeMiliseconds = itemDocShiftList_idDocShiftPosition_User_0.ProcessUserStartTimeMiliseconds;
         if (processUserStartTimeMiliseconds > workShiftPositionStartMiliseconds)
         {
           // let processUserStartTimeMiliseconds_1 = itemDocShiftList_idDocShiftPosition_User[1].ProcessUserStartTimeMiliseconds;
           let processDurationMiliseconds_1 = workShiftPositionStartMiliseconds - processUserStartTimeMiliseconds;
           let object = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: workShiftPositionStartMiliseconds, ProcessUserEndTimeMiliseconds: processUserStartTimeMiliseconds, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_1};
           itemDocShiftList.unshift(object);
         };
         //добавляю документ в конец
         let length = itemDocShiftList_idDocShiftPosition_User.length;
         let length_finall_0 = length - 1;
         let itemDocShiftList_idDocShiftPosition_User_finall_0 = itemDocShiftList_idDocShiftPosition_User[length_finall_0];
         let processUserEndTimeMiliseconds = itemDocShiftList_idDocShiftPosition_User_finall_0.ProcessUserEndTimeMiliseconds;
         if (processUserEndTimeMiliseconds < workShiftPositionExpirationMiliseconds)
         {
           let processDurationMiliseconds_2 = workShiftPositionExpirationMiliseconds - processUserEndTimeMiliseconds;
           let object_1 = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: processUserEndTimeMiliseconds, ProcessUserEndTimeMiliseconds: workShiftPositionExpirationMiliseconds, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_2};
           itemDocShiftList.push(object_1);
         };
         //проверяем интервалы между документами
         let processUserEndTimeMiliseconds_3 = "";
         itemDocShiftList_idDocShiftPosition_User.forEach(function(item, index, array) {
           if (index != 0)
           {
             let processUserStartTimeMiliseconds_3 = item.ProcessUserStartTimeMiliseconds;
               if (processUserStartTimeMiliseconds_3 > processUserEndTimeMiliseconds_3)
               {
                 let processDurationMiliseconds_3 = processUserStartTimeMiliseconds_3 - processUserEndTimeMiliseconds_3;
                 let object_2 = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: processUserEndTimeMiliseconds_3, ProcessUserEndTimeMiliseconds: processUserStartTimeMiliseconds_3, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_3};
                 itemDocShiftList.push(object_2);
               }
           }
           processUserEndTimeMiliseconds_3 = item.ProcessUserEndTimeMiliseconds;
          });
        //окончание прорабатываем и дополняем массив
      }
      // окончание проверки пользователь входящих  ListPositionUser
  });
//обрабатываем массив для диограммы
console.log(itemShiftInterval);
console.log(itemShiftInterval_baza);
console.log(itemDocShiftList);
let listDataDiogramma = [];
itemShiftInterval_baza.sort(( a, b ) => a.numerDocShiftPosition - b.numerDocShiftPosition);
itemShiftInterval_baza.forEach(function(item, i, arr) {
  let idDocShiftPosition_Baza = item.IdDocShiftPosition;
  let listPositionUser = item.ListPositionUser;
  let listPositionUser_length = listPositionUser.length;
  let settingsSalesFunnel_Stage_Green = 0;
  let settingsSalesFunnel_Stage_Yellow = 0;
  let settingsSalesFunnel_Stage_Red = 0;
  let itemDocShiftList_length = itemDocShiftList.length - 1;
  itemDocShiftList.forEach(function(item, l, arr) {
    let idDocShiftPosition = item.IdDocShiftPosition;
    let settingsSalesFunnel_Stage = item.SettingsSalesFunnel_Stage;
    let processDurationMiliseconds = item.ProcessDurationMiliseconds;
    if (idDocShiftPosition_Baza == idDocShiftPosition)
    {
      if (settingsSalesFunnel_Stage == "Available green")
      {
        settingsSalesFunnel_Stage_Green = settingsSalesFunnel_Stage_Green + processDurationMiliseconds;
      }
      if (settingsSalesFunnel_Stage == "Perhaps yellow")
      {
        settingsSalesFunnel_Stage_Yellow = settingsSalesFunnel_Stage_Yellow + processDurationMiliseconds;
      }
      if (settingsSalesFunnel_Stage == "Not available red")
      {
        settingsSalesFunnel_Stage_Red = settingsSalesFunnel_Stage_Red + processDurationMiliseconds;
      }
      if (itemDocShiftList_length == l)
      {



         let object = {LABELS: userActiveShift, DataNotAvailable: settingsSalesFunnel_Stage_Red, DataPerhaps: settingsSalesFunnel_Stage_Yellow, DataAvailable: settingsSalesFunnel_Stage_Green};
         listDataDiogramma.unshift(object);

      }

    }


});





});


}

  // переменные для диаграммы
  LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG' , 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];
  dataNotAvailable = [10, 5, 5, 40, 5, 5, 5, 5, 5, 5, 40, 5, 5, 5, 5];
  dataPerhaps = [20, 5, 5, 40, 5, 5, 5, 5, 5, 5, 40, 5, 5, 5, 5];
  dataAvailable = [30, 5, 5, 40, 5, 5, 5, 5, 5, 5, 40, 5, 5, 5, 5];
  goo();





}


function goo()
{
// получаем переменные для диаграммы

//////////////////////////////////
(function($) {
  'use strict';
  $(function() {

    // Remove pro banner on close
    // document.querySelector('#bannerClose').addEventListener('click',function() {
    //   document.querySelector('#proBanner').classList.add('d-none');
    // });

    Chart.defaults.global.legend.labels.usePointStyle = true;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if ($("#visit-sale-chart").length) {
  Chart.defaults.global.legend.labels.usePointStyle = true;
  var ctx = document.getElementById('visit-sale-chart').getContext("2d");

  var gradientStrokeViolet = ctx.createLinearGradient(0, 0, 0, 181);
  gradientStrokeViolet.addColorStop(0, 'rgba(254, 124, 150, 1)');
  gradientStrokeViolet.addColorStop(1, 'rgba(254, 124, 150, 1)');
  var gradientLegendViolet = 'linear-gradient(to right, rgba(254, 124, 150, 1), rgba(254, 124, 150, 1))';

  var gradientStrokeBlue = ctx.createLinearGradient(0, 0, 0, 360);
  gradientStrokeBlue.addColorStop(0, 'rgba(27, 207, 180, 1)');
  gradientStrokeBlue.addColorStop(1, 'rgba(27, 207, 180, 1)');
  var gradientLegendBlue = 'linear-gradient(to right, rgba(27, 207, 180, 1), rgba(27, 207, 180, 1))';

  var gradientStrokeRed = ctx.createLinearGradient(0, 0, 0, 300);
  gradientStrokeRed.addColorStop(0, 'rgba(254, 215, 19, 1)');
  gradientStrokeRed.addColorStop(1, 'rgba(254, 215, 19, 1)');
  var gradientLegendRed = 'linear-gradient(to right, rgba(254, 215, 19, 1), rgba(254, 215, 19, 1))';


  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: LABELS,
        datasets: [
          {
            label: "Not available ",
            borderColor: gradientStrokeViolet,
            backgroundColor: gradientStrokeViolet,
            hoverBackgroundColor: gradientStrokeViolet,
            legendColor: gradientLegendViolet,
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            fill: 'origin',
            data: dataNotAvailable,
          },
          {
            label: "Perhaps",
            borderColor: gradientStrokeRed,
            backgroundColor: gradientStrokeRed,
            hoverBackgroundColor: gradientStrokeRed,
            legendColor: gradientLegendRed,
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            fill: 'origin',
            data: dataPerhaps,
          },
          {
            label: "Available",
            borderColor: gradientStrokeBlue,
            backgroundColor: gradientStrokeBlue,
            hoverBackgroundColor: gradientStrokeBlue,
            legendColor: gradientLegendBlue,
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            fill: 'origin',
            data: dataAvailable,
          }
      ]
    },
    options: {
      responsive: true,
      legend: false,
      legendCallback: function(chart) {
        var text = [];
        text.push('<ul>');
        for (var i = 0; i < chart.data.datasets.length; i++) {
            text.push('<li><span class="legend-dots" style="background:' +
                       chart.data.datasets[i].legendColor +
                       '"></span>');
            if (chart.data.datasets[i].label) {
                text.push(chart.data.datasets[i].label);
            }
            text.push('</li>');
        }
        text.push('</ul>');
        return text.join('');
      },
      scales: {
          yAxes: [{
              ticks: {
                  display: false,
                  min: 0,
                  stepSize: 20,
                  max: 80
              },
              gridLines: {
                drawBorder: false,
                color: 'rgba(235,237,242,1)',
                zeroLineColor: 'rgba(235,237,242,1)'
              }
          }],
          xAxes: [{
              gridLines: {
                display:false,
                drawBorder: false,
                color: 'rgba(0,0,0,1)',
                zeroLineColor: 'rgba(235,237,242,1)'
              },
              ticks: {
                  padding: 20,
                  fontColor: "#9c9fa6",
                  autoSkip: true,
              },
              categoryPercentage: 0.5,
              barPercentage: 0.5
          }]
        }
      },
      elements: {
        point: {
          radius: 0
        }
      }
  })
  $("#visit-sale-chart-legend").html(myChart.generateLegend());
}
});
})(jQuery);
}
///////////////////////////////////////////////////////////////////////
