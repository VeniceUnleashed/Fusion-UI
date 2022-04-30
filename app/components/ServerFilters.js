import React, { Component } from 'react';
import Select from 'react-select';
import ServerEntry from "./ServerEntry";
import * as ActionTypes from "../constants/ActionTypes";
import {connect} from "react-redux";

class ServerFilters extends Component
{
    constructor(props)
    {
        super(props);

        let filters = props.servers.filters;

        if (filters === null)
            filters = ServerFilters.getDefaultFilters();

        this.state = {
            ...filters,
        };
    }

    render()
    {
        const selectStyle = {
            control: (provided) => ({
                ...provided,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: 0,
                border: '0.1574074074074074vh solid rgba(255, 255, 255, 0.7)',
                '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 1)'
                },
                minHeight: '3.703703703703704vh', // 40px
            }),
            singleValue: (provided) => ({
                ...provided,
                color: '#fff',
                fontWeight: 300,
                fontSize: '1.851851851851852vh', // 20px
            }),
            option: (provided, state) => {
                let backgroundColor = 'transparent';
                let color = '#fff';
                let fontWeight = 300;

                if (state.isFocused && !state.isSelected)
                {
                    backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }
                else if (state.isSelected)
                {
                    backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    color = '#000';
                    fontWeight = 500;
                }

                return {
                    ...provided,
                    backgroundColor,
                    color,
                    fontWeight,
                    fontSize: '1.851851851851852vh', // 20px
                    padding: '0.7407407407407407vh 1.111111111111111vh', // 8px 12px,
                };
            },
            menu: (provided) => ({
                ...provided,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                willChange: 'top',
                borderRadius: 0,
                boxShadow: 'none',
                border: '0.1574074074074074vh solid rgba(255, 255, 255, 0.4)'
            }),
            dropdownIndicator: (provided) => ({
                ...provided,
                padding: '0.7407407407407407vh', // 8px
                svg: {
                    height: '1.851851851851852vh', // 20px
                    width: '1.851851851851852vh', // 20px
                },
            }),
            indicatorSeparator: (provided) => ({
                ...provided,
                width: '0.1574074074074074vh', // 1.7px
                marginTop: '0.7407407407407407vh', // 8px
                marginBottom: '0.7407407407407407vh', // 8px
            }),
            valueContainer: (provided) => ({
                ...provided,
                padding: '0 0.7407407407407407vh', // 0 8px
                minHeight: '3.546296296296296vh', // 38.3px
            }),
            multiValue: (provided) => ({
                ...provided,
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: 0,
                margin: '0.1851851851851852vh', // 2px
            }),
            multiValueLabel: (provided) => ({
                ...provided,
                color: '#fff',
                padding: 0,
                fontWeight: 300,
                paddingLeft: '0.5555555555555556vh', // 6px
            }),
            multiValueRemove: (provided) => ({
                ...provided,
                paddingLeft: '0.3703703703703704vh', // 4px
                paddingRight: '0.3703703703703704vh', // 4px
                svg: {
                    width: '1.296296296296296vh', // 14px
                    height: '1.296296296296296vh', // 14px
                }
            }),
            clearIndicator: (provided) => ({
                ...provided,
                padding: '0.7407407407407407vh', // 8px
                svg: {
                    width: '1.851851851851852vh', // 20px
                    height: '1.851851851851852vh', // 20px
                }
            }),
            input: (provided) => ({
                ...provided,
                color: '#fff',
                fontSize: '1.666666666666667vh', // 18px
            }),
            noOptionsMessage: (provided) => ({
                ...provided,
                padding: '0.7407407407407407vh 1.111111111111111vh', // 8px 12px,
                fontSize: '1.851851851851852vh', // 20px
            })
        };

        let className = 'server-filters';

        if (this.props.visible)
            className += ' visible';

        const mapSet = new Set();
        const gamemodeSet = new Set();
        const tagSet = new Set();

        for (const server of this.props.servers.originalListing)
        {
            mapSet.add(server.variables.mapname);
            gamemodeSet.add(server.variables.gamemode);

            let serverTags = [];

            if (server.variables.tags && server.variables.tags.length > 0)
                serverTags = server.variables.tags.split(',');

            for (const tag of serverTags)
            {
                if (!/^[a-z0-9-]+$/.test(tag))
                    continue;

                tagSet.add(tag);
            }
        }

        const mapOptions = [];

        for (const map of mapSet)
            mapOptions.push({ value: map, label: ServerEntry.getMapName(map) });

