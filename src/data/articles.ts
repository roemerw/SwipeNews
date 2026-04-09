export interface Article {
  id: string
  topicId: string
  source: 'NOS' | 'The Guardian'
  timestamp: string
  headline: string
  preview: string
  body: string
  imageUrl?: string
  originalUrl: string
}

interface ArticleSeed {
  id: string
  source: Article['source']
  minutesAgo: number
  headline: string
  preview: string
  body: string[]
  imageUrl?: string
  originalUrl: string
}

const BASE_TIME = Date.parse('2026-04-08T12:30:00.000Z')

function toIso(minutesAgo: number) {
  return new Date(BASE_TIME - minutesAgo * 60_000).toISOString()
}

function buildArticle(topicId: string, seed: ArticleSeed): Article {
  return {
    id: seed.id,
    topicId,
    source: seed.source,
    timestamp: toIso(seed.minutesAgo),
    headline: seed.headline,
    preview: seed.preview,
    body: seed.body.join('\n\n'),
    imageUrl: seed.imageUrl,
    originalUrl: seed.originalUrl,
  }
}

const topicSeeds: Record<string, ArticleSeed[]> = {
  iran: [
    {
      id: 'iran-1',
      source: 'NOS',
      minutesAgo: 18,
      headline:
        'Iran signals it will keep indirect talks open as pressure rises over regional strikes',
      preview:
        'Officials are trying to project calm while leaving room for diplomacy after another tense night across the region.',
      body: [
        'Iranian officials are using deliberately careful language, arguing that keeping indirect channels open does not mean backing away from hard positions. The message is aimed at foreign capitals as much as at domestic audiences that expect a tougher line.',
        'Diplomats say the immediate significance is procedural rather than breakthrough-level. The fact that messages are still moving matters because markets and neighboring states had started pricing in a faster slide toward direct confrontation.',
        'For a quick catch-up, the key point is that the story has shifted from pure escalation to managed escalation. Nobody is offering a settlement, but both sides are leaving just enough space to avoid a clean rupture.',
      ],
      imageUrl: '/images/iran-focus.svg',
      originalUrl: 'https://nos.nl/l/iran-talks-pressure',
    },
    {
      id: 'iran-2',
      source: 'The Guardian',
      minutesAgo: 32,
      headline:
        'Shipping insurers reassess Gulf exposure as traders watch Iranian warnings',
      preview:
        'New guidance from insurers is raising costs for some cargo routes even before any formal disruption takes hold.',
      body: [
        'Shipping and insurance markets often react before governments publish formal notices, and that pattern is visible again. Traders say fresh pricing adjustments are being used as a hedge against the risk of longer inspection times and route changes.',
        'The commercial effect is still modest, but it is important because it translates geopolitical language into immediate business friction. That in turn feeds oil, food and consumer price expectations well beyond the region.',
        'The fast read is simple: there is no shutdown, but there is enough anxiety in the system to make transport more expensive and more cautious.',
      ],
      originalUrl: 'https://www.theguardian.com/world/iran-gulf-shipping-risk',
    },
    {
      id: 'iran-3',
      source: 'NOS',
      minutesAgo: 45,
      headline:
        'European diplomats revive sanctions language while pushing Tehran to avoid a wider clash',
      preview:
        'Officials in several capitals are balancing deterrence and de-escalation, hoping tougher wording can buy time.',
      body: [
        'European governments are leaning on familiar sanctions language as a way to show resolve without immediately expanding the crisis. The emphasis so far is on signaling consequences rather than unveiling new measures.',
        'Behind the scenes, the same officials are also pushing for restraint because broader sanctions packages tend to narrow the space for quiet diplomacy. That split objective explains why public messages sound firmer than private briefings.',
        'What matters for this session is that Europe is trying to stay relevant to the next phase rather than simply reacting to Washington or regional actors.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/europe-iran-diplomacy',
    },
    {
      id: 'iran-4',
      source: 'The Guardian',
      minutesAgo: 57,
      headline:
        'Iranian households brace for another squeeze as currency nerves return',
      preview:
        'The domestic angle is back in focus, with analysts watching whether foreign-policy stress spills into everyday prices.',
      body: [
        'Currency pressure is once again becoming the most direct way that external tension reaches ordinary households. Retailers and importers typically respond early, even when official exchange rates stay relatively stable on paper.',
        'Economists tracking Iran say the government still has tools to slow the immediate impact, but confidence is harder to rebuild when households have recently lived through repeated shocks.',
        'The catch-up takeaway is that foreign-policy headlines are increasingly being judged through a cost-of-living lens at home.',
      ],
      originalUrl: 'https://www.theguardian.com/world/iran-currency-households',
    },
    {
      id: 'iran-5',
      source: 'NOS',
      minutesAgo: 73,
      headline:
        'Cybersecurity agencies warn of heightened alert after a burst of Iran-linked claims online',
      preview:
        'Authorities say many of the most dramatic claims remain unverified, but the information battle is accelerating.',
      body: [
        'Officials are urging media organizations, utilities and transport operators to harden basic defenses while verification catches up with the online chatter. The warning reflects the speed of the narrative war as much as any confirmed breach.',
        'Security analysts note that loosely affiliated groups often exploit major geopolitical moments to exaggerate influence, muddy attribution and raise public anxiety. That makes disciplined sourcing especially important.',
        'For this app, the practical read is that cyber language around Iran is heating up faster than confirmed operational evidence.',
      ],
      imageUrl: '/images/iran-focus.svg',
      originalUrl: 'https://nos.nl/l/iran-cyber-alert',
    },
    {
      id: 'iran-6',
      source: 'The Guardian',
      minutesAgo: 88,
      headline:
        'Oil traders trim the most extreme bets but keep a conflict premium in place',
      preview:
        'The market mood has shifted from panic to guarded caution, yet nobody is ready to price out risk entirely.',
      body: [
        'Energy desks are no longer betting on the most disruptive scenarios at the same intensity, but they are still keeping a premium on the board for the possibility of miscalculation. That usually means higher day-to-day volatility rather than a single dramatic spike.',
        'Analysts say the next move depends less on public speeches and more on whether military and shipping channels remain routine over the coming days.',
        'In plain terms, traders are backing away from peak fear while still assuming the region can surprise them.',
      ],
      originalUrl: 'https://www.theguardian.com/business/iran-oil-risk-premium',
    },
    {
      id: 'iran-7',
      source: 'NOS',
      minutesAgo: 102,
      headline:
        'Regional militias complicate the picture as Tehran tries to calibrate its response',
      preview:
        'Security officials say the biggest uncertainty is not rhetoric from capitals, but actions by loosely aligned groups.',
      body: [
        'One of the hardest parts of reading the moment is separating state intention from the behavior of allied or sympathetic armed groups. Even when Tehran signals caution, partner networks can create new pressure points.',
        'That is why diplomats keep stressing hotlines and deconfliction channels. They are trying to prevent smaller incidents from forcing leaders into larger responses.',
        'The core update is that the crisis remains wider than the direct state-to-state conversation.',
      ],
      imageUrl: '/images/iran-focus.svg',
      originalUrl: 'https://nos.nl/l/iran-militias-response',
    },
    {
      id: 'iran-8',
      source: 'The Guardian',
      minutesAgo: 117,
      headline:
        'Students and diaspora groups push for the world not to lose sight of domestic repression',
      preview:
        'Activists fear foreign-policy urgency can once again crowd out attention on rights and civil society.',
      body: [
        'Campaigners say the international conversation often narrows too quickly to deterrence, missiles and shipping lanes, leaving less room for scrutiny of arrests, censorship and social pressure inside Iran.',
        'That argument is resonating with parts of the diaspora, who want governments to avoid a security-only framework when shaping their response.',
        'For a fast briefing, remember that the Iran story is being contested on two tracks at once: external crisis management and internal accountability.',
      ],
      originalUrl: 'https://www.theguardian.com/world/iran-diaspora-rights-focus',
    },
    {
      id: 'iran-9',
      source: 'NOS',
      minutesAgo: 131,
      headline:
        'Air-defense messaging becomes part of the strategy as authorities project control',
      preview:
        'Military statements are being used to reassure domestic audiences and discourage rivals from testing limits.',
      body: [
        'Public briefings about radar coverage, interception readiness and security drills are not just technical updates. They are also political signals designed to suggest that the state remains in control despite the volume of speculation.',
        'Analysts caution that these announcements can calm one audience while unnerving another, especially if regional actors read them as preparation for escalation.',
        'The important point is that military messaging is now a story in its own right, not just background context.',
      ],
      imageUrl: '/images/nato-focus.svg',
      originalUrl: 'https://nos.nl/l/iran-air-defense-signals',
    },
    {
      id: 'iran-10',
      source: 'The Guardian',
      minutesAgo: 148,
      headline:
        'Why Iran is still talking about patience while everyone else watches the clock',
      preview:
        'Officials appear to believe time pressure can be turned into leverage, provided events do not outrun the message.',
      body: [
        'Iranian officials are presenting patience as discipline rather than weakness, hoping that a controlled tempo improves bargaining power and reduces the chance of being boxed into a public deadline.',
        'The risk is that outside actors, markets and proxy groups do not share the same timetable. That mismatch is what makes the current phase feel unstable even without a single defining move.',
        'If you only take one idea from this piece, take this: the crisis is being shaped by timing as much as by substance.',
      ],
      originalUrl: 'https://www.theguardian.com/world/iran-patience-strategy-explainer',
    },
  ],
  gaza: [
    {
      id: 'gaza-1',
      source: 'NOS',
      minutesAgo: 20,
      headline:
        'Aid agencies say convoy access improved slightly overnight but remains far below need',
      preview:
        'Relief groups describe incremental progress rather than a breakthrough, with deliveries still slowed by checks and route bottlenecks.',
      body: [
        'Humanitarian officials say a few more trucks moved than earlier in the week, but the gap between what entered and what families need remains very wide. The system is still operating below any level that would count as stable relief.',
        'Aid groups are focusing on predictability as much as volume. Regular access matters because hospitals, shelters and bakeries cannot plan around one-off openings.',
        'The short version: conditions may be marginally less blocked today, but not enough to change the overall humanitarian picture.',
      ],
      imageUrl: '/images/gaza-focus.svg',
      originalUrl: 'https://nos.nl/l/gaza-aid-access',
    },
    {
      id: 'gaza-2',
      source: 'The Guardian',
      minutesAgo: 34,
      headline:
        'Ceasefire diplomacy inches forward as mediators test narrower, temporary arrangements',
      preview:
        'Negotiators are exploring limited formulas that could unlock aid and hostage discussions without settling the wider war.',
      body: [
        'Diplomats say the talks are focused on smaller, more procedural steps because broader political questions remain too far apart. That can sound unimpressive, but temporary arrangements often determine whether larger negotiations survive.',
        'Officials involved in the mediation effort are warning against expectations of a dramatic public announcement. The process is more about preventing collapse than producing a final deal.',
        'For catch-up purposes, mediation is active, but still in the incremental stage.',
      ],
      originalUrl: 'https://www.theguardian.com/world/gaza-ceasefire-mediators-update',
    },
    {
      id: 'gaza-3',
      source: 'NOS',
      minutesAgo: 49,
      headline:
        'Doctors report another day of strain on fuel, supplies and surgical capacity',
      preview:
        'Hospital managers say the immediate problem is not one shortage, but several compounding at once.',
      body: [
        'Medical staff describe a familiar pattern: fuel insecurity, supply gaps and exhaustion among personnel reinforce one another until routine cases become emergency cases. Small interruptions have outsized effects in that environment.',
        'International organizations say the longer these conditions persist, the harder it becomes to restart even basic services quickly.',
        'The update here is continuity of pressure rather than a single new collapse point.',
      ],
      imageUrl: '/images/gaza-focus.svg',
      originalUrl: 'https://nos.nl/l/gaza-hospitals-strain',
    },
    {
      id: 'gaza-4',
      source: 'The Guardian',
      minutesAgo: 63,
      headline:
        'Families displaced again describe repeated moves as the defining rhythm of the war',
      preview:
        'Even when front lines look static on maps, civilians say instructions and risk zones keep shifting.',
      body: [
        'Aid workers say repeated displacement has become one of the conflict’s clearest patterns. Families are making decisions with incomplete information, limited transport and little sense of where conditions will hold for more than a few days.',
        'That instability makes education, treatment and food distribution harder to organize because each new move breaks whatever temporary routine people had assembled.',
        'The key takeaway is that daily uncertainty remains central to the civilian experience.',
      ],
      originalUrl: 'https://www.theguardian.com/world/gaza-displacement-patterns',
    },
    {
      id: 'gaza-5',
      source: 'NOS',
      minutesAgo: 78,
      headline:
        'European ministers push again for monitored aid corridors with stronger verification',
      preview:
        'The proposal aims to answer security concerns while speeding up deliveries that relief groups say are still too slow.',
      body: [
        'European officials are again trying to find a formula that satisfies security demands without turning every shipment into a prolonged negotiation. Monitored corridors are one of the few ideas that keep reappearing across capitals.',
        'Aid groups say the value of such plans depends on execution rather than branding. A corridor that exists on paper but fails in practice changes little on the ground.',
        'So far, the story is about process design rather than measurable humanitarian relief.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/gaza-monitored-corridors',
    },
    {
      id: 'gaza-6',
      source: 'The Guardian',
      minutesAgo: 92,
      headline:
        'UN officials warn that water access remains one of the least visible but most destabilising pressures',
      preview:
        'The humanitarian debate often centers on food and hospitals, but water systems are under growing stress.',
      body: [
        'Relief planners say water shortages are especially dangerous because they compound health, sanitation and displacement problems at the same time. When water access worsens, public health risks rise quickly even without a headline-grabbing single incident.',
        'The concern is not only current scarcity but also the difficulty of repairing and maintaining infrastructure under conflict conditions.',
        'This item matters because it broadens the lens beyond the most visible aid metrics.',
      ],
      originalUrl: 'https://www.theguardian.com/world/gaza-water-pressure',
    },
    {
      id: 'gaza-7',
      source: 'NOS',
      minutesAgo: 105,
      headline:
        'Regional capitals react cautiously as protests grow louder over aid and civilian safety',
      preview:
        'Governments are trying to absorb domestic pressure without closing off diplomatic space.',
      body: [
        'Several governments in the region are facing stronger public criticism over the pace of diplomacy and aid access. Their responses have been calibrated: sympathetic rhetoric in public, careful signaling in private.',
        'That balancing act matters because regional actors still play an important role in mediation, border logistics and broader political pressure.',
        'The fast read is that the Gaza story continues to shape domestic politics well beyond the enclave itself.',
      ],
      imageUrl: '/images/gaza-focus.svg',
      originalUrl: 'https://nos.nl/l/gaza-regional-protests',
    },
    {
      id: 'gaza-8',
      source: 'The Guardian',
      minutesAgo: 118,
      headline:
        'Rights groups say accountability debates are moving faster than any meaningful protection on the ground',
      preview:
        'Legal and political scrutiny is intensifying, but campaigners say civilians are not yet seeing the effect.',
      body: [
        'Advocacy organizations argue that new investigations, legal filings and parliamentary debates are important but too slow to change present conditions for families caught in the fighting.',
        'Officials counter that accountability mechanisms matter precisely because they shape future conduct and political costs, even when the immediate impact is limited.',
        'In this catch-up flow, the point is that scrutiny is increasing even as operational reality remains harsh.',
      ],
      originalUrl: 'https://www.theguardian.com/world/gaza-accountability-debate',
    },
    {
      id: 'gaza-9',
      source: 'NOS',
      minutesAgo: 134,
      headline:
        'Food prices in local markets remain volatile as distribution routes open and close',
      preview:
        'Aid workers say price swings are a useful signal of just how fragile supply chains still are.',
      body: [
        'Market prices can reveal pressure faster than official statements because traders respond immediately to access, scarcity and uncertainty. In Gaza, that volatility remains severe.',
        'Relief groups say price spikes make cash assistance less effective and deepen inequality between families who can move quickly and those who cannot.',
        'The short takeaway is that uneven access continues to shape daily survival choices.',
      ],
      imageUrl: '/images/gaza-focus.svg',
      originalUrl: 'https://nos.nl/l/gaza-market-prices',
    },
    {
      id: 'gaza-10',
      source: 'The Guardian',
      minutesAgo: 151,
      headline:
        'Why a day described as “slightly better” can still point to a prolonged emergency in Gaza',
      preview:
        'Humanitarian conditions are so degraded that even modest improvements still sit within an emergency baseline.',
      body: [
        'Aid organizations warn that improvements are easy to overread because the baseline is already extremely low. A few smoother deliveries or a short lull in fighting do not amount to recovery.',
        'That framing is important in media cycles that search for simple momentum. Conditions can improve at the margin while remaining structurally catastrophic.',
        'If you need one sentence to remember: better than yesterday is not the same thing as sufficient.',
      ],
      originalUrl: 'https://www.theguardian.com/world/gaza-emergency-baseline',
    },
  ],
  trump: [
    {
      id: 'trump-1',
      source: 'NOS',
      minutesAgo: 14,
      headline:
        'Trump campaign sharpens message on tariffs as advisers frame trade as a kitchen-table issue',
      preview:
        'The pitch is moving beyond geopolitics and back toward household prices, factory jobs and bargaining power.',
      body: [
        'Campaign strategists are packaging tariff policy as proof of leverage rather than as a specialist trade debate. The goal is to keep the argument simple enough for rallies and television while still signaling toughness abroad.',
        'Economists continue to warn that tariffs can land unevenly and raise costs, but political teams often bet that clarity beats nuance on the stump.',
        'The current shift is less about a new policy than about a more disciplined framing of one.',
      ],
      imageUrl: '/images/trump-focus.svg',
      originalUrl: 'https://nos.nl/l/trump-tariff-message',
    },
    {
      id: 'trump-2',
      source: 'The Guardian',
      minutesAgo: 28,
      headline:
        'Court timetable keeps colliding with campaign rhythm around Trump',
      preview:
        'Legal developments remain politically important even when they do not land as cleanly as a campaign event.',
      body: [
        'The practical challenge for both allies and opponents is that court scheduling rarely matches the attention cycle of a national campaign. Hearings can matter a great deal while still failing to dominate the news for long.',
        'That mismatch has pushed both sides to focus less on single legal moments and more on the broader narrative voters carry week to week.',
        'For a catch-up reader, the important point is that the legal track still matters, but often through accumulation rather than spectacle.',
      ],
      originalUrl: 'https://www.theguardian.com/us-news/trump-courts-campaign-timing',
    },
    {
      id: 'trump-3',
      source: 'NOS',
      minutesAgo: 40,
      headline:
        'Republican surrogates test a more disciplined economic pitch around Trump',
      preview:
        'Allies are trying to keep interviews focused on inflation, wages and energy instead of campaign drama.',
      body: [
        'The adjustment is tactical. Surrogates know that a campaign dominated by personality and process can crowd out the policy areas where they believe they have the clearest voter opening.',
        'Whether the discipline holds is another matter, but the shift suggests a conscious effort to narrow the message and repeat it relentlessly.',
        'What changed today is not the substance of the argument but the consistency with which it is being delivered.',
      ],
      imageUrl: '/images/trump-focus.svg',
      originalUrl: 'https://nos.nl/l/trump-economic-surrogates',
    },
    {
      id: 'trump-4',
      source: 'The Guardian',
      minutesAgo: 53,
      headline:
        'Business donors weigh pragmatism against volatility in conversations about Trump',
      preview:
        'Private discussions remain split between enthusiasm for tax and regulatory promises and anxiety about uncertainty.',
      body: [
        'Corporate and donor circles often talk about Trump in dual terms: attractive on some policy promises, difficult on institutional and market stability. That divide is visible again in private briefings and fundraising conversations.',
        'The result is a more complicated donor map than the loudest public endorsements suggest.',
        'In short, support is real, but it is often hedged.',
      ],
      originalUrl: 'https://www.theguardian.com/us-news/trump-business-donors-volatility',
    },
    {
      id: 'trump-5',
      source: 'NOS',
      minutesAgo: 67,
      headline:
        'Immigration remains Trump’s clearest applause line, but advisers want broader contrast',
      preview:
        'Campaign aides are trying to keep their strongest issue from crowding out every other message.',
      body: [
        'Immigration still energizes core supporters quickly, which makes it an easy focal point at rallies and on cable news. The challenge is that a campaign narrowed too far can feel repetitive or incomplete to swing voters.',
        'That is why aides keep pairing border rhetoric with economic and public-safety themes, even if those additions get less attention.',
        'The key read is that campaign discipline now means broadening, not sharpening, the issue mix.',
      ],
      imageUrl: '/images/trump-focus.svg',
      originalUrl: 'https://nos.nl/l/trump-immigration-contrast',
    },
    {
      id: 'trump-6',
      source: 'The Guardian',
      minutesAgo: 81,
      headline:
        'Allies prepare for renewed debate over who speaks for Trump on foreign policy',
      preview:
        'Advisers with different instincts are competing to define what “America first” means in current crises.',
      body: [
        'Foreign policy remains one of the areas where Trump-world contains visibly different schools of thought. Some advisers emphasize restraint and burden-sharing; others stress pressure and coercive leverage.',
        'That ambiguity can be politically useful because it keeps multiple factions engaged, but it also creates uncertainty for allies trying to read a future administration.',
        'The catch-up takeaway is that the label is stable even when the underlying policy coalition is not.',
      ],
      originalUrl: 'https://www.theguardian.com/us-news/trump-foreign-policy-allies',
    },
    {
      id: 'trump-7',
      source: 'NOS',
      minutesAgo: 96,
      headline:
        'Polling teams say turnout assumptions matter more than headline margins in Trump battlegrounds',
      preview:
        'The question is less “who is ahead?” than “whose voters actually show up?”',
      body: [
        'Campaign analysts say battleground polling around Trump becomes far more revealing when turnout assumptions are made explicit. Small shifts in participation can change the picture more than a single point in top-line support.',
        'That is why teams obsess over enthusiasm, field organization and local issue salience rather than national averages alone.',
        'For the brief version: the map still hinges on mobilization, not just persuasion.',
      ],
      imageUrl: '/images/trump-focus.svg',
      originalUrl: 'https://nos.nl/l/trump-turnout-battlegrounds',
    },
    {
      id: 'trump-8',
      source: 'The Guardian',
      minutesAgo: 110,
      headline:
        'Republican officials debate how tightly to tie themselves to Trump’s legal battles',
      preview:
        'Some see full-throated defense as mandatory, while others prefer to pivot back to policy and electability.',
      body: [
        'The divide is mostly strategic rather than moral. Officials who want to stay tightly aligned see legal defense as a loyalty test; others think voters reward a steadier focus on living costs and governance.',
        'That tension keeps resurfacing because legal news is unpredictable while campaign planning depends on repetition.',
        'What matters now is that the party conversation remains unsettled even when public messaging sounds unified.',
      ],
      originalUrl: 'https://www.theguardian.com/us-news/republicans-trump-legal-strategy',
    },
    {
      id: 'trump-9',
      source: 'NOS',
      minutesAgo: 123,
      headline:
        'Trump’s media strategy continues to favor intensity over breadth',
      preview:
        'The campaign is betting that dominating the conversation matters more than expanding the range of outlets.',
      body: [
        'Rather than chasing every possible audience with tailored messages, the strategy often relies on keeping a few narratives so loud that they spill into broader coverage. That can be efficient, but it also deepens volatility.',
        'Analysts say the approach works best when the candidate’s strongest themes are aligned with the week’s dominant concerns.',
        'The short read is that attention remains a core campaign asset, not just a byproduct.',
      ],
      imageUrl: '/images/trump-focus.svg',
      originalUrl: 'https://nos.nl/l/trump-media-intensity',
    },
    {
      id: 'trump-10',
      source: 'The Guardian',
      minutesAgo: 139,
      headline:
        'Why every Trump update still gets read through the lens of institutional stress',
      preview:
        'Even routine campaign moves are judged for what they imply about courts, norms and executive power.',
      body: [
        'Trump now operates in a political environment where ordinary campaign activity is repeatedly interpreted as a test of institutional resilience. That is part of why relatively small developments can trigger outsized analysis.',
        'Supporters see much of that framing as politically loaded; critics see it as unavoidable context.',
        'Either way, the interpretive frame is now a constant feature of the story.',
      ],
      originalUrl: 'https://www.theguardian.com/us-news/trump-institutional-stress-lens',
    },
  ],
  nato: [
    {
      id: 'nato-1',
      source: 'NOS',
      minutesAgo: 16,
      headline:
        'NATO allies press spending arguments with renewed focus on timelines, not slogans',
      preview:
        'The debate has shifted from whether more money is needed to how quickly members can actually deliver it.',
      body: [
        'Officials increasingly frame defense spending in terms of execution calendars, procurement bottlenecks and industrial capacity. That makes the conversation less symbolic and more operational.',
        'Allies that once leaned on long-term pledges are under pressure to show nearer-term steps, especially as security demands have become more immediate.',
        'For this catch-up, the important shift is from headline percentages to credible delivery schedules.',
      ],
      imageUrl: '/images/nato-focus.svg',
      originalUrl: 'https://nos.nl/l/nato-spending-timelines',
    },
    {
      id: 'nato-2',
      source: 'The Guardian',
      minutesAgo: 31,
      headline:
        'Baltic drills underscore NATO’s push to make deterrence look routine rather than exceptional',
      preview:
        'Exercises are being framed as normal readiness work, not as signs of panic or imminent conflict.',
      body: [
        'Military planners often want exercises to be visible enough to reassure allies but ordinary enough not to suggest immediate alarm. That balance is on display again in NATO’s messaging around regional drills.',
        'The intention is to normalize preparedness and reduce the shock value of deployment news.',
        'The main update is one of posture: capability on display, but wrapped in steady language.',
      ],
      originalUrl: 'https://www.theguardian.com/world/nato-baltic-drills-deterrence',
    },
    {
      id: 'nato-3',
      source: 'NOS',
      minutesAgo: 44,
      headline:
        'Air defense and ammunition remain the alliance’s most practical talking points',
      preview:
        'When officials get specific, those two categories still dominate because they are immediate and measurable.',
      body: [
        'Defense ministers can disagree on emphasis, but air defense and ammunition repeatedly emerge as the least abstract parts of the conversation. They are concrete, scarce and politically legible.',
        'That focus also highlights the link between military planning and industrial policy, since production timelines shape strategic credibility.',
        'The quick read is that NATO’s urgent needs are still material, not rhetorical.',
      ],
      imageUrl: '/images/nato-focus.svg',
      originalUrl: 'https://nos.nl/l/nato-air-defense-ammo',
    },
    {
      id: 'nato-4',
      source: 'The Guardian',
      minutesAgo: 58,
      headline:
        'Alliance officials say cyber resilience now belongs in mainstream defense planning',
      preview:
        'Cyber warnings are being folded into ordinary readiness discussions rather than treated as a specialist sidebar.',
      body: [
        'NATO officials increasingly present cyber resilience as part of standard defense posture, alongside logistics and air defense. That shift matters because it changes who owns the conversation inside governments.',
        'The emphasis is less on dramatic single incidents and more on continuity under pressure.',
        'In short, cyber is being normalized into alliance planning.',
      ],
      originalUrl: 'https://www.theguardian.com/world/nato-cyber-resilience-mainstream',
    },
    {
      id: 'nato-5',
      source: 'NOS',
      minutesAgo: 72,
      headline:
        'Procurement bottlenecks keep haunting NATO promises on readiness',
      preview:
        'Governments may agree on ambition, but factories, contracts and training pipelines still set the pace.',
      body: [
        'The alliance has become more candid about the industrial side of deterrence. Public promises matter less when parts, skilled labor and long contracts slow delivery.',
        'That realism can be politically uncomfortable, but it also makes discussions more credible.',
        'The main idea here is that production capacity is now strategic news.',
      ],
      imageUrl: '/images/nato-focus.svg',
      originalUrl: 'https://nos.nl/l/nato-procurement-bottlenecks',
    },
    {
      id: 'nato-6',
      source: 'The Guardian',
      minutesAgo: 87,
      headline:
        'Southern allies want NATO’s security language to sound less exclusively eastern',
      preview:
        'Mediterranean concerns, migration routes and infrastructure risks remain part of the internal balance.',
      body: [
        'Alliance politics are not only about the eastern flank. Southern members continue to argue that deterrence language should reflect the security pressures they face in and around the Mediterranean as well.',
        'That does not mean disagreement on the major threat picture so much as competition for attention, resources and planning bandwidth.',
        'The short read: internal NATO balance still matters even during high external tension.',
      ],
      originalUrl: 'https://www.theguardian.com/world/nato-southern-allies-language',
    },
    {
      id: 'nato-7',
      source: 'NOS',
      minutesAgo: 101,
      headline:
        'Officials highlight military mobility as the quiet enabler of NATO credibility',
      preview:
        'Roads, rail and border procedures are less visible than jets or tanks, but they decide how fast forces can move.',
      body: [
        'Military mobility sounds bureaucratic until a crisis reveals how much it depends on infrastructure, customs coordination and peacetime planning. NATO is again trying to keep that work higher on political agendas.',
        'The payoff is speed and predictability, which are core ingredients of deterrence.',
        'The important point is that logistics remains a front-line issue, even when it looks administrative.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/nato-military-mobility',
    },
    {
      id: 'nato-8',
      source: 'The Guardian',
      minutesAgo: 115,
      headline:
        'NATO’s public messaging is getting more careful about surprise and reassurance',
      preview:
        'Leaders want to sound prepared without feeding the sense that Europe is permanently on the brink.',
      body: [
        'Communications teams across the alliance are trying to land a difficult tone: urgency without panic, seriousness without fatalism. That balance affects public support as much as allied signaling.',
        'Too much alarm can erode confidence; too little can make preparedness look abstract.',
        'This item matters because messaging is increasingly part of strategy, not just presentation.',
      ],
      originalUrl: 'https://www.theguardian.com/world/nato-public-messaging-balance',
    },
    {
      id: 'nato-9',
      source: 'NOS',
      minutesAgo: 129,
      headline:
        'Defense ministers keep returning to stockpiles as the least glamorous but most urgent metric',
      preview:
        'Readiness ultimately comes back to what is actually available, not what has been promised for later.',
      body: [
        'Officials can point to summit communiques and procurement packages, but stockpiles reveal the near-term truth about readiness. That is why the conversation keeps circling back to inventory.',
        'The alliance wants to avoid a cycle where replenishment plans always sit just beyond the horizon.',
        'If you need the short version, it is this: stock matters more than theater.',
      ],
      imageUrl: '/images/nato-focus.svg',
      originalUrl: 'https://nos.nl/l/nato-stockpiles-metric',
    },
    {
      id: 'nato-10',
      source: 'The Guardian',
      minutesAgo: 142,
      headline:
        'Why NATO stories increasingly read like industrial policy stories too',
      preview:
        'Factories, supply chains and long-term orders have become inseparable from alliance credibility.',
      body: [
        'The boundary between defense policy and industrial policy has thinned because military readiness now depends on production depth, workforce planning and procurement discipline.',
        'That makes NATO coverage feel more domestic and economic than it once did, even when the headlines are strategic.',
        'The big takeaway is that deterrence is now discussed in terms of manufacturing as much as troop posture.',
      ],
      originalUrl: 'https://www.theguardian.com/world/nato-industrial-policy-story',
    },
  ],
  oekraine: [
    {
      id: 'oekraine-1',
      source: 'NOS',
      minutesAgo: 17,
      headline:
        'Ukraine says drone pressure remains intense even where front lines look relatively stable',
      preview:
        'Officials stress that quieter maps can still hide a high operational tempo in the air and along supply routes.',
      body: [
        'Military updates from Ukraine increasingly emphasize drone pressure because aerial harassment can reshape movement and logistics even without dramatic territorial change. The map can look static while the operational burden keeps rising.',
        'Analysts say that pattern is one reason public expectations often lag behind battlefield reality.',
        'The quick catch-up: less visible movement does not mean lower pressure.',
      ],
      imageUrl: '/images/oekraine-focus.svg',
      originalUrl: 'https://nos.nl/l/oekraine-drone-pressure',
    },
    {
      id: 'oekraine-2',
      source: 'The Guardian',
      minutesAgo: 30,
      headline:
        'European capitals race to turn ammunition promises into something more predictable for Kyiv',
      preview:
        'The recurring challenge is not political sympathy, but dependable delivery and production cadence.',
      body: [
        'Ukraine’s partners continue to struggle with the gap between announcing support and sustaining it on a timetable that commanders can actually plan around. Predictability matters almost as much as total volume.',
        'That is why recent discussions focus so heavily on contracts, inventories and factory throughput.',
        'The short read is that support remains strong, but the supply story is still about reliability.',
      ],
      originalUrl: 'https://www.theguardian.com/world/ukraine-ammunition-predictability',
    },
    {
      id: 'oekraine-3',
      source: 'NOS',
      minutesAgo: 43,
      headline:
        'Repair crews in Ukraine keep trying to stay ahead of energy damage before colder months return',
      preview:
        'Infrastructure planning is being treated as a strategic issue because every delay raises later vulnerability.',
      body: [
        'Energy repairs are one of the clearest examples of how wartime urgency and seasonal planning collide. Crews have to fix current damage while also racing the calendar for future demand.',
        'Officials say even small delays now can translate into larger fragility later.',
        'For this session, the key point is that infrastructure resilience remains a live part of the conflict story.',
      ],
      imageUrl: '/images/oekraine-focus.svg',
      originalUrl: 'https://nos.nl/l/oekraine-energy-repairs',
    },
    {
      id: 'oekraine-4',
      source: 'The Guardian',
      minutesAgo: 56,
      headline:
        'Analysts say Ukraine’s battlefield story is increasingly about adaptation speed',
      preview:
        'Both sides are learning quickly, which makes temporary advantages harder to hold.',
      body: [
        'Observers say the conflict now rewards fast adaptation as much as raw firepower. New tactics, electronic warfare adjustments and drone use can all change the local picture in short cycles.',
        'That makes sweeping narratives risky because they often age quickly.',
        'The takeaway is that the tempo of learning matters almost as much as the tempo of fighting.',
      ],
      originalUrl: 'https://www.theguardian.com/world/ukraine-adaptation-speed',
    },
    {
      id: 'oekraine-5',
      source: 'NOS',
      minutesAgo: 71,
      headline:
        'Civilians near the front describe routine uncertainty rather than singular moments of shock',
      preview:
        'The strain comes from repetition: alarms, power loss, disrupted travel and unclear timing.',
      body: [
        'For many civilians, the defining feature of the war is not one major incident but the constant management of risk in ordinary life. That includes transport, school routines, shopping and contact with family.',
        'Aid groups say those layered disruptions often receive less attention than military headlines, even though they shape resilience.',
        'The short read is that the war’s daily texture still matters.',
      ],
      imageUrl: '/images/oekraine-focus.svg',
      originalUrl: 'https://nos.nl/l/oekraine-civilians-routine-uncertainty',
    },
    {
      id: 'oekraine-6',
      source: 'The Guardian',
      minutesAgo: 85,
      headline:
        'Black Sea trade routes remain a strategic barometer for Ukraine’s wider resilience',
      preview:
        'Export capacity is still being read as both an economic measure and a signal of operational confidence.',
      body: [
        'Shipping lanes matter because they connect battlefield risk to state revenue, food markets and diplomatic credibility. Even limited continuity can carry symbolic weight beyond the cargo itself.',
        'Officials and traders alike keep watching whether insurance, route planning and security incidents make continuity easier or harder.',
        'This item matters because trade remains one of the clearest bridges between war and the wider economy.',
      ],
      originalUrl: 'https://www.theguardian.com/world/ukraine-black-sea-barometer',
    },
    {
      id: 'oekraine-7',
      source: 'NOS',
      minutesAgo: 99,
      headline:
        'Kyiv presses partners to stay focused on air defense as drone and missile mixes evolve',
      preview:
        'Officials say defense needs are changing in detail, but not in urgency.',
      body: [
        'Ukrainian officials keep returning to air defense because attacks are evolving in ways that test coverage, ammunition usage and recovery time. The mix changes; the pressure does not.',
        'Partners say they understand the urgency, though delivery speed remains uneven.',
        'The fast version: air defense is still central, even when the headline specifics shift.',
      ],
      imageUrl: '/images/nato-focus.svg',
      originalUrl: 'https://nos.nl/l/oekraine-air-defense-focus',
    },
    {
      id: 'oekraine-8',
      source: 'The Guardian',
      minutesAgo: 113,
      headline:
        'EU officials frame support for Ukraine as a long-cycle endurance test',
      preview:
        'The emphasis is on staying power in budgets, politics and production rather than dramatic one-off announcements.',
      body: [
        'European officials increasingly describe support for Ukraine as an endurance challenge that runs through factories, fiscal planning and electoral cycles. That language reflects a more sober understanding of what sustained backing requires.',
        'The benefit of that framing is realism; the drawback is that it sounds less dramatic than crisis politics.',
        'The point for catch-up is that support is being normalized into long-duration planning.',
      ],
      originalUrl: 'https://www.theguardian.com/world/eu-ukraine-endurance-test',
    },
    {
      id: 'oekraine-9',
      source: 'NOS',
      minutesAgo: 126,
      headline:
        'Local officials warn that reconstruction decisions cannot wait for a perfect security moment',
      preview:
        'Repair, rebuilding and long-term planning are increasingly happening at the same time as active defense.',
      body: [
        'Municipal leaders say waiting for full certainty is not realistic, especially for housing, utilities and transport. Some rebuilding choices have to happen while risk remains present.',
        'That creates a difficult balance between resilience, efficiency and safety.',
        'The core idea is that reconstruction is not purely a postwar story anymore.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/oekraine-reconstruction-now',
    },
    {
      id: 'oekraine-10',
      source: 'The Guardian',
      minutesAgo: 141,
      headline:
        'Why Ukraine coverage keeps returning to morale, adaptation and supply in the same breath',
      preview:
        'Those three themes now explain much of the war’s near-term trajectory better than single-front headlines alone.',
      body: [
        'Morale, adaptation and supply are deeply linked. Troops and civilians respond differently when they trust support will continue and that lessons are being absorbed quickly.',
        'That is why analysts often pair operational updates with industrial and political context.',
        'If you keep only one frame from this item, make it this trio: endurance, learning and logistics.',
      ],
      originalUrl: 'https://www.theguardian.com/world/ukraine-morale-adaptation-supply',
    },
  ],
  ai: [
    {
      id: 'ai-1',
      source: 'NOS',
      minutesAgo: 12,
      headline:
        'AI launches keep getting framed as productivity tools, but buyers now ask harder integration questions',
      preview:
        'The pitch has shifted from capability demos to whether teams can trust, govern and actually deploy the systems.',
      body: [
        'Enterprise buyers are less impressed by benchmark talk alone and more focused on whether an AI product can slot into existing workflows without creating new risk. That means governance, permissions and measurable value are taking center stage.',
        'Vendors still lead with speed and creativity, but procurement teams increasingly steer the conversation toward controls.',
        'The short read is that the market is maturing from wow factor to adoption discipline.',
      ],
      imageUrl: '/images/ai-focus.svg',
      originalUrl: 'https://nos.nl/l/ai-enterprise-integration',
    },
    {
      id: 'ai-2',
      source: 'The Guardian',
      minutesAgo: 26,
      headline:
        'Regulators and developers remain on a collision course over how fast AI rules should bite',
      preview:
        'The disagreement is no longer about whether rules are coming, but about timing, scope and enforcement.',
      body: [
        'Policy debates around AI increasingly turn on implementation details rather than broad principle. Companies want room to iterate; regulators want credible obligations before market habits harden.',
        'That tension creates a stop-start rhythm for product teams trying to plan releases across multiple jurisdictions.',
        'For this session, the key point is that governance pressure is becoming operational, not theoretical.',
      ],
      originalUrl: 'https://www.theguardian.com/technology/ai-rules-timing-clash',
    },
    {
      id: 'ai-3',
      source: 'NOS',
      minutesAgo: 39,
      headline:
        'Chip supply still shapes AI roadmaps more than many glossy demos let on',
      preview:
        'Behind the scenes, access to compute remains a practical constraint on product ambition and cost.',
      body: [
        'Executives may announce aggressive model and feature plans, but compute access, energy usage and hardware timing often set the real boundaries. That is why infrastructure headlines keep mattering.',
        'The more companies promise always-on AI features, the more expensive reliability becomes.',
        'The fast version: the AI race still runs through supply chains and data centers.',
      ],
      imageUrl: '/images/ai-focus.svg',
      originalUrl: 'https://nos.nl/l/ai-chip-supply-roadmaps',
    },
    {
      id: 'ai-4',
      source: 'The Guardian',
      minutesAgo: 52,
      headline:
        'Creative industries keep pushing back on AI training norms even as tools become harder to ignore',
      preview:
        'The conflict between usefulness and consent is now one of the sector’s most durable fault lines.',
      body: [
        'Artists, publishers and rights holders are not only challenging compensation models; they are also contesting the idea that scraping first and negotiating later should remain acceptable.',
        'At the same time, many of the same industries are experimenting with AI internally because the productivity case is getting stronger.',
        'The short read is that adoption and resistance are moving forward together.',
      ],
      originalUrl: 'https://www.theguardian.com/technology/ai-creative-rights-pushback',
    },
    {
      id: 'ai-5',
      source: 'NOS',
      minutesAgo: 66,
      headline:
        'Companies are quietly rethinking what “copilot” should mean after the first rollout wave',
      preview:
        'The second generation of workplace AI is becoming more specific, less universal and easier to measure.',
      body: [
        'Many teams learned that generic assistants can create more experimentation than value. The new push is toward narrower copilots tied to concrete roles, data and success metrics.',
        'That does not make the products less ambitious; it makes them easier to justify.',
        'The takeaway is that AI tools are becoming more job-shaped and less slogan-shaped.',
      ],
      imageUrl: '/images/ai-focus.svg',
      originalUrl: 'https://nos.nl/l/ai-copilot-second-wave',
    },
    {
      id: 'ai-6',
      source: 'The Guardian',
      minutesAgo: 79,
      headline:
        'Researchers warn that energy and water questions are still lagging behind AI adoption curves',
      preview:
        'Environmental constraints remain under-discussed compared with model capability and market competition.',
      body: [
        'The infrastructure footprint of AI is slowly moving from a specialist concern into public debate as demand for compute rises. Data centers, cooling and electricity sourcing increasingly shape the economics of scaling.',
        'That pressure does not halt product development, but it does change the conversation about where and how systems can expand.',
        'In short, the resource story is becoming harder to treat as background detail.',
      ],
      originalUrl: 'https://www.theguardian.com/technology/ai-energy-water-questions',
    },
    {
      id: 'ai-7',
      source: 'NOS',
      minutesAgo: 93,
      headline:
        'Smaller AI teams are pitching privacy and control as a way to compete with giants',
      preview:
        'The market is no longer just about scale; it is also about deployment models and trust.',
      body: [
        'Startups and smaller vendors increasingly emphasize on-device processing, regional hosting and tighter permissions as differentiation. That appeals to customers who want AI benefits without handing over every workflow to a single provider.',
        'The competition is therefore expanding beyond raw model size.',
        'The quick catch-up is that trust architecture is becoming a product feature.',
      ],
      imageUrl: '/images/ai-focus.svg',
      originalUrl: 'https://nos.nl/l/ai-privacy-control-pitch',
    },
    {
      id: 'ai-8',
      source: 'The Guardian',
      minutesAgo: 108,
      headline:
        'AI policy arguments in Europe are increasingly about implementation rather than identity',
      preview:
        'The old split between “pro-innovation” and “pro-regulation” is giving way to more practical questions.',
      body: [
        'As rule books move closer to enforcement, debates become less symbolic and more technical. Companies want clarity on scope and exemptions; regulators want proof that safeguards will actually be used.',
        'That may be less headline-friendly, but it is much more consequential for day-to-day product work.',
        'The takeaway is that AI politics is getting more operational.',
      ],
      originalUrl: 'https://www.theguardian.com/technology/europe-ai-implementation-debate',
    },
    {
      id: 'ai-9',
      source: 'NOS',
      minutesAgo: 121,
      headline:
        'Consumers are getting more comfortable with AI assistance, but less forgiving of obvious errors',
      preview:
        'Usage is broadening, yet patience for hallucinations and clumsy automation is shrinking fast.',
      body: [
        'Early novelty bought many tools some tolerance for mistakes. That grace period is ending as users start to treat assistants less like experiments and more like everyday software.',
        'The implication for product teams is clear: reliability now does more competitive work than surprise.',
        'The short read is that expectations are rising as adoption spreads.',
      ],
      imageUrl: '/images/ai-focus.svg',
      originalUrl: 'https://nos.nl/l/ai-consumer-expectations',
    },
    {
      id: 'ai-10',
      source: 'The Guardian',
      minutesAgo: 136,
      headline:
        'Why the AI story of the moment is less about one model and more about system design',
      preview:
        'Winning products increasingly depend on orchestration, workflow fit and trust layers around the model itself.',
      body: [
        'The most durable AI products are rarely just a model in a box. They depend on retrieval, permissions, evaluation, logging and interface design that make the output useful in context.',
        'That is why the conversation is shifting away from headline model releases toward fuller system design.',
        'If you remember one thing from this update, remember that product architecture is becoming the real moat.',
      ],
      originalUrl: 'https://www.theguardian.com/technology/ai-system-design-moment',
    },
  ],
  europa: [
    {
      id: 'europa-1',
      source: 'NOS',
      minutesAgo: 15,
      headline:
        'European policymakers are trying to talk about competitiveness without sounding like they are giving up on climate goals',
      preview:
        'The balancing act is becoming central to debates on industry, energy and state support.',
      body: [
        'European leaders increasingly frame competitiveness as a way to preserve long-term social and climate goals rather than as an alternative to them. The rhetoric matters because industrial policy is now politically crowded territory.',
        'That balancing act is most visible in energy pricing, manufacturing and trade protection debates.',
        'The quick read is that Europe is trying to sound both pragmatic and principled at the same time.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/europa-competitiveness-climate-balance',
    },
    {
      id: 'europa-2',
      source: 'The Guardian',
      minutesAgo: 29,
      headline:
        'ECB watchers say inflation language may be softening, but caution still dominates the tone',
      preview:
        'Markets are listening for nuance, while central bankers want to avoid sounding premature.',
      body: [
        'Even small changes in central bank language can reshape market expectations, which is why policymakers remain careful about how they describe inflation progress. Confidence is still being rationed in small doses.',
        'Analysts say the debate is no longer about emergency tightening, but about sequencing and credibility.',
        'For catch-up purposes, Europe’s rate story is edging into a more delicate phase, not a dramatic one.',
      ],
      originalUrl: 'https://www.theguardian.com/business/ecb-language-softening-caution',
    },
    {
      id: 'europa-3',
      source: 'NOS',
      minutesAgo: 41,
      headline:
        'Rail, power and digital networks are back at the center of Europe’s strategic autonomy debate',
      preview:
        'Infrastructure is being discussed not just as public works, but as security and economic resilience.',
      body: [
        'European policy discussions increasingly blur the boundaries between infrastructure, economic policy and security. Rail links, interconnectors and cloud systems all now sit inside broader resilience arguments.',
        'That shift affects funding choices and political messaging alike.',
        'The takeaway is that Europe’s strategy talk is becoming more concrete.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/europa-infrastructure-resilience',
    },
    {
      id: 'europa-4',
      source: 'The Guardian',
      minutesAgo: 54,
      headline:
        'Migration politics keeps reordering alliances inside Europe even when the legal framework barely moves',
      preview:
        'The issue matters not only for border policy, but also for coalition-building and public trust.',
      body: [
        'Migration debates often look repetitive at the level of slogans, but they keep reshaping relationships between parties, governments and EU institutions. That is part of why the subject remains politically potent.',
        'Small procedural changes can have larger symbolic consequences when public confidence is already thin.',
        'The short version is that migration still acts as a force multiplier inside European politics.',
      ],
      originalUrl: 'https://www.theguardian.com/world/europe-migration-politics-alliances',
    },
    {
      id: 'europa-5',
      source: 'NOS',
      minutesAgo: 69,
      headline:
        'Farmers, industry and environmental groups are all trying to redefine what a “fair transition” means in Europe',
      preview:
        'The same phrase is being used by different camps to argue for very different policy choices.',
      body: [
        'As Europe moves from target-setting to implementation, questions of fairness are becoming more contentious. Different sectors all claim the language of transition, but attach different costs and timelines to it.',
        'That makes compromise harder, yet also forces policymakers to get more specific.',
        'For this catch-up, the main point is that Europe’s transition debate is increasingly about distribution, not destination.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/europa-fair-transition',
    },
    {
      id: 'europa-6',
      source: 'The Guardian',
      minutesAgo: 83,
      headline:
        'Defense cooperation in Europe is becoming more practical and less rhetorical',
      preview:
        'Governments are talking more openly about procurement, coordination and industrial scale.',
      body: [
        'Security pressure has nudged European defense conversations toward execution: common orders, production bottlenecks and capability gaps. That does not erase political differences, but it changes the center of gravity.',
        'The tone is more managerial than visionary, which often means the work is becoming more real.',
        'The fast read is that Europe’s defense debate is getting less abstract.',
      ],
      originalUrl: 'https://www.theguardian.com/world/europe-defense-cooperation-practical',
    },
    {
      id: 'europa-7',
      source: 'NOS',
      minutesAgo: 97,
      headline:
        'Energy planners say cross-border cooperation is stronger, but households still feel the issue through bills',
      preview:
        'Strategic progress and consumer frustration continue to exist side by side.',
      body: [
        'From a systems perspective, Europe has improved coordination on storage, interconnection and contingency planning. From a household perspective, the issue remains stubbornly personal and financial.',
        'That split explains why officials can point to progress while voters still feel uneasy.',
        'The key point is that macro resilience does not instantly translate into political comfort.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/europa-energy-bills',
    },
    {
      id: 'europa-8',
      source: 'The Guardian',
      minutesAgo: 111,
      headline:
        'Europe’s digital identity push is picking up, but trust will decide the pace of adoption',
      preview:
        'The technology is only part of the challenge; public confidence and implementation quality matter just as much.',
      body: [
        'Digital identity projects promise convenience and interoperability, but adoption depends on whether users believe the systems are secure, limited and genuinely useful.',
        'Officials know that one badly handled rollout can do more damage than a slower, steadier launch.',
        'The short read is that Europe’s digital future is still a trust project.',
      ],
      originalUrl: 'https://www.theguardian.com/world/europe-digital-identity-trust',
    },
    {
      id: 'europa-9',
      source: 'NOS',
      minutesAgo: 124,
      headline:
        'Europe keeps looking for a cleaner industrial story that can compete with the US and China',
      preview:
        'The challenge is to sound ambitious on investment without reopening every state-aid fight.',
      body: [
        'European officials want a sharper industrial narrative because competition with larger subsidy regimes is now impossible to ignore. But every push for speed runs into old questions about fiscal fairness and single-market balance.',
        'That tension is why the policy language often sounds bolder than the final mechanism.',
        'The update here is that Europe is still searching for its cleanest economic pitch.',
      ],
      imageUrl: '/images/europa-focus.svg',
      originalUrl: 'https://nos.nl/l/europa-industrial-story',
    },
    {
      id: 'europa-10',
      source: 'The Guardian',
      minutesAgo: 138,
      headline:
        'Why so many Europe stories now come down to execution capacity',
      preview:
        'The bloc has no shortage of plans; the pressure is on delivery, coordination and visible results.',
      body: [
        'Whether the subject is defense, green industry, migration or digital policy, European debates increasingly narrow to a familiar question: can institutions deliver at the speed the moment demands?',
        'That does not make Europe uniquely weak; it simply reflects the complexity of governing through multiple layers of authority.',
        'If you keep one frame from this article, keep execution capacity.',
      ],
      originalUrl: 'https://www.theguardian.com/world/europe-execution-capacity',
    },
  ],
}

export const articles: Article[] = Object.entries(topicSeeds).flatMap(
  ([topicId, seeds]) => seeds.map((seed) => buildArticle(topicId, seed)),
)

export function getArticlesForTopic(topicId: string) {
  return articles.filter((article) => article.topicId === topicId)
}
