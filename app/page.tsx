"use client"

import { useState, useEffect } from "react"
import { MiracleDemo } from "@/components/miracle-demo"
import { SplashScreen } from "@/components/splash-screen"
import { LoginScreen } from "@/components/login-screen"
import { ClientSelectionScreen } from "@/components/client-selection-screen"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

type AppState = "splash" | "login" | "clientSelection" | "main"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("splash")
  const [userName, setUserName] = useState("")
  const [selectedClient, setSelectedClient] = useState("")

  useEffect(() => {
    if (appState === "splash") {
      const timer = setTimeout(() => {
        setAppState("login")
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [appState])

  const handleLoginSuccess = (name: string) => {
    setUserName(name)
    setAppState("clientSelection")
  }

  const handleClientSelect = (clientName: string) => {
    setSelectedClient(clientName)
    setAppState("main")
  }

  const handleBackToClientSelection = () => {
    setSelectedClient("")
    setAppState("clientSelection")
  }

  const handleLogout = () => {
    setUserName("")
    setSelectedClient("")
    setAppState("login")
  }

  const renderContent = () => {
    switch (appState) {
      case "splash":
        return <SplashScreen />
      case "login":
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />
      case "clientSelection":
        return <ClientSelectionScreen onClientSelect={handleClientSelect} />
      case "main":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <header className="absolute top-0 right-0 p-4 md:p-6 flex items-center gap-4">
              <span className="text-sm md:text-base text-gray-700 font-medium">{userName}님 환영합니다.</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </header>
            <MiracleDemo clientName={selectedClient} onGoBack={handleBackToClientSelection} />
          </div>
        )
      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 font-sans p-4 transition-opacity duration-500">
      {renderContent()}
    </main>
  )
}
