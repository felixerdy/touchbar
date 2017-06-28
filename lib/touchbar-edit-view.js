/** @babel */
/** @jsx etch.dom */

import {Disposable} from 'atom'
import etch from 'etch'
const {app, BrowserWindow, TouchBar} = require('remote')
const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSlider} = TouchBar

var touchBarItems = []

export default class TouchBarEditView {
  constructor({uri}) {
    this.uri = uri
    etch.initialize(this)
    if (atom.packages.getActivePackages().length > 0) {
      this.populateViews()
    } else {
      // Render on next tick so packages have been activated
      setImmediate(() => {
        this.populateViews()
      })
    }
  }

  update() {}

  destroy() {
    return etch.destroy(this)
  }

  render() {
    return (
      <div>
        <b>Current objects in TouchBar:</b>
        <ul ref="activeObjects"></ul>
        <label>Element:
          <select id="selectTouchBarElements">
            <option>Label</option>
            <option>Button</option>
            <option>Color Picker</option>
            <option>Spacer</option>
          </select>
        </label>
        <button onclick={() => this.addElement()}>+</button>
      </div>
    )
  }

  populateViews() {
    if (BrowserWindow.getFocusedWindow()._touchBar) {
      touchBarItems = Object.values(BrowserWindow.getFocusedWindow()._touchBar.items)
      touchBarItems.map((obj) => {
        const li = document.createElement('div')

        const p = document.createElement('p')
        p.textContent = `${obj.type}`
        li.appendChild(p)

        this.refs.activeObjects.appendChild(li)
      })
    }
  }

  addElement() {
    var select = document.getElementById("selectTouchBarElements");
    var chosenElement = select.options[select.selectedIndex].text;
    console.log(`User wants to add ${chosenElement}`)
  }

  addButton(label, command, color) {}

  serialize() {
    return {deserializer: this.constructor.name, uri: this.getURI()}
  }

  getURI() {
    return this.uri
  }

  getTitle() {
    return 'Touchbar Editor'
  }

  getIconName() {
    return 'dashboard'
  }

  onDidChangeTitle() {
    return new Disposable(function() {})
  }

  onDidChangeModified() {
    return new Disposable(function() {})
  }
}
