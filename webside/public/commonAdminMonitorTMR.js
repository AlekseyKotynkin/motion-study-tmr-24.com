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
//переменная для понимания обновления кнопки
var buttonNumber = "";


/**
* @return {string}
*  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
*/
const LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
const UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
const EmailLocalStorage = (LocalStorageValueObject[0]).email;
const FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;


var itemsOrganizationName = [];
var idDocPosition = "";
var idDocOrganization = "";
var idDocSubdivision = "";
var positionShift = "";




//////////////////////////////////////////////////////////////////////////////////
function gridDisplayOrganizationOwner() {
  //очищаю таблицу tableAvalablePositionsList
  $('#tableAvalablePositionsList tbody').empty();
  //очищаю таблицу tableAvalablePositionsList
  $('#tablePositionShift tbody').empty();
  // обнуляем позицию
  var positionShift = "";
  //убрать кнопку из таблицы
  if(translation_JS == null || translation_JS == 'en'){
    var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
    document.body.innerHTML = document.body.innerHTML.replace(regex, '');
  } else {
    var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
    document.body.innerHTML = document.body.innerHTML.replace(regex, '');
  }

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
                            console.log("No such document!");
                          }
                        }).catch(function(error) {
                          console.log("Error getting document:", error);
                        });
                        var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
                        var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
    var positionShift = "";
    //очищаю таблицу tableAvalablePositionsList
    // $('#tableAvalablePositionsListSettings tbody').empty();
    //убрать кнопку из таблицы
    if(translation_JS == null || translation_JS == 'en'){
      var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
      document.body.innerHTML = document.body.innerHTML.replace(regex, '');
    } else {
      var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
      document.body.innerHTML = document.body.innerHTML.replace(regex, '');
    }

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
                              console.log("No such document!");
                            }
                          }).catch(function(error) {
                            console.log("Error getting document:", error);
                          });
                          var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
                          var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
      var positionShift = "";
      //очищаю таблицу tableAvalablePositionsList
      // $('#tableAvalablePositionsListSettings tbody').empty();
      //убрать кнопку из таблицыц
      if(translation_JS == null || translation_JS == 'en'){
        var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
        document.body.innerHTML = document.body.innerHTML.replace(regex, '');
      } else {
        var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
        document.body.innerHTML = document.body.innerHTML.replace(regex, '');
      }

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
                  console.log(doc.id, " => ", doc.data());
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
                        console.log("No such document!");
                      }
                    }).catch(function(error) {
                      console.log("Error getting document:", error);
                    });
                    var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
                    var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
        var positionShift = "";
        //очищаю таблицу tableAvalablePositionsList
        // $('#tableAvalablePositionsListSettings tbody').empty();
        //убрать кнопку из таблицыц
        if(translation_JS == null || translation_JS == 'en'){
          var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
          document.body.innerHTML = document.body.innerHTML.replace(regex, '');
        } else {
          var regex = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
          document.body.innerHTML = document.body.innerHTML.replace(regex, '');
        }

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
                console.log("No such document!");
              }
            }).catch(function(error) {
              console.log("Error getting document:", error);
            });
            var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
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
            var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
          //очищаю таблицу tableAvalablePositionsList
          $('#tablePositionShift tbody').empty();
          //очищаю таблицу tableAvalablePositionsList
          $('#tableShiftPositionsListUser tbody').empty();
          //очищаю таблицу tableAvalablePositionsList
          $('#tableShiftPositionsListUser_Edit tbody').empty();
          // обнуляем позицию
          var positionShift = "";
          //обработка редактирования строки...
          idDocPosition = obj.id;
          var objItem = obj.item;
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

              var UserСommentColumn = document.createElement('td');
              UserСommentColumn.innerHTML = item.UserСomment;

              tr.appendChild(toDismissColumn);
              tr.appendChild(userEmailColumn);
              tr.appendChild(UserСommentColumn);

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
            if(translation_JS == null || translation_JS == 'en'){
              var li = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
            } else {
              var li = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalShiftPosition">+ Add Position Shift</button>';
            }
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
          var itemsPositionShift = [];
          var docRef = db.collection("Organization").doc(idDocOrganization);
          var docRefSubdivision = docRef.collection("Subdivision").doc(idDocSubdivision);
          var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
          docRefPosition.collection("PositionShift")
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              ///
              var documents = doc.data();
              var workShiftPositionStart = documents.WorkShiftPositionStart;
              var secondsStart = workShiftPositionStart.seconds*1000;
              var dataStart = new Date(secondsStart);
              var l = dataStart.toString();
              var getDay = l.split(" ")[0];
              var getMonth = l.split(" ")[1];
              var getDate = l.split(" ")[2];
              var getFullYear = l.split(" ")[3];
              var getTime = l.split(" ")[4];
              var getHours = getTime.split(":")[0];
              var getMinutes = getTime.split(":")[1];
              var workShiftPositionStartString = (getDay)+" "+(getDate)+" "+(getMonth)+" "+(getFullYear)+" _ "+(getHours)+":"+(getMinutes);
              ///
              var workShiftPositionExpiration = documents.WorkShiftPositionExpiration;
              var secondsExpiration = workShiftPositionExpiration.seconds*1000;
              var dataExpiration = new Date(secondsExpiration);
              var lE = dataExpiration.toString();
              var getDayExpiration = lE.split(" ")[0];
              var getMonthExpiration = lE.split(" ")[1];
              var getDateExpiration = lE.split(" ")[2];
              var getFullYearExpiration = lE.split(" ")[3];
              var getTimeExpiration = lE.split(" ")[4];
              var getHoursExpiration = getTimeExpiration.split(":")[0];
              var getMinutesExpiration = getTimeExpiration.split(":")[1];
              var workShiftPositionExpirationString = (getHoursExpiration)+":"+(getMinutesExpiration)+" _  "+(getDayExpiration)+" "+(getDateExpiration)+" "+(getMonthExpiration)+" "+(getFullYearExpiration);
              ///
              var listPositionUser = documents.ListPositionUser;
              var numberUsers = listPositionUser.length;
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
              if(translation_JS == null || translation_JS == 'en'){
                changeShiftData.innerHTML = "To come in";
              } else {
                changeShiftData.innerHTML = "Перейти";
              }
              changeShiftData.className = 'badge badge-gradient-success';
              changeShiftData.id = item.idPositionShift;
              changeShiftData.item = item;
              changeShiftData.setAttribute('onclick', 'changeShiftDataButton(this)');

              var changeShiftDataColumn = document.createElement('td');
              changeShiftDataColumn.appendChild(changeShiftData);

              var editShiftData = document.createElement('button');
              if(translation_JS == null || translation_JS == 'en'){
                editShiftData.innerHTML = "Edit";
              } else {
                editShiftData.innerHTML = "Редактировать";
              }
              editShiftData.className = 'badge badge-gradient-warning';
              editShiftData.id = item.idPositionShift;
              editShiftData.item = item;
              editShiftData.setAttribute('onclick', 'editShiftDataButton(this)');

              var editShiftDataColumn = document.createElement('td');
              editShiftDataColumn.appendChild(editShiftData);

              var deleteShiftData = document.createElement('button');
              if(translation_JS == null || translation_JS == 'en'){
                deleteShiftData.innerHTML = "Delete";
              } else {
                deleteShiftData.innerHTML = "Удалить";
              }
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
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date!.');
            } else {
              alert ("Пожалуйста, укажите дату!");
            }
            return;
          }
          var dayShiftStartDate = getInputShiftStartDate.split("/")[0];
          var monthShiftStartDate = getInputShiftStartDate.split("/")[1];
          var yearShiftStartDate = getInputShiftStartDate.split("/")[2];
          if (dayShiftStartDate == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (monthShiftStartDate == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (yearShiftStartDate == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (dayShiftStartDate > 31)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (monthShiftStartDate > 12)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (yearShiftStartDate.length < 4)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          var getInputShiftStartTime = document.getElementById("exampleInputShiftStartTime").value;
          if (getInputShiftStartTime.length < 1)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date!.');
            } else {
              alert ("Пожалуйста, укажите дату!");
            }
            return;
          }
          var hourShiftStartTime = getInputShiftStartTime.split("/")[0];
          var minutesShiftStartTime = getInputShiftStartTime.split("/")[1];
          if (hourShiftStartTime == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (minutesShiftStartTime == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (hourShiftStartTime > 23)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (minutesShiftStartTime > 59)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          ///
          var getInputShiftExpirationDate = document.getElementById("exampleInputShiftExpirationDate").value;
          if (getInputShiftExpirationDate.length < 1)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date!.');
            } else {
              alert ("Пожалуйста, укажите дату!");
            }
            return;
          }
          var dayShiftExpirationDate = getInputShiftExpirationDate.split("/")[0];
          var monthShiftExpirationDate = getInputShiftExpirationDate.split("/")[1];
          var yearShiftExpirationDate = getInputShiftExpirationDate.split("/")[2];
          if (dayShiftExpirationDate == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (monthShiftExpirationDate == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (yearShiftExpirationDate == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (dayShiftExpirationDate > 31)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (monthShiftExpirationDate > 12)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (yearShiftExpirationDate.length < 4)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          var getInputShiftExpirationTime = document.getElementById("exampleInputShiftExpirationTime").value;
          if (getInputShiftExpirationTime.length < 1)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date!.');
            } else {
              alert ("Пожалуйста, укажите дату!");
            }
            return;
          }
          var hourShiftExpirationTime = getInputShiftExpirationTime.split("/")[0];
          var minutesShiftExpirationTime = getInputShiftExpirationTime.split("/")[1];
          if (hourShiftExpirationTime == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (minutesShiftExpirationTime == undefined)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (hourShiftExpirationTime > 23)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          if (minutesShiftExpirationTime > 59)
          {
            if(translation_JS == null || translation_JS == 'en'){
              alert('Please fill in the date according to the template!');
            } else {
              alert ("Пожалуйста, заполните дату в соответствии с шаблоном!");
            }
            return;
          }
          //собираем формат времени
          var dateTimeDocumentCreation = firebase.firestore.FieldValue.serverTimestamp();
          var dateShiftStart = new Date(yearShiftStartDate, monthShiftStartDate-1, dayShiftStartDate, hourShiftStartTime, minutesShiftStartTime, 0);
          var dateShiftExpiration = new Date(yearShiftExpirationDate, monthShiftExpirationDate-1, dayShiftExpirationDate, hourShiftExpirationTime, minutesShiftExpirationTime, 0);
          //читаем данные с таблицы
          var tableShiftPositions = document.getElementById('tableShiftPositionsListUser');
          //удалил шапку таблицы
          var itemShiftPositions =[];
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
          var objId = obj.id;
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
          var listPositionUser = [];
          var itemsPositionUser_Edit =[];
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
              var docyment_Item = doc.data();
              var userEmail = docyment_Item.UserEmail;
              var checkedStatus = false;
              var resuitUserList = listPositionUser.includes(userEmail);
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
            var length_itemsPositionUser_Edit = itemsPositionUser_Edit.length - 1;
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

              var UserСommentColumn = document.createElement('td');
              UserСommentColumn.innerHTML = item.UserСomment;

              tr.appendChild(toDismissColumn);
              tr.appendChild(userEmailColumn);
              tr.appendChild(UserСommentColumn);

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
          var tableShiftPositions_Edit = document.getElementById('tableShiftPositionsListUser_Edit');
          //удалил шапку таблицы
          var itemShiftPositions_Edit =[];
          tableShiftPositions_Edit.deleteRow(0);
          var rowLength_Edit = tableShiftPositions_Edit.rows.length;
          for (i = 0; i < rowLength_Edit; i++){
            var cells = tableShiftPositions_Edit.rows.item(i).cells;
            var cellVal_0 = cells.item(0).lastChild.checked;
            if (cellVal_0 == true)
            {
              var cellVal_1 = cells.item(1).innerHTML;
              var cellVal_2 = cells.item(2).innerHTML;
              itemShiftPositions_Edit.push(cellVal_1)
            }
          }
          var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
          var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
          var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
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
          var objId = obj.id;
          var objId_item = obj.item;
          var itemsShiftDataButton = [];
          var control_Play = 0;
          var listPositionUser = objId_item.ListPositionUser;
          var length_listPositionUser = listPositionUser.length;
          listPositionUser.forEach(function(item, i, arr) {
            var email = listPositionUser[i];
            var idDocWorkShift = "";
            var workShiftPositionStartString ="";
            var workShiftPositionStartString_P ="";
            // начало поиск открытых смен у пользователей
            db.collection("WorkShift").where("EmailPositionUser", "==", email)
            .where("IdDocPosition", "==", idDocPosition)
            .where("WorkShiftEnd", "==", "")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                var docyment =  doc.data();
                var workShiftStartTime = docyment.WorkShiftStartTime;
                var secondsStart = workShiftStartTime.seconds*1000;
                var dataStart = new Date(secondsStart);
                var l = dataStart.toString();
                // var getDay = l.split(" ")[0];
                var getMonth = l.split(" ")[1];
                var getDate = l.split(" ")[2];
                // var getFullYear = l.split(" ")[3];
                var getTime = l.split(" ")[4];
                var getHours = getTime.split(":")[0];
                var getMinutes = getTime.split(":")[1];
                workShiftPositionStartString ="From "+(getDate)+" "+(getMonth)+" _ "+(getHours)+":"+(getMinutes);
                // console.log(workShiftPositionStartString);
                idDocWorkShift = doc.id;

              });
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            }).finally(() => {
              // начало отбираем открытый документ смены пользователя
              var docWorkShift = db.collection("WorkShift").doc(idDocWorkShift);
              docWorkShift.collection("ProcessUser").where("ProcessUserEnd", "==", "")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  // console.log(doc.id, " => ", doc.data());
                  var docyment_Element =  doc.data();
                  var nameDocProcessButton = docyment_Element.NameDocProcessButton;
                  var processUserStartTime_P = docyment_Element.ProcessUserStartTime;
                  var secondsStart_P = processUserStartTime_P.seconds*1000;
                  var dataStart_P = new Date(secondsStart_P);
                  var l = dataStart_P.toString();
                  // var getDay = l.split(" ")[0];
                  var getMonth_P = l.split(" ")[1];
                  var getDate_P = l.split(" ")[2];
                  // var getFullYear = l.split(" ")[3];
                  var getTime_P = l.split(" ")[4];
                  var getHours_P = getTime_P.split(":")[0];
                  var getMinutes_P = getTime_P.split(":")[1];
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
              var email_Play = listPositionUser[i];
              var obj = itemsShiftDataButton.find(o => o.Email === email_Play);
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
