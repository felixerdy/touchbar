'use babel';

import TouchbarEditView from './touchbar-edit-view';
import {CompositeDisposable} from 'atom';
import TouchbarUi from './touchbar-ui';

const EditViewURI = 'atom://touchbar-edit-view'

export default {
  modalPanel : null,
  subscriptions : null,
  touchbarUi: null,

  config : {
    buttons: {
      title: 'Elements',
      description: 'Configure your toutchbar elements here',
      type: 'string',
      default: JSON.stringify([
        {type:"label",name:"Config 1524399902796",label:"Atom Touchbar",color:"#e0fcf0"},
        {name:"comment-button",type:"button",label:"//",command:"editor:toggle-line-comments",color:"#5712d6",icon:"",iconColor:"default"},
        {name:"color-picker",type:"color-picker"},
        {name:"spacer",type:"button",size:"small",label:"",command:"tree-view:toggle",color:"#00716c",icon:"NSTouchBarSidebarTemplate",iconColor:"white"},
        {name:"toggle-command-palette",type:"button",label:"🎨",command:"command-palette:toggle"},
        {type:"popover",label:"😄",elements:[{name:"emoji-scrubber",type:"scrubber",label:"😄",items:"emojis"}],command:"",icon:""},
        {name:"toggle-github",type:"button",label:"GitHub",color:"#919191",command:"github:toggle-github-tab"},
        {name:"edit-touchbar",type:"button",label:"Touchbar",command:"touchbar:edit",color:"#6b2f4f"}
      ])
    }
  },

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.touchbarUi = new TouchbarUi();

    this.subscriptions.add(atom.config.onDidChange('touchbar.buttons', ({newValue, oldValue}) => {
      this.touchbarUi.updateItems(newValue);
    }));

    // Register command that opens the edit window
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'touchbar:edit': () => this.openEditWindow()
    }));
  },

  deactivate() {
    this.touchbarUi.dispose();
    this.modalPanel.destroy();
    this.subscriptions.dispose();
  },

  serialize() {
  },

  consumeTouchBar(touchbarRegistry) {
    this.touchbarUi.attachRegistry(touchbarRegistry);
  },

  openEditWindow() {
    let tbev = new TouchbarEditView(EditViewURI)
    atom.workspace.open(tbev)
  }
};
