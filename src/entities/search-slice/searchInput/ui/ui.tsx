import { Input } from "antd";
import { ChangeEvent, KeyboardEvent, MouseEvent } from "react";

const { Search } = Input;

export const SearchInput = ({
  onSearch,
}: {
  onSearch:
    | ((
        value: string,
        event?:
          | ChangeEvent<HTMLInputElement>
          | MouseEvent<HTMLElement>
          | KeyboardEvent<HTMLInputElement>,
        info?: {
          source?: "clear" | "input";
        }
      ) => void)
    | undefined;
}) => {
  return (
    <>
      <Search
        size="large"
        placeholder="Введите заголовок документа, например НДС"
        onSearch={onSearch}
        style={{ width: "100%" }}
      />
    </>
  );
};
