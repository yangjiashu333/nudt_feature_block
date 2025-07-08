import * as React from "react"
import { cn } from "@/lib/utils"

interface FeatureBlockIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function FeatureBlockIcon({ 
  size = 24, 
  className, 
  ...props 
}: FeatureBlockIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      {...props}
    >
      <rect width="32" height="32" rx="6" fill="#1E40AF"/>
      <rect x="4" y="4" width="8" height="8" rx="2" fill="#60A5FA"/>
      <rect x="20" y="4" width="8" height="8" rx="2" fill="#60A5FA"/>
      <rect x="4" y="20" width="8" height="8" rx="2" fill="#60A5FA"/>
      <rect x="20" y="20" width="8" height="8" rx="2" fill="#60A5FA"/>
      <rect x="12" y="12" width="8" height="8" rx="2" fill="#F59E0B"/>
      <path 
        d="M14 6L18 10L14 14" 
        stroke="#F59E0B" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M26 14L22 18L26 22" 
        stroke="#F59E0B" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}