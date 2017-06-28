# touchbar package

### Only works with atom beta v1.19

Add touchbar elements to atom

## Installation
`apm install touchbar`

## How to use
Press `ctrl-alt-o` to toggle touchbar

## Current features:
- (Un)comment code
- Toggle Command Palette
- Color picker
- spacer
- Change items in `lib/config.json`
- customize items (commands, labels, colors)

![touchbar screenshot](touch_screenshot.png)

## TODO:
- [ ] move all settings to seperate window [touchbar-edit-view.js](lib/touchbar-edit-view.js)
  - Add elements
  - Change commands (label, command, color)
  - Different Profiles
- [ ] show different objects on TouchBar depending on programming language (.md -> bold, italic...)
