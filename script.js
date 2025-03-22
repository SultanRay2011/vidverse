document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const videoPostForm = document.getElementById('videoPostForm');
    const videoList = document.getElementById('videoList');
    const accountForm = document.getElementById('accountForm');

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Add your form validation and submission logic here
            window.location.href = 'login.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            // Simulate login validation
            if (username === 'correctUsername' && password === 'correctPassword') {
                // Redirect to the main page or perform successful login actions
                window.location.href = 'home.html';
            } else {
                errorMessage.textContent = 'Incorrect username or password';
                errorMessage.style.display = 'block';
            }
        });
    }

    if (videoPostForm) {
        videoPostForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const videoTitle = document.getElementById('videoTitle').value;
            const videoDescription = document.getElementById('videoDescription').value;
            const videoCategory = document.getElementById('videoCategory').value;
            const videoFile = document.getElementById('videoFile').files[0];

            if (videoFile) {
                const videoURL = URL.createObjectURL(videoFile);
                const videoData = {
                    title: videoTitle,
                    description: videoDescription,
                    category: videoCategory,
                    url: videoURL,
                    type: videoFile.type
                };

                // Save video data to local storage
                let videos = JSON.parse(localStorage.getItem('videos')) || [];
                videos.push(videoData);
                localStorage.setItem('videos', JSON.stringify(videos));

                // Optionally, display the video immediately on the upload page
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                videoItem.innerHTML = `
                    <video controls>
                        <source src="${videoURL}" type="${videoFile.type}">
                        Your browser does not support the video tag.
                    </video>
                    <div class="details">
                        <h3>${videoTitle}</h3>
                        <p>${videoDescription}</p>
                        <p>Category: ${videoCategory}</p>
                    </div>
                `;
                if (videoList) {
                    videoList.appendChild(videoItem);
                }
                videoPostForm.reset();
            }
        });
    }

    if (accountForm) {
        // Fetch user details from a server or local storage
        const userDetails = {
            username: 'current_username',
            email: 'current_email@example.com',
            password: 'current_password'
        };

        document.getElementById('username').value = userDetails.username;
        document.getElementById('email').value = userDetails.email;
        document.getElementById('password').value = userDetails.password;
        document.getElementById('confirm-password').value = userDetails.password;

        accountForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Add your form validation and submission logic here
            alert('Account updated successfully!');
        });
    }

    // Load videos on the videos.html page
    if (videoList) {
        const videos = JSON.parse(localStorage.getItem('videos')) || [];

        videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.innerHTML = `
                <video controls>
                    <source src="${video.url}" type="${video.type}">
                    Your browser does not support the video tag.
                </video>
                <div class="details">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <p>Category: ${video.category}</p>
                </div>
            `;
            videoList.appendChild(videoItem);
        });
    }
});