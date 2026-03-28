import { open } from "@tauri-apps/plugin-dialog";
import { copyFile } from "@tauri-apps/plugin-fs";
import { LazyStore } from "@tauri-apps/plugin-store";
import { createDiscreteApi } from "naive-ui";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useDotaRootStore } from "@/composables/useDotaRootStore";

type StoredString = { value: string };

function readStoredString(data: unknown): string {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "";
  if (!("value" in data)) return "";

  const value = (data as StoredString).value;
  return typeof value === "string" ? value : "";
}

function buildMapsFolderPath(dotaRoot: string): string {
  const normalizedRoot = dotaRoot.replace(/[\\/]+$/, "");
  const separator = normalizedRoot.includes("\\") ? "\\" : "/";
  return `${normalizedRoot}${separator}game${separator}dota${separator}maps`;
}

function inferDotaRootFromMapsPath(folderPath: string): string | null {
  const normalized = folderPath.replace(/[\\/]+$/, "");
  const match = normalized.match(/^(.*)[\\/]+game[\\/]+dota[\\/]+maps$/i);
  if (!match || !match[1]) return null;
  return match[1];
}

function buildVpkDestinationPath(dotaRoot: string): string {
  const mapsPath = buildMapsFolderPath(dotaRoot);
  const separator = mapsPath.includes("\\") ? "\\" : "/";
  return `${mapsPath}${separator}dota.vpk`;
}

export function useMapSwitcher() {
  const { t } = useI18n();
  const { notification } = createDiscreteApi(["notification"]);

  const { dotaRoot, loadDotaRoot, setDotaRoot, detectDotaRoot } =
    useDotaRootStore();

  const selectedPath = computed({
    get: () => dotaRoot.value,
    set: (value: string) => {
      void setDotaRoot(value);
    },
  });
  const selectedMap = ref("");
  const isExecuting = ref(false);

  const mapOptions = computed(() => [
    { label: t("maps.default"), value: "dota_default_740" },
    { label: t("maps.coloseum"), value: "dota_coloseum_740" },
    { label: t("maps.desert"), value: "dota_desert_740" },
    { label: t("maps.jungle"), value: "dota_jungle_740" },
    { label: t("maps.reef"), value: "dota_reef_740" },
    { label: t("maps.autumn"), value: "dota_autumn_740" },
    { label: t("maps.summer"), value: "dota_summer_740" },
    { label: t("maps.spring"), value: "dota_spring_740" },
    { label: t("maps.winter"), value: "dota_winter_740" },
    { label: t("maps.journey"), value: "dota_journey_740" },
    { label: t("maps.ti10"), value: "dota_ti10_740" },
    { label: t("maps.cavern"), value: "dota_cavern_740" },
  ]);

  const selectedMapLabel = computed(() => {
    return mapOptions.value.find((opt) => opt.value === selectedMap.value)?.label;
  });

  const canExecute = computed(() => {
    return Boolean(selectedPath.value && selectedMap.value && !isExecuting.value);
  });

  const store = new LazyStore("store.bin");

  async function loadPersistedState() {
    const path = readStoredString(await store.get("path"));
    if (path) {
      const inferredRoot = inferDotaRootFromMapsPath(path);
      if (!dotaRoot.value.trim()) {
        await setDotaRoot(inferredRoot ?? path);
      }
    }

    const map = readStoredString(await store.get("map"));
    if (map) selectedMap.value = map;
  }

  async function autoFillPathFromDotaRoot() {
    if (!dotaRoot.value.trim()) {
      await loadDotaRoot();
    }
    if (!dotaRoot.value.trim()) {
      await detectDotaRoot();
    }
    if (!dotaRoot.value.trim()) return;
    await store.set("path", { value: dotaRoot.value });
    await store.save();
  }

  onMounted(async () => {
    await loadDotaRoot();
    await loadPersistedState();
    await autoFillPathFromDotaRoot();
  });

  async function selectDotaRoot() {
    const folder = await open({
      multiple: false,
      directory: true,
    });
    if (!folder) return;

    await setDotaRoot(folder);
    await store.set("path", { value: folder });
    await store.save();
  }

  async function persistExecutionState() {
    await store.set("path", { value: selectedPath.value });
    await store.set("map", { value: selectedMap.value });
    await store.save();
  }

  async function executeMapReplacement() {
    if (!canExecute.value) return;

    isExecuting.value = true;
    try {
      await persistExecutionState();

      const source = `resources/${selectedMap.value}/dota.vpk`;
      const destination = buildVpkDestinationPath(selectedPath.value);
      await copyFile(source, destination);

      notification.success({
        title: t("notification.successTitle"),
        content: t("notification.successContent", {
          map: selectedMapLabel.value || selectedMap.value,
        }),
        duration: 2500,
      });
    } catch (err) {
      const detail =
        err instanceof Error ? err.message : typeof err === "string" ? err : "";
      notification.error({
        title: t("notification.failTitle"),
        content: detail
          ? `${t("notification.failContent")}\n${detail}`
          : t("notification.failContent"),
        duration: 0,
      });
    } finally {
      isExecuting.value = false;
    }
  }

  return {
    selectedPath,
    selectedMap,
    isExecuting,
    mapOptions,
    selectedMapLabel,
    canExecute,
    selectDotaRoot,
    executeMapReplacement,
  };
}

