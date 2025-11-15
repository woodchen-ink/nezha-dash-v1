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

      {/* 暗色叠加层 - 增强对比度 */}
      <div className="fixed inset-0 -z-10 bg-black/20 dark:bg-black/40" />
    </>
  )
}
