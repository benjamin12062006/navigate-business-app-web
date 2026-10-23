import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
const { patchAppDelegate } = createRequire(import.meta.url)(
  "../plugins/with-google-redirect.cjs",
);

describe("callback de Google en el host Swift generado por Expo", () => {
  it("conserva otros handlers y no duplica el callback al repetir prebuild", () => {
    const source = `import Expo
public class AppDelegate: ExpoAppDelegate {
  public override func application(_ app: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool { return true }
  public override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return super.application(app, open: url, options: options)
  }
}`;
    const updated = patchAppDelegate(source);
    expect(updated).toContain("import GoogleSignIn");
    expect(updated).toContain(
      "return super.application(app, open: url, options: options)",
    );
    expect(
      updated.indexOf("GIDSignIn.sharedInstance.handle(url)"),
    ).toBeGreaterThan(updated.indexOf("open url: URL"));
    expect(patchAppDelegate(updated)).toBe(updated);
  });
  it("agrega el método si no existe y rechaza una plantilla desconocida", () => {
    expect(
      patchAppDelegate(
        "import Expo\npublic class AppDelegate: ExpoAppDelegate {}",
      ),
    ).toContain("public override func application(");
    expect(() => patchAppDelegate("class Unknown {}")).toThrow();
  });
});
