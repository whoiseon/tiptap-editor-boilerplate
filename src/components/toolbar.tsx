import { Fragment, useMemo, type ComponentProps, type PropsWithChildren, type ReactNode } from "react"
import type { Editor as TiptapEditor } from "@tiptap/react"

import { Icon } from "../lib/icons"
import { cn } from "../lib/utils";

interface ToolbarProps {
  editor: TiptapEditor
}

interface ToolbarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  action: () => void;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
  group?: string;
}

export function Toolbar({ editor }: ToolbarProps) {
  const TOOLBAR_ITEMS: ToolbarItem[] = useMemo(() => {
    return [
      {
        id: "heading2",
        label: "Heading 2",
        icon: <Icon.heading2 className="size-5" />,
        action: () => {
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        },
        isActive: () => editor.isActive("heading", { level: 2 }),
        isDisabled: () => !editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
        group: "heading"
      },
      {
        id: "heading3",
        label: "Heading 3",
        icon: <Icon.heading3 className="size-5" />,
        action: () => {
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        },
        isActive: () => editor.isActive("heading", { level: 3 }),
        isDisabled: () => !editor.can().chain().focus().toggleHeading({ level: 3 }).run(),
        group: "heading"
      },
      {
        id: "bold",
        label: "Bold",
        icon: <Icon.bold className="size-4" />,
        action: () => {
          editor.chain().focus().toggleBold().run()
        },
        isActive: () => editor.isActive("bold"),
        isDisabled: () => !editor.can().chain().focus().toggleBold().run(),
        group: "text"
      },
      {
        id: "italic",
        label: "Italic",
        icon: <Icon.italic className="size-4" />,
        action: () => {
          editor.chain().focus().toggleItalic().run()
        },
        isActive: () => editor.isActive("italic"),
        isDisabled: () => !editor.can().chain().focus().toggleItalic().run(),
        group: "text"
      },
      {
        id: "strikethrough",
        label: "Strikethrough",
        icon: <Icon.strikethrough className="size-4" />,
        action: () => {
          editor.chain().focus().toggleStrike().run()
        },
        isActive: () => editor.isActive("strike"),
        isDisabled: () => !editor.can().chain().focus().toggleStrike().run(),
        group: "text"
      },
      {
        id: "bulletList",
        label: "Bullet List",
        icon: <Icon.bulletList className="size-4" />,
        action: () => {
          editor.chain().focus().toggleBulletList().run()
        },
        isActive: () => editor.isActive("bulletList"),
        group: "list"
      },
      {
        id: "numberedList",
        label: "Numbered List",
        icon: <Icon.numberedList className="size-4" />,
        action: () => {
          editor.chain().focus().toggleOrderedList().run()
        },
        isActive: () => editor.isActive("orderedList"),
        group: "list"
      },
      {
        id: "link",
        label: "Link",
        icon: <Icon.link className="size-4" />,
        action: () => {
          const href = prompt("Enter the URL", "https://");
          const text = prompt("Enter the text", "Some Text");
    
          if (!href || !text) return;
    
          const { state } = editor;
          const { selection } = state;
          const { from, to } = selection;
          const { $from } = selection;
    
          const isTextSelected = from < to;
          const nodeAtSelection = $from.node();
          let tr;
    
          // 드래그 한 후 텍스트 선택 시
          if (
            nodeAtSelection &&
            nodeAtSelection.type.name !== "codeBlock" &&
            isTextSelected
          ) {
            tr = state.tr.deleteSelection();
            tr = state.tr.insertText(text as string);
    
            const linkMarkType = state.schema.marks.link;
            const linkMark = linkMarkType.create({ href });
            // 새로 넣은 텍스트 시작 위치(from)부터 끝 위치(to)를 링크로 변경
            tr = tr.addMark(from, from + (text as string).length, linkMark);
    
            editor.view.dispatch(tr);
          } else if (nodeAtSelection.type.name !== "codeBlock") {
            editor
              .chain()
              .focus()
              .setLink({ href })
              .insertContent(text)
              .run();
          }
        },
        isActive: () => editor.isActive("link"),
        group: "actions"
      },
      {
        id: "newLine",
        label: "New Line",
        icon: <Icon.horizontalRule className="size-4" />,
        action: () => {
          editor.chain().focus().setHorizontalRule().run()
        },
        group: "actions"
      }
    ]
  }, [editor])
  
  const groupedItems = useMemo(() => {
    return TOOLBAR_ITEMS.reduce((groups, item) => {
      const group = item.group || 'default'
      if (!groups[group]) groups[group] = []
      groups[group].push(item)
      return groups
    }, {} as Record<string, ToolbarItem[]>)
  }, [TOOLBAR_ITEMS])

  return (
    <div className="sticky top-0 z-10 bg-stone-900 backdrop-blur-xl border-b border-stone-800 w-full h-11 overflow-x-auto flex items-center justify-start md:justify-center gap-1 px-2 overscroll-contain">
      <div className="flex items-center gap-2.5">
        {Object.entries(groupedItems).map(([groupName, items], groupIndex) => (
          <Fragment key={groupName}>
            <ButtonGroup>
            {items.map((item) => (
                <ToolbarButton
                  key={item.id}
                  item={item}
                />
              ))}
            </ButtonGroup>
            {groupIndex < Object.keys(groupedItems).length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function ToolbarButton({ item }: { item: ToolbarItem }) {
  const isActive = item.isActive?.() ?? false
  const isDisabled = item.isDisabled?.() ?? false

  return (
    <Button
      onClick={() => item.action()}
      disabled={isDisabled}
      active={isActive}
      title={item.label}
    >
      {item.icon || item.label}
    </Button>
  )
}

function ButtonGroup({children}: PropsWithChildren) {
  return (
    <div className="flex items-center gap-1">
      {children}
    </div>
  )
}

function Separator() {
  return (
    <div className="w-px h-4 bg-stone-700" />
  )
}

interface ButtonProps extends ComponentProps<"button"> {
  active?: boolean
}

function Button({ children, active, ...props }: ButtonProps) {
  return (
    <button className={cn("h-8 w-8 cursor-pointer rounded-md flex items-center justify-center text-stone-400 hover:text-stone-100 hover:bg-stone-800 focus:text-stone-100 focus:outline-none transition-colors", active && "bg-stone-800 text-stone-100")} {...props}>
      {children}
    </button>
  )
}