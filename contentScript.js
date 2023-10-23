function parseSongString(song) {
  let parts = song.includes(" - ") ? song.split(" - ") : song.split("-");
  // if (song.includes("•")) {
  //   let parts = song.includes(" • ") ? song.split(" • ") : song.split("•");
  // } else {

  // }


  if (parts.length !== 2) {
    throw new Error("Invalid song format");
  }

  return {
    artist: parts[0].trim(),
    title: parts[1].trim(),
  };
}

const extractSongsFromDescriptionCompact = () => {
  const songs = [];

  const divSections = document.querySelectorAll(
    "div.style-scope.ytd-horizontal-card-list-renderer"
  );

  divSections.forEach((section) => {
    const titleElements = section.querySelectorAll(
      "h3.yt-video-attribute-view-model__title"
    );
    const artistElements = section.querySelectorAll(
      "h4.yt-video-attribute-view-model__subtitle"
    );

    titleElements.forEach((titleEl, index) => {
      const artistEl = artistElements[index];
      const title = titleEl.textContent ? titleEl.textContent.trim() : "";
      const artist = artistEl.textContent ? artistEl.textContent.trim() : "";

      if (title && artist) {
        songs.push({ title, artist });
      }
    });
  });

  return songs;
};

const extractSongsFromFirstComment = () => {
  // Locate the comment content.
  const commentContent = document.querySelector("#content-text");

  if (commentContent == null) {
    return [];
  }

  // Find all the time-stamped links.
  const timestamps = Array.from(
    commentContent.querySelectorAll("a.yt-simple-endpoint")
  );
  const songs = [];
  timestamps.forEach((timestamp, index) => {
    const currentNode = timestamp.nextSibling;
    const songTitle = currentNode.textContent.trim();
    if (songTitle && !songs.includes(songTitle)) {
      songs.push(parseSongString(songTitle));
    }
  });
  console.log(songs);
  return songs;
};

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
      const extractedSongs = extractSongsFromFirstComment();
      if (extractedSongs.length > 0) {
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
            window.open("http://localhost:3000/login", "_blank");
          });

          // Insert the new button before the like button
          likeButton.parentElement.insertBefore(spotifyButton, likeButton);

          // Now, execute the fetch request
          fetch("http://localhost:3000/process-songs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: videoTitle, songs: extractedSongs }),
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
