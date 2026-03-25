const CONFIG = {
  totalHeight: 8000,
  nbLines: 5,
  lineSpacing: 12,
  centerX: 0.2,

  amplitude: 45,
  frequency: 0.01,
  phaseOffset: -1.4,

  noteSpacing: 40,
  noteColors: ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93"],

  strokeWidth: 3,
  staffColor: "var(--color-staff-line, rgba(255, 255, 255, 0.3))",
};

function calculateX(y, xBase, amplitude) {
  return (
    xBase + Math.sin(y * CONFIG.frequency + CONFIG.phaseOffset) * amplitude
  );
}

function initPartition() {
  const svg = document.getElementById("staff-svg");
  const container = document.getElementById("main-scroll-container");
  const notesLayer = document.getElementById("notes-layer");

  if (!svg || !container) return;

  svg.innerHTML = "";

  const pathContainer = document.querySelector(".path-container");
  if (pathContainer) {
    container.style.display = "none";
    CONFIG.totalHeight = pathContainer.scrollHeight;
    container.style.display = "flex";
  }

  svg.style.height = `${CONFIG.totalHeight}px`;
  const width = window.innerWidth;
  const startX =
    width * CONFIG.centerX - ((CONFIG.nbLines - 1) * CONFIG.lineSpacing) / 2;

  const paths = [];
  for (let i = 0; i < CONFIG.nbLines; i++) {
    const xOffset = startX + i * CONFIG.lineSpacing;
    const lineAmplitude = CONFIG.amplitude + i * 4;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    let d = `M ${calculateX(0, xOffset, lineAmplitude)},0`;
    for (let y = 10; y <= CONFIG.totalHeight; y += 15) {
      d += ` L ${calculateX(y, xOffset, lineAmplitude)},${y}`;
    }

    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", CONFIG.staffColor);
    path.setAttribute("stroke-width", CONFIG.strokeWidth);
    path.setAttribute("stroke-linecap", "round");

    svg.appendChild(path);
    paths.push(path);
  }

  createAllNotes(paths, startX);
}

