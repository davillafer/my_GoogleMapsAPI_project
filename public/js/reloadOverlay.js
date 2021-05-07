function waitForElement(elementId, callBack){
    window.setTimeout(function(){
        var element = document.getElementById(elementId);
        if (element){
            callBack(elementId, element);
        } else {
            waitForElement(elementId, callBack);
        }
    }, 500)
}

waitForElement("map_frame",function(){
    document.getElementById("game_overlay").style.position = "inherit";
    setTimeout(function() { 
        document.getElementById("map_frame").style.position = "unset";
        document.getElementById("map_frame").style.overflow = "none";
    }, 1000);
   
});