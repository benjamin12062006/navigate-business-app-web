<script setup lang="ts">
import { computed } from 'vue';
import type { AccountOutputDto as Account } from '@modules/auth/application/dto/account-output.dto';
import AuthButton from '@ui/components/ActionButton.vue';

const props = defineProps<{
  account: Account;
  displayName: string | null;
  email: string | null;
}>();

defineEmits<{ logout: [] }>();

const name = computed(() => props.displayName?.split(' ')[0] || 'de nuevo');
</script>

<template>
  <div
    class="mb-5 grid size-[42px] place-items-center rounded-full bg-[#e8f0e3] text-[23px] text-[#3d653b]"
    aria-hidden="true"
  >
    ✓
  </div>
  <h2
    id="access-title"
    class="mb-[18px] text-[clamp(28px,3vw,35px)] leading-[1.18] font-medium tracking-[-.045em] text-[#1f3024]"
  >
    Hola, {{ name }}.
  </h2>
  <p class="mb-[30px] text-sm leading-[1.7] text-[#73796f]">
    Tu cuenta está lista. Este es el comienzo de tu espacio en Navigate.
  </p>
  <div
    class="mb-[25px] rounded-[10px] border border-[#e3e9de] bg-[#fafbf8] p-[18px]"
  >
    <span
      class="flex items-center gap-1.5 text-[10px] font-semibold tracking-[.06em] text-[#466143] uppercase"
      ><span
        class="size-[5px] rounded-full bg-[#6b8c5c]"
        aria-hidden="true"
      ></span>
      Cuenta activa</span
    >
    <p v-if="email" class="my-[1em] text-[13px] wrap-anywhere text-[#354c36]">
      {{ email }}
    </p>
    <dl class="mt-[1em]">
      <dt class="text-[10px] text-[#737d6d]">Identificador de cuenta</dt>
      <dd
        class="mt-[7px] font-mono text-[10px] leading-[1.6] wrap-anywhere text-[#55614e]"
      >
        {{ account.account_id }}
      </dd>
    </dl>
  </div>
  <AuthButton label="Cerrar sesión" @click="$emit('logout')" />
  <p class="mt-7 text-center text-[10px] leading-[1.7] text-[#7d8378]">
    Tus datos de acceso son personales.
  </p>
</template>
