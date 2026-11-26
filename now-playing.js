// last.fm now playing
// 1. make an account at last.fm and connect spotify/apple music etc
// 2. get a free api key at https://www.last.fm/api/account/create
const LASTFM_USER = "anlisp";
const LASTFM_KEY = "b44ada98eb6afe4745f4b35b85d042c8";

const box = document.getElementById("now-playing");
const BLANK_ART = "2a96cbd8b46e442fc41c2b86b821562f"; // last.fm's grey placeholder image
 
async function updateNowPlaying() {
  try {
    if (LASTFM_USER.startsWith("YOUR_") || LASTFM_KEY.startsWith("YOUR_")) {
      throw new Error("add your last.fm username and api key in now-playing.js");
    }
 
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(LASTFM_USER)}&api_key=${LASTFM_KEY}&format=json&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.message || "last.fm error " + data.error);
 
    const tracks = data.recenttracks && data.recenttracks.track;
    if (!tracks || !tracks.length) {
      box.textContent = "nothing scrobbled yet";
      return;
    }
 
    const t = Array.isArray(tracks) ? tracks[0] : tracks;
    const live = t["@attr"] && t["@attr"].nowplaying === "true";
    const art = t.image && t.image[1] ? t.image[1]["#text"] : "";
 
    box.innerHTML = "";
 
    if (art && !art.includes(BLANK_ART)) {
      const img = document.createElement("img");
      img.src = art;
      img.alt = "";
      box.appendChild(img);
    }
 
    const text = document.createElement("div");
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = live ? "now playing" : "last played";
    const track = document.createElement("div");
    track.className = "track";
    track.textContent = `${t.name} - ${t.artist["#text"]}`;
    text.append(label, track);
    box.appendChild(text);
  } catch (e) {
    console.error("now playing:", e);
    box.textContent = "now playing unavailable: " + e.message;
  }
}
 
updateNowPlaying();
setInterval(updateNowPlaying, 30000);
 