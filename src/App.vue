<script setup lang="ts">
import AppLayout from "./layouts/AppLayout.vue";
import { NConfigProvider, NDialogProvider, NMessageProvider } from "naive-ui";
import "./styles/global.css";
import { naiveThemeOverrides } from "./styles/naiveTheme";
</script>

<template>
  <NConfigProvider :theme-overrides="naiveThemeOverrides">
    <NMessageProvider>
      <NDialogProvider>
        <AppLayout />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
