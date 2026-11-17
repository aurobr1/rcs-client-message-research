export function asset(file: string) {
  return `${import.meta.env.BASE_URL}images/${file}`
}

export type ScenarioId =
  | 'class'
  | 'waitlist'
  | 'feedback'
  | 'welcome'
  | 'intro'
  | 'retail'

export type WaitlistMode = 'live' | 'expired' | 'taken'

export type Page =
  | { kind: 'schedule' }
  | { kind: 'class'; classId: string }
  | { kind: 'offer' }
  | { kind: 'survey' }
  | { kind: 'first-visit' }
  | { kind: 'waiver' }
  | { kind: 'directions' }
  | { kind: 'guide' }
  | { kind: 'plans' }
  | { kind: 'plan'; planId: string }
  | { kind: 'shop' }
  | { kind: 'product'; productId: string }

export type CardAction = {
  label: string
  page: Page
}

export type Card = {
  id: string
  image?: string
  imageAlt?: string
  tone?: 'sand' | 'clay' | 'ink'
  kicker?: string
  title: string
  price?: string
  lines: string[]
  actions: CardAction[]
  ended?: boolean
}

export const scenarios: {
  id: ScenarioId
  num: string
  title: string
  note: string
  prompt: string
  clock: string
  stamp: string
}[] = [
  {
    id: 'class',
    num: '01',
    title: 'Find your next class',
    note: 'Compare options in the thread',
    prompt: 'Are they reacting to the photo, the comparison, or the button?',
    clock: '2:14',
    stamp: 'Today · 2:14 PM',
  },
  {
    id: 'waitlist',
    num: '02',
    title: 'Waitlist spot',
    note: 'Accept a spot and see the result',
    prompt: 'Is the value the button, or knowing the spot is actually booked?',
    clock: '4:02',
    stamp: 'Today · 4:02 PM',
  },
  {
    id: 'feedback',
    num: '03',
    title: 'After class',
    note: 'A two-question survey in the thread',
    prompt: 'Do they care about answering in the conversation, or about what happens next?',
    clock: '7:48',
    stamp: 'Today · 7:48 PM',
  },
  {
    id: 'welcome',
    num: '04',
    title: 'First class tomorrow',
    note: 'Waiver, directions, and a guide',
    prompt: 'Which action would they want a client to finish before arrival?',
    clock: '11:20',
    stamp: 'Today · 11:20 AM',
  },
  {
    id: 'intro',
    num: '05',
    title: 'Intro offer ending',
    note: 'Compare what comes next',
    prompt: 'Do they want the comparison itself, or a person to help choose?',
    clock: '9:05',
    stamp: 'Today · 9:05 AM',
  },
  {
    id: 'retail',
    num: '06',
    title: 'Studio essentials',
    note: 'Browse products before the shop',
    prompt: 'Is retail worth a richer message, or only a store link?',
    clock: '1:36',
    stamp: 'Today · 1:36 PM',
  },
]

export type ClassSession = {
  id: string
  format: string
  when: string
  instructor: string
  instructorImage: string
  image: string
  imageAlt: string
  duration: string
  location: string
  spots: string
  blurb: string
}

