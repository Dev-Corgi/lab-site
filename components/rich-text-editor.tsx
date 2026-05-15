"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Underline as UnderlineIcon,
  Link2,
  Undo2,
  Redo2,
} from "lucide-react";

export interface RichTextEditorProps {
  /** 에디터 인스턴스를 분리할 때(언어 탭 전환 등) 변경 */
  editorKey: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ editorKey, value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          HTMLAttributes: { class: "text-primary underline underline-offset-2 hover:text-sky-700" },
        }),
        Placeholder.configure({
          placeholder: placeholder ?? "내용을 입력하세요…",
        }),
      ],
      content: value || "",
      editorProps: {
        attributes: {
          class:
            "min-h-[220px] px-3 py-2.5 text-sm text-foreground focus:outline-none [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_p]:text-muted-foreground [&_li]:my-0.5",
        },
      },
      onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    },
    [editorKey],
  );

  if (!editor) {
    return (
      <div className="rounded-lg border border-border bg-muted/40 min-h-[280px] animate-pulse" />
    );
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btn = (active: boolean) =>
    `rounded-md p-1.5 transition-colors ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/50 px-2 py-1.5">
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="굵게">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="기울임">
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()} aria-label="밑줄">
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <span className="w-px h-4 bg-border mx-0.5" />
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="제목 2">
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="제목 3">
          <Heading3 className="h-4 w-4" />
        </button>
        <span className="w-px h-4 bg-border mx-0.5" />
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="글머리 기호">
          <List className="h-4 w-4" />
        </button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="번호 목록">
          <ListOrdered className="h-4 w-4" />
        </button>
        <span className="w-px h-4 bg-border mx-0.5" />
        <button type="button" className={btn(editor.isActive("link"))} onClick={setLink} aria-label="링크">
          <Link2 className="h-4 w-4" />
        </button>
        <span className="w-px h-4 bg-border mx-0.5" />
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()} aria-label="실행 취소">
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()} aria-label="다시 실행">
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="max-h-[min(50vh,420px)] overflow-y-auto" />
    </div>
  );
}
