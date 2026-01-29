<script setup lang="ts">
import { NMenu, NScrollbar, NSelect } from "naive-ui";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute, useRouter } from "vue-router";

import AdCarousel, { type AdCarouselItem } from "@/components/AdCarousel.vue";
import { getSupportedLocales, setLocale, type SupportedLocale } from "../i18n";

const { locale, t } = useI18n();

const router = useRouter();
const route = useRoute();

const supportedLocales = getSupportedLocales();

function handleLocaleChange(value: SupportedLocale) {
  setLocale(value);
}

const ads = ref<AdCarouselItem[]>([
  {
    title: "Lazyeat（懒人手势）",
    description: "手势隔空控制，比划就行",
    imageUrl:
      "https://raw.githubusercontent.com/lanxiuyun/lazyeat/refs/heads/master/public/lazyeat.png",
    buttonText: "立即下载",
    linkUrl:
      "https://download.upgrade.toolsetlink.com/download?appKey=zY0JIMn9x6W7vCs4P1mtgQ",
    badge: "推荐",
  },
]);

const selectedMenuKey = computed(() => {
  const name = route.name;
  if (typeof name === "string") return name;
  return "home";
});

const menuOptions = computed(() => [
  {
    label: () => t("nav.home"),
    key: "home",
  },
  {
    label: () => t("nav.alias"),
    key: "alias",
  },
  {
    label: () => t("nav.about"),
    key: "about",
  },
]);

function handleMenuUpdate(key: string) {
  router.push({ name: key });
}
</script>

<template>
  <div class="app-layout">
    <aside class="sider">
      <div class="sider-inner">
        <div class="brand">
          <div class="brand-mark">刀</div>
          <div class="brand-text">
            <div class="brand-title">{{ t("header.title") }}</div>
          </div>
        </div>

        <div class="sider-controls">
          <NSelect
            v-model:value="locale"
            :options="supportedLocales"
            @update:value="handleLocaleChange"
            size="small"
            class="locale-select"
          />
        </div>

        <NMenu
          class="sider-menu"
          :options="menuOptions"
          :value="selectedMenuKey"
          @update:value="handleMenuUpdate"
        />
      </div>
    </aside>

    <main class="main">
      <header class="header">
        <div class="header-inner">
          <AdCarousel :items="ads" />
        </div>
      </header>

      <section class="content">
        <NScrollbar class="content-scroll">
          <div class="content-inner">
            <RouterView v-slot="{ Component }">
              <KeepAlive>
                <component :is="Component" />
              </KeepAlive>
            </RouterView>
          </div>
        </NScrollbar>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  width: 100vw;
  background: transparent;
  display: flex;
  overflow: hidden;
}

.sider {
  background: rgba(255, 255, 255, 0.64);
  backdrop-filter: blur(14px);
  border-right: 1px solid var(--app-border);
  width: 200px;
  flex: 0 0 auto;
  overflow: hidden;
}

.sider-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 12px 12px 12px;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 8px 8px 4px 8px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: white;
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.18);
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.brand-title {
  font-weight: 900;
  color: #111827;
  font-size: 0.98rem;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sider-controls {
  padding: 0 4px;
}

.sider-menu {
  flex: 1;
  overflow: auto;
  padding: 8px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.main {
  height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.header {
  padding: 10px 14px;
  min-height: 78px;
  height: auto;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(14px);
  flex-shrink: 0;
}

.header-inner {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  flex: 1;
  height: auto;
  overflow: hidden;
  background: transparent;
  padding: 0;
  min-height: 0;
  min-width: 0;
}

.content-scroll {
  height: 100%;
  min-height: 0;
}

.content-inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 14px 14px 18px 14px;
}
</style>
