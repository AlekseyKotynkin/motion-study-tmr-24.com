package com.example.tmr24.data.model

/**
 * Data class that captures user information for logged in users retrieved from LoginRepository
 * Класс данных, который собирает информацию о пользователях для вошедших в систему пользователей, полученную из хранилища входа
 */
data class LoggedInUser(
    val userId: String,
    val displayName: String
)