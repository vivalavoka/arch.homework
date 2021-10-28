# arch.homework

## Запуск приложения node-app

```
kubectl apply -f node-app/manifest.yml
```

## Minikube

Получение внешнего ip машины minikube
```
minikube service -n otus-ns node-app-service --url
```

Установка ingress-nginx
```
minikube addons enable ingress
```


