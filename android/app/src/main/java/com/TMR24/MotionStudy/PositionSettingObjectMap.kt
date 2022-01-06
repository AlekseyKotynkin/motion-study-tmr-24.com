package com.TMR24.MotionStudy

class PositionSettingObjectMap(
    var idButton: Int,
    var idSettingsButton: String,
    dataSettingsButton: Any?
) {
    @JvmField
    var dataSettingsButton: Map<String, Any>?

    init {
        this.dataSettingsButton = dataSettingsButton as Map<String, Any>?
    }
}