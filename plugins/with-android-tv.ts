import { withAndroidManifest, withDangerousMod, type ConfigPlugin } from "@expo/config-plugins";
import fs from "node:fs";
import path from "node:path";

const withAndroidTv: ConfigPlugin = (config) => {
  config = withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults.manifest;
    const application = manifest.application?.[0];
    if (!application) return modConfig;

    (application as unknown as { [key: string]: unknown })["android:banner"] = "@drawable/cineclub_tv_banner";
    const mainActivity = application.activity?.find((activity) => {
      const activityName = (activity as unknown as { [key: string]: string })["android:name"];
      return activityName === ".MainActivity" || activityName === "com.cineclubtv.MainActivity";
    }) ?? application.activity?.[0];

    if (mainActivity) {
      mainActivity["intent-filter"] ??= [];
      const launcherFilter = mainActivity["intent-filter"].find((filter) =>
        filter.category?.some((category) => category["$"]?.["android:name"] === "android.intent.category.LAUNCHER")
      );
      if (launcherFilter) {
        launcherFilter.category ??= [];
        if (!launcherFilter.category.some((category) => category["$"]?.["android:name"] === "android.intent.category.LEANBACK_LAUNCHER")) {
          launcherFilter.category.push({ $: { "android:name": "android.intent.category.LEANBACK_LAUNCHER" } });
        }
      }
    }

    manifest["uses-feature"] ??= [];
    if (!manifest["uses-feature"].some((feature) => feature["$"]?.["android:name"] === "android.software.leanback")) {
      manifest["uses-feature"].push({ $: { "android:name": "android.software.leanback", "android:required": "false" } });
    }
    return modConfig;
  });

  return withDangerousMod(config, ["android", async (modConfig) => {
    const drawableDir = path.join(modConfig.modRequest.platformProjectRoot, "app/src/main/res/drawable");
    fs.mkdirSync(drawableDir, { recursive: true });
    const source = path.join(modConfig.modRequest.projectRoot, "assets/images/android-tv-banner.png");
    const target = path.join(drawableDir, "cineclub_tv_banner.png");
    fs.copyFileSync(source, target);
    return modConfig;
  }]);
};

export default withAndroidTv;
