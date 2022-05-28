import { parse } from 'semver'

export function parseVersion(version: string) {
  const parsed = parse(version)

  if (!parsed) {
    console.error('Cannot parse version, most likely it is not a semver')
    process.exit(1)
  }

  const { raw, major, minor, patch, prerelease, build } = parsed

  return {
    full: raw,
    major,
    minor,
    patch,
    prerelease: prerelease.join('.'),
    build: build.join('.'),
  }
}
