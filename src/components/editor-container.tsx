import { useState } from "react";

import { useEditor } from "@tiptap/react";
import { Markdown } from "tiptap-markdown";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
import {CustomCodeBlockLowlight} from "../lib/editor/code-block";
import { Indent } from "../lib/editor/indent";

import "../editor.css"

export function EditorContainer() {
  const [body, setBody] = useState("Hello World!");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.extend({ inclusive: false }).configure({
        openOnClick: false,
      }),
      Markdown,
      CustomCodeBlockLowlight,
      Indent,
    ],
    content: body,
    onUpdate: ({ editor }) => {
      setBody(editor.getHTML())
    }
  })

  return (
    <div className="relative h-full w-full flex flex-col">
      {editor && <Toolbar editor={editor} />}
      <main className="flex-1 max-w-[648px] w-full mx-auto h-full flex flex-col">
        <Editor editor={editor} />
      </main>
    </div>
  )
}