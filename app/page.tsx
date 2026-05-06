"use client";

import { useState } from "react";

type Message = {
  sender: "idol" | "fan";
  text: string;
};

export default function Home() {
  const [screen, setScreen] = useState<"settings" | "chat">("settings");

  const [input, setInput] = useState("");
  const [idolName, setIdolName] = useState("しおん");
  const [fanName, setFanName] = useState("ENGENE");

  const [fanStyle, setFanStyle] = useState(
    "限界ファンっぽく、かわいく短く返信する。"
  );

  const [idolProfile, setIdolProfile] = useState(
    "KPOPアイドル。忙しいけどファン想いで優しい。"
  );

  const [messages, setMessages] = useState<Message[]>([
    { sender: "idol", text: "なにしてるの" },
    { sender: "idol", text: "僕は宿舎で休んでるよ" },
    { sender: "fan", text: "おつかれさま🥺" },
  ]);

  async function sendMessage() {
    if (!input.trim()) return;

    const idolText = input;

    const idolMessage: Message = {
      sender: "idol",
      text: idolText,
    };

    setMessages((prev) => [...prev, idolMessage]);
    setInput("");

    const res = await fetch("/api/fan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idolText: idolText,
        idolName: idolName,
        fanName: fanName,
        fanStyle: fanStyle,
        idolProfile: idolProfile,
      }),
    });

    const data = await res.json();

    const fanReplies: string[] = data.replies;

    const fanMessages: Message[] = fanReplies.map((reply) => ({
      sender: "fan",
      text: reply,
    }));

    setMessages((prev) => [...prev, ...fanMessages]);
  }

  return (
    <main className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {screen === "settings" ? (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-pink-500 mb-2">
              Bubble設定
            </h1>

            <p className="text-sm text-gray-500 mb-6">
              アイドルとファンの設定を決めてね
            </p>

            <div className="space-y-3">
              <input
                className="w-full border border-gray-300 rounded-full px-4 py-3 outline-none"
                value={idolName}
                onChange={(e) => setIdolName(e.target.value)}
                placeholder="アイドル名"
              />

              <input
                className="w-full border border-gray-300 rounded-full px-4 py-3 outline-none"
                value={fanName}
                onChange={(e) => setFanName(e.target.value)}
                placeholder="ファン名 例：ENGENE"
              />

              <textarea
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none h-28"
                value={idolProfile}
                onChange={(e) => setIdolProfile(e.target.value)}
                placeholder="アイドル本人の設定"
              />

              <textarea
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none h-28"
                value={fanStyle}
                onChange={(e) => setFanStyle(e.target.value)}
                placeholder="ファンの返信の雰囲気"
              />
            </div>

            <button
              className="w-full bg-pink-400 text-white py-3 rounded-full mt-6 font-bold"
              onClick={() => setScreen("chat")}
            >
              トークを始める
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-pink-400 text-white p-4 flex items-center justify-between">
              <button
                className="text-sm"
                onClick={() => setScreen("settings")}
              >
                設定
              </button>

              <div className="font-bold">{idolName}</div>

              <div className="text-sm opacity-0">設定</div>
            </div>

            <div className="space-y-4 p-4 h-[500px] overflow-y-auto bg-pink-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.sender === "idol"
                      ? "bg-pink-200 p-3 rounded-2xl ml-auto w-fit max-w-[80%]"
                      : "bg-white p-3 rounded-2xl w-fit max-w-[80%] shadow-sm"
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2 p-4 bg-white">
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`${idolName}として送る...`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />

              <button
                className="bg-pink-400 text-white px-4 py-2 rounded-full"
                onClick={sendMessage}
              >
                送信
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}