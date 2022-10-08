import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RoomCard.module.css";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/room/${room.id}`)} className={styles.card}>
      <h3 className={styles.topic}>{room.topic}</h3>
      <div
        className={`${styles.speakers} ${
          room.speakers.length === 1 ? styles.singleSpeaker : ""
        }`}
      >
        <div className={styles.avatars}>
          {room.speakers.map((speaker) => (
            <img key={room.id} src={speaker.avatar} alt="speaker" />
          ))}
        </div>
        <div className={styles.names}>
          {room.speakers.map((speaker) => (
            <div key={room.id} className={styles.nameWrapper}>
              <span>{speaker.name}</span>
              <img src="/images/chat-bubble.png" alt="chatBubble" />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.peopleCount}>
        <span>{room.speakers.length}</span>
        <img src="/images/user-icon.png" alt="userIcon" />
      </div>
    </div>
  );
};

export default RoomCard;
