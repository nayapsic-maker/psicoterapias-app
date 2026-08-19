import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Error no controlado en la app:", error, info);
  }

  handleReiniciar = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "#F2EFE6",
            color: "#1E2A28",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <h1 style={{ fontSize: 20, marginBottom: 12 }}>Algo salió mal</h1>
            <p style={{ marginBottom: 16, color: "#4B5A56" }}>
              La aplicación encontró un error inesperado, probablemente por un dato dañado o un archivo
              importado incorrecto. Tus datos guardados en este navegador no se han borrado.
            </p>
            <button
              onClick={this.handleReiniciar}
              style={{
                padding: "10px 20px",
                background: "#4A6B70",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Volver a intentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
