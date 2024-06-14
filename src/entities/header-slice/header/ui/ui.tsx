import { PageLayout } from "@/shared/layouts/pageLayout";
import styles from "./ui.module.scss";
import { ReactNode } from "react";
export const Header = ({
  leftIcon,
  children,
  rightIcon,
}: {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <>
      <PageLayout style={{ backgroundColor: "#fff" }}>
        <header className={styles.headerWrap}>
          <picture className={styles.leftIcon}>{leftIcon}</picture>
          <h3 className={styles.h1}>{children}</h3>
          <picture className={styles.icon}>{rightIcon}</picture>
        </header>
      </PageLayout>
    </>
  );
};
