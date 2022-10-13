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
    'list_subdivision_organization': 'List of subdivision in your organization - ',
    'organization': 'Organization',
    'subdivision': 'Subdivision',
    'position': 'Position',
    'comment': 'Сomment',
    'email': 'Email',
    'positio_manager': 'Position of your manager',
    'head_unit': 'Head of unit ',
    'email_unit': 'Email of unit',
    'name_manager': 'Name of your manager',
    'name_department_head': 'Name of department head',
    'status': 'Status',
    'add_organization': '+ Add Organization',
    'add_subdivision': '+ Add Subdivision',
    'add_position': '+ Add Position',
    'create_account_organization': 'Create a new organization account',
    'create_account_subdivision': 'Create a new subdivision account',
    'create_account_position': 'Create a new position account',
    'file_logo': 'File logo',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'upload': 'Upload',
    'to_come': 'Upload',
    'quit': 'Quit',
    'to_together': ' to perfection together.',
    'add_shift': '+ Add Shift',
    'list_processes_post': 'LIST OF PROCESSES FOR THE POST - ',
    'expect': 'Expect',
    'other': 'Other',
    'gone': 'Gone',
    'personal_policy': 'Personal data processing policy.',
    'releases': 'Releases',
    'number_employees': 'The number of employees',
    'list_position_subdivision_select': 'List of position in your subdivision - Select subdivision',











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
    'list_subdivision_organization': 'Список подразделений в вашей организации -',
    'organization': 'Организация',
    'subdivision': 'Подразделение',
    'position': 'Должность',
    'comment': 'Комментарий',
    'email': 'Логин',
    'positio_manager': 'Должность ответственного',
    'head_unit': 'Должность руководителя',
    'email_unit': 'Логин руководителя',
    'name_manager': 'ФИО ответственного',
    'name_department_head': 'ФИО руководителя',
    'status': 'Статус',
    'add_organization': '+ Добавить организацию',
    'add_subdivision': '+ Добавить подразделение',
    'add_position': '+ Добавить должность',
    'create_account_organization': 'Создайте новую учетную запись организации',
    'create_account_subdivision': 'Создайте новую учетную запись подразделение',
    'create_account_position': 'Создайте новую учетную запись должность',
    'file_logo': 'Файл логотипа',
    'cancel': 'Отменить',
    'submit': 'Добавить',
    'upload': 'Загрузить',
    'to_come': 'Перейти',
    'quit': 'Удалить',
    'to_together': ' к совершенству вместе. ',
    'add_shift': 'Открыть смену',
    'list_processes_post': 'СПИСОК ПРОЦЕССОВ ДЛЯ - ',
    'expect': 'Ожидаю',
    'other': 'Другое',
    'gone': 'Отлучился',
    'personal_policy': 'Политика обработки персональных данных.',
    'releases': 'Релизы',
    'number_employees': 'Количество сотрудников',
    'list_position_subdivision_select': 'Список должностей в вашем подразделении - Выберите подразделение',









    'search_projects': 'Поиск',
  }
};
