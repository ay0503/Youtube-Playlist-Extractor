const SERVER_URI = 'https://pacific-waters-12367-53d691b4af26.herokuapp.com'
// const SERVER_URI = 'http://localhost:3000';

const isValidSongTitle = (song) => {
  if (song.length == 0) return false;
  if (song.length > 40) return false;
  // console.log(song);
  if (song.includes('\n')) return false;
  return true;
}

const extractSongsFromFirstCommentTimestamps = () => {
  // Locate the comment content.
  const commentContent = document.querySelector("#content-text");

  if (commentContent == null) {
    console.log("No comment content found.");
    return [];
  }

  // Find all the time-stamped links.
  const timestamps = Array.from(
    commentContent.querySelectorAll("a.yt-simple-endpoint")
  );
  console.log(timestamps);
  const songs = [];
  timestamps.forEach((timestamp, index) => {
    const currentNode = timestamp.nextSibling;
    if (currentNode) {
      const songTitle = currentNode.textContent.trim();
      if (songTitle && !songs.includes(songTitle)) {
        songs.push(songTitle);
      }
    }
  });
  console.log(songs);
  return songs;
};

function extractSongsFromDescriptionTimestamps() {
  // Locate the description content.
  const descriptionContent = document;

  let links = descriptionContent.querySelectorAll('a.yt-core-attributed-string__link');
  let titles = descriptionContent.querySelectorAll('span.yt-core-attributed-string--link-inherit-color[style="color: rgb(255, 255, 255);"]');

  const songs = [];
  for (let i = 0; i < links.length; i++) {
    if (titles[i] === undefined) continue;
    title = titles[i].textContent.trim();
    if (isValidSongTitle(title)) {
      songs.push(title);
    }
  }

  // console.log(songs);
  return songs;
}

