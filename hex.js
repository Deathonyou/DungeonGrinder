const map = document.getElementById("map");

    function createHexagon(x, y) {
      const hex = document.createElement("div");
      hex.className = "hex";
      hex.addEventListener("mouseenter", () => {
        hex.style.backgroundColor = "#e0e0e0";
      });
      hex.addEventListener("mouseleave", () => {
        hex.style.backgroundColor = "#f0f0f0";
      });
      hex.addEventListener("click", () => {
        showPopup(x, y);
      });
      map.appendChild(hex);
    }

    function showPopup(x, y) {
      const popup = document.createElement("div");
      popup.className = "popup";
      popup.innerHTML = `Money: $100<br>Troops: 50<br>Level: 3`;
      map.appendChild(popup);
      popup.style.top = `${y}px`;
      popup.style.left = `${x}px`;
      popup.style.display = "block";
      popup.addEventListener("click", () => {
        popup.style.display = "none";
      });
    }

    const numRows = 5;
    const numCols = 5;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const x = j * 120;
        const y = i * 100 + (j % 2) * 50;
        createHexagon(x, y);
      }
    }