"use client"

import type React from "react"

import { useState, useCallback, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  UploadCloud,
  FileText,
  ScanSearch,
  FileSignature,
  CheckCircle,
  RefreshCw,
  Download,
  Loader2,
  ShieldCheck,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  XCircle,
  CheckCircle2,
  PlusCircle,
  Trash2,
} from "lucide-react"
import { AiDownloadModal } from "./ai-download-modal"

interface MiracleDemoProps {
  clientName: string
  onGoBack: () => void
}

type Stage = "selectingFile" | "uploading" | "processing" | "extracting" | "generating" | "complete"

const stageConfig = {
  uploading: {
    icon: UploadCloud,
    title: "서류 업로드 중...",
    description: "파일을 안전하게 서버로 전송하고 있습니다.",
    log: "[DEMO LOG] Stage 1: Upload Started.",
  },
  processing: {
    icon: ScanSearch,
    title: "AI 텍스트 변환 중...",
    description: "이미지와 문서를 텍스트로 변환하고 있습니다.",
    log: "[DEMO LOG] Stage 2: AI Text Conversion. Confidence: 95%.",
  },
  extracting: {
    icon: FileSignature,
    title: "핵심 정보 분류 및 추출 중...",
    description: "AI가 서류를 분석하여 핵심 데이터를 추출합니다.",
    log: "[DEMO LOG] Stage 3: Classification & Extraction. Extracted: [채무자: 홍길동, 계좌: 123-456-789]",
  },
  generating: {
    icon: FileText,
    title: "문서 초안 생성 중...",
    description: "추출된 정보로 최종 문서를 자동 생성합니다.",
    log: "[DEMO LOG] Stage 4: Draft Generation.",
  },
}

const getIconForFileType = (type: string): React.ElementType => {
  if (type.startsWith("image/")) return FileImage
  if (type === "application/pdf") return FileIcon
  if (
    type === "application/vnd.ms-excel" ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return FileSpreadsheet
  return FileText
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function MiracleDemo({ clientName, onGoBack }: MiracleDemoProps) {
  const [stage, setStage] = useState<Stage>("selectingFile")
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filesNeeded = 10
  const hasCorrectFileCount = useMemo(() => selectedFiles.length === filesNeeded, [selectedFiles.length])

  const handleFileChange = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    setSelectedFiles((prevFiles) => {
      const combined = [...prevFiles, ...newFiles]
      const unique = combined.filter(
        (file, index, self) => index === self.findIndex((f) => f.name === file.name && f.size === file.size),
      )
      return unique.slice(0, filesNeeded)
    })
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const startProcess = useCallback(() => {
    if (stage !== "selectingFile" || !hasCorrectFileCount) return

    const stages: Stage[] = ["uploading", "processing", "extracting", "generating"]
    let currentStageIndex = 0

    console.log("==================== One-Button Miracle Demo Start ====================")

    const nextStage = () => {
      if (currentStageIndex < stages.length) {
        const currentStageKey = stages[currentStageIndex]
        setStage(currentStageKey)
        console.log(stageConfig[currentStageKey].log)
        currentStageIndex++
        setTimeout(nextStage, 2000)
      } else {
        setStage("complete")
        console.log("[DEMO LOG] Complete! Mock documents are ready.")
        console.log("=====================================================================")
      }
    }

    nextStage()
  }, [stage, hasCorrectFileCount])

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    if (stage === "selectingFile") {
      setIsDragging(isEntering)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false)
    handleFileChange(e.dataTransfer.files)
  }

  if (stage === "selectingFile") {
    return (
      <div className="w-full max-w-2xl animate-fade-in">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files)}
          multiple
          className="hidden"
        />
        <Card
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <CardHeader className="text-center">
            <p className="text-sm text-gray-500">현재 의뢰인</p>
            <h2 className="text-3xl font-bold text-blue-600 tracking-tight">{clientName}</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">서류 업로드</CardTitle>
              <div className="flex items-center gap-2">
                <span
                  className={cn("font-bold", hasCorrectFileCount ? "text-green-600" : "text-red-600")}
                >{`${selectedFiles.length} / ${filesNeeded}`}</span>
                {hasCorrectFileCount ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
            <CardDescription className="mb-4">
              진행하려면 {filesNeeded}개의 서류를 모두 업로드해야 합니다.
            </CardDescription>
            <ScrollArea
              className={cn("h-64 border rounded-md p-2 transition-colors", isDragging && "border-blue-500 bg-blue-50")}
            >
              {selectedFiles.length > 0 ? (
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => {
                    const Icon = getIconForFileType(file.type)
                    return (
                      <li
                        key={`${file.name}-${file.lastModified}`}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg animate-fade-in"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span className="font-medium text-sm truncate" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <UploadCloud className="w-10 h-10 mb-2" />
                  <span>파일을 선택하거나 여기에 드래그 앤 드롭하세요.</span>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <PlusCircle className="w-4 h-4 mr-2" />
              파일 선택
            </Button>
            <Button size="lg" onClick={startProcess} disabled={!hasCorrectFileCount}>
              선택 완료 및 진행
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (stage === "complete") {
    return (
      <div className="w-full max-w-2xl text-center animate-fade-in">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">{clientName} 님 서류 생성 완료!</h2>
        <p className="text-gray-600 mb-8">AI가 생성한 문서 초안을 확인하고 다운로드하세요.</p>

        <div className="flex justify-center gap-4">
          <AiDownloadModal clientName={clientName}>
            <Button size="lg">
              <Download className="mr-2 h-4 w-4" />
              초안 파일 다운로드
            </Button>
          </AiDownloadModal>
          <Button size="lg" variant="outline" onClick={onGoBack}>
            <RefreshCw className="mr-2 h-4 w-4" />
            다른 의뢰인으로 시작
          </Button>
        </div>
      </div>
    )
  }

  const currentStage = stageConfig[stage as keyof typeof stageConfig]
  const Icon = currentStage.icon

  return (
    <div className="w-full max-w-md text-center animate-fade-in">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <Loader2 className="w-24 h-24 text-blue-200 animate-spin-slow" />
        <Icon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{currentStage.title}</h2>
      <p className="text-gray-600 mb-4">{currentStage.description}</p>
      {stage === "processing" && (
        <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
          AI 기반 95% 정확도
        </div>
      )}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded-full animate-pulse">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        <span>보안 처리 중...</span>
      </div>
    </div>
  )
}
