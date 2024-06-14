import { Button } from "antd";
import styles from "./ui.module.scss";
import { MessageOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const SearchRender = ({
  searchValue,
}: {
  searchValue: string | undefined;
}) => {
  const router = useRouter();
  return (
    <>
      {searchValue === "" ? (
        <div className={styles.wrap}>
          <p className={styles.p}>Ничего не найдено</p>
          <p className={styles.p}>
            Уточните запрос, или напишите нам в{" "}
            <Button
              icon={<MessageOutlined />}
              onClick={() => router.push("/messenger")}
              size="small"
              type="link"
            >
              чат
            </Button>
          </p>
        </div>
      ) : (
        <div className={styles.render}>
          <p className={styles.p}>Найдено результатов: 777</p>

          <div className={styles.wrap}>
            <Link href="/search" className={styles.link}>
                <h4 className={styles.h4}>Отправка отчетов в Заявки</h4>
                <h5 className={styles.h5}>Вознаграждение</h5>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
