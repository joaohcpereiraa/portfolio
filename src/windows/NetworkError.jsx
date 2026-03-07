import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import useNetworkStore from "../store/network";

/* ── Canvas constants ─────────────────────────────────────────────── */
const CW = 700;
const CH = 300;
const GROUND = 240;
const DINO_X = 80;
const GRAVITY = 0.65;
const JUMP_VY = -13;
const INIT_SPEED = 5;

/* ── Draw helpers ─────────────────────────────────────────────────── */
function drawRoundRect(ctx, x, y, w, h, r = 4) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawDino(ctx, dino, color) {
  const { x, y, legPhase, ducking } = dino;
  ctx.fillStyle = color;

  if (ducking) {
    // Ducking: flat body
    drawRoundRect(ctx, x, y - 24, 52, 24, 4); // body
    drawRoundRect(ctx, x + 30, y - 36, 22, 16, 4); // head
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 44, y - 32, 5, 5); // eye
    ctx.fillStyle = color;
    // legs
    const l1 = legPhase > 0.5;
    ctx.fillRect(x + 8, y - 4, 10, l1 ? 10 : 4);
    ctx.fillRect(x + 24, y - 4, 10, l1 ? 4 : 10);
    return;
  }

  // Head
  drawRoundRect(ctx, x + 12, y - 48, 28, 20, 4);
  // Jaw
  drawRoundRect(ctx, x + 12, y - 30, 18, 8, 2);
  // Eye
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 30, y - 44, 6, 6);
  ctx.fillStyle = color;
  ctx.fillRect(x + 32, y - 42, 3, 3); // pupil
  // Body
  ctx.fillStyle = color;
  drawRoundRect(ctx, x, y - 36, 28, 24, 4);
  // Tail
  ctx.beginPath();
  ctx.moveTo(x, y - 36);
  ctx.lineTo(x - 16, y - 16);
  ctx.lineTo(x, y - 20);
  ctx.closePath();
  ctx.fill();
  // Legs
  const a = legPhase > 0.5;
  ctx.fillRect(x + 4, y - 12, 10, a ? 18 : 10);
  ctx.fillRect(x + 16, y - 12, 10, a ? 10 : 18);
}

function drawCactus(ctx, obs, color) {
  ctx.fillStyle = color;
  const { x, variant } = obs;
  if (variant === 0) {
    // Single tall
    drawRoundRect(ctx, x + 8, GROUND - 56, 14, 56, 3);
    drawRoundRect(ctx, x, GROUND - 40, 10, 14, 3);
    drawRoundRect(ctx, x + 20, GROUND - 44, 10, 18, 3);
  } else if (variant === 1) {
    // Double
    drawRoundRect(ctx, x + 8, GROUND - 44, 12, 44, 3);
    drawRoundRect(ctx, x, GROUND - 32, 10, 12, 3);
    drawRoundRect(ctx, x + 20, GROUND - 36, 10, 14, 3);
    drawRoundRect(ctx, x + 38, GROUND - 50, 12, 50, 3);
    drawRoundRect(ctx, x + 30, GROUND - 36, 10, 12, 3);
    drawRoundRect(ctx, x + 48, GROUND - 40, 10, 14, 3);
  } else {
    // Triple cluster
    drawRoundRect(ctx, x + 6, GROUND - 64, 14, 64, 3);
    drawRoundRect(ctx, x, GROUND - 46, 8, 14, 3);
    drawRoundRect(ctx, x + 18, GROUND - 50, 8, 16, 3);
    drawRoundRect(ctx, x + 30, GROUND - 48, 14, 48, 3);
    drawRoundRect(ctx, x + 24, GROUND - 34, 8, 12, 3);
    drawRoundRect(ctx, x + 42, GROUND - 38, 8, 14, 3);
  }
}

function cactusWidth(variant) {
  return variant === 1 ? 58 : variant === 2 ? 52 : 30;
}

