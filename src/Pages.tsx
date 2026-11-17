import { useEffect, useId, useRef, useState, type PointerEvent } from 'react'
import {
  asset,
  classSessions,
  copy,
  discoveryClassIds,
  guideItems,
  planOrder,
  plans,
  productOrder,
  products,
  studioAddress,
  type Page,
  type Product,
  type WaitlistMode,
} from './content'
import type { ChannelId } from './session'

type Handlers = {
  channel: ChannelId
  mode: WaitlistMode
  waiverDone: boolean
  onOpen: (page: Page) => void
  onWaitlist: (decision: 'accept' | 'pass') => void
  onWaiver: () => void
}

export function LinkedPage({ page, handlers }: { page: Page; handlers: Handlers }) {
  switch (page.kind) {
    case 'schedule':
      return <SchedulePage onOpen={handlers.onOpen} />
    case 'class':
      return <ClassPage classId={page.classId} />
    case 'offer':
      return (
        <OfferPage
          mode={handlers.mode}
          onOpen={handlers.onOpen}
          onWaitlist={handlers.onWaitlist}
        />
      )
    case 'survey':
      return <SurveyPage onOpen={handlers.onOpen} />
    case 'first-visit':
      return <FirstVisitPage onOpen={handlers.onOpen} />
    case 'waiver':
      return (
        <WaiverPage
          channel={handlers.channel}
          done={handlers.waiverDone}
          onWaiver={handlers.onWaiver}
        />
      )
    case 'directions':
      return <DirectionsPage />
    case 'guide':
      return <GuidePage />
    case 'plans':
      return <PlansPage onOpen={handlers.onOpen} />
    case 'plan':
      return <PlanPage planId={page.planId} />
    case 'shop':
      return <ShopPage onOpen={handlers.onOpen} />
    case 'product':
      return <ProductPage productId={page.productId} />
  }
}

function PageIntro({ title, lede }: { title: string; lede?: string }) {
  return (
    <header className="page-intro">
      <p className="page-brand">Marlow</p>
      <h3>{title}</h3>
      {lede ? <p>{lede}</p> : null}
    </header>
  )
}

