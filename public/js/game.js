var points = 0;
var secondVisited = false;
var thirdVisited = false;
var basicUrl = "public/img/"
let jpg = ".jpg"
var actualImg = "";
var mapEnabled = true;
var distances = [];
var images = [
    "37.178006,-3.588584",
    "37.8793009,-4.779678",
    "39.4548751,-0.3504904",
    "40.948169,-4.117714",
    "40.4136627,-3.6818081",
    "41.403086,2.173729",
    "42.5997032,-5.5666706",
    "43.537410,-5.637779",
    "43.2686712,-2.9340118",
    "43.3859571,-8.4064953"
];
imagesUsed = [];

function start() {
    takeRandomImages();
    loadFirstImage();
    document.getElementById('aceptar').addEventListener('mouseup', checkResult);
}

function takeRandomImages() {
    var randomCounter;
    for(randomCounter = 0; randomCounter < 3; randomCounter++) {
        var locker = true;
        var randomNum;
        while (locker) {
            randomNum = Math.floor((Math.random() * images.length));
            if (imagesUsed.indexOf(images[randomNum]) == -1) {
                locker = false;
            }
        }
        imagesUsed.push(images[randomNum]); 
    }  
}

function loadFirstImage() {
    actualImg = imagesUsed[0];
    document.getElementById('image').style.backgroundImage = "url(" + basicUrl + actualImg + jpg + ")";
    var img = new Image();
    img.onload = function(){
        document.getElementById('image').style.height = this.height/3 + "px";
        document.getElementById('image').style.width = this.width/3 + "px";
    };
    img.src = basicUrl + actualImg + jpg;
}

function loadSecondImage() {
    actualImg = imagesUsed[1];
    document.getElementById('image').style.backgroundImage = "url(" + basicUrl + actualImg + jpg + ")";
    var img = new Image();
    img.onload = function(){
        document.getElementById('image').style.height = this.height/3 + "px";
        document.getElementById('image').style.width = this.width/3 + "px";
    };
    img.src = basicUrl + actualImg + jpg;
}

function addSolution() {
    var data = actualImg.split(',');
    addSolutionMarker(parseFloat(data[0]).toFixed(5), parseFloat(data[1]).toFixed(5));
}

function loadThirdImage() {
    actualImg = imagesUsed[2];
    document.getElementById('image').style.backgroundImage = "url(" + basicUrl + actualImg + jpg + ")";
    var img = new Image();
    img.onload = function(){
        document.getElementById('image').style.height = this.height/3 + "px";
        document.getElementById('image').style.width = this.width/3 + "px";
    };
    img.src = basicUrl + actualImg + jpg;
}

/**
 * Method from https://www.tutorialsplane.com/javascript-calculate-distance-between-latitude-longitude-points/
 * @param {*} latitude1 
 * @param {*} longitude1 
 * @param {*} latitude2 
 * @param {*} longitude2 
 */
function getDistanceInKm(latitude1, longitude1, latitude2, longitude2) {
    var p = 0.017453292519943295;    //This is  Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((latitude2 - latitude1) * p)/2 + 
            c(latitude1 * p) * c(latitude2 * p) * 
            (1 - c((longitude2 - longitude1) * p))/2;
    var R = 6371; //  Earth distance in km so it will return the distance in km
    return 2 * R * Math.asin(Math.sqrt(a)); 
}

function calculatePoints() {
    var infoSplited = actualImg.split(",");
    var latSol = parseFloat(infoSplited[0]).toFixed(5);
    var lngSol = parseFloat(infoSplited[1]).toFixed(5);
    var latDest = parseFloat(document.getElementById('lat-box').innerText).toFixed(5);
    var lngDest = parseFloat(document.getElementById('lng-box').innerText).toFixed(5);
    userMarkers.push(markers[0]);
    var distance = getDistanceInKm(latSol, lngSol, latDest, lngDest);
    distances.push(distance);
    if (distance < 1) {
        points += 10;
    } else if (distance < 10 ) {
        points += 7;
    } else if (distance < 50 ) {
        points += 4;
    } else if (distance < 100 ) {
        points += 1;
    } else {
        points += 0;
    }
    
    document.getElementById("result-bar").style.visibility = "hidden";
    document.getElementById("aceptar").style.visibility = "hidden";
    clearMarkers();
}

function checkResult() {
    if (!secondVisited) {
        secondVisited = true;
        calculatePoints();
        addSolution();
        loadSecondImage();
    } else if (!thirdVisited) {
        thirdVisited = true;
        calculatePoints();
        addSolution();
        loadThirdImage();
    } else {
        calculatePoints();
        addSolution();
        showResults();
        addCirclesToMap();
        addPolylinesToMap();
    }
}

function showResults() {
    console.log("Points: " + points);
    document.getElementById('game_overlay').style.visibility = "hidden";
    document.getElementById("points-bar").style.visibility = "visible";
    document.getElementById("points-box").innerText = points;
    mapEnabled = false;
    showAllMarkers();
}

function showAllMarkers() {
    showUserMarkers();
    showSolutionMarkers();
    showMarkers();
}

function isMapEnabled() {
    return mapEnabled;
}

start();