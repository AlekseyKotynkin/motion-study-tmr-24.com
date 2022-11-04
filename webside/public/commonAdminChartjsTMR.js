// Получаем переменную для распознавания языка пользователя
var translation_JS = localStorage.getItem('TMR::translation');
//Общие методы для главной страницы приложения и автономного виджета.
var db = firebase.firestore();
var storage = firebase.storage();
//
var items = [];
// var itemsUserName = [];
var itemsName = [];
var nameOrganization = "";
var nameSubdivision = "";
var namePosition = "";
var nameActiveUserOrganization = "";
var nameActiveUserSubdivision = "";
var nameActiveUserPosition = "";
// массив для формирования графических отчетов
var bar_chart_map_local = [];
//переменные под круговую диаграмму
if(translation_JS == null || translation_JS == 'en'){
  var pie_chart_labels =  [
    'Green',
    'Yellow',
    'orange',
    'Red',
  ]
} else {
  var pie_chart_labels =  [
     'Должностные обязанности', //зеленый
     'Вспомогательные обязанности', // желтый
     'Прочая деятельность', // оранжевый
     'Простой сотрудника', // красный
  ]
}
var pie_chart_data = [];
var pie_chart_map = [];
//переменные под столбчатую диаграмму
var bar_chart_labels =  []
var bar_chart_data = [];
var bar_chart_map = [];
//

//Читаем параметры из localStorage 'firebaseui::rememberedAccounts'.
var LocalStorageValueObject = JSON.parse(localStorage.getItem('firebaseui::rememberedAccounts'));
var UserNamelocalStorage = (LocalStorageValueObject[0]).displayName;
var EmailLocalStorage = (LocalStorageValueObject[0]).email;
var FotoUrlLocalStorage = (LocalStorageValueObject[0]).photoUrl;

//Получение данных для таблицы List of own organizations из firestore Список организаций
db.collection("Organization").where("OwnerEmail", "==", EmailLocalStorage)
.get()
.then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    var idDocOrganization = doc.id;
    var item = doc.data();
    var nameOrganization = doc.data().Organization;
    ////
    var tr = document.createElement("tr");

    var statusUserColumn = document.createElement('td');
    statusUserColumn.innerHTML = doc.data().OwnerEmail;

    var organizationColumn = document.createElement('td');
    organizationColumn.innerHTML = doc.data().Organization;

    var toComeInUserName = document.createElement('button');
    if(translation_JS == null || translation_JS == 'en'){
      toComeInUserName.innerHTML = "To come in";
    } else {
      toComeInUserName.innerHTML = "Выбрать";
    }
    toComeInUserName.className = 'badge badge-gradient-success';
    toComeInUserName.id = doc.id;
    toComeInUserName.item = doc.data();
    toComeInUserName.setAttribute('onclick', 'toComeInButtonSubdivision_Admin(this)');

    var toComeInUserColumn = document.createElement('td');
    toComeInUserColumn.appendChild(toComeInUserName);

    tr.appendChild(organizationColumn);
    tr.appendChild(statusUserColumn);
    tr.appendChild(toComeInUserColumn);

    var container = document.getElementById("tableAvalableUserMyOrganization_Admin").getElementsByTagName("tbody")[0];

    container.appendChild(tr);
  });
})
.catch((error) => {
  console.log("Error getting documents: ", error);
});

//Получение данных для таблицы List Of Posts In Which You Are Involved As A User из firestore.. Список подразделений, должностей и сотрудников

