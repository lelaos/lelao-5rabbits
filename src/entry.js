import React from 'react'
import ReactDOM from 'react-dom'
import Lelao from 'lelao-core'

const node = document.createElement('div')

document.body.append(node)

ReactDOM.render(
  <Lelao
    plugins={{
      'lelao-plugin-url': require('lelao-plugin-url')
    }}
  />,
  node
)
