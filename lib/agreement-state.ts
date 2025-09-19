import { AssuranceMethod } from '@prisma/client'

export type AgreementState = 
  | 'DRAFT' 
  | 'PENDING_SECURE' 
  | 'SECURED' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'ACCEPTED' 
  | 'CLOSED'

export const AGREEMENT_STATES: Record<AgreementState, string> = {
  DRAFT: 'Draft - Setting up terms',
  PENDING_SECURE: 'Pending - Awaiting payment security',
  SECURED: 'Secured - Ready to begin work',
  IN_PROGRESS: 'In Progress - Work underway',
  SUBMITTED: 'Submitted - Awaiting client review',
  ACCEPTED: 'Accepted - Work completed',
  CLOSED: 'Closed - Agreement finalized'
}

export function getNextValidStates(currentState: AgreementState, method: AssuranceMethod): AgreementState[] {
  switch (currentState) {
    case 'DRAFT':
      return ['PENDING_SECURE']
    
    case 'PENDING_SECURE':
      return ['SECURED', 'DRAFT'] // Can go back to draft to change terms
    
    case 'SECURED':
      return ['IN_PROGRESS']
    
    case 'IN_PROGRESS':
      return ['SUBMITTED']
    
    case 'SUBMITTED':
      return ['ACCEPTED', 'IN_PROGRESS'] // Can request revisions
    
    case 'ACCEPTED':
      return ['CLOSED']
    
    case 'CLOSED':
      return [] // Final state
    
    default:
      return []
  }
}

export function canTransitionTo(currentState: AgreementState, newState: AgreementState, method: AssuranceMethod): boolean {
  const validStates = getNextValidStates(currentState, method)
  return validStates.includes(newState)
}

export function getSecuredCondition(method: AssuranceMethod): string {
  switch (method) {
    case 'MILESTONE_INVOICE':
      return 'First milestone payment receipt uploaded and verified'
    case 'EXTERNAL_ESCROW':
      return 'Escrow service shows status as FUNDED'
    case 'CARD_HOLD':
      return 'Card authorization hold successfully placed'
    default:
      return 'Payment security in place'
  }
}

export function validateStateTransition(
  currentState: AgreementState,
  newState: AgreementState,
  method: AssuranceMethod,
  data?: any
): { valid: boolean; error?: string } {
  // Check if transition is allowed
  if (!canTransitionTo(currentState, newState, method)) {
    return { valid: false, error: `Cannot transition from ${currentState} to ${newState}` }
  }

  // Additional validation based on the specific transition
  if (currentState === 'PENDING_SECURE' && newState === 'SECURED') {
    switch (method) {
      case 'MILESTONE_INVOICE':
        if (!data?.milestoneJson || !Array.isArray(data.milestoneJson)) {
          return { valid: false, error: 'Milestone data required' }
        }
        const firstMilestone = data.milestoneJson[0]
        if (!firstMilestone?.receiptId || !firstMilestone?.paidStatus) {
          return { valid: false, error: 'First milestone must have payment receipt' }
        }
        break
        
      case 'EXTERNAL_ESCROW':
        if (!data?.escrowJson?.status || data.escrowJson.status !== 'FUNDED') {
          return { valid: false, error: 'Escrow must be funded' }
        }
        break
        
      case 'CARD_HOLD':
        if (!data?.cardJson?.paymentIntentId || !data?.cardJson?.holdExpiresAt) {
          return { valid: false, error: 'Card hold must be active' }
        }
        const expiresAt = new Date(data.cardJson.holdExpiresAt)
        if (expiresAt < new Date()) {
          return { valid: false, error: 'Card hold has expired' }
        }
        break
    }
  }

  if (newState === 'ACCEPTED') {
    // Ensure all acceptance checklist items are completed
    if (!data?.acceptanceChecklist || !Array.isArray(data.acceptanceChecklist)) {
      return { valid: false, error: 'Acceptance checklist required' }
    }
    
    const requiredItems = data.acceptanceChecklist.filter((item: any) => item.required)
    const completedRequired = requiredItems.filter((item: any) => item.completed)
    
    if (completedRequired.length < requiredItems.length) {
      return { valid: false, error: 'All required checklist items must be completed' }
    }
  }

  return { valid: true }
}