export type Article = {
  id: string;
  title: string;
  source: string;
  url: string;
  summary: string;
  tip: string;
};

export const ARTICLES: Article[] = [
  { id: "apa-control", title: "Controlling anger before it controls you", source: "American Psychological Association", url: "https://www.apa.org/topics/anger/control", summary: "Why anger happens, and proven ways to calm down: relaxation, changing how you think, and better communication.", tip: "Swap 'always' and 'never' for accurate words. Absolute thinking makes anger hotter." },
  { id: "apa-strategies", title: "Strategies for controlling your anger", source: "American Psychological Association", url: "https://www.apa.org/topics/anger/strategies-controlling", summary: "Practical, everyday tools psychologists recommend for keeping anger at a healthy level.", tip: "Repeat a calm phrase slowly, like 'take it easy', while breathing from your belly." },
  { id: "mayo-tips", title: "Anger management: 10 tips to tame your temper", source: "Mayo Clinic", url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434", summary: "Ten clear steps: think before you speak, take a timeout, exercise, and use 'I' statements.", tip: "Use 'I' statements: 'I feel upset when…' instead of blaming." },
  { id: "nhs-anger", title: "Get help with anger", source: "NHS", url: "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anger/", summary: "How to spot signs of anger early and quick things you can do in the moment and long term.", tip: "Count to 10 and walk away from the trigger before you respond." },
  { id: "nhs-cbt", title: "Cognitive behavioural therapy (CBT)", source: "NHS", url: "https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/cognitive-behavioural-therapy-cbt/overview/", summary: "What CBT is, how it breaks problems into thoughts, feelings and actions, and what to expect.", tip: "Write the situation, the thought, the feeling, and the action. Then question the thought." },
  { id: "mind-about", title: "About anger", source: "Mind", url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anger/about-anger/", summary: "Anger is a normal emotion. Learn when it becomes a problem and how it can show up.", tip: "Notice your body first: tight jaw, fast heart, hot face. These are early warnings." },
  { id: "mind-outbursts", title: "Managing outbursts", source: "Mind", url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anger/managing-outbursts/", summary: "Ways to stay safe and get through an outburst, and how to reflect afterwards.", tip: "Give yourself space: step outside or into another room until the wave passes." },
  { id: "helpguide", title: "Anger management: tips and techniques", source: "HelpGuide", url: "https://www.helpguide.org/mental-health/wellbeing/anger-management", summary: "Explore what's behind your anger, learn your triggers, and cool down quickly.", tip: "Ask: will this matter in a year? Is it worth ruining my day?" },
  { id: "harvard-breath", title: "Relaxation techniques: breath control helps quell stress", source: "Harvard Health", url: "https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response", summary: "How slow, deep breathing triggers the relaxation response and reduces stress.", tip: "Breathe in through the nose so your belly rises, and breathe out more slowly." },
  { id: "cleveland-cbt", title: "Cognitive behavioral therapy (CBT)", source: "Cleveland Clinic", url: "https://my.clevelandclinic.org/health/treatments/21208-cognitive-behavioral-therapy-cbt", summary: "A plain-language guide to CBT techniques like cognitive restructuring and exposure.", tip: "Catch 'should' thoughts about others. They often hide unmet expectations." },
  { id: "verywell", title: "Anger management strategies", source: "Verywell Mind", url: "https://www.verywellmind.com/anger-management-strategies-4178870", summary: "Simple ways to manage anger, from identifying triggers to problem-solving.", tip: "Keep a short anger log for a week to find your patterns." },
];

export const CBT_TIPS = [
  "Name it to tame it: say 'I'm feeling angry' out loud.",
  "Look for thinking traps: mind-reading, catastrophising, black-and-white thinking.",
  "Ask: what's the evidence for this thought, and against it?",
  "Ask: what would I tell a friend in this situation?",
  "Delay your reply. Most urgent anger fades in 20 minutes.",
  "Focus on what you can control, not what others should do.",
  "Swap 'They did it on purpose' for 'Maybe they're having a hard day'.",
  "After a flare-up, write one thing you'd do differently next time.",
  "Tense your fists for 5 seconds, then release. Notice the difference.",
  "Replace 'I can't stand this' with 'I don't like this, but I can handle it'.",
];

export function dayIndex(d = new Date()) {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
}

export function todaysArticles(count = 5) {
  const start = (dayIndex() * 3) % ARTICLES.length;
  return Array.from({ length: count }, (_, i) => ARTICLES[(start + i) % ARTICLES.length]);
}

export function todaysTip() {
  return CBT_TIPS[dayIndex() % CBT_TIPS.length];
}
