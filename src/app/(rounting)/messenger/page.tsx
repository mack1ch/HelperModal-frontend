"use client";

import { AppLayout } from "@/shared/layouts/modalLayout/ui/ui";
import { IconWrap } from "@/shared/ui/iconWrap";
import CaretLeft from "../../../../public/icons/header/caretLeft.svg";
import { Header } from "@/entities/header-slice/header";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Rosatom from "../../../../public/assets/logos/rosatomLogo.png";
import { Messenger } from "@/widgets/messenger-slice/messenger";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <AppLayout>
        <Header
          style={{ position: "fixed" }}
          leftIcon={
            <IconWrap onClick={() => router.back()} image={CaretLeft} />
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Image src={Rosatom} width={36} height={36} alt="Росатом" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "-8px",
                justifyContent: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#222",
                  fontWeight: "600",
                  display: "flex",
                  textAlign: "left",
                  height: "17px",
                }}
              >
                Росатом
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#477916",
                  textAlign: "left",
                  fontWeight: "400",
                }}
              >
                В сети
              </span>
            </div>
          </div>
        </Header>
        <Messenger />
      </AppLayout>
    </>
  );
}
