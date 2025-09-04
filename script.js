document.addEventListener('DOMContentLoaded', function () {
    const videoList = document.getElementById('videoList');
    const themeSwitchButton = document.getElementById('switchTheme');
    const signOutButton = document.getElementById('signOut');

    // Function to add a video element to the UI with clickable view link
    function addVideoToUI(video) {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');

        videoItem.innerHTML = `
  <a href="view.html?id=${video.id}" style="text-decoration: none; color: inherit;">
    <video src="${video.url}" muted></video>
    <div class="details">
      <h3>${video.title}</h3>
      <p>${video.description}</p>
      <span>${video.category}</span><br>
      <small><em>Uploaded by: ${video.uploadedBy || "Anonymous"}</em></small>
    </div>
  </a>
  <div class="details">
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
    <button class="favorite-btn">${video.favorite ? 'Unfavorite' : 'Favorite'}</button>
    <button class="save-btn" style="display:none;">Save</button>
    <button class="cancel-btn" style="display:none;">Cancel</button>
    <a href="${video.url}" download="${video.title}.mp4">
      <button class="download-btn" style="background-color: #673ab7; color: white;">Download</button>
    </a>
  </div>
`;
        videoList.appendChild(videoItem);

        const editBtn = videoItem.querySelector('.edit-btn');
        const deleteBtn = videoItem.querySelector('.delete-btn');
        const favoriteBtn = videoItem.querySelector('.favorite-btn');
        const saveBtn = videoItem.querySelector('.save-btn');
        const cancelBtn = videoItem.querySelector('.cancel-btn');
        const titleElem = videoItem.querySelector('h3');
        const descElem = videoItem.querySelector('p');
        const categoryElem = videoItem.querySelector('span');

        // Edit functionality
        editBtn.addEventListener('click', function () {
            titleElem.contentEditable = true;
            descElem.contentEditable = true;
            categoryElem.contentEditable = true;
            saveBtn.style.display = "inline-block";
            cancelBtn.style.display = "inline-block";
            editBtn.style.display = "none";
        });

        // Cancel editing and reload
        cancelBtn.addEventListener('click', function () {
            loadVideos();
        });

        // Save edits
        saveBtn.addEventListener('click', function () {
            let videos = JSON.parse(localStorage.getItem('videos')) || [];
            const index = videos.findIndex(v => v.id == video.id);
            if (index > -1) {
                videos[index].title = titleElem.textContent;
                videos[index].description = descElem.textContent;
                videos[index].category = categoryElem.textContent;
                localStorage.setItem('videos', JSON.stringify(videos));
                saveBtn.style.display = "none";
                cancelBtn.style.display = "none";
                editBtn.style.display = "inline-block";
            }
        });

        // Delete video
        deleteBtn.addEventListener('click', function () {
            let videos = JSON.parse(localStorage.getItem('videos')) || [];
            videos = videos.filter(v => v.id != video.id);
            localStorage.setItem('videos', JSON.stringify(videos));
            videoItem.remove();
        });

        // Toggle favorite
        favoriteBtn.addEventListener('click', function () {
            let videos = JSON.parse(localStorage.getItem('videos')) || [];
            const index = videos.findIndex(v => v.id == video.id);
            if (index > -1) {
                videos[index].favorite = !videos[index].favorite;
                localStorage.setItem('videos', JSON.stringify(videos));
                favoriteBtn.textContent = videos[index].favorite ? 'Unfavorite' : 'Favorite';
                if (videos[index].favorite) {
                    addToFavourites(video.id);
                } else {
                    removeFromFavourites(video.id);
                }
            }
        });
    }

    // Load videos
    function loadVideos() {
        if (!videoList) return;
        videoList.innerHTML = '';
        const videos = JSON.parse(localStorage.getItem('videos')) || [];
        videos.forEach(video => {
            addVideoToUI(video);
        });
    }

    if (videoList) {
        loadVideos();
    }

    // Search functionality
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    if (searchButton && searchInput && videoList) {
        searchButton.addEventListener('click', function () {
            const query = searchInput.value.toLowerCase();
            const videoItems = Array.from(videoList.getElementsByClassName('video-item'));
            videoItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                const category = item.querySelector('span').textContent.toLowerCase();
                if (title.includes(query) || description.includes(query) || category.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Theme switching
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.style.backgroundColor = '#333';
            document.body.style.color = '#fff';
        } else {
            document.body.style.backgroundColor = '#f4f4f4';
            document.body.style.color = '#000';
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    if (themeSwitchButton) {
        themeSwitchButton.addEventListener('click', function () {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Sign out
    if (signOutButton) {
        signOutButton.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.replace('index.html');
        });
    }

    // Add to favourites
    function addToFavourites(videoId) {
        let videos = JSON.parse(localStorage.getItem('videos')) || [];
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        const video = videos.find(v => v.id === videoId);
        if (video && !favourites.some(fav => fav.id === videoId)) {
            favourites.push(video);
            localStorage.setItem('favourites', JSON.stringify(favourites));
            alert(video.title + ' added to favourites!');
        } else {
            alert(video.title + ' is already in favourites!');
        }
    }

    // Remove from favourites
    function removeFromFavourites(videoId) {
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        favourites = favourites.filter(fav => fav.id !== videoId);
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }
});

