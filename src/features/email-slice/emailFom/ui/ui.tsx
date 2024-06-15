import { Button, Form, Input, message, Upload } from "antd";
import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { IEmailForm } from "../interface";
import { LinkOutlined } from "@ant-design/icons";
import styles from "./ui.module.scss";
import { useCookies } from "react-cookie";
import { postEmailByAuthorID, postFiles } from "../api";

export const EmailForm = () => {
  const [cookies] = useCookies(["user-id"]);
  const filePicker = useRef<HTMLInputElement | null>(null);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<IEmailForm>({
    name: "",
    text: "",
    email: "",
    filesName: [],
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
  }

  const handlePick = () => {
    if (filePicker.current) {
      filePicker.current.click();
    }
  };

  async function onUploadFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const resData = new FormData();
      resData.append("file", file);
      const res = await postFiles(resData);
      if (res instanceof Error) return;
      else {
        setFormData((prev) => ({
          ...prev,
          filesName: [...prev.filesName, res.name],
        }));
      }
    }
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

          <button
            onClick={() => message.success("Ваше обращение зарегистриовано")}
            disabled={isButtonDisabled}
            className={styles.button}
          >
            Отправить письмо{" "}
            <span className={styles.subTitle}>ответим в течении 2 часов</span>{" "}
          </button>
        </div>
      </Form>
    </>
  );
};