function toComeInButtonSubdivision_Admin(obj) {
  //обработка редактирования строки...
  itemsName = [];
  var objItem = obj.item;
  var idDocOrganization = obj.id;
  var nameOrganization = objItem.Organization;
  itemsName.push({[idDocOrganization]: nameOrganization});
  //
  var tableMyOrganization = document.getElementById("tableAvalableSubdivision_Admin");
  for(var k = 1; k<tableMyOrganization.rows.length;){
    tableMyOrganization.deleteRow(k);
  }
  //
  var table = document.getElementById("tableChangeUser_Admin");
  for(var i = 1; i<table.rows.length;){
    table.deleteRow(i);
  }
  //
  var tableDuble = document.getElementById("tableDetailingShift_Admin");
  for(var l = 1; l<tableDuble.rows.length;){
    tableDuble.deleteRow(l);
  }
  //получаем список подразделений
  var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
  docRefOrganization.collection("Subdivision").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      var idDocSubdivision = doc.id;
      var nameSubdivision = doc.data().Subdivision;
      // itemsName.push({...{[idDocSubdivision]: nameSubdivision}});
      itemsName.push({[idDocSubdivision]: nameSubdivision});
      //получаем список должностей
      var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
      docRefSubdivision.collection("Position").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          var idDocPosition = doc.id;
          var namePosition = doc.data().Position;
          // itemsName.push({...{[idDocPosition]: namePosition}});
          itemsName.push({[idDocPosition]: namePosition});
          //получаем список пользователей
          var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
          docRefPosition.collection("PositionUser").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              var idDocUser = doc.id;
              var userName = doc.data().UserName;
              var userEmail = doc.data().UserEmail;
              var userСomment = doc.data().UserСomment;
              var idDocOrganization_local = doc.data().idDocOrganization;
              var idDocSubdivision_local = doc.data().idDocSubdivision;
              var idDocPosition_local = doc.data().idDocPosition;
              //заполняем таблицу
              var tr = document.createElement("tr");

              var userName_tr = document.createElement('td');
              userName_tr.innerHTML = userName;

              var userEmail_tr = document.createElement('td');
              userEmail_tr.innerHTML = userEmail;
              //
              var userСomment_tr = document.createElement('td');
              userСomment_tr.innerHTML = userСomment;
              //
              var organizationColumn = document.createElement('td');
              itemsName.forEach((element, index, array) => {
                if(element[idDocOrganization_local] !== undefined){
                  organizationColumn.innerHTML = element[idDocOrganization_local];
                }
              });
              //
              var subdivisionColumn = document.createElement('td');
              itemsName.forEach((element, index, array) => {
                if(element[idDocSubdivision_local] !== undefined){
                  subdivisionColumn.innerHTML = element[idDocSubdivision_local];
                }
              });
              //
              var positionColumn = document.createElement('td');
              itemsName.forEach((element, index, array) => {
                if(element[idDocPosition_local] !== undefined){
                  positionColumn.innerHTML = element[idDocPosition_local];
                }
              });
              //
              var toComeInUserName = document.createElement('button');
              if(translation_JS == null || translation_JS == 'en'){
                toComeInUserName.innerHTML = "To come in";
              } else {
                toComeInUserName.innerHTML = "Выбрать";
              }
              toComeInUserName.className = 'badge badge-gradient-success';
              toComeInUserName.id = idDocUser;
              toComeInUserName.item = doc.data();
              toComeInUserName.setAttribute('onclick', 'toComeInButtonShift_Admin(this)');

              var toComeInUserColumn = document.createElement('td');
              toComeInUserColumn.appendChild(toComeInUserName);

              tr.appendChild(organizationColumn);
              tr.appendChild(subdivisionColumn);
              tr.appendChild(positionColumn);
              tr.appendChild(userName_tr);
              tr.appendChild(userEmail_tr);
              tr.appendChild(userСomment_tr);
              tr.appendChild(toComeInUserColumn);

              var container = document.getElementById("tableAvalableSubdivision_Admin").getElementsByTagName("tbody")[0];

              container.appendChild(tr);
              //end заполняем таблицу
            });
          });
          //end получаем список пользователей
        });
      });
      //end получаем список должностей
    });
  });
  //end получаем список подразделений
}

//Получение данных для таблицы List Of Posts In Which You Are Involved As A User из firestore.. Список смен

