/**
 AIチャットボットの挙動制御
*/
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.querySelector(".ai-modal-overlay");
  const aiButton = document.querySelector("#ai-chat-button");
  const closeButton = document.querySelector(".ai-modal-close");
  const sendButton = document.querySelector("#ai-send-button");
  const input = document.querySelector("#ai-user-input");
  const responseArea = document.querySelector("#ai-response");
  const icon = document.getElementById("ai-icon");

  // 🌱 記事タイトル取得
  const plantTitleEl = document.querySelector("#single-header-title");
  const plantTitle = plantTitleEl ? plantTitleEl.innerText : "不明な植物";

  // 📝 初期入力をセット（簡単説明）
  input.value = `この記事「${plantTitle}」に登場する植物について、簡単に説明してください。`;

  document.querySelectorAll(".ai-example-button").forEach(btn => {
    btn.addEventListener("click", () => {
      // 質問送信時に「考え中」に変更
      icon.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYg-9jUp-ak7w8ixCordLaC8qVz71rkGAnAijuoIKG1ip3s196ZQwDkFma8cw0nACykrEgk5vk_AijtLsBRxOCVat_OadVwozmF4hO4joGjO7Q3P_cCBOumuioI6OYgAol7Hrwl-dJvVGBm1SC-ZfJHNuoJo3Vo-6kouNy9eq-30lTo93BRUi2-6EkPrMD/s1600/ai_cat_thinking.png";

      const question = btn.getAttribute("data-question");
      // 入力欄にセットせず、直接送信処理へ
      handleAiQuestion(question);
    });
  });


  // モーダル開閉処理
  if (aiButton && modal) {
    aiButton.addEventListener("click", function () {
      modal.style.display = "flex";
      input.value = "";
      responseArea.innerHTML = "<p>質問すると、わたし(AI)がここで回答します。</p>";
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }
// モーダル以外がクリックされたら閉じる
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // 送信ボタン押下時
  if (sendButton) {
    sendButton.addEventListener("click", function () {

      
      // 質問送信時に「考え中」に変更
      icon.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYg-9jUp-ak7w8ixCordLaC8qVz71rkGAnAijuoIKG1ip3s196ZQwDkFma8cw0nACykrEgk5vk_AijtLsBRxOCVat_OadVwozmF4hO4joGjO7Q3P_cCBOumuioI6OYgAol7Hrwl-dJvVGBm1SC-ZfJHNuoJo3Vo-6kouNy9eq-30lTo93BRUi2-6EkPrMD/s1600/ai_cat_thinking.png";
    
      const userInput = input.value.trim();

      if (!userInput) {
        responseArea.innerHTML = "<p>質問が空っぽだわ。何か聞きなさいよね。</p>";
        return;
      }

      if (userInput.length > 300) {
        responseArea.innerHTML = "<p>質問が長すぎるわ。300文字以内にしてちょうだい。</p>";
        return;
      }

      handleAiQuestion(userInput);
      input.value = "";
    });
  }
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // 改行を防ぐ（Shift+Enterなら改行可能に）
      sendButton.click();
		
    }
  });



});
// 🔹 質問文字列を直接AIに送信する共通関数
function handleAiQuestion(questionText) {
  const responseArea = document.getElementById("ai-response");
  const plantTitleEl = document.querySelector("#single-header-title");
  const plantTitle = plantTitleEl ? plantTitleEl.innerText : "不明な植物";
const icon = document.getElementById("ai-icon"); // ← これを追加！


  if (!questionText || !responseArea) return;

  const fullQuestion = `この記事「${plantTitle}」に登場する植物についての質問です。\n${questionText}`;

  responseArea.innerHTML = "<p>（思考を巡らせています…）</p>";

  const callbackName = "handleAiResponse_" + Date.now();
  window[callbackName] = function (data) {
    icon.src = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_mOOiC2p77k5knfsM15_ZAtWZ_dXQ8JgAD6psgtxXhxoS19E8zLqlDz4y3oxeDDED1qo5ViC2VOEPhSieinUYnnU-4IUeNy7MhmQlNf2rVcyLnoQLEuAHfw_4zMDD86uJugS9VDZ38KDRRRDHU10ouZwqkb1iXa6YhmTTUc40Pt-24hKqFfPPdpgW1G8z/s1600/ai_cat_normal.png";
    responseArea.innerHTML = `<p>${data.reply}</p>`;
    delete window[callbackName];
  };


  const script = document.createElement("script");
  script.src =
    GAS_DEPLOY_URL
    + "?mode=aiChat"
    + "&question=" + encodeURIComponent(fullQuestion)
    + "&callback=" + callbackName;

  document.body.appendChild(script);
}
