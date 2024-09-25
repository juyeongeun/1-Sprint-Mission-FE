import SigninForm from "../components/SigninComponents/SigninForm";
import styles from "../styles/signin.module.css";

export default function Signin() {
  return (
    <div className={styles.container}>
      <div className={styles.signinContainer}>
        <SigninForm />
      </div>
    </div>
  );
}
