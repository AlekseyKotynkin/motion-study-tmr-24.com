var arrLang = {
  'en': {
    'login': 'Login',
    'register': 'Register',
    'knowledge_base': 'Knowledge base',
    'contact': 'Contact US',
  },
  'ru': {
    'login': 'Вход',
    'register': 'Регистрация',
    'knowledge_base': 'База знаний',
    'contact': 'Контакты',
  }
};

  $(function() {
    $('.navbar-translation').click(function() {
      var lang = $(this).attr('id');

      $('.lang').each(function(index, item) {
        $(this).text(arrLang[lang][$(this).attr('key')]);
      });
    });
  });
