# Building APK (Android)

Since this is an Expo project, the easiest way to generate an APK is using **Expo Application Services (EAS)**.

## Prerequisites
1.  **Expo Account**: You need an account at [expo.dev](https://expo.dev/signup).
2.  **EAS CLI**: Install it globally if you haven't:
    ```bash
    npm install -g eas-cli
    ```
3.  **Login**:
    ```bash
    eas login
    ```

## Step 1: Configure Project
Run this command to creating the build configuration (`eas.json`):
```bash
eas build:configure
```
- Select **Android** when asked.

## Step 2: Configure for APK (Preview)
By default, EAS builds an "AAB" for the Play Store. To get an installable APK:
1.  Open `eas.json` that was created.
2.  Add a `preview` profile inside `build`:
    ```json
    "build": {
      "preview": {
        "android": {
          "buildType": "apk"
        }
      },
      ...
    }
    ```

## Step 3: Build
Run the build command:
```bash
eas build -p android --profile preview
```
- Wait for the build to finish (this happens in the cloud).
- You will get a QR code and a link to download the `.apk` file.

----

## Local Build (Alternative)
If you have **Android Studio** installed and configured on your Mac:
1.  Generate native files: `npx expo prebuild`
2.  Build using Gradle:
    ```bash
    cd android
    ./gradlew assembleRelease
    ```
3.  The APK will be at `android/app/build/outputs/apk/release/app-release.apk`.
