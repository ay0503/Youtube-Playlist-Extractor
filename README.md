# What Does This Do?

---

This extension provides an easy way to convert your favorite Youtube song playlists into Spotify playlists. Here's a breakdown of its functionality:

1. **Song Extraction:** The extension identifies song titles and artists from Youtube song playlist videos. It smartly uses the first comment on the video, focusing on the timestamps listed.

2. **Spotify Playlist Creation:** Once the songs are extracted, the extension communicates with the backend to create a corresponding Spotify playlist.

3. **Instant Access:** After the Spotify playlist is created, the extension promptly returns a direct Spotify URL to the 따기 button, allowing users to immediately enjoy their playlist on Spotify by simply clicking.

In essence, this extension bridges the gap between amazing Youtube playlist videos and Spotify playlists, ensuring that music enthusiasts can effortlessly enjoy their favorite tunes on Spotify as well.



# Privacy Policy

---

## Introduction:

This privacy policy outlines how our extension handles and protects user data. It's essential for users to understand what information the extension accesses and why, to make informed decisions about using the extension.

---

## Permissions Justification:

### 1. activeTab Permission:
   - **Purpose:** The extension uses the "activeTab" permission to access the comment section of the Youtube video.
   - **Usage:** This is utilized to extract the song titles and artists next to the timestamps of the first comment.

### 2. storage Permission:
   - **Purpose:** The extension uses the "storage" permission to enhance user experience.
   - **Usage:** If a URL is generated, or if the songs are already extracted, the extension will store this data in local storage. This helps in avoiding repeated extraction, which can cause performance issues.

### 3. Host Permission:
   - **Purpose:** The extension requires host permissions to operate on Youtube videos.
   - **Usage:** The extension is tailored for Youtube playlist videos. The extension operates if there are songs listed in a specific format; otherwise, the functionality remains dormant.

### 4. Remote Code Justification:
   - **Purpose:** To generate a playlist URL based on extracted songs.
   - **Usage:** The backend will utilize the extracted songs to generate a URL. This URL will be associated with a button, which, when clicked, will navigate the user to the Spotify playlist.

---

## Data Usage and Collection:

Our extension values user privacy and does not indulge in the unnecessary collection of user data. Here's what we collect:

- **Website Content:** We only access the text content of the Youtube video comment section to extract song titles and artists for the sole purpose of generating a playlist.

---

## What We Don't Do:

- We **do not** collect personally identifiable information, health information, financial and payment information, authentication information, personal communications, location data, web history, or user activity.

- We **do not** sell or transfer user data to third parties outside of the use cases approved and mentioned above.

- We **do not** use or transfer user data for purposes unrelated to the single purpose of our extension.

- We **do not** use or transfer user data to determine creditworthiness or for lending purposes.

---

## Consent:

By using our extension, you consent to our privacy policy. If we make changes to this policy, we will notify users.

---

## Contact:

For any questions regarding this privacy policy, please contact us.

---

By using our extension, you are certifying that these disclosures accurately reflect our privacy policy in alignment with the Developer Program Policies.
