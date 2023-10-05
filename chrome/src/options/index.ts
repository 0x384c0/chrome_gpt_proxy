import './index.css'

async function getMicrophonePermissionAndReload() {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Microphone access granted, reload the page
        window.location.reload();
    } catch (error) {
        // Handle the error (e.g., user denied access)
        console.error('Microphone access error:', error);
    }
}

// Check if microphone access is already granted
navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
    if (permissionStatus.state === 'granted') {
        // Microphone access already granted, no need to request it
        console.log('Microphone access already granted');
    } else {
        // Microphone access not granted, request it
        getMicrophonePermissionAndReload();
    }
})
