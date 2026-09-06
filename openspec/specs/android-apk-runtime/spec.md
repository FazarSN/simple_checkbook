# android-apk-runtime Specification

## Purpose

Provides an installable Android APK that runs the complete checkbook locally and can use native app storage for reliable offline data exchange without browser file-picker limitations.

## Requirements

### Requirement: Android build uses the pinned Java 25 toolchain

The Android project SHALL be buildable with JDK 25, Gradle 9.1.0, Android Gradle
Plugin 9.0.1, and Android SDK Platform 35. The project documentation SHALL identify
JDK 25 as the required Java version for local APK builds.

#### Scenario: Developer builds the APK with JDK 25

- **GIVEN** JDK 25 is installed and `JAVA_HOME` points to it
- **WHEN** the developer runs the documented debug or release APK build command
- **THEN** Gradle uses the Java 25 toolchain and produces the corresponding APK

### Requirement: Android APK runs the complete checkbook locally

The system SHALL provide an installable Android APK containing the checkbook application and SHALL start the application without requiring a network connection or a local development server.

#### Scenario: User launches the installed APK offline

- **GIVEN** the APK is installed on a supported Android device
- **WHEN** the user launches the application while the device has no network connection
- **THEN** the checkbook opens to its transaction list and its core navigation, entry, balance, persistence, and import/export features are available

### Requirement: APK preserves core checkbook behavior

The APK SHALL support the existing transaction workflows, including add, edit, delete, running balance, navigation, and native SQLite persistence, with behavior equivalent to the browser target.

#### Scenario: User manages a transaction in the APK

- **GIVEN** the user has launched the APK
- **WHEN** the user adds, edits, or deletes a transaction
- **THEN** the list, balance, and SQLite-persisted transaction data reflect the operation after the app is closed and relaunched

### Requirement: APK provides deterministic native data storage

The APK SHALL store its import/export backup in a deterministic app-accessible data location and SHALL NOT require the user to choose a folder for normal export or import operations.

#### Scenario: User exports without a folder chooser

- **GIVEN** the user is in the Import/Export view of the APK
- **WHEN** the user taps Export
- **THEN** the app writes `checkbook-data.json` to its configured native data location without opening a folder chooser

### Requirement: APK registers and verifies the Filesystem plugin

The Android APK SHALL package and register the version-compatible Capacitor
Filesystem plugin during Android project synchronization. Before native import
or export, the app SHALL verify that the registered plugin exposes the required
read and write operations. If the plugin is unavailable in the native runtime,
the app SHALL show a filesystem error and SHALL NOT use the browser import or
download fallback.

#### Scenario: Native Filesystem plugin is unavailable

- **GIVEN** the app is running in the Android native runtime and the Filesystem plugin is not exposed
- **WHEN** the user attempts an import or export
- **THEN** the app shows a filesystem error, leaves the transaction store unchanged, and does not open a browser file chooser or download

### Requirement: APK reports filesystem operation states

The APK SHALL show progress while native import/export is running and SHALL show a clear completed, cancelled, or error result when the operation ends.

#### Scenario: Native export completes

- **GIVEN** the APK has transactions to export
- **WHEN** the user taps Export
- **THEN** the UI shows an in-progress state and then a done state after the backup is written

#### Scenario: Native import fails safely

- **GIVEN** the native backup is missing, unreadable, or invalid
- **WHEN** the user taps Import
- **THEN** the UI reports the failure and the current transaction store remains unchanged

### Requirement: Browser target remains available

Adding the APK target SHALL NOT prevent the existing browser/PWA target from loading and using its supported browser-specific import/export fallback behavior.

#### Scenario: Browser app continues to run

- **GIVEN** the user opens the web app in a supported browser
- **WHEN** the app initializes and the user uses core checkbook features
- **THEN** the browser target remains functional without requiring the Android APK runtime
