import { PageLayout } from "@/shared/layouts/pageLayout";
import styles from "./ui.module.scss";
import Email from "../../../../../public/icons/footer/envelopeSimple.svg";
import Phone from "../../../../../public/icons/footer/phone.svg";
import Search from "../../../../../public/icons/footer/magnifyingGlass.svg";
import Image from "next/image";
import { Divider } from "antd";
import Star from "../../../../../public/icons/footer/star.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
export const Footer = () => {
  const router = useRouter();
  return (
    <>
      <PageLayout>
        <footer className={styles.footerWrap}>
          <Link href="/search" className={styles.btn}>
            <Image src={Search} width={24} height={24} alt="Search" />
            Поиск по Помощи
          </Link>
          <Divider />
          <Link href="/email" className={styles.btn}>
            <Image src={Email} width={24} height={24} alt="Email" />
            Написать письмо
          </Link>
          <Link href="/phone" className={styles.btn}>
            <Image src={Phone} width={24} height={24} alt="Phone" />
            Связаться по телефону
          </Link>
          <Link href="/feedback" className={styles.btn}>
            <Image src={Star} width={24} height={24} alt="Star" />
            Оценить и оставить отзыв
          </Link>
        </footer>
      </PageLayout>
    </>
  );
};
