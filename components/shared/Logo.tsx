import { Send } from 'lucide-react'

interface LogoProps {
  showSubtitle?: boolean;
}

export default function Logo({ showSubtitle = true }: LogoProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <div className="bg-blue-400 text-white p-2 rounded-full">
          <Send size={20} />
        </div>
        <span className="font-bold text-xl">Skywriter</span>
      </div>
      
      {showSubtitle && (
        <p className="text-sm text-gray-500 mt-1">
          Share your thoughts anonymously
        </p>
      )}
    </div>
  )
} 