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
let items=[];
let items1=[];

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
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
 function SignoutAdmin() {
   localStorage.clear('firebaseui::rememberedAccounts');
   window.location.replace("index.html")
 }

 /**
 * @return {string}
  *  Обработка модального окна Регистрация Организации.
  */

  function gridSystemModalNewOrganization()
  {
    var Organization = document.getElementById("exampleInputNameOrganization").value;
    var Position = document.getElementById("exampleInputPosition").value;
    // Добавляем в коллекциию новую организацию и данные основателя.
    db.collection("Organization").add({
    StatusUser: "StatusUser_Owner",
    Organization: Organization,
    Subdivision: "",
    Position: Position,
    OwnerEmail: EmailLocalStorage,
    OwnerID: "",
    PositionOfYourManager: "",
    NameOfYourManager: "",
    // DocumentCreationTimes: FieldValue.serverTimestamp(),

    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        alert("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        alert("Error adding document: ", error);
    });
  };


    /**
    * @return {string}
     *  Получение данных для таблицы List Of Organizations In Which You Are Involved из firestore.
     */

    function createATableOfClientOrganizations()
    {
        db.collection("Organization").where("OwnerEmail", "==", EmailLocalStorage)
          .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    items.push(doc.data());
                    console.log(doc.data());
                  });

                })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            })
              .finally(() => {items;
                items.forEach(item => {
                    var tr = document.createElement("tr");

                    var OrganizationName = document.createElement('a');
                    // cityName.href = item.link;
                    OrganizationName.innerHTML = item.Organization;

                    var OrganizationColumn = document.createElement('td');
                    OrganizationColumn.appendChild(OrganizationName);

                    var SubdivisionColumn = document.createElement('td');
                    SubdivisionColumn.innerHTML = item.Subdivision;

                    var PositionColumn = document.createElement('td');
                    PositionColumn.innerHTML = item.Position;

                    var PositionOfYourManagerColumn = document.createElement('td');
                    PositionOfYourManagerColumn.innerHTML = item.PositionOfYourManager;

                    var NameOfYourManagerColumn = document.createElement('td');
                    NameOfYourManagerColumn.innerHTML = item.NameOfYourManager;

                    var StatusUserColumn = document.createElement('td');
                    StatusUserColumn.innerHTML = item.StatusUser;


                    // var s = document.createElement('td');
                    // countryColumn.innerHTML = item.OwnerID;
                    //
                    // var d = document.createElement('td');
                    // countryColumn.innerHTML = item.OwnerEmail;





                    tr.appendChild(OrganizationColumn);
                    tr.appendChild(SubdivisionColumn);
                    tr.appendChild(PositionColumn);
                    tr.appendChild(PositionOfYourManagerColumn);
                    tr.appendChild(NameOfYourManagerColumn);
                    tr.appendChild(StatusUserColumn);


                    
                    container.appendChild(tr);
                });
            });
    };
