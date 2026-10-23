<script setup lang="ts">
import type { AuthPhase } from '../../view-models/auth-view-model';
import AuthStatus from '../status/AuthStatus.vue';
import AuthSignInActions from './AuthSignInActions.vue';
import AuthPrivacyNote from './AuthPrivacyNote.vue';

defineProps<{
  phase: AuthPhase;
  hasUser: boolean;
  message: string;
  busy: boolean;
  mustSignIn: boolean;
  suspended: boolean;
  canLogin: boolean;
}>();

defineEmits<{ login: []; retry: []; logout: [] }>();
</script>

<template>
  <h2
    id="access-title"
    class="mb-[18px] text-[clamp(28px,3vw,35px)] leading-[1.18] font-medium tracking-[-.045em] text-[#1f3024]"
  >
    Un buen punto<br />de partida.
  </h2>
  <p class="mb-[30px] text-sm leading-[1.7] text-[#73796f]">
    Entra a tu cuenta y empieza a construir<br class="max-[420px]:hidden" />
    una perspectiva propia.
  </p>
  <AuthStatus :phase="phase" :busy="busy" :message="message" />
  <AuthSignInActions
    :phase="phase"
    :has-user="hasUser"
    :busy="busy"
    :must-sign-in="mustSignIn"
    :suspended="suspended"
    :can-login="canLogin"
    @login="$emit('login')"
    @retry="$emit('retry')"
    @logout="$emit('logout')"
  />
  <AuthPrivacyNote />
  <p class="mt-7 text-center text-[10px] leading-[1.7] text-[#7d8378]">
    Si es tu primera vez, prepararemos tu cuenta al entrar.
  </p>
</template>
