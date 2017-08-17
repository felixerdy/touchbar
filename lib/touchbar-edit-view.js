/** @babel */
/** @jsx etch.dom */

import {Disposable} from 'atom'
import etch from 'etch'
const {app, BrowserWindow, TouchBar} = require('remote')
const {TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSlider} = TouchBar

import TouchBarItem from './touchbar-item'

var touchBarItems = []

export default class TouchBarEditView {
  constructor({uri}) {
    this.uri = uri
    etch.initialize(this)
  }

  update() {}

  destroy() {
    return etch.destroy(this)
  }

  render() {
    if (BrowserWindow.getFocusedWindow()._touchBar) {
      return (
        <div>
          <b>Current objects in TouchBar:</b>
          {
            Object.values(atom.getCurrentWindow()._touchBar.items).map((obj) => {
              return <TouchBarItem
                type = {obj.type}
                label = {obj.label}
              />
            })
          }
        </div>
      )
    } else {
      return (
        <p>Please reload this window</p>
      )
    }
  }

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
