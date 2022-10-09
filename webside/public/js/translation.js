function translation_RU (){
  var lang = 'ru';

  $('.lang').each(function(index, item) {
    $(this).text(arrLang[lang][$(this).attr('key')]);
  });
  if (localStorage.length > 0)
  {
    var key_translation = localStorage.getItem('TMR::translation');
    if(key_translation == null){
      localStorage.setItem('TMR::translation', 'ru');
    }else {
      localStorage.removeItem('TMR::translation');
      localStorage.setItem('TMR::translation', 'ru');
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
    var key_translation = localStorage.getItem('TMR::translation');
    if(key_translation == null){
      localStorage.setItem('TMR::translation', 'en');
    }else {
      localStorage.removeItem('TMR::translation');
      localStorage.setItem('TMR::translation', 'en');
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
    'Welcome': 'Welcome!',
    'slogan': 'Come in and manage your team!',
    'SIGN_IN': 'SIGN IN',
    'sign_out': 'Sign out',





    'search_projects': 'Search projects',
  },
  'ru': {
    'login': 'Вход',
    'register': 'Регистрация',
    'knowledge_base': 'База знаний',
    'Welcome': 'Здравствуйте!',
    'slogan': 'Управляйте своей командой!',
    'SIGN_IN': 'ВОЙТИ',
    'sign_out': 'Выйти',


    'search_projects': 'Поиск',
  }
};
