<script setup lang="ts">
interface Props {
  label: string;
  disabled?: boolean;
  google?: boolean;
}

defineProps<Props>();
// Un único botón raíz conserva los atributos y el listener @click del padre.
</script>

<template>
  <button
    class="flex min-h-[53px] w-full cursor-pointer items-center justify-center gap-3 rounded-[9px] border border-action bg-action px-4 py-[13px] text-[13px] font-semibold text-white transition-[background,transform] duration-150 ease-linear enabled:hover:-translate-y-px enabled:hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-[.52] motion-reduce:transition-none"
    type="button"
    :disabled="disabled"
  >
    <svg
      v-if="google"
      class="box-content size-[19px] rounded-full bg-white p-0.5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.8-1.76-5.6-4.13H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.92A6 6 0 0 1 6.08 12c0-.67.11-1.31.32-1.92V7.49H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.51l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.34 2.59A5.96 5.96 0 0 1 12 5.95Z"
      />
    </svg>
    {{ label }}
    <span
      :class="google ? 'ml-auto text-[19px] font-normal' : ''"
      aria-hidden="true"
      >↗</span
    >
  </button>
</template>
