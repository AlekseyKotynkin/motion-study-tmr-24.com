function translation_RU (){
  var lang = 'ru';

  $('.lang').each(function(index, item) {
    $(this).text(arrLang[lang][$(this).attr('key')]);
  });
  if (localStorage.length > 0)
  {
    for(let key in localStorage) {
     if (!localStorage.hasOwnProperty(key)) {
     continue; // пропустит такие ключи, как "setItem", "getItem" и так далее
       }
         if (key === 'TMR::translation')
         {
            var key_translation = localStorage.getItem('TMR::translation');
            if (key_translation !== 'ru' ){
               localStorage.removeItem('TMR::translation');
               localStorage.setItem('TMR::translation', 'ru');
            }
         }
       }
  } else {
    localStorage.setItem('TMR::translation', 'ru');
  }
}

function translation_EN (){
  var lang = 'en';

  $('.lang').each(function(index, item) {
    $(this).text(arrLang[lang][$(this).attr('key')]);
  });
  if (localStorage.length > 0)
  {
    for(let key in localStorage) {
     if (!localStorage.hasOwnProperty(key)) {
     continue; // пропустит такие ключи, как "setItem", "getItem" и так далее
       }
         if (key === 'TMR::translation')
         {
            var key_translation = localStorage.getItem('TMR::translation');
            if (key_translation !== 'en' ){
               localStorage.removeItem('TMR::translation');
               localStorage.setItem('TMR::translation', 'en');
            }
         }
       }
  } else {
    localStorage.setItem('TMR::translation', 'en');
  }
}

var arrLang = {
  'en': {
    'login': 'Login',
    'register': 'Register',
    'knowledge_base': 'Knowledge base',
    'search_projects': 'Search projects',
  },
  'ru': {
    'login': 'Вход',
    'register': 'Регистрация',
    'knowledge_base': 'База знаний',
    'search_projects': 'Поиск',
  }
};

//  $(function() {
//    $('.navbar-translation').click(function() {
//      var lang = $(this).attr('id');

//      $('.lang').each(function(index, item) {
//        $(this).text(arrLang[lang][$(this).attr('key')]);
//      });
//    });
//  });
