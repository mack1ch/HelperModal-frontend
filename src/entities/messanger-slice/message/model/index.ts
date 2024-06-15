export const formatText = (input: string) => {
  // Разделяем текст по шифру "$#*"
  const parts = input.split("$#*");

  // Создаем массив, где каждый элемент это предложение, которое должно быть на новой строке
  const formattedText = parts
    .flatMap((part, index) => {
      // Если это не последний элемент, добавляем его и разрыв строки
      if (index < parts.length - 1) {
        // Разделяем предложения по точке (или по другому знаку, если необходимо)
        const sentences = part.split(".");
        // Добавляем все предложения кроме последнего, а последнее переносим на новую строку
        return [
          ...sentences.slice(0, -1).map((sentence) => sentence.trim() + "."),
          sentences.slice(-1)[0].trim() + "<br>",
        ];
      }
      // Если это последний элемент, просто добавляем его
      return part.split(".").map((sentence) => sentence.trim() + ".");
    })
    .join("\n");

  return formattedText;
};
