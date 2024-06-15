import { SearchInput } from "@/entities/search-slice/searchInput";
import { SearchRender } from "@/features/search-slice/searchRender";
import { PageLayout } from "@/shared/layouts/pageLayout";
import { SearchProps } from "antd/es/input";
import { useState } from "react";

export const Search = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    setSearchValue(value);

  return (
    <>
      <PageLayout style={{ gap: "12px" }}>
        <SearchInput onSearch={onSearch} />
        <SearchRender searchValue={searchValue} />
      </PageLayout>
    </>
  );
};
