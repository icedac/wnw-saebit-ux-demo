"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClientSelectionScreenProps {
  onClientSelect: (clientName: string) => void
}

type ClientStatus = "완료" | "초기화" | "진행중"

const predefinedClients: { name: string; status: ClientStatus }[] = [
  { name: "임지혁", status: "완료" },
  { name: "김채원", status: "초기화" },
  { name: "이지은", status: "진행중" },
]

const statusStyles: { [key in ClientStatus]: string } = {
  완료: "bg-green-100 text-green-800",
  초기화: "bg-gray-100 text-gray-800",
  진행중: "bg-blue-100 text-blue-800",
}

export function ClientSelectionScreen({ onClientSelect }: ClientSelectionScreenProps) {
  const [showNewClientInput, setShowNewClientInput] = useState(false)
  const [newClientName, setNewClientName] = useState("")

  const handleNewClientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newClientName.trim()) {
      onClientSelect(newClientName.trim())
    }
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>의뢰인 선택</CardTitle>
          <CardDescription>작업을 진행할 의뢰인을 선택하거나 신규 등록하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {predefinedClients.map((client) => (
              <Button
                key={client.name}
                variant="outline"
                className="w-full justify-between text-base py-6 bg-transparent"
                onClick={() => onClientSelect(client.name)}
              >
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5" />
                  {client.name}
                </div>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", statusStyles[client.status])}>
                  {client.status}
                </span>
              </Button>
            ))}
          </div>
          <hr />
          {!showNewClientInput ? (
            <Button className="w-full text-base py-6" onClick={() => setShowNewClientInput(true)}>
              <UserPlus className="mr-3 h-5 w-5" />
              신규 의뢰인 등록
            </Button>
          ) : (
            <form onSubmit={handleNewClientSubmit} className="space-y-3 p-2 border rounded-lg">
              <label htmlFor="new-client" className="font-medium">
                신규 의뢰인 이름
              </label>
              <Input
                id="new-client"
                placeholder="예: 박영진"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowNewClientInput(false)}>
                  취소
                </Button>
                <Button type="submit" disabled={!newClientName.trim()}>
                  확인
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
