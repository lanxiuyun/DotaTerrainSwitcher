<script setup lang="ts">
import { NButton } from "naive-ui";
import { computed, onMounted, onUnmounted, ref } from "vue";

import AdCard from "@/components/ad-card.vue";

export type AdCarouselItem = {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  linkUrl: string;
  badge?: string;
};

const props = withDefaults(
  defineProps<{
    items: AdCarouselItem[];
    intervalMs?: number;
  }>(),
  {
    intervalMs: 3000,
  }
);

const adIndex = ref(0);
const adTransitionName = ref<"ad-slide-next" | "ad-slide-prev">(
  "ad-slide-next"
);

const autoSwitchTimerId = ref<number | null>(null);
const currentAd = computed(() => props.items[adIndex.value]);

function stopAutoSwitch() {
  if (autoSwitchTimerId.value !== null) {
    window.clearInterval(autoSwitchTimerId.value);
    autoSwitchTimerId.value = null;
  }
}

function startAutoSwitch() {
  stopAutoSwitch();
  autoSwitchTimerId.value = window.setInterval(() => {
    showNextAd();
  }, props.intervalMs);
}

function setAdIndex(nextIndex: number, direction: "next" | "prev") {
  if (!props.items.length) return;
  adTransitionName.value =
    direction === "next" ? "ad-slide-next" : "ad-slide-prev";
  const len = props.items.length;
  const normalized = ((nextIndex % len) + len) % len;
  adIndex.value = normalized;
}

function showNextAd() {
  setAdIndex(adIndex.value + 1, "next");
  startAutoSwitch();
}

function showPrevAd() {
  setAdIndex(adIndex.value - 1, "prev");
  startAutoSwitch();
}

function getAdDirection(from: number, to: number) {
  const len = props.items.length || 1;
  const forwardSteps = (to - from + len) % len;
  const backwardSteps = (from - to + len) % len;
  return forwardSteps <= backwardSteps ? "next" : "prev";
}

function goToAd(index: number) {
  const direction = getAdDirection(adIndex.value, index);
  setAdIndex(index, direction);
  startAutoSwitch();
}

function pauseCarousel() {
  stopAutoSwitch();
}

function resumeCarousel() {
  startAutoSwitch();
}

onMounted(() => {
  startAutoSwitch();
});

onUnmounted(() => {
  stopAutoSwitch();
});
</script>

<template>
  <div
    class="ad-bar"
    @mouseenter="pauseCarousel"
    @mouseleave="resumeCarousel"
    aria-label="公告栏"
  >
    <div class="ad-bar-track">
      <Transition :name="adTransitionName" mode="out-in">
        <div class="ad-bar-body" :key="adIndex">
          <AdCard
            v-if="currentAd"
            class="ad-bar-card"
            :title="currentAd.title"
            :description="currentAd.description"
            :imageUrl="currentAd.imageUrl"
            :buttonText="currentAd.buttonText"
            :linkUrl="currentAd.linkUrl"
            :badge="currentAd.badge"
            width="100%"
          />
        </div>
      </Transition>
    </div>

    <div class="ad-bar-controls" aria-label="公告栏控制">
      <NButton
        class="nav-btn left"
        size="tiny"
        quaternary
        @click="showPrevAd"
        aria-label="上一条"
      >
        ‹
      </NButton>
      <NButton
        class="nav-btn right"
        size="tiny"
        quaternary
        @click="showNextAd"
        aria-label="下一条"
      >
        ›
      </NButton>
    </div>

    <div class="ad-bar-footer">
      <div class="dots" aria-label="公告栏指示">
        <button
          v-for="(item, idx) in props.items"
          :key="item.title + idx"
          class="dot"
          :class="{ active: idx === adIndex }"
          @click="goToAd(idx)"
          :aria-label="`切换到第 ${idx + 1} 条`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ad-bar {
  width: 100%;
  max-width: 880px;
  position: relative;
  padding: 6px;
  border-radius: 16px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  backdrop-filter: blur(14px);
  box-shadow: var(--app-shadow-sm);
}

.ad-bar-track {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ad-bar-body {
  width: 100%;
  display: flex;
  justify-content: center;
}

.ad-bar-controls {
  pointer-events: none;
}

.nav-btn {
  pointer-events: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
  opacity: 0;
  transition: opacity 160ms ease, transform 160ms ease;
}

.nav-btn.left {
  left: 6px;
}

.nav-btn.right {
  right: 6px;
}

.ad-bar:hover .nav-btn {
  opacity: 1;
}

.ad-bar:hover .nav-btn.left {
  transform: translateY(-50%) translateX(-1px);
}

.ad-bar:hover .nav-btn.right {
  transform: translateY(-50%) translateX(1px);
}

.ad-bar-footer {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots {
  display: flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  border: 0;
  padding: 0;
  background: rgba(15, 23, 42, 0.22);
  cursor: pointer;
  transition: transform 160ms ease, background 160ms ease, width 160ms ease;
}

.dot:hover {
  background: rgba(15, 23, 42, 0.34);
}

.dot.active {
  width: 18px;
  background: rgba(37, 99, 235, 0.92);
}

.ad-slide-next-enter-active,
.ad-slide-next-leave-active,
.ad-slide-prev-enter-active,
.ad-slide-prev-leave-active {
  transition: transform 240ms ease, opacity 240ms ease;
}

.ad-slide-next-enter-from {
  transform: translateX(-18px);
  opacity: 0;
}
.ad-slide-next-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.ad-slide-next-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.ad-slide-next-leave-to {
  transform: translateX(18px);
  opacity: 0;
}

.ad-slide-prev-enter-from {
  transform: translateX(18px);
  opacity: 0;
}
.ad-slide-prev-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.ad-slide-prev-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.ad-slide-prev-leave-to {
  transform: translateX(-18px);
  opacity: 0;
}

/* Make AdCard look like a compact infobar */
:deep(.ad-card) {
  border-radius: 14px;
  box-shadow: none;
  background: var(--app-surface-strong);
  border: 1px solid rgba(15, 23, 42, 0.08);
}

:deep(.ad-card:hover) {
  transform: none;
  box-shadow: none;
}

:deep(.ad-content) {
  align-items: center;
}

:deep(.ad-image-container) {
  width: 46px;
  height: 46px;
  border-radius: 12px;
}

:deep(.ad-title) {
  font-weight: 700;
  color: rgba(15, 23, 42, 0.92);
}

:deep(.ad-description) {
  color: rgba(15, 23, 42, 0.66);
}
</style>

