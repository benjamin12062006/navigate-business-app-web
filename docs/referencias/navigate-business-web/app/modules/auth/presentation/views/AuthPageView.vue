<script setup lang="ts">
import type { AuthController } from '../controllers/auth.controller';
import { useAuth } from '../composables/use-auth';
import AuthSurface from './AuthSurface.vue';

const props = defineProps<{ controller: AuthController }>();
const { state, login, logout, retry } = useAuth(props.controller);
</script>

<template>
  <AuthSurface :state="state" @login="login" @logout="logout" @retry="retry" />
</template>
