/** @babel */
/** @jsx etch.dom */

import {Disposable} from 'atom'
import etch from 'etch'
const {app, BrowserWindow, TouchBar} = require('remote')
const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSlider} = TouchBar

var touchBarItems = []


export default class TimecopView {
  constructor ({uri}) {
    this.uri = uri
    etch.initialize(this)
    if (atom.packages.getActivePackages().length > 0) {
      this.populateViews()
    } else {
      // Render on next tick so packages have been activated
      setImmediate(() => { this.populateViews() })
    }
  }

  update () {}

  destroy () {
    return etch.destroy(this)
  }

  render () {
    return (
      <div>
        <div>
          <div>
              <b>Current objects in TouchBar:</b>
              <ul ref="activeObjects"></ul>
          </div>
        </div>
      </div>
    )
  }

  populateViews() {
    if(BrowserWindow.getFocusedWindow()._touchBar !== null) {
      touchBarItems = Object.values(BrowserWindow.getFocusedWindow()._touchBar.items)
      console.log(touchBarItems)
      touchBarItems.map((obj) => {
        const li = document.createElement('div')

        const a = document.createElement('a')
        a.textContent = `${obj.type} ${obj.label}`
        li.appendChild(a)

        this.refs.activeObjects.appendChild(li)
      })
    }
  }


  serialize () {
    return {
      deserializer: this.constructor.name,
      uri: this.getURI()
    }
  }

  getURI () {
    return this.uri
  }

  getTitle () {
    return 'Touchbar Editor'
  }

  getIconName () {
    return 'dashboard'
  }

  onDidChangeTitle () {
    return new Disposable(function () {})
  }

  onDidChangeModified () {
    return new Disposable(function () {})
  }
}
