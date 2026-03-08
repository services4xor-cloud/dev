export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-brand-orange rounded-2xl animate-pulse" />
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    </div>
  )
}
