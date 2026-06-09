import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface MarkdownContentProps {
  readonly content: string;
  readonly className?: string;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  // Normalize both escaped and real newlines so markdown can render line breaks.
  const processedContent = content.replace(/\\n/g, "\n");

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-2 list-disc pl-5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 list-decimal pl-5 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
          a: ({ children, href }) => (
            <a href={href} className="text-[color:var(--link)] hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-[color:var(--code-bg)] px-1 py-0.5 text-[0.9em] text-[color:var(--ink)]">{children}</code>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}