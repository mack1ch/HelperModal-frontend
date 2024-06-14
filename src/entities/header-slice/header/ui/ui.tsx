import { PageLayout } from "@/shared/layouts/pageLayout";
import styles from "./ui.module.scss";
import { CSSProperties, ReactNode } from "react";
export const Header = ({
  leftIcon,
  children,
  rightIcon,
  style,
}: {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <>
      <PageLayout style={{ backgroundColor: "#fff", ...style }}>
        <header className={styles.headerWrap}>
          <picture className={styles.leftIcon}>{leftIcon}</picture>
          <h3 className={styles.h1}>{children}</h3>
          <picture className={styles.icon}>{rightIcon}</picture>
        </header>
      </PageLayout>
    </>
  );
};
