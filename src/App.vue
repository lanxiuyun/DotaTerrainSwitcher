<script setup lang="ts">
import { open } from "@tauri-apps/plugin-dialog";
import { LazyStore } from "@tauri-apps/plugin-store";
import {
  NButton,
  NCard,
  NInput,
  NRadio,
  NRadioGroup,
  NScrollbar,
  NSelect,
  NSpace,
  createDiscreteApi,
} from "naive-ui";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AdCard from "./ad-card.vue";
import { getSupportedLocales, setLocale, type SupportedLocale } from "./i18n";

// 使用i18n
const { t, locale } = useI18n();

// Naive UI 通知（离散 API：不依赖 Provider）
const { notification } = createDiscreteApi(["notification"]);

// 响应式数据
const selectedPath = ref("");
const selectedMap = ref("");
const isExecuting = ref(false);

// 地图选项
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
  { label: t("maps.crownfall"), value: "dota_crownfall_740" },
  { label: t("maps.ti10"), value: "dota_ti10_740" },
  { label: t("maps.cavern"), value: "dota_cavern_740" },
]);

const selectedMapLabel = computed(() => {
  return mapOptions.value.find((opt) => opt.value === selectedMap.value)?.label;
});

// 支持的语言列表
const supportedLocales = getSupportedLocales();

// 计算属性
const canExecute = computed(() => {
  return selectedPath.value && selectedMap.value && !isExecuting.value;
});

const store = new LazyStore("store.bin");

onMounted(async () => {
  const path = await store.get("path");
  if (path) {
    selectedPath.value = (path as { value: string }).value;
  }

  const map = await store.get("map");
  if (map) {
    selectedMap.value = (map as { value: string }).value;
  }
});

// 选择路径
async function selectFolder() {
  const file = await open({
    multiple: false,
    directory: true,
  });

  if (file) {
    selectedPath.value = file;
    await store.set("path", { value: file });
    await store.save();
  }
}

// 复制文件
import { copyFile } from "@tauri-apps/plugin-fs";
async function copyDotaData(src: string, dest: string) {
  await copyFile(src, dest);
}

// 执行地图切换
async function executeMapReplacement() {
  if (!canExecute.value) return;

  isExecuting.value = true;

  try {
    await store.set("path", { value: selectedPath.value });
    await store.set("map", { value: selectedMap.value });
    await store.save();

    // 复制 resources 中的文件到 selectedPath.value
    await copyDotaData(
      `resources/${selectedMap.value}/dota.vpk`,
      selectedPath.value + "/dota.vpk"
    );
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

// 语言切换
function handleLocaleChange(value: SupportedLocale) {
  setLocale(value);
}
</script>

<template>
  <NScrollbar class="app-scrollbar" trigger="hover" x-scrollable y-scrollable>
    <div class="language-switcher">
      <NSelect
        v-model:value="locale"
        :options="supportedLocales"
        @update:value="handleLocaleChange"
        size="small"
        class="locale-select"
      />
    </div>

    <div class="app-container">
      <div class="header">
        <div class="header-top">
          <h1>{{ t("header.title") }}</h1>
        </div>
        <p class="subtitle">{{ t("header.subtitle") }}</p>
      </div>

      <div class="header">
        <AdCard
          title="广告一下"
          description="Lazyeat（懒人手势）｜手势隔空控制，比划就行"
          imageUrl="https://raw.githubusercontent.com/lanxiuyun/lazyeat/refs/heads/master/public/lazyeat.png"
          buttonText="立即查看"
          linkUrl="https://download.upgrade.toolsetlink.com/download?appKey=zY0JIMn9x6W7vCs4P1mtgQ"
          badge="推荐"
          width="100%"
        />
      </div>

      <div class="main-card">
        <NCard :title="t('settings.title')" class="settings-card">
          <div>{{ t("settings.description") }}</div>
          <NSpace vertical size="large">
            <!-- 游戏路径 -->
            <div class="input-group">
              <label class="input-label">{{ t("settings.pathLabel") }}</label>
              <div class="path-input-container">
                <NInput
                  v-model:value="selectedPath"
                  :placeholder="t('settings.pathPlaceholder')"
                  readonly
                  class="path-input"
                />
                <NButton
                  @click="selectFolder"
                  type="primary"
                  ghost
                  class="browse-button"
                >
                  <template #icon>
                    <span class="icon">📁</span>
                  </template>
                  {{ t("common.browse") }}
                </NButton>
              </div>
            </div>

            <!-- 选择地图 -->
            <div class="input-group">
              <label class="input-label">{{ t("settings.mapLabel") }}</label>
              <NRadioGroup v-model:value="selectedMap" class="map-radio-group">
                <div class="map-grid">
                  <NRadio
                    v-for="option in mapOptions"
                    :key="option.value"
                    :value="option.value"
                    class="map-item"
                  >
                    {{ option.label }}
                  </NRadio>
                </div>
              </NRadioGroup>
              <div class="selection-info" v-if="selectedMap">
                {{ t("common.selected") }}:
                {{ mapOptions.find((opt) => opt.value === selectedMap)?.label }}
              </div>
            </div>

            <!-- 执行按钮 -->
            <NButton
              @click="executeMapReplacement"
              :disabled="!canExecute"
              :loading="isExecuting"
              type="primary"
              size="large"
              class="execute-button"
            >
              <template #icon>
                <span class="icon">▶️</span>
              </template>
              {{ isExecuting ? t("common.executing") : t("common.execute") }}
            </NButton>
          </NSpace>
        </NCard>
      </div>

      <!-- 感谢信息 -->
      <div class="footer">
        <div class="thanks-section">
          <p class="thanks-text">
            {{ t("thanks.title") }}<br />
            <n-space>
              <a
                href="https://steamcommunity.com/sharedfiles/filedetails/?id=1664733222"
                target="_blank"
                class="thanks-link"
              >
                {{ t("thanks.dotaMods") }}
              </a>

              <a
                href="https://www.naiveui.com/zh-CN/os-theme"
                target="_blank"
                class="thanks-link"
              >
                {{ t("thanks.naiveUI") }}
              </a>
            </n-space>
          </p>
        </div>
      </div>
    </div>
  </NScrollbar>
</template>

<style scoped>
.app-scrollbar {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-container {
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.language-switcher {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 1000;
}

.locale-select {
  width: 100px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.main-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.settings-card {
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.path-input-container {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
}

.path-input {
  flex: 1;
  min-width: 0;
}

.browse-button {
  flex-shrink: 0;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  width: 100%;
}

.map-item {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-item:hover {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
}

.selection-info {
  font-size: 0.85rem;
  color: #666;
  margin-top: 8px;
  text-align: center;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.execute-button {
  width: 100%;
  height: 40px;
  font-size: 1rem;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.footer {
  text-align: center;
}

.thanks-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.thanks-text {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.thanks-link {
  color: #0066cc;
  text-decoration: none;
  font-weight: 600;
}

.thanks-link:hover {
  text-decoration: underline;
  color: #0052a3;
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  overflow: hidden;
  height: 100vh;
}

#app {
  height: 100vh;
  overflow: hidden;
}
</style>
