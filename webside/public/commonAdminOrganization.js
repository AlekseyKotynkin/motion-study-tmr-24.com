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
//
var documentData = [];
var documentDataSubdivision = [];
var items = [];
var itemsPosition = [];
var localStorageSubdivision = 0;
var docRefFull = [];


/**
* @return {string}
*  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
*/
const LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
if (LocalStorageValueObject !== null) /** Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.*/ {
  var UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
  var EmailLocalStorage = (LocalStorageValueObject[0]).email;
  var FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;
} else {
  window.location.replace("widget.html");
}

/**
* @return {string}
*  Читаем параметры из localStorage 'TMR::rememberedAdmin'.
*/
const LocalStorageValueObjectOrganization = JSON.parse(localStorage.getItem('TMR::rememberedAdmin'));
const localStorageOrganizationId = (LocalStorageValueObjectOrganization[0]).OrganizationId;
const LocalStorageEmailOrganization = (LocalStorageValueObjectOrganization[0]).OwnerEmail;

/** Заполняем шапку табличной части Подразделения.*/
var docRef = db.collection("Organization").doc(localStorageOrganizationId);
docRef.get().then(function(doc) {
  if (doc.exists) {
    documentData.push(doc.data());
  } else {
    console.log("No such document!");
  }
}).catch(function(error) {
  console.log("Error getting document:", error);
}).finally(() => {documentData;
  documentData.forEach(item => {
    my_div = document.getElementById("headerTableSubdivision");
    var ul = my_div.querySelector("h4");
    var li = item.Organization;
    ul.insertAdjacentHTML("beforeend", li);
  });
});

function SignoutAdmin() /** Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts. */ 
{
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    // Выход выполнен успешно.
    if (localStorage.getItem('TMR::translation') == null) {
      localStorage.setItem('TMR::translation', 'ru');
    }
    var translation_JS = localStorage.getItem('TMR::translation');
    localStorage.clear();
    localStorage.setItem('TMR::translation', translation_JS);
    window.location.replace("index.html")
  }).catch(function (error) {
    // An error happened.
    // Произошла ошибка.
    if (translation_JS == null || translation_JS == 'en') {
      alert("An error happened!");
    } else {
      alert("Произошла ошибка!");
    }
  });
}

function gridSystemModalNewSubdivisionSubmit() /** Подразделения_регистрация Обработка модального окна.*/
{
  var subdivisionTitle = document.getElementById("exampleInputModalSubdivisionTitle").value;
  if (subdivisionTitle.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter an subdivision name.');
    } else {
      alert('Пожалуйста, введите название подразделения.');
    }
    return;
  }
  var nameOfDepartmentHead = document.getElementById("exampleInputModalSubdivisionNameOfDepartamentHead").value;
  var headOfUnit = document.getElementById("exampleInputModalSubdivisionHeadOfUnit").value;
  var subdivisionOfYourManager = document.getElementById("exampleInputModalSubdivisionSubdivisionOfYourManager").value.toLowerCase();
  if (subdivisionOfYourManager.length < 4) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter an email address.');
    } else {
      alert("Пожалуйста, введите адрес электронной почты!");
    }
    return;
  }
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(subdivisionOfYourManager) == false) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Enter the correct email!');
    } else {
      alert('Введите корректный email!');
    }
    return false;
  }
  // Добавляем в коллекциию организации Подразделения и данные руководителя.
  docRef.collection("Subdivision").add({
    Subdivision: subdivisionTitle,
    NameOfDepartmentHead: nameOfDepartmentHead,
    HeadOfUnit: headOfUnit,
    SubdivisionOfYourManager: subdivisionOfYourManager,
  })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      $('#gridSystemModalNewSubdivision').modal('toggle');
      window.location.reload();
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
      if (translation_JS == null || translation_JS == 'en') {
        alert("Error adding document: ", error);
      } else {
        alert('Ошибка добавления документа:');
      }
    });
}

function createATableOfClientSubdivision() /** Подразделения_Получение данных для таблицы список Подразделений.*/

