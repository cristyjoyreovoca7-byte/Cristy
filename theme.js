/* theme.js - Day / Night switch. Day = 6:00-17:59 unless the visitor chose a mode. */
(function () {
  "use strict";
  const root = document.documentElement;
  const hour = new Date().getHours();
  const auto = hour >= 6 && hour < 18 ? "day" : "night";
  root.dataset.theme = localStorage.getItem("theme") || auto;

  const rand = (a, b) => a + Math.random() * (b - a);
  const make = (cls, css, html) => {
    const el = document.createElement("div");
    el.className = cls;
    el.style.cssText = css;
    if (html) el.innerHTML = html;
    return el;
  };

  function buildScene() {
    const sky = make("", "");
    sky.id = "sky";
    sky.setAttribute("aria-hidden", "true");

    const night = make("night", "");
    night.append(make("moon", ""));
    for (let i = 0; i < 80; i++)
      night.append(make("star", `left:${rand(0, 100)}%;top:${rand(0, 100)}%;--s:${rand(1, 3)}px;--t:${rand(2, 5)}s;--d:${rand(0, 4)}s`));

    const day = make("day", "");
    for (let i = 0; i < 6; i++)
      day.append(make("cloud", `--y:${rand(8, 75)}%;--k:${rand(0.6, 1.3)};--t:${rand(70, 130)}s;--d:-${rand(0, 120)}s`));
    const bird = '<svg viewBox="0 0 40 20"><path d="M2 14 Q10 0 20 12 Q30 0 38 14" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/></svg>';
    for (let i = 0; i < 5; i++)
      day.append(make("bird", `--y:${rand(10, 55)}%;--t:${rand(18, 34)}s;--d:-${rand(0, 30)}s`, bird));

    sky.append(night, day);
    document.body.prepend(sky);
  }

  function buildToggle() {
    const btn = document.createElement("button");
    btn.className = "theme-toggle";
    const label = () => { btn.textContent = root.dataset.theme === "day" ? "Switch to Night" : "Switch to Day"; };
    btn.onclick = () => {
      root.dataset.theme = root.dataset.theme === "day" ? "night" : "day";
      localStorage.setItem("theme", root.dataset.theme);
      label();
    };
    label();
    document.body.append(btn);
  }

  document.addEventListener("DOMContentLoaded", () => { buildScene(); buildToggle(); });
})();
