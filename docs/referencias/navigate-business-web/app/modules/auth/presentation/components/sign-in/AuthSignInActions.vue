<script setup lang="ts">
import type { AuthPhase } from '../../view-models/auth-view-model';
import AuthButton from '@ui/components/ActionButton.vue';

defineProps<{
  phase: AuthPhase;
  hasUser: boolean;
  busy: boolean;
  mustSignIn: boolean;
  suspended: boolean;
  canLogin: boolean;
}>();

defineEmits<{ login: []; retry: []; logout: [] }>();
</script>

<template>
  <template v-if="!busy">
    <AuthButton
      v-if="phase !== 'error' || (canLogin && (mustSignIn || !hasUser))"
      :label="
        mustSignIn ? 'Volver a entrar con Google' : 'Continuar con Google'
      "
      :disabled="phase === 'configuration'"
      google
      @click="$emit('login')"
    />
    <AuthButton
      v-else-if="!suspended"
      label="Volver a intentar"
      @click="$emit('retry')"
    />
    <button
      v-if="phase === 'error' && canLogin && !hasUser && !mustSignIn"
      class="mx-auto block cursor-pointer border-0 bg-transparent px-[5px] pt-[13px] text-[12px] text-[#4a6549] underline underline-offset-4"
      type="button"
      @click="$emit('retry')"
    >
      Comprobar sesión de nuevo
    </button>
  </template>
  <button
    v-if="hasUser || phase === 'error' || phase === 'loading-account'"
    class="mx-auto block cursor-pointer border-0 bg-transparent px-[5px] pt-[13px] text-[12px] text-[#4a6549] underline underline-offset-4"
    type="button"
    @click="$emit('logout')"
  >
    {{
      hasUser ? 'Salir y usar otra cuenta' : 'Cerrar sesión en este navegador'
    }}
  </button>
</template>
