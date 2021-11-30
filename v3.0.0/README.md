# arch.homework

## Запуск третьего домашнего задания

### Установка ingress-nginx

```
minikube addons disable ingress
helm install nginx ingress-nginx/ingress-nginx -f nginx-ingress.yaml --atomic --create-namespace --namespace ingress-nginx
```

### Установка prometheus

```
helm install prom prometheus-community/kube-prometheus-stack -f prometheus.yaml --atomic --create-namespace --namespace monitoring
```

### Установка crud-service

```
helm install crud ./crud-service --atomic --create-namespace --namespace crud-ns
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


