import { useBackground } from "@/hooks/use-background"
import { useEffect, useState } from "react"

export default function DynamicBackground() {
  const { backgroundImage } = useBackground()
  const [randomImage, setRandomImage] = useState<string | null>(null)

  // 如果用户设置了自定义背景图,使用自定义图
  // 否则使用随机图
  useEffect(() => {
    if (!backgroundImage) {
      // 使用随机图API
      const randomImageUrl = `https://random-api.czl.net/pic/ecy?timestamp=${Date.now()}`
      setRandomImage(randomImageUrl)
    } else {
      setRandomImage(null)
    }
  }, [backgroundImage])

  const finalBackgroundImage = backgroundImage || randomImage

  return (
    <>
      {/* 背景图层 */}
      {finalBackgroundImage && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${finalBackgroundImage})`,
          }}
        />
      )}

      {/* 渐变动画层 - 液态玻璃效果 */}
      <div className="fixed inset-0 -z-10 bg-gradient-animated">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-400/20 via-emerald-400/20 to-yellow-400/20 animate-gradient-shift-reverse" />
      </div>

      {/* 动态SVG渐变背景 */}
      <svg className="fixed inset-0 -z-10 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="liquid-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#667eea; #764ba2; #f093fb; #667eea" dur="10s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#764ba2; #f093fb; #667eea; #764ba2" dur="10s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <linearGradient id="liquid-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#4facfe; #00f2fe; #43e97b; #4facfe" dur="15s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#00f2fe; #43e97b; #4facfe; #00f2fe" dur="15s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>

        {/* 液态流动的圆形 */}
        <g filter="url(#goo)">
          <circle cx="20%" cy="30%" r="15%" fill="url(#liquid-gradient-1)">
            <animate attributeName="cx" values="20%; 80%; 20%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="cy" values="30%; 70%; 30%" dur="25s" repeatCount="indefinite" />
            <animate attributeName="r" values="15%; 20%; 15%" dur="18s" repeatCount="indefinite" />
          </circle>

          <circle cx="80%" cy="70%" r="18%" fill="url(#liquid-gradient-2)">
            <animate attributeName="cx" values="80%; 20%; 80%" dur="25s" repeatCount="indefinite" />
            <animate attributeName="cy" values="70%; 30%; 70%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="r" values="18%; 12%; 18%" dur="22s" repeatCount="indefinite" />
          </circle>

          <circle cx="50%" cy="50%" r="12%" fill="url(#liquid-gradient-1)" opacity="0.6">
            <animate attributeName="cx" values="50%; 30%; 70%; 50%" dur="30s" repeatCount="indefinite" />
            <animate attributeName="cy" values="50%; 80%; 20%; 50%" dur="28s" repeatCount="indefinite" />
            <animate attributeName="r" values="12%; 18%; 10%; 12%" dur="20s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      {/* 暗色叠加层 - 增强对比度 */}
      <div className="fixed inset-0 -z-10 bg-black/20 dark:bg-black/40" />
    </>
  )
}
