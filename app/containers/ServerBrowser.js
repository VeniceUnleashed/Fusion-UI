import React, { Component } from 'react'
import { connect } from 'react-redux'
import PerfectScrollbar from 'perfect-scrollbar';

import * as ServerFetchStatus from '../constants/ServerFetchStatus'
import * as ServerConnectStatus from '../constants/ServerConnectStatus'
import * as ActionTypes from '../constants/ActionTypes'
import * as AccountStorageKeys from '../constants/AccountStorageKeys';
import * as ServerSort from '../constants/ServerSort'
import * as SortDirection from '../constants/SortDirection'

import ConnectingServerPopup from '../popups/ConnectingServerPopup'
import ServerEntry from "../components/ServerEntry";
import ServerFilters from "../components/ServerFilters";

class ServerBrowser extends Component
{
    constructor(props)
    {
        super(props);

        this.scrollbar = null;
        this.state = {
            expandedServer: null,
            filtersVisible: false,
            width: 920,
            height: 580,
        };
    }

    _onSortByMap = (e) =>
    {
        if (e)
            e.preventDefault();

        this.sortBy(ServerSort.MAP);
    };

    _onSortByGamemode = (e) =>
    {
        if (e)
            e.preventDefault();

        this.sortBy(ServerSort.GAMEMODE);
    };

    _onSortByPlayers = (e) =>
    {
        if (e)
            e.preventDefault();

        this.sortBy(ServerSort.PLAYERS);
    };

    _onSortByPing = (e) =>
    {
        if (e)
            e.preventDefault();

        this.sortBy(ServerSort.PING);
    };

    sortBy(sortBy)
    {
        if (this.props.servers.sortBy !== sortBy)
        {
            this.props.sortServersBy(sortBy, SortDirection.ASC);
            return;
        }

        this.props.cycleServerSortDirection();
    }

    _onServerList = (ref) =>
    {
        if (ref === null) {
            this.scrollbar = null;
            return;
        }

        this.scrollbar = new PerfectScrollbar(ref, {
            wheelSpeed: 3,
        });
    };

    componentDidUpdate()
    {
        if (this.scrollbar !== null)
            this.scrollbar.update();
    }

    render()
    {
        let servers = [];

        for (const server of this.props.servers.listing)
        {
            let isFavorite = false;
            if (this.props.servers.favoriteServers.size) {
                isFavorite = this.props.servers.favoriteServers.has(server.guid);
            }

            servers.push(
                <ServerEntry
                    server={server}
                    key={server.guid}
                    expanded={this.state.expandedServer === server.guid}
                    onClick={this._onExpandServer}
                    onJoin={this._onJoinServer}
                    onSpectate={this._onSpectateServer}
                    onAddRemoveFavorite={this._onAddRemoveFavorite}
                    isFavorite={isFavorite}
                />
            );
        }

        let serverCountText = 'Found ' + servers.length + ' server' + (servers.length !== 1 ? 's' : '');

        if (servers.length === 0)
            servers = <span className="notice no-servers">No servers found</span>;

        if (this.props.servers.fetchStatus === ServerFetchStatus.FETCHING)
            serverCountText = 'Fetching Servers';

        let sortIcon = '';

        if (this.props.servers.sortDirection === SortDirection.ASC)
            sortIcon = 'arrow_drop_up';
        else if (this.props.servers.sortDirection === SortDirection.DESC)
            sortIcon = 'arrow_drop_down';

        const mapSort = this.props.servers.sortBy === ServerSort.MAP ? sortIcon : '';
        const gamemodeSort = this.props.servers.sortBy === ServerSort.GAMEMODE ? sortIcon : '';
        const playersSort = this.props.servers.sortBy === ServerSort.PLAYERS ? sortIcon : '';
        const pingSort = this.props.servers.sortBy === ServerSort.PING ? sortIcon : '';

        let listClassName = 'list-body main-list-body';

        const compactView = this.props.user.accountStorage[AccountStorageKeys.COMPACT_VIEW] === 'true';
        if (compactView) {
            listClassName += ' compact';
        }

        const favoritesOnly = this.props.servers.favoriteServersOnly;

        return (
            <div className="server-browser content-wrapper" ref="browser">
                <div className="server-list">
                    <div className="list-header" ref="header">
                        <div className="column column-1">
                            <div className="header-action">
                                <span>{serverCountText}</span>
                                <a href="#"
                                   className={this.props.servers.fetchStatus === ServerFetchStatus.FETCHING ? 'fetching' : ''}
                                   onClick={this.onFetchServers.bind(this)}>
                                    <i className="material-icons">sync</i>
                                </a>
                            </div>
                            <div className={"header-action" + (this.state.filtersVisible ? ' active' : '')}>
                                <span>Filters</span>
                                <a href="#" onClick={this.onEditFilters.bind(this)}><i className="material-icons">filter_list</i></a>
                                <ServerFilters visible={this.state.filtersVisible} onClose={this._onCloseFilters} />
                            </div>
                            <div className={"header-action compact" + (compactView ? ' active' : '')}>
                                <span>Compact view</span>
                                <a href="#" onClick={this.onToggleCompactView.bind(this)}><i className="material-icons">{compactView ? 'toggle_on' : 'toggle_off'}</i></a>
                            </div>
                            <div className={"header-action compact" + (favoritesOnly ? ' active' : '')}>
                                <span>Favorites</span>
                                <a href="#" onClick={this.onToggleFavoritesOnly.bind(this)}><i className="material-icons">{favoritesOnly ? 'toggle_on' : 'toggle_off'}</i></a>
                            </div>
                        </div>
                        <div className="column column-2" onClick={this._onSortByMap}>
                            <i className="sort-indicator"/><span>Map</span><i className="sort-indicator material-icons">{mapSort}</i>
                        </div>
                        <div className="column column-3" onClick={this._onSortByGamemode}>
                            <i className="sort-indicator"/><span>Gamemode</span><i className="sort-indicator material-icons">{gamemodeSort}</i>
                        </div>
                        <div className="column column-4" onClick={this._onSortByPlayers}>
                            <i className="sort-indicator"/><span>Players</span><i className="sort-indicator material-icons">{playersSort}</i>
                        </div>
                        <div className="column column-5" onClick={this._onSortByPing}>
                            <i className="sort-indicator"/><span>Ping</span><i className="sort-indicator material-icons">{pingSort}</i>
                        </div>
                    </div>
                    <div className={listClassName} style={{ overflowX: 'hidden', width: this.state.width, height: this.state.height }} ref={this._onServerList} >
                        {servers}
                    </div>
                </div>
            </div>
        );
    }

