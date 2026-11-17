import { useEffect, useRef, useState } from 'react'
import { asset, pageHref, type Card, type Page, type WaitlistMode } from './content'
import { LinkedPage } from './Pages'
import type { Channel, ChannelId, Chip } from './session'

const studioSmsNumber = '(312) 555-0142'

export function Phone({
  channel,
  label,
  clock,
  stamp,
  state,
  mode,
  onOpen,
  onBack,
  onChip,
  onWaitlist,
  onWaiver,
}: {
  channel: ChannelId
  label: string
  clock: string
  stamp: string
  state: Channel
  mode: WaitlistMode
  onOpen: (page: Page) => void
  onBack: () => void
  onChip: (id: string) => void
  onWaitlist: (decision: 'accept' | 'pass') => void
  onWaiver: () => void
}) {
  const threadRef = useRef<HTMLDivElement>(null)
  const page = state.stack[state.stack.length - 1]

  useEffect(() => {
    if (page) return
    const node = threadRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [state.items, state.chips, page])

  return (
    <section className="phone-col" aria-label={label}>
      <h2 className="phone-label">{label}</h2>
      <div className={`device device-${channel}`}>
        <div className="screen">
          <div className="status">
            <span>{clock}</span>
            <span className="status-icons" aria-hidden="true">
              <span className="signal" />
              <span className="battery" />
            </span>
          </div>
          <header className={channel === 'sms' ? 'phone-head phone-head-sms' : 'phone-head'}>
            {channel === 'sms' ? (
              <strong>{studioSmsNumber}</strong>
            ) : (
              <>
                <img src={asset('studio-interior.jpg')} alt="" />
                <span>
                  <strong>Marlow</strong>
                  <span>River North</span>
                </span>
              </>
            )}
          </header>
          <div className="thread" ref={threadRef}>
            <p className="stamp">{stamp}</p>
            {state.items.map((item) => {
              if (item.type === 'text') {
                return (
                  <div key={item.id} className={`bubble from-${item.from} tone-${item.tone ?? 'plain'}`}>
                    <p>{item.body}</p>
                    {item.link ? (
                      <button
                        className="text-link"
                        onClick={() => onOpen(item.link!.page)}
                      >
                        {item.link.href}
                      </button>
                    ) : null}
                  </div>
                )
              }
              if (item.type === 'status') {
                return (
                  <p key={item.id} className="status-line" role="status">
                    {item.body}
                  </p>
                )
              }
              if (item.type === 'card') {
                return <RichCard key={item.id} card={item.card} onOpen={onOpen} />
              }
              return (
                <Carousel
                  key={item.id}
                  label={item.label}
                  cards={item.cards}
                  onOpen={onOpen}
                />
              )
            })}
          </div>
          <div className="composer">
            {state.chips.length > 0 ? (
              <div className="chips" role="group" aria-label="Suggested replies">
                {state.chips.map((chip) => (
                  <ChipButton key={chip.id} chip={chip} onChip={onChip} />
                ))}
              </div>
            ) : null}
            <div className="composer-bar" aria-hidden="true">
              {channel === 'sms' ? 'Text message' : 'RCS message'}
            </div>
          </div>
          {page ? (
            <Sheet
              page={page}
              canGoBack={state.stack.length > 1}
              onBack={onBack}
              channel={channel}
              mode={mode}
              waiverDone={state.waiverDone}
              onOpen={onOpen}
              onWaitlist={onWaitlist}
              onWaiver={onWaiver}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

function ChipButton({
  chip,
  onChip,
}: {
  chip: Chip
  onChip: (id: string) => void
}) {
  return (
    <button
      type="button"
      className={chip.emphasis ? 'chip emphasis' : 'chip'}
      disabled={chip.disabled}
      onClick={() => onChip(chip.id)}
    >
      {chip.label}
    </button>
  )
}

function RichCard({
  card,
  onOpen,
}: {
  card: Card
  onOpen: (page: Page) => void
}) {
  return (
    <article className="rich-card">
      {card.image ? (
        <img src={card.image} alt={card.imageAlt ?? ''} />
      ) : (
        <div className={`band band-${card.tone ?? 'sand'}`} />
      )}
      <div className="card-body">
        {card.kicker ? <p className="kicker">{card.kicker}</p> : null}
        {card.ended ? <p className="ended">Offer ended at 5:15 PM</p> : null}
        <h3>{card.title}</h3>
        {card.price ? <p className="card-price">{card.price}</p> : null}
        {card.lines.map((line) => (
          <p key={line} className="card-line">
            {line}
          </p>
        ))}
        {card.actions.length > 0 ? (
          <div className="card-actions">
            {card.actions.map((action, index) => (
              <button
                key={action.label}
                className={index === 0 ? 'card-button' : 'card-button quiet'}
                onClick={() => onOpen(action.page)}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

function Carousel({
  label,
  cards,
  onOpen,
}: {
  label: string
  cards: Card[]
  onOpen: (page: Page) => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const suppressClick = useRef(false)
  const [index, setIndex] = useState(0)

  function go(next: number) {
    const node = scroller.current
    const child = node?.children[next] as HTMLElement | undefined
    if (!node || !child) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollTo({ left: child.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
    setIndex(next)
  }

  function syncIndex() {
    const node = scroller.current
    if (!node) return
    let nearest = 0
    let best = Number.POSITIVE_INFINITY
    Array.from(node.children).forEach((child, childIndex) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - node.scrollLeft)
      if (distance < best) {
        best = distance
        nearest = childIndex
      }
    })
    setIndex(nearest)
  }

  return (
    <div className="carousel">
      <div className="carousel-bar">
        <p>
          {index + 1} of {cards.length}
        </p>
        <div>
            <button
            type="button"
            aria-label={`Previous ${label}`}
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            Prev
          </button>
          <button
            type="button"
            aria-label={`Next ${label}`}
            disabled={index === cards.length - 1}
            onClick={() => go(index + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <div
        className="carousel-track"
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label={label}
        onScroll={syncIndex}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            go(Math.min(index + 1, cards.length - 1))
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            go(Math.max(index - 1, 0))
          }
        }}
        onPointerDown={(event) => {
          const node = scroller.current
          if (!node || (event.target as HTMLElement).closest('button')) return
          node.dataset.dragX = String(event.clientX)
          node.dataset.dragLeft = String(node.scrollLeft)
          node.dataset.dragMoved = '0'
          node.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const node = scroller.current
          if (!node || node.dataset.dragX == null || !node.hasPointerCapture(event.pointerId)) return
          const start = Number(node.dataset.dragX)
          const delta = event.clientX - start
          if (Math.abs(delta) > 6) node.dataset.dragMoved = '1'
          node.scrollLeft = Number(node.dataset.dragLeft) - delta
        }}
        onPointerUp={(event) => {
          const node = scroller.current
          if (!node) return
          if (node.dataset.dragMoved === '1') suppressClick.current = true
          delete node.dataset.dragX
          node.releasePointerCapture(event.pointerId)
        }}
        onClickCapture={(event) => {
          if (!suppressClick.current) return
          event.preventDefault()
          event.stopPropagation()
          suppressClick.current = false
        }}
      >
        {cards.map((card) => (
          <div className="carousel-slide" key={card.id}>
            <RichCard card={card} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  )
}

function Sheet({
  page,
  canGoBack,
  onBack,
  channel,
  mode,
  waiverDone,
  onOpen,
  onWaitlist,
  onWaiver,
}: {
  page: Page
  canGoBack: boolean
  onBack: () => void
  channel: ChannelId
  mode: WaitlistMode
  waiverDone: boolean
  onOpen: (page: Page) => void
  onWaitlist: (decision: 'accept' | 'pass') => void
  onWaiver: () => void
}) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const onBackRef = useRef(onBack)
  onBackRef.current = onBack
  const titleId = `${channel}-sheet-title`

  useEffect(() => {
    const node = sheetRef.current
    if (!node) return
    const close = node.querySelector<HTMLElement>('[data-sheet-close]')
    if (close && !node.contains(document.activeElement)) close.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onBackRef.current()
        return
      }
      if (event.key !== 'Tab' || !node) return
      const focusable = Array.from(
        node.querySelectorAll<HTMLElement>(
          'button, input, textarea, select, [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    node.addEventListener('keydown', onKey)
    return () => node.removeEventListener('keydown', onKey)
  }, [page])

  return (
    <div
      className="sheet"
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="urlbar">
        <button type="button" data-sheet-close onClick={onBack}>
          {canGoBack ? 'Back' : 'Close'}
        </button>
        <p id={titleId}>{pageHref(page)}</p>
      </div>
      <div className="sheet-body">
        <LinkedPage
          page={page}
          handlers={{ channel, mode, waiverDone, onOpen, onWaitlist, onWaiver }}
        />
      </div>
    </div>
  )
}
