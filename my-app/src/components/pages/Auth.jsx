import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const DEFAULT_AVATAR = "/img/avatar-default.png";
const ADMIN_EMAIL = "admin@duoc.cl";

const Auth = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async e => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setMsg(cred.user.email === ADMIN_EMAIL ? "¡Has iniciado sesión como ADMIN!" : "¡Has iniciado sesión!");
      navigate("/perfil");        
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError(""); setMsg("");
    if (!name.trim()) return setError("Ingresa tu nombre.");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCred.user;
      await setDoc(doc(db, "usuarios", user.uid), {
        name,
        email: user.email,
        avatar: avatar || DEFAULT_AVATAR,
        direccion: "",
        telefono: "",
        rol: user.email === ADMIN_EMAIL ? "admin" : "cliente"
      });
      setMsg("Usuario creado correctamente. Ahora puedes iniciar sesión.");
      setTab("login");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRecover = async e => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("¡Correo de recuperación enviado!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      maxWidth: 380, margin: "44px auto", background: "#fff",
      borderRadius: 19, boxShadow: "0 2px 14px #eef",
      padding: "35px 38px", fontFamily: "Montserrat, sans-serif"
    }}>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 38 }}>
        <button onClick={() => setTab("login")} style={{
          fontWeight: tab === "login" ? "bold" : "normal",
          color: tab === "login" ? "#2E8B57" : "#555",
          fontSize: 19, background: "none", border: "none", cursor: "pointer", borderBottom: tab === "login" ? "2px solid #2E8B57" : "none"
        }}>Iniciar sesión</button>
        <button onClick={() => setTab("register")} style={{
          fontWeight: tab === "register" ? "bold" : "normal",
          color: tab === "register" ? "#FFD700" : "#555",
          fontSize: 19, background: "none", border: "none", cursor: "pointer", borderBottom: tab === "register" ? "2px solid #FFD700" : "none"
        }}>Registrarse</button>
        <button onClick={() => setTab("recover")} style={{
          fontWeight: tab === "recover" ? "bold" : "normal",
          color: tab === "recover" ? "#8B4513" : "#555",
          fontSize: 16, background: "none", border: "none", cursor: "pointer", borderBottom: tab === "recover" ? "2px solid #8B4513" : "none"
        }}>¿Olvidaste tu clave?</button>
      </div>
      {tab === "login" && (
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 9, borderRadius: 7, fontSize: 16 }} />
          <input type="password" placeholder="Contraseña" required value={pass} onChange={e => setPass(e.target.value)} style={{ padding: 9, borderRadius: 7, fontSize: 16 }} />
          <button type="submit" style={{
            background: "#2E8B57", color: "#fff", border: "none", borderRadius: 7, padding: "8px 0", fontWeight: "bold", fontSize: 18
          }}>
            Ingresar
          </button>
        </form>
      )}
      {tab === "register" && (
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <input type="text" placeholder="Nombre completo" required value={name} onChange={e => setName(e.target.value)} style={{ padding: 9, borderRadius: 7, fontSize: 16 }} />
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 9, borderRadius: 7, fontSize: 16 }} />
          <input type="password" placeholder="Contraseña" required value={pass} onChange={e => setPass(e.target.value)} style={{ padding: 9, borderRadius: 7, fontSize: 16 }} />
          <button type="submit" style={{
            background: "#FFD700", color: "#8B4513", border: "none", borderRadius: 7, padding: "8px 0", fontWeight: "bold", fontSize: 18
          }}>
            Registrarse
          </button>
        </form>
      )}
      {tab === "recover" && (
        <form onSubmit={handleRecover} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <input type="email" placeholder="Email para recuperar clave" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 9, borderRadius: 7, fontSize: 16 }} />
          <button type="submit" style={{
            background: "#8B4513", color: "#fff", border: "none", borderRadius: 7, padding: "8px 0", fontWeight: "bold", fontSize: 17
          }}>
            Recuperar clave
          </button>
        </form>
      )}
      {msg && <div style={{ color: "#2E8B57", fontWeight: "bold", marginTop: 17 }}>{msg}</div>}
      {error && <div style={{ color: "darkred", fontWeight: "bold", marginTop: 17 }}>{error}</div>}
    </div>
  );
};

export default Auth;
