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

      {/* 暗色叠加层 - 增强对比度 */}
      <div className="fixed inset-0 -z-10 bg-black/20 dark:bg-black/40" />
    </>
  )
}
