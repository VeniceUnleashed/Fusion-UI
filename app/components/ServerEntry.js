import React, { Component } from 'react';
import * as ActionTypes from "../constants/ActionTypes";
import { connect } from 'react-redux'
import ServerPasswordPopup from "../popups/ServerPasswordPopup";
import ServerPerformancePopup from "../popups/ServerPerformancePopup";
import { getServerPlayers, getServerSpectators } from '../utils/servers';

class ServerEntry extends Component
{
    constructor(props)
    {
        super(props);

        this.hasClicked = false;
        this.clickTimeout = null;
    }

    _onClick = (e) =>
    {
        if (e)
            e.preventDefault();

        if (this.clickTimeout)
        {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        }

        if (this.hasClicked)
        {
            this.hasClicked = false;
            this._onJoin(e);
            return;
        }

        this.hasClicked = true;
        this.clickTimeout = setTimeout(() =>
        {
            this.clickTimeout = null;
            this.hasClicked = false;
        }, 350);

        if (this.props.onClick)
            this.props.onClick(this.props.server.guid);
    };

    _onJoin = (e) =>
    {
        if (e)
            e.preventDefault();

        if (ServerEntry.checkServerCompatibility(
            this.props.server,
            this.props.availableXPacks,
            this.props.minServerBuild,
            this.props.build,
            this.props.vextVersion
        ) !== null)
            return;

        let fps = null;

        if ('fps' in this.props.server.variables) {
            fps = parseInt(this.props.server.variables.fps, 10);

            if (isNaN(fps)) {
                fps = null;
            }
        }

        if ((this.props.server.variables.frequency === 'high60' && fps !== null && fps <= 66) ||
            (this.props.server.variables.frequency === 'high120' && fps !== null && fps <= 132) ||
            (this.props.server.variables.frequency === 'reg' && fps !== null && fps <= 33))
        {
            this.props.setPopup(<ServerPerformancePopup server={this.props.server} onJoin={this.props.onJoin} />);
            return;
        }

        if (this.props.server.passworded)
        {
            this.props.setPopup(<ServerPasswordPopup server={this.props.server} onJoin={this.props.onJoin} />);
            return;
        }

        if (this.props.onJoin)
            this.props.onJoin(this.props.server.guid);
    };

    _onAddRemoveFavorite = (e) =>
    {
        if (e)
            e.preventDefault();

        if (this.props.onAddRemoveFavorite)
            this.props.onAddRemoveFavorite(this.props.server, this.props.isFavorite);
    };

    _onSpectate = (e) =>
    {
        if (e)
            e.preventDefault();

        if (ServerEntry.checkServerCompatibility(
            this.props.server,
            this.props.availableXPacks,
            this.props.minServerBuild,
            this.props.build,
            this.props.vextVersion
        ) !== null)
            return;

        if (this.props.server.passworded)
        {
            this.props.setPopup(<ServerPasswordPopup server={this.props.server} onJoin={this.props.onSpectate} />);
            return;
        }

        if (this.props.onSpectate)
            this.props.onSpectate(this.props.server.guid);
    };

