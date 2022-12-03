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
var itemSettingsButton = [];

var itemsOrganizationName = [];
//переменные для диаграммы на страницы
var LABELS = [];
var dataNotAvailable = [];
var dataPerhaps = [];
var dataAvailable = [];
//переменные для диаграммы на страницы
 var labels_FS = [];
 var data_FS = [];

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
            var idDocOrganization = doc.id;
            var nameOrganization = doc.data().Organization;
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
                            var idDocSubdivision = doc.id;
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
                                             var parentHierarchyDoc = doc.ref.path;
                                             var idDocOrganization = parentHierarchyDoc.split("/")[1];
                                             var idDocSubdivision = parentHierarchyDoc.split("/")[3];
                                             var idDocPosition = parentHierarchyDoc.split("/")[5];
                                             itemsOrganizationName = [];
                                             itemsOrganizationName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: idDocPosition},...{idDocSubdivision: idDocSubdivision},...{idDocOrganization: idDocOrganization}});
                                             // console.log("1.1 => ",itemsOrganizationName);

                                             itemsOrganizationName.forEach(function(element){
                                               var idDocOrganization = element.idDocOrganization ;
                                               var idDocSubdivision = element.idDocSubdivision ;
                                               var idDocPosition = element.idDocPosition ;
                                               var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
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
                                               var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
                                               var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
                                                   if(translation_JS == null || translation_JS == 'en'){
                                                     toComeInUserName.innerHTML = "To come in";
                                                   } else {
                                                     toComeInUserName.innerHTML = "Перейти";
                                                   }
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
            var idDocOrganization = doc.id;
            var nameOrganization = doc.data().Organization;
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
                            var idDocSubdivision = doc.id;
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
                                             var parentHierarchyDoc = doc.ref.path;
                                             var idDocOrganization = parentHierarchyDoc.split("/")[1];
                                             var idDocSubdivision = parentHierarchyDoc.split("/")[3];
                                             var idDocPosition = parentHierarchyDoc.split("/")[5];
                                             itemsOrganizationName = [];
                                             itemsOrganizationName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: idDocPosition},...{idDocSubdivision: idDocSubdivision},...{idDocOrganization: idDocOrganization}});
                                             // console.log("1.1 => ",itemsOrganizationName);

                                             itemsOrganizationName.forEach(function(element){
                                               var idDocOrganization = element.idDocOrganization ;
                                               var idDocSubdivision = element.idDocSubdivision ;
                                               var idDocPosition = element.idDocPosition ;
                                               var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
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
                                               var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
                                               var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
                                                   if(translation_JS == null || translation_JS == 'en'){
                                                     toComeInUserName.innerHTML = "To come in";
                                                   } else {
                                                     toComeInUserName.innerHTML = "Перейти";
                                                   }
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
          var idDocSubdivision = doc.id;
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
                           var parentHierarchyDoc = doc.ref.path;
                           var idDocOrganization = parentHierarchyDoc.split("/")[1];
                           var idDocSubdivision = parentHierarchyDoc.split("/")[3];
                           var idDocPosition = parentHierarchyDoc.split("/")[5];
                           itemsOrganizationName = [];
                           itemsOrganizationName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: idDocPosition},...{idDocSubdivision: idDocSubdivision},...{idDocOrganization: idDocOrganization}});
                           // console.log("1.1 => ",itemsOrganizationName);

                           itemsOrganizationName.forEach(function(element){
                             var idDocOrganization = element.idDocOrganization ;
                             var idDocSubdivision = element.idDocSubdivision ;
                             var idDocPosition = element.idDocPosition ;
                             var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
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
                             var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
                             var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
                                 if(translation_JS == null || translation_JS == 'en'){
                                   toComeInUserName.innerHTML = "To come in";
                                 } else {
                                   toComeInUserName.innerHTML = "Перейти";
                                 }
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
     var parentHierarchyDoc = doc.ref.path;
     var idDocOrganization = parentHierarchyDoc.split("/")[1];
     var idDocSubdivision = parentHierarchyDoc.split("/")[3];
     var idDocPosition = parentHierarchyDoc.split("/")[5];
     itemsOrganizationName = [];
     itemsOrganizationName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: idDocPosition},...{idDocSubdivision: idDocSubdivision},...{idDocOrganization: idDocOrganization}});
    });
    itemsOrganizationName.forEach(function(element){
      var idDocOrganization = element.idDocOrganization ;
      var idDocSubdivision = element.idDocSubdivision ;
      var idDocPosition = element.idDocPosition ;
      var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
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
      var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
      var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
        if(translation_JS == null || translation_JS == 'en'){
          toComeInUserName.innerHTML = "To come in";
        } else {
          toComeInUserName.innerHTML = "Перейти";
        }
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
    var itemsPositionUser = [];
    //перменная для активации кнопки в конце кода
    var button_Control = "";
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
      var objId = obj.id;
      var objItem = obj.item;
      var idDocOrganization = objItem.idDocOrganization;
      var idDocSubdivision = objItem.idDocSubdivision;
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

            var UserСommentColumn = document.createElement('td');
            UserСommentColumn.innerHTML = item.UserСomment;

            tr.appendChild(toDismissColumn);
            tr.appendChild(userEmailColumn);
            tr.appendChild(UserСommentColumn);

            var container = document.getElementById("tableAvalablePositionsListUser").getElementsByTagName("tbody")[0];

            container.appendChild(tr);
          });
        });

        //заполняем таблицу список настроек tableAvalablePositionsListSettings
        itemSettingsButton.push({...{SettingsTitle: "Expect"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability_key: "str0"},...{SettingsSalesFunnel_Stage_key: "str0"},...{SettingsSalesFunnel_Result_key: "str0"}});
        itemSettingsButton.push({...{SettingsTitle: "Other"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability_key: "str0"},...{SettingsSalesFunnel_Stage_key: "str1"},...{SettingsSalesFunnel_Result_key: "str0"}});
        itemSettingsButton.push({...{SettingsTitle: "Gone"},...{SettingsСomment: "base button"},...{SettingsSalesFunnel_Availability_key: "str0"},...{SettingsSalesFunnel_Stage_key: "str0"},...{SettingsSalesFunnel_Result_key: "str0"}});


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
              editSettingsColumn.innerHTML = item.SettingsSalesFunnel_Availability_key;

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
              deleteSettingsColumn.innerHTML = item.SettingsSalesFunnel_Stage_key;

              // var resultButton = document.createElement('select');
              // resultButton.options[0] = new Option("Ignore", "str0");
              // resultButton.options[1] = new Option("Take account of", "str1");
              // resultButton.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
              // resultButton.addEventListener("click", function(e) {console.log("checkbox");  });
              //
              // var resultButtonColumn = document.createElement('td');
              // resultButtonColumn.appendChild(resultButton);

              var resultButtonColumn = document.createElement('td');
              resultButtonColumn.innerHTML = item.SettingsSalesFunnel_Result_key;

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
        if(translation_JS == null || translation_JS == 'en'){
          var li = '<button type="button" class="btn btn-gradient-primary mr-2" onclick="gridDisplay()"> Display </button>';
        } else {
          var li = '<button type="button" class="btn btn-gradient-primary mr-2" onclick="gridDisplay()"> Монитор </button>';
        }
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
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date!.');
    } else {
      alert ("Пожалуйста, укажите дату!");
    }
   return;
  }
  var dayAnalysisStartDate = getAnalysisStartDate.split("/")[0];
  var monthAnalysisStartDate = getAnalysisStartDate.split("/")[1];
  var yearAnalysisStartDate = getAnalysisStartDate.split("/")[2];
  if (dayAnalysisStartDate == undefined)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (monthAnalysisStartDate == undefined)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (yearAnalysisStartDate == undefined)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (dayAnalysisStartDate > 31)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (monthAnalysisStartDate > 12)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (yearAnalysisStartDate.length < 4)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  var getAnalysisExpirationDate = document.getElementById("exampleInputAnalysisExpirationDate").value;
  if (getAnalysisExpirationDate.length < 1)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date!.');
    } else {
      alert ("Пожалуйста, укажите дату!");
    }
   return;
  }
  let dayAnalysisExpirationDate = getAnalysisExpirationDate.split("/")[0];
  let monthAnalysisExpirationDate = getAnalysisExpirationDate.split("/")[1];
  let yearAnalysisExpirationDate = getAnalysisExpirationDate.split("/")[2];
  if (dayAnalysisExpirationDate == undefined)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (monthAnalysisStartDate == undefined)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (yearAnalysisExpirationDate == undefined)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (dayAnalysisExpirationDate > 31)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (monthAnalysisExpirationDate > 12)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  if (yearAnalysisExpirationDate.length < 4)
  {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in the date according to the template!');
    } else {
      alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
    }
    return;
  }
  var getComparisonCheckbox = document.getElementById("exampleInputComparisonCheckbox").checked;
  if (getComparisonCheckbox == true)
  {
    var getComparisonStartDate = document.getElementById("exampleInputComparisonStartDate").value;
    if (getComparisonStartDate.length < 1)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date!.');
      } else {
        alert ("Пожалуйста, укажите дату!");
      }
     return;
    }
    var dayComparisonStartDate = getComparisonStartDate.split("/")[0];
    var monthComparisonStartDate = getComparisonStartDate.split("/")[1];
    var yearComparisonStartDate = getComparisonStartDate.split("/")[2];
    if (dayComparisonStartDate == undefined)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (monthComparisonStartDate == undefined)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (yearComparisonStartDate == undefined)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (dayComparisonStartDate > 31)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (monthComparisonStartDate > 12)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (yearComparisonStartDate.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    var getComparisonExpirationDate = document.getElementById("exampleInputComparisonExpirationDate").value;
    if (getComparisonExpirationDate.length < 1)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date!.');
      } else {
        alert ("Пожалуйста, укажите дату!");
      }
     return;
    }
    var dayComparisonExpirationDate = getComparisonExpirationDate.split("/")[0];
    var monthComparisonExpirationDate = getComparisonExpirationDate.split("/")[1];
    var yearComparisonExpirationDate = getComparisonExpirationDate.split("/")[2];
    if (dayComparisonExpirationDate == undefined)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (monthComparisonExpirationDate == undefined)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (yearComparisonExpirationDate == undefined)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (dayComparisonExpirationDate > 31)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (monthComparisonExpirationDate > 12)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
      return;
    }
    if (yearComparisonExpirationDate.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please fill in the date according to the template!');
      } else {
        alert('Пожалуйста, заполните дату в соответствии с шаблоном!');
      }
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
  var itemPositionsListUser =[];
  var itemPositionsListUser_ResultTable =[];
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
  var length_itemShiftInterval = "";
  var length_itemShiftInterval_1 = 0;
  // получаем документы смен подходящие данному отбору
  var itemShiftInterval = [];
  var itemDocShiftList = [];
  var itemDocShiftList_PK = [];
  var itemShiftInterval_baza = [];
  docRefPosition.collection("PositionShift").where("WorkShiftPositionStart", ">", dateAnalysisStart)
                                            .where("WorkShiftPositionStart", "<", dateAnalysisExpiration)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              var docShift = doc.data();
              var massListPositionUser = docShift.ListPositionUser;
              var idDocPosition = docShift.IdDocPosition;
              var workShiftPositionExpiration = docShift.WorkShiftPositionExpiration;
              var workShiftPositionExpirationMiliseconds = workShiftPositionExpiration.seconds*1000;
              var k = workShiftPositionExpirationMiliseconds+43200000;
              //для увеличения обхвата на 12 часов при поиске документов интервала смены
              var workShiftPositionExpirationGetProcessUser = new Date (k);
              var workShiftPositionStart = docShift.WorkShiftPositionStart;
              var workShiftPositionStartMiliseconds = workShiftPositionStart.seconds*1000;
              var idDocShiftPosition = doc.id;
              //начало проверяем совпадения интервала в шапки документа
              if(workShiftPositionExpirationMiliseconds < dateAnalysisExpirationMilisecond)
              {
                //записываем базовый массив
                itemShiftInterval_baza.push({...doc.data(),...{IdDocShiftPosition: doc.id},...{numerDocShiftPosition: workShiftPositionStartMiliseconds}});
                //начало проверяем список сотрудников по смене со списком сотрудников включенных в отчет
                massListPositionUser.forEach(function(item, i, arr) {
                  var userPositionUser = massListPositionUser[i];
                  var resuitUserList = itemPositionsListUser.includes(userPositionUser);
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
  var userPositionUser = item.userActiveShift;
  var idDocPosition = item.IdDocPosition;
  var idDocShiftPosition = item.IdDocShiftPosition;
  var workShiftPositionStart = item.WorkShiftPositionStart;
  var workShiftPositionStartMiliseconds = workShiftPositionStart.seconds*1000;
  var workShiftPositionExpiration = item.WorkShiftPositionExpiration;
  var workShiftPositionExpirationMiliseconds = workShiftPositionExpiration.seconds*1000;
  var k = workShiftPositionExpirationMiliseconds+43200000;
  //для увеличения обхвата на 12 часов при поиске документов интервала смены
  var workShiftPositionExpirationGetProcessUser = new Date (k);
    //начало отбора документов по сменам должности с привязкой к сотруднику
    var museums = db.collectionGroup('ProcessUser').where("EmailPositionUser", "==", userPositionUser)
                                                    .where("IdDocPosition", "==", idDocPosition)
                                                    .where("ProcessUserEnd", "==", "false")
                                                    .where("ProcessUserEndTime", ">=", workShiftPositionStart)
                                                    .where("ProcessUserEndTime", "<", workShiftPositionExpirationGetProcessUser);
    museums.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var docShiftUser = doc.data();
            var processUserStartTime = docShiftUser.ProcessUserStartTime;
            var processUserStartTimeMiliseconds = processUserStartTime.seconds*1000;
            var processUserEndTime = docShiftUser.ProcessUserEndTime;
            var processUserEndTimeMiliseconds = processUserEndTime.seconds*1000;
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
            var nameDocProcessButton = docShiftUser.NameDocProcessButton;
            itemSettingsButton.forEach(function(item, i, arr) {
              var settingsTitle = item.SettingsTitle;
              if (settingsTitle == nameDocProcessButton)
              {
                var SettingsSalesFunnel_Stage_key = item.SettingsSalesFunnel_Stage_key;
                var processDurationMiliseconds = processUserEndTimeMiliseconds - processUserStartTimeMiliseconds;
                itemDocShiftList.push({...doc.data(),...{idDocProceUser: doc.id},...{IdDocShiftPosition: idDocShiftPosition},...{ProcessUserStartTimeMiliseconds: processUserStartTimeMiliseconds},...{ProcessUserEndTimeMiliseconds: processUserEndTimeMiliseconds},...{SettingsSalesFunnel_Stage_key: SettingsSalesFunnel_Stage_key},...{ProcessDurationMiliseconds: processDurationMiliseconds}});
                itemDocShiftList_PK.push({...doc.data(),...{idDocProceUser: doc.id},...{IdDocShiftPosition: idDocShiftPosition},...{ProcessUserStartTimeMiliseconds: processUserStartTimeMiliseconds},...{ProcessUserEndTimeMiliseconds: processUserEndTimeMiliseconds},...{SettingsSalesFunnel_Stage_key: SettingsSalesFunnel_Stage_key},...{ProcessDurationMiliseconds: processDurationMiliseconds}});
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
      var idDocShiftPosition = item.IdDocShiftPosition;
      var userActiveShift = item.userActiveShift;
      var workShiftPositionStart = item.WorkShiftPositionStart;
      var workShiftPositionStartMiliseconds = (workShiftPositionStart.seconds)*1000;
      var workShiftPositionExpiration = item.WorkShiftPositionExpiration;
      var workShiftPositionExpirationMiliseconds = (workShiftPositionExpiration.seconds)*1000;
      var itemDocShiftList_idDocShiftPosition_User = [];
      itemDocShiftList_PK.forEach(function(item, i, arr) {
        var idDocShiftPosition_1 = item.IdDocShiftPosition;
        if (idDocShiftPosition_1 == idDocShiftPosition)
        {
          var emailPositionUser_1 = item.EmailPositionUser;
          if (emailPositionUser_1 == userActiveShift)
          {
            itemDocShiftList_idDocShiftPosition_User.push(item);
          }
        }
      });
      itemDocShiftList_idDocShiftPosition_User.sort(( a, b ) => a.ProcessUserStartTimeMiliseconds - b.ProcessUserStartTimeMiliseconds);
      var length_itemDocShiftList_idDocShiftPosition_User =itemDocShiftList_idDocShiftPosition_User.length;
      if (length_itemDocShiftList_idDocShiftPosition_User == 0)
      {
        var processDurationMiliseconds_4 = workShiftPositionExpirationMiliseconds - workShiftPositionStartMiliseconds;
        var object = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: workShiftPositionStartMiliseconds, ProcessUserEndTimeMiliseconds: workShiftPositionExpirationMiliseconds, SettingsSalesFunnel_Stage_key: "str0", ProcessDurationMiliseconds: processDurationMiliseconds_4};
        itemDocShiftList_PK.unshift(object);
      } else {
        //начало прорабатываем и дополняем массив
         //добавляю документ в начало
         var itemDocShiftList_idDocShiftPosition_User_0 = itemDocShiftList_idDocShiftPosition_User[0];
         var processUserStartTimeMiliseconds = itemDocShiftList_idDocShiftPosition_User_0.ProcessUserStartTimeMiliseconds;
         if (processUserStartTimeMiliseconds > workShiftPositionStartMiliseconds)
         {
           // let processUserStartTimeMiliseconds_1 = itemDocShiftList_idDocShiftPosition_User[1].ProcessUserStartTimeMiliseconds;
           var processDurationMiliseconds_1 = processUserStartTimeMiliseconds - workShiftPositionStartMiliseconds;
           var object = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: workShiftPositionStartMiliseconds, ProcessUserEndTimeMiliseconds: processUserStartTimeMiliseconds, SettingsSalesFunnel_Stage_key: "str0", ProcessDurationMiliseconds: processDurationMiliseconds_1};
           itemDocShiftList_PK.unshift(object);
         };
         //добавляю документ в конец
         var length = itemDocShiftList_idDocShiftPosition_User.length;
         var length_finall_0 = length - 1;
         var itemDocShiftList_idDocShiftPosition_User_finall_0 = itemDocShiftList_idDocShiftPosition_User[length_finall_0];
         var processUserEndTimeMiliseconds = itemDocShiftList_idDocShiftPosition_User_finall_0.ProcessUserEndTimeMiliseconds;
         if (processUserEndTimeMiliseconds < workShiftPositionExpirationMiliseconds)
         {
           var processDurationMiliseconds_2 = workShiftPositionExpirationMiliseconds - processUserEndTimeMiliseconds;
           var object_1 = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: processUserEndTimeMiliseconds, ProcessUserEndTimeMiliseconds: workShiftPositionExpirationMiliseconds, SettingsSalesFunnel_Stage_key: "str0", ProcessDurationMiliseconds: processDurationMiliseconds_2};
           itemDocShiftList_PK.push(object_1);
         };
         //проверяем интервалы между документами
         var processUserEndTimeMiliseconds_3 = "";
         itemDocShiftList_idDocShiftPosition_User.forEach(function(item, index, array) {
           if (index != 0)
           {
             var processUserStartTimeMiliseconds_3 = item.ProcessUserStartTimeMiliseconds;
               if (processUserStartTimeMiliseconds_3 > processUserEndTimeMiliseconds_3)
               {
                 var processDurationMiliseconds_3 = processUserStartTimeMiliseconds_3 - processUserEndTimeMiliseconds_3;
                 var object_2 = {EmailPositionUser: userActiveShift, idDocProceUser: "PROG", IdDocShiftPosition: idDocShiftPosition, ProcessUserStartTimeMiliseconds: processUserEndTimeMiliseconds_3, ProcessUserEndTimeMiliseconds: processUserStartTimeMiliseconds_3, SettingsSalesFunnel_Stage_key: "str0", ProcessDurationMiliseconds: processDurationMiliseconds_3};
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
var listDataDiogramma = [];
itemShiftInterval_baza.sort(( a, b ) => a.numerDocShiftPosition - b.numerDocShiftPosition);
itemShiftInterval_baza.forEach(function(item, i, arr) {
  var idDocShiftPosition_Baza = item.IdDocShiftPosition;
  var listPositionUser = item.ListPositionUser;
  var workShiftPositionStart = item.WorkShiftPositionStart;
  var workShiftPositionExpiration = item.WorkShiftPositionExpiration;
  var listPositionUser_length = listPositionUser.length;
  var settingsSalesFunnel_Stage_Green = 0;
  var settingsSalesFunnel_Stage_Yellow = 0;
  var settingsSalesFunnel_Stage_Red = 0;
  var itemDocShiftList_length = itemDocShiftList_PK.length - 1;
  itemDocShiftList_PK.forEach(function(item, l, arr) {
    var idDocShiftPosition = item.IdDocShiftPosition;
    var SettingsSalesFunnel_Stage_key = item.SettingsSalesFunnel_Stage_key;
    var processDurationMiliseconds = item.ProcessDurationMiliseconds;
    if (idDocShiftPosition_Baza == idDocShiftPosition)
    {
      if (SettingsSalesFunnel_Stage_key === "Available green")
      {
        settingsSalesFunnel_Stage_Green = settingsSalesFunnel_Stage_Green + processDurationMiliseconds;
      }
      if (SettingsSalesFunnel_Stage_key === "Perhaps yellow")
      {
        settingsSalesFunnel_Stage_Yellow = settingsSalesFunnel_Stage_Yellow + processDurationMiliseconds;
      }
      if (SettingsSalesFunnel_Stage_key === "str0")
      {
        settingsSalesFunnel_Stage_Red = settingsSalesFunnel_Stage_Red + processDurationMiliseconds;
      }
    }
    if (itemDocShiftList_length === l)
    {
        var workShiftPositionStartMiliseconds = (workShiftPositionStart.seconds)*1000;
        var dataStart = new Date(workShiftPositionStartMiliseconds);
        var date_Pos = dataStart.toString();
        var getDay = date_Pos.split(" ")[0];
        var getMonth = date_Pos.split(" ")[1];
        var getDate = date_Pos.split(" ")[2];
        var workShiftPositionStartString = (getDay)+" "+(getDate)+" "+(getMonth);
        var workShiftPositionExpirationMiliseconds = (workShiftPositionExpiration.seconds)*1000;
        var processShiftDurationMiliseconds = workShiftPositionExpirationMiliseconds - workShiftPositionStartMiliseconds;
        var processShiftDurationMilisecondsSum = processShiftDurationMiliseconds*listPositionUser_length;
        var settingsSalesFunnel_Stage_Green_T = (settingsSalesFunnel_Stage_Green*100)/processShiftDurationMilisecondsSum;
        var settingsSalesFunnel_Stage_Yellow_T = (settingsSalesFunnel_Stage_Yellow*100)/processShiftDurationMilisecondsSum;
        var settingsSalesFunnel_Stage_Red_T = (settingsSalesFunnel_Stage_Red*100)/processShiftDurationMilisecondsSum;
        var settingsSalesFunnel_Stage_Green_Percent = settingsSalesFunnel_Stage_Green_T.toFixed(1);
        var settingsSalesFunnel_Stage_Yellow_Percent = settingsSalesFunnel_Stage_Yellow_T.toFixed(1);
        var settingsSalesFunnel_Stage_Red_Percent = settingsSalesFunnel_Stage_Red_T.toFixed(1);
        var object = {LABELS: workShiftPositionStartString, DataNotAvailable: settingsSalesFunnel_Stage_Red_Percent, DataPerhaps: settingsSalesFunnel_Stage_Yellow_Percent, DataAvailable: settingsSalesFunnel_Stage_Green_Percent};
        listDataDiogramma.push(object);
    }
  });
});
listDataDiogramma.forEach(function(item, i, arr) {
  var labels_l = item.LABELS;
  var dataNotAvailable_l = item.DataNotAvailable;
  var dataPerhaps_l = item.DataPerhaps;
  var dataAvailable_1 = item.DataAvailable;
  LABELS.push(labels_l);
  dataNotAvailable.push(dataNotAvailable_l);
  dataPerhaps.push(dataPerhaps_l);
  dataAvailable.push(dataAvailable_1);
  display_Chart();
 });
 // получаем документы за данный период зафиксированные по сменам пользователями участвующих в смене и отборе itemShiftInterval
 var itemDocNoteTraffic = [];
 var length_G = itemShiftInterval.length - 1;
 itemShiftInterval.forEach(function(item, k, arr) {
 var userActiveShift = item.userActiveShift;
 var idDocPosition = item.IdDocPosition;
 var idDocShiftPosition = item.IdDocShiftPosition;
 var workShiftPositionStart = item.WorkShiftPositionStart;
 var workShiftPositionExpiration = item.WorkShiftPositionExpiration;
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
         var listNoteTraffic_Table = [];
         var numer_Array = 0;
         listNoteTrsffic.forEach(function(item, i, arr) {
           var name_Traffic = item.SettingsNoteTrafficOption;
           var numer = 0;
           var length_itemDocNoteTraffic = itemDocNoteTraffic.length - 1;
           itemDocNoteTraffic.forEach(function(item, v, arr) {
             var l = item.NoteText;
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
          var listNoteTraffic_Table_Percent = [];
          listNoteTraffic_Table.forEach(function(item, i, arr) {
            var element_Sum = item.Sum;
            var element_Name = item.Name;
            var element_Sum_Percent = (element_Sum*100)/numer_Array;
            var element_Sum_Percent_Okr = element_Sum_Percent.toFixed(1);
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

var item_ResultTable = [];
itemSettingsButton.forEach(function(item, i, arr) {
var SettingsSalesFunnel_Result_key = item.SettingsSalesFunnel_Result_key;
if (SettingsSalesFunnel_Result_key === "str0" )
{
  var settingsTitle = item.SettingsTitle;
  var object = [];
  var settingsResultControlOption1 = item.SettingsResultControlOption1;
  if (settingsResultControlOption1 !== "")
  {
    object.push(settingsResultControlOption1);
  }
  var settingsResultControlOption2 = item.SettingsResultControlOption2;
  if (settingsResultControlOption2 !== "")
  {
    object.push(settingsResultControlOption2);
  }
  var settingsResultControlOption3 = item.SettingsResultControlOption3;
  if (settingsResultControlOption3 !== "")
  {
    object.push(settingsResultControlOption3);
  }
  var settingsResultControlOption4 = item.SettingsResultControlOption4;
  if (settingsResultControlOption4 !== "")
  {
    object.push(settingsResultControlOption4);
  }
  var settingsResultControlOption5 = item.SettingsResultControlOption5;
  if (settingsResultControlOption5 !== "")
  {
    object.push(settingsResultControlOption5);
  }
  var settingsResultControlOption6 = item.SettingsResultControlOption6;
  if (settingsResultControlOption6 !== "")
  {
    object.push(settingsResultControlOption6);
  }
  var settingsResultControlOption7 = item.SettingsResultControlOption7;
  if (settingsResultControlOption7 !== "")
  {
    object.push(settingsResultControlOption7);
  }
  var settingsResultControlOption8 = item.SettingsResultControlOption8;
  if (settingsResultControlOption8 !== "")
  {
    object.push(settingsResultControlOption8);
  }
  item_ResultTable.push({SettingsTitle: settingsTitle, SettingsResultControlOption: object});
 }
});
var item_ResultTable_Play = [];
item_ResultTable.forEach(function(item, i, arr) {
var settingsTitle = item.SettingsTitle;
var settingsResultControlOption = item.SettingsResultControlOption;
  settingsResultControlOption.forEach(function(item, i, arr) {
     var settingsResultControlOption_Result = settingsResultControlOption[i];
     var length_itemDocShiftList = itemDocShiftList.length - 1;
     var numerElement = 0;
     itemDocShiftList.forEach(function(item, l, arr) {
       var nameDocProcessButton = item.NameDocProcessButton;
       var resultControlButton = item.ResultControlButton;
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
  var sumElement = 0;
  item_ResultTable_Play.forEach(function(item, i, arr) {
    var element_Sum = item.SumElement;
    sumElement = sumElement + element_Sum;
  });
  //вывожу в таблицу
  item_ResultTable_Play.forEach(function(item, i, arr) {
      var element_Sum = item.SumElement;
      var element_Sum_Percent = (element_Sum*100)/sumElement;
      var element_Sum_Percent_Okr = element_Sum_Percent.toFixed(1);

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
 var item_SalesFunnel = [];
 var item_SalesFunnel_SF = [];
 var item_SalesFunnel_SF_Sum = [];
 itemSettingsButton.forEach(function(item, i, arr) {
 var SettingsSalesFunnel_Availability_key = item.SettingsSalesFunnel_Availability_key;
 if (SettingsSalesFunnel_Availability_key === "str0" || SettingsSalesFunnel_Availability_key === "str1"  || SettingsSalesFunnel_Availability_key === "Stage 3 of the sales funnel" || SettingsSalesFunnel_Availability_key === "Stage 4 of the sales funnel" || SettingsSalesFunnel_Availability_key === "Stage 5 of the sales funnel")
 {
   var settingsTitle = item.SettingsTitle;
     item_SalesFunnel.push({SettingsTitle: settingsTitle, SettingsSalesFunnel_Availability_key: SettingsSalesFunnel_Availability_key});
     item_SalesFunnel.sort(( a, b ) => a.SettingsSalesFunnel_Availability - b.SettingsSalesFunnel_Availability);
  }
 });
 item_SalesFunnel.forEach(function(item, i, arr) {
 var SettingsSalesFunnel_Availability_key = item.SettingsSalesFunnel_Availability_key;
 var settingsTitle = item.SettingsTitle;
 var sum_item_SalesFunnel_Element = 0;
 var length_itemDocShiftList = itemDocShiftList.length - 1;
   itemDocShiftList.forEach(function(item, l, arr) {
     var settingsTitle_Doc = item.NameDocProcessButton;
     if (settingsTitle === settingsTitle_Doc)
     {
       sum_item_SalesFunnel_Element = sum_item_SalesFunnel_Element + 1;
     }
     if (length_itemDocShiftList === l)
     {
       item_SalesFunnel_SF.push({SettingsSalesFunnel_Availability_key: SettingsSalesFunnel_Availability_key, SumElementFS: sum_item_SalesFunnel_Element});
     }
   });
 });
 var settingsSalesFunnel_Availability_List = ["Stage 1 of the sales funnel", "Stage 2 of the sales funnel", "Stage 3 of the sales funnel", "Stage 4 of the sales funnel", "Stage 5 of the sales funnel"];
   settingsSalesFunnel_Availability_List.forEach(function(item, i, arr) {
   var settingsSalesFunnel_Availability_Element = settingsSalesFunnel_Availability_List[i];
   var length_item_SalesFunnel_SF = item_SalesFunnel_SF.length - 1;
   var sum_SalesFunnel_SF = 0;
   item_SalesFunnel_SF.forEach(function(item, l, arr) {
     var SettingsSalesFunnel_Availability_key = item.SettingsSalesFunnel_Availability_key;
     if (settingsSalesFunnel_Availability_Element === SettingsSalesFunnel_Availability_key)
     {
       var sumElementFS = item.SumElementFS;
       sum_SalesFunnel_SF = sum_SalesFunnel_SF + sumElementFS;
     }
     if (length_item_SalesFunnel_SF === l)
     {
       item_SalesFunnel_SF_Sum.push({SettingsSalesFunnel_Availability_key: settingsSalesFunnel_Availability_Element, SumElementFS: sum_SalesFunnel_SF});
     }
    });
  });
  item_SalesFunnel_SF_Sum.sort(( a, b ) => a.SettingsSalesFunnel_Availability_key - b.SettingsSalesFunnel_Availability_key);
  // let length_item_SalesFunnel_SF_Sum = item_SalesFunnel_SF_Sum.length - 1;
    item_SalesFunnel_SF_Sum.forEach(function(item, i, arr) {
    var settingsSalesFunnel_Availability_Element = item.SettingsSalesFunnel_Availability;
    var SettingsSalesFunnel_Availability_key = settingsSalesFunnel_Availability_Element.substring(7, -7);
    var sumElementFS = item.SumElementFS;
    if (sumElementFS > 0)
    {
      labels_FS.push(SettingsSalesFunnel_Availability_key);
      data_FS.push(sumElementFS);
    }

    });
    start_salesFunnel();

 // окончание подготавливаем данные для Sales Funnel
}
var listNoteTrsffic = [];
docRefPosition.collection("PositionSettingsNoteTrafic").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        var document = doc.data();
        var settingsNoteTrafficOption1 = document.SettingsNoteTrafficOption1;
        var settingsNoteTrafficOption2 = document.SettingsNoteTrafficOption2;
        var settingsNoteTrafficOption3 = document.SettingsNoteTrafficOption3;
        var settingsNoteTrafficOption4 = document.SettingsNoteTrafficOption4;
        var settingsNoteTrafficOption5 = document.SettingsNoteTrafficOption5;
        var settingsNoteTrafficOption6 = document.SettingsNoteTrafficOption6;
        var settingsNoteTrafficOption7 = document.SettingsNoteTrafficOption7;
        var settingsNoteTrafficOption8 = document.SettingsNoteTrafficOption8;
        var settingsNoteTrafficOption9 = document.SettingsNoteTrafficOption9;
        var settingsNoteTrafficOption10 = document.SettingsNoteTrafficOption10;
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
        localStorage.setItem('TMR::translation', 'ru');
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
