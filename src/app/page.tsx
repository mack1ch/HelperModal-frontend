"use client";

import { Header } from "@/entities/header-slice/header";
import { AppLayout } from "@/shared/layouts/modalLayout/ui/ui";
import { IconWrap } from "@/shared/ui/iconWrap";
import Bell from "../../public/icons/header/bell.svg";

import { Main } from "@/entities/main-slice/main";
import { Footer } from "@/entities/footer-slice/footer";
import { useCookies } from "react-cookie";
import { uid } from "uid";
import { useEffect } from "react";

export default function Home() {
  const [cookies, setCookie] = useCookies(["user-id"]);

  useEffect(() => {
    if (!cookies["user-id"]) {
      setCookie("user-id", uid(16), {
        path: "/", // доступно во всем приложении
        secure: process.env.NODE_ENV === "production", // только в https в проде
        sameSite: "lax", // "none" работает только с secure
      });
    }
  }, [cookies, setCookie]);

  return (
    <AppLayout>
      <Header leftIcon={<IconWrap image={Bell} />}>Центр поддержки</Header>
      <Main />
      <Footer />
    </AppLayout>
  );
}
