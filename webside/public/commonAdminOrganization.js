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
 //
let documentData=[];
let documentDataSubdivision=[];
let items=[];
let itemsPosition=[];
let localStorageSubdivision = 0;
let docRefFull=[];


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
*  Читаем параметры из localStorage 'TMR::rememberedAdminSubdivision'.
*/

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
   firebase.auth().signOut().then(function() {
     // Sign-out successful.
     // Выход выполнен успешно.
     localStorage.clear();
     window.location.replace("index.html")
   }).catch(function(error) {
     // An error happened.
     // Произошла ошибка.
     alert ("An error happened!");
   });
  }
  /**
  * @return {string}
  *  Обработка модального окна Регистрация Подразделения.
  */

  function gridSystemModalNewSubdivisionSubmit()
  {
    var subdivisionTitle = document.getElementById("exampleInputModalSubdivisionTitle").value;
    if (subdivisionTitle.length < 1)
    {
     alert('Please enter an subdivision name.');
     return;
    }
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
        $('#gridSystemModalNewSubdivision').modal('toggle');
        window.location.reload();
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        alert("Error adding document: ", error);
    });
  };


    /**
    * @return {string}
     *  Получение данных для таблицы список Подразделений List Of Subdivision In Which You Are Involved из firestore.
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
    localStorage.removeItem('TMR::rememberedAdminSubdivision');

    var articleDiv = document.getElementById("headerTablePosition").innerHTML;
    // var articleDivOn = '<div id="headerTablePosition" class="card-body"></div>';
    var articleDivOn = '';
    document.body.innerHTML = document.body.innerHTML.replace(articleDiv, articleDivOn);

    var xhr= new XMLHttpRequest();
    xhr.open('GET', 'indexAdminOrganizationHeaderTablePosition.html', true);
    xhr.send();
    xhr.onreadystatechange= function() {
    if (this.readyState!==4) return;
    if (this.status!==200) return; // или любую другую обработку ошибок, которую вы хотите
    document.getElementById('headerTablePosition').innerHTML= this.responseText;
    };

    docRefFull = db.collection("Organization").doc(localStorageOrganizationId).collection("Subdivision").doc(obj.id);
    docRefFull.get().then(function(doc) {
      if (doc.exists) {
        documentDataSubdivision.push({...doc.data(),...{idSubdivision: doc.id}});
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

          localStorageSubdivision = item.idSubdivision;
            let itemsArray = [{
              SubdivisionId: localStorageSubdivision,
              OwnerEmail: EmailLocalStorage,
              ProviderId: "TMR-24.com"
            }]
          localStorage.setItem('TMR::rememberedAdminSubdivision', JSON.stringify(itemsArray));
          documentDataSubdivision=[];

      });

     docRefFull.collection("Position")
     .get()
     .then(function(querySnapshot) {
       querySnapshot.forEach(function(doc) {
         itemsPosition.push({...doc.data(),...{idPosition: doc.id}});
       });

         })
         .catch(function(error) {
             console.log("Error getting documents: ", error);
         })
           .finally(() => {itemsPosition;
           itemsPosition.forEach(item => {
           var tr = document.createElement("tr");

           var positionColumn = document.createElement('td');
           positionColumn.innerHTML = item.Position;

           var positionCommentColumn = document.createElement('td');
           positionCommentColumn.innerHTML = item.PositionComment;

           var theNumberOfEmployeesColumn = document.createElement('td');
           theNumberOfEmployeesColumn.innerHTML = item.StatusUser;

           var toComeInUserName = document.createElement('button');
           toComeInUserName.innerHTML = "To come in";
           toComeInUserName.className = 'badge badge-gradient-success';
           toComeInUserName.id = item.idPosition;
           toComeInUserName.setAttribute('onclick', 'toComeInButtonPosition(this)');

           var toComeInUserColumn = document.createElement('td');
           toComeInUserColumn.appendChild(toComeInUserName);

           var quitName = document.createElement('button');
           quitName.innerHTML = "Quit";
           quitName.className = 'badge badge-gradient-danger';
           quitName.id = item.idPosition;
           quitName.setAttribute('onclick', 'quitButtonPosition(this)');

           var quitColumn = document.createElement('td');
           quitColumn.appendChild(quitName);

           tr.appendChild(positionColumn);
           tr.appendChild(positionCommentColumn);
           tr.appendChild(theNumberOfEmployeesColumn);
           tr.appendChild(toComeInUserColumn);
           tr.appendChild(quitColumn);

           var container = document.getElementById("tablePosition").getElementsByTagName("tbody")[0];

           container.appendChild(tr);


           itemsPosition=[];
           documentDataSubdivision=[];
         });
       });
    });
  };


    /**
    * @return {string}
     *  Обработчик кнопки quitColumn из таблицы List Of Subdivision In Which You Are Involved.
     */

    function quitButtonSubdivision(obj) {
    localStorage.removeItem('TMR::rememberedAdminSubdivision');
    let objId = obj.id;
    alert('Document successfully deleted! '+ (objId));
    docRef.collection("Subdivision").doc(objId).delete().then(function() {
          console.log("Document successfully deleted!");
          window.location.reload();
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });

    };


    /**
    * @return {string}
     *  Обработка модального окна Регистрация Должности.
     */

     function gridSystemModalNewPositionSubmit()
     {
       var position_Title = document.getElementById("exampleInputModalPositionTitle").value;
       if (position_Title.length < 1)
       {
        alert('Please enter an position name.');
        return;
       }
       var position_Comment = document.getElementById("exampleInputModalPositionСomment").value;
       if (position_Comment.length < 1)
       {
        alert('Please enter an comments.');
        return;
       }
       // Добавляем в документ Подразделения должность.
       docRefFull.collection("Position").add({
       Position: position_Title,
       PositionComment: position_Comment,

       })
       .then(function(docRefFull) {
           console.log("Document written with ID: ", docRefFull.id);
           $('#gridSystemModalNewPosition').modal('toggle');
           window.location.reload();
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
       let objId = obj.id;
       console.log(obj);

         let itemsArray = [{
           PositionId: objId,
           OwnerEmail: EmailLocalStorage,
           ProviderId: "TMR-24.com"
         }];
       localStorage.setItem('TMR::rememberedAdminPosition', JSON.stringify(itemsArray));
       window.location.replace("indexAdminPosition.html");
      }

     /**
     * @return {string}
      *  Обработчик кнопки quitColumn из таблицы List Of Organizations In Which You Are Involved.
      */

     function quitButtonPosition(obj)
     {
       let objId = obj.id;
       alert('Document successfully deleted! '+ (objId));
       docRef.collection("Subdivision").doc(localStorageSubdivision).collection("Position").doc(objId).delete().then(function() {
             console.log("Document successfully deleted!");
             window.location.reload();
         }).catch(function(error) {
             console.error("Error removing document: ", error);
         });

    }
