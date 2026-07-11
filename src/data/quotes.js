export const quotes = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", jp: "千里の道も一歩から" },
  { text: "In the beginner's mind there are many possibilities.", author: "Shunryu Suzuki", jp: "初心忘るべからず" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb", jp: "七転び八起き" },
  { text: "The only failure is not trying.", author: "Masaharu Taniguchi", jp: "試みぬことこそ無念なり" },
  { text: "Do not seek to follow in the footsteps of the wise. Seek what they sought.", author: "Matsuo Basho", jp: "古池や蛙飛び込む水の音" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot", jp: "一期一会" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", jp: "侘び寂び" },
  { text: "The water does not resist. The water flows.", author: "Ursula K. Le Guin", jp: "水は流れる" },
  { text: "Be like bamboo - bend but do not break.", author: "Japanese Proverb", jp: "竹は風に屈するが折れない" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha", jp: "和は即ち貴し" },
  { text: "In the stillness between breaths, wisdom speaks.", author: "Zen Teaching", jp: "静寂の中に智慧あり" },
  { text: "One moment of patience may ward off great disaster.", author: "Japanese Proverb", jp: "我慢は後の味" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu", jp: "自然は急がずして成す" },
  { text: "The flower that blooms in adversity is the rarest and most beautiful.", author: "Ancient Proverb", jp: "逆境に咲く花は最も美しい" },
  { text: "Life is a journey, not a destination.", author: "Ralph Waldo Emerson", jp: "道は道なり" },
];

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
