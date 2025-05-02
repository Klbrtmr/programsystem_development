# Docker beüzemelése

Szükséges parancsok a Docker-MongoDB beüzemeléséhez

## Dockerfile tartalma

```bash
FROM mongo

EXPOSE 27017
```

## Parancsok listája

Dockerfile build-elése:
```bash
docker build -t my_mongo_image .
```

Docker container futtatása:
```bash
docker run -p 5000:27017 -it --name my_mongo_container -d my_mongo_image
```

Container futásának ellenőrzése:
```bash
docker ps
```

Belépés a Containerbe:
```bash
docker exec -it my_mongo_container /bin/bash
```

Container törlése (ha szükséges, akkor -f kapcsolóval):
```bash
docker rm my_mongo_container
```

Image törlése:
```bash
docker rmi my_mongo_image
```

## További tippek

A Docker container futtatásának parancsában a -p kapcsoló után 2 darab portszámot adunk meg, amiket kettősponttal (:) választunk el egymástól.
>
>5000:27017
>
A második portszám az, amelyiken a Dockerben fut az adatbázis, erre hivatkozunk a Dockerfile ```EXPOSE 27017``` sorával.
Az első portszám pedig az, amelyiken keresztül elérjük az adatbázist azon a gépen, amelyiken fut a Docker, amely most az 5000-es számú port, ezt kell beírni az adatbázishoz való csatlakozás során az URL-be.