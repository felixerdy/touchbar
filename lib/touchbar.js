'use babel';

import TouchbarView from './touchbar-edit-view';
import { CompositeDisposable } from 'atom';

const {app, BrowserWindow, TouchBar} = require('remote')

const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSlider} = TouchBar

const EditViewURI = 'atom://touchbar-edit-view'



let touchBarEnabled = false;

let globalTouchBar = undefined;


export default {

  touchbarView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    touchBarButtonOne: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          default: 'editor:toggle-line-comments'
        },
        label: {
          type: 'string',
          default: '//'
        },
        color: {
          type: 'color',
          default: 'darkgrey'
        }
      }
    },
    touchBarButtonTwo: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          default: 'command-palette:toggle'
        },
        label: {
          type: 'string',
          default: '🎨'
        },
        color: {
          type: 'color',
          default: 'darkgrey'
        }
      }
    }
  },

  activate(state) {
    this.touchbarView = new TouchbarView(EditViewURI);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    const buttonOne = new TouchBarButton({
      label: atom.config.get('touchbar.touchBarButtonOne.label'),
      click: () => {
        editorElement = atom.views.getView(atom.workspace.getActiveTextEditor())
        atom.commands.dispatch(editorElement, atom.config.get('touchbar.touchBarButtonOne.command'))
      }
    })

    const buttonTwo = new TouchBarButton({
      label: atom.config.get('touchbar.touchBarButtonTwo.label'),
      click: () => {
        editorElement = atom.views.getView(atom.workspace.getActiveTextEditor())
        atom.commands.dispatch(editorElement, atom.config.get('touchbar.touchBarButtonTwo.command'))
      }
    })

    atom.config.observe('touchbar.touchBarButtonTwo.label', (newValue) => {
      buttonTwo.label = newValue
    })

    atom.config.observe('touchbar.touchBarButtonOne.label', (newValue) => {
      buttonOne.label = newValue
    })

    atom.config.observe('touchbar.touchBarButtonTwo.color', (newValue) => {
      buttonTwo.backgroundColor = newValue.toHexString()
    })

    atom.config.observe('touchbar.touchBarButtonOne.color', (newValue) => {
      buttonOne.backgroundColor = newValue.toHexString()
    })

    const touchBar = new TouchBar([
      buttonOne,
      buttonTwo
    ])

    globalTouchBar = touchBar

    BrowserWindow.getFocusedWindow().setTouchBar(touchBar)

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'touchbar:toggle': () => this.toggle()
    }));

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
    return {
      touchbarViewState: this.touchbarView.serialize()
    };
  },

  toggle() {
    BrowserWindow.getFocusedWindow().setTouchBar(touchBarEnabled ? null : globalTouchBar)
    touchBarEnabled = !touchBarEnabled
  },

  openEditWindow() {
    let tbev = new TouchbarView(EditViewURI)
    atom.workspace.open(tbev)
  }

};
