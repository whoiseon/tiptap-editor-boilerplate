import { EditorContent, type Editor as TiptapEditor } from "@tiptap/react"

interface EditorProps {
  editor: TiptapEditor
}

export function Editor({ editor }: EditorProps) {
  return (
    <div className="flex-1 p-12">
      <EditorContent editor={editor} />
    </div>
  )
}