const { withAndroidManifest, withDangerousMod } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

const withAndroidTv = (config) => {
  config = withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults.manifest;
    const application = manifest.application && manifest.application[0];
    if (!application) return modConfig;

    application["android:banner"] = "@drawable/cineclub_tv_banner";
    const activities = application.activity || [];
    const mainActivity = activities.find((activity) => {
      const activityName = activity["android:name"];
      return activityName === ".MainActivity" || activityName === "com.cineclubtv.MainActivity";
    }) || activities[0];

    if (mainActivity) {
      mainActivity["intent-filter"] = mainActivity["intent-filter"] || [];
      const launcherFilter = mainActivity["intent-filter"].find((filter) =>
        (filter.category || []).some((category) => category.$ && category.$["android:name"] === "android.intent.category.LAUNCHER")
      );
      if (launcherFilter) {
        launcherFilter.category = launcherFilter.category || [];
        if (!launcherFilter.category.some((category) => category.$ && category.$["android:name"] === "android.intent.category.LEANBACK_LAUNCHER")) {
          launcherFilter.category.push({ $: { "android:name": "android.intent.category.LEANBACK_LAUNCHER" } });
        }
      }
    }

    manifest["uses-feature"] = manifest["uses-feature"] || [];
    if (!manifest["uses-feature"].some((feature) => feature.$ && feature.$["android:name"] === "android.software.leanback")) {
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

module.exports = withAndroidTv;
