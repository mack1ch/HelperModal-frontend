import React from "react";

export const formatText = (text: string[]) => {
  const parts = [];
  let temp = "";

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "*" && text[i + 1] === "*") {
      // Bold text
      if (temp) parts.push(temp);
      temp = "";
      let j = i + 2;
      while (j < text.length && !(text[j] === "*" && text[j + 1] === "*")) {
        temp += text[j];
        j++;
      }
      parts.push(
        <span key={parts.length} style={{ fontWeight: 600 }}>
          {temp}
        </span>
      );
      temp = "";
      i = j + 1;
    } else if (text[i] === "`") {
      // Italic text
      if (temp) parts.push(temp);
      temp = "";
      let j = i + 1;
      while (j < text.length && text[j] !== "`") {
        temp += text[j];
        j++;
      }
      parts.push(
        <span key={parts.length} style={{ fontStyle: "italic" }}>
          {temp}
        </span>
      );
      temp = "";
      i = j;
    } else {
      temp += text[i];
    }
  }

  if (temp) parts.push(temp);

  return parts;
};
