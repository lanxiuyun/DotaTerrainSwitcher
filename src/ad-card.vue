<script setup lang="ts">
import { NCard, NImage } from "naive-ui";

interface AdCardProps {
  // 广告标题
  title?: string;
  // 广告描述
  description?: string;
  // 广告图片URL
  imageUrl?: string;
  // 广告图片alt文本
  imageAlt?: string;
  // 按钮文本
  buttonText?: string;
  // 点击按钮跳转的链接
  linkUrl?: string;
  // 是否在新窗口打开链接
  openInNewTab?: boolean;
  // 广告标签（如"推荐"、"热门"等）
  badge?: string;
  // 卡片宽度
  width?: string;
}

const props = withDefaults(defineProps<AdCardProps>(), {
  title: "推荐软件",
  description: "发现更多实用工具",
  buttonText: "了解更多",
  openInNewTab: true,
  width: "100%",
});
</script>

<template>
  <NCard class="ad-card" :style="{ width: props.width }">
    <div class="ad-content">
      <!-- 广告图片 -->
      <div class="ad-image-container" v-if="imageUrl">
        <NImage
          :src="imageUrl"
          :alt="imageAlt || title"
          class="ad-image"
          object-fit="cover"
          preview-disabled
        />
        <span class="ad-badge" v-if="badge">{{ badge }}</span>
      </div>

      <!-- 广告信息 -->
      <div class="ad-info">
        <h3 class="ad-title">{{ title }}</h3>
        <p class="ad-description">{{ description }}</p>

        <a
          href="https://download.upgrade.toolsetlink.com/download?appKey=zY0JIMn9x6W7vCs4P1mtgQ"
          target="_blank"
          class="thanks-link"
        >
          下载地址
        </a>
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.ad-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.ad-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.ad-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.ad-image-container {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
}

.ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ad-card:hover .ad-image {
  transform: scale(1.05);
}

.ad-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  display: inline-block;
  padding: 2px 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1.2;
}

.ad-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.ad-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.ad-description {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ad-button {
  align-self: flex-start;
  margin-top: 4px;
  font-size: 0.8rem;
  padding: 4px 12px;
  height: auto;
  border-radius: 4px;
  transition: all 0.2s ease;
}
</style>
