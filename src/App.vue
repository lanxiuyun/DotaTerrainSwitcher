<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";
import {
  NButton,
  NCard,
  NInput,
  NRadio,
  NRadioGroup,
  NSpace,
  NScrollbar
} from "naive-ui";
import { computed, ref } from "vue";

// 响应式数据
const selectedPath = ref("");
const selectedMap = ref("");
const isExecuting = ref(false);

// 地图选项
const mapOptions = [
  { label: "不朽庭院", value: "dota_coloseum_739d" },
  { label: "沙漠地图", value: "dota_desert_739d" },
  { label: "蔓生国度", value: "dota_jungle_739d" },
  { label: "礁石之界", value: "dota_reef_739d" },
  { label: "秋季地图", value: "dota_autumn_739d" },
  { label: "夏季地图", value: "dota_summer_739d" },
  { label: "春季地图", value: "dota_spring_739d" },
  { label: "冬季地图", value: "dota_winter_739d" },
  { label: "大圣的新游记", value: "dota_journey_739d" },
  { label: "皇冠陨落地图", value: "dota_crownfall_739d" },
  { label: "神圣之地", value: "dota_ti10_739d" },
  { label: "玉海之渊", value: "dota_cavern_739d" },
];

// 计算属性
const canExecute = computed(() => {
  return selectedPath.value && selectedMap.value && !isExecuting.value;
});

// 选择路径
async function selectPath() {
  try {
    const path = prompt("请输入Dota 2安装目录路径:");
    if (path) {
      selectedPath.value = path;
    }
  } catch (error) {
    console.error("选择路径失败:", error);
  }
}

// 执行地图替换
async function executeMapReplacement() {
  if (!canExecute.value) return;

  isExecuting.value = true;

  try {
    const result = await invoke("replace_dota_map", {
      gamePath: selectedPath.value,
      mapName: selectedMap.value,
    });

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("地图替换成功完成！");
    }
  } catch (error) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("地图替换失败，请检查日志");
    }
  } finally {
    isExecuting.value = false;
  }
}
</script>

<template>
  <NScrollbar class="app-scrollbar" trigger="hover" x-scrollable y-scrollable>
    <div class="app-container">
      <div class="header">
        <h1>Dota 地图替换器</h1>
        <p class="subtitle">简单快速地替换你的Dota 地图文件</p>
      </div>

      <div class="main-card">
        <NCard title="地图替换设置" class="settings-card">
          <template #header>
            <div class="card-header">
              <span class="icon">📍</span>
              <span>地图替换设置</span>
            </div>
          </template>

          <p class="instruction">选择游戏路径和要替换的地图，然后点击执行按钮</p>

          <NSpace vertical size="large">
            <!-- 游戏路径 -->
            <div class="input-group">
              <label class="input-label">游戏路径</label>
              <n-space style="width: 100%">
                <NInput
                  v-model:value="selectedPath"
                  placeholder="选择 dota2 地图目录..."
                  readonly
                  class="path-input"
                />
                <NButton @click="selectPath" type="primary" ghost>
                  <template #icon>
                    <span class="icon">📁</span>
                  </template>
                  浏览
                </NButton>
              </n-space>
            </div>

            <!-- 选择地图 -->
            <div class="input-group">
              <label class="input-label">选择地图</label>
              <NRadioGroup v-model:value="selectedMap" class="map-radio-group">
                <div class="map-grid">
                  <div
                    v-for="option in mapOptions"
                    :key="option.value"
                    class="map-item"
                  >
                    <NRadio :value="option.value" class="map-radio">
                      {{ option.label }}
                    </NRadio>
                  </div>
                </div>
              </NRadioGroup>
              <div class="selection-info" v-if="selectedMap">
                已选择:
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
              {{ isExecuting ? "执行中..." : "执行替换" }}
            </NButton>
          </NSpace>
        </NCard>
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
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
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

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 600;
}

.instruction {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 0.9rem;
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

.path-input {
  flex: 1;
}

.map-radio-group {
  width: 100%;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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

</style>

<style>
html, body {
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
