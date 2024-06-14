import { SearchInput } from "@/entities/search-slice/searchInput";
import PDFViewer from "@/features/search-slice/searchRender/ui/ui";

import { PageLayout } from "@/shared/layouts/pageLayout";
import { SearchProps } from "antd/es/input";
import { useState } from "react";

export const Search = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchArrayValues, setSearchArrayValues] = useState<
    string[] | undefined
  >(undefined);
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    setSearchValue(value);
  console.log(searchValue);
  return (
    <>
      <PageLayout style={{ gap: "12px" }}>
        <SearchInput onSearch={onSearch} />
        <PDFViewer documentUrl="https://www.xeroxscanners.com/downloads/Manuals/XMSSD/PDF_Converter_Pro_Quick_Reference_Guide.RU.pdf" />
      </PageLayout>
    </>
  );
};
