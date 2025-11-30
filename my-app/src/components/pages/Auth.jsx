import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { validarRUN, validarNombre, validarCorreo, validarClave, validarFechaNacimiento } from "../../utils/validaciones";

const DEFAULT_AVATAR = "/img/avatar-default.png";
const ADMIN_EMAIL = "admin@duoc.cl";

const Auth = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [run, setRun] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({}); 

  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    setMsg("");
    setErrors({});


    const emailVal = validarCorreo(email);
    if (!emailVal.ok) {
      setError(emailVal.message);
      setErrors({ correo: emailVal.message });
      return;
    }


    if (!pass) {
      setError("Ingresa tu contraseña");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setMsg(cred.user.email === ADMIN_EMAIL ? "¡Has iniciado sesión como ADMIN!" : "¡Has iniciado sesión!");
      setTimeout(() => navigate("/perfil"), 1500);
    } catch (err) {
      const errorMsg = err.code === "auth/user-not-found" ? "Usuario no encontrado" :
                       err.code === "auth/wrong-password" ? "Contraseña incorrecta" :
                       err.code === "auth/invalid-email" ? "Email inválido" :
                       err.message;
      setError(errorMsg);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    setMsg("");
    setErrors({});


    const runVal = validarRUN(run);
    const nombreVal = validarNombre(name);
    const correoVal = validarCorreo(email);
    const claveVal = validarClave(pass);
    const fechaVal = validarFechaNacimiento(fechaNac);

    const newErrors = {};
    if (!runVal.ok) newErrors.run = runVal.message;
    if (!nombreVal.ok) newErrors.nombre = nombreVal.message;
    if (!correoVal.ok) newErrors.correo = correoVal.message;
    if (!claveVal.ok) newErrors.clave = claveVal.message;
    if (!fechaVal.ok) newErrors.fecha = fechaVal.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      setError(firstError);
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCred.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        name: nombreVal.value,
        email: user.email,
        run: runVal.value,
        fechaNacimiento: fechaVal.value,
        avatar: avatar || DEFAULT_AVATAR,
        direccion: "",
        telefono: "",
        rol: user.email === ADMIN_EMAIL ? "admin" : "cliente",
        createdAt: new Date().toISOString()
      });

      setMsg("✅ Usuario creado correctamente. Ahora puedes iniciar sesión.");
      setTab("login");

      setName("");
      setRun("");
      setEmail("");
      setPass("");
      setFechaNac("");
      setErrors({});
    } catch (err) {
      const errorMsg = err.code === "auth/email-already-in-use" ? "Este email ya está registrado" :
                       err.code === "auth/weak-password" ? "Contraseña muy débil" :
                       err.message;
      setError(errorMsg);
    }
  };

  const handleRecover = async e => {
    e.preventDefault();
    setError("");
    setMsg("");

    const correoVal = validarCorreo(email);
    if (!correoVal.ok) {
      setError(correoVal.message);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("✅ Correo de recuperación enviado a tu bandeja de entrada");
      setEmail("");
    } catch (err) {
      setError("Error al enviar correo de recuperación: " + err.message);
    }
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: "44px auto",
      background: "#fff",
      borderRadius: 19,
      boxShadow: "0 2px 14px #eef",
      padding: "35px 38px",
      fontFamily: "Montserrat, sans-serif"
    }}>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 38, flexWrap: "wrap" }}>
        <button onClick={() => { setTab("login"); setErrors({}); setError(""); setMsg(""); }} style={{
          fontWeight: tab === "login" ? "bold" : "normal",
          color: tab === "login" ? "#2E8B57" : "#555",
          fontSize: 19,
          background: "none",
          border: "none",
          cursor: "pointer",
          borderBottom: tab === "login" ? "2px solid #2E8B57" : "none",
          paddingBottom: 5
        }}>Iniciar sesión</button>

        <button onClick={() => { setTab("register"); setErrors({}); setError(""); setMsg(""); }} style={{
          fontWeight: tab === "register" ? "bold" : "normal",
          color: tab === "register" ? "#FFD700" : "#555",
          fontSize: 19,
          background: "none",
          border: "none",
          cursor: "pointer",
          borderBottom: tab === "register" ? "2px solid #FFD700" : "none",
          paddingBottom: 5
        }}>Registrarse</button>

        <button onClick={() => { setTab("recover"); setErrors({}); setError(""); setMsg(""); }} style={{
          fontWeight: tab === "recover" ? "bold" : "normal",
          color: tab === "recover" ? "#8B4513" : "#555",
          fontSize: 16,
          background: "none",
          border: "none",
          cursor: "pointer",
          borderBottom: tab === "recover" ? "2px solid #8B4513" : "none",
          paddingBottom: 5
        }}>¿Olvidaste tu clave?</button>
      </div>


      {tab === "login" && (
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: 9,
                borderRadius: 7,
                fontSize: 16,
                border: errors.correo ? "2px solid red" : "1px solid #ddd",
                width: "100%"
              }}
            />
            {errors.correo && <small style={{ color: "red" }}>{errors.correo}</small>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={{
                padding: 9,
                borderRadius: 7,
                fontSize: 16,
                border: "1px solid #ddd",
                width: "100%"
              }}
            />
          </div>

          <button type="submit" style={{
            background: "#2E8B57",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "8px 0",
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer"
          }}>
            Ingresar
          </button>
        </form>
      )}

      {tab === "register" && (
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <input
              type="text"
              placeholder="RUN (ej: 12345678-9)"
              required
              value={run}
              onChange={e => setRun(e.target.value)}
              style={{
                padding: 9,
                borderRadius: 7,
                fontSize: 16,
                border: errors.run ? "2px solid red" : "1px solid #ddd",
                width: "100%"
              }}
            />
            {errors.run && <small style={{ color: "red", display: "block", marginTop: 2 }}>{errors.run}</small>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Nombre completo"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                padding: 9,
                borderRadius: 7,
                fontSize: 16,
                border: errors.nombre ? "2px solid red" : "1px solid #ddd",
                width: "100%"
              }}
            />
            {errors.nombre && <small style={{ color: "red", display: "block", marginTop: 2 }}>{errors.nombre}</small>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                padding: 9,
                borderRadius: 7,
                fontSize: 16,
                border: errors.correo ? "2px solid red" : "1px solid #ddd",
                width: "100%"
              }}
            />
            {errors.correo && <small style={{ color: "red", display: "block", marginTop: 2 }}>{errors.correo}</small>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña (8+ chars, mayús, minús, número)"
              required
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={{
                padding: 9,
                borderRadius: 7,
                fontSize: 16,
                border: errors.clave ? "2px solid red" : "1px solid #ddd",
                width: "100%"
              }}
            />
            {errors.clave && <small style={{ color: "red", display: "block", marginTop: 2 }}>{errors.clave}</small>}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 5, fontSize: 14, color: "#333" }}>
              Fecha de Nacimiento (debes ser mayor de 18):
            </label>
            <input
              type="date"
              required
              value={fechaNac}
              onChange={e => setFechaNac(e.target.value)}
              style={{
                padding: 9,
                borderRadius: 7,
                fontSize: 16,
                border: errors.fecha ? "2px solid red" : "1px solid #ddd",
                width: "100%"
              }}
            />
            {errors.fecha && <small style={{ color: "red", display: "block", marginTop: 2 }}>{errors.fecha}</small>}
          </div>

          <button type="submit" style={{
            background: "#FFD700",
            color: "#8B4513",
            border: "none",
            borderRadius: 7,
            padding: "8px 0",
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer"
          }}>
            Registrarse
          </button>
        </form>
      )}

      {tab === "recover" && (
        <form onSubmit={handleRecover} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <input
            type="email"
            placeholder="Email para recuperar clave"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: 9, borderRadius: 7, fontSize: 16, border: "1px solid #ddd", width: "100%" }}
          />
          <button type="submit" style={{
            background: "#8B4513",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "8px 0",
            fontWeight: "bold",
            fontSize: 17,
            cursor: "pointer"
          }}>
            Recuperar clave
          </button>
        </form>
      )}

      {msg && <div style={{ color: "#2E8B57", fontWeight: "bold", marginTop: 17, padding: 10, background: "#f0fff0", borderRadius: 5 }}>
        {msg}
      </div>}

      {error && <div style={{ color: "darkred", fontWeight: "bold", marginTop: 17, padding: 10, background: "#ffe0e0", borderRadius: 5 }}>
        ⚠️ {error}
      </div>}
    </div>
  );
};

export default Auth;
