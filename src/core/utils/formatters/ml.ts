/**
 * Formatters for ML commands — classify, scan, demo-live.
 * Renders classification results as terminal output.
 */

import type { ClassificationResult, ModelLoadProgress } from "../../ml/promptInjectionClassifier";
import { EXAMPLE_PROMPTS } from "../../ml/examples";

// ── Classify Result ─────────────────────────────────────────

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "#ff3333",
  HIGH: "#ff6b6b",
  MEDIUM: "#ffff66",
  LOW: "#ff9900",
  SAFE: "#00ff00",
};

const RISK_BARS: Record<string, string> = {
  CRITICAL: "████████████████████ 95-100%",
  HIGH: "████████████████░░░░ 85-95%",
  MEDIUM: "████████████░░░░░░░░ 70-85%",
  LOW: "████████░░░░░░░░░░░░ 50-70%",
  SAFE: "░░░░░░░░░░░░░░░░░░░░ <50%",
};

/** Escape HTML entities — defense in depth alongside DOMPurify */
function htmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatClassifyResult(result: ClassificationResult, input: string): string {
  const riskColor = RISK_COLORS[result.riskLevel] || "#888888";
  const truncatedInput = htmlEscape(input.length > 80 ? input.slice(0, 77) + "..." : input);

  const header = result.isInjection
    ? `<span style="color:#ff3333">⚠  PROMPT INJECTION DETECTED</span>`
    : `<span style="color:#00ff00">✓  INPUT CLASSIFIED AS SAFE</span>`;

  return `
<span style="color:#2563eb">╔══════════════════════════════════════════════════════════════╗</span>
<span style="color:#2563eb">║          PROMPT INJECTION CLASSIFIER — LIVE INFERENCE        ║</span>
<span style="color:#2563eb">║          Model running in your browser (WebAssembly)         ║</span>
<span style="color:#2563eb">╚══════════════════════════════════════════════════════════════╝</span>

<span style="color:#888888">INPUT:</span>  <span style="color:#cfcfcf">"${truncatedInput}"</span>

${header}

<span style="color:#3399ff">┌─── CLASSIFICATION ───────────────────────────────────────────┐</span>
<span style="color:#888888">│</span>  <span style="color:#888888">Label:</span>       <span style="color:${riskColor};font-weight:bold">${result.label}</span>
<span style="color:#888888">│</span>  <span style="color:#888888">Confidence:</span>  <span style="color:${riskColor}">${(result.score * 100).toFixed(2)}%</span>
<span style="color:#888888">│</span>  <span style="color:#888888">Risk Level:</span>  <span style="color:${riskColor}">${result.riskLevel}</span>  <span style="color:${riskColor}">${RISK_BARS[result.riskLevel]}</span>
<span style="color:#888888">│</span>  <span style="color:#888888">Latency:</span>     <span style="color:#00ff00">${result.latencyMs}ms</span>
<span style="color:#3399ff">└──────────────────────────────────────────────────────────────┘</span>

<span style="color:#ffff66">┌─── MODEL INFO ───────────────────────────────────────────────┐</span>
<span style="color:#888888">│</span>  <span style="color:#888888">Model:</span>     <span style="color:#3399ff">${result.model.name}</span>
<span style="color:#888888">│</span>  <span style="color:#888888">Format:</span>    ${result.model.quantization}
<span style="color:#888888">│</span>  <span style="color:#888888">Runtime:</span>   ${result.model.runtime}
<span style="color:#888888">│</span>  <span style="color:#888888">Location:</span>  <span style="color:#00ff00">100% client-side — zero data sent to any server</span>
<span style="color:#ffff66">└──────────────────────────────────────────────────────────────┘</span>

<span style="color:#888888">Try more: </span><span style="color:#3399ff">classify "Your text here"</span><span style="color:#888888"> or </span><span style="color:#3399ff">classify --examples</span>
`;
}

// ── Progress Display ────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)}GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)}MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)}KB`;
  return `${bytes}B`;
}

export function formatClassifyProgress(progress: ModelLoadProgress): string {
  if (progress.status === "downloading") {
    const bar = generateProgressBar(progress.progress);
    const file = progress.file ? (progress.file.split("/").pop() ?? "") : "";
    // Show MB progress when available (e.g. "342MB / 704MB")
    const sizeInfo =
      progress.loaded !== undefined && progress.total !== undefined
        ? ` <span style="color:#888888">${formatBytes(progress.loaded)} / ${formatBytes(progress.total)}</span>`
        : "";
    return `<span style="color:#3399ff">[MODEL]</span> ${file}  ${bar}  <span style="color:#ffff66">${progress.progress}%</span>${sizeInfo}`;
  }

  if (progress.status === "loading") {
    return `<span style="color:#3399ff">[MODEL]</span> Initializing ONNX Runtime (WebAssembly)...`;
  }

  if (progress.status === "ready") {
    return `<span style="color:#00ff00">[MODEL]</span> Model ready — running inference...`;
  }

  return `<span style="color:#ff3333">[ERROR]</span> ${progress.error ?? "Failed to load model"}`;
}

function generateProgressBar(percent: number): string {
  const filled = Math.round(percent / 5);
  const empty = 20 - filled;
  return `<span style="color:#00ff00">${"█".repeat(filled)}</span><span style="color:#333333">${"░".repeat(empty)}</span>`;
}

// ── Help / Examples ─────────────────────────────────────────

