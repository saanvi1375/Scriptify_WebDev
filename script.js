// Initialize Google Map
let map;

function initMap() {
    // Default location (for example, New York City)
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };

    map = new google.maps.Map(document.getElementById("google-map"), {
        center: defaultLocation,
        zoom: 12,
    });
}

// Request Location Access and Fetch Data
document.getElementById('location-btn').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Update map location
            const userLocation = { lat, lng: lon };
            map.setCenter(userLocation);
            map.setZoom(14);

            // Fetch nearby attractions and local cuisine
            getNearbyAttractions(lat, lon);
            getLocalCuisine(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Fetch Nearby Attractions (Google Places API)
function getNearbyAttractions(lat, lon) {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=1500&type=tourist_attraction&key=YOUR_GOOGLE_MAPS_API_KEY`;

    fetch(placesUrl)
        .then(response => response.json())
        .then(data => {
            const attractions = data.results;
            const attractionList = document.getElementById('nearby-attractions');
            attractionList.innerHTML = '';

            attractions.forEach(attraction => {
                const li = document.createElement('li');
                li.textContent = attraction.name;
                attractionList.appendChild(li);
            });
        });
}

// Fetch Local Cuisine Recommendations
function getLocalCuisine(lat, lon) {
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=1500&type=restaurant&key=YOUR_GOOGLE_MAPS_API_KEY`;

    fetch(placesUrl)
        .then(response => response.json())
        .then(data => {
            const restaurants = data.results;
            const cuisineList = document.getElementById('local-cuisine');
            cuisineList.innerHTML = '';

            restaurants.forEach(restaurant => {
                const li = document.createElement('li');
                li.textContent = restaurant.name;
                cuisineList.appendChild(li);
            });
        });
}

// Speech Recognition for Translation
document.getElementById('start-speech-btn').addEventListener('click', function () {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.start();

    recognition.onresult = function (event) {
        const speechText = event.results[0][0].transcript;
        document.getElementById('translation-output').textContent = `You said: ${speechText}`;

        // Translate the speech (implement your translation logic)
        translateSpeech(speechText);
    };

    recognition.onerror = function (event) {
        console.log("Speech recognition error", event);
    };
});

// Placeholder for translating speech (integrate Google Translate API)
function translateSpeech(text) {
    const translatedText = "Translated Text: " + text; // This is just a placeholder.
    document.getElementById('translation-output').textContent = translatedText;
}
