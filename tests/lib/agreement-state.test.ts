import { describe, it, expect } from 'vitest'
import { 
  canTransitionTo, 
  validateStateTransition,
  getSecuredCondition,
  AGREEMENT_STATES
} from '../../lib/agreement-state'

describe('Agreement State Machine', () => {
  describe('State Transitions', () => {
    it('allows valid transitions from DRAFT', () => {
      expect(canTransitionTo('DRAFT', 'PENDING_SECURE', 'MILESTONE_INVOICE')).toBe(true)
      expect(canTransitionTo('DRAFT', 'SECURED', 'MILESTONE_INVOICE')).toBe(false)
      expect(canTransitionTo('DRAFT', 'CLOSED', 'MILESTONE_INVOICE')).toBe(false)
    })

    it('allows valid transitions from PENDING_SECURE', () => {
      expect(canTransitionTo('PENDING_SECURE', 'SECURED', 'MILESTONE_INVOICE')).toBe(true)
      expect(canTransitionTo('PENDING_SECURE', 'DRAFT', 'MILESTONE_INVOICE')).toBe(true)
      expect(canTransitionTo('PENDING_SECURE', 'IN_PROGRESS', 'MILESTONE_INVOICE')).toBe(false)
    })

    it('validates milestone transition requirements', () => {
      const validMilestoneData = {
        milestoneJson: [{
          id: '1',
          title: 'Test',
          amount: 100,
          receiptId: 'receipt123',
          paidStatus: true
        }]
      }

      const result = validateStateTransition(
        'PENDING_SECURE',
        'SECURED',
        'MILESTONE_INVOICE',
        validMilestoneData
      )

      expect(result.valid).toBe(true)
    })

    it('rejects invalid milestone transitions', () => {
      const invalidMilestoneData = {
        milestoneJson: [{
          id: '1',
          title: 'Test',
          amount: 100,
          paidStatus: false
        }]
      }

      const result = validateStateTransition(
        'PENDING_SECURE',
        'SECURED',
        'MILESTONE_INVOICE',
        invalidMilestoneData
      )

      expect(result.valid).toBe(false)
      expect(result.error).toContain('payment receipt')
    })

    it('validates escrow transition requirements', () => {
      const validEscrowData = {
        escrowJson: {
          provider: 'escrow.com',
          status: 'FUNDED'
        }
      }

      const result = validateStateTransition(
        'PENDING_SECURE',
        'SECURED',
        'EXTERNAL_ESCROW',
        validEscrowData
      )

      expect(result.valid).toBe(true)
    })

    it('validates card hold transition requirements', () => {
      const validCardData = {
        cardJson: {
          paymentIntentId: 'pi_123',
          holdExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }

      const result = validateStateTransition(
        'PENDING_SECURE',
        'SECURED',
        'CARD_HOLD',
        validCardData
      )

      expect(result.valid).toBe(true)
    })

    it('rejects expired card hold', () => {
      const expiredCardData = {
        cardJson: {
          paymentIntentId: 'pi_123',
          holdExpiresAt: new Date(Date.now() - 1000).toISOString()
        }
      }

      const result = validateStateTransition(
        'PENDING_SECURE',
        'SECURED',
        'CARD_HOLD',
        expiredCardData
      )

      expect(result.valid).toBe(false)
      expect(result.error).toContain('expired')
    })
  })

  describe('Secured Conditions', () => {
    it('returns correct conditions for each method', () => {
      expect(getSecuredCondition('MILESTONE_INVOICE')).toContain('milestone')
      expect(getSecuredCondition('EXTERNAL_ESCROW')).toContain('FUNDED')
      expect(getSecuredCondition('CARD_HOLD')).toContain('authorization')
    })
  })

  describe('Agreement States', () => {
    it('has all required states defined', () => {
      const requiredStates = [
        'DRAFT', 'PENDING_SECURE', 'SECURED', 'IN_PROGRESS',
        'SUBMITTED', 'ACCEPTED', 'CLOSED'
      ]

      requiredStates.forEach(state => {
        expect(AGREEMENT_STATES).toHaveProperty(state)
        expect(typeof AGREEMENT_STATES[state]).toBe('string')
      })
    })
  })
})