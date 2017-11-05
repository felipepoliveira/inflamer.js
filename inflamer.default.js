var _InflamerDefaultScene = new Scene(function (scene){

    
    scene.renderScene = function(ctx, engine){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, engine.width(), engine.height());
        ctx.fillStyle = "white";
        ctx.setFont("Consolas", "36px");
        ctx.text("Inflamer", true, true);
        ctx.fillStyle = "green";
    }
});