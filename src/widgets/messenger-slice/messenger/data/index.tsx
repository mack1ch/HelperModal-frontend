import { AppstoreOutlined, HourglassOutlined, MonitorOutlined, ShopOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { MenuProps } from "antd"

export const responseModeItems: MenuProps["items"] = [
  {
    key: "auto",
    label: "Автоматический ответ",
    icon: <AppstoreOutlined style={{ fontSize: "16px" }} />,
  },
  {
    key: "short",
    label: "Короткий ответ",
    icon: <HourglassOutlined style={{ fontSize: "16px" }} />,
  },
  {
    key: "detailed",
    label: "Развернутый ответ",
    icon: <MonitorOutlined style={{ fontSize: "16px" }} />,
  },
  {
    type: "divider",
  },
  {
    key: "role_individual",
    label: "Физ. лицо",
    icon: <UserOutlined style={{ fontSize: "16px" }} />,
  },
  {
    key: "role_entrepreneur",
    label: "ИП",
    icon: <ShopOutlined style={{ fontSize: "16px" }} />,
  },
  {
    key: "role_legal",
    label: "Юр. лицо",
    icon: <TeamOutlined style={{ fontSize: "16px" }} />,
  },
];
