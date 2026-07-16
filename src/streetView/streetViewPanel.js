export function createStreetViewPanel() {
  const panel = document.createElement("div");
  panel.id = "street-view-panel";
  panel.innerHTML = `
    <div class="street-view-header">
      <span class="street-view-title">Street View</span>
      <button type="button" class="street-view-close" aria-label="Close street view">×</button>
    </div>
    <div id="street-view-container"></div>
    <div class="street-view-resize-handle" aria-hidden="true"></div>
  `;
  document.body.appendChild(panel);

  const header = panel.querySelector(".street-view-header");
  const closeBtn = panel.querySelector(".street-view-close");
  const resizeHandle = panel.querySelector(".street-view-resize-handle");

  let dragging = false;
  let resizing = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let startWidth = 0;
  let startHeight = 0;
  let startMouseX = 0;
  let startMouseY = 0;

  header.addEventListener("mousedown", (event) => {
    if (event.target === closeBtn) return;
    dragging = true;
    const rect = panel.getBoundingClientRect();
    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;
    panel.classList.add("is-interacting");
    event.preventDefault();
  });

  resizeHandle.addEventListener("mousedown", (event) => {
    resizing = true;
    const rect = panel.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;
    startMouseX = event.clientX;
    startMouseY = event.clientY;
    panel.classList.add("is-interacting");
    event.preventDefault();
    event.stopPropagation();
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.add("is-hidden");
  });

  window.addEventListener("mousemove", (event) => {
    if (dragging) {
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;
      const left = Math.max(0, Math.min(event.clientX - dragOffsetX, maxX));
      const top = Math.max(0, Math.min(event.clientY - dragOffsetY, maxY));
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    }

    if (resizing) {
      const width = Math.max(280, startWidth + (event.clientX - startMouseX));
      const height = Math.max(200, startHeight + (event.clientY - startMouseY));
      panel.style.width = `${width}px`;
      panel.style.height = `${height}px`;
    }
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
    resizing = false;
    panel.classList.remove("is-interacting");
  });

  return panel;
}
