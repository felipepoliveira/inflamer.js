var startScene = new Scene(function (scene){
    
});

window.addEventListener('load', function (){
    Inflamer.start(document.querySelector("#canvas"), {
        baseFps : 120,
        onProduction : true,
        fullScreen : true,
        disableContextMenu : true,
    });
});