"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requiredType?: "volunteer" | "organization"
}

export function AuthGuard({ children, requiredType }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userStr)
    if (requiredType && user.type !== requiredType) {
      router.push("/login")
      return
    }

    setIsAuthorized(true)
  }, [router, requiredType])

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
