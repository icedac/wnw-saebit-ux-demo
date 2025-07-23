import Image from "next/image"

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in-out">
      <Image
        src="/logo-new.png"
        alt="원앤위너스 법률사무소 로고"
        width={240}
        height={60}
        className="object-contain"
        priority
      />
      <h1 className="text-3xl font-bold text-gray-800 mt-4">원앤위너스</h1>
      <p className="text-gray-500 mt-2">승소, 그 이상</p>
    </div>
  )
}
