"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineAlert(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineAlert(true)
    }

    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <>
      {/* Connection Status Badge */}
      <div className="fixed top-4 right-4 z-50 md:top-6 md:right-6">
        <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-2 px-3 py-1">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Offline
            </>
          )}
        </Badge>
      </div>

      {/* Offline Alert */}
      {showOfflineAlert && (
        <div className="fixed top-16 left-4 right-4 z-40 md:top-20 md:left-6 md:right-6 md:max-w-md md:mx-auto">
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You're currently offline. Some features may be limited, but you can still view cached data.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}
