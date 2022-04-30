import React, { Component } from 'react';

export default class AnimatedBackground extends Component
{
    constructor(props)
    {
        super(props);

        this.shouldRender = false;
        this.img = null;

        this.iteration = 0;
        this.totalIterations = 800;
    }

    render()
    {
        return (
            <canvas ref="finalCanvas" id="animated-background">
            </canvas>
        );
    }

    componentDidMount()
    {
        this.shouldRender = true;


        this.img = new Image();
        this.img.onload = () =>
        {
            window.requestAnimationFrame(() => this.onRender());
        };

        this.img.src = '/assets/img/background.png';
    }

    componentWillUnmount()
    {
        this.shouldRender = false;
    }

    onRender()
    {
        if (!this.shouldRender)
            return;

        let width = document.body.offsetWidth;
        let height = document.body.offsetHeight;

        // Paint the blur regions in our final canvas.
        let finalCanvas = this.refs.finalCanvas;
        let finalContext = finalCanvas.getContext('2d');

        if (finalCanvas.width != width)
            finalCanvas.width = width;

        if (finalCanvas.height != height)
            finalCanvas.height = height;

        let imgRatio = this.img.width / this.img.height;
        let viewportRatio = width / height;

        let finalWidth = this.img.width;
        let finalHeight = this.img.height;
        let imgTop = 0;
        let imgLeft = 0;

        if (viewportRatio > imgRatio)
        {
            // Scale based on width.
            let scaleRatio = (width * 1.3) / this.img.width;
            finalWidth *= scaleRatio;
            finalHeight *= scaleRatio;

            imgTop = -(finalHeight - height) / 2.0;
        }
        else
        {
            // Scale based on height.
            let scaleRatio = (height * 1.3) / this.img.height;
            finalWidth *= scaleRatio;
            finalHeight *= scaleRatio;

            imgLeft = -(finalWidth - width) / 2.0;
        }

        var xOffset = 0;
        var yOffset = 0;

        var xStep = -0.1157407407407407 * height; // -125px
        var xStart = -0.0925925925925926 * height; // -100px
        var xEnd = xStart + xStep;

        var yStep = -0.0462962962962963 * height; // -50px
        var yStart = -0.0925925925925926 * height; // -100px
        var yEnd = yStart + yStep;

        if (this.iteration >= this.totalIterations)
        {
            xOffset = this.easeInOutCubic(this.iteration - this.totalIterations, this.totalIterations, xEnd, -xStep);
            yOffset = this.easeInOutCubic(this.iteration - this.totalIterations, this.totalIterations, yEnd, -yStep);
        }
        else
        {
            xOffset = this.easeInOutCubic(this.iteration, this.totalIterations, xStart, xStep);
            yOffset = this.easeInOutCubic(this.iteration, this.totalIterations, yStart, yStep);
        }

        finalContext.drawImage(this.img, imgLeft + xOffset, imgTop + yOffset, finalWidth, finalHeight);

        if (this.iteration > this.totalIterations * 2)
            this.iteration = 0;
        else
            this.iteration += 0.5;

        window.requestAnimationFrame(() => this.onRender());
    }

    easeInOutCubic(time, duration, valueStart, valueEnd)
    {
        return -valueEnd/2 * (Math.cos(Math.PI*time/duration) - 1) + valueStart;
    }
}