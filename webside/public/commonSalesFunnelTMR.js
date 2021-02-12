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
//переменные для диаграммы на страницы
 let labels_FS = [];
 let data_FS = [];

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
   // очищаем массивы для таблицы
   LABELS = [];
   dataNotAvailable = [];
   dataPerhaps = [];
   dataAvailable = [];
   display_Chart()
   labels_FS = [];
   data_FS = [];
   start_salesFunnel()
   $('#tableTrafficSourcesAnalytics tbody').empty();
   $('#tableResultTable tbody').empty();



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
   LABELS = [];
   dataNotAvailable = [];
   dataPerhaps = [];
   dataAvailable = [];
   display_Chart()
   labels_FS = [];
   data_FS = [];
   start_salesFunnel()
   $('#tableTrafficSourcesAnalytics tbody').empty();
   $('#tableResultTable tbody').empty();
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
   LABELS = [];
   dataNotAvailable = [];
   dataPerhaps = [];
   dataAvailable = [];
   display_Chart()
   labels_FS = [];
   data_FS = [];
   start_salesFunnel()
   $('#tableTrafficSourcesAnalytics tbody').empty();
   $('#tableResultTable tbody').empty();
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
   LABELS = [];
   dataNotAvailable = [];
   dataPerhaps = [];
   dataAvailable = [];
   display_Chart()
   labels_FS = [];
   data_FS = [];
   start_salesFunnel()
   $('#tableTrafficSourcesAnalytics tbody').empty();
   $('#tableResultTable tbody').empty();

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
    //перменная для активации кнопки в конце кода
    let button_Control = "";
    //очищаю таблицу tableAvalablePositionsList
    $('#tableAvalablePositionsListUser tbody').empty();
    //очищаю таблицу tableAvalablePositionsList
    $('#tableAvalablePositionsListSettings tbody').empty();
    //очищаем     docRefPosition = "";
     docRefPosition = "";
     // очистим таблицу настроек кнопок
     LABELS = [];
     dataNotAvailable = [];
     dataPerhaps = [];
     dataAvailable = [];
     display_Chart()
     labels_FS = [];
     data_FS = [];
     start_salesFunnel()
     $('#tableTrafficSourcesAnalytics tbody').empty();
     $('#tableResultTable tbody').empty();
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
// добавляем кнопку по адресу headerGridDisplay
      if (button_Control !== "activ")
      {
        my_div_User = document.getElementById("headerGridDisplay");
        // const ul_User = my_div_User.querySelector("h4");
        let li = '<button type="button" class="btn btn-gradient-primary mr-2" onclick="gridDisplay()"> Display </button>';
        my_div_User.insertAdjacentHTML("afterbegin", li);
        button_Control = "activ";
      }
    };

    /////////////////////////////////////////////////////////////////////////////////////////

/**
* @return {string}
*  Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved.
*/

function gridDisplay()
{
   // очистим таблицу настроек кнопок
   LABELS = [];
   dataNotAvailable = [];
   dataPerhaps = [];
   dataAvailable = [];
   display_Chart()
   labels_FS = [];
   data_FS = [];
   start_salesFunnel()
   $('#tableTrafficSourcesAnalytics tbody').empty();
   $('#tableResultTable tbody').empty();
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
  // для Analytics "Free Sales Consultant"
  let itemPositionsListUser =[];
  let itemPositionsListUser_ResultTable =[];
  var rowLength = tablePositionsListUser.rows.length;
  for (i = 0; i < rowLength; i++){
     var cells = tablePositionsListUser.rows.item(i).cells;
     var cellVal_0 = cells.item(0).lastChild.checked;
     var cellVal_1 = cells.item(1).innerHTML;
     var cellVal_2 = cells.item(2).innerHTML;
     if(cellVal_0 == true)
     {
       itemPositionsListUser.push(cellVal_1)
     }
  }

  //переменные для запуска команды формирования отчета
  let length_itemShiftInterval = "";
  let length_itemShiftInterval_1 = 0;
  // получаем документы смен подходящие данному отбору
  let itemShiftInterval = [];
  let itemDocShiftList = [];
  let itemDocShiftList_PK = [];
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
                  let userPositionUser = massListPositionUser[i];
                  let resuitUserList = itemPositionsListUser.includes(userPositionUser);
                    if (resuitUserList == true)
                    {
                      // //окончание отбора документов по сменам должности с привязкой к сотруднику
                      itemShiftInterval.push({...doc.data(),...{IdDocShiftPosition: doc.id},...{numerDocShiftPosition: workShiftPositionStartMiliseconds},...{userActiveShift: userPositionUser}});
                      itemShiftInterval.sort(( a, b ) => a.numerDocShiftPosition - b.numerDocShiftPosition);
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
         processArray_itemDocShiftList()
      });

      //

