const fs = require('fs')
const path = require('path')

function readFile(filepath) {
  if (!filepath) {
    return
  }

  try {
    return fs.readFileSync(path.join(__dirname, '../../content/', filepath), {
      encoding: 'utf8',
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Failed to read file: ${filepath}`,
      error,
      'This error is due to a problem with partials. Check your markdown files for the "::include{file=PATH_TO_FILE}" directive and make sure that PATH_TO_FILE exists. If this issue persists, please open a new issue with steps to reproduce.'
    )
  }
}

function include({ processor }) {
  function processNode(node, index, parent) {
    const { attributes } = node
    const { file } = attributes

    if (!file) {
      // eslint-disable-next-line no-console
      console.warn(
        'Found a "::include" directive without a "name" attribute. You might have intended to import a partial into a markdown file, but no partial can be found without the "file" attribute. The "::include" directive should look like "::include{file=path/to/file}".'
      )

      return
    }

    const snippet = readFile(file)
    const result = processor.parse(snippet)

    parent.children.splice(index, 1, ...result.children)
  }

  return {
    type: 'leafDirective',
    name: 'include',
    processNode,
  }
}

module.exports = include
