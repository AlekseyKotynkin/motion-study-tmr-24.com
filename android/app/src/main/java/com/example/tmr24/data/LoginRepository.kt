package com.example.tmr24.data

import com.example.tmr24.data.model.LoggedInUser

/**
 * Class that requests authentication and user information from the remote data source and
 * maintains an in-memory cache of login status and user credentials information.
 * Класс, который запрашивает аутентификацию и информацию о пользователе из удаленного источника данных и
 * поддерживает кэш в памяти статуса входа и информации об учетных данных пользователя.
 */

class LoginRepository(val dataSource: LoginDataSource) {

    // in-memory cache of the loggedInUser object
    // кэш в памяти объекта loggedInUser / кэш в памяти объекта loggedInUser
    var user: LoggedInUser? = null
        private set

    val isLoggedIn: Boolean
        get() = user != null

    init {
        // If user credentials will be cached in local storage, it is recommended it be encrypted
        // Если учетные данные пользователя будут кэшироваться в локальном хранилище, рекомендуется их зашифровать
        // @see https://developer.android.com/training/articles/keystore
        user = null
    }

    fun logout() {
        user = null
        dataSource.logout()
    }

    fun login(username: String, password: String): Result<LoggedInUser> {
        // handle login
        // обрабатывать вход в систему
        val result = dataSource.login(username, password)

        if (result is Result.Success) {
            setLoggedInUser(result.data)
        }

        return result
    }

    private fun setLoggedInUser(loggedInUser: LoggedInUser) {
        this.user = loggedInUser
        // If user credentials will be cached in local storage, it is recommended it be encrypted
        // Если учетные данные пользователя будут кэшироваться в локальном хранилище, рекомендуется их зашифровать
        // @see https://developer.android.com/training/articles/keystore
    }
}