function processArray_itemDocShiftList()
{
  itemShiftInterval.forEach(function(item, i, arr) {
  let userPositionUser = item.userActiveShift;
  let idDocPosition = item.IdDocPosition;
  let idDocShiftPosition = item.IdDocShiftPosition;
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
                itemDocShiftList_PK.push({...doc.data(),...{idDocProceUser: doc.id},...{IdDocShiftPosition: idDocShiftPosition},...{ProcessUserStartTimeMiliseconds: processUserStartTimeMiliseconds},...{ProcessUserEndTimeMiliseconds: processUserEndTimeMiliseconds},...{SettingsSalesFunnel_Stage: settingsSalesFunnel_Stage},...{ProcessDurationMiliseconds: processDurationMiliseconds}});
                itemDocShiftList.sort(( a, b ) => a.ProcessUserStartTimeMiliseconds - b.ProcessUserStartTimeMiliseconds);
                itemDocShiftList_PK.sort(( a, b ) => a.ProcessUserStartTimeMiliseconds - b.ProcessUserStartTimeMiliseconds);

              }
            });
            // окончание получение статуса кнопки
            }
        });
     }).finally(() => {
        length_itemShiftInterval_1 = length_itemShiftInterval_1 + 1;
        if (length_itemShiftInterval == length_itemShiftInterval_1)
        {
          processArray_itemShiftInterval();
        }
     });
    //окончание отбора документов по сменам должности с привязкой к сотруднику
  });
}

function processArray_itemShiftInterval()
{

   itemShiftInterval.forEach(function(item, i, arr) {
      // начало заполняес интервалы смен недоступностью
      let idDocShiftPosition = item.IdDocShiftPosition;
      let userActiveShift = item.userActiveShift;
      let workShiftPositionStart = item.WorkShiftPositionStart;
      let workShiftPositionStartMiliseconds = (workShiftPositionStart.seconds)*1000;
      let workShiftPositionExpiration = item.WorkShiftPositionExpiration;
      let workShiftPositionExpirationMiliseconds = (workShiftPositionExpiration.seconds)*1000;
      let itemDocShiftList_idDocShiftPosition_User = [];
      itemDocShiftList_PK.forEach(function(item, i, arr) {
        let idDocShiftPosition_1 = item.IdDocShiftPosition;
        if (idDocShiftPosition_1 == idDocShiftPosition)
        {
          let emailPositionUser_1 = item.EmailPositionUser;
          if (emailPositionUser_1 == userActiveShift)
          {
            itemDocShiftList_idDocShiftPosition_User.push(item);
          }
        }
      });
      itemDocShiftList_idDocShiftPosition_User.sort(( a, b ) => a.ProcessUserStartTimeMiliseconds - b.ProcessUserStartTimeMiliseconds);
      let length_itemDocShiftList_idDocShiftPosition_User =itemDocShiftList_idDocShiftPosition_User.length;
      if (length_itemDocShiftList_idDocShiftPosition_User == 0)
      {
        let processDurationMiliseconds_4 = workShiftPositionExpirationMiliseconds - workShiftPositionStartMiliseconds;
        let object = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: workShiftPositionStartMiliseconds, ProcessUserEndTimeMiliseconds: workShiftPositionExpirationMiliseconds, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_4};
        itemDocShiftList_PK.unshift(object);
      } else {
        //начало прорабатываем и дополняем массив
         //добавляю документ в начало
         let itemDocShiftList_idDocShiftPosition_User_0 = itemDocShiftList_idDocShiftPosition_User[0];
         let processUserStartTimeMiliseconds = itemDocShiftList_idDocShiftPosition_User_0.ProcessUserStartTimeMiliseconds;
         if (processUserStartTimeMiliseconds > workShiftPositionStartMiliseconds)
         {
           // let processUserStartTimeMiliseconds_1 = itemDocShiftList_idDocShiftPosition_User[1].ProcessUserStartTimeMiliseconds;
           let processDurationMiliseconds_1 = processUserStartTimeMiliseconds - workShiftPositionStartMiliseconds;
           let object = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: workShiftPositionStartMiliseconds, ProcessUserEndTimeMiliseconds: processUserStartTimeMiliseconds, SettingsSalesFunnel_Stage: "Not available red", ProcessDurationMiliseconds: processDurationMiliseconds_1};
           itemDocShiftList_PK.unshift(object);
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
           itemDocShiftList_PK.push(object_1);
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
                 itemDocShiftList_PK.push(object_2);
               }
           }
           processUserEndTimeMiliseconds_3 = item.ProcessUserEndTimeMiliseconds;
          });
        //окончание прорабатываем и дополняем массив
      }
      // окончание проверки пользователь входящих  ListPositionUser
  });
