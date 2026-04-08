const { withDangerousMod, withXcodeProject, withEntitlementsPlist, withInfoPlist } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const WIDGET_NAME = 'TakvimWidgetExtension';
const APP_GROUP = 'group.com.takvim.app';
const BUNDLE_ID_SUFFIX = '.widget';

function withIosPrayerWidget(config) {
  // 1. Add App Group entitlement to main app
  config = withEntitlementsPlist(config, (mod) => {
    mod.modResults['com.apple.security.application-groups'] = [APP_GROUP];
    return mod;
  });

  // 2. Copy widget Swift files into the iOS project
  config = withDangerousMod(config, [
    'ios',
    async (mod) => {
      const projectRoot = mod.modRequest.projectRoot;
      const iosPath = path.join(projectRoot, 'ios');
      const widgetDir = path.join(iosPath, WIDGET_NAME);

      if (!fs.existsSync(widgetDir)) {
        fs.mkdirSync(widgetDir, { recursive: true });
      }

      // Copy the Swift widget file
      const srcSwift = path.join(projectRoot, 'ios-widget', 'TakvimPrayerWidget.swift');
      const dstSwift = path.join(widgetDir, 'TakvimPrayerWidget.swift');
      if (fs.existsSync(srcSwift)) {
        fs.copyFileSync(srcSwift, dstSwift);
      }

      // Create widget Info.plist
      const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleDisplayName</key>
    <string>Takvim Prayers</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>$(MARKETING_VERSION)</string>
    <key>CFBundleVersion</key>
    <string>$(CURRENT_PROJECT_VERSION)</string>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.widgetkit-extension</string>
    </dict>
</dict>
</plist>`;
      fs.writeFileSync(path.join(widgetDir, 'Info.plist'), infoPlist);

      // Create widget entitlements
      const entitlements = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>${APP_GROUP}</string>
    </array>
</dict>
</plist>`;
      fs.writeFileSync(path.join(widgetDir, `${WIDGET_NAME}.entitlements`), entitlements);

      return mod;
    },
  ]);

  // 3. Add the widget extension target to the Xcode project
  config = withXcodeProject(config, (mod) => {
    const xcodeProject = mod.modResults;
    const bundleId = mod.ios?.bundleIdentifier || 'com.takvim.app';
    const widgetBundleId = `${bundleId}${BUNDLE_ID_SUFFIX}`;

    // Check if target already exists
    const existingTarget = xcodeProject.pbxTargetByName(WIDGET_NAME);
    if (existingTarget) {
      return mod;
    }

    // Add widget extension target
    const target = xcodeProject.addTarget(
      WIDGET_NAME,
      'app_extension',
      WIDGET_NAME,
      widgetBundleId
    );

    // Add build phases
    xcodeProject.addBuildPhase(
      ['TakvimPrayerWidget.swift'],
      'PBXSourcesBuildPhase',
      'Sources',
      target.uuid
    );

    // Add the widget group
    const widgetGroupKey = xcodeProject.pbxCreateGroup(WIDGET_NAME, WIDGET_NAME);
    const mainGroupKey = xcodeProject.getFirstProject().firstProject.mainGroup;
    xcodeProject.addToPbxGroup(widgetGroupKey, mainGroupKey);

    // Add files to widget group
    xcodeProject.addFile(
      `${WIDGET_NAME}/TakvimPrayerWidget.swift`,
      widgetGroupKey,
      { target: target.uuid }
    );
    xcodeProject.addFile(
      `${WIDGET_NAME}/Info.plist`,
      widgetGroupKey
    );

    // Configure build settings for the widget target
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      if (typeof configurations[key] === 'object' && configurations[key].buildSettings) {
        const settings = configurations[key].buildSettings;
        const name = configurations[key].name;

        // Find configs belonging to our widget target
        if (settings.PRODUCT_BUNDLE_IDENTIFIER === `"${widgetBundleId}"` ||
            settings.PRODUCT_NAME === `"${WIDGET_NAME}"`) {
          settings.SWIFT_VERSION = '5.0';
          settings.IPHONEOS_DEPLOYMENT_TARGET = '16.0';
          settings.TARGETED_DEVICE_FAMILY = '"1,2"';
          settings.CODE_SIGN_ENTITLEMENTS = `"${WIDGET_NAME}/${WIDGET_NAME}.entitlements"`;
          settings.INFOPLIST_FILE = `"${WIDGET_NAME}/Info.plist"`;
          settings.MARKETING_VERSION = '1.0.0';
          settings.CURRENT_PROJECT_VERSION = '1';
          settings.GENERATE_INFOPLIST_FILE = 'YES';
          settings.ASSETCATALOG_COMPILER_WIDGET_BACKGROUND_COLOR_NAME = '"WidgetBackground"';
          settings.PRODUCT_NAME = `"$(TARGET_NAME)"`;
        }
      }
    }

    return mod;
  });

  return config;
}

module.exports = withIosPrayerWidget;
