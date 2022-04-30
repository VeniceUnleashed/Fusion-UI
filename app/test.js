DispatchAction(actions.CHANGE_CONNECTION_STATUS, { status: connStatus.CONNECTING });
DispatchAction(actions.SET_PRODUCT_NAME, { name: "Venice Unleashed" });
DispatchAction(actions.SET_PRODUCT_CODE, { code: "VU" });
DispatchAction(actions.SET_VERSION_NUMBER, { version: "1.0" });
DispatchAction(actions.SET_VEXT_VERSION, { version: "1.2.3" });
DispatchAction(actions.SET_BUILD_NUMBER, { build: 12345 });
DispatchAction(actions.SET_MIN_SERVER_BUILD, { build: 12000 });
DispatchAction(actions.SET_AVAILABLE_XPACKS, { xpacks: [1, 2, 3, 4] });
DispatchAction(actions.SET_SETTINGS, { settings: {"resolutions":[["640x480 @ 59.94Hz","640x480 @ 60.00Hz","640x480 @ 75.00Hz","640x480 @ 99.90Hz","640x480 @ 99.90Hz","640x480 @ 120.00Hz","640x480 @ 120.00Hz","640x480 @ 144.00Hz","640x480 @ 144.00Hz","720x480 @ 59.94Hz","720x480 @ 60.00Hz","720x480 @ 99.90Hz","720x480 @ 99.90Hz","720x480 @ 120.00Hz","720x480 @ 120.00Hz","720x480 @ 144.00Hz","720x480 @ 144.00Hz","720x576 @ 60.32Hz","720x576 @ 60.32Hz","720x576 @ 75.00Hz","720x576 @ 75.00Hz","720x576 @ 99.90Hz","720x576 @ 99.90Hz","720x576 @ 120.00Hz","720x576 @ 120.00Hz","720x576 @ 144.00Hz","720x576 @ 144.00Hz","800x600 @ 60.32Hz","800x600 @ 75.00Hz","800x600 @ 99.90Hz","800x600 @ 99.90Hz","800x600 @ 120.00Hz","800x600 @ 120.00Hz","800x600 @ 144.00Hz","800x600 @ 144.00Hz","1024x768 @ 60.00Hz","1024x768 @ 75.03Hz","1024x768 @ 99.90Hz","1024x768 @ 99.90Hz","1024x768 @ 120.00Hz","1024x768 @ 120.00Hz","1024x768 @ 144.00Hz","1024x768 @ 144.00Hz","1152x864 @ 59.96Hz","1152x864 @ 99.90Hz","1152x864 @ 99.90Hz","1152x864 @ 120.00Hz","1152x864 @ 120.00Hz","1152x864 @ 144.00Hz","1152x864 @ 144.00Hz","1176x664 @ 50.00Hz","1176x664 @ 50.00Hz","1176x664 @ 59.94Hz","1176x664 @ 59.94Hz","1176x664 @ 60.00Hz","1176x664 @ 60.00Hz","1280x720 @ 50.00Hz","1280x720 @ 59.94Hz","1280x720 @ 60.00Hz","1280x720 @ 99.90Hz","1280x720 @ 99.90Hz","1280x720 @ 120.00Hz","1280x720 @ 120.00Hz","1280x720 @ 144.00Hz","1280x720 @ 144.00Hz","1280x768 @ 59.81Hz","1280x768 @ 59.81Hz","1280x768 @ 99.90Hz","1280x768 @ 99.90Hz","1280x768 @ 120.00Hz","1280x768 @ 120.00Hz","1280x768 @ 144.00Hz","1280x768 @ 144.00Hz","1280x800 @ 59.81Hz","1280x800 @ 99.90Hz","1280x800 @ 99.90Hz","1280x800 @ 120.00Hz","1280x800 @ 120.00Hz","1280x800 @ 144.00Hz","1280x800 @ 144.00Hz","1280x960 @ 60.02Hz","1280x960 @ 60.02Hz","1280x960 @ 75.03Hz","1280x960 @ 75.03Hz","1280x960 @ 99.90Hz","1280x960 @ 99.90Hz","1280x960 @ 120.00Hz","1280x960 @ 120.00Hz","1280x960 @ 144.00Hz","1280x960 @ 144.00Hz","1280x1024 @ 60.02Hz","1280x1024 @ 75.03Hz","1280x1024 @ 99.90Hz","1280x1024 @ 99.90Hz","1280x1024 @ 120.00Hz","1280x1024 @ 120.00Hz","1280x1024 @ 144.00Hz","1280x1024 @ 144.00Hz","1360x768 @ 60.00Hz","1360x768 @ 60.00Hz","1360x768 @ 99.90Hz","1360x768 @ 99.90Hz","1360x768 @ 120.00Hz","1360x768 @ 120.00Hz","1360x768 @ 144.00Hz","1360x768 @ 144.00Hz","1366x768 @ 60.00Hz","1366x768 @ 60.00Hz","1366x768 @ 99.90Hz","1366x768 @ 99.90Hz","1366x768 @ 120.00Hz","1366x768 @ 120.00Hz","1366x768 @ 144.00Hz","1366x768 @ 144.00Hz","1440x900 @ 60.00Hz","1440x900 @ 60.00Hz","1440x900 @ 99.90Hz","1440x900 @ 99.90Hz","1440x900 @ 120.00Hz","1440x900 @ 120.00Hz","1440x900 @ 144.00Hz","1440x900 @ 144.00Hz","1600x900 @ 60.00Hz","1600x900 @ 99.90Hz","1600x900 @ 99.90Hz","1600x900 @ 120.00Hz","1600x900 @ 120.00Hz","1600x900 @ 144.00Hz","1600x900 @ 144.00Hz","1600x1024 @ 59.95Hz","1600x1024 @ 59.95Hz","1600x1024 @ 99.90Hz","1600x1024 @ 99.90Hz","1600x1024 @ 120.00Hz","1600x1024 @ 120.00Hz","1600x1024 @ 144.00Hz","1600x1024 @ 144.00Hz","1600x1200 @ 59.95Hz","1600x1200 @ 59.95Hz","1600x1200 @ 99.90Hz","1600x1200 @ 99.90Hz","1600x1200 @ 120.00Hz","1600x1200 @ 120.00Hz","1600x1200 @ 144.00Hz","1600x1200 @ 144.00Hz","1680x1050 @ 59.95Hz","1680x1050 @ 99.90Hz","1680x1050 @ 99.90Hz","1680x1050 @ 120.00Hz","1680x1050 @ 120.00Hz","1680x1050 @ 144.00Hz","1680x1050 @ 144.00Hz","1920x1080 @ 50.00Hz","1920x1080 @ 59.94Hz","1920x1080 @ 60.00Hz","1920x1080 @ 74.91Hz","1920x1080 @ 99.90Hz","1920x1080 @ 99.90Hz","1920x1080 @ 120.00Hz","1920x1080 @ 120.00Hz","1920x1080 @ 144.00Hz","1920x1080 @ 144.00Hz","1920x1200 @ 59.95Hz","1920x1200 @ 59.95Hz","1920x1200 @ 99.90Hz","1920x1200 @ 99.90Hz","1920x1200 @ 120.00Hz","1920x1200 @ 120.00Hz","1920x1200 @ 144.00Hz","1920x1200 @ 144.00Hz","1920x1440 @ 59.95Hz","1920x1440 @ 59.95Hz","1920x1440 @ 99.90Hz","1920x1440 @ 99.90Hz","1920x1440 @ 120.00Hz","1920x1440 @ 120.00Hz","1920x1440 @ 144.00Hz","1920x1440 @ 144.00Hz","2560x1440 @ 59.95Hz","2560x1440 @ 99.90Hz","2560x1440 @ 120.00Hz","2560x1440 @ 144.00Hz"],["640x480 @ 60.00Hz","720x480 @ 60.32Hz","720x480 @ 60.32Hz","720x576 @ 60.32Hz","720x576 @ 60.32Hz","800x600 @ 60.32Hz","1024x768 @ 60.00Hz","1152x864 @ 60.00Hz","1152x864 @ 60.00Hz","1280x720 @ 60.00Hz","1280x720 @ 60.00Hz","1280x768 @ 60.00Hz","1280x768 @ 60.00Hz","1280x800 @ 60.00Hz","1280x800 @ 60.00Hz","1280x960 @ 60.00Hz","1280x1024 @ 60.02Hz","1360x768 @ 60.00Hz","1360x768 @ 60.00Hz","1366x768 @ 60.00Hz","1366x768 @ 60.00Hz","1440x900 @ 60.00Hz","1440x900 @ 60.00Hz","1600x900 @ 60.00Hz","1600x900 @ 60.00Hz","1600x1024 @ 60.00Hz","1600x1024 @ 60.00Hz","1600x1200 @ 60.00Hz","1680x1050 @ 59.95Hz","1920x1080 @ 60.00Hz","1920x1200 @ 59.95Hz"],["640x480 @ 59.94Hz","640x480 @ 60.00Hz","640x480 @ 75.00Hz","720x480 @ 59.94Hz","720x480 @ 60.00Hz","720x576 @ 50.00Hz","800x600 @ 60.32Hz","800x600 @ 75.00Hz","1024x768 @ 60.00Hz","1024x768 @ 75.03Hz","1152x864 @ 75.00Hz","1176x664 @ 50.00Hz","1176x664 @ 50.00Hz","1176x664 @ 59.94Hz","1176x664 @ 59.94Hz","1176x664 @ 60.00Hz","1176x664 @ 60.00Hz","1280x720 @ 50.00Hz","1280x720 @ 59.94Hz","1280x720 @ 60.00Hz","1280x768 @ 60.02Hz","1280x768 @ 60.02Hz","1280x768 @ 75.03Hz","1280x768 @ 75.03Hz","1280x800 @ 60.02Hz","1280x800 @ 60.02Hz","1280x800 @ 75.03Hz","1280x800 @ 75.03Hz","1280x960 @ 60.02Hz","1280x960 @ 60.02Hz","1280x960 @ 75.03Hz","1280x960 @ 75.03Hz","1280x1024 @ 60.02Hz","1280x1024 @ 75.03Hz","1360x768 @ 23.98Hz","1360x768 @ 23.98Hz","1360x768 @ 24.00Hz","1360x768 @ 24.00Hz","1360x768 @ 25.00Hz","1360x768 @ 25.00Hz","1360x768 @ 29.97Hz","1360x768 @ 29.97Hz","1360x768 @ 30.00Hz","1360x768 @ 30.00Hz","1360x768 @ 50.00Hz","1360x768 @ 50.00Hz","1360x768 @ 59.94Hz","1360x768 @ 59.94Hz","1360x768 @ 60.00Hz","1360x768 @ 60.00Hz","1366x768 @ 23.98Hz","1366x768 @ 23.98Hz","1366x768 @ 24.00Hz","1366x768 @ 24.00Hz","1366x768 @ 25.00Hz","1366x768 @ 25.00Hz","1366x768 @ 29.97Hz","1366x768 @ 29.97Hz","1366x768 @ 30.00Hz","1366x768 @ 30.00Hz","1366x768 @ 50.00Hz","1366x768 @ 50.00Hz","1366x768 @ 59.94Hz","1366x768 @ 59.94Hz","1366x768 @ 60.00Hz","1366x768 @ 60.00Hz","1440x900 @ 23.98Hz","1440x900 @ 23.98Hz","1440x900 @ 24.00Hz","1440x900 @ 24.00Hz","1440x900 @ 25.00Hz","1440x900 @ 25.00Hz","1440x900 @ 29.97Hz","1440x900 @ 29.97Hz","1440x900 @ 30.00Hz","1440x900 @ 30.00Hz","1440x900 @ 50.00Hz","1440x900 @ 50.00Hz","1440x900 @ 59.94Hz","1440x900 @ 59.94Hz","1440x900 @ 60.00Hz","1440x900 @ 60.00Hz","1600x900 @ 23.98Hz","1600x900 @ 23.98Hz","1600x900 @ 24.00Hz","1600x900 @ 24.00Hz","1600x900 @ 25.00Hz","1600x900 @ 25.00Hz","1600x900 @ 29.97Hz","1600x900 @ 29.97Hz","1600x900 @ 30.00Hz","1600x900 @ 30.00Hz","1600x900 @ 50.00Hz","1600x900 @ 50.00Hz","1600x900 @ 59.94Hz","1600x900 @ 59.94Hz","1600x900 @ 60.00Hz","1600x900 @ 60.00Hz","1600x1024 @ 23.98Hz","1600x1024 @ 23.98Hz","1600x1024 @ 24.00Hz","1600x1024 @ 24.00Hz","1600x1024 @ 25.00Hz","1600x1024 @ 25.00Hz","1600x1024 @ 29.97Hz","1600x1024 @ 29.97Hz","1600x1024 @ 30.00Hz","1600x1024 @ 30.00Hz","1600x1024 @ 50.00Hz","1600x1024 @ 50.00Hz","1600x1024 @ 59.94Hz","1600x1024 @ 59.94Hz","1600x1024 @ 60.00Hz","1600x1024 @ 60.00Hz","1600x1200 @ 60.00Hz","1680x1050 @ 23.98Hz","1680x1050 @ 23.98Hz","1680x1050 @ 24.00Hz","1680x1050 @ 24.00Hz","1680x1050 @ 25.00Hz","1680x1050 @ 25.00Hz","1680x1050 @ 29.97Hz","1680x1050 @ 29.97Hz","1680x1050 @ 30.00Hz","1680x1050 @ 30.00Hz","1680x1050 @ 50.00Hz","1680x1050 @ 50.00Hz","1680x1050 @ 59.94Hz","1680x1050 @ 59.94Hz","1680x1050 @ 60.00Hz","1680x1050 @ 60.00Hz","1920x1080 @ 23.98Hz","1920x1080 @ 24.00Hz","1920x1080 @ 25.00Hz","1920x1080 @ 29.97Hz","1920x1080 @ 30.00Hz","1920x1080 @ 50.00Hz","1920x1080 @ 59.94Hz","1920x1080 @ 60.00Hz","1920x1200 @ 59.95Hz"]],"selectedResolution":181,"screens":3,"selectedScreen":0,"fullscreen":false,"masterVolume":0.6162790060043335,"musicVolume":0.699999988079071,"dialogueVolume":0.699999988079071}});
DispatchAction(actions.SET_INITIALIZED);

