import { Form, Input, message } from "antd";
import { useEffect, useState } from "react";

import styles from "./ui.module.scss";
import { useCookies } from "react-cookie";
import { IPhoneForm } from "../interface";
export const PhoneForm = () => {
  const [cookies] = useCookies(["user-id"]);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [formData, setFormData] = useState<IPhoneForm>({
    name: "",
    text: "",
    phone: "",
  });
  const handleInputChange = (name: string, value: string | null) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  async function onSubmit() {}

  useEffect(() => {
    if (
      formData.name.length > 0 &&
      formData.text.length > 0 &&
      formData.phone.length > 0
    ) {
      setButtonDisabled(false);
    } else setButtonDisabled(true);
  }, [formData.phone, formData.name, formData.text]);
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
            name="phone"
            label="Телефон"
            style={{
              width: "100%",
              textAlign: "start",
              alignItems: "flex-start",
            }}
          >
            <Input
              autoComplete="phone"
              type="number"
              value={formData?.phone}
              size="middle"
              onChange={(e) => handleInputChange("phone", e.target.value)}
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
            onClick={() => message.success("Ваше звонок зарегистриован")}
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
