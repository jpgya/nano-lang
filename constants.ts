import { ExampleCode, Language } from './types';

export const EXAMPLES: Record<Language, ExampleCode[]> = {
  en: [
    {
      name: "Hello World",
      code: `note Welcome to NanoLang!
say "Hello World!"
say "Coding is fun."`
    },
    {
      name: "Variables & Math",
      code: `set x = 10
set y = 5
say "X is " + x
say "Y is " + y
set result = x * y
say "Multiplication result: " + result`
    },
    {
      name: "Loops",
      code: `say "Counting down..."
repeat 5
  say "Loop iteration"
end
say "Done!"`
    },
    {
      name: "Logic",
      code: `set power = 9001
check power > 9000
  say "It is over 9000!"
end`
    }
  ],
  ja: [
    {
      name: "ハローワールド",
      code: `note NanoLangへようこそ！
say "こんにちは、世界！"
say "プログラミングは楽しい。"
`
    },
    {
      name: "変数と計算",
      code: `set x = 10
set y = 5
say "X は " + x
say "Y は " + y
set result = x * y
say "掛け算の結果: " + result`
    },
    {
      name: "繰り返し (ループ)",
      code: `say "カウントダウン..."
repeat 5
  say "繰り返しています"
end
say "終わり！"`
    },
    {
      name: "条件分岐 (もし〜なら)",
      code: `set power = 9001
check power > 9000
  say "パワーが9000を超えています！"
end`
    }
  ]
};

export const INITIAL_CODE = EXAMPLES.ja[0].code;
