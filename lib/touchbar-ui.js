'use babel';

const { TouchBar, nativeImage } = require('remote')
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
} = TouchBar;

const emojis = require('./emoji.json');
const colorRegEx = new RegExp('#[A-Fa-f0-9]{6}');

export default class TouchbarUi {
  constructor() {
    this.itemIds = [];
  }

  dispose() {
    this.removeItems();
  }

  attachRegistry(registry) {
    this.registry = registry;

    this.updateItems(atom.config.get('touchbar.buttons'));
  }

  updateItems(serializedItems) {
    const items = this.createTouchBarItems(serializedItems);
    this.renderItems(items);
  }

  renderItems(items) {
    this.removeItems();

    for (let item of items) {
      const id = this.registry.addItem(item, 100);
      this.itemIds.push(id);
    }
  }

  removeItems() {
    for (let itemId of this.itemIds) {
      this.registry.removeItem(itemId);
    }
  }

  createTouchBarItems(input) {
    const elements = typeof input === 'string' ? JSON.parse(input) : input;

    // map all touch bar elements from config and create equivalent objects
    return elements.map(e => this.createTouchBarElement(e));
  }

  createTouchBarElement(e) {
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
        return new TouchBarButton({
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
        });
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
        return new TouchBarButton({
          label: e.label,
          icon: e.icon ? e.icon.indexOf('/') == -1? nativeImage.createFromNamedImage(e.icon, insertIconColor) : nativeImage.createFromPath(e.icon) : null,
          click: () => atom.workspace.getActiveTextEditor().insertText(e.command),
          // apply selected color only when there is one specified in config, otherwise use default color
          backgroundColor: (e.color
            ? e.color
            : null)
        });
        break;

      case "label":
        // creating new label
        return new TouchBarLabel({label: e.label, textColor: e.color});
        break;

      case "color-picker":
        // breating new color picker
        return new TouchBarColorPicker({

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
        });
        break;

      case "spacer":
        // breating new color picker
        return new TouchBarSpacer({size: e.size});
        break;

      case "group":
        return new TouchBarGroup({
          items: this.createTouchBarItems(e.elements)
        });
        break;

      case "segment":
        return new TouchBarSegmentedControl({
          segments: e.elements.map(c => ({
            label: c.label,
            icon: c.icon ? c.icon.indexOf('/') == -1? nativeImage.createFromNamedImage(c.icon, c.iconColor) : nativeImage.createFromPath(c.icon) : null,
          }))
        });
        break;

      case "popover":
        let popIconColor = null
        if(e.iconColor === 'white' ) {
          iconColor = [-1, 0, 1]
        }
        if(e.iconColor === 'black' ) {
          iconColor = [-1, 1, 0]
        }

        return new TouchBarPopover({
          label: e.label,
          icon: e.icon ? nativeImage.createFromNamedImage(e.icon, popIconColor) : null,
          items: this.createTouchBarItems(e.elements)
        });
        break;

      case "emoji":
        return new TouchBarScrubber({
          items: emojis.map(e => this.createTouchBarElement(e)),
          select: (i) => {
            atom.workspace.getActiveTextEditor().insertText(emojis[i].label)
          },
          selectedStyle: "outline",
          overlayStyle: "outline",
          continuous: false
        });
        break;
    }
  }
}
