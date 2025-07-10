import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Flame, Sun, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Reactions from './Reactions'

export type Post = {
  id: string
  created_at: string
  content: string
  category: string
}

export default function PostCard({ post }: { post: Post }) {
  const isRant = post.category === 'Rant'
  const createdAt = new Date(post.created_at)
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })
  
  return (
    <Card className={cn(
      'post-card-animation overflow-hidden',
      isRant ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-500'
    )}>
      <div className="px-4 py-2 flex items-center gap-2">
        <div 
          className={cn(
            "rounded-full text-white flex items-center justify-center px-3 py-1",
            isRant ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-500"
          )}
        >
          {isRant ? (
            <span className="flex items-center gap-1.5">
              <Flame size={14} /> Rant
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Sun size={14} /> Perfect Day
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center text-gray-500 text-sm">
          <Clock size={14} className="mr-1" />
          {timeAgo}
        </div>
      </div>
      <CardContent className="pt-3 pb-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        <Reactions postId={post.id} />
      </CardContent>
    </Card>
  )
} 