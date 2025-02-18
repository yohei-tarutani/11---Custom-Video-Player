// Get our elements
const player = document.querySelector(".player");
const video = document.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]"); // ex. <button data-skip="-10">
const ranges = player.querySelectorAll(".player__slider");

// Build out functions
function togglePlay() {
  // video.paused: A built-in property that returns true if the video is paused.
  // Ternary Operator: If paused, call video.play(), else call video.pause().
  // Dynamic Method Access: Uses bracket notation to call the method.
  const method = video.paused ? "play" : "pause";
  video[method](); // video[play]() = video.play(), video[pause]() = video.pause()
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚"; // this.paused = video.paused
  toggle.textContent = icon;
}

function skip() {
  console.log(this.dataset.skip); // -10 or 25 <= ex. <button data-skip="-10">
  // video.currentTime: The current playback time in seconds.
  // parseFloat(): Converts the string value to a number and adds it to the current time.
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  // this.name: Either "volume" or "playbackRate".
  // this.value: The slider's current value.
  // Dynamically sets "video.volume" or "video.playbackRate".
  video[this.name] = this.value;
  // console.log(this.name, this.value); // ex. volue 0.8, playbackRate 1.3
}

function handleProgress() {
  // video.currentTime: The elapsed time (in seconds).
  // video.duration: The total video length (in seconds).
  const percent = (video.currentTime / video.duration) * 100;
  // flexBasis: Adjusts the width of progressBar to represent progress.
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  // e is the event object that is automatically passed when the function is triggered by an event listener.
  // e.offsetX: The horizontal position of the mouse click relative to the left edge of the progress bar.
  console.log(e.offsetX); // ex. 74, 224, ...

  // progress.offsetWidth: Total width of the progress bar.
  // Calculate Scrub Time: (click position / total width) × video duration.
  // If you click 30% along the bar, and the video is 200 seconds long: scrubTime = 0.3 × 200 = 60 seconds.
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  // video.currentTime = scrubTime: Jumps the video to that point.
  video.currentTime = scrubTime;
}

// Hook up the event listeners
video.addEventListener("click", togglePlay);
toggle.addEventListener("click", togglePlay);

video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);

skipButtons.forEach((skipbutton) => {
  skipbutton.addEventListener("click", skip);
});

ranges.forEach((range) => {
  // change event: Updates volume/playback when the slider value changes.
  // mousemove event: Allows real-time updates when dragging the slider.
  range.addEventListener("change", handleRangeUpdate);
  range.addEventListener("mousemove", handleRangeUpdate);
});

// timeupdate event fires every time the video time updates.
// Triggers handleProgress to update the progress bar dynamically.
video.addEventListener("timeupdate", handleProgress);

let mousedown = false;
// click: Scrubs the video when the bar is clicked.
// No parentheses scrub passing the function reference (function itself).
progress.addEventListener("click", scrub);
// mousemove: Scrubs while dragging with the mouse button pressed.
// scrub(e) → Invokes the scrub function, passing event e as an argument.
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
// mousedown: Sets mousedown to true when the mouse button is pressed.
// mouseup: Sets mousedown back to false when the mouse is released.
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

// Final Functionality Overview
// 🎯 Features Implemented:

// Play/Pause → Click video or play button.
// Skip → Click skip buttons to jump forward/backward.
// Volume Control → Drag the volume slider.
// Playback Speed Control → Drag the playback rate slider.
// Progress Bar → Displays playback progress.
// Scrubbing → Click or drag along the progress bar.
