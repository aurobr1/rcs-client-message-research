import {
  asset,
  classCard,
  copy,
  discoveryClassIds,
  planCard,
  planOrder,
  productCard,
  productOrder,
  type Card,
  type Page,
  type ScenarioId,
  type WaitlistMode,
} from './content'

export type ChannelId = 'sms' | 'rcs'

export type TextItem = {
  id: string
  type: 'text'
  from: 'studio' | 'client'
  body: string
  link?: { href: string; page: Page }
  tone?: 'result'
}

export type CardItem = {
  id: string
  type: 'card'
  card: Card
}

export type CarouselItem = {
  id: string
  type: 'carousel'
  label: string
  cards: Card[]
}

export type StatusItem = {
  id: string
  type: 'status'
  body: string
}

export type Item = TextItem | CardItem | CarouselItem | StatusItem

export type Chip = {
  id: string
  label: string
  disabled?: boolean
  emphasis?: boolean
}

export type Channel = {
  seq: number
  items: Item[]
  chips: Chip[]
  stack: Page[]
  waiverDone: boolean
  checking: boolean
  resolved: boolean
}

export type Session = {
  sms: Channel
  rcs: Channel
}

export type Action =
  | { type: 'open'; channel: ChannelId; page: Page }
  | { type: 'back'; channel: ChannelId }
  | { type: 'close'; channel: ChannelId }
  | { type: 'chip'; channel: ChannelId; id: string }
  | { type: 'start-check'; channel: ChannelId }
  | { type: 'finish-check'; channel: ChannelId; mode: WaitlistMode }
  | { type: 'pass'; channel: ChannelId }
  | { type: 'waiver'; channel: ChannelId }

function emptyChannel(): Channel {
  return {
    seq: 0,
    items: [],
    chips: [],
    stack: [],
    waiverDone: false,
    checking: false,
    resolved: false,
  }
}

type NewItem =
  | Omit<TextItem, 'id'>
  | Omit<CardItem, 'id'>
  | Omit<CarouselItem, 'id'>
  | Omit<StatusItem, 'id'>

function addItem(channel: Channel, item: NewItem): Channel {
  const seq = channel.seq + 1
  const next = { ...item, id: `m-${seq}` } as Item
  return {
    ...channel,
    seq,
    items: [...channel.items, next],
  }
}

function addText(
  channel: Channel,
  from: 'studio' | 'client',
  body: string,
  extra?: Pick<TextItem, 'link' | 'tone'>,
): Channel {
  return addItem(channel, { type: 'text', from, body, ...extra })
}

function withoutStatus(channel: Channel): Channel {
  return {
    ...channel,
    items: channel.items.filter((item) => item.type !== 'status'),
  }
}

function surveyCard(): Card {
  return {
    id: 'after-class-survey',
    image: asset('class-strength.jpg'),
    imageAlt: 'People holding dumbbells in a wood-floor studio',
    kicker: 'Survey',
    title: 'How was class?',
    lines: ['Jordan Ellis · Strength + cardio', 'Today · 6:15 PM'],
    actions: [],
  }
}

function welcomeCard(): Card {
  return {
    id: 'welcome',
    image: asset('studio-interior.jpg'),
    imageAlt: 'The Marlow River North studio in daylight',
    title: 'Tomorrow · 6:15 PM',
    lines: [
      'Meet Jordan Ellis at 6:15 PM.',
      'Please arrive 15 minutes early so we can help you settle in.',
      'Strength + cardio · River North',
    ],
    actions: [
      { label: 'Sign waiver', page: { kind: 'waiver' } },
      { label: 'Directions', page: { kind: 'directions' } },
      { label: 'First-visit guide', page: { kind: 'guide' } },
    ],
  }
}

function waitlistCard(ended: boolean): Card {
  return {
    id: 'waitlist-offer',
    image: asset('class-strength.jpg'),
    imageAlt: 'People holding dumbbells in a wood-floor studio',
    title: 'Strength + cardio',
    lines: ['Monday · 6:15 PM', 'Jordan Ellis · River North', '1 spot open'],
    actions: [],
    ended,
  }
}

