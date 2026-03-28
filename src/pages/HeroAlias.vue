<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { LazyStore } from "@tauri-apps/plugin-store";
import {
  NAlert,
  NButton,
  NCard,
  NDataTable,
  NDynamicTags,
  NForm,
  NFormItem,
  NInput,
  createDiscreteApi,
} from "naive-ui";
import { computed, h, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import {
  defaultHeroAliases,
  defaultLanguagePath,
  heroChineseNames,
  type HeroAliasMap,
} from "@/data/heroAliasDefaults";
import { useDotaRootStore } from "@/composables/useDotaRootStore";

type AliasApplyConfig = {
  languagePath: string;
  dotaPath?: string;
  heroes: Record<string, string[]>;
};

type LogLevel = "info" | "warn" | "error";

type LogItem = {
  level: LogLevel;
  message: string;
};

type ApplyResult = { logs: LogItem[] };

const { t } = useI18n();
const { notification } = createDiscreteApi(["notification"]);
const store = new LazyStore("store.bin");
const legacyAliasDotaKey = "alias_dota_path";

const languagePath = ref(defaultLanguagePath);
const { dotaRoot, loadDotaRoot, setDotaRoot, detectDotaRoot } =
  useDotaRootStore();

const dotaPath = computed({
  get: () => dotaRoot.value,
  set: (value: string) => {
    void setDotaRoot(value);
  },
});
const searchText = ref("");
const heroAliases = ref<HeroAliasMap>({});
const isExecuting = ref(false);
const logs = ref<LogItem[]>([]);
const saveTimer = ref<ReturnType<typeof setTimeout> | null>(null);

function cloneHeroAliases(source: HeroAliasMap): HeroAliasMap {
  const result: HeroAliasMap = {};
  for (const [hero, aliases] of Object.entries(source)) {
    result[hero] = Array.isArray(aliases) ? [...aliases] : [];
  }
  return result;
}

function normalizeAliasList(value: string[]) {
  const merged = new Map<string, string>();
  for (const item of value) {
    const text = String(item ?? "").trim();
    if (!text) continue;
    const key = text.toLowerCase();
    if (!merged.has(key)) merged.set(key, text);
  }
  return Array.from(merged.values());
}

function normalizeStoredHeroes(value: unknown): HeroAliasMap | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const result: HeroAliasMap = {};
  for (const [hero, rawAliases] of Object.entries(record)) {
    if (!hero || typeof hero !== "string") continue;
    if (!Array.isArray(rawAliases)) continue;
    result[hero] = normalizeAliasList(rawAliases.map((v) => String(v)));
  }
  return result;
}

function buildApplyHeroes(source: HeroAliasMap) {
  const result: Record<string, string[]> = {};
  for (const [hero, aliases] of Object.entries(source)) {
    const normalized = normalizeAliasList(aliases);
    if (normalized.length > 0) result[hero] = normalized;
  }
  return result;
}

function formatHeroLabel(hero: string) {
  const chineseName = heroChineseNames[hero];
  return chineseName ? `${hero}（${chineseName}）` : hero;
}

const totalHeroCount = computed(() => Object.keys(heroAliases.value).length);
const configuredHeroCount = computed(() => {
  let count = 0;
  for (const aliases of Object.values(heroAliases.value)) {
    if (Array.isArray(aliases) && aliases.length > 0) count++;
  }
  return count;
});

const rows = computed(() => {
  const all = Object.keys(heroAliases.value)
    .sort((a, b) => a.localeCompare(b))
    .map((hero) => ({
      hero,
      heroLabel: formatHeroLabel(hero),
      aliases: heroAliases.value[hero] || [],
    }));

  const query = searchText.value.trim().toLowerCase();
  if (!query) return all;

  return all.filter((item) => {
    if (item.hero.toLowerCase().includes(query)) return true;
    if (item.heroLabel.toLowerCase().includes(query)) return true;
    return item.aliases.some((a) => a.toLowerCase().includes(query));
  });
});

const canExecute = computed(() => {
  return Boolean(
    !isExecuting.value &&
    languagePath.value.trim() &&
    configuredHeroCount.value > 0,
  );
});

async function loadDraft() {
  const savedLanguagePath = await store.get("alias_language_path");
  if (typeof savedLanguagePath === "string" && savedLanguagePath.trim()) {
    languagePath.value = savedLanguagePath;
  }

  await loadDotaRoot();
  const savedDotaPath = await store.get(legacyAliasDotaKey);
  if (
    !dotaRoot.value.trim() &&
    typeof savedDotaPath === "string" &&
    savedDotaPath.trim()
  ) {
    await setDotaRoot(savedDotaPath);
  }

  const savedHeroes = await store.get("alias_hero_aliases_v1");
  const parsed = normalizeStoredHeroes(savedHeroes);
  heroAliases.value = parsed ?? cloneHeroAliases(defaultHeroAliases);
}

async function saveDraft() {
  await store.set("alias_language_path", languagePath.value);
  await store.set(legacyAliasDotaKey, dotaPath.value);
  await store.set("alias_hero_aliases_v1", heroAliases.value);
  await store.save();
}

function scheduleSaveDraft() {
  if (saveTimer.value) clearTimeout(saveTimer.value);
  saveTimer.value = setTimeout(() => {
    void saveDraft();
  }, 350);
}

watch([languagePath, dotaPath], () => {
  scheduleSaveDraft();
});

onMounted(async () => {
  await loadDraft();
  await autoDetectDotaPath();
});

async function autoDetectDotaPath() {
  if (dotaPath.value.trim()) return;
  await detectDotaRoot();
}