//обрабатываем массив для диограммы
let listDataDiogramma = [];
itemShiftInterval_baza.sort(( a, b ) => a.numerDocShiftPosition - b.numerDocShiftPosition);
itemShiftInterval_baza.forEach(function(item, i, arr) {
  let idDocShiftPosition_Baza = item.IdDocShiftPosition;
  let listPositionUser = item.ListPositionUser;
  let workShiftPositionStart = item.WorkShiftPositionStart;
  let workShiftPositionExpiration = item.WorkShiftPositionExpiration;
  let listPositionUser_length = listPositionUser.length;
  let settingsSalesFunnel_Stage_Green = 0;
  let settingsSalesFunnel_Stage_Yellow = 0;
  let settingsSalesFunnel_Stage_Red = 0;
  let itemDocShiftList_length = itemDocShiftList_PK.length - 1;
  itemDocShiftList_PK.forEach(function(item, l, arr) {
    let idDocShiftPosition = item.IdDocShiftPosition;
    let settingsSalesFunnel_Stage = item.SettingsSalesFunnel_Stage;
    let processDurationMiliseconds = item.ProcessDurationMiliseconds;
    if (idDocShiftPosition_Baza == idDocShiftPosition)
    {
      if (settingsSalesFunnel_Stage === "Available green")
      {
        settingsSalesFunnel_Stage_Green = settingsSalesFunnel_Stage_Green + processDurationMiliseconds;
      }
      if (settingsSalesFunnel_Stage === "Perhaps yellow")
      {
        settingsSalesFunnel_Stage_Yellow = settingsSalesFunnel_Stage_Yellow + processDurationMiliseconds;
      }
      if (settingsSalesFunnel_Stage === "Not available red")
      {
        settingsSalesFunnel_Stage_Red = settingsSalesFunnel_Stage_Red + processDurationMiliseconds;
      }
    }
    if (itemDocShiftList_length === l)
    {
        let workShiftPositionStartMiliseconds = (workShiftPositionStart.seconds)*1000;
        let dataStart = new Date(workShiftPositionStartMiliseconds);
        let date_Pos = dataStart.toString();
        let getDay = date_Pos.split(" ")[0];
        let getMonth = date_Pos.split(" ")[1];
        let getDate = date_Pos.split(" ")[2];
        let workShiftPositionStartString = (getDay)+" "+(getDate)+" "+(getMonth);
        let workShiftPositionExpirationMiliseconds = (workShiftPositionExpiration.seconds)*1000;
        let processShiftDurationMiliseconds = workShiftPositionExpirationMiliseconds - workShiftPositionStartMiliseconds;
        let processShiftDurationMilisecondsSum = processShiftDurationMiliseconds*listPositionUser_length;
        let settingsSalesFunnel_Stage_Green_T = (settingsSalesFunnel_Stage_Green*100)/processShiftDurationMilisecondsSum;
        let settingsSalesFunnel_Stage_Yellow_T = (settingsSalesFunnel_Stage_Yellow*100)/processShiftDurationMilisecondsSum;
        let settingsSalesFunnel_Stage_Red_T = (settingsSalesFunnel_Stage_Red*100)/processShiftDurationMilisecondsSum;
        let settingsSalesFunnel_Stage_Green_Percent = settingsSalesFunnel_Stage_Green_T.toFixed(1);
        let settingsSalesFunnel_Stage_Yellow_Percent = settingsSalesFunnel_Stage_Yellow_T.toFixed(1);
        let settingsSalesFunnel_Stage_Red_Percent = settingsSalesFunnel_Stage_Red_T.toFixed(1);
        let object = {LABELS: workShiftPositionStartString, DataNotAvailable: settingsSalesFunnel_Stage_Red_Percent, DataPerhaps: settingsSalesFunnel_Stage_Yellow_Percent, DataAvailable: settingsSalesFunnel_Stage_Green_Percent};
        listDataDiogramma.push(object);
    }
  });
});
listDataDiogramma.forEach(function(item, i, arr) {
  let labels_l = item.LABELS;
  let dataNotAvailable_l = item.DataNotAvailable;
  let dataPerhaps_l = item.DataPerhaps;
  let dataAvailable_1 = item.DataAvailable;
  LABELS.push(labels_l);
  dataNotAvailable.push(dataNotAvailable_l);
  dataPerhaps.push(dataPerhaps_l);
  dataAvailable.push(dataAvailable_1);
  display_Chart();
 });
 // получаем документы за данный период зафиксированные по сменам пользователями участвующих в смене и отборе itemShiftInterval
 let itemDocNoteTraffic = [];
 let length_G = itemShiftInterval.length - 1;
 itemShiftInterval.forEach(function(item, k, arr) {
 let userActiveShift = item.userActiveShift;
 let idDocPosition = item.IdDocPosition;
 let idDocShiftPosition = item.IdDocShiftPosition;
 let workShiftPositionStart = item.WorkShiftPositionStart;
 let workShiftPositionExpiration = item.WorkShiftPositionExpiration;
 db.collection("Note") .where("NoteSource", "==", "note_traffic")
                       .where("NoteIdDocPosition", "==", idDocPosition)
                       .where("NoteUser", "==", userActiveShift)
                       .where("NoteTime", ">=", workShiftPositionStart)
                       .where("NoteTime", "<=", workShiftPositionExpiration)
     .get()
     .then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
             // doc.data() is never undefined for query doc snapshots
             itemDocNoteTraffic.push({...doc.data(),...{IdDocNote: doc.id},...{IdDocShiftPosition: idDocShiftPosition}});
         });
     })
     .catch((error) => {
         console.log("Error getting documents: ", error);
     }).finally(() => {
       if (length_G === k)
       {
         //начало заполняем таблицу Traffic Sources Analytics
         let listNoteTraffic_Table = [];
         let numer_Array = 0;
         listNoteTrsffic.forEach(function(item, i, arr) {
           let name_Traffic = item.SettingsNoteTrafficOption;
           let numer = 0;
           let length_itemDocNoteTraffic = itemDocNoteTraffic.length - 1;
           itemDocNoteTraffic.forEach(function(item, v, arr) {
             let l = item.NoteText;
             if (name_Traffic === l)
             {
               numer = numer + 1;
               numer_Array = numer_Array + 1;

             }
             if (length_itemDocNoteTraffic == v)
             {
               listNoteTraffic_Table.push({Name:name_Traffic, Sum: numer})
             }
           });
          });
          // расчитать процентные соотношения listNoteTraffic_Table
          let listNoteTraffic_Table_Percent = [];
          listNoteTraffic_Table.forEach(function(item, i, arr) {
            let element_Sum = item.Sum;
            let element_Name = item.Name;
            let element_Sum_Percent = (element_Sum*100)/numer_Array;
            let element_Sum_Percent_Okr = element_Sum_Percent.toFixed(1);
            listNoteTraffic_Table_Percent.push({Name:element_Name, Sum: element_Sum, SumPercent: element_Sum_Percent_Okr});
          });

          //вывожу в таблицу
          listNoteTraffic_Table_Percent.forEach(function(item, i, arr) {
            // listNoteTraffic_Table.forEach(item => {
             var tr = document.createElement("tr");

             var sum_Column = document.createElement('td');
             sum_Column.innerHTML = item.Sum;

             var numer_Column = document.createElement('td');
             numer_Column.innerHTML = i + 1;

             var name_Column = document.createElement('td');
             name_Column.innerHTML = item.Name;

             var deleteSettings = document.createElement('div');
             deleteSettings.className = 'progress';
             var sum_Percent = item.SumPercent;
             var style_element = 'width: '+sum_Percent+'%';
             var text = document.createElement('div');
             var className_element = ["progress-bar bg-success", "progress-bar bg-danger", "progress-bar bg-warning", "progress-bar bg-primary", "progress-bar bg-danger", "progress-bar bg-info", "progress-bar bg-warning", "progress-bar bg-success", "progress-bar bg-danger", "progress-bar bg-warning"];
             text.className = className_element[i];
             text.setAttribute("role", "progressbar");
             text.setAttribute("aria-valuenow", sum_Percent);
             text.setAttribute("aria-valuemin", "0");
             text.setAttribute("aria-valuemax", "100");
             text.style = style_element;
             deleteSettings.appendChild( text );
             deleteSettings.addEventListener("click", function(e) {console.log("checkbox");  });

             var sum_Percent_Column = document.createElement('td');
             sum_Percent_Column.appendChild(deleteSettings);

             tr.appendChild(numer_Column);
             tr.appendChild(name_Column);
             tr.appendChild(sum_Column);
             tr.appendChild(sum_Percent_Column);

             var container = document.getElementById("tableTrafficSourcesAnalytics").getElementsByTagName("tbody")[0];

             container.appendChild(tr);
          });
         //окончание заполняем таблицу Traffic Sources Analytics
       }
     });
 });
 // окончание заполняем таблицу Traffic Sources Analytics
 // начало подготавливаем данные для таблицы Result Table

