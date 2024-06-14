import { ConfigProvider, ThemeConfig } from "antd";
import { CSSProperties, ReactNode } from "react";
import styles from "./ui.module.scss";
export const AppLayout = ({
  children,
  style,
}: Readonly<{
  children: ReactNode;
  style?: CSSProperties
}>) => {
  return (
    <>
      <ConfigProvider theme={globalTheme}>
        <div style={style} className={styles.page}>{children}</div>
      </ConfigProvider>
    </>
  );
};

export const globalTheme: ThemeConfig = {
  token: {
    colorPrimary: "#6CACE4",
  },
};
