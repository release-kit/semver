import { getInput } from '@actions/core'

export function getOptions() {
  return {
    input: getInput('input'),
    fallback: getInput('fallback'),
    extract: getInput('extract'),
  }
}
