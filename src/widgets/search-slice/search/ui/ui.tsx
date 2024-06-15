import { SearchInput } from "@/entities/search-slice/searchInput";
import { PDFViewerComponent } from "@/features/search-slice/searchRender/ui/ui";
import { PageLayout } from "@/shared/layouts/pageLayout";
import { SearchProps } from "antd/es/input";
import { useState } from "react";

export const Search = () => {
  const [searchValue, setSearchValue] = useState<string>("ЭДО");

  const [searchArrayValues, setSearchArrayValues] = useState<
    string[] | undefined
  >(undefined);
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    setSearchValue(value);

  return (
    <>
      <PageLayout style={{ gap: "12px" }}>
        <SearchInput onSearch={onSearch} />
       
      </PageLayout>
    </>
  );
};
