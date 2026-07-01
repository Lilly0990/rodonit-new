// Рендерить YouTube або TikTok відео в блозі

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

export default function VideoEmbed({ url, caption }: { url: string; caption?: string | null }) {
  const ytId = extractYouTubeId(url)
  const isTikTok = url.includes('tiktok.com')

  if (!ytId && !isTikTok) return null

  return (
    <div className="my-6">
      {ytId && (
        <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={caption ?? 'YouTube відео'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
      {isTikTok && !ytId && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-sm text-gray-500">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">
            🎵 Переглянути TikTok відео →
          </a>
        </div>
      )}
      {caption && (
        <p className="text-xs text-gray-400 text-center mt-2 italic">{caption}</p>
      )}
    </div>
  )
}
