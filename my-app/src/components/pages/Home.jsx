import React from "react";
import { Link } from "react-router-dom";

const logoSrc = "/img/logo.png";
const recomendados = [
  { id: "FR001", name: "Manzanas Fuji", desc: "Crujientes y dulces, perfectas para snack.", img: "/img/manzana.webp" },
  { id: "VR001", name: "Zanahorias Orgánicas", desc: "Ricas en vitamina A y fibra.", img: "/img/zanahoria.webp" },
  { id: "PO001", name: "Miel Orgánica", desc: "Pura de productores locales, antioxidante.", img: "/img/miel.jpg" }
];
const blog = [
  { titulo: "Cómo elegir frutas y verduras frescas", resumen: "Descubre los secretos para seleccionar productos de la mejor calidad y sabor en tu hogar.", link: "#" },
  { titulo: "Impacto ambiental de la agricultura local", resumen: "HuertoHogar fomenta prácticas sustentables y el consumo consciente.", link: "#" },
  { titulo: "Recetas saludables de primavera", resumen: "Prepara postres y comidas frescas con ingredientes de tu pedido HuertoHogar.", link: "#" }
];
const impacto = [
  "Has apoyado a más de 5 familias agrícolas con tus compras este mes.",
  "Tu pedido reduce la huella de carbono: transporte eficiente y envases reciclables.",
  "El 100% de nuestros productores implementan prácticas sustentables.",
  "Participa en la comunidad: talleres, cursos, y donaciones mensuales."
];

const Home = () => (
  <div style={{
    minHeight: "100vh",
    padding: "0 0 70px 0", 
    fontFamily: "Montserrat, sans-serif"
  }}>
    <div style={{
      maxWidth: 1100, margin: "42px auto", padding: 30, background: "#fff",
      borderRadius: 17, boxShadow: "0 2px 14px #eef"
    }}>
      <img src={logoSrc} alt="HuertoHogar Logo" style={{
        width: 120, margin: "0 auto", display: "block"
      }} />
      <h1 style={{
        color: "#2E8B57", fontFamily: 'Playfair Display, serif', textAlign: "center"
      }}>
        Bienvenido a HuertoHogar
      </h1>
      <p style={{ textAlign: "center" }}>
        Tu tienda online de <b>productos frescos y orgánicos</b> directo del campo a tu puerta. Vive saludable y apoya la agricultura local.
      </p>
      <div style={{
        margin: "38px 0 18px 0", background: "#F5F5DC", borderRadius: 18,
        padding: "22px 28px"
      }}>
        <h2 style={{ color: "#2E8B57", marginBottom: 7, fontSize: 23 }}>
          Impacto ambiental y comunidad
        </h2>
        <ul style={{ color: "#714b1d", fontSize: 17, marginLeft: 8 }}>
          {impacto.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 36 }}>
        <h2 style={{ color: "#FFD700", marginBottom: 14 }}>Productos Recomendados</h2>
        <div style={{
          display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap"
        }}>
          {recomendados.map(prod => (
            <div key={prod.id} style={{
              background: "#faf9ee", borderRadius: 12, padding: 18, width: 240,
              boxShadow: "0 1px 7px #ddd",
              display: "flex", flexDirection: "column", alignItems: "center"
            }}>
              <img src={prod.img} alt={prod.name} style={{
                width: "92%", height: 90, objectFit: "cover", borderRadius: 10, marginBottom: 10,
                boxShadow: "0 1px 7px #ccc"
              }} />
              <h3 style={{ color: "#8B4513", marginBottom: 7 }}>{prod.name}</h3>
              <p style={{ margin: 0 }}>{prod.desc}</p>
              <Link to={`/catalogo`} style={{
                display: "inline-block", marginTop: 8, background: "#2E8B57",
                color: "#fff", borderRadius: 5, padding: "4px 12px",
                textDecoration: "none", fontWeight: "bold"
              }}>
                Ver en catálogo
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 46 }}>
        <h2 style={{ color: "#8B4513", marginBottom: 14 }}>Nuestro Blog</h2>
        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "left"
        }}>
          {blog.map((post, idx) => (
            <div key={idx} style={{
              background: "#f9f9f6", borderRadius: 9, padding: 14, width: 300,
              boxShadow: "0 1px 5px #ddd"
            }}>
              <h4 style={{ color: "#2E8B57", marginBottom: 6 }}>{post.titulo}</h4>
              <p style={{ marginBottom: 0 }}>{post.resumen}</p>
              <a href={post.link} style={{
                color: "#8B4513", textDecoration: "underline",
                fontSize: 15, marginTop: 6, display: "inline-block"
              }}>Leer más</a>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 44 }}>
        <h2 style={{ color: "#FFD700" }}>Condiciones y Beneficios</h2>
        <ul style={{ color: "#8B4513", fontSize: 16 }}>
          <li>
            <Link to="/condiciones" style={{
              color: "#2E8B57", textDecoration: "underline", fontWeight: "bold", fontSize: 18
            }}>
              Conoce todas las condiciones legales y beneficios vigentes
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default Home;
