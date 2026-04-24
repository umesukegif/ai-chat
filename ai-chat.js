document.addEventListener("DOMContentLoaded", function () {
  const modal = document.querySelector(".ai-modal-overlay");
  const sendButton = document.querySelector("#ai-send-button");
  const input = document.querySelector("#ai-user-input");
  const responseArea = document.querySelector("#ai-response");
  const icon = document.getElementById("ai-icon");

  const GAS_DEPLOY_URL = "ここにGASのURL";

  // 送信処理
  if (sendButton) {
    sendButton.addEventListener("click", function () {

      const userInput = input.value.trim();

      if (!userInput) {
        responseArea.innerHTML = "<p>質問が空っぽだわ。何か聞きなさいよね。</p>";
        return;
      }

      if (userInput.length > 300) {
        responseArea.innerHTML = "<p>質問が長すぎるわ。300文字以内にしてちょうだい。</p>";
        return;
      }

      icon.src = "thinking画像URL";

      handleAiQuestion(userInput);
      input.value = "";
    });
  }

  function handleAiQuestion(questionText) {
    const plantTitleEl = document.querySelector("#single-header-title");
    const plantTitle = plantTitleEl ? plantTitleEl.innerText : "不明な植物";

    const fullQuestion =
      `この記事「${plantTitle}」に登場する植物についての質問です。\n${questionText}`;

    responseArea.innerHTML = "<p>（思考を巡らせています…）</p>";

    const callbackName = "ai_cb_" + Date.now();

    window[callbackName] = function (data) {
      icon.src = "normal画像URL";
      responseArea.innerHTML = `<p>${data.reply}</p>`;
      delete window[callbackName];
    };

    const script = document.createElement("script");

    script.src =
      GAS_DEPLOY_URL +
      "?mode=aiChat" +
      "&question=" + encodeURIComponent(fullQuestion) +
      "&callback=" + callbackName;

    document.body.appendChild(script);
  }
});