const main = () => {
  if (window.hasRunMyScript) {
    return;
  }

  const targetNode = document.body;
  const observerOptions = {
    childList: true,
    subtree: true,
  };

  const observer = new MutationObserver((mutationsList, observer) => {
    const mutation = mutationsList.pop();
    if (mutation.type === "childList") {
      const commentSongs = extractSongsFromFirstCommentTimestamps();
      const descriptionSongs = extractSongsFromDescriptionTimestamps();
      if (commentSongs.length > 2) {
        console.log("From Comments:", commentSongs)
        const titleElement = document.querySelector(
          "h1.style-scope.ytd-watch-metadata > yt-formatted-string"
        );
        const videoTitle = titleElement ? titleElement.textContent.trim() : "";
        console.log("Title" + videoTitle);
        const likeButton = document.querySelector(
          "ytd-segmented-like-dislike-button-renderer"
        );

        // Check if the like button exists (video is not already liked)
        if (likeButton) {
          // Create a new button element
          const spotifyButton = document.createElement("button");
          spotifyButton.innerText = "따기";

          // Get the height of the dislike button
          const dislikeButton = document.querySelector(
            ".yt-spec-button-shape-next--size-m"
          );
          const buttonHeight = window.getComputedStyle(dislikeButton).height;

          // Style the button to match YouTube's like button
          spotifyButton.style.backgroundColor = "rgb(39, 39, 39)";
          spotifyButton.style.border = "none";
          spotifyButton.style.borderRadius = "20px";
          spotifyButton.style.padding = "5px 10px"; // Adjusted padding
          spotifyButton.style.color = "white";
          spotifyButton.style.fontWeight = "normal";
          spotifyButton.style.cursor = "pointer";
          spotifyButton.style.marginRight = "10px";
          spotifyButton.style.height = buttonHeight;
          spotifyButton.style.width = "70px"; // Explicit width
          spotifyButton.style.fontSize = "1.5em";
          spotifyButton.style.lineHeight = buttonHeight;
          spotifyButton.style.display = "flex";
          spotifyButton.style.alignItems = "center";
          spotifyButton.style.justifyContent = "center";

          // Add hover effect
          spotifyButton.onmouseover = function () {
            this.style.opacity = "0.8";
          };
          spotifyButton.onmouseout = function () {
            this.style.opacity = "1";
          };

          // Add a click event listener to the new button
          spotifyButton.addEventListener("click", () => {
            // Redirect to the Spotify login/authentication route
            window.open(SERVER_URI + "/login", "_blank");
          });

          // Insert the new button before the like button
          likeButton.parentElement.insertBefore(spotifyButton, likeButton);

          // Now, execute the fetch request
          fetch(SERVER_URI + "/process-songs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: videoTitle, songs: commentSongs }),
          })
            .then((response) => response.json())
            .then((data) => {
              const spotifyPlaylistURL = data.url;

              if (spotifyPlaylistURL) {
                // Update the event listener to open the returned playlist URL
                spotifyButton.addEventListener("click", () => {
                  chrome.tabs.create({ url: spotifyPlaylistURL });
                });
              }
            })
            .catch((error) => {
              window.hasRunMyScript = true;
              console.error(
                "Error processing songs and fetching Spotify playlist URL:",
                error
              );
            });
        }

        window.hasRunMyScript = true;
        observer.disconnect(); // Stop observing if you found the content
      }
      if (descriptionSongs.length > 2) {
        console.log("From Description:", descriptionSongs)
        const titleElement = document.querySelector(
          "h1.style-scope.ytd-watch-metadata > yt-formatted-string"
        );
        const videoTitle = titleElement ? titleElement.textContent.trim() : "";
        console.log("Title" + videoTitle);
        const likeButton = document.querySelector(
          "ytd-segmented-like-dislike-button-renderer"
        );

        // Check if the like button exists (video is not already liked)
        if (likeButton) {
          // Create a new button element
          const spotifyButton = document.createElement("button");
          spotifyButton.innerText = "따기";

          // Get the height of the dislike button
          const dislikeButton = document.querySelector(
            ".yt-spec-button-shape-next--size-m"
          );
          const buttonHeight = window.getComputedStyle(dislikeButton).height;

          // Style the button to match YouTube's like button
          spotifyButton.style.backgroundColor = "rgb(39, 39, 39)";
          spotifyButton.style.border = "none";
          spotifyButton.style.borderRadius = "20px";
          spotifyButton.style.padding = "5px 10px"; // Adjusted padding
          spotifyButton.style.color = "white";
          spotifyButton.style.fontWeight = "normal";
          spotifyButton.style.cursor = "pointer";
          spotifyButton.style.marginRight = "10px";
          spotifyButton.style.height = buttonHeight;
          spotifyButton.style.width = "70px"; // Explicit width
          spotifyButton.style.fontSize = "1.5em";
          spotifyButton.style.lineHeight = buttonHeight;
          spotifyButton.style.display = "flex";
          spotifyButton.style.alignItems = "center";
          spotifyButton.style.justifyContent = "center";

          // Add hover effect
          spotifyButton.onmouseover = function () {
            this.style.opacity = "0.8";
          };
          spotifyButton.onmouseout = function () {
            this.style.opacity = "1";
          };

          // Add a click event listener to the new button
          spotifyButton.addEventListener("click", () => {
            // Redirect to the Spotify login/authentication route
            window.open(SERVER_URI + "/login", "_blank");
          });

          // Insert the new button before the like button
          likeButton.parentElement.insertBefore(spotifyButton, likeButton);

          // Now, execute the fetch request
          fetch(SERVER_URI + "/process-songs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: videoTitle, songs: descriptionSongs }),
          })
            .then((response) => response.json())
            .then((data) => {
              const spotifyPlaylistURL = data.url;

              if (spotifyPlaylistURL) {
                // Update the event listener to open the returned playlist URL
                spotifyButton.addEventListener("click", () => {
                  chrome.tabs.create({ url: spotifyPlaylistURL });
                });
              }
            })
            .catch((error) => {
              window.hasRunMyScript = true;
              console.error(
                "Error processing songs and fetching Spotify playlist URL:",
                error
              );
            });
        }

        window.hasRunMyScript = true;
        observer.disconnect(); // Stop observing if you found the content
      }
    }
  });

  observer.observe(targetNode, observerOptions);
};

main();
