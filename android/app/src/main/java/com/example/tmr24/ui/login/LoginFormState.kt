package com.example.tmr24.ui.login

/**
 * Data validation state of the login form.
 * Состояние проверки данных формы входа в систему.
 */
data class LoginFormState (val usernameError: Int? = null,
                      val passwordError: Int? = null,
                      val isDataValid: Boolean = false)