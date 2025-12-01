import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const DEFAULT_AVATAR = "/img/avatar-default.png";

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", avatar: DEFAULT_AVATAR, direccion: "", telefono: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const refUser = doc(db, "usuarios", user.uid);
      getDoc(refUser).then(snap => {
        const data = snap.exists() ? snap.data() : {};
        setProfile({
          name: data.name || "",
          email: user.email,
          avatar: data.avatar || DEFAULT_AVATAR,
          direccion: data.direccion || "",
          telefono: data.telefono || ""
        });
      });
    }
  }, [user]);

  const handleChange = e => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setSaved(false); setError("");
  };

  const handleSave = async () => {
  if (!user) return;
  try {
    const userRef = doc(db, "usuarios", user.uid);
    await (await getDoc(userRef)).exists() ? updateDoc(userRef, profile) : setDoc(userRef, profile);
    setSaved(true);
  } catch (err) {
    setError("Error al guardar: " + err.message);
  }
};

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");  
  };

  return (
    <div style={{
      maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 15, boxShadow: "0 2px 14px #eef", padding: "30px 28px", fontFamily: "Montserrat, sans-serif"
    }}>
      <h2 style={{ color: "#2E8B57", marginBottom: 18 }}>Mi perfil</h2>
      <img src={profile.avatar} alt="avatar" style={{ width: 95, borderRadius: 50, marginBottom: 15 }} />
      <input
        type="text"
        name="name"
        value={profile.name}
        placeholder="Nombre"
        onChange={handleChange}
        style={{ borderRadius: 7, padding: 6, marginBottom: 9, width: "100%" }}
      />
      <input
        type="email"
        name="email"
        value={profile.email}
        disabled
        style={{ borderRadius: 7, padding: 6, marginBottom: 9, width: "100%", opacity: 0.7 }}
      />
      <input
        type="text"
        name="direccion"
        value={profile.direccion}
        placeholder="Dirección"
        onChange={handleChange}
        style={{ borderRadius: 7, padding: 6, marginBottom: 9, width: "100%" }}
      />
      <input
        type="text"
        name="telefono"
        value={profile.telefono}
        placeholder="Teléfono"
        onChange={handleChange}
        style={{ borderRadius: 7, padding: 6, marginBottom: 14, width: "100%" }}
      />
      <button style={{ background: "#2E8B57", color: "#fff", border: "none", borderRadius: 7, padding: "9px 35px", fontWeight: "bold", fontSize: 16, width: "100%" }} onClick={handleSave}>
        Guardar cambios
        
      </button>
      <button
  onClick={() => navigate("/historial")}
  style={{
    marginTop: 10,
    background: "#2E8B57",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "8px 0",
    fontWeight: "bold",
    fontSize: 16,
    width: "100%"
  }}
>
  Ver historial de compras
</button>

      <button
     style={{
        marginTop: 10,
        background: "#8B4513",
        color: "#fff",
        border: "none",
        borderRadius: 7,
        padding: "8px 0",
        fontWeight: "bold",
        fontSize: 16,
        width: "100%"
      }}
     onClick={handleLogout}
    >
      Cerrar sesión
    </button>
      {saved && <div style={{ color: "#2E8B57", fontWeight: "bold", marginTop: 15 }}>Guardado correctamente</div>}
      {error && <div style={{ color: "red", fontWeight: "bold", marginTop: 15 }}>{error}</div>}
    </div>
  );
};

export default UserProfile;
