/// <reference types="vite/client" />

import { describe, expect, test } from 'vitest'
import { percentage } from './statsHelpers'

describe('statsHelpers', () => {
  describe('percentage', () => {
    test('calculates correct rounded percentage', () => {
      expect(percentage(5, 10, 0)).toBe(50)
      expect(percentage(1, 3, 1)).toBe(33.3)
      expect(percentage(2, 3, 2)).toBe(66.67)
    })

    test('returns null for non-finite numerator or denominator', () => {
      expect(percentage(NaN, 10, 1)).toBeNull()
      expect(percentage(5, NaN, 1)).toBeNull()
      expect(percentage(Infinity, 10, 1)).toBeNull()
      expect(percentage(5, Infinity, 1)).toBeNull()
    })

    test('returns null for zero or negative denominator', () => {
      expect(percentage(5, 0, 1)).toBeNull()
      expect(percentage(5, -10, 1)).toBeNull()
    })
  })
})
