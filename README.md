## Yeu cau He thong (Prerequisites)

De chay duoc du an nay, may tinh cua ban can cai dat:

* Docker & Docker Compose (de chay ha tang PostgreSQL, Redis, Mosquitto).
* Node.js & npm (de chay Frontend).
* Java Development Kit (JDK) ban 17 hoac 21 (de chay Backend Spring Boot).
* Maven.

---

## Cai dat va Khoi chay

### Buoc 1: Clone du an

git clone <URL_CUA_REPOSITORY>
cd smart-workstation

### Buoc 2: Chay Ha tang (Co so du lieu & MQTT Broker)

Su dung Docker de khoi dong nhanh cac dich vu can thiet:

docker-compose up -d

(Luu y: Lenh nay se tu dong tai cac images va khoi tao cac dich vu ngam).

### Buoc 3: Khoi chay Backend (Spring Boot)

Mo mot terminal moi, chuyen huong vao thu muc Backend va chay ung dung:

cd backend
./mvnw spring-boot:run

### Buoc 4: Khoi chay Frontend (React)

Mo mot terminal moi khac, chuyen huong vao thu muc Frontend:

cd frontend
npm install
npm run dev

Sau khi qua trinh bien dich hoan tat, mo trinh duyet web va truy cap vao duong dan ma Vite cung cap (thuong la http://localhost:5173).

---

## Cau truc Thu muc

smart-workstation/
|-- .git/
|-- .gitignore
|-- docker-compose.yml
|-- mosquitto/
|   `-- config/
|       `-- mosquitto.conf
|-- backend/
|   |-- src/
|   `-- pom.xml
`-- frontend/
    |-- src/
    |   |-- components/
    |   `-- styles/
    |-- package.json
    `-- tailwind.config.js

---





