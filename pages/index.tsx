import { sendMessage } from "@/lib/firebase";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMessages } from "@/hooks/useMessages";
import geohash from "ngeohash";

function MessageList({ roomId, displayName }: any) {
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
          <Message
            key={id}
            message={x}
            isOwnMessage={x.displayName === displayName}
          />
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
  const [displayName, setDisplayName] = useState("");
  const [userGeoHash, setUserGeoHash] = useState("");
  const [precision, setPrecision] = useState(5);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const hash = geohash.encode(
        position.coords.latitude,
        position.coords.longitude,
        precision ? precision : 5
      );

      setUserGeoHash(hash);
    });
  }, [precision]);

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    sendMessage(userGeoHash, displayName, value);
    setValue("");
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: "2rem",
          }}
        >
          {userGeoHash ? userGeoHash : "Geohash..1..2..3.."}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            id="name-input"
            className="common-input"
            placeholder="Name"
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
            value={displayName}
          />
          <input
            id="precision-input"
            className="common-input"
            type="number"
            required={true}
            placeholder="Precision"
            onChange={(e) => {
              setPrecision(parseInt(e.target.value));
            }}
            value={precision}
          />
        </div>
      </div>

      <div className="messages-container">
        {userGeoHash ? (
          <MessageList roomId={userGeoHash} displayName={displayName} />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            Hang on there, loading chats...
          </div>
        )}

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

          <button
            type="submit"
            disabled={value < 1 && displayName.length < 1}
            className="send-message"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