function smsFor(scenario: ScenarioId, mode: WaitlistMode): Channel {
  const channel = emptyChannel()
  switch (scenario) {
    case 'class':
      return addText(
        channel,
        'studio',
        'Sam, here are a few classes for your week at Marlow River North.\n\nStrength + cardio — Mon 6:15 PM with Jordan Ellis\nLow-impact sculpt — Tue 7:00 AM with Priya Shah\nReformer foundations — Wed 12:00 PM with Jordan Ellis',
        { link: { href: 'marlowstudio.com/week', page: { kind: 'schedule' } } },
      )
    case 'waitlist':
      if (mode === 'expired') {
        return addText(
          channel,
          'studio',
          'A spot opened in Jordan Ellis’s Strength + cardio, Monday at 6:15 PM at Marlow River North. The offer ended at 5:15 PM.',
          {
            link: {
              href: 'marlowstudio.com/offer/mon-615',
              page: { kind: 'offer' },
            },
          },
        )
      }
      return addText(
        channel,
        'studio',
        'A spot opened in Jordan Ellis’s Strength + cardio, Monday at 6:15 PM at Marlow River North. Accept by 5:15 PM.',
        {
          link: {
            href: 'marlowstudio.com/offer/mon-615',
            page: { kind: 'offer' },
          },
        },
      )
    case 'feedback':
      return addText(
        channel,
        'studio',
        'How was Jordan Ellis’s class today? Two quick questions, about a minute.',
        {
          link: {
            href: 'marlowstudio.com/feedback',
            page: { kind: 'survey' },
          },
        },
      )
    case 'welcome':
      return addText(
        channel,
        'studio',
        'Your first class is tomorrow. Meet Jordan Ellis at 6:15 PM at Marlow River North. Please arrive 15 minutes early so we can help you settle in.',
        {
          link: {
            href: 'marlowstudio.com/first-visit',
            page: { kind: 'first-visit' },
          },
        },
      )
    case 'intro':
      return addText(
        channel,
        'studio',
        'Sam, your intro period ends Friday. Compare a 5-class pack ($175), 8 classes a month ($249), or unlimited ($329 a month).',
        { link: { href: 'marlowstudio.com/plans', page: { kind: 'plans' } } },
      )
    case 'retail':
      return addText(
        channel,
        'studio',
        'Marlow studio essentials, refreshed: grip socks ($18), the studio tee ($48), and a water bottle ($32).',
        {
          link: {
            href: 'marlowstudio.com/essentials',
            page: { kind: 'shop' },
          },
        },
      )
  }
}

function rcsFor(scenario: ScenarioId, mode: WaitlistMode): Channel {
  let channel = emptyChannel()
  switch (scenario) {
    case 'class':
      channel = addText(
        channel,
        'studio',
        'Find your next class. Here are a few options for your week.',
      )
      channel = addItem(channel, {
        type: 'carousel',
        label: 'Classes this week',
        cards: discoveryClassIds.map((id) => classCard(id)),
      })
      channel.chips = [
        { id: 'diff-times', label: 'Different times' },
        { id: 'help-class', label: 'Help me choose' },
      ]
      return channel
    case 'waitlist': {
      const ended = mode === 'expired'
      channel = addText(
        channel,
        'studio',
        ended
          ? 'A spot opened in your 6:15 PM class with Jordan Ellis.'
          : 'A spot opened in your 6:15 PM class with Jordan Ellis. Accept by 5:15 PM to claim it.',
      )
      if (ended) {
        channel = addText(channel, 'studio', copy.offerEnded)
      }
      channel = addItem(channel, { type: 'card', card: waitlistCard(ended) })
      channel.chips = [
        { id: 'accept', label: 'Accept spot', emphasis: true, disabled: ended },
        { id: 'pass', label: 'Pass', disabled: ended },
      ]
      return channel
    }
    case 'feedback':
      channel = addText(
        channel,
        'studio',
        'Thanks for joining Jordan Ellis’s class. Two quick questions.',
      )
      channel = addItem(channel, { type: 'card', card: surveyCard() })
      channel.chips = [
        { id: 'loved', label: 'Loved it' },
        { id: 'okay', label: 'It was okay' },
        { id: 'better', label: 'Could be better' },
      ]
      return channel
    case 'welcome':
      channel = addText(channel, 'studio', 'Your first class is tomorrow.')
      channel = addItem(channel, { type: 'card', card: welcomeCard() })
      return channel
    case 'intro':
      channel = addText(
        channel,
        'studio',
        'Keep your routine going. Your intro period ends Friday. Explore your next options.',
      )
      channel = addItem(channel, {
        type: 'carousel',
        label: 'Ways to keep going',
        cards: planOrder.map((id) => planCard(id)),
      })
      channel.chips = [{ id: 'help-plan', label: 'Help me choose' }]
      return channel
    case 'retail':
      channel = addText(channel, 'studio', 'Your studio essentials, refreshed.')
      channel = addItem(channel, {
        type: 'carousel',
        label: 'Studio essentials',
        cards: productOrder.map((id) => productCard(id)),
      })
      return channel
  }
}

