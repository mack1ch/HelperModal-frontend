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
  const isDevMode = process.env.NODE_ENV !== "production";
  useEffect(() => {
    if (cookies["user-id"]) {
    } else {
      setCookie("user-id", uid(16), {
        secure: true,
      });
    }
  }, []);
  return (
    <>
      <AppLayout>
        <Header leftIcon={<IconWrap image={Bell} />}>Центр поддержки</Header>
        <Main />
        <Footer />
      </AppLayout>
    </>
  );
}