{
  docRef.collection("Subdivision")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        items.push({ ...doc.data(), ...{ idSubdivision: doc.id } });
      });

    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    })
    .finally(() => {
      items;
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
        if (translation_JS == null || translation_JS == 'en') {
          toComeInUserName.innerHTML = "To come in";
        } else {
          toComeInUserName.innerHTML = "Перейти";
        }
        toComeInUserName.className = 'badge badge-gradient-success';
        toComeInUserName.id = item.idSubdivision;
        toComeInUserName.item = item.Subdivision;
        toComeInUserName.setAttribute('onclick', 'toComeInButtonSubdivision(this)');

        var toComeInUserColumn = document.createElement('td');
        toComeInUserColumn.appendChild(toComeInUserName);

        var quitName = document.createElement('button');
        if (translation_JS == null || translation_JS == 'en') {
          quitName.innerHTML = "Quit";
        } else {
          quitName.innerHTML = "Удалить";
        }
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
}

function toComeInButtonSubdivision(obj) /** Обработчик кнопки toComeInUserColumn из таблицы List Of Subdivision In Which You Are Involved. */
{
  var nameSubdivision = obj.item;
  //обработка редактирования строки...
  localStorage.removeItem('TMR::rememberedAdminSubdivision');
  //
  var liLast_0 = document.getElementById('indexAdminOrganization_Monitor_ListPosition');
  if (liLast_0 !== null) {
    liLast_0.remove();
  }
  if (translation_JS == null || translation_JS == 'en') {
    var html = [
      '<div class="row" id = "indexAdminOrganization_Monitor_ListPosition">',
      '<div class="col-12 grid-margin">',
      '<div class="card">',
      '<div id="headerTablePosition" class="card-body">',
      '<h4 class="card-description">List of position in your subdivision: ' + (nameSubdivision) + '</h4>',
      '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalNewPosition">+ Add Position</button>',
      '<div class="table-responsive">',
      '<table id="tablePosition"class="table">',
      '<thead>',
      '<tr>',
      '<th> Position </th>',
      '<th> Сomment </th>',
      '<th> The number of employees </th>',
      '<th></th>',
      '<th></th>',
      '</tr>',
      '</thead>',
      '<tbody>',
      '</tbody>',
      '</table>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
      '</div>'
    ].join('');
  } else {
    var html = [
      '<div class="row" id = "indexAdminOrganization_Monitor_ListPosition">',
      '<div class="col-12 grid-margin">',
      '<div class="card">',
      '<div id="headerTablePosition" class="card-body">',
      '<h4 class="card-description">Список должностей в вашем подразделении: ' + (nameSubdivision) + '</h4>',
      '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#gridSystemModalNewPosition">+ Добавить должность</button>', '<div class="table-responsive">',
      '<table id="tablePosition"class="table">',
      '<thead>',
      '<tr>',
      '<th> Подразделение </th>',
      '<th> Комментарий </th>',
      '<th> Количество сотрудников </th>',
      '<th></th>',
      '<th></th>',
      '</tr>',
      '</thead>',
      '<tbody>',
      '</tbody>',
      '</table>',
      '</div>',
      '</div>',
      '</div>',
      '</div>',
      '</div>'
    ].join('');
  }
  //var liLast = document.getElementById('indexAdminOrganization_Monitor');
  //liLast.insertAdjacentHTML('beforeend', html);
  var liLast = document.getElementById('indexAdminOrganization_Monitor_ListSubdivision');
  liLast.insertAdjacentHTML('afterend', html);
  //
  docRefFull = db.collection("Organization").doc(localStorageOrganizationId).collection("Subdivision").doc(obj.id);
  docRefFull.get().then(function (doc) {
    if (doc.exists) {
      documentDataSubdivision.push({ ...doc.data(), ...{ idSubdivision: doc.id } });
    } else {
      console.log("No such document!");
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  })
    .finally(() => {
      documentDataSubdivision;
      documentDataSubdivision.forEach(item => {
        localStorageSubdivision = item.idSubdivision;
        var itemsArray = [{
          SubdivisionId: localStorageSubdivision,
          OwnerEmail: EmailLocalStorage,
          ProviderId: "TMR-24.com"
        }]
        localStorage.setItem('TMR::rememberedAdminSubdivision', JSON.stringify(itemsArray));
        documentDataSubdivision = [];
      });

      docRefFull.collection("Position")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            itemsPosition.push({ ...doc.data(), ...{ idPosition: doc.id } });
          });

        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        })
        .finally(() => {
          itemsPosition;
          itemsPosition.forEach(item => {
            var tr = document.createElement("tr");

            var positionColumn = document.createElement('td');
            positionColumn.innerHTML = item.Position;

            var positionCommentColumn = document.createElement('td');
            positionCommentColumn.innerHTML = item.PositionComment;

            var theNumberOfEmployeesColumn = document.createElement('td');
            theNumberOfEmployeesColumn.innerHTML = item.StatusUser;

            var toComeInUserName = document.createElement('button');
            if (translation_JS == null || translation_JS == 'en') {
              toComeInUserName.innerHTML = "To come in";
            } else {
              toComeInUserName.innerHTML = "Перейти";
            }
            toComeInUserName.className = 'badge badge-gradient-success';
            toComeInUserName.id = item.idPosition;
            toComeInUserName.setAttribute('onclick', 'toComeInButtonPosition(this)');

            var toComeInUserColumn = document.createElement('td');
            toComeInUserColumn.appendChild(toComeInUserName);

            var quitName = document.createElement('button');
            if (translation_JS == null || translation_JS == 'en') {
              quitName.innerHTML = "Quit";
            } else {
              quitName.innerHTML = "Удалить";
            }
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

            itemsPosition = [];
            documentDataSubdivision = [];
          });
        });
    });
}

