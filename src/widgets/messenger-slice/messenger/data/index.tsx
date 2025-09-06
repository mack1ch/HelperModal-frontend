import {
  AppstoreOutlined,
  HourglassOutlined,
  MonitorOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { ResponseMode, UserRole } from "../types";

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
    key: "physic",
    label: "Физ. лицо",
    icon: <UserOutlined style={{ fontSize: "16px" }} />,
  },
  {
    key: "msp",
    label: "МСП",
    icon: <ShopOutlined style={{ fontSize: "16px" }} />,
  },
  {
    key: "big_company",
    label: "Крупный поставщик",
    icon: <TeamOutlined style={{ fontSize: "16px" }} />,
  },
];

export const getModeLabel = (mode: ResponseMode) =>
  mode === "short"
    ? "Короткий"
    : mode === "detailed"
    ? "Развернутый"
    : "Автоматический";

export const getRoleLabel = (role: UserRole) =>
  role === "entrepreneur" ? "ИП" : role === "legal" ? "Юр. лицо" : "Физ. лицо";