function drawCloud(ctx, cloud, color) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.35;
  drawRoundRect(ctx, cloud.x, cloud.y, 60, 16, 8);
  drawRoundRect(ctx, cloud.x + 10, cloud.y - 10, 40, 18, 8);
  ctx.globalAlpha = 1;
}

function drawGround(ctx, offsetX, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, GROUND, CW, 2);
  // Ground dots / pebbles
  const pebbles = [10, 50, 120, 200, 290, 380, 460, 530, 610, 670];
  pebbles.forEach((p) => {
    const px = (p - (offsetX % CW) + CW) % CW;
    ctx.fillRect(px, GROUND + 6, 6, 3);
    ctx.fillRect(px + 20, GROUND + 10, 4, 2);
  });
}

/* ── Component ────────────────────────────────────────────────────── */
const NetworkError = () => {
  const { toggleWifi } = useNetworkStore();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  const game = useRef({
    state: "idle", // idle | running | dead
    score: 0,
    hiScore: 0,
    speed: INIT_SPEED,
    frame: 0,
    groundX: 0,
    dino: {
      x: DINO_X,
      y: GROUND,
      vy: 0,
      onGround: true,
      legPhase: 0,
      ducking: false,
    },
    obstacles: [],
    clouds: [
      { x: 200, y: 60 },
      { x: 450, y: 40 },
      { x: 600, y: 80 },
    ],
    nextObstacleIn: 90,
  });

  // Detect dark mode
  const isDark = () => document.documentElement.classList.contains("dark");

  const getColors = () => ({
    bg: isDark() ? "#030712" : "#ffffff",
    fg: isDark() ? "#e5e7eb" : "#333333",
    grid: isDark() ? "#1f2937" : "#f3f4f6",
  });

  const resetGame = useCallback(() => {
    const g = game.current;
    g.state = "running";
    g.score = 0;
    g.speed = INIT_SPEED;
    g.frame = 0;
    g.groundX = 0;
    g.dino = {
      x: DINO_X,
      y: GROUND,
      vy: 0,
      onGround: true,
      legPhase: 0,
      ducking: false,
    };
    g.obstacles = [];
    g.nextObstacleIn = 90;
    g.clouds = [
      { x: 200, y: 60 },
      { x: 450, y: 40 },
      { x: 600, y: 80 },
    ];
  }, []);

  const jump = useCallback(() => {
    const g = game.current;
    if (g.state === "idle") {
      resetGame();
      return;
    }
    if (g.state === "dead") {
      resetGame();
      return;
    }
    if (g.dino.onGround) {
      g.dino.vy = JUMP_VY;
      g.dino.onGround = false;
    }
  }, [resetGame]);

  const duck = useCallback((on) => {
    game.current.dino.ducking = on;
  }, []);

  // Input
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
      if (e.code === "ArrowDown") duck(true);
    };
    const onKeyUp = (e) => {
      if (e.code === "ArrowDown") duck(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [jump, duck]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const tick = () => {
      const g = game.current;
      const { bg, fg } = getColors();

      // Clear
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CW, CH);

      // Clouds
      g.clouds.forEach((c) => {
        drawCloud(ctx, c, fg);
        if (g.state === "running") c.x -= g.speed * 0.3;
        if (c.x < -80) c.x = CW + 60;
      });

      // Ground
      if (g.state === "running") g.groundX += g.speed;
      drawGround(ctx, g.groundX, fg);

      if (g.state === "running") {
        g.frame++;
        g.score += 0.1;
        g.speed = INIT_SPEED + Math.floor(g.score / 100) * 0.4;

        // Dino physics
        const d = g.dino;
        if (!d.onGround) {
          d.vy += GRAVITY;
          d.y += d.vy;
          if (d.y >= GROUND) {
            d.y = GROUND;
            d.vy = 0;
            d.onGround = true;
          }
        }
        d.legPhase = (g.frame % 20) / 20;

        // Spawn obstacles
        g.nextObstacleIn--;
        if (g.nextObstacleIn <= 0) {
          const variant = Math.floor(Math.random() * 3);
          g.obstacles.push({ x: CW + 20, variant });
          g.nextObstacleIn = 70 + Math.random() * 80;
        }

        // Move & draw obstacles
        g.obstacles = g.obstacles.filter((o) => o.x > -80);
        g.obstacles.forEach((o) => {
          o.x -= g.speed;
          drawCactus(ctx, o, fg);

          // Collision (AABB, slightly forgiving)
          const dino = g.dino;
          const dinoL = dino.x + 8;
          const dinoR = dino.x + (dino.ducking ? 52 : 32);

          const obsL = o.x + 4;
          const obsR = o.x + cactusWidth(o.variant) - 4;
          const obsT =
            GROUND - (o.variant === 2 ? 64 : o.variant === 0 ? 56 : 50);
          if (dinoR > obsL && dinoL < obsR && dino.y > obsT) {
            g.hiScore = Math.max(g.hiScore, Math.floor(g.score));
            g.state = "dead";
          }
        });

        // Speed milestone flash (every 100 pts)
        if (
          Math.floor(g.score) % 100 === 0 &&
          Math.floor(g.score) > 0 &&
          g.frame % 4 < 2
        ) {
          ctx.fillStyle = fg;
          ctx.globalAlpha = 0.15;
          ctx.fillRect(0, 0, CW, CH);
          ctx.globalAlpha = 1;
        }
      }

      // Draw dino
      drawDino(ctx, g.dino, fg);

      // Score
      ctx.fillStyle = fg;
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "right";
      if (g.hiScore > 0) {
        ctx.globalAlpha = 0.4;
        ctx.fillText(
          `HI ${String(Math.floor(g.hiScore)).padStart(5, "0")}`,
          CW - 90,
          30,
        );
        ctx.globalAlpha = 1;
      }
      ctx.fillText(String(Math.floor(g.score)).padStart(5, "0"), CW - 20, 30);

      // Idle / dead overlays
      if (g.state === "idle") {
        ctx.fillStyle = fg;
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE or tap to start", CW / 2, GROUND - 70);
      }
      if (g.state === "dead") {
        ctx.fillStyle = fg;
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CW / 2, GROUND - 80);
        ctx.font = "13px monospace";
        ctx.fillText("Press SPACE or tap to restart", CW / 2, GROUND - 56);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white dark:bg-gray-950 select-none">
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-6 opacity-0"
      >
        {/* Chrome-style dino icon (static, greyed) */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 64 64"
          fill="none"
          className="text-gray-300 dark:text-gray-700"
          aria-hidden
        >
          <rect
            x="16"
            y="8"
            width="32"
            height="20"
            rx="4"
            fill="currentColor"
          />
          <rect x="36" y="4" width="12" height="8" rx="2" fill="currentColor" />
          <circle cx="44" cy="12" r="3" fill="white" />
          <circle cx="45" cy="11" r="1.5" fill="currentColor" />
          <rect
            x="8"
            y="24"
            width="30"
            height="24"
            rx="4"
            fill="currentColor"
          />
          <polygon points="8,24 0,40 8,36" fill="currentColor" />
          <rect
            x="12"
            y="44"
            width="10"
            height="16"
            rx="2"
            fill="currentColor"
          />
          <rect
            x="24"
            y="44"
            width="10"
            height="16"
            rx="2"
            fill="currentColor"
          />
        </svg>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            No internet connection
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-mono">
            ERR_INTERNET_DISCONNECTED
          </p>
        </div>

        {/* Canvas game */}
        <div
          className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer"
          onClick={jump}
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
        >
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            style={{
              display: "block",
              width: "min(700px, 90vw)",
              height: "auto",
            }}
          />
        </div>

        <button
          onClick={toggleWifi}
          className="mt-2 px-5 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-all"
        >
          Reconnect Wi-Fi
        </button>
      </div>
    </div>
  );
};

export default NetworkError;
