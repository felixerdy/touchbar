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

  labelChanged(newLabel, obj) {
    let oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
    let newElementIndex = 0
    Object.values(oldConfig).map((e, i) => {
      if(e.name == obj.name) {
        newElementIndex = i
      }
    })
    let newElement = obj
    newElement.label = newLabel
    oldConfig[newElementIndex] = newElement
    atom.config.set('touchbar.buttons', JSON.stringify(oldConfig))
  }

  commandChanged(newCommand, obj) {
      let oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
      let newElementIndex = 0
      Object.values(oldConfig).map((e, i) => {
        if(e.name == obj.name) {
          newElementIndex = i
        }
      })
      let newElement = obj
      newElement.command = newCommand
      oldConfig[newElementIndex] = newElement
      atom.config.set('touchbar.buttons', JSON.stringify(oldConfig))
  }

  typeChanged(newType, obj) {
      let oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
      let newElementIndex = 0
      Object.values(oldConfig).map((e, i) => {
        if(e.name == obj.name) {
          newElementIndex = i
        }
      })
      let newElement = obj
      newElement.type = newType
      oldConfig[newElementIndex] = newElement
      atom.config.set('touchbar.buttons', JSON.stringify(oldConfig))
  }

  colorChanged(newColor, obj) {
      let oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
      let newElementIndex = 0
      Object.values(oldConfig).map((e, i) => {
        if(e.name == obj.name) {
          newElementIndex = i
        }
      })
      let newElement = obj
      newElement.color = newColor
      oldConfig[newElementIndex] = newElement
      atom.config.set('touchbar.buttons', JSON.stringify(oldConfig))
  }

  render() {
    if (JSON.parse(atom.config.get('touchbar.buttons'))) {
      return (
        <div>
          <p class="edit-heading">Current objects in TouchBar:</p>
          {
            Object.values(JSON.parse(atom.config.get('touchbar.buttons'))).map((obj) => {
              return <TouchBarItem
                name = {obj.name}
                type = {obj.type}
                label = {obj.label}
                command = {obj.command}
                color = {obj.color}
                onLabelChanged = {(newLabel) => this.labelChanged(newLabel, obj)}
                onCommandChanged = {(newCommand) => this.commandChanged(newCommand, obj)}
                onTypeChanged = {(newType) => this.typeChanged(newType, obj)}
                onColorChanged = {(newColor) => this.colorChanged(newColor, obj)}
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
