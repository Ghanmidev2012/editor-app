/**
 * Procedural Video Frame Generators
 * Mathematics-based frame composition to render rich high-fidelity visuals on-the-fly.
 * Decouples rendering code from React components and simulates raw decoded video.
 */

export function drawNeonGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  colorFilter: string = 'none'
) {
  // Slate-950 BACKGROUND
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, width, height);

  applyColorFilter(ctx, width, height, colorFilter, () => {
    // 3D Grid Perspective vanishing point
    const horizon = height * 0.45;
    const speed = time * 80;

    // Horizon glowing sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, horizon);

    // Glowing sun on horizon
    const sunGrad = ctx.createRadialGradient(width / 2, horizon, 0, width / 2, horizon, 90);
    sunGrad.addColorStop(0, '#f43f5e');
    sunGrad.addColorStop(0.3, '#d946ef');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(width / 2, horizon, 90, 0, Math.PI, true);
    ctx.fill();

    // Perspective Lines (Vanishing point grid)
    ctx.strokeStyle = '#e879f9';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#d946ef';

    // Horizontal moving grid lines
    const numHorizontalLines = 15;
    for (let i = 0; i < numHorizontalLines; i++) {
      const spacingLine = (i * 25 + (speed % 25));
      const ratio = spacingLine / (numHorizontalLines * 25);
      // Exponential warp to simulate depth
      const y = horizon + (height - horizon) * Math.pow(ratio, 2);
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical grid lines converging
    const numVerticalLines = 24;
    for (let i = -numVerticalLines / 2; i <= numVerticalLines / 2; i++) {
      const angle = i / (numVerticalLines / 2);
      ctx.beginPath();
      ctx.moveTo(width / 2, horizon);
      ctx.lineTo(width / 2 + angle * width * 1.5, height);
      ctx.stroke();
    }

    // Neon scanning bar
    const scannerY = horizon + (height - horizon) * (0.5 + Math.sin(time * 3.5) * 0.5);
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, scannerY);
    ctx.lineTo(width, scannerY);
    ctx.stroke();

    // Text metrics
    ctx.shadowBlur = 0;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`FRAME SYNC: ${(time * 30).toFixed(0)} | SPEED: 1.0X`, 15, height - 15);
  });
}

