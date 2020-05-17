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
let items1=[];
items1.length = 0;
let items = [{
            NameOfYourManager: 'Milano',
            Organization: 'Italy',
            link: 'details.html#42'
        },
        {
            NameOfYourManager: 'London',
            Organization: 'England',
            link: 'details.html#10'
        },
        {
            NameOfYourManager: 'Rome',
            Organization: 'Italy',
            link: 'details.html#39'
        }

    ];
// console.log(items);
// console.dir(items);
let items2 = [{
  StatusUser: "StatusUser_Owner",
  Organization: "Organization",
  Subdivision: "вып",
  Position: "Position",
  OwnerEmail: "EmailLocalStorage",
  OwnerID: "вы",
  PositionOfYourManager: "рро",
  NameOfYourManager: "рр",
},
{
  StatusUser: "StatusUser_Owner",
  Organization: "Organization",
  Subdivision: "вып",
  Position: "Position",
  OwnerEmail: "EmailLocalStorage",
  OwnerID: "вы",
  PositionOfYourManager: "рро",
  NameOfYourManager: "рр",
}
    ];



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
                    console.log(doc.id, " => ", doc.data());
                    items1.push(doc.data());

                    console.log(doc.data());
                  });

                })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    };
