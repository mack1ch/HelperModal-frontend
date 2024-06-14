import { StaticImport } from "next/dist/shared/lib/get-img-props";
import styles from "./ui.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
export const IconWrap = ({
  image,
  onClick,
}: {
  image: StaticImport;
  onClick?: () => void;
}) => {
  
  return (
    <>
      <button onClick={onClick} className={styles.icon}>
        <Image src={image} width={24} height={24} alt="icon" />
      </button>
    </>
  );
};
