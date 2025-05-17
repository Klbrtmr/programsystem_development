# Programrendszerek fejlesztése

Kolbert Zoltán Márió (R5JXRM)  
SZTE TTIK – Programterverező informatikus Msc  
2025. tavasz  
Programrendszerek fejlesztése gyakorlat  
# Specifikáció  
**Téma: F1 Rajongói Portál és Statisztika Rendszer**  
**Leírás:**  
Ez a webalapú rendszer a Forma-1 világának rajongóit célozza meg, ahol a felhasználók 
információkat, statisztikákat, versenyadatokat és híreket tekinthetnek meg. A rendszerben 
szerepelnek olyan funkciók, mint a versenyek, csapatok és pilóták adatainak kezelése, valamint 
statisztikai riportok és rangsorok megjelenítése. Emellett a felhasználók hozzászólhatnak, 
adhatnak véleményt, előrejelzést, amelyek növelik a közösségi élményt.   

**Szerepkörök:**  
**Admin:** A rendszer teljes körű felügyeletéért felelős, moderálja a tartalmakat és felügyeli a 
felhasználói tevékenységet. Jogot adhat, és elvehet a felhasználóktól.  
**Csapat menedzser:** Egy-egy Forma-1-es csapat képviselője, aki jogosult frissíteni a csapat és 
a hozzá tartozó pilóták adatait, valamint versenyeredményeket feltölteni.  
**Rajongó / regisztrált felhasználó:** Megtekintheti a versenyek, csapatok és pilóták adatait, részt 
vehet a kommentelési, értékelési folyamatokban, sőt, akár saját előrejelzéseket is leadhat a 
versenyek kimeneteléről.  
**Vendég:** Csak böngészési joggal rendelkezik, de nem tud hozzászólni, vagy módosítani 
adatokat.  

**Főbb funkciók:**  
**Versenyek kezelése:**  
CRUD műveletek, amelyekkel az admin vagy csapat menedzserek bevihetik, módosíthatják 
vagy törölhetik a versenyek adatait (pl. helyszín, dátum, versenyhossz, eredmények) 
**Csapatok és Pilóták adatainak kezelése:**  
CRUD műveletek a csapatok, pilóták profiljainak és statisztikáinak kezelésére (pl. győzelmek, 
pontszámok, rangsorolás). 
**Statisztikai riportok és ranglisták:**  
Statisztikák, például pilóták és csapatok rangsorolása, győzelmek, pole pozíciók, stb. 
**Felhasználói autentikáció és jogosultságkezelés:**  
Regisztráció, bejelentkezés, illetve a különböző szerepköröknek megfelelő jogosultságok 
biztosítása a rendszerben végrehajtható műveletekhez.  
**Keresési és szűrési lehetőségek:**  
Gyors keresés a versenyek, csapatok és pilóták között, valamint különféle szűrési opciók (pl. 
dátum, csapat, ország) a könnyebb navigáció érdekében.  
**Interaktív elemek:**  
Felhasználók előrejelzései, kommentek és értékelések a versenyekről, amelyek növelik a 
közösségi aktivitást. 

***Készült: 2025. 03. 22.*** 
