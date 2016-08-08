var map = L.map('map');
var user;
var userLat = "51.5";
var userLon = "-0.09";
var token;
var pokemons = [];
L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 18,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);
map.zoomControl.setPosition('bottomleft');

var pokeMasterIcon = L.icon({
    iconUrl: 'img/pokemaster.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [-3, -50],
    shadowSize: [0, 0],
    shadowAnchor: [0, 0],
    labelAnchor: [3, -37]
});

function onLocationFound(e) {
    userLat = e.latlng.lat;
    userLon = e.latlng.lng;
    user = L.marker(e.latlng, {
        icon: pokeMasterIcon
    }).bindLabel('<span>You are here!</span>', {
        noHide: true
    }).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    map.removeLayer(user);
    var latlon = position.coords;
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;
    user = L.marker([userLat, userLon], {
        icon: pokeMasterIcon
    }).bindLabel('<span>You are here!</span>', {
        noHide: true
    }).addTo(map);
}

function showError(error) {
    switch (error.code) {
    case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
    case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
    case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
    case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({
    setView: true,
    maxZoom: 16
});

function getPokemon() {
    removePokemons();
    url = 'http://184.65.248.61:10076/raw_data?pokemon=true&pokestops=false&gyms=false&scanned=false&swLat='+map.getBounds().getSouthWest().lat+'&swLng='+map.getBounds().getSouthWest().lng+'&neLat='+map.getBounds().getNorthEast().lat+'&neLng='+map.getBounds().getNorthEast().lng
                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: "application/json",
                    dataType: "json",
                    success: function (status) {
                        if (status.pokemons) {
                            message('Pokémons obtained');
                            if (status.pokemons.length > 0) {
                                message('Paint Pokémon');
                                status= status.pokemons;
                                for (var i = 0; i < status.length; i++) {
                                    createPokeMarker(status[i].spawnpoint_id, status[i].latitude, status[i].longitude, status[i].pokemon_name, status[i].pokemon_id, status[i].disappear_time);
                                }
                            } else {
                                message('No Pokémon in your location');
                            }
                        } else {
                            message('Error obtained Pokémon');
                            
                        }
                    },
                    error: function () {
                        message('Error to display Pokémon, try again');
                    }
                });
}

function createPokeMarker(number, latt, longg, name, id, time) {
    if (id.toString().length == 1) {
        id = "00" + id + ".png";
    } else if (id.toString().length == 2) {
        id = "0" + id + ".png";
    } else {
        id = id + ".png";
    }
    icon = L.icon({
        iconUrl: 'img/pokecons/' + id,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [-3, -30],
        shadowSize: [0, 0],
        shadowAnchor: [0, 0],
        labelAnchor: [10, -15],
        className: number
    });

    
    pokemon = L.marker(
        [
            latt,
            longg], {
            icon: icon
        }
    ).bindLabel(
        '', {
            noHide: true,
            className: number
        }
    ).addTo(map);

    pokemons.push(pokemon);
    
    var formattedTime = moment(time).format("YYYY/MM/DD H:m:s");
    $('.' + number).countdown(formattedTime, function (event) {
        if (event.offset.hours > 0) {
            var format = '%H:%M:%S';
        } else {
            var format = '%M:%S';
        }
        $(this).html(event.strftime(format));
    }).on('finish.countdown', function (event) {
        $("." + number).remove();
    });
}

function removePokemons(){
    for(var i = 0; i < pokemons.length; i++){
        map.removeLayer(pokemons[i]);
    }
    pokemons=[];
}

function message(text) {
    'use strict';
    var snackbarContainer = document.querySelector('#demo-toast-example');
    'use strict';
    var data = {
        message: text
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

var dialog = document.querySelector('.donate');
var showModalButton = document.querySelector('.show-modal');

if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}

showModalButton.addEventListener('click', function () {
    dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', function () {
    dialog.close();
});

var dialog2 = document.querySelector('.developers');
var showModalButton2 = document.querySelector('.show-modal2');

if (!dialog2.showModal) {
    dialogPolyfill.registerDialog(dialog2);
}

showModalButton2.addEventListener('click', function () {
    dialog2.showModal();
});
dialog2.querySelector('.close').addEventListener('click', function () {
    dialog2.close();
});