    _onCloseFilters = () =>
    {
        this.setState({ filtersVisible: false });
    }

    onFetchServers(e)
    {
        if (e)
            e.preventDefault();

        this.setState({ expandedServer: null });

        if (this.props.servers.fetchStatus === ServerFetchStatus.FETCHING)
        {
            this.props.onResetServerFetch();
            return;
        }

        WebUI.Call('FetchServers');
    }

    onEditFilters(e)
    {
        if (e)
            e.preventDefault();

        this.setState({ filtersVisible: !this.state.filtersVisible });
    }

    onToggleCompactView(e)
    {
        if (e)
            e.preventDefault();

        this.props.toggleCompactView();
    }

    onToggleFavoritesOnly(e)
    {
        if (e)
            e.preventDefault();

        this.props.toggleFavoritesOnly();
    }

    _onExpandServer = (guid) =>
    {
        this.setState({ expandedServer: guid });
    };

    _onJoinServer = (guid, password) =>
    {
        if (this.props.servers.connectStatus === ServerConnectStatus.CONNECTING)
            return;

        this.props.setConnectionStatus();
        this.props.setPopup(<ConnectingServerPopup />);

        if (password && password.length > 0)
        {
            setTimeout(function() { WebUI.Call('ConnectToServer', guid, password); }, 500);
            return;
        }

        setTimeout(function() { WebUI.Call('ConnectToServer', guid); }, 500);
    };

    _onSpectateServer = (guid, password) =>
    {
        if (this.props.servers.connectStatus === ServerConnectStatus.CONNECTING)
            return;

        this.props.setConnectionStatus();
        this.props.setPopup(<ConnectingServerPopup />);

        if (password && password.length > 0)
        {
            setTimeout(function() { WebUI.Call('SpectateServer', guid, password); }, 500);
            return;
        }

        setTimeout(function() { WebUI.Call('SpectateServer', guid); }, 500);
    };

    _onAddRemoveFavorite = (server, isFavorite) =>
    {
        if (isFavorite) {
            this.props.removeFavorite(server);
            return;
        }

        this.props.addFavorite(server);
    };

    componentDidMount()
    {
        this.props.disableBlur();
        this.props.enableMenu();

        window.addEventListener('resize', this._onResize);
        this._onResize();

        // Fetch servers on page mount.
        this.onFetchServers();
    }

    componentWillUnmount()
    {
        window.removeEventListener('resize', this._onResize);
    }

    _onResize = () =>
    {
        const browserStyle = window.getComputedStyle(this.refs.browser);
        const headerStyle = window.getComputedStyle(this.refs.header);

        let requiredHeight = this.refs.browser.clientHeight;
        let requiredWidth = this.refs.header.clientWidth;

        requiredHeight -= parseFloat(browserStyle.paddingTop);
        requiredHeight -= parseFloat(browserStyle.paddingBottom);
        requiredHeight -= parseFloat(headerStyle.height);

        this.setState({
            width: requiredWidth,
            height: requiredHeight,
        });
    };
}

const mapStateToProps = (state) => {
    return {
        base: state.base,
        servers: state.servers,
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onResetServerFetch: () => {
            dispatch({ type: ActionTypes.CHANGE_SERVER_FETCH_STATUS, status: ServerFetchStatus.IDLE });
        },
        disableBlur: () => {
            dispatch({ type: ActionTypes.SET_BLUR, blur: false });
        },
        enableMenu: () => {
            dispatch({ type: ActionTypes.SET_MENU, menu: true });
        },
        setConnectionStatus: () => {
            dispatch({ type: ActionTypes.CHANGE_SERVER_CONNECT_STATUS, status: ServerConnectStatus.CONNECTING });
        },
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: popup });
        },
        sortServersBy: (sortBy, sortDirection) => {
            dispatch({ type: ActionTypes.SORT_SERVERS_BY, sortBy, sortDirection });
        },
        cycleServerSortDirection: () => {
            dispatch({ type: ActionTypes.CYCLE_SERVER_SORT_DIRECTION });
        },
        toggleCompactView: () => dispatch((innerDispatch, getState) => {
            const key = AccountStorageKeys.COMPACT_VIEW;
            const boolValue = !(getState().user.accountStorage[key] === 'true');

            innerDispatch({
                type: ActionTypes.SET_ACCOUNT_STORAGE_VALUE,
                key,
                value: boolValue.toString(),
            });
        }),
        toggleFavoritesOnly: () => {
            dispatch({ type: ActionTypes.TOGGLE_FAVORITE_SERVERS_ONLY });
        },
        addFavorite: (server) => {
            dispatch({ type: ActionTypes.ADD_FAVORITE_SERVER, server });
        },
        removeFavorite: (server) => {
            dispatch({ type: ActionTypes.REMOVE_FAVORITE_SERVER, server });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ServerBrowser);
