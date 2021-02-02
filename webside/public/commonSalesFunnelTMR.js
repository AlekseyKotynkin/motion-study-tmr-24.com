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


let itemsOrganizationName = [];




//////////////////////////////////////////////////////////////////////////////////
function gridDisplayOrganizationOwner() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListUser tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListSettings tbody').empty();

/**
* @return {string}
* Получение данных для таблицы List of own organizations из firestore с фильтром собственник организации
*/

db.collection("Organization").where("OwnerEmail", "==", EmailLocalStorage)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            let idDocOrganization = doc.id;
            let nameOrganization = doc.data().Organization;
            // alert('Compiling a list of users of your organization '+nameOrganization+'.');
            // * начало получаем коллекции которые относятся к Организации найденых по запросу выше
            var docRef = db.collection("Organization").doc(idDocOrganization);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    // начало* получаем коллекции которые относятся к Организации найденых по запросу выше
                    docRef.collection("Subdivision").get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());
                            let idDocSubdivision = doc.id;
                            // начало* получаем id документов Subdivision найденых по запросу выше
                            var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
                            docRefSubdivision.get().then(function(doc) {
                                if (doc.exists) {
                                    console.log("Document data:", doc.data());
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
                                             console.log("1.1 => ",itemsOrganizationName);

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
  $('#tableAvalablePositionsListUser tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListSettings tbody').empty();

/**
* @return {string}
* Получение данных для таблицы List of own organizations из firestore с фильтром менеджер организации
*/
db.collection("Organization").where("PositionOfYourManager", "==", EmailLocalStorage)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            let idDocOrganization = doc.id;
            let nameOrganization = doc.data().Organization;
            // alert('Compiling a list of users of your organization '+nameOrganization+'.');
            // * начало получаем коллекции которые относятся к Организации найденых по запросу выше
            var docRef = db.collection("Organization").doc(idDocOrganization);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    // начало* получаем коллекции которые относятся к Организации найденых по запросу выше
                    docRef.collection("Subdivision").get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());
                            let idDocSubdivision = doc.id;
                            // начало* получаем id документов Subdivision найденых по запросу выше
                            var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
                            docRefSubdivision.get().then(function(doc) {
                                if (doc.exists) {
                                    console.log("Document data:", doc.data());
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
                                             console.log("1.1 => ",itemsOrganizationName);

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
  $('#tableAvalablePositionsListUser tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListSettings tbody').empty();

/**
* @return {string}
* Получение данных для таблицы List of own organizations из firestore с фильтром менеджер подразделения
*/

  var parentHierarchy = db.collectionGroup('Subdivision').where('SubdivisionOfYourManager', '==', EmailLocalStorage);
  parentHierarchy.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let idDocSubdivision = doc.id;
          // начало* получаем id документов Subdivision найденых по запросу выше
          var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
          docRefSubdivision.get().then(function(doc) {
              if (doc.exists) {
                  console.log("Document data:", doc.data());
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
                           console.log("1.1 => ",itemsOrganizationName);

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
  $('#tableAvalablePositionsListUser tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsListSettings tbody').empty();

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
    $('#tableAvalablePositionsListUser tbody').empty();
    //очищаю таблицу tableAvalablePositionsList
    $('#tableAvalablePositionsListSettings tbody').empty();

    // var table1 = document.getElementById("tableAvalablePositionsListSettings");
    // var rowCount1 = table1.rows.length;
    // for (var i=rowCount1-1; i >=0; i--) {
    //     table1.deleteRow(i);
    // }
    //обработка редактирования строки...
      let objId = obj.id;
      let objItem = obj.item;
      let idDocOrganization = objItem.idDocOrganization;
      let idDocSubdivision = objItem.idDocSubdivision;
    //заполняем таблицу список пользователей tableAvalablePositionsListUser
      var docRef = db.collection("Organization").doc(idDocOrganization);
      var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
      var docRefPosition = docRefSubdivision.collection("Position").doc(objId);
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

            var container = document.getElementById("tableAvalablePositionsListUser").getElementsByTagName("tbody")[0];

            container.appendChild(tr);
          });
        });
        //заполняем таблицу список настроек tableAvalablePositionsListSettings



        //заполняем таблицу список настроек tableAvalablePositionsListSettings
        let items = [];
        items.push({...{SettingsTitle: "Expect"},...{SettingsСomment: "base button"}});
        items.push({...{SettingsTitle: "Other"},...{SettingsСomment: "base button"}});
        items.push({...{SettingsTitle: "Gone"},...{SettingsСomment: "base button"}});


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

              var editSettings = document.createElement('select');
              editSettings.options[0] = new Option("does not participate", "str0");
              editSettings.options[1] = new Option("Stage 1 of the sales funnel", "str1");
              editSettings.options[2] = new Option("Stage 2 of the sales funnel", "str2");
              editSettings.options[3] = new Option("Stage 3 of the sales funnel", "str3");
              editSettings.options[4] = new Option("Stage 4 of the sales funnel", "str4");
              editSettings.options[5] = new Option("Stage 5 of the sales funnel", "str5");
              editSettings.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
              editSettings.addEventListener("click", function(e) {console.log("checkbox");  });

              var editSettingsColumn = document.createElement('td');
              editSettingsColumn.appendChild(editSettings);

              var deleteSettings = document.createElement('select');
              deleteSettings.options[0] = new Option("Not available red", "str0");
              deleteSettings.options[1] = new Option("Perhaps yellow", "str1");
              deleteSettings.options[2] = new Option("Available green", "str2");
              deleteSettings.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
              deleteSettings.addEventListener("click", function(e) {console.log("checkbox");  });

              var deleteSettingsColumn = document.createElement('td');
              deleteSettingsColumn.appendChild(deleteSettings);

              var resultButton = document.createElement('select');
              resultButton.options[0] = new Option("Ignore", "str0");
              resultButton.options[1] = new Option("Take account of", "str1");
              resultButton.className = 'btn btn-sm btn-outline-primary dropdown-toggle';
              resultButton.addEventListener("click", function(e) {console.log("checkbox");  });

              var resultButtonColumn = document.createElement('td');
              resultButtonColumn.appendChild(resultButton);

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
  }
// сменный график работы подразделения














}
