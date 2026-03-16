(function() {

  // إنشاء نافذة التنبيه
  let overlay = document.createElement("div");
  overlay.className = "alertOverlay";

  overlay.innerHTML = `
    <div class="alertBox">
      <div class="alertHeader">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
          <path d="M10.29 3.86l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.71-3.14l-8-14a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <circle cx="12" cy="17" r="1"/>
        </svg>
        الرسائل التحذيرية الطارئة
      </div>

      <div class="alertText" id="alertAr"></div>
      <hr>
      <button class="alertBtn" id="closeAlert">OK</button>

      <audio id="alert0"><source src="alert.mp3" type="audio/mpeg"></audio>
      <audio id="alert1"><source src="alert1.mp3" type="audio/mpeg"></audio>
    </div>
  `;

  document.body.appendChild(overlay);

  // CSS
  let style = document.createElement("style");
  style.innerHTML = `
    .alertOverlay{
      position:fixed;
      top:0; left:0;
      width:100%; height:100%;
      background:rgba(0,0,0,.35);
      display:none;
      align-items:center;
      justify-content:center;
      z-index:99999;
    }
    .alertBox{
      width:85vw;
      background:#fff;
      border-radius:18px;
      padding:22px;
      text-align:center;
      box-shadow:0 10px 30px rgba(0,0,0,0.2);
      font-family:system-ui;
    }
    .alertHeader{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:10px;
      font-size:18px;
      font-weight:bold;
      margin-bottom:12px;
    }
    .alertHeader svg{width:26px;height:26px;stroke:red;}
    .alertText{font-size:15px;margin-bottom:8px;}
    .alertBox hr{margin:15px 0;border:none;height:1px;background:#ddd;}
    .alertBtn{padding:8px 30px;border:none;border-radius:10px;background:black;color:white;font-size:15px;cursor:pointer;}
  `;
  document.head.appendChild(style);

  // الصوت
  let alert0 = document.getElementById("alert0");
  let alert1 = document.getElementById("alert1");
  alert0.addEventListener("ended", () => alert1.play());

  // اغلاق النافذة
  document.getElementById("closeAlert").onclick = function() {
    overlay.style.display = "none";
    alert0.pause(); alert1.pause();
    alert0.currentTime = 0; alert1.currentTime = 0;
  };

  // اظهار التنبيه
  function showAlert(data) {
    document.getElementById("alertAr").innerText = data.arabic;
    overlay.style.display = "flex";

    alert0.play().catch(()=>{});

    // إيقاف التنبيه بعد انتهاء الوقت المحدد
    let now = new Date().getTime();
    let duration = data.time - now;
    if(duration > 0) setTimeout(() => closeAlert(), duration);
  }

  // فحص التنبيه مرة واحدة لكل مستخدم
  let last = null;
  function check() {
    let alertShown = localStorage.getItem("globalAlertShown");
    if(alertShown) return; // تم عرض التنبيه بالفعل

    let saved = localStorage.getItem("globalAlertData");
    if(!saved || saved === last) return;

    let data = JSON.parse(saved);
    let now = new Date().getTime();

    if(now >= data.time){
      showAlert(data);
      localStorage.setItem("globalAlertShown","true");
      last = saved;
    }
  }

  setInterval(check, 1000);
  window.addEventListener("storage", check);

})();