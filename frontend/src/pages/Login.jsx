import { useState } from "react"
import ApiServices from "../services/ApiServices";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaChartPie } from "react-icons/fa";
import { MdInsights } from "react-icons/md";
import { BsGraphUpArrow } from "react-icons/bs";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = ((e) => {
        e.preventDefault();

        const data = {
            email: email,
            password: password
        }

        ApiServices.login(data)
            .then((res) => {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.user));
                toast.success("Welcome back!");
                navigate("/dashboard");
            })
            .catch((error) => {
                toast.error("SOMETHING WENT WRONG")
                console.log(error)
            })
    })

    return (
        <div style={styles.container}>
            <div style={styles.left}>
                <FaChartPie size={80} />

                <h1>📊 TubeAnalytics</h1>

                <p style={{ opacity: 0.8, fontSize: "15px", marginTop: "8px" }}>
                    Analyze YouTube content, track audience sentiment,
                    and visualize engagement insights in real time.
                </p>

                <ul style={styles.list}>
                    <li>🎥 YouTube Comment Intelligence</li>
                    <li>📊 Sentiment Analytics Engine</li>
                    <li>📈 Interactive Data Visualization</li>
                    <li>🕒 Smart Search History Tracking</li>
                    <li>🔐 Secure JWT Authentication</li>
                </ul>
            </div>

            <div style={styles.right}>
                <form onSubmit={handleLogin} style={styles.form}>
                    <h2>Login</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button style={styles.button}>
                        Login
                    </button>

                    <p>
                        Don't have an account?{" "}
                        <Link to="/register">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        minHeight: "100vh"
    },

    left: {
        flex: 1,
        background:
            "linear-gradient(135deg,#0f172a,#1e40af)",
        color: "white",
        padding: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px"
    },

    right: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc"
    },

    form: {
        background: "white",
        padding: "40px",
        width: "400px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    },

    input: {
        width: "100%",
        padding: "14px",
        marginBottom: "15px",
        border: "1px solid #cbd5e1",
        borderRadius: "10px",
        fontSize: "16px",
        boxSizing: "border-box"
    },

    button: {
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    list: {
        lineHeight: "2"
    }
};