let item_ResultTable = [];
itemSettingsButton.forEach(function(item, i, arr) {
let settingsSalesFunnel_Result = item.SettingsSalesFunnel_Result;
if (settingsSalesFunnel_Result === "Take account of" )
{
  let settingsTitle = item.SettingsTitle;
  let object = [];
  let settingsResultControlOption1 = item.SettingsResultControlOption1;
  if (settingsResultControlOption1 !== "")
  {
    object.push(settingsResultControlOption1);
  }
  let settingsResultControlOption2 = item.SettingsResultControlOption2;
  if (settingsResultControlOption2 !== "")
  {
    object.push(settingsResultControlOption2);
  }
  let settingsResultControlOption3 = item.SettingsResultControlOption3;
  if (settingsResultControlOption3 !== "")
  {
    object.push(settingsResultControlOption3);
  }
  let settingsResultControlOption4 = item.SettingsResultControlOption4;
  if (settingsResultControlOption4 !== "")
  {
    object.push(settingsResultControlOption4);
  }
  let settingsResultControlOption5 = item.SettingsResultControlOption5;
  if (settingsResultControlOption5 !== "")
  {
    object.push(settingsResultControlOption5);
  }
  let settingsResultControlOption6 = item.SettingsResultControlOption6;
  if (settingsResultControlOption6 !== "")
  {
    object.push(settingsResultControlOption6);
  }
  let settingsResultControlOption7 = item.SettingsResultControlOption7;
  if (settingsResultControlOption7 !== "")
  {
    object.push(settingsResultControlOption7);
  }
  let settingsResultControlOption8 = item.SettingsResultControlOption8;
  if (settingsResultControlOption8 !== "")
  {
    object.push(settingsResultControlOption8);
  }
  item_ResultTable.push({SettingsTitle: settingsTitle, SettingsResultControlOption: object});
 }
});
let item_ResultTable_Play = [];
item_ResultTable.forEach(function(item, i, arr) {
let settingsTitle = item.SettingsTitle;
let settingsResultControlOption = item.SettingsResultControlOption;
  settingsResultControlOption.forEach(function(item, i, arr) {
     let settingsResultControlOption_Result = settingsResultControlOption[i];
     let length_itemDocShiftList = itemDocShiftList.length - 1;
     let numerElement = 0;
     itemDocShiftList.forEach(function(item, l, arr) {
       let nameDocProcessButton = item.NameDocProcessButton;
       let resultControlButton = item.ResultControlButton;
       if (settingsTitle === nameDocProcessButton && settingsResultControlOption_Result === resultControlButton)
       {
         numerElement = numerElement + 1;
       }
       if (length_itemDocShiftList == l)
       {
         item_ResultTable_Play.push({SettingsTitle: settingsTitle, SettingsResultControlOption: settingsResultControlOption_Result, SumElement: numerElement});
       }
      });
    });
  });
