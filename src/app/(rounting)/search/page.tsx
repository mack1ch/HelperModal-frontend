"use client";

import { AppLayout } from "@/shared/layouts/modalLayout/ui/ui";
import { IconWrap } from "@/shared/ui/iconWrap";
import CaretLeft from "../../../../public/icons/header/caretLeft.svg";
import { Header } from "@/entities/header-slice/header";
import { useRouter } from "next/navigation";
import { Search } from "@/widgets/search-slice/search";

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
          Поиск по Помощи
        </Header>
        <Search />
      </AppLayout>
    </>
  );
}
