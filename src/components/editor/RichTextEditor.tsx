'use client'

interface Props {
  value: string
  onChange: (markdown: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative">
      <textarea
        className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-purple-500 resize-none font-mono"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        rows={5}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <a
        href="https://www.markdownguide.org/basic-syntax/"
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute top-2 right-2"
        title="Markdown supported"
      >
        <span
          className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold cursor-pointer select-none transition-colors"
          style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
        >
          ?
        </span>
        <span
          className="absolute right-0 top-6 hidden group-hover:block text-xs rounded-md px-2 py-1 whitespace-nowrap z-10 pointer-events-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          Markdown supported — click to learn more
        </span>
      </a>
    </div>
  )
}
