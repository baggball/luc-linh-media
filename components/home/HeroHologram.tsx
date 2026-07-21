"use client";

import { useRef, type MouseEvent } from "react";
import styles from "@/app/home.module.css";

export default function HeroHologram() {
  const sceneRef = useRef<HTMLDivElement>(null);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    scene.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    scene.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
    scene.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    scene.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  }

  function resetTilt() {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty("--rx", "0deg");
    scene.style.setProperty("--ry", "0deg");
  }

  return (
    <div className={styles.holoStage} onMouseMove={handleMove} onMouseLeave={resetTilt}>
      <div className={styles.holoGlow} aria-hidden="true" />
      <div className={styles.holoScene} ref={sceneRef}>
        <div className={styles.holoGrid} aria-hidden="true" />
        <div className={styles.orbitOne} aria-hidden="true" />
        <div className={styles.orbitTwo} aria-hidden="true" />
        <div className={styles.aiCore} aria-hidden="true">
          <div className={styles.coreHalo} />
          <div className={styles.coreOrb}>
            <span>AI</span>
          </div>
          <div className={styles.corePulse} />
        </div>

        <div className={`${styles.floatPanel} ${styles.panelPrompt}`}>
          <span className={styles.panelKicker}>PROMPT ENGINE</span>
          <b>Kịch bản KOC 30 giây</b>
          <small>Giọng Gen Z · Hook bán hàng</small>
          <div className={styles.progress}><i /></div>
        </div>

        <div className={`${styles.floatPanel} ${styles.panelVideo}`}>
          <span className={styles.liveDot} />
          <div><b>Veo3 Ready</b><small>Video đang được dựng</small></div>
          <strong>98%</strong>
        </div>

        <div className={`${styles.floatPanel} ${styles.panelResult}`}>
          <span>✓</span>
          <div><b>Hoàn tất trong vài giây</b><small>Prompt · Chatbot · Workflow</small></div>
        </div>

        <div className={styles.energyChip}>1.200+ AI ASSETS</div>
        <span className={`${styles.spark} ${styles.sparkOne}`} aria-hidden="true" />
        <span className={`${styles.spark} ${styles.sparkTwo}`} aria-hidden="true" />
        <span className={`${styles.spark} ${styles.sparkThree}`} aria-hidden="true" />
      </div>
    </div>
  );
}
