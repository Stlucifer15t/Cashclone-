# 🏦 CashClone - International Multi-Currency Banking App

A modern, full-featured international banking and fintech app built for high performance and smooth interactive workflows. Designed with a luxury dark aesthetic inspired by Cash App and Revolut, featuring instant cross-border bank switching, multi-currency accounts, virtual cards, interactive payments, and native Android APK build readiness.

---

## 🌟 Key Features

### 1. 🌍 Instant Multi-Country Bank Switcher
Switch your active bank account in real-time from the Home dashboard:
* 🇺🇸 **USA Bank (Chase Federal Bank)** - USD ($) • Routing Number (ABA) & Account No.
* 🇨🇦 **Canada Bank (Royal Bank of Canada / RBC)** - CAD (CA$) • Transit & Institution No.
* 🇩🇪 **Germany Bank (Deutsche Bundesbank / N26)** - EUR (€) • Standard European IBAN & BIC
* 🇬🇧 **United Kingdom (Barclays London)** - GBP (£) • UK 6-digit Sort Code & Account No.
* 🇳🇬 **Nigeria Bank (Apex Bank of Nigeria)** - NGN (₦) • 10-digit NUBAN Account & CBN Code
* 🇯🇵 **Japan Bank (Sumitomo Tokyo Bank)** - JPY (¥) • Japanese Branch Code & Account No.

Each bank holds its own dedicated balance, local account credentials, and customized luxury debit card.

### 2. 💳 Interactive Virtual Card
* **EMV Chip & Contactless Wave graphics** with regional bank branding and country flags.
* **Sensitive Details Toggle**: One-tap "Show Details / Hide Details" to reveal masked card number (`•••• 9012` ⇄ `4532 8920 1938 9012`) and CVV.
* **Card Freeze / Unfreeze**: Instantly freeze your card to disable transactions, updating the card graphic with a security lock overlay.
* **One-Tap Copy**: Tap the card number to copy it to clipboard with instant toast confirmation.

### 3. 💸 100% Interactive Actions & Flows
Every button across the app performs real, rewarding operations:
* **Send Payment**: Transfer funds with live balance validation, recipient tag (`$cashtag`), preset quick-amount chips ($10, $25, $50, $100, MAX), category selection, and note.
* **Receive & Request**: View your personal QR code, shareable payment link, and use the **"Simulate Incoming Payment"** tool to test receiving money from peers during presentations.
* **Deposit / Add Cash**: Add funds directly into your active account via Apple/Google Pay, linked debit card, or wire transfer.
* **Inter-Bank Exchange**: Transfer and convert funds between any of your international accounts (e.g., USD to EUR or CAD to NGN) with live exchange rates and zero hidden fees.
* **Transaction Details Receipt**: Tap any transaction to inspect a digital receipt with timestamp, category, reference ID, and one-tap receipt sharing.

### 4. 📊 Real-Time Analytics & Ledger
* Dynamic monthly spending calculation and visual percentage budget progress bar.
* Filter activity by **All**, **Received**, **Sent**, **Inter-Bank Transfers**, or **Active Bank Only**.
* Real-time search bar filtering by recipient, note, bank name, or amount.
* Export statement summary tool.

### 5. ⚙️ Profile & Demo Simulator
* Edit legal name, `$cashtag`, email, phone, and upload/select avatar image.
* Directory of all linked international accounts with one-tap credential copy.
* Biometric login toggle and configurable daily transfer limit.
* **School Project Presentation Controls**: "Inject +$1,000 Demo Grant" and "Reset Demo Data" buttons to easily reset or demo transactions in real-time.

---

## 📱 How to Build the Android APK

This repository is configured as an **APK-ready bare/prebuild Android native project** with the complete `android/` directory (Gradle scripts, AndroidManifest.xml, and Kotlin code).

### Prerequisites for building APK:
1. Java Development Kit (JDK 17 or higher)
2. Android SDK (API Level 34/35) or Android Studio

### Command-line APK Build:
```bash
# Build Debug APK (installs on any Android phone without signing key):
npm run build:apk:debug
# The generated APK will be at:
# android/app/build/outputs/apk/debug/app-debug.apk

# Build Release APK:
npm run build:apk
# The generated APK will be at:
# android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Alternatively, open in Android Studio:
1. Open Android Studio.
2. Select **Open an Existing Project** and navigate to the `android/` folder of this repository.
3. Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## 💻 Running the Web Preview Locally

```bash
# Install dependencies
npm install

# Start the dev server in offline-tolerant mode
npm run dev

# Or start directly with the web browser target
npm run web
```

---

## 🛠️ Tech Stack
* **Framework**: React Native 0.79 + Expo SDK 53
* **Routing**: Expo Router v5 (File-based navigation)
* **Icons**: `@expo/vector-icons` (Ionicons)
* **Styling**: React Native StyleSheet with custom dark luxury fintech design system
* **Build Tooling**: Android Gradle Plugin, Metro Bundler, TypeScript strict mode
