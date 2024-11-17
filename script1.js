// Function to initialize the map
function initMap() {
    const mapOptions = {
        zoom: 12,
    };

    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    window.map = map;

    if (navigator.geolocation) {
        // Ask for location access
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center the map on user's location
                map.setCenter(userLocation);

                // Add a marker at the user's location
                const userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Your Location",
                });

                // Fetch and display the city name
                fetchCityName(userLocation);
                
            },
            (error) => {
                alert("Location access denied or unavailable. Centering map on a default location.");
                map.setCenter({ lat: 12.9716, lng: 77.5946 }); // Default to Bengaluru
            }
        );
    } else {
        alert("Geolocation not supported by this browser.");
        map.setCenter({ lat: 12.9716, lng: 77.5946 }); // Default to Bengaluru
    }
}

// Function to fetch and display the city name
function fetchCityName(location) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
            const cityName = results[0].address_components.find((comp) =>
                comp.types.includes("locality")
            ).long_name;

            // Display the city name
            document.getElementById("city-name").textContent = cityName;
        } else {
            document.getElementById("city-name").textContent = "Unable to detect city.";
        }
    });
}

// Set up the geocoder
const geocoder = new google.maps.Geocoder();
let cityMarker = null;

// Update location based on the entered city name
function updateLocation() {
    const cityName = document.getElementById("location-search").value.trim();
    if (cityName) {
        geocodeCity(cityName);
    } else {
        alert("Please enter a city name.");
    }
}

// Geocode city name and update map
function geocodeCity(cityName) {
    geocoder.geocode({ address: cityName }, (results, status) => {
        if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;

            // Center the map on the city's location
            map.setCenter(location);
            map.setZoom(12);

            // Add or update the city marker
            if (cityMarker) {
                cityMarker.setMap(null); // Remove existing marker
            }
            cityMarker = new google.maps.Marker({
                position: location,
                map: map,
                title: cityName,
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                },
            });

            // Update city name and facts on the page
            document.getElementById("city-name").textContent = cityName;
            document.getElementById("city-facts").textContent = `Explore the attractions, cuisines, and culture of ${cityName}!`;
        } else {
            alert("Unable to find the location. Please try again.");
        }
    });
}

// Automatically detect the user's current location
function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center the map on the user's current location
                map.setCenter(currentLocation);
                map.setZoom(12);

                // Add or update the location marker
                if (cityMarker) {
                    cityMarker.setMap(null); // Remove existing marker
                }
                cityMarker = new google.maps.Marker({
                    position: currentLocation,
                    map: map,
                    title: "Current Location",
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    },
                });

                // Update city name and facts based on current location
                document.getElementById("city-name").textContent = "Current Location";
                document.getElementById("city-facts").textContent = "You're currently here!";
            },
            () => {
                alert("Geolocation failed. Please enable location access.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


// Function to display locations in the middle section (example)
function showLocations(category) {
    const contentArea = document.querySelector(".content");

    const sampleData = {
        restaurants: ["Bistro Bliss", "Urban Eats", "Dine Divine"],
        locations: ["City Park", "Historical Museum", "Art District"],
        hotels: ["Luxury Inn", "Comfort Suites", "Budget Stay"],
        cafes: ["Cafe Cascade", "Brew Haven", "Espresso Corner"],
        events: ["Art Fest", "Local Market Fiesta", "Night Music Gala"],
        gi: ["Handmade Pottery", "Local Weaving Art", "Spice Collection"],
    };

    const locations = sampleData[category] || [];
    contentArea.innerHTML = locations.map((loc) => `<p>${loc}</p>`).join("");
}

// Placeholder function for starting the recording
function startRecording() {
    alert("Recording started!");
    document.getElementById("textOutput").textContent = "Simulated transcription from voice input...";
}
// Close chatbot function
function closeChatbot() {
    const chatbotContainer = document.getElementById("chatbotContainer");
    chatbotContainer.style.display = "none"; // Hide the chatbot
}
function fetchLocalFacts(cityName) {
    const limit = 3; // Number of facts to fetch
    $.ajax({
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/facts?limit=${limit}`,
        headers: { 'X-Api-Key': '4spJOSI4VSyo/BnHDkJJ4Q==yFHWDU7zBgsIpMvO' },
        contentType: 'application/json',
        success: function (result) {
            const factsContainer = document.getElementById("city-facts");
            if (result.length) {
                factsContainer.innerHTML = `<h3>Interesting Facts about ${cityName}:</h3><ul>` +
                    result.map(fact => `<li>${fact.fact}</li>`).join('') +
                    `</ul>`;
            } else {
                factsContainer.textContent = `No specific facts found for ${cityName}.`;
            }
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
            document.getElementById("city-facts").textContent = "Unable to fetch local facts.";
        }
    });
}
function showGI() {
    const giContainer = document.getElementById("gi-container");
    const giList = document.getElementById("gi-list");
    giContainer.style.display = "block";

    // Clear existing GI list
    giList.innerHTML = "Loading...";

    // Fetch user's state
    const state = getStateFromLocation(); // Replace this with your method to fetch the user's state

    // Fetch and filter GI data
    fetchGIData(state).then((gis) => {
        giList.innerHTML = ""; // Clear loading text
        if (gis.length > 0) {
            gis.forEach((gi) => {
                const giItem = document.createElement("div");
                giItem.className = "gi-item";
                giItem.innerHTML = `<strong>${gi.gi}</strong> - ${gi.goodsType}`;
                giList.appendChild(giItem);
            });
        } else {
            giList.innerHTML = "No GI data available for your location.";
        }
    }).catch((err) => {
        console.error(err);
        giList.innerHTML = "Error fetching GI data.";
    });
}

