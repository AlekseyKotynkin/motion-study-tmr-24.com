function translation_RU (){
  translationCommon_RU ();
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
  translationCommon_EN ();
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
    'add_user': '+ Add User',
    'edit_user': 'Edit User',
    'edit_account_user': ' Edit user account ',
    'create_account_organization': 'Create a new organization account',
    'create_account_subdivision': 'Create a new subdivision account',
    'create_account_position': 'Create a new position account',
    'create_account_user': ' Create a new user account ',
    'create_account_settings_button': ' Create a new settings account ',
    'edit_account_settings_button': ' Edit a new settings account ',
    'file_logo': 'File logo',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'upload': 'Upload',
    'to_come': 'Upload',
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
    'list_position': 'List of available positions',
    'list_position_shifts': 'List of work shifts by position',
    'list_position_employees': 'List of employees with the selected position',
    'list_users': 'A list of users :',
    'list_users_available': 'List of available users',
    'list_position_users': 'List user position',
    'users_email': 'Users email',
    'settings_for': 'Settings for :',
    'settings': 'Settings',
    'add_settings_button': '+ Add settings for button',
    'edit_settings_button': 'Edit settings for button',
    'button_name': 'Button name',
    'button_comment': 'Button comments',
    'button_active_control': 'Active Control',
    'button_passive_control': 'Passive Control',
    'button_description': 'Commit Description',
    'button_result_control': 'Result Control',
    'button_settings_interval': 'Interval',
    'button_settings_duration': 'Duration',
    'button_settings_transition': 'Transition',
    'button_settings_signal': 'Signal',
    'button_settings_audio': 'Audio',
    'button_settings_photo': 'Photo',
    'button_settings_video': 'Video',
    'button_settings_geolocation': 'Geolocation',
    'active_activity_control': 'Active activity control',
    'passive_activity_control': 'Passive activity control',
    'result_capture': 'Result capture',
    'button_result_option_1': 'Option 1',
    'button_result_option_2': 'Option 2',
    'button_result_option_3': 'Option 3',
    'button_result_option_4': 'Option 4',
    'button_result_option_5': 'Option 5',
    'button_result_option_6': 'Option 6',
    'button_result_option_7': 'Option 7',
    'button_result_option_8': 'Option 8',
    'button_no': 'No button',
    'list_notes': 'List of notes: ',
    'list_traffic': 'List of traffic channels: ',
    'settings_sales_funnels': ' Settings for displaying "Sales funnels"',
    'button_result_sales': ' Sales funnel stage ',
    'button_result_employee': ' Employee availability ',
    'button_result_button': ' Result button ',
    'user': ' User ',
    '1_seconds': ' 1 seconds ',
    '2_seconds': ' 2 seconds ',
    '3_seconds': ' 3 seconds ',
    '5_seconds': ' 5 seconds ',
    '10_seconds': ' 10 seconds ',
    '15_seconds': ' 15 seconds ',
    '20_seconds': ' 20 seconds ',
    '25_seconds': ' 25 seconds ',
    '30_seconds': ' 30 seconds ',
    '35_seconds': ' 35 seconds ',
    '40_seconds': ' 40 seconds ',
    '45_seconds': ' 45 seconds ',
    '50_seconds': ' 50 seconds ',
    '55_seconds': ' 55 seconds ',
    '1_minutes': ' 1 minutes ',
    '3_minutes': ' 3 minutes ',
    '5_minutes': ' 5 minutes ',
    '10_minutes': ' 10 minutes ',
    '15_minutes': ' 15 minutes ',
    'capture_event_click': ' Capture event on click ',
    'capture_event_click_interval_foto': ' The interval between photo events ',
    'capture_event_click_interval_GEO': ' The interval between GEO events ',
    'camera_smartphone': ' Smartphone camera ',
    'camera_ip': ' External IP camera ',
    'option_1': ' Option 1 ',
    'option_2': ' Option 2 ',
    'option_3': ' Option 3 ',
    'option_4': ' Option 4 ',
    'option_5': ' Option 5 ',
    'option_6': ' Option 6 ',
    'option_7': ' Option 7 ',
    'option_8': ' Option 8 ',
    'list_notes_title': ' List of notes ',
    'list_notes_open': ' List of open notes ',
    'note_1': ' Note 1 ',
    'note_2': ' Note 2 ',
    'note_3': ' Note 3 ',
    'note_4': ' Note 4 ',
    'note_5': ' Note 5 ',
    'note_6': ' Note 6 ',
    'note_7': ' Note 7 ',
    'note_8': ' Note 8 ',
    'note_9': ' Note 9 ',
    'note_10': ' Note 10 ',
    'list_traffic_title': ' Traffic channel ',
    'channel_1': ' Channel 1 ',
    'channel_2': ' Channel 2 ',
    'channel_3': ' Channel 3 ',
    'channel_4': ' Channel 4 ',
    'channel_5': ' Channel 5 ',
    'channel_6': ' Channel 6 ',
    'channel_7': ' Channel 7 ',
    'channel_8': ' Channel 8 ',
    'channel_9': ' Channel 9 ',
    'channel_10': ' Channel 10 ',
    'parent': ' Parent ',
    'parent_doc': ' Parent document title ',
    'time_creation': ' Time of creation ',
    'select_management_positions': ' Select a source of management positions. ',
    'organization_owner': ' Organization owner ',
    'manager_organization': ' Manager of the Organization ',
    'manager_subdivision': ' Manager of the Subdivision ',
    'manager_position': ' Manager of the Position ',
    'data_doc_start': ' Start date and time ',
    'data_doc_end': ' End date and time ',
    'data_elementary': ' Elementary date ',
    'data_expiration': ' Expiration date ',
    'shift_number': ' Shift number ',
    'shift_employees': ' Employees per shift ',
    'shift_duration': ' Shift duration ',
    'current_employment_employees': ' Сurrent employment of employees ',
    'personal_change': ' Personal change ',
    'current_event': ' Сurrent event ',
    'shift_position': ' Shift position ',
    'shift_position_title': ' Working interval of job changet ',
    'list_own_organizations': ' List of own organizations ',
    'list_change_user': ' Change list of selected user ',
    'detailing_selected_shift': ' Detailing of the selected shift ',
    'event_duration': ' Event duration ',
    'event_name': ' Event name ',
    'event_information': ' Event information ',
    'event_detailed': ' Detailed information on the event ',
    'chart_bar': ' Bar chart ',
    'chart_doughnut': ' Doughnut chart ',
    'analysis_interval': ' Analysis interval ',
    'analysis_comparison': ' Comparison interval ',
    'use_comparison': ' Use comparison ',
    'analytics_free_sales_consultant': ' Analytics "Free Sales Consultant" ',
    'analysis_traffic': ' Traffic Sources analytics ',
    'traffic_name': ' First name ',
    'quantity': ' Quantity ',
    'progress': ' Progress ',
    'result_table': ' Result table ',
    'result': ' Result ',
    'time_money_result': ' Time. Money. Result. ',
    'tmr_admin': ' TMR-24 Administrator ',
    'tmr_admin_title': ' “Control panel“ for your team. ',
    'tmr_admin_dashboard': ' Dashboard of the manager and owner. ',
    'tmr_admin_metrics': ' Key metrics in real time. ',
    'tmr_admin_tool': ' A tool for direct interaction with the team. ',
    'tmr_admin_texst_1': ' Personnel management of a trading enterprise should be integrated with the strategy for managing goods turnover and trading services, developing a material and technical base, and financial development of a trading enterprise. ',
    'tmr_admin_texst_2': ' The main goal of managing the number and composition of personnel is to optimize the costs of human labor to perform the main types of work related to the activities of a trading enterprise, and to ensure that the necessary jobs are filled with employees of the relevant professions, specialties and skill levels. The implementation of this function of personnel management to the greatest extent should be linked to the general strategy of trade management, since the labor potential formed at the enterprise and will ensure the implementation of all strategic goals and directions of its activities. ',
    'tmr_admin_texst_3': ' Follow the link, more details and details about the application ',
    'tmr_client': ' TMR-24 Client ',
    'tmr_client_title': ' Mobile app. Aimed at identifying effective skills among team members and organizing the harmonious movement of the team towards the set goals. ',
    'tmr_client_registrar': ' Registrar of end-to-end analytics on the offline site. ',
    'tmr_client_dashboard': ' Dashboard of employee tasks. ',
    'tmr_client_messenger': ' Messenger aggregator. ',
    'tmr_client_plan': ' Planning a working day. ',
    'tmr_client_personal': ' Organization of staff work on the trading floor. ',
    'tmr_client_text_1': ' SMART and trust. ',
    'tmr_client_text_2': ' A prerequisite for working with the SMART system is its maximum concreteness and unambiguity. In order for a dream to turn into a goal, it is necessary to clearly analyze and prescribe tactical and strategic objectives, while defining priorities and criteria. Solving a problem is always a phased sequence of targeted actions that will result in the achievement of the main goal. ',
    'tmr_client_text_3': ' Trust is a positive relationship between people, allowing each of the parties to be confident in the decency, openness, benevolence and honesty of the other party with which it is in one or another relationship. ',
    'new_here': ' New here? ',
    'new_here_title': ' Signing up is easy. It only takes a few steps ',
    'registration': ' Registration ',
    'recover_passwor': ' Recover Password ',
    'file_upload': ' File upload ',
    'register_personal_text_1': ' Complete your personal data! ',
    'register_personal_text_2': ' Please provide your personal information for - ',
    'to_write': ' TO WRITE ',





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
    'list_organizations_involver_owner': 'Ваши организации',
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
    'add_user': '+ Добавить пользователя',
    'edit_user': 'Редактировать пользователя',
    'edit_account_user': ' Редактировать учетную запись пользователя ',
    'edit_settings_button': 'Редактировать настройки кнопки',
    'create_account_organization': 'Создайте новую учетную запись организации',
    'create_account_subdivision': 'Создайте новую учетную запись подразделение',
    'create_account_position': 'Создайте новую учетную запись должность',
    'create_account_user': 'Создайте новую учетную запись пользователя',
    'create_account_settings_button': 'Создайте новую учетную запись настройки для кнопки ',
    'edit_account_settings_button': ' Редактировать учетную запись настройки кнопки ',
    'file_logo': 'Файл логотипа',
    'cancel': 'Отменить',
    'submit': 'Добавить',
    'upload': 'Загрузить',
    'to_come': 'Перейти',
    'to_together': ' к совершенству вместе. ',
    'add_shift': 'Открыть смену',
    'list_processes_post': 'Список процессов для - ',
    'expect': 'Ожидаю',
    'other': 'Другое',
    'gone': 'Отлучился',
    'personal_policy': 'Политика обработки персональных данных.',
    'releases': 'Релизы',
    'number_employees': 'Количество сотрудников',
    'list_position_subdivision_select': 'Список должностей в вашем подразделении - Выберите подразделение',
    'list_position': 'Список доступных должностей',
    'list_position_shifts': 'Список рабочих смен по должностям',
    'list_position_employees': 'Список сотрудников с выбранной должностью',
    'list_users': 'Список пользователей :',
    'list_users_available': 'Список доступных пользователей',
    'list_position_users': 'Позиция пользователя в списке',
    'users_email': 'Email пользователя',
    'settings_for': 'Настройки для :',
    'settings': 'Настройка',
    'add_settings_button': '+ Добавить настройки для кнопки',
    'button_name': 'Наименование кнопки',
    'button_comment': 'Комментарий',
    'button_active_control': 'Активный Контроль',
    'button_passive_control': 'Пассивный Контроль',
    'button_description': 'Описание фиксации',
    'button_result_control': 'Контроль результата',
    'button_settings_interval': 'Интервал',
    'button_settings_duration': 'Продолжительность',
    'button_settings_transition': 'Переход',
    'button_settings_signal': 'Сигнал',
    'button_settings_audio': 'Записать звук',
    'button_settings_photo': 'Фото',
    'button_settings_video': 'Видео',
    'button_settings_geolocation': 'Геолокация',
    'active_activity_control': 'Активный контроль процесса',
    'passive_activity_control': 'Пассивный контроль процесса',
    'result_capture': 'Фиксация результата',
    'button_result_option_1': 'Вариант 1',
    'button_result_option_2': 'Вариант 2',
    'button_result_option_3': 'Вариант 3',
    'button_result_option_4': 'Вариант 4',
    'button_result_option_5': 'Вариант 5',
    'button_result_option_6': 'Вариант 6',
    'button_result_option_7': 'Вариант 7',
    'button_result_option_8': 'Вариант 8',
    'button_no': 'Нет кнопки',
    'list_notes': 'Список примечаний:',
    'list_traffic': 'Список каналов трафика: ',
    'settings_sales_funnels': 'Настройки для отображения "Воронки продаж"',
    'button_result_sales': 'Стадия воронки продаж',
    'button_result_employee': 'Доступность сотрудников',
    'button_result_button': 'Кнопка результата',
    'user': ' Пользователь ',
    '1_seconds': ' 1 секунда ',
    '2_seconds': ' 2 секунды ',
    '3_seconds': ' 3 секунды ',
    '5_seconds': ' 5 секунд ',
    '10_seconds': ' 10 секунд ',
    '15_seconds': ' 15 секунд ',
    '20_seconds': ' 20 секунд ',
    '25_seconds': ' 25 секунд ',
    '30_seconds': ' 30 секунд ',
    '35_seconds': ' 35 секунд ',
    '40_seconds': ' 40 секунд ',
    '45_seconds': ' 45 секунд ',
    '50_seconds': ' 50 секунд ',
    '55_seconds': ' 55 секунд ',
    '1_minutes': ' 1 минута ',
    '3_minutes': ' 3 минуты ',
    '5_minutes': ' 5 минут ',
    '10_minutes': ' 10 минут ',
    '15_minutes': ' 15 минут ',
    'capture_event_click': ' Захват события по щелчку мыши ',
    'capture_event_click_interval_foto': ' Интервал между событиями фотосъемки ',
    'capture_event_click_interval_GEO': ' Интервал между событиями фиксации геолокации ',
    'camera_smartphone': ' Камера смарфона ',
    'camera_ip': ' Внешняя IP-камера ',
    'option_1': ' Опция 1 ',
    'option_2': ' Опция 2 ',
    'option_3': ' Опция 3 ',
    'option_4': ' Опция 4 ',
    'option_5': ' Опция 5 ',
    'option_6': ' Опция 6 ',
    'option_7': ' Опция 7 ',
    'option_8': ' Опция 8 ',
    'list_notes_title': ' Список заметок ',
    'list_notes_open': ' Список открытых заметок ',
    'note_1': ' Заметка 1 ',
    'note_2': ' Заметка 2 ',
    'note_3': ' Заметка 3 ',
    'note_4': ' Заметка 4 ',
    'note_5': ' Заметка 5 ',
    'note_6': ' Заметка 6 ',
    'note_7': ' Заметка 7 ',
    'note_8': ' Заметка 8 ',
    'note_9': ' Заметка 9 ',
    'note_10': ' Заметка 10 ',
    'list_traffic_title': ' Каналы привлечения трафика ',
    'channel_1': ' Канал 1 ',
    'channel_2': ' Канал 2 ',
    'channel_3': ' Канал 3 ',
    'channel_4': ' Канал 4 ',
    'channel_5': ' Канал 5 ',
    'channel_6': ' Канал 6 ',
    'channel_7': ' Канал 7 ',
    'channel_8': ' Канал 8 ',
    'channel_9': ' Канал 9 ',
    'channel_10': ' Канал 10 ',
    'parent': ' Родитель ',
    'parent_doc': ' Заголовок родительского документа ',
    'time_creation': ' Время создания ',
    'select_management_positions': ' Выберите источник руководящих должностей. ',
    'organization_owner': ' Владелец организации ',
    'manager_organization': ' Руководитель Организации ',
    'manager_subdivision': ' Руководитель Подразделения ',
    'manager_position': ' Руководитель Должности ',
    'data_doc_start': ' Дата и время начала ',
    'data_doc_end': ' Дата и время окончания ',
    'data_elementary': ' Начальная дата ',
    'data_expiration': ' Конечная дата ',
    'shift_number': ' Номер смены ',
    'shift_employees': ' Сотрудников в смену ',
    'shift_duration': ' Продолжительность смены ',
    'current_employment_employees': ' Текущая занятость сотрудников ',
    'personal_change': ' Личные изменения ',
    'current_event': ' Текущее событие ',
    'list_own_organizations': ' Список собственных организаций ',
    'list_change_user': ' Изменить список выбранного пользователя ',
    'detailing_selected_shift': ' Детализация выбранной смены ',
    'event_duration': ' Продолжительность события ',
    'event_name': ' Наименование события ',
    'event_information': ' Содержание события ',
    'event_detailed': ' Подробная информация о событии ',
    'chart_bar': ' Столбчатая диаграмма ',
    'chart_doughnut': ' Круговая диаграмма ',
    'analysis_interval': ' Интервал анализа ',
    'analysis_comparison': ' Интервал сравнения ',
    'analysis_traffic': ' Аналитика источников трафика ',
    'use_comparison': ' Используйте сравнение ',
    'analytics_free_sales_consultant': ' Аналитика "Бесплатный консультант по продажам" ',
    'traffic_name': 'Наименование ',
    'quantity': ' Количество ',
    'progress': ' Прогресс ',
    'result_table': ' Таблица результатов ',
    'result': ' Результат ',
    'time_money_result': ' Время. Деньги. Результат. ',
    'tmr_admin': ' TMR-24 администратор ',
    'tmr_admin_title': ' “Панель управления“ для вашей команды. ',
    'tmr_admin_dashboard': ' Панель управления менеджера и владельца. ',
    'tmr_admin_metrics': ' Ключевые показатели в режиме реального времени. ',
    'tmr_admin_tool': ' Инструмент для непосредственного взаимодействия с командой. ',
    'tmr_admin_texst_1': ' Управление персоналом торгового предприятия должно быть интегрировано со стратегией управления товарооборотом и торговыми услугами, развитием материально-технической базы и финансовым развитием торгового предприятия. ',
    'tmr_admin_texst_2': ' Основной целью управления численностью и составом персонала является оптимизация затрат человеческого труда для выполнения основных видов работ, связанных с деятельностью торгового предприятия, и обеспечение заполнения необходимых рабочих мест сотрудниками соответствующих профессий, специальностей и уровней квалификации. Реализация этой функции управления персоналом в наибольшей степени должна быть увязана с общей стратегией управления торговлей, поскольку трудовой потенциал формируется на предприятии и будет обеспечивать реализацию всех стратегических целей и направлений его деятельности. ',
    'tmr_admin_texst_3': ' Более подробная информация по ссылке ',
    'tmr_client': ' TMR-24 клиент ',
    'tmr_client_title': ' Мобильное приложение. Направлено на выявление эффективных навыков у членов команды и организацию гармоничного движения команды к поставленным целям. ',
    'tmr_client_registrar': ' Регистратор сквозной аналитики оффлайн на сайте. ',
    'tmr_client_dashboard': ' Панель мониторинга задач сотрудников. ',
    'tmr_client_messenger': ' Агрегатор мессенджеров. ',
    'tmr_client_plan': ' Планирование рабочего дня. ',
    'tmr_client_personal': ' Организация работы персонала в торговом зале. ',
    'tmr_client_text_1': ' SMART и доверие. ',
    'tmr_client_text_2': ' Обязательным условием для работы с SMART системой является ее максимальная конкретность и неоднозначность. Для того чтобы мечта превратилась в цель, необходимо четко проанализировать и прописать тактические и стратегические задачи, определив при этом приоритеты и критерии. Решение проблемы - это всегда поэтапная последовательность целенаправленных действий, которые приведут к достижению главной цели. ',
    'tmr_client_text_3': ' Доверие - это позитивные отношения между людьми, позволяющие каждой из сторон быть уверенной в порядочности, открытости, доброжелательности и честности другой стороны, с которой она находится в тех или иных отношениях. ',
    'new_here': ' Новенький здесь? ',
    'new_here_title': ' Зарегистрироваться очень просто. Это займет всего несколько шагов. ',
    'registration': ' Регистрация ',
    'recover_passwor': ' Восстановить пароль ',
    'file_upload': ' Загрузка файла ',
    'register_personal_text_1': ' Заполните свои личные данные! ',
    'register_personal_text_2': ' Пожалуйста, предоставьте свою личную информацию для - ',
    'to_write': ' ЗАПИСАТЬ ',





    'search_projects': 'Поиск',
  }
};
