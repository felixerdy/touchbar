# touchbar package

Add touchbar elements to atom

## Installation
`apm install touchbar`

## How to use
Touchbar will be loaded on startup.
Press `ctrl-alt-o` to toggle touchbar

## Current shipped features:
- Labels
- Buttons
- Color picker
- Emoji Picker
- Edit Touchbar

![touchbar screenshot](touch_screenshot.png)

Experimental emoji bar
![touchbar screenshot](touch_screenshot_2.png)

## How to change elements

There is now a basic editing function build in. Press the `Edit Touchbar` button on your Touchbar or go to `Packages -> touchbar -> Edit Touchbar`. You can choose the type of your element as well as the label, command and color.
Thanks to [@fand](https://github.com/fand) you can also add / remove and sort items in the edit view!

![touchbar edit screenshot](touchbar-edit.png)

#### More advanced way:

Go to `Settings -> Packages -> touchbar` and update the `Elements` input. This input must be a valid json array of elements.

Example:

```js
[{"type":"label","name":"Config 1524399902796","label":"Atom Touchbar","color":"#e0fcf0"},{"name":"comment-button","type":"button","label":"//","command":"editor:toggle-line-comments","color":"#5712d6"},{"name":"color-picker","type":"color-picker"},{"name":"spacer","type":"button","size":"small","label":"Tree","command":"tree-view:toggle","color":"#00716c"},{"name":"toggle-command-palette","type":"button","label":"🎨","command":"command-palette:toggle"},{"type":"popover","label":"😄","elements":[{"name":"emoji-scrubber","type":"scrubber","label":"😄","items":"emojis"}],"command":""},{"name":"toggle-github","type":"button","label":"GitHub","color":"#919191","command":"github:toggle-github-tab"},{"name":"edit-touchbar","type":"button","label":"Touchbar","command":"touchbar:edit","color":"#6b2f4f"}]
```
