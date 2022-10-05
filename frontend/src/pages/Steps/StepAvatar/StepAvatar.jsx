import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../Components/shared/Button/Button";
import Card from "../../../Components/shared/Card/Card";
import Loader from "../../../Components/shared/Loader/Loader";
import { activate } from "../../../https/index";
import { setAvatar } from "../../../redux/features/activateSlice";
import { setUser } from "../../../redux/features/userSlice";
import styles from "./StepAvatar.module.css";

const StepAvatar = ({ onNext }) => {
  const { avatar, name } = useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [image, setImage] = useState("/images/monkey-avatar.png");
  const [loading, setLoading] = useState(false);
  const [unMounted, setUnMounted] = useState(false);

  function captureImage(e) {
    const file = e.target.files[0];
    const reder = new FileReader();
    reder.readAsDataURL(file);
    reder.onloadend = () => {
      setImage(reder.result);
      dispatch(setAvatar(reder.result));
    };
  }

  async function submit() {
    if (!name || !avatar) return;
    setLoading(true);
    try {
      const { data } = await activate({ name, avatar });
      if (data.auth) {
        if (!unMounted) {
          dispatch(setUser(data));
        }
      }
    } catch (error) {
      console.error("message", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      setUnMounted(true);
    };
  }, []);

  if (loading) return <Loader message="Activation in progress..." />;
  return (
    <>
      <Card title={`Okay, ${name}`} icon="monkey">
        <p className={styles.subHeading}>How’s this photo?</p>
        <div className={styles.avatarWrapper}>
          <img className={styles.avatarImage} src={image} alt="avatar" />
        </div>
        <div>
          <input
            onChange={captureImage}
            id="avatarInput"
            type="file"
            className={styles.avatarInput}
          />
          <label className={styles.avatarLabel} htmlFor="avatarInput">
            Choose a different photo
          </label>
        </div>
        <div>
          <Button onClick={submit} text="Next" />
        </div>
      </Card>
    </>
  );
};

export default StepAvatar;
