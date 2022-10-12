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
    'SIGN_IN_WATH_GOOGLE': 'SIGN IN WATH GOOGLE',
    'activity_log': 'Activity Log',
    'home_page': 'Home page',
    'report_factory': 'Report Factory',
    'personal_dashboard': 'Personal dashboard',
    'admin_dashboard': 'Admin dashboard',
    'documents_detail': 'Documents in detail',
    'sales_funnel': 'Sales funnel',
    'list_active_user_sessions': 'List of Active User Sessions',
    'list_post_involver_user': 'List of posts in which you are involved as a User',
    'list_organizations_involver_owner': 'List of organizations you are involved in as Owner',
    'organization': 'Organization',
    'subdivision': 'Subdivision',
    'position': 'Position',
    'comment': 'Сomment',
    'email': 'Email',
    'positio_manager': 'Position of your manager',
    'name_manager': 'Name of your manager',
    'status': 'Status',
    'add_organization': '+ Add Organization',
    'add_subdivision': '+ Add Subdivision',
    'add_position': '+ Add Position',
    'create_account_organization': 'Create a new organization account',
    'file_logo': 'File logo',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'upload': 'Upload',
    'to_come': 'Upload',
    'quit': 'Quit',
    'to_together': 'To perfection together',
    'add_shift': '+ Add Shift',
    'list_processes_post': 'List of processes for the post - ',
    'expect': 'Expect',
    'other': 'Other',
    'gone': 'Gone',
    'sharing_experience_in': 'Sharing experience in',





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
    'SIGN_IN_WATH_GOOGLE': 'ВХОД ЧЕРЕЗ GOOGLE',
    'activity_log': 'Журнал активностей',
    'home_page': 'Домашняя страница',
    'report_factory': 'Фабрика отчетов',
    'personal_dashboard': 'Панель сотрудника',
    'admin_dashboard': 'Панель администратора',
    'documents_detail': 'Документы в деталях',
    'sales_funnel': 'Воронка продаж',
    'list_active_user_sessions': 'Открытые смены',
    'list_post_involver_user': 'Шаблоны смен',
    'list_organizations_involver_owner': 'Ваши Организации',
    'organization': 'Организация',
    'subdivision': 'Подразделение',
    'position': 'Должность',
    'comment': 'Комментарий',
    'email': 'Логин',
    'positio_manager': 'Должность ответственного',
    'name_manager': 'ФИО ответственного',
    'status': 'Статус',
    'add_organization': '+ Добавить организацию',
    'add_subdivision': '+ Добавить подразделение',
    'add_position': '+ Добавить должность',
    'create_account_organization': 'Создайте новую учетную запись организации',
    'file_logo': 'Файл логотипа',
    'cancel': 'Отменить',
    'submit': 'Добавить',
    'upload': 'Загрузить',
    'to_come': 'Перейти',
    'quit': 'Выйти',
    'to_together': 'К совершенству вместе ',
    'add_shift': 'Открыть смену',
    'list_processes_post': 'Список процессов для - ',
    'expect': 'Ожидаю',
    'other': 'Другое',
    'gone': 'Отлучился',
    'sharing_experience_in': 'Обмен опытом в',







    'search_projects': 'Поиск',
  }
};