export function createSession(scenario: ScenarioId, mode: WaitlistMode): Session {
  return {
    sms: smsFor(scenario, mode),
    rcs: rcsFor(scenario, mode),
  }
}

function patch(
  session: Session,
  channelId: ChannelId,
  channel: Channel,
): Session {
  return { ...session, [channelId]: channel }
}

function applyChip(channel: Channel, chipId: string): Channel {
  const chip = channel.chips.find((item) => item.id === chipId && !item.disabled)
  if (!chip) return channel

  let next = addText(channel, 'client', chip.label)
  next = { ...next, chips: [] }

  switch (chipId) {
    case 'diff-times':
      next = addText(next, 'studio', copy.differentTimes)
      return addItem(next, {
        type: 'carousel',
        label: 'Other times this week',
        cards: [classCard('strength-thu-noon'), classCard('reformer-fri')],
      })
    case 'help-class':
      next = addText(next, 'studio', copy.helpTime)
      return {
        ...next,
        chips: [
          { id: 'time-morning', label: 'Mornings' },
          { id: 'time-midday', label: 'Midday' },
          { id: 'time-evening', label: 'Evenings' },
        ],
      }
    case 'time-morning':
      next = addText(next, 'studio', copy.timeFit)
      return addItem(next, { type: 'card', card: classCard('sculpt-tue') })
    case 'time-midday':
      next = addText(next, 'studio', copy.timeFit)
      return addItem(next, { type: 'card', card: classCard('reformer-wed') })
    case 'time-evening':
      next = addText(next, 'studio', copy.timeFit)
      return addItem(next, { type: 'card', card: classCard('strength-mon') })
    case 'loved':
      next = addText(next, 'studio', copy.stoodOut)
      return {
        ...next,
        chips: [
          { id: 'stood-instructor', label: 'The instructor' },
          { id: 'stood-workout', label: 'The workout' },
          { id: 'stood-studio', label: 'The studio' },
        ],
      }
    case 'stood-instructor':
    case 'stood-workout':
    case 'stood-studio':
      next = addText(next, 'studio', copy.loved, { tone: 'result' })
      return addItem(next, { type: 'card', card: classCard('strength-thu-eve') })
    case 'okay':
      next = addText(next, 'studio', copy.okayAsk)
      return {
        ...next,
        chips: [
          { id: 'okay-class', label: 'Class experience' },
          { id: 'okay-studio', label: 'Studio facilities' },
          { id: 'okay-booking', label: 'Booking experience' },
        ],
      }
    case 'okay-class':
    case 'okay-studio':
    case 'okay-booking':
      return addText(next, 'studio', copy.okay, { tone: 'result' })
    case 'better':
      next = addText(next, 'studio', copy.improveAsk)
      return {
        ...next,
        chips: [
          { id: 'topic-class', label: 'Class experience' },
          { id: 'topic-studio', label: 'Studio facilities' },
          { id: 'topic-booking', label: 'Booking experience' },
        ],
      }
    case 'topic-class':
    case 'topic-studio':
    case 'topic-booking':
      next = addText(next, 'studio', copy.followAsk)
      return {
        ...next,
        chips: [
          { id: 'follow-yes', label: 'Yes, please', emphasis: true },
          { id: 'follow-no', label: 'No, thanks' },
        ],
      }
    case 'follow-yes':
      return addText(next, 'studio', copy.followYes, { tone: 'result' })
    case 'follow-no':
      return addText(next, 'studio', copy.followNo, { tone: 'result' })
    case 'help-plan':
      next = addText(next, 'studio', copy.helpPlan)
      return {
        ...next,
        chips: [
          { id: 'fit-flex', label: 'Flexibility' },
          { id: 'fit-monthly', label: 'A set monthly number' },
          { id: 'fit-unlimited', label: 'Unlimited access' },
        ],
      }
    case 'fit-flex':
      next = addText(next, 'studio', copy.planFit)
      return addItem(next, {
        type: 'card',
        card: planCard('pack', copy.closest),
      })
    case 'fit-monthly':
      next = addText(next, 'studio', copy.planFit)
      return addItem(next, {
        type: 'card',
        card: planCard('monthly', copy.closest),
      })
    case 'fit-unlimited':
      next = addText(next, 'studio', copy.planFit)
      return addItem(next, {
        type: 'card',
        card: planCard('unlimited', copy.closest),
      })
    default:
      return channel
  }
}

