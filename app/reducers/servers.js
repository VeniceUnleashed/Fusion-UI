import {
    SET_SERVERS,
    SET_SERVER_DATA,
    CHANGE_SERVER_CONNECT_STATUS,
    CHANGE_SERVER_FETCH_STATUS,
    ADD_SERVER,
    SET_SERVER_DOWNLOAD_PROGRESS,
    SORT_SERVERS_BY,
    CYCLE_SERVER_SORT_DIRECTION,
    CHANGE_CONNECTION_STATUS,
    SET_AVAILABLE_XPACKS,
    SET_MIN_SERVER_BUILD,
    SET_SERVER_FILTERS,
    SET_BUILD_NUMBER,
    SET_VERSION_NUMBER,
    SET_VEXT_VERSION,
    SET_FAVORITE_SERVERS,
    ADD_FAVORITE_SERVER,
    REMOVE_FAVORITE_SERVER,
    TOGGLE_FAVORITE_SERVERS_ONLY,
} from '../constants/ActionTypes'

import * as AccountStorageKeys from '../constants/AccountStorageKeys';
import * as ServerFetchStatus from '../constants/ServerFetchStatus'
import * as ServerSort from '../constants/ServerSort'
import * as SortDirection from '../constants/SortDirection'
import * as ServerConnectStatus from '../constants/ServerConnectStatus'
import * as ConnectionStatus from '../constants/ConnectionStatus'
import ServerEntry from "../components/ServerEntry";

import { getServerPlayers } from "../utils/servers"

const initialState = {
    originalListing: [],
    listing: [],
    map: {},
    filters: null,
    sortBy: ServerSort.NONE,
    sortDirection: SortDirection.NONE,
    connectStatus: ServerConnectStatus.IDLE,
    fetchStatus: ServerFetchStatus.IDLE,
    downloadProgress: {
        totalFiles: 0,
        currentFileIndex: 0,
        setSize: 0,
        downloaded: 0,
        currentFile: 0,
    },
    availableXPacks: [],
    minServerBuild: 0,
    build: 0,
    version: '',
    vextVersion: '',
    favoriteServers: new Set([]),
    favoriteServersOnly: false,
};

function createStateCopy(state)
{
    return {
        ...state
    };
}

// We provide different sorting methods statically here for better optimization.
function sortByNameAsc(a, b)
{
    return a.name.localeCompare(b.name);
}

function sortByNameDesc(a, b)
{
    return -a.name.localeCompare(b.name);
}

function sortByMapAsc(a, b)
{
    return a.variables.mapname.localeCompare(b.variables.mapname);
}

function sortByMapDesc(a, b)
{
    return -a.variables.mapname.localeCompare(b.variables.mapname);
}

function sortByGamemodeAsc(a, b)
{
    return a.variables.gamemode.localeCompare(b.variables.gamemode);
}

function sortByGamemodeDesc(a, b)
{
    return -a.variables.gamemode.localeCompare(b.variables.gamemode);
}

function sortByPlayersAsc(a, b)
{
    const playersLeft = getServerPlayers(a)
    const playersRight = getServerPlayers(b)

    let playerCountLeft = parseInt(playersLeft, 10);
    let spectatorCountLeft = parseInt(a.variables.spectators, 10);
    playerCountLeft -= spectatorCountLeft;

    let playerCountRight = parseInt(playersRight, 10);
    let spectatorCountRight = parseInt(b.variables.spectators, 10);
    playerCountRight -= spectatorCountRight;

    if (playerCountLeft < playerCountRight)
        return -1;

    if (playerCountLeft > playerCountRight)
        return 1;

    return 0;
}

function sortByPlayersDesc(a, b)
{
    const playersLeft = getServerPlayers(a)
    const playersRight = getServerPlayers(b)

    let playerCountLeft = parseInt(playersLeft, 10);
    let spectatorCountLeft = parseInt(a.variables.spectators, 10);
    playerCountLeft -= spectatorCountLeft;

    let playerCountRight = parseInt(playersRight, 10);
    let spectatorCountRight = parseInt(b.variables.spectators, 10);
    playerCountRight -= spectatorCountRight;

    if (playerCountLeft < playerCountRight)
        return 1;

    if (playerCountLeft > playerCountRight)
        return -1;

    return 0;
}

