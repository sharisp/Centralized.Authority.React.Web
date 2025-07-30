# 🔐 Centralized Authority Web

A modern **React + TypeScript** web frontend for admin management, including role, menu, permission, and user management. It features a clean UI inspired by [slash-admin](https://github.com/d3george/slash-admin) and is powered by my robust backend APIs:

* [Centralized.Authority](https://github.com/sharisp/Centralized.Authority) – handles permissions and RBAC
* [ListeningService](https://github.com/sharisp/ListeningService) – manages business data
* [FileService](https://github.com/sharisp/FileService) – supports file upload and download

---

## ✨ Key Features

* 🧑‍💼 **User Management**: Create, update users and assign roles
* 🔒 **Role Management**: Define access scopes via roles
* 🔭 **Menu Management**: Dynamically generated menus based on permissions
* 🔌 **API Access Control**: Secure endpoint protection
* 🔁 **Multi-role Support**: Users can have multiple roles
* 🌐 **Role-Based Access Control (RBAC)**:

  * Fine-grained UI control (e.g., button visibility) via permission-tagged menus
  * API-level access control, decoupled from the UI if needed

---

## 🖼️ UI & UX

* 🎨 Design inspired by [slash-admin](https://github.com/d3george/slash-admin)
* 🎯 Tailwind CSS for fast and consistent styling
* 📱 Fully responsive layout
* ⚙️ Dynamic menu rendering based on current user permissions

---

## 🧰 Tech Stack

| Layer        | Technology                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Frontend     | React + TypeScript                                                                             |
| State Mgmt   | React Hooks + Zustand                                                                          |
| HTTP Client  | Axios                                                                                          |
| Auth         | JWT (access + refresh tokens)                                                                  |
| Backend APIs | [.NET Core](https://github.com/sharisp/Centralized.Authority) + [Others](#📖-related-projects) |

---

## 🧩 Architecture

```text
User
 └→ Roles (many-to-many)
      ├→ Menus (many-to-many)
      └→ API Permissions (many-to-many)
Menus
 └→ Related API Permissions
```

---

## 📁 Project Structure

```
/src
  /pages       ← Route-based pages (e.g., users, roles)
  /components  ← Reusable UI components
  /services    ← Axios-based API clients
  /store       ← Global state management (Zustand)
  /types       ← TypeScript definitions
  /utils       ← Utility functions
```

---

## 📖 Related Projects

* 🔧 Backend APIs:

  * [Centralized.Authority](https://github.com/sharisp/Centralized.Authority)
  * [ListeningService](https://github.com/sharisp/ListeningService)
  * [FileService](https://github.com/sharisp/FileService)
* 💻 UI Template: [slash-admin](https://github.com/d3george/slash-admin)

---

## 🤝 Contributing

Pull requests are welcome. Feel free to fork this repo and submit improvements!

---

## 📄 License

MIT License
