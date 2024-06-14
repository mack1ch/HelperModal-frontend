"use client";

import { Header } from "@/entities/header-slice/header";
import { AppLayout } from "@/shared/layouts/modalLayout/ui/ui";
import { IconWrap } from "@/shared/ui/iconWrap";
import Bell from "../../public/icons/header/bell.svg";

import { Main } from "@/entities/main-slice/main";
import { Footer } from "@/entities/footer-slice/footer";

export default function Home() {
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
