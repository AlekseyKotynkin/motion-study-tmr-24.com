package com.TMR24.MotionStudy;

import java.util.Map;

public class PositionSettingObjectMap {
    public int idButton;
    public String idSettingsButton;
    public Map <String, Object> dataSettingsButton;

    public PositionSettingObjectMap(int idButton, String idSettingsButton, Object dataSettingsButton) {
        this.idButton = idButton;
        this.idSettingsButton = idSettingsButton;
        this.dataSettingsButton = (Map < String, Object >) dataSettingsButton;
    }
}
