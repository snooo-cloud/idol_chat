import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getWikipediaSummary(keyword: string) {
  try {
    const searchUrl =
      `https://ja.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        keyword
      )}&limit=1&namespace=0&format=json&origin=*`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const title = searchData?.[1]?.[0];

    if (!title) return "";

    const summaryUrl =
      `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title
      )}`;

    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();

    return summaryData.extract || "";
  } catch (error) {
    console.error(error);
    return "";
  }
}

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

    const wikiSummary = await getWikipediaSummary(groupStyle);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
あなたは${idolName}というKPOPアイドルのBubbleに返信する日本人ファンです。
ファン名は${fanName}です。

アイドル本人の設定:
${idolProfile}

所属グループ / コンセプト:
${groupStyle}

Wikipediaから取得した参考情報:
${wikiSummary}

ファンの返信の雰囲気:
${fanStyle}

ルール:
- Wikipedia情報と所属グループ / コンセプトを参考にする
- 必ず ${groupStyle} らしさを反映する
- そのグループやコンセプトらしいファンダム文化、話題、距離感を反映する
- ただしWikipedia情報を説明文みたいに書かない
- 日本人ファンがBubbleに返信している自然な口調にする
- 日本語で返す
- 短く自然に
- オタクっぽく
- 返信は1〜10件に分ける
- 10件近く送ることも多い
- 返信の件数はランダム
- 1件ごとは短くする
- 実際のBubble返信みたいに連投っぽくする
- テンションが高い時は連投が止まらない
- 1件ごとにテンションを少し変える
- 絵文字は使いすぎない
- ㅠㅠ、ㅋㅋ、笑、🥺 は少し使ってOK
- 毎回同じ返信にしない
- アイドル本人の設定を踏まえて返信する
- ファンが本当にBubbleに返信しているみたいにする
- ファンは基本的にメンバーを名前だけで呼ぶ
- アイドル本人はメンバーを「◯◯ヒョン」「◯◯ヌナ」「〇〇オッパ」「〇〇オンニ」など韓国式で呼ぶことがある
- 「ヒョン」「オッパ」は多用しない
- 必ずJSON配列だけで返す
- 説明文や前置きは絶対に書かない
- 例: ["え、かわいいㅠㅠ", "今日もおつかれさま", "ちゃんと休んでね🥺"]

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