function toComeInButtonShift_Admin(obj) {
  //обработка редактирования строки...
  var objItem = obj.item;
  var idDocPosition = objItem.idDocPosition;
  var userEmail = objItem.UserEmail;
  var itemsActiveUserName = [];
  ///
  var table = document.getElementById("tableChangeUser_Admin");
  for(var i = 1;i<table.rows.length;){
    table.deleteRow(i);
  }
  ///
  var tableDuble = document.getElementById("tableDetailingShift_Admin");
  for(var l = 1; l<tableDuble.rows.length;){
    tableDuble.deleteRow(l);
  }
  //// отбираем смены попадающие в интервал дат
  //получаем и проверяем заполненость ячеек из формы
  var getAnalysisStartDate = document.getElementById("adminChartjsTMR_intervai_shift_data_start").value;
  var getAnalysisStartEnd = document.getElementById("adminChartjsTMR_intervai_shift_data_end").value;
  if(getAnalysisStartDate !== ""){
    var yearAnalysisStartDate = getAnalysisStartDate.split("-")[0];
    var monthAnalysisStartDate = getAnalysisStartDate.split("-")[1];
    var dayAnalysisStartDate = getAnalysisStartDate.split("-")[2];
    var dateComparisonStart = +new Date(yearAnalysisStartDate, monthAnalysisStartDate-1, dayAnalysisStartDate, 0, 0, 0)/1000;
  } else if (getAnalysisStartEnd == ""){
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in both dates!');
    } else {
      alert('Пожалуйста, заполните обе даты!');
    }
    return;
  }
  if(getAnalysisStartEnd !== ""){
    var yearAnalysisEndDate = getAnalysisStartEnd.split("-")[0];
    var monthAnalysisEndDate = getAnalysisStartEnd.split("-")[1];
    var dayAnalysisEndDate = getAnalysisStartEnd.split("-")[2];
    var dateComparisonExpiration = +new Date(yearAnalysisEndDate, monthAnalysisEndDate-1, dayAnalysisEndDate, 23, 59, 59)/1000;
  } else if(getAnalysisStartDate == ""){
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in both dates!');
    } else {
      alert('Пожалуйста, заполните обе даты!');
    }
    return;
  } else if(getAnalysisStartEnd == "") {
    if(translation_JS == null || translation_JS == 'en'){
      alert('Please fill in both dates!');
    } else {
      alert('Пожалуйста, заполните обе даты!');
    }
    return;
  }
  //// end отбираем смены попадающие в интервал дат

  ///
  db.collection("WorkShift").where('EmailPositionUser', '==', userEmail).where("IdDocPosition","==", idDocPosition).where("WorkShiftEnd", "==", "false")
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var parentHierarchyDoc = doc.data().ParentHierarchyPositionUser;
      var idDocOrganization = parentHierarchyDoc.idDocOrganization;
      var idDocSubdivision = parentHierarchyDoc.idDocSubdivision;
      var idDocPosition = parentHierarchyDoc.idDocPosition;
      var workShiftEndTime = doc.data().WorkShiftEndTime;
      var workShiftStartTime = doc.data().WorkShiftStartTime;
      if(getAnalysisStartEnd == "" && getAnalysisStartDate == ""){
        itemsActiveUserName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: idDocPosition},...{idDocSubdivision: idDocSubdivision},...{idDocOrganization: idDocOrganization}});
      } else if(workShiftStartTime.seconds >= dateComparisonStart && workShiftEndTime.seconds <= dateComparisonExpiration){
        itemsActiveUserName.push({...doc.data(),...{idDocPositionUser: doc.id},...{idDocPosition: idDocPosition},...{idDocSubdivision: idDocSubdivision},...{idDocOrganization: idDocOrganization}});
      }
    });
    itemsActiveUserName = itemsActiveUserName.sort(( a, b ) => b.WorkShiftStartTime - a.WorkShiftStartTime);
    itemsActiveUserName.forEach(function(element){
      var idDocOrganization = element.idDocOrganization ;
      var idDocSubdivision = element.idDocSubdivision ;
      var idDocPosition = element.idDocPosition ;
      var docRefOrganization = db.collection("Organization").doc(idDocOrganization);
      docRefOrganization.get().then(function(doc) {
        if (doc.exists) {
          nameActiveUserOrganization = doc.data().Organization;
          element['NameOrganization'] = nameActiveUserOrganization;
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
      var docRefSubdivision = docRefOrganization.collection("Subdivision").doc(idDocSubdivision);
      docRefSubdivision.get().then(function(doc) {
        if (doc.exists) {
          nameActiveUserSubdivision = doc.data().Subdivision;
          element['NameSubdivision'] = nameActiveUserSubdivision;
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
      var docRefPosition = docRefSubdivision.collection("Position").doc(idDocPosition);
      docRefPosition.get().then(function(doc) {
        if (doc.exists) {
          nameActiveUserPosition = doc.data().Position;
          element['NamePosition'] = nameActiveUserPosition;
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      }).finally(() => {
        [element].forEach(item =>
          {
            var tr = document.createElement("tr");
            //
            var organizationColumn = document.createElement('td');
            organizationColumn.innerHTML = item.NameOrganization;
            //
            var subdivisionColumn = document.createElement('td');
            subdivisionColumn.innerHTML = item.NameSubdivision;
            //
            var positionColumn = document.createElement('td');
            positionColumn.innerHTML = item.NamePosition;
            //
            var nameOfYourManagerColumn = document.createElement('td');
            var workShiftEndTime = item.WorkShiftEndTime;
            nameOfYourManagerColumn.innerHTML = new Date(workShiftEndTime.toDate()).toUTCString();
            //
            var statusUserColumn = document.createElement('td');
            var workShiftStartTime = item.WorkShiftStartTime;
            statusUserColumn.innerHTML = new Date(workShiftStartTime.toDate()).toUTCString();
            //
            var formattedColumn = document.createElement('td');
            var workShiftFormattedTime = workShiftEndTime - workShiftStartTime;
            var timestamp = new Date(workShiftFormattedTime).getTime();
            var hours = Math.floor(timestamp / 60 / 60);
            if (hours < 10) {
              hours = '0' + hours;
            }
            var minutes = Math.floor(timestamp / 60) - (hours * 60);
            if (minutes < 10) {
              minutes = '0' + minutes;
            }
            var seconds = timestamp % 60;
            if (seconds < 10) {
              seconds = '0' + seconds;
            }
            var formatted = hours + ':' + minutes + ':' + seconds;
            formattedColumn.innerHTML = formatted;
            //
            var toComeInUserName = document.createElement('button');
            if(translation_JS == null || translation_JS == 'en'){
              toComeInUserName.innerHTML = "To come in";
            } else {
              toComeInUserName.innerHTML = "Выбрать";
            }
            toComeInUserName.className = 'badge badge-gradient-success';
            toComeInUserName.id = item.idDocPositionUser;
            toComeInUserName.item = item;
            toComeInUserName.setAttribute('onclick', 'toComeInButtonEvent_Admin(this)');
            //
            var toComeInUserColumn = document.createElement('td');
            toComeInUserColumn.appendChild(toComeInUserName);
            //
            tr.appendChild(statusUserColumn);
            tr.appendChild(nameOfYourManagerColumn);
            tr.appendChild(formattedColumn);
            tr.appendChild(positionColumn);
            tr.appendChild(subdivisionColumn);
            tr.appendChild(organizationColumn);
            tr.appendChild(toComeInUserColumn);
            //
            var container = document.getElementById("tableChangeUser_Admin").getElementsByTagName("tbody")[0];

            container.appendChild(tr);
          });
        });
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }

  //Получение данных для таблицы Detailing Of The Selected Shift из firestore Детализация смены и графические отчеты
  function toComeInButtonEvent_Admin(objs) {
    //обработка редактирования строки...
    // let objItem = obj.item;
    bar_chart_map_local = [];
    var itemsShiftDoc = [];
    var idDocShift = objs.id;
    //
    var tableDuble = document.getElementById("tableDetailingShift_Admin");
    for(var i = 1;i<tableDuble.rows.length;){
      tableDuble.deleteRow(i);
    }
    //
    var docRefShift = db.collection("WorkShift").doc(idDocShift);
    docRefShift.collection("ProcessUser").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        itemsShiftDoc.push({...doc.data(),...{idDocShift: doc.id}});
        var nameDocProcessButton_mapChartjs = doc.data().NameDocProcessButton;
        var idDocProcessButton_mapChartjs = doc.data().IdDocProcessButton;
        var processUserStartTime_mapChartjs = doc.data().ProcessUserStartTime;
        var processUserEndTime_mapChartjs = doc.data().ProcessUserEndTime;
        var processUserFormattedTime = processUserEndTime_mapChartjs - processUserStartTime_mapChartjs;
        var settingsSalesFunnel_Stage_key_mapChartjs = doc.data().SettingsSalesFunnel_Stage_key;
        if(settingsSalesFunnel_Stage_key_mapChartjs == undefined){
          settingsSalesFunnel_Stage_key_mapChartjs ="str0";
        }
        bar_chart_map_local.push({nameDocProcessButton_mapChartjs: nameDocProcessButton_mapChartjs, idDocProcessButton_mapChartjs: idDocProcessButton_mapChartjs, processUserFormattedTime: processUserFormattedTime, settingsSalesFunnel_Stage_key_mapChartjs: settingsSalesFunnel_Stage_key_mapChartjs});
      });
      itemsShiftDoc = itemsShiftDoc.sort(( a, b ) => b.ProcessUserStartTime - a.ProcessUserStartTime);
      canvas_pie_chart_data ();
      canvas_bar_chart_data ();
      itemsShiftDoc.forEach(item => {
          var tr = document.createElement("tr");
          //
          var timeStartShiftColumn = document.createElement('td');
          var processUserStartTime = item.ProcessUserStartTime;
          timeStartShiftColumn.innerHTML = new Date(processUserStartTime.toDate()).toUTCString();
          //
          var timeEndShiftColumn = document.createElement('td');
          var processUserEndTime = item.ProcessUserEndTime;
          timeEndShiftColumn.innerHTML = new Date(processUserEndTime.toDate()).toUTCString();
          //
          var nameShiftColumn = document.createElement('td');
          nameShiftColumn.innerHTML = item.NameDocProcessButton;
          //
          var formattedColumn = document.createElement('td');
          var processUserFormattedTime = processUserEndTime - processUserStartTime;
          var timestamp = new Date(processUserFormattedTime).getTime();
          var hours = Math.floor(timestamp / 60 / 60);
          if (hours < 10) {
            hours = '0' + hours;
          }
          var minutes = Math.floor(timestamp / 60) - (hours * 60);
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          var seconds = timestamp % 60;
          if (seconds < 10) {
            seconds = '0' + seconds;
          }
          var formatted = hours + ':' + minutes + ':' + seconds;
          formattedColumn.innerHTML = formatted;
          //
          var toComeInUserName = document.createElement('button');
          if(translation_JS == null || translation_JS == 'en'){
            toComeInUserName.innerHTML = "To come in";
          } else {
            toComeInUserName.innerHTML = "Выбрать";
          }
          toComeInUserName.className = 'badge badge-gradient-success';
          toComeInUserName.id = item.idDocShift;
          toComeInUserName.item = item;
          toComeInUserName.setAttribute('onclick', 'gridSystemModalInfoEventID_Admin(this)');
          //
          var toComeInUserColumn = document.createElement('td');
          toComeInUserColumn.appendChild(toComeInUserName);
          //
          tr.appendChild(timeStartShiftColumn);
          tr.appendChild(timeEndShiftColumn);
          tr.appendChild(formattedColumn);
          tr.appendChild(nameShiftColumn);
          tr.appendChild(toComeInUserColumn);

          var container = document.getElementById("tableDetailingShift_Admin").getElementsByTagName("tbody")[0];

          container.appendChild(tr);
        });
      });
    }

    //Выход из личного кабинета и очиска localStorage 'firebaseui::rememberedAccounts'.
    function SignoutAdmin() {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        // Выход выполнен успешно.
        if (localStorage.getItem('TMR::translation') == null) {
          localStorage.setItem('TMR::translation', 'en');
        }
        var translation_JS = localStorage.getItem('TMR::translation');
        localStorage.clear();
        localStorage.setItem('TMR::translation', translation_JS);
        window.location.replace("../../index.html")
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

    //Обработка модального окна подробная информация по документу событие.

    function gridSystemModalInfoEventID_Admin(objsi) {
      var idEventDoc = objsi.id;
      var idEventItem = objsi.item;
      var processUserStartTime = idEventItem.ProcessUserStartTime;
      var processUserEndTime = idEventItem.ProcessUserEndTime;
      var timeStartShift = new Date(processUserStartTime.toDate()).toUTCString();
      var timeEndShift = new Date(processUserEndTime.toDate()).toUTCString();
      var processUserFormattedTime = processUserEndTime - processUserStartTime;
      var timestamp = new Date(processUserFormattedTime).getTime();
      var hours = Math.floor(timestamp / 60 / 60);
      if (hours < 10) {
        hours = '0' + hours
      }
      var minutes = Math.floor(timestamp / 60) - (hours * 60);
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      var seconds = timestamp % 60;
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      var formatted = hours + ':' + minutes + ':' + seconds;
      var nameDocProcessButton = idEventItem.NameDocProcessButton;
      var processUserEnd = idEventItem.ProcessUserEnd;
      var commitDescriptioText = idEventItem.CommitDescriptioText;
      if (commitDescriptioText === undefined) {
        if(translation_JS == null || translation_JS == 'en'){
          commitDescriptioText = 'no data';
        } else {
          commitDescriptioText = 'нет данных';
        }
      }
      var resultControlButton = idEventItem.ResultControlButton;
      if (resultControlButton === undefined) {
        if(translation_JS == null || translation_JS == 'en'){
          resultControlButton = 'no data';
        } else {
          resultControlButton = 'нет данных';
        }
      }

      if(translation_JS == null || translation_JS == 'en'){
        document.getElementById("nameEvent_Admin").innerHTML = "Name: "+ nameDocProcessButton;
        document.getElementById("timeStartEvent_Admin").innerHTML = "Start time: "+ timeStartShift;
        document.getElementById("timeEndEvent_Admin").innerHTML = "End time: "+ timeEndShift;
        document.getElementById("eventDuration_Admin").innerHTML = "Duration: "+ formatted;
        document.getElementById("commitDescriptioText_Admin").innerHTML = "Comment: "+ commitDescriptioText;
        // document.getElementById("resultControlButton_Admin").innerHTML = "Test case: "+ resultControlButton;
      } else {
        document.getElementById("nameEvent_Admin").innerHTML = "Название: "+ nameDocProcessButton;
        document.getElementById("timeStartEvent_Admin").innerHTML = "Время начала: "+ timeStartShift;
        document.getElementById("timeEndEvent_Admin").innerHTML = "Время окончания: "+ timeEndShift;
        document.getElementById("eventDuration_Admin").innerHTML = "Продолжительность: "+ formatted;
        document.getElementById("commitDescriptioText_Admin").innerHTML = "Комментарий: "+ commitDescriptioText;
        // document.getElementById("resultControlButton_Admin").innerHTML = "Тестовый пример: "+ resultControlButton;
      }


      $(document).ready(function(){
        $("#gridSystemModalInfoEventID_Admin").modal("show");
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
      ///
    }

    // расчитываем данные для круговой диаграммы
    function canvas_pie_chart_data (){
      var obj_bar = {}
      ///
      bar_chart_map_local.forEach((item_bar)=>{
        if(obj_bar[item_bar.settingsSalesFunnel_Stage_key_mapChartjs]){
          obj_bar[item_bar.settingsSalesFunnel_Stage_key_mapChartjs].processUserFormattedTime = obj_bar[item_bar.settingsSalesFunnel_Stage_key_mapChartjs].processUserFormattedTime + item_bar.processUserFormattedTime;
        }else{
          obj_bar[item_bar.settingsSalesFunnel_Stage_key_mapChartjs] = item_bar;
        }
      });
      pie_chart_map = Object.values(obj_bar)
      console.log(pie_chart_map);
      //формируем данные для диаграммы
      var sum = pie_chart_map.map(o => o.processUserFormattedTime).reduce((a, c) => { return a + c });
      // console.log(sum);
      var d = 0;
      var c = 0;
      var b = 0;
      var a = 0;
      pie_chart_map.forEach((item)=>{
        if(item.settingsSalesFunnel_Stage_key_mapChartjs == "str3"){
          d_t = item.processUserFormattedTime;
          d = Math.round(d_t*100/sum);
        }else if(item.settingsSalesFunnel_Stage_key_mapChartjs == "str2"){
          c_t = item.processUserFormattedTime;
          c = Math.round(c_t*100/sum);
        }else if(item.settingsSalesFunnel_Stage_key_mapChartjs == "str1"){
          b_t = item.processUserFormattedTime;
          b = Math.round(b_t*100/sum);
        }else if(item.settingsSalesFunnel_Stage_key_mapChartjs == "str0"){
          a_t = item.processUserFormattedTime;
          a = Math.round(a_t*100/sum);
        }else{
          console.log("Ошибка массива!");
        }
      });
      a = 100 -(d + c + b);
      pie_chart_data = [d, c, b, a];
      //
      canvas_pie_chart ();
    }

    // расчитываем данные для круговой диаграммы
    function canvas_bar_chart_data (){
      var obj = {}
      bar_chart_map_local.forEach((item)=>{
        if(obj[item.idDocProcessButton_mapChartjs]){
          obj[item.idDocProcessButton_mapChartjs].processUserFormattedTime = obj[item.idDocProcessButton_mapChartjs].processUserFormattedTime + item.processUserFormattedTime;
        }else{
          obj[item.idDocProcessButton_mapChartjs] = item;
        }
      });
      ///
      bar_chart_map = Object.values(obj)
      console.log(bar_chart_map);
      ///
      bar_chart_map.forEach((item_bar)=>{
          bar_chart_labels.push(item_bar.nameDocProcessButton_mapChartjs);
          var time_a = Math.ceil(item_bar.processUserFormattedTime/60);
          bar_chart_data.push(time_a);
      });
      ///
      canvas_bar_chart();
    }

    //заполняем круговую диаграмму
    function canvas_pie_chart (){
      'use strict';
      var doughnutPieData = {
        datasets: [{
          data: pie_chart_data,
          backgroundColor: [
            'rgba(10, 245, 33, 0.5)', //зеленый
            'rgba(233, 245, 10, 0.5)', //желтый
            'rgba(240, 67, 10, 0.5)', //оранжевый
            'rgba(240, 10, 48, 0.5)' //красный
          ],
          borderColor: [
            'rgba(10, 245, 33, 1)', //зеленый
            'rgba(233, 245, 10, 1)',//желтый
            'rgba(240, 67, 10, 1)', //оранжевый
            'rgba(240, 10, 48, 1)' //красный
          ],
        }],
        // Эти метки отображаются в условных обозначениях и во всплывающих подсказках при наведении курсора на разные дуги
        labels: pie_chart_labels
      };
      var doughnutPieOptions = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true
        }
      };
      if ($("#doughnutChart_Admin").length) {
        var doughnutChartCanvas = $("#doughnutChart_Admin").get(0).getContext("2d");
        var doughnutChart = new Chart(doughnutChartCanvas, {
          type: 'doughnut',
          data: doughnutPieData,
          options: doughnutPieOptions
        });
      };
      pie_chart_data = [];
      pie_chart_map = [];
    }
    //заполняем столбовую диаграмму
    function canvas_bar_chart (){
      //заполняем круговую диаграмму
      'use strict';
      var data = {
        labels: bar_chart_labels,
        datasets: [{
          label: '#',
          data: bar_chart_data,
          backgroundColor: [
            'rgba(39, 217, 172, 0.2)', // зеленый
            'rgba(39, 166, 217, 0.2)', // желтый
            'rgba(76, 37, 217, 0.2)', // оранжевый
            'rgba(174, 36, 212, 0.2)', // красный
            'rgba(89, 199, 34, 0.2)', // синий
            'rgba(201, 199, 38, 0.2)', //
            'rgba(201, 38, 174, 0.2)', //
            'rgba(191, 38, 189, 0.2)', //
            'rgba(153, 102, 255, 0.2)', //
            'rgba(255, 159, 64, 0.2)' ,//
            'rgba(255, 99, 132, 0.2)' //
          ],
          borderColor: [
            'rgba(39, 217, 172, 1)', //
            'rgba(39, 166, 217, 1)', //
            'rgba(76, 37, 217, 1)', //
            'rgba(174, 36, 212, 1)', //
            'rgba(89, 199, 34, 1)',//
            'rgba(201, 199, 38, 1)', //
            'rgba(201, 38, 174, 1)', //
            'rgba(191, 38, 189, 1)', //
            'rgba(153, 102, 255, 1)', //
            'rgba(255, 159, 64, 1)', //
            'rgba(255,99,132,1)' //
          ],
          borderWidth: 1,
          fill: false
        }]
      };
      var options = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: false
        },
        elements: {
          point: {
            radius: 0
          }
        }
      };
      // Get context with jQuery - using jQuery's .get() method.
      if ($("#barChart_Admin").length) {
        var barChartCanvas = $("#barChart_Admin").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var barChart = new Chart(barChartCanvas, {
          type: 'bar',
          data: data,
          options: options
        });
      };
      bar_chart_labels = [];
      bar_chart_data = [];
      bar_chart_map = [];
    }
////
function calendarIntervalStart(){


}
////
function calendarIntervalEnd(){

}
////
