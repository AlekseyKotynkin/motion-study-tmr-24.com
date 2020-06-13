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






 var buttons = document.querySelectorAll(".button");

 for (var button of buttons) {
    button.addEventListener('click', function () {
      buttons.forEach(i => i.classList.remove('active'));

      this.classList.toggle('active');
    });
 };

/**
 * Общие методы для главной страницы приложения и автономного виджета.
 */
let items=[];

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

  function createATableOfClientUser()
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

    function createATableOfClientAdmin()
    {
    db.collection("Organization").where("OwnerEmail", "==", EmailLocalStorage)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        items.push({...doc.data(),...{idOrganization: doc.id}});
      });

        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
          .finally(() => {items;
        items.forEach(item => {
          var tr = document.createElement("tr");

          var organizationName = document.createElement('a');
          organizationName.innerHTML = item.Organization;

          var organizationColumn = document.createElement('td');
          organizationColumn.appendChild(organizationName);

          var subdivisionColumn = document.createElement('td');
          subdivisionColumn.innerHTML = item.Subdivision;

          var positionColumn = document.createElement('td');
          positionColumn.innerHTML = item.Position;

          var positionOfYourManagerColumn = document.createElement('td');
          positionOfYourManagerColumn.innerHTML = item.PositionOfYourManager;

          var nameOfYourManagerColumn = document.createElement('td');
          nameOfYourManagerColumn.innerHTML = item.NameOfYourManager;

          var statusUserColumn = document.createElement('td');
          statusUserColumn.innerHTML = item.StatusUser;

          var toComeInUserName = document.createElement('button');
          toComeInUserName.innerHTML = "To come in";
          toComeInUserName.className = 'badge badge-gradient-success';
          toComeInUserName.id = item.idOrganization;
          toComeInUserName.setAttribute('onclick', 'toComeInButton(this)');

          var toComeInUserColumn = document.createElement('td');
          toComeInUserColumn.appendChild(toComeInUserName);

          var quitName = document.createElement('button');
          quitName.innerHTML = "Quit";
          quitName.className = 'badge badge-gradient-danger';
          quitName.id = item.idOrganization;
          quitName.setAttribute('onclick', 'quitButton(this)');

          var quitColumn = document.createElement('td');
          quitColumn.appendChild(quitName);

          tr.appendChild(organizationColumn);
          tr.appendChild(subdivisionColumn);
          tr.appendChild(positionColumn);
          tr.appendChild(positionOfYourManagerColumn);
          tr.appendChild(nameOfYourManagerColumn);
          tr.appendChild(statusUserColumn);
          tr.appendChild(toComeInUserColumn);
          tr.appendChild(quitColumn);

          container.appendChild(tr);
        });
      });
  };


  /**
  * @return {string}
   *  Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved.
   */

  function toComeInButton(obj) {
    //обработка редактирования строки...
      let objId = obj.id;
      console.log(obj);

        let itemsArray = [{
          OrganizationId: objId,
          OwnerEmail: EmailLocalStorage,
          ProviderId: "TMR-24.com"
        }]
      localStorage.setItem('TMR::rememberedAdmin', JSON.stringify(itemsArray));
      window.location.replace("indexAdminOrganization.html");
    };


    /**
    * @return {string}
     *  Обработчик кнопки quitColumn из таблицы List Of Organizations In Which You Are Involved.
     */

    function quitButton(obj) {
    let objId = obj.id;
    alert('Document successfully deleted! '+ (objId));
      db.collection("Organization").doc(objId).delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
      window.location.reload();
    }