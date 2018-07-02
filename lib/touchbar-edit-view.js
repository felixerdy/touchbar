/** @babel */
/** @jsx etch.dom */

import {Disposable} from 'atom'
import etch from 'etch'
const {app, BrowserWindow, TouchBar, nativeImage} = require('remote')
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

  iconChanged(newIcon, obj) {
      let oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
      let newElementIndex = 0
      Object.values(oldConfig).map((e, i) => {
        if(e.name == obj.name) {
          newElementIndex = i
        }
      })
      let newElement = obj
      newElement.icon = newIcon
      oldConfig[newElementIndex] = newElement
      atom.config.set('touchbar.buttons', JSON.stringify(oldConfig))
  }

  iconColorChanged(newIconColor, obj) {
      let oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
      let newElementIndex = 0
      Object.values(oldConfig).map((e, i) => {
        if(e.name == obj.name) {
          newElementIndex = i
        }
      })
      let newElement = obj
      newElement.iconColor = newIconColor
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
      if(newType === 'popover') {
        newElement.elements = []
      }
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

  remove(i) {
    const oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
    oldConfig.splice(i, 1)
    atom.config.set('touchbar.buttons', JSON.stringify(oldConfig))
    etch.update(this)
  }

  addNewConfig() {
    const oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
    const newConfig = oldConfig.concat({
      type: 'button',
      name: 'Config ' + Date.now()
    })
    atom.config.set('touchbar.buttons', JSON.stringify(newConfig))
    etch.update(this)
  }

  dragStarted(i) {
    this.moveSrc = i
  }

  dropped(moveDst) {
    if (this.moveSrc === undefined) { return }

    const oldConfig = JSON.parse(atom.config.get('touchbar.buttons'))
    oldConfig.splice(moveDst, 0, oldConfig.splice(this.moveSrc, 1)[0]);
    atom.config.set('touchbar.buttons', JSON.stringify(oldConfig))
    etch.update(this)

    this.moveSrc = undefined
  }

  render() {
    if (JSON.parse(atom.config.get('touchbar.buttons'))) {
      return (
        <div class="edit-panel">
          <h1>Current objects in Touchbar:</h1>
          <p><b>Info about icons:</b> Please take icon names from here: <a href="http://hetima.github.io/fucking_nsimage_syntax/">http://hetima.github.io/fucking_nsimage_syntax/</a>. TouchBar Icons (beginning at the second third of the page) look best!</p>
          <span class="edit-add icon icon-plus" onClick={() => this.addNewConfig()} value="Add new Object"/>
          {
            Object.values(JSON.parse(atom.config.get('touchbar.buttons'))).map((obj, i) => {
              return <TouchBarItem
                name = {obj.name}
                type = {obj.type}
                label = {obj.label}
                icon = {obj.icon}
                iconColor = {obj.iconColor}
                command = {obj.command}
                color = {obj.color}
                items = {obj.elements}
                onLabelChanged = {(newLabel) => this.labelChanged(newLabel, obj)}
                onIconChanged = {(newIcon) => this.iconChanged(newIcon, obj)}
                onIconColorChanged = {(newIconColor) => this.iconColorChanged(newIconColor, obj)}
                onCommandChanged = {(newCommand) => this.commandChanged(newCommand, obj)}
                onTypeChanged = {(newType) => this.typeChanged(newType, obj)}
                onColorChanged = {(newColor) => this.colorChanged(newColor, obj)}
                onRemove = {() => this.remove(i)}
                onDragStarted = {() => this.dragStarted(i)}
                onDropped = {() => this.dropped(i)}
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
