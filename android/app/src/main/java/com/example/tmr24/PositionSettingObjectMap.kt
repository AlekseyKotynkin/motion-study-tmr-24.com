package com.example.tmr24

import kotlin.collections.HashMap

class PositionSettingObjectMap(
    var idButton: Int,
    var idSettingsButton: String,
    //var dataSettingsButton: HashMap
    val dataSettingsButton: MutableMap<String, Any> = java.util.HashMap()

)