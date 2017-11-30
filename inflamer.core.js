/**
 * The Inflamer engine object.
 * This object contains the method that covers the basic functionalities of the canvas engine
 * @author Felipe Pereira de Oliveira
 */
var Inflamer = {

    fitToScreen : function(){
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    },

    disableContextMenu : function(){
        this._canvas.oncontextmenu  = function(){
            console.log("contes");
            return false;
        }
    },

    new : {
        /**
         * Create an new InflamerFont object
         * @param {string} f - The font family: "Arial", "Conslas", etc.
         * @param {string} s - The font size with the font unit: "38px".
         */
        font : function(f, s){
            return new InflamerFont(f , s);
        },
    },

    fullScreen : function(){
        window.addEventListener('resize', function (){
            Inflamer.fitToScreen();
        });

        this._canvas.style.position = "fixed";
        this._canvas.style.left = "0px";
        this._canvas.style.top = "0px";
        this.fitToScreen();
        this.loadGraphicsContext();
    },

    frames : function(){
        return this._frames;
    },

    //Logging
    msgPrefix : "[Inflamer.JS]: ",
    error : function(msg){ console.error(this.msgPrefix + msg); },
    log : function(msg){console.log(this.msgPrefix + msg);},
    throw : function(msg){ throw this.msgPrefix + msg;},

    /**
     * Store log functions
     */
    logs : {
        startLog : function(){
            Inflamer.log("The engine has started.");
            console.log("----------Inflamer Data----------");
            Inflamer.log("Base fps: " + Inflamer._baseFps);
            Inflamer.log("Delta: " + Inflamer._delta);
            Inflamer.log("Canvas: ");
            console.log(Inflamer._canvas);
            console.log("---------------------------------");
        }
    },

    loadGraphicsContext : function(){
        let ctx2d = this._canvas.getContext("2d");
        this._context = new InflamerRenderingContext2d(ctx2d);
    },

    /**
     * Start the canvas engine. This will initialize the engine interval object that will control the
     * canvas loop.
     * @param Canvas canvas - The canvas element that will be controlled by the Inflamer engine
     * @param object conf - The initial configuration of the engine in an javascript object
     */
    start : function(canvas, conf){
        this._canvas = canvas;
        this.loadGraphicsContext();
        this._frames = 0;
        this._fullScreen = false;
        this._running = true;
        this._loaded = true;
        this._scene = null;

        //Events
        this.events = {
            key : new InflamerKeyEvent(),
        };
        
        //The configuration properties
        this._baseFps = (conf && conf.baseFps) ? conf.baseFps : 60;
        this._onProduction = (conf && conf.onProduction) ? conf.onProduction : false;

        //Post configuration properties
        this._delta = 1000 / this._baseFps;
        
        //Configurations routines
        if(conf.disableContextMenu || conf.disableContextMenu !== false){
            this.disableContextMenu();
        }
        if(conf.fullScreen){
            this.fullScreen();
        }
        if(conf.scene){
            this.scene(scene);
        }else{
            this.scene(_InflamerDefaultScene);
        }

        this._interval = setInterval(this._loop, this._delta);

        if(!this._onProduction && this.logs.startLog());
    },

    /**
     * Define or return the current scene handled by the engine
     * @param Scene s - [optional] - If the scene is passed in the arguments of the method the scene will be defined, otherwise the current
     * scene will be returned
     * @returns Scene|false
     */
    scene : function(s){
        if(s){
            this._scene = s;
            return false;
        }else{
            return this._scene;
        }
    },

    //Loop control
    _loop : function(){
        if(Inflamer._running){
            Inflamer._frames++;

            Inflamer._render(Inflamer._context, Inflamer);
            Inflamer._update(Inflamer);
            
            //Reset the frame counter
            if(Inflamer._frames === Inflamer._baseFps){
                Inflamer._frames = 0;
            }
        }
    },

    _render : function(ctx, engine){
        //Clear the canvas area
        ctx.clear();
        if(this._scene){
            this._scene.render(ctx, engine);
        }
    },

    _update : function(engine){
        if(this._scene){
            this._scene.update(engine);
        }
    },

    /**
     * Pause the engine loop. It can be resumed again calling the Inflamer.resume() method
     */
    pause : function(){
        if(this._loaded){
            if(!this._running && !this._onProduction){
                this.log("The engine has paused the loop");
            }
            this._running = false;
        }else{
            this.throw("Error: trying to pause the engine when it was not loaded. Use Inflamer.start() before using Inflamer.pause()")
        }
    },

    /**
     * Start the engine loop. When the Inflamer.start() method is called the loop is automatically started, so there is
     * no need to call this method after calling Inflamer.start() to start the game loop. This method has only to be called
     * when the Inflamer.pause() method is called
     */
    resume : function(){
        if(this._loaded){
            if(!this._running && !this._onProduction){
                this.log("The engine has resumed the loop");
            }

            this._running = true;
        }else{
           this.throw("Error: trying to resume the engine when it was not loaded.  Use Inflamer.start() before using Inflamer.resume().");
        }
    },

    stop : function(){
        if(this._loaded){
            this._running = false;
            this._interval.clear();
            if(!this._onProduction){
                this.error("The engine has stopped");
            }
        }
    },

    //Sizing
    height : function(){
        return this._canvas.height;
    },

    width : function(){
        return this._canvas.width;
    }

    ,
};

