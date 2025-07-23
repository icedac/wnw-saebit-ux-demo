"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, FileText, File, Loader2, Package, FileArchive } from "lucide-react"
import saveAs from "file-saver"
import JSZip from "jszip"
import jsPDF from "jspdf"

interface AiDownloadModalProps {
  clientName: string
  children: React.ReactNode
}

const fileList = [
  "소득금액증명원(최근5년)",
  "사업자등록증명원",
  "폐업사실증명원",
  "납세증명서",
  "부가가치세과세표준증명원",
  "소득세납부내역",
  "지방세납세증명서",
  "세목별과세증명서",
  "근로소득원천징수영수증",
  "소득확인증명서",
  "주민등록등본",
  "주민등록초본(5년이상주소변동포함)",
  "가족관계증명서(상세)",
  "혼인관계증명서(상세)",
  "기본증명서(상세)",
  "토지대장",
  "건축물대장",
  "자동차등록원부",
  "지방세세목별과세증명서",
  "국민연금가입증명서",
]

export function AiDownloadModal({ clientName, children }: AiDownloadModalProps) {
  const [isZipping, setIsZipping] = useState(false)
  const fullFileList = fileList.map((file) => `${clientName}_${file}`)

  const generateDummyContent = (filename: string) => {
    return `${filename}\n\n이 문서는 AI에 의해 자동 생성된 테스트 문서입니다.\n\n의뢰인: ${clientName}\n생성일: ${new Date().toLocaleString()}\n\n내용은 데모용 샘플입니다.`
  }

  const handleDownload = (filename: string, format: "txt" | "pdf" | "hwp") => {
    const content = generateDummyContent(filename)

    if (format === "txt") {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      saveAs(blob, `${filename}.txt`)
    } else if (format === "pdf") {
      const doc = new jsPDF()
      doc.addFont("/fonts/MaruBuri-Regular.ttf", "MaruBuri", "normal")
      doc.setFont("MaruBuri")

      const lines = doc.splitTextToSize(content, 180)
      doc.text(lines, 15, 20)
      doc.save(`${filename}.pdf`)
    } else if (format === "hwp") {
      // HWP 파일 생성은 브라우저에서 직접 지원되지 않으므로,
      // TXT 파일에 .hwp 확장자를 붙여 다운로드하는 방식으로 모의 구현합니다.
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      saveAs(blob, `${filename}.hwp`)
    }
  }

  const handleDownloadAllZip = async () => {
    setIsZipping(true)
    const zip = new JSZip()

    fullFileList.forEach((filename) => {
      const content = generateDummyContent(filename)
      zip.file(`${filename}.txt`, content)
    })

    try {
      const zipBlob = await zip.generateAsync({ type: "blob" })
      saveAs(zipBlob, `${clientName}_전체서류.zip`)
    } catch (error) {
      console.error("ZIP 파일 생성 중 오류 발생:", error)
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">AI 생성 서류 다운로드</DialogTitle>
          <DialogDescription>
            {clientName} 님의 서류가 생성되었습니다. 원하는 형식으로 다운로드하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex flex-col min-h-0">
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {fullFileList.map((filename) => (
                <Card key={filename}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      <File className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span className="flex-grow">{filename}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(filename, "txt")}>
                      <FileText className="w-4 h-4 mr-2" /> TXT 다운로드
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(filename, "pdf")}>
                      <Download className="w-4 h-4 mr-2" /> PDF 다운로드
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(filename, "hwp")}>
                      <Package className="w-4 h-4 mr-2" /> HWP 다운로드
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button size="lg" className="w-full sm:w-auto" onClick={handleDownloadAllZip} disabled={isZipping}>
            {isZipping ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileArchive className="w-5 h-5 mr-2" />}
            전체 서류 .zip으로 다운로드
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
