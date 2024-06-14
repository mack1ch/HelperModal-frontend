import { PageLayout } from "@/shared/layouts/pageLayout";
import styles from "./ui.module.scss";
import { EmailForm } from "@/features/email-slice/emailFom";

export const Email = () => {
  return (
    <>
      <PageLayout>
        <div className={styles.wrap}>
          <p className={styles.p}>
            Время ожидания ответа зависит от нагрузки на операторов, но обычно
            не превышает 2 часа
          </p>
          <EmailForm />
          <p
            style={{ color: "#adadad", marginTop: "12px" }}
            className={styles.p}
          >
            Или напишите на почту postideas@mail.ru
          </p>
        </div>
      </PageLayout>
    </>
  );
};
