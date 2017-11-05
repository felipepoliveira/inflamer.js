if(!RegExp.prototype.locate){
    /**
     * Search where an regex occurrence starts and ends in an given string.
     * @returns false - If the text does not match the regex
     * @returns array - where 0 is the start and 1 is the end index'
     */
    RegExp.prototype.locate = function(text){
        if(this.test(text)){
            let execResult = this.exec(text);
            let start = text.search(this);
            let end = start + execResult[0].length;
            return [start, end];
        }else{
            return false;
        }
    }
}



if(!CanvasRenderingContext2D.prototype.setFont){
    CanvasRenderingContext2D.prototype.setFont = function(family, size){
        this.font = size + " " + family;
        this.fontSize = size;

        //Extract only the font size number
        let locate = /\d+/.locate(size);
        if(locate){
            this.numericFontSize = Number(size.substring(locate[0], locate[1]));
        }else{
            this.numericFontSize = 10;
        }
        
    }
}

if(!CanvasRenderingContext2D.prototype.text){
    CanvasRenderingContext2D.prototype.text = function(text, px, py, maxWidth){
        let x = Number(px), y = Number(py);
        
        if(px === true){
            x = (Inflamer.width() -  this.measureText(text).width) / 2;
        }
        if(py === true){
            y = (Inflamer.height() / 2);
        }
        
        this.fillText(text, x, y, maxWidth);
    }
}