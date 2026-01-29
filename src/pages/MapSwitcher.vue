<script setup lang="ts">
import { useMapSwitcher } from "@/composables/useMapSwitcher";
import {
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NRadio,
  NRadioGroup,
} from "naive-ui";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const {
  selectedPath,
  selectedMap,
  isExecuting,
  mapOptions,
  canExecute,
  selectDotaRoot,
  executeMapReplacement,
} = useMapSwitcher();
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div class="page-title">{{ t("settings.title") }}</div>
      <div class="page-desc">{{ t("settings.description") }}</div>
    </div>

    <NAlert class="hint" type="warning" :bordered="false">
      {{ t("settings.replaceWarning") }}
    </NAlert>

    <NCard class="panel">
      <NForm label-placement="top" size="medium" :show-feedback="false">
        <NFormItem :label="t('settings.pathLabel')" class="form-item">
          <div class="path-row">
            <NInput
              v-model:value="selectedPath"
              :placeholder="t('settings.pathPlaceholder')"
              readonly
            />
            <NButton
              @click="selectDotaRoot"
              type="primary"
              secondary
              class="browse-button"
            >
              {{ t("settings.dotaRootButton") }}
            </NButton>
          </div>
        </NFormItem>

        <NFormItem :label="t('settings.mapLabel')" class="form-item">
          <NRadioGroup v-model:value="selectedMap" class="map-radio-group">
            <div class="map-grid">
              <NRadio
                v-for="option in mapOptions"
                :key="option.value"
                :value="option.value"
                class="map-tile"
                :class="{ 'is-selected': option.value === selectedMap }"
              >
                {{ option.label }}
              </NRadio>
            </div>
          </NRadioGroup>
        </NFormItem>
      </NForm>

      <div class="execute-area">
        <NButton
          @click="executeMapReplacement"
          :disabled="!canExecute"
          :loading="isExecuting"
          type="primary"
          size="large"
          block
          class="execute-btn"
        >
          {{ isExecuting ? t("common.executing") : t("common.execute") }}
        </NButton>
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

.path-row {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.path-row :deep(.n-input) {
  flex: 1;
}

.path-input {
  cursor: pointer;
}

.path-input :deep(.n-input__input-el) {
  cursor: pointer;
}

.browse-button {
  flex-shrink: 0;
}

.map-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.map-tile {
  height: auto;
  min-height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.03);
  padding: 6px 14px;
  display: flex;
  align-items: center;
  transition: all 140ms ease;
  overflow: hidden;
  cursor: pointer;
  flex: 0 0 auto;
}

.map-tile:hover {
  border-color: rgba(37, 99, 235, 0.26);
  background: rgba(255, 255, 255, 0.92);
}

.map-tile.is-selected {
  border-color: rgba(37, 99, 235, 0.55);
  background: rgba(37, 99, 235, 0.06);
}

.map-tile :deep(.n-radio__label) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(15, 23, 42, 0.84);
  font-weight: 600;
  font-size: 13px;
}

.map-tile.is-selected :deep(.n-radio__label) {
  color: rgba(15, 23, 42, 0.92);
}

.map-tile :deep(.n-radio__dot) {
  border-color: rgba(15, 23, 42, 0.18);
}

.map-tile :deep(.n-radio__dot--checked) {
  border-color: rgba(37, 99, 235, 0.78);
}

.map-tile :deep(.n-radio__dot--checked::before) {
  background: rgba(37, 99, 235, 0.92);
}

.hint {
  border-radius: 16px;
  background: rgba(245, 158, 11, 0.12);
  color: rgba(15, 23, 42, 0.82);
}

.execute-area {
  margin-top: 24px;
}

.execute-btn {
  transition: transform 140ms ease;
}

.execute-btn:active {
  transform: scale(0.98);
}

@media (max-width: 560px) {
  .path-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
