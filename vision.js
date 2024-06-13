
on('chat:message', function(message) {
    if (message.type == "api" && message.content.toLowerCase() == "!h") {
        sendChat("API", "<b>Help - List of Commands and Functions</b>" +
                 "<br/>!v - Toggle Night Vision (Limited Field)" +
                 "<br/>!f - Toggle Flashlight" +
                 "<br/>!s - Toggle Spray" +
                 "<br/>!o - Toggle Night 360 Vision" +
                 "<br/>!h - Show this help!");
    }
});


on('chat:message', function(message) {
    if (message.type == "api" && message.content.toLowerCase() == "!v") {
        _.each(message.selected, function(obj) {
            let token = getObj("graphic", obj._id);
            if(token) {
                let hasNightVision = token.get("has_night_vision");
                
                if(!hasNightVision) {
                    token.set({
                        has_night_vision: true,
                        night_vision_distance: 120,
                        night_vision_tint: "#548443",
                        night_vision_effect: 'dimming',
                        has_limit_field_of_night_vision: true,
                        limit_field_of_night_vision_total: 100,
                        limit_field_of_night_vision_center: 0,
                        has_limit_field_of_vision: true,
                        limit_field_of_vision_total: 100,
                        limit_field_of_vision_center: 0,
                    });
                    sendChat("API", "/w gm Night vision turned on for token id " + obj._id);
                } else {
                    token.set({
                        has_night_vision: false,
                        has_limit_field_of_vision: true,
                        limit_field_of_vision_total: 140
                    });
                    sendChat("API", "/w gm Night vision turned off for token id " + obj._id);
                }
            }
        });
    }
});

on('chat:message', function(message) {
    if (message.type == "api" && message.content.toLowerCase() == "!f") {
        _.each(message.selected, function(obj) {
            let token = getObj("graphic", obj._id);
            if(token) {
                let currentSettings = {
                    emits_bright_light: token.get("emits_bright_light"),
                    bright_light_distance: token.get("bright_light_distance"),
                };
                
                let isFlashlightOn = currentSettings.emits_bright_light && currentSettings.bright_light_distance == 3;

                if(!isFlashlightOn) {
                    token.set({
                        has_bright_light_vision: true,
                        emits_bright_light: true,
                        bright_light_distance: 3,
                        emits_low_light: true,
                        low_light_distance: 60, 
                        has_directional_dim_light: true,
                        directional_dim_light_total: 45,
                        dim_light_opacity: 0.2,
                        lightColor: 'transparent'
                    });
                    sendChat("API", "/w gm Flashlight turned on for token id " + obj._id);
                } else {
                    token.set({
                        emits_bright_light: false,
                        emits_low_light: false,
                        has_directional_bright_light: false,
                        has_directional_dim_light: false
                    });
                    sendChat("API", "/w gm Flashlight turned off for token id " + obj._id);
                }
            }
        });
    }
});

on('chat:message', function(message) {
    if (message.type == "api" && message.content.toLowerCase() == "!s") {
        _.each(message.selected, function(obj) {
            let token = getObj("graphic", obj._id);
            if(token) {
                let currentSettings = {
                    emits_bright_light: token.get("emits_bright_light"),
                    bright_light_distance: token.get("bright_light_distance"),
                };

                let isSprayOn = currentSettings.emits_bright_light && currentSettings.bright_light_distance == 20;

                if(!isSprayOn) {
                    token.set({
                        has_bright_light_vision: true,
                        emits_bright_light: true,
                        bright_light_distance: 20,
                        lightColor: '#aa4203',
                        has_directional_bright_light: true,
                        directional_bright_light_total: 30,
                        emits_low_light: false,
                    });
                    sendChat("API", "/w gm Spray turned on for token id " + obj._id);
                } else {
                    token.set({
                        emits_bright_light: false,
                        emits_low_light: false,
                        has_directional_bright_light: false,
                        has_directional_dim_light: false
                    });
                    sendChat("API", "/w gm Spray turned off for token id " + obj._id);
                }
            }
        });
    }
});

on('chat:message', function(message) {
    if (message.type == "api" && message.content.toLowerCase() == "!o") {
        _.each(message.selected, function(obj) {
            let token = getObj("graphic", obj._id);
            if(token) {
                let hasNightVision = token.get("has_night_vision");
                
                if(!hasNightVision) {
                    token.set({
                        has_night_vision: true,
                        night_vision_distance: 40,
                        night_vision_tint: "#548443",
                        night_vision_effect: 'dimming',
                        has_limit_field_of_night_vision: false,
                        has_limit_field_of_vision: true,
                        limit_field_of_vision_total: 140,
                        limit_field_of_vision_center: 0
                    });
                    sendChat("API", "/w gm Night vision turned on for token id " + obj._id);
                } else {
                    token.set({
                        has_night_vision: false,
                        has_limit_field_of_vision: true,
                        limit_field_of_vision_total: 140,
                        limit_field_of_vision_center: 0
                    });
                    sendChat("API", "/w gm Night vision turned off for token id " + obj._id);
                }
            }
        });
    }
});
