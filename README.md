# Product & Order Management – FullStack

```
product_management/   Spring Boot 4 / Java 21 / PostgreSQL   -> http://localhost:8080
frontend/             React 19 + Redux Toolkit + Vite        -> http://localhost:5173
```

## Run

1. **Postgres** – create an empty database (tables are auto-created by Hibernate):
   `CREATE DATABASE product_management;`
   (credentials are in `product_management/src/main/resources/application.yaml`: postgres / root)
2. **Backend**
   ```
   cd product_management
   ./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
   ```
3. **Frontend** (new terminal)
   ```
   cd frontend
   npm install
   npm run dev
   ```
4. Open **http://localhost:5173**

Vite proxies `/v1/*` to `localhost:8080`, so the session cookie works and no CORS setup is needed.
The backend uses `ddl-auto: create-drop`, so the DB is wiped on every backend restart.

## Demo flow

1. Sign Up -> Account Type **Admin** -> Login -> **+ Add Product** (add a few, status ENABLE).
2. Logout. Sign Up as **Customer** -> Login.
3. Add products to cart -> change quantities -> Cart -> pick payment method -> Checkout -> Orders.
4. Back as admin: Catalog -> toggle ENABLE/DISABLE, Edit.