import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'

class MainMenu extends Component
{
    render()
    {
        let newsLeft = {
            title: "Please wait",
            description: "Fetching latest news...",
            link: "#",
        };

        let newsRight = {
            title: "Please wait",
            description: "Fetching latest news...",
            link: "#",
        };

        if (this.props.base.news !== null) {
            newsLeft = this.props.base.news.newsLeft;
            newsRight = this.props.base.news.newsRight;
        }

        return (
            <div className="main-menu content-wrapper">
                <div className="main-container left">
                    <a className="news-item" href={newsLeft.link} onClick={this.openNewsLink.bind(this, newsLeft.link)}>
                        <i className="material-icons">open_in_new</i>
                        <div className="news-description">
                            <h2>{newsLeft.title}</h2>
                            <h1>{newsLeft.description}</h1>
                        </div>
                    </a>
                </div>
                <div className="main-container right">
                    <a className="news-item secondary" href={newsRight.link} onClick={this.openNewsLink.bind(this, newsRight.link)}>
                        <i className="material-icons">open_in_new</i>
                        <div className="news-description">
                            <h2>{newsRight.title}</h2>
                            <h1>{newsRight.description}</h1>
                        </div>
                    </a>
                    {/*<a className="matchmake-btn">
                        <i className="material-icons">play_arrow</i>
                    </a>
                    <div className="matchmaking-container">
                        <h2>Selected Gamemodes</h2>
                        <h1>Conquest, Rush, TDM, SQDM, Squad Rush, Obliteration, Defuse, Domination, Air Superiority, CTF, Carrier Assault, Chain Link</h1>
                        <div className="bottom-actions">
                            <a>Matchmaking Preferences</a>
                        </div>
                    </div>*/}
                </div>
            </div>
        );
    }

    openNewsLink = (link, e) =>
    {
        if (e) {
            e.preventDefault();
        }

        if (link === '#') {
            return;
        }

        WebUI.Call('OpenLink', link);
    };

    componentDidMount()
    {
        this.props.disableBlur();
        this.props.enableMenu();
    }

    onQuit(e)
    {
        if (e)
            e.preventDefault();

        WebUI.Call('Quit');
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base,
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        disableBlur: () => {
            dispatch({ type: ActionTypes.SET_BLUR, blur: false })
        },
        enableMenu: () => {
            dispatch({ type: ActionTypes.SET_MENU, menu: true })
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(MainMenu);
