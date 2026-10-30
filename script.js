/* =====================================================
   script.js  -  shared behaviour for all main pages
   1 Helpers | 2 Auth | 3 Layout | 4 Music | 5 Slider
   6 Fun facts | 7 Skills tabs | 8 Goals | 9 Gallery | 10 Contact
   ===================================================== */

/* 1. HELPERS */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* 2. AUTH */
function confirmLogout() {
  if (confirm("Are you sure you want to log out?")) {
    sessionStorage.removeItem("isLoggedIn");
    location.href = "login.html";
  }
}
if (!sessionStorage.getItem("isLoggedIn")) location.href = "login.html";

/* 3. LAYOUT (header, nav, footer, music player) */
const NAV = page => {
  const on = k => (page === k ? ' class="on"' : "");
  return `<header><h1>Welcome to My Personal Website</h1></header>
  <nav><ul>
    <li><a href="index.html"${on("home")}>HOME</a></li>
    <li class="dropdown"><a href="#" class="dropbtn">ABOUT</a>
      <div class="dropdown-content">
        <a href="skills.html">Skills I'm Developing</a>
        <a href="goals.html">My Goals as a Student</a>
        <a href="funfacts.html">Fun Facts About Me</a>
      </div></li>
    <li><a href="gallery.html"${on("gallery")}>GALLERY</a></li>
    <li><a href="contact.html"${on("contact")}>CONTACT</a></li>
    <a href="javascript:void(0)" class="logout-button" onclick="confirmLogout()">LOG OUT</a>
  </ul></nav>`;
};
const FOOTER = `<footer><p>&copy; 2024 Your Name. All rights reserved.</p></footer>
  <div class="player"><button class="btn" id="pp" aria-label="Play or pause music">Play</button>
  <span>Ambient Tide</span>
  <input id="vol" type="range" min="0" max="1" step=".05" value=".6" aria-label="Volume"></div>
  <audio id="aud" src="media/ambient-music.mp3" loop></audio>`;
document.body.insertAdjacentHTML("afterbegin", NAV(document.body.dataset.page));
document.body.insertAdjacentHTML("beforeend", FOOTER);

/* 4. MUSIC (keeps position and volume between pages) */
(function () {
  const a = $("#aud"), b = $("#pp"), v = $("#vol");
  a.volume = +sessionStorage.vol || 0.6;
  v.value = a.volume;
  a.currentTime = +sessionStorage.t || 0;
  if (sessionStorage.playing === "1") a.play().catch(() => {});
  b.onclick = () => (a.paused ? a.play() : a.pause());
  a.onplay = () => { b.textContent = "Pause"; sessionStorage.playing = "1"; };
  a.onpause = () => { b.textContent = "Play"; if (!document.hidden) sessionStorage.playing = "0"; };
  v.oninput = e => { a.volume = e.target.value; sessionStorage.vol = e.target.value; };
  addEventListener("pagehide", () => { sessionStorage.t = a.currentTime; sessionStorage.playing = a.paused ? "0" : "1"; });
})();

/* 5. HOME SLIDER */
const slides = $(".slides");
if (slides) {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % slides.children.length;
    slides.style.transform = `translateX(${-i * 100}%)`;
  }, 3500);
}

/* 6. FUN FACTS (flip cards) */
const FACTS = [
  ["I love Programming!", "I can code and make a mean cup of coffee, always a study essential!"],
  ["Coffee Explorer!", "I'm on a mission to try every coffee shop in my town!"],
  ["Code + Music Combo!", "My best code happens when I'm listening to OPM and RNB!"],
  ["Goal Setter!", "I keep a list of 100 things to achieve this year, from tiny wins to big dreams!"],
  ["Night Owl!", "My best ideas show up after midnight."],
  ["Tiny Tinkerer!", "I redesign my own website every few months."],
  ["Sketch Habit!", "I doodle layouts in the margins of my notes."],
  ["Team Player!", "I enjoy pair programming more than coding alone."]
];
const factBox = $("#facts");
if (factBox) {
  factBox.innerHTML = FACTS.slice(0, +factBox.dataset.n).map(([front, back]) =>
    `<div class="funfact-card" tabindex="0"><div class="funfact-inner">
       <div class="funfact-front"><p>${front}</p></div>
       <div class="funfact-back"><p>${back}</p></div></div></div>`).join("");
}

/* 7. SKILLS TABS */
function openTab(evt, id) {
  $$(".tabcontent").forEach(t => (t.style.display = "none"));
  $$(".tablinks").forEach(t => t.classList.remove("active"));
  $("#" + id).style.display = "block";
  evt.currentTarget.classList.add("active");
}
if ($(".tablinks")) $(".tablinks").click();

/* 8. GOAL CARDS */
$$(".goal-card").forEach(card =>
  card.addEventListener("click", () => card.querySelector(".goal-details").classList.toggle("active")));

/* 9. GALLERY LIGHTBOX */
const thumbs = $$(".thumbnail"), box = $("#lightbox");
let current = 0;
function showImage(i) { current = (i + thumbs.length) % thumbs.length; $("#lightboxImage").src = thumbs[current].src; }
function openLightbox(i) { showImage(i); box.classList.add("open"); }
function closeLightbox() { box.classList.remove("open"); }
function changeImage(step) { showImage(current + step); }
thumbs.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));
addEventListener("keydown", e => {
  if (!box || !box.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") changeImage(-1);
  if (e.key === "ArrowRight") changeImage(1);
});

/* 10. CONTACT FORM VALIDATION */
const form = $("#contactForm");
if (form) {
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    $$(".error").forEach(x => (x.textContent = ""));
    const need = (id, msg) => { if (!$("#" + id).value.trim()) { $("#" + id + "Error").textContent = msg; ok = false; } };
    need("name", "Name is required");
    need("email", "Email is required");
    need("message", "Message is required");
    const mail = $("#email").value.trim();
    if (mail && !emailOk(mail)) { $("#emailError").textContent = "Please enter a valid email"; ok = false; }
    if (ok) { alert("Your message has been sent successfully!"); form.reset(); }
  });
}
