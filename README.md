# touchbar package

Add touchbar elements to atom

## Installation
`apm install touchbar`

## How to use
Touchbar will be loaded on startup.
Press `ctrl-alt-o` to toggle touchbar

## Current features:
- (Un)comment code
- Beautify code (you will need [atom-beautify](https://atom.io/packages/atom-beautify))
- Color picker
- Emoji Picker
- Toggle Command Palette

![touchbar screenshot](touch_screenshot.png)

Experimental emoji bar
![touchbar screenshot](touch_screenshot_2.png)

## How to change elements

Go to Settings -> Packages -> touchbar and update the `Elements` input. This input must be a valid json array of elements.

Example:

```js
[{ "name": "my-new-label", "type": "label", "label": "my 🔥 label", "color": "#FF9300" }, { "name": "spacer", "type": "spacer", "size": "small" }, { "name": "comment-button", "type": "button", "label": "//", "command": "editor:toggle-line-comments", "color": "#5712d6" }, { "name": "beautify-button", "type": "button", "label": "💅", "command": "atom-beautify:beautify-editor", "color": "#83FF8F" }, { "name": "color-picker", "type": "color-picker" }, { "type": "popover", "label": "😄", "elements": [{ "name": "emoji-scrubber", "type": "scrubber", "label": "😄", "items": "emojis" } ] }, { "name": "toggle-command-palette", "type": "button", "label": "🎨", "command": "command-palette:toggle" }]
```

## TODO:
- [ ] move all settings to seperate window [touchbar-edit-view.js](lib/touchbar-edit-view.js)
  - Add elements
  - Change commands (label, command, color)
  - Different Profiles
- [ ] show different objects on TouchBar depending on programming language (.md -> bold, italic...)