export const classSessions: Record<string, ClassSession> = {
  'strength-mon': {
    id: 'strength-mon',
    format: 'Strength + cardio',
    when: 'Monday · 6:15 PM',
    instructor: 'Jordan Ellis',
    instructorImage: asset('jordan-ellis.jpg'),
    image: asset('class-strength.jpg'),
    imageAlt: 'People holding dumbbells in a wood-floor studio',
    duration: '50 min',
    location: 'River North',
    spots: '8 spots left',
    blurb:
      'Intervals of strength and cardio. Expect dumbbells, a low bench, and a steady pace.',
  },
  'sculpt-tue': {
    id: 'sculpt-tue',
    format: 'Low-impact sculpt',
    when: 'Tuesday · 7:00 AM',
    instructor: 'Priya Shah',
    instructorImage: asset('priya-shah.jpg'),
    image: asset('class-sculpt.jpg'),
    imageAlt: 'A low-impact sculpt class on mats in morning light',
    duration: '45 min',
    location: 'River North',
    spots: '6 spots left',
    blurb:
      'Slow strength work for the whole body. Mats and light weights, with ways to keep the impact low.',
  },
  'reformer-wed': {
    id: 'reformer-wed',
    format: 'Reformer foundations',
    when: 'Wednesday · 12:00 PM',
    instructor: 'Jordan Ellis',
    instructorImage: asset('jordan-ellis.jpg'),
    image: asset('class-reformer.jpg'),
    imageAlt: 'A reformer in a quiet studio with a person holding a strap',
    duration: '50 min',
    location: 'River North',
    spots: '4 spots left',
    blurb:
      'A foundations class on the reformer. Springs, straps, and time to learn the setup.',
  },
  'strength-thu-noon': {
    id: 'strength-thu-noon',
    format: 'Strength + cardio',
    when: 'Thursday · 12:15 PM',
    instructor: 'Jordan Ellis',
    instructorImage: asset('jordan-ellis.jpg'),
    image: asset('class-strength.jpg'),
    imageAlt: 'People holding dumbbells in a wood-floor studio',
    duration: '50 min',
    location: 'River North',
    spots: '9 spots left',
    blurb:
      'The midday version of Jordan’s strength and cardio class. Same format, a quieter room.',
  },
  'reformer-fri': {
    id: 'reformer-fri',
    format: 'Reformer foundations',
    when: 'Friday · 7:30 AM',
    instructor: 'Priya Shah',
    instructorImage: asset('priya-shah.jpg'),
    image: asset('class-reformer.jpg'),
    imageAlt: 'A reformer in a quiet studio with a person holding a strap',
    duration: '50 min',
    location: 'River North',
    spots: '5 spots left',
    blurb:
      'Priya’s early foundations class. A slower start, with time on the reformer before the day begins.',
  },
  'strength-thu-eve': {
    id: 'strength-thu-eve',
    format: 'Strength + cardio',
    when: 'Thursday · 6:15 PM',
    instructor: 'Jordan Ellis',
    instructorImage: asset('jordan-ellis.jpg'),
    image: asset('class-strength.jpg'),
    imageAlt: 'People holding dumbbells in a wood-floor studio',
    duration: '50 min',
    location: 'River North',
    spots: '6 spots left',
    blurb:
      'Jordan’s evening strength and cardio class. The same room and format as Monday.',
  },
}

export const discoveryClassIds = ['strength-mon', 'sculpt-tue', 'reformer-wed']

export type Plan = {
  id: string
  title: string
  price: string
  tone: 'sand' | 'clay' | 'ink'
  cardLines: string[]
  terms: string[]
  fit: string
}

export const plans: Record<string, Plan> = {
  pack: {
    id: 'pack',
    title: '5-class pack',
    price: '$175',
    tone: 'sand',
    cardLines: ['Expires in 60 days', 'No monthly commitment'],
    terms: [
      'Five classes for $175',
      'Expires in 60 days',
      'No monthly commitment',
      'Valid for regular classes at River North',
    ],
    fit: 'Best if you want flexibility while you find a rhythm.',
  },
  monthly: {
    id: 'monthly',
    title: '8 classes a month',
    price: '$249 / month',
    tone: 'clay',
    cardLines: ['Renews monthly', 'Unused classes do not roll over'],
    terms: [
      '$249 a month',
      'Eight classes every month',
      'Renews monthly until you cancel',
      'Unused classes do not roll over',
    ],
    fit: 'Best if you train about twice a week and want a set number.',
  },
  unlimited: {
    id: 'unlimited',
    title: 'Unlimited',
    price: '$329 / month',
    tone: 'ink',
    cardLines: ['3-month minimum', 'All regular class formats'],
    terms: [
      '$329 a month',
      '3-month minimum',
      'All regular class formats at River North',
      'Includes strength, sculpt, and reformer',
    ],
    fit: 'Best if you plan to train most days.',
  },
}

export const planOrder = ['pack', 'monthly', 'unlimited']

export type Product = {
  id: string
  name: string
  price: string
  image: string
  imageAlt: string
  description: string
  variantLabel: string
  variants: { id: string; label: string }[]
}

export const products: Record<string, Product> = {
  socks: {
    id: 'socks',
    name: 'Grip socks',
    price: '$18',
    image: asset('product-socks.jpg'),
    imageAlt: 'A pair of stone-colored grip socks',
    description:
      'A low-profile pair for reformer days. The grip stays put when the carriage moves.',
    variantLabel: 'Size',
    variants: [
      { id: 'sm', label: 'S/M' },
      { id: 'ml', label: 'M/L' },
    ],
  },
  tee: {
    id: 'tee',
    name: 'Studio tee',
    price: '$48',
    image: asset('product-tee.jpg'),
    imageAlt: 'A folded clay-colored studio t-shirt',
    description: 'Heavyweight cotton, cut to move. Clay, with no front graphic.',
    variantLabel: 'Size',
    variants: [
      { id: 'xs', label: 'XS' },
      { id: 's', label: 'S' },
      { id: 'm', label: 'M' },
      { id: 'l', label: 'L' },
      { id: 'xl', label: 'XL' },
    ],
  },
  bottle: {
    id: 'bottle',
    name: 'Water bottle',
    price: '$32',
    image: asset('product-bottle.jpg'),
    imageAlt: 'A matte stone-gray water bottle',
    description: 'Matte steel, 21 ounces. It fits the cubby beside the reformer.',
    variantLabel: 'Size',
    variants: [{ id: '21', label: '21 oz' }],
  },
}

