'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, Eye, EyeOff, Upload, X } from 'lucide-react'
import { Input } from './input'
import { Textarea } from './textarea'
import { Button } from './button'
import { Label } from './label'

// Enhanced Input with validation states
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
  showPasswordToggle?: boolean
}

export function EnhancedInput({ 
  label, 
  error, 
  success, 
  helperText, 
  showPasswordToggle = false,
  type,
  className,
  ...props 
}: EnhancedInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const actualType = showPasswordToggle && showPassword ? 'text' : type

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={props.id} 
          className={cn(
            'text-sm font-medium transition-colors',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300',
            success ? 'text-green-600 dark:text-green-400' : ''
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          {...props}
          type={actualType}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={cn(
            'transition-all duration-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            success && 'border-green-500 focus:border-green-500 focus:ring-green-500',
            isFocused && 'scale-[1.02] shadow-lg',
            className
          )}
        />
        
        {/* Password toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        
        {/* Status icons */}
        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error && <AlertCircle className="h-4 w-4 text-red-500" />}
            {success && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
        )}
      </div>
      
      {/* Helper text or error */}
      {(error || helperText) && (
        <div className={cn(
          'text-sm transition-all duration-200',
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || helperText}
        </div>
      )}
    </div>
  )
}

// Enhanced Textarea
interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
  showCharCount?: boolean
  maxLength?: number
}

export function EnhancedTextarea({ 
  label, 
  error, 
  success, 
  helperText, 
  showCharCount = false,
  maxLength,
  value,
  className,
  ...props 
}: EnhancedTextareaProps) {
  const [isFocused, setIsFocused] = useState(false)
  const charCount = String(value || '').length
  
  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={props.id}
          className={cn(
            'text-sm font-medium transition-colors',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Textarea
          {...props}
          maxLength={maxLength}
          value={value}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          className={cn(
            'transition-all duration-200 resize-none',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            success && 'border-green-500 focus:border-green-500 focus:ring-green-500',
            isFocused && 'scale-[1.01] shadow-lg',
            className
          )}
        />
        
        {/* Character count */}
        {showCharCount && maxLength && (
          <div className={cn(
            'absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800',
            charCount > maxLength * 0.9 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
          )}>
            {charCount}/{maxLength}
          </div>
        )}
      </div>
      
      {/* Helper text or error */}
      {(error || helperText) && (
        <div className={cn(
          'text-sm transition-all duration-200',
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || helperText}
        </div>
      )}
    </div>
  )
}

// File Upload Component
interface FileUploadProps {
  label?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onFilesChange?: (files: File[]) => void
  error?: string
  helperText?: string
  disabled?: boolean
}

export function FileUpload({
  label,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  multiple = true,
  maxSize = 10,
  onFilesChange,
  error,
  helperText,
  disabled = false
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return
    
    const fileArray = Array.from(newFiles)
    const validFiles: File[] = []
    let hasError = false
    
    fileArray.forEach(file => {
      if (file.size > maxSize * 1024 * 1024) {
        setUploadError(`File "${file.name}" is too large. Maximum size is ${maxSize}MB.`)
        hasError = true
        return
      }
      validFiles.push(file)
    })
    
    if (!hasError) {
      setUploadError('')
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    handleFileChange(e.dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Label>
      )}
      
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
          dragActive && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
          error || uploadError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled}
          className="hidden"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {accept.split(',').join(', ')} up to {maxSize}MB each
          </p>
        </div>
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-48">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Helper text or error */}
      {(error || uploadError || helperText) && (
        <div className={cn(
          'text-sm transition-all duration-200',
          (error || uploadError) ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || uploadError || helperText}
        </div>
      )}
    </div>
  )
}