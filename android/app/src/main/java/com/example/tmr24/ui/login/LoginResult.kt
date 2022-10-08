package com.example.tmr24.ui.login

/**
 * Authentication result : success (user details) or error message.
 * Результат аутентификации: успех (сведения о пользователе) или сообщение об ошибке.
 */
data class LoginResult (
     val success:LoggedInUserView? = null,
     val error:Int? = null
)