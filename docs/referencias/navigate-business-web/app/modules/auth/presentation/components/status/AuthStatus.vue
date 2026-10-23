<script setup lang="ts">
import { computed } from 'vue';
import type { AuthPhase } from '../../view-models/auth-view-model';

const props = defineProps<{
  phase: AuthPhase;
  busy: boolean;
  message: string;
}>();

const loadingLabel = computed(() => {
  if (props.phase === 'starting') return 'Comprobando tu sesión…';
  if (props.phase === 'signing-in') return 'Continúa en la ventana de Google…';
  return 'Preparando tu espacio…';
});
</script>

<template>
  <div
    v-if="busy"
    class="-mt-[5px] mb-5 flex min-h-[53px] items-center justify-center gap-[11px] rounded-lg bg-[#eff3ec] p-[13px] text-xs leading-[1.6] text-[#475f43]"
    role="status"
    aria-live="polite"
  >
    <span
      class="size-[15px] shrink-0 animate-spin rounded-full border-2 border-[#cbd5c4] border-t-[#476444] [animation-duration:900ms] motion-reduce:animate-none"
      aria-hidden="true"
    ></span
    ><span>{{ loadingLabel }}</span>
  </div>
  <template v-else>
    <div
      v-if="phase === 'configuration'"
      class="-mt-[5px] mb-5 flex items-start gap-[11px] rounded-lg border border-[#e9e4d1] bg-[#f7f5ed] p-[13px] text-xs leading-[1.6] text-[#6e6135]"
      role="status"
    >
      <span
        class="mt-[5px] size-1.5 shrink-0 rounded-full bg-[#9e8c4f]"
        aria-hidden="true"
      ></span>
      <div>
        <strong class="mb-[3px] block text-[11px] font-semibold"
          >Estamos preparando el acceso.</strong
        >
        <p>
          El inicio de sesión estará disponible cuando termine la configuración.
        </p>
      </div>
    </div>
    <div
      v-if="phase === 'error'"
      class="-mt-[5px] mb-5 flex items-start gap-[11px] rounded-lg border border-[#f0d9d2] bg-[#fcf1ee] p-[13px] text-xs leading-[1.6] text-[#913e32]"
      role="alert"
    >
      <span class="font-bold" aria-hidden="true">!</span>
      <p>{{ message }}</p>
    </div>
    <p
      v-else-if="message"
      class="mb-4 text-xs leading-[1.6] text-[#64725f]"
      role="status"
    >
      {{ message }}
    </p>
  </template>
</template>
