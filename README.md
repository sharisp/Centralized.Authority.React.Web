# 🔐 Centralized Authority Web

A modern **React + TypeScript** web frontend for a centralized **permissions management microservice**, featuring a sleek UI inspired by [slash-admin](https://github.com/d3george/slash-admin) and powered by my robust backend API: [Centralized.Authority](https://github.com/sharisp/Centralized.Authority).

---

## ✨ Features

- 🧑‍💼 **User Management**: Create, update, assign roles
- 🔒 **Role Management**: Roles define access to menus and APIs
- 🔭 **Menu Management**: Dynamic menus based on permissions
- 🔌 **API Permission Control**: Secure API access control
- 🔁 **Multi-role Users**: One user can have multiple roles
- 🌐 **Role-Based Access Control (RBAC)**: 
  - Menus are associated with permissions, enabling fine-grained UI control (e.g., button visibility).
  - For pure API protection, permissions can be used independently of menus.


---

## 🖼️ UI & UX

- 🎨 Design inspired by: [slash-admin](https://github.com/d3george/slash-admin)
- �� Tailwind CSS for styling
- 📱 Responsive layout
- ⚙️ Dynamic menu rendering based on role permissions

---

## 🧰 Stack

| Layer       | Technology                                                        |
| ----------- | ----------------------------------------------------------------- |
| Frontend    | React + TypeScript                                             |
| State Mgmt  | React Hooks / Zustand                                      |
| HTTP Client | Axios                                                             |
| Backend API | [.NET Core API](https://github.com/sharisp/Centralized.Authority) |
| Auth        | JWT (access + refresh tokens)                                     |

---


---

## 🤭 Architecture

```text
User
 └→ Roles (many-to-many)
      ├→ Menus (many-to-many)
      └→ API Permissions (many-to-many)
Menus
 └→ Related API Permissions
```

---

## 📌 Project Structure

```
/src
  /pages         ← route-based pages (users, roles, etc.)
  /components    ← reusable UI
  /services      ← API clients (Axios-based)
  /store         ← state management
  /types         ← TypeScript types
  /utils         ← helpers
```

---

## 📖 Related Projects

- 🔧 Backend: [Centralized.Authority](https://github.com/sharisp/Centralized.Authority)
- 💻 Admin Template: [slash-admin](https://github.com/d3george/slash-admin)

---

## 🤝 Contributing

Pull requests welcome! Feel free to fork and submit a PR.

---

## 📄 License

MIT License

