"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  length?: number
  onComplete?: (value: string) => void
}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ className, length = 6, onComplete, ...props }, ref) => {
    const [values, setValues] = React.useState<string[]>(Array(length).fill(""))
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
      if (value.length > 1) return // Prevent multiple characters

      const newValues = [...values]
      newValues[index] = value
      setValues(newValues)

      // Move to next input if value is entered
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      // Call onComplete when all fields are filled
      if (newValues.every((v) => v) && onComplete) {
        onComplete(newValues.join(""))
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !values[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData("text").slice(0, length)
      const newValues = Array(length).fill("")

      for (let i = 0; i < pastedData.length; i++) {
        newValues[i] = pastedData[i]
      }

      setValues(newValues)

      if (newValues.every((v) => v) && onComplete) {
        onComplete(newValues.join(""))
      }
    }

    return (
      <div className="flex gap-2">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={values[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "w-12 h-12 text-center text-lg font-mono border rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              className,
            )}
            {...props}
          />
        ))}
      </div>
    )
  },
)

InputOTP.displayName = "InputOTP"

export { InputOTP }