function createAllNotes(paths, startX) {
  const notesLayer = document.getElementById("notes-layer");
  if (!notesLayer || paths.length === 0) return;

  const referencePath = paths[0];
  const pathLength = referencePath.getTotalLength();
  const usableLength = pathLength - 100;

  const getLineX = (idx, y) => {
    const xOffset = startX + idx * CONFIG.lineSpacing;
    const lineAmplitude = CONFIG.amplitude + idx * 4;
    return calculateX(y, xOffset, lineAmplitude);
  };

  let distance = 50;
  while (distance < usableLength) {
    const noteTypes = [
      "quarter",
      "eighth",
      "sixteenth",
      "thirty-second",
      "sixty-fourth",
      "beamed-eighth",
      "beamed-sixteenth",
      "triplet",
    ];

    const type = noteTypes[Math.floor(Math.random() * noteTypes.length)];

    const randomLineIndex = Math.floor(Math.random() * CONFIG.nbLines);
    let noteLines = [];

    if (type === "beamed-eighth" || type === "beamed-sixteenth") {
      let l1 = randomLineIndex;
      let l2 = l1;
      while (l2 === l1) l2 = Math.floor(Math.random() * CONFIG.nbLines);

      noteLines = [l1, l2];
    } else if (type === "triplet") {
      let l1 = Math.floor(Math.random() * (CONFIG.nbLines - 2));
      let dir = Math.random() > 0.5 ? 1 : -1;
      if (dir === -1) l1 += 2;
      noteLines = [l1, l1 + dir, l1 + 2 * dir];
    } else {
      noteLines = [randomLineIndex];
    }

    const baseLineIndex = noteLines[0];
    const path = paths[baseLineIndex];
    const point = path.getPointAtLength(distance);

    const p1 = path.getPointAtLength(Math.max(0, distance - 1));
    const p2 = path.getPointAtLength(Math.min(pathLength, distance + 1));
    const angle = Math.atan2(p2.x - p1.x, p2.y - p1.y) * (180 / Math.PI);

    const maxLineInGroup = noteLines[noteLines.length - 1];
    const placeBetween =
      maxLineInGroup < CONFIG.nbLines - 1 && Math.random() > 0.5;
    const xOffsetGlobal = placeBetween ? CONFIG.lineSpacing / 2 : 0;

    const note = document.createElement("div");
    note.className = "note-container";
    const color =
      CONFIG.noteColors[Math.floor(Math.random() * CONFIG.noteColors.length)];

    const sineValue = Math.sin(point.y * CONFIG.frequency + CONFIG.phaseOffset);
    const scale = 1 + sineValue * 0.35;

    const dxs = noteLines.map((idx) => {
      const dxVisual =
        getLineX(idx, point.y) - getLineX(baseLineIndex, point.y);
      return dxVisual / scale;
    });

    let innerHTML = "";
    const stems = [];
    const timeStep = 18;

    if (noteLines.length === 1) {
      const dx = dxs[0];
      const hL = dx - 7,
        sL = dx + 4,
        fL = dx + 6;

      switch (type) {
        case "quarter":
          innerHTML = `<div class="note-stem" style="left: ${sL}px;"></div><div class="note-head" style="--note-color: ${color}; left: ${hL}px;"></div>`;
          break;
        case "eighth":
          innerHTML = `<div class="note-stem" style="left: ${sL}px;"></div><div class="note-head" style="--note-color: ${color}; left: ${hL}px;"></div><div class="note-flag" style="left: ${fL}px;"></div>`;
          break;
        case "sixteenth":
          innerHTML = `<div class="note-stem" style="left: ${sL}px;"></div><div class="note-head" style="--note-color: ${color}; left: ${hL}px;"></div><div class="note-flag" style="left: ${fL}px;"></div><div class="note-flag flag-2" style="left: ${fL}px;"></div>`;
          break;
        case "thirty-second":
          innerHTML = `<div class="note-stem" style="left: ${sL}px;"></div><div class="note-head" style="--note-color: ${color}; left: ${hL}px;"></div><div class="note-flag" style="left: ${fL}px;"></div><div class="note-flag flag-2" style="left: ${fL}px;"></div><div class="note-flag flag-3" style="left: ${fL}px;"></div>`;
          break;
        case "sixty-fourth":
          innerHTML = `<div class="note-stem" style="left: ${sL}px;"></div><div class="note-head" style="--note-color: ${color}; left: ${hL}px;"></div><div class="note-flag" style="left: ${fL}px;"></div><div class="note-flag flag-2" style="left: ${fL}px;"></div><div class="note-flag flag-3" style="left: ${fL}px;"></div><div class="note-flag flag-4" style="left: ${fL}px;"></div>`;
          break;
      }
    } else {
      noteLines.forEach((lineIdx, i) => {
        const dx = dxs[i];
        const dy = i * timeStep;

        const local_left = dy;
        const local_top = -dx;

        const hL = local_left - 7;
        const hT = local_top - 5;
        const sL = local_left + 4;
        const sT = local_top - 25;
        stems.push({ x: sL, y: sT });
        innerHTML += `<div class="note-head" style="--note-color: ${color}; left: ${hL}px; top: ${hT}px;"></div><div class="note-stem" style="left: ${sL}px; top: ${sT}px;"></div>`;
      });

      const firstStem = stems[0];
      const lastStem = stems[stems.length - 1];
      const deltaX = lastStem.x - firstStem.x;
      const deltaY = lastStem.y - firstStem.y;
      const beamWidth = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + 8;
      const beamAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      const beamX = firstStem.x - 4;
      const beamY = firstStem.y;
      const baseBeamTransform = `rotate(${beamAngle}deg)`;
      const beamStyle = `left: ${beamX}px; top: ${beamY}px; width: ${beamWidth}px; transform: ${baseBeamTransform}; transform-origin: 4px center;`;

      if (type === "beamed-eighth") {
        innerHTML += `<div class="note-beam" style="${beamStyle}"></div>`;
      } else if (type === "beamed-sixteenth") {
        const beamOffset = deltaX >= 0 ? 7 : -7;
        const beam2Style = `left: ${beamX}px; top: ${beamY}px; width: ${beamWidth}px; transform: ${baseBeamTransform} translateY(${beamOffset}px); transform-origin: 4px center;`;
        innerHTML += `<div class="note-beam" style="${beamStyle}"></div><div class="note-beam" style="${beam2Style}"></div>`;
      } else if (type === "triplet") {
        innerHTML += `<div class="note-beam" style="${beamStyle}"></div>`;
      }
    }

    note.innerHTML = innerHTML;

    note.style.left = `${point.x + xOffsetGlobal}px`;
    note.style.top = `${point.y}px`;
    note.style.transform = `translate(-50%, -50%) rotate(${-angle + 90}deg) scale(${scale})`;

    notesLayer.appendChild(note);

    const groupVerticalSpan =
      noteLines.length > 1 ? (noteLines.length - 1) * timeStep : 0;
    distance += CONFIG.noteSpacing + groupVerticalSpan;
  }
}

function changeAllNoteColors() {
  const noteHeads = document.querySelectorAll(".note-head");
  noteHeads.forEach((head) => {
    const newColor =
      CONFIG.noteColors[Math.floor(Math.random() * CONFIG.noteColors.length)];
    head.style.setProperty("--note-color", newColor);
  });
}

window.initPartition = initPartition;
