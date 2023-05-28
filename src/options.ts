import { getInput } from '@actions/core'
import { z } from 'zod'

const CommonSchema = z.object({
  fallback: z.string().min(1).default('v0.1.0'),
  pattern: z
    .string()
    .refine((value) => {
      try {
        void new RegExp(value)
        return true
      } catch {
        return false
      }
    })
    .default('^v?(.*)$'),
})

const TagSourceSchema = CommonSchema.extend({
  source: z
    .union([z.literal('workflow-tag'), z.literal('latest-tag')])
    .default('workflow-tag'),
}).strict()

const StringSourceSchema = CommonSchema.extend({
  source: z.literal('string').default('string'),
  string: z.string().min(1),
}).strict()

const AnySourceSchema = z.union([TagSourceSchema, StringSourceSchema])

interface Inputs {
  source?: string
  string?: string
  fallback?: string
  pattern?: string
}

function getActionInputs(): Inputs {
  return Object.entries({
    source: getInput('source'),
    string: getInput('string'),
    fallback: getInput('fallback'),
    pattern: getInput('pattern'),
  }).reduce<Inputs>((acc: Inputs, [name, value]) => {
    if (!value) return acc
    acc[name as keyof Inputs] = value
    return acc
  }, {})
}

export function getOptions(input: Inputs = getActionInputs()) {
  return AnySourceSchema.parse(input)
}