        mapOptions.sort((a, b) =>
        {
            return a.label.localeCompare(b.label);
        });

        const selectedMaps = [];

        for (const map of this.state.maps)
            selectedMaps.push({ value: map, label: ServerEntry.getMapName(map) });

        const gamemodeOptions = [];

        for (const gamemode of gamemodeSet)
            gamemodeOptions.push({ value: gamemode, label: ServerEntry.getGamemodeName(gamemode) });

        gamemodeOptions.sort((a, b) =>
        {
            return a.label.localeCompare(b.label);
        });

        const selectedGamemodes = [];

        for (const gamemode of this.state.gamemodes)
            selectedGamemodes.push({ value: gamemode, label: ServerEntry.getGamemodeName(gamemode) });

        const tagOptions = [];

        for (const tag of tagSet)
            tagOptions.push({ value: tag, label: tag });

        const selectedTags = [];

        for (const tag of this.state.tags)
            selectedTags.push({ value: tag, label: tag });

        return (
            <div className={className}>
                <div className="filter">
                    <h3>Maps</h3>
                    <Select
                        options={mapOptions}
                        isSearchable={true}
                        onChange={this._onChangeMaps}
                        styles={selectStyle}
                        closeMenuOnSelect={false}
                        value={selectedMaps}
                        isMulti
                    />
                </div>
                <div className="filter">
                    <h3>Gamemodes</h3>
                    <Select
                        options={gamemodeOptions}
                        isSearchable={true}
                        onChange={this._onChangeGamemodes}
                        styles={selectStyle}
                        closeMenuOnSelect={false}
                        value={selectedGamemodes}
                        isMulti
                    />
                </div>
                <div className="filter">
                    <h3>Tags</h3>
                    <Select
                        options={tagOptions}
                        isSearchable={true}
                        onChange={this._onChangeTags}
                        styles={selectStyle}
                        closeMenuOnSelect={false}
                        value={selectedTags}
                        isMulti
                    />
                </div>
                <div className="left">
                    <div className="filter">
                        <h3>Server name</h3>
                        <input type="text" value={this.state.serverName} onChange={this._onChangeServerName} onKeyDown={this._onKeyDown} />
                    </div>
                    <div className="filter">
                        <h3>Player count</h3>
                        <div className="min-max-ctr">
                            <label>Min<input type="text" value={this.state.minPlayers} onChange={this._onChangeMinPlayers} onKeyDown={this._onKeyDown} /></label>
                            <label>Max<input type="text" value={this.state.maxPlayers} onChange={this._onChangeMaxPlayers} onKeyDown={this._onKeyDown} /></label>
                        </div>
                    </div>
                    <div className="filter">
                        <h3>Ping</h3>
                        <div className="min-max-ctr">
                            <label>Min<input type="text" value={this.state.minPing} onChange={this._onChangeMinPing} onKeyDown={this._onKeyDown} /></label>
                            <label>Max<input type="text" value={this.state.maxPing} onChange={this._onChangeMaxPing} onKeyDown={this._onKeyDown} /></label>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="filter">
                        <h3>Server frequency</h3>
                        <div className="frequency-filters">
                            <label>
                                <input type="checkbox" checked={this.state.freq30Hz} onChange={this._onChangeFreq30Hz} />
                                30Hz
                            </label>
                            <label>
                                <input type="checkbox" checked={this.state.freq60Hz} onChange={this._onChangeFreq60Hz} />
                                60Hz
                            </label>
                            <label>
                                <input type="checkbox" checked={this.state.freq120Hz} onChange={this._onChangeFreq120Hz} />
                                120Hz
                            </label>
                        </div>
                    </div>
                    <div className="filter">
                        <h3>Visibility filters</h3>
                        <label className="filter-checkbox"><input type="checkbox" checked={this.state.hideFull} onChange={this._onChangeHideFull} /> Hide full servers</label>
                        <label className="filter-checkbox"><input type="checkbox" checked={this.state.hideEmpty} onChange={this._onChangeHideEmpty} /> Hide empty servers</label>
                        <label className="filter-checkbox"><input type="checkbox" checked={this.state.hidePassworded} onChange={this._onChangeHidePassworded} /> Hide password protected</label>
                        <label className="filter-checkbox"><input type="checkbox" checked={this.state.hideIncompatible} onChange={this._onChangeHideIncompatible} /> Hide incompatible servers</label>
                    </div>
                </div>
                <div className="filter-buttons">
                    <a href="#" className="btn border-btn" onClick={this._onClose}>Close</a>
                    <a href="#" className="btn border-btn" onClick={this._onResetFilters}>Reset filters</a>
                    <a href="#" className="btn border-btn primary" onClick={this._onApplyFilters}>Apply filters</a>
                </div>
            </div>
        );
    }

    _onKeyDown = (e) =>
    {
        if (e.keyCode === 13)
            this._onApplyFilters();
    };

    _onClose = (e) =>
    {
        if (e)
            e.preventDefault();

        this.props.onClose();
    }

    _onResetFilters = (e) =>
    {
        if (e)
            e.preventDefault();

        this.setState({
            ...ServerFilters.getDefaultFilters(),
        });

        this.props.setServerFilters(ServerFilters.getDefaultFilters());
    };

    _onApplyFilters = (e) =>
    {
        if (e)
            e.preventDefault();

        this.props.setServerFilters(this.state);
    };

    _onChangeMaps = (mapsValues) =>
    {
        const maps = [];

        if (mapsValues !== null)
            for (const map of mapsValues)
                maps.push(map.value);

        this.setState({
            maps,
        });
    };

    _onChangeGamemodes = (gamemodesValues) =>
    {
        const gamemodes = [];

        if (gamemodesValues !== null)
            for (const gamemode of gamemodesValues)
                gamemodes.push(gamemode.value);

        this.setState({
            gamemodes,
        });
    };

    _onChangeTags = (tagsValues) =>
    {
        const tags = [];

        if (tagsValues !== null)
            for (const tag of tagsValues)
                tags.push(tag.value);

        this.setState({
            tags,
        });
    };

    _onChangeServerName = (e) =>
    {
        this.setState({
            serverName: e.target.value,
        });
    };

    _onChangeMinPlayers = (e) =>
    {
        let value = e.target.value;

        // Make sure to only allow numbers.
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0)
        {
            e.target.value = '';

            this.setState({
                minPlayers: undefined,
            });

            return;
        }

        this.setState({
            minPlayers: parseInt(value, 10),
        });
    };

    _onChangeMaxPlayers = (e) =>
    {
        let value = e.target.value;

        // Make sure to only allow numbers.
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0)
        {
            e.target.value = '';

            this.setState({
                maxPlayers: undefined,
            });

            return;
        }

        this.setState({
            maxPlayers: parseInt(value, 10),
        });
    };

    _onChangeMinPing = (e) =>
    {
        let value = e.target.value;

        // Make sure to only allow numbers.
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0)
        {
            e.target.value = '';

            this.setState({
                minPing: undefined,
            });

            return;
        }

        this.setState({
            minPing: parseInt(value, 10),
        });
    };

    _onChangeMaxPing = (e) =>
    {
        let value = e.target.value;

        // Make sure to only allow numbers.
        value = value.replace(/[^0-9]/g, '');

        if (value.length === 0)
        {
            e.target.value = '';

            this.setState({
                maxPing: undefined,
            });

            return;
        }

        this.setState({
            maxPing: parseInt(value, 10),
        });
    };

    _onChangeFreq30Hz = (e) =>
    {
        this.setState({
            freq30Hz: e.target.checked,
        })
    };

    _onChangeFreq60Hz = (e) =>
    {
        this.setState({
            freq60Hz: e.target.checked,
        })
    };

    _onChangeFreq120Hz = (e) =>
    {
        this.setState({
            freq120Hz: e.target.checked,
        })
    };

    _onChangeHideFull = (e) =>
    {
        this.setState({
            hideFull: e.target.checked,
        })
    };

    _onChangeHideEmpty = (e) =>
    {
        this.setState({
            hideEmpty: e.target.checked,
        })
    };

    _onChangeHidePassworded = (e) =>
    {
        this.setState({
            hidePassworded: e.target.checked,
        })
    };

    _onChangeHideIncompatible = (e) =>
    {
        this.setState({
            hideIncompatible: e.target.checked,
        })
    };

    static getDefaultFilters()
    {
        return {
            maps: [],
            gamemodes: [],
            tags: [],
            serverName: '',
            minPlayers: undefined,
            maxPlayers: undefined,
            minPing: undefined,
            maxPing: undefined,
            freq30Hz: true,
            freq60Hz: true,
            freq120Hz: true,
            hideFull: false,
            hideEmpty: false,
            hidePassworded: false,
            hideIncompatible: false,
        };
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base,
        servers: state.servers
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setServerFilters: (filters) => {
            dispatch({ type: ActionTypes.SET_SERVER_FILTERS, filters })
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ServerFilters);
