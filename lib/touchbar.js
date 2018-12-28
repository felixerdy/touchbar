'use babel';

import TouchbarEditView from './touchbar-edit-view';
import {CompositeDisposable} from 'atom';

const {app, BrowserWindow, TouchBar, Point, Range, nativeImage} = require('remote')

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
      default: '[{"type":"label","name":"Config 1524399902796","label":"Atom Touchbar","color":"#e0fcf0"},{"name":"comment-button","type":"button","label":"//","command":"editor:toggle-line-comments","color":"#5712d6","icon":"","iconColor":"default"},{"name":"color-picker","type":"color-picker"},{"name":"spacer","type":"button","size":"small","label":"","command":"tree-view:toggle","color":"#00716c","icon":"NSTouchBarSidebarTemplate","iconColor":"white"},{"name":"toggle-command-palette","type":"button","label":"🎨","command":"command-palette:toggle"},{"type":"popover","label":"😄","elements":[{"name":"emoji-scrubber","type":"scrubber","label":"😄","items":"emojis"}],"command":"","icon":""},{"name":"toggle-github","type":"button","label":"GitHub","color":"#919191","command":"github:toggle-github-tab"},{"name":"edit-touchbar","type":"button","label":"Touchbar","command":"touchbar:edit","color":"#6b2f4f"}]'
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
    let tbev = new TouchbarEditView(EditViewURI)
    atom.workspace.open(tbev)
  },

  arrayToTouchBarElements(input) {
    let elements = typeof input === 'string' ? JSON.parse(input) : input;
    let myTouchBarElements = []

    // map all touch bar elements from config and create equivalent objects
    elements.map((e, i) => {
      switch (e.type) {
        case "button":
          let iconColor = null
          if(e.iconColor === 'white' ) {
            iconColor = [-1, 0, 1]
          }
          if(e.iconColor === 'black' ) {
            iconColor = [-1, 1, 0]
          }
          // creating new button
          myTouchBarElements.push(new TouchBarButton({
            label: e.label,
            icon: e.icon ? e.icon.indexOf('/') == -1? nativeImage.createFromNamedImage(e.icon, iconColor) : nativeImage.createFromPath(e.icon) : null,
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

        case "button-insert":
          let insertIconColor = null
          if(e.iconColor === 'white' ) {
            insertIconColor = [-1, 0, 1]
          }
          if(e.iconColor === 'black' ) {
            insertIconColor = [-1, 1, 0]
          }
          // creating new button
          myTouchBarElements.push(new TouchBarButton({
            label: e.label,
            icon: e.icon ? e.icon.indexOf('/') == -1? nativeImage.createFromNamedImage(e.icon, insertIconColor) : nativeImage.createFromPath(e.icon) : null,
            click: () => atom.workspace.getActiveTextEditor().insertText(e.command),
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

        case "segment":
          myTouchBarElements.push(new TouchBarSegmentedControl({
            segments: e.elements.map(c => ({
              label: c.label,
              icon: c.icon ? c.icon.indexOf('/') == -1? nativeImage.createFromNamedImage(c.icon, c.iconColor) : nativeImage.createFromPath(c.icon) : null,
            }))
          }))
          break;

        case "popover":
          let popIconColor = null
          if(e.iconColor === 'white' ) {
            iconColor = [-1, 0, 1]
          }
          if(e.iconColor === 'black' ) {
            iconColor = [-1, 1, 0]
          }

          myTouchBarElements.push(new TouchBarPopover({
            label: e.label,
            icon: e.icon ? nativeImage.createFromNamedImage(e.icon, popIconColor) : null,
            items: this.arrayToTouchBarElements(e.elements)
          }))
          break;

        case "scrubber":
          myTouchBarElements.push(new TouchBarScrubber({
            items: emojis,
            select: (i) => {
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
