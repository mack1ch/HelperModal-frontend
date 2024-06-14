"use client";

import { AppLayout } from "@/shared/layouts/modalLayout/ui/ui";
import { ConfigProvider, Flex, Spin } from "antd";
import React from "react";
export default function Loading() {
  return (
    <>
      <AppLayout>
        <div
          style={{
            width: "100vw",
            height: "100svh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Flex align="center" gap="middle">
            <Spin size="large" />
          </Flex>
        </div>
      </AppLayout>
    </>
  );
}