    render()
    {
        const server = this.props.server;

        let serverClassName = 'server-entry';

        if (this.props.expanded)
            serverClassName += ' expanded';

        if (this.props.isFavorite)
            serverClassName += ' favorite';

        const playerCount = getServerPlayersOnly(server);
        const spectatorCount = getServerSpectators(server);

        const compatibility = ServerEntry.checkServerCompatibility(
            this.props.server,
            this.props.availableXPacks,
            this.props.minServerBuild,
            this.props.build,
            this.props.vextVersion
        );

        const compatible = compatibility === null;

        if (!compatible)
            serverClassName += ' incompatible';

        const style = {};

        if (server.variables.banner && (server.variables.banner.startsWith('http://') || server.variables.banner.startsWith('https://')) && server.variables.banner.endsWith('.jpg'))
        {
            style.background = "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%,rgba(0,0,0,0.3) 65%,rgba(0,0,0,0.8) 100%), url(" + server.variables.banner + ") no-repeat top center";
            style.backgroundSize = '100% auto';
        }
        else if (ServerEntry.hasMapImage(server.variables.mapname))
        {
            style.background = "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%,rgba(0,0,0,0.3) 65%,rgba(0,0,0,0.8) 100%), url('/assets/img/maps/" + ServerEntry.getLevelName(server.variables.mapname) + ".png') no-repeat top center";
            style.backgroundSize = '100% auto';
        }

        let compatibilityNotice = null;

        if (!compatible)
            compatibilityNotice = <span className="compat-notice">{compatibility}</span>;

        let spectatorPlayerCount = null;
        let spectateButton = null;

        if (parseInt(server.variables.maxspectators, 10) > 0)
        {
            spectatorPlayerCount = <h4>{spectatorCount} / {server.variables.maxspectators}</h4>;
            spectateButton = <a href="#" onClick={this._onSpectate} className="btn border-btn spec-btn"><i className="material-icons">videocam</i> Spec</a>;
        }

        const serverIcons = [];

        if (server.passworded)
        {
            serverIcons.push(<span className="server-icon locked" key="locked"><i className="material-icons">lock</i></span>);
        }

        let fps = null;

        if ('fps' in server.variables) {
            fps = parseInt(server.variables.fps, 10);

            if (isNaN(fps)) {
                fps = null;
            }
        }

        if (server.variables.frequency === 'high60')
        {
            if (fps !== null && fps <= 66) {
                serverIcons.push(<span className="server-icon lag" key="lag"><i className="material-icons">hourglass_disabled</i></span>);

                if (compatibilityNotice === null) {
                    compatibilityNotice = <span className="compat-notice">This server is having performance issues. You might experience lag.</span>;
                }
            }

            serverIcons.push(<span className="server-icon freq" key="freq"><i className="material-icons">speed</i> 60Hz</span>);
        }
        else if (server.variables.frequency === 'high120')
        {
            if (fps !== null && fps <= 132) {
                serverIcons.push(<span className="server-icon lag" key="lag"><i className="material-icons">hourglass_disabled</i></span>);

                if (compatibilityNotice === null) {
                    compatibilityNotice = <span className="compat-notice lag"><i className="material-icons">hourglass_disabled</i> This server is having performance issues. You might experience lag.</span>;
                }
            }

            serverIcons.push(<span className="server-icon freq" key="freq"><i className="material-icons">speed</i> 120Hz</span>);
        }
        else
        {
            if (fps !== null && fps <= 33) {
                serverIcons.push(<span className="server-icon lag" key="lag"><i className="material-icons">hourglass_disabled</i></span>);

                if (compatibilityNotice === null) {
                    compatibilityNotice = <span className="compat-notice">This server has low fps. You might experience lag.</span>;
                }
            }
        }

        let serverTags = [];

        if (server.variables.tags && server.variables.tags.length > 0)
            serverTags = server.variables.tags.split(',');

        const tags = [];

        for (const tag of new Set(serverTags))
        {
            if (!/^[a-z0-9-]+$/.test(tag))
                continue;

            tags.push(<strong key={tag}>{tag}</strong>);
            tags.push(<span key={tag + 's'}>, </span>);
        }

        let serverInfo = [];
        let onlyTags = false;

        if (tags.length > 0)
        {
            tags.splice(tags.length - 1, 1);

            serverInfo.push(
                <h3 key="tags" className="tags"><i className="material-icons">local_offer</i>{tags}</h3>
            );

            onlyTags = serverIcons.length === 0;
            serverIcons.unshift(<span className="server-icon compact-tags" key="tags"><i className="material-icons">local_offer</i></span>);
        }

        let serverIconsClass = 'server-icons';

        if (serverIcons.length === 0) {
            serverIconsClass += ' empty';
        }

        if (onlyTags) {
            serverIconsClass += ' only-tags';
        }

        serverInfo.unshift(
            <h1 key="info"><div className={serverIconsClass}>{serverIcons}</div>{server.name}</h1>
        );

        let favoriteButtonClassName = 'favorite-btn';
        if (this.props.isFavorite) {
            favoriteButtonClassName += ' is-favorite';
        }

        return (
            <div className={serverClassName} style={style} onClick={this._onClick}>
                <div className="top-content">
                    <div className="column column-1">
                        {serverInfo}
                    </div>
                    <div className="column column-2">
                        <h3>{ServerEntry.getMapName(server.variables.mapname)}</h3>
                    </div>
                    <div className="column column-3">
                        <h3>{ServerEntry.getGamemodeName(server.variables.gamemode)}</h3>
                    </div>
                    <div className="column column-4">
                        <h3>{playerCount} / {server.variables.maxplayers}</h3>
                        {spectatorPlayerCount}
                    </div>
                    <div className="column column-5">
                        <span>{server.ping}</span>
                    </div>
                </div>
                <div className="bottom-content">
                    <div className="left-content">
                        {compatibilityNotice}
                    </div>
                    <div className="right-content">
                        <a href="#" onClick={this._onAddRemoveFavorite} className={favoriteButtonClassName}>
                            <i className="material-icons">{this.props.isFavorite ? "star" : "star_border"}</i>
                        </a>
                        {spectateButton}
                        <a href="#" onClick={this._onJoin} className="btn border-btn join-btn"><i className="material-icons">play_arrow</i> Join</a>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * This method checks for join compatibility with this server and
     * returns an appropriate error message or `null` if compatible.
     * @returns {string|null}
     */
    static checkServerCompatibility(server, availableXPacks, minServerBuild, build, vextVersion)
    {
        if (!ServerEntry.isMapAvailable(server, availableXPacks))
            return "This server is running a map you do not currently have installed.";

        if (!ServerEntry.areXPacksAvailable(server, availableXPacks))
            return "This server is using DLC content you do not currently have installed.";

        if (ServerEntry.isServerBuildOlder(server, minServerBuild))
            return "This server is running an outdated build of VU.";

        if (ServerEntry.isServerBuildNewer(server, build))
            return "This server is running a newer build of VU. You need to update your client to join.";

        if (!ServerEntry.isVextCompatible(server, vextVersion))
            return "This server is running mods incompatible with your current build of VU. You may need to update.";

        return null;
    }

    static isMapAvailable(server, availableXPacks)
    {
        // Try to extract the XPack from the map.
        const mapname = server.variables.mapname;

        if (!mapname.startsWith('Levels/XP'))
            return true;

        const xpack = parseInt(mapname.substr(9, 1));

        if (isNaN(xpack))
            return true;

        return availableXPacks.indexOf(xpack) !== -1;
    }

    static areXPacksAvailable(server, availableXPacks)
    {
        // Try to extract the XPack from the map.
        const xpacks = server.variables.xpacks;

        let xpackList = [];

        if (xpacks && xpacks.length > 0)
            xpackList = xpacks.split(',').map((val) => parseInt(val, 10));

        for (const xpack of xpackList)
        {
            if (isNaN(xpack))
                continue;

            if (availableXPacks.indexOf(xpack) === -1)
                return false;
        }

        return true;
    }

    static isServerBuildOlder(server, minServerBuild)
    {
        const minimumServerBuild = parseInt(minServerBuild, 10);
        const currentServerBuild = parseInt(server.variables.buildno, 10);

        return currentServerBuild < minimumServerBuild;
    }

    static isServerBuildNewer(server, build)
    {
        const currentBuild = parseInt(build, 10);
        const requiredServerBuild = parseInt(server.variables.min_buildno, 10);

        return currentBuild < requiredServerBuild;
    }

    static isVextCompatible(server, vextVersion)
    {
        const currentVextParts = vextVersion.split('.');
        const serverVextParts = server.variables.vext_req.split('.');

        let currentMajor = currentVextParts.length > 0 ? parseInt(currentVextParts[0], 10) : 1;
        let currentMinor = currentVextParts.length > 1 ? parseInt(currentVextParts[1], 10) : 0;
        let currentPatch = currentVextParts.length > 2 ? parseInt(currentVextParts[2], 10) : 0;

        let serverMajor = serverVextParts.length > 0 ? parseInt(serverVextParts[0], 10) : 1;
        let serverMinor = serverVextParts.length > 1 ? parseInt(serverVextParts[1], 10) : 0;
        let serverPatch = serverVextParts.length > 2 ? parseInt(serverVextParts[2], 10) : 0;

        if (isNaN(currentMajor))
            currentMajor = 1;

        if (isNaN(currentMinor))
            currentMinor = 0;

        if (isNaN(currentPatch))
            currentPatch = 0;

        if (isNaN(serverMajor))
            serverMajor = 1;

        if (isNaN(serverMinor))
            serverMinor = 0;

        if (isNaN(serverPatch))
            serverPatch = 0;

        if (currentMajor !== serverMajor)
            return false;

        if (currentMinor < serverMinor)
            return false;

        if (currentMinor === serverMinor && currentPatch < serverPatch)
            return false;

        return true;
    }

    static getMaps()
    {
        return [
            "Levels/MP_001/MP_001",
            "Levels/MP_003/MP_003",
            "Levels/MP_007/MP_007",
            "Levels/MP_011/MP_011",
            "Levels/MP_012/MP_012",
            "Levels/MP_013/MP_013",
            "Levels/MP_017/MP_017",
            "Levels/MP_018/MP_018",
            "Levels/MP_Subway/MP_Subway",
            "Levels/XP1_001/XP1_001",
            "Levels/XP1_002/XP1_002",
            "Levels/XP1_003/XP1_003",
            "Levels/XP1_004/XP1_004",
            "Levels/XP2_Factory/XP2_Factory",
            "Levels/XP2_Office/XP2_Office",
            "Levels/XP2_Palace/XP2_Palace",
            "Levels/XP2_Skybar/XP2_Skybar",
            "Levels/XP3_Desert/XP3_Desert",
            "Levels/XP3_Alborz/XP3_Alborz",
            "Levels/XP3_Shield/XP3_Shield",
            "Levels/XP3_Valley/XP3_Valley",
            "Levels/XP4_FD/XP4_FD",
            "Levels/XP4_Parl/XP4_Parl",
            "Levels/XP4_Quake/XP4_Quake",
            "Levels/XP4_Rubble/XP4_Rubble",
            "Levels/XP5_001/XP5_001",
            "Levels/XP5_002/XP5_002",
            "Levels/XP5_003/XP5_003",
            "Levels/XP5_004/XP5_004",
        ];
    }

    static getGamemodes()
    {
        return [
            'ConquestLarge0',
            'ConquestSmall0',
            'ConquestAssaultLarge0',
            'ConquestAssaultSmall0',
            'ConquestAssaultSmall1',
            'RushLarge0',
            'SquadRush0',
            'SquadDeathMatch0',
            'TeamDeathMatch0',
            'TeamDeathMatchC0',
            'CaptureTheFlag0',
            'AirSuperiority0',
            'GunMaster0',
            'Scavenger0',
            'TankSuperiority0',
            'Domination0',
        ];
    }

    static hasMapImage(map)
    {
        switch (map)
        {
            case "Levels/MP_001/MP_001":
            case "Levels/MP_003/MP_003":
            case "Levels/MP_007/MP_007":
            case "Levels/MP_011/MP_011":
            case "Levels/MP_012/MP_012":
            case "Levels/MP_013/MP_013":
            case "Levels/MP_017/MP_017":
            case "Levels/MP_018/MP_018":
            case "Levels/MP_Subway/MP_Subway":
            case "Levels/XP1_001/XP1_001":
            case "Levels/XP1_002/XP1_002":
            case "Levels/XP1_003/XP1_003":
            case "Levels/XP1_004/XP1_004":
            case "Levels/XP2_Factory/XP2_Factory":
            case "Levels/XP2_Office/XP2_Office":
            case "Levels/XP2_Palace/XP2_Palace":
            case "Levels/XP2_Skybar/XP2_Skybar":
            case "Levels/XP3_Desert/XP3_Desert":
            case "Levels/XP3_Alborz/XP3_Alborz":
            case "Levels/XP3_Shield/XP3_Shield":
            case "Levels/XP3_Valley/XP3_Valley":
            case "Levels/XP4_FD/XP4_FD":
            case "Levels/XP4_Parl/XP4_Parl":
            case "Levels/XP4_Quake/XP4_Quake":
            case "Levels/XP4_Rubble/XP4_Rubble":
            case "Levels/XP5_001/XP5_001":
            case "Levels/XP5_002/XP5_002":
            case "Levels/XP5_003/XP5_003":
            case "Levels/XP5_004/XP5_004":
                return true;
            default:
                return false;
        }
    }

    static getLevelName(map)
    {
        let tokens = map.split('/');
        return tokens[tokens.length - 1];
    }

    static getMapName(map)
    {
        switch (map)
        {
            case "Levels/MP_001/MP_001":
                return "Grand Bazaar";
            case "Levels/MP_003/MP_003":
                return "Tehran Highway";
            case "Levels/MP_007/MP_007":
                return "Caspian Border";
            case "Levels/MP_011/MP_011":
                return "Seine Crossing";
            case "Levels/MP_012/MP_012":
                return "Operation Firestorm";
            case "Levels/MP_013/MP_013":
                return "Damavand Peak";
            case "Levels/MP_017/MP_017":
                return "Noshahr Canals";
            case "Levels/MP_018/MP_018":
                return "Kharg Island";
            case "Levels/MP_Subway/MP_Subway":
                return "Operation Metro";
            case "Levels/XP1_001/XP1_001":
                return "Strike at Karkand";
            case "Levels/XP1_002/XP1_002":
                return "Gulf of Oman";
            case "Levels/XP1_003/XP1_003":
                return "Sharqi Peninsula";
            case "Levels/XP1_004/XP1_004":
                return "Wake Island";
            case "Levels/XP2_Factory/XP2_Factory":
                return "Scrapmetal";
            case "Levels/XP2_Office/XP2_Office":
                return "Operation 925";
            case "Levels/XP2_Palace/XP2_Palace":
                return "Donya Fortress";
            case "Levels/XP2_Skybar/XP2_Skybar":
                return "Ziba Tower";
            case "Levels/XP3_Desert/XP3_Desert":
                return "Bandar Desert";
            case "Levels/XP3_Alborz/XP3_Alborz":
                return "Alborz Mountains";
            case "Levels/XP3_Shield/XP3_Shield":
                return "Armored Shield";
            case "Levels/XP3_Valley/XP3_Valley":
                return "Death Valley";
            case "Levels/XP4_FD/XP4_FD":
                return "Markaz Monolith";
            case "Levels/XP4_Parl/XP4_Parl":
                return "Azadi Palace";
            case "Levels/XP4_Quake/XP4_Quake":
                return "Epicenter";
            case "Levels/XP4_Rubble/XP4_Rubble":
                return "Talah Market";
            case "Levels/XP5_001/XP5_001":
                return "Operation Riverside";
            case "Levels/XP5_002/XP5_002":
                return "Nebandan Flats";
            case "Levels/XP5_003/XP5_003":
                return "Kiasar Railroad";
            case "Levels/XP5_004/XP5_004":
                return "Sabalan Pipeline";
            default:
                let tokens = map.split('/');
                return tokens[tokens.length - 1];
        }
    }

    static getGamemodeName(gamemode)
    {
        switch (gamemode)
        {
            case 'ConquestLarge0':
                return 'Conquest Large';
            case 'ConquestSmall0':
                return 'Conquest';
            case 'ConquestAssaultLarge0':
                return 'Conquest Assault Large';
            case 'ConquestAssaultSmall0':
                return 'Conquest Assault';
            case 'ConquestAssaultSmall1':
                return 'Conquest Assault #2';
            case 'RushLarge0':
                return 'Rush';
            case 'SquadRush0':
                return 'Squad Rush';
            case 'SquadDeathMatch0':
                return 'Squad Deathmatch';
            case 'TeamDeathMatch0':
                return 'Team Deathmatch';
            case 'TeamDeathMatchC0':
                return 'Team Deathmatch CQ';
            case 'CaptureTheFlag0':
                return 'Capture the Flag';
            case 'AirSuperiority0':
                return 'Air Superiority';
            case 'GunMaster0':
                return 'Gun Master';
            case 'Scavenger0':
                return 'Scavenger';
            case 'TankSuperiority0':
                return 'Tank Superiority';
            case 'Domination0':
                return 'Conquest Domination';
            default:
                return gamemode;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        minServerBuild: state.servers.minServerBuild,
        availableXPacks: state.servers.availableXPacks,
        vextVersion: state.base.vextVersion,
        build: state.base.build,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup });
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(ServerEntry);
