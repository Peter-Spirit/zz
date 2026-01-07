<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>体重記録アプリ</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 20px;
      max-width: 420px;
    }

    .weight-area {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 10px;
    }

    input {
      width: 90px;
      text-align: center;
      font-size: 16px;
    }

    button {
      font-size: 14px;
      padding: 6px 10px;
      margin-top: 5px;
    }

    ul {
      padding-left: 18px;
    }

    li {
      margin-bottom: 4px;
      font-size: 14px;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  </style>
</head>
<body>

  <!-- 現在日時 -->
  <h2 id="datetime"></h2>

  <!-- 体重入力 -->
  <div class="weight-area">
    <button id="minus">ー</button>
    <input type="number" id="weight" step="0.1">
    <button id="plus">＋</button>
  </div>

  <!-- 記録 -->
  <button id="save">記録</button>

  <!-- 操作ボタン -->
  <div class="actions">
    <button id="exportCsv">CSV出力</button>
    <button id="clearRecords">履歴クリア</button>
  </div>

  <!-- 履歴 -->
  <h3>記録履歴</h3>
  <ul id="recordList"></ul>

  <script>
    // =====================
    // 現在日時表示
    // =====================
    function updateDateTime() {
      const now = new Date();
      const formatted =
        `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ` +
        `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
      document.getElementById("datetime").textContent = formatted;
    }
    updateDateTime();

    // =====================
    // 要素取得
    // =====================
    const weightInput = document.getElementById("weight");
    const recordList = document.getElementById("recordList");

    // =====================
    // 前回体重の復元
    // =====================
    const lastWeight = localStorage.getItem("lastWeight");
    if (lastWeight) {
      weightInput.value = lastWeight;
    }

    // =====================
    // ±ボタン
    // =====================
    document.getElementById("plus").addEventListener("click", () => {
      const v = parseFloat(weightInput.value) || 0;
      weightInput.value = (v + 0.1).toFixed(1);
    });

    document.getElementById("minus").addEventListener("click", () => {
      const v = parseFloat(weightInput.value) || 0;
      weightInput.value = (v - 0.1).toFixed(1);
    });

    // =====================
    // 履歴描画
    // =====================
    function renderRecords() {
      recordList.innerHTML = "";
      const records = JSON.parse(localStorage.getItem("records")) || [];

      records.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.datetime}  体重: ${r.weight}kg`;
        recordList.appendChild(li);
      });
    }

    // =====================
    // 記録保存
    // =====================
    document.getElementById("save").addEventListener("click", () => {
      const weight = parseFloat(weightInput.value);
      if (isNaN(weight)) return;

      const now = new Date();
      const formatted =
        `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ` +
        `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

      const record = {
        datetime: formatted,
        weight: weight   // ← 数値のみ
      };

      const records = JSON.parse(localStorage.getItem("records")) || [];
      records.push(record);

      localStorage.setItem("records", JSON.stringify(records));
      localStorage.setItem("lastWeight", weight);

      renderRecords();
    });

    // =====================
    // CSV出力
    // =====================
    document.getElementById("exportCsv").addEventListener("click", () => {
      const records = JSON.parse(localStorage.getItem("records")) || [];
      if (records.length === 0) return;

      let csv = "datetime,weight\n";
      records.forEach(r => {
        csv += `${r.datetime},${r.weight}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "weight_records.csv";
      a.click();

      URL.revokeObjectURL(url);
    });

    // =====================
    // 履歴クリア
    // =====================
    document.getElementById("clearRecords").addEventListener("click", () => {
      if (!confirm("履歴をすべて削除しますか？")) return;

      localStorage.removeItem("records");
      renderRecords();
    });

    // 初期表示
    renderRecords();
  </script>

</body>
</html>
