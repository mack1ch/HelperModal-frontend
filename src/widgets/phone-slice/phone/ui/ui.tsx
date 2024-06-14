import { PageLayout } from "@/shared/layouts/pageLayout";
import styles from "./ui.module.scss";
import { PhoneForm } from "@/features/phone-slice/phoneForm";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { MessageOutlined } from "@ant-design/icons";

export const Phone = () => {
  const router = useRouter();
  return (
    <>
      <PageLayout>
        <div className={styles.wrap}>
          <p className={styles.p}>
            В чате ответим быстрее -
            <Button
              icon={<MessageOutlined />}
              onClick={() => router.push("/messenger")}
              size="small"
              type="link"
            >
              Написать в чат
            </Button>
          </p>
          <PhoneForm />
          <p
            style={{ color: "#adadad", marginTop: "12px" }}
            className={styles.p}
          >
            Или позвоните +7 (966) 701-17-18
          </p>
          <p
            style={{ color: "#adadad", marginTop: "-8px", textAlign: "center" }}
            className={styles.p}
          >
            Время ожидания такое же, как при заказе звонка
          </p>
        </div>
      </PageLayout>
    </>
  );
};
