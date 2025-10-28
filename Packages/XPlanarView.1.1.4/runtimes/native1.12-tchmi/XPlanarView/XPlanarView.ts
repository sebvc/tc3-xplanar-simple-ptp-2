/*
 * Generated 4/22/2024 7:55:39 AM
 * Copyright (C) 2024
 */

type TileData = import('XPlanarViewTypes').TileData;
type MoverVector = import('XPlanarViewTypes').MoverVector;
type MoverInfo = import('XPlanarViewTypes').MoverInfo;
type StationData = import('XPlanarViewTypes').StationData;

module TcHmi {
    export module Controls {
        export module XPlanarView {
            export class XPlanarView extends TcHmi.Controls.System.TcHmiControl {

                /*
                Attribute philosophy
                --------------------
                - Local variables are not set in the class definition, so they have the value 'undefined'.
                - During compilation, the Framework sets the value that is specified in the HTML or in the theme (possibly 'null') via normal setters.
                - Because of the "changed detection" in the setter, the value is only processed once during compilation.
                - Attention: If we have a Server Binding on an Attribute, the setter will be called once with null to initialize and later with the correct value.
                */

                /**
                 * Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);

                    // bind event listener callback to current instance
                    this.__handleImageLoad = this.__handleImageLoad.bind(this);
                    this.__handleImageError = this.__handleImageError.bind(this);
                }

                protected __elementTemplateRoot!: JQuery;
                protected __tileCanvas: HTMLCanvasElement;
                protected __tileCtx: CanvasRenderingContext2D;
                protected __moverCanvas: HTMLCanvasElement;
                protected __moverCtx: CanvasRenderingContext2D;
                protected __stationCanvas: HTMLCanvasElement;
                protected __stationCtx: CanvasRenderingContext2D;

                protected __tileConfig: Array<TileData>;
                protected __moverInfo: Array<MoverInfo>;
                protected __moverVectorSymbol: Symbol;
                protected __moverVectorData: Array<MoverVector>;
                protected __scaleToFit: boolean;
                protected __refreshRate: number;
                protected __stationLayout: Array<StationData>;
                protected __vectorSubscriptionId: number | null;
                protected __rotate: boolean | null;

                protected __moverImg: HTMLImageElement;
                protected __resizeEventDestroyFunction: any;

                /**
                 * Raised after the control was added to the control cache and the constructors of all base classes were called.
                 */
                public __previnit() {

                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_XPlanarView_XPlanarView-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }

                    this.__createCanvas();

                    // if control is resized in designer, update canvas as well
                    this.__resizeEventDestroyFunction = TcHmi.EventProvider.register(
                        this.__id + '.onResized',
                        this.__resizeCanvas()
                    );

                    // initialize mover image
                    this.__moverImg = new Image();
                    this.__moverImg.src = 'XPlanarView/XPlanarView/Images/XPlanarMover.png';

                    // Call __previnit of base class
                    super.__previnit();

                }

                /**
                 * Is called during control initialization after the attribute setters have been called. 
                 * @returns {void}
                 */
                public __init() {
                    super.__init();

                    // check if image successfully loads or not and set img class for later reference
                    this.__moverImg.addEventListener('load', this.__handleImageLoad);
                    this.__moverImg.addEventListener('error', this.__handleImageError);
                }

                /**
                 * Is called by the system after the control instance is inserted into the active DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                public __attach() {

                    super.__attach();

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */

                    if (TCHMI_DESIGNER) {
                        const designerMessage = document.createElement('div');
                        designerMessage.classList.add("tchmi-designer-control-message")
                        designerMessage.innerHTML = 'XPlanar View - Enter live-view to see configuration';
                        this.__element[0].appendChild(designerMessage)
                    }

                }

                /**
                 * Is called by the system when the control instance is no longer part of the active DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                public __detach() {
                    super.__detach();

                    /**
                     * Disable everything that is not needed while the control is not part of the active DOM.
                     * For example, there is usually no need to listen for events!
                     */
                    this.__resizeEventDestroyFunction = null;
                    this.__unsubscribeVectorData();
                }

                /**
                 * Destroy the current control instance. 
                 * Will be called automatically if system destroys control!
                 */
                public destroy() {
                    /**
                     * Ignore while __keepAlive is set to true.
                     */
                    if (this.__keepAlive) {
                        return;
                    }

                    super.destroy();

                    /**
                     * Free resources like child controls etc.
                     */
                }


