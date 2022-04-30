import React, { Component } from 'react'
import { connect } from 'react-redux'
import preloader from 'preloader'

import * as ActionTypes from '../constants/ActionTypes'

import TopMenu from '../components/TopMenu'
import AnimatedBackground from '../components/AnimatedBackground'
import TopLeftActions from '../components/TopLeftActions'
import TopRightActions from '../components/TopRightActions'
import FrameHell from '../components/FrameHell'
import GameConsole from "../components/GameConsole"

import QuitConfirmationPopup from '../popups/QuitConfirmationPopup'
import LogoutQuitConfirmationPopup from '../popups/LogoutQuitConfirmationPopup'
import Watermark from "../components/Watermark";
import SettingsPopup from "../popups/SettingsPopup";
import GlobalNotice from "../components/GlobalNotice";

class App extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {};

        this.preloader = preloader({
            xhrImages: false,
            loadFullAudio: false,
            loadFullVideo: false
        });

        this.preloader.on('complete', () =>
        {
            WebUI.Call('Startup');
            setTimeout(() => { WebUI.Call('InitialConnect'); }, 2500);
        });
    }

    componentDidMount()
    {
        // Preload all resources.
        this.preloader.add('/assets/fonts/blinker-bold-webfont.woff2');
        this.preloader.add('/assets/fonts/blinker-regular-webfont.woff2');
        this.preloader.add('/assets/fonts/blinker-semibold-webfont.woff2');
        this.preloader.add('/assets/fonts/blinker-semilight-webfont.woff2');

        this.preloader.add('/assets/fonts/JetBrainsMono-Bold.woff2');
        this.preloader.add('/assets/fonts/JetBrainsMono-Regular.woff2');

        this.preloader.add('/assets/fonts/MaterialIcons-Regular.woff2');

        this.preloader.add('/assets/img/background.png');
        this.preloader.add('/assets/img/logo.svg');
        this.preloader.add('/assets/img/logo-outline.svg');
        this.preloader.add('/assets/img/matchmake-bg.png');
        this.preloader.add('/assets/img/news-bg.png');
        this.preloader.add('/assets/img/news-secondary-bg.png');
        this.preloader.add('/assets/img/soldier-bg.png');

        this.preloader.add('/assets/img/maps/MP_001.png');
        this.preloader.add('/assets/img/maps/MP_003.png');
        this.preloader.add('/assets/img/maps/MP_007.png');
        this.preloader.add('/assets/img/maps/MP_011.png');
        this.preloader.add('/assets/img/maps/MP_012.png');
        this.preloader.add('/assets/img/maps/MP_013.png');
        this.preloader.add('/assets/img/maps/MP_017.png');
        this.preloader.add('/assets/img/maps/MP_018.png');
        this.preloader.add('/assets/img/maps/MP_Subway.png');
        this.preloader.add('/assets/img/maps/XP1_001.png');
        this.preloader.add('/assets/img/maps/XP1_002.png');
        this.preloader.add('/assets/img/maps/XP1_003.png');
        this.preloader.add('/assets/img/maps/XP1_004.png');
        this.preloader.add('/assets/img/maps/XP2_Factory.png');
        this.preloader.add('/assets/img/maps/XP2_Office.png');
        this.preloader.add('/assets/img/maps/XP2_Palace.png');
        this.preloader.add('/assets/img/maps/XP2_Skybar.png');
        this.preloader.add('/assets/img/maps/XP3_Desert.png');
        this.preloader.add('/assets/img/maps/XP3_Alborz.png');
        this.preloader.add('/assets/img/maps/XP3_Shield.png');
        this.preloader.add('/assets/img/maps/XP3_Valley.png');
        this.preloader.add('/assets/img/maps/XP4_FD.png');
        this.preloader.add('/assets/img/maps/XP4_Parl.png');
        this.preloader.add('/assets/img/maps/XP4_Quake.png');
        this.preloader.add('/assets/img/maps/XP4_Rubble.png');
        this.preloader.add('/assets/img/maps/XP5_001.png');
        this.preloader.add('/assets/img/maps/XP5_002.png');
        this.preloader.add('/assets/img/maps/XP5_003.png');
        this.preloader.add('/assets/img/maps/XP5_004.png');

        this.preloader.load();

        this.inputTimeout = setInterval(() =>
        {
            if (this.props.base.ingame)
                return;

            WebUI.Call('EnableMouse');
            WebUI.Call('EnableKeyboard');
        }, 500);
    }

    componentWillUnmount()
    {
        if (this.inputTimeout)
        {
            clearInterval(this.inputTimeout);
            this.inputTimeout = null;
        }
    }

    render()
    {
        let topMenu = null;

        if (this.props.base.hasMenu)
            topMenu = <TopMenu />;

        let popup = null;

        if (this.props.base.popup !== null)
        {
            popup = (
                <div className="popup-container">
                    {this.props.base.popup}
                </div>
            );
        }

        let mainContainers = <Watermark build={this.props.base.build} />;

        if (this.props.base.initialized && !this.props.base.ingame)
        {
            mainContainers = (
                <>
                    <AnimatedBackground />
                    <div id="app-container" className={this.props.base.hasBlur ? 'has-blur' : ''}>
                        <TopLeftActions onQuit={this.onQuit.bind(this)} onLogoutQuit={this.onLogoutQuit.bind(this)} />
                        {topMenu}
                        <TopRightActions/>
                        {this.props.children}
                        <div id="build-info">
                            {this.props.base.build !== null ? 'Build #' + this.props.base.build : 'Unknown Build'}
                        </div>
                    </div>
                    {popup}
                </>
            );
        }
        else if (this.props.base.initialized && this.props.settings.showPopup)
        {
            mainContainers = (
                <>
                    <AnimatedBackground />
                    <div id="app-container">
                        <SettingsPopup />
                    </div>
                </>
            );
        }

        let globalNotice = null;

        if (this.props.base.globalNotice !== null)
        {
            const noticeText = this.props.base.globalNotice.toString().trim();

            if (noticeText.length > 0)
            {
                globalNotice = <GlobalNotice notice={noticeText} />;
            }
        }

        return (
            <div id="ui-app">
                <FrameHell/>
                {mainContainers}
                <GameConsole/>
                {globalNotice}
            </div>
        );
    }

    onQuit()
    {
        this.props.setPopup(<QuitConfirmationPopup />);
    }

    onLogoutQuit()
    {
        this.props.setPopup(<LogoutQuitConfirmationPopup />);
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base,
        settings: state.settings,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: popup })
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
