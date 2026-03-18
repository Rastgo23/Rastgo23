async function fetchState() {
  const response = await fetch('/api/state');
  return response.json();
}

function projectPoint(point) {
  return {
    left: `${10 + point.x / 18}px`,
    top: `${20 + point.y / 4}px`,
  };
}

function renderMap(target, points) {
  target.innerHTML = points.map((point) => {
    const style = projectPoint(point.coords);
    return `<div class="dot ${point.type}" style="left:${style.left};top:${style.top};" title="${point.label}"></div>`;
  }).join('');
}

window.ridex = { fetchState, renderMap };
