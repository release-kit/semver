import { setOutput } from '@actions/core'
import { extractVersion } from './extract'
import { getLatestTag } from './git'
import { getOptions } from './options'
import { parseVersion } from './parse'

async function run() {
  const options = getOptions()
  let { input } = options
  const { extract, fallback } = options

  if (!input) {
    console.info('No input provided, using the latest tag')

    const tag = await getLatestTag({ fallback })
    input = tag.value
    setOutput('tag', tag.value)

    if (tag.isFallback) {
      console.info(`No tag was found, using the fallback: ${fallback}`)
    }
  }

  const regex = new RegExp(extract, 'g')
  const version = extractVersion(input, regex)

  const parsed = parseVersion(version)
  setOutput('major', parsed.major)
  setOutput('minor', parsed.minor)
  setOutput('patch', parsed.patch)
  setOutput('prerelease', parsed.prerelease)
  setOutput('build', parsed.build)
  setOutput('full', parsed.full)
}

run()
