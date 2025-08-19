import { useRef, useEffect } from 'react'

type ShinySparklesProps = {
  isVisible: boolean
  onAnimationEnd: () => void
}

export default function ShinySparkles({
  isVisible,
  onAnimationEnd,
}: ShinySparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const processFrame = (
    context: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
  ) => {
    if (video.paused || video.ended) return

    // CROP SMALLER CENTER AREA TO MAKE SPARKLES BIGGER
    const cropSize = 500 // SMALLER CROP = BIGGER SPARKLES
    const cropX = (1280 - cropSize) / 2 // CENTER HORIZONTALLY
    const cropY = (720 - cropSize) / 2 // CENTER VERTICALLY

    context.drawImage(
      video,
      cropX,
      cropY,
      cropSize,
      cropSize, // SOURCE: SMALLER CENTER AREA
      0,
      0,
      canvas.width,
      canvas.height, // DESTINATION: FULL CANVAS
    )

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // CHROMA KEY: REMOVE BLUE BACKGROUND
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // DETECT BLUE PIXELS (ADJUST THRESHOLD AS NEEDED)
      if (b > 100 && b > r + 50 && b > g + 50) {
        data[i + 3] = 0 // MAKE TRANSPARENT
      }
    }

    context.putImageData(imageData, 0, 0)

    requestAnimationFrame(() => processFrame(context, video, canvas))
  }

  const handleVideoPlay = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video) return

    const context = canvas.getContext('2d')

    if (!context) return

    processFrame(context, video, canvas)
  }

  const handleVideoLoadedData = () => {
    if (videoRef.current) {
      videoRef.current.volume = 0.3
      videoRef.current.currentTime = 0.6
    }
  }

  // STOP ANIMATION WHEN NOT VISIBLE
  useEffect(() => {
    if (!isVisible && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0.6
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className='hidden'
        onEnded={onAnimationEnd}
        onLoadedData={handleVideoLoadedData}
        onPlay={handleVideoPlay}
      >
        <source src='/assets/videos/shiny-sparkles.mp4' type='video/mp4' />
      </video>

      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className='absolute inset-0 w-full h-full object-contain z-10 pointer-events-none'
      />
    </>
  )
}
