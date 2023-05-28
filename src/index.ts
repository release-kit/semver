import { info, setFailed, setOutput } from '@actions/core'
import { parse } from 'semver'
import { getLatestTag } from './git'
import { getOptions } from './options'

function extractAndSetOutput(string: string, pattern: string) {
  const regex = new RegExp(pattern, 'g')
  const matches = regex.exec(string)

  if (matches === null) {
    return setFailed(`No matches found when using regex: "${pattern}"`)
  }

  if (matches.length > 2) {
    return setFailed(`Multiple matches found when using regex: "${pattern}"`)
  }

  const [, version] = matches

  const parsed = parse(version)

  if (!parsed) {
    return setFailed(`Cannot parse "${version}" - most likely it's invalid`)
  }

  setOutput('full', parsed.raw)
  setOutput('major', parsed.major)
  setOutput('minor', parsed.minor)
  setOutput('patch', parsed.patch)
  setOutput('prerelease', parsed.prerelease.join('.'))
  setOutput('build', parsed.build.join('.'))
}

async function run() {
  const options = getOptions()

  if (options.source === 'string') {
    info(`Using a user's string as an input`)
    return extractAndSetOutput(options.string, options.pattern)
  }

  if (options.source === 'workflow-tag') {
    info(`Using the current tag as an input`)

    if (process.env.GITHUB_REF_TYPE === 'branch') {
      return setFailed(`No tag found - the workflow is triggered from a branch`)
    }

    return extractAndSetOutput(process.env.GITHUB_REF_NAME, options.pattern)
  }

  const { fallback } = options
  const latestTag = await getLatestTag({ fallback })
  if (latestTag.isFallback) info(`No tag found - using fallback: "${fallback}"`)
  return extractAndSetOutput(latestTag.value, options.pattern)
}

try {
  void run()
} catch (error) {
  if (error instanceof Error) setFailed(error)
  else setFailed('Unknown error')
}
