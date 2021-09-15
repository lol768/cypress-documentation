const unified = require('unified')
const visit = require('unist-util-visit')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const squeezeParagraphs = require('remark-squeeze-paragraphs')
const slug = require('remark-slug')
const autolinkHeadings = require('remark-autolink-headings')
const externalLinks = require('remark-external-links')
const remarkFootnotes = require('remark-footnotes')
const gfm = require('remark-gfm')

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(squeezeParagraphs)
  .use(slug)
  .use(externalLinks)
  .use(autolinkHeadings)
  .use(remarkFootnotes)
  .use(gfm)

const directivesByType = {}

addDirective(require('./directives/include'))

function addDirective(directive) {
  const { type, name, processNode } = directive({ processor })

  if (!directivesByType[type]) {
    directivesByType[type] = {}
  }

  directivesByType[type][name] = processNode
}

function processNode(node, index, parent) {
  const { type, name } = node

  const fn = (directivesByType[type] || {})[name]

  if (fn) {
    // eslint-disable-next-line no-console
    console.log('process directive', type, name)

    return fn(node, index, parent)
  }
}

module.exports = function directiveAttacher() {
  return function transform(tree) {
    visit(tree, processNode)
  }
}