/**
 * Represent an font that is used inside the application. The instance of this object
 * must be created with Inflamer.font function
 * @see Inflamer.font
 */
class InflamerFont{
    constructor(family, size){
        if(!family) throw "You must specify an valid font family. \"" + family + "\" given.";

        this._fontFamily = family;
        this._fontSize = size || 10;
        this._fontSizeUnit = "px";

        if(size){
            let locate;

            //Font size
            locate = this.sizeRegex.locate(size);
            if(locate){
                this._fontSize = Number(size.substring(locate[0], locate[1]));
            }

            //Font unit
            locate = this.sizeUnitRegex.locate(size);
            if(locate){
                this._fontSizeUnit = size.substring(locate[0], locate[1]);
            }
        }
    }

    get family(){
        return this._fontFamily;
    }

    get size(){
        return this._fontSize;
    }

    get unit(){
        return this._fontSizeUnit;
    }

    get sizeRegex(){
        return /\d+/;
    }

    get sizeUnitRegex(){
        return /[a-zA-Z]+/;
    }

    toString(){
        return this._fontSize + this._fontSizeUnit + " " + this._fontFamily;
    }
}

function Entity(){
    /**
     * Update the logic data of the entity into the engine loop
     * @param Inflamer engine
     */
    this.update = function(engine){};

    /**
     * Update the graphical data of the entity into the engine loop
     * @param CanvasRenderingContext2d ctx
     * @param Inflamer engine
     */
    this.render = function(ctx, engine){};

    this._x = 0;
    this._y = 0;
    this._direction = Vector2d.iddle();

    this.x = function(x){
        if(x){
            this_.x = x;
        }else{
            return this._x;
        }
    }

    this.y = function(y){
        if(y){
            this_.y = y;
        }else{
            return this._y;
        }
    }
}

/**
 * The scene prototype store the state of the engine. When an State is defined in Inflamer.state($state) the engine will call the
 * Scene.update() and the Scene.render() methods in the engine loop. The canvas must be handled inside this two methods
 * @param function cb - Call the load callback
 * @author Felipe Pereira de Oliveira
 */
function Scene(cb){
    this.entities = [];
    /**
     * Update the logical data from the scene
     * @param Inflamer engine
     */
    this.update = function(engine){}

    /**
     * Render the graphical data from the scene
     * @param CanvasRenderingContext2d ctx
     * @param Inflamer engine
     */
    this.render = function(ctx, engine){
        this.renderScene(ctx, engine);
        this.renderEntities(ctx, engine);
    }

    /**
     * Render each added entity of the scene calling Entity.render() method
     * @param CanvasRenderingContext2d ctx
     * @param Inflamer engine
     */
    this.renderEntities = function(ctx, engine){
        this.entities.forEach(function(e){
            e.render(ctx, engine);
        });
    }

    /**
     * Method to be overwriten
     */
    this.renderScene = function(ctx, engine){}

    /**
     * Add an entity into the scene
     * @param Entity e - The entity that will be added
     */
    this.addEntity = function(e){
        this.entities.push(e);
    };

    /**
     * Remote an entity from the scene
     * @param Entity e - The entity that will be removed
     */
    this.removeEntity = function(e){
        this.entities.pop(e);
    }

    //Call the load callback
    if(cb) cb(this);
}

function Vector2d(x, y){
    this._x = 0;
    this._y = 0;

    this.and = function(vector2d){
        return new Vector2d(this._x + vector2d._x, this._y + vector2d._y);
    }

    this.direction = function(x, y){
        this.x(x);
        this.y(y);
    }

    this.secureVectorValue = function(v){
        if(v < -1) v = -1;
        else if(v > 1) v = 1;

        return v;
    }

    this.x = function(x){
        if(x){
            if(Number.isFinite(x)){
                x = this.secureVectorValue(x);
                this._x = x;
            }else{
                Inflamer.throw("In: Vector2d.x(x) => the x parameter must be an number");
            }
        }else{
            return this._x;
        }
    },

    this.y = function(y){
        if(y){
            if(Number.isFinite(y)){
                x = this.secureVectorValue(y);
                this._y = y;
            }else{
                Inflamer.throw("In: Vector2d.y(y) => the y parameter must be an number");
            }
        }else{
            return this._y;
        }
    }
}

Vector2d.iddle = function(){return new Vector2d(0, 0)};
Vector2d.up = function(){return new Vector2d(0, -1)};
Vector2d.right = function(){return new Vector2d(1, 0)};
Vector2d.bottom = function(){return new Vector2d(0, 1)};
Vector2d.left = function(){return new Vector2d(-1, 0)};