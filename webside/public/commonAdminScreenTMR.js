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
//переменная для понимания обновления кнопки
let buttonNumber = "";


 /**
 * @return {string}
 *  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
 */
const LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
const UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
const EmailLocalStorage = (LocalStorageValueObject[0]).email;
const FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;


let itemsOrganizationName = [];
let idDocPosition = "";
let idDocOrganization = "";
let idDocSubdivision = "";
let positionShift = "";




//////////////////////////////////////////////////////////////////////////////////
function gridDisplayOrganizationOwner() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tablePositionShift tbody').empty();
  // обнуляем позицию
  let positionShift = "";
  //убрать кнопку из таблицыц
   var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
   document.body.innerHTML = document.body.innerHTML.replace(regex, '');
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
                                    console.log("No such document!");
                                }
                            }).catch(function(error) {
                                console.log("Error getting document:", error);
                            });
                            // окончание* получаем id документов Subdivision найденых по запросу выше
                        });
                    });
                    // окончание* получаем коллекции которые относятся к Организации найденых по запросу выше
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            // * окончание получаем коллекции которые относятся к Организации найденых по запросу выше
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

}
////////////////////////////////////////////////////////////////////////////////////
function gridDisplayManagerOrganization() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tablePositionShift tbody').empty();
  // обнуляем позицию
  let positionShift = "";
  //очищаю таблицу tableAvalablePositionsList
  // $('#tableAvalablePositionsListSettings tbody').empty();
  //убрать кнопку из таблицыц
   var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
   document.body.innerHTML = document.body.innerHTML.replace(regex, '');
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
                                    console.log("No such document!");
                                }
                            }).catch(function(error) {
                                console.log("Error getting document:", error);
                            });
                            // окончание* получаем id документов Subdivision найденых по запросу выше
                        });
                    });
                    // окончание* получаем коллекции которые относятся к Организации найденых по запросу выше
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            // * окончание получаем коллекции которые относятся к Организации найденых по запросу выше
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

}
////////////////////////////////////////////////////////////////////////////////////
function gridDisplayManagerSubdivision() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tablePositionShift tbody').empty();
  // обнуляем позицию
  let positionShift = "";
  //очищаю таблицу tableAvalablePositionsList
  // $('#tableAvalablePositionsListSettings tbody').empty();
  //убрать кнопку из таблицыц
   var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
   document.body.innerHTML = document.body.innerHTML.replace(regex, '');
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
                         console.log(doc.id, " => ", doc.data());
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
                  console.log("No such document!");
              }
          }).catch(function(error) {
              console.log("Error getting document:", error);
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
  $('#tablePositionShift tbody').empty();
  // обнуляем позицию
  let positionShift = "";
  //очищаю таблицу tableAvalablePositionsList
  // $('#tableAvalablePositionsListSettings tbody').empty();
  //убрать кнопку из таблицыц
   var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
   document.body.innerHTML = document.body.innerHTML.replace(regex, '');  /**
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
    $('#tablePositionShift tbody').empty();
    //очищаю таблицу tableAvalablePositionsList
    $('#tableShiftPositionsListUser tbody').empty();
    //очищаю таблицу tableAvalablePositionsList
    $('#tableShiftPositionsListUser_Edit tbody').empty();
    // обнуляем позицию
    let positionShift = "";
    //обработка редактирования строки...
      idDocPosition = obj.id;
      let objItem = obj.item;
      idDocOrganization = objItem.idDocOrganization;
      idDocSubdivision = objItem.idDocSubdivision;
    //заполняем таблицу список пользователей tableAvalablePositionsListUser
      var docRef = db.collection("Organization").doc(idDocOrganization);
      var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
      var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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

            var container = document.getElementById("tableShiftPositionsListUser").getElementsByTagName("tbody")[0];
            // var container = document.getElementById("tableShiftPositionsListUser_Edit").getElementsByTagName("tbody")[0];

            container.appendChild(tr);
          });
        });
        //заполняем таблицу список настроек tableAvalablePositionsListSettings
        fillTablePositionShift();
        //активируем кнопку + ADD  addButtonShiftPosition
        if(buttonNumber == ""){
          buttonNumber = "yes";
          my_div_User = document.getElementById("addButtonShiftPosition");
          const ul_User = my_div_User.querySelector("h4");
          let li = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
          ul_User.insertAdjacentHTML("afterend", li);
        }



    };
/////////////////////////////////////////////////////////////////////////////////////////


  /**
  * @return {string}
   *  Обработчик заполнения таблицы tablePositionShift.
   */

  function fillTablePositionShift() {
    $('#tablePositionShift tbody').empty();
    let itemsPositionShift = [];
    let docRef = db.collection("Organization").doc(idDocOrganization);
    let docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
    let docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
    docRefPosition.collection("PositionShift")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        ///
        let documents = doc.data();
        let workShiftPositionStart = documents.WorkShiftPositionStart;
        let secondsStart = workShiftPositionStart.seconds*1000;
        let dataStart = new Date(secondsStart);
        let l = dataStart.toString();
        let getDay = l.split(" ")[0];
        let getMonth = l.split(" ")[1];
        let getDate = l.split(" ")[2];
        let getFullYear = l.split(" ")[3];
        let getTime = l.split(" ")[4];
        let getHours = getTime.split(":")[0];
        let getMinutes = getTime.split(":")[1];
        let workShiftPositionStartString = (getDay)+" "+(getDate)+" "+(getMonth)+" "+(getFullYear)+" _ "+(getHours)+":"+(getMinutes);
        ///
        let workShiftPositionExpiration = documents.WorkShiftPositionExpiration;
        let secondsExpiration = workShiftPositionExpiration.seconds*1000;
        let dataExpiration = new Date(secondsExpiration);
        let lE = dataExpiration.toString();
        let getDayExpiration = lE.split(" ")[0];
        let getMonthExpiration = lE.split(" ")[1];
        let getDateExpiration = lE.split(" ")[2];
        let getFullYearExpiration = lE.split(" ")[3];
        let getTimeExpiration = lE.split(" ")[4];
        let getHoursExpiration = getTimeExpiration.split(":")[0];
        let getMinutesExpiration = getTimeExpiration.split(":")[1];
        let workShiftPositionExpirationString = (getHoursExpiration)+":"+(getMinutesExpiration)+" _  "+(getDayExpiration)+" "+(getDateExpiration)+" "+(getMonthExpiration)+" "+(getFullYearExpiration);
        ///
        let listPositionUser = documents.ListPositionUser;
        let numberUsers = listPositionUser.length;
        ///
        itemsPositionShift.push({...doc.data(),...{idPositionShift: doc.id},...{WorkShiftPositionStartString: workShiftPositionStartString},...{WorkShiftPositionExpirationString: workShiftPositionExpirationString},...{NumberUsers: numberUsers},...{NumberPositionTable: secondsStart}});
        itemsPositionShift.sort(( a, b ) => b.NumberPositionTable - a.NumberPositionTable);
      });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
          .finally(() => {itemsPositionShift;
          itemsPositionShift.forEach(item => {
          var tr = document.createElement("tr");

          var workShiftPositionStartColumn = document.createElement('td');
          workShiftPositionStartColumn.innerHTML = item.WorkShiftPositionStartString;

          var workShiftPositionExpirationColumn = document.createElement('td');
          workShiftPositionExpirationColumn.innerHTML = item.WorkShiftPositionExpirationString;

          var shiftNumberColumn = document.createElement('td');
          shiftNumberColumn.innerHTML = item.ShiftNumber;

          var numberUsersColumn = document.createElement('td');
          numberUsersColumn.innerHTML = item.NumberUsers;

          var changeShiftData = document.createElement('button');
          changeShiftData.innerHTML = "To come in";
          changeShiftData.className = 'badge badge-gradient-success';
          changeShiftData.id = item.idPositionShift;
          changeShiftData.item = item;
          changeShiftData.setAttribute('onclick', 'changeShiftDataButton(this)');

          var changeShiftDataColumn = document.createElement('td');
          changeShiftDataColumn.appendChild(changeShiftData);

          var editShiftData = document.createElement('button');
          editShiftData.innerHTML = "Edit";
          editShiftData.className = 'badge badge-gradient-warning';
          editShiftData.id = item.idPositionShift;
          editShiftData.item = item;
          editShiftData.setAttribute('onclick', 'editShiftDataButton(this)');

          var editShiftDataColumn = document.createElement('td');
          editShiftDataColumn.appendChild(editShiftData);

          var deleteShiftData = document.createElement('button');
          deleteShiftData.innerHTML = "Delete";
          deleteShiftData.className = 'badge badge-gradient-danger';
          deleteShiftData.id = item.idPositionShift;
          deleteShiftData.item = item;
          deleteShiftData.setAttribute('onclick', 'deleteShiftDataButton(this)');

          var deleteShiftDataColumn = document.createElement('td');
          deleteShiftDataColumn.appendChild(deleteShiftData);

          tr.appendChild(workShiftPositionStartColumn);
          tr.appendChild(workShiftPositionExpirationColumn);
          tr.appendChild(shiftNumberColumn);
          tr.appendChild(numberUsersColumn);
          tr.appendChild(changeShiftDataColumn);
          tr.appendChild(editShiftDataColumn);
          tr.appendChild(deleteShiftDataColumn);

          var container = document.getElementById("tablePositionShift").getElementsByTagName("tbody")[0];

          container.appendChild(tr);
        });
      });
};


