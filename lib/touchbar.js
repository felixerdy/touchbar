'use babel';

import TouchbarEditView from './touchbar-edit-view';
import {CompositeDisposable} from 'atom';

const {app, BrowserWindow, TouchBar, Point, Range} = require('remote')

const {
  TouchBarButton,
  TouchBarColorPicker,
  TouchBarGroup,
  TouchBarLabel,
  TouchBarPopover,
  TouchBarScrubber,
  TouchBarSegmentedControl,
  TouchBarSlider,
  TouchBarSpacer
} = TouchBar

const EditViewURI = 'atom://touchbar-edit-view'

const emojis = require('./emoji.json')

let touchBarEnabled = false;

let globalTouchBar = undefined;

const colorRegEx = new RegExp('#[A-Fa-f0-9]{6}')

export default {

  touchbarView : null,
  modalPanel : null,
  subscriptions : null,

  config : {
    buttons: {
      title: 'Elements',
      description: 'Configure your toutchbar elements here',
      type: 'string',
      default: '[{ "name": "my-new-label", "type": "label", "label": "my 🔥 label", "color": "#FF9300" }, { "name": "spacer", "type": "spacer", "size": "small" }, { "name": "comment-button", "type": "button", "label": "//", "command": "editor:toggle-line-comments", "color": "#5712d6" }, { "name": "beautify-button", "type": "button", "label": "💅", "command": "atom-beautify:beautify-editor", "color": "#83FF8F" }, { "name": "color-picker", "type": "color-picker" }, { "type": "popover", "label": "😄", "elements": [{ "name": "emoji-scrubber", "type": "scrubber", "label": "😄", "items": "emojis" } ] }, { "name": "toggle-command-palette", "type": "button", "label": "🎨", "command": "command-palette:toggle" }, {"name":"edit-touchbar","type":"button","label":"Edit Touchbar","command":"touchbar:edit","color":"#83FF8F"}, {"name":"toggle-github","type":"button","label":"GitHub","color":"#0033cc","command":"github:toggle-github-tab"}]'
    }
  },

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    const touchBar = this.arrayToTouchBarElements(atom.config.get('touchbar.buttons'));

    globalTouchBar = touchBar

    atom.getCurrentWindow().setTouchBar(touchBar)

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'touchbar:toggle': () => this.toggle()
    }));

    atom.config.onDidChange('touchbar.buttons', ({newValue, oldValue}) => {
      const touchBar = this.arrayToTouchBarElements(newValue);
      globalTouchBar = touchBar
      atom.getCurrentWindow().setTouchBar(touchBar)
    })

    // Register command that opens the edit window
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'touchbar:edit': () => this.openEditWindow()
    }));
  },

  deactivate() {
    BrowserWindow.getFocusedWindow().setTouchBar(null)
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.touchbarView.destroy();
  },

  serialize() {
    // return {touchbarViewState: this.touchbarView.serialize()};
  },

  toggle() {
    BrowserWindow.getFocusedWindow().setTouchBar(touchBarEnabled
      ? null
      : globalTouchBar)
    touchBarEnabled = !touchBarEnabled
  },

  openEditWindow() {
    if(this.tbev == null) {
      this.tbev = new TouchbarEditView(EditViewURI)
    }
    this.tbev.toggle()
  },

  arrayToTouchBarElements(input) {
    let elements = typeof input === 'string' ? JSON.parse(input) : input;
    let myTouchBarElements = []

    // map all touch bar elements from config and create equivalent objects
    elements.map((e, i) => {
      switch (e.type) {
        case "button":
          // creating new button
          myTouchBarElements.push(new TouchBarButton({
            label: e.label,
            click: () => {
              var activeElement = (document.activeElement === document.body) ? atom.views.getView(atom.workspace) : document.activeElement
              atom.commands.dispatch(activeElement, e.command);
            },
            // apply selected color only when there is one specified in config, otherwise use default color
            backgroundColor: (e.color
              ? e.color
              : null)
          }))
          break;

        case "label":
          // creating new label
          myTouchBarElements.push(new TouchBarLabel({label: e.label, textColor: e.color}))
          break;

        case "color-picker":
          // breating new color picker
          myTouchBarElements.push(new TouchBarColorPicker({

            change: (color) => {
              // inserts the current selected color
              // get current cursor position
              var cbp = atom.workspace.getActiveTextEditor().getCursorBufferPosition()
              // check if cursor is at beginning of color hex string
              // otherwise insert 7 spaces that will be replaced with hex string
              var nextText = atom.workspace.getActiveTextEditor().getTextInBufferRange([[cbp.row, cbp.column], [cbp.row, cbp.column+7]])
              if(!colorRegEx.test(nextText)) {
                atom.workspace.getActiveTextEditor().insertText('       ')
              }

              // insert color string into next 7 range
              atom.workspace.getActiveTextEditor().setTextInBufferRange([[cbp.row, cbp.column], [cbp.row, cbp.column+7]], color)
              // set cursor position to begin of color hex code
              atom.workspace.getActiveTextEditor().setCursorBufferPosition(cbp)
            }
          }))
          break;

        case "spacer":
          // breating new color picker
          myTouchBarElements.push(new TouchBarSpacer({size: e.size}))
          break;

        case "group":
          myTouchBarElements.push(new TouchBarGroup({
            items: this.arrayToTouchBarElements(e.elements)
          }))
          break;

        case "popover":
          myTouchBarElements.push(new TouchBarPopover({
            label: e.label,
            items: this.arrayToTouchBarElements(e.elements)
          }))
          break;

        case "scrubber":
          myTouchBarElements.push(new TouchBarScrubber({
            items: emojis,
            highlight: (i) => {
              atom.workspace.getActiveTextEditor().insertText(emojis[i].label)
            },
            selectedStyle: "outline",
            overlayStyle: "outline",
            continuous: false
          }))
          break;

      }
    })

    return new TouchBar(myTouchBarElements)
  }
};
