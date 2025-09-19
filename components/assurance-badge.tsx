import { Badge } from '@/components/ui/badge'
import { Clock, CreditCard, ExternalLink, FileText } from 'lucide-react'
import { AssuranceMethod } from '@prisma/client'

interface AssuranceBadgeProps {
  method: AssuranceMethod
  state?: string
  compact?: boolean
}

const methodConfig = {
  MILESTONE_INVOICE: {
    label: 'Milestone',
    icon: FileText,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Pay per milestone with invoices'
  },
  EXTERNAL_ESCROW: {
    label: 'Escrow',
    icon: ExternalLink,
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Third-party escrow service'
  },
  CARD_HOLD: {
    label: 'Card Hold',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Authorization hold on card'
  }
}

export function AssuranceBadge({ method, state, compact = false }: AssuranceBadgeProps) {
  const config = methodConfig[method]
  const Icon = config.icon

  if (compact) {
    return (
      <Badge variant="outline" className={`${config.color} gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}>
      <Icon className="h-4 w-4" />
      <div className="flex flex-col">
        <span className="font-medium text-sm">{config.label}</span>
        {state && (
          <span className="text-xs opacity-75">{state}</span>
        )}
      </div>
    </div>
  )
}

interface AssurancePickerProps {
  value: AssuranceMethod
  onChange: (method: AssuranceMethod) => void
  disabled?: boolean
  showDescriptions?: boolean
}

export function AssurancePicker({ value, onChange, disabled = false, showDescriptions = true }: AssurancePickerProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Choose Assurance Method</div>
      <div className="grid gap-3">
        {Object.entries(methodConfig).map(([method, config]) => {
          const Icon = config.icon
          const isSelected = value === method
          
          return (
            <button
              key={method}
              type="button"
              onClick={() => !disabled && onChange(method as AssuranceMethod)}
              disabled={disabled}
              className={`p-4 rounded-lg border text-left transition-all ${
                isSelected 
                  ? `${config.color} border-2` 
                  : 'border-gray-200 hover:border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? '' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className="font-medium">{config.label}</div>
                  {showDescriptions && (
                    <div className="text-sm text-gray-600 mt-1">{config.description}</div>
                  )}
                </div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
            </button>
          )
        })}
      </div>
      
      {value === 'MILESTONE_INVOICE' && (
        <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
          <strong>Recommended:</strong> Break work into small milestones (2-5) with clear deliverables. 
          Upload payment receipts to mark milestones as secured.
        </div>
      )}
      
      {value === 'EXTERNAL_ESCROW' && (
        <div className="text-xs text-gray-600 bg-green-50 p-3 rounded">
          <strong>Reference Only:</strong> We don&apos;t hold funds. Use any escrow service you trust 
          and provide the reference details for tracking.
        </div>
      )}
      
      {value === 'CARD_HOLD' && (
        <div className="text-xs text-gray-600 bg-purple-50 p-3 rounded">
          <strong>Authorization Hold:</strong> Card is authorized for the full amount but not charged 
          until work is accepted. Hold expires after 7 days.
        </div>
      )}
    </div>
  )
}