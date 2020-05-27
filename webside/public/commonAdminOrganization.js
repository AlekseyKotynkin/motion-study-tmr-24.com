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
let documentData=[];
let documentDataSubdivision=[];
let items=[];
// let documentData;
// let d;

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
*  Читаем параметры из localStorage 'TMR::rememberedAdmin'.
*/
const LocalStorageValueObjectOrganization = JSON.parse(localStorage.getItem('TMR::rememberedAdmin'));
const localStorageOrganizationId = (LocalStorageValueObjectOrganization[0]).OrganizationId;
const LocalStorageEmailOrganization = (LocalStorageValueObjectOrganization[0]).OwnerEmail;

/**
* @return {string}
*  Заполняем шапку табличной части Подразделения.
*/

var docRef = db.collection("Organization").doc(localStorageOrganizationId);
docRef.get().then(function(doc) {
    if (doc.exists) {
        documentData.push(doc.data());
    } else {
      console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
})
  .finally(() => {documentData;
     documentData.forEach(item => {
        my_div = document.getElementById("headerTableSubdivision");
        const ul = my_div.querySelector("h4");
        let li = item.Organization;
        ul.insertAdjacentHTML("beforeend", li);
    });
});

/**
* @return {string}
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
 function SignoutAdmin() {
   localStorage.clear('firebaseui::rememberedAccounts');
   localStorage.clear('TMR::rememberedAdmin');
   window.location.replace("index.html")
 };

 /**
 * @return {string}
  *  Обработка модального окна Регистрация Организации.
  */

  function gridSystemModalNewSubdivision()
  {
    var subdivisionTitle = document.getElementById("exampleInputModalSubdivisionTitle").value;
    var nameOfDepartmentHead = document.getElementById("exampleInputModalSubdivisionNameOfDepartamentHead").value;
    var headOfUnit = document.getElementById("exampleInputModalSubdivisionHeadOfUnit").value;
    // Добавляем в коллекциию организации Подразделения и данные руководителя.
    docRef.collection("Subdivision").add({
    Subdivision: subdivisionTitle,
    NameOfDepartmentHead: nameOfDepartmentHead,
    HeadOfUnit: headOfUnit,

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
     *  Получение данных для таблицы List Of Subdivision In Which You Are Involved из firestore.
     */
  function createATableOfClientSubdivision()
  {
    docRef.collection("Subdivision")
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        items.push({...doc.data(),...{idSubdivision: doc.id}});
      });

        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
          .finally(() => {items;
        items.forEach(item => {
          var tr = document.createElement("tr");

          var subdivisionColumn = document.createElement('td');
          subdivisionColumn.innerHTML = item.Subdivision;

          var nameOfDepartmentHeadColumn = document.createElement('td');
          nameOfDepartmentHeadColumn.innerHTML = item.NameOfDepartmentHead;

          var headOfUnitColumn = document.createElement('td');
          headOfUnitColumn.innerHTML = item.HeadOfUnit;


          var theNumberOfEmployeesColumn = document.createElement('td');
          theNumberOfEmployeesColumn.innerHTML = item.StatusUser;

          var toComeInUserName = document.createElement('button');
          toComeInUserName.innerHTML = "To come in";
          toComeInUserName.className = 'badge badge-gradient-success';
          toComeInUserName.id = item.idSubdivision;
          toComeInUserName.setAttribute('onclick', 'toComeInButtonSubdivision(this)');

          var toComeInUserColumn = document.createElement('td');
          toComeInUserColumn.appendChild(toComeInUserName);

          var quitName = document.createElement('button');
          quitName.innerHTML = "Quit";
          quitName.className = 'badge badge-gradient-danger';
          quitName.id = item.idSubdivision;
          quitName.setAttribute('onclick', 'quitButtonSubdivision(this)');

          var quitColumn = document.createElement('td');
          quitColumn.appendChild(quitName);

          tr.appendChild(subdivisionColumn);
          tr.appendChild(nameOfDepartmentHeadColumn);
          tr.appendChild(headOfUnitColumn);
          tr.appendChild(theNumberOfEmployeesColumn);
          tr.appendChild(toComeInUserColumn);
          tr.appendChild(quitColumn);

          container.appendChild(tr);
        });
      });
  };



  /**
  // * @return {string}
   *  Обработчик кнопки toComeInUserColumn из таблицы List Of Subdivision In Which You Are Involved.
   */

  function toComeInButtonSubdivision(obj) {
  //обработка редактирования строки...
    let objId = obj.id;
    var docRefFull = docRef.collection("Subdivision").doc(obj.id);
    docRefFull.get().then(function(doc) {
      if (doc.exists) {
          documentDataSubdivision.push(doc.data());
      } else {
        console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  })
    .finally(() => {documentDataSubdivision;
       documentDataSubdivision.forEach(item => {
          document.body.innerHTML = document.body.innerHTML.replace('- Select subdivision', '- ');
          my_div = document.getElementById("headerTablePosition");
          const ul = my_div.querySelector("h4");
          let li = item.Subdivision;
          let lit = '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalNewPosition">+ Add Position</button>';
          ul.insertAdjacentHTML("beforeend", li);
          ul.insertAdjacentHTML("afterend", lit);
      });
  });

       /**
       * @return {string}
        *  Получение данных для таблицы List Of Organizations In Which You Are Involved из firestore.
        */
     function createATableOfClientPosition()
     {
       // docRef.collection("Subdivision")
       // .get()
       // .then(function(querySnapshot) {
       //   querySnapshot.forEach(function(doc) {
       //     items.push({...doc.data(),...{idSubdivision: doc.id}});
       //   });
       //
       //     })
       //     .catch(function(error) {
       //         console.log("Error getting documents: ", error);
       //     })
       //       .finally(() => {items;
       //     items.forEach(item => {
       //       var tr = document.createElement("tr");
       //
       //       var subdivisionColumn = document.createElement('td');
       //       subdivisionColumn.innerHTML = item.Subdivision;
       //
       //       var nameOfDepartmentHeadColumn = document.createElement('td');
       //       nameOfDepartmentHeadColumn.innerHTML = item.NameOfDepartmentHead;
       //
       //       var headOfUnitColumn = document.createElement('td');
       //       headOfUnitColumn.innerHTML = item.HeadOfUnit;
       //
       //
       //       var theNumberOfEmployeesColumn = document.createElement('td');
       //       theNumberOfEmployeesColumn.innerHTML = item.StatusUser;
       //
       //       var toComeInUserName = document.createElement('button');
       //       toComeInUserName.innerHTML = "To come in";
       //       toComeInUserName.className = 'badge badge-gradient-success';
       //       toComeInUserName.id = item.idSubdivision;
       //       toComeInUserName.setAttribute('onclick', 'toComeInButtonSubdivision(this)');
       //
       //       var toComeInUserColumn = document.createElement('td');
       //       toComeInUserColumn.appendChild(toComeInUserName);
       //
       //       var quitName = document.createElement('button');
       //       quitName.innerHTML = "Quit";
       //       quitName.className = 'badge badge-gradient-danger';
       //       quitName.id = item.idSubdivision;
       //       quitName.setAttribute('onclick', 'quitButtonSubdivision(this)');
       //
       //       var quitColumn = document.createElement('td');
       //       quitColumn.appendChild(quitName);
       //
       //       tr.appendChild(subdivisionColumn);
       //       tr.appendChild(nameOfDepartmentHeadColumn);
       //       tr.appendChild(headOfUnitColumn);
       //       tr.appendChild(theNumberOfEmployeesColumn);
       //       tr.appendChild(toComeInUserColumn);
       //       tr.appendChild(quitColumn);
       //
       //       container.appendChild(tr);
       //     });
       //   });
         };






    };

    /**
    * @return {string}
     *  Обработчик кнопки quitColumn из таблицы List Of Subdivision In Which You Are Involved.
     */

    function quitButtonSubdivision(obj) {
    let objId = obj.id;
    alert('Document successfully deleted! '+ (objId));
    docRef.collection("Subdivision").doc(objId).delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
      window.location.reload();
    };


    /**
    * @return {string}
     *  Обработка модального окна Регистрация Должности.
     */

     function gridSystemModalNewPosition()
     {
       var positionTitle = document.getElementById("exampleInputModalPositionTitle").value;
       var positionComment = document.getElementById("exampleInputModalPositionСomment").value;
       // Добавляем в документ Подразделения должность.
       docRef.collection("Subdivision").add({
       Subdivision: subdivisionTitle,
       NameOfDepartmentHead: nameOfDepartmentHead,
       HeadOfUnit: headOfUnit,

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
   // * @return {string}
    *  Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved.
    */

   function toComeInButtonPosition(obj) {
     //обработка редактирования строки...
       // let objId = obj.id;
       // alert(obj.id);
       //   let itemsArray = [{
       //     OrganizationId: objId,
       //     OwnerEmail: EmailLocalStorage,
       //     ProviderId: "TMR-24.com"
       //   }]
       // localStorage.setItem('TMR::rememberedAdmin', JSON.stringify(itemsArray));
       // window.location.replace("indexAdminOrganization.html");
     }

     /**
     * @return {string}
      *  Обработчик кнопки quitColumn из таблицы List Of Organizations In Which You Are Involved.
      */

     function quitButtonPosition(obj) {
     let objId = obj.id;
     alert('Document successfully deleted! '+ (objId));
     docRef.collection("Organization").doc(objId).delete().then(function() {
           console.log("Document successfully deleted!");
       }).catch(function(error) {
           console.error("Error removing document: ", error);
       });
       window.location.reload();
     }