async function selectDotaFolder() {
  const folder = await open({
    multiple: false,
    directory: true,
  });
  if (!folder) return;
  await setDotaRoot(folder);
}

function updateRowAliases(hero: string, value: string[]) {
  heroAliases.value[hero] = normalizeAliasList(value);
  scheduleSaveDraft();
}

async function applyAliases() {
  if (!canExecute.value) return;
  isExecuting.value = true;
  logs.value = [];

  try {
    await saveDraft();

    const applyHeroes = buildApplyHeroes(heroAliases.value);
    const config: AliasApplyConfig = {
      languagePath: languagePath.value.trim(),
      dotaPath: dotaPath.value.trim() ? dotaPath.value.trim() : undefined,
      heroes: applyHeroes,
    };

    const result = await invoke<ApplyResult>("apply_hero_aliases", { config });
    logs.value = result.logs || [];
    notification.success({
      title: t("alias.notifySuccessTitle"),
      content: t("alias.notifySuccessContent"),
      duration: 2500,
    });
  } catch (err) {
    const detail =
      err instanceof Error ? err.message : typeof err === "string" ? err : "";
    const message = detail ? detail : t("alias.errors.unknown");
    logs.value = [{ level: "error", message }];
    notification.error({
      title: t("alias.notifyFailTitle"),
      content: detail
        ? `${t("alias.notifyFailContent")}\n${detail}`
        : t("alias.notifyFailContent"),
      duration: 0,
    });
  } finally {
    isExecuting.value = false;
  }
}

const columns = computed(() => {
  return [
    {
      title: t("alias.tableHero"),
      key: "hero",
      width: 220,
      ellipsis: { tooltip: true },
      render(row: { heroLabel: string }) {
        return row.heroLabel;
      },
    },
    {
      title: t("alias.tableAliases"),
      key: "aliases",
      render(row: { hero: string; aliases: string[] }) {
        return h(NDynamicTags, {
          value: row.aliases,
          size: "small",
          round: true,
          "onUpdate:value": (value: string[]) =>
            updateRowAliases(row.hero, value),
        });
      },
    },
  ];
});
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div class="page-title">{{ t("alias.title") }}</div>
      <div class="page-desc">{{ t("alias.description") }}</div>
    </div>

    <NAlert class="hint" type="warning" :bordered="false">
      {{ t("alias.warning") }}
    </NAlert>

    <NCard class="panel">
      <NForm label-placement="top" size="medium" :show-feedback="false">
        <NFormItem :label="t('alias.dotaPathLabel')" class="form-item">
          <div class="path-row">
            <NInput
              v-model:value="dotaPath"
              :placeholder="t('alias.dotaPathPlaceholder')"
              readonly
            />
            <NButton @click="selectDotaFolder" type="primary" secondary>
              {{ t("common.browse") }}
            </NButton>
          </div>
        </NFormItem>

        <NFormItem :label="t('alias.searchLabel')" class="form-item">
          <NInput
            v-model:value="searchText"
            :placeholder="t('alias.searchPlaceholder')"
            clearable
          />
        </NFormItem>

        <NAlert type="info" :bordered="false" class="info-box">
          {{
            t("alias.summary", {
              heroes: configuredHeroCount,
              total: totalHeroCount,
            })
          }}
        </NAlert>

        <NDataTable
          class="alias-table"
          :columns="columns"
          :data="rows"
          :pagination="{ pageSize: 12 }"
        />
      </NForm>

      <div class="execute-area">
        <NButton
          @click="applyAliases"
          :disabled="!canExecute"
          :loading="isExecuting"
          type="primary"
          size="large"
          block
        >
          {{ isExecuting ? t("alias.executing") : t("alias.execute") }}
        </NButton>
      </div>

      <div v-if="logs.length" class="log-area">
        <div class="log-title">{{ t("alias.logsTitle") }}</div>
        <div class="log-lines">
          <div
            v-for="(item, index) in logs"
            :key="index"
            :class="['log-line', `log-${item.level}`]"
          >
            {{ item.message }}
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 4px;
}

.page-title {
  font-weight: 900;
  letter-spacing: -0.01em;
  font-size: 18px;
  color: rgba(15, 23, 42, 0.92);
}

.page-desc {
  font-size: 13px;
  color: rgba(15, 23, 42, 0.62);
  line-height: 1.4;
}

.panel {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: var(--app-shadow-sm);
}

.form-item :deep(.n-form-item-label) {
  font-weight: 700;
  color: rgba(15, 23, 42, 0.82);
}

.hint {
  border-radius: 16px;
  background: rgba(245, 158, 11, 0.12);
  color: rgba(15, 23, 42, 0.82);
}

.path-row {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.path-row :deep(.n-input) {
  flex: 1;
}

.execute-area {
  margin-top: 18px;
}

.alias-table {
  margin-top: 12px;
}

.alias-table :deep(.n-dynamic-tags) {
  max-width: 100%;
}

.log-area {
  margin-top: 16px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.03);
  padding: 10px 12px;
}

.log-title {
  font-weight: 900;
  font-size: 13px;
  margin-bottom: 8px;
  color: rgba(15, 23, 42, 0.82);
}

.log-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-line {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  line-height: 1.45;
  color: rgba(15, 23, 42, 0.86);
  user-select: text;
}

.log-info {
  color: rgba(15, 23, 42, 0.86);
}

.log-warn {
  color: rgba(180, 83, 9, 0.95);
}

.log-error {
  color: rgba(185, 28, 28, 0.95);
}

.error-box,
.info-box {
  margin-top: 8px;
  border-radius: 14px;
}

.error-title {
  font-weight: 900;
  margin-bottom: 6px;
}

.error-item {
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 560px) {
  .path-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
