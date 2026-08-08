'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function BioRichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'outline-none text-sm text-white leading-relaxed min-h-[60px]' },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  const active = (name: string, attrs?: Record<string, unknown>) => !!editor?.isActive(name, attrs)
  const btn = (label: string, action: () => void, isActive: boolean) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); action() }}
      className="px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors"
      style={{ background: isActive ? 'var(--surface)' : 'transparent', color: isActive ? 'white' : 'var(--text-muted)' }}
    >
      {label}
    </button>
  )

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-0.5 px-1.5 py-1 flex-wrap" style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
        {btn('B', () => editor?.chain().focus().toggleBold().run(), active('bold'))}
        {btn('I', () => editor?.chain().focus().toggleItalic().run(), active('italic'))}
        {btn('S', () => editor?.chain().focus().toggleStrike().run(), active('strike'))}
        {btn('H2', () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active('heading', { level: 2 }))}
        {btn('•', () => editor?.chain().focus().toggleBulletList().run(), active('bulletList'))}
        {btn('1.', () => editor?.chain().focus().toggleOrderedList().run(), active('orderedList'))}
        {btn('❝', () => editor?.chain().focus().toggleBlockquote().run(), active('blockquote'))}
        {btn('<>', () => editor?.chain().focus().toggleCode().run(), active('code'))}
      </div>
      <div className="px-2.5 py-2" style={{ background: 'var(--surface-2)' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
