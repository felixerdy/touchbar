/** @babel */
/** @jsx etch.dom */

import {Disposable} from 'atom'
import etch from 'etch'

const types = [
  {
    value: "button",
    label: "Button"
  },
  {
    value: "button-insert",
    label: "Button Text Insert"
  },
  {
    value: "label",
    label: "Label"
  },
  {
    value: "spacer",
    label: "Spacer"
  },
  {
    value: "color-picker",
    label: "Color Picker"
  },
  {
    value: "emoji",
    label: "Emoji Scrubber"
  },
  {
    value: "group",
    label: "Group"
  },
  {
    value: "popover",
    label: "Popover"
  },
  {
    value: "segment",
    label: "Segment"
  }
]

export default class TouchBarItem {
  constructor(props) {
    this.props = props
    etch.initialize(this)

    console.log(this.props.items === undefined)
  }

  update(props) {
    this.props = props
    return etch.update(this)
  }

  onLabelChanged() {
    this.props.onLabelChanged(document.getElementById(`${this.props.name}input_label`).value)
  }

  onIconChanged() {
    this.props.onIconChanged(document.getElementById(`${this.props.name}input_icon`).value)
  }

  onIconColorChanged() {
    this.props.onIconColorChanged(document.getElementById(`${this.props.name}_select_icon_color`).value)
  }

  onTypeChanged() {
    this.props.onTypeChanged(document.getElementById(`${this.props.name}_select_type`).value)
  }

  onCommandChanged() {
    this.props.onCommandChanged(document.getElementById(`${this.props.name}input_command`).value)
  }

  onColorChanged() {
    this.props.onColorChanged(document.getElementById(`${this.props.name}input_color`).value)
  }

  onRemove() {
    this.props.onRemove()
  }

  onDragStarted(e) {
    e.dataTransfer.dropEffect = 'move';
    this.props.onDragStarted()
  }

  onDropped() {
    this.props.onDropped()
  }

  render() {
    return (
      <atom-panel class='padded native-key-bindings' draggable="true" ondragstart={(e) => this.onDragStarted(e)} ondrop={() => this.onDropped()}>
        <div class="inset-panel padded block">
          <span class="drag-wrapper icon icon-grabber inline-block"></span>
          <select id={`${this.props.name}_select_type`} class="input-select inline-block" onchange={() => this.onTypeChanged()}>
            {types.map((e) => {
              if(this.props.type === e.value) {
                return <option value={e.value} selected>{e.label}</option>
              } else {
                return <option value={e.value}>{e.label}</option>
              }
            })}
          </select>
          <input type="text" class="input-text inline-block label" id={`${this.props.name}input_label`} value={ this.props.label || "" } placeholder="No label" onKeyUp={this.onLabelChanged}></input>
          <input type="text" class="input-text inline-block icon-input" id={`${this.props.name}input_icon`} value={ this.props.icon || "" } placeholder="No icon" onKeyUp={this.onIconChanged}></input>
          <select id={`${this.props.name}_select_icon_color`} class="input-select inline-block" onchange={() => this.onIconColorChanged()}>
            <option value="default" selected>Default</option>
            <option value="white">White</option>
            <option value="black">Black</option>
          </select>
          <input type="text" class="input-text inline-block command" id={`${this.props.name}input_command`} value={ this.props.command || "" } placeholder="No command" onKeyUp={this.onCommandChanged}></input>
          <input type="color" class="input-color inline-block" id={`${this.props.name}input_color`} value={ this.props.color || "" } onchange={() => this.onColorChanged()}></input>
          <span class="remove icon icon-trashcan inline-block" onClick={() => this.onRemove()} value="Remove"/>
          </div>
      </atom-panel>
    )
  }
}
