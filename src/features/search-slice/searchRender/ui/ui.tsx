import { fetcher } from "@/shared/api/restAPI";
import { ISearchRes } from "@/shared/interface/search";
import useSWR from "swr";
import styles from "./ui.module.scss";
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import Link from "next/link";
export const SearchRender = ({ searchValue }: { searchValue?: string }) => {
  const { data: searchedFiles } = useSWR<ISearchRes[]>(
    searchValue && searchValue.length > 0
      ? `/files?search=${searchValue}&isDocument=true`
      : "",
    fetcher
  );
  console.log(searchedFiles);
  return (
    <>
      <div className={styles.wrap}>
        {searchValue &&
        searchValue?.length > 0 &&
        searchedFiles &&
        searchedFiles.length > 0 ? (
          <div className={styles.header}>
            Найдено результатов: {searchedFiles.length}
          </div>
        ) : (
          searchValue &&
          searchValue?.length > 0 && (
            <div className={styles.header}>
              Уточните запрос, или напишите в{" "}
              <Button type="link" icon={<MessageOutlined />} size="small">
                Чат
              </Button>
            </div>
          )
        )}
        {searchedFiles && searchedFiles.length > 0 && (
          <div className={styles.main}>
            {searchedFiles.map((searchFile) => (
              <Link
                href={searchFile.link.toString()}
                className={styles.file}
                key={searchFile.id}
              >
                <p className={styles.name}>{searchFile.originalName}</p>
                <p className={styles.type}>{searchFile.mimeType}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