/////////////////////////////////////////////////////////////////////////////////////////


  /**
  * @return {string}
   *  Обработчик кнопки Submit модального окна gridSystemModalShiftPosition.
   */

  function gridSystemModalShiftPositionsListSubmit() {
    //получаем и проверяем заполненость ячеек из формы
    var getShiftNumber = document.getElementById("exampleInputShiftNumber").value;
    var getInputShiftStartDate = document.getElementById("exampleInputShiftStartDate").value;
    if (getInputShiftStartDate.length < 1)
    {
     alert('Please fill in the date!.');
     return;
    }
    let dayShiftStartDate = getInputShiftStartDate.split("/")[0];
    let monthShiftStartDate = getInputShiftStartDate.split("/")[1];
    let yearShiftStartDate = getInputShiftStartDate.split("/")[2];
    if (dayShiftStartDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (monthShiftStartDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (yearShiftStartDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (dayShiftStartDate > 31)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (monthShiftStartDate > 12)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (yearShiftStartDate.length < 4)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    var getInputShiftStartTime = document.getElementById("exampleInputShiftStartTime").value;
    if (getInputShiftStartTime.length < 1)
    {
     alert('Please fill in the date!.');
     return;
    }
    let hourShiftStartTime = getInputShiftStartTime.split("/")[0];
    let minutesShiftStartTime = getInputShiftStartTime.split("/")[1];
    if (hourShiftStartTime == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (minutesShiftStartTime == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (hourShiftStartTime > 23)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (minutesShiftStartTime > 59)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    ///
    var getInputShiftExpirationDate = document.getElementById("exampleInputShiftExpirationDate").value;
    if (getInputShiftExpirationDate.length < 1)
    {
     alert('Please fill in the date!.');
     return;
    }
    let dayShiftExpirationDate = getInputShiftExpirationDate.split("/")[0];
    let monthShiftExpirationDate = getInputShiftExpirationDate.split("/")[1];
    let yearShiftExpirationDate = getInputShiftExpirationDate.split("/")[2];
    if (dayShiftExpirationDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (monthShiftExpirationDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (yearShiftExpirationDate == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (dayShiftExpirationDate > 31)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (monthShiftExpirationDate > 12)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (yearShiftExpirationDate.length < 4)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    var getInputShiftExpirationTime = document.getElementById("exampleInputShiftExpirationTime").value;
    if (getInputShiftExpirationTime.length < 1)
    {
     alert('Please fill in the date!.');
     return;
    }
    let hourShiftExpirationTime = getInputShiftExpirationTime.split("/")[0];
    let minutesShiftExpirationTime = getInputShiftExpirationTime.split("/")[1];
    if (hourShiftExpirationTime == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (minutesShiftExpirationTime == undefined)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (hourShiftExpirationTime > 23)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    if (minutesShiftExpirationTime > 59)
    {
      alert('Please fill in the date according to the template!');
      return;
    }
    //собираем формат времени
    var dateTimeDocumentCreation = firebase.firestore.FieldValue.serverTimestamp();
    var dateShiftStart = new Date(yearShiftStartDate, monthShiftStartDate-1, dayShiftStartDate, hourShiftStartTime, minutesShiftStartTime, 0);
    var dateShiftExpiration = new Date(yearShiftExpirationDate, monthShiftExpirationDate-1, dayShiftExpirationDate, hourShiftExpirationTime, minutesShiftExpirationTime, 0);
    //читаем данные с таблицы
    var tableShiftPositions = document.getElementById('tableShiftPositionsListUser');
    //удалил шапку таблицы
    let itemShiftPositions =[];
    tableShiftPositions.deleteRow(0);
    var rowLength = tableShiftPositions.rows.length;
    for (i = 0; i < rowLength; i++){
       var cells = tableShiftPositions.rows.item(i).cells;
       var cellVal_0 = cells.item(0).lastChild.checked;
       if (cellVal_0 == true)
       {
         var cellVal_1 = cells.item(1).innerHTML;
         var cellVal_2 = cells.item(2).innerHTML;
         itemShiftPositions.push(cellVal_1)
       }
    }
    //Добавляем документ
    // Add a new document with a generated id.
    var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
    var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
    var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
    docRefPosition.collection("PositionShift").add({
        WorkShiftPositionStart: dateShiftStart,
        WorkShiftPositionExpiration: dateShiftExpiration,
        ShiftNumber: getShiftNumber,
        ListPositionUser: itemShiftPositions,
        DateTimeDocumentCreation: dateTimeDocumentCreation,
        IdDocPosition: idDocPosition,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    // перезаполнить таблицу
     fillTablePositionShift();
    //закрываем модальное документов
    $("#gridSystemModalShiftPosition").modal('hide');
}
/////////////////////////////////////////////////////////////////////////////////////////
  /**
  * @return {string}
   *  Обработчик кнопки Submit модального окна gridSystemModalShiftPosition.
   */
   function deleteShiftDataButton (obj)
   {
     let objId = obj.id;
     var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
     var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
     var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
     docRefPosition.collection("PositionShift").doc(objId).delete().then(() => {
          console.log("Document successfully deleted!");
          fillTablePositionShift();
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
   }
   /////////////////////////////////////////////////////////////////////////////////////////
/**
* @return {string}
*  Обработчик кнопки Submit модального окна gridSystemModalShiftPosition.
*/
function editShiftDataButton (obj)
{
  // обнуляем позицию
  positionShift = obj.id;
  let listPositionUser = [];
  let itemsPositionUser_Edit =[];
  var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
  var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
  var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
  var docRef = docRefPosition.collection("PositionShift").doc(positionShift);
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            let docyment = doc.data();
            listPositionUser = docyment.ListPositionUser;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


    //заполняем таблицу список пользователей tableAvalablePositionsListUser
      var docRef = db.collection("Organization").doc(idDocOrganization);
      var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
      var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
      docRefPosition.collection("PositionUser")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let docyment_Item = doc.data();
          let userEmail = docyment_Item.UserEmail;
          let checkedStatus = false;
          let resuitUserList = listPositionUser.includes(userEmail);
            if (resuitUserList == true)
            {
              checkedStatus = true;
            }
          itemsPositionUser_Edit.push({...doc.data(),...{idPositionUser: doc.id},...{CheckedStatus: checkedStatus}});
        });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          }).finally(() => {itemsPositionUser_Edit;
            let length_itemsPositionUser_Edit = itemsPositionUser_Edit.length - 1;
            itemsPositionUser_Edit.forEach(function(item, i, arr){
            var tr = document.createElement("tr");

            var toDismissColumn1 = document.createElement('input');
            toDismissColumn1.type = "checkbox";
            var checkedStatus = item.CheckedStatus;
            toDismissColumn1.checked = checkedStatus;
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

            var container = document.getElementById("tableShiftPositionsListUser_Edit").getElementsByTagName("tbody")[0];
            container.appendChild(tr);
            if (length_itemsPositionUser_Edit === i)
            {
              $('#gridSystemModalShiftPosition_Edit').modal('show');
            }
          });
        });
 }
 /////////////////////////////////////////////////////////////////////////////////////////
 /**
 * @return {string}
 *  Обработчик кнопки Submit модального окна gridSystemModalShiftPosition.
 */
 function gridSystemModalShiftPositionsListSubmit_Edit()
 {
   //читаем данные с таблицы
   let tableShiftPositions_Edit = document.getElementById('tableShiftPositionsListUser_Edit');
   //удалил шапку таблицы
   let itemShiftPositions_Edit =[];
   tableShiftPositions_Edit.deleteRow(0);
   let rowLength_Edit = tableShiftPositions_Edit.rows.length;
   for (i = 0; i < rowLength_Edit; i++){
      let cells = tableShiftPositions_Edit.rows.item(i).cells;
      let cellVal_0 = cells.item(0).lastChild.checked;
      if (cellVal_0 == true)
      {
        let cellVal_1 = cells.item(1).innerHTML;
        let cellVal_2 = cells.item(2).innerHTML;
        itemShiftPositions_Edit.push(cellVal_1)
      }
   }
   let docRefOrganization = db.collection("Organization").doc(idDocOrganization);
   let docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
   let docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
   var washingtonRef = docRefPosition.collection("PositionShift").doc(positionShift);
   // Set the "capital" field of the city 'DC'
   return washingtonRef.update({
       ListPositionUser: itemShiftPositions_Edit
   })
   .then(() => {
       console.log("Document successfully updated!");
       // перезаполнить таблицу
        fillTablePositionShift();
        //закрываем модальное документов
        $("#gridSystemModalShiftPosition_Edit").modal('hide');
   })
   .catch((error) => {
       // The document probably doesn't exist.
       console.error("Error updating document: ", error);
   });
 }
/////////////////////////////////////////////////////////////////////////////////////////
/**
* @return {string}
*  Обработчик кнопки Submit модального окна gridSystemModalShiftPosition.
*/
function changeShiftDataButton (obj)
{
  let objId = obj.id;
  let objId_item = obj.item;
  let itemsShiftDataButton = [];
  let control_Play = 0;
  let listPositionUser = objId_item.ListPositionUser;
  let length_listPositionUser = listPositionUser.length;
  listPositionUser.forEach(function(item, i, arr) {
   let email = listPositionUser[i];
   let idDocWorkShift = "";
   let workShiftPositionStartString ="";
   let workShiftPositionStartString_P ="";
   // начало поиск открытых смен у пользователей
   db.collection("WorkShift").where("EmailPositionUser", "==", email)
                             .where("IdDocPosition", "==", idDocPosition)
                             .where("WorkShiftEnd", "==", "")
       .get()
       .then((querySnapshot) => {
           querySnapshot.forEach((doc) => {
               // doc.data() is never undefined for query doc snapshots
               // console.log(doc.id, " => ", doc.data());
               let docyment =  doc.data();
               let workShiftStartTime = docyment.WorkShiftStartTime;
               let secondsStart = workShiftStartTime.seconds*1000;
               let dataStart = new Date(secondsStart);
               let l = dataStart.toString();
               // let getDay = l.split(" ")[0];
               let getMonth = l.split(" ")[1];
               let getDate = l.split(" ")[2];
               // let getFullYear = l.split(" ")[3];
               let getTime = l.split(" ")[4];
               let getHours = getTime.split(":")[0];
               let getMinutes = getTime.split(":")[1];
               workShiftPositionStartString ="From "+(getDate)+" "+(getMonth)+" _ "+(getHours)+":"+(getMinutes);
               // console.log(workShiftPositionStartString);
               idDocWorkShift = doc.id;

           });
       })
       .catch((error) => {
           console.log("Error getting documents: ", error);
       }).finally(() => {
       // начало отбираем открытый документ смены пользователя
         let docWorkShift = db.collection("WorkShift").doc(idDocWorkShift);
         docWorkShift.collection("ProcessUser").where("ProcessUserEnd", "==", "")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                let docyment_Element =  doc.data();
                let nameDocProcessButton = docyment_Element.NameDocProcessButton;
                let processUserStartTime_P = docyment_Element.ProcessUserStartTime;
                let secondsStart_P = processUserStartTime_P.seconds*1000;
                let dataStart_P = new Date(secondsStart_P);
                let l = dataStart_P.toString();
                // let getDay = l.split(" ")[0];
                let getMonth_P = l.split(" ")[1];
                let getDate_P = l.split(" ")[2];
                // let getFullYear = l.split(" ")[3];
                let getTime_P = l.split(" ")[4];
                let getHours_P = getTime_P.split(":")[0];
                let getMinutes_P = getTime_P.split(":")[1];
                workShiftPositionStartString_P ="From "+(getDate_P)+" "+(getMonth_P)+" _ "+(getHours_P)+":"+(getMinutes_P);
                itemsShiftDataButton.push({Email: email, PersonalChange: workShiftPositionStartString, Status: workShiftPositionStartString_P});
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
          }).finally(() => {
              if (length_listPositionUser === control_Play)
              {
                 showShiftDataButton();
              }
          });
       // окончание отбираем открытый документ смены пользователя
   // окончание поиск открытых смен у пользователей
     });
     control_Play = control_Play + 1;
  });

function showShiftDataButton()
{
  listPositionUser.forEach(function(item, i, arr) {
    let email_Play = listPositionUser[i];
    let obj = itemsShiftDataButton.find(o => o.Email === email_Play);
      if (obj == undefined)
      {
        itemsShiftDataButton.push({Email: email_Play, PersonalChange: "Shift is not open", Status: "No open events"});
      }
  });
  // начало отображаем таблицу
  itemsShiftDataButton.forEach(function(item, i, arr) {
  var tr = document.createElement("tr");

  var numer_Column = document.createElement('td');
  numer_Column.innerHTML = i + 1;

  var email_Column = document.createElement('td');
  email_Column.innerHTML = item.Email;

  var personalChange_Column = document.createElement('td');
  personalChange_Column.innerHTML = item.PersonalChange;

  var status_Column = document.createElement('td');
  status_Column.innerHTML = item.Status;

  // var СurrentEvent_Column = document.createElement('td');
  // СurrentEvent_Column.innerHTML = item.СurrentEvent;

  // var changeShiftData = document.createElement('button');
  // changeShiftData.innerHTML = "To come in";
  // changeShiftData.className = 'badge badge-gradient-success';
  // changeShiftData.id = item.idPositionShift;
  // changeShiftData.item = item;
  // changeShiftData.setAttribute('onclick', 'changeShiftDataButton(this)');
  //
  // var changeShiftDataColumn = document.createElement('td');
  // changeShiftDataColumn.appendChild(changeShiftData);
  //
  // var editShiftData = document.createElement('button');
  // editShiftData.innerHTML = "Edit";
  // editShiftData.className = 'badge badge-gradient-warning';
  // editShiftData.id = item.idPositionShift;
  // editShiftData.item = item;
  // editShiftData.setAttribute('onclick', 'editShiftDataButton(this)');
  //
  // var editShiftDataColumn = document.createElement('td');
  // editShiftDataColumn.appendChild(editShiftData);
  //
  // var deleteShiftData = document.createElement('button');
  // deleteShiftData.innerHTML = "Delete";
  // deleteShiftData.className = 'badge badge-gradient-danger';
  // deleteShiftData.id = item.idPositionShift;
  // deleteShiftData.item = item;
  // deleteShiftData.setAttribute('onclick', 'deleteShiftDataButton(this)');
  //
  // var deleteShiftDataColumn = document.createElement('td');
  // deleteShiftDataColumn.appendChild(deleteShiftData);

  tr.appendChild(numer_Column);
  tr.appendChild(email_Column);
  tr.appendChild(personalChange_Column);
  tr.appendChild(status_Column);
  // tr.appendChild(СurrentEvent_Column);
  // tr.appendChild(editShiftDataColumn);
  // tr.appendChild(deleteShiftDataColumn);

  var container = document.getElementById("tableEmploymentUser").getElementsByTagName("tbody")[0];

  container.appendChild(tr);
});


  // окончание отображаем таблицу
}

//tableEmploymentUser



}
