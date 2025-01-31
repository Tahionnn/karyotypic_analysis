# karyotypic_analysis
## Описание проекта
 Этот проект представляет собой веб-приложение для упрощение процесса кариотипического анализа. Приложение использует нейронную сеть [YOLOv10](https://docs.ultralytics.com/ru/models/yolov10/) для детектирования и классификации однохроматидных хромосом на загруженном пользователем изображении. Нейросеть обучена на публично доступном датасете, включающем пять тысяч аннотаций классов хромосом и две тысячи аннотаций отдельных хромосом:
 
 [J.-J. Tseng et al., "An open dataset of annotated metaphase cell images for chromosome identification", Sci. Data, vol. 10, no. 1, 2023.](https://www.researchgate.net/publication/368739646_An_Open_Dataset_of_Annotated_Metaphase_Cell_Images_for_Chromosome_Identification)

 Ссылки на ноутбуки Kaggle:
 1. [Обучение нейросети](https://www.kaggle.com/code/kirilllazutkin/yolov10-for-karyotype)
 2. [Оптимизация нейросети](https://www.kaggle.com/code/kirilllazutkin/optimize-yolo-for-karyotype)

 ## Установка и запуск проекта
 Перед установкой и запуском убедитесь, что у вас установлен [**Docker**](https://docs.docker.com/).

 Клонируйте репозиторий:
 ```bash
 git clone https://github.com/Tahionnn/karyotypic_analysis.git
 ```
 ### Ветка main
 Ветка **main** содержит версию проекта, развернутую с использованием [**Docker Compose**](https://docs.docker.com/compose/).

 Запуск проекта:
 
 1. Перейдите в корень проекта: 
  ```bash
 cd karyotypic_analysis
 ```
 2. Запустите docker-compose.yaml:
 ```bash
 docker-compose up
 ```
  ### Ветка Docker-Swarm
  Ветка **Docker-Swarm** содержит версию проекта, развернутую с использованием [**Docker Swarm**](https://docs.docker.com/engine/swarm/). Перед запуском проекта ознакомьтесь с документацией и активируйте **Swarm mode**.

  Запуск проекта:

  1. Перейдите в папку **frontend** и создайте директорию **nginx**
 ```bash
 cd karyotypic_analysis/frontend && mkdir nginx
 ```
 2. Создайте nginx.conf и default.conf
 3. Создайте и подпишите ssl-сертификаты. [Ссылка на официальную документацию Docker](https://docs.docker.com/engine/swarm/secrets/#intermediate-example-use-secrets-with-a-nginx-service)
 4. Выполните pull необходимых для работы проекта образов:
 ```bash
 docker pull noihat/karyotyp-ml:1 && docker pull noihat/karyotyp-user:1 && docker pull noihat/karyotyp-frontend:2
 ```
 5. Для корректной работы проекта требуется создаеть секреты. Используйте следующую команду:
  ```bash
 echo "YOUR SECRET" | docker secert create "SECRET NAME" -
 ```
 Создайте следующие секреты:

    - postgres_password (пароль от БД)
    - jwt_key (ключ шифрования JWT-токенов)
    - algorithm (алгоритм шифрования JWT-токенов. Например **HS256**)
    - token_expire (срок годности JWT-токенов)
    - site.crt
    - site.key 
 6. Для запуска перейдите в корень проекта и выполните следующую команду:
 ```bash
 docker stack deploy -c docker-compose.yaml karyotyp
 ```
 ## Лицензия
 Этот проект лицензирован под MIT License - смотрите LICENSE для подробностей.
 ## Контакты 
 Если у вас есть вопросы, вы можете связаться со мной:
 - Почта: kirill.lazutkin@inbox.ru
 - Telegram: https://t.me/Noihat