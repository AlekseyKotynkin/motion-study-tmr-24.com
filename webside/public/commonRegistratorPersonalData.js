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
var storage = firebase.storage();
  // Get the default bucket from a custom firebase.app.App
  // Получаем переменную для распознавания языка пользователя
 var translation_JS = localStorage.getItem('TMR::translation');
/**
 * Общие методы для главной страницы приложения и автономного виджета.
 */
 /**
 * @return {string}
 *  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
 */
const LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
const UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
const EmailLocalStorage = (LocalStorageValueObject[0]).email;
const FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;
/**
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
       if(translation_JS == null || translation_JS == 'en'){
         alert ("An error happened!");
       } else {
         alert ("Произошла ошибка!");
       }
     });
   }
   /**
   * @return {string}
    *  Регистрация нового пользователя через форму.
    */
   function signUpRegisterPersonalData()
   {
     var name = document.getElementById("exampleInputUsername1").value;
     var phone = document.getElementById("exampleInputPhone").value;
     var photoName = document.getElementById("exampleInputUpload1").value;
     if (name.length < 1)
     {
       if(translation_JS == null || translation_JS == 'en'){
         alert('Please enter an name.');
       } else {
         alert ("Пожалуйста, введите имя.");
       }
      return;
     }
     if (phone.length < 11)
     {
       if(translation_JS == null || translation_JS == 'en'){
         alert('Please enter a phone number.');
       } else {
         alert ("Пожалуйста, введите номер телефона.");
       }
     return;
     }
     if (photoName.length < 4)
     {
       if(translation_JS == null || translation_JS == 'en'){
         alert('Please upload a photo file.');
       } else {
         alert ("Пожалуйста, загрузите файл с фотографией.");
       }
      return;
     }
     firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
       // User is signed in.
       // Пользователь вошел в систему.
       var email, uid, emailVerified;
        if (user != null)
       { email = user.email;
         if (email != EmailLocalStorage)
         {  firebase.auth().signOut().then(function() {
             // Sign-out successful.
             // Выход выполнен успешно.
             localStorage.clear();
             window.location.replace()
           }).catch(function(error) {
             // An error happened.
             // Произошла ошибка.
             if(translation_JS == null || translation_JS == 'en'){
               alert ("An error happened!");
             } else {
               alert ("Произошла ошибка!");
             }
             window.location.replace()
           });
         }else
         { emailVerified = user.emailVerified;
           uid = user.uid;
             var storageRef = firebase.storage().ref();
             // File or Blob named mountains.jpg
             var file = document.querySelector("#exampleInputUpload1").files[0];
             // Create the file metadata
             var metadata = {
               contentType: 'image/jpeg'
             };
             // Upload file and metadata to the object 'images/mountains.jpg'
             var uploadTask = storageRef.child('fotoUser/'+ uid +'_'+ file.name).put(file, metadata);
             // Listen for state changes, errors, and completion of the upload.
             uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                 // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                 var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                 console.log('Upload is ' + progress + '% done');
                 switch (snapshot.state) {
                   case firebase.storage.TaskState.PAUSED: // or 'paused'
                     console.log('Upload is paused');
                     break;
                   case firebase.storage.TaskState.RUNNING: // or 'running'
                     console.log('Upload is running');
                     break;
                 }
               }, function(error) {
               // A full list of error codes is available at
               // https://firebase.google.com/docs/storage/web/handle-errors
               switch (error.code) {
                 case 'storage/unauthorized':
                   // User doesn't have permission to access the object
                   break;
                 case 'storage/canceled':
                   // User canceled the upload
                   break;
                document.querySelector("#exampleInputUpload1").files[0];
                 case 'storage/unknown':
                   // Unknown error occurred, inspect error.serverResponse
                   break;
               }
             }, function() {
               // Upload completed successfully, now we can get the download URL
               // Загрузка завершена успешно, теперь мы можем получить URL для загрузки
               uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                 console.log('File available at', downloadURL);
                 user.updateProfile({
                   displayName: name,
                   photoURL: downloadURL,
                   PhoneNumber: phone
                 }).then(function() {
                   // Update successful.
                   if(translation_JS == null || translation_JS == 'en'){
                     alert ("Update successful.");
                   } else {
                     alert ("Обновление прошло успешно.");
                   }
                   localStorage.clear();
                   let itemsArray = [{
                     displayName: name,
                     email: email,
                     photoUrl: downloadURL
                   }];
                  localStorage.setItem('firebaseui::rememberedAccounts', JSON.stringify(itemsArray));
                  window.location.replace("index.html")
                 }).catch(function(error) {
                   // An error happened.
                 });
               });
             });
          }
         }
       } else {
       // No user is signed in.
       // Ни один пользователь не вошел в систему.
       if(translation_JS == null || translation_JS == 'en'){
         alert('No user is signed in.');
       } else {
         alert ("Ни один пользователь не вошел в систему.");
       }
       window.location.replace("widget.html")
       }
     });
  };
