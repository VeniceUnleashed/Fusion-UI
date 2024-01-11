import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as ActionTypes from '../constants/ActionTypes'

class Credits extends Component
{
    render()
    {
        return (
            <div className="credits content-wrapper">
                <div className="credits-frame">
                    <div className="credits-container">
                        <h1>{this.props.base.productName}</h1>

                        <h2>Development Team</h2>
                        <h3>Orfeas "NoFaTe" Zafeiris</h3>
                        <h3>Allen "kiwidog" Thomas</h3>

                        <h2>Emulator Nexus Staff</h2>
                        <h3>Timse</h3>
                        <h3>Imposter</h3>
                        <h3>lujara</h3>
                        <h3>Paulofonta</h3>
                        <h3>Rodney</h3>

                        <h2>Emulator Nexus Moderators</h2>
                        <h3>death_stalker_ak47</h3>
                        <h3>Frankity</h3>
                        <h3>Freeshnik</h3>
                        <h3>MindFreak1987</h3>
                        <h3>zesty</h3>

                        <h2>Special Thanks</h2>
                        <h3>3ti65</h3>
                        <h3>berduu</h3>
                        <h3>Cel</h3>
                        <h3>DarkLord7854</h3>
                        <h3>FoolHen</h3>
                        <h3>Frankelstner</h3>
                        <h3>Hattiwatti</h3>
                        <h3>Morphicsn0w</h3>
                        <h3>NTAuthority</h3>
                        <h3>Powback</h3>
                        <h3>SkacikPL</h3>
                        <h3>Turntabliss</h3>
                        <h3>txt</h3>
                        <h3>XuluniX</h3>
                        <h3>slorgs</h3>

                        <h2>Third Party Software</h2>
                        <h3>
                            The Crypto++ Library<br/>
                            <span>cryptopp.com</span>
                        </h3>
                        <h3>
                            Chromium Embedded Framework<br/>
                            <span>bitbucket.org/chromiumembedded/cef</span>
                        </h3>
                        <h3>
                            Udis86<br/>
                            <span>udis86.sourceforge.net</span>
                        </h3>
                        <h3>
                            Lua<br/>
                            <span>lua.org</span>
                        </h3>
                        <h3>
                            LZHAM<br/>
                            <span>github.com/richgel999/lzham_codec</span>
                        </h3>
                        <h3>
                            MiniUPnP<br/>
                            <span>miniupnp.free.fr</span>
                        </h3>
                        <h3>
                            cpp-netlib<br/>
                            <span>cpp-netlib.org</span>
                        </h3>
                        <h3>
                            Poco C++ Libraries<br/>
                            <span>pocoproject.org</span>
                        </h3>
                        <h3>
                            RakNet<br/>
                            <span>jenkinssoftware.com</span>
                        </h3>
                        <h3>
                            RapidJSON<br/>
                            <span>rapidjson.org</span>
                        </h3>
                        <h3>
                            FastDelegate<br/>
                            <span>codeproject.com/KB/cpp/FastDelegate.aspx</span>
                        </h3>
                        <h3>
                            MinHook<br/>
                            <span>github.com/TsudaKageyu/minhook</span>
                        </h3>
                        <h3>
                            sol2<br/>
                            <span>github.com/ThePhD/sol2</span>
                        </h3>
                        <h3>
                            LZ4<br/>
                            <span>lz4.org</span>
                        </h3>
                        <h3>
                            libcurl<br/>
                            <span>curl.haxx.se/libcurl</span>
                        </h3>
                        <h3>
                            OpenSSL<br/>
                            <span>openssl.org</span>
                        </h3>
                        <h3>
                            libuv<br/>
                            <span>libuv.org</span>
                        </h3>
                        <h3>
                            Boost C++ Libraries<br/>
                            <span>boost.org</span>
                        </h3>
                        <h3>
                            breakpad<br/>
                            <span>chromium.googlesource.com/breakpad/breakpad</span>
                        </h3>
                        <h3>
                            SQLite<br/>
                            <span>sqlite.org</span>
                        </h3>
                        <h3>
                            pugixml<br/>
                            <span>pugixml.org</span>
                        </h3>
                        <h3>
                            zlib<br/>
                            <span>zlib.net</span>
                        </h3>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount()
    {
        this.props.disableBlur();
        this.props.enableMenu();
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base
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
    mapStateToProps,
    mapDispatchToProps
)(Credits);
