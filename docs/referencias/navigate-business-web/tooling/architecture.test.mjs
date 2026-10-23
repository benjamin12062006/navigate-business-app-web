import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const cwd = fileURLToPath(new URL('../', import.meta.url));
const eslint = new ESLint({ cwd });

async function boundaries(filePath, code) {
  const [result] = await eslint.lintText(code, { filePath });
  const parseErrors = result.messages.filter((message) => message.fatal);
  expect(parseErrors).toEqual([]);
  return result.messages.filter(
    (message) => message.ruleId === 'architecture/boundaries',
  );
}

describe('límites efectivos con los parsers reales de ESLint', () => {
  it.each([
    ['fetch("/api")', 'no-restricted-globals'],
    ['process.env.API_URL', 'no-restricted-globals'],
    ['import.meta.env.PUBLIC_API_BASE_URL', 'no-restricted-syntax'],
  ])(
    'el núcleo no accede a configuración o IO global: %s',
    async (code, ruleId) => {
      const [result] = await eslint.lintText(code, {
        filePath: 'app/modules/auth/domain/probe.ts',
      });
      expect(result.messages.some((message) => message.ruleId === ruleId)).toBe(
        true,
      );
    },
  );

  it('un componente UI no importa Firebase directamente', async () => {
    expect(
      await boundaries(
        'app/ui/Probe.vue',
        '<script setup lang="ts">import { getAuth } from "firebase/auth";</script><template><div /></template>',
      ),
    ).toHaveLength(1);
  });
  it.each([
    [
      'app/modules/auth/application/probe.ts',
      "import type { Account } from '../domain/entities/account.entity';",
    ],
    [
      'app/modules/auth/domain/ports/inbound/probe.ts',
      "import type { AccountOutputDto } from '@modules/auth/application/dto/account-output.dto';",
    ],
    [
      'app/composition/probe.ts',
      "import { createAuthController } from '@modules/auth/presentation/controllers/auth.controller';",
    ],
    [
      'app/modules/auth/presentation/probe.vue',
      '<script setup lang="ts">import type { AccountOutputDto } from "@modules/auth/application/dto/account-output.dto";</script><template><div /></template>',
    ],
    [
      'src/islands/probe.vue',
      '<script setup lang="ts">import { acquireAuthClient } from "@composition/auth/auth-client";</script><template><div /></template>',
    ],
  ])('permite %s → contrato autorizado', async (file, code) => {
    expect(await boundaries(file, code)).toEqual([]);
  });

  it.each([
    [
      'app/modules/auth/domain/probe.ts',
      "import { x } from '../application/use-cases/load-account.use-case';",
    ],
    [
      'app/modules/auth/domain/probe.ts',
      "import { x } from '@app/modules/auth/infrastructure/adapters/firebase-session.adapter';",
    ],
    [
      'app/modules/auth/domain/ports/inbound/probe.ts',
      "import { x } from '@modules/auth/application/dto/account-output.dto';",
    ],
    [
      'app/modules/auth/infrastructure/probe.ts',
      "import { x } from '../application/use-cases/load-account.use-case';",
    ],
    [
      'app/modules/auth/presentation/probe.ts',
      "import { x } from '@bootstrap/client';",
    ],
    [
      'app/modules/auth/presentation/probe.ts',
      "export { x } from '../../../composition/auth/create-auth-module';",
    ],
    [
      'app/modules/auth/presentation/probe.ts',
      "const x = import('@modules/auth/infrastructure/adapters/firebase-session.adapter');",
    ],
    [
      'app/modules/auth/presentation/probe.ts',
      "type X = import('@bootstrap/client').X;",
    ],
    ['app/modules/auth/domain/probe.ts', "import { ref } from 'vue';"],
    [
      'app/shared/probe.ts',
      "import { x } from '../composition/auth/create-auth-module';",
    ],
    ['app/bootstrap/probe.ts', "import { x } from '@modules/auth';"],
    [
      'app/ui/probe.ts',
      "import { x } from '@modules/auth/domain/entities/account.entity';",
    ],
    [
      'app/modules/auth/index.ts',
      "export { x } from '@composition/auth/create-auth-module';",
    ],
    [
      'app/modules/other/application/probe.ts',
      "import { x } from '@modules/auth/application/use-cases/load-account.use-case';",
    ],
    ['src/islands/probe.ts', "import { x } from '@bootstrap/server';"],
    [
      'app/modules/auth/presentation/probe.vue',
      '<script setup lang="ts">import { x } from "@modules/auth/infrastructure/adapters/firebase-session.adapter";</script><template><div /></template>',
    ],
    [
      'src/components/probe.astro',
      '---\nimport { x } from "@bootstrap/server";\n---\n<div />',
    ],
    [
      'app/modules/auth/presentation/probe.ts',
      "import { x } from '@/islands/AuthIsland.vue';",
    ],
    [
      'app/composition/probe.ts',
      "import { x } from '../../src/islands/AuthIsland.vue';",
    ],
    [
      'app/shared/probe.ts',
      "import { x } from '../../tooling/eslint/architecture.mjs';",
    ],
    [
      'app/modules/auth/presentation/probe.ts',
      "import { x } from '@app/modules/auth/infrastructure/adapters/firebase-session.adapter';",
    ],
  ])('rechaza %s → dependencia prohibida', async (file, code) => {
    expect((await boundaries(file, code)).length).toBeGreaterThan(0);
  });
});