function finishCheck(channel: Channel, channelId: ChannelId, mode: WaitlistMode): Channel {
  if (channel.resolved || mode === 'expired') return channel
  if (channelId === 'rcs' && !channel.checking) return channel

  let next = withoutStatus(channel)
  next = {
    ...next,
    checking: false,
    resolved: true,
    chips: [],
    stack: [],
  }

  if (mode === 'taken') {
    next = addText(next, 'studio', copy.taken, { tone: 'result' })
    if (channelId === 'rcs') {
      return addItem(next, { type: 'card', card: classCard('sculpt-tue') })
    }
    return addText(next, 'studio', copy.takenSms, {
      link: {
        href: 'marlowstudio.com/classes/sculpt-tue',
        page: { kind: 'class', classId: 'sculpt-tue' },
      },
    })
  }

  return addText(next, 'studio', copy.booked, { tone: 'result' })
}

export function reduceSession(session: Session, action: Action): Session {
  const channel = session[action.channel]

  switch (action.type) {
    case 'open':
      return patch(session, action.channel, {
        ...channel,
        stack: [...channel.stack, action.page],
      })
    case 'back':
      return patch(session, action.channel, {
        ...channel,
        stack: channel.stack.slice(0, -1),
      })
    case 'close':
      return patch(session, action.channel, { ...channel, stack: [] })
    case 'chip':
      if (action.channel !== 'rcs') return session
      return patch(session, 'rcs', applyChip(channel, action.id))
    case 'start-check': {
      if (channel.checking || channel.resolved) return session
      let next = addText(channel, 'client', 'Accept spot')
      next = addItem(next, { type: 'status', body: copy.checking })
      next = { ...next, chips: [], checking: true }
      return patch(session, action.channel, next)
    }
    case 'finish-check':
      return patch(
        session,
        action.channel,
        finishCheck(channel, action.channel, action.mode),
      )
    case 'pass': {
      if (channel.resolved || channel.checking) return session
      let next = channel
      if (action.channel === 'rcs') {
        next = addText(next, 'client', 'Pass')
      }
      next = addText(next, 'studio', copy.passed, { tone: 'result' })
      next = { ...next, chips: [], stack: [], resolved: true }
      return patch(session, action.channel, next)
    }
    case 'waiver': {
      if (channel.waiverDone) return session
      const next = addText(
        { ...channel, waiverDone: true, stack: [] },
        'studio',
        copy.waiverDone,
        { tone: 'result' },
      )
      return patch(session, action.channel, next)
    }
  }
}
