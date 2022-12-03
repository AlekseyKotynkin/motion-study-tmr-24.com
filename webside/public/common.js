/*
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
var database = firebase.database();
/**

* @return {string}
 *  Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
 */
  function SignoutAdminLogin() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      // Выход выполнен успешно.
      if (localStorage.getItem('TMR::translation') == null) {
        localStorage.setItem('TMR::translation', 'ru');
      }
      var translation_JS = localStorage.getItem('TMR::translation');
      localStorage.clear();
      localStorage.setItem('TMR::translation', translation_JS);
      window.location.replace("index.html")
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

//востановление пароля
  function RecoverPasswordAdminLogin() {
    var email = document.getElementById("inputEmail1").value.toLowerCase();
    if (email.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter an email address.');
      } else {
        alert ("Пожалуйста, введите адрес электронной почты!");
      }
     return;
    }
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(reg.test(email) == false) {
       if(translation_JS == null || translation_JS == 'en'){
         alert('Enter the correct email!');
       } else {
         alert('Введите корректный email!');
       }
       return false;
    }
    firebase.auth().sendPasswordResetEmail(email);
    if(translation_JS == null || translation_JS == 'en'){
      alert('An email has been sent to you to restore your password!');
    } else {
      alert ("Вам отправлено письмо для восстановления пароля!");
    }
  }

/**
* @return {string}
//  Вход пользователя через форму.
 */
  function signUp()
  {
    var email = document.getElementById("inputEmail1").value.toLowerCase();
    var password = document.getElementById("inputPassword1").value;
    if (email.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter an email address.');
      } else {
        alert ("Пожалуйста, введите адрес электронной почты!");
      }
     return;
    }
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(reg.test(email) == false) {
       if(translation_JS == null || translation_JS == 'en'){
         alert('Enter the correct email!');
       } else {
         alert('Введите корректный email!');
       }
       return false;
    }
    if (password.length < 4)
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter a password.');
      } else {
        alert ("Пожалуйста, введите пароль!");
      }
    return;
    }
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      // User is signed in.
      // Пользователь вошел в систему.
      //  var user = firebase.auth().currentUser;
      var name, emailData, photoUrl, uid, emailVerified;
       if (user != null) {
       emailData = user.email;
       if (email != emailData)
       {
         firebase.auth().signOut().then(function() {
           // Sign-out successful.
           // Выход выполнен успешно.
           if (localStorage.getItem('TMR::translation') == null) {
             localStorage.setItem('TMR::translation', 'ru');
           }
           var translation_JS = localStorage.getItem('TMR::translation');
           localStorage.clear();
           localStorage.setItem('TMR::translation', translation_JS);
           window.location.replace();
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
       if(translation_JS == null || translation_JS == 'en'){
         alert('User is signed in. ' + email);
       } else {
         alert('Пользователь вошел в систему. ' + email);
       }
       name = user.displayName;
       if (name === null)
       {
         var itemsArray = [{
           displayName: name,
           email: email,
           photoUrl: photoUrl
         }];
        localStorage.setItem('firebaseui::rememberedAccounts', JSON.stringify(itemsArray));
        window.location.replace("registerPersonalData.html");
       }else{
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
          var itemsArray = [{
          displayName: name,
          email: email,
          photoUrl: photoUrl
         }];
         localStorage.setItem('firebaseui::rememberedAccounts', JSON.stringify(itemsArray));
         window.location.replace("index.html")
        }
       }
      } else {
      // No user is signed in.
      // Ни один пользователь не вошел в систему.
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
        // Sign-out successful.
        // Выход выполнен успешно.
        var user = result.user;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        if(translation_JS == null || translation_JS == 'en'){
          alert ('The user '+ email+' is not registered!' );
        } else {
          alert ('Пользователь '+ email+' не зарегистрирован!');
        }
        });
      }
    });
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
  // открываем модальное окно Заказ консультации специалиста
  function modal_order_specialist_consultation_send(){
    var nameUser = document.getElementById("exampleInputName").value;
    var telephone = document.getElementById("exampleInputPhone").value;
    var comment = document.getElementById("exampleInputComment").value;
    if (nameUser.length < 4 || nameUser.length > 30 )
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter an name.');
      } else {
        alert ("Пожалуйста, введите как к Вам обращаться!");
      }
      return;
    }
    if (telephone.length < 10 || telephone.length > 20 )
    {
      if(translation_JS == null || translation_JS == 'en'){
        alert('Please enter an telephone.');
      } else {
        alert ("Пожалуйста, введите номер телефона для связи с Вами!");
      }
      return;
    }
    //
    // Add a new document with a generated id.
    db.collection("OrderSpecialist").add({
      nameUser: nameUser,
      telephoneUser: telephone,
      commentUser: comment,
      dataStartEvent: firebase.firestore.FieldValue.serverTimestamp(),
      dataEndEvent: "",
      rezultEvent: "",
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      if(translation_JS == null || translation_JS == 'en'){
        alert('Thank you! The data has been transferred to the consultant.');
      } else {
        alert ("Благодарим Вас! Данные переданы консультанту.");
      }
      $('#modal_order_specialist_consultation').modal('toggle');
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  // переход по странице tmr_Operational_Data_Collector_sales к блоку Staff Workload
  function transition_StaffWorkload() {
    document.getElementById("staff_workload").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Operational_Data_Collector_sales к блоку House Document Flow
  function transition_HouseDocumentFlow() {
    document.getElementById("house_document_flow").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Operational_Data_Collector_sales к блоку Sensors
  function transition_Sensors() {
    document.getElementById("sensors").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Operational_Data_Collector_sales к блоку Signal Converters
  function transition_SignalConverters() {
    document.getElementById("signal_converters").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Operational_Data_Collector_sales к блоку Accounting Systems
  function transition_AccountingSystems() {
    document.getElementById("integration_modules").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Operational_Data_Collector_sales к блоку Industrial Equipment
  function transition_IndustrialEquipment() {
    document.getElementById("industrial_equipment").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Virtual_Assistant_Manager_sales к блоку IControl Points
  function transition_ControlPoints() {
    document.getElementById("control_points").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Virtual_Assistant_Manager_sales к блоку Operational Reporting
  function transition_OperationalReporting() {
    document.getElementById("operational_reporting").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Virtual_Assistant_Manager_sales к блоку Personnel Management 1
  function transition_PersonnelManagement_1() {
    document.getElementById("personnel_management").scrollIntoView({behavior: 'smooth'});
  }
  // переход по странице tmr_Virtual_Assistant_Manager_sales к блоку Personnel Management 2
  function transition_PersonnelManagement_2() {
    document.getElementById("personnel_management").scrollIntoView({behavior: 'smooth'});
  }