DispatchAction(actions.CHANGE_CONNECTION_STATUS, { status: connStatus.CONNECTED });

DispatchAction(actions.SET_USER_DATA, {
    data: {
        username: "NoFaTe",
        email: "nofate@example.com",
        guid: "ABCDEFG",
        legacy_id: 123,
    }
});

DispatchAction(actions.CHANGE_LOGIN_STATUS, { status: loginStatus.LOGGED_IN });
DispatchAction(actions.CHANGE_ORIGIN_LINK_STATUS, { status: originLinkStatus.LINK_SUCCESSFUL });

DispatchAction(actions.SET_USER_PLAYERS, {
    players: [
        {
            name: "NoFaTe",
            guid: "ABCDEFGHIJ",
            legacy_id: 1234,
            last_login: "2019"
        }
    ]
});

DispatchAction(actions.SET_PLAYER_DATA, {
    player: {
        name: "NoFaTe",
        guid: "ABCDEFGHIJ",
        legacy_id: 1234,
        last_login: "2019"
    }
});

DispatchAction(actions.CHANGE_PLAYER_LOGIN_STATUS, { status: playerLoginStatus.LOGGED_IN });

DispatchAction(actions.SET_SERVERS, {
    servers: [
        {
            guid: "B",
            name: "Noshar Canals TDM 24/7 Cancer",
            players: 1,
            maxplayers: 10,
            public: true,
            passworded: false,
            ping: "1",
            variables: {
                maxplayers: 32,
                mapname: "Levels/XP2_Factory/XP2_Factory2",
                gamemode: "ConquestLarge0",
                frequency: "high120",
                maxspectators: 12,
                spectators: "0",
                buildno: "11000",
                min_buildno: "11000",
                vext_req: "1.0.0",
                tags: "tag,rp,reality-mod",
            }
        },
        {
            guid: "A",
            name: "zh1nt0's modding declination research center qpjy 21s kjamsd jklhasdhl kjasdlkhj asdl khas dhlkjashdlk j",
            players: 0,
            maxplayers: 10,
            public: true,
            passworded: false,
            ping: "5",
            variables: {
                maxplayers: 10,
                mapname: "Levels/XP1_001/XP1_001",
                gamemode: "ConquestLarge0",
                frequency: "high120",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.0.0",
                fps: "120",
            }
        },
        {
            guid: "C",
            name: "John's Great Server",
            players: 64,
            maxplayers: 64,
            public: true,
            passworded: false,
            ping: "10",
            variables: {
                maxplayers: 64,
                mapname: "Levels/XP5_004/XP5_004",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "13000",
                min_buildno: "13000",
                vext_req: "1.0.0",
            }
        },
        {
            guid: "D",
            name: "Atakama Desert 69",
            players: 10,
            maxplayers: 10,
            public: true,
            passworded: true,
            ping: "5",
            variables: {
                maxplayers: 10,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "high60",
                maxspectators: 12,
                spectators: "0",
                buildno: "13000",
                min_buildno: "13000",
                vext_req: "1.0.0",
                tags: "ttt",
            }
        },
        {
            guid: "E",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: "0",
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 0,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
                tags: "tag,rp,reality-mod",
                banner: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Random_Turtle.jpg"
            }
        },
        {
            guid: "F",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: false,
            ping: "123",
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
                tags: "tag,rp,reality-mod,reality-mod,reality-mod,reality-mod",
            }
        },
        {
            guid: "G",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: "-",
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "H",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: "-",
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "I",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: "55",
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "J",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: "999",
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "K",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "L",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "M",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "Na",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "N-",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "N0",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "N8",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "N4",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "N5",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
        {
            guid: "N2",
            name: "NoFaTe's BDSM Dungeon",
            players: 12,
            maxplayers: 128,
            public: true,
            passworded: true,
            ping: 123,
            variables: {
                maxplayers: 128,
                mapname: "Levels/XP3_Desert/XP3_Desert",
                gamemode: "ConquestLarge0",
                frequency: "reg",
                maxspectators: 12,
                spectators: "0",
                buildno: "12345",
                min_buildno: "12345",
                vext_req: "1.2.3",
            }
        },
    ]
});

/*setTimeout(() => {
    DispatchAction(actions.SET_CONSOLE_ACTIVE, { active: true });

    for (let i = 0; i < 100; ++i) {
        DispatchAction(actions.ADD_CONSOLE_TEXT, { text: 'Lorem ipsum dolor sit amet, `consectetur` adipiscing elit. *Nulla* ultrices nulla id lectus congue euismod. Quisque ac arcu eget nisi faucibus **viverra** vel si' + Math.random() });
    }
}, 1000);*/

setTimeout(() => {
    hashHistory.push('/server-browser');
}, 250);

setInterval(() => {
    DispatchAction(actions.SET_VOIP_DATA, { data: { volume: Math.random() } })
}, 100);

/*setTimeout(() => {
    DispatchAction(actions.CHANGE_INGAME, { ingame: true });
    DispatchAction(actions.SHOW_SETTINGS_POPUP, { show: true });
}, 250);*/

//window.GlobalNotice({ notice: 'Wawawwiwa going back to town on the big ass scooter with capri sun.' });