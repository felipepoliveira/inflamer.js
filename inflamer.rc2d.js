class InflamerRenderingContext2d{
    constructor(rc2d, conf){
        this._context = rc2d;
        //Font
        this.font = (conf && conf.font) ? conf.font : Inflamer.new.font("Consolas", "26px");
    }
    /**
     * Return the fill style of the rendering context
     */
    get fillStyle(){
        return this._context.fillStyle;
    }
    /**
     * @param String fs - The fill style
     */
    set fillStyle(fs){
        this._context.fillStyle = fs;
    }

    /**
     * Define the font that will be used in the rendering context
     * @param {InflamerFont} font - The font used in the rendering context
     */
    set font(font){
        this._font = font;
        this._context.font = font.toString(); //Convert the InflamerFont into rendering context font string
    }

    /**
     * The current font used in inflamer rendering context
     * @returns {InflamerFont}
     */
    get font(){
        return this._font;
    }

    /**
     * @return int The current alpha 
     */
    get alpha(){
        return this._context.globalAlpha;
    }
    set alpha(a){
        this._context.globalAlpha = a;
    }

    get compositeOperation(){
        return this._context.globalCompositeOperation;
    }
    set compositeOperation(co){
        this._context.globalCompositeOperation = co;   
    }

    get lineCap(){
        return this._context.lineCap;
    }
    set lineCap(lc){
        this._context.lineCap = lc;
    }

    get lineDashOffset(){
        return this._context.lineDashOffset;
    }

    set lineDashOffset(ldo){
        ths._context.lineDashOffset = ldo;
    }


    /**
     * Clear the current rendered graphics. If any parameters is passed in this method
     * it will clear all the canvas area
     * @param {int} x  - The horizontal start point of the cleared area
     * @param {int} y  - The vertical start point of the cleared area
     * @param {int} w  - The width of the clear area
     * @param {int} h  - The height of the clear area
     */
    clear(x, y, w, h){
        if(!x){
            this._context.clearRect(0, 0, Inflamer.width(), Inflamer.height());
        }else{
            this._context.clearRect(x, y, w, h);
        }
    }

    rect(x, y, w, h){
        //If point variable (x, y) is not set, set all to 0
        //If size varables (w, h) is not set, set to canvas size
        if(!x) x = 0;
        if(!y) y = 0;
        if(!w) w = Inflamer.width();
        if(!h) h = Inflamer.height();

        this._context.fillRect(x, y, w, h);
    }

    text(text, x, y, maxWidth){
        
        
        if(x === true){
            x = (Inflamer.width() - this.textWidth(text)) / 2;
        }

        if(y === true){
            y = (Inflamer.height() - this.font.size) / 2;
        }
        
        y += this.font.size;

        this._context.fillText(text, x, y, maxWidth);
    }

    textWidth(text){
        return this._context.measureText(text).width;
    }
}