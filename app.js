// ────────────────────────────────────────────────
// UI event handling & DOM rendering
// ────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const btn       = document.getElementById("generate");
  const results   = document.getElementById("results");
  const cultureEl = document.getElementById("culture-select");
  const categoryEl = document.getElementById("category-select");

  btn.addEventListener("click", () => {
    const culture  = cultureEl.value;
    const category = categoryEl.value;

    const names = generateNames(culture, category);

    results.innerHTML = "";

    names.forEach(name => {
      const card = document.createElement("div");
      card.className = "result-card";

      const label = document.createElement("h3");
      label.textContent = category.replace(/&/, "and").toUpperCase();

      const nameEl = document.createElement("div");
      nameEl.className = "name";
      nameEl.textContent = name;

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.textContent = "Copy";
      copyBtn.addEventListener("click", () => {
        copyToClipboard(name);
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy", 1600);
      });

      card.appendChild(label);
      card.appendChild(nameEl);
      card.appendChild(copyBtn);
      results.appendChild(card);
    });
  });

  // Optional: generate immediately on page load
  // btn.click();
});
