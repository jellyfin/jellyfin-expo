<h1 align="center">Jellyfin Mobile</h1>
<h3 align="center">Part of the <a href="https://jellyfin.org">Jellyfin Project</a></h3>

---

<p align="center">
<img alt="Logo banner" src="https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/branding/SVG/banner-logo-solid.svg?sanitize=true"/>
<br/><br/>
<a href="https://github.com/jellyfin/jellyfin-expo/blob/master/LICENSE"><img alt="MPL-2.0 license" src="https://img.shields.io/github/license/jellyfin/jellyfin-expo"></a>
<a href="https://github.com/jellyfin/jellyfin-expo/releases"><img alt="Current Release" src="https://img.shields.io/github/release/jellyfin/jellyfin-expo.svg"/></a>
<a href="https://translate.jellyfin.org/projects/jellyfin/jellyfin-expo/?utm_source=widget">
<img alt="Translation Status" src="https://translate.jellyfin.org/widgets/jellyfin/-/jellyfin-expo/svg-badge.svg"/>
</a>
<br/>
<a href="https://opencollective.com/jellyfin"><img alt="Donate" src="https://img.shields.io/opencollective/all/jellyfin.svg?label=backers"/></a>
<a href="https://features.jellyfin.org"><img alt="Feature Requests" src="https://img.shields.io/badge/fider-vote%20on%20features-success.svg"/></a>
<a href="https://forum.jellyfin.org"><img alt="Discuss on our Forum" src="https://img.shields.io/discourse/https/forum.jellyfin.org/users.svg"/></a>
<a href="https://matrix.to/#/+jellyfin:matrix.org"><img alt="Chat on Matrix" src="https://img.shields.io/matrix/jellyfin:matrix.org.svg?logo=matrix"/></a>
<a href="https://www.reddit.com/r/jellyfin"><img alt="Join our Subreddit" src="https://img.shields.io/badge/reddit-r%2Fjellyfin-%23FF5700.svg"/></a>
<br/><br/>
<a href="https://apps.apple.com/us/app/jellyfin-mobile/id1480192618?mt=8"><img width="135" src="https://linkmaker.itunes.apple.com/en-us/badge-lrg.svg?releaseDate=2020-02-09&kind=iossoftware&bubble=ios_apps" alt="Download on the App Store"/></a>
</p>

Jellyfin Mobile is a mobile app built with [Expo](https://expo.io/) primarily targeting iOS devices. We welcome all contributions and pull requests! If you have a larger feature in mind please open an issue so we can discuss the implementation before you start. We use [GitHub Projects](https://github.com/jellyfin/jellyfin-expo/projects) as a general roadmap for releases.

## Translations

Translations can be improved very easily from our [Weblate](https://translate.jellyfin.org/projects/jellyfin/jellyfin-expo/) instance. Look through the following graphic to see if your native language could use some work!

<a href="https://translate.jellyfin.org/engage/jellyfin/?utm_source=widget">
<img alt="Detailed Translation Status" src="https://translate.jellyfin.org/widgets/jellyfin/-/jellyfin-expo/multi-auto.svg"/>
</a>

## Build Process

### Getting Started

1. Clone or download this repository.
   ```sh
   git clone https://github.com/jellyfin/jellyfin-expo.git
   cd jellyfin-expo
   ```
2. Install build dependencies using yarn in the project directory.
   ```sh
   yarn install
   ```
3. Start the build tools.
   ```sh
   yarn start
   ```
4. Follow the directions in the terminal or browser window to open on a device or emulator.

## FAQ

### What is the difference between this and other Jellyfin app projects?
* This app (Jellyfin Mobile) is a web wrapper based on Expo with some native enhancements. It is available on the [App Store](https://apps.apple.com/us/app/jellyfin-mobile/id1480192618?mt=8) for iPhone and iPad.
* [Jellyfin Player iOS](https://github.com/jellyfin/jellyfin-client-ios) is a newer effort to create a media playback app in native Swift. It is a work in progress and currently only supports media playback.
* [Jellyfin React Client](https://github.com/jellyfin-archive/jellyfin-react-client) is an early project to create a single multiplatform app based on React Native. This project has been archived as we have changed direction to utilize native web wrappers on most platforms.
