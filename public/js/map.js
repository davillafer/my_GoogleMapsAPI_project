var map;
let colors = ["blu", "red", "grn"];
let i = 0;
let markers = [];
let userMarkers = [];
var solutionMarkers = [];

function addSolutionMarker(lat, lng) {
  const infowindow = new google.maps.InfoWindow({
    content: "The solution is in position: (" + lat + "," + lng + ")"
  });
  var pos = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
  var marker = new google.maps.Marker({
    position: pos,
    map: null
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
  solutionMarkers.push(marker);
}

function initMap() {
  var madrid = new google.maps.LatLng(40.438456,-3.693271);
  var misOpciones = {
    center: madrid,
    zoom: 7,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  map = new google.maps.Map(document.getElementById("map_frame"), misOpciones);

  google.maps.event.addListener(map, 'click', function(event) {
    if (isMapEnabled()) {
      deleteMarkers();
      situarMarcador(event.latLng);
      mostrarAceptar();
      showMarkers();
    }
  });
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function mostrarAceptar() {
  document.getElementById("aceptar").style.visibility = "visible";
}

function showUserMarkers() {
  i = 0;
  userMarkers.forEach(element => {
    element.setIcon('http://maps.google.com/mapfiles/kml/paddle/' + colors[i] + '-blank.png');
    markers.push(element);
    i++;
  });
  showMarkers();
}

function showSolutionMarkers() {
  i = 0;
  solutionMarkers.forEach(element => {
    element.setIcon('http://maps.google.com/mapfiles/kml/paddle/' + colors[i] + '-stars.png');
    markers.push(element);
    i++;
  });
  showMarkers();
}

function situarMarcador(localizacion) {
  var info = localizacion.toString();
  var infoSplited = info.split(",");
  document.getElementById("lat-box").innerText = parseFloat(infoSplited[0].substring(1)).toFixed(5);
  document.getElementById("lng-box").innerText = parseFloat(infoSplited[1].substring(0, infoSplited[1].length-1)).toFixed(5);
  document.getElementById("result-bar").style.visibility = "visible";
  const infowindow = new google.maps.InfoWindow({
    content: "You have selected position: " + info
  });
  var marker = new google.maps.Marker({
    position: localizacion,
    map: map,
    icon: 'http://maps.google.com/mapfiles/kml/shapes/schools.png'
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
  markers.push(marker);
}

function showMarkers() {
  setMapOnAll(map);
}

function clearMarkers() {
  document.getElementById("result-bar").style.visibility = "hidden";
  setMapOnAll(null);
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function addPolylinesToMap() {
  var counter = 0;
  for (counter = 0; counter < solutionMarkers.length; counter++) {
    const fromTo = [
      solutionMarkers[counter].position,
      userMarkers[counter].position
    ];
    const path = new google.maps.Polyline({
      path: fromTo,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    const infowindow = new google.maps.InfoWindow({
      content: "Distance: " + distances[counter] + " km"
    });
    infowindow.setPosition(calculateMidPoint(counter));
    infowindow.open(map);
    path.setMap(map);
  }
}

function calculateMidPoint(counter) {
  var posFrom = solutionMarkers[counter].position.toString();
  var posTo = userMarkers[counter].position.toString();

  var fromSplited = posFrom.split(",");
  var xFrom = parseFloat(fromSplited[0].substring(1)).toFixed(5);
  var yFrom = parseFloat(fromSplited[1].substring(0, fromSplited[1].length-1)).toFixed(5);

  var toSplited = posTo.split(",");
  var xTo = parseFloat(toSplited[0].substring(1)).toFixed(5);
  var yTo = parseFloat(toSplited[1].substring(0, toSplited[1].length-1)).toFixed(5);

  var lat = (parseFloat(xFrom) + parseFloat(xTo))/2;
  var lng = (parseFloat(yFrom) + parseFloat(yTo))/2;

  var pos = new google.maps.LatLng(lat, lng);
  return pos;
}

function addCirclesToMap() {
  var counter = 0;
  for (counter = 0; counter < solutionMarkers.length; counter++) {
    const tenPoints = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.3,
      map,
      center: solutionMarkers[counter].position,
      radius: 1000
    });

    const sevenPoints = new google.maps.Circle({
      strokeColor: "#FFA500",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FFA500",
      fillOpacity: 0.2,
      map,
      center: solutionMarkers[counter].position,
      radius: 10000
    });

    const fourPoints = new google.maps.Circle({
      strokeColor: "#ffff00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#ffff00",
      fillOpacity: 0.15,
      map,
      center: solutionMarkers[counter].position,
      radius: 50000
    });

    const onePoint = new google.maps.Circle({
      strokeColor: "#00ff00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#00ff00",
      fillOpacity: 0.1,
      map,
      center: solutionMarkers[counter].position,
      radius: 100000
    });
  }
}