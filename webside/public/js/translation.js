function translation_RU (){
  translationCommon_RU ();
  var lang = 'ru';
  jQuery( document ).ready(function( $ ) {
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
  });
}


function translation_EN (){
  translationCommon_EN ();
  var lang = 'en';
  jQuery( document ).ready(function( $ ) {
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
  });
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
    'admin_monitor': 'Admin monitor',
    'personal_dashboard': 'Personal dashboard',
    'admin_dashboard': 'Admin dashboard',
    'documents_detail': 'Documents in detail',
    'admin_documents_detail': 'Admin documents in detail',
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
    'edit_account_user': 'Edit user account',
    'create_account_organization': 'Create a new organization account',
    'create_account_subdivision': 'Create a new subdivision account',
    'create_account_position': 'Create a new position account',
    'create_account_user': 'Create a new user account',
    'create_account_settings_button': 'Create a new settings account',
    'edit_account_settings_button': 'Edit a new settings account',
    'file_logo': 'File logo',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'upload': 'Upload',
    'to_come': 'Upload',
    'to_together': ' to perfection together.',
    'add_shift': '+ Add Shift',
    'list_processes_post': 'LIST OF PROCESSES FOR THE POST -',
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
    'list_users_title': 'Select the users to generate the report.',
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
    'list_notes': 'List of notes:',
    'list_traffic': 'List of traffic channels:',
    'settings_sales_funnels': 'Settings for displaying "Sales funnels"',
    'button_result_sales': 'Sales funnel stage',
    'button_result_employee': 'Employee availability',
    'button_result_button': 'Result button',
    'user': 'User',
    '0': '0',
    '1_seconds': '1 seconds',
    '2_seconds': '2 seconds',
    '3_seconds': '3 seconds',
    '5_seconds': '5 seconds',
    '10_seconds': '10 seconds',
    '15_seconds': '15 seconds',
    '20_seconds': '20 seconds',
    '25_seconds': '25 seconds',
    '30_seconds': '30 seconds',
    '35_seconds': '35 seconds',
    '40_seconds': '40 seconds',
    '45_seconds': '45 seconds',
    '50_seconds': '50 seconds',
    '55_seconds': '55 seconds',
    '1_minutes': '1 minutes',
    '3_minutes': '3 minutes',
    '5_minutes': '5 minutes',
    '10_minutes': '10 minutes',
    '15_minutes': '15 minutes',
    'capture_event_click': 'Capture event on click',
    'capture_event_click_interval_foto': 'The interval between photo events',
    'capture_event_click_interval_GEO': 'The interval between GEO events',
    'camera_smartphone': 'Smartphone camera',
    'camera_ip': 'External IP camera',
    'option_1': 'Option 1',
    'option_2': 'Option 2',
    'option_3': 'Option 3',
    'option_4': 'Option 4',
    'option_5': 'Option 5',
    'option_6': 'Option 6',
    'option_7': 'Option 7',
    'option_8': 'Option 8',
    'list_notes_title': 'List of notes',
    'list_notes_open': 'List of open notes',
    'note_1': 'Note 1',
    'note_2': 'Note 2',
    'note_3': 'Note 3',
    'note_4': 'Note 4',
    'note_5': 'Note 5',
    'note_6': 'Note 6',
    'note_7': 'Note 7',
    'note_8': 'Note 8',
    'note_9': 'Note 9',
    'note_10': 'Note 10',
    'list_traffic_title': 'Traffic channel',
    'channel_1': 'Channel 1',
    'channel_2': 'Channel 2',
    'channel_3': 'Channel 3',
    'channel_4': 'Channel 4',
    'channel_5': 'Channel 5',
    'channel_6': 'Channel 6',
    'channel_7': 'Channel 7',
    'channel_8': 'Channel 8',
    'channel_9': 'Channel 9',
    'channel_10': 'Channel 10',
    'parent': 'Parent',
    'parent_doc': 'Parent document title',
    'time_creation': 'Time of creation',
    'select_management_positions': 'Select a source of management positions.',
    'organization_owner': 'Organization owner',
    'manager_organization': 'Manager of the Organization',
    'manager_subdivision': 'Manager of the Subdivision',
    'manager_position': 'Manager of the Position',
    'data_doc_start': 'Start date and time',
    'data_doc_end': 'End date and time',
    'data_elementary': 'Elementary date',
    'data_expiration': 'Expiration date',
    'shift_number': 'Shift number',
    'shift_employees': 'Employees per shift',
    'shift_duration': 'Shift duration',
    'current_employment_employees': 'Сurrent employment of employees',
    'personal_change': 'Personal change',
    'current_event': 'Сurrent event',
    'shift_position': 'Shift position',
    'shift_position_title': 'Working interval of job changet',
    'list_own_subdivision': 'List of own subdivision',
    'list_own_organizations': 'List of own organizations',
    'list_change_user': 'Change list of selected user',
    'detailing_selected_shift': 'Detailing of the selected shift',
    'event_duration': 'Event duration',
    'event_name': 'Event name',
    'event_information': 'Event information',
    'event_detailed': 'Detailed information on the event',
    'event_start': 'Start event',
    'event_end': 'End event',
    'event_descriptio_text': 'Event description text',
    'event_control_button': 'Event control button',
    'chart_bar': 'Bar chart',
    'chart_doughnut': 'Doughnut chart',
    'analysis_interval': 'Analysis interval',
    'analysis_comparison': 'Comparison interval',
    'use_comparison': 'Use comparison',
    'analytics_free_sales_consultant': 'Analytics "Free Sales Consultant"',
    'analysis_traffic': 'Traffic Sources analytics',
    'traffic_name': 'First name',
    'quantity': 'Quantity',
    'progress': 'Progress',
    'result_table': 'Result table',
    'result': ' Result ',
    'time_money_result': 'Time. Money. Result.',
    'tmr_admin': 'TMR-24 WEB administrator',
    'tmr_admin_title': 'Monitor the involvement of your team in the work, identify the talents of employees.',
    'tmr_admin_dashboard': 'Application Administration.',
    'tmr_admin_metrics': 'Key metrics in real time.',
    'tmr_admin_metrics_online': 'Displaying the workload of the staff in real time.',
    'tmr_admin_tool': 'A tool for direct interaction with the team.',
    'tmr_admin_texst_1': 'Personnel management is integrated with the strategy of commodity turnover and inventory management, the development of the material and technical base and the financial development of the enterprise.',
    'tmr_admin_texst_2': 'The main goal of managing the number and composition of personnel is to optimize the costs of human labor to perform the main types of work related to the activities of a trading enterprise, and to ensure that the necessary jobs are filled with employees of the relevant professions, specialties and skill levels. The implementation of this function of personnel management to the greatest extent should be linked to the general strategy of trade management, since the labor potential formed at the enterprise and will ensure the implementation of all strategic goals and directions of its activities.',
    'tmr_admin_texst_3': 'Follow the link, more details and details about the application',
    'tmr_client': 'TMR-24 Client',
    'tmr_client_title': 'Mobile app. Aimed at identifying effective skills among team members and organizing the harmonious movement of the team towards the set goals.',
    'tmr_client_registrar': 'The employment registration panel in the personnel processes.',
    'tmr_client_dashboard': 'Panel for working with projects and tasks.',
    'tmr_client_messenger': 'The registration panel for the start and end of the work shift.',
    'tmr_client_plan': 'Employee engagement diagram.',
    'tmr_client_personal': 'Note creation tools: text, list, photo, audio, location.',
    'tmr_client_text_1': 'SMART and trust.',
    'tmr_client_text_2': 'In the modern world, it is impossible to do without mobile devices. Now every person has these gadgets, sometimes not even one. That is why the mobile app is a fast and convenient way to collect data.',
    'tmr_client_text_3': 'We are the main tool for working with staff. This application collects data and identifies the talents of employees. All this totality helps the team to perform its tasks most effectively, to see its development, and therefore the development of the enterprise.
This strategy makes the life of the company more comfortable and transparent.',
    'new_here': ' New here? ',
    'new_here_title': 'Signing up is easy. It only takes a few steps',
    'registration': 'Registration',
    'recover_passwor': 'Recover Password',
    'file_upload': 'File upload',
    'register_personal_text_1': 'Complete your personal data!',
    'register_personal_text_2': 'Please provide your personal information for -',
    'to_write': 'TO WRITE',
    'users_name': 'Name',
    'list_own_subdivision_interval_shift': 'Date interval to display in : "shift list"',
    'select_organization': 'Select an organization.',
    'select_organization_title': 'Select the organization to generate the report.',
    'chart_gantt': 'Gantt chart.',
    'data_on': 'On the date:',
    'start_shift': 'Start of shift',
    'active_button': 'Active button',
    'timeStart_active_button': 'Start of events',
    'Products': 'Products',
    'Virtual_Assistant_Manager': 'Virtual Assistant Manager',
    'Operational_Data_Collector': 'Operational Data Collector',
    'tmr_admin_VAM': 'TMR-24 Virtual Assistant Manager',
    'tmr_admin_VAM_title': 'Delegate the routine to a Virtual Assistant Manager.',
    'tmr_admin_VAM_1_1': 'Operational management support.',
    'tmr_admin_VAM_1_2': 'Provides regular reports and notifies of failure in case of deviation from the specified parameters.',
    'tmr_admin_VAM_1_3': 'Controls the receipt of data.',
    'tmr_admin_VAM_1_4': 'Verifies the validity of the received data.',
    'tmr_admin_VAM_1_5': 'Helps to formulate tasks and control points based on best practices.',
    'tmr_admin_VAM_1_6': 'Аnalyzes the data within the scope of the task.',
    'tmr_admin_VAM_1_7': 'Can change the criteria of the task at the request of the client.',
    'tmr_admin_VAM_texst_1': 'We do not offer a "remind calendar", but a trained virtual assistant manager who, upon request or schedule, can submit reports, monitor running processes to achieve specific goals of the organization and, in case of deviation from the specified parameters, notify of a failure.',
    'order_specialist_consultation': 'Order a specialist consultation',
    'telephone': 'Telephone',
    'modal_order_specialist_consultation_title_1': 'The consultant will call you back!',
    'modal_order_specialist_consultation_title_2': 'Fill out the form and specify the time at which to contact you.',
    'send': 'Send',
    'tmr_admin_ODC': 'TMR-24 Operational Data Collector',
    'tmr_admin_ODC_title': 'Transparency of processes – fulfillment of order deadlines – cost optimization.',
    'tmr_admin_ODC_1_1': 'Integration with existing accounting systems via api.',
    'tmr_admin_ODC_1_2': 'A module and an assortment of industrial Internet of Things for collecting various parameters (temperature of the environment and equipment, vibration, energy consumption, oxygen, illumination, door opening).',
    'tmr_admin_ODC_1_3': 'Mobile application "Staff workload" and "In-house document flow".',
    'tmr_admin_ODC_1_4': 'Chatbots for communication interaction.',
    'tmr_admin_ODC_texst_1': 'Our equipment and application solutions for the collection of operational data, free your employees from routine work, ensure the reliability of the collected data by collecting data 24 hours a day, 7 days a week.',
    'mobile_applications': 'Mobile applications',
    'mobile_applications_1': 'Provide rapid data exchange, reduce downtime, identify the talents of your employees, optimize business processes:',
    'staff_workload': 'Staff workload',
    'house_document_flow': 'In-house document flow',
    'data_collection_system': 'Data collection system',
    'data_collection_system_1': 'Implements the process of converting signals from the outside world into a digital domain for display, storage and analysis:',
    'sensors': 'Sensors',
    'signal_converters': 'Signal converters',
    'integration_modules': 'System and product integration modules',
    'integration_modules_1': 'Combine specialized products into a corporate database, accelerate the decision-making process.',
    'accounting_systems': 'With accounting systems',
    'industrial_equipment': 'With industrial equipment',
    'get_detailed_advice': 'Get detailed advice',
    'digitalization_enterprise': 'Digitalization of the enterprise',
    'digitalization_enterprise_1': 'Digitalization includes not so much CRM, ERP, MES and other process structuring systems, as a system of "transparency" of all production and trade chains with their optimization.',
    'ma_staff_workload': 'Mobile application "Staff workload"',
    'ma_staff_workload_1': 'Survey of the enterprise for drawing up a plan for digitalization of the organization',
    'ma_staff_workload_2': 'or',
    'ma_staff_workload_3': 'Operational data acquisition in "real time" mode on the involvement of personnel in the projects and processes of the enterprise, on the relationships of the organization, on the actual workload and availability of personnel.',





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
    'admin_monitor': 'Монитор администратора',
    'personal_dashboard': 'Панель сотрудника',
    'admin_dashboard': 'Панель администратора',
    'documents_detail': 'Детализазия пользователя',
    'admin_documents_detail': 'Детализазия администратора',
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
    'to_together': 'к совершенству вместе.',
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
    'list_users_title': 'Выберите сотрудников для формирования  отчета.',
    'list_users_available': 'Список доступных пользователю шаблонов',
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
    'user': 'Пользователь',
    '0': ' 0 ',
    '1_seconds': '1 секунда',
    '2_seconds': '2 секунды',
    '3_seconds': '3 секунды',
    '5_seconds': '5 секунд',
    '10_seconds': '10 секунд',
    '15_seconds': '15 секунд',
    '20_seconds': '20 секунд',
    '25_seconds': '25 секунд',
    '30_seconds': '30 секунд',
    '35_seconds': '35 секунд',
    '40_seconds': '40 секунд',
    '45_seconds': '45 секунд',
    '50_seconds': '50 секунд',
    '55_seconds': '55 секунд',
    '1_minutes': '1 минута',
    '3_minutes': '3 минуты',
    '5_minutes': '5 минут',
    '10_minutes': '10 минут',
    '15_minutes': '15 минут',
    'capture_event_click': 'Захват события по щелчку мыши',
    'capture_event_click_interval_foto': 'Интервал между событиями фотосъемки',
    'capture_event_click_interval_GEO': 'Интервал между событиями фиксации геолокации',
    'camera_smartphone': 'Камера смарфона',
    'camera_ip': 'Внешняя IP-камера',
    'option_1': 'Опция 1',
    'option_2': 'Опция 2',
    'option_3': 'Опция 3',
    'option_4': 'Опция 4',
    'option_5': 'Опция 5',
    'option_6': 'Опция 6',
    'option_7': 'Опция 7',
    'option_8': 'Опция 8',
    'list_notes_title': 'Список заметок',
    'list_notes_open': 'Список открытых заметок',
    'note_1': 'Заметка 1',
    'note_2': 'Заметка 2',
    'note_3': 'Заметка 3',
    'note_4': 'Заметка 4',
    'note_5': 'Заметка 5',
    'note_6': 'Заметка 6',
    'note_7': 'Заметка 7',
    'note_8': 'Заметка 8',
    'note_9': 'Заметка 9',
    'note_10': 'Заметка 10',
    'list_traffic_title': 'Каналы привлечения трафика',
    'channel_1': 'Канал 1',
    'channel_2': 'Канал 2',
    'channel_3': 'Канал 3',
    'channel_4': 'Канал 4',
    'channel_5': 'Канал 5',
    'channel_6': 'Канал 6',
    'channel_7': 'Канал 7',
    'channel_8': 'Канал 8',
    'channel_9': 'Канал 9',
    'channel_10': 'Канал 10',
    'parent': 'Родитель',
    'parent_doc': 'Заголовок родительского документа',
    'time_creation': 'Время создания',
    'select_management_positions': 'Выберите источник руководящих должностей.',
    'organization_owner': 'Владелец организации',
    'manager_organization': 'Руководитель Организации',
    'manager_subdivision': 'Руководитель Подразделения',
    'manager_position': 'Руководитель Должности',
    'data_doc_start': 'Дата и время начала',
    'data_doc_end': 'Дата и время окончания',
    'data_elementary': 'Начальная дата',
    'data_expiration': 'Конечная дата',
    'shift_number': 'Номер смены',
    'shift_employees': 'Сотрудников в смену',
    'shift_duration': 'Продолжительность смены',
    'current_employment_employees': 'Текущая занятость сотрудников',
    'personal_change': 'Личные изменения',
    'current_event': 'Текущее событие',
    'list_own_subdivision': 'Список подразделений, должностей и сотрудников',
    'list_own_organizations': 'Список собственных организаций',
    'list_change_user': 'Список смен',
    'detailing_selected_shift': 'Список событий выбранной смены',
    'event_duration': 'Продолжительность события',
    'event_name': 'Наименование события',
    'event_information': 'Содержание события',
    'event_detailed': 'Подробная информация о событии',
    'event_start': 'Начало события',
    'event_end': 'Окончание события',
    'event_descriptio_text': 'Текст описания события',
    'event_control_button': 'Кнопка управления событиями',
    'chart_bar': 'Столбчатая диаграмма',
    'chart_doughnut': 'Круговая диаграмма',
    'analysis_interval': 'Интервал анализа',
    'analysis_comparison': 'Интервал сравнения',
    'analysis_traffic': 'Аналитика источников трафика',
    'use_comparison': 'Используйте сравнение',
    'analytics_free_sales_consultant': 'Аналитика "Бесплатный консультант по продажам"',
    'traffic_name': 'Наименование ',
    'quantity': 'Количество',
    'progress': 'Прогресс',
    'result_table': 'Таблица результатов',
    'result': 'Результат',
    'time_money_result': 'Время. Деньги. Результат.',
    'tmr_admin': 'TMR-24 WEB администратор',
    'tmr_admin_title': 'Монитор вовлеченности Вашей команды в работу, выявления талантов сотрудников.',
    'tmr_admin_dashboard': 'Администрирование приложения.',
    'tmr_admin_metrics': 'Ключевые показатели в режиме реального времени.',
    'tmr_admin_metrics_online': 'Отображение загруженности персонала в режиме реального времени.',
    'tmr_admin_tool': 'Инструмент для непосредственного взаимодействия с командой.',
    'tmr_admin_texst_1': 'Управление персоналом интегрируется со стратегией управления товарооборотом и товарно-материальными запасами, развитием материально-технической базы и финансовым развитием предприятия.',
    'tmr_admin_texst_2': 'Основной целью управления численностью и составом персонала является оптимизация затрат человеческого труда для выполнения основных видов работ, связанных с деятельностью предприятия, и обеспечение заполнения необходимых рабочих мест сотрудниками соответствующих профессий, специальностей и уровней квалификации. Реализация этой функции управления персоналом в наибольшей степени связана с общей стратегией управления, поскольку трудовой потенциал формируется на предприятии и будет обеспечивать реализацию всех стратегических целей и направлений его деятельности.',
    'tmr_admin_texst_3': 'Более подробная информация по ссылке',
    'tmr_client': 'TMR-24 клиент',
    'tmr_client_title': 'Мобильное приложение, направлено на выявление эффективных навыков у сотрудников и организацию гармоничного движения команды к поставленным целям.',
    'tmr_client_registrar': 'Панель регистрации занятости в процессах персонала.',
    'tmr_client_dashboard': 'Панель по работе с проектами и задачами.',
    'tmr_client_messenger': 'Панель регистрации начала и окончание рабочей смены.',
    'tmr_client_plan': 'Диаграмма вовлеченности персонала.',
    'tmr_client_personal': 'Инструменты создания заметок: текст, список, фото, аудио, локация.',
    'tmr_client_text_2': 'В современном мире невозможно обойтись без мобильных устройств. Сейчас у каждого человека есть данные гаджеты, иногда даже не один. Именно поэтому мобильное приложение это быстрый и удобный способ сбора данных.',
    'tmr_client_text_3': 'Мы- основной инструмент для работы с персоналом. Данное приложение осуществляет сбор данных и выявления талантов сотрудников. Вся эта совокупность помогает команде наиболее эффективно выполнять поставленные задачи, видеть свое развитие, а следовательно и развитие предприятия.
Данная стратегия делает жизнь предприятия комфортнее и прозрачнее.',
    'new_here': 'Новенький здесь?',
    'new_here_title': 'Зарегистрироваться очень просто. Это займет всего несколько шагов.',
    'registration': 'Регистрация',
    'recover_passwor': 'Восстановить пароль',
    'file_upload': 'Загрузка файла',
    'register_personal_text_1': 'Заполните свои личные данные!',
    'register_personal_text_2': 'Пожалуйста, предоставьте свою личную информацию для -',
    'to_write': 'ЗАПИСАТЬ',
    'users_name': 'ФИО',
    'list_own_subdivision_interval_shift': 'Интервал дат для отображения в таблице: "Список смен"',
    'select_organization': 'Выбрать организацию.',
    'select_organization_title': 'Выберите организацию для формирования  отчета.',
    'chart_gantt': 'Диаграмма Ганта',
    'data_on': 'На дату:',
    'start_shift': 'Начало смены',
    'active_button': 'Активная кнопка',
    'timeStart_active_button': 'Начало события',
    'Products': 'Продукт',
    'Virtual_Assistant_Manager': 'Виртуальный Помощник Руководителя',
    'Operational_Data_Collector': 'Сборщик Оперативных Данных',
    'tmr_admin_VAM': 'TMR-24 Виртуальный Помощник Руководителя',
    'tmr_admin_VAM_title': 'Делегируйте рутину Виртуальному Помощнику Руководителя.',
    'tmr_admin_VAM_1_1': 'Поддержка оперативного управления.',
    'tmr_admin_VAM_1_2': 'Представляет регулярные отчеты и извещает о сбое в случае отклонения от заданных параметров.',
    'tmr_admin_VAM_1_3': 'Контролирует получение данных.',
    'tmr_admin_VAM_1_4': 'Проверяет достоверность полученных данных.',
    'tmr_admin_VAM_1_5': 'Помогает сформулировать задачи и точки контроля на основе лучших практик.',
    'tmr_admin_VAM_1_6': 'Анализирует данные в рамках поставленной задачи.',
    'tmr_admin_VAM_1_7': 'Может изменять критерии задачи по желанию клиента.',
    'tmr_admin_VAM_texst_1': 'Мы предлагаем не «календарь напоминай», а обучаемый виртуальный помощник руководителя, который по запросу или расписанию, может представлять отчеты,  осуществлять контроль запущенных процессов для достижения конкретных целей организации и в случае отклонения от заданных параметров извещать о сбое.',
    'order_specialist_consultation': 'Заказать консультацию специалиста',
    'telephone': 'Номер телефона',
    'modal_order_specialist_consultation_title_1': 'Консультант перезвонит Вам!',
    'modal_order_specialist_consultation_title_2': 'Заполните форму и укажите время в которое связаться с Вами.',
    'send': 'Отправить',
    'tmr_admin_ODC': 'TMR-24 Сборщик Оперативных Данных',
    'tmr_admin_ODC_title': 'Прозрачность процессов – выполнение сроков заказов – оптимизация себестоимости.',
    'tmr_admin_ODC_1_1': 'Интеграция с существующими учетными системами по API.',
    'tmr_admin_ODC_1_2': 'Модуль и ассортимент индустриальных интернет вещей для сбора разнообразных параметров (температура среды и оборудования, вибрации, потребления энергии, кислорода, освещенности, открытия дверей и т.д.).',
    'tmr_admin_ODC_1_3': 'Мобильное приложение «Загруженность персонала» и «Внутрицеховой документооборот».',
    'tmr_admin_ODC_1_4': 'Чат боты для коммуникационного взаимодействия.',
    'tmr_admin_ODC_texst_1': 'Наше оборудование и прикладные решения для сбора оперативных данных, освобождают Ваших сотрудников от рутинной работы, обеспечивают достоверность собираемых данных, осуществляя сбор данных 24 часа в сутки, 7 дней в неделю.',
    'mobile_applications': 'Мобильные приложения',
    'mobile_applications_1': 'Обеспечивают оперативный обмен данными, сокращают время «простоя», выявляют таланты Ваших сотрудников, оптимизируют бизнес процессы:',
    'staff_workload': 'Загруженность персонала',
    'house_document_flow': 'Внутрицеховой документооборот',
    'data_collection_system': 'Система сбора данных',
    'data_collection_system_1': 'Реализует процесс преобразования сигналов из внешнего мира в цифровую область для отображения, хранения и анализа:',
    'sensors': 'Датчики',
    'signal_converters': 'Преобразователи сигналов',
    'integration_modules': 'Модули интеграции систем и продуктов',
    'integration_modules_1': 'Объединяют специализированные продукты в корпоративную базу данных, ускоряют процесс принятия решений.',
    'accounting_systems': 'C учетными системами',
    'industrial_equipment': 'C промышленным оборудованием',
    'get_detailed_advice': 'Получить подробную консультацию',
    'digitalization_enterprise': 'Цифровизация предприятия',
    'digitalization_enterprise_1': 'Цифровизация включает в себя не столько CRM, ERP, MES и прочие системы структурирования процессов, сколько систему "прозрачности" всех производственных и торговых цепочек с их оптимизацией.',
    'ma_staff_workload': 'Мобильное приложение "Загруженность персонала"',
    'ma_staff_workload_1': 'Обследование предприятия для составления плана цифровизации организации',
    'ma_staff_workload_2': 'или',
    'ma_staff_workload_3': 'Оперативное получение данных в режиме «реального времени» о вовлеченности персонала в проекты и процессы предприятия, о взаимосвязях организации,  о фактической загруженности и доступности персонала. ',




    'search_projects': 'Поиск',
  }
};
