document.addEventListener('DOMContentLoaded', function () {
    const startScanButton = document.getElementById('start-scan-button');
    const resultDisplay = document.getElementById('result-display');
    let videoStream;
    let isScanning = false;

    startScanButton.addEventListener('click', function () {
        if (!isScanning) {
            isScanning = true;
            startScanButton.disabled = true;

            const constraints = {
                video: { facingMode: 'environment' }
            };

            navigator.mediaDevices.getUserMedia(constraints)
                .then(function (stream) {
                    videoStream = stream;
                    const video = document.createElement('video');
                    document.body.appendChild(video);
                    video.srcObject = stream;
                    video.play();

                    const scanner = new Instascan.Scanner({ video: video });

                    scanner.addListener('scan', function (content) {
                        const contains123 = content.includes("123");

                        // Display "true" or "false" in the result display
                        resultDisplay.innerText = contains123 ? "true" : "false";

                        // Stop scanning
                        scanner.stop();

                        // Stop the camera stream
                        if (videoStream) {
                            const tracks = videoStream.getTracks();
                            tracks.forEach(function (track) {
                                track.stop();
                            });
                        }

                        // Remove the video element
                        document.body.removeChild(video);

                        isScanning = false;
                        startScanButton.disabled = false;
                    });

                    Instascan.Camera.getCameras()
                        .then(function (cameras) {
                            if (cameras.length > 0) {
                                scanner.start(cameras[0]);
                            } else {
                                alert('No cameras found.');
                                isScanning = false;
                                startScanButton.disabled = false;
                            }
                        })
                        .catch(function (error) {
                            console.error('Error accessing the camera: ' + error);
                            isScanning = false;
                            startScanButton.disabled = false;
                        });
                })
                .catch(function (error) {
                    console.error('Error accessing the camera: ' + error);
                    isScanning = false;
                    startScanButton.disabled = false;
                });
        }
    });
});
