/** @babel */
/** @jsx etch.dom */

import {Disposable} from 'atom'
import etch from 'etch'

export default class TouchBarItem {
  constructor(props) {
    this.props = props
    etch.initialize(this)
  }

  update(props) {
    this.props = props
    return etch.update(this)
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <b>{ (this.props.type ? this.props.type : "No type") }</b> : <i>{ (this.props.label ? this.props.label : "No label") }</i>
        <br></br>
      </div>
    )
  }
}
