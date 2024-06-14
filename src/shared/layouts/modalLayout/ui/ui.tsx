import { ConfigProvider, ThemeConfig } from "antd";
import { ReactNode } from "react";
import styles from "./ui.module.scss";
export const AppLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <>
      <ConfigProvider theme={globalTheme}>
        <div className={styles.page}>{children}</div>
      </ConfigProvider>
    </>
  );
};

export const globalTheme: ThemeConfig = {
  token: {
    colorPrimary: "#6CACE4",
  },
};
