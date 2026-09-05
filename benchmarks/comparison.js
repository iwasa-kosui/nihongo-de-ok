(() => {
  const pairs = [...document.querySelectorAll(".pair")];
  const caseSelect = document.querySelector("#case-select");
  const repeatSelect = document.querySelector("#repeat-select");
  const stages = [...document.querySelectorAll("button[data-stage]")];
  const previous = document.querySelector("#previous");
  const next = document.querySelector("#next");
  let index = 0;
  let stage = "final";

  function show() {
    const parts = location.hash.slice(1).split(".");
    const found = pairs.findIndex((p) => p.id === `${parts[0]}.${parts[1]}`);
    index = found < 0 ? 0 : found;
    stage = parts[2] === "initial" ? "initial" : "final";
    const selected = pairs[index];
    pairs.forEach((p) => { p.hidden = p !== selected; });
    document.querySelectorAll(".draft").forEach((d) => { d.hidden = d.dataset.stage !== stage; });
    caseSelect.value = selected.dataset.case;
    repeatSelect.value = selected.dataset.repeat;
    stages.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.stage === stage)));
    previous.disabled = index === 0;
    next.disabled = index === pairs.length - 1;
    document.querySelector("#position").textContent = `${index + 1} / ${pairs.length} 比較`;
    document.querySelector("#permalink").href = `#${selected.id}.${stage}`;
    document.title = `${selected.querySelector("h2").textContent} · ${stage === "final" ? "最終稿" : "初稿"} | 執筆比較`;
    window.scrollTo(0, 0);
  }
  function navigate(id, value = stage) {
    location.hash = `${id}.${value}`;
  }
  caseSelect.addEventListener("change", () => navigate(`${caseSelect.value}.${repeatSelect.value}`));
  repeatSelect.addEventListener("change", () => navigate(`${caseSelect.value}.${repeatSelect.value}`));
  stages.forEach((b) => b.addEventListener("click", () => navigate(pairs[index].id, b.dataset.stage)));
  previous.addEventListener("click", () => navigate(pairs[index - 1].id));
  next.addEventListener("click", () => navigate(pairs[index + 1].id));
  window.addEventListener("hashchange", show);
  show();
  document.querySelector(".controls").hidden = false;
  document.querySelector(".pagination").hidden = false;
})();
