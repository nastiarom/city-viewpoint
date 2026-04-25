import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import './ModeratorProfile.css'
import { fetchUserProfile, logout } from '/src/store/authSlice';


export default function ModerationProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("new");
  const [dataList, setDataList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [notification, setNotification] = useState(null);

  const [fullReviews, setFullReviews] = useState({});
  const [expandedIds, setExpandedIds] = useState({});
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const { user, loading } = useSelector((state) => state.auth);
  const userRole = user?.role;
  const SERVER_URL = "http://localhost:8081/static/";

  const tabToStatus = {
    new: "undefined",
    errors: "moderation_error",
    blocked: "blocked",
    appeals: "blocked_reported",
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    setLoadingData(true);
    const token = localStorage.getItem('token');
    let url = "";

    try {
      if (activeTab === "complaints") {
        url = "http://localhost:8083/complains/review";
      } else {
        const status = tabToStatus[activeTab];
        url = `http://localhost:8081/review/status?status=${status}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("Нет прав доступа");
        throw new Error("Ошибка при получении данных");
      }

      const data = await response.json();
      setDataList(Array.isArray(data) ? data : []);
    } catch (err) {
      showNotification(err.message, "error");
      setDataList([]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
    setExpandedIds({});
  }, [activeTab]);

  const toggleExpand = async (reviewId) => {
    if (expandedIds[reviewId]) {
      setExpandedIds(prev => ({ ...prev, [reviewId]: false }));
      return;
    }
    if (!fullReviews[reviewId]) {
      try {
        const response = await fetch(`http://localhost:8081/review/get?review_id=${reviewId}`);
        if (response.ok) {
          const fullData = await response.json();
          setFullReviews(prev => ({ ...prev, [reviewId]: fullData }));
        }
      } catch (err) {
        showNotification("Не удалось загрузить данные отзыва", "error");
        return;
      }
    }

    setExpandedIds(prev => ({ ...prev, [reviewId]: true }));
  };
  const handleUpdateStatus = async (reviewId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:8081/review/status/update?review_id=${reviewId}&status=${newStatus}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Не удалось обновить статус");

      showNotification(`Успешно: ${newStatus}`, "success");
      setDataList(prev => prev.filter(item => (item.id || item.review_id) !== reviewId));
    } catch (err) {
      showNotification(err.message, "error");
    }
  };
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8080/moderator/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: "moderator",
          nickname: "",
          password: "",
        }),
      });
      if (!response.ok) throw new Error("Ошибка при создании модератора");
      showNotification(`Модератор ${inviteEmail} добавлен!`, "success");
      setInviteEmail("");
      setShowInviteForm(false);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      showNotification("Новые пароли не совпадают", "error");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append("request", JSON.stringify({ password: passwords.newPass }));
      const response = await fetch("http://localhost:8080/user/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Не удалось обновить пароль");
      showNotification("Пароль изменен!", "success");
      setShowPasswordForm(false);
      setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="loading-screen">Загрузка профиля...</div>;

  return (
    <div className="moderator-container">
      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}

      <header className="mod-header">
        <button onClick={handleLogout} className="btn-logout">Выйти</button>
        {userRole === "admin" && (
          <button onClick={() => setShowInviteForm(!showInviteForm)} className="btn-invite-toggle">
            Пригласить модератора
          </button>
        )}
        <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="btn-pass-toggle">
          Сменить пароль
        </button>
      </header>
      {userRole === "admin" && showInviteForm && (
        <form onSubmit={handleInviteSubmit} className="invite-form">
          <input
            type="email"
            placeholder="Введите email модератора"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
            className="invite-input"
          />
          <div className="form-buttons">
            <button type="submit" className="btn-submit">Выслать пароль</button>
            <button type="button" onClick={() => setShowInviteForm(false)} className="btn-cancel">Отмена</button>
          </div>
        </form>
      )}
      {showPasswordForm && (
        <form onSubmit={handlePasswordSubmit} className="invite-form">
          <h3>Смена пароля</h3>
          <input type="password" name="oldPass" placeholder="Старый пароль" value={passwords.oldPass} onChange={(e) => setPasswords({ ...passwords, oldPass: e.target.value })} required className="invite-input" />
          <input type="password" name="newPass" placeholder="Новый пароль" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} required className="invite-input" />
          <input type="password" name="confirmPass" placeholder="Повторите пароль" value={passwords.confirmPass} onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })} required className="invite-input" />
          <div className="form-buttons">
            <button type="submit" className="btn-submit">Сохранить</button>
            <button type="button" onClick={() => setShowPasswordForm(false)} className="btn-cancel">Отмена</button>
          </div>
        </form>
      )}

      <nav className="mod-nav">
        {[
          { key: "new", label: "Новые" },
          { key: "complaints", label: "Жалобы" },
          { key: "appeals", label: "Апелляции" },
          { key: "errors", label: "Ошибки AI" },
          { key: "blocked", label: "Заблокированные" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`tab-button ${activeTab === key ? "active" : ""}`}>
            {label}
          </button>
        ))}
      </nav>

      <section className="reviews-section">
        {loadingData ? (
          <p className="no-reviews">Загрузка данных...</p>
        ) : dataList.length === 0 ? (
          <p className="no-reviews">Нет данных для отображения.</p>
        ) : (
          dataList.map((item) => {
            const rId = item.id || item.review_id;
            const isExpanded = !!expandedIds[rId];
            const fullData = fullReviews[rId];

            return (
              <div key={item.id || item.review_id} className="review-card">
                <div className="review-header-mini" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {item.main_photo && (
                    <img
                      src={`${SERVER_URL}${item.main_photo}`}
                      alt="city"
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="review-info">
                    <strong>{item.city || "Отзыв"}</strong> (ID: {rId}) | Автор ID: {item.author_id || item.user_id}
                    <br />
                    <small>Оценка: {item.review_mark?.toFixed(1) || '—'} | Дата: {new Date(item.creation_date || item.created_at).toLocaleDateString()}</small>
                  </div>
                </div>

                <div className="review-content-box" style={{ marginTop: '15px' }}>
                  {!isExpanded ? (
                    <p className="review-text">
                      {activeTab === "complaints" ? `Жалоба: ${item.reason}` : (item.text_start + "...")}
                    </p>
                  ) : (
                    <div className="full-review-content" style={{ padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                      {activeTab === "complaints" && (
                        <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ffcccc', backgroundColor: '#fff5f5', borderRadius: '5px' }}>
                          <strong style={{ color: '#d32f2f' }}>ПРИЧИНА ЖАЛОБЫ: </strong>
                          <span>{item.reason}</span>
                        </div>
                      )}
                      {fullData?.main_photo && (
                        <img
                          src={`${SERVER_URL}${fullData.main_photo}`}
                          alt="Main"
                          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                        />
                      )}
                      {fullData?.sections?.map((s, idx) => (
                        (s.text || s.photos?.length > 0) && (
                          <div key={idx} style={{ marginBottom: '12px' }}>
                            <span style={{ fontWeight: 'bold', color: '#555', display: 'block' }}>{s.title}</span>
                            <p style={{ margin: '5px 0' }}>{s.text || "—"}</p>
                            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto' }}>
                              {s.photos?.map((p, pi) => (
                                <img key={pi} src={`${SERVER_URL}${p}`} style={{ height: '80px', borderRadius: '4px' }} />
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                  <button className="btn-more" onClick={() => toggleExpand(rId)} style={{ background: 'none', border: 'none', color: '#44a7e9', cursor: 'pointer', padding: 0, marginTop: '5px' }}>
                    {isExpanded ? "Свернуть" : "Посмотреть отзыв полностью"}
                  </button>
                </div>

                <div className="action-buttons" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  {activeTab === "blocked" ? (
                    <button
                      onClick={() => handleUpdateStatus(rId, "published")}
                      className="btn-approve"
                    >
                      Разблокировать
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(rId, "published")}
                      className="btn-approve"
                    >
                      Опубликовать
                    </button>
                  )}
                  {activeTab !== "blocked" && (
                    <button
                      onClick={() => handleUpdateStatus(rId, "blocked")}
                      className="btn-block"
                    >
                      Заблокировать
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
