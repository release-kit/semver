import execa from 'execa'

interface Options {
  fallback: string
}

interface Tag {
  value: string
  isFallback: boolean
}

export async function getLatestTag(options: Options): Promise<Tag> {
  const { fallback } = options

  const hashOutput = await execa('git', ['rev-list', '--tags', '--max-count=1'])
  const hash = hashOutput.stdout.trim()

  if (!hash) {
    return { value: fallback, isFallback: true }
  }

  const tagOutput = await execa('git', ['describe', '--tags', hash])
  const tag = tagOutput.stdout.trim()

  if (!tag) {
    return { value: fallback, isFallback: true }
  }

  return { value: tag, isFallback: false }
}