                // Type guard functions 
                protected __validateTileData(obj: any): obj is TileData {

                    return (
                        typeof obj === 'object' &&
                        'X' in obj &&
                        typeof obj.X === 'number' &&
                        'Y' in obj &&
                        typeof obj.Y === 'number' &&
                        'Width' in obj &&
                        typeof obj.Width === 'number' &&
                        'Height' in obj &&
                        typeof obj.Height === 'number'
                    );

                }

                protected __validateMoverVector(obj: any): obj is MoverVector {

                    return (
                        typeof obj === 'object' &&
                        'x' in obj &&
                        typeof obj.x === 'number' &&
                        'y' in obj &&
                        typeof obj.y === 'number' &&
                        'z' in obj &&
                        typeof obj.z === 'number' &&
                        'c' in obj &&
                        typeof obj.c === 'number'
                    );

                }

                protected __validateMoverInfo(obj: any): obj is MoverInfo {

                    return (
                        typeof obj === 'object' &&
                        'Width' in obj &&
                        typeof obj.Width === 'number' &&
                        'Height' in obj &&
                        typeof obj.Height === 'number' &&
                        'MoverBTN' in obj &&
                        typeof obj.MoverBTN === 'string'
                    );

                }

                protected __validateStationData(obj: any): obj is StationData {

                    return (
                        typeof obj === 'object' &&
                        'X' in obj &&
                        typeof obj.X === 'number' &&
                        'Y' in obj &&
                        typeof obj.Y === 'number' &&
                        'Width' in obj &&
                        typeof obj.Width === 'number' &&
                        'Height' in obj &&
                        typeof obj.Height === 'number'
                    );

                }


                // Canvas handling
                protected __createCanvas() {

                    this.__tileCanvas = document.createElement('canvas');
                    this.__tileCanvas.id = this.__id + '_tileCanvas';

                    this.__moverCanvas = document.createElement('canvas');
                    this.__moverCanvas.id = this.__id + '_moverCanvas';

                    this.__stationCanvas = document.createElement('canvas');
                    this.__stationCanvas.id = this.__id + '_stationCanvas';

                    this.__tileCtx = this.__tileCanvas.getContext('2d') as CanvasRenderingContext2D;
                    this.__moverCtx = this.__moverCanvas.getContext('2d') as CanvasRenderingContext2D;
                    this.__stationCtx = this.__stationCanvas.getContext('2d') as CanvasRenderingContext2D;

                    // match canvas size to control size
                    this.__resizeCanvas();

                    this.__elementTemplateRoot.append(this.__tileCanvas);
                    this.__elementTemplateRoot.append(this.__moverCanvas);
                    this.__elementTemplateRoot.append(this.__stationCanvas);

                }

                protected __resizeCanvas() {

                    return (e: any) => {
                        const height: number = this.getRenderedHeight() || 0;
                        const width: number = this.getRenderedWidth() || 0;

                        this.__tileCanvas.height = height;
                        this.__tileCanvas.width = width;
                        this.__moverCanvas.height = height;
                        this.__moverCanvas.width = width;
                        this.__stationCanvas.height = height;
                        this.__stationCanvas.width = width;

                        // update tiles, movers, and stations
                        this.__handleTileGrid();
                        this.__handleMoverLayout();
                        this.__handleStationLayout();
                    }

                }


                // Tile handling
                protected __handleTileGrid() {

                    //@ts-ignore because tsc isn't aware of reset method
                    this.__tileCtx.reset();

                    // move origin to bottom left and flip y-axis
                    // to reproduce standard cartesean coordinate system
                    this.__tileCtx.translate(0, this.__tileCanvas.height);
                    this.__rotateCanvas();
                    this.__setCanvasScale();

                    // draw tiles based on tileConfig array
                    this.__tileConfig?.forEach(tile => {
                        this.__tileCtx.fillStyle = 'white';
                        this.__tileCtx.fillRect(tile.X, tile.Y, tile.Width, tile.Height);

                        this.__tileCtx.lineWidth = 0.1;
                        this.__tileCtx.strokeRect(tile.X, tile.Y, tile.Width, tile.Height);
                    });

                }