function SchedulePage({ onOpen }: { onOpen: (page: Page) => void }) {
  return (
    <article className="web-page">
      <PageIntro
        title="This week at River North"
        lede="The same three classes from the text."
      />
      <ul className="choice-list">
        {discoveryClassIds.map((classId) => {
          const session = classSessions[classId]
          return (
            <li key={classId}>
              <button
                className="choice"
                onClick={() => onOpen({ kind: 'class', classId })}
              >
                <img src={session.image} alt="" />
                <span>
                  <strong>{session.format}</strong>
                  <span>{session.when}</span>
                  <span>{session.instructor}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

function ClassPage({ classId }: { classId: string }) {
  const session = classSessions[classId]
  const [stopped, setStopped] = useState(false)
  if (!session) return null

  return (
    <article className="web-page">
      <img className="hero" src={session.image} alt={session.imageAlt} />
      <PageIntro title={session.format} lede={session.blurb} />
      <dl className="facts">
        <div>
          <dt>When</dt>
          <dd>{session.when}</dd>
        </div>
        <div>
          <dt>Instructor</dt>
          <dd className="person">
            <img src={session.instructorImage} alt="" />
            {session.instructor}
          </dd>
        </div>
        <div>
          <dt>Length</dt>
          <dd>{session.duration}</dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>{session.location}</dd>
        </div>
        <div>
          <dt>Availability</dt>
          <dd>{session.spots}</dd>
        </div>
      </dl>
      {stopped ? (
        <p className="boundary" role="status">
          Next step is Marlow’s booking page, where you’d confirm this
          reservation. Nothing is booked yet.
        </p>
      ) : (
        <button className="page-primary" onClick={() => setStopped(true)}>
          Continue to book
        </button>
      )}
    </article>
  )
}

function OfferPage({
  mode,
  onOpen,
  onWaitlist,
}: {
  mode: WaitlistMode
  onOpen: (page: Page) => void
  onWaitlist: (decision: 'accept' | 'pass') => void
}) {
  const [checking, setChecking] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  if (mode === 'expired') {
    return (
      <article className="web-page">
        <PageIntro
          title="This offer has ended"
          lede="The 6:15 PM spot with Jordan Ellis closed at 5:15 PM. Nothing was booked."
        />
        <button
          className="page-primary"
          onClick={() => onOpen({ kind: 'class', classId: 'sculpt-tue' })}
        >
          View Tuesday’s class
        </button>
      </article>
    )
  }

  return (
    <article className="web-page">
      <img
        className="hero"
        src={asset('class-strength.jpg')}
        alt="People holding dumbbells in a wood-floor studio"
      />
      <PageIntro
        title="A spot is open"
        lede="Strength + cardio with Jordan Ellis, Monday at 6:15 PM, River North."
      />
      <p className="deadline">Accept by 5:15 PM.</p>
      {checking ? (
        <p className="boundary" role="status">
          {copy.checking}
        </p>
      ) : (
        <div className="page-actions">
          <button
            className="page-primary"
            onClick={() => {
              setChecking(true)
              timer.current = window.setTimeout(() => onWaitlist('accept'), 800)
            }}
          >
            Accept spot
          </button>
          <button className="page-quiet" onClick={() => onWaitlist('pass')}>
            Pass
          </button>
        </div>
      )}
    </article>
  )
}

function SurveyPage({ onOpen }: { onOpen: (page: Page) => void }) {
  const [rating, setRating] = useState<string | null>(null)
  const [detail, setDetail] = useState<string | null>(null)
  const [follow, setFollow] = useState<string | null>(null)
  const detailOptions = ['Class experience', 'Studio facilities', 'Booking experience']

  return (
    <article className="web-page">
      <PageIntro
        title="After class"
        lede="Jordan Ellis · Strength + cardio · Today, 6:15 PM. Two questions."
      />
      <ChoiceGroup
        label="How was class?"
        value={rating}
        options={['Loved it', 'It was okay', 'Could be better']}
        onChange={(value) => {
          setRating(value)
          setDetail(null)
          setFollow(null)
        }}
      />
      {rating === 'Loved it' ? (
        <ChoiceGroup
          label={copy.stoodOut}
          value={detail}
          options={['The instructor', 'The workout', 'The studio']}
          onChange={setDetail}
        />
      ) : null}
      {rating === 'It was okay' ? (
        <ChoiceGroup
          label={copy.okayAsk}
          value={detail}
          options={detailOptions}
          onChange={setDetail}
        />
      ) : null}
      {rating === 'Could be better' ? (
        <ChoiceGroup
          label={copy.improveAsk}
          value={detail}
          options={detailOptions}
          onChange={setDetail}
        />
      ) : null}
      {rating === 'Loved it' && detail ? (
        <div className="result-block">
          <p>{copy.loved}</p>
          <button
            className="page-primary"
            onClick={() => onOpen({ kind: 'class', classId: 'strength-thu-eve' })}
          >
            View class
          </button>
        </div>
      ) : null}
      {rating === 'It was okay' && detail ? (
        <p className="boundary" role="status">
          {copy.okay}
        </p>
      ) : null}
      {rating === 'Could be better' && detail ? (
        <ChoiceGroup
          label={copy.followAsk}
          value={follow}
          options={['Yes, please', 'No, thanks']}
          onChange={setFollow}
        />
      ) : null}
      {follow === 'Yes, please' ? (
        <p className="boundary" role="status">
          {copy.followYes}
        </p>
      ) : null}
      {follow === 'No, thanks' ? (
        <p className="boundary" role="status">
          {copy.followNo}
        </p>
      ) : null}
    </article>
  )
}

function ChoiceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | null
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <fieldset className="choice-group">
      <legend>{label}</legend>
      <div className="segment">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function FirstVisitPage({ onOpen }: { onOpen: (page: Page) => void }) {
  return (
    <article className="web-page">
      <img
        className="hero"
        src={asset('studio-interior.jpg')}
        alt="The Marlow River North studio in daylight"
      />
      <PageIntro
        title="Your first class is tomorrow"
        lede="Meet Jordan Ellis at 6:15 PM. Please arrive 15 minutes early so we can help you settle in."
      />
      <div className="page-actions">
        <button className="page-primary" onClick={() => onOpen({ kind: 'waiver' })}>
          Sign waiver
        </button>
        <button className="page-quiet" onClick={() => onOpen({ kind: 'directions' })}>
          Directions
        </button>
        <button className="page-quiet" onClick={() => onOpen({ kind: 'guide' })}>
          First-visit guide
        </button>
      </div>
    </article>
  )
}

function WaiverPage({
  channel,
  done,
  onWaiver,
}: {
  channel: ChannelId
  done: boolean
  onWaiver: () => void
}) {
  const [name, setName] = useState('')
  const [emergency, setEmergency] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [signature, setSignature] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const base = `${channel}-waiver`

  if (done) {
    return (
      <article className="web-page">
        <PageIntro title="Waiver complete" lede={copy.waiverDone} />
      </article>
    )
  }

  return (
    <article className="web-page">
      <PageIntro
        title="Waiver"
        lede="Sign before tomorrow’s 6:15 PM class."
      />
      <p className="waiver-copy">
        I understand class involves physical effort and I choose to participate.
        I will tell the instructor about any limits I want them to know. I agree
        to follow studio guidelines at Marlow River North.
      </p>
      <form
        className="waiver-form"
        onSubmit={(event) => {
          event.preventDefault()
          const next: string[] = []
          if (!name.trim()) next.push('Enter your legal name.')
          if (!emergency.trim()) next.push('Enter an emergency contact.')
          if (!agreed) next.push('Agree to the waiver to continue.')
          if (!signature.trim()) next.push('Type your full name as your signature.')
          setErrors(next)
          if (next.length === 0) onWaiver()
        }}
      >
        {errors.length > 0 ? (
          <div className="form-errors" role="alert">
            <p>Check the form before submitting.</p>
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <label htmlFor={`${base}-name`}>
          Legal name
          <input
            id={`${base}-name`}
            value={name}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label htmlFor={`${base}-emergency`}>
          Emergency contact
          <input
            id={`${base}-emergency`}
            value={emergency}
            autoComplete="off"
            placeholder="Name and phone number"
            onChange={(event) => setEmergency(event.target.value)}
          />
        </label>
        <label className="check" htmlFor={`${base}-agree`}>
          <input
            id={`${base}-agree`}
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
          I agree to this waiver.
        </label>
        <label htmlFor={`${base}-signature`}>
          Type your full name as your signature
          <input
            id={`${base}-signature`}
            value={signature}
            autoComplete="name"
            onChange={(event) => setSignature(event.target.value)}
          />
        </label>
        <SignaturePad channel={channel} />
        <button className="page-primary" type="submit">
          Submit waiver
        </button>
      </form>
    </article>
  )
}

function SignaturePad({ channel }: { channel: ChannelId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const rect = canvas.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    canvas.width = Math.max(rect.width, 1) * ratio
    canvas.height = Math.max(rect.height, 1) * ratio
    context.scale(ratio, ratio)
    context.lineWidth = 2
    context.lineCap = 'round'
    context.strokeStyle = '#1a1814'
  }, [])

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  return (
    <div className="signature">
      <div className="signature-label">
        <span id={`${channel}-draw-label`}>Draw your signature, if you want</span>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            const canvas = canvasRef.current
            const context = canvas?.getContext('2d')
            if (!canvas || !context) return
            context.clearRect(0, 0, canvas.width, canvas.height)
          }}
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        aria-labelledby={`${channel}-draw-label`}
        onPointerDown={(event) => {
          const context = canvasRef.current?.getContext('2d')
          if (!context) return
          drawing.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          const start = point(event)
          context.beginPath()
          context.moveTo(start.x, start.y)
        }}
        onPointerMove={(event) => {
          if (!drawing.current) return
          const context = canvasRef.current?.getContext('2d')
          if (!context) return
          const next = point(event)
          context.lineTo(next.x, next.y)
          context.stroke()
        }}
        onPointerUp={() => {
          drawing.current = false
        }}
      />
    </div>
  )
}

function DirectionsPage() {
  return (
    <article className="web-page">
      <PageIntro title="Directions" lede="Marlow River North" />
      <address className="address">
        {studioAddress.line}
        <br />
        {studioAddress.city}
      </address>
      <p>{studioAddress.note}</p>
      <div className="map" aria-hidden="true">
        <span>Illinois St</span>
        <span className="map-pin">Entrance</span>
      </div>
    </article>
  )
}

function GuidePage() {
  return (
    <article className="web-page">
      <PageIntro
        title="First-visit guide"
        lede="What to know before tomorrow’s 6:15 PM class."
      />
      <ul className="guide">
        {guideItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

function PlansPage({ onOpen }: { onOpen: (page: Page) => void }) {
  return (
    <article className="web-page">
      <PageIntro
        title="After your intro"
        lede="Your intro period ends Friday. Prices and terms are the same ones in the message."
      />
      <ul className="choice-list">
        {planOrder.map((planId) => {
          const plan = plans[planId]
          return (
            <li key={planId}>
              <button className="choice text-choice" onClick={() => onOpen({ kind: 'plan', planId })}>
                <span>
                  <strong>{plan.title}</strong>
                  <span className="choice-price">{plan.price}</span>
                  {plan.cardLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

function PlanPage({ planId }: { planId: string }) {
  const plan = plans[planId]
  const [stopped, setStopped] = useState(false)
  if (!plan) return null

  return (
    <article className="web-page">
      <div className={`plan-band band-${plan.tone}`} />
      <PageIntro title={plan.title} lede={plan.fit} />
      <p className="plan-price">{plan.price}</p>
      <ul className="guide">
        {plan.terms.map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ul>
      {stopped ? (
        <p className="boundary" role="status">
          Payment isn’t taken here. Marlow’s checkout would open next. Nothing
          has been purchased.
        </p>
      ) : (
        <button className="page-primary" onClick={() => setStopped(true)}>
          Continue to payment
        </button>
      )}
    </article>
  )
}

function ShopPage({ onOpen }: { onOpen: (page: Page) => void }) {
  return (
    <article className="web-page">
      <PageIntro
        title="Studio essentials"
        lede="Grip socks, the studio tee, and a water bottle."
      />
      <ul className="choice-list">
        {productOrder.map((productId) => {
          const product = products[productId]
          return (
            <li key={productId}>
              <button
                className="choice"
                onClick={() => onOpen({ kind: 'product', productId })}
              >
                <img src={product.image} alt="" />
                <span>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

function ProductPage({ productId }: { productId: string }) {
  const product = products[productId]
  if (!product) return null
  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState(
    product.variants.length === 1 ? product.variants[0].id : '',
  )
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')
  const group = useId()

  return (
    <article className="web-page">
      <img className="hero" src={product.image} alt={product.imageAlt} />
      <PageIntro title={product.name} lede={product.description} />
      <p className="plan-price">{product.price}</p>
      <fieldset className="choice-group">
        <legend id={group}>{product.variantLabel}</legend>
        <div className="segment" role="radiogroup" aria-labelledby={group}>
          {product.variants.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={variant === option.id}
              onClick={() => {
                setVariant(option.id)
                setAdded(false)
                setError('')
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
      {error ? (
        <p className="form-errors" role="alert">
          {error}
        </p>
      ) : null}
      {added ? (
        <p className="boundary" role="status">
          Added to your bag. Checkout would continue on Marlow’s site. No
          payment is taken from the message.
        </p>
      ) : (
        <button
          className="page-primary"
          onClick={() => {
            if (!variant) {
              setError(`Choose a ${product.variantLabel.toLowerCase()} before adding this to your bag.`)
              return
            }
            setAdded(true)
          }}
        >
          Add to bag
        </button>
      )}
    </article>
  )
}
