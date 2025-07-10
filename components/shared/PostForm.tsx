'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Send, Flame, Sun } from 'lucide-react'

export default function PostForm() {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Rant')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ content, category }])

      if (error) throw error

      // Reset form on success
      setContent('')
      setCategory('Rant')
      setSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to submit post')
      console.error('Error submitting post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Textarea
        placeholder="Share a rant or a perfect day..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        disabled={isSubmitting}
        className="min-h-32 text-base resize-none"
      />
      
      <div>
        <p className="font-medium mb-2">Post Type</p>
        <RadioGroup
          defaultValue="Rant"
          value={category}
          onValueChange={setCategory}
          className="flex gap-4"
          disabled={isSubmitting}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Rant" id="rant" />
            <Label htmlFor="rant" className="flex items-center gap-1.5 cursor-pointer">
              <Flame size={16} className="text-red-500" /> Rant
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Perfect Day" id="perfect-day" />
            <Label htmlFor="perfect-day" className="flex items-center gap-1.5 cursor-pointer">
              <Sun size={16} className="text-amber-500" /> Perfect Day
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">Post submitted successfully!</p>}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-400 hover:bg-blue-500 text-white py-6"
      >
        <Send size={18} className="mr-2" />
        {isSubmitting ? 'Sharing...' : 'Share Anonymously'}
      </Button>
    </form>
  )
} 