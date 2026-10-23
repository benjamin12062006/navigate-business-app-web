<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue';
import { acquireAuthClient } from '@composition/auth/auth-client';
import type { AuthController } from '@modules/auth/presentation/controllers/auth.controller';
import {
  initialAuthState,
  toAuthViewModel,
} from '@modules/auth/presentation/view-models/auth-view-model';
import AuthPageView from '@modules/auth/presentation/views/AuthPageView.vue';
import AuthSurface from '@modules/auth/presentation/views/AuthSurface.vue';

const controller = shallowRef<AuthController | null>(null);
const initialState = toAuthViewModel(initialAuthState());
let lease: ReturnType<typeof acquireAuthClient> | undefined;

onMounted(() => {
  lease = acquireAuthClient();
  controller.value = lease.value;
});
onUnmounted(() => {
  lease?.release();
});
</script>

<template>
  <AuthPageView v-if="controller" :controller="controller" />
  <AuthSurface v-else :state="initialState" />
</template>
