'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[96px] text-sm text-white leading-relaxed',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  const btn = (action: () => void, active: boolean, label: string) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); action() }}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
        active ? 'text-white' : 'hover:text-white'
      }`}
      style={{ background: active ? 'var(--surface)' : 'transparent', color: active ? 'white' : 'var(--text-muted)' }}
    >
      {label}
    </button>
  )

  return (
    <div
      className="rounded-lg text-sm outline-none focus-within:ring-1 focus-within:ring-purple-500"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
    >
      <div
        className="flex items-center gap-1 px-2 py-1.5 flex-wrap"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {btn(() => editor?.chain().focus().toggleBold().run(), !!editor?.isActive('bold'), 'B')}
        {btn(() => editor?.chain().focus().toggleItalic().run(), !!editor?.isActive('italic'), 'I')}
        {btn(() => editor?.chain().focus().toggleStrike().run(), !!editor?.isActive('strike'), 'S')}
        {btn(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), !!editor?.isActive('heading', { level: 2 }), 'H2')}
        {btn(() => editor?.chain().focus().toggleBulletList().run(), !!editor?.isActive('bulletList'), '• List')}
        {btn(() => editor?.chain().focus().toggleOrderedList().run(), !!editor?.isActive('orderedList'), '1. List')}
        {btn(() => editor?.chain().focus().toggleBlockquote().run(), !!editor?.isActive('blockquote'), '❝')}
        {btn(() => editor?.chain().focus().toggleCode().run(), !!editor?.isActive('code'), '<>')}
        {btn(() => editor?.chain().focus().setHardBreak().run(), false, '↵')}
      </div>
      <div className="px-3 py-2">
        {!editor?.getText() && !editor?.isFocused && placeholder && (
          <p className="text-xs pointer-events-none absolute" style={{ color: 'var(--text-muted)' }}>{placeholder}</p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
