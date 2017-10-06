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
  }
]

export default class TouchBarItem {
  constructor(props) {
    this.props = props
    etch.initialize(this)
  }

  update(props) {
    this.props = props
    return etch.update(this)
  }


  onLabelChanged() {
    this.props.onLabelChanged(document.getElementById(`${this.props.name}input_label`).value)
  }

  onTypeChanged() {
    console.log("Changing type of" +  this.props.name);
    this.props.onTypeChanged(document.getElementById(`${this.props.name}_select_type`).value)
  }

  onCommandChanged() {
    this.props.onCommandChanged(document.getElementById(`${this.props.name}input_command`).value)
  }

  onColorChanged() {
    this.props.onColorChanged(document.getElementById(`${this.props.name}input_color`).value)
  }

  render() {
    return (
      <div class="native-key-bindings element-panel">
        <select id={`${this.props.name}_select_type`} onchange={() => this.onTypeChanged()}>
          {types.map((e) => {
            if(this.props.type === e.value) {
              return <option value={e.value} selected>{e.label}</option>
            } else {
              return <option value={e.value}>{e.label}</option>
            }
          })}
        </select>
        <input type="text" class="label" id={`${this.props.name}input_label`} value={ (this.props.label ? this.props.label : "No label") } onKeyUp={this.onLabelChanged}></input>
        <input type="text" class="command" id={`${this.props.name}input_command`} value={ (this.props.command ? this.props.command : "No comand") } onKeyUp={this.onCommandChanged}></input>
        <input type="text" class="color" id={`${this.props.name}input_color`} value={ (this.props.color ? this.props.color : "No color") } onKeyUp={this.onColorChanged}></input>

        <br></br>
      </div>
    )
  }
}
