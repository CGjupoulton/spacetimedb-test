import React from "react";
import { User } from "./module_bindings";

type Props = {
  users: Map<string, User>;
};

export default function ConnectedUsers({ users }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        background: "#fff",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
        width: "200px",
        overflow: "hidden"
      }}
    >
      <h3>Connected Users</h3>
      <ul>
        {Array.from(users.entries())
        .filter(([id, user]) => user.online)
        .map(([id, user]) => (
          <li key={id}>
            {user.name || id}
          </li>
        ))}
      </ul>
    </div>
  );
}