function quitButtonSubdivision(obj) /** Обработчик кнопки quitColumn из таблицы List Of Subdivision In Which You Are Involved. */
 {
  localStorage.removeItem('TMR::rememberedAdminSubdivision');
  var objId = obj.id;
  if (translation_JS == null || translation_JS == 'en') {
    alert('Document successfully deleted!' + (objId));
  } else {
    alert('Документ успешно удален!' + (objId));
  }
  docRef.collection("Subdivision").doc(objId).delete().then(function () {
    console.log("Document successfully deleted!");
    window.location.reload();
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });

}

function gridSystemModalNewPositionSubmit() /** Должность_Обработка модального окна Регистрация Должности. */
{
  var position_Title = document.getElementById("exampleInputModalPositionTitle").value;
  if (position_Title.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter an position name.');
    } else {
      alert('Пожалуйста, введите название должности.');
    }
    return;
  }
  var position_Comment = document.getElementById("exampleInputModalPositionСomment").value;
  if (position_Comment.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter an comments.');
    } else {
      alert('Пожалуйста, введите комментарий.');
    }
    return;
  }
  var positionOfManager = document.getElementById("exampleInputModalPositionOfManager").value.toLowerCase();
  if (positionOfManager.length < 4) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter an email address.');
    } else {
      alert("Пожалуйста, введите адрес электронной почты!");
    }
    return;
  }
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(positionOfManager) == false) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Enter the correct email!');
    } else {
      alert('Введите корректный email!');
    }
    return false;
  }
  var positionOfManagerName = document.getElementById("exampleInputModalPositionOfManagerName").value;
  // Добавляем в документ Подразделения должность.
  docRefFull.collection("Position").add({
    Position: position_Title,
    PositionComment: position_Comment,
    PositionOfManager: positionOfManager,
    PositionOfManagerName: positionOfManagerName,
  })
    .then(function (docRefFull) {
      console.log("Document written with ID: ", docRefFull.id);
      $('#gridSystemModalNewPosition').modal('toggle');
      window.location.reload();
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
      if (translation_JS == null || translation_JS == 'en') {
        alert("Error adding document: ", error);
      } else {
        alert('Ошибка добавления документа:');
      }
    });
}

function toComeInButtonPosition(obj) /** Обработчик кнопки toComeInUserColumn из таблицы List Of Organizations In Which You Are Involved. */
{
  //обработка редактирования строки...
  var objId = obj.id;
  console.log(obj);

  var itemsArray = [{
    PositionId: objId,
    OwnerEmail: EmailLocalStorage,
    ProviderId: "TMR-24.com"
  }];
  localStorage.setItem('TMR::rememberedAdminPosition', JSON.stringify(itemsArray));
  window.location.replace("indexAdminPosition.html");
}

function quitButtonPosition(obj) /** Обработчик кнопки quitColumn из таблицы List Of Organizations In Which You Are Involved. */
{
  var objId = obj.id;
  if (translation_JS == null || translation_JS == 'en') {
    alert('Document successfully deleted!' + (objId));
  } else {
    alert('Документ успешно удален!' + (objId));
  }
  docRef.collection("Subdivision").doc(localStorageSubdivision).collection("Position").doc(objId).delete().then(function () {
    console.log("Document successfully deleted!");
    window.location.reload();
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });

}

