package com.example.tmr24.data

import com.example.tmr24.data.model.LoggedInUser
import java.io.IOException

/**
 * Class that handles authentication w/ login credentials and retrieves user information.
 * * Класс, который обрабатывает аутентификацию с учетными данными для входа и извлекает информацию о пользователе.
 */
class LoginDataSource {


    fun login(username: String, password: String): Result<LoggedInUser> {
        try {
            // TODO: handle loggedInUser authentication
            //// ЗАДАЧА: обработать аутентификацию Пользователя, вошедшего в Систему
            val fakeUser = LoggedInUser(java.util.UUID.randomUUID().toString(), "Jane Doe")
            return Result.Success(fakeUser)
        } catch (e: Throwable) {
            return Result.Error(IOException("Error logging in", e))
        }
    }

    fun logout() {
        // TODO: revoke authentication
        // ЗАДАЧА: отменить аутентификацию
    }
}