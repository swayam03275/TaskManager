import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ zIndex: 100 }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/dashboard">
          <span className="brand-icon" aria-hidden="true">⬡</span>
          <span className="brand-text">TaskFlow</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler-custom d-lg-none"
          onClick={() => setOpen((p) => !p)}
          aria-label="Toggle navigation"
        >
          <span className={`burger ${open ? "open" : ""}`}>
            <span /><span /><span />
          </span>
        </button>

        {/* Nav items */}
        <div className={`navbar-collapse-custom ${open ? "is-open" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-lg-center gap-1">
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/projects" onClick={() => setOpen(false)}>
                    Projects
                  </NavLink>
                </li>
                {user.role === "admin" && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/team" onClick={() => setOpen(false)}>
                        Team
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link admin-link" to="/admin/users" onClick={() => setOpen(false)}>
                        Admin
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          {/* Right side */}
          <div className="navbar-actions d-flex align-items-center gap-3">
            {user ? (
              <>
                <div className="user-chip">
                  <span className="user-avatar">{user.name?.[0]?.toUpperCase()}</span>
                  <span className="user-name">Hi, {user.name}</span>
                  <span className="role-badge">{user.role}</span>
                </div>
                <button className="btn-logout" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn-ghost" to="/login">Login</Link>
                <Link className="btn btn-accent" to="/signup">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          padding: 0 0;
          border-bottom: 1px solid var(--tm-border);
        }

        .navbar .container {
          display: flex;
          align-items: center;
          height: 62px;
          gap: 12px;
        }

        /* Brand */
        .brand-icon {
          font-size: 1.4rem;
          line-height: 1;
          background: linear-gradient(135deg, var(--tm-accent), var(--tm-warm));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 6px var(--glow-accent));
        }

        .brand-text {
          font-family: 'Syne', serif;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, var(--tm-accent) 0%, var(--tm-warm) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Mobile toggle */
        .navbar-toggler-custom {
          background: none;
          border: 1px solid var(--tm-border);
          border-radius: 10px;
          padding: 8px 10px;
          cursor: pointer;
          margin-left: auto;
          display: flex;
          align-items: center;
        }

        .burger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 20px;
        }

        .burger span {
          display: block;
          height: 2px;
          background: var(--tm-ink);
          border-radius: 2px;
          transition: all 0.25s ease;
          transform-origin: center;
        }

        .burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* Collapse */
        .navbar-collapse-custom {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 8px;
        }

        @media (max-width: 991px) {
          .navbar-collapse-custom {
            display: none;
            position: absolute;
            top: 63px;
            left: 0; right: 0;
            flex-direction: column;
            align-items: flex-start;
            background: var(--tm-card);
            border-bottom: 1px solid var(--tm-border);
            padding: 16px 20px 20px;
            gap: 4px;
            animation: fadeUp 0.2s ease both;
            backdrop-filter: blur(20px);
          }

          .navbar-collapse-custom.is-open {
            display: flex;
          }

          .navbar-collapse-custom ul {
            flex-direction: column;
            width: 100%;
          }

          .navbar-actions {
            width: 100%;
            padding-top: 12px;
            border-top: 1px solid var(--tm-border);
            margin-top: 8px;
          }
        }

        /* Nav links */
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--tm-muted) !important;
          padding: 6px 12px !important;
          border-radius: 10px;
          transition: all 0.2s ease;
          position: relative;
          text-decoration: none;
        }

        .nav-link:hover {
          color: var(--tm-ink) !important;
          background: var(--tm-border);
        }

        .nav-link.active {
          color: var(--tm-accent) !important;
          background: rgba(200, 75, 26, 0.08);
          font-weight: 600;
        }

        [data-theme="dark"] .nav-link.active {
          background: rgba(255, 107, 53, 0.1);
        }

        .admin-link.active {
          color: var(--tm-warm) !important;
          background: rgba(232, 160, 32, 0.1);
        }

        /* User chip */
        .user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 4px;
          background: var(--tm-bg);
          border: 1px solid var(--tm-border);
          border-radius: 999px;
        }

        .user-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--tm-accent), var(--tm-warm));
          color: #fff;
          font-family: 'Syne', serif;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--tm-ink);
          font-family: 'DM Sans', sans-serif;
        }

        .role-badge {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(200, 75, 26, 0.12);
          color: var(--tm-accent);
          font-family: 'DM Sans', sans-serif;
        }

        [data-theme="dark"] .role-badge {
          background: rgba(255, 107, 53, 0.15);
        }

        /* Logout */
        .btn-logout {
          background: none;
          border: 1px solid var(--tm-border);
          color: var(--tm-muted);
          border-radius: 10px;
          padding: 6px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          border-color: var(--tm-danger);
          color: var(--tm-danger);
          background: rgba(209, 43, 43, 0.06);
        }

        /* Ghost btn */
        .btn-ghost {
          background: none;
          border: 1px solid var(--tm-border);
          color: var(--tm-ink);
          border-radius: 10px;
          padding: 7px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-ghost:hover {
          border-color: var(--tm-accent);
          color: var(--tm-accent);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;