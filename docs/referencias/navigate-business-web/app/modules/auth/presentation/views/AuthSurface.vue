<script setup lang="ts">
import type { AuthViewModel } from '../view-models/auth-view-model';
import AuthAccount from '../components/account/AuthAccount.vue';
import AuthSignIn from '../components/sign-in/AuthSignIn.vue';

defineProps<{ state: AuthViewModel }>();
defineEmits<{ login: []; logout: []; retry: [] }>();
</script>

<template>
  <section
    id="acceso"
    class="scroll-mt-[35px] rounded-[22px] border border-[#e1e5dd] bg-white p-10 shadow-access max-[420px]:rounded-[17px] max-[420px]:px-[23px] max-[420px]:py-7"
    aria-labelledby="access-title"
    :aria-busy="state.busy"
  >
    <div
      class="mb-[34px] flex items-center gap-[9px] text-[10px] font-bold tracking-[.13em] text-[#626f60] max-[420px]:mb-[26px]"
    >
      <span
        class="grid size-[22px] place-items-center rounded-md bg-[#eaf0e7] text-[17px] text-[#41583e]"
        aria-hidden="true"
        >↗</span
      >
      TU ESPACIO PERSONAL
    </div>
    <AuthAccount
      v-if="state.phase === 'ready' && state.account"
      :account="state.account"
      :display-name="state.user?.displayName ?? null"
      :email="state.user?.email ?? null"
      @logout="$emit('logout')"
    />
    <AuthSignIn
      v-else
      :phase="state.phase"
      :has-user="!!state.user"
      :message="state.message"
      :busy="state.busy"
      :must-sign-in="state.mustSignIn"
      :suspended="state.suspended"
      :can-login="state.canLogin"
      @login="$emit('login')"
      @retry="$emit('retry')"
      @logout="$emit('logout')"
    />
  </section>
</template>
