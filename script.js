// Function to display popup alerts for buttons
function showPopup(message) {
    alert(message);
}

// Add event listeners to the navbar buttons for location categories
const categoryButtons = document.querySelectorAll('#middle .navbar button');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        showPopup(`You selected: ${category}`);
        // Here you would implement the functionality to display relevant locations and pin them on the map
    });
});

// Handle voice recording functionality
let isRecording = false;
const recorderIcon = document.getElementById('recorder-icon');
const outputText = document.querySelector('.output-text');

recorderIcon.addEventListener('click', () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});

// Initialize speech recognition (if available)
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        isRecording = true;
        recorderIcon.src = 'stop-recording-icon.png';  // Change this to stop recording icon
        showPopup('Recording started...');
    };

    recognition.onerror = function (event) {
        showPopup('Error occurred during recording: ' + event.error);
    };

    recognition.onresult = function (event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        outputText.value = transcript;
    };

    function startRecording() {
        recognition.start();
    }

    function stopRecording() {
        recognition.stop();
        isRecording = false;
        recorderIcon.src = 'recorder-icon.png';  // Change this to start recording icon
        showPopup('Recording stopped.');
    }
} else {
    showPopup('Speech Recognition API is not supported in this browser.');
}
