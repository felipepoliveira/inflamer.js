var fontConsolas = Inflamer.new.font("Consolas", "26px");

var _InflamerDefaultScene = new Scene(function (scene){

    
    scene.renderScene = function(ctx, engine){
        ctx.fillStyle = "black";
        ctx.rect(0, 0);
        ctx.fillStyle = "white";
        ctx.font = fontConsolas;
        ctx.text("Inflamer", true, true);

        Inflamer.do.in.frames(10, () => {
            
        });
    }
});