import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const roots = {
  src: path.join(root, "src"),
  app: path.join(root, "app"),
};
const {
  compilerOptions: { paths },
} = JSON.parse(fs.readFileSync(path.join(root, "tsconfig.json"), "utf8"));

function resolveImport(from, specifier) {
  if (specifier.startsWith("/src/") || specifier.startsWith("/app/"))
    return path.resolve(root, specifier.slice(1));
  if (path.isAbsolute(specifier)) return path.normalize(specifier);
  if (specifier.startsWith("."))
    return path.resolve(path.dirname(from), specifier);
  for (const [alias, [target]] of Object.entries(paths)) {
    if (alias.endsWith("/*") && specifier.startsWith(alias.slice(0, -1))) {
      return path.resolve(
        root,
        target.replace("*", specifier.slice(alias.length - 1)),
      );
    }
    if (specifier === alias) return path.resolve(root, target);
  }
  return null;
}

function withinRoot(base, target) {
  const rel = path.relative(base, target).replaceAll(path.sep, "/");
  return (
    Boolean(rel) &&
    rel !== ".." &&
    !rel.startsWith("../") &&
    !path.isAbsolute(rel)
  );
}

const recognizedSrcAreas = new Set([
  "app",
  "pages",
  "layouts",
  "components",
  "islands",
  "styles",
]);
const recognizedAppAreas = new Set([
  "shared",
  "ui",
  "domain",
  "application",
  "infrastructure",
  "presentation",
  "public",
  "bootstrap",
  "composition",
]);

function describe(file) {
  const resolved = path.resolve(root, file);
  if (withinRoot(roots.app, resolved)) {
    const relative = path
      .relative(roots.app, resolved)
      .replaceAll(path.sep, "/");
    const [area, module, layer] = relative.split("/");
    if (area === "modules") {
      const moduleLayer = [
        "domain",
        "application",
        "infrastructure",
        "presentation",
      ].includes(layer)
        ? layer
        : "public";
      return {
        root: "app",
        area: moduleLayer,
        module,
        layer: moduleLayer,
        relative,
        display: `app/${relative}`,
      };
    }
    return {
      root: "app",
      area,
      module: null,
      layer: null,
      relative,
      display: `app/${relative}`,
    };
  }
  if (withinRoot(roots.src, resolved)) {
    const relative = path
      .relative(roots.src, resolved)
      .replaceAll(path.sep, "/");
    const [area] = relative.split("/");
    return {
      root: "src",
      area,
      module: null,
      layer: null,
      relative,
      display: `src/${relative}`,
    };
  }
  return {
    root: null,
    area: null,
    module: null,
    layer: null,
    relative: path.relative(root, resolved).replaceAll(path.sep, "/"),
    display: path.relative(root, resolved).replaceAll(path.sep, "/"),
  };
}

const allowed = {
  app: [
    "app",
    "composition",
    "presentation",
    "public",
    "ui",
    "shared",
    "components",
    "styles",
  ],
  shared: ["shared"],
  ui: ["shared", "ui"],
  domain: ["shared", "domain"],
  application: ["shared", "domain", "application"],
  infrastructure: ["shared", "domain", "infrastructure"],
  presentation: ["shared", "ui", "domain", "application", "presentation"],
  public: ["domain", "presentation"],
  bootstrap: ["shared", "bootstrap"],
  islands: ["islands", "composition", "presentation", "public", "ui", "shared"],
  pages: [
    "pages",
    "layouts",
    "components",
    "islands",
    "styles",
    "presentation",
    "public",
    "ui",
    "shared",
    "bootstrap",
  ],
  layouts: [
    "layouts",
    "components",
    "islands",
    "styles",
    "presentation",
    "public",
    "ui",
    "shared",
  ],
  components: [
    "components",
    "islands",
    "styles",
    "presentation",
    "public",
    "ui",
    "shared",
  ],
};

export default {
  rules: {
    boundaries: {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          boundary:
            "{{from}} no puede importar {{to}}. Usa un puerto y composición externa.",
          framework:
            "El núcleo y los controladores neutrales no pueden importar frameworks, SDKs ni módulos de plataforma.",
          server:
            "Un consumidor cliente no puede importar bootstrap/server ni configuración privada.",
          unknown:
            "Import local fuera de las áreas arquitectónicas reconocidas: {{to}}.",
          dynamic:
            "Los imports dinámicos locales deben usar una ruta literal para verificar sus límites.",
        },
      },
      create(context) {
        const filename = context.physicalFilename ?? context.filename;
        const from = describe(filename);
        const neutral =
          ["domain", "application"].includes(from.area) ||
          /presentation\/(controllers|presenters|view-models)\//.test(
            from.relative,
          );

        function check(node, source) {
          if (typeof source?.value !== "string") return;
          const specifier = source.value;
          const target = resolveImport(filename, specifier);
          if (!target) {
            if (
              neutral ||
              (specifier.startsWith("firebase") &&
                from.area !== "infrastructure")
            )
              context.report({ node, messageId: "framework" });
            return;
          }
          const to = describe(target);
          const recognizedTarget =
            (to.root === "app" && recognizedAppAreas.has(to.area)) ||
            (to.root === "src" && recognizedSrcAreas.has(to.area));
          if (!to.root || !recognizedTarget) {
            context.report({
              node,
              messageId: "unknown",
              data: { to: specifier },
            });
            return;
          }
          if (from.root === "app" && to.root === "src") {
            context.report({
              node,
              messageId: "boundary",
              data: { from: from.display, to: to.display },
            });
            return;
          }
          // La entrada de servidor solo se importa desde código de servidor.
          const server =
            to.root === "app" &&
            /^(bootstrap\/server|bootstrap\/env\/server)/.test(to.relative);
          const serverConsumer =
            (from.root === "app" &&
              /^(bootstrap\/server|bootstrap\/env\/server)/.test(
                from.relative,
              )) ||
            (from.root === "src" &&
              from.area === "pages" &&
              /\.(astro|ts)$/.test(from.relative));
          if (server && !serverConsumer) {
            context.report({ node, messageId: "server" });
            return;
          }
          const inboundDto =
            from.area === "domain" &&
            from.relative.includes("/ports/inbound/") &&
            to.area === "application" &&
            to.relative.includes("/dto/") &&
            node.importKind === "type";
          const crossModule =
            from.module && to.module && from.module !== to.module;
          if (
            crossModule ||
            (!inboundDto &&
              allowed[from.area] &&
              !allowed[from.area].includes(to.area))
          ) {
            context.report({
              node,
              messageId: "boundary",
              data: { from: from.display, to: to.display },
            });
          }
        }
        return {
          ImportDeclaration(node) {
            check(node, node.source);
          },
          ExportNamedDeclaration(node) {
            if (node.source) check(node, node.source);
          },
          ExportAllDeclaration(node) {
            check(node, node.source);
          },
          ImportExpression(node) {
            if (node.source.type !== "Literal")
              context.report({ node, messageId: "dynamic" });
            else check(node, node.source);
          },
          TSImportType(node) {
            check(node, node.source);
          },
          CallExpression(node) {
            if (
              node.callee.type === "Identifier" &&
              node.callee.name === "require"
            )
              check(node, node.arguments[0]);
          },
        };
      },
    },
  },
};
