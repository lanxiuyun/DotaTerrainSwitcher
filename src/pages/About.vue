<script setup lang="ts">
import { getName, getVersion } from "@tauri-apps/api/app";
import { openUrl } from "@tauri-apps/plugin-opener";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { NButton, NCard, NList, NListItem, useDialog, useMessage } from "naive-ui";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const message = useMessage();
const dialog = useDialog();

const appName = ref("");
const appVersion = ref("");
const checking = ref(false);
const downloading = ref(false);

const thanksList = [
  {
    name: "dota2 Terrain Mods",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=1664733222",
    iconText: "D",
    iconStyle: "background: rgba(239, 68, 68, 0.16); color: #ef4444",
  },
  {
    name: "dota",
    url: "https://tauri.app",
    iconText: "T",
    iconStyle: "background: rgba(14, 165, 233, 0.16); color: #0284c7",
  },
  {
    name: "naive-ui",
    url: "https://www.naiveui.com/zh-CN/os-theme",
    iconText: "N",
    iconStyle: "background: rgba(34, 197, 94, 0.16); color: #22c55e",
  },
  {
    name: "感谢所有开源工作者",
    url: "https://opensource.guide/how-to-contribute/",
    iconText: "^^",
    iconStyle: "background: rgba(14, 165, 233, 0.16); color: #0284c7",
  },
] as const;

async function handleCheckUpdate() {
  if (checking.value || downloading.value) return;

  checking.value = true;
  try {
    const update = await check(
      {
        headers: {
          'X-AccessKey': 'DMFXx6_TXa7MjpHTWEc5eQ',
        },
      }
    );
    if (update) {
      showUpdateDialog(update);
    } else {
      message.success(t("about.upToDate"));
    }
  } catch (err) {
    message.error(t("about.checkError"));
    console.error("检查更新失败:", err);
  } finally {
    checking.value = false;
  }
}

function showUpdateDialog(update: Update) {
  dialog.info({
    title: t("about.newVersion"),
    content: t("about.newVersionContent", { version: update.version }),
    positiveText: t("about.downloadNow"),
    negativeText: t("about.remindLater"),
    onPositiveClick: async () => {
      await downloadAndInstall(update);
    },
  });
}

async function downloadAndInstall(update: Update) {
  downloading.value = true;
  try {
    await update.downloadAndInstall((progress) => {
      console.log(`下载进度: ${progress.event}`);
    });
    message.success(t("about.restartRequired"));
  } catch (err) {
    message.error(t("about.downloadError"));
    console.error("下载更新失败:", err);
  } finally {
    downloading.value = false;
  }
}

async function handleOpenLink(url: string) {
  await openUrl(url);
}

async function loadAppMeta() {
  appName.value = await getName();
  appVersion.value = await getVersion();
}

onMounted(async () => {
  await loadAppMeta();
});
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div class="page-title">{{ t("about.title") }}</div>
    </div>

    <NCard class="panel about-header-card" :bordered="false">
      <div class="about-header">
        <div class="app-info">
          <img class="app-icon" src="/dota2025.jpg" alt="App Icon" />
          <div class="app-meta">
            <div class="app-name">{{ appName || "Daodao Tool" }}</div>
            <div class="app-version">
              {{ t("about.versionPrefix") }} {{ appVersion || "-" }}
            </div>
          </div>
        </div>
        <NButton
          type="primary"
          class="update-button"
          :loading="checking || downloading"
          @click="handleCheckUpdate"
        >
          {{ checking ? t("about.checking") : downloading ? t("about.downloading") : t("about.checkUpdate") }}
        </NButton>
      </div>
    </NCard>

    <div class="thanks-block">
      <div class="thanks-title">{{ t("about.thanksTitle") }}</div>
      <NList bordered class="thanks-list">
        <NListItem v-for="item in thanksList" :key="item.url">
          <div class="thanks-item">
            <div class="thanks-icon" :style="item.iconStyle">
              {{ item.iconText }}
            </div>
            <div class="thanks-text">
              <div class="thanks-name">{{ item.name }}</div>
              <a
                class="thanks-url thanks-url-link"
                :href="item.url"
                rel="noreferrer noopener"
                @click.stop.prevent="handleOpenLink(item.url)"
              >
                {{ item.url }}
              </a>
            </div>
          </div>
        </NListItem>
      </NList>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 10px;
}

.page-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 2px 4px 12px 4px;
}

.page-title {
  font-weight: 900;
  letter-spacing: -0.01em;
  font-size: 18px;
  color: rgba(15, 23, 42, 0.92);
}

.panel {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: var(--app-shadow-sm);
}

.about-header-card {
  padding: 4px 2px;
}

.about-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.app-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
  flex: 0 0 auto;
}

.app-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.app-name {
  font-weight: 900;
  font-size: 16px;
  color: rgba(15, 23, 42, 0.92);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-version {
  font-size: 12px;
  color: rgba(15, 23, 42, 0.58);
}

.update-button {
  border-radius: 10px;
  padding-left: 14px;
  padding-right: 14px;
  flex: 0 0 auto;
}

.thanks-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thanks-title {
  font-weight: 900;
  font-size: 16px;
  color: rgba(15, 23, 42, 0.92);
  padding: 2px 4px 0 4px;
}

.thanks-list {
  border-radius: 18px;
  overflow: hidden;
}

.thanks-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 0;
  user-select: none;
}

.thanks-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  text-transform: uppercase;
  flex: 0 0 auto;
}

.thanks-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.thanks-name {
  font-weight: 800;
  color: rgba(15, 23, 42, 0.9);
}

.thanks-url {
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thanks-url-link {
  display: inline-block;
  max-width: 100%;
  text-decoration: none;
  color: rgba(37, 99, 235, 0.92);
}

.thanks-url-link:hover {
  color: rgba(29, 78, 216, 0.95);
  text-decoration: underline;
  text-decoration-color: rgba(29, 78, 216, 0.5);
  text-underline-offset: 2px;
}

.thanks-url-link:focus-visible {
  outline: 2px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
  border-radius: 6px;
}
</style>
