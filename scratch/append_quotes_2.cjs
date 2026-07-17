const fs = require('fs');

const moreQuotes = [
  // Stoics & Classic Philosophers
  { text: "No person has the power to have everything they want, but it is in their power not to want what they don't have.", author: "Seneca", jp: "全てを手に入れる力はないが、持たないものを欲しがらない力はある" },
  { text: "Life is very short and anxious for those who forget the past, neglect the present, and fear the future.", author: "Seneca", jp: "過去を忘れ、現在を疎かにし、未来を恐れる者の人生は短く不安だ" },
  { text: "We should always be asking ourselves: 'Is this something that is, or is not, in my control?'", author: "Epictetus", jp: "常に自問せよ『これは自分のコントロール下にあるか？』と" },
  { text: "You don't have to turn this into something. It doesn't have to upset you.", author: "Marcus Aurelius", jp: "これを大ごとにしなくていい。心を乱す必要はない" },
  { text: "If you want to improve, be content to be thought foolish and stupid.", author: "Epictetus", jp: "向上したいなら、愚かだと思われることに満足せよ" },
  
  // Confucius & Chinese Philosophy
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", jp: "止まらない限り、どんなにゆっくりでも構わない" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", jp: "人生は実にシンプルだが、私たちはそれを複雑にしたがる" },
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius", jp: "どんなものにも美しさはあるが、誰もが見るわけではない" },
  { text: "Wheresoever you go, go with all your heart.", author: "Confucius", jp: "どこへ行くにも、心からそこへ行け" },
  { text: "To be wronged is nothing unless you continue to remember it.", author: "Confucius", jp: "忘れさえすれば、傷つけられたことなど何でもない" },
  { text: "When anger rises, think of the consequences.", author: "Confucius", jp: "怒りが湧いた時は、その結果を考えよ" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius", jp: "山を動かす者は、小さな石を運ぶことから始める" },
  
  // Contemporary & Psychological Wisdom
  { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor E. Frankl", jp: "刺激と反応の間には空間がある。そこに反応を選ぶ力がある" },
  { text: "When we are no longer able to change a situation, we are challenged to change ourselves.", author: "Viktor E. Frankl", jp: "状況を変えられない時、私たちは自分自身を変えるよう求められる" },
  { text: "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances.", author: "Viktor E. Frankl", jp: "どんな状況でも自分の態度を選ぶ自由だけは奪えない" },
  { text: "What you resist, persists.", author: "Carl Jung", jp: "抵抗するものは持続する" },
  { text: "Who looks outside, dreams; who looks inside, awakes.", author: "Carl Jung", jp: "外を見る者は夢を見、内を見る者は目覚める" },
  { text: "I am not what happened to me, I am what I choose to become.", author: "Carl Jung", jp: "私は私に起きたことではなく、私が選んだものになる" },
  { text: "Knowing your own darkness is the best method for dealing with the darknesses of other people.", author: "Carl Jung", jp: "自分の闇を知ることが、他人の闇を扱う最良の方法だ" },
  
  // Assorted Zen & Japanese Wisdom
  { text: "One kind word can warm three winter months.", author: "Japanese Proverb", jp: "一つの優しい言葉は三冬を暖める" },
  { text: "If you make a mistake, don't hesitate to correct it.", author: "Japanese Proverb", jp: "過ちては改むるに憚ることなかれ" },
  { text: "The nail that sticks out gets hammered down. (But a strong nail withstands the hammer.)", author: "Japanese Proverb", jp: "出る杭は打たれる（が、強い杭は耐える）" },
  { text: "My barn having burned down, I can now see the moon.", author: "Mizuta Masahide", jp: "蔵焼けて障るものなき月見哉" },
  { text: "Muddy water is best cleared by leaving it alone.", author: "Alan Watts", jp: "泥水は放っておくのが一番澄む" },
  { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts", jp: "変化を理解する唯一の方法は、それに飛び込み、一緒に踊ることだ" },
  { text: "Trying to define yourself is like trying to bite your own teeth.", author: "Alan Watts", jp: "自分を定義しようとするのは、自分の歯を噛もうとするようなものだ" },
  { text: "This is the real secret of life -- to be completely engaged with what you are doing in the here and now.", author: "Alan Watts", jp: "人生の真の秘密は、今ここでしていることに完全に没頭することだ" },
  { text: "Problems that remain persistently insoluble should always be suspected as questions asked in the wrong way.", author: "Alan Watts", jp: "解決できない問題は、問い方が間違っていると疑うべきだ" },
  { text: "The meaning of life is just to be alive. It is so plain and so obvious and so simple.", author: "Alan Watts", jp: "人生の意味はただ生きていることだ。それはとても単純で明白だ" },
  
  // Poets and Visionaries
  { text: "Be patient toward all that is unsolved in your heart and try to love the questions themselves.", author: "Rainer Maria Rilke", jp: "心の中の未解決なものに忍耐を持ち、問いそのものを愛そうとせよ" },
  { text: "The only journey is the one within.", author: "Rainer Maria Rilke", jp: "唯一の旅は、内なる旅だ" },
  { text: "The most beautiful things in the world cannot be seen or touched, they are felt with the heart.", author: "Antoine de Saint-Exupéry", jp: "世界で最も美しいものは見えず触れられない。心で感じるものだ" },
  { text: "It is only with the heart that one can see rightly; what is essential is invisible to the eye.", author: "Antoine de Saint-Exupéry", jp: "心でしか正しく見えない。本質的なものは目に見えない" },
  { text: "Nature always wears the colors of the spirit.", author: "Ralph Waldo Emerson", jp: "自然は常に精神の色をまとっている" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", jp: "道がある場所へ行くのではなく、道なき場所へ行き、足跡を残せ" },
  { text: "Keep your face always toward the sunshine - and shadows will fall behind you.", author: "Walt Whitman", jp: "常に太陽に顔を向けよ。そうすれば影はあなたの後ろに落ちる" },
  { text: "Be curious, not judgmental.", author: "Walt Whitman", jp: "批判的でなく、好奇心を持て" },
  
  // Final assortment
  { text: "Quiet people have the loudest minds.", author: "Stephen Hawking", jp: "静かな人は、最も騒がしい心を持っている" },
  { text: "To love oneself is the beginning of a lifelong romance.", author: "Oscar Wilde", jp: "自分を愛することは、生涯続くロマンスの始まりだ" },
  { text: "Nothing is impossible, the word itself says 'I'm possible'!", author: "Audrey Hepburn", jp: "不可能なんてない。言葉自体が『私には可能だ』と言っている" },
  { text: "You must do the things you think you cannot do.", author: "Eleanor Roosevelt", jp: "自分にはできないと思うことをしなければならない" },
  { text: "We do not remember days, we remember moments.", author: "Cesare Pavese", jp: "私たちは日々を思い出すのではない、瞬間を思い出すのだ" },
  { text: "Wherever you are, be there totally.", author: "Eckhart Tolle", jp: "どこにいようと、完全にそこにいなさい" }
];

const currentContent = fs.readFileSync('../src/data/quotes.js', 'utf8');

const closingBracketIndex = currentContent.lastIndexOf('];');
if (closingBracketIndex > -1) {
  const newQuotesStr = moreQuotes.map(q => `  { text: ${JSON.stringify(q.text)}, author: ${JSON.stringify(q.author)}, jp: ${JSON.stringify(q.jp)} }`).join(',\n') + ',\n';
  
  const updatedContent = currentContent.slice(0, closingBracketIndex) + '  // Added 40+ quotes\n' + newQuotesStr + currentContent.slice(closingBracketIndex);
  
  fs.writeFileSync('../src/data/quotes.js', updatedContent);
  console.log('Appended ' + moreQuotes.length + ' quotes.');
}
