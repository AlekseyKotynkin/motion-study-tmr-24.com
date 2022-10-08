package com.example.tmr24.ui.login

/**
 * User details post authentication that is exposed to the UI
 * Сведения о пользователе после аутентификации, которые доступны в пользовательском интерфейсе
 */
data class LoggedInUserView(
    val displayName: String
    //... other data fields that may be accessible to the UI
    //... другие поля данных, которые могут быть доступны для пользовательского интерфейса
)