"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Counter() {
  const [value, setValue] = useState(null);

  useEffect(() => {
    axios
      .get("https://api.countapi.xyz/hit/designandcreation-compteur/visits")
      .then((res) => {
        const v = res.data?.value;
        setValue(typeof v === "number" ? v : res.data);
      })
      .catch(() => {
        setValue(null);
      });
  }, []);

  return (
    <div>
      <p id="msg" style={{ color: "#fff" }}>
        Nombres de pages vues
      </p>
      <span id="counter">
        {value != null ? (
          <p style={{ color: "#fff" }}>{String(value)}</p>
        ) : (
          <p style={{ color: "#888" }}>—</p>
        )}
      </span>
    </div>
  );
}
