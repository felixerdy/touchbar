'use babel';

import TouchbarView from './touchbar-view';
import { CompositeDisposable } from 'atom';

const {app, BrowserWindow, TouchBar} = require('remote')

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSlider} = TouchBar

// Spin button
const comment = new TouchBarButton({
  label: '//',
  click: () => {
    console.log("toggle comment")
    editorElement = atom.views.getView(atom.workspace.getActiveTextEditor())
    atom.commands.dispatch(editorElement, 'editor:toggle-line-comments')
  }
})

const touchBar = new TouchBar([
  comment
])

let touchBarEnabled = false;


export default {

  touchbarView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    touchBarItems: {
      type: 'array',
      default: [10, 2, 3],
      items: {
        type: 'integer',
        minimum: 1.5,
        maximum: 11.5
      }
    }
  },

  activate(state) {
    this.touchbarView = new TouchbarView(state.touchbarViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.touchbarView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    BrowserWindow.getFocusedWindow().setTouchBar(touchBar)

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'touchbar:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    BrowserWindow.getFocusedWindow().setTouchBar(null)
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.touchbarView.destroy();
  },

  serialize() {
    return {
      touchbarViewState: this.touchbarView.serialize()
    };
  },

  toggle() {
    BrowserWindow.getFocusedWindow().setTouchBar(touchBarEnabled ? null : touchBar)
    touchBarEnabled = !touchBarEnabled
  }

};