function sortByPingAsc(a, b)
{
    let pingLeft = a.ping !== '-' ? parseInt(a.ping, 10) : 99999;
    let pingRight = b.ping !== '-' ? parseInt(b.ping, 10) : 99999;

    if (pingLeft < pingRight)
        return -1;

    if (pingLeft > pingRight)
        return 1;

    return 0;
}

function sortByPingDesc(a, b)
{
    let pingLeft = a.ping !== '-' ? parseInt(a.ping, 10) : 99999;
    let pingRight = b.ping !== '-' ? parseInt(b.ping, 10) : 99999;

    if (pingLeft < pingRight)
        return 1;

    if (pingLeft > pingRight)
        return -1;

    return 0;
}

function filterServers(filters, servers, state)
{
    let filtered = [];

    if (filters === null)
    {
        filtered = [ ...servers ];
    }
    else
    {
        for (const server of servers)
        {
            if (filters.minPlayers !== undefined && server.players < filters.minPlayers)
                continue;

            if (filters.maxPlayers !== undefined && server.players > filters.maxPlayers)
                continue;

            if (filters.minPing !== undefined && server.ping < filters.minPing)
                continue;

            if (filters.maxPing !== undefined && server.ping > filters.maxPing)
                continue;

            if (filters.hideFull && server.players >= server.variables.maxplayers)
                continue;

            if (filters.hideEmpty && server.players == 0)
                continue;

            if (filters.hidePassworded && server.passworded)
                continue;

            if (filters.hideIncompatible)
            {
                const compatibility = ServerEntry.checkServerCompatibility(
                    server,
                    state.availableXPacks,
                    state.minServerBuild,
                    state.build,
                    state.vextVersion
                );

                if (compatibility !== null)
                    continue;
            }

            if (!filters.freq30Hz && server.variables.frequency === 'reg')
                continue;

            if (!filters.freq60Hz && server.variables.frequency === 'high60')
                continue;

            if (!filters.freq120Hz && server.variables.frequency === 'high120')
                continue;

            if (filters.serverName.trim().length > 0 && server.name.toLowerCase().indexOf(filters.serverName.toLowerCase().trim()) === -1)
                continue;

            if (filters.maps.length > 0)
            {
                let mapFound = false;

                for (const map of filters.maps)
                {
                    if (server.variables.mapname.toLowerCase() === map.toLowerCase())
                    {
                        mapFound = true;
                    }
                }

                if (!mapFound)
                    continue;
            }

            if (filters.gamemodes.length > 0)
            {
                let gamemodeFound = false;

                for (const gamemode of filters.gamemodes)
                {
                    if (server.variables.gamemode.toLowerCase() === gamemode.toLowerCase())
                    {
                        gamemodeFound = true;
                    }
                }

                if (!gamemodeFound)
                    continue;
            }

            if (filters.tags.length > 0)
            {
                let tagFound = false;

                let serverTags = [];

                if (server.variables.tags && server.variables.tags.length > 0)
                    serverTags = server.variables.tags.split(',');

                for (const tag of filters.tags)
                {
                    for (const serverTag of serverTags)
                    {
                        if (serverTag.toLowerCase() === tag.toLowerCase())
                        {
                            tagFound = true;
                            break;
                        }
                    }
                }

                if (!tagFound)
                    continue;
            }

            filtered.push(server);
        }
    }
    
    if (state.favoriteServersOnly) {
        filtered = filtered.filter((server) => state.favoriteServers.has(server.guid));
    }

    return filtered;
}