export function drawCosmicNebula(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  colorFilter: string = 'none'
) {
  // Deep space background
  ctx.fillStyle = "#03001e";
  ctx.fillRect(0, 0, width, height);

  applyColorFilter(ctx, width, height, colorFilter, () => {
    const cx = width / 2;
    const cy = height / 2;

    // Drawing stars
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 60; i++) {
      const angle = i * 2.4 + (time * 0.05);
      const dist = (i * 12 + (time * 40)) % (width * 0.6);
      const starX = cx + Math.cos(angle) * dist;
      const starY = cy + Math.sin(angle) * dist;
      const size = Math.max(0.5, (dist / (width * 0.6)) * 2);
      
      ctx.beginPath();
      ctx.arc(starX, starY, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw central swirling gas clouds (Nebula effect)
    ctx.globalCompositeOperation = 'screen';
    const numClouds = 4;
    for (let i = 0; i < numClouds; i++) {
      const progress = (time * 0.3 + (i / numClouds)) % 1.0;
      const radius = progress * 160;
      const alpha = Math.sin(progress * Math.PI) * 0.35;
      
      const cloudGrad = ctx.createRadialGradient(
        cx + Math.cos(time * 1.2 + i * 1.5) * 40,
        cy + Math.sin(time * 0.8 + i * 2) * 30,
        0,
        cx,
        cy,
        radius + 10
      );

      // Interpolate space gradients
      if (i % 2 === 0) {
        cloudGrad.addColorStop(0, `rgba(168, 85, 247, ${alpha})`); // purple
        cloudGrad.addColorStop(0.5, `rgba(59, 130, 246, ${alpha * 0.5})`); // blue
      } else {
        cloudGrad.addColorStop(0, `rgba(236, 72, 153, ${alpha})`); // pink
        cloudGrad.addColorStop(0.5, `rgba(244, 63, 94, ${alpha * 0.4})`); // rose
      }
      cloudGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Restore blend mode
    ctx.globalCompositeOperation = 'source-over';

    // HUD Display overlays
    ctx.font = '9px monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText("COSMIC DECODER ENABLED", 15, 20);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.strokeRect(10, 10, 150, 16);
  });
}

export function drawOceanSunset(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  colorFilter: string = 'none'
) {
  applyColorFilter(ctx, width, height, colorFilter, () => {
    const horizon = height * 0.6;

    // Sky gradient: orange, pink, reddish dusk
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
    skyGrad.addColorStop(0, '#fdba74'); // soft peach
    skyGrad.addColorStop(0.5, '#f472b6'); // hot pink
    skyGrad.addColorStop(1, '#818cf8'); // calm indigo at horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, horizon);

    // Dynamic, giant setting sun
    const sunY = horizon - 20 + Math.sin(time * 0.1) * 15;
    const sunGlow = ctx.createRadialGradient(width / 2, sunY, 0, width / 2, sunY, 110);
    sunGlow.addColorStop(0, '#fef08a'); // soft yellow
    sunGlow.addColorStop(0.4, '#f97316'); // rich orange
    sunGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(width / 2, sunY, 110, 0, Math.PI * 2);
    ctx.fill();

    // Ocean water grid and waves reflection
    const waterGrad = ctx.createLinearGradient(0, horizon, 0, height);
    waterGrad.addColorStop(0, '#312e81'); // deep indigo
    waterGrad.addColorStop(1, '#020617'); // dark background slate
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, horizon, width, height - horizon);

    // Beautiful glowing reflections on sea waves
    ctx.fillStyle = 'rgba(251, 146, 60, 0.25)';
    const waveCount = 8;
    for (let i = 1; i <= waveCount; i++) {
      const waveY = horizon + (height - horizon) * (i / waveCount);
      const waveW = (i / waveCount) * 240;
      const waveOffset = Math.sin(time * 2.0 + i) * 15;
      
      ctx.beginPath();
      ctx.ellipse(
        width / 2 + waveOffset, 
        waveY, 
        waveW, 
        3.5 + (i * 0.5), 
        0, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
    }

    // Bird silhouettes jumping
    ctx.fillStyle = '#312e81';
    for (let i = 0; i < 3; i++) {
      const bx = (width * 0.2 + i * 80 + time * 12) % width;
      const by = height * 0.25 + Math.sin(time * 3 + i) * 12;
      
      ctx.beginPath();
      ctx.moveTo(bx, by);
      // Left wing curve
      ctx.quadraticCurveTo(bx - 10, by - 8, bx - 20, by - 2);
      ctx.quadraticCurveTo(bx - 10, by - 2, bx, by);
      // Right wing curve
      ctx.quadraticCurveTo(bx + 10, by - 8, bx + 20, by - 2);
      ctx.quadraticCurveTo(bx + 10, by - 2, bx, by);
      ctx.fill();
    }
  });
}

export function drawRetroTech(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  colorFilter: string = 'none'
) {
  // Dark terminal
  ctx.fillStyle = "#050b14";
  ctx.fillRect(0, 0, width, height);

  applyColorFilter(ctx, width, height, colorFilter, () => {
    // Binary/hex lines scrolling
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.font = "11px monospace";

    const cols = 12;
    const rows = 14;
    for (let c = 0; c < cols; c++) {
      const x = 30 + c * (width - 40) / cols;
      const colOffset = Math.sin(c * 13.5) * 200;
      const speed = (time * 120 + colOffset) % height;
      
      for (let r = 0; r < rows; r++) {
        const y = (r * (height / rows) + speed) % height;
        const value = Math.floor(Math.abs(Math.sin(r + c + time * 0.5) * 255)).toString(16).toUpperCase();
        ctx.fillText(value.padStart(2, '0'), x, y);
      }
    }

    // Overlay grid overlay
    ctx.strokeStyle = "rgba(16, 185, 129, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // High fidelity oscilloscope wave
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#059669";
    
    ctx.beginPath();
    for (let x = 0; x < width; x += 3) {
      const wave = Math.sin(x * 0.02 + time * 5) * 35 * Math.sin(x * 0.003) * Math.cos(time * 0.5);
      const y = height / 2 + wave;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Capture HUD target selectors
    ctx.strokeStyle = "rgba(16, 185, 129, 0.8)";
    ctx.lineWidth = 1.5;
    
    // Corner brackets
    const margin = 20;
    const len = 15;
    // Top-Left
    ctx.beginPath(); ctx.moveTo(margin + len, margin); ctx.lineTo(margin, margin); ctx.lineTo(margin, margin + len); ctx.stroke();
    // Top-Right
    ctx.beginPath(); ctx.moveTo(width - margin - len, margin); ctx.lineTo(width - margin, margin); ctx.lineTo(width - margin, margin + len); ctx.stroke();
    // Bottom-Left
    ctx.beginPath(); ctx.moveTo(margin + len, height - margin); ctx.lineTo(margin, height - margin); ctx.lineTo(margin, height - margin + len); ctx.stroke();
    // Bottom-Right
    ctx.beginPath(); ctx.moveTo(width - margin - len, height - margin); ctx.lineTo(width - margin, height - margin); ctx.lineTo(width - margin, height - margin + len); ctx.stroke();
  });
}

/**
 * Applies custom frame manipulation filters within the canvas rendering pipeline
 */
export function applyColorFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: string,
  drawCallback: () => void
) {
  // Save pre-filter context
  ctx.save();

  // Route native Canvas filter presets where possible
  switch (filter) {
    case 'grayscale':
      ctx.filter = 'grayscale(100%)';
      break;
    case 'sepia':
      ctx.filter = 'sepia(85%) contrast(1.1) brightness(0.95)';
      break;
    case 'warm':
      ctx.filter = 'saturate(130%) sepia(20%) saturate(120%)';
      break;
    case 'cool':
      ctx.filter = 'contrast(1.05) hue-rotate(15deg) saturate(110%)';
      break;
    case 'vintage':
      ctx.filter = 'contrast(0.9) saturate(85%) brightness(1.05)';
      break;
    case 'cyberpunk':
      ctx.filter = 'contrast(1.3) saturate(200%) hue-rotate(-20deg)';
      break;
    default:
      ctx.filter = 'none';
  }

  // Draw target graphics
  drawCallback();

  // If vintage, draw vintage texture lines overlay
  if (filter === 'vintage') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 4; i++) {
      const lineX = (Math.random() * width);
      ctx.fillRect(lineX, 0, 1.5, height);
    }
    // Scratch specs
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
  }

  // Restore non-filtered environment to preserve layout outer scopes
  ctx.restore();
}
