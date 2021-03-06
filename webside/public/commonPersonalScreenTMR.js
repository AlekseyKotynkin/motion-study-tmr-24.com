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
var storage = firebase.storage();
//
let items_Note = [];



 /**
 * @return {string}
 *  Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
 */
const LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
const UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
const EmailLocalStorage = (LocalStorageValueObject[0]).email;
const FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;

displayListOpenNotes();

/**
* @return {string}
 * Получение данных для таблицы List of own organizations из firestore
 */
 function displayListOpenNotes()
 {
   //очищаю таблицу tableAvalablePositionsList
   $('#tableNoteUser tbody').empty();
   items_Note = [];
   db.collection("Note").where("NoteUser", "==", EmailLocalStorage)
                         .where("NoteStatus", "==", "")
       .get()
       .then((querySnapshot) => {
           querySnapshot.forEach((doc) => {
               // doc.data() is never undefined for query doc snapshots
               // console.log(doc.id, " => ", doc.data());
               items_Note.push({...doc.data(),...{idDocNote: doc.id}});
           });
       })
       .catch((error) => {
           console.log("Error getting documents: ", error);
       }).finally(() => {items_Note;
         items_Note.sort(( a, b ) => b.NoteTime - a.NoteTime);
         items_Note.forEach(function(item, i, arr){
         var tr = document.createElement("tr");

        var numer_Column = document.createElement('td');
        numer_Column.innerHTML = i + 1;

        var parent_Column = document.createElement('td');
        var parent = item.NoteSource;
        let noteSource = "";
        if (parent === "note_traffic" )
        {
           noteSource = "Note Traffic";
        }
        if (parent === "note_text")
        {
           noteSource = "Note Text";
        }
        if (parent === "note_list")
        {
           noteSource = "Note List";
        }
        if (parent === "note_geo")
        {
           noteSource = "Note GEO";
        }
        parent_Column.innerHTML = noteSource;

        var userСommentColumn = document.createElement('td');
        userСommentColumn.innerHTML = item.NoteText;

         var time_Column = document.createElement('td');
         let workShiftPositionExpiration = item.NoteTime;
         let secondsExpiration = workShiftPositionExpiration.seconds*1000;
         let dataExpiration = new Date(secondsExpiration);
         let lE = dataExpiration.toString();
         let getDayExpiration = lE.split(" ")[0];
         let getMonthExpiration = lE.split(" ")[1];
         let getDateExpiration = lE.split(" ")[2];
         let getFullYearExpiration = lE.split(" ")[3];
         let getTimeExpiration = lE.split(" ")[4];
         let getHoursExpiration = getTimeExpiration.split(":")[0];
         let getMinutesExpiration = getTimeExpiration.split(":")[1];
         let workShiftPositionExpirationString = (getHoursExpiration)+":"+(getMinutesExpiration)+" _  "+(getDayExpiration)+" "+(getDateExpiration)+" "+(getMonthExpiration)+" "+(getFullYearExpiration);

         time_Column.innerHTML = workShiftPositionExpirationString;

         var parentDocColumn = document.createElement('td');
         parentDocColumn.innerHTML = item.NoteParentName;

         var toComeInUserName = document.createElement('button');
         toComeInUserName.innerHTML = "Close";
         toComeInUserName.className = 'badge badge-gradient-success';
         toComeInUserName.id = item.idDocNote;
         toComeInUserName.item = item;
         toComeInUserName.setAttribute('onclick', 'toCloseNote(this)');

         var toComeInUserColumn = document.createElement('td');
         toComeInUserColumn.appendChild(toComeInUserName);

         // var toComeInUserName = document.createElement('button');
         // toComeInUserName.innerHTML = "To come in";
         // toComeInUserName.className = 'badge badge-gradient-success';
         // toComeInUserName.id = item.idDocPositionUser;
         // toComeInUserName.item = item;
         // toComeInUserName.setAttribute('onclick', 'toComeInButtonPositionsListUser(this)');
         //
         // var toComeInUserColumn = document.createElement('td');
         // toComeInUserColumn.appendChild(toComeInUserName);

         tr.appendChild(numer_Column);
         tr.appendChild(parent_Column);
         tr.appendChild(userСommentColumn);
         tr.appendChild(time_Column);
         tr.appendChild(parentDocColumn);
         tr.appendChild(toComeInUserColumn);
         // tr.appendChild(toComeInUserColumn);

         var container = document.getElementById("tableNoteUser").getElementsByTagName("tbody")[0];
         container.appendChild(tr);

       });
     });
 }


function toCloseNote(obj)
{
  let objId = obj.id;
  var washingtonRef = db.collection("Note").doc(objId);
  // Set the "capital" field of the city 'DC'
  return washingtonRef.update({
      NoteStatus: "false"
  })
  .then(() => {
      console.log("Document successfully updated!");
      displayListOpenNotes();
  })
  .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });


}
