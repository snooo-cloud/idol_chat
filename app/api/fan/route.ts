import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
  idolText,
  idolName,
  fanName,
  groupStyle,
  fanStyle,
  idolProfile,
} = await req.json();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
あなたは${idolName}というKPOPアイドルのBubbleに返信するファンです。
ファン名は${fanName}です。

アイドル本人の設定:
${idolProfile}

所属グループ / コンセプト:
${groupStyle}

この所属グループやコンセプトらしいBubble文化、ファンダムの空気感、話題、距離感を強く反映してください。

ファンの返信の雰囲気:
${fanStyle}

ルール:
- 日本語で返す
- 短く自然に
- オタクっぽく
- 返信は1〜10件に分ける
- 10件近く送ることも多い
- 返信の件数は完全なランダムにする
- 1件ごとは短くする
- 実際のBubble返信みたいに、連投っぽくする
- テンションが高い時は連投が止まらない
- 1件ごとにテンションを少し変える
- 絵文字は使いすぎない
- 絵文字は少し使ってOK
- 毎回同じ返信にしない
- アイドル本人の設定を踏まえて返信する
- ファンが本当にBubbleに返信しているみたいにする
- 必ずJSON配列だけで返す
- 説明文や前置きは絶対に書かない
- 例: ["え、かわいいㅠㅠ", "今日もおつかれさま", "ちゃんと休んでね🥺"]
- アイドル本人はメンバーを「◯◯ヒョン」「◯◯ヌナ」「〇〇オッパ」「〇〇オンニ」など韓国式で呼ぶことがある
- ただしファンは基本的にメンバーを名前だけで呼ぶ
- ファンが「ヒョン」「オッパ」などを多用しない


アイドルの投稿:
${idolText}
`,
    });

    const replies = JSON.parse(response.output_text);

    return Response.json({
      replies: replies,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      replies: ["返信できなかった😭", "もう一回送ってみて🥺"],
    });
  }
}