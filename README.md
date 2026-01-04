# DukaScan - Scan. Record. Manage.

A simple, clean inventory management app that scans barcodes and saves product details to user-owned Google Sheets.

## Features

- 📱 **Barcode Scanning** - Scan EAN/UPC barcodes using your device camera
- 📝 **Product Management** - Add product name, description, price, and quantity
- 📊 **Google Sheets Integration** - Save directly to your own Google Sheet
- ⚙️ **Settings** - Configure and test your Google Apps Script connection
- 🔒 **Privacy First** - Your data stays in your own Google Sheet, no external servers

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google Apps Script

1. Create a new Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete the default code and paste the content from `google-apps-script.js` (in this directory)
4. Deploy as Web App:
   - Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
5. Copy the Web App URL

### 3. Run the App

```bash
npx expo start
```

- Press `a` for Android emulator
- Press `i` for iOS simulator  
- Scan QR code with Expo Go app for physical device

### 4. Configure Settings

1. Open the app
2. Navigate to **Settings** tab
3. Paste your Google Apps Script URL
4. Tap **Save Settings**
5. (Optional) Tap **Test Connection**

### 5. Start Scanning

1. Go to **Scan** tab
2. Grant camera permission when prompted
3. Scan a barcode
4. Fill in product details
5. Tap **Save Product**
6. Check your Google Sheet!

## Building for Production

### Android

```bash
# Build APK
npx eas build --platform android --profile preview

# Build AAB for Play Store
npx eas build --platform android --profile production
```

### iOS

```bash
npx eas build --platform ios --profile production
```

> **Note:** You'll need to set up EAS Build and configure `eas.json`. Run `npx eas build:configure` first.

## OTA Updates

DukaScan supports Over-The-Air (OTA) updates using Expo Updates. This allows you to push JS/UI changes without resubmitting to app stores.

```bash
# Publish an update
npx eas update --branch production --message "Fixed bug in form validation"
```

> **Important:** Native changes (like permission updates) require a new build.

## Project Structure

```
DukaScan/
├── App.tsx                 # Main app entry point
├── theme.ts                # Color and typography theme
├── navigation/
│   └── AppNavigator.tsx    # Navigation setup (tabs + stack)
├── screens/
│   ├── ScannerScreen.tsx   # Barcode scanning screen
│   ├── ProductFormScreen.tsx # Product details form
│   └── SettingsScreen.tsx  # Settings configuration
├── services/
│   ├── googleSheets.ts     # Google Sheets API integration
│   └── storage.ts          # AsyncStorage wrapper
├── utils/
│   └── validation.ts       # Form and URL validation
└── types/
    └── index.ts            # TypeScript type definitions
```

## Tech Stack

- **Framework:** React Native + Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (Bottom Tabs + Stack)
- **Barcode Scanner:** expo-camera (formerly expo-barcode-scanner)
- **Storage:** AsyncStorage
- **Backend:** Google Apps Script (user-owned)

## Requirements

- Node.js 18+ 
- Expo CLI
- Android Studio (for Android emulation)
- Xcode (for iOS development, macOS only)

## Support

For issues or questions, please check the implementation plan and walkthrough documents in the project.

## License

MIT License - Feel free to use this app for your business or personal projects.
