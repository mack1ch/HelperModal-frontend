import { PageLayout } from "@/shared/layouts/pageLayout";
import styles from "./ui.module.scss";
import { Avatar } from "antd";
import Avatar1 from "../../../../../public/assets/avatars/techUser_1.jpg";
import Avatar2 from "../../../../../public/assets/avatars/techUser_2.jpg";
import Avatar3 from "../../../../../public/assets/avatars/techUser_3.jpg";
import Image from "next/image";
import Chat from "../../../../../public/icons/main/chatCircleText.svg";
import WhatsApp from "../../../../../public/assets/avatars/whatsApp.png";
import Telegram from "../../../../../public/assets/avatars/telegram.png";
import { useRouter } from "next/navigation";

export const Main = () => {
  const router = useRouter();
  return (
    <>
      <PageLayout
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 10px 15px 0 rgba(0, 0, 0, 0.08);",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <main className={styles.mainWrap}>
          <Avatar.Group>
            <Avatar size="large" src={Avatar1.src} />
            <Avatar size="large" src={Avatar2.src} />
            <Avatar size="large" src={Avatar3.src} />
          </Avatar.Group>
          <p className={styles.p}>
            Мы в сети и готовы помочь в течение нескольких минут
          </p>
          <div className={styles.btns}>
            <button
              onClick={() => router.push("/messenger")}
              className={styles.mainBtn}
            >
              <Image src={Chat} width={20} height={20} alt="Chat" />
              Написать в чат
            </button>
            <button className={styles.whatsApp}>
              <Image src={WhatsApp} width={32} height={32} alt="Chat" />
            </button>
            <button
              onClick={() => router.push("https://t.me/oneformestudio")}
              className={styles.telegram}
            >
              <Image src={Telegram} width={32} height={32} alt="Chat" />
            </button>
          </div>
        </main>
      </PageLayout>
    </>
  );
};
