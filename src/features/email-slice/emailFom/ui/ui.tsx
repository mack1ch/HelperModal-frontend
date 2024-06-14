import { Button, Form, Input, Upload } from "antd";
import { useEffect, useState } from "react";
import { IEmailForm } from "../interface";
import { LinkOutlined } from "@ant-design/icons";
import styles from "./ui.module.scss";
import { useCookies } from "react-cookie";
import { postEmailByAuthorID } from "../api";
import type { UploadFile } from "antd";

export const EmailForm = () => {
  const [cookies] = useCookies(["user-id"]);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<IEmailForm>({
    name: "",
    text: "",
    email: "",
    filesName: undefined,
  });
  const handleInputChange = (name: string, value: string | null) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  async function onSubmit() {
    const res = await postEmailByAuthorID(formData, cookies["user-id"]);
    if (res instanceof Error) return;
    else {
      console.log("good");
    }
  }

  async function onUploadFileChange({ fileList }: { fileList: UploadFile[] }) {
    setFormData((prev) => ({
      ...prev,
      fileList: fileList,
    }));
  }
  useEffect(() => {
    if (
      formData.name.length > 0 &&
      formData.text.length > 0 &&
      formData.email.length > 0
    ) {
      setButtonDisabled(false);
    } else setButtonDisabled(true);
  }, [formData.email, formData.name, formData.text]);
  return (
    <>
      <Form
        onFinish={onSubmit}
        style={{ width: "100%" }}
        name="validateOnly"
        layout="vertical"
      >
        <div className={styles.layout}>
          <Form.Item
            name="userName"
            label="Имя"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Input
              autoFocus
              autoComplete="name"
              value={formData?.name}
              size="middle"
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Электронная почта"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Input
              autoComplete="email"
              value={formData?.email}
              size="middle"
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="text"
            label="Текст"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Input.TextArea
              autoSize
              value={formData?.text}
              size="large"
              onChange={(e) => handleInputChange("text", e.target.value)}
              placeholder="Какой у вас вопрос?"
            />
          </Form.Item>
          <Form.Item
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Upload onChange={onUploadFileChange}>
              <Button type="link" icon={<LinkOutlined />}>
                Прикрепить файл
              </Button>
            </Upload>
          </Form.Item>

          <button disabled={isButtonDisabled} className={styles.button}>
            Отправить письмо{" "}
            <span className={styles.subTitle}>ответим в течении 2 часов</span>{" "}
          </button>
        </div>
      </Form>
    </>
  );
};
