export function extractVersion(input: string, regex: RegExp) {
  const matches = regex.exec(input)

  if (matches === null) {
    console.error('No matches found when using "extract" regex')
    process.exit(1)
  }

  if (matches.length > 2) {
    console.error('Multiple matches found when using "extract" regex')
    process.exit(1)
  }

  const [, version] = matches
  return version
}
