import { AnimatePresence, motion } from 'framer-motion'
import type { Article } from '../data/articles'
import { formatArticleTimestamp } from '../utils/formatters'
import { CloseIcon, ExternalIcon } from './Icons'

interface ReaderSheetProps {
  article: Article | null
  onClose: () => void
}

export function ReaderSheet({ article, onClose }: ReaderSheetProps) {
  return (
    <AnimatePresence>
      {article ? (
        <motion.div
          key={article.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-end bg-slate-950/28 px-3 pb-3 pt-10 backdrop-blur-sm md:items-center md:justify-center md:px-6 md:py-8"
          onClick={onClose}
        >
          <motion.section
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="flex max-h-[88svh] w-full flex-col overflow-hidden rounded-lg bg-white shadow-card md:max-w-[390px]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Reader preview"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 pb-4 pt-5">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-muted">
                  <span className="rounded-full bg-accentSoft px-2 py-1 font-semibold text-accent">
                    {article.source}
                  </span>
                  <span>{formatArticleTimestamp(article.timestamp)}</span>
                </div>
                <h2 className="mt-3 pr-4 text-[1.35rem] font-semibold leading-tight tracking-tight text-ink">
                  {article.headline}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-muted transition hover:border-slate-300 hover:bg-slate-50"
                aria-label="Close reader"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto px-5 pb-5 pt-4">
              {article.imageUrl ? (
                <div className="overflow-hidden rounded-lg border border-slate-100">
                  <img src={article.imageUrl} alt="" className="h-48 w-full object-cover" />
                </div>
              ) : null}

              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                {article.body.split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 px-5 pb-5 pt-4">
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-accent"
              >
                Open original
                <ExternalIcon className="h-4 w-4" />
              </a>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
