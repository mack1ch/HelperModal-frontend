"use client";

import { AppLayout } from "@/shared/layouts/modalLayout/ui/ui";
import { IconWrap } from "@/shared/ui/iconWrap";
import CaretLeft from "../../../../public/icons/header/caretLeft.svg";
import { Header } from "@/entities/header-slice/header";
import { useRouter } from "next/navigation";
import { Phone } from "@/widgets/phone-slice/phone";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <AppLayout>
        <Header
          leftIcon={
            <IconWrap onClick={() => router.back()} image={CaretLeft} />
          }
        >
          Звонок
        </Header>
        <Phone />
      </AppLayout>
    </>
  );
}
