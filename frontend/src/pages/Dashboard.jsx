import { useEffect, useState } from "react";
import ApiServices from "../services/ApiServices";
import { toast } from "react-toastify";
import {
    PieChart, Pie, Cell, ResponsiveContainer, BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";
import { FaMoon, FaSun } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);

        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
    }

    return "Just now";
};

const formatNumber = (num) => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(".0", "") + "B";
    }

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(".0", "") + "M";
    }

    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(".0", "") + "K";
    }

    return num.toString();
};

export default function Dashboard() {
    const [keyword, setKeyword] = useState("");
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState("top");
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const theme = {
        light: {
            bg: "#f8fafc",
            card: "#ffffff",
            text: "#111827",
            muted: "#6b7280",
            border: "#e5e7eb",
            shadow: "0 8px 20px rgba(0,0,0,0.06)"
        },
        dark: {
            bg: "#0f172a",
            card: "#1e293b",
            text: "#ffffff",
            muted: "#94a3b8",
            border: "#334155",
            shadow: "0 10px 20px rgba(0,0,0,0.3)"
        }
    };

    const t = darkMode ? theme.dark : theme.light;


    const getCardColor = (type) => {
        const colors = {
            positive: darkMode
                ? "#14532d"
                : "#86efac",

            negative: darkMode
                ? "#7f1d1d"
                : "#fca5a5",

            neutral: darkMode
                ? "#78350f"
                : "#fde68a",

            posts: darkMode
                ? "#1e3a8a"
                : "#93c5fd",

            comments: darkMode
                ? "#4c1d95"
                : "#c4b5fd",

            likes: darkMode
                ? "#9a3412"
                : "#fdba74",

            views: darkMode
                ? "#0c4a6e"
                : "#67e8f9",

            subscribers: darkMode
                ? "#831843"
                : "#f9a8d4"
        };

        return colors[type];
    };

    const styles = {
        app: {
            minHeight: "100vh",
            background: t.bg
        },

        navbar: {
            height: "70px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: `1px solid ${t.border}`,
            background: t.card,
            color: t.text,
        },

        logoutBtn: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "42px",
            minWidth: "100px",
            padding: "0 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            transition: "0.3s"
        },

        main: {
            display: "flex",
            height: "calc(100vh - 70px)"
        },

        sidebar: {
            width: "280px",
            background: t.card,
            color: t.text,
            padding: "20px",
            overflowY: "auto",
            borderRight: `1px solid ${t.border}`,
            display: "flex",
            flexDirection: "column",
            gap: "15px"
        },

        sidebarTitle: {
            fontSize: "14px",
            fontWeight: "600",
            color: t.muted,
            marginBottom: "10px",
            letterSpacing: "0.5px"
        },

        sectionTitle: {
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "1px",
            color: t.muted,
            margin: "15px 0 10px 5px",
            textTransform: "uppercase"
        },

        historyCard: {
            background: darkMode
                ? "#334155"
                : "#e0d1ef",
            padding: "14px",
            borderRadius: "12px",
            marginBottom: "10px",
            cursor: "pointer",
            border: `1px solid ${t.border}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            transition: "all 0.2s ease"
        },

        historyStats: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px"
        },

        content: {
            flex: 1,
            padding: "30px",
            overflowY: "auto",
            background: t.bg
        },

        heading: {
            marginBottom: "25px"
        },

        searchBox: {
            display: "flex",
            gap: "10px",
            marginBottom: "30px"
        },

        input: {
            flex: 1,
            maxWidth: "600px",
            padding: "14px",
            borderRadius: "10px",
            border: `1px solid ${t.border}`,
            background: t.card,
            color: t.text,
            fontSize: "16px"
        },

        button: {
            padding: "14px 22px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold"
        },

        cards: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "30px"
        },

        card: {
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: t.shadow,
            color: t.text,
            border: `1px solid ${t.border}`
        },

        chartContainer: {
            background: t.card,
            padding: "20px",
            borderRadius: "15px",
            boxShadow: t.shadow
        },

        profileCard: {
            textAlign: "center",
            marginBottom: "20px",
            padding: "18px",
            borderRadius: "12px",
            background: darkMode ? "#0f172a" : "#f1f5f9",
            border: `1px solid ${t.border}`,
            boxShadow: t.shadow
        },

        avatar: {
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: darkMode
                ? "linear-gradient(135deg, #3b82f6, #a855f7)"
                : "#2563eb",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "26px",
            fontWeight: "bold",
            margin: "0 auto 12px",
            boxShadow: darkMode
                ? "0 0 15px rgba(59,130,246,0.4)"
                : "0 4px 10px rgba(37,99,235,0.3)"
        },

        themeBtn: {
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontSize: "16px"
        },

        table: {
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "15px"
        },

    };

    const tableHeaderStyle = (darkMode) => {
        const t = darkMode
            ? { bg: "#1e293b", text: "#ffffff", border: "#334155" }
            : { bg: "#f8fafc", text: "#111827", border: "#e5e7eb" };

        return {
            padding: "12px",
            textAlign: "center",
            background: t.bg,
            color: t.text,
            borderBottom: `1px solid ${t.border}`,
            fontWeight: "600"
        };
    };

    const tableCellStyle = (darkMode) => {
        const t = darkMode
            ? { text: "#cbd5e1", border: "#334155" }
            : { text: "#374151", border: "#e5e7eb" };

        return {
            padding: "12px",
            textAlign: "center",
            color: t.text,
            borderBottom: `1px solid ${t.border}`
        };
    };

    const user = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

    const pieData = result
        ? [
            { name: "Positive", value: result.stats.positive },
            { name: "Negative", value: result.stats.negative },
            { name: "Neutral", value: result.stats.neutral }
        ]
        : [];

    const barData = result
        ? [
            {
                name: "Positive",
                comments: result.stats.positive,
                likes: result.comments
                    ?.filter(c => c.sentiment === "positive")
                    .reduce((acc, c) => acc + (c.likes || 0), 0)
            },
            {
                name: "Negative",
                comments: result.stats.negative,
                likes: result.comments
                    ?.filter(c => c.sentiment === "negative")
                    .reduce((acc, c) => acc + (c.likes || 0), 0)
            },
            {
                name: "Neutral",
                comments: result.stats.neutral,
                likes: result.comments
                    ?.filter(c => c.sentiment === "neutral")
                    .reduce((acc, c) => acc + (c.likes || 0), 0)
            }
        ]
        : [];

    const token = localStorage.getItem("token");

    const handleSearch = (e) => {
        e.preventDefault();

        if (!keyword) {
            toast.error("Enter a keyword");
            return;
        }

        setLoading(true);

        const apiOrder =
            sortOrder === "top" ? "relevance" : "time";

        ApiServices.searchSentiment(keyword, apiOrder, token)
            .then((res) => {
                console.log(res.data);
                setResult(res.data);

                toast.success("Analysis completed");
                loadHistory();
            })
            .catch((err) => {
                console.log(err);
                toast.error("Search failed");
            })
            .finally(() => setLoading(false));
    };

    const changeSort = (newSort) => {
        setSortOrder(newSort);

        if (!keyword || !result) return;

        const apiOrder =
            newSort === "top" ? "relevance" : "time";

        setLoading(true);

        ApiServices.searchSentiment(keyword, apiOrder, token)
            .then((res) => {
                setResult(res.data);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to load comments");
            })
            .finally(() => setLoading(false));
    };


    const loadHistory = () => {
        ApiServices.getHistory(token)
            .then((res) => {

                const cleanHistory = (res.data.getHistory || [])
                    .filter(item =>
                        item &&
                        item.keyword &&
                        item.totalPosts != null &&
                        item.source
                    );

                setHistory(cleanHistory);

            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleLogout = (() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/");
    })

    const searchFromHistory = (keywordValue) => {
        setKeyword(keywordValue);

        const apiOrder =
            sortOrder === "top" ? "relevance" : "time";

        ApiServices.searchSentiment(
            keywordValue,
            apiOrder,
            token
        )
            .then((res) => {
                setResult(res.data);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to load search");
            });
    };

    useEffect(() => {
        localStorage.setItem(
            "theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    const toggleTheme = () => {
        const newTheme = !darkMode;

        setDarkMode(newTheme);

        localStorage.setItem(
            "theme",
            newTheme ? "dark" : "light"
        );
    };

    return (
        <div
            style={{
                ...styles.app,
                background: t.bg
            }}
        >

            {/* Navbar */}
            <div style={styles.navbar}>

                <h2>📊 TubeAnalytics</h2>

                <div style={{ display: "flex", gap: "10px" }}>

                    <button
                        onClick={toggleTheme}
                        style={styles.themeBtn}
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </button>

                    <button
                        onClick={handleLogout}
                        style={styles.logoutBtn}
                    >
                        Logout
                    </button>

                </div>

            </div>

            <div style={styles.main}>

                {/* Sidebar */}
                <div
                    style={{
                        ...styles.sidebar,
                        background: darkMode
                            ? "#111827"
                            : "#ffffff",
                        color: darkMode
                            ? "white"
                            : "#111827"
                    }}
                >
                    <div style={styles.profileCard}>
                        <div style={styles.avatar}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <h3>{user?.name}</h3>

                        <p>{user?.email}</p>
                    </div>

                    <div style={styles.sectionTitle}>
                        Recent Searches
                    </div>

                    {history.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "20px",
                            color: darkMode ? "#94a3b8" : "#6b7280"
                        }}>
                            No recent searches yet 🔍
                        </div>
                    ) : (

                        history.map((item) => (
                            <div
                                key={`${item.source || "unknown"}-${item.title || "no-title"}-${item.text || "no-text"}-${item.createdAt || Math.random()}`}
                                style={{
                                    ...styles.historyCard,
                                    // background: darkMode ? "#334155" : "#f8fafc",
                                    // color: darkMode ? "#ffffff" : "#111827"
                                }}
                                onClick={() => searchFromHistory(item.keyword)}

                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateX(4px)";
                                    e.currentTarget.style.boxShadow = darkMode
                                        ? "0 6px 18px rgba(0,0,0,0.4)"
                                        : "0 6px 18px rgba(0,0,0,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateX(0px)";
                                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                                }}
                            >
                                <h4 style={{ fontSize: "14px", marginBottom: "5px" }}>
                                    {item.videoTitle?.trim()
                                        ? item.videoTitle
                                        : item.keyword || "Unknown Video"}
                                </h4>

                                <div style={styles.historyStats}>
                                    <span>👍 {item.positive}</span>
                                    <span>👎 {item.negative}</span>
                                    <span>😐 {item.neutral}</span>
                                </div>

                                <p style={{
                                    fontSize: "11px",
                                    color: t.muted,
                                    marginTop: "6px"
                                }}>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleString()
                                        : "N/A"}
                                </p>

                            </div>
                        ))
                    )}
                </div>

                {/* Content */}
                <div
                    style={{
                        ...styles.content,
                        color: darkMode
                            ? "white"
                            : "#111827"
                    }}
                >

                    <h1
                        style={{
                            ...styles.heading,
                            color: darkMode ? "#ffffff" : "#111827"
                        }}
                    >
                        YouTube Analytics Dashboard
                    </h1>

                    <form onSubmit={handleSearch} style={styles.searchBox}>
                        <input
                            style={{
                                ...styles.input,
                                background: t.card,
                                border: `1px solid ${t.border}`,
                                color: t.text
                            }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Enter YouTube Video ID..."
                        />

                        <button
                            type="button"
                            onClick={() => changeSort("top")}
                            style={{
                                ...styles.button,
                                background:
                                    sortOrder === "top"
                                        ? "#16a34a"
                                        : "#64748b"
                            }}
                        >
                            Top Comments
                        </button>

                        <button
                            type="button"
                            onClick={() => changeSort("newest")}
                            style={{
                                ...styles.button,
                                background:
                                    sortOrder === "newest"
                                        ? "#16a34a"
                                        : "#64748b"
                            }}
                        >
                            Newest Comments
                        </button>

                        <button style={styles.button}>
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </form>

                    {result && (
                        <>
                            <div style={styles.cards}>

                                <div
                                    style={{
                                        ...styles.card,
                                        background: getCardColor("positive"),
                                        color: darkMode ? "#ffffff" : "#111827"
                                    }}
                                >
                                    <h3>Positive</h3>
                                    <h1>{result.stats.positive}</h1>
                                </div>

                                <div style={{
                                    ...styles.card,
                                    background: getCardColor("negative"),
                                    color: darkMode ? "#ffffff" : "#111827"
                                }}>
                                    <h3>Negative</h3>
                                    <h1>{result.stats.negative}</h1>
                                </div>

                                <div style={{
                                    ...styles.card,
                                    background: getCardColor("neutral"),
                                    color: darkMode ? "#ffffff" : "#111827"
                                }}>
                                    <h3>Neutral</h3>
                                    <h1>{result.stats.neutral}</h1>
                                </div>

                                <div style={{
                                    ...styles.card,
                                    background: getCardColor("posts"),
                                    color: darkMode ? "#ffffff" : "#111827"
                                }}>
                                    <h3>Total Posts</h3>
                                    <h1>{result.stats.totalPosts}</h1>
                                </div>

                                <div style={{
                                    ...styles.card,
                                    background: getCardColor("comments"),
                                    color: darkMode ? "#ffffff" : "#111827"
                                }}>
                                    <h3>Total Comments</h3>
                                    <h1>{result.stats.totalPosts}</h1>
                                </div>

                                <div style={{
                                    ...styles.card,
                                    background: getCardColor("likes"),
                                    color: darkMode ? "#ffffff" : "#111827"
                                }}>
                                    <h3>Total Likes</h3>
                                    <h1>{formatNumber(result.totalLikes)}</h1>
                                </div>

                                <div style={{
                                    ...styles.card,
                                    background: getCardColor("views"),
                                    color: darkMode ? "#ffffff" : "#111827"
                                }}>
                                    <h3>Total Views</h3>
                                    <h1>{formatNumber(result.totalViews)}</h1>
                                </div>

                                <div
                                    style={{
                                        ...styles.card,
                                        background: getCardColor("subscribers"),
                                        color: darkMode ? "#ffffff" : "#111827"
                                    }}
                                >
                                    <h3>Total Subscribers</h3>
                                    <h1>{formatNumber(result.totalSubscribers)}</h1>
                                </div>

                            </div>



                            <div
                                style={{
                                    ...styles.chartContainer,
                                    background: darkMode ? "#1e293b" : "#ffffff",
                                    color: darkMode ? "#ffffff" : "#111827"
                                }}
                            >
                                <h2>Sentiment Analysis</h2>

                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={120}
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            <Cell fill="#22c55e" />
                                            <Cell fill="#ef4444" />
                                            <Cell fill="#9ca3af" />
                                        </Pie>

                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />

                                        <Bar dataKey="comments" fill="#2563eb" />
                                        <Bar dataKey="likes" fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>

                            </div>




                            <div
                                style={{
                                    ...styles.chartContainer,
                                    background: darkMode ? "#1e293b" : "#ffffff",
                                    color: darkMode ? "#ffffff" : "#111827",
                                    padding: "20px",
                                    borderRadius: "15px",
                                    marginTop: "20px"
                                }}
                            >
                                <h2 style={{ marginBottom: "15px" }}>
                                    Analyzed Comments
                                </h2>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr",
                                        gap: "12px",
                                        marginTop: "15px"
                                    }}
                                >
                                    {result?.comments?.map((item, index) => (
                                        <div
                                            key={`${item.title}-${index}`}
                                            style={{
                                                padding: "15px",
                                                borderRadius: "12px",
                                                background: darkMode ? "#1e293b" : "#ffffff",
                                                border: darkMode
                                                    ? "1px solid #334155"
                                                    : "1px solid #e5e7eb",
                                                boxShadow: darkMode
                                                    ? "0 10px 20px rgba(0,0,0,0.3)"
                                                    : "0 6px 16px rgba(0,0,0,0.06)",
                                                transition: "all 0.2s ease",
                                                cursor: "pointer"
                                            }}

                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-3px)";
                                            }}

                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0px)";
                                            }}
                                        >

                                            {/* Top row */}
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

                                                {/* User Info */}
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <strong style={{ fontSize: "14px" }}>
                                                        {item.title}
                                                    </strong>

                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            opacity: 0.6
                                                        }}
                                                    >
                                                        {getTimeAgo(item.publishedAt)}
                                                    </span>
                                                </div>

                                                {/* Sentiment Badge */}
                                                <span
                                                    style={{
                                                        padding: "4px 10px",
                                                        borderRadius: "999px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        textTransform: "capitalize",
                                                        background:
                                                            item.sentiment === "positive"
                                                                ? "#dcfce7"
                                                                : item.sentiment === "negative"
                                                                    ? "#fee2e2"
                                                                    : "#fef3c7",
                                                        color:
                                                            item.sentiment === "positive"
                                                                ? "#166534"
                                                                : item.sentiment === "negative"
                                                                    ? "#991b1b"
                                                                    : "#92400e"
                                                    }}
                                                >
                                                    {item.sentiment}
                                                </span>
                                            </div>

                                            {/* Comment text */}
                                            <p
                                                style={{
                                                    marginTop: "10px",
                                                    color: darkMode ? "#cbd5e1" : "#374151",
                                                    fontSize: "14px",
                                                    lineHeight: "1.5"
                                                }}
                                            >
                                                {item.text}
                                            </p>

                                            {/* Score */}
                                            <div
                                                style={{
                                                    marginTop: "10px",
                                                    fontSize: "12px",
                                                    opacity: 0.8
                                                }}
                                            >
                                                🧠 Sentiment Score: <b>{item.score}</b>
                                            </div>

                                        </div>
                                    ))}
                                </div>

                            </div>

                        </>
                    )}

                </div>
            </div>
        </div>


    );
};