function createTableProducts() /** Продукции_Получение данных для таблицы список Продукции.*/
{
  db.collection("Products")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        items.push({ ...doc.data(), ...{ idProducts: doc.id } });
      });

    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    })
    .finally(() => {
      items;
      items.forEach(item => {
        var tr = document.createElement("tr");

        var productsTitle = document.createElement('td');
        productsTitle.innerHTML = item.ProductsTitle;

        var productsComment = document.createElement('td');
        productsComment.innerHTML = item.ProductsComment;

        // var headOfUnitColumn = document.createElement('td');
        // headOfUnitColumn.innerHTML = item.HeadOfUnit;


        // var theNumberOfEmployeesColumn = document.createElement('td');
        // theNumberOfEmployeesColumn.innerHTML = item.StatusUser;

        var toComeInUserName = document.createElement('button');
        if (translation_JS == null || translation_JS == 'en') {
          toComeInUserName.innerHTML = "To come in";
        } else {
          toComeInUserName.innerHTML = "Перейти";
        }
        toComeInUserName.className = 'badge badge-gradient-success';
        toComeInUserName.id = item.idProducts;
        toComeInUserName.item = item.idProducts;
        toComeInUserName.setAttribute('onclick', 'toComeInButtonProducts(this)');

        var toComeInUserColumn = document.createElement('td');
        toComeInUserColumn.appendChild(toComeInUserName);

        var quitName = document.createElement('button');
        if (translation_JS == null || translation_JS == 'en') {
          quitName.innerHTML = "Quit";
        } else {
          quitName.innerHTML = "Удалить";
        }
        quitName.className = 'badge badge-gradient-danger';
        quitName.id = item.idProducts;
        quitName.setAttribute('onclick', 'quitButtonProducts(this)');

        var quitColumn = document.createElement('td');
        quitColumn.appendChild(quitName);

        tr.appendChild(productsTitle);
        tr.appendChild(productsComment);
        // tr.appendChild(headOfUnitColumn);
        // tr.appendChild(theNumberOfEmployeesColumn);
        tr.appendChild(toComeInUserColumn);
        tr.appendChild(quitColumn);

        container.appendChild(tr);
      });
    });
}

function gridSystemModalNewProducts() /** Продукции_Обработка модального окна Регистрация Продукта.*/
{
  var productsTitle = document.getElementById("exampleInputModalProductsTitle").value;
  if (productsTitle.length < 1) {
    if (translation_JS == null || translation_JS == 'en') {
      alert('Please enter products name.');
    } else {
      alert('Пожалуйста, введите название продукции.');
    }
    return;
  }
  var productsComment = document.getElementById("exampleInputModalProductsСomment").value;
  // var headOfUnit = document.getElementById("exampleInputModalSubdivisionHeadOfUnit").value;
  // var subdivisionOfYourManager = document.getElementById("exampleInputModalSubdivisionSubdivisionOfYourManager").value.toLowerCase();
  // if (subdivisionOfYourManager.length < 4)
  // {
  //   if(translation_JS == null || translation_JS == 'en'){
  //     alert('Please enter an email address.');
  //   } else {
  //     alert ("Пожалуйста, введите адрес электронной почты!");
  //   }
  //   return;
  // }
  // var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  // if(reg.test(subdivisionOfYourManager) == false) {
  //     if(translation_JS == null || translation_JS == 'en'){
  //       alert('Enter the correct email!');
  //     } else {
  //       alert('Введите корректный email!');
  //     }
  //     return false;
  // }
  // Добавляем в коллекциию организации Продукта.
  db.collection("Products").add({
    ProductsTitle: productsTitle,
    ProductsComment: productsComment,
    ProductsOrganizationId: localStorageOrganizationId,
    // SubdivisionOfYourManager: subdivisionOfYourManager,
  })
    .then(function (db) {
      console.log("Document written with ID: ", db.id);
      $('#gridSystemModalNewProducts').modal('toggle');
      window.location.reload();
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
      if (translation_JS == null || translation_JS == 'en') {
        alert("Error adding document: ", error);
      } else {
        alert('Ошибка добавления документа:');
      }
    });
}

function location_Href() /** Открыть окно Фейсбука.*/
{
  window.open('https://www.facebook.com/TMR24Systems/');
}

function translationCommon_RU() /** Заполняем строки с русскими значениями.*/
{
  //
}

function translationCommon_EN() /** Заполняем строки с английскими значениями.*/
{
  //
}
