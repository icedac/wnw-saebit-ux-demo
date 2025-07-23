"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginScreenProps {
  onLoginSuccess: (userName: string) => void
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [id, setId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 데모용이므로 아무 값이나 입력하면 로그인 성공 처리
    // 아이디를 입력했다면 해당 아이디를, 아니면 '사용자'를 이름으로 사용
    onLoginSuccess(id.trim() || "사용자")
  }

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <Card>
        <CardHeader className="text-center">
          <Image
            src="/logo-new.png"
            alt="원앤위너스 법률사무소 로고"
            width={180}
            height={45}
            className="mx-auto mb-4 object-contain"
          />
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>서비스를 이용하려면 로그인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">아이디</Label>
              <Input id="id" placeholder="아이디를 입력하세요" value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" placeholder="비밀번호를 입력하세요" />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
