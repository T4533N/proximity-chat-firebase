import { sendMessage } from "@/lib/firebase";
import { Inter } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import geohash from "ngeohash";
import { useMessages } from "@/hooks/useMessages";

function MessageList({ roomId }: any) {
  const containerRef = useRef<HTMLElement>(null);
  const messages = useMessages(roomId);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });

  return (
    // @ts-ignore
    <div className="message-list-container" ref={containerRef}>
      <ul className="message-list">
        {messages.map((x: any, id) => (
          <Message key={id} message={x} isOwnMessage={true} />
        ))}
      </ul>
    </div>
  );
}

function Message({ message, isOwnMessage }: any) {
  const { displayName, text } = message;

  return (
    <li className={["message", isOwnMessage && "own-message"].join(" ")}>
      <h4 className="sender">{isOwnMessage ? "You" : displayName}</h4>
      <div>{text}</div>
    </li>
  );
}

export default function Home() {
  const [value, setValue] = useState<any>("");
  const [userGeoHash, setuserGeoHash] = useState("");

  console.log("🚀 ~ file: index.jsx:12 ~ Landing ~ userGeoHash", userGeoHash);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
      setuserGeoHash(
        geohash.encode(position.coords.latitude, position.coords.longitude, 5)
      );
    });
  }, []);

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    sendMessage(userGeoHash, "bhaaiiiii maro mujhe maro", value);
    setValue("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="message-input-container">
        <input
          type="text"
          placeholder="Enter a message"
          value={value}
          onChange={handleChange}
          className="message-input"
          required
          minLength={1}
        />
        <button type="submit" disabled={value < 1} className="send-message">
          Send
        </button>
      </form>
      {userGeoHash && <MessageList roomId={"wh0r3"} />}
    </>
  );
}
