import React, { Component } from 'react';

export default class FrameHell extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            frames: {}
        };
    }

    componentWillMount()
    {
        window.AddFrame = (name) =>
        {
            name = name.toLowerCase();

            if (name === 'main')
                return;

            if (name in this.state.frames)
                return;

            let count = Object.keys(this.state.frames).length;

            let frames = this.state.frames;
            frames[name] = { index: count, visible: true };

            this.setState({ frames: frames });
        };

        window.RemoveFrame = (name) =>
        {
            name = name.toLowerCase();

            if (!(name in this.state.frames))
                return;

            window.BringToFront(name);

            let frames = this.state.frames;
            delete frames[name];

            this.setState({ frames: frames });
        };

        window.HideFrame = (name) =>
        {
            name = name.toLowerCase();

            if (!(name in this.state.frames))
                return;

            let frames = this.state.frames;
            frames[name].visible = false;

            this.setState({ frames: frames });
        };

        window.ShowFrame = (name) =>
        {
            name = name.toLowerCase();

            if (!(name in this.state.frames))
                return;

            let frames = this.state.frames;
            frames[name].visible = true;

            this.setState({ frames: frames });
        };

        window.BringToFront = (name) =>
        {
            name = name.toLowerCase();

            if (!(name in this.state.frames))
                return;

            let frames = this.state.frames;

            for (let otherName in frames)
                if (frames[otherName].index > frames[name].index)
                    --frames[otherName].index;

            frames[name].index = Object.keys(this.state.frames).length - 1;

            this.setState({ frames: frames });
        };

        window.SendToBack = (name) =>
        {
            name = name.toLowerCase();

            if (!(name in this.state.frames))
                return;

            let frames = this.state.frames;

            for (let otherName in frames)
                if (frames[otherName].index < frames[name].index)
                    ++frames[otherName].index;

            frames[name].index = 0;

            this.setState({ frames: frames });
        };

        window.InjectJS = (name, script) =>
        {
            name = name.toLowerCase();

            if (!(name in this.state.frames))
                return;

            this.refs[name].contentWindow.postMessage(script, '*');
        };
    }

    render()
    {
        let iframes = [];
        
        for (let name in this.state.frames)
        {
            let frame = this.state.frames[name];
            iframes.push(<iframe src={'webui://' + name + '/'} ref={name} key={name} name={name} style={{ zIndex: frame.index, display: frame.visible ? 'block' : 'none' }} />);
        }

        return (
            <div id="frame-hell">
                {iframes}
            </div>
        );
    }
}
