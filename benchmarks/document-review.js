(() => {
  const pairs = [...document.querySelectorAll(".pair")];
  const cases = document.querySelector("#case-select");
  const repeats = document.querySelector("#repeat-select");
  const previous = document.querySelector("#previous");
  const next = document.querySelector("#next");
  let index = 0;
  function show() {
    const found = pairs.findIndex((p) => p.id === location.hash.slice(1));
    index = found < 0 ? 0 : found;
    const selected = pairs[index];
    pairs.forEach((p) => { p.hidden = p !== selected; });
    cases.value = selected.dataset.case;
    repeats.replaceChildren(...pairs.filter((p) => p.dataset.case === selected.dataset.case).map((p) => new Option(`${p.dataset.repeat}回目`, p.dataset.repeat)));
    repeats.value = selected.dataset.repeat;
    previous.disabled = index === 0;
    next.disabled = index === pairs.length - 1;
    document.querySelector("#position").textContent = `${index + 1} / ${pairs.length} 比較`;
    document.querySelector("#permalink").href = `#${selected.id}`;
    document.title = `${selected.querySelector("h2").textContent} | 文書レビュー`;
    window.scrollTo(0, 0);
  }
  cases.addEventListener("change", () => {
    const selected = pairs.find((p) => p.dataset.case === cases.value && p.dataset.repeat === repeats.value) ?? pairs.find((p) => p.dataset.case === cases.value);
    location.hash = selected.id;
  });
  repeats.addEventListener("change", () => { location.hash = `${cases.value}.${repeats.value}`; });
  previous.addEventListener("click", () => { location.hash = pairs[index - 1].id; });
  next.addEventListener("click", () => { location.hash = pairs[index + 1].id; });
  window.addEventListener("hashchange", show);
  show();
  document.querySelector(".controls").hidden = false;
  document.querySelector(".pagination").hidden = false;
})();
