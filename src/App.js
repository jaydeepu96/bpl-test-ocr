import React, { useState } from "react";
import OCRComponent from "./components/OCRComponent";

function App() {
  const [text, setText] = useState("");
  const [compareText1, setCompareText1] = useState("");
  const [compareText2, setCompareText2] = useState("");

  return (
    <div>
      <main>
        <OCRComponent setText={setText} />
      </main>
    </div>
  );
}

export default App;
