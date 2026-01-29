import { invoke } from "@tauri-apps/api/core";
import { LazyStore } from "@tauri-apps/plugin-store";
import { ref } from "vue";

const store = new LazyStore("store.bin");
const dotaInstallKey = "dota_install_path";
const dotaRoot = ref("");

async function loadDotaRoot() {
  const saved = await store.get(dotaInstallKey);
  if (typeof saved === "string") {
    dotaRoot.value = saved;
  }
  return dotaRoot.value;
}

async function setDotaRoot(value: string) {
  const nextValue = String(value ?? "").trim();
  dotaRoot.value = nextValue;
  await store.set(dotaInstallKey, nextValue);
  await store.save();
}

async function detectDotaRoot() {
  if (dotaRoot.value.trim()) return dotaRoot.value;
  try {
    const detected = await invoke<string | null>("detect_dota_path");
    if (!detected || !detected.trim()) return "";
    await setDotaRoot(detected);
    return detected;
  } catch (err) {
    return "";
  }
}

export function useDotaRootStore() {
  return {
    dotaRoot,
    loadDotaRoot,
    setDotaRoot,
    detectDotaRoot,
  };
}
