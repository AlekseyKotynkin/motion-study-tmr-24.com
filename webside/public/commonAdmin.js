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
    var objId = obj.id;
    alert(obj.id);
    console.log(event);
    // получим стркоу
    var table = document.querySelector('#table');
    console.log(table);
    var info = document.querySelector('#info');
    console.log(info);
    var trs = document.querySelectorAll('tr');
    console.log(trs);
    var elem = document.getElementById('tr');
    console.log(elem);

    // var tr = event.parentNode.parentNode;
    // // tr.style.backgroundColor = "yellow";
    // console.log(tr);
    //
    // // получим значения из строки
    // var valueItem = tr.cells[2].innerText;
    // var valueQuantity = tr.cells[3].innerText;
    // var valuePrice = tr.cells[4].innerText;
    // // заполним инпуты значениями из строки
    // document.getElementsByClassName('input_add')[0].value = valueItem;
    // document.getElementsByClassName('input_quant')[0].value = valueQuantity;
    // document.getElementsByClassName('input_price')[0].value = valuePrice;
    // // получим нашу кнопку
    // var inputButton = document.getElementsByClassName('input_button')[0];
    // inputButton.innerText = "Update"; // меняем текст
    // inputButton.value = tr.cells[0].innerText; // в value будем хранить индекс строки

    // данный блок не работает в сниппете
    // localStorage.setItem('DoneList', document.getElementById("tbody").innerHTML);
  }

    /**
    * @return {string}
     *  Обработчик кнопки quitColumn из таблицы List Of Organizations In Which You Are Involved.
     */

    function quitButton(obj) {
    var objId = obj.id;
    alert('Document successfully deleted! '+ (objId));
      db.collection("Organization").doc(objId).delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
      window.location.reload();
    }