                public setTileConfig(valueNew: Array<TileData>): void {

                    // check if the value is valid
                    if (valueNew === null) {
                        // if we have no value to set we have to fall back to the defaultValueInternal from description.json
                        valueNew = this.getAttributeDefaultValueInternal('TileConfig') as Array<TileData>;
                    }

                    if (tchmi_equal(valueNew, this.__tileConfig)) {
                        // skip processing when the value has not changed
                        return;
                    }

                    // remember the new value
                    this.__tileConfig = valueNew;

                    // inform the system that the function has a changed result.
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'TileConfig' });

                    // call process function to process the new value
                    this.__processTileConfig();
                }

                public getTileConfig() {
                    return this.__tileConfig;
                }

                protected __processTileConfig() {

                    if (this.__validateTileData(this.__tileConfig[0]) || this.__tileConfig.length === 0) {
                        this.__handleTileGrid();
                        this.__processStationLayout();
                    } else {
                        throw new Error('Tile Config data must match below naming - \n { \n\tX: number, \n\tY: number, \n\tWidth: number, \n\tHeight: number \n }');
                    }

                }


                // Mover handling
                protected __rotateMover(context: CanvasRenderingContext2D, mover: MoverVector) {

                    // convert degrees to radians
                    const radians = mover.c * Math.PI / 180;

                    // transform origin to mover center, rotate, then transform origin back
                    context.translate(mover.x, mover.y);
                    context.rotate(radians);
                    context.translate(-mover.x, -mover.y);

                }

                protected __handleImageLoad() {

                    // update class list
                    this.__moverImg?.classList?.remove('moverFallback');
                    this.__moverImg?.classList?.add('moverImage');

                    // draw movers
                    this.__handleMoverLayout();

                }

                protected __handleImageError() {

                    // update class list
                    this.__moverImg?.classList?.remove('moverImage');
                    this.__moverImg?.classList?.add('moverFallback');

                    // notify user image failed to load
                    console.error('Mover image not found - drawing rectangles as fallback.');

                    // draw movers
                    this.__handleMoverLayout();

                }

                protected __handleMoverLayout() {

                    // if moverInfo is undefined or empty, skip processing
                    if (!this.__moverInfo || this.__moverInfo.length === 0) {
                        return;
                    }

                    //@ts-ignore because tsc isn't aware of reset method
                    this.__moverCtx.reset();

                    // move origin to bottom left and flip y-axis
                    // to reproduce standard cartesean coordinate system
                    this.__moverCtx.translate(0, this.__moverCanvas.height);
                    this.__rotateCanvas();
                    this.__setCanvasScale();

                    // draw movers based on moverVectorData and references to moverInfo
                    this.__moverVectorData?.forEach((mover, index) => {

                        // save context state
                        this.__moverCtx.save();

                        // retrieve mover dimensions based on current index
                        const moverW = this.__moverInfo[index].Width;
                        const moverH = this.__moverInfo[index].Height;

                        // translate x, y pair to be mover's center
                        const moverX = mover.x - moverW / 2;
                        const moverY = mover.y - moverH / 2;

                        // if rotation coordinate is non-zero, handle rotation
                        if (mover.c !== 0) {
                            this.__rotateMover(this.__moverCtx, mover);
                        }

                        // check if mover image loaded successfully
                        if (this.__moverImg.classList.contains('moverImage')) {

                            // draw mover outline
                            this.__moverCtx.strokeStyle = '#000000';
                            this.__moverCtx.beginPath();
                            this.__moverCtx.roundRect(moverX, moverY, moverW, moverH, [19]);
                            this.__moverCtx.fillStyle = '#000000';
                            this.__moverCtx.fill();
                            this.__moverCtx.stroke();

                            // draw mover image
                            this.__moverCtx.drawImage(this.__moverImg, moverX, moverY, moverW - 0.5, moverH - 0.5);

                        } else {

                            // draw mover edges
                            this.__moverCtx.strokeStyle = '#414345';
                            this.__moverCtx.beginPath();
                            this.__moverCtx.roundRect(moverX, moverY, moverW, moverH, [20]);
                            this.__moverCtx.fillStyle = '#414345';
                            this.__moverCtx.fill();
                            this.__moverCtx.stroke();

                            // draw mover 
                            this.__moverCtx.strokeStyle = '#E2E6EA';
                            this.__moverCtx.beginPath();
                            this.__moverCtx.roundRect(moverX+7, moverY+7, moverW-14, moverH-14, [5]);
                            this.__moverCtx.fillStyle = '#E2E6EA';
                            this.__moverCtx.fill();
                            this.__moverCtx.stroke();

                        }

                        // restore context to save state
                        this.__moverCtx.restore();

                    });

                }

                public setMoverInfo(valueNew: Array<MoverInfo>): void {

                    // check if the value is valid
                    if (valueNew === null) {
                        // if we have no value to set we have to fall back to the defaultValueInternal from description.json
                        valueNew = this.getAttributeDefaultValueInternal('MoverInfo') as Array<MoverInfo>;
                    }

                    if (tchmi_equal(valueNew, this.__moverInfo)) {
                        // skip processing when the value has not changed
                        return;
                    }

                    // remember the new value
                    this.__moverInfo = valueNew;

                    // inform the system that the function has a changed result.
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'MoverInfo' });

                    // call process function to process the new value
                    this.__processMoverInfo();
                }

                public getMoverInfo() {
                    return this.__moverInfo;
                }

                protected __processMoverInfo() {

                    if (this.__validateMoverInfo(this.__moverInfo[0]) || this.__moverInfo.length === 0) {
                        this.__handleMoverLayout();
                    } else {
                        throw new Error('Mover Info data must match below naming - \n { \n\tWidth: number, \n\tHeight: number, \n\tMoverBTN: string \n }');
                    }
                }

                protected __subscribeVectorData() {

                    // remove any existing subscription 
                    this.__unsubscribeVectorData();

                    let commands: Server.ICommand[] = [
                        {
                            'symbol': this.__moverVectorSymbol?.getExpression().getName() as string
                        }
                    ];

                    this.__vectorSubscriptionId = TcHmi.Server.subscribeEx(commands, this.__refreshRate, { timeout: 2000 }, (data) => {
                        if (data.error !== TcHmi.Errors.NONE) {
                            // Handle TcHmi.Server class level error here.
                            return;
                        }

                        let response = data.response;
                        if (!response || response.error !== undefined) {
                            // Handle TwinCAT HMI Server response level error here.
                            return;
                        }

                        let commands = response.commands;
                        if (commands === undefined) {
                            return;
                        }

                        for (let i = 0, ii = commands.length; i < ii; i++) {
                            let command = commands[i];
                            if (command === undefined) {
                                return;
                            }
                            if (command.error !== undefined) {
                                // Handle TwinCAT HMI Server command level error here.
                                return;
                            }

                            // Handle result...
                            TcHmi.Log.debugEx(command.symbol, ':', command.readValue);

                            // update mover layout when server responds with new data
                            this.__setMoverVectorData(commands[i].readValue);
                        }
                    });

                }

                protected __unsubscribeVectorData() {

                    if (this.__vectorSubscriptionId === null) {
                        return;
                    }

                    TcHmi.Server.unsubscribeEx(this.__vectorSubscriptionId, { timeout: 2000 });

                }

                public setMoverVectorData(valueNew: Symbol) {

                    if (tchmi_equal(valueNew, this.__moverVectorSymbol)) {
                        // skip processing when the value has not changed
                        return;
                    }

                    // remember the new value
                    this.__moverVectorSymbol = valueNew;

                    // initiate subscription to server symbol
                    this.__subscribeVectorData();

                }

                protected __setMoverVectorData(valueNew: Array<MoverVector>): void {

                    // check if the value is valid
                    if (valueNew === null) {
                        // if we have no value to set we have to fall back to the defaultValueInternal from description.json
                        valueNew = this.getAttributeDefaultValueInternal('MoverVectorData') as Array<MoverVector>;
                    }

                    if (tchmi_equal(valueNew, this.__moverVectorData)) {
                        // skip processing when the value has not changed
                        return;
                    }

                    // remember the new value
                    this.__moverVectorData = valueNew;

                    // inform the system that the function has a changed result.
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'MoverVectorData' });

                    // call process function to process the new value
                    this.__processMoverVectorData();

                }

                public getMoverVectorData() {
                    return this.__moverVectorData;
                }

                protected __processMoverVectorData() {

                    if (this.__validateMoverVector(this.__moverVectorData[0]) || this.__moverVectorData.length === 0) {
                        this.__handleMoverLayout();
                    } else {
                        throw new Error('Mover Vector data must match below naming - \n { \n\tx: number, \n\ty: number, \n\tc: number \n }');
                    }

                }

                public setRefreshRate(valueNew: number): void {

                    // check if the value is valid
                    if (valueNew === null) {
                        // if we have no value to set we have to fall back to the defaultValueInternal from description.json
                        valueNew = this.getAttributeDefaultValueInternal('RefreshRate') as number;
                    }

                    if (tchmi_equal(valueNew, this.__refreshRate)) {
                        // skip processing when the value has not changed
                        return;
                    }

                    // remember the new value
                    this.__refreshRate = valueNew;

                    // inform the system that the function has a changed result.
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'RefreshRate' });

                    // call process function to process the new value
                    this.__processRefreshRate();
                }

                public getRefreshRate() {
                    return this.__refreshRate;
                }

                protected __processRefreshRate() {
                    this.__subscribeVectorData();
                }



                // Station handling
                protected __handleStationLayout() {

                    //@ts-ignore because tsc isn't aware of reset method
                    this.__stationCtx.reset();

                    // move origin to bottom left and flip y-axis
                    // to reproduce standard cartesean coordinate system
                    this.__stationCtx.translate(0, this.__stationCanvas.height);
                    this.__rotateCanvas();
                    this.__setCanvasScale();

                    // draw stations based on stationLayout array
                    this.__stationLayout?.forEach((station, index) => {

                        // retirieve station dimensions based on current index
                        const stationW = this.__stationLayout[index].Width;
                        const stationH = this.__stationLayout[index].Height;

                        // translate x, y pair to be station's center
                        const stationX = station.X - stationW / 2;
                        const stationY = station.Y - stationH / 2;

                        this.__stationCtx.lineWidth = 3;
                        this.__stationCtx.strokeStyle = '#54556F';
                        this.__stationCtx.strokeRect(stationX, stationY, station.Width, station.Height);

                    });

                }

                public setStationLayout(valueNew: Array<StationData>): void {

                    // check if the value is valid
                    if (valueNew === null) {
                        // if we have no value to set we have to fall back to the defaultValueInternal from description.json
                        valueNew = this.getAttributeDefaultValueInternal('StationLayout') as Array<StationData>;
                    }

                    if (tchmi_equal(valueNew, this.__stationLayout)) {
                        // skip processing when the value has not changed
                        return;
                    }

                    // remember the new value
                    this.__stationLayout = valueNew;

                    // inform the system that the function has a changed result.
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'StationLayout' });

                    // call process function to process the new value
                    this.__processStationLayout();
                }

                public getStationLayout() {
                    return this.__stationLayout;
                }

                protected __processStationLayout() {

                    if (this.__validateStationData(this.__stationLayout[0]) || this.__stationLayout.length === 0) {
                        this.__handleStationLayout();
                    } else {
                        throw new Error('Station Layout data must match below naming - \n { \n\tX: number, \n\tY: number, \n\tWidth: number, \n\tHeight: number \n }');
                    }

                }


                // Canvas scaling
                protected __getTrackDimensions() {

                    let minX: number, minY: number, maxX: number, maxY: number, maxW: number, maxH: number;
                    minX = minY = maxX = maxY = maxW = maxH = 0;

                    // find min and max coordinates of all tiles and width/height of max
                    this.__tileConfig?.forEach(tile => {
                        if (tile.X <= minX) {
                            minX = tile.X;
                        }
                        if (tile.Y <= minY) {
                            minY = tile.Y;
                        }
                        if (tile.X >= maxX) {
                            maxX = tile.X;
                            maxW = tile.Width;
                        }
                        if (tile.Y >= maxY) {
                            maxY = tile.Y;
                            maxH = tile.Height;
                        }
                    });

                    // determine dimensions of track's bounding rectangle based on these values
                    const trackWidth = minX + maxX + maxW;
                    const trackHeight = minY + maxY + maxH;

                    return { trackWidth, trackHeight };

                }

                protected __setCanvasScale() {

                    // default scale 1, ie one pixel to mm
                    let scale = 1;
                    let scaleX = scale;
                    let scaleY = scale;

                    // if scaleToFit property is active, update canvas scaling factor
                    if (this.__scaleToFit) {
                        const canvasWidth = this.getRenderedWidth() || 0;
                        const canvasHeight = this.getRenderedHeight() || 0;
                        const trackDimensions = this.__getTrackDimensions();

                        // calculate scaling factors
                        if (this.__rotate) {
                            // if rotated, what was the height is now the width and vice versa
                            scaleX = canvasWidth / trackDimensions.trackHeight;
                            scaleY = canvasHeight / trackDimensions.trackWidth; 
                        } else {
                            scaleX = canvasWidth / trackDimensions.trackWidth;
                            scaleY = canvasHeight / trackDimensions.trackHeight;
                        }

                        // use smallest scaling factor so track fits perfectly
                        scale = Math.min(scaleX, scaleY);

                    }

                    // scale each canvas accordingly
                    this.__tileCtx.scale(scale, scale * -1);
                    this.__moverCtx.scale(scale, scale * -1);
                    this.__stationCtx.scale(scale, scale * -1);
                }

                public setScaleToFit(valueNew: boolean): void {

                    // convert the value with the value converter
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);

                    // check if the converted value is valid
                    if (convertedValue === null) {
                        // if we have no value to set we have to fall back to the defaultValueInternal from description.json
                        convertedValue = this.getAttributeDefaultValueInternal('ScaleToFit') as boolean;
                    }

                    if (tchmi_equal(valueNew, this.__scaleToFit)) {
                        // skip processing when the value has not changed
                        return;
                    }

                    // remember the new value
                    this.__scaleToFit = valueNew;

                    // inform the system that the function has a changed result.
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'ScaleToFit' });

                    // call process function to process the new value
                    this.__processScaleToFit();
                }

                public getScaleToFit() {
                    return this.__scaleToFit;
                }

                protected __processScaleToFit() {

                    // call tile, mover, and station handlers to update each canvas
                    this.__handleTileGrid();
                    this.__handleMoverLayout();
                    this.__handleStationLayout();

                }


                // Rotate Canvas
                protected __rotateCanvas() {

                    if (this.__rotate) {

                        // convert 90 degrees to radians
                        const radians = 90 * Math.PI / 180;

                        // get track and canvas dimensions
                        const trackDimensions = this.__getTrackDimensions();
                        const canvasHeight = this.getRenderedHeight() || 0;

                        // if scaling is active calculate the scale to use
                        const scale = this.__scaleToFit ? canvasHeight / trackDimensions.trackWidth : 1;

                        // rotate and translate tiles movers and stations
                        this.__tileCtx.rotate(radians);
                        this.__tileCtx.translate(-trackDimensions.trackWidth * scale, 0);

                        this.__moverCtx.rotate(radians);
                        this.__moverCtx.translate(-trackDimensions.trackWidth * scale, 0);

                        this.__stationCtx.rotate(radians);
                        this.__stationCtx.translate(-trackDimensions.trackWidth * scale, 0);

                    }

                }

                public setRotate(valueNew: boolean): void {

                    // convert the value with the value converter
                    let convertedValue = TcHmi.ValueConverter.toBoolean(valueNew);

                    // check if the converted value is valid
                    if (convertedValue === null) {
                        // if we have no value to set we have to fall back to the defaultValueInternal from description.json
                        convertedValue = this.getAttributeDefaultValueInternal('Rotate') as boolean;
                    }

                    if (tchmi_equal(valueNew, this.__rotate)) {
                        // skip processing when the value has not changed
                        return;
                    }

                    // remember the new value
                    this.__rotate = valueNew;

                    // inform the system that the function has a changed result.
                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'Rotate' });

                    // call process function to process the new value
                    this.__processRotate();
                }

                public getRotate() {
                    return this.__rotate;
                }

                protected __processRotate() {

                    // call tile, mover, and station handlers to update each canvas
                    this.__handleTileGrid();
                    this.__handleMoverLayout();
                    this.__handleStationLayout();

                }

            }
        }
    }
}

/**
 * Register Control
 */
TcHmi.Controls.registerEx('XPlanarView', 'TcHmi.Controls.XPlanarView', TcHmi.Controls.XPlanarView.XPlanarView);
