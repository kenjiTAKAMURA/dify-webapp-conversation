import ReactMarkdown from 'react-markdown'
import React from 'react'
import 'katex/dist/katex.min.css'
import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierHeathLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { downloadFile } from '@/app/components/base/file-uploader-in-attachment/utils'
import type { VisionFile } from '@/types/app'
import { getFileNameFromUrl } from '@/app/components/base/file-uploader-in-attachment/utils'

export function Markdown(mdProps: { content: string; files?: VisionFile[] }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeKatex,
        ]}
        components={{
          a({ href, children, ...props }) {
            const url = String(href || '')
            const urlNoQuery = url.split('?')[0]
            const isTextLike = /\.(md|markdown)$/i.test(urlNoQuery)
            const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
              if (isTextLike) {
                e.preventDefault()
                const name = urlNoQuery.split('/').pop() || 'download.md'
                const downloadApi = `/api/file-download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(name)}`
                // Force download through our API to avoid CORS/auth issues
                const a = document.createElement('a')
                a.href = downloadApi
                a.download = name
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }
            }
            return (
              <a {...props} href={url} target="_self" rel="noreferrer" onClick={onClick}>
                {children}
              </a>
            )
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return (!inline && match)
              ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, '')}
                  style={atelierHeathLight}
                  language={match[1]}
                  showLineNumbers
                  PreTag="div"
                />
              )
              : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
          },
        }}
        linkTarget={'_blank'}
      >
        {mdProps.content}
      </ReactMarkdown>
    </div>
  )
}
