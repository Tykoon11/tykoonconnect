'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, MoreHorizontal } from 'lucide-react'

interface DataPoint {
  label: string
  value: number
  color?: string
}

// Simple Bar Chart
interface BarChartProps {
  data: DataPoint[]
  title?: string
  height?: number
  showValues?: boolean
  className?: string
}

export function BarChart({ data, title, height = 200, showValues = true, className }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className={cn('space-y-4', className)}>
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
      
      <div className="relative" style={{ height }}>
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (height - 40)
            const color = item.color || '#3B82F6'
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 group">
                <div className="relative flex-1 flex items-end justify-center w-full">
                  {showValues && (
                    <div className="absolute -top-6 text-xs font-medium text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
                      {item.value}
                    </div>
                  )}
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative overflow-hidden group-hover:scale-105"
                    style={{ 
                      height: barHeight,
                      backgroundColor: color,
                      minHeight: '2px'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center truncate w-full">
                  {item.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Progress Ring
interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showText?: boolean
  className?: string
}

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showText = true,
  className 
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])
  
  const center = size / 2
  const radius = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          className="dark:opacity-30"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(animatedProgress)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Stat Card with Trend
interface StatCardProps {
  title: string
  value: string | number
  trend?: number // percentage change
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  color?: string
  className?: string
  onClick?: () => void
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  description, 
  color = '#3B82F6',
  className,
  onClick 
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  const getTrendIcon = () => {
    if (trend === undefined) return Minus
    if (trend > 0) return TrendingUp
    if (trend < 0) return TrendingDown
    return Minus
  }
  
  const getTrendColor = () => {
    if (trend === undefined) return 'text-gray-400'
    if (trend > 0) return 'text-green-600 dark:text-green-400'
    if (trend < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-400'
  }
  
  const TrendIcon = getTrendIcon()
  
  return (
    <div 
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: color + '20' }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <MoreHorizontal className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="space-y-2">
        <div className={cn(
          'text-3xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-500',
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}>
          {value}
        </div>
        
        {(trend !== undefined || description) && (
          <div className="flex items-center justify-between">
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
            {trend !== undefined && (
              <div className={cn('flex items-center space-x-1 text-sm font-medium', getTrendColor())}>
                <TrendIcon className="h-4 w-4" />
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Simple Line Chart (dots connected)
interface LineChartProps {
  data: { x: string; y: number }[]
  title?: string
  height?: number
  color?: string
  showDots?: boolean
  className?: string
}

export function SimpleLineChart({ 
  data, 
  title, 
  height = 200, 
  color = '#3B82F6',
  showDots = true,
  className 
}: LineChartProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])
  
  if (data.length === 0) return null
  
  const maxY = Math.max(...data.map(d => d.y))
  const minY = Math.min(...data.map(d => d.y))
  const rangeY = maxY - minY || 1
  
  const width = 400
  const padding = 20
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth
    const y = padding + ((maxY - point.y) / rangeY) * chartHeight
    return { x, y, originalY: point.y, label: point.x }
  })
  
  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
    .join(' ')
  
  return (
    <div className={cn('space-y-4', className)}>
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
      
      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i / 4) * chartHeight}
              x2={width - padding}
              y2={padding + (i / 4) * chartHeight}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-gray-200 dark:text-gray-700"
            />
          ))}
          
          {/* Line path */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={2}
            className={cn(
              'transition-all duration-1000',
              isVisible ? 'stroke-dasharray-none' : 'stroke-dasharray-1000 stroke-dashoffset-1000'
            )}
          />
          
          {/* Dots */}
          {showDots && points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={4}
                fill={color}
                className={cn(
                  'transition-all duration-500 hover:r-6 cursor-pointer',
                  isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              />
              {/* Tooltip on hover */}
              <g className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <rect
                  x={point.x - 25}
                  y={point.y - 35}
                  width={50}
                  height={20}
                  rx={4}
                  fill="black"
                  fillOpacity={0.8}
                />
                <text
                  x={point.x}
                  y={point.y - 22}
                  textAnchor="middle"
                  className="text-xs fill-white"
                >
                  {point.originalY}
                </text>
              </g>
            </g>
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-5">
          {data.map((point, index) => (
            <span key={index} className="text-xs text-gray-600 dark:text-gray-400">
              {point.x}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}