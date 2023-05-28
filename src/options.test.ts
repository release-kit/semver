import { getOptions } from './options'

describe('getOptions', () => {
  test('empty inputs', () => {
    expect(getOptions({})).toMatchSnapshot()
  })

  test('unknown source', () => {
    expect(() => getOptions({ source: 'unknown' })).toThrowError()
  })

  test('only string input', () => {
    expect(getOptions({ string: 'v1.0.0' })).toMatchSnapshot()
  })

  test('string input with correct source', () => {
    expect(getOptions({ source: 'string', string: 'v1.0.0' })).toMatchSnapshot()
  })

  test('string input with wrong source', () => {
    expect(() =>
      getOptions({ source: 'workflow-tag', string: 'v1.0.0' })
    ).toThrowError()

    expect(() =>
      getOptions({ source: 'unknown', string: 'v1.0.0' })
    ).toThrowError()
  })

  test('workflow tag source', () => {
    expect(getOptions({ source: 'workflow-tag' })).toMatchSnapshot()
  })

  test('workflow tag source', () => {
    expect(getOptions({ source: 'workflow-tag' })).toMatchSnapshot()
  })

  test('latest tag source', () => {
    expect(getOptions({ source: 'latest-tag' })).toMatchSnapshot()
  })

  test('good pattern', () => {
    expect(getOptions({ pattern: '^.*$' })).toMatchSnapshot()
  })

  test('invalid pattern', () => {
    expect(() => getOptions({ pattern: '(' })).toThrowErrorMatchingSnapshot()
  })

  test('good fallback', () => {
    expect(getOptions({ fallback: 'v1.0.0' })).toMatchSnapshot()
  })

  test('invalid fallback', () => {
    expect(() => getOptions({ fallback: '' })).toThrowErrorMatchingSnapshot()
  })
})
