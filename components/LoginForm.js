import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import { StaticContent } from "./Layout";
import { useLoginFunction } from "../lib/useUser";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginFunction();

  return (
    <>
      <Card title="Log In">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            login({
              variables: {
                identity: email,
                secret: password
              }
            })
          }}
          className="p-fluid p-formgrid p-grid"
        >
          <div className="p-field p-col">
            <label className="p-d-block">Email</label>
            <InputText value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="p-field p-col">
            <label className="p-d-block">Password</label>
            <Password
              value={password}
              feedback={false}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input type="submit" value="submit" hidden/>
        </form>
      </Card>
    </>
  )
}
