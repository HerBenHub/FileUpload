# Képtár - Image Upload & Gallery

Egyszerű és gyors képfeltöltő és galériakezelő alkalmazás.

## Funkciók

- Képfeltöltés (max 5 MB)
- Galéria nézet
- Letöltés
- Törlés

## API Végpontok

| Végpont | Metódus | Leírás |
|---------|---------|--------|
| `/` | GET | HTML oldal kiszolgálása |
| `/upload` | POST | Képfájl feltöltése |
| `/files` | GET | Feltöltött képek listája |
| `/uploads/:filename` | GET | Kép letöltése |
| `/files/:filename` | DELETE | Kép törlése |

## Futtatás

### 1. Függőségek telepítése

```bash
npm install
```

### 2. Szerver indítása

```bash
node server.js
```

A szerver a `http://localhost:3000` címen fog futni.

## Technológia

- **Backend**: Node.js, Express
- **Feltöltés**: Multer
- **Frontend**: HTML, CSS, JavaScript (Fetch API)

## Beállítások

- **Max fájlméret**: 5 MB
- **Port**: 3000
- **Feltöltési könyvtár**: `./uploads`
