const { withAppDelegate } = require("expo/config-plugins");

// Expo 58 forwards warm and cold scene URL events to this AppDelegate method.
function patchAppDelegate(source) {
  if (source.includes("// navigate-google-redirect")) return source;
  if (!source.includes("import GoogleSignIn"))
    source = `import GoogleSignIn\n${source}`;
  const existing =
    /(func application\([\s\S]*?open url: URL[\s\S]*?\) -> Bool\s*\{)/;
  if (existing.test(source)) {
    return source.replace(
      existing,
      "$1\n    // navigate-google-redirect\n    if GIDSignIn.sharedInstance.handle(url) { return true }",
    );
  }
  const declaration = /(class AppDelegate\s*:\s*ExpoAppDelegate\s*\{)/;
  if (!declaration.test(source))
    throw new Error("No se encontró AppDelegate de Expo para conectar Google.");
  return source.replace(
    declaration,
    `$1
  // navigate-google-redirect
  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    if GIDSignIn.sharedInstance.handle(url) { return true }
    return super.application(app, open: url, options: options)
  }
`,
  );
}

module.exports = function withGoogleRedirect(config) {
  return withAppDelegate(config, (mod) => {
    if (mod.modResults.language !== "swift")
      throw new Error("Google redirect requiere el host Swift de Expo.");
    mod.modResults.contents = patchAppDelegate(mod.modResults.contents);
    return mod;
  });
};
module.exports.patchAppDelegate = patchAppDelegate;