export const productOrder = ['socks', 'tee', 'bottle']

export const copy = {
  booked:
    'You’re booked for Monday at 6:15 PM with Jordan Ellis at River North.',
  passed: 'You passed. We released the spot.',
  taken: 'That spot was just taken.',
  takenSms:
    'Low-impact sculpt with Priya Shah is open Tuesday at 7:00 AM.',
  waiverDone: 'Your waiver is complete. You’re set for tomorrow at 6:15 PM.',
  loved:
    'That’s great to hear, Sam. Jordan Ellis’s next Strength + cardio is Thursday at 6:15 PM.',
  okay: 'Thanks, Sam. We’ll share this with the River North team.',
  stoodOut: 'What stood out?',
  okayAsk: 'What would make the next class better?',
  improveAsk: 'What should we improve?',
  followAsk: 'Would you like the studio to follow up?',
  followYes: 'The River North team will reach out today.',
  followNo: 'Thanks, Sam. We’ll use this to improve.',
  checking: 'Checking the roster…',
  offerEnded: 'This spot offer ended at 5:15 PM.',
  differentTimes: 'Here are two other times this week.',
  helpTime: 'What time of day works best?',
  timeFit: 'This class fits that time.',
  helpPlan: 'What matters most as you keep going?',
  planFit: 'Based on that, this is the closest fit.',
  closest: 'Closest fit',
}

export function classCard(classId: string, kicker?: string): Card {
  const session = classSessions[classId]
  const card: Card = {
    id: classId,
    image: session.image,
    imageAlt: session.imageAlt,
    title: session.format,
    lines: [session.when, `${session.instructor} · ${session.location}`],
    actions: [{ label: 'View class', page: { kind: 'class', classId } }],
  }
  if (kicker) card.kicker = kicker
  return card
}

export function planCard(planId: string, kicker?: string): Card {
  const plan = plans[planId]
  const card: Card = {
    id: planId,
    tone: plan.tone,
    title: plan.title,
    price: plan.price,
    lines: plan.cardLines,
    actions: [{ label: 'View plan', page: { kind: 'plan', planId } }],
  }
  if (kicker) card.kicker = kicker
  return card
}

export function productCard(productId: string): Card {
  const product = products[productId]
  return {
    id: productId,
    image: product.image,
    imageAlt: product.imageAlt,
    title: product.name,
    price: product.price,
    lines: [],
    actions: [{ label: 'Shop item', page: { kind: 'product', productId } }],
  }
}

export function pageHref(page: Page): string {
  switch (page.kind) {
    case 'schedule':
      return 'marlowstudio.com/week'
    case 'class':
      return `marlowstudio.com/classes/${page.classId}`
    case 'offer':
      return 'marlowstudio.com/offer/mon-615'
    case 'survey':
      return 'marlowstudio.com/feedback'
    case 'first-visit':
      return 'marlowstudio.com/first-visit'
    case 'waiver':
      return 'marlowstudio.com/waiver'
    case 'directions':
      return 'marlowstudio.com/visit/directions'
    case 'guide':
      return 'marlowstudio.com/visit/guide'
    case 'plans':
      return 'marlowstudio.com/plans'
    case 'plan':
      return `marlowstudio.com/plans/${page.planId}`
    case 'shop':
      return 'marlowstudio.com/essentials'
    case 'product':
      return `marlowstudio.com/essentials/${page.productId}`
  }
}

export const studioAddress = {
  name: 'Marlow · River North',
  line: '418 W Illinois Street',
  city: 'Chicago, IL 60654',
  note: 'Second door past the lobby, on Illinois. The studio is one floor up.',
}

export const guideItems = [
  'Arrive 15 minutes early so we can help you settle in.',
  'Grip socks are required on the reformer. The studio sells them if you need a pair.',
  'Bring water. Cubbies are by the entrance.',
  'Leave shoes at the door.',
  'Your class is 50 minutes. Jordan Ellis will meet you on the floor.',
]
