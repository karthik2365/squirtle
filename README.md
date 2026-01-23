<div align="center">

# 🐢 Squirtle

### *Build habits. Track streaks. Level up your life.*

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<img src="assets/images/squirtle2.png" alt="Squirtle Logo" width="200"/>

*A beautiful habit tracking app inspired by GitHub's contribution graph*

</div>

---

## ✨ Features

🔥 **Streak Tracking** — Build momentum with daily streaks and never break the chain

📊 **GitHub-Style Heatmap** — Visualize your progress with a beautiful contribution-style calendar

🎯 **Multiple Tasks** — Track multiple habits simultaneously with custom colors

📱 **Cross-Platform** — Works on iOS, Android, and Web

🌙 **Dark Mode** — Eye-friendly dark theme that looks stunning

💾 **Local Storage** — Your data stays on your device, private and secure

📈 **Statistics** — View detailed stats including completion rates and longest streaks

## 📸 Screenshots

<div align="center">
<table>
  <tr>
    <td align="center"><strong>Dashboard</strong></td>
    <td align="center"><strong>Task Details</strong></td>
    <td align="center"><strong>Heatmap</strong></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/dashboard.png" width="200"/></td>
    <td><img src="docs/screenshots/task-detail.png" width="200"/></td>
    <td><img src="docs/screenshots/heatmap.png" width="200"/></td>
  </tr>
</table>
</div>

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your phone

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/squirtle.git
cd squirtle

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

Scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

Or press:
- `i` — Open in iOS Simulator
- `a` — Open in Android Emulator
- `w` — Open in Web Browser

## 🏗️ Project Structure

```
squirtle/
├── app/                    # App screens (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Dashboard
│   │   └── explore.tsx    # Explore/Stats
│   ├── task/[id].tsx      # Task detail screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── AddTaskModal.tsx   # Task creation modal
│   ├── CalendarView.tsx   # Calendar component
│   ├── Heatmap.tsx        # GitHub-style heatmap
│   ├── StatsCard.tsx      # Statistics display
│   └── TaskCard.tsx       # Task list item
├── context/               # React Context providers
│   └── TaskContext.tsx    # Global task state
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
│   ├── date.ts           # Date helpers
│   ├── stats.ts          # Statistics calculations
│   └── storage.ts        # AsyncStorage wrapper
└── assets/               # Images and fonts
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile framework |
| **Expo** | Development platform & tooling |
| **TypeScript** | Type safety & better DX |
| **Expo Router** | File-based navigation |
| **AsyncStorage** | Local data persistence |
| **Reanimated** | Smooth animations |

## 🎨 Color Palette

The app features a GitHub-inspired heatmap with red intensity levels:

| Level | Color | Meaning |
|-------|-------|---------|
| 0 | `#1A1A1A` | No activity |
| 1 | `#5C1A1A` | Low activity |
| 2 | `#8B2525` | Medium activity |
| 3 | `#C53030` | High activity |
| 4 | `#F56565` | Maximum activity |

## 📱 Available Scripts

```bash
# Start development server
npm start

# Start with cache cleared
npx expo start --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web

# Lint code
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [GitHub's contribution graph](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile)
- Built with [Expo](https://expo.dev/)
- Icons by [Ionicons](https://ionic.io/ionicons)

---

<div align="center">

**Made with 💙 and React Native**

[⬆ Back to top](#-squirtle)

</div>