const sorters = {
    [ServerSort.NAME]: {
        [SortDirection.ASC]: sortByNameAsc,
        [SortDirection.DESC]: sortByNameDesc,
    },
    [ServerSort.MAP]: {
        [SortDirection.ASC]: sortByMapAsc,
        [SortDirection.DESC]: sortByMapDesc,
    },
    [ServerSort.GAMEMODE]: {
        [SortDirection.ASC]: sortByGamemodeAsc,
        [SortDirection.DESC]: sortByGamemodeDesc,
    },
    [ServerSort.PLAYERS]: {
        [SortDirection.ASC]: sortByPlayersAsc,
        [SortDirection.DESC]: sortByPlayersDesc,
    },
    [ServerSort.PING]: {
        [SortDirection.ASC]: sortByPingAsc,
        [SortDirection.DESC]: sortByPingDesc,
    },
};

function getSortingFunction(sortBy, sortDirection)
{
    if (sortBy === ServerSort.NONE ||
        sortDirection === SortDirection.NONE)
        return null;

    return sorters[sortBy][sortDirection];
}

export default function servers(state = initialState, action)
{
    switch (action.type)
    {
        case SET_BUILD_NUMBER:
        {
            let finalState = createStateCopy(state);

            finalState.build = action.build;

            return finalState;
        }

        case SET_VERSION_NUMBER:
        {
            let finalState = createStateCopy(state);

            finalState.version = action.version;

            return finalState;
        }

        case SET_VEXT_VERSION:
        {
            let finalState = createStateCopy(state);

            finalState.vextVersion = action.version;

            return finalState;
        }

        case SET_FAVORITE_SERVERS:
        {
            let finalState = createStateCopy(state);

            finalState.favoriteServers = new Set([ ...action.servers ]);

            return finalState;
        }

        case CHANGE_CONNECTION_STATUS:
        {
            if (action.status === ConnectionStatus.DISCONNECTED) {
                return {
                    ...initialState,
                };
            }

            return state;
        }

        case CHANGE_SERVER_FETCH_STATUS:
        {
            let finalState = createStateCopy(state);

            finalState.fetchStatus = action.status;

            return finalState;
        }

        case SET_SERVERS:
        {
            let finalState = createStateCopy(state);

            finalState.map = {};

            for (const server of action.servers)
                finalState.map[server.guid] = server;

            finalState.originalListing = Object.values(finalState.map);
            finalState.listing = filterServers(finalState.filters, finalState.originalListing, finalState);

            // Sort the servers.
            const sorter = getSortingFunction(finalState.sortBy, finalState.sortDirection);

            if (sorter !== null)
                finalState.listing.sort(sorter);

            return finalState;
        }

        case ADD_SERVER:
        {
            if (state.fetchStatus !== ServerFetchStatus.FETCHING)
                return state;

            let finalState = createStateCopy(state);

            finalState.map = {
                ...finalState.map,
                [action.server.guid]: action.server,
            };

            finalState.originalListing = [ ...finalState.originalListing, action.server ];
            finalState.listing = filterServers(finalState.filters, finalState.originalListing, finalState);

            // Sort the servers.
            const sorter = getSortingFunction(finalState.sortBy, finalState.sortDirection);

            if (sorter !== null)
                finalState.listing.sort(sorter);

            return finalState;
        }

        case CHANGE_SERVER_CONNECT_STATUS:
        {
            let finalState = createStateCopy(state);

            finalState.connectStatus = action.status;

            return finalState;
        }

        case SET_AVAILABLE_XPACKS:
        {
            let finalState = createStateCopy(state);

            finalState.availableXPacks = [ ...action.xpacks ];

            return finalState;
        }

        case SET_MIN_SERVER_BUILD:
        {
            let finalState = createStateCopy(state);

            finalState.minServerBuild = action.build;

            return finalState;
        }

        case SET_SERVER_DATA:
        {
            let finalState = createStateCopy(state);

            finalState.map = {
                ...finalState.map
            };

            finalState.map[action.server.guid] = {
                ...finalState.map[action.server.guid],
                ...action.server,
            };

            finalState.originalListing = [ ...finalState.originalListing ];

            for (let i = 0; i < finalState.originalListing.length; ++i)
            {
                if (finalState.originalListing[i].guid !== action.server.guid)
                    continue;

                finalState.originalListing[i] = {
                    ...finalState.originalListing[i],
                    ...action.server
                };

                break;
            }

            finalState.listing = filterServers(finalState.filters, finalState.originalListing, finalState);

            // Sort the servers.
            const sorter = getSortingFunction(finalState.sortBy, finalState.sortDirection);

            if (sorter !== null)
                finalState.listing.sort(sorter);

            return finalState;
        }

        case SET_SERVER_DOWNLOAD_PROGRESS:
        {
            let finalState = createStateCopy(state);

            finalState.downloadProgress = {
                ...finalState.downloadProgress,
                totalFiles: action.totalFiles,
                currentFileIndex: action.currentFileIndex,
                setSize: action.setSize,
                downloaded: action.downloaded,
                currentFile: action.currentFile,
            };

            return finalState;
        }

        case SORT_SERVERS_BY:
        {
            if (state.sortBy === action.sortBy && state.sortDirection === action.sortDirection)
                return state;

            let finalState = createStateCopy(state);

            finalState.sortBy = action.sortBy;
            finalState.sortDirection = action.sortDirection;

            finalState.listing = filterServers(finalState.filters, finalState.originalListing, finalState);

            const sorter = getSortingFunction(finalState.sortBy, finalState.sortDirection);

            if (sorter !== null)
                finalState.listing.sort(sorter);

            return finalState;
        }

        case CYCLE_SERVER_SORT_DIRECTION:
        {
            if (state.sortBy === ServerSort.NONE)
                return state;

            let finalState = createStateCopy(state);

            if (state.sortDirection === SortDirection.NONE)
                finalState.sortDirection = SortDirection.ASC;
            else if (state.sortDirection === SortDirection.ASC)
                finalState.sortDirection = SortDirection.DESC;
            else
                finalState.sortDirection = SortDirection.NONE;

            finalState.listing = filterServers(finalState.filters, finalState.originalListing, finalState);

            const sorter = getSortingFunction(finalState.sortBy, finalState.sortDirection);

            if (sorter !== null)
            {
                finalState.listing.sort(sorter);
            }

            return finalState;
        }

        case SET_SERVER_FILTERS:
        {
            if (state.filters === action.filters)
                return state;

            const filters = action.filters;

            let finalState = {
                ...state,
                filters,
            };

            // Filter the servers.
            finalState.listing = filterServers(finalState.filters, finalState.originalListing, finalState);

            // Sort the filtered servers.
            const sorter = getSortingFunction(finalState.sortBy, finalState.sortDirection);

            if (sorter !== null)
            {
                finalState.listing.sort(sorter);
            }

            return finalState;
        }

        case ADD_FAVORITE_SERVER:
        {
            WebUI.Call('AddFavoriteServer', action.server.guid)

            // Optimistic update.
            const favoriteServers = new Set(state.favoriteServers);
            favoriteServers.add(action.server.guid);

            return {
                ...state,
                favoriteServers,
            }
        }

        case REMOVE_FAVORITE_SERVER:
        {
            WebUI.Call('RemoveFavoriteServer', action.server.guid)

            // Optimistic update.
            const favoriteServers = new Set(state.favoriteServers);
            favoriteServers.delete(action.server.guid);

            return {
                ...state,
                favoriteServers,
            }
        }

        case TOGGLE_FAVORITE_SERVERS_ONLY:
        {
            let finalState = {
                ...state,
                favoriteServersOnly: !state.favoriteServersOnly,
            };

            // Filter the servers.
            finalState.listing = filterServers(finalState.filters, finalState.originalListing, finalState);

            // Sort the filtered servers.
            const sorter = getSortingFunction(finalState.sortBy, finalState.sortDirection);

            if (sorter !== null)
            {
                finalState.listing.sort(sorter);
            }

            return finalState;
        }

        default:
            return state;
    }
}
