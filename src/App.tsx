import { useRef, useState } from 'react'
import { scenarios, type ScenarioId, type WaitlistMode } from './content'
import { Phone } from './Phone'
import {
  createSession,
  reduceSession,
  type Action,
  type ChannelId,
  type Session,
} from './session'

const disclaimer =
  'Illustrative. Rich card layout varies by device. A button replies or opens a next step. Booking, waiver, and purchase finish only where this prototype shows that result.'

function allSessions(mode: WaitlistMode): Record<ScenarioId, Session> {
  return {
    class: createSession('class', mode),
    waitlist: createSession('waitlist', mode),
    feedback: createSession('feedback', mode),
    welcome: createSession('welcome', mode),
    intro: createSession('intro', mode),
    retail: createSession('retail', mode),
  }
}

export function App() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('class')
  const [mode, setMode] = useState<WaitlistMode>('live')
  const [hidePrompts, setHidePrompts] = useState(false)
  const [sessions, setSessions] = useState(() => allSessions('live'))
  const requestRef = useRef(0)
  const modeRef = useRef<WaitlistMode>('live')
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0]
  const session = sessions[scenario.id]

  function dispatch(action: Action) {
    setSessions((current) => ({
      ...current,
      [scenarioId]: reduceSession(current[scenarioId], action),
    }))
  }

  function beginCheck(channel: ChannelId) {
    const request = ++requestRef.current
    dispatch({ type: 'start-check', channel })
    window.setTimeout(() => {
      if (requestRef.current !== request) return
      setSessions((current) => ({
        ...current,
        waitlist: reduceSession(current.waitlist, {
          type: 'finish-check',
          channel,
          mode: modeRef.current,
        }),
      }))
    }, 800)
  }

  function reset() {
    requestRef.current += 1
    setSessions((current) => ({
      ...current,
      [scenarioId]: createSession(scenarioId, modeRef.current),
    }))
  }

  function changeMode(next: WaitlistMode) {
    modeRef.current = next
    requestRef.current += 1
    setMode(next)
    setSessions((current) => ({
      ...current,
      waitlist: createSession('waitlist', next),
    }))
  }

  return (
    <div className="app">
      <a className="skip" href="#conversation">
        Skip to messages
      </a>
      <aside className="rail">
        <p className="tool-name">Message research</p>
        <p className="rail-brand">Marlow</p>
        <p className="rail-note">River North · client messages</p>
        <nav aria-label="Scenarios">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === scenario.id ? 'scenario active' : 'scenario'}
              aria-current={item.id === scenario.id ? 'true' : undefined}
              onClick={() => setScenarioId(item.id)}
            >
              <span className="num">{item.num}</span>
              <span>
                <span className="scenario-title">{item.title}</span>
                <span className="scenario-note">{item.note}</span>
              </span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="workspace" id="conversation">
        <header className="topbar">
          <div>
            <p className="eyebrow">Client experience</p>
            <h1>{scenario.title}</h1>
            {hidePrompts ? null : <p className="prompt">{scenario.prompt}</p>}
          </div>
          <div className="controls">
            {scenario.id === 'waitlist' ? (
              <fieldset className="modes">
                <legend>Offer state</legend>
                <ModeButton
                  current={mode}
                  value="live"
                  label="Live offer"
                  onChange={changeMode}
                />
                <ModeButton
                  current={mode}
                  value="expired"
                  label="Expired"
                  onChange={changeMode}
                />
                <ModeButton
                  current={mode}
                  value="taken"
                  label="Spot taken"
                  onChange={changeMode}
                />
              </fieldset>
            ) : null}
            <button
              type="button"
              className="chrome-button"
              aria-pressed={hidePrompts}
              onClick={() => setHidePrompts((value) => !value)}
            >
              {hidePrompts ? 'Show prompts' : 'Hide prompts'}
            </button>
            <button type="button" className="chrome-button" onClick={reset}>
              Reset conversation
            </button>
          </div>
        </header>
        <div className="stage">
          <Phone
            channel="sms"
            label="Text message"
            clock={scenario.clock}
            stamp={scenario.stamp}
            state={session.sms}
            mode={mode}
            onOpen={(page) => dispatch({ type: 'open', channel: 'sms', page })}
            onBack={() => dispatch({ type: 'back', channel: 'sms' })}
            onChip={() => undefined}
            onWaitlist={(decision) => {
              if (decision === 'pass') {
                dispatch({ type: 'pass', channel: 'sms' })
                return
              }
              dispatch({
                type: 'finish-check',
                channel: 'sms',
                mode: modeRef.current,
              })
            }}
            onWaiver={() => dispatch({ type: 'waiver', channel: 'sms' })}
          />
          <Phone
            channel="rcs"
            label="RCS"
            clock={scenario.clock}
            stamp={scenario.stamp}
            state={session.rcs}
            mode={mode}
            onOpen={(page) => dispatch({ type: 'open', channel: 'rcs', page })}
            onBack={() => dispatch({ type: 'back', channel: 'rcs' })}
            onChip={(id) => {
              if (id === 'accept') {
                beginCheck('rcs')
                return
              }
              if (id === 'pass') {
                dispatch({ type: 'pass', channel: 'rcs' })
                return
              }
              dispatch({ type: 'chip', channel: 'rcs', id })
            }}
            onWaitlist={(decision) => {
              if (decision === 'pass') {
                dispatch({ type: 'pass', channel: 'rcs' })
                return
              }
              dispatch({
                type: 'finish-check',
                channel: 'rcs',
                mode: modeRef.current,
              })
            }}
            onWaiver={() => dispatch({ type: 'waiver', channel: 'rcs' })}
          />
        </div>
        {hidePrompts ? null : <p className="disclaimer">{disclaimer}</p>}
      </main>
    </div>
  )
}

function ModeButton({
  current,
  value,
  label,
  onChange,
}: {
  current: WaitlistMode
  value: WaitlistMode
  label: string
  onChange: (value: WaitlistMode) => void
}) {
  return (
    <button
      type="button"
      aria-pressed={current === value}
      onClick={() => onChange(value)}
    >
      {label}
    </button>
  )
}
