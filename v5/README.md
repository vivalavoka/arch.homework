# arch.homework

## Запуск пятого домашнего задания

### Запуск minikube

```
minikube start
minikube addons enable ingress
```

### Установка postgresql

```
helm install pg ./postgresql --atomic --create-namespace --namespace arch
```

### Установка profile-service

```
helm install profile ./profile-service --atomic --create-namespace --namespace arch
```

### Установка auth-service

```
helm install auth ./auth-service --atomic --create-namespace --namespace arch
```

### Настройка nginx-ingress

```
kubectl apply -f ./nginx-ingress/routes.yaml
```

## Результаты ДЗ

### Диаграмма последовательности

![Аутентификация](grafana-metrics.png "Процесс аутентификации")

### Команда для запуска тестов newman

```
newman run ./tests.postman_collection.json --env-var "baseUrl=arch.homework" --verbose
```

## Minikube

Получение внешнего ip машины minikube
```
minikube service -n <namespace> <service> --url
```

Установка ingress-nginx
```
minikube addons enable ingress
```


