# arch.homework

## Запуск пятого домашнего задания

### Установка postgresql

```
helm install pg ./postgresql --atomic --create-namespace --namespace arch
```

### Удаление postgresql
```
helm delete -n arch pg
kubectl delete pvc -n arch data-arch-postgresql-0
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
helm install --version "3.35.0" -n nginx-ingress -f ./nginx-ingress/nginx.yaml ingress-nginx ingress-nginx/ingress-nginx
kubectl apply -f ./nginx-ingress/routes.yaml
kubectl apply -f ./nginx-ingress/auth.yaml
```

## Результаты ДЗ

### Скриншот grafana dashboard

![Crud Dashboard](grafana-metrics.png "Crud dashboard")

### Dashboard JSON

[JSON-file](grafana-dashboard.json)

## Minikube

Получение внешнего ip машины minikube
```
minikube service -n <namespace> <service> --url
```

Установка ingress-nginx
```
minikube addons enable ingress
```


