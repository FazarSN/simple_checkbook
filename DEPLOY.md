# Deployment Guide — Simple Checkbook

This guide explains how to run Simple Checkbook locally without an HTTP server.
The app works fully (render, entry form, IndexedDB persistence, import/export)
by opening `src/index.html` directly in a Chromium-based browser.

The service worker still registers and caches the app shell when served over
HTTP/HTTPS — that path is unchanged. Under `file://` the SW is skipped silently
(no console errors); offline caching via the service worker is simply unavailable.

---

## (a) PC — Run without a server

**Requirements:** Chrome or Edge (any recent version).

1. Download or clone this repository to your PC.
2. Navigate to the `src/` folder.
3. Double-click `index.html` (or right-click → Open with → Chrome/Edge).

The app opens directly via `file://`. All features work: adding, editing, and
deleting transactions; running balance; IndexedDB persistence across reloads;
import/export via JSON download.

> **Optional — for offline SW caching:** If you want the service worker to cache
> the app shell so it loads offline on subsequent visits, serve the `src/`
> folder over HTTP once:
>
> ```sh
> # From inside the src/ directory:
> python -m http.server 8080
> # Then open http://localhost:8080
> ```
>
> After the first HTTP visit, the SW caches the shell and the PWA works offline
> even without a server on subsequent visits (Chrome only, while the cached
> shell is still present).

---

## (b) Android (Samsung M34) — Run without a server

**Requirements:** Samsung M34 (Android 14). Chrome is preinstalled.

1. On your PC, copy the entire `src/` folder to the Samsung M34.
   - You can use a USB cable, Bluetooth, or a sharing app like
     [Google Files](https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.files)
     or [Send Anywhere](https://send-anywhere.com).
   - On Samsung devices, you can also use the built-in **Smart Switch** or
     **Quick Share**.
2. On the M34, open the **Files** app (or My Files) and navigate to the copied
   `src/` folder.
3. Tap `index.html` → choose **Chrome** when prompted.

The app opens via `file://` in Chrome. All features work: entry form, dropdowns,
IndexedDB persistence, import/export.

### Optional: Add to Home screen

For a standalone-window PWA experience (no browser address bar):

1. In Chrome, tap the **three-dot menu** (⋮) → **Share** → **Add to Home screen**.
2. Confirm the name and tap **Add**.

A shortcut is created on the home screen. Tapping it opens the app in
`display: standalone` mode (no browser UI), just like a native app.

> **Note:** Because the SW does not register under `file://`, the "Add to Home
> screen" shortcut will still load from local storage each time (no cached
> offline shell). If you need offline loading after power-off, serve the app
> over HTTP once (e.g., via `python -m http.server` or a local network share),
> let the SW cache it, then add to Home screen from the HTTP origin.

---

## (c) Package as APK with Capacitor

If you prefer a native APK instead of opening the app in a browser:

### Option 1 — Trusted Web Activity (TWA) via Bubblewrap

A TWA wraps the PWA in a minimal Android app with no browser UI. It requires the
app to be served over HTTPS, so host the `src/` folder on a local web server
(e.g., [KSWEB](https://play.google.com/store/apps/details?id=ru.kslabs.ksweb) or
a Python HTTP server on your PC) and use that address as the TWA launch URL.

1. Install [Node.js](https://nodejs.org/) on your PC.
2. Install Bubblewrap: `npm install -g @bubblewrap/cli`
3. Run `bubblewrap init` in a new directory and follow the prompts.
4. Run `bubblewrap build` to generate the APK.
5. Sign and install the APK on the M34.

**Pros:** Minimal overhead, no code changes. **Cons:** Requires an HTTPS origin;
cannot launch from `file://` directly.

### Option 2 — Capacitor

This repository already includes the Android wrapper configuration needed to build
an installable APK directly from the existing `src/` app.

### Windows prerequisites

- Node.js 20 or newer
- Android Studio with Android SDK Platform 35 and Android SDK Build-Tools
- JDK 25, with `JAVA_HOME` set and `%JAVA_HOME%\bin` on `PATH`
- `ANDROID_HOME` set to the SDK directory, with `platform-tools` on `PATH`
- Capacitor 7.6.9, Android Gradle Plugin 9.0.1, and Gradle 9.1.0

The project pins the Capacitor packages in `package.json`. From the repository
root, use:

A TWA wraps the PWA in a minimal Android app with no browser UI. It requires the
app to be served over HTTPS, so host the `src/` folder on a local web server
(e.g., [KSWEB](https://play.google.com/store/apps/details?id=ru.kslabs.ksweb) or
a Python HTTP server on your PC) and use that address as the TWA launch URL.

1. Install [Node.js](https://nodejs.org/) on your PC.
2. Install Bubblewrap: `npm install -g @bubblewrap/cli`
3. Run `bubblewrap init` in a new directory and follow the prompts.
4. Run `bubblewrap build` to generate the APK.
5. Sign and install the APK on the M34.

**Pros:** Minimal overhead, no code changes. **Cons:** Requires an HTTPS origin;
cannot launch from `file://` directly.

### Option 2 — Capacitor

This repository already includes the Android wrapper configuration needed to build
an installable APK directly from the existing `src/` app.

1. Install Node.js (and Java/Android Studio if you want to build locally):
   `npm install`
2. Sync the web assets into Android: `npx cap sync android`
3. Open the project in Android Studio: `npx cap open android`
4. Build a debug APK: `npm run android:debug` (syncs assets, then runs Gradle `assembleDebug`)
5. Install over USB: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`

The release command is `npm run android:release`. The unsigned release APK is
at `android/app/build/outputs/apk/release/app-release-unsigned.apk`; sign it
with a private keystore outside the repository before distribution.

### Samsung M34 installation and upgrades

Enable Developer options and USB debugging on the M34, connect it by USB, and
confirm the RSA prompt. Check the connection with `adb devices`, then install
the debug artifact using the command above. A newer APK with the same package
ID can be installed with `adb install -r`; this preserves SQLite transactions
and the native `checkbook-data.json` backup. Do not use `adb uninstall` for an
upgrade because that removes app-private data.

The native app writes `checkbook-data.json` to the Capacitor app-private `DATA`
directory and reads it back without prompting for a picker. The browser target
keeps its current download/file-picker fallback, and the shared validation logic
remains unchanged.

**Pros:** Works with bundled local assets and no server requirement for the
installed app. **Cons:** Requires the Android toolchain (JDK + Android Studio)
and a Windows setup that matches the local SDK/Gradle versions.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Dropdowns are empty on Android | Ensure you copied the **entire** `src/` folder — the JS is inlined in `index.html`, so there are no missing external scripts. |
| Service Worker registration failed | Expected under `file://`. No action needed — core features still work. For SW caching, use the HTTP option in section (a). |
| Styling looks wrong | Ensure `style.css` is in the same `src/` folder as `index.html`. |
| Import fails | The JSON file must be an array of transaction objects with `id`, `type`, `amount`, `name`, `category`, `account`, `date` fields. |
| Gradle reports missing Java | Install JDK 25, set `JAVA_HOME`, reopen the terminal, and confirm `java -version`. |
| `adb` finds no device | Enable USB debugging, accept the RSA prompt, and confirm the cable supports data. |
| APK build output is missing | Run `npm install`, then `npm run android:debug`; inspect the first Gradle error rather than deleting app data. |