export function formatClassifyHelp(): string {
  const examples = EXAMPLE_PROMPTS.slice(0, 6)
    .map((ex) => {
      const icon = ex.expectedLabel === "INJECTION" ? "🔴" : "🟢";
      const color = ex.expectedLabel === "INJECTION" ? "#ff6b6b" : "#00ff00";
      return `<span style="color:#888888">│</span>  ${icon} <span style="color:${color}">[${ex.expectedLabel.padEnd(9)}]</span> <span style="color:#cfcfcf">${ex.category}</span>
<span style="color:#888888">│</span>     <span style="color:#3399ff">classify "${ex.text.length > 60 ? ex.text.slice(0, 57) + "..." : ex.text}"</span>`;
    })
    .join("\n");

  return `
<span style="color:#ff3333">╔══════════════════════════════════════════════════════════════╗</span>
<span style="color:#ff3333">║          PROMPT INJECTION CLASSIFIER                         ║</span>
<span style="color:#ff3333">║          Real ML Model · In-Browser · Zero Backend           ║</span>
<span style="color:#ff3333">╚══════════════════════════════════════════════════════════════╝</span>

<span style="color:#ffff66">USAGE:</span>
  <span style="color:#3399ff">classify "&lt;text&gt;"</span>        Analyze text for prompt injection
  <span style="color:#3399ff">classify --examples</span>     Run all example prompts
  <span style="color:#3399ff">classify --benchmark</span>    Benchmark inference speed

<span style="color:#ffff66">HOW IT WORKS:</span>
  A DeBERTa-v3 transformer (184M params, FP32) runs entirely
  in your browser via ONNX Runtime WebAssembly. No data is sent
  to any server — all inference happens locally on your device.

  First run downloads the model (~700MB, cached by browser after).
  Subsequent visits load instantly from cache. Inference: &lt;200ms.

<span style="color:#ffff66">┌─── EXAMPLE PROMPTS ──────────────────────────────────────────┐</span>
${examples}
<span style="color:#ffff66">└──────────────────────────────────────────────────────────────┘</span>

<span style="color:#888888">Model: protectai/deberta-v3-base-prompt-injection-v2 (140K+ downloads)</span>
<span style="color:#888888">Built by Adrian Infantes — AI Red Teamer</span>
`;
}

// ── Benchmark ───────────────────────────────────────────────

export function formatBenchmarkResult(
  results: { input: string; result: ClassificationResult; correct: boolean }[]
): string {
  const totalLatency = results.reduce((sum, r) => sum + r.result.latencyMs, 0);
  const avgLatency = Math.round(totalLatency / results.length);
  const accuracy = results.filter((r) => r.correct).length;
  const total = results.length;

  const lines = results
    .map((r) => {
      const icon = r.correct ? "✓" : "✗";
      const iconColor = r.correct ? "#00ff00" : "#ff3333";
      const labelColor = r.result.isInjection ? "#ff6b6b" : "#00ff00";
      const truncated = r.input.length > 45 ? r.input.slice(0, 42) + "..." : r.input;

      return `<span style="color:#888888">│</span> <span style="color:${iconColor}">${icon}</span> <span style="color:${labelColor}">[${r.result.label.padEnd(9)}]</span> <span style="color:#888888">${r.result.score.toFixed(3)}</span>  <span style="color:#888888">${String(r.result.latencyMs).padStart(4)}ms</span>  <span style="color:#cfcfcf">${truncated}</span>`;
    })
    .join("\n");

  return `
<span style="color:#2563eb">╔══════════════════════════════════════════════════════════════╗</span>
<span style="color:#2563eb">║          BENCHMARK — PROMPT INJECTION CLASSIFIER             ║</span>
<span style="color:#2563eb">╚══════════════════════════════════════════════════════════════╝</span>

<span style="color:#ffff66">┌─── RESULTS ──────────────────────────────────────────────────┐</span>
${lines}
<span style="color:#ffff66">└──────────────────────────────────────────────────────────────┘</span>

<span style="color:#3399ff">┌─── SUMMARY ──────────────────────────────────────────────────┐</span>
<span style="color:#888888">│</span>  <span style="color:#888888">Accuracy:</span>      <span style="color:#00ff00">${accuracy}/${total}</span> (${((accuracy / total) * 100).toFixed(1)}%)
<span style="color:#888888">│</span>  <span style="color:#888888">Avg Latency:</span>   <span style="color:#00ff00">${avgLatency}ms</span>
<span style="color:#888888">│</span>  <span style="color:#888888">Total Time:</span>    ${totalLatency}ms for ${total} samples
<span style="color:#888888">│</span>  <span style="color:#888888">Runtime:</span>       ONNX FP32 · WebAssembly · Client-side
<span style="color:#3399ff">└──────────────────────────────────────────────────────────────┘</span>

<span style="color:#888888">All inference ran 100% in your browser. Zero API calls.</span>
`;
}

// ── Error ────────────────────────────────────────────────────

export function formatClassifyError(error: string): string {
  return `
<span style="color:#ff3333">[ERROR]</span> Classification failed: ${error}

<span style="color:#888888">Possible causes:</span>
  • Browser doesn't support WebAssembly (very rare)
  • Network error downloading the model
  • Insufficient memory (model requires ~1GB RAM)

<span style="color:#ffff66">Try refreshing the page and running the command again.</span>
`;
}
