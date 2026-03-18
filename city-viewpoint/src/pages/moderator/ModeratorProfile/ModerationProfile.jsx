import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const MOCK_REVIEWS = {
  new: [
    {
      id: 1,
      author: "User10",
      city: "Нижний Новгород",
      text: `Лучший отель в Нижнем Новгороде! Невероятный сервис, шикарные номера и бесплатный трансфер от вокзала. Только у нас — скидка 50% на все SPA-процедуры! Забронируйте прямо сейчас и получите подарок — бесплатный завтрак и экскурсию по городу. Не упустите шанс отдохнуть с комфортом и выгодой!`,
      date: "2026-01-25",
    },
    {
      id: 2,
      author: "User20",
      city: "Зарайск",
      text: `Этот город — полный отстой! Персонал в кафе хамит и не умеет готовить, а местные жители ведут себя как последние хамы и невежды. Никогда больше сюда не приеду и всем советую обходить это место стороной!`,
      date: "2026-01-26",
    },
  ],
  complaints: [
    {
      id: 3,
      author: "User30",
      city: "Нижний Новгород",
      text: `В городе запрещено использовать мобильные телефоны в общественных местах, а полиция регулярно штрафует за это без предупреждения. Кроме того, в городе якобы распространяется опасный вирус, о котором власти умалчивают. Не советую туда ехать — это небезопасно и неудобно для туристов`,
      complaintReason: "Дезинформация",
      date: "2026-01-24",
    },
  ],
  errors: [
    {
      id: 4,
      author: "User40",
      city: "Зарайск",
      text: "Отзыв с ошибками в данных или некорректным форматом",
      date: "2026-01-23",
    },
  ],
  blocked: [
    {
      id: 5,
      author: "User50",
      city: "Нижний Новгород",
      text: "Заблокированный отзыв из-за нарушения правил",
      date: "2026-01-20",
    },
  ],
};
function Modal({ message, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "white",
        padding: 30,
        borderRadius: 12,
        maxWidth: 400,
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}>
        <p style={{ fontSize: "1.3rem", marginBottom: 20 }}>{message}</p>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4b91d6",
            color: "white",
            border: "none",
            borderRadius: 30,
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  )
};
export default function ModerationProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");
  const [reviews, setReviews] = useState([]);
  const [expandedIds, setExpandedIds] = useState({});
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setReviews(MOCK_REVIEWS[activeTab]);
    setExpandedIds({});
  }, [activeTab]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = (id) => {
    showNotification(`Отзыв опубликован`, "success");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleBlock = (id) => {
    showNotification(`Отзыв заблокирован`, "error");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getPreviewText = (text, isExpanded) => {
    const limit = 150;
    if (isExpanded || text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      showNotification("Пожалуйста, введите email.", "error");
      return;
    }
    showNotification(`Временный пароль отправлен на ${inviteEmail}`, "success");
    setInviteEmail("");
    setShowInviteForm(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Raleway, sans-serif" }}>
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 24px",
            borderRadius: "12px",
            backgroundColor: notification.type === "success" ? "#73ce49" : "#ff6334",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {notification.message}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: 40,
            cursor: "pointer",
            fontSize: "1.4rem",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f44336")}
        >
          Выйти
        </button>

        <button
          onClick={() => setShowInviteForm((prev) => !prev)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4b91d6",
            color: "white",
            border: "none",
            borderRadius: 40,
            cursor: "pointer",
            fontSize: "1.4rem",
            marginLeft: 20,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2e5c8a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4b91d6")}
        >
          Пригласить модератора
        </button>
      </header>

      {showInviteForm && (
        <form
          onSubmit={handleInviteSubmit}
          style={{
            maxWidth: 400,
            margin: "0 auto 30px",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <input
            type="email"
            placeholder="Введите email модератора"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
            style={{
              padding: "12px 16px",
              fontSize: "1.1rem",
              borderRadius: 30,
              border: "2px solid #4b91d6",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4b91d6",
                color: "white",
                border: "none",
                borderRadius: 30,
                fontSize: "1.2rem",
                cursor: "pointer",
                flex: "1 1 auto",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2e5c8a")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4b91d6")}
            >
              Выслать пароль
            </button>
            <button
              type="button"
              onClick={() => setShowInviteForm(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: 30,
                fontSize: "1.2rem",
                cursor: "pointer",
                flex: "1 1 auto",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#aaa")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ccc")}
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 20,
          maxWidth: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
          border: "none",
          borderRadius: "30px",
          marginTop: "3rem",
        }}
      >
        {[
          { key: "complaints", label: "Жалобы" },
          { key: "new", label: "Новые" },
          { key: "errors", label: "Ошибки" },
          { key: "blocked", label: "Заблокированные" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "8px 14px",
              backgroundColor: key === activeTab ? "#4b91d6" : "white",
              color: key === activeTab ? "white" : "#333",
              border: "none",
              borderRadius: 40,
              cursor: "pointer",
              minWidth: 100,
              fontWeight: key === activeTab ? "600" : "400",
              boxShadow:
                key === activeTab ? "0 2px 6px rgba(30, 119, 208, 0.4)" : "none",
              transition: "background-color 0.3s, color 0.3s",
              fontSize: "1.4rem",
            }}
            onMouseEnter={(e) => {
              if (key !== activeTab) e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              if (key !== activeTab) e.currentTarget.style.backgroundColor = "white";
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <section
        style={{
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {reviews.length === 0 ? (
          <p style={{ textAlign: "center" }}>Нет отзывов для отображения.</p>
        ) : (
          reviews.map((review) => {
            const isExpanded = !!expandedIds[review.id];
            return (
              <div
                key={review.id}
                style={{
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    marginBottom: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "#222",
                  }}
                >
                  {review.city} --- {review.author} --- <small>{review.date}</small>
                </div>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: 16,
                    color: "#333",
                    cursor: review.text.length > 150 ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={() => {
                    if (review.text.length > 150) toggleExpand(review.id);
                  }}
                  title={
                    review.text.length > 150
                      ? isExpanded
                        ? "Свернуть отзыв"
                        : "Развернуть отзыв"
                      : undefined
                  }
                >
                  {getPreviewText(review.text, isExpanded) || <i>Текст отсутствует</i>}
                </p>
                {activeTab === "complaints" && review.complaintReason && (
                  <p
                    style={{
                      color: "#ff6334",
                      fontWeight: "bold",
                      marginTop: 10,
                      fontSize: "1.5rem",
                    }}
                  >
                    Причина жалобы: {review.complaintReason}
                  </p>
                )}
                {(activeTab === "new" || activeTab === "complaints") && (
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      gap: 12,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => handleApprove(review.id)}
                      style={{
                        padding: "10px 10px",
                        backgroundColor: "#73ce49",
                        color: "white",
                        border: "none",
                        borderRadius: 40,
                        cursor: "pointer",
                        fontSize: "1.4rem",
                        minWidth: 100,
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5aa835")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#73ce49")}
                    >
                      Опубликовать
                    </button>
                    <button
                      onClick={() => handleBlock(review.id)}
                      style={{
                        padding: "10px 10px",
                        backgroundColor: "#ff6334",
                        color: "white",
                        border: "none",
                        borderRadius: 40,
                        cursor: "pointer",
                        fontSize: "1.4rem",
                        minWidth: 100,
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e64520")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff6334")}
                    >
                      Заблокировать
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}