// расчитываем процент Result Table
  let sumElement = 0;
  item_ResultTable_Play.forEach(function(item, i, arr) {
    let element_Sum = item.SumElement;
    sumElement = sumElement + element_Sum;
  });
  //вывожу в таблицу
  item_ResultTable_Play.forEach(function(item, i, arr) {
      let element_Sum = item.SumElement;
      let element_Sum_Percent = (element_Sum*100)/sumElement;
      let element_Sum_Percent_Okr = element_Sum_Percent.toFixed(1);

     var tr = document.createElement("tr");

     var numer_Column = document.createElement('td');
     numer_Column.innerHTML = i + 1;

     var name_Column = document.createElement('td');
     name_Column.innerHTML = item.SettingsTitle;

     var nameResult_Column = document.createElement('td');
     nameResult_Column.innerHTML = item.SettingsResultControlOption;

     var sum_Column = document.createElement('td');
     sum_Column.innerHTML = item.SumElement;

     var deleteSettings = document.createElement('div');
     deleteSettings.className = 'progress';
     // var sum_Percent = item.SumPercent;
     var style_element = 'width: '+element_Sum_Percent_Okr+'%';
     var text = document.createElement('div');
     var className_element = ["progress-bar bg-success", "progress-bar bg-danger", "progress-bar bg-warning", "progress-bar bg-primary", "progress-bar bg-danger", "progress-bar bg-info", "progress-bar bg-warning", "progress-bar bg-success", "progress-bar bg-danger", "progress-bar bg-warning"];
     text.className = className_element[i];
     text.setAttribute("role", "progressbar");
     text.setAttribute("aria-valuenow", element_Sum_Percent_Okr);
     text.setAttribute("aria-valuemin", "0");
     text.setAttribute("aria-valuemax", "100");
     text.style = style_element;
     deleteSettings.appendChild( text );
     deleteSettings.addEventListener("click", function(e) {console.log("checkbox");  });

     var sum_Percent_Column = document.createElement('td');
     sum_Percent_Column.appendChild(deleteSettings);

     tr.appendChild(numer_Column);
     tr.appendChild(name_Column);
     tr.appendChild(nameResult_Column);
     tr.appendChild(sum_Column);
     tr.appendChild(sum_Percent_Column);

     var container = document.getElementById("tableResultTable").getElementsByTagName("tbody")[0];

     container.appendChild(tr);
  });
 // окончание подготавливаем данные для таблицы Result Table
 // начало подготавливаем данные для Sales Funnel
 let item_SalesFunnel = [];
 let item_SalesFunnel_SF = [];
 let item_SalesFunnel_SF_Sum = [];
 itemSettingsButton.forEach(function(item, i, arr) {
 let settingsSalesFunnel_Availability = item.SettingsSalesFunnel_Availability;
 if (settingsSalesFunnel_Availability === "Stage 1 of the sales funnel" || settingsSalesFunnel_Availability === "Stage 2 of the sales funnel"  || settingsSalesFunnel_Availability === "Stage 3 of the sales funnel" || settingsSalesFunnel_Availability === "Stage 4 of the sales funnel" || settingsSalesFunnel_Availability === "Stage 5 of the sales funnel")
 {
   let settingsTitle = item.SettingsTitle;
     item_SalesFunnel.push({SettingsTitle: settingsTitle, SettingsSalesFunnel_Availability: settingsSalesFunnel_Availability});
     item_SalesFunnel.sort(( a, b ) => a.SettingsSalesFunnel_Availability - b.SettingsSalesFunnel_Availability);
  }
 });
 item_SalesFunnel.forEach(function(item, i, arr) {
 let settingsSalesFunnel_Availability = item.SettingsSalesFunnel_Availability;
 let settingsTitle = item.SettingsTitle;
 let sum_item_SalesFunnel_Element = 0;
 let length_itemDocShiftList = itemDocShiftList.length - 1;
   itemDocShiftList.forEach(function(item, l, arr) {
     let settingsTitle_Doc = item.NameDocProcessButton;
     if (settingsTitle === settingsTitle_Doc)
     {
       sum_item_SalesFunnel_Element = sum_item_SalesFunnel_Element + 1;
     }
     if (length_itemDocShiftList === l)
     {
       item_SalesFunnel_SF.push({SettingsSalesFunnel_Availability: settingsSalesFunnel_Availability, SumElementFS: sum_item_SalesFunnel_Element});
     }
   });
 });
 let settingsSalesFunnel_Availability_List = ["Stage 1 of the sales funnel", "Stage 2 of the sales funnel", "Stage 3 of the sales funnel", "Stage 4 of the sales funnel", "Stage 5 of the sales funnel"];
   settingsSalesFunnel_Availability_List.forEach(function(item, i, arr) {
   let settingsSalesFunnel_Availability_Element = settingsSalesFunnel_Availability_List[i];
   let length_item_SalesFunnel_SF = item_SalesFunnel_SF.length - 1;
   let sum_SalesFunnel_SF = 0;
   item_SalesFunnel_SF.forEach(function(item, l, arr) {
     let settingsSalesFunnel_Availability = item.SettingsSalesFunnel_Availability;
     if (settingsSalesFunnel_Availability_Element === settingsSalesFunnel_Availability)
     {
       let sumElementFS = item.SumElementFS;
       sum_SalesFunnel_SF = sum_SalesFunnel_SF + sumElementFS;
     }
     if (length_item_SalesFunnel_SF === l)
     {
       item_SalesFunnel_SF_Sum.push({SettingsSalesFunnel_Availability: settingsSalesFunnel_Availability_Element, SumElementFS: sum_SalesFunnel_SF});
     }
    });
  });
  item_SalesFunnel_SF_Sum.sort(( a, b ) => a.SettingsSalesFunnel_Availability - b.SettingsSalesFunnel_Availability);
  // let length_item_SalesFunnel_SF_Sum = item_SalesFunnel_SF_Sum.length - 1;
    item_SalesFunnel_SF_Sum.forEach(function(item, i, arr) {
    let settingsSalesFunnel_Availability_Element = item.SettingsSalesFunnel_Availability;
    let settingsSalesFunnel_Availability = settingsSalesFunnel_Availability_Element.substring(7, -7);
    let sumElementFS = item.SumElementFS;
    if (sumElementFS > 0)
    {
      labels_FS.push(settingsSalesFunnel_Availability);
      data_FS.push(sumElementFS);
    }

    });
    start_salesFunnel();

 // окончание подготавливаем данные для Sales Funnel
}
let listNoteTrsffic = [];
docRefPosition.collection("PositionSettingsNoteTrafic").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        let document = doc.data();
        let settingsNoteTrafficOption1 = document.SettingsNoteTrafficOption1;
        let settingsNoteTrafficOption2 = document.SettingsNoteTrafficOption2;
        let settingsNoteTrafficOption3 = document.SettingsNoteTrafficOption3;
        let settingsNoteTrafficOption4 = document.SettingsNoteTrafficOption4;
        let settingsNoteTrafficOption5 = document.SettingsNoteTrafficOption5;
        let settingsNoteTrafficOption6 = document.SettingsNoteTrafficOption6;
        let settingsNoteTrafficOption7 = document.SettingsNoteTrafficOption7;
        let settingsNoteTrafficOption8 = document.SettingsNoteTrafficOption8;
        let settingsNoteTrafficOption9 = document.SettingsNoteTrafficOption9;
        let settingsNoteTrafficOption10 = document.SettingsNoteTrafficOption10;
        if (settingsNoteTrafficOption1 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption1});
        }
        if (settingsNoteTrafficOption2 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption2});
        }
        if (settingsNoteTrafficOption3 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption3});
        }
        if (settingsNoteTrafficOption4 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption4});
        }
        if (settingsNoteTrafficOption5 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption5});
        }
        if (settingsNoteTrafficOption6 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption6});
        }
        if (settingsNoteTrafficOption7 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption7});
        }
        if (settingsNoteTrafficOption8 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption8});
        }
        if (settingsNoteTrafficOption9 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption9});
        }
        if (settingsNoteTrafficOption10 !== "")
        {
          listNoteTrsffic.push({SettingsNoteTrafficOption: settingsNoteTrafficOption10});
        }
    });
});

}


function display_Chart()
{(function($) {
  'use strict';
  $(function() {
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
///////////////////////////////////////////////////////////////////////
   }
  });
 })(jQuery);
}

function start_salesFunnel()
{
///////////////////////////////////////////////////////////////////////
$(function () {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';
  var data = {
    labels: labels_FS,
    datasets: [{
      label: '# number of events',
      data: data_FS,
      // data: [1],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1,
      fill: false
    }]
  };

  var options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    }

  };
  // Get context with jQuery - using jQuery's .get() method.
  if ($("#barChart").length) {
    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: data,
      options: options
    });
  }
